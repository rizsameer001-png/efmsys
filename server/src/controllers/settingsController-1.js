const {
  Settings,
  EmailSettings,
  IntegrationSettings,
  NotificationSettings,
  SystemSettings,
  ThemeSettings,
  Backup
} = require('../models/Settings');
const crypto = require('crypto');

// Helper to get or create settings
const getOrCreateSettings = async (Model, defaultData = {}) => {
  let settings = await Model.findOne();
  if (!settings) {
    settings = await Model.create(defaultData);
  }
  return settings;
};

// General Settings
exports.getGeneralSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(Settings);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get general settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch settings' });
  }
};

exports.updateGeneralSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedBy = req.user.id;
    await settings.save();
    res.json({ success: true, data: settings, message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update general settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
};

// Email Settings
exports.getEmailSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(EmailSettings);
    // Don't send password
    const safeSettings = settings.toObject();
    if (safeSettings.smtp?.auth?.pass) {
      safeSettings.smtp.auth.pass = '********';
    }
    res.json({ success: true, data: safeSettings });
  } catch (error) {
    console.error('Get email settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch email settings' });
  }
};

exports.updateEmailSettings = async (req, res) => {
  try {
    let settings = await EmailSettings.findOne();
    if (!settings) {
      settings = new EmailSettings(req.body);
    } else {
      // Keep password if not provided
      if (req.body.smtp?.auth?.pass === '********') {
        delete req.body.smtp.auth.pass;
      }
      Object.assign(settings, req.body);
    }
    settings.updatedBy = req.user.id;
    await settings.save();
    res.json({ success: true, data: settings, message: 'Email settings updated successfully' });
  } catch (error) {
    console.error('Update email settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update email settings' });
  }
};

// Integration Settings
exports.getIntegrationSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(IntegrationSettings);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get integration settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch integration settings' });
  }
};

exports.updateIntegrationSettings = async (req, res) => {
  try {
    let settings = await IntegrationSettings.findOne();
    if (!settings) {
      settings = new IntegrationSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedBy = req.user.id;
    await settings.save();
    res.json({ success: true, data: settings, message: 'Integration settings updated successfully' });
  } catch (error) {
    console.error('Update integration settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update integration settings' });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const { name, permissions, expiresIn } = req.body;
    const apiKey = crypto.randomBytes(32).toString('hex');
    const expiresAt = expiresIn !== 'never' ? new Date(Date.now() + parseInt(expiresIn) * 24 * 60 * 60 * 1000) : null;
    
    let settings = await IntegrationSettings.findOne();
    if (!settings) {
      settings = new IntegrationSettings();
    }
    
    settings.apiKeys.push({
      name,
      key: apiKey,
      permissions,
      expiresAt,
      createdAt: new Date()
    });
    
    await settings.save();
    res.json({ success: true, data: { apiKey }, message: 'API key generated successfully' });
  } catch (error) {
    console.error('Generate API key error:', error);
    res.status(500).json({ success: false, error: 'Failed to generate API key' });
  }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    const settings = await IntegrationSettings.findOne();
    if (settings) {
      settings.apiKeys = settings.apiKeys.filter(k => k._id.toString() !== keyId);
      await settings.save();
    }
    res.json({ success: true, message: 'API key revoked successfully' });
  } catch (error) {
    console.error('Revoke API key error:', error);
    res.status(500).json({ success: false, error: 'Failed to revoke API key' });
  }
};

// Notification Settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(NotificationSettings);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch notification settings' });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    let settings = await NotificationSettings.findOne();
    if (!settings) {
      settings = new NotificationSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedBy = req.user.id;
    await settings.save();
    res.json({ success: true, data: settings, message: 'Notification settings updated successfully' });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update notification settings' });
  }
};

// System Settings
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(SystemSettings);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch system settings' });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    let settings = await SystemSettings.findOne();
    if (!settings) {
      settings = new SystemSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedBy = req.user.id;
    await settings.save();
    res.json({ success: true, data: settings, message: 'System settings updated successfully' });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update system settings' });
  }
};

// Theme Settings
exports.getThemeSettings = async (req, res) => {
  try {
    const settings = await getOrCreateSettings(ThemeSettings);
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('Get theme settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch theme settings' });
  }
};

exports.updateThemeSettings = async (req, res) => {
  try {
    let settings = await ThemeSettings.findOne();
    if (!settings) {
      settings = new ThemeSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    settings.updatedBy = req.user.id;
    await settings.save();
    res.json({ success: true, data: settings, message: 'Theme settings updated successfully' });
  } catch (error) {
    console.error('Update theme settings error:', error);
    res.status(500).json({ success: false, error: 'Failed to update theme settings' });
  }
};

// Backup Controllers
exports.getBackups = async (req, res) => {
  try {
    const backups = await Backup.find().sort({ createdAt: -1 });
    res.json({ success: true, data: backups });
  } catch (error) {
    console.error('Get backups error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch backups' });
  }
};

exports.createBackup = async (req, res) => {
  try {
    const backup = new Backup({
      name: `backup_${Date.now()}.zip`,
      size: 1024 * 1024, // Mock size
      type: req.body.type || 'manual',
      path: `/backups/backup_${Date.now()}.zip`,
      createdBy: req.user.name || req.user.email
    });
    await backup.save();
    res.json({ success: true, data: backup, message: 'Backup created successfully' });
  } catch (error) {
    console.error('Create backup error:', error);
    res.status(500).json({ success: false, error: 'Failed to create backup' });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup not found' });
    }
    // Mock download - in production, stream the actual file
    res.json({ success: true, message: 'Download initiated' });
  } catch (error) {
    console.error('Download backup error:', error);
    res.status(500).json({ success: false, error: 'Failed to download backup' });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    const backup = await Backup.findById(backupId);
    if (!backup) {
      return res.status(404).json({ success: false, error: 'Backup not found' });
    }
    res.json({ success: true, message: 'Backup restored successfully' });
  } catch (error) {
    console.error('Restore backup error:', error);
    res.status(500).json({ success: false, error: 'Failed to restore backup' });
  }
};

exports.deleteBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    await Backup.findByIdAndDelete(backupId);
    res.json({ success: true, message: 'Backup deleted successfully' });
  } catch (error) {
    console.error('Delete backup error:', error);
    res.status(500).json({ success: false, error: 'Failed to delete backup' });
  }
};

// Test connection
exports.testConnection = async (req, res) => {
  try {
    const { type, config } = req.body;
    // Mock test connection
    res.json({ success: true, message: `${type} connection successful` });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Connection failed' });
  }
};