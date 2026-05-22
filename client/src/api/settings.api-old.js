// client/src/api/settings.api.js
import api from './axios.config';

export const settingsApi = {
  // General Settings
  getGeneralSettings: async () => {
    try {
      const response = await api.get('/settings/general');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  updateGeneralSettings: async (data) => {
    try {
      const response = await api.put('/settings/general', data);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // System Settings
  getSystemSettings: async () => {
    try {
      const response = await api.get('/settings/system');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  updateSystemSettings: async (data) => {
    try {
      const response = await api.put('/settings/system', data);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Email Settings
  getEmailSettings: async () => {
    try {
      const response = await api.get('/settings/email');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  updateEmailSettings: async (data) => {
    try {
      const response = await api.put('/settings/email', data);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Notification Settings
  getNotificationSettings: async () => {
    try {
      const response = await api.get('/settings/notifications');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  updateNotificationSettings: async (data) => {
    try {
      const response = await api.put('/settings/notifications', data);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Integration Settings
  getIntegrationSettings: async () => {
    try {
      const response = await api.get('/settings/integrations');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  updateIntegrationSettings: async (data) => {
    try {
      const response = await api.put('/settings/integrations', data);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Theme Settings
  getThemeSettings: async () => {
    try {
      const response = await api.get('/settings/theme');
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  updateThemeSettings: async (data) => {
    try {
      const response = await api.put('/settings/theme', data);
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  // Backup Settings
  getBackups: async (params = {}) => {
    try {
      const response = await api.get('/settings/backups', { params });
      return { success: true, data: response.data?.data || [], pagination: response.data?.pagination };
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  },
  
  createBackup: async () => {
    try {
      const response = await api.post('/settings/backups');
      return { success: true, data: response.data?.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
  
  restoreBackup: async (backupId) => {
    try {
      const response = await api.post('/settings/backups/restore', { backupId });
      return { success: true, message: response.data?.message };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default settingsApi;