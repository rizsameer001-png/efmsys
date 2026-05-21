// server/src/routes/v1/tracking.routes.js
/**
 * GPS TRACKING ROUTES
 * Handles live location tracking and route history
 */

// const express = require('express');
// const router = express.Router();
// const trackingController = require('../../controllers/tracking.controller');
// const authMiddleware = require('../../middleware/auth.middleware');
// const { roleMiddleware } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(authMiddleware);

// // Live tracking (Technician)
// router.post('/update',
//   roleMiddleware(['technician']),
//   trackingController.updateLocation
// );

// // Live tracking (Manager/Supervisor view)
// router.get('/live',
//   roleMiddleware(['manager', 'supervisor', 'admin']),
//   trackingController.getLiveLocations
// );

// // Session management
// router.get('/session',
//   roleMiddleware(['technician']),
//   trackingController.getCurrentSession
// );

// router.post('/end-session',
//   roleMiddleware(['technician']),
//   trackingController.endSession
// );

// // Route history
// router.get('/history/:technicianId',
//   roleMiddleware(['manager', 'supervisor', 'admin']),
//   trackingController.getRouteHistory
// );

// // Technician tracking summary
// router.get('/technician/:technicianId/summary',
//   roleMiddleware(['manager', 'supervisor', 'admin']),
//   trackingController.getTechnicianTrackingSummary
// );

// module.exports = router;

// /**
//  * GPS TRACKING ROUTES
//  * Handles live location tracking and route history
//  */

// const express = require('express');
// const router = express.Router();

// // ✅ FIXED: Import middleware correctly
// const authMiddlewareFile = require('../../middleware/auth.middleware');
// const roleMiddlewareFile = require('../../middleware/role.middleware');

// // ✅ Get the actual middleware functions
// const protect = authMiddlewareFile.protect || authMiddlewareFile;
// const roleMiddleware = roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;

// // ✅ Fallback middleware if imports fail
// const safeProtect = (req, res, next) => {
//   if (typeof protect === 'function') {
//     return protect(req, res, next);
//   }
//   console.warn('⚠️ Using fallback auth for tracking routes');
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'technician', name: 'Dev User' };
//     req.userId = 'dev-user';
//     req.userRole = 'technician';
//     return next();
//   }
//   return res.status(401).json({ success: false, error: 'Authentication not configured' });
// };

// // ✅ Safe role checker
// const checkRole = (allowedRoles) => {
//   return (req, res, next) => {
//     if (typeof roleMiddleware === 'function') {
//       return roleMiddleware(allowedRoles)(req, res, next);
//     }
//     // Fallback role check
//     const userRole = req.user?.role;
//     if (allowedRoles.includes(userRole) || userRole === 'super_admin') {
//       return next();
//     }
//     return res.status(403).json({ 
//       success: false, 
//       error: `Access denied. Required role: ${allowedRoles.join(', ')}` 
//     });
//   };
// };

// const trackingController = require('../../controllers/tracking.controller');

// // All routes require authentication
// router.use(safeProtect);

// // ==================== LIVE TRACKING (Technician) ====================

// // Update live location
// router.post('/update',
//   checkRole(['technician']),
//   trackingController.updateLocation
// );

// // ==================== LIVE TRACKING VIEW (Manager/Supervisor) ====================

// // Get live locations of all technicians
// router.get('/live',
//   checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
//   trackingController.getLiveLocations
// );

// // ==================== SESSION MANAGEMENT ====================

// // Get current tracking session
// router.get('/session',
//   checkRole(['technician']),
//   trackingController.getCurrentSession
// );

// // End current tracking session
// router.post('/end-session',
//   checkRole(['technician']),
//   trackingController.endSession
// );

// // ==================== ROUTE HISTORY ====================

// // Get route history for a technician
// router.get('/history/:technicianId',
//   checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
//   trackingController.getRouteHistory
// );

// // ==================== TECHNICIAN SUMMARY ====================

