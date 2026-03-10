/**
 * Night List Booking Engine
 *
 * Handles table locking, booking creation, cancellations, and availability.
 * All critical paths use database-level functions to prevent race conditions.
 *
 * Flow:
 *   1. lockTable()      — reserves the table for 10 min while guest completes checkout
 *   2. createBooking()  — atomic insert with double-book prevention
 *   3. attachPayment()  — links Stripe PaymentIntent to booking
 *   4. confirmBooking() — marks booking confirmed after payment succeeds
 */

import { supabase } from "./supabase";
import type {
  VenueTable,
  VenueTableWithAvailability,
  Booking,
  BookingStatus,
} from "./database.types";

// ── Table Availability ──────────────────────────────────────────────────────

/**
 * Fetch all tables for a venue on a given date with live availability status.
 * Merges booking and lock data into a single availability flag per table.
 */
export async function getTablesWithAvailability(
  venueId: string,
  eventDate: string
): Promise<VenueTableWithAvailability[]> {
  const [tablesResult, bookingsResult, locksResult] = await Promise.all([
    supabase
      .from("venue_tables")
      .select("*")
      .eq("venue_id", venueId)
      .eq("is_active", true)
      .order("sort_order"),

    supabase
      .from("bookings")
      .select("table_id, status")
      .eq("venue_id", venueId)
      .eq("event_date", eventDate)
      .not("status", "in", '("cancelled","no_show")'),

    supabase
      .from("table_locks")
      .select("table_id, locked_until")
      .gt("locked_until", new Date().toISOString()),
  ]);

  if (tablesResult.error) throw tablesResult.error;

  const bookedTableIds = new Set(
    (bookingsResult.data ?? []).map((b) => b.table_id)
  );
  const lockMap = new Map(
    (locksResult.data ?? []).map((l) => [l.table_id, l.locked_until])
  );

  return (tablesResult.data ?? []).map((table) => ({
    ...table,
    is_available: !table.is_fixture && !bookedTableIds.has(table.id),
    is_locked: lockMap.has(table.id),
    locked_until: lockMap.get(table.id),
  }));
}

// ── Table Locking ───────────────────────────────────────────────────────────

export interface LockResult {
  success: boolean;
  error?: "table_already_booked" | "table_locked_by_another_user" | "unauthorized" | string;
  lockId?: string;
  lockedUntil?: string;
}

/**
 * Acquire a 10-minute exclusive lock on a table before checkout.
 * Idempotent — re-calling for the same user extends the existing lock.
 */
export async function lockTable(
  tableId: string,
  eventDate: string,
  lockMinutes = 10
): Promise<LockResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "unauthorized" };

  const { data, error } = await supabase.rpc("lock_table", {
    p_table_id: tableId,
    p_event_date: eventDate,
    p_user_id: user.id,
    p_lock_minutes: lockMinutes,
  });

  if (error) return { success: false, error: error.message };

  const result = data as { success: boolean; error?: string; lock_id?: string; locked_until?: string };
  return {
    success: result.success,
    error: result.error,
    lockId: result.lock_id,
    lockedUntil: result.locked_until,
  };
}

// ── Booking Creation ────────────────────────────────────────────────────────

export interface CreateBookingInput {
  tableId: string;
  venueId: string;
  eventDate: string;
  partySize: number;
  promoterSlug?: string;
  specialRequests?: string;
}

export interface CreateBookingResult {
  success: boolean;
  error?: string;
  bookingId?: string;
  confirmationCode?: string;
  minimumSpend?: number;
}

/**
 * Atomically creates a booking.
 * The database function handles lock acquisition, double-book prevention,
 * promoter attribution, and commission record creation in a single transaction.
 */
export async function createBooking(
  input: CreateBookingInput
): Promise<CreateBookingResult> {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { success: false, error: "unauthorized" };

  const { data, error } = await supabase.rpc("create_booking", {
    p_table_id: input.tableId,
    p_venue_id: input.venueId,
    p_guest_id: user.id,
    p_event_date: input.eventDate,
    p_party_size: input.partySize,
    p_promoter_slug: input.promoterSlug ?? null,
    p_special_requests: input.specialRequests ?? null,
  });

  if (error) return { success: false, error: error.message };

  const result = data as CreateBookingResult & { booking_id?: string; confirmation_code?: string; minimum_spend?: number };
  return {
    success: result.success,
    error: result.error,
    bookingId: result.booking_id,
    confirmationCode: result.confirmation_code,
    minimumSpend: result.minimum_spend,
  };
}

