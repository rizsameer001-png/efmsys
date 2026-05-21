// // server/src/routes/v1/role.routes.js
// const express = require('express');
// const router = express.Router();
// const roleController = require('../../controllers/role.controller');
// const authMiddleware = require('../../middleware/auth.middleware');

// console.log('✅ Role Controller loaded, methods:', Object.keys(roleController));

// router.use(authMiddleware);

// router.get('/', roleController.getRoles);
// router.get('/permissions', roleController.getPermissions);
// router.get('/:id', roleController.getRoleById);
// router.post('/', roleController.createRole);
// router.put('/:id', roleController.updateRole);
// router.delete('/:id', roleController.deleteRole);
// router.post('/assign', roleController.assignRoleToUser);

// module.exports = router;


/**
 * ROLE ROUTES
 * Handles all role-related API endpoints
 * Features: CRUD operations, Permissions management, Role assignment
 */

const express = require('express');
const router = express.Router();

// Import middleware safely (handles both export types)
const authMiddlewareFile = require('../../middleware/auth.middleware');
const roleMiddlewareFile = require('../../middleware/role.middleware');

// Get protect function (handles default + named exports)
const protect = authMiddlewareFile.protect || authMiddlewareFile;
const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;

// Fallback middleware if imports fail
const safeProtect = (req, res, next) => {
  if (typeof protect === 'function') {
    return protect(req, res, next);
  }
  console.warn('⚠️ Using fallback auth - no token verification');
  // Simple mock authentication for development
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
    req.userId = 'dev-user';
    req.userRole = 'super_admin';
    return next();
  }
  return res.status(401).json({ success: false, error: 'Authentication not configured' });
};

const roleController = require('../../controllers/role.controller');

// Debug logging
console.log('✅ Role routes initialized');
console.log('   - protect middleware available:', typeof protect === 'function');
console.log('   - authorize middleware available:', typeof authorize === 'function');
console.log('   - Controller methods:', Object.keys(roleController).length);

// ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
router.use(safeProtect);

// ============================================================================
// ROLE CRUD OPERATIONS
// ============================================================================

/**
 * @route   GET /api/roles
 * @desc    Get all roles with pagination and filters
 * @access  Super Admin only
 */
router.get(
  '/',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.getRoles
);

/**
 * @route   GET /api/roles/permissions
 * @desc    Get all available permissions
 * @access  Super Admin only
 */
router.get(
  '/permissions',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.getPermissions
);

/**
 * @route   GET /api/roles/:id
 * @desc    Get single role by ID
 * @access  Super Admin only
 */
router.get(
  '/:id',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.getRoleById
);

/**
 * @route   POST /api/roles
 * @desc    Create a new role
 * @access  Super Admin only
 */
router.post(
  '/',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.createRole
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Update an existing role
 * @access  Super Admin only
 */
router.put(
  '/:id',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.updateRole
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Delete a role (soft delete)
 * @access  Super Admin only
 */
router.delete(
  '/:id',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.deleteRole
);

/**
 * @route   POST /api/roles/assign
 * @desc    Assign role to a user
 * @access  Super Admin only
 */
router.post(
  '/assign',
  (req, res, next) => {
    if (typeof authorize === 'function') {
      return authorize(['super_admin'])(req, res, next);
    }
    next();
  },
  roleController.assignRoleToUser
);

module.exports = router;