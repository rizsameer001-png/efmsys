/**
 * TASK ROUTES
 * Defines all task-related API endpoints
 * Handles: CRUD operations, Assignment, Progress tracking, Verification
 */

const express = require('express');
const router = express.Router();
// ✅ FIXED: Correct path to middleware
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const {
  // Core CRUD
  createTask,
  getTasks,
  getTaskList,
  getMyTasks,
  getTaskById,
  updateTask,
  deleteTask,
  
  // Assignment
  assignTask,
  autoAssignTask,
  reassignTask,
  getAssignmentHistory,
  getTechnicianWorkload,
  getDailyProgress,
  
  // Progress & Status
  acceptTask,
  startTask,
  updateProgress,
  updateChecklist,
  uploadEvidence,
  completeTask,
  verifyTask,
  rejectTask,
  getTaskProgress,
  
  // Filters & Utilities
  getTasksByStatus,
  getTasksByPriority,
  getTasksByBuilding,
  getTasksByTechnician,
  getOverdueTasks,
  getTaskStatistics,
  getAvailableTechnicians,
  
  // Export
  exportTasksToCSV
} = require('../../controllers/task.controller');

// ==================== ALL ROUTES REQUIRE AUTHENTICATION ====================
router.use(protect);

// ============================================================================
// TASK CRUD OPERATIONS
// ============================================================================

/**
 * @route   POST /api/tasks
 * @desc    Create a new task
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/',
  authorize('super_admin', 'admin', 'manager'),
  createTask
);

/**
 * @route   GET /api/tasks/list
 * @desc    Get all tasks with filters (main list endpoint)
 * @access  All authenticated users (filtered by role)
 */
router.get(
  '/list',
  getTaskList
);

/**
 * @route   GET /api/tasks
 * @desc    Get all tasks with filters (alternative)
 * @access  All authenticated users (filtered by role)
 */
router.get(
  '/',
  getTasks
);

/**
 * @route   GET /api/tasks/my
 * @desc    Get tasks assigned to the logged-in technician
 * @access  Technician only
 */
router.get(
  '/my',
  authorize('technician'),
  getMyTasks
);

/**
 * @route   GET /api/tasks/overdue
 * @desc    Get tasks that have breached SLA
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/overdue',
  authorize('super_admin', 'admin', 'manager'),
  getOverdueTasks
);

/**
 * @route   GET /api/tasks/statistics
 * @desc    Get task statistics for dashboard
 * @access  All authenticated users
 */
router.get(
  '/statistics',
  getTaskStatistics
);

/**
 * @route   GET /api/tasks/available-technicians/:taskId
 * @desc    Get available technicians for task assignment
 * @access  Admin, Manager
 */
router.get(
  '/available-technicians/:taskId',
  authorize('super_admin', 'admin', 'manager'),
  getAvailableTechnicians
);

/**
 * @route   GET /api/tasks/:id
 * @desc    Get task by ID with full details
 * @access  All authenticated users (role-based filtering)
 */
router.get(
  '/:id',
  getTaskById
);

/**
 * @route   PUT /api/tasks/:id
 * @desc    Update task information
 * @access  Admin, Manager, Assigned Technician, Super Admin
 */
router.put(
  '/:id',
  authorize('super_admin', 'admin', 'manager', 'technician'),
  updateTask
);

/**
 * @route   DELETE /api/tasks/:id
 * @desc    Soft delete a task
 * @access  Admin, Super Admin only
 */
router.delete(
  '/:id',
  authorize('super_admin', 'admin'),
  deleteTask
);

// ============================================================================
// TASK ASSIGNMENT
// ============================================================================

/**
 * @route   POST /api/tasks/:id/assign
 * @desc    Manually assign task to a technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/assign',
  authorize('super_admin', 'admin', 'manager'),
  assignTask
);

/**
 * @route   POST /api/tasks/:id/auto-assign
 * @desc    Automatically assign task to best matching technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/auto-assign',
  authorize('super_admin', 'admin', 'manager'),
  autoAssignTask
);

/**
 * @route   POST /api/tasks/:id/reassign
 * @desc    Reassign task to a different technician
 * @access  Admin, Manager, Super Admin
 */
router.post(
  '/:id/reassign',
  authorize('super_admin', 'admin', 'manager'),
  reassignTask
);

/**
 * @route   GET /api/tasks/:id/assignment-history
 * @desc    Get assignment history for a task
 * @access  Admin, Manager
 */
