// const {
//   Settings,
//   EmailSettings,
//   IntegrationSettings,
//   NotificationSettings,
//   SystemSettings,
//   ThemeSettings,
//   Backup
// } = require('../models/Settings.model');
// const crypto = require('crypto');

// // Debug flag
// const DEBUG = process.env.DEBUG === 'true';

// // Logger function
// const logError = (context, error) => {
//   console.error(`[ERROR] ${context}:`, error.message);
//   if (DEBUG) {
//     console.error(error.stack);
//   }
// };

// const logInfo = (context, message, data = null) => {
//   if (DEBUG) {
//     console.log(`[INFO] ${context}: ${message}`);
//     if (data) console.log(data);
//   }
// };

// // Helper to get or create settings with error handling
// const getOrCreateSettings = async (Model, defaultData = {}, modelName) => {
//   try {
//     let settings = await Model.findOne();
//     if (!settings) {
//       logInfo(modelName, 'No existing settings found, creating default');
//       settings = await Model.create(defaultData);
//       logInfo(modelName, 'Default settings created', settings._id);
//     }
//     return settings;
//   } catch (error) {
//     logError(`getOrCreateSettings - ${modelName}`, error);
//     throw new Error(`Failed to get/create ${modelName}: ${error.message}`);
//   }
// };

// // Validate required fields
// const validateRequiredFields = (data, requiredFields) => {
//   const missingFields = [];
//   for (const field of requiredFields) {
//     const value = field.includes('.') 
//       ? field.split('.').reduce((obj, key) => obj?.[key], data)
//       : data[field];
//     if (!value && value !== false) {
//       missingFields.push(field);
//     }
//   }
//   return missingFields;
// };

// // ==================== GENERAL SETTINGS ====================
// exports.getGeneralSettings = async (req, res) => {
//   try {
//     logInfo('GeneralSettings', 'Fetching general settings');
//     const settings = await getOrCreateSettings(Settings, {}, 'GeneralSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getGeneralSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateGeneralSettings = async (req, res) => {
//   try {
//     logInfo('GeneralSettings', 'Updating general settings', req.body);
    
//     // Validate required fields
//     const requiredFields = ['company.name', 'company.email'];
//     const missingFields = validateRequiredFields(req.body, requiredFields);
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }
    
//     let settings = await Settings.findOne();
//     if (!settings) {
//       logInfo('GeneralSettings', 'No existing settings, creating new');
//       settings = new Settings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('GeneralSettings', 'Settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateGeneralSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== EMAIL SETTINGS ====================
// exports.getEmailSettings = async (req, res) => {
//   try {
//     logInfo('EmailSettings', 'Fetching email settings');
//     const settings = await getOrCreateSettings(EmailSettings, {}, 'EmailSettings');
    
//     // Don't send password
//     const safeSettings = settings.toObject();
//     if (safeSettings.smtp?.auth?.pass) {
//       safeSettings.smtp.auth.pass = '********';
//     }
    
//     res.status(200).json({ 
//       success: true, 
//       data: safeSettings,
//       message: 'Email settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getEmailSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch email settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateEmailSettings = async (req, res) => {
//   try {
//     logInfo('EmailSettings', 'Updating email settings', req.body);
    
//     // Validate SMTP settings if enabled
//     if (req.body.smtp?.host) {
//       const smtpRequired = ['smtp.host', 'smtp.port', 'smtp.auth.user'];
//       const missingFields = validateRequiredFields(req.body, smtpRequired);
//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           success: false,
//           error: `SMTP requires: ${missingFields.join(', ')}`
//         });
//       }
//     }
    
