/**
 * TASK ROUTES
 * Defines all task-related API endpoints
 * Handles: CRUD operations, Assignment, Progress tracking, Verification
 */

const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { roleMiddleware } = require('../../middleware/role.middleware');
const { permissionMiddleware } = require('../../middleware/permission.middleware');

// ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
router.use(authMiddleware);

// ============================================================================
// TASK CRUD OPERATIONS
// ============================================================================

/**
 * @route   POST /api/v1/tasks
 * @desc    Create a new task
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.create'),
  taskController.createTask
);

/**
 * @route   GET /api/v1/tasks
 * @desc    Get all tasks with filters
 * @access  All authenticated users (filtered by role)
 */
router.get(
  '/',
  permissionMiddleware('task.read'),
  taskController.getTasks
);

/**
 * @route   GET /api/v1/tasks/my
 * @desc    Get tasks assigned to the logged-in technician
 * @access  Technician only
 */
router.get(
  '/my',
  roleMiddleware(['technician']),
  taskController.getMyTasks
);

/**
 * @route   GET /api/v1/tasks/overdue
 * @desc    Get tasks that have breached SLA
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/overdue',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  taskController.getOverdueTasks
);

/**
 * @route   GET /api/v1/tasks/statistics
 * @desc    Get task statistics for dashboard
 * @access  All authenticated users
 */
router.get(
  '/statistics',
  permissionMiddleware('task.read'),
  taskController.getTaskStatistics
);

/**
 * @route   GET /api/v1/tasks/available-technicians/:taskId
 * @desc    Get available technicians for task assignment
 * @access  Admin, Manager
 */
router.get(
  '/available-technicians/:taskId',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.getAvailableTechnicians
);

/**
 * @route   GET /api/v1/tasks/:id
 * @desc    Get task by ID with full details
 * @access  All authenticated users (role-based filtering)
 */
router.get(
  '/:id',
  permissionMiddleware('task.read'),
  taskController.getTaskById
);

/**
 * @route   PUT /api/v1/tasks/:id
 * @desc    Update task information
 * @access  Admin, Manager, Assigned Technician, Super Admin
 */
router.put(
  '/:id',
  roleMiddleware(['admin', 'manager', 'technician', 'super_admin']),
  permissionMiddleware('task.update'),
  taskController.updateTask
);

/**
 * @route   DELETE /api/v1/tasks/:id
 * @desc    Soft delete a task
 * @access  Admin, Super Admin only
 */
router.delete(
  '/:id',
  roleMiddleware(['admin', 'super_admin']),
  permissionMiddleware('task.delete'),
  taskController.deleteTask
);

// ============================================================================
// TASK ASSIGNMENT
// ============================================================================

/**
 * @route   POST /api/v1/tasks/:id/assign
 * @desc    Manually assign task to a technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/assign',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.assignTask
);

/**
 * @route   POST /api/v1/tasks/:id/auto-assign
 * @desc    Automatically assign task to best matching technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/auto-assign',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.autoAssignTask
);

/**
 * @route   POST /api/v1/tasks/:id/reassign
 * @desc    Reassign task to a different technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/reassign',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.assign'),
  taskController.reassignTask
);

/**
 * @route   GET /api/v1/tasks/:id/assignment-history
 * @desc    Get assignment history for a task
 * @access  Admin, Manager
 */
