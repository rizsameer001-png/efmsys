const Settings = require('../models/Settings');
const AuditLog = require('../models/AuditLog');

// Get all settings
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch settings'
    });
  }
};

// Get general settings
exports.getGeneralSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings.general
    });
  } catch (error) {
    console.error('Get general settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch general settings'
    });
  }
};

// Update general settings
exports.updateGeneralSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const oldValue = { ...settings.general };
    
    settings.general = { ...settings.general, ...req.body };
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    // Log audit
    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'UPDATE',
      module: 'SETTINGS',
      description: 'Updated general settings',
      resourceType: 'Settings',
      oldValue,
      newValue: settings.general,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      data: settings.general,
      message: 'General settings updated successfully'
    });
  } catch (error) {
    console.error('Update general settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update general settings'
    });
  }
};

// Get email settings
exports.getEmailSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    // Don't send back sensitive data like password
    const emailSettings = { ...settings.email };
    delete emailSettings.smtpPassword;
    
    res.json({
      success: true,
      data: emailSettings
    });
  } catch (error) {
    console.error('Get email settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch email settings'
    });
  }
};

// Update email settings
exports.updateEmailSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const oldValue = { ...settings.email };
    
    // If password is not provided, keep the old one
    if (!req.body.smtpPassword && oldValue.smtpPassword) {
      delete req.body.smtpPassword;
    }
    
    settings.email = { ...settings.email, ...req.body };
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'UPDATE',
      module: 'SETTINGS',
      description: 'Updated email settings',
      resourceType: 'Settings',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    const emailSettings = { ...settings.email };
    delete emailSettings.smtpPassword;

    res.json({
      success: true,
      data: emailSettings,
      message: 'Email settings updated successfully'
    });
  } catch (error) {
    console.error('Update email settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update email settings'
    });
  }
};

// Get notification settings
exports.getNotificationSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings.notifications
    });
  } catch (error) {
    console.error('Get notification settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification settings'
    });
  }
};

// Update notification settings
exports.updateNotificationSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const oldValue = { ...settings.notifications };
    
    settings.notifications = { ...settings.notifications, ...req.body };
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'UPDATE',
      module: 'SETTINGS',
      description: 'Updated notification settings',
      resourceType: 'Settings',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      data: settings.notifications,
      message: 'Notification settings updated successfully'
    });
  } catch (error) {
    console.error('Update notification settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update notification settings'
    });
  }
};

// Get integration settings
exports.getIntegrationSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    // Don't send sensitive data
    const integrationSettings = { ...settings.integrations };
    delete integrationSettings.googleClientSecret;
    delete integrationSettings.facebookAppSecret;
    delete integrationSettings.stripeSecretKey;
    
    res.json({
      success: true,
      data: integrationSettings
    });
  } catch (error) {
    console.error('Get integration settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch integration settings'
    });
  }
};

// Update integration settings
exports.updateIntegrationSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const oldValue = { ...settings.integrations };
    
    settings.integrations = { ...settings.integrations, ...req.body };
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'UPDATE',
      module: 'SETTINGS',
      description: 'Updated integration settings',
      resourceType: 'Settings',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      data: settings.integrations,
      message: 'Integration settings updated successfully'
    });
  } catch (error) {
    console.error('Update integration settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update integration settings'
    });
  }
};

// Get theme settings
exports.getThemeSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings.theme
    });
  } catch (error) {
    console.error('Get theme settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch theme settings'
    });
  }
};

// Update theme settings
exports.updateThemeSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const oldValue = { ...settings.theme };
    
    settings.theme = { ...settings.theme, ...req.body };
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'UPDATE',
      module: 'SETTINGS',
      description: 'Updated theme settings',
      resourceType: 'Settings',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      data: settings.theme,
      message: 'Theme settings updated successfully'
    });
  } catch (error) {
    console.error('Update theme settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update theme settings'
    });
  }
};

// Get system settings
exports.getSystemSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({
      success: true,
      data: settings.system
    });
  } catch (error) {
    console.error('Get system settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch system settings'
    });
  }
};

// Update system settings
exports.updateSystemSettings = async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    const oldValue = { ...settings.system };
    
    settings.system = { ...settings.system, ...req.body };
    settings.updatedBy = req.user.id;
    settings.updatedAt = new Date();
    await settings.save();

    await AuditLog.create({
      userId: req.user.id,
      username: req.user.username,
      email: req.user.email,
      action: 'UPDATE',
      module: 'SETTINGS',
      description: 'Updated system settings',
      resourceType: 'Settings',
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      status: 'success'
    });

    res.json({
      success: true,
      data: settings.system,
      message: 'System settings updated successfully'
    });
  } catch (error) {
    console.error('Update system settings error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update system settings'
    });
  }
};