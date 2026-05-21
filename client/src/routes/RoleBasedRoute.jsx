// client/src/routes/RoleBasedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { usePermission } from '../hooks/usePermission';
import Spinner from '../components/common/Spinner';

const RoleBasedRoute = ({ 
  children, 
  roles = [], 
  permissions = [],
  fallbackPath = '/dashboard',
  showUnauthorized = true 
}) => {
  const { isAuthenticated, loading, user } = useAuth();
  const { hasPermission } = usePermission();

  if (loading) {
    return <Spinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Super admin always has access
  if (user?.role === 'super_admin') {
    return children;
  }

  // Check role access
  let hasRoleAccess = true;
  if (roles.length > 0) {
    hasRoleAccess = roles.includes(user?.role);
  }

  // Check permission access
  let hasPermissionAccess = true;
  if (permissions.length > 0) {
    hasPermissionAccess = permissions.every(perm => hasPermission(perm));
  }

  const hasAccess = hasRoleAccess && hasPermissionAccess;

  if (!hasAccess) {
    if (showUnauthorized) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <button
              onClick={() => window.location.href = fallbackPath}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default RoleBasedRoute;