router.get(
  '/:id/assignment-history',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.read'),
  taskController.getAssignmentHistory
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId/workload
 * @desc    Get workload for a specific technician
 * @access  Admin, Manager
 */
router.get(
  '/technician/:technicianId/workload',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.read'),
  taskController.getTechnicianWorkload
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId/daily-progress
 * @desc    Get daily progress for a technician
 * @access  Admin, Manager
 */
router.get(
  '/technician/:technicianId/daily-progress',
  roleMiddleware(['admin', 'manager', 'super_admin']),
  permissionMiddleware('task.read'),
  taskController.getDailyProgress
);

// ============================================================================
// TASK PROGRESS & STATUS UPDATES
// ============================================================================

/**
 * @route   PUT /api/v1/tasks/:id/accept
 * @desc    Technician accepts the assigned task
 * @access  Technician only
 */
router.put(
  '/:id/accept',
  roleMiddleware(['technician']),
  taskController.acceptTask
);

/**
 * @route   PUT /api/v1/tasks/:id/start
 * @desc    Technician starts working on the task
 * @access  Technician only
 */
router.put(
  '/:id/start',
  roleMiddleware(['technician']),
  taskController.startTask
);

/**
 * @route   PUT /api/v1/tasks/:id/progress
 * @desc    Update task progress percentage
 * @access  Technician only
 */
router.put(
  '/:id/progress',
  roleMiddleware(['technician']),
  taskController.updateProgress
);

/**
 * @route   PUT /api/v1/tasks/:id/update-checklist
 * @desc    Update checklist item status
 * @access  Technician only
 */
router.put(
  '/:id/update-checklist',
  roleMiddleware(['technician']),
  taskController.updateChecklist
);

/**
 * @route   PUT /api/v1/tasks/:id/upload-evidence
 * @desc    Upload work evidence (images, videos)
 * @access  Technician only
 */
router.put(
  '/:id/upload-evidence',
  roleMiddleware(['technician']),
  taskController.uploadEvidence
);

/**
 * @route   PUT /api/v1/tasks/:id/complete
 * @desc    Technician marks task as completed
 * @access  Technician only
 */
router.put(
  '/:id/complete',
  roleMiddleware(['technician']),
  taskController.completeTask
);

/**
 * @route   PUT /api/v1/tasks/:id/verify
 * @desc    Supervisor/Manager verifies and closes the task
 * @access  Supervisor, Manager, Admin, Super Admin
 */
router.put(
  '/:id/verify',
  roleMiddleware(['supervisor', 'manager', 'admin', 'super_admin']),
  permissionMiddleware('task.approve'),
  taskController.verifyTask
);

/**
 * @route   PUT /api/v1/tasks/:id/reject
 * @desc    Supervisor/Manager rejects task for rework
 * @access  Supervisor, Manager, Admin, Super Admin
 */
router.put(
  '/:id/reject',
  roleMiddleware(['supervisor', 'manager', 'admin', 'super_admin']),
  permissionMiddleware('task.approve'),
  taskController.rejectTask
);

/**
 * @route   GET /api/v1/tasks/:id/progress
 * @desc    Get detailed progress for a task
 * @access  Assigned technician, supervisor, manager, admin
 */
router.get(
  '/:id/progress',
  roleMiddleware(['technician', 'supervisor', 'manager', 'admin']),
  taskController.getTaskProgress
);

// ============================================================================
// TASK FILTERS & UTILITIES
// ============================================================================

/**
 * @route   GET /api/v1/tasks/status/:status
 * @desc    Get tasks by status
 * @access  All authenticated users
 */
router.get(
  '/status/:status',
  permissionMiddleware('task.read'),
  taskController.getTasksByStatus
);

/**
 * @route   GET /api/v1/tasks/priority/:priority
 * @desc    Get tasks by priority
 * @access  All authenticated users
 */
router.get(
  '/priority/:priority',
  permissionMiddleware('task.read'),
  taskController.getTasksByPriority
);

/**
 * @route   GET /api/v1/tasks/building/:buildingId
 * @desc    Get tasks by building
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/building/:buildingId',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  permissionMiddleware('task.read'),
  taskController.getTasksByBuilding
);

/**
 * @route   GET /api/v1/tasks/technician/:technicianId
 * @desc    Get tasks by technician
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/technician/:technicianId',
  roleMiddleware(['manager', 'admin', 'super_admin']),
  permissionMiddleware('task.read'),
  taskController.getTasksByTechnician
);

// ============================================================================
// TASK EXPORT
// ============================================================================

/**
 * @route   GET /api/v1/tasks/export/csv
 * @desc    Export tasks to CSV
 * @access  Admin, Super Admin
 */
router.get(
  '/export/csv',
  roleMiddleware(['admin', 'super_admin']),
  permissionMiddleware('task.export'),
  taskController.exportTasksToCSV
);

module.exports = router;