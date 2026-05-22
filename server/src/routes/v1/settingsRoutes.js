const express = require('express');
const router = express.Router();
const settingsController = require('../../controllers/settingsController');
const { protect, authorize } = require('../../middleware/auth');

// All settings routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// General Settings
router.get('/general', settingsController.getGeneralSettings);
router.put('/general', settingsController.updateGeneralSettings);

// Email Settings
router.get('/email', settingsController.getEmailSettings);
router.put('/email', settingsController.updateEmailSettings);

// Integration Settings
router.get('/integrations', settingsController.getIntegrationSettings);
router.put('/integrations', settingsController.updateIntegrationSettings);
router.post('/integrations/api-keys', settingsController.generateApiKey);
router.delete('/integrations/api-keys/:keyId', settingsController.revokeApiKey);

// Notification Settings
router.get('/notifications', settingsController.getNotificationSettings);
router.put('/notifications', settingsController.updateNotificationSettings);

// System Settings
router.get('/system', settingsController.getSystemSettings);
router.put('/system', settingsController.updateSystemSettings);

// Theme Settings
router.get('/theme', settingsController.getThemeSettings);
router.put('/theme', settingsController.updateThemeSettings);

// Backup Routes
router.get('/backups', settingsController.getBackups);
router.post('/backups', settingsController.createBackup);
router.get('/backups/:backupId/download', settingsController.downloadBackup);
router.post('/backups/:backupId/restore', settingsController.restoreBackup);
router.delete('/backups/:backupId', settingsController.deleteBackup);

// Test Connection
router.post('/test-connection', settingsController.testConnection);

module.exports = router;