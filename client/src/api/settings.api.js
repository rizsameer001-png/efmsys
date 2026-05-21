// client/src/api/settings.api.js
import api from './axios.config';

export const settingsApi = {
  // ==================== GENERAL SETTINGS ====================
  
  /**
   * Get all general settings
   */
  getGeneralSettings: () => {
    return api.get('/settings/general');
  },
  
  /**
   * Update general settings
   * @param {Object} data - Settings data (companyName, logo, timezone, dateFormat, etc.)
   */
  updateGeneralSettings: (data) => {
    return api.put('/settings/general', data);
  },
  
  /**
   * Upload company logo
   * @param {File} file - Logo file
   */
  uploadLogo: (file) => {
    const formData = new FormData();
    formData.append('logo', file);
    return api.post('/settings/upload-logo', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  // ==================== SYSTEM SETTINGS ====================
  
  /**
   * Get system settings
   */
  getSystemSettings: () => {
    return api.get('/settings/system');
  },
  
  /**
   * Update system settings
   * @param {Object} data - System settings (maintenanceMode, debugMode, etc.)
   */
  updateSystemSettings: (data) => {
    return api.put('/settings/system', data);
  },
  
  /**
   * Toggle maintenance mode
   * @param {boolean} enabled - Maintenance mode status
   */
  toggleMaintenanceMode: (enabled) => {
    return api.post('/settings/maintenance-mode', { enabled });
  },
  
  /**
   * Clear system cache
   */
  clearCache: () => {
    return api.post('/settings/clear-cache');
  },
  
  // ==================== BACKUP & RESTORE ====================
  
  /**
   * Get backup list
   * @param {Object} params - Pagination params
   */
  getBackups: (params = { page: 1, limit: 20 }) => {
    return api.get('/settings/backups', { params });
  },
  
  /**
   * Create new backup
   * @param {Object} data - Backup options (includeDatabase, includeFiles, etc.)
   */
  createBackup: (data = {}) => {
    return api.post('/settings/backups', data);
  },
  
  /**
   * Download backup file
   * @param {string} backupId - Backup ID
   */
  downloadBackup: (backupId) => {
    return api.get(`/settings/backups/${backupId}/download`, {
      responseType: 'blob'
    });
  },
  
  /**
   * Restore from backup
   * @param {string} backupId - Backup ID
   * @param {Object} options - Restore options
   */
  restoreBackup: (backupId, options = {}) => {
    return api.post(`/settings/backups/${backupId}/restore`, options);
  },
  
  /**
   * Delete backup
   * @param {string} backupId - Backup ID
   */
  deleteBackup: (backupId) => {
    return api.delete(`/settings/backups/${backupId}`);
  },
  
  // ==================== AUDIT LOGS ====================
  
  /**
   * Get audit logs
   * @param {Object} params - Filter and pagination params
   */
  getAuditLogs: (params = { page: 1, limit: 50, user: null, action: null, startDate: null, endDate: null }) => {
    return api.get('/settings/audit-logs', { params });
  },
  
  /**
   * Get audit log by ID
   * @param {string} logId - Log ID
   */
  getAuditLogById: (logId) => {
    return api.get(`/settings/audit-logs/${logId}`);
  },
  
  /**
   * Export audit logs
   * @param {Object} params - Filter params
   * @param {string} format - Export format (csv, excel, pdf)
   */
  exportAuditLogs: (params, format = 'csv') => {
    return api.get('/settings/audit-logs/export', {
      params: { ...params, format },
      responseType: 'blob'
    });
  },
  
  // ==================== EMAIL SETTINGS ====================
  
  /**
   * Get email settings
   */
  getEmailSettings: () => {
    return api.get('/settings/email');
  },
  
  /**
   * Update email settings
   * @param {Object} data - Email configuration
   */
  updateEmailSettings: (data) => {
    return api.put('/settings/email', data);
  },
  
  /**
   * Test email configuration
   * @param {string} testEmail - Email address to send test email
   */
  testEmailConfig: (testEmail) => {
    return api.post('/settings/email/test', { testEmail });
  },
  
  // ==================== NOTIFICATION SETTINGS ====================
  
  /**
   * Get notification settings
   * @param {string} userId - User ID (optional, defaults to current user)
   */
  getNotificationSettings: (userId = null) => {
    const params = userId ? { userId } : {};
    return api.get('/settings/notifications', { params });
  },
  
  /**
   * Update notification settings
   * @param {Object} data - Notification preferences
   */
  updateNotificationSettings: (data) => {
    return api.put('/settings/notifications', data);
  },
  
  // ==================== ROLE & PERMISSION SETTINGS ====================
  
  /**
   * Get role settings
   */
  getRoleSettings: () => {
    return api.get('/settings/roles');
  },
  
  /**
   * Update role settings
   * @param {string} roleId - Role ID
   * @param {Object} data - Role data
   */
  updateRoleSettings: (roleId, data) => {
    return api.put(`/settings/roles/${roleId}`, data);
  },
  
  // ==================== INTEGRATION SETTINGS ====================
  
  /**
   * Get integration settings
   */
  getIntegrationSettings: () => {
    return api.get('/settings/integrations');
  },
  
  /**
   * Update integration settings
   * @param {string} integration - Integration name (slack, teams, etc.)
   * @param {Object} data - Integration configuration
   */
  updateIntegrationSettings: (integration, data) => {
    return api.put(`/settings/integrations/${integration}`, data);
  },
  
  // ==================== THEME SETTINGS ====================
  
  /**
   * Get theme settings
   */
  getThemeSettings: () => {
    return api.get('/settings/theme');
  },
  
  /**
   * Update theme settings
   * @param {Object} data - Theme configuration (primaryColor, darkMode, etc.)
   */
  updateThemeSettings: (data) => {
    return api.put('/settings/theme', data);
  },
  
  // ==================== API KEY MANAGEMENT ====================
  
  /**
   * Get API keys
   */
  getApiKeys: () => {
    return api.get('/settings/api-keys');
  },
  
  /**
   * Generate new API key
   * @param {Object} data - Key details (name, permissions, expiresAt)
   */
  generateApiKey: (data) => {
    return api.post('/settings/api-keys', data);
  },
  
  /**
   * Revoke API key
   * @param {string} keyId - API Key ID
   */
  revokeApiKey: (keyId) => {
    return api.delete(`/settings/api-keys/${keyId}`);
  },
  
  // ==================== DATA IMPORT/EXPORT ====================
  
  /**
   * Export all data
   * @param {Object} options - Export options (modules, format)
   */
  exportAllData: (options = {}) => {
    return api.post('/settings/export-data', options, {
      responseType: 'blob'
    });
  },
  
  /**
   * Import data
   * @param {File} file - Import file
   * @param {Object} options - Import options
   */
  importData: (file, options = {}) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('options', JSON.stringify(options));
    return api.post('/settings/import-data', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};