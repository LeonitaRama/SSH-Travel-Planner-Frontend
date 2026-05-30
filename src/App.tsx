// App.tsx
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
import LandingPage from "./pages/LandingPage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Authenticated Pages
import Home from "./pages/Home";
import Profile from "./pages/user/Profile";
import Destinations from "./pages/destination/Destinations";
import DestinationDetails from "./pages/destination/DestinationDetails";
import DestinationForm from "./pages/destination/DestinationForm";

// Admin Pages
import Users from "./pages/user/Users";
import UserDetails from "./pages/user/UserDetails";
import TenantSettings from "./pages/tenant/TenantSettings";
import AdminStats from "./pages/admin/AdminStats";

// Super Admin Pages
import TenantsManagement from "./pages/super-admin/TenantsManagement";
import AllTenantsStats from "./pages/super-admin/AllTenantsStats";
import { ThemeProvider } from "./context/ThemeContext";
import BackgroundJobs from "./pages/admin/";
import { UserInteractionProvider } from "./context/UserInteractionContext";
import { DestinationProvider } from "./context/DestinationContext";

function LoadingFallback() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
    </div>
  );
}

// AppContent kthen VETËM Routes, pa GlobalDrawer
function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { tenant, loading: tenantLoading } = useTenant();

  if (authLoading || tenantLoading) {
    return <LoadingFallback />;
  }

  const basePath = `/${tenant?.slug || "tenant1"}`;

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path='/' element={<Navigate to={basePath} replace />} />
        <Route path='/:tenantSlug' element={<LandingPage />} />
        <Route path='/:tenantSlug/login' element={<Login />} />
        <Route path='/:tenantSlug/register' element={<Register />} />
      </Route>

      {/* Authenticated Routes - All users */}
      <Route
        element={
          <ProtectedRoute>
            <AuthenticatedLayout />
          </ProtectedRoute>
        }
      >
        <Route path='/:tenantSlug' element={<Home />} />
        <Route path='/:tenantSlug/profile' element={<Profile />} />
        <Route path='/:tenantSlug/destinations' element={<Destinations />} />
        <Route
          path='/:tenantSlug/destinations/:id'
          element={<DestinationDetails />}
        />
      </Route>

      {/* Staff Routes */}
      <Route
        element={
          <ProtectedRoute>
            <RoleBasedRoute allowedRoles={["ADMIN", "SUPER_ADMIN", "STAFF"]}>
              <AuthenticatedLayout />
            </RoleBasedRoute>
          </ProtectedRoute>
        }
      >
        <Route
          path='/:tenantSlug/destinations/new'
          element={<DestinationForm />}
        />
        <Route
          path='/:tenantSlug/destinations/:id/edit'
          element={<DestinationForm />}
        />
      </Route>

      {/* Admin Routes */}
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

      {/* Super Admin Routes */}
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
        <Route
          path='/:tenantSlug/admin/background-jobs'
          element={<BackgroundJobs />}
        />
      </Route>

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

// MAIN APP - GlobalDrawer vendoset JASHTË AppContent dhe BRENDA Provider-ave
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
