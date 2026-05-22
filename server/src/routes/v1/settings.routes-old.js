// server/src/routes/v1/settings.routes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../../middleware/auth.middleware');
const { authorize } = require('../../middleware/role.middleware');
const settingsController = require('../../controllers/settings.controller');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed'));
  }
});

// All routes require authentication
router.use(protect);
router.use(authorize(['admin', 'super_admin']));

// ==================== GENERAL SETTINGS ====================
router.get('/general', settingsController.getGeneralSettings);
router.put('/general', settingsController.updateGeneralSettings);
router.post('/upload-logo', upload.single('logo'), settingsController.uploadLogo);

// ==================== SYSTEM SETTINGS ====================
router.get('/system', settingsController.getSystemSettings);
router.put('/system', settingsController.updateSystemSettings);
router.post('/maintenance-mode', settingsController.toggleMaintenanceMode);
router.post('/clear-cache', settingsController.clearCache);

// ==================== BACKUP & RESTORE ====================
router.get('/backups', settingsController.getBackups);
router.post('/backups', settingsController.createBackup);
router.get('/backups/:backupId/download', settingsController.downloadBackup);
router.post('/backups/:backupId/restore', settingsController.restoreBackup);
router.delete('/backups/:backupId', settingsController.deleteBackup);

// ==================== AUDIT LOGS ====================
router.get('/audit-logs', settingsController.getAuditLogs);
router.get('/audit-logs/:logId', settingsController.getAuditLogById);
router.get('/audit-logs/export', settingsController.exportAuditLogs);

// ==================== EMAIL SETTINGS ====================
router.get('/email', settingsController.getEmailSettings);
router.put('/email', settingsController.updateEmailSettings);
router.post('/email/test', settingsController.testEmailConfig);

// ==================== NOTIFICATION SETTINGS ====================
router.get('/notifications', settingsController.getNotificationSettings);
router.put('/notifications', settingsController.updateNotificationSettings);

// ==================== ROLE & PERMISSION SETTINGS ====================
router.get('/roles', settingsController.getRoleSettings);
router.put('/roles/:roleId', settingsController.updateRoleSettings);

// ==================== INTEGRATION SETTINGS ====================
router.get('/integrations', settingsController.getIntegrationSettings);
router.put('/integrations/:integration', settingsController.updateIntegrationSettings);

// ==================== THEME SETTINGS ====================
router.get('/theme', settingsController.getThemeSettings);
router.put('/theme', settingsController.updateThemeSettings);

// ==================== API KEY MANAGEMENT ====================
router.get('/api-keys', settingsController.getApiKeys);
router.post('/api-keys', settingsController.generateApiKey);
router.delete('/api-keys/:keyId', settingsController.revokeApiKey);

// ==================== DATA IMPORT/EXPORT ====================
router.post('/export-data', settingsController.exportAllData);
router.post('/import-data', upload.single('file'), settingsController.importData);

module.exports = router;