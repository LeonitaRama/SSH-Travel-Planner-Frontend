// components/LandingDrawer.tsx
import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface MenuItem {
  title: string;
  icon: string;
  path: string;
  description: string;
  requiresAuth?: boolean;
}

export default function LandingDrawer() {
  const { user, logout } = useAuth();
  const { tenantSlug } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsOpen(false);
    navigate(`/${tenantSlug}/login`);
  };

  // Të gjitha menu items bazuar në Swagger
  const menuItems: MenuItem[] = [
    // ========== TRAVEL (Publik) ==========
    {
      title: "Destinations",
      icon: "🏝️",
      path: "destinations",
      description: "Explore amazing destinations",
      requiresAuth: false,
    },
    {
      title: "Hotels",
      icon: "🏨",
      path: "hotels",
      description: "Find the best hotels",
      requiresAuth: false,
    },
    {
      title: "Rooms",
      icon: "🛏️",
      path: "rooms",
      description: "Browse hotel rooms",
      requiresAuth: false,
    },
    {
      title: "Flights",
      icon: "✈️",
      path: "flights",
      description: "Book cheap flights",
      requiresAuth: false,
    },
    {
      title: "Travel Packages",
      icon: "🎒",
      path: "travel-packages",
      description: "Complete vacation packages",
      requiresAuth: false,
    },
    {
      title: "Activities",
      icon: "🎯",
      path: "activities",
      description: "Things to do",
      requiresAuth: false,
    },

    // ========== TRANSPORT (Publik) ==========
    {
      title: "Airports",
      icon: "🛫",
      path: "airports",
      description: "Airport information",
      requiresAuth: false,
    },
    {
      title: "Airlines",
      icon: "🏢",
      path: "airlines",
      description: "Airline information",
      requiresAuth: false,
    },

    // ========== MY STUFF (Kërkon login) ==========
    {
      title: "My Bookings",
      icon: "📅",
      path: "bookings",
      description: "View your bookings",
      requiresAuth: true,
    },
    {
      title: "My Reviews",
      icon: "⭐",
      path: "reviews",
      description: "Your reviews",
      requiresAuth: true,
    },
    {
      title: "My Payments",
      icon: "💳",
      path: "payments",
      description: "Payment history",
      requiresAuth: true,
    },
    {
      title: "My Notifications",
      icon: "🔔",
      path: "notifications",
      description: "View notifications",
      requiresAuth: true,
    },

    // ========== OFFERS (Publik) ==========
    {
      title: "Coupons",
      icon: "🏷️",
      path: "coupons",
      description: "Discount coupons",
      requiresAuth: false,
    },

    // ========== AI (Publik) ==========
    {
      title: "AI Recommendations",
      icon: "🤖",
      path: "ai",
      description: "Get AI travel advice",
      requiresAuth: false,
    },
  ];

  // Ndarja e items në seksione
  const travelItems = menuItems.filter((item) =>
    ["Destinations", "Hotels", "Rooms", "Flights", "Travel Packages"].includes(
      item.title,
    ),
  );

  const transportItems = menuItems.filter((item) =>
    ["Airports", "Airlines"].includes(item.title),
  );

  const myStuffItems = menuItems.filter((item) =>
    ["My Bookings", "My Reviews", "My Payments", "My Notifications"].includes(
      item.title,
    ),
  );

  const offersItems = menuItems.filter((item) =>
    ["Coupons"].includes(item.title),
  );

  const aiItems = menuItems.filter((item) =>
    ["AI Recommendations"].includes(item.title),
  );

  // Funksioni për të renderuar një item (me redirect në login nëse kërkon auth)
  const renderMenuItem = (item: MenuItem) => {
    // Nëse kërkon auth dhe user nuk është i loguar, dërgo te login
    if (item.requiresAuth && !user) {
      return (
        <Link
          key={item.path}
          to={`/${tenantSlug}/login`}
          onClick={() => setIsOpen(false)}
          className='flex items-center gap-3 px-3 py-3 rounded-lg text-gray-500 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition group'
        >
          <span className='text-2xl opacity-50'>{item.icon}</span>
          <div className='flex-1'>
            <div className='font-semibold'>{item.title}</div>
            <div className='text-xs text-gray-400'>
              {item.description} (Login required)
            </div>
          </div>
          <span className='text-xs text-gray-400'>🔒</span>
        </Link>
      );
    }

    // Nëse user është i loguar ose nuk kërkon auth
    return (
      <Link
        key={item.path}
        to={`/${tenantSlug}/${item.path}`}
        onClick={() => setIsOpen(false)}
        className='flex items-center gap-3 px-3 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition group'
      >
        <span className='text-2xl'>{item.icon}</span>
        <div className='flex-1'>
          <div className='font-semibold'>{item.title}</div>
          <div className='text-xs text-gray-500 dark:text-gray-400'>
            {item.description}
          </div>
        </div>
        <svg
          className='w-4 h-4 opacity-0 group-hover:opacity-100 transition'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 5l7 7-7 7'
          />
        </svg>
      </Link>
    );
  };

  return (
    <>
      {/* Drawer Trigger Button - z-index i lartë */}
      <button
        onClick={() => setIsOpen(true)}
        className='fixed top-20 left-4 z-[100] bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 group'
        aria-label='Open menu'
      >
        <svg
          className='w-6 h-6'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M4 6h16M4 12h16M4 18h16'
          />
        </svg>
        <span className='absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap'>
          Menu
        </span>
      </button>

      {/* Overlay (mbulesa e errët) - z-index pak më i ulët se drawer-i */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-[99]'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer - z-index më i lartë se gjithçka */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-[100] transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className='sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h2 className='text-xl font-bold'>Explore</h2>
              <p className='text-sm opacity-90'>Discover your next adventure</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='text-white hover:text-gray-200'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>
        </div>

        {/* User Info (nëse është i loguar) */}
        {user && (
          <div className='p-4 border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold'>
                {user.username?.charAt(0).toUpperCase() ||
                  user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className='font-semibold dark:text-white'>
                  {user.username || user.email?.split("@")[0]}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  {user.role}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Seksioni: Travel */}
        <div className='p-4'>
          <div className='flex items-center gap-2 mb-2 pb-2 border-b-2 border-blue-500'>
            <span className='text-lg'>✈️</span>
            <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
              Travel
            </h3>
          </div>
          <div className='space-y-1'>{travelItems.map(renderMenuItem)}</div>
        </div>

        {/* Seksioni: Transport */}
        <div className='px-4 pb-4'>
          <div className='flex items-center gap-2 mb-2 pb-2 border-b-2 border-green-500'>
            <span className='text-lg'>🚗</span>
            <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
              Transport
            </h3>
          </div>
          <div className='space-y-1'>{transportItems.map(renderMenuItem)}</div>
        </div>

        {/* Seksioni: My Stuff */}
        <div className='px-4 pb-4'>
          <div className='flex items-center gap-2 mb-2 pb-2 border-b-2 border-purple-500'>
            <span className='text-lg'>👤</span>
            <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
              My Stuff
            </h3>
          </div>
          <div className='space-y-1'>{myStuffItems.map(renderMenuItem)}</div>
        </div>

        {/* Seksioni: Offers & Deals */}
        <div className='px-4 pb-4'>
          <div className='flex items-center gap-2 mb-2 pb-2 border-b-2 border-yellow-500'>
            <span className='text-lg'>🏷️</span>
            <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
              Offers & Deals
            </h3>
          </div>
          <div className='space-y-1'>{offersItems.map(renderMenuItem)}</div>
        </div>

        {/* Seksioni: AI Assistant */}
        <div className='px-4 pb-4'>
          <div className='flex items-center gap-2 mb-2 pb-2 border-b-2 border-indigo-500'>
            <span className='text-lg'>🤖</span>
            <h3 className='font-semibold text-gray-700 dark:text-gray-300'>
              AI Assistant
            </h3>
          </div>
          <div className='space-y-1'>{aiItems.map(renderMenuItem)}</div>
        </div>

        {/* Auth Section (butonat) */}
        <div className='p-4 border-t dark:border-gray-700 mt-2'>
          {!user ? (
            <div className='space-y-3'>
              <Link
                to={`/${tenantSlug}/login`}
                onClick={() => setIsOpen(false)}
                className='flex items-center justify-center gap-2 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition'
              >
                <span>🔐</span>
                <span>Sign In</span>
              </Link>
              <Link
                to={`/${tenantSlug}/register`}
                onClick={() => setIsOpen(false)}
                className='flex items-center justify-center gap-2 w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition'
              >
                <span>📝</span>
                <span>Create Account</span>
              </Link>
            </div>
          ) : (
            <div className='space-y-2'>
              <Link
                to={`/${tenantSlug}/profile`}
                onClick={() => setIsOpen(false)}
                className='flex items-center justify-center gap-2 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition'
              >
                <span>👤</span>
                <span>My Profile</span>
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className='flex items-center justify-center gap-2 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition'
              >
                <span>🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className='p-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-center text-xs text-gray-500 dark:text-gray-400'>
          <p>© 2026 SSH Travel Planner</p>
          <p className='mt-1'>Plan, Book, Travel</p>
        </div>
      </div>
    </>
  );
}
