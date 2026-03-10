// Auto-generated from Supabase schema — run `supabase gen types typescript` to regenerate

export type UserRole = "guest" | "promoter" | "owner" | "admin";
export type TableType = "vip" | "premium" | "bar" | "booth";
export type BookingStatus = "pending" | "confirmed" | "checked_in" | "completed" | "cancelled" | "no_show";
export type PaymentStatus = "unpaid" | "deposit_held" | "paid" | "refunded" | "partially_refunded" | "failed";
export type PromoterStatus = "active" | "inactive" | "suspended";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string | null;
          phone: string | null;
          avatar_url: string | null;
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["profiles"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      venues: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          slug: string;
          area: string;
          vibe: string | null;
          description: string | null;
          address: string | null;
          phone: string | null;
          website: string | null;
          instagram: string | null;
          cover_image_url: string | null;
          accent_color: string;
          min_spend: number;
          open_until: string | null;
          tags: string[];
          venue_types: string[];
          promo_text: string | null;
          is_published: boolean;
          stripe_account_id: string | null;
          max_party_size: number | null;
          min_advance_hrs: number | null;
          cancellation_hrs: number | null;
          no_show_fee_pct: number | null;
          dress_code_enforced: boolean | null;
          age_verification: boolean | null;
          guest_list_only: boolean | null;
          operating_hours: OperatingHour[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["venues"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["venues"]["Insert"]>;
      };
      venue_tables: {
        Row: {
          id: string;
          venue_id: string;
          label: string;
          type: TableType;
          price: number;
          capacity: number;
          min_bottles: number;
          dress_code: string | null;
          arrival_deadline: string | null;
          promo_text: string | null;
          is_active: boolean;
          layout_x: number;
          layout_y: number;
          layout_width: number;
          layout_height: number;
          is_fixture: boolean;
          fixture_label: string | null;
          sort_order: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["venue_tables"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["venue_tables"]["Insert"]>;
      };
      events: {
        Row: {
          id: string;
          venue_id: string;
          name: string;
          description: string | null;
          event_date: string;
          doors_open: string | null;
          doors_close: string | null;
          cover_charge: number | null;
          is_published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["events"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["events"]["Insert"]>;
      };
      promoters: {
        Row: {
          id: string;
          venue_id: string;
          profile_id: string | null;
          name: string;
          email: string;
          phone: string | null;
          slug: string;
          commission_rate: number;
          status: PromoterStatus;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["promoters"]["Row"], "id" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["promoters"]["Insert"]>;
      };
      table_locks: {
        Row: {
          id: string;
          table_id: string;
          event_date: string;
          locked_by: string | null;
          session_token: string | null;
          locked_until: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["table_locks"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["table_locks"]["Insert"]>;
      };
      bookings: {
        Row: {
          id: string;
          venue_id: string;
          table_id: string;
          guest_id: string;
          promoter_id: string | null;
          event_id: string | null;
          confirmation_code: string;
          event_date: string;
          party_size: number;
          special_requests: string | null;
          minimum_spend: number;
          deposit_amount: number;
          status: BookingStatus;
          payment_status: PaymentStatus;
          stripe_payment_intent_id: string | null;
          stripe_charge_id: string | null;
          checked_in_at: string | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["bookings"]["Row"], "id" | "confirmation_code" | "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["bookings"]["Insert"]>;
      };
      commissions: {
        Row: {
          id: string;
          booking_id: string;
          promoter_id: string;
          venue_id: string;
          rate: number;
          gross_amount: number;
          commission_amount: number;
          is_paid: boolean;
          paid_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["commissions"]["Row"], "id" | "created_at">;
        Update: Partial<Database["public"]["Tables"]["commissions"]["Insert"]>;
      };
    };
    Functions: {
      lock_table: {
        Args: {
          p_table_id: string;
          p_event_date: string;
          p_user_id: string;
          p_session_token?: string;
          p_lock_minutes?: number;
        };
        Returns: { success: boolean; error?: string; lock_id?: string; locked_until?: string };
      };
      create_booking: {
        Args: {
          p_table_id: string;
          p_venue_id: string;
          p_guest_id: string;
          p_event_date: string;
          p_party_size: number;
          p_promoter_slug?: string;
          p_special_requests?: string;
        };
        Returns: {
          success: boolean;
          error?: string;
          booking_id?: string;
          confirmation_code?: string;
          minimum_spend?: number;
          status?: BookingStatus;
        };
      };
      cleanup_expired_locks: {
        Args: Record<never, never>;
        Returns: number;
      };
    };
    Enums: {
      user_role: UserRole;
      table_type: TableType;
      booking_status: BookingStatus;
      payment_status: PaymentStatus;
      promoter_status: PromoterStatus;
    };
  };
}

// ── Convenience row types ──────────────────────────────────────

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Venue = Database["public"]["Tables"]["venues"]["Row"];
export type VenueTable = Database["public"]["Tables"]["venue_tables"]["Row"];
export type Event = Database["public"]["Tables"]["events"]["Row"];
export type Promoter = Database["public"]["Tables"]["promoters"]["Row"];
export type TableLock = Database["public"]["Tables"]["table_locks"]["Row"];
export type Booking = Database["public"]["Tables"]["bookings"]["Row"];
export type Commission = Database["public"]["Tables"]["commissions"]["Row"];

// ── Extended types with joins ──────────────────────────────────

export type BookingWithDetails = Booking & {
  venue: Pick<Venue, "id" | "name" | "accent_color">;
  table: Pick<VenueTable, "id" | "label" | "type">;
  guest: Pick<Profile, "id" | "full_name" | "phone">;
  promoter: Pick<Promoter, "id" | "name" | "slug"> | null;
};

export type VenueTableWithAvailability = VenueTable & {
  is_available: boolean;   // computed — no active booking on target date
  is_locked: boolean;      // computed — active lock exists
  locked_until?: string;   // when lock expires
};

// ── Supporting types ───────────────────────────────────────────

export interface OperatingHour {
  day: string;
  open: string;
  close: string;
  closed: boolean;
}
