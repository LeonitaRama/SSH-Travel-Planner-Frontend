// layouts/PublicLayout.tsx
import { Outlet, Link, useParams } from "react-router-dom";
import { useTenant } from "../hooks/useTenant";
import { useAuth } from "../context/AuthContext";
import LandingDrawer from "../components/LandingDrawer";

export default function PublicLayout() {
  const { tenant } = useTenant();
  const { tenantSlug } = useParams();
  const { user } = useAuth();

  // Përcakto rrugën e dashboard-it bazuar në rolin e user-it
  const getDashboardPath = () => {
    if (!user) return `/${tenantSlug}`;

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      return `/${tenantSlug}/admin/stats`;
    }

    return `/${tenantSlug}`;
  };

  // Përcakto rrugën e profilit
  const getProfilePath = () => {
    return `/${tenantSlug}/profile`;
  };

  // ADMIN dhe SUPER_ADMIN shohin Dashboard
  const canAccessDashboard =
    user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN");

  // CUSTOMER dhe STAFF shohin My Account
  const canAccessAccount =
    user && (user.role === "CUSTOMER" || user.role === "STAFF");

  return (
    <div className='min-h-screen flex flex-col'>
      {/* Drawer - shfaqet në të gjitha faqet publike */}
      <LandingDrawer />

      <nav className='bg-white shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link
              to={`/${tenantSlug}`}
              className='text-xl font-bold text-blue-600'
            >
              {tenant?.name || "SSH Travel"}
            </Link>

            <div className='hidden md:flex space-x-4'>
              {!user ? (
                // User i paloguar - tregon Sign In dhe Sign Up
                <>
                  <Link
                    to={`/${tenantSlug}/login`}
                    className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                  >
                    Sign In
                  </Link>
                  <Link
                    to={`/${tenantSlug}/register`}
                    className='px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50'
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <div className='flex items-center gap-3'>
                  {/* Për ADMIN/SUPER_ADMIN - tregon Dashboard */}
                  {canAccessDashboard && (
                    <Link
                      to={getDashboardPath()}
                      className='px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition'
                    >
                      📊 Dashboard
                    </Link>
                  )}

                  {/* Për CUSTOMER/STAFF - tregon My Account */}
                  {canAccessAccount && (
                    <Link
                      to={getProfilePath()}
                      className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition'
                    >
                      👤 My Account
                    </Link>
                  )}

                  {/* Welcome text për të gjithë user-at e loguar */}
                  <div className='flex items-center text-gray-600 ml-2'>
                    <span className='text-sm'>
                      Welcome, {user.role || user.email?.split("@")[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className='flex-grow'>
        <Outlet />
      </main>

      <footer className='bg-gray-900 text-white py-6'>
        <div className='max-w-7xl mx-auto px-4 text-center'>
          <p>
            &copy; 2026 {tenant?.name || "SSH Travel"}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
