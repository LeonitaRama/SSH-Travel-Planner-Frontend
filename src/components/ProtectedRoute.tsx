// // // components/ProtectedRoute.tsx
// // import { Navigate, useParams } from "react-router-dom";
// // import { useAuth } from "../context/AuthContext";
// // import { ReactNode } from "react";

// // interface ProtectedRouteProps {
// //   children: ReactNode;
// // }

// // export default function ProtectedRoute({ children }: ProtectedRouteProps) {
// //   const { user, loading } = useAuth();
// //   const { tenantSlug } = useParams();

// //   if (loading) {
// //     return (
// //       <div className='flex items-center justify-center h-screen'>
// //         <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
// //       </div>
// //     );
// //   }

// //   if (!user) {
// //     return <Navigate to={`/${tenantSlug}/login`} replace />;
// //   }

// //   return <>{children}</>;
// // }

// // components/ProtectedRoute.tsx
// import { Navigate, useParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";
// import { ReactNode } from "react";

// interface ProtectedRouteProps {
//   children: ReactNode;
//   allowedRoles?: string[]; // Shto këtë
// }

// export default function ProtectedRoute({
//   children,
//   allowedRoles,
// }: ProtectedRouteProps) {
//   const { user, loading } = useAuth();
//   const { tenantSlug } = useParams();

//   if (loading) {
//     return (
//       <div className='flex items-center justify-center h-screen'>
//         <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to={`/${tenantSlug}/login`} replace />;
//   }

//   // Nëse ka role të specifikuara, kontrollo
//   if (allowedRoles && !allowedRoles.includes(user.role)) {
//     return <Navigate to={`/${tenantSlug}`} replace />;
//   }

//   return <>{children}</>;
// }

// components/ProtectedRoute.tsx
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
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

  return <>{children}</>;
}
