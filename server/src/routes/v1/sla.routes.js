// // server/src/routes/v1/sla.routes.js
// /**
//  * SLA MONITORING ROUTES
//  * Handles SLA tracking, breach alerts, and escalation
//  */

// const express = require('express');
// const router = express.Router();
// const slaController = require('../../controllers/sla.controller');
// const authMiddleware = require('../../middleware/auth.middleware');
// const { roleMiddleware } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(authMiddleware);

// // SLA Dashboard and Monitoring
// router.get('/dashboard',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   slaController.getSLADashboard
// );

// router.get('/breached',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   slaController.getBreachedTasks
// );

// router.get('/at-risk',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   slaController.getAtRiskTasks
// );

// // SLA History
// router.get('/history/:taskId',
//   roleMiddleware(['manager', 'admin', 'super_admin']),
//   slaController.getSLAHistory
// );

// // Escalation
// router.post('/:taskId/escalate',
//   roleMiddleware(['manager', 'admin']),
//   slaController.escalateTask
// );

// // Reports
// router.get('/reports/monthly',
//   roleMiddleware(['manager', 'admin']),
//   slaController.getMonthlySLAReport
// );

// module.exports = router;


// /**
//  * SLA MONITORING ROUTES
//  * Handles SLA tracking, breach alerts, and escalation
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
//   console.warn('⚠️ Using fallback auth for SLA routes');
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
//     req.userId = 'dev-user';
//     req.userRole = 'super_admin';
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

// const slaController = require('../../controllers/sla.controller');

// // All routes require authentication
// router.use(safeProtect);

// // ==================== SLA DASHBOARD & MONITORING ====================

// // Get SLA Dashboard
// router.get('/dashboard',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getSLADashboard
// );

// // Get Breached Tasks
// router.get('/breached',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getBreachedTasks
// );

// // Get At-Risk Tasks
// router.get('/at-risk',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getAtRiskTasks
// );

// // ==================== SLA HISTORY ====================

// // Get SLA History for a Task
// router.get('/history/:taskId',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getSLAHistory
// );

// // ==================== ESCALATION ====================

// // Escalate Task
// router.post('/:taskId/escalate',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.escalateTask
// );

// // ==================== REPORTS ====================

// // Get Monthly SLA Report
// router.get('/reports/monthly',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getMonthlySLAReport
// );

// module.exports = router;




// /**
//  * SLA MONITORING ROUTES
//  * Handles SLA tracking, breach alerts, and escalation
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
//   console.warn('⚠️ Using fallback auth for SLA routes');
//   if (process.env.NODE_ENV === 'development') {
//     req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
//     req.userId = 'dev-user';
//     req.userRole = 'super_admin';
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

// const slaController = require('../../controllers/sla.controller');

// // All routes require authentication
// router.use(safeProtect);

// // ==================== SLA DASHBOARD & MONITORING ====================

// /**
//  * GET /api/v1/sla/dashboard
//  * Get SLA Dashboard with comprehensive statistics
//  * Query params: buildingId, department, priority
//  */
// router.get('/dashboard',
//   checkRole(['manager', 'admin', 'super_admin', 'technician']),
//   slaController.getSLADashboard
// );

// /**
//  * GET /api/v1/sla/breached
//  * Get all breached tasks with pagination
//  * Query params: buildingId, priority, page, limit
//  */
// router.get('/breached',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getBreachedTasks
// );

// /**
//  * GET /api/v1/sla/at-risk
//  * Get all at-risk tasks with pagination
//  * Query params: buildingId, priority, page, limit
//  */
// router.get('/at-risk',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getAtRiskTasks
// );

// // ==================== SLA HISTORY ====================

// /**
//  * GET /api/v1/sla/history
//  * Get all SLA history with pagination and filters
//  * Query params: startDate, endDate, page, limit
//  */
// router.get('/history',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getSLAHistory
// );

// /**
//  * GET /api/v1/sla/history/:taskId
//  * Get SLA history for a specific task
//  * Path params: taskId
//  */
// router.get('/history/:taskId',
//   checkRole(['manager', 'admin', 'super_admin', 'technician']),
//   slaController.getSLAHistory
// );

// // ==================== ESCALATION ====================

// /**
//  * POST /api/v1/sla/:taskId/escalate
//  * Escalate a task due to SLA breach or other reasons
//  * Path params: taskId
//  * Body: { reason, escalateTo }
//  */
// router.post('/:taskId/escalate',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.escalateTask
// );

// // ==================== REPORTS ====================

// /**
//  * GET /api/v1/sla/reports/monthly
//  * Get monthly SLA report with detailed breakdown
//  * Query params: year, month, buildingId, department
//  */
// router.get('/reports/monthly',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getMonthlySLAReport
// );

// /**
//  * GET /api/v1/sla/statistics
//  * Get SLA statistics and trend data
//  * Query params: buildingId, period (day, week, month, year)
//  */
// router.get('/statistics',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getSLAStatistics
// );

// /**
//  * GET /api/v1/sla/trends
//  * Get SLA trend data over time
//  * Query params: buildingId, period, limit
//  */
// router.get('/trends',
//   checkRole(['manager', 'admin', 'super_admin']),
//   slaController.getSLATrends
// );

