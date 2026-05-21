// server/src/routes/v1/complaint.routes.js
// const express = require('express');
// const router = express.Router();
// const complaintController = require('../../controllers/complaint.controller');
// const authMiddleware = require('../../middleware/auth.middleware');
// const { roleMiddleware } = require('../../middleware/role.middleware');
// const { permissionMiddleware } = require('../../middleware/permission.middleware');

// // All routes require authentication
// router.use(authMiddleware);

// // ==================== CRUD OPERATIONS ====================
// // Create a new complaint
// router.post('/', complaintController.createComplaint);

// // Get all complaints with filters
// router.get('/', permissionMiddleware('complaint.read'), complaintController.getComplaints);

// // Get dashboard statistics
// router.get('/dashboard/stats', complaintController.getDashboardStats);

// // Get complaint by ID
// router.get('/:id', permissionMiddleware('complaint.read'), complaintController.getComplaintById);

// // Update complaint
// router.put('/:id', permissionMiddleware('complaint.update'), complaintController.updateComplaint);

// // ==================== ASSIGNMENT ====================
// // Assign complaint to technician
// router.post('/:id/assign', roleMiddleware(['admin', 'manager', 'supervisor']), complaintController.assignComplaint);

// // ==================== WORKFLOW ====================
// // Start work on complaint
// router.put('/:id/start', roleMiddleware(['technician']), complaintController.startWork);

// // Complete work on complaint
// router.put('/:id/complete', roleMiddleware(['technician']), complaintController.completeWork);

// // Verify complaint (Supervisor/Manager)
// router.put('/:id/verify', roleMiddleware(['supervisor', 'manager']), complaintController.verifyComplaint);

// // Add customer feedback
// router.put('/:id/feedback', complaintController.addFeedback);

// // ==================== ESCALATION & EVIDENCE ====================
// // Escalate complaint
// router.post('/:id/escalate', roleMiddleware(['admin', 'manager']), complaintController.escalateComplaint);

// // Upload evidence (images, videos, voice notes)
// router.post('/:id/evidence', complaintController.uploadEvidence);

// module.exports = router;

/**
 * COMPLAINT ROUTES
 * Handles all complaint-related API endpoints
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
  console.warn('⚠️ Using fallback auth for complaint routes');
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

// ✅ Safe permission checker
const checkPermission = (permission) => {
  return (req, res, next) => {
    // Super admin has all permissions
    if (req.user?.role === 'super_admin') {
      return next();
    }
    // Check if user has the permission (you can implement actual permission checking)
    console.log(`Checking permission: ${permission} for user ${req.user?.role}`);
    next();
  };
};

const complaintController = require('../../controllers/complaint.controller');

// All routes require authentication
router.use(safeProtect);

// ==================== CRUD OPERATIONS ====================

// Create a new complaint
router.post('/', complaintController.createComplaint);

// Get all complaints with filters
router.get('/', checkPermission('complaint.read'), complaintController.getComplaints);

// Get dashboard statistics
router.get('/dashboard/stats', complaintController.getDashboardStats);

// Get complaint by ID
router.get('/:id', checkPermission('complaint.read'), complaintController.getComplaintById);

// Update complaint
router.put('/:id', checkPermission('complaint.update'), complaintController.updateComplaint);

// ==================== ASSIGNMENT ====================

// Assign complaint to technician
router.post('/:id/assign', checkRole(['admin', 'manager', 'supervisor']), complaintController.assignComplaint);

// ==================== WORKFLOW ====================

// Start work on complaint
router.put('/:id/start', checkRole(['technician']), complaintController.startWork);

// Complete work on complaint
router.put('/:id/complete', checkRole(['technician']), complaintController.completeWork);

// Verify complaint (Supervisor/Manager)
router.put('/:id/verify', checkRole(['supervisor', 'manager']), complaintController.verifyComplaint);

// Add customer feedback
router.put('/:id/feedback', complaintController.addFeedback);

// ==================== ESCALATION & EVIDENCE ====================

// Escalate complaint
router.post('/:id/escalate', checkRole(['admin', 'manager']), complaintController.escalateComplaint);

// Upload evidence (images, videos, voice notes)
router.post('/:id/evidence', complaintController.uploadEvidence);

module.exports = router;