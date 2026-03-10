import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { getTablesWithAvailability } from "@/lib/booking-engine";
import type { VenueTableWithAvailability } from "@/lib/database.types";

interface UseTableAvailabilityReturn {
  tables: VenueTableWithAvailability[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Provides live table availability for a venue on a given date.
 *
 * Subscribes to both the bookings and table_locks tables via Supabase Realtime.
 * When any booking or lock changes for this venue, availability is re-fetched.
 *
 * This prevents guests from seeing stale availability and prevents double-bookings
 * at the UI level (the database prevents them at the data level regardless).
 */
export function useTableAvailability(
  venueId: string | null,
  eventDate: string | null
): UseTableAvailabilityReturn {
  const [tables, setTables] = useState<VenueTableWithAvailability[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAvailability = useCallback(async () => {
    if (!venueId || !eventDate) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getTablesWithAvailability(venueId, eventDate);
      setTables(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tables");
    } finally {
      setLoading(false);
    }
  }, [venueId, eventDate]);

  useEffect(() => {
    fetchAvailability();
  }, [fetchAvailability]);

  useEffect(() => {
    if (!venueId || !eventDate) return;

    // Subscribe to booking changes for this venue/date
    const bookingChannel = supabase
      .channel(`bookings:${venueId}:${eventDate}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
          filter: `venue_id=eq.${venueId}`,
        },
        () => fetchAvailability()
      )
      .subscribe();

    // Subscribe to lock changes (table selected by another user)
    const lockChannel = supabase
      .channel(`locks:${venueId}:${eventDate}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "table_locks",
        },
        () => fetchAvailability()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(lockChannel);
    };
  }, [venueId, eventDate, fetchAvailability]);

  return { tables, loading, error, refetch: fetchAvailability };
}
