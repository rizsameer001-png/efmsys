const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');

// Debug middleware for routes
router.use((req, res, next) => {
  if (process.env.DEBUG === 'true') {
    console.log(`[Settings Route] ${req.method} ${req.originalUrl}`);
    console.log('[Settings Route] Headers:', req.headers.authorization ? 'Token present' : 'No token');
    console.log('[Settings Route] User:', req.user ? req.user.id : 'Not authenticated');
  }
  next();
});

// All settings routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// ==================== GENERAL SETTINGS ====================
router.get('/general', (req, res, next) => {
  console.log('[GET] /api/v1/settings/general');
  next();
}, settingsController.getGeneralSettings);

router.put('/general', (req, res, next) => {
  console.log('[PUT] /api/v1/settings/general');
  next();
}, settingsController.updateGeneralSettings);

// ==================== EMAIL SETTINGS ====================
router.get('/email', settingsController.getEmailSettings);
router.put('/email', settingsController.updateEmailSettings);
router.post('/test-email', settingsController.testEmailConfig);

// ==================== NOTIFICATION SETTINGS ====================
router.get('/notifications', settingsController.getNotificationSettings);
router.put('/notifications', settingsController.updateNotificationSettings);

// ==================== INTEGRATION SETTINGS ====================
router.get('/integrations', settingsController.getIntegrationSettings);
router.put('/integrations', settingsController.updateIntegrationSettings);
router.post('/integrations/api-keys', settingsController.generateApiKey);
router.delete('/integrations/api-keys/:keyId', settingsController.revokeApiKey);

// ==================== THEME SETTINGS ====================
router.get('/theme', settingsController.getThemeSettings);
router.put('/theme', settingsController.updateThemeSettings);

// ==================== SYSTEM SETTINGS ====================
router.get('/system', settingsController.getSystemSettings);
router.put('/system', settingsController.updateSystemSettings);

// ==================== TEST CONNECTION ====================
router.post('/test-connection', settingsController.testConnection);

// ==================== BACKUP ROUTES ====================
router.get('/backups', settingsController.getBackups);
router.post('/backups', settingsController.createBackup);
router.get('/backups/:backupId/download', settingsController.downloadBackup);
router.post('/backups/:backupId/restore', settingsController.restoreBackup);
router.delete('/backups/:backupId', settingsController.deleteBackup);

// Error handler for this router
router.use((err, req, res, next) => {
  console.error('[Settings Route Error]', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

module.exports = router;