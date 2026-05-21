// server/src/routes/v1/complaint.routes.js
const express = require('express');
const router = express.Router();
const complaintController = require('../../controllers/complaint.controller');
const authMiddleware = require('../../middleware/auth.middleware');
const { roleMiddleware } = require('../../middleware/role.middleware');
const { permissionMiddleware } = require('../../middleware/permission.middleware');

// All routes require authentication
router.use(authMiddleware);

// ==================== CRUD OPERATIONS ====================
// Create a new complaint
router.post('/', complaintController.createComplaint);

// Get all complaints with filters
router.get('/', permissionMiddleware('complaint.read'), complaintController.getComplaints);

// Get dashboard statistics
router.get('/dashboard/stats', complaintController.getDashboardStats);

// Get complaint by ID
router.get('/:id', permissionMiddleware('complaint.read'), complaintController.getComplaintById);

// Update complaint
router.put('/:id', permissionMiddleware('complaint.update'), complaintController.updateComplaint);

// ==================== ASSIGNMENT ====================
// Assign complaint to technician
router.post('/:id/assign', roleMiddleware(['admin', 'manager', 'supervisor']), complaintController.assignComplaint);

// ==================== WORKFLOW ====================
// Start work on complaint
router.put('/:id/start', roleMiddleware(['technician']), complaintController.startWork);

// Complete work on complaint
router.put('/:id/complete', roleMiddleware(['technician']), complaintController.completeWork);

// Verify complaint (Supervisor/Manager)
router.put('/:id/verify', roleMiddleware(['supervisor', 'manager']), complaintController.verifyComplaint);

// Add customer feedback
router.put('/:id/feedback', complaintController.addFeedback);

// ==================== ESCALATION & EVIDENCE ====================
// Escalate complaint
router.post('/:id/escalate', roleMiddleware(['admin', 'manager']), complaintController.escalateComplaint);

// Upload evidence (images, videos, voice notes)
router.post('/:id/evidence', complaintController.uploadEvidence);

module.exports = router;