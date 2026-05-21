// client/src/hooks/usePermission.js
import { useAuth } from './useAuth';

export const usePermission = () => {
  const { user } = useAuth();

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission name (e.g., 'user.create')
   * @returns {boolean}
   */
  const hasPermission = (permission) => {
    if (!user) return false;
    
    // Super admin has all permissions
    if (user.role === 'super_admin') return true;
    
    // Check user's permissions array
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission);
    }
    
    return false;
  };

  /**
   * Check if user has any of the specified permissions
   * @param {string[]} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAnyPermission = (permissions) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    
    return permissions.some(permission => hasPermission(permission));
  };

  /**
   * Check if user has all of the specified permissions
   * @param {string[]} permissions - Array of permission names
   * @returns {boolean}
   */
  const hasAllPermissions = (permissions) => {
    if (!user) return false;
    if (user.role === 'super_admin') return true;
    
    return permissions.every(permission => hasPermission(permission));
  };

  /**
   * Check if user has a specific role
   * @param {string|string[]} roles - Role name or array of role names
   * @returns {boolean}
   */
  const hasRole = (roles) => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  /**
   * Check if user has any of the specified roles
   * @param {string[]} roles - Array of role names
   * @returns {boolean}
   */
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  /**
   * Get user's role level (higher number = more access)
   * @returns {number}
   */
  const getRoleLevel = () => {
    const roleLevels = {
      super_admin: 100,
      admin: 90,
      hr: 85,
      manager: 80,
      accountant: 75,
      supervisor: 70,
      technician: 50,
      customer: 10,
    };
    return roleLevels[user?.role] || 0;
  };

  /**
   * Check if user's role level is at least the specified level
   * @param {number} level - Minimum role level
   * @returns {boolean}
   */
  const hasRoleLevel = (level) => {
    return getRoleLevel() >= level;
  };

  /**
   * Check if user can access a specific module
   * @param {string} module - Module name (e.g., 'users', 'complaints')
   * @param {string} action - Action (e.g., 'read', 'create', 'update', 'delete')
   * @returns {boolean}
   */
  const canAccessModule = (module, action = 'read') => {
    const permission = `${module}.${action}`;
    return hasPermission(permission);
  };

  /**
   * Get all permissions grouped by module
   * @returns {Object}
   */
  const getGroupedPermissions = () => {
    if (!user?.permissions) return {};
    
    const grouped = {};
    user.permissions.forEach(permission => {
      const [module, action] = permission.split('.');
      if (!grouped[module]) {
        grouped[module] = [];
      }
      grouped[module].push(action);
    });
    return grouped;
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    getRoleLevel,
    hasRoleLevel,
    canAccessModule,
    getGroupedPermissions,
  };
};

export default usePermission;