router.get(
  '/:id/assignment-history',
  authorize('super_admin', 'admin', 'manager'),
  getAssignmentHistory
);

/**
 * @route   GET /api/tasks/technician/:technicianId/workload
 * @desc    Get workload for a specific technician
 * @access  Admin, Manager
 */
router.get(
  '/technician/:technicianId/workload',
  authorize('super_admin', 'admin', 'manager'),
  getTechnicianWorkload
);

/**
 * @route   GET /api/tasks/technician/:technicianId/daily-progress
 * @desc    Get daily progress for a technician
 * @access  Admin, Manager
 */
router.get(
  '/technician/:technicianId/daily-progress',
  authorize('super_admin', 'admin', 'manager'),
  getDailyProgress
);

// ============================================================================
// TASK PROGRESS & STATUS UPDATES
// ============================================================================

/**
 * @route   PUT /api/tasks/:id/accept
 * @desc    Technician accepts the assigned task
 * @access  Technician only
 */
router.put(
  '/:id/accept',
  authorize('technician'),
  acceptTask
);

/**
 * @route   PUT /api/tasks/:id/start
 * @desc    Technician starts working on the task
 * @access  Technician only
 */
router.put(
  '/:id/start',
  authorize('technician'),
  startTask
);

/**
 * @route   PUT /api/tasks/:id/progress
 * @desc    Update task progress percentage
 * @access  Technician only
 */
router.put(
  '/:id/progress',
  authorize('technician'),
  updateProgress
);

/**
 * @route   PUT /api/tasks/:id/update-checklist
 * @desc    Update checklist item status
 * @access  Technician only
 */
router.put(
  '/:id/update-checklist',
  authorize('technician'),
  updateChecklist
);

/**
 * @route   PUT /api/tasks/:id/upload-evidence
 * @desc    Upload work evidence (images, videos)
 * @access  Technician only
 */
router.put(
  '/:id/upload-evidence',
  authorize('technician'),
  uploadEvidence
);

/**
 * @route   PUT /api/tasks/:id/complete
 * @desc    Technician marks task as completed
 * @access  Technician only
 */
router.put(
  '/:id/complete',
  authorize('technician'),
  completeTask
);

/**
 * @route   PUT /api/tasks/:id/verify
 * @desc    Supervisor/Manager verifies and closes the task
 * @access  Supervisor, Manager, Admin, Super Admin
 */
router.put(
  '/:id/verify',
  authorize('super_admin', 'admin', 'manager', 'supervisor'),
  verifyTask
);

/**
 * @route   PUT /api/tasks/:id/reject
 * @desc    Supervisor/Manager rejects task for rework
 * @access  Supervisor, Manager, Admin, Super Admin
 */
router.put(
  '/:id/reject',
  authorize('super_admin', 'admin', 'manager', 'supervisor'),
  rejectTask
);

/**
 * @route   GET /api/tasks/:id/progress
 * @desc    Get detailed progress for a task
 * @access  Assigned technician, supervisor, manager, admin
 */
router.get(
  '/:id/progress',
  authorize('technician', 'super_admin', 'admin', 'manager', 'supervisor'),
  getTaskProgress
);

// ============================================================================
// TASK FILTERS & UTILITIES
// ============================================================================

/**
 * @route   GET /api/tasks/status/:status
 * @desc    Get tasks by status
 * @access  All authenticated users
 */
router.get(
  '/status/:status',
  getTasksByStatus
);

/**
 * @route   GET /api/tasks/priority/:priority
 * @desc    Get tasks by priority
 * @access  All authenticated users
 */
router.get(
  '/priority/:priority',
  getTasksByPriority
);

/**
 * @route   GET /api/tasks/building/:buildingId
 * @desc    Get tasks by building
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/building/:buildingId',
  authorize('super_admin', 'admin', 'manager'),
  getTasksByBuilding
);

/**
 * @route   GET /api/tasks/technician/:technicianId
 * @desc    Get tasks by technician
 * @access  Manager, Admin, Super Admin
 */
router.get(
  '/technician/:technicianId',
  authorize('super_admin', 'admin', 'manager'),
  getTasksByTechnician
);

// ============================================================================
// TASK EXPORT
// ============================================================================

/**
 * @route   GET /api/tasks/export/csv
 * @desc    Export tasks to CSV
 * @access  Admin, Super Admin
 */
router.get(
  '/export/csv',
  authorize('super_admin', 'admin'),
  exportTasksToCSV
);

module.exports = router;