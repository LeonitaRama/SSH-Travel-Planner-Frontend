// pages/super-admin/TenantsManagement.tsx
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

export default function TenantsManagement() {
  const { user } = useAuth();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTenant, setNewTenant] = useState({
    name: "",
    slug: "",
    adminUsername: "",
    adminEmail: "",
    adminPassword: "",
  });

  // Vetëm SUPER_ADMIN mund të shohë këtë faqe
  if (user?.role !== "SUPER_ADMIN") {
    return (
      <div className='p-6 text-center'>
        <div className='bg-red-100 text-red-700 p-4 rounded-lg'>
          ⚠️ You don't have permission to access this page. Only Super Admin can
          manage tenants.
        </div>
      </div>
    );
  }

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      setError("");
      // Hiq "/v1/" nga URL - përdor GET direkt
      const response = await api.get("/tenants");
      setTenants(response.data);
    } catch (error: any) {
      console.error("Error fetching tenants:", error);
      setError(error.response?.data?.message || "Failed to fetch tenants");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTenant = async () => {
    // Validimi
    if (
      !newTenant.name ||
      !newTenant.slug ||
      !newTenant.adminUsername ||
      !newTenant.adminEmail ||
      !newTenant.adminPassword
    ) {
      alert("Please fill in all fields");
      return;
    }

    setCreating(true);
    setError("");

    try {
      await api.post("/tenants", newTenant);
      alert(
        "Tenant created successfully! 4 users have been created automatically.",
      );
      setShowCreateModal(false);
      setNewTenant({
        name: "",
        slug: "",
        adminUsername: "",
        adminEmail: "",
        adminPassword: "",
      });
      await fetchTenants();
    } catch (error: any) {
      console.error("Error creating tenant:", error);
      setError(error.response?.data?.message || "Failed to create tenant");
      alert(error.response?.data?.message || "Failed to create tenant");
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteTenant = async (id: string, name: string) => {
    if (
      !confirm(
        `Are you sure? This will delete ALL data for tenant "${name}"! This action cannot be undone.`,
      )
    )
      return;

    try {
      await api.delete(`/tenants/${id}`);
      alert(`Tenant "${name}" deleted successfully!`);
      await fetchTenants();
    } catch (error: any) {
      console.error("Error deleting tenant:", error);
      alert(error.response?.data?.message || "Failed to delete tenant");
    }
  };

  if (loading) return <div className='p-6 text-center'>Loading tenants...</div>;

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>🏢 All Tenants</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700'
        >
          + New Tenant
        </button>
      </div>

      {error && (
        <div className='bg-red-100 text-red-700 p-3 rounded-md mb-4'>
          {error}
        </div>
      )}

      {tenants.length === 0 ? (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center'>
          <p className='text-gray-500'>
            No tenants found. Create your first tenant!
          </p>
        </div>
      ) : (
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200 dark:divide-gray-700'>
              <thead className='bg-gray-50 dark:bg-gray-700'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                    Name
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
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase'>
                    Actions
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
                    <td className='px-6 py-4'>
                      <button
                        onClick={() =>
                          handleDeleteTenant(tenant.id, tenant.name)
                        }
                        className='text-red-600 hover:text-red-800'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'>
            <h2 className='text-xl font-bold mb-4 dark:text-white'>
              Create New Tenant
            </h2>
            <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
              When you create a tenant, 4 users will be automatically created:
              Admin, Staff, Customer.
            </p>

            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Agency Name *
                </label>
                <input
                  type='text'
                  value={newTenant.name}
                  onChange={(e) =>
                    setNewTenant({ ...newTenant, name: e.target.value })
                  }
                  className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  required
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                  Slug (URL) *
                </label>
                <input
                  type='text'
                  value={newTenant.slug}
                  onChange={(e) =>
                    setNewTenant({
                      ...newTenant,
                      slug: e.target.value.toLowerCase().replace(/\s/g, "-"),
                    })
                  }
                  className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  placeholder='agency-name'
                  required
                />
              </div>

              <div className='border-t dark:border-gray-700 pt-4'>
                <h3 className='font-semibold mb-2 dark:text-white'>
                  Admin User (will be created automatically)
                </h3>
                <div className='space-y-3'>
                  <input
                    type='text'
                    placeholder='Admin Username *'
                    value={newTenant.adminUsername}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        adminUsername: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                  <input
                    type='email'
                    placeholder='Admin Email *'
                    value={newTenant.adminEmail}
                    onChange={(e) =>
                      setNewTenant({ ...newTenant, adminEmail: e.target.value })
                    }
                    className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                  <input
                    type='password'
                    placeholder='Admin Password *'
                    value={newTenant.adminPassword}
                    onChange={(e) =>
                      setNewTenant({
                        ...newTenant,
                        adminPassword: e.target.value,
                      })
                    }
                    className='w-full px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white'
                  />
                </div>
              </div>
            </div>

            <div className='flex justify-end space-x-3 mt-6'>
              <button
                onClick={() => setShowCreateModal(false)}
                className='px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTenant}
                disabled={creating}
                className='px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50'
              >
                {creating ? "Creating..." : "Create Tenant"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
