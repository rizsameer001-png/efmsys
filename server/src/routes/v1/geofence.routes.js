// server/src/routes/v1/geofence.routes.js
/**
 * GEOFENCE MANAGEMENT ROUTES
 * Handles geofence CRUD and location validation
 */

// const express = require('express');
// const router = express.Router();
// const geofenceController = require('../../controllers/geofence.controller');
// const authMiddleware = require('../../middleware/auth.middleware');
// const { roleMiddleware } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(authMiddleware);

// // Geofence CRUD (Admin only)
// router.post('/',
//   roleMiddleware(['admin', 'super_admin']),
//   geofenceController.createGeofence
// );

// router.get('/',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   geofenceController.getGeofences
// );

// router.get('/:id',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   geofenceController.getGeofenceById
// );

// router.put('/:id',
//   roleMiddleware(['admin', 'super_admin']),
//   geofenceController.updateGeofence
// );

// router.delete('/:id',
//   roleMiddleware(['admin', 'super_admin']),
//   geofenceController.deleteGeofence
// );

// // Geofence validation
// router.post('/check',
//   roleMiddleware(['technician', 'supervisor', 'manager']),
//   geofenceController.checkLocation
// );

// // Building-specific geofences
// router.get('/building/:buildingId',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   geofenceController.getGeofencesByBuilding
// );

// module.exports = router;


/**
 * GEOFENCE MANAGEMENT ROUTES
 * Handles geofence CRUD and location validation
 */

const express = require('express');
const router = express.Router();

// ✅ FIXED: Import middleware correctly
const authMiddlewareFile = require('../../middleware/auth.middleware');
const roleMiddlewareFile = require('../../middleware/role.middleware');

// ✅ Get the actual middleware functions
const protect = authMiddlewareFile.protect || authMiddlewareFile;
const roleMiddleware = roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;

// ✅ Fallback middleware if imports fail
const safeProtect = (req, res, next) => {
  if (typeof protect === 'function') {
    return protect(req, res, next);
  }
  console.warn('⚠️ Using fallback auth for geofence routes');
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dev-user', role: 'admin', name: 'Dev User' };
    req.userId = 'dev-user';
    req.userRole = 'admin';
    return next();
  }
  return res.status(401).json({ success: false, error: 'Authentication not configured' });
};

// ✅ Safe role checker
const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (typeof roleMiddleware === 'function') {
      return roleMiddleware(allowedRoles)(req, res, next);
    }
    // Fallback role check
    const userRole = req.user?.role;
    if (allowedRoles.includes(userRole) || userRole === 'super_admin') {
      return next();
    }
    return res.status(403).json({ 
      success: false, 
      error: `Access denied. Required role: ${allowedRoles.join(', ')}` 
    });
  };
};

const geofenceController = require('../../controllers/geofence.controller');

// All routes require authentication
router.use(safeProtect);

// ==================== GEOFENCE CRUD (Admin Only) ====================

// Create geofence
router.post('/',
  checkRole(['admin', 'super_admin']),
  geofenceController.createGeofence
);

// Get all geofences
router.get('/',
  checkRole(['manager', 'admin', 'super_admin']),
  geofenceController.getGeofences
);

// Get geofence by ID
router.get('/:id',
  checkRole(['manager', 'admin', 'super_admin']),
  geofenceController.getGeofenceById
);

// Update geofence
router.put('/:id',
  checkRole(['admin', 'super_admin']),
  geofenceController.updateGeofence
);

// Delete geofence
router.delete('/:id',
  checkRole(['admin', 'super_admin']),
  geofenceController.deleteGeofence
);

// ==================== GEOFENCE VALIDATION ====================

// Check if location is within any geofence
router.post('/check',
  checkRole(['technician', 'supervisor', 'manager', 'admin', 'super_admin']),
  geofenceController.checkLocation
);

// ==================== BUILDING-SPECIFIC GEOFENCES ====================

// Get geofences by building
router.get('/building/:buildingId',
  checkRole(['manager', 'admin', 'super_admin']),
  geofenceController.getGeofencesByBuilding
);

module.exports = router;