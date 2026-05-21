// client/src/routes/PrivateRoute.jsx (Most Complete)
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import Spinner from '../components/common/Spinner';

// // Role to dashboard path mapping
// const ROLE_DASHBOARD_MAP = {
//   super_admin: '/dashboard/super-admin',
//   admin: '/dashboard/admin',
//   hr: '/dashboard/hr',
//   manager: '/dashboard/manager',
//   supervisor: '/dashboard/supervisor',
//   technician: '/dashboard/technician',
//   customer: '/dashboard/customer',
// };

// // Routes that don't require role-based dashboard redirect
// const EXCLUDED_PATHS = ['/profile', '/settings', '/change-password'];

// const PrivateRoute = ({ 
//   redirectPath = '/login',
//   allowedRoles = null,
//   redirectToRoleDashboard = true 
// }) => {
//   const { isAuthenticated, loading, user } = useAuth();

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Spinner size="lg" />
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     // Save the attempted URL for redirect after login
//     const currentPath = window.location.pathname;
//     if (currentPath !== '/login' && currentPath !== '/register') {
//       localStorage.setItem('redirectAfterLogin', currentPath);
//     }
//     return <Navigate to={redirectPath} replace />;
//   }

//   // Check role-based access if specified
//   if (allowedRoles && allowedRoles.length > 0) {
//     const userRole = user?.role;
    
//     // Super admin always has access
//     if (userRole !== 'super_admin' && !allowedRoles.includes(userRole)) {
//       // Try to redirect to user's appropriate dashboard
//       if (redirectToRoleDashboard) {
//         const dashboardPath = ROLE_DASHBOARD_MAP[userRole] || '/dashboard';
//         return <Navigate to={dashboardPath} replace />;
//       }
      
//       // Show unauthorized page
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   // Check if we need to redirect to role-specific dashboard
//   const currentPath = window.location.pathname;
//   const isRootDashboard = currentPath === '/dashboard' || currentPath === '/dashboard/';
//   const isExcludedPath = EXCLUDED_PATHS.includes(currentPath);
  
//   if (redirectToRoleDashboard && isRootDashboard && !isExcludedPath) {
//     const dashboardPath = ROLE_DASHBOARD_MAP[user?.role] || '/dashboard';
//     if (currentPath !== dashboardPath) {
//       return <Navigate to={dashboardPath} replace />;
//     }
//   }

//   // Check if user account is active
//   if (user?.status !== 'active') {
//     return <Navigate to="/account-suspended" replace />;
//   }

//   // Check if email is verified (if required)
//   if (user?.emailVerified === false && process.env.REQUIRE_EMAIL_VERIFICATION === 'true') {
//     return <Navigate to="/verify-email" replace />;
//   }

//   // Render child routes if authenticated
//   return <Outlet />;
// };



// // client/src/routes/PrivateRoute.jsx (Fixed Version)
// import React from 'react';
// import { Navigate, Outlet } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
// import Spinner from '../components/common/Spinner';

// // Role to dashboard path mapping
// const ROLE_DASHBOARD_MAP = {
//   super_admin: '/dashboard/super-admin',
//   admin: '/dashboard/admin',
//   hr: '/dashboard/hr',
//   manager: '/dashboard/manager',
//   supervisor: '/dashboard/supervisor',
//   technician: '/dashboard/technician',
//   customer: '/dashboard/customer',
// };

// // Routes that don't require role-based dashboard redirect
// const EXCLUDED_PATHS = ['/profile', '/settings', '/change-password'];

// const PrivateRoute = ({ 
//   redirectPath = '/login',
//   allowedRoles = null,
//   redirectToRoleDashboard = true 
// }) => {
//   const { isAuthenticated, loading, user } = useAuth();

//   // Show loading spinner while checking authentication
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <Spinner size="lg" />
//           <p className="mt-4 text-gray-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   // Redirect to login if not authenticated
//   if (!isAuthenticated) {
//     // Save the attempted URL for redirect after login
//     const currentPath = window.location.pathname;
//     if (currentPath !== '/login' && currentPath !== '/register') {
//       localStorage.setItem('redirectAfterLogin', currentPath);
//     }
//     return <Navigate to={redirectPath} replace />;
//   }

//   // Check role-based access if specified
//   if (allowedRoles && allowedRoles.length > 0) {
//     const userRole = user?.role;
    
//     // Super admin always has access
//     if (userRole !== 'super_admin' && !allowedRoles.includes(userRole)) {
//       // Try to redirect to user's appropriate dashboard
//       if (redirectToRoleDashboard) {
//         const dashboardPath = ROLE_DASHBOARD_MAP[userRole] || '/dashboard';
//         return <Navigate to={dashboardPath} replace />;
//       }
      
