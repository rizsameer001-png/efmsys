const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/auth');

// All audit routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// Audit logs
router.get('/logs', auditController.getAuditLogs);
router.get('/stats', auditController.getAuditStats);
router.get('/actions', auditController.getAvailableActions);
router.get('/export', auditController.exportAuditLogs);

module.exports = router;