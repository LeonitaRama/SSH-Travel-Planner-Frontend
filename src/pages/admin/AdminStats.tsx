// pages/admin/AdminStats.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTenant } from "../../hooks/useTenant";
import api from "../../services/api";

interface TenantStats {
  totalUsers: number;
  totalBookings: number;
  activeBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  totalDestinations?: number;
  totalHotels?: number;
  totalFlights?: number;
}

export default function AdminStats() {
  const { user } = useAuth();
  const { tenant } = useTenant();
  const [stats, setStats] = useState<TenantStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  useEffect(() => {
    fetchTenantStats();
  }, []);

  const fetchTenantStats = async () => {
    try {
      setError("");

      // Marrim statistika të bazuara në tenant
      const [
        usersRes,
        bookingsRes,
        paymentsRes,
        destinationsRes,
        hotelsRes,
        flightsRes,
      ] = await Promise.all([
        api.get("/users"),
        api.get("/bookings"),
        api.get("/payments"),
        api.get("/destinations").catch(() => ({ data: [] })),
        api.get("/hotels").catch(() => ({ data: [] })),
        api.get("/flights").catch(() => ({ data: [] })),
      ]);

      const bookings = bookingsRes.data || [];
      const payments = paymentsRes.data || [];

      const activeBookings = bookings.filter(
        (b: any) => b.status === "CONFIRMED",
      ).length;
      const cancelledBookings = bookings.filter(
        (b: any) => b.status === "CANCELLED",
      ).length;
      const totalRevenue = payments.reduce(
        (sum: number, p: any) => sum + (p.amount || 0),
        0,
      );

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalBookings: bookings.length,
        activeBookings,
        cancelledBookings,
        totalRevenue,
        totalDestinations: destinationsRes.data?.length || 0,
        totalHotels: hotelsRes.data?.length || 0,
        totalFlights: flightsRes.data?.length || 0,
      });
    } catch (err: any) {
      console.error("Error fetching stats:", err);
      setError(err.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return `€${amount?.toFixed(2) || 0}`;
  };

  if (loading) return <div className='p-6 text-center'>Loading stats...</div>;
  if (error) return <div className='p-6 text-center text-red-600'>{error}</div>;

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6 dark:text-white'>
        📊 Admin Dashboard
      </h1>

      {/* Tenant Info */}
      <div className='mb-6 p-4 bg-blue-50 dark:bg-blue-900 rounded-lg'>
        <p className='text-sm text-blue-800 dark:text-blue-200'>
          <strong>📋 Tenant:</strong> {tenant?.name}
        </p>
        <p className='text-sm text-blue-800 dark:text-blue-200 mt-1'>
          <strong>👑 Role:</strong> {user?.role}
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        <div className='bg-blue-500 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Total Users</p>
          <p className='text-3xl font-bold'>{stats?.totalUsers || 0}</p>
        </div>

        <div className='bg-green-500 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Total Bookings</p>
          <p className='text-3xl font-bold'>{stats?.totalBookings || 0}</p>
        </div>

        <div className='bg-yellow-500 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Active Bookings</p>
          <p className='text-3xl font-bold'>{stats?.activeBookings || 0}</p>
        </div>

        <div className='bg-purple-500 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Revenue</p>
          <p className='text-3xl font-bold'>
            {formatCurrency(stats?.totalRevenue ?? 0)}
          </p>
        </div>
      </div>

      <div className='mt-8 grid md:grid-cols-3 gap-6'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='font-semibold mb-2 dark:text-white'>
            🏝️ Destinations
          </h3>
          <p className='text-2xl dark:text-gray-300'>
            {stats?.totalDestinations || 0}
          </p>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='font-semibold mb-2 dark:text-white'>🏨 Hotels</h3>
          <p className='text-2xl dark:text-gray-300'>
            {stats?.totalHotels || 0}
          </p>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='font-semibold mb-2 dark:text-white'>✈️ Flights</h3>
          <p className='text-2xl dark:text-gray-300'>
            {stats?.totalFlights || 0}
          </p>
        </div>
      </div>

      {/* Super Admin: Global Stats */}
      {isSuperAdmin && (
        <div className='mt-8 p-4 bg-purple-50 dark:bg-purple-900 rounded-lg'>
          <h3 className='font-semibold mb-2 dark:text-white'>
            🌍 Super Admin Note
          </h3>
          <p className='text-sm text-purple-800 dark:text-purple-200'>
            As a Super Admin, you can view all tenants statistics in the Global
            Stats page.
          </p>
          <button
            onClick={() =>
              (window.location.href = `/${tenant?.slug}/super-admin/all-stats`)
            }
            className='mt-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
          >
            View Global Stats →
          </button>
        </div>
      )}
    </div>
  );
}
