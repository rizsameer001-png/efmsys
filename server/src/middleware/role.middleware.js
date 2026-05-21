// /**
//  * ROLE MIDDLEWARE
//  * Handles role-based access control for routes
//  */

// // Simple role middleware - checks if user role is in allowed roles
// const roleMiddleware = (allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({
//         success: false,
//         error: 'Authentication required',
//       });
//     }

//     // Convert to array if string is passed
//     const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         success: false,
//         error: `Access denied. Requires one of these roles: ${roles.join(', ')}`,
//       });
//     }

//     next();
//   };
// };

// // Role hierarchy for inheritance
// const roleHierarchy = {
//   super_admin: ['super_admin', 'admin', 'hr', 'manager', 'supervisor', 'technician', 'accountant', 'customer'],
//   admin: ['admin', 'manager', 'supervisor', 'technician'],
//   hr: ['hr'],
//   manager: ['manager', 'supervisor', 'technician'],
//   supervisor: ['supervisor', 'technician'],
//   technician: ['technician'],
//   accountant: ['accountant'],
//   customer: ['customer'],
// };

// // Role hierarchy middleware - checks if user has sufficient privileges based on hierarchy
// const roleHierarchyMiddleware = (allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ success: false, error: 'Authentication required' });
//     }

//     const userRole = req.user.role;
//     const userAllowedRoles = roleHierarchy[userRole] || [userRole];
//     const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

//     const hasAccess = roles.some(role => userAllowedRoles.includes(role));

//     if (!hasAccess) {
//       return res.status(403).json({
//         success: false,
//         error: 'Access denied: Insufficient privileges',
//       });
//     }

//     next();
//   };
// };

// // ✅ NEW: Authorize function (alias for roleMiddleware - used in routes)
// const authorize = (allowedRoles) => {
//   return roleMiddleware(allowedRoles);
// };

// // ✅ NEW: Check permission middleware (for granular permissions)
// const checkPermission = (permission) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ success: false, error: 'Authentication required' });
//     }

//     // Super admin has all permissions
//     if (req.user.role === 'super_admin') {
//       return next();
//     }

//     // Define role-based permissions
//     const rolePermissions = {
//       admin: ['view_all', 'manage_users', 'manage_buildings', 'manage_roles'],
//       manager: ['view_team', 'manage_tasks', 'view_reports'],
//       supervisor: ['view_team', 'assign_tasks', 'verify_work'],
//       technician: ['view_tasks', 'update_status', 'upload_evidence'],
//       accountant: ['view_invoices', 'process_payments'],
//       customer: ['view_own', 'create_complaints']
//     };

//     const userPermissions = rolePermissions[req.user.role] || [];
    
//     if (userPermissions.includes(permission) || userPermissions.includes('*')) {
//       return next();
//     }

//     return res.status(403).json({
//       success: false,
//       error: `Permission denied: ${permission} required`,
//     });
//   };
// };

// // ✅ NEW: Check if user can access a specific resource (user, building, etc.)
// const canAccessResource = (resourceType, getResourceId) => {
//   return async (req, res, next) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ success: false, error: 'Authentication required' });
//       }

//       // Super admin can access everything
//       if (req.user.role === 'super_admin') {
//         return next();
//       }

//       const resourceId = typeof getResourceId === 'function' ? getResourceId(req) : req.params.id;
      
//       // For users: check if user is accessing their own data
//       if (resourceType === 'user') {
//         if (req.user._id.toString() === resourceId) {
//           return next();
//         }
        
//         // Managers can access their team members
//         if (req.user.role === 'manager') {
//           const User = require('../models/User.model');
//           const targetUser = await User.findById(resourceId);
//           if (targetUser && targetUser.reportingManager?.toString() === req.user._id.toString()) {
//             return next();
//           }
//         }
//       }

//       // For buildings: check if user has access to this building
//       if (resourceType === 'building') {
//         if (req.user.assignedBuildings && req.user.assignedBuildings.includes(resourceId)) {
//           return next();
//         }
//       }

//       return res.status(403).json({
//         success: false,
//         error: 'Access denied: You do not have permission to access this resource',
//       });
//     } catch (error) {
//       console.error('Resource access error:', error);
//       return res.status(500).json({ success: false, error: 'Internal server error' });
//     }
//   };
// };

// // ✅ NEW: Check building access middleware
// const canAccessBuilding = (buildingIdParam = 'buildingId') => {
//   return async (req, res, next) => {
//     try {
//       if (!req.user) {
//         return res.status(401).json({ success: false, error: 'Authentication required' });
//       }

