// components/RoleBasedRoute.tsx
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
}

export default function RoleBasedRoute({
  children,
  allowedRoles,
}: RoleBasedRouteProps) {
  const { user, loading } = useAuth();
  const { tenantSlug } = useParams();

  if (loading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={`/${tenantSlug}/login`} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={`/${tenantSlug}`} replace />;
  }

  return <>{children}</>;
}
