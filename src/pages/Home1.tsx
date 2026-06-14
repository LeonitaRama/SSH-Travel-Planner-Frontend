// pages/Home.tsx
import { useAuth } from "../context/AuthContext";
import { useTenant } from "../hooks/useTenant";
// import HomeDrawer from "../components/HomeDrawer";

export default function Home() {
  const { user } = useAuth();
  const { tenant } = useTenant();

  return (
    <div>
      {/* Drawer */}
      {/* <HomeDrawer /> */}

      {/* Welcome Section */}
      <div className='bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white mb-8 ml-4'>
        <h1 className='text-3xl font-bold mb-2'>
          Welcome to {tenant?.name}! 👋
        </h1>
        <p className='text-blue-100'>
          Hello {user?.username || user?.email?.split("@")[0]}
        </p>
        <div className='mt-4 flex flex-wrap gap-2'>
          <span className='px-3 py-1 bg-white/20 rounded-full text-sm'>
            Role: {user?.role}
          </span>
          <span className='px-3 py-1 bg-white/20 rounded-full text-sm'>
            Tenant: {tenant?.name}
          </span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 ml-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center'>
          <div className='text-2xl mb-2'>🏝️</div>
          <div className='text-2xl font-bold text-blue-600'>0</div>
          <div className='text-sm text-gray-500'>Destinations</div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center'>
          <div className='text-2xl mb-2'>🏨</div>
          <div className='text-2xl font-bold text-green-600'>0</div>
          <div className='text-sm text-gray-500'>Hotels</div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center'>
          <div className='text-2xl mb-2'>✈️</div>
          <div className='text-2xl font-bold text-purple-600'>0</div>
          <div className='text-sm text-gray-500'>Flights</div>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center'>
          <div className='text-2xl mb-2'>📅</div>
          <div className='text-2xl font-bold text-orange-600'>0</div>
          <div className='text-sm text-gray-500'>Bookings</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className='grid md:grid-cols-2 gap-6 ml-4'>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='font-semibold mb-4 dark:text-white'>
            📋 Recent Bookings
          </h3>
          <p className='text-gray-500 text-sm'>You have no recent bookings.</p>
        </div>
        <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
          <h3 className='font-semibold mb-4 dark:text-white'>
            🌟 Recommended for You
          </h3>
          <p className='text-gray-500 text-sm'>
            Check out our top destinations!
          </p>
        </div>
      </div>
    </div>
  );
}
