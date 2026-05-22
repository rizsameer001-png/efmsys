const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const backupController = require('../controllers/backupController');
const { protect, authorize } = require('../middleware/auth');

// All settings routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// General settings
router.get('/general', settingsController.getGeneralSettings);
router.put('/general', settingsController.updateGeneralSettings);

// Email settings
router.get('/email', settingsController.getEmailSettings);
router.put('/email', settingsController.updateEmailSettings);

// Notification settings
router.get('/notifications', settingsController.getNotificationSettings);
router.put('/notifications', settingsController.updateNotificationSettings);

// Integration settings
router.get('/integrations', settingsController.getIntegrationSettings);
router.put('/integrations', settingsController.updateIntegrationSettings);

// Theme settings
router.get('/theme', settingsController.getThemeSettings);
router.put('/theme', settingsController.updateThemeSettings);

// System settings
router.get('/system', settingsController.getSystemSettings);
router.put('/system', settingsController.updateSystemSettings);

// Backup routes
router.get('/backups', backupController.getBackups);
router.post('/backups', backupController.createBackup);
router.post('/backups/:backupId/restore', backupController.restoreBackup);
router.delete('/backups/:backupId', backupController.deleteBackup);

// Get all settings (combined)
router.get('/all', settingsController.getAllSettings);

module.exports = router;