//     let settings = await EmailSettings.findOne();
//     if (!settings) {
//       settings = new EmailSettings(req.body);
//     } else {
//       // Keep password if not provided or if it's masked
//       if (req.body.smtp?.auth?.pass === '********') {
//         delete req.body.smtp.auth.pass;
//       }
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('EmailSettings', 'Email settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Email settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateEmailSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update email settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.testEmailConfig = async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         error: 'Email address is required'
//       });
//     }
    
//     logInfo('EmailSettings', `Testing email configuration to: ${email}`);
    
//     // In production, implement actual email sending here
//     // For now, mock success
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     res.status(200).json({ 
//       success: true, 
//       message: `Test email sent successfully to ${email}` 
//     });
//   } catch (error) {
//     logError('testEmailConfig', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to send test email',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== NOTIFICATION SETTINGS ====================
// exports.getNotificationSettings = async (req, res) => {
//   try {
//     logInfo('NotificationSettings', 'Fetching notification settings');
//     const settings = await getOrCreateSettings(NotificationSettings, {}, 'NotificationSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Notification settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getNotificationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch notification settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateNotificationSettings = async (req, res) => {
//   try {
//     logInfo('NotificationSettings', 'Updating notification settings', req.body);
    
//     let settings = await NotificationSettings.findOne();
//     if (!settings) {
//       settings = new NotificationSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('NotificationSettings', 'Notification settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Notification settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateNotificationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update notification settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== INTEGRATION SETTINGS ====================
// exports.getIntegrationSettings = async (req, res) => {
//   try {
//     logInfo('IntegrationSettings', 'Fetching integration settings');
//     const settings = await getOrCreateSettings(IntegrationSettings, {}, 'IntegrationSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Integration settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getIntegrationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch integration settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateIntegrationSettings = async (req, res) => {
//   try {
//     logInfo('IntegrationSettings', 'Updating integration settings', req.body);
    
//     let settings = await IntegrationSettings.findOne();
//     if (!settings) {
//       settings = new IntegrationSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('IntegrationSettings', 'Integration settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Integration settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateIntegrationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update integration settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.generateApiKey = async (req, res) => {
//   try {
//     const { name, permissions = [], expiresIn = '30' } = req.body;
    
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         error: 'API key name is required'
//       });
//     }
    
//     logInfo('IntegrationSettings', `Generating API key: ${name}`);
    
//     const apiKey = `fms_${crypto.randomBytes(32).toString('hex')}`;
//     const expiresAt = expiresIn !== 'never' 
//       ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000) 
//       : null;
    
//     let settings = await IntegrationSettings.findOne();
//     if (!settings) {
//       settings = new IntegrationSettings();
//     }
    
//     const newApiKey = {
//       name,
//       key: apiKey,
//       permissions,
//       expiresAt,
//       createdAt: new Date()
//     };
    
//     settings.apiKeys.push(newApiKey);
//     await settings.save();
    
//     const createdKey = settings.apiKeys[settings.apiKeys.length - 1];
    
//     logInfo('IntegrationSettings', `API key generated: ${createdKey._id}`);
//     res.status(201).json({ 
//       success: true, 
//       data: { 
//         id: createdKey._id,
//         apiKey,
//         name,
//         permissions,
//         expiresAt
//       }, 
//       message: 'API key generated successfully' 
//     });
//   } catch (error) {
//     logError('generateApiKey', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to generate API key',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.revokeApiKey = async (req, res) => {
//   try {
//     const { keyId } = req.params;
    
//     if (!keyId) {
//       return res.status(400).json({
//         success: false,
//         error: 'API key ID is required'
//       });
//     }
    
//     logInfo('IntegrationSettings', `Revoking API key: ${keyId}`);
    
//     const settings = await IntegrationSettings.findOne();
//     if (!settings) {
//       return res.status(404).json({
//         success: false,
//         error: 'No integration settings found'
//       });
//     }
    
//     const keyExists = settings.apiKeys.some(k => k._id.toString() === keyId);
//     if (!keyExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'API key not found'
//       });
//     }
    
//     settings.apiKeys = settings.apiKeys.filter(k => k._id.toString() !== keyId);
//     await settings.save();
    
//     logInfo('IntegrationSettings', `API key revoked: ${keyId}`);
//     res.status(200).json({ 
//       success: true, 
//       message: 'API key revoked successfully' 
//     });
//   } catch (error) {
//     logError('revokeApiKey', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to revoke API key',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== THEME SETTINGS ====================
// exports.getThemeSettings = async (req, res) => {
//   try {
//     logInfo('ThemeSettings', 'Fetching theme settings');
//     const settings = await getOrCreateSettings(ThemeSettings, {}, 'ThemeSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Theme settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getThemeSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch theme settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateThemeSettings = async (req, res) => {
//   try {
//     logInfo('ThemeSettings', 'Updating theme settings', req.body);
    
//     let settings = await ThemeSettings.findOne();
//     if (!settings) {
//       settings = new ThemeSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('ThemeSettings', 'Theme settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Theme settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateThemeSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update theme settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== SYSTEM SETTINGS ====================
// exports.getSystemSettings = async (req, res) => {
//   try {
//     logInfo('SystemSettings', 'Fetching system settings');
//     const settings = await getOrCreateSettings(SystemSettings, {}, 'SystemSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'System settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getSystemSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch system settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateSystemSettings = async (req, res) => {
//   try {
//     logInfo('SystemSettings', 'Updating system settings', req.body);
    
//     let settings = await SystemSettings.findOne();
//     if (!settings) {
//       settings = new SystemSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('SystemSettings', 'System settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'System settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateSystemSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update system settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== TEST CONNECTION ====================
// exports.testConnection = async (req, res) => {
//   try {
//     const { type, config } = req.body;
    
//     if (!type) {
//       return res.status(400).json({
//         success: false,
//         error: 'Connection type is required'
//       });
//     }
    
//     logInfo('TestConnection', `Testing ${type} connection`);
    
//     // In production, implement actual connection tests
//     // For now, mock success after delay
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     res.status(200).json({ 
//       success: true, 
//       message: `${type.toUpperCase()} connection successful`,
//       details: {
//         type,
//         testedAt: new Date().toISOString()
//       }
//     });
//   } catch (error) {
//     logError('testConnection', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Connection failed',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== BACKUP CONTROLLERS ====================
// exports.getBackups = async (req, res) => {
//   try {
//     logInfo('Backup', 'Fetching backups list');
//     const backups = await Backup.find().sort({ createdAt: -1 });
    
//     res.status(200).json({ 
//       success: true, 
//       data: backups,
//       message: 'Backups retrieved successfully'
//     });
//   } catch (error) {
//     logError('getBackups', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch backups',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.createBackup = async (req, res) => {
//   try {
//     const { type = 'manual' } = req.body;
    
//     logInfo('Backup', `Creating ${type} backup`);
    
//     const backupName = `backup_${new Date().toISOString().replace(/[:.]/g, '-')}.zip`;
//     const backupSize = Math.floor(Math.random() * 5 * 1024 * 1024) + 1024 * 1024; // Random size 1-6MB
    
//     const backup = new Backup({
//       name: backupName,
//       size: backupSize,
//       type,
//       path: `/backups/${backupName}`,
//       createdBy: req.user?.name || req.user?.email || 'System'
//     });
    
//     await backup.save();
    
//     logInfo('Backup', `Backup created: ${backup._id}`);
//     res.status(201).json({ 
//       success: true, 
//       data: backup, 
//       message: 'Backup created successfully'
//     });
//   } catch (error) {
//     logError('createBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to create backup',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.downloadBackup = async (req, res) => {
//   try {
//     const { backupId } = req.params;
    
//     if (!backupId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Backup ID is required'
//       });
//     }
    
//     logInfo('Backup', `Downloading backup: ${backupId}`);
    
//     const backup = await Backup.findById(backupId);
//     if (!backup) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup not found' 
//       });
//     }
    
//     // Mock download - in production, stream actual file
//     const mockData = JSON.stringify({
//       backup: backup,
//       timestamp: new Date().toISOString(),
//       data: { message: 'This is a mock backup file' }
//     }, null, 2);
    
//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Disposition', `attachment; filename=${backup.name}`);
//     res.setHeader('Content-Length', mockData.length);
//     res.status(200).send(mockData);
    
//     logInfo('Backup', `Backup downloaded: ${backupId}`);
//   } catch (error) {
//     logError('downloadBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to download backup',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.restoreBackup = async (req, res) => {
//   try {
//     const { backupId } = req.params;
    
//     if (!backupId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Backup ID is required'
//       });
//     }
    
//     logInfo('Backup', `Restoring backup: ${backupId}`);
    
//     const backup = await Backup.findById(backupId);
//     if (!backup) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup not found' 
//       });
//     }
    
//     // In production, implement actual restore logic here
    
//     logInfo('Backup', `Backup restored: ${backupId}`);
//     res.status(200).json({ 
//       success: true, 
//       message: 'Backup restored successfully' 
//     });
//   } catch (error) {
//     logError('restoreBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to restore backup',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.deleteBackup = async (req, res) => {
//   try {
//     const { backupId } = req.params;
    
//     if (!backupId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Backup ID is required'
//       });
//     }
    
//     logInfo('Backup', `Deleting backup: ${backupId}`);
    
//     const backup = await Backup.findById(backupId);
//     if (!backup) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup not found' 
//       });
//     }
    
//     await Backup.findByIdAndDelete(backupId);
    
//     logInfo('Backup', `Backup deleted: ${backupId}`);
//     res.status(200).json({ 
//       success: true, 
//       message: 'Backup deleted successfully' 
//     });
//   } catch (error) {
//     logError('deleteBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to delete backup',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };




// const fs = require('fs').promises;
// const path = require('path');
// const archiver = require('archiver');
// const crypto = require('crypto');

// const {
//   Settings,
//   EmailSettings,
//   IntegrationSettings,
//   NotificationSettings,
//   SystemSettings,
//   ThemeSettings,
//   Backup
// } = require('../models/Settings.model');

// // Debug flag
// const DEBUG = process.env.DEBUG === 'true';

// // Logger function
// const logError = (context, error) => {
//   console.error(`[ERROR] ${context}:`, error.message);
//   if (DEBUG) {
//     console.error(error.stack);
//   }
// };

// const logInfo = (context, message, data = null) => {
//   if (DEBUG) {
//     console.log(`[INFO] ${context}: ${message}`);
//     if (data) console.log(data);
//   }
// };

// // Helper to get or create settings with error handling
// const getOrCreateSettings = async (Model, defaultData = {}, modelName) => {
//   try {
//     let settings = await Model.findOne();
//     if (!settings) {
//       logInfo(modelName, 'No existing settings found, creating default');
//       settings = await Model.create(defaultData);
//       logInfo(modelName, 'Default settings created', settings._id);
//     }
//     return settings;
//   } catch (error) {
//     logError(`getOrCreateSettings - ${modelName}`, error);
//     throw new Error(`Failed to get/create ${modelName}: ${error.message}`);
//   }
// };

// // Validate required fields
// const validateRequiredFields = (data, requiredFields) => {
//   const missingFields = [];
//   for (const field of requiredFields) {
//     const value = field.includes('.') 
//       ? field.split('.').reduce((obj, key) => obj?.[key], data)
//       : data[field];
//     if (!value && value !== false) {
//       missingFields.push(field);
//     }
//   }
//   return missingFields;
// };

// // ==================== GENERAL SETTINGS ====================
// exports.getGeneralSettings = async (req, res) => {
//   try {
//     logInfo('GeneralSettings', 'Fetching general settings');
//     const settings = await getOrCreateSettings(Settings, {}, 'GeneralSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getGeneralSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateGeneralSettings = async (req, res) => {
//   try {
//     logInfo('GeneralSettings', 'Updating general settings', req.body);
    
//     // Validate required fields
//     const requiredFields = ['company.name', 'company.email'];
//     const missingFields = validateRequiredFields(req.body, requiredFields);
//     if (missingFields.length > 0) {
//       return res.status(400).json({
//         success: false,
//         error: `Missing required fields: ${missingFields.join(', ')}`
//       });
//     }
    
//     let settings = await Settings.findOne();
//     if (!settings) {
//       logInfo('GeneralSettings', 'No existing settings, creating new');
//       settings = new Settings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('GeneralSettings', 'Settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateGeneralSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== EMAIL SETTINGS ====================
// exports.getEmailSettings = async (req, res) => {
//   try {
//     logInfo('EmailSettings', 'Fetching email settings');
//     const settings = await getOrCreateSettings(EmailSettings, {}, 'EmailSettings');
    
//     // Don't send password
//     const safeSettings = settings.toObject();
//     if (safeSettings.smtp?.auth?.pass) {
//       safeSettings.smtp.auth.pass = '********';
//     }
    
//     res.status(200).json({ 
//       success: true, 
//       data: safeSettings,
//       message: 'Email settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getEmailSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch email settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateEmailSettings = async (req, res) => {
//   try {
//     logInfo('EmailSettings', 'Updating email settings', req.body);
    
//     // Validate SMTP settings if enabled
//     if (req.body.smtp?.host) {
//       const smtpRequired = ['smtp.host', 'smtp.port', 'smtp.auth.user'];
//       const missingFields = validateRequiredFields(req.body, smtpRequired);
//       if (missingFields.length > 0) {
//         return res.status(400).json({
//           success: false,
//           error: `SMTP requires: ${missingFields.join(', ')}`
//         });
//       }
//     }
    
//     let settings = await EmailSettings.findOne();
//     if (!settings) {
//       settings = new EmailSettings(req.body);
//     } else {
//       // Keep password if not provided or if it's masked
//       if (req.body.smtp?.auth?.pass === '********') {
//         delete req.body.smtp.auth.pass;
//       }
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('EmailSettings', 'Email settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Email settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateEmailSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update email settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.testEmailConfig = async (req, res) => {
//   try {
//     const { email } = req.body;
    
//     if (!email) {
//       return res.status(400).json({
//         success: false,
//         error: 'Email address is required'
//       });
//     }
    
//     logInfo('EmailSettings', `Testing email configuration to: ${email}`);
    
//     // In production, implement actual email sending here
//     // For now, mock success
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     res.status(200).json({ 
//       success: true, 
//       message: `Test email sent successfully to ${email}` 
//     });
//   } catch (error) {
//     logError('testEmailConfig', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to send test email',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== NOTIFICATION SETTINGS ====================
// exports.getNotificationSettings = async (req, res) => {
//   try {
//     logInfo('NotificationSettings', 'Fetching notification settings');
//     const settings = await getOrCreateSettings(NotificationSettings, {}, 'NotificationSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Notification settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getNotificationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch notification settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateNotificationSettings = async (req, res) => {
//   try {
//     logInfo('NotificationSettings', 'Updating notification settings', req.body);
    
//     let settings = await NotificationSettings.findOne();
//     if (!settings) {
//       settings = new NotificationSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('NotificationSettings', 'Notification settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Notification settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateNotificationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update notification settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== INTEGRATION SETTINGS ====================
// exports.getIntegrationSettings = async (req, res) => {
//   try {
//     logInfo('IntegrationSettings', 'Fetching integration settings');
//     const settings = await getOrCreateSettings(IntegrationSettings, {}, 'IntegrationSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Integration settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getIntegrationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch integration settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateIntegrationSettings = async (req, res) => {
//   try {
//     logInfo('IntegrationSettings', 'Updating integration settings', req.body);
    
//     let settings = await IntegrationSettings.findOne();
//     if (!settings) {
//       settings = new IntegrationSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('IntegrationSettings', 'Integration settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Integration settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateIntegrationSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update integration settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.generateApiKey = async (req, res) => {
//   try {
//     const { name, permissions = [], expiresIn = '30' } = req.body;
    
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         error: 'API key name is required'
//       });
//     }
    
//     logInfo('IntegrationSettings', `Generating API key: ${name}`);
    
//     const apiKey = `fms_${crypto.randomBytes(32).toString('hex')}`;
//     const expiresAt = expiresIn !== 'never' 
//       ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000) 
//       : null;
    
//     let settings = await IntegrationSettings.findOne();
//     if (!settings) {
//       settings = new IntegrationSettings();
//     }
    
//     const newApiKey = {
//       name,
//       key: apiKey,
//       permissions,
//       expiresAt,
//       createdAt: new Date()
//     };
    
//     settings.apiKeys.push(newApiKey);
//     await settings.save();
    
//     const createdKey = settings.apiKeys[settings.apiKeys.length - 1];
    
//     logInfo('IntegrationSettings', `API key generated: ${createdKey._id}`);
//     res.status(201).json({ 
//       success: true, 
//       data: { 
//         id: createdKey._id,
//         apiKey,
//         name,
//         permissions,
//         expiresAt
//       }, 
//       message: 'API key generated successfully' 
//     });
//   } catch (error) {
//     logError('generateApiKey', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to generate API key',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.revokeApiKey = async (req, res) => {
//   try {
//     const { keyId } = req.params;
    
//     if (!keyId) {
//       return res.status(400).json({
//         success: false,
//         error: 'API key ID is required'
//       });
//     }
    
//     logInfo('IntegrationSettings', `Revoking API key: ${keyId}`);
    
//     const settings = await IntegrationSettings.findOne();
//     if (!settings) {
//       return res.status(404).json({
//         success: false,
//         error: 'No integration settings found'
//       });
//     }
    
//     const keyExists = settings.apiKeys.some(k => k._id.toString() === keyId);
//     if (!keyExists) {
//       return res.status(404).json({
//         success: false,
//         error: 'API key not found'
//       });
//     }
    
//     settings.apiKeys = settings.apiKeys.filter(k => k._id.toString() !== keyId);
//     await settings.save();
    
//     logInfo('IntegrationSettings', `API key revoked: ${keyId}`);
//     res.status(200).json({ 
//       success: true, 
//       message: 'API key revoked successfully' 
//     });
//   } catch (error) {
//     logError('revokeApiKey', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to revoke API key',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== THEME SETTINGS ====================
// exports.getThemeSettings = async (req, res) => {
//   try {
//     logInfo('ThemeSettings', 'Fetching theme settings');
//     const settings = await getOrCreateSettings(ThemeSettings, {}, 'ThemeSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'Theme settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getThemeSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch theme settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateThemeSettings = async (req, res) => {
//   try {
//     logInfo('ThemeSettings', 'Updating theme settings', req.body);
    
//     let settings = await ThemeSettings.findOne();
//     if (!settings) {
//       settings = new ThemeSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('ThemeSettings', 'Theme settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'Theme settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateThemeSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update theme settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== SYSTEM SETTINGS ====================
// exports.getSystemSettings = async (req, res) => {
//   try {
//     logInfo('SystemSettings', 'Fetching system settings');
//     const settings = await getOrCreateSettings(SystemSettings, {}, 'SystemSettings');
    
//     res.status(200).json({ 
//       success: true, 
//       data: settings,
//       message: 'System settings retrieved successfully'
//     });
//   } catch (error) {
//     logError('getSystemSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch system settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.updateSystemSettings = async (req, res) => {
//   try {
//     logInfo('SystemSettings', 'Updating system settings', req.body);
    
//     let settings = await SystemSettings.findOne();
//     if (!settings) {
//       settings = new SystemSettings(req.body);
//     } else {
//       Object.assign(settings, req.body);
//     }
    
//     settings.updatedBy = req.user?.id;
//     await settings.save();
    
//     logInfo('SystemSettings', 'System settings updated successfully', settings._id);
//     res.status(200).json({ 
//       success: true, 
//       data: settings, 
//       message: 'System settings updated successfully'
//     });
//   } catch (error) {
//     logError('updateSystemSettings', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to update system settings',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== TEST CONNECTION ====================
// exports.testConnection = async (req, res) => {
//   try {
//     const { type, config } = req.body;
    
//     if (!type) {
//       return res.status(400).json({
//         success: false,
//         error: 'Connection type is required'
//       });
//     }
    
//     logInfo('TestConnection', `Testing ${type} connection`);
    
//     // In production, implement actual connection tests
//     // For now, mock success after delay
//     await new Promise(resolve => setTimeout(resolve, 500));
    
//     res.status(200).json({ 
//       success: true, 
//       message: `${type.toUpperCase()} connection successful`,
//       details: {
//         type,
//         testedAt: new Date().toISOString()
//       }
//     });
//   } catch (error) {
//     logError('testConnection', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Connection failed',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// // ==================== BACKUP CONTROLLERS ====================
// exports.getBackups = async (req, res) => {
//   try {
//     logInfo('Backup', 'Fetching backups list');
//     const backups = await Backup.find().sort({ createdAt: -1 });
    
//     res.status(200).json({ 
//       success: true, 
//       data: backups,
//       message: 'Backups retrieved successfully'
//     });
//   } catch (error) {
//     logError('getBackups', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to fetch backups',
//       details: DEBUG ? error.message : undefined
//     });
//   }
// };

// exports.createBackup = async (req, res) => {
//   let archive = null;
  
//   try {
//     const { type = 'manual', includeDatabase = true, includeUploads = true, includeLogs = false } = req.body;
    
//     logInfo('Backup', `Creating ${type} backup with options:`, { includeDatabase, includeUploads, includeLogs });
    
//     // Create backup directory if it doesn't exist
//     const backupDir = path.join(__dirname, '../../backups');
//     await fs.mkdir(backupDir, { recursive: true });
    
//     // Generate unique backup filename
//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const backupFileName = `backup_${type}_${timestamp}.zip`;
//     const backupFilePath = path.join(backupDir, backupFileName);
    
//     // Create write stream for zip file
//     const output = fs.createWriteStream(backupFilePath);
//     archive = archiver('zip', { zlib: { level: 9 } });
    
//     let archiveSize = 0;
    
//     // Listen for archive events
//     archive.on('error', (err) => {
//       logError('Backup Archive', err);
//       throw err;
//     });
    
//     archive.on('data', (chunk) => {
//       archiveSize += chunk.length;
//     });
    
//     archive.on('warning', (err) => {
//       if (err.code === 'ENOENT') {
//         console.warn('Archive warning:', err);
//       } else {
//         throw err;
//       }
//     });
    
//     // Pipe archive data to file
//     archive.pipe(output);
    
//     // ==================== Backup Database ====================
//     if (includeDatabase) {
//       console.log('📦 Backing up database...');
      
//       const mongoose = require('mongoose');
//       const collections = mongoose.connection.collections;
      
//       const dbBackup = {};
      
//       for (const [name, collection] of Object.entries(collections)) {
//         try {
//           const data = await collection.find({}).toArray();
//           dbBackup[name] = data;
//           console.log(`  ✅ Backed up collection: ${name} (${data.length} records)`);
//         } catch (err) {
//           console.error(`  ❌ Failed to backup collection ${name}:`, err.message);
//         }
//       }
      
//       // Add database backup as JSON file
//       archive.append(JSON.stringify(dbBackup, null, 2), { name: `database/backup_${timestamp}.json` });
      
//       // Export users separately
//       if (dbBackup.users) {
//         const usersBackup = JSON.stringify(dbBackup.users, null, 2);
//         archive.append(usersBackup, { name: `database/users_${timestamp}.json` });
//       }
      
//       // Export settings
//       const allSettings = {
//         general: await Settings.findOne(),
//         email: await EmailSettings.findOne(),
//         integrations: await IntegrationSettings.findOne(),
//         notifications: await NotificationSettings.findOne(),
//         system: await SystemSettings.findOne(),
//         theme: await ThemeSettings.findOne()
//       };
      
//       archive.append(JSON.stringify(allSettings, null, 2), { name: `database/settings_${timestamp}.json` });
//     }
    
//     // ==================== Backup Uploads ====================
//     if (includeUploads) {
//       const uploadsDir = path.join(__dirname, '../../uploads');
//       try {
//         await fs.access(uploadsDir);
//         console.log('📁 Backing up uploads folder...');
//         archive.directory(uploadsDir, 'uploads');
//         console.log('  ✅ Uploads folder added');
//       } catch (err) {
//         console.log('  ⚠️ Uploads folder not found, skipping...');
//         archive.append('No uploads folder found on server', { name: 'uploads/README.txt' });
//       }
//     }
    
//     // ==================== Backup Logs ====================
//     if (includeLogs) {
//       const logsDir = path.join(__dirname, '../../logs');
//       try {
//         await fs.access(logsDir);
//         console.log('📄 Backing up logs folder...');
//         archive.directory(logsDir, 'logs');
//         console.log('  ✅ Logs folder added');
//       } catch (err) {
//         console.log('  ⚠️ Logs folder not found, skipping...');
//       }
//     }
    
//     // ==================== Add Backup Info File ====================
//     const backupInfo = {
//       timestamp: new Date().toISOString(),
//       version: process.env.npm_package_version || '1.0.0',
//       nodeVersion: process.version,
//       platform: process.platform,
//       includes: {
//         database: includeDatabase,
//         uploads: includeUploads,
//         logs: includeLogs
//       },
//       createdBy: req.user?.email || req.user?.name || 'System',
//       type: type
//     };
    
//     archive.append(JSON.stringify(backupInfo, null, 2), { name: 'backup-info.json' });
    
//     // Finalize archive
//     await new Promise((resolve, reject) => {
//       output.on('close', resolve);
//       archive.on('error', reject);
//       archive.finalize();
//     });
    
//     // Get file stats
//     const stats = await fs.stat(backupFilePath);
    
//     // Save backup record to database
//     const backup = new Backup({
//       name: backupFileName,
//       size: stats.size,
//       type: type,
//       path: backupFilePath,
//       createdBy: req.user?.name || req.user?.email || 'System',
//       createdAt: new Date()
//     });
    
//     await backup.save();
    
//     console.log(`✅ Backup created successfully: ${backupFileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
//     res.status(201).json({ 
//       success: true, 
//       data: backup, 
//       message: `Backup created successfully (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
//     });
//   } catch (error) {
//     logError('createBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to create backup: ' + error.message,
//       details: DEBUG ? error.stack : undefined
//     });
//   }
// };

// exports.downloadBackup = async (req, res) => {
//   try {
//     const { backupId } = req.params;
    
//     if (!backupId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Backup ID is required'
//       });
//     }
    
//     logInfo('Backup', `Downloading backup: ${backupId}`);
    
//     const backup = await Backup.findById(backupId);
//     if (!backup) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup not found' 
//       });
//     }
    
//     // Check if file exists
//     try {
//       await fs.access(backup.path);
//     } catch (err) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup file not found on server. Please create a new backup.' 
//       });
//     }
    
//     // Get file stats
//     const stats = await fs.stat(backup.path);
    
//     // Set headers for file download
//     res.setHeader('Content-Type', 'application/zip');
//     res.setHeader('Content-Disposition', `attachment; filename="${backup.name}"`);
//     res.setHeader('Content-Length', stats.size);
//     res.setHeader('Cache-Control', 'no-cache');
    
//     // Stream the file
//     const fileStream = fs.createReadStream(backup.path);
//     fileStream.pipe(res);
    
//     fileStream.on('error', (error) => {
//       logError('Download Backup Stream', error);
//       if (!res.headersSent) {
//         res.status(500).json({ success: false, error: 'Error streaming file' });
//       }
//     });
    
//     logInfo('Backup', `Backup download started: ${backup.name} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
//   } catch (error) {
//     logError('downloadBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to download backup: ' + error.message,
//       details: DEBUG ? error.stack : undefined
//     });
//   }
// };

// exports.restoreBackup = async (req, res) => {
//   try {
//     const { backupId } = req.params;
    
//     if (!backupId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Backup ID is required'
//       });
//     }
    
//     logInfo('Backup', `Restoring backup: ${backupId}`);
    
//     const backup = await Backup.findById(backupId);
//     if (!backup) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup not found' 
//       });
//     }
    
//     // Check if backup file exists
//     try {
//       await fs.access(backup.path);
//     } catch (err) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup file not found on server' 
//       });
//     }
    
//     // Note: Full restore would require extracting and restoring the data
//     // This is a placeholder - implement based on your requirements
//     console.log(`Restore requested for backup: ${backup.name}`);
    
//     res.json({ 
//       success: true, 
//       message: 'Backup restore initiated. Please check server logs for details.' 
//     });
//   } catch (error) {
//     logError('restoreBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to restore backup: ' + error.message,
//       details: DEBUG ? error.stack : undefined
//     });
//   }
// };

// exports.deleteBackup = async (req, res) => {
//   try {
//     const { backupId } = req.params;
    
//     if (!backupId) {
//       return res.status(400).json({
//         success: false,
//         error: 'Backup ID is required'
//       });
//     }
    
//     logInfo('Backup', `Deleting backup: ${backupId}`);
    
//     const backup = await Backup.findById(backupId);
//     if (!backup) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'Backup not found' 
//       });
//     }
    
//     // Delete the physical file if it exists
//     try {
//       await fs.unlink(backup.path);
//       console.log(`Deleted backup file: ${backup.path}`);
//     } catch (err) {
//       console.warn('Could not delete backup file:', err.message);
//     }
    
//     // Delete database record
//     await Backup.findByIdAndDelete(backupId);
    
//     logInfo('Backup', `Backup deleted: ${backupId}`);
//     res.status(200).json({ 
//       success: true, 
//       message: 'Backup deleted successfully' 
//     });
//   } catch (error) {
//     logError('deleteBackup', error);
//     res.status(500).json({ 
//       success: false, 
//       error: 'Failed to delete backup: ' + error.message,
//       details: DEBUG ? error.stack : undefined
//     });
//   }
// };






const fs = require('fs'); // For createWriteStream and other non-promise methods
const fsPromises = require('fs').promises; // For promise-based methods
const path = require('path');
const archiver = require('archiver');
const crypto = require('crypto');

const {
  Settings,
  EmailSettings,
  IntegrationSettings,
  NotificationSettings,
  SystemSettings,
  ThemeSettings,
  Backup
} = require('../models/Settings.model');

// Debug flag
const DEBUG = process.env.DEBUG === 'true';

// Logger function
const logError = (context, error) => {
  console.error(`[ERROR] ${context}:`, error.message);
  if (DEBUG) {
    console.error(error.stack);
  }
};

const logInfo = (context, message, data = null) => {
  if (DEBUG) {
    console.log(`[INFO] ${context}: ${message}`);
    if (data) console.log(data);
  }
};

// Helper to get or create settings with error handling
const getOrCreateSettings = async (Model, defaultData = {}, modelName) => {
  try {
    let settings = await Model.findOne();
    if (!settings) {
      logInfo(modelName, 'No existing settings found, creating default');
      settings = await Model.create(defaultData);
      logInfo(modelName, 'Default settings created', settings._id);
    }
    return settings;
  } catch (error) {
    logError(`getOrCreateSettings - ${modelName}`, error);
    throw new Error(`Failed to get/create ${modelName}: ${error.message}`);
  }
};

// Validate required fields
const validateRequiredFields = (data, requiredFields) => {
  const missingFields = [];
  for (const field of requiredFields) {
    const value = field.includes('.') 
      ? field.split('.').reduce((obj, key) => obj?.[key], data)
      : data[field];
    if (!value && value !== false) {
      missingFields.push(field);
    }
  }
  return missingFields;
};

// ==================== GENERAL SETTINGS ====================
exports.getGeneralSettings = async (req, res) => {
  try {
    logInfo('GeneralSettings', 'Fetching general settings');
    const settings = await getOrCreateSettings(Settings, {}, 'GeneralSettings');
    
    res.status(200).json({ 
      success: true, 
      data: settings,
      message: 'Settings retrieved successfully'
    });
  } catch (error) {
    logError('getGeneralSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.updateGeneralSettings = async (req, res) => {
  try {
    logInfo('GeneralSettings', 'Updating general settings', req.body);
    
    // Validate required fields
    const requiredFields = ['company.name', 'company.email'];
    const missingFields = validateRequiredFields(req.body, requiredFields);
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    let settings = await Settings.findOne();
    if (!settings) {
      logInfo('GeneralSettings', 'No existing settings, creating new');
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    settings.updatedBy = req.user?.id;
    await settings.save();
    
    logInfo('GeneralSettings', 'Settings updated successfully', settings._id);
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: 'Settings updated successfully'
    });
  } catch (error) {
    logError('updateGeneralSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== EMAIL SETTINGS ====================
exports.getEmailSettings = async (req, res) => {
  try {
    logInfo('EmailSettings', 'Fetching email settings');
    const settings = await getOrCreateSettings(EmailSettings, {}, 'EmailSettings');
    
    // Don't send password
    const safeSettings = settings.toObject();
    if (safeSettings.smtp?.auth?.pass) {
      safeSettings.smtp.auth.pass = '********';
    }
    
    res.status(200).json({ 
      success: true, 
      data: safeSettings,
      message: 'Email settings retrieved successfully'
    });
  } catch (error) {
    logError('getEmailSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch email settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.updateEmailSettings = async (req, res) => {
  try {
    logInfo('EmailSettings', 'Updating email settings', req.body);
    
    // Validate SMTP settings if enabled
    if (req.body.smtp?.host) {
      const smtpRequired = ['smtp.host', 'smtp.port', 'smtp.auth.user'];
      const missingFields = validateRequiredFields(req.body, smtpRequired);
      if (missingFields.length > 0) {
        return res.status(400).json({
          success: false,
          error: `SMTP requires: ${missingFields.join(', ')}`
        });
      }
    }
    
    let settings = await EmailSettings.findOne();
    if (!settings) {
      settings = new EmailSettings(req.body);
    } else {
      // Keep password if not provided or if it's masked
      if (req.body.smtp?.auth?.pass === '********') {
        delete req.body.smtp.auth.pass;
      }
      Object.assign(settings, req.body);
    }
    
    settings.updatedBy = req.user?.id;
    await settings.save();
    
    logInfo('EmailSettings', 'Email settings updated successfully', settings._id);
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: 'Email settings updated successfully'
    });
  } catch (error) {
    logError('updateEmailSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update email settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.testEmailConfig = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email address is required'
      });
    }
    
    logInfo('EmailSettings', `Testing email configuration to: ${email}`);
    
    // In production, implement actual email sending here
    // For now, mock success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    res.status(200).json({ 
      success: true, 
      message: `Test email sent successfully to ${email}` 
    });
  } catch (error) {
    logError('testEmailConfig', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send test email',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== NOTIFICATION SETTINGS ====================
exports.getNotificationSettings = async (req, res) => {
  try {
    logInfo('NotificationSettings', 'Fetching notification settings');
    const settings = await getOrCreateSettings(NotificationSettings, {}, 'NotificationSettings');
    
    res.status(200).json({ 
      success: true, 
      data: settings,
      message: 'Notification settings retrieved successfully'
    });
  } catch (error) {
    logError('getNotificationSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch notification settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    logInfo('NotificationSettings', 'Updating notification settings', req.body);
    
    let settings = await NotificationSettings.findOne();
    if (!settings) {
      settings = new NotificationSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    settings.updatedBy = req.user?.id;
    await settings.save();
    
    logInfo('NotificationSettings', 'Notification settings updated successfully', settings._id);
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    logError('updateNotificationSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update notification settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== INTEGRATION SETTINGS ====================
exports.getIntegrationSettings = async (req, res) => {
  try {
    logInfo('IntegrationSettings', 'Fetching integration settings');
    const settings = await getOrCreateSettings(IntegrationSettings, {}, 'IntegrationSettings');
    
    res.status(200).json({ 
      success: true, 
      data: settings,
      message: 'Integration settings retrieved successfully'
    });
  } catch (error) {
    logError('getIntegrationSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch integration settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.updateIntegrationSettings = async (req, res) => {
  try {
    logInfo('IntegrationSettings', 'Updating integration settings', req.body);
    
    let settings = await IntegrationSettings.findOne();
    if (!settings) {
      settings = new IntegrationSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    settings.updatedBy = req.user?.id;
    await settings.save();
    
    logInfo('IntegrationSettings', 'Integration settings updated successfully', settings._id);
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: 'Integration settings updated successfully'
    });
  } catch (error) {
    logError('updateIntegrationSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update integration settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const { name, permissions = [], expiresIn = '30' } = req.body;
    
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'API key name is required'
      });
    }
    
    logInfo('IntegrationSettings', `Generating API key: ${name}`);
    
    const apiKey = `fms_${crypto.randomBytes(32).toString('hex')}`;
    const expiresAt = expiresIn !== 'never' 
      ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000) 
      : null;
    
    let settings = await IntegrationSettings.findOne();
    if (!settings) {
      settings = new IntegrationSettings();
    }
    
    const newApiKey = {
      name,
      key: apiKey,
      permissions,
      expiresAt,
      createdAt: new Date()
    };
    
    settings.apiKeys.push(newApiKey);
    await settings.save();
    
    const createdKey = settings.apiKeys[settings.apiKeys.length - 1];
    
    logInfo('IntegrationSettings', `API key generated: ${createdKey._id}`);
    res.status(201).json({ 
      success: true, 
      data: { 
        id: createdKey._id,
        apiKey,
        name,
        permissions,
        expiresAt
      }, 
      message: 'API key generated successfully' 
    });
  } catch (error) {
    logError('generateApiKey', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate API key',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    
    if (!keyId) {
      return res.status(400).json({
        success: false,
        error: 'API key ID is required'
      });
    }
    
    logInfo('IntegrationSettings', `Revoking API key: ${keyId}`);
    
    const settings = await IntegrationSettings.findOne();
    if (!settings) {
      return res.status(404).json({
        success: false,
        error: 'No integration settings found'
      });
    }
    
    const keyExists = settings.apiKeys.some(k => k._id.toString() === keyId);
    if (!keyExists) {
      return res.status(404).json({
        success: false,
        error: 'API key not found'
      });
    }
    
    settings.apiKeys = settings.apiKeys.filter(k => k._id.toString() !== keyId);
    await settings.save();
    
    logInfo('IntegrationSettings', `API key revoked: ${keyId}`);
    res.status(200).json({ 
      success: true, 
      message: 'API key revoked successfully' 
    });
  } catch (error) {
    logError('revokeApiKey', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to revoke API key',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== THEME SETTINGS ====================
exports.getThemeSettings = async (req, res) => {
  try {
    logInfo('ThemeSettings', 'Fetching theme settings');
    const settings = await getOrCreateSettings(ThemeSettings, {}, 'ThemeSettings');
    
    res.status(200).json({ 
      success: true, 
      data: settings,
      message: 'Theme settings retrieved successfully'
    });
  } catch (error) {
    logError('getThemeSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch theme settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.updateThemeSettings = async (req, res) => {
  try {
    logInfo('ThemeSettings', 'Updating theme settings', req.body);
    
    let settings = await ThemeSettings.findOne();
    if (!settings) {
      settings = new ThemeSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    settings.updatedBy = req.user?.id;
    await settings.save();
    
    logInfo('ThemeSettings', 'Theme settings updated successfully', settings._id);
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: 'Theme settings updated successfully'
    });
  } catch (error) {
    logError('updateThemeSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update theme settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== SYSTEM SETTINGS ====================
exports.getSystemSettings = async (req, res) => {
  try {
    logInfo('SystemSettings', 'Fetching system settings');
    const settings = await getOrCreateSettings(SystemSettings, {}, 'SystemSettings');
    
    res.status(200).json({ 
      success: true, 
      data: settings,
      message: 'System settings retrieved successfully'
    });
  } catch (error) {
    logError('getSystemSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch system settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    logInfo('SystemSettings', 'Updating system settings', req.body);
    
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    
    settings.updatedBy = req.user?.id;
    await settings.save();
    
    logInfo('SystemSettings', 'System settings updated successfully', settings._id);
    res.status(200).json({ 
      success: true, 
      data: settings, 
      message: 'System settings updated successfully'
    });
  } catch (error) {
    logError('updateSystemSettings', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to update system settings',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== TEST CONNECTION ====================
exports.testConnection = async (req, res) => {
  try {
    const { type, config } = req.body;
    
    if (!type) {
      return res.status(400).json({
        success: false,
        error: 'Connection type is required'
      });
    }
    
    logInfo('TestConnection', `Testing ${type} connection`);
    
    // In production, implement actual connection tests
    // For now, mock success after delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    res.status(200).json({ 
      success: true, 
      message: `${type.toUpperCase()} connection successful`,
      details: {
        type,
        testedAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logError('testConnection', error);
    res.status(500).json({ 
      success: false, 
      error: 'Connection failed',
      details: DEBUG ? error.message : undefined
    });
  }
};

// ==================== BACKUP CONTROLLERS ====================
exports.getBackups = async (req, res) => {
  try {
    logInfo('Backup', 'Fetching backups list');
    const backups = await Backup.find().sort({ createdAt: -1 });
    
    res.status(200).json({ 
      success: true, 
      data: backups,
      message: 'Backups retrieved successfully'
    });
  } catch (error) {
    logError('getBackups', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to fetch backups',
      details: DEBUG ? error.message : undefined
    });
  }
};

exports.createBackup = async (req, res) => {
  let archive = null;
  let output = null;
  
  try {
    const { type = 'manual', includeDatabase = true, includeUploads = true, includeLogs = false } = req.body;
    
    logInfo('Backup', `Creating ${type} backup with options:`, { includeDatabase, includeUploads, includeLogs });
    
    // Create backup directory if it doesn't exist
    const backupDir = path.join(__dirname, '../../backups');
    await fsPromises.mkdir(backupDir, { recursive: true });
    
    // Generate unique backup filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `backup_${type}_${timestamp}.zip`;
    const backupFilePath = path.join(backupDir, backupFileName);
    
    // Create write stream for zip file using fs.createWriteStream (not fsPromises)
    output = fs.createWriteStream(backupFilePath);
    archive = archiver('zip', { zlib: { level: 9 } });
    
    let archiveSize = 0;
    
    // Listen for archive events
    archive.on('error', (err) => {
      logError('Backup Archive', err);
    });
    
    archive.on('data', (chunk) => {
      archiveSize += chunk.length;
    });
    
    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.warn('Archive warning:', err);
      } else {
        logError('Backup Archive Warning', err);
      }
    });
    
    // Pipe archive data to file
    archive.pipe(output);
    
    // ==================== Backup Database ====================
    if (includeDatabase) {
      console.log('📦 Backing up database...');
      
      const mongoose = require('mongoose');
      const collections = mongoose.connection.collections;
      
      const dbBackup = {};
      
      for (const [name, collection] of Object.entries(collections)) {
        try {
          const data = await collection.find({}).toArray();
          dbBackup[name] = data;
          console.log(`  ✅ Backed up collection: ${name} (${data.length} records)`);
        } catch (err) {
          console.error(`  ❌ Failed to backup collection ${name}:`, err.message);
        }
      }
      
      // Add database backup as JSON file
      archive.append(JSON.stringify(dbBackup, null, 2), { name: `database/backup_${timestamp}.json` });
      
      // Export users separately
      if (dbBackup.users) {
        const usersBackup = JSON.stringify(dbBackup.users, null, 2);
        archive.append(usersBackup, { name: `database/users_${timestamp}.json` });
      }
      
      // Export settings
      const allSettings = {
        general: await Settings.findOne(),
        email: await EmailSettings.findOne(),
        integrations: await IntegrationSettings.findOne(),
        notifications: await NotificationSettings.findOne(),
        system: await SystemSettings.findOne(),
        theme: await ThemeSettings.findOne()
      };
      
      archive.append(JSON.stringify(allSettings, null, 2), { name: `database/settings_${timestamp}.json` });
    }
    
    // ==================== Backup Uploads ====================
    if (includeUploads) {
      const uploadsDir = path.join(__dirname, '../../uploads');
      try {
        await fsPromises.access(uploadsDir);
        console.log('📁 Backing up uploads folder...');
        archive.directory(uploadsDir, 'uploads');
        console.log('  ✅ Uploads folder added');
      } catch (err) {
        console.log('  ⚠️ Uploads folder not found, skipping...');
        archive.append('No uploads folder found on server', { name: 'uploads/README.txt' });
      }
    }
    
    // ==================== Backup Logs ====================
    if (includeLogs) {
      const logsDir = path.join(__dirname, '../../logs');
      try {
        await fsPromises.access(logsDir);
        console.log('📄 Backing up logs folder...');
        archive.directory(logsDir, 'logs');
        console.log('  ✅ Logs folder added');
      } catch (err) {
        console.log('  ⚠️ Logs folder not found, skipping...');
      }
    }
    
    // ==================== Add Backup Info File ====================
    const backupInfo = {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      nodeVersion: process.version,
      platform: process.platform,
      includes: {
        database: includeDatabase,
        uploads: includeUploads,
        logs: includeLogs
      },
      createdBy: req.user?.email || req.user?.name || 'System',
      type: type
    };
    
    archive.append(JSON.stringify(backupInfo, null, 2), { name: 'backup-info.json' });
    
    // Finalize archive
    await new Promise((resolve, reject) => {
      output.on('close', resolve);
      archive.on('error', reject);
      archive.finalize();
    });
    
    // Get file stats using fsPromises
    const stats = await fsPromises.stat(backupFilePath);
    
    // Save backup record to database
    const backup = new Backup({
      name: backupFileName,
      size: stats.size,
      type: type,
      path: backupFilePath,
      createdBy: req.user?.name || req.user?.email || 'System',
      createdAt: new Date()
    });
    
    await backup.save();
    
    console.log(`✅ Backup created successfully: ${backupFileName} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
    
    res.status(201).json({ 
      success: true, 
      data: backup, 
      message: `Backup created successfully (${(stats.size / 1024 / 1024).toFixed(2)} MB)`
    });
  } catch (error) {
    logError('createBackup', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to create backup: ' + error.message,
      details: DEBUG ? error.stack : undefined
    });
  } finally {
    if (archive) {
      archive = null;
    }
    if (output) {
      output = null;
    }
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    
    if (!backupId) {
      return res.status(400).json({
        success: false,
        error: 'Backup ID is required'
      });
    }
    
    logInfo('Backup', `Downloading backup: ${backupId}`);
    
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Backup not found' 
      });
    }
    
    // Check if file exists using fsPromises
    try {
      await fsPromises.access(backup.path);
    } catch (err) {
      return res.status(404).json({ 
        success: false, 
        error: 'Backup file not found on server. Please create a new backup.' 
      });
    }
    
    // Get file stats
    const stats = await fsPromises.stat(backup.path);
    
    // Set headers for file download
    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="${backup.name}"`);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Cache-Control', 'no-cache');
    
    // Stream the file using fs.createReadStream
    const fileStream = fs.createReadStream(backup.path);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      logError('Download Backup Stream', error);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Error streaming file' });
      }
    });
    
    logInfo('Backup', `Backup download started: ${backup.name} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
  } catch (error) {
    logError('downloadBackup', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to download backup: ' + error.message,
      details: DEBUG ? error.stack : undefined
    });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    
    if (!backupId) {
      return res.status(400).json({
        success: false,
        error: 'Backup ID is required'
      });
    }
    
    logInfo('Backup', `Restoring backup: ${backupId}`);
    
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Backup not found' 
      });
    }
    
    // Check if backup file exists
    try {
      await fsPromises.access(backup.path);
    } catch (err) {
      return res.status(404).json({ 
        success: false, 
        error: 'Backup file not found on server' 
      });
    }
    
    // Note: Full restore would require extracting and restoring the data
    // This is a placeholder - implement based on your requirements
    console.log(`Restore requested for backup: ${backup.name}`);
    
    res.json({ 
      success: true, 
      message: 'Backup restore initiated. Please check server logs for details.' 
    });
  } catch (error) {
    logError('restoreBackup', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to restore backup: ' + error.message,
      details: DEBUG ? error.stack : undefined
    });
  }
};

exports.deleteBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    
    if (!backupId) {
      return res.status(400).json({
        success: false,
        error: 'Backup ID is required'
      });
    }
    
    logInfo('Backup', `Deleting backup: ${backupId}`);
    
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Backup not found' 
      });
    }
    
    // Delete the physical file if it exists
    try {
      await fsPromises.unlink(backup.path);
      console.log(`Deleted backup file: ${backup.path}`);
    } catch (err) {
      console.warn('Could not delete backup file:', err.message);
    }
    
    // Delete database record
    await Backup.findByIdAndDelete(backupId);
    
    logInfo('Backup', `Backup deleted: ${backupId}`);
    res.status(200).json({ 
      success: true, 
      message: 'Backup deleted successfully' 
    });
  } catch (error) {
    logError('deleteBackup', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to delete backup: ' + error.message,
      details: DEBUG ? error.stack : undefined
    });
  }
};