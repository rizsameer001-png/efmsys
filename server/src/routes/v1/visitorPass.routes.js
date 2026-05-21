// // server/src/routes/v1/visitorPass.routes.js
// const express = require('express');
// const router = express.Router();
// const { protect } = require('../../middleware/auth.middleware');
// const { authorize } = require('../../middleware/role.middleware');
// const visitorPassController = require('../../controllers/visitorPass.controller');

// // All routes require authentication
// router.use(protect);

// // ==================== CUSTOMER ENDPOINTS ====================

// // Request a new visitor pass
// router.post('/request', visitorPassController.requestPass);

// // Get active visitor passes for current user
// router.get('/active', visitorPassController.getActivePasses);

// // Get pending visitor pass requests
// router.get('/pending', visitorPassController.getPendingRequests);

// // Get visitor pass history
// router.get('/history', visitorPassController.getVisitorHistory);

// // Get upcoming passes
// router.get('/upcoming', visitorPassController.getUpcomingPasses);

// // Get visitor pass by ID
// router.get('/:passId', visitorPassController.getPassById);

// // Cancel a visitor pass request
// router.put('/:passId/cancel', visitorPassController.cancelPass);

// // Update visitor pass (for pending only)
// router.put('/:passId', visitorPassController.updatePass);

// // Delete visitor pass (for pending only)
// router.delete('/:passId', visitorPassController.deletePass);

// // Download visitor pass PDF
// router.get('/:passId/pdf', visitorPassController.downloadPassPDF);

// // Send visitor pass via SMS/Email
// router.post('/:passId/send', visitorPassController.sendPassViaMessage);

// // ==================== SECURITY/GUARD ENDPOINTS ====================

// // Check-in visitor
// router.post('/:passId/check-in', authorize(['security', 'admin', 'super_admin']), visitorPassController.checkInVisitor);

// // Check-out visitor
// router.post('/:passId/check-out', authorize(['security', 'admin', 'super_admin']), visitorPassController.checkOutVisitor);

// // ==================== ADMIN ENDPOINTS ====================

// // Approve visitor pass
// router.put('/:passId/approve', authorize(['admin', 'super_admin']), visitorPassController.approvePass);

// // Reject visitor pass
// router.put('/:passId/reject', authorize(['admin', 'super_admin']), visitorPassController.rejectPass);

// // Get all visitor passes (admin)
// router.get('/admin/all', authorize(['admin', 'super_admin']), visitorPassController.getAllPasses);

// // Get visitor pass analytics (admin)
// router.get('/admin/analytics', authorize(['admin', 'super_admin']), visitorPassController.getPassAnalytics);

// // Export visitor passes (admin)
// router.get('/admin/export', authorize(['admin', 'super_admin']), visitorPassController.exportPasses);

// // Bulk approve passes (admin)
// router.post('/admin/bulk-approve', authorize(['admin', 'super_admin']), visitorPassController.bulkApprovePasses);

// // Bulk reject passes (admin)
// router.post('/admin/bulk-reject', authorize(['admin', 'super_admin']), visitorPassController.bulkRejectPasses);

// // Get visitor pass statistics (admin)
// router.get('/stats', authorize(['admin', 'super_admin']), visitorPassController.getVisitorStats);

// module.exports = router;


// server/src/routes/v1/visitorPass.routes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const visitorPassController = require('../../controllers/visitorPass.controller');

// All routes require authentication
router.use(protect);

// ==================== CUSTOMER ENDPOINTS ====================
router.post('/request', visitorPassController.requestPass);
router.get('/active', visitorPassController.getActivePasses);
router.get('/pending', visitorPassController.getPendingRequests);
router.get('/history', visitorPassController.getVisitorHistory);
router.get('/upcoming', visitorPassController.getUpcomingPasses);
router.get('/:passId', visitorPassController.getPassById);
router.put('/:passId/cancel', visitorPassController.cancelPass);
router.put('/:passId', visitorPassController.updatePass);
router.delete('/:passId', visitorPassController.deletePass);
router.get('/:passId/pdf', visitorPassController.downloadPassPDF);
router.post('/:passId/send', visitorPassController.sendPassViaMessage);

// ==================== SECURITY/GUARD ENDPOINTS ====================
router.post('/:passId/check-in', authorize(['security', 'admin', 'super_admin']), visitorPassController.checkInVisitor);
router.post('/:passId/check-out', authorize(['security', 'admin', 'super_admin']), visitorPassController.checkOutVisitor);

// ==================== ADMIN ENDPOINTS ====================
router.put('/:passId/approve', authorize(['admin', 'super_admin']), visitorPassController.approvePass);
router.put('/:passId/reject', authorize(['admin', 'super_admin']), visitorPassController.rejectPass);
router.get('/admin/all', authorize(['admin', 'super_admin']), visitorPassController.getAllPasses);
router.get('/admin/analytics', authorize(['admin', 'super_admin']), visitorPassController.getPassAnalytics);
router.get('/admin/export', authorize(['admin', 'super_admin']), visitorPassController.exportPasses);
router.post('/admin/bulk-approve', authorize(['admin', 'super_admin']), visitorPassController.bulkApprovePasses);
router.post('/admin/bulk-reject', authorize(['admin', 'super_admin']), visitorPassController.bulkRejectPasses);
router.get('/stats', authorize(['admin', 'super_admin']), visitorPassController.getVisitorStats);

module.exports = router;