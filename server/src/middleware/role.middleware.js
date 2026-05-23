/**
 * ROLE MIDDLEWARE
 * Handles role-based access control for routes
 */

const roleAliases = {
  'superadmin': 'super_admin',
  'super': 'super_admin',
  'administrator': 'admin',
  'cust': 'customer',
  'tech': 'technician',
  'supervisor': 'supervisor',
  'manager': 'manager',
  'hr_manager': 'hr',
  'accountant': 'accountant'
};

// 🔴 FIX: Safe normalizeRole (handles object, array, undefined)
const normalizeRole = (role) => {
  if (!role) return null; // 🔴 FIX

  if (Array.isArray(role)) {
    role = role[0]; // 🔴 FIX
  }

  if (typeof role === "object") {
    role = role.name || role.role || role.value; // 🔴 FIX
  }

  if (typeof role !== "string") {
    console.log("❌ Invalid role:", role, "Type:", typeof role); // 🔴 FIX
    return null; // 🔴 FIX
  }

  const lowerRole = role.toLowerCase().trim(); // 🔴 FIX
  return roleAliases[lowerRole] || lowerRole;
};

// Simple role middleware
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const userRole = normalizeRole(req.user.role);

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // 🔴 FIX: Safe map + filter
    const normalizedAllowedRoles = roles
      .map(role => normalizeRole(role))
      .filter(Boolean);

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of these roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

// Role hierarchy
const roleHierarchy = {
  super_admin: ['super_admin', 'admin', 'hr', 'manager', 'supervisor', 'technician', 'accountant', 'customer'],
  admin: ['admin', 'manager', 'supervisor', 'technician', 'hr'],
  hr: ['hr'],
  manager: ['manager', 'supervisor', 'technician'],
  supervisor: ['supervisor', 'technician'],
  technician: ['technician'],
  accountant: ['accountant'],
  customer: ['customer'],
};

// Hierarchy middleware
const roleHierarchyMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = normalizeRole(req.user.role);
    const userAllowedRoles = roleHierarchy[userRole] || [userRole];

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

    // 🔴 FIX: Safe map + filter
    const normalizedRoles = roles
      .map(role => normalizeRole(role))
      .filter(Boolean);

    const hasAccess = normalizedRoles.some(role => userAllowedRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of these roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

// 🔴 FIX: flatten allowedRoles
const authorize = (...allowedRoles) => {
  if (allowedRoles.length === 0) {
    allowedRoles = ['admin', 'super_admin'];
  }

  allowedRoles = allowedRoles.flat(); // 🔴 FIX

  return roleMiddleware(allowedRoles);
};

// Permissions
const rolePermissions = {
  super_admin: ['view_all', 'manage_all'],
  admin: ['view_all', 'manage_users'],
  hr: ['view_team'],
  manager: ['view_team'],
  supervisor: ['view_team'],
  technician: ['view_tasks'],
  accountant: ['view_invoices'],
  customer: ['view_own']
};

// Permission middleware
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = normalizeRole(req.user.role);

    if (userRole === 'super_admin') {
      return next();
    }

    const userPerms = rolePermissions[userRole] || [];

    if (userPerms.includes(permission) || userPerms.includes('manage_all')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Permission denied: ${permission} required`,
    });
  };
};

// Export
module.exports = {
  roleMiddleware,
  roleHierarchyMiddleware,
  authorize,
  checkPermission,
  roleHierarchy,
  normalizeRole
};