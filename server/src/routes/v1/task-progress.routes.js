// server/src/routes/v1/task-progress.routes.js
/**
 * TASK PROGRESS ROUTES
 * Handles start, pause, resume, complete operations
 */

// const express = require('express');
// const router = express.Router();
// const taskProgressController = require('../../controllers/task-progress.controller');
// const authMiddleware = require('../../middleware/auth.middleware');
// const { roleMiddleware } = require('../../middleware/role.middleware');

// // All routes require authentication
// router.use(authMiddleware);

// // Technician actions
// router.put('/:taskId/accept',
//   roleMiddleware(['technician']),
//   taskProgressController.acceptTask
// );

// router.put('/:taskId/start',
//   roleMiddleware(['technician']),
//   taskProgressController.startTask
// );

// router.put('/:taskId/pause',
//   roleMiddleware(['technician']),
//   taskProgressController.pauseTask
// );

// router.put('/:taskId/resume',
//   roleMiddleware(['technician']),
//   taskProgressController.resumeTask
// );

// router.put('/:taskId/update-checklist',
//   roleMiddleware(['technician']),
//   taskProgressController.updateChecklist
// );

// router.put('/:taskId/upload-evidence',
//   roleMiddleware(['technician']),
//   taskProgressController.uploadEvidence
// );

// router.put('/:taskId/complete',
//   roleMiddleware(['technician']),
//   taskProgressController.completeTask
// );

// // Verification actions (Supervisor/Manager)
// router.put('/:taskId/verify',
//   roleMiddleware(['supervisor', 'manager']),
//   taskProgressController.verifyTask
// );

// router.put('/:taskId/reject',
//   roleMiddleware(['supervisor', 'manager']),
//   taskProgressController.rejectTask
// );

// // Progress tracking
// router.get('/:taskId/progress',
//   roleMiddleware(['technician', 'supervisor', 'manager']),
//   taskProgressController.getTaskProgress
// );

// router.get('/technician/:technicianId/daily',
//   roleMiddleware(['technician', 'supervisor', 'manager']),
//   taskProgressController.getDailyProgress
// );

// module.exports = router;


/**
 * TASK PROGRESS ROUTES
 * Handles start, pause, resume, complete operations
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
  console.warn('⚠️ Using fallback auth for task-progress routes');
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
    if (allowedRoles.includes(req.user?.role)) {
      return next();
    }
    return res.status(403).json({ success: false, error: 'Access denied' });
  };
};

const taskProgressController = require('../../controllers/task-progress.controller');

// All routes require authentication
router.use(safeProtect);

// ==================== TECHNICIAN ACTIONS ====================

// Accept Task
router.put('/:taskId/accept',
  checkRole(['technician']),
  taskProgressController.acceptTask
);

// Start Task
router.put('/:taskId/start',
  checkRole(['technician']),
  taskProgressController.startTask
);

// Pause Task
router.put('/:taskId/pause',
  checkRole(['technician']),
  taskProgressController.pauseTask
);

// Resume Task
router.put('/:taskId/resume',
  checkRole(['technician']),
  taskProgressController.resumeTask
);

// Update Checklist
router.put('/:taskId/update-checklist',
  checkRole(['technician']),
  taskProgressController.updateChecklist
);

// Upload Evidence
router.put('/:taskId/upload-evidence',
  checkRole(['technician']),
  taskProgressController.uploadEvidence
);

// Complete Task
router.put('/:taskId/complete',
  checkRole(['technician']),
  taskProgressController.completeTask
);

// ==================== VERIFICATION ACTIONS ====================

// Verify Task (Supervisor/Manager)
router.put('/:taskId/verify',
  checkRole(['supervisor', 'manager', 'admin', 'super_admin']),
  taskProgressController.verifyTask
);

// Reject Task (Supervisor/Manager)
router.put('/:taskId/reject',
  checkRole(['supervisor', 'manager', 'admin', 'super_admin']),
  taskProgressController.rejectTask
);

// ==================== PROGRESS TRACKING ====================

// Get Task Progress
router.get('/:taskId/progress',
  checkRole(['technician', 'supervisor', 'manager', 'admin', 'super_admin']),
  taskProgressController.getTaskProgress
);

// Get Technician Daily Progress
router.get('/technician/:technicianId/daily',
  checkRole(['technician', 'supervisor', 'manager', 'admin', 'super_admin']),
  taskProgressController.getDailyProgress
);

// Update Progress (Technician)
router.put('/:taskId/progress',
  checkRole(['technician']),
  taskProgressController.updateProgress
);

module.exports = router;