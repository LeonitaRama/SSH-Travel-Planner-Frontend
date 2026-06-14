import { Outlet, Link, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function AdminLayout() {
  const { user } = useAuth();
  const { tenantSlug } = useParams();
  const location = useLocation();
  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const [activePath, setActivePath] = useState("");

  useEffect(() => {
    setActivePath(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    {
      path: `/${tenantSlug}/admin/stats`,
      icon: "📊",
      label: "Dashboard",
      exact: true,
    },
    { path: `/${tenantSlug}/users`, icon: "👥", label: "Users", exact: false },

    {
      path: `/${tenantSlug}/tenant-settings`,
      icon: "⚙️",
      label: "Settings",
      exact: false,
    },
  ];

  const superAdminItems = [
    {
      path: `/${tenantSlug}/super-admin/tenants`,
      icon: "🏢",
      label: "All Tenants",
      exact: false,
    },
    {
      path: `/${tenantSlug}/super-admin/all-stats`,
      icon: "📈",
      label: "Global Stats",
      exact: false,
    },
  ];

  const isMenuItemActive = (item: { path: string; exact: boolean }) => {
    if (item.exact) {
      return activePath === item.path;
    }
    return activePath.startsWith(item.path);
  };

  return (
    <div className='min-h-screen flex'>
      {/* Sidebar */}
      <aside className='w-64 bg-gray-900 text-white flex flex-col'>
        <div className='p-4'>
          <div className='flex items-center gap-2 mb-6 pb-2 border-b border-gray-700'>
            <span className='text-xl'>🛡️</span>
            <h2 className='text-lg font-bold'>Admin Panel</h2>
          </div>

          <nav className='space-y-1'>
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-2 rounded transition-all duration-200 ${
                  isMenuItemActive(item)
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-300 hover:bg-gray-700 hover:text-white"
                }`}
              >
                <span className='inline-block w-6'>{item.icon}</span>
                {item.label}
              </Link>
            ))}

            {isSuperAdmin && (
              <>
                <div className='border-t border-gray-700 my-4'></div>
                <div className='text-xs text-gray-500 px-4 py-2 uppercase tracking-wider'>
                  Super Admin
                </div>
                {superAdminItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-2 rounded transition-all duration-200 ${
                      isMenuItemActive(item)
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <span className='inline-block w-6'>{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </nav>
        </div>

        {/* Footer në sidebar */}
        <div className='mt-auto p-4 border-t border-gray-700 text-xs text-gray-500'>
          <p>Role: {user?.role}</p>
          <p className='mt-1'>Tenant ID: {user?.tenantId?.slice(0, 8)}...</p>
        </div>
      </aside>

      {/* Main Content */}
      <div className='flex-1 flex flex-col'>
        <header className='bg-white dark:bg-gray-800 shadow-sm p-4 border-b dark:border-gray-700'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-xl font-semibold dark:text-white'>
                {menuItems.find((item) => isMenuItemActive(item))?.label ||
                  "Dashboard"}
              </h1>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                Logged in as: {user?.email}
              </p>
            </div>
            <div className='flex items-center gap-2'>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  user?.role === "SUPER_ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        <main className='flex-1 p-6 bg-gray-50 dark:bg-gray-900'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