//       // Super admin can access all buildings
//       if (req.user.role === 'super_admin') {
//         return next();
//       }

//       const buildingId = req.params[buildingIdParam] || req.body.buildingId || req.query.buildingId;
      
//       if (!buildingId) {
//         return next(); // No building restriction
//       }

//       // Check if user has access to this building
//       if (req.user.assignedBuildings && req.user.assignedBuildings.includes(buildingId)) {
//         return next();
//       }

//       // Managers can access their assigned building
//       if (req.user.role === 'manager' && req.user.buildingId?.toString() === buildingId) {
//         return next();
//       }

//       return res.status(403).json({
//         success: false,
//         error: 'Access denied: You do not have permission to access this building',
//       });
//     } catch (error) {
//       console.error('Building access error:', error);
//       return res.status(500).json({ success: false, error: 'Internal server error' });
//     }
//   };
// };

// module.exports = {
//   roleMiddleware,
//   roleHierarchyMiddleware,
//   authorize,           // ✅ Used in routes
//   checkPermission,     // ✅ For granular permissions
//   canAccessResource,   // ✅ For resource-level access
//   canAccessBuilding,   // ✅ For building-level access
//   roleHierarchy        // ✅ Export hierarchy for reference
// };




/**
 * ROLE MIDDLEWARE
 * Handles role-based access control for routes
 * 
 * Role names (consistent across application):
 * - super_admin
 * - admin
 * - hr
 * - manager
 * - supervisor
 * - technician
 * - accountant
 * - customer
 */

// Role name mapping for legacy/alternative names
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

// Normalize role name to standard format
const normalizeRole = (role) => {
  if (!role) return role;
  const lowerRole = role.toLowerCase();
  return roleAliases[lowerRole] || lowerRole;
};

