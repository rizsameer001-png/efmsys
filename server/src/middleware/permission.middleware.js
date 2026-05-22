// server/src/middleware/permission.middleware.js
const User = require('../models/User.model');
const Role = require('../models/role.model');

const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      // Super admin has all permissions
      if (req.user.role === 'super_admin') {
        return next();
      }

      // Get user's role with permissions
      const role = await Role.findOne({ name: req.user.role }).populate('permissions');
      if (!role) {
        return res.status(403).json({ success: false, error: 'Role not found' });
      }

      // Check if role has the required permission
      const hasPermission = role.permissions.some(p => p.name === requiredPermission);

      // Also check custom permissions on user
      const hasCustomPermission = req.user.customPermissions?.includes(requiredPermission);

      if (!hasPermission && !hasCustomPermission) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Requires permission: ${requiredPermission}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
};

// Check multiple permissions (AND condition)
const andPermissionsMiddleware = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      if (req.user.role === 'super_admin') {
        return next();
      }

      const role = await Role.findOne({ name: req.user.role }).populate('permissions');
      const rolePermissions = role.permissions.map(p => p.name);
      const userPermissions = [...rolePermissions, ...(req.user.customPermissions || [])];

      const hasAllPermissions = requiredPermissions.every(p => userPermissions.includes(p));

      if (!hasAllPermissions) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Requires all permissions: ${requiredPermissions.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
};

// Check multiple permissions (OR condition)
const orPermissionsMiddleware = (requiredPermissions) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      if (req.user.role === 'super_admin') {
        return next();
      }

      const role = await Role.findOne({ name: req.user.role }).populate('permissions');
      const rolePermissions = role.permissions.map(p => p.name);
      const userPermissions = [...rolePermissions, ...(req.user.customPermissions || [])];

      const hasAnyPermission = requiredPermissions.some(p => userPermissions.includes(p));

      if (!hasAnyPermission) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Requires one of these permissions: ${requiredPermissions.join(', ')}`,
        });
      }

      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
};

module.exports = { permissionMiddleware, andPermissionsMiddleware, orPermissionsMiddleware };