// pages/super-admin/AllTenantsStats.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: { users: number };
}

export default function AllTenantsStats() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Vetëm SUPER_ADMIN mund të shohë këtë faqe
  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className='p-6 text-center'>
        <div className='bg-red-100 text-red-700 p-4 rounded-lg'>
          ⚠️ You don't have permission to access this page. Only Super Admin can
          view global statistics.
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchAllTenants();
  }, []);

  const fetchAllTenants = async () => {
    try {
      setError("");
      // Hiq "/v1/" nga URL
      const response = await api.get("/tenants");
      setTenants(response.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <div className='p-6 text-center'>Loading global stats...</div>;
  if (error) return <div className='p-6 text-center text-red-600'>{error}</div>;

  const totalUsers = tenants.reduce(
    (sum, t) => sum + (t._count?.users || 0),
    0,
  );

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>🌍 Global Statistics</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <div className='bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Total Tenants</p>
          <p className='text-3xl font-bold'>{tenants.length}</p>
        </div>

        <div className='bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Total Users</p>
          <p className='text-3xl font-bold'>{totalUsers}</p>
        </div>

        <div className='bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg'>
          <p className='text-sm opacity-90'>Active Tenants</p>
          <p className='text-3xl font-bold'>{tenants.length}</p>
        </div>
      </div>

      <div className='bg-white dark:bg-gray-800 rounded-lg shadow'>
        <div className='p-6 border-b dark:border-gray-700'>
          <h2 className='text-lg font-semibold dark:text-white'>
            📋 Tenants List
          </h2>
        </div>
        {tenants.length === 0 ? (
          <div className='p-8 text-center text-gray-500'>No tenants found.</div>
        ) : (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                    Tenant
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                    Slug
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                    Users
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                    Created
                  </th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                {tenants.map((tenant) => (
                  <tr key={tenant.id}>
                    <td className='px-6 py-4 font-medium dark:text-white'>
                      {tenant.name}
                    </td>
                    <td className='px-6 py-4 dark:text-gray-300'>
                      {tenant.slug}
                    </td>
                    <td className='px-6 py-4 dark:text-gray-300'>
                      {tenant._count?.users || 0}
                    </td>
                    <td className='px-6 py-4 dark:text-gray-300'>
                      {new Date(tenant.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
