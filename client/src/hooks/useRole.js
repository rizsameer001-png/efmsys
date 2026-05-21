// client/src/hooks/useRole.js
import { useAuth } from './useAuth';

export const useRole = () => {
  const { user } = useAuth();
  
  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    return user.role === roles;
  };
  
  const isSuperAdmin = () => user?.role === 'super_admin';
  const isAdmin = () => user?.role === 'admin';
  const isHR = () => user?.role === 'hr';
  const isManager = () => user?.role === 'manager';
  const isSupervisor = () => user?.role === 'supervisor';
  const isTechnician = () => user?.role === 'technician';
  const isCustomer = () => user?.role === 'customer';
  
  const hasPermission = (roles = [], permissions = []) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    if (roles.length && hasRole(roles)) return true;
    if (permissions.length) {
      // Check against user's permissions
      return permissions.some(p => user.permissions?.includes(p));
    }
    return false;
  };
  
  return {
    user,
    role: user?.role,
    hasRole,
    hasPermission,
    isSuperAdmin,
    isAdmin,
    isHR,
    isManager,
    isSupervisor,
    isTechnician,
    isCustomer,
  };
};