// Simple role middleware - checks if user role is in allowed roles
const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    // Normalize user role
    const userRole = normalizeRole(req.user.role);
    
    // Convert to array if string is passed
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Also normalize allowed roles
    const normalizedAllowedRoles = roles.map(role => normalizeRole(role));

    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Requires one of these roles: ${roles.join(', ')}`,
      });
    }

    next();
  };
};

// Role hierarchy for inheritance
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

// Role hierarchy middleware - checks if user has sufficient privileges based on hierarchy
const roleHierarchyMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = normalizeRole(req.user.role);
    const userAllowedRoles = roleHierarchy[userRole] || [userRole];
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    
    // Normalize allowed roles for comparison
    const normalizedRoles = roles.map(role => normalizeRole(role));

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

// Authorize function (alias for roleMiddleware - used in routes)
const authorize = (allowedRoles) => {
  return roleMiddleware(allowedRoles);
};

// Role-based permission matrix
const rolePermissions = {
  super_admin: [
    'view_all', 'manage_all', 'manage_users', 'manage_roles', 'manage_buildings',
    'manage_tasks', 'manage_complaints', 'manage_attendance', 'manage_payroll',
    'manage_leave', 'view_reports', 'manage_chat_settings', 'manage_system'
  ],
  admin: [
    'view_all', 'manage_users', 'manage_buildings', 'manage_roles',
    'manage_tasks', 'manage_complaints', 'manage_attendance', 'view_reports',
    'manage_leave', 'manage_chat_settings'
  ],
  hr: [
    'view_team', 'manage_attendance', 'manage_leave', 'view_payroll',
    'manage_recruitment', 'view_reports_hr'
  ],
  manager: [
    'view_team', 'manage_tasks', 'manage_complaints', 'view_attendance',
    'approve_leave', 'view_reports', 'manage_subtasks'
  ],
  supervisor: [
    'view_team', 'assign_tasks', 'verify_work', 'view_attendance',
    'approve_leave_team', 'upload_evidence'
  ],
  technician: [
    'view_tasks', 'update_task_status', 'upload_evidence', 'request_approval',
    'view_own_attendance', 'apply_leave'
  ],
  accountant: [
    'view_invoices', 'process_payments', 'view_payroll', 'generate_reports'
  ],
  customer: [
    'view_own', 'create_complaints', 'track_complaints', 'view_payments',
    'request_service', 'chat_support'
  ]
};

// Check permission middleware (for granular permissions)
const checkPermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = normalizeRole(req.user.role);

    // Super admin has all permissions
    if (userRole === 'super_admin') {
      return next();
    }

    const userPerms = rolePermissions[userRole] || [];
    
    if (userPerms.includes(permission) || userPerms.includes('*') || userPerms.includes('manage_all')) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: `Permission denied: ${permission} required`,
    });
  };
};

// Check if user has any of the required permissions
const checkAnyPermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const userRole = normalizeRole(req.user.role);

    // Super admin has all permissions
    if (userRole === 'super_admin') {
      return next();
    }

    const userPerms = rolePermissions[userRole] || [];
    
    const hasPermission = permissions.some(perm => 
      userPerms.includes(perm) || userPerms.includes('*') || userPerms.includes('manage_all')
    );

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        error: `Permission denied. Requires one of: ${permissions.join(', ')}`,
      });
    }

    next();
  };
};

// Check if user can access a specific resource (user, building, etc.)
const canAccessResource = (resourceType, getResourceId) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      const userRole = normalizeRole(req.user.role);

      // Super admin can access everything
      if (userRole === 'super_admin') {
        return next();
      }

      const resourceId = typeof getResourceId === 'function' ? getResourceId(req) : req.params.id;
      
      // For users: check if user is accessing their own data
      if (resourceType === 'user') {
        if (req.user._id.toString() === resourceId) {
          return next();
        }
        
        // Managers can access their team members
        if (userRole === 'manager') {
          const User = require('../models/User.model');
          const targetUser = await User.findById(resourceId);
          if (targetUser && targetUser.reportingManager?.toString() === req.user._id.toString()) {
            return next();
          }
        }
        
        // Supervisors can access their team members
        if (userRole === 'supervisor') {
          const User = require('../models/User.model');
          const targetUser = await User.findById(resourceId);
          if (targetUser && targetUser.supervisor?.toString() === req.user._id.toString()) {
            return next();
          }
        }
      }

      // For buildings: check if user has access to this building
      if (resourceType === 'building') {
        if (req.user.assignedBuildings && req.user.assignedBuildings.includes(resourceId)) {
          return next();
        }
      }

      // For tasks: check if task is assigned to user or their team
      if (resourceType === 'task') {
        const Task = require('../models/Task.model');
        const task = await Task.findById(resourceId);
        if (task) {
          if (task.assignedTo?.toString() === req.user._id.toString()) {
            return next();
          }
          if (userRole === 'manager' && task.managerId?.toString() === req.user._id.toString()) {
            return next();
          }
          if (userRole === 'supervisor' && task.supervisorId?.toString() === req.user._id.toString()) {
            return next();
          }
        }
      }

      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not have permission to access this resource',
      });
    } catch (error) {
      console.error('Resource access error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
};

// Check building access middleware
const canAccessBuilding = (buildingIdParam = 'buildingId') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      const userRole = normalizeRole(req.user.role);

      // Super admin can access all buildings
      if (userRole === 'super_admin') {
        return next();
      }

      const buildingId = req.params[buildingIdParam] || req.body.buildingId || req.query.buildingId;
      
      if (!buildingId) {
        return next(); // No building restriction
      }

      // Check if user has access to this building
      if (req.user.assignedBuildings && req.user.assignedBuildings.includes(buildingId)) {
        return next();
      }

      // Managers can access their assigned building
      if (userRole === 'manager' && req.user.buildingId?.toString() === buildingId) {
        return next();
      }

      return res.status(403).json({
        success: false,
        error: 'Access denied: You do not have permission to access this building',
      });
    } catch (error) {
      console.error('Building access error:', error);
      return res.status(500).json({ success: false, error: 'Internal server error' });
    }
  };
};

// Get user's accessible roles (for dropdowns, etc.)
const getAccessibleRoles = (userRole) => {
  const normalizedRole = normalizeRole(userRole);
  const hierarchy = roleHierarchy[normalizedRole] || [normalizedRole];
  return hierarchy;
};

// Check if a role can manage another role
const canManageRole = (managerRole, targetRole) => {
  const accessibleRoles = getAccessibleRoles(managerRole);
  return accessibleRoles.includes(normalizeRole(targetRole));
};

// Get permission set for a role
const getPermissionsForRole = (role) => {
  const normalizedRole = normalizeRole(role);
  return rolePermissions[normalizedRole] || [];
};

module.exports = {
  roleMiddleware,
  roleHierarchyMiddleware,
  authorize,           // Used in routes
  checkPermission,     // For granular permissions
  checkAnyPermission,  // Check if user has any of multiple permissions
  canAccessResource,   // For resource-level access
  canAccessBuilding,   // For building-level access
  roleHierarchy,       // Export hierarchy for reference
  normalizeRole,       // Export role normalization function
  getAccessibleRoles,  // Get roles a user can manage
  canManageRole,       // Check if role can manage another role
  getPermissionsForRole // Get permissions for a role
};