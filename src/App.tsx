import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TenantProvider } from "./context/TenantContext";
import { useAuth } from "./context/AuthContext";
import { useTenant } from "./hooks/useTenant";

// Layouts
import PublicLayout from "./Layouts/PublicLayout";
import AuthenticatedLayout from "./Layouts/AuthenticatedLayout";
import AdminLayout from "./Layouts/AdminLayout";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import RoleBasedRoute from "./components/RoleBasedRoute";

// Public Pages
import LandingPage from "./pages/LandingPage1";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Authenticated Pages (User Area)
import Home from "./Home"; // Dashboard kryesore
import Profile from "./pages/user/Profile";
import Destinations from "./pages/destination/Destinations";
import DestinationDetails from "./pages/destination/DestinationDetails";
import DestinationForm from "./pages/destination/DestinationForm";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import Flights from "./pages/Flights";
import TravelPackages from "./pages/TravelPackages";
import Bookings from "./pages/Bookings";
import Reviews from "./pages/Reviews";
import Payments from "./pages/Payments";
import Notifications from "./pages/Notifications";
import AiPage from "./pages/AiPage";

// Admin Pages
import Users from "./pages/user/Users";
import UserDetails from "./pages/user/UserDetails";
import TenantSettings from "./pages/tenant/TenantSettings";
import AdminStats from "./pages/admin/AdminStats";

// Super Admin Pages
import TenantsManagement from "./pages/super-admin/TenantsManagement";
import AllTenantsStats from "./pages/super-admin/AllTenantsStats";

// Contexts & Providers
import { ThemeProvider } from "./context/ThemeContext";
import { UserInteractionProvider } from "./context/UserInteractionContext";
import { DestinationProvider } from "./context/DestinationContext";
import { FlightProvider } from "./context/FlightContext";
import Coupons from "./pages/Coupons";
import Airlines from "./pages/Airlines";
import Airports from "./pages/Airports";

function LoadingFallback() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  );
}

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();

  if (authLoading || tenantLoading) {
    return <LoadingFallback />;
  }

  const basePath = `/${tenant?.slug || "tenant1"}`;

  return (
    <Routes>
      {/* ========== Rrugët Publike (pa login) ========== */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<Navigate to={basePath} replace />} />
        <Route path='/:tenantSlug' element={<Home />} />
        <Route path='/:tenantSlug/login' element={<Login />} />
        <Route path='/:tenantSlug/register' element={<Register />} />
      </Route>

      {/* ========== Rrugët e Mbrojtura (kërkohet login) ========== */}
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        {/* Dashboard kryesor */}
        <Route path='/:tenantSlug' element={<Home />} />

        {/* Profili */}
        <Route path='/:tenantSlug/profile' element={<Profile />} />

        {/* Destinacionet */}
        <Route path='/:tenantSlug/destinations' element={<Destinations />} />
        <Route
          path='/:tenantSlug/destinations/:id'
          element={<DestinationDetails />}
        />

        {/* Hotele & Dhoma */}
        <Route path='/:tenantSlug/hotels' element={<Hotels />} />
        <Route path='/:tenantSlug/rooms' element={<Rooms />} />

        {/* Fluturimet */}
        <Route path='/:tenantSlug/flights' element={<Flights />} />

        {/* Paketat Turistike & Aktivitetet */}
        <Route
          path='/:tenantSlug/travel-packages'
          element={<TravelPackages />}
        />

        {/* Transporti */}

        {/* Pjesa Personale */}
        <Route path='/:tenantSlug/bookings' element={<Bookings />} />
        <Route path='/:tenantSlug/reviews' element={<Reviews />} />
        <Route path='/:tenantSlug/coupons' element={<Coupons />} />
        <Route path='/:tenantSlug/payments' element={<Payments />} />
        <Route path='/:tenantSlug/airlines' element={<Airlines />} />
        <Route path='/:tenantSlug/airports' element={<Airports />} />
        <Route path='/:tenantSlug/notifications' element={<Notifications />} />

        {/* Oferta & Kupona */}

        {/* Asistenti AI */}
        <Route path='/:tenantSlug/ai' element={<AiPage />} />
      </Route>

      {/* ========== Rrugët për Staff (krijim/modifikim) ========== */}
      <Route
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
              <AuthenticatedLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        {/* Formularët e destinacioneve */}
        <Route
          path='/:tenantSlug/destinations/new'
          element={<DestinationForm />}
        />
        <Route
          path='/:tenantSlug/destinations/:id/edit'
          element={<DestinationForm />}
        />

        {/* Këtu mund të shtosh edhe formularë për hotele, fluturime, etj. */}
      </Route>

      {/* ========== Rrugët për Admin ========== */}
      <Route
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]}>
              <AdminLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route path='/:tenantSlug/admin/stats' element={<AdminStats />} />
        <Route path='/:tenantSlug/users' element={<Users />} />
        <Route path='/:tenantSlug/users/:id' element={<UserDetails />} />
        <Route
          path='/:tenantSlug/tenant-settings'
          element={<TenantSettings />}
        />
      </Route>

      {/* ========== Rrugët për Super Admin ========== */}
      <Route
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["SUPER_ADMIN"]}>
              <AdminLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route
          path='/:tenantSlug/super-admin/tenants'
          element={<TenantsManagement />}
        />
        <Route
          path='/:tenantSlug/super-admin/all-stats'
          element={<AllTenantsStats />}
        />
      </Route>

      {/* Fallback për rrugë të panjohura */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

function NotFound() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='text-center'>
        <h1 className='text-6xl font-bold text-gray-900'>404</h1>
        <p className='mt-2 text-gray-600'>Page not found</p>
      </div>
    </div>
  );
}

// MAIN APP
function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <DestinationProvider>
            <ThemeProvider>
              <UserInteractionProvider>
                <AppContent />
              </UserInteractionProvider>
            </ThemeProvider>
          </DestinationProvider>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