// // Get tracking summary for a technician
// router.get('/technician/:technicianId/summary',
//   checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
//   trackingController.getTechnicianTrackingSummary
// );

// module.exports = router;







/**
 * GPS TRACKING ROUTES
 * Handles live location tracking and route history
 */

const express = require('express');
const router = express.Router();

// ✅ FIXED: Import middleware correctly
const authMiddlewareFile = require('../../middleware/auth.middleware');
const roleMiddlewareFile = require('../../middleware/role.middleware');

// ✅ Get the actual middleware functions
const protect = authMiddlewareFile.protect || authMiddlewareFile;
const roleMiddleware = roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;
const authorize = roleMiddlewareFile.authorize || roleMiddlewareFile.roleMiddleware || roleMiddlewareFile;

// ✅ Fallback middleware if imports fail
const safeProtect = (req, res, next) => {
  if (typeof protect === 'function') {
    return protect(req, res, next);
  }
  console.warn('⚠️ Using fallback auth for tracking routes');
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dev-user', role: 'technician', name: 'Dev User' };
    req.userId = 'dev-user';
    req.userRole = 'technician';
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

const trackingController = require('../../controllers/tracking.controller');

// All routes require authentication
router.use(safeProtect);

// ==================== LIVE TRACKING (Technician) ====================

// Update live location
router.post('/update',
  checkRole(['technician']),
  trackingController.updateLocation
);

// Start tracking session
router.post('/start-session',
  checkRole(['technician']),
  trackingController.startSession
);

// ==================== LIVE TRACKING VIEW (Manager/Supervisor) ====================

// Get live locations of all technicians
router.get('/live',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getLiveLocations
);

// Get live location of specific technician
router.get('/live/:technicianId',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getTechnicianLiveLocation
);

// ==================== SESSION MANAGEMENT ====================

// Get current tracking session
router.get('/session',
  checkRole(['technician']),
  trackingController.getCurrentSession
);

// End current tracking session (also handles the end-session endpoint)
router.post('/end-session',
  checkRole(['technician']),
  trackingController.endSession
);

// ==================== ROUTE HISTORY ====================

// Get route history for current technician
router.get('/history',
  checkRole(['technician']),
  trackingController.getMyRouteHistory
);

// Get route history for a specific technician (Manager/Supervisor)
router.get('/history/:technicianId',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getRouteHistory
);

// Get route history by date range
router.get('/history/:technicianId/date-range',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getRouteHistoryByDateRange
);

// ==================== TECHNICIAN SUMMARY ====================

// Get tracking summary for current technician
router.get('/my-summary',
  checkRole(['technician']),
  trackingController.getMyTrackingSummary
);

// Get tracking summary for a technician (Manager/Supervisor)
router.get('/technician/:technicianId/summary',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getTechnicianTrackingSummary
);

// Get all technicians tracking summary (Manager/Supervisor)
router.get('/summary/all',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getAllTechniciansSummary
);

// ==================== VISITOR TRACKING (Security) ====================

// Track visitor movement within property
router.post('/visitor',
  checkRole(['security', 'admin', 'super_admin']),
  trackingController.trackVisitor
);

// Get visitor tracking history
router.get('/visitor/:visitorId',
  checkRole(['security', 'admin', 'super_admin']),
  trackingController.getVisitorTrackingHistory
);

// ==================== ADMIN DASHBOARD ====================

// Get tracking dashboard statistics
router.get('/dashboard/stats',
  checkRole(['admin', 'super_admin']),
  trackingController.getTrackingDashboardStats
);

// Get active tracking sessions count
router.get('/active-count',
  checkRole(['admin', 'super_admin', 'manager']),
  trackingController.getActiveSessionsCount
);

// ==================== UTILITY ENDPOINTS ====================

// Get distance traveled for a technician
router.get('/distance/:technicianId',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getDistanceTraveled
);

// Get last known location of a technician
router.get('/last-location/:technicianId',
  checkRole(['manager', 'supervisor', 'admin', 'super_admin']),
  trackingController.getLastKnownLocation
);

module.exports = router;