//       // Show unauthorized page
//       return <Navigate to="/unauthorized" replace />;
//     }
//   }

//   // Check if we need to redirect to role-specific dashboard
//   const currentPath = window.location.pathname;
//   const isRootDashboard = currentPath === '/dashboard' || currentPath === '/dashboard/';
//   const isExcludedPath = EXCLUDED_PATHS.includes(currentPath);
  
//   if (redirectToRoleDashboard && isRootDashboard && !isExcludedPath) {
//     const dashboardPath = ROLE_DASHBOARD_MAP[user?.role] || '/dashboard';
//     if (currentPath !== dashboardPath) {
//       return <Navigate to={dashboardPath} replace />;
//     }
//   }

//   // ✅ FIXED: Check if user account is active - handle undefined status
//   // Default to active if status is not set (for backward compatibility)
//   const isActive = user?.status === undefined || user?.status === 'active';
//   if (!isActive) {
//     return <Navigate to="/account-suspended" replace />;
//   }

//   // ✅ FIXED: Check email verification - use correct field name (isEmailVerified, not emailVerified)
//   const requireEmailVerification = process.env.REQUIRE_EMAIL_VERIFICATION === 'true';
//   const isEmailVerified = user?.isEmailVerified === true || user?.emailVerified === true;
  
//   if (requireEmailVerification && !isEmailVerified) {
//     return <Navigate to="/verify-email" replace />;
//   }

//   // Render child routes if authenticated
//   return <Outlet />;
// };

// export default PrivateRoute;
// // export default PrivateRoute;


// client/src/routes/PrivateRoute.jsx (Email verification required except Super Admin)
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/common/Spinner';

// Role to dashboard path mapping
const ROLE_DASHBOARD_MAP = {
  super_admin: '/dashboard/super-admin',
  admin: '/dashboard/admin',
  hr: '/dashboard/hr',
  manager: '/dashboard/manager',
  supervisor: '/dashboard/supervisor',
  technician: '/dashboard/technician',
  customer: '/dashboard/customer',
};

// Routes that don't require role-based dashboard redirect
const EXCLUDED_PATHS = ['/profile', '/settings', '/change-password'];

// Email verification is required for all roles EXCEPT super_admin
//const REQUIRE_EMAIL_VERIFICATION = true; // Set to true to enforce email verification
const REQUIRE_EMAIL_VERIFICATION  = false;

const PrivateRoute = ({ 
  redirectPath = '/login',
  allowedRoles = null,
  redirectToRoleDashboard = true 
}) => {
  const { isAuthenticated, loading, user } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    // Save the attempted URL for redirect after login
    const currentPath = window.location.pathname;
    if (currentPath !== '/login' && currentPath !== '/register') {
      localStorage.setItem('redirectAfterLogin', currentPath);
    }
    return <Navigate to={redirectPath} replace />;
  }

  // Check role-based access if specified
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role;
    
    // Super admin always has access
    if (userRole !== 'super_admin' && !allowedRoles.includes(userRole)) {
      // Try to redirect to user's appropriate dashboard
      if (redirectToRoleDashboard) {
        const dashboardPath = ROLE_DASHBOARD_MAP[userRole] || '/dashboard';
        return <Navigate to={dashboardPath} replace />;
      }
      
      // Show unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // Check if we need to redirect to role-specific dashboard
  const currentPath = window.location.pathname;
  const isRootDashboard = currentPath === '/dashboard' || currentPath === '/dashboard/';
  const isExcludedPath = EXCLUDED_PATHS.includes(currentPath);
  
  if (redirectToRoleDashboard && isRootDashboard && !isExcludedPath) {
    const dashboardPath = ROLE_DASHBOARD_MAP[user?.role] || '/dashboard';
    if (currentPath !== dashboardPath) {
      return <Navigate to={dashboardPath} replace />;
    }
  }

  // Check if user account is active - handle undefined status
  // Default to active if status is not set (for backward compatibility)
  const isActive = user?.status === undefined || user?.status === 'active';
  if (!isActive) {
    return <Navigate to="/account-suspended" replace />;
  }

  // ✅ Email verification check - EXCEPT for Super Admin
  if (REQUIRE_EMAIL_VERIFICATION && user?.role !== 'super_admin') {
    const isEmailVerified = user?.isEmailVerified === true || user?.emailVerified === true;
    if (!isEmailVerified) {
      return <Navigate to="/verify-email" replace />;
    }
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default PrivateRoute;