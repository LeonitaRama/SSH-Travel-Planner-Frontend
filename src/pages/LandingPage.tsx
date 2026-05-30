// pages/LandingPage.tsx
import { Link } from "react-router-dom";
import { useTenant } from "../hooks/useTenant";
import { useAuth } from "../context/AuthContext";
import { useTenantStats } from "../hooks/useTenantStats";

export default function LandingPage() {
  const { tenant, loading: tenantLoading } = useTenant();
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useTenantStats(tenant?.id);

  // Përcakto rrugën e dashboard-it bazuar në rolin e user-it
  const getDashboardPath = () => {
    if (!user) return `/${tenant?.slug || "tenant1"}`;

    if (user.role === "ADMIN" || user.role === "SUPER_ADMIN") {
      return `/${tenant?.slug || "tenant1"}/admin/stats`;
    }

    // Për STAFF, CUSTOMER
    return `/${tenant?.slug || "tenant1"}`;
  };

  // Vetëm STAFF, ADMIN, SUPER_ADMIN e shohin butonin "Go to Dashboard"
  const canAccessDashboard =
    user &&
    (user.role === "STAFF" ||
      user.role === "ADMIN" ||
      user.role === "SUPER_ADMIN");

  if (tenantLoading || authLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
      {/* Hero Section */}
      <div className='relative overflow-hidden'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24'>
          <div className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition'>
            <h1 className='text-4xl md:text-6xl font-bold text-gray-900 mb-4'>
              {tenant?.name || "SSH Travel Planner"}
            </h1>
            <p className='text-xl text-gray-600 mb-8 max-w-2xl mx-auto'>
              Plan your perfect trip with our comprehensive travel planning
              platform.
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center'>
              {!user ? (
                <>
                  <Link
                    to={`/${tenant?.slug}/login`}
                    className='px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                  >
                    Sign In
                  </Link>
                  <Link
                    to={`/${tenant?.slug}/register`}
                    className='px-6 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-50 border border-blue-600'
                  >
                    Create Account
                  </Link>
                </>
              ) : (
                canAccessDashboard && (
                  <Link
                    to={getDashboardPath()}
                    className='px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700'
                  >
                    Go to Dashboard
                  </Link>
                )
              )}
            </div>

            {/* Nëse user është CUSTOMER dhe i loguar, shfaq një mesazh */}
            {user && !canAccessDashboard && (
              <p className='mt-4 text-gray-600'>
                Welcome back! Explore our destinations, hotels, and flights.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className='bg-white py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900'>Why Choose Us?</h2>
            <p className='mt-2 text-gray-600'>
              We make travel planning easy and affordable
            </p>
          </div>
          <div className='grid md:grid-cols-3 gap-8'>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🏨</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Best Hotels</h3>
              <p className='text-gray-500'>
                Curated selection of the finest accommodations
              </p>
            </div>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>✈️</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Flight Deals</h3>
              <p className='text-gray-500'>Best prices on flights worldwide</p>
            </div>
            <div className='text-center p-6'>
              <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='text-2xl'>🎒</span>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Travel Packages</h3>
              <p className='text-gray-500'>
                Complete vacation packages tailored for you
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className='bg-gray-50 py-16'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-gray-900'>
              Our Platform by the Numbers
            </h2>
            <p className='mt-2 text-gray-600'>
              Real-time statistics from {tenant?.name}
            </p>
          </div>

          {statsLoading ? (
            <div className='flex justify-center py-12'>
              <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
            </div>
          ) : (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
              <div className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition'>
                <div className='text-4xl font-bold text-blue-600'>
                  {stats.totalDestinations}
                </div>
                <div className='text-gray-600 mt-2'>Destinations</div>
                <div className='text-xs text-gray-400 mt-1'>Amazing places</div>
              </div>
              <div className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition'>
                <div className='text-4xl font-bold text-green-600'>
                  {stats.totalHotels}
                </div>
                <div className='text-gray-600 mt-2'>Hotels</div>
                <div className='text-xs text-gray-400 mt-1'>
                  Comfortable stays
                </div>
              </div>
              <div className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition'>
                <div className='text-4xl font-bold text-purple-600'>
                  {stats.totalFlights}
                </div>
                <div className='text-gray-600 mt-2'>Flights</div>
                <div className='text-xs text-gray-400 mt-1'>
                  Daily connections
                </div>
              </div>
              <div className='bg-white rounded-xl shadow-md p-6 text-center hover:shadow-lg transition'>
                <div className='text-4xl font-bold text-orange-600'>
                  {stats.totalUsers}
                </div>
                <div className='text-gray-600 mt-2'>Active Users</div>
                <div className='text-xs text-gray-400 mt-1'>
                  Happy travelers
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section - Vetëm për user-at që nuk janë të loguar */}
      {!user && (
        <div className='bg-blue-600 py-16'>
          <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              Ready to start your journey?
            </h2>
            <p className='text-blue-100 mb-8'>
              Join thousands of travelers who trust us
            </p>
            <Link
              to={`/${tenant?.slug}/register`}
              className='inline-block px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition'
            >
              Create Free Account
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