// ── Payment Attachment ──────────────────────────────────────────────────────

/**
 * Link a Stripe PaymentIntent to a booking after Stripe confirms the intent.
 * Called from the checkout flow after Stripe.confirmPayment() succeeds.
 */
export async function attachPaymentIntent(
  bookingId: string,
  paymentIntentId: string
): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .update({
      stripe_payment_intent_id: paymentIntentId,
      payment_status: "deposit_held",
      status: "confirmed",
    })
    .eq("id", bookingId)
    .eq("guest_id", (await supabase.auth.getUser()).data.user?.id ?? "");

  if (error) throw error;
}

// ── Booking Status Transitions ──────────────────────────────────────────────

const VALID_TRANSITIONS: Partial<Record<BookingStatus, BookingStatus[]>> = {
  pending:    ["confirmed", "cancelled"],
  confirmed:  ["checked_in", "cancelled", "no_show"],
  checked_in: ["completed"],
  completed:  [],
  cancelled:  [],
  no_show:    [],
};

export async function transitionBooking(
  bookingId: string,
  toStatus: BookingStatus,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  // Fetch current status
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("status, guest_id, venue_id")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) return { success: false, error: "booking_not_found" };

  const allowed = VALID_TRANSITIONS[booking.status as BookingStatus] ?? [];
  if (!allowed.includes(toStatus)) {
    return {
      success: false,
      error: `Cannot transition from ${booking.status} to ${toStatus}`,
    };
  }

  const update: Partial<Booking> = { status: toStatus };
  if (toStatus === "cancelled") {
    update.cancelled_at = new Date().toISOString();
    if (reason) update.cancellation_reason = reason;
  }
  if (toStatus === "checked_in") {
    update.checked_in_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from("bookings")
    .update(update)
    .eq("id", bookingId);

  if (error) return { success: false, error: error.message };
  return { success: true };
}

// ── Guest Cancellation ──────────────────────────────────────────────────────

/**
 * Guest-initiated cancellation. Enforces the venue's cancellation window.
 * The refund is initiated via Stripe in the webhook handler.
 */
export async function cancelBooking(
  bookingId: string,
  reason?: string
): Promise<{ success: boolean; error?: string; refundEligible: boolean }> {
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select(`
      *,
      venue:venues(cancellation_hrs, no_show_fee_pct)
    `)
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { success: false, error: "booking_not_found", refundEligible: false };
  }

  if (!["pending", "confirmed"].includes(booking.status)) {
    return { success: false, error: "booking_cannot_be_cancelled", refundEligible: false };
  }

  // Check cancellation window
  const eventDateTime = new Date(booking.event_date);
  const hoursUntilEvent = (eventDateTime.getTime() - Date.now()) / (1000 * 60 * 60);
  const venue = booking.venue as { cancellation_hrs: number; no_show_fee_pct: number } | null;
  const cancellationWindow = venue?.cancellation_hrs ?? 24;
  const refundEligible = hoursUntilEvent >= cancellationWindow;

  const { error } = await supabase
    .from("bookings")
    .update({
      status: "cancelled",
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason ?? "Guest cancelled",
    })
    .eq("id", bookingId)
    .eq("guest_id", (await supabase.auth.getUser()).data.user?.id ?? "");

  if (error) return { success: false, error: error.message, refundEligible: false };
  return { success: true, refundEligible };
}

// ── Fetch Bookings ──────────────────────────────────────────────────────────

export async function getGuestBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select(`
      *,
      venue:venues(id, name, accent_color, address),
      table:venue_tables(id, label, type)
    `)
    .order("event_date", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getVenueBookings(venueId: string, eventDate?: string) {
  let query = supabase
    .from("bookings")
    .select(`
      *,
      table:venue_tables(id, label, type),
      guest:profiles(id, full_name, phone),
      promoter:promoters(id, name, slug)
    `)
    .eq("venue_id", venueId)
    .order("event_date", { ascending: false });

  if (eventDate) {
    query = query.eq("event_date", eventDate);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}
