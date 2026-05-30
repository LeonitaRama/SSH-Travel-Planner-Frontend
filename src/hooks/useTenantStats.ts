// hooks/useTenantStats.ts
import { useState, useEffect } from "react";
import api from "../services/api";

interface TenantStats {
  totalDestinations: number;
  totalHotels: number;
  totalFlights: number;
  totalUsers: number;
  totalBookings: number;
  totalActivities: number;
  totalAirlines: number;
  totalAirports: number;
}

export function useTenantStats(tenantId: string | undefined) {
  const [stats, setStats] = useState<TenantStats>({
    totalDestinations: 0,
    totalHotels: 0,
    totalFlights: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalActivities: 0,
    totalAirlines: 0,
    totalAirports: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!tenantId) return;

    const fetchStats = async () => {
      setLoading(true);
      setError(null);

      try {
        // Bëj kërkesat paralele për të gjitha statistikat
        const [
          destinationsRes,
          hotelsRes,
          flightsRes,
          usersRes,
          bookingsRes,
          activitiesRes,
          airlinesRes,
          airportsRes,
        ] = await Promise.all([
          api.get("/destinations").catch(() => ({ data: [] })),
          api.get("/hotels").catch(() => ({ data: [] })),
          api.get("/flights").catch(() => ({ data: [] })),
          api.get("/users").catch(() => ({ data: [] })),
          api.get("/bookings").catch(() => ({ data: [] })),
          api.get("/activities").catch(() => ({ data: [] })),
          api.get("/airlines").catch(() => ({ data: [] })),
          api.get("/airports").catch(() => ({ data: [] })),
        ]);

        setStats({
          totalDestinations: destinationsRes.data?.length || 0,
          totalHotels: hotelsRes.data?.length || 0,
          totalFlights: flightsRes.data?.length || 0,
          totalUsers: usersRes.data?.length || 0,
          totalBookings: bookingsRes.data?.length || 0,
          totalActivities: activitiesRes.data?.length || 0,
          totalAirlines: airlinesRes.data?.length || 0,
          totalAirports: airportsRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Error fetching tenant stats:", err);
        setError("Failed to load statistics");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [tenantId]);

  return { stats, loading, error };
}
