// // layouts/AuthenticatedLayout.tsx
// import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { useTenant } from "../hooks/useTenant";

// export default function AuthenticatedLayout() {
//   const { user, logout } = useAuth();
//   const { tenant } = useTenant();
//   const { tenantSlug } = useParams();
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     await logout();
//     navigate(`/${tenantSlug}/login`);
//   };

//   const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
//   const isSuperAdmin = user?.role === "SUPER_ADMIN";

//   return (
//     <div className='min-h-screen flex flex-col'>
//       <nav className='bg-white dark:bg-gray-800 shadow-md'>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
//           <div className='flex justify-between items-center h-16'>
//             <Link
//               to={`/${tenantSlug}`}
//               className='text-xl font-bold text-blue-600 dark:text-blue-400'
//             >
//               {tenant?.name || "SSH Travel"}
//             </Link>

//             <div className='hidden md:flex space-x-6'>
//               <Link
//                 to={`/${tenantSlug}/destinations`}
//                 className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
//               >
//                 Destinations
//               </Link>
//               <Link
//                 to={`/${tenantSlug}/hotels`}
//                 className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
//               >
//                 Hotels
//               </Link>
//               <Link
//                 to={`/${tenantSlug}/flights`}
//                 className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
//               >
//                 Flights
//               </Link>
//               <Link
//                 to={`/${tenantSlug}/bookings`}
//                 className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
//               >
//                 My Bookings
//               </Link>
//               <Link
//                 to={`/${tenantSlug}/wishlists`}
//                 className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
//               >
//                 Wishlist
//               </Link>
//               {isAdmin && (
//                 <Link
//                   to={`/${tenantSlug}/users`}
//                   className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
//                 >
//                   Users
//                 </Link>
//               )}
//               {isSuperAdmin && (
//                 <Link
//                   to={`/${tenantSlug}/super-admin/tenants`}
//                   className='text-purple-600 hover:text-purple-700'
//                 >
//                   All Tenants
//                 </Link>
//               )}
//             </div>

//             <div className='flex items-center space-x-4'>
//               <div className='relative group'>
//                 <button className='flex items-center space-x-2 text-gray-700 dark:text-gray-300'>
//                   <span>{user?.username || user?.email?.split("@")[0]}</span>
//                   <span className='text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700'>
//                     {user?.role}
//                   </span>
//                 </button>

//                 <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg hidden group-hover:block z-50'>
//                   <Link
//                     to={`/${tenantSlug}/profile`}
//                     className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   >
//                     Profile
//                   </Link>
//                   {isAdmin && (
//                     <Link
//                       to={`/${tenantSlug}/tenant-settings`}
//                       className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                     >
//                       Settings
//                     </Link>
//                   )}
//                   <button
//                     onClick={handleLogout}
//                     className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <main className='flex-grow bg-gray-50 dark:bg-gray-900'>
//         <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
//           <Outlet />
//         </div>
//       </main>
//     </div>
//   );
// }

// layouts/AuthenticatedLayout.tsx
import { Outlet, Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTenant } from "../hooks/useTenant";
import { useTheme } from "../context/ThemeContext";

export default function AuthenticatedLayout() {
  const { user, logout } = useAuth();
  const { tenant } = useTenant();
  const { tenantSlug } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = async () => {
    await logout();
    navigate(`/${tenantSlug}/login`);
  };

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  return (
    <div className='min-h-screen flex flex-col'>
      <nav className='bg-white dark:bg-gray-800 shadow-md'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between items-center h-16'>
            <Link
              to={`/${tenantSlug}`}
              className='text-xl font-bold text-blue-600 dark:text-blue-400'
            >
              {tenant?.name || "SSH Travel"}
            </Link>

            <div className='hidden md:flex space-x-6'>
              <Link
                to={`/${tenantSlug}/destinations`}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
              >
                Destinations
              </Link>
              <Link
                to={`/${tenantSlug}/hotels`}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
              >
                Hotels
              </Link>
              <Link
                to={`/${tenantSlug}/flights`}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
              >
                Flights
              </Link>
              <Link
                to={`/${tenantSlug}/bookings`}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
              >
                My Bookings
              </Link>
              <Link
                to={`/${tenantSlug}/wishlists`}
                className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
              >
                Wishlist
              </Link>
              {isAdmin && (
                <Link
                  to={`/${tenantSlug}/users`}
                  className='text-gray-700 dark:text-gray-300 hover:text-blue-600'
                >
                  Users
                </Link>
              )}
              {isSuperAdmin && (
                <Link
                  to={`/${tenantSlug}/super-admin/tenants`}
                  className='text-purple-600 hover:text-purple-700'
                >
                  All Tenants
                </Link>
              )}
            </div>

            <div className='flex items-center space-x-4'>
              <button
                onClick={toggleTheme}
                className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition'
                aria-label='Toggle theme'
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>

              <div className='relative group'>
                <button className='flex items-center space-x-2 text-gray-700 dark:text-gray-300'>
                  <span>{user?.username || user?.email?.split("@")[0]}</span>
                  <span className='text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700'>
                    {user?.role}
                  </span>
                </button>

                <div className='absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg hidden group-hover:block z-50'>
                  <Link
                    to={`/${tenantSlug}/profile`}
                    className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to={`/${tenantSlug}/tenant-settings`}
                      className='block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    >
                      Settings
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700'
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className='flex-grow bg-gray-50 dark:bg-gray-900'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
