// server/src/controllers/settings.controller.js
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// ==================== GENERAL SETTINGS ====================

exports.getGeneralSettings = async (req, res) => {
  try {
    // In production, these would come from database
    const settings = {
      companyName: 'FMS Enterprise',
      companyEmail: 'info@fms.com',
      companyPhone: '+971 4 212 3456',
      companyAddress: 'Dubai Silicon Oasis, Dubai, UAE',
      timezone: 'Asia/Dubai',
      dateFormat: 'DD/MM/YYYY',
      timeFormat: '24h',
      language: 'en',
      logoUrl: '/uploads/logo.png',
      faviconUrl: '/uploads/favicon.ico'
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateGeneralSettings = async (req, res) => {
  try {
    // Save to database
    res.json({ success: true, message: 'Settings updated successfully', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const logoUrl = `/uploads/logos/${req.file.filename}`;
    res.json({ success: true, data: { logoUrl }, message: 'Logo uploaded successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== SYSTEM SETTINGS ====================

exports.getSystemSettings = async (req, res) => {
  try {
    const settings = {
      systemName: 'FMS Enterprise',
      version: '2.0.0',
      maintenanceMode: false,
      debugMode: false,
      apiRateLimit: 100,
      sessionTimeout: 60,
      maxLoginAttempts: 5,
      requireEmailVerification: true,
      allowSelfRegistration: false,
      maxUploadSize: 10,
      allowedFileTypes: ['jpg', 'png', 'pdf', 'doc', 'docx']
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateSystemSettings = async (req, res) => {
  try {
    res.json({ success: true, message: 'System settings updated', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.toggleMaintenanceMode = async (req, res) => {
  try {
    const { enabled } = req.body;
    res.json({ success: true, message: `Maintenance mode ${enabled ? 'enabled' : 'disabled'}`, data: { enabled } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.clearCache = async (req, res) => {
  try {
    // Clear various caches
    res.json({ success: true, message: 'Cache cleared successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== BACKUP & RESTORE ====================

exports.getBackups = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    // Mock backup data
    const backups = [
      { id: '1', name: 'backup_2024_01_01.sql', size: '45.2 MB', createdAt: new Date(2024, 0, 1).toISOString(), type: 'full' },
      { id: '2', name: 'backup_2024_01_15.sql', size: '48.1 MB', createdAt: new Date(2024, 0, 15).toISOString(), type: 'full' },
      { id: '3', name: 'backup_2024_02_01.sql', size: '46.8 MB', createdAt: new Date(2024, 1, 1).toISOString(), type: 'full' }
    ];
    res.json({
      success: true,
      data: backups,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: backups.length, pages: 1 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.createBackup = async (req, res) => {
  try {
    const backup = {
      id: Date.now().toString(),
      name: `backup_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.sql`,
      size: '45.2 MB',
      createdAt: new Date().toISOString(),
      type: 'full'
    };
    res.json({ success: true, message: 'Backup created successfully', data: backup });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.downloadBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    // Generate mock file content
    const mockContent = `Backup file for ${backupId}\nCreated at: ${new Date().toISOString()}`;
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=backup_${backupId}.sql`);
    res.send(mockContent);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.restoreBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    res.json({ success: true, message: `Backup ${backupId} restored successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteBackup = async (req, res) => {
  try {
    const { backupId } = req.params;
    res.json({ success: true, message: `Backup ${backupId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== AUDIT LOGS ====================

exports.getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, user, action, startDate, endDate } = req.query;
    
    const logs = [
      {
        id: '1',
        userId: 'user_001',
        userName: 'Admin User',
        userEmail: 'admin@fms.com',
        action: 'USER_LOGIN',
        module: 'Auth',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        userId: 'user_002',
        userName: 'John Doe',
        userEmail: 'john@fms.com',
        action: 'TASK_CREATED',
        module: 'Tasks',
        details: 'Created new task: Fix AC in Tower A',
        ipAddress: '192.168.1.2',
        userAgent: 'Chrome/120.0',
        createdAt: new Date(Date.now() - 3600000).toISOString()
      }
    ];
    
    res.json({
      success: true,
      data: logs,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: logs.length, pages: 1 }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getAuditLogById = async (req, res) => {
  try {
    const { logId } = req.params;
    res.json({
      success: true,
      data: {
        id: logId,
        userId: 'user_001',
        userName: 'Admin User',
        action: 'USER_LOGIN',
        module: 'Auth',
        details: 'User logged in successfully',
        ipAddress: '192.168.1.1',
        userAgent: 'Chrome/120.0',
        createdAt: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.exportAuditLogs = async (req, res) => {
  try {
    const { format = 'csv', startDate, endDate, action, user } = req.query;
    
    if (format === 'csv') {
      const csv = 'Date,User,Action,Module,Details,IP Address\n' +
        `${new Date().toISOString()},admin@fms.com,LOGIN,Auth,User logged in,192.168.1.1\n` +
        `${new Date(Date.now() - 3600000).toISOString()},john@fms.com,TASK_CREATED,Tasks,Created task,192.168.1.2`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=audit_logs.csv');
      return res.send(csv);
    }
    
    res.json({ success: true, message: 'Export prepared', data: { format, url: '/exports/audit_logs.xlsx' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== EMAIL SETTINGS ====================

exports.getEmailSettings = async (req, res) => {
  try {
    const settings = {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpSecure: true,
      smtpUser: 'noreply@fms.com',
      smtpPassword: '********',
      fromEmail: 'noreply@fms.com',
      fromName: 'FMS Enterprise',
      emailTemplates: {
        welcome: true,
        passwordReset: true,
        taskAssigned: true,
        taskCompleted: true,
        paymentReceipt: true,
        leaveApproved: true
      }
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateEmailSettings = async (req, res) => {
  try {
    res.json({ success: true, message: 'Email settings updated successfully', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.testEmailConfig = async (req, res) => {
  try {
    const { testEmail } = req.body;
    // In production, send actual test email
    res.json({ success: true, message: `Test email sent to ${testEmail}` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== NOTIFICATION SETTINGS ====================

exports.getNotificationSettings = async (req, res) => {
  try {
    const { userId } = req.query;
    const settings = {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      inAppNotifications: true,
      types: {
        taskAssigned: true,
        taskCompleted: true,
        taskOverdue: true,
        paymentReceived: true,
        leaveRequest: true,
        leaveApproved: true,
        newUser: true,
        complaintUpdate: true
      },
      quietHours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      }
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateNotificationSettings = async (req, res) => {
  try {
    res.json({ success: true, message: 'Notification settings updated', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== ROLE & PERMISSION SETTINGS ====================

exports.getRoleSettings = async (req, res) => {
  try {
    const roles = [
      { id: '1', name: 'super_admin', permissions: ['all'], userCount: 2 },
      { id: '2', name: 'admin', permissions: ['user.read', 'user.write', 'task.read', 'task.write'], userCount: 5 },
      { id: '3', name: 'manager', permissions: ['task.read', 'task.write', 'team.read'], userCount: 8 },
      { id: '4', name: 'technician', permissions: ['task.read', 'task.update'], userCount: 25 }
    ];
    res.json({ success: true, data: roles });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateRoleSettings = async (req, res) => {
  try {
    const { roleId } = req.params;
    res.json({ success: true, message: `Role ${roleId} updated successfully`, data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== INTEGRATION SETTINGS ====================

exports.getIntegrationSettings = async (req, res) => {
  try {
    const integrations = {
      googleMaps: { enabled: true, apiKey: 'AIzaSyXXXXXXXXXXXX' },
      slack: { enabled: false, webhookUrl: '', channel: '' },
      teams: { enabled: false, webhookUrl: '' },
      zapier: { enabled: false, webhookUrl: '' },
      paymentGateway: { enabled: false, provider: 'stripe', apiKey: '', webhookSecret: '' }
    };
    res.json({ success: true, data: integrations });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateIntegrationSettings = async (req, res) => {
  try {
    const { integration } = req.params;
    res.json({ success: true, message: `${integration} settings updated`, data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== THEME SETTINGS ====================

exports.getThemeSettings = async (req, res) => {
  try {
    const settings = {
      primaryColor: '#3b82f6',
      secondaryColor: '#10b981',
      accentColor: '#8b5cf6',
      darkMode: false,
      sidebarCollapsed: false,
      compactView: false,
      fontSize: 'medium',
      borderRadius: '0.5rem'
    };
    res.json({ success: true, data: settings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.updateThemeSettings = async (req, res) => {
  try {
    res.json({ success: true, message: 'Theme settings updated', data: req.body });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== API KEY MANAGEMENT ====================

exports.getApiKeys = async (req, res) => {
  try {
    const apiKeys = [
      { id: '1', name: 'Production API Key', key: 'pk_live_xxxxx', permissions: ['read', 'write'], expiresAt: null, lastUsed: new Date().toISOString() },
      { id: '2', name: 'Testing API Key', key: 'pk_test_xxxxx', permissions: ['read'], expiresAt: new Date(2025, 0, 1).toISOString(), lastUsed: null }
    ];
    res.json({ success: true, data: apiKeys });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.generateApiKey = async (req, res) => {
  try {
    const { name, permissions, expiresAt } = req.body;
    const newKey = {
      id: Date.now().toString(),
      name,
      key: `pk_${Math.random().toString(36).substring(2, 15)}`,
      permissions,
      expiresAt: expiresAt || null,
      createdAt: new Date().toISOString()
    };
    res.json({ success: true, message: 'API key generated', data: newKey });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.revokeApiKey = async (req, res) => {
  try {
    const { keyId } = req.params;
    res.json({ success: true, message: `API key ${keyId} revoked successfully` });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// ==================== DATA IMPORT/EXPORT ====================

exports.exportAllData = async (req, res) => {
  try {
    const { format = 'json', modules = [] } = req.body;
    
    if (format === 'csv') {
      const csv = 'Module,Count,Data\nUsers,45,User data\nTasks,128,Task data\nBuildings,12,Building data';
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=export_data.csv');
      return res.send(csv);
    }
    
    const exportData = {
      exportedAt: new Date().toISOString(),
      version: '2.0.0',
      users: [],
      tasks: [],
      buildings: []
    };
    res.json({ success: true, message: 'Data export prepared', data: exportData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    res.json({ success: true, message: 'Data import started', data: { file: req.file.filename } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};