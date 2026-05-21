// server/src/middleware/role.middleware.js
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of these roles: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// Role hierarchy for inheritance
const roleHierarchy = {
  super_admin: ['super_admin', 'admin', 'hr', 'manager', 'supervisor', 'technician', 'accountant'],
  admin: ['admin', 'manager', 'supervisor', 'technician'],
  hr: ['hr'],
  manager: ['manager', 'supervisor', 'technician'],
  supervisor: ['supervisor', 'technician'],
  technician: ['technician'],
  accountant: ['accountant'],
  customer: ['customer'],
};

const roleHierarchyMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = req.user.role;
    const userAllowedRoles = roleHierarchy[userRole] || [userRole];

    const hasAccess = allowedRoles.some(role => userAllowedRoles.includes(role));

    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        error: 'Access denied: Insufficient privileges',
      });
    }

    next();
  };
};

module.exports = { roleMiddleware, roleHierarchyMiddleware };