// // ==================== HEALTH CHECK ====================

// /**
//  * GET /api/v1/sla/health
//  * Health check endpoint for SLA service
//  */
// router.get('/health',
//   checkRole(['manager', 'admin', 'super_admin']),
//   (req, res) => {
//     res.json({
//       success: true,
//       message: 'SLA service is running',
//       timestamp: new Date(),
//       endpoints: [
//         'GET /dashboard',
//         'GET /breached',
//         'GET /at-risk',
//         'GET /history',
//         'GET /history/:taskId',
//         'POST /:taskId/escalate',
//         'GET /reports/monthly',
//         'GET /statistics',
//         'GET /trends'
//       ]
//     });
//   }
// );

// module.exports = router;




/**
 * SLA MONITORING ROUTES
 * Handles SLA tracking, breach alerts, and escalation
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
  console.warn('⚠️ Using fallback auth for SLA routes');
  if (process.env.NODE_ENV === 'development') {
    req.user = { _id: 'dev-user', role: 'super_admin', name: 'Dev User' };
    req.userId = 'dev-user';
    req.userRole = 'super_admin';
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

const slaController = require('../../controllers/sla.controller');

// All routes require authentication
router.use(safeProtect);

// ==================== SLA DASHBOARD & MONITORING ====================

/**
 * GET /api/v1/sla/dashboard
 * Get SLA Dashboard with comprehensive statistics
 * Query params: buildingId, department, priority
 */
router.get('/dashboard',
  checkRole(['manager', 'admin', 'super_admin', 'technician']),
  slaController.getSLADashboard
);

/**
 * GET /api/v1/sla/summary
 * Get quick SLA summary for dashboard widgets
 * Query params: buildingId
 */
router.get('/summary',
  checkRole(['manager', 'admin', 'super_admin', 'technician']),
  slaController.getSLASummary
);

/**
 * GET /api/v1/sla/breached
 * Get all breached tasks with pagination
 * Query params: buildingId, priority, page, limit
 */
router.get('/breached',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.getBreachedTasks
);

/**
 * GET /api/v1/sla/at-risk
 * Get all at-risk tasks with pagination
 * Query params: buildingId, priority, page, limit
 */
router.get('/at-risk',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.getAtRiskTasks
);

// ==================== SLA HISTORY ====================

/**
 * GET /api/v1/sla/history
 * Get all SLA history with pagination and filters
 * Query params: startDate, endDate, page, limit
 */
router.get('/history',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.getSLAHistory
);

/**
 * GET /api/v1/sla/history/:taskId
 * Get SLA history for a specific task
 * Path params: taskId
 */
router.get('/history/:taskId',
  checkRole(['manager', 'admin', 'super_admin', 'technician']),
  slaController.getSLAHistory
);

// ==================== ESCALATION ====================

/**
 * POST /api/v1/sla/escalate/:taskId
 * Escalate a task due to SLA breach or other reasons
 * Path params: taskId
 * Body: { reason, escalateTo }
 */
router.post('/escalate/:taskId',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.escalateTask
);

// ==================== REPORTS ====================

/**
 * GET /api/v1/sla/reports/monthly
 * Get monthly SLA report with detailed breakdown
 * Query params: year, month, buildingId, department
 */
router.get('/reports/monthly',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.getMonthlySLAReport
);

/**
 * GET /api/v1/sla/reports/date-range
 * Get SLA report for custom date range
 * Query params: startDate, endDate, buildingId, department
 */
router.get('/reports/date-range',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.getDateRangeReport
);

/**
 * GET /api/v1/sla/reports/export
 * Export SLA report as CSV or JSON
 * Query params: year, month, format (csv/json), buildingId
 */
router.get('/reports/export',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.exportSLAReport
);

// ==================== STATISTICS & TRENDS ====================

/**
 * GET /api/v1/sla/statistics
 * Get SLA statistics and trend data
 * Query params: buildingId, period (day, week, month, year)
 */
router.get('/statistics',
  checkRole(['manager', 'admin', 'super_admin']),
  slaController.getSLAStatistics
);

/**
 * GET /api/v1/sla/trends
 * Get SLA trend data over time
 * Query params: buildingId, period, limit
 */
router.get('/trends',
  checkRole(['manager', 'admin', 'super_admin']),
  (req, res) => {
    // TODO: Implement getSLATrends in controller
    res.json({
      success: true,
      data: [],
      message: 'Trends endpoint - implementation pending'
    });
  }
);

// ==================== HEALTH CHECK ====================

/**
 * GET /api/v1/sla/health
 * Health check endpoint for SLA service
 */
router.get('/health',
  checkRole(['manager', 'admin', 'super_admin']),
  (req, res) => {
    res.json({
      success: true,
      message: 'SLA service is running',
      timestamp: new Date(),
      endpoints: [
        'GET /dashboard',
        'GET /summary',
        'GET /breached',
        'GET /at-risk',
        'GET /history',
        'GET /history/:taskId',
        'POST /escalate/:taskId',
        'GET /reports/monthly',
        'GET /reports/date-range',
        'GET /reports/export',
        'GET /statistics',
        'GET /trends',
        'GET /health'
      ]
    });
  }
);

module.exports = router;