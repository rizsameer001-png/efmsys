// import api from './axios.config';

// export const settingsApi = {
//   // General Settings
//   getGeneralSettings: () => api.get('/settings/general'),
//   updateGeneralSettings: (data) => api.put('/settings/general', data),

//   // Email Settings
//   getEmailSettings: () => api.get('/settings/email'),
//   updateEmailSettings: (data) => api.put('/settings/email', data),
//   testEmailConfig: (email) => api.post('/settings/test-email', { email }),

//   // Notification Settings
//   getNotificationSettings: () => api.get('/settings/notifications'),
//   updateNotificationSettings: (data) => api.put('/settings/notifications', data),

//   // Integration Settings
//   getIntegrationSettings: () => api.get('/settings/integrations'),
//   updateIntegrationSettings: (data) => api.put('/settings/integrations', data),
//   generateApiKey: (data) => api.post('/settings/integrations/api-keys', data),
//   revokeApiKey: (keyId) => api.delete(`/settings/integrations/api-keys/${keyId}`),

//   // Theme Settings
//   getThemeSettings: () => api.get('/settings/theme'),
//   updateThemeSettings: (data) => api.put('/settings/theme', data),

//   // System Settings
//   getSystemSettings: () => api.get('/settings/system'),
//   updateSystemSettings: (data) => api.put('/settings/system', data),
//   testConnection: (type, config) => api.post('/settings/test-connection', { type, config }),

//   // Backup Settings
//   getBackups: () => api.get('/settings/backups'),
//   createBackup: (data) => api.post('/settings/backups', data),
//   downloadBackup: (backupId) => api.get(`/settings/backups/${backupId}/download`, { responseType: 'blob' }),
//   restoreBackup: (backupId) => api.post(`/settings/backups/${backupId}/restore`),
//   deleteBackup: (backupId) => api.delete(`/settings/backups/${backupId}`)
// };




// import api from './axios.config';

// // Debug flag - can be controlled via environment variable
// const DEBUG = import.meta.env.VITE_DEBUG_API === 'true';

// // Helper for debug logging
// const debugLog = (method, url, data = null) => {
//   if (DEBUG) {
//     console.log(`[Settings API] ${method} ${url}`);
//     if (data) console.log('Request Data:', data);
//   }
// };

// // Error handler wrapper
// const handleApiCall = async (apiCall, method, url, data = null) => {
//   try {
//     debugLog(method, url, data);
//     const response = await apiCall();
    
//     if (DEBUG) {
//       console.log(`[Settings API] ${method} ${url} - Success:`, response.status);
//     }
    
//     return response;
//   } catch (error) {
//     console.error(`[Settings API Error] ${method} ${url}:`, error.response?.data || error.message);
    
//     // Enhanced error object with more details
//     const enhancedError = {
//       ...error,
//       userMessage: error.response?.data?.error || 'An error occurred. Please try again.',
//       statusCode: error.response?.status,
//       endpoint: url,
//       method: method
//     };
    
//     throw enhancedError;
//   }
// };

// export const settingsApi = {
//   // ==================== GENERAL SETTINGS ====================
//   getGeneralSettings: async () => {
//     return handleApiCall(
//       () => api.get('/settings/general'),
//       'GET',
//       '/settings/general'
//     );
//   },

//   updateGeneralSettings: async (data) => {
//     return handleApiCall(
//       () => api.put('/settings/general', data),
//       'PUT',
//       '/settings/general',
//       data
//     );
//   },

//   // ==================== EMAIL SETTINGS ====================
//   getEmailSettings: async () => {
//     return handleApiCall(
//       () => api.get('/settings/email'),
//       'GET',
//       '/settings/email'
//     );
//   },

//   updateEmailSettings: async (data) => {
//     // Remove masked password before sending
//     const cleanData = { ...data };
//     if (cleanData.smtp?.auth?.pass === '********') {
//       delete cleanData.smtp.auth.pass;
//     }
    
//     return handleApiCall(
//       () => api.put('/settings/email', cleanData),
//       'PUT',
//       '/settings/email',
//       cleanData
//     );
//   },

//   testEmailConfig: async (email) => {
//     if (!email) {
//       throw new Error('Email address is required');
//     }
    
//     return handleApiCall(
//       () => api.post('/settings/test-email', { email }),
//       'POST',
//       '/settings/test-email',
//       { email }
//     );
//   },

//   // ==================== NOTIFICATION SETTINGS ====================
//   getNotificationSettings: async () => {
//     return handleApiCall(
//       () => api.get('/settings/notifications'),
//       'GET',
//       '/settings/notifications'
//     );
//   },

//   updateNotificationSettings: async (data) => {
//     return handleApiCall(
//       () => api.put('/settings/notifications', data),
//       'PUT',
//       '/settings/notifications',
//       data
//     );
//   },

//   // ==================== INTEGRATION SETTINGS ====================
//   getIntegrationSettings: async () => {
//     return handleApiCall(
//       () => api.get('/settings/integrations'),
//       'GET',
//       '/settings/integrations'
//     );
//   },

//   updateIntegrationSettings: async (data) => {
//     // Remove sensitive data from logs if needed
//     const safeData = { ...data };
//     if (safeData.slack?.webhookUrl) {
//       safeData.slack.webhookUrl = '[REDACTED]';
//     }
//     if (safeData.teams?.webhookUrl) {
//       safeData.teams.webhookUrl = '[REDACTED]';
//     }
    
//     debugLog('PUT', '/settings/integrations (data redacted)', safeData);
    
//     return handleApiCall(
//       () => api.put('/settings/integrations', data),
//       'PUT',
//       '/settings/integrations',
//       data
//     );
//   },

//   generateApiKey: async (data) => {
//     if (!data.name) {
//       throw new Error('API key name is required');
//     }
    
//     return handleApiCall(
//       () => api.post('/settings/integrations/api-keys', data),
//       'POST',
//       '/settings/integrations/api-keys',
//       data
//     );
//   },

//   revokeApiKey: async (keyId) => {
//     if (!keyId) {
//       throw new Error('API key ID is required');
//     }
    
//     return handleApiCall(
//       () => api.delete(`/settings/integrations/api-keys/${keyId}`),
//       'DELETE',
//       `/settings/integrations/api-keys/${keyId}`
//     );
//   },

//   // ==================== THEME SETTINGS ====================
//   getThemeSettings: async () => {
//     return handleApiCall(
//       () => api.get('/settings/theme'),
//       'GET',
//       '/settings/theme'
//     );
//   },

//   updateThemeSettings: async (data) => {
//     return handleApiCall(
//       () => api.put('/settings/theme', data),
//       'PUT',
//       '/settings/theme',
//       data
//     );
//   },

//   // ==================== SYSTEM SETTINGS ====================
//   getSystemSettings: async () => {
//     return handleApiCall(
//       () => api.get('/settings/system'),
//       'GET',
//       '/settings/system'
//     );
//   },

//   updateSystemSettings: async (data) => {
//     return handleApiCall(
//       () => api.put('/settings/system', data),
//       'PUT',
//       '/settings/system',
//       data
//     );
//   },

//   testConnection: async (type, config) => {
//     if (!type) {
//       throw new Error('Connection type is required');
//     }
    
//     return handleApiCall(
//       () => api.post('/settings/test-connection', { type, config }),
//       'POST',
//       '/settings/test-connection',
//       { type, config: config ? '[CONFIG PROVIDED]' : undefined }
//     );
//   },

//   // ==================== BACKUP SETTINGS ====================
//   getBackups: async () => {
//     return handleApiCall(
//       () => api.get('/settings/backups'),
//       'GET',
//       '/settings/backups'
//     );
//   },

//   createBackup: async (data = {}) => {
//     return handleApiCall(
//       () => api.post('/settings/backups', data),
//       'POST',
//       '/settings/backups',
//       data
//     );
//   },

//   downloadBackup: async (backupId) => {
//     if (!backupId) {
//       throw new Error('Backup ID is required');
//     }
    
//     try {
//       debugLog('GET', `/settings/backups/${backupId}/download (blob)`);
//       const response = await api.get(`/settings/backups/${backupId}/download`, {
//         responseType: 'blob'
//       });
      
//       if (DEBUG) {
//         console.log(`[Settings API] Download backup - Success:`, response.status);
//       }
      
//       return response;
//     } catch (error) {
//       console.error(`[Settings API Error] Download backup:`, error.response?.data || error.message);
//       throw error;
//     }
//   },

//   restoreBackup: async (backupId) => {
//     if (!backupId) {
//       throw new Error('Backup ID is required');
//     }
    
//     return handleApiCall(
//       () => api.post(`/settings/backups/${backupId}/restore`),
//       'POST',
//       `/settings/backups/${backupId}/restore`
//     );
//   },

//   deleteBackup: async (backupId) => {
//     if (!backupId) {
//       throw new Error('Backup ID is required');
//     }
    
//     return handleApiCall(
//       () => api.delete(`/settings/backups/${backupId}`),
//       'DELETE',
//       `/settings/backups/${backupId}`
//     );
//   }
// };

// // Export a helper to check API health
// export const checkSettingsHealth = async () => {
//   try {
//     const response = await api.get('/settings/general');
//     return { success: true, message: 'Settings API is healthy' };
//   } catch (error) {
//     return { 
//       success: false, 
//       message: 'Settings API is not responding',
//       error: error.message 
//     };
//   }
// };

// export default settingsApi;






import api from './axios.config';

// Debug flag - can be controlled via environment variable
const DEBUG = import.meta.env.VITE_DEBUG_API === 'true';

// Helper for debug logging
const debugLog = (method, url, data = null) => {
  if (DEBUG) {
    console.log(`[Settings API] ${method} ${url}`);
    if (data) console.log('Request Data:', data);
  }
};

// Error handler wrapper
const handleApiCall = async (apiCall, method, url, data = null) => {
  try {
    debugLog(method, url, data);
    const response = await apiCall();
    
    if (DEBUG) {
      console.log(`[Settings API] ${method} ${url} - Success:`, response.status);
    }
    
    return response;
  } catch (error) {
    console.error(`[Settings API Error] ${method} ${url}:`, error.response?.data || error.message);
    
    // Enhanced error object with more details
    const enhancedError = {
      ...error,
      userMessage: error.response?.data?.error || error.response?.data?.message || 'An error occurred. Please try again.',
      statusCode: error.response?.status,
      endpoint: url,
      method: method
    };
    
    throw enhancedError;
  }
};

// Special handler for blob downloads
const handleBlobDownload = async (apiCall, backupId) => {
  try {
    debugLog('GET', `/settings/backups/${backupId}/download (blob)`);
    const response = await apiCall();
    
    // Check if response is valid blob
    if (!response.data || response.data.size === 0) {
      throw new Error('Downloaded file is empty');
    }
    
    // Check if response is actually an error JSON (sometimes server returns error as JSON even with blob responseType)
    if (response.data.type === 'application/json') {
      const text = await response.data.text();
      try {
        const errorData = JSON.parse(text);
        if (!errorData.success) {
          throw new Error(errorData.error || 'Failed to download backup');
        }
      } catch (e) {
        // Not JSON, proceed with download
      }
    }
    
    if (DEBUG) {
      console.log(`[Settings API] Download backup - Success:`, response.status);
      console.log(`[Settings API] File size: ${response.data.size} bytes`);
    }
    
    return response;
  } catch (error) {
    console.error(`[Settings API Error] Download backup:`, error.response?.data || error.message);
    
    // Try to extract error message from blob if possible
    let errorMessage = error.message || 'Failed to download backup';
    if (error.response?.data instanceof Blob && error.response.data.type === 'application/json') {
      try {
        const text = await error.response.data.text();
        const errorData = JSON.parse(text);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        // Ignore parsing error
      }
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }
    
    const enhancedError = {
      ...error,
      userMessage: errorMessage,
      statusCode: error.response?.status,
      endpoint: `/settings/backups/${backupId}/download`,
      method: 'GET'
    };
    
    throw enhancedError;
  }
};

export const settingsApi = {
  // ==================== GENERAL SETTINGS ====================
  getGeneralSettings: async () => {
    return handleApiCall(
      () => api.get('/settings/general'),
      'GET',
      '/settings/general'
    );
  },

  updateGeneralSettings: async (data) => {
    return handleApiCall(
      () => api.put('/settings/general', data),
      'PUT',
      '/settings/general',
      data
    );
  },

  // ==================== EMAIL SETTINGS ====================
  getEmailSettings: async () => {
    return handleApiCall(
      () => api.get('/settings/email'),
      'GET',
      '/settings/email'
    );
  },

  updateEmailSettings: async (data) => {
    // Remove masked password before sending
    const cleanData = { ...data };
    if (cleanData.smtp?.auth?.pass === '********') {
      delete cleanData.smtp.auth.pass;
    }
    
    return handleApiCall(
      () => api.put('/settings/email', cleanData),
      'PUT',
      '/settings/email',
      cleanData
    );
  },

  testEmailConfig: async (email) => {
    if (!email) {
      throw new Error('Email address is required');
    }
    
    return handleApiCall(
      () => api.post('/settings/test-email', { email }),
      'POST',
      '/settings/test-email',
      { email }
    );
  },

  // ==================== NOTIFICATION SETTINGS ====================
  getNotificationSettings: async () => {
    return handleApiCall(
      () => api.get('/settings/notifications'),
      'GET',
      '/settings/notifications'
    );
  },

  updateNotificationSettings: async (data) => {
    return handleApiCall(
      () => api.put('/settings/notifications', data),
      'PUT',
      '/settings/notifications',
      data
    );
  },

  // ==================== INTEGRATION SETTINGS ====================
  getIntegrationSettings: async () => {
    return handleApiCall(
      () => api.get('/settings/integrations'),
      'GET',
      '/settings/integrations'
    );
  },

  updateIntegrationSettings: async (data) => {
    // Remove sensitive data from logs if needed
    const safeData = { ...data };
    if (safeData.slack?.webhookUrl) {
      safeData.slack.webhookUrl = '[REDACTED]';
    }
    if (safeData.teams?.webhookUrl) {
      safeData.teams.webhookUrl = '[REDACTED]';
    }
    
    debugLog('PUT', '/settings/integrations (data redacted)', safeData);
    
    return handleApiCall(
      () => api.put('/settings/integrations', data),
      'PUT',
      '/settings/integrations',
      data
    );
  },

  generateApiKey: async (data) => {
    if (!data.name) {
      throw new Error('API key name is required');
    }
    
    return handleApiCall(
      () => api.post('/settings/integrations/api-keys', data),
      'POST',
      '/settings/integrations/api-keys',
      data
    );
  },

  revokeApiKey: async (keyId) => {
    if (!keyId) {
      throw new Error('API key ID is required');
    }
    
    return handleApiCall(
      () => api.delete(`/settings/integrations/api-keys/${keyId}`),
      'DELETE',
      `/settings/integrations/api-keys/${keyId}`
    );
  },

  // ==================== THEME SETTINGS ====================
  getThemeSettings: async () => {
    return handleApiCall(
      () => api.get('/settings/theme'),
      'GET',
      '/settings/theme'
    );
  },

  updateThemeSettings: async (data) => {
    return handleApiCall(
      () => api.put('/settings/theme', data),
      'PUT',
      '/settings/theme',
      data
    );
  },

  // ==================== SYSTEM SETTINGS ====================
  getSystemSettings: async () => {
    return handleApiCall(
      () => api.get('/settings/system'),
      'GET',
      '/settings/system'
    );
  },

  updateSystemSettings: async (data) => {
    return handleApiCall(
      () => api.put('/settings/system', data),
      'PUT',
      '/settings/system',
      data
    );
  },

  testConnection: async (type, config) => {
    if (!type) {
      throw new Error('Connection type is required');
    }
    
    return handleApiCall(
      () => api.post('/settings/test-connection', { type, config }),
      'POST',
      '/settings/test-connection',
      { type, config: config ? '[CONFIG PROVIDED]' : undefined }
    );
  },

  // ==================== BACKUP SETTINGS ====================
  getBackups: async () => {
    return handleApiCall(
      () => api.get('/settings/backups'),
      'GET',
      '/settings/backups'
    );
  },

  createBackup: async (data = {}) => {
    return handleApiCall(
      () => api.post('/settings/backups', data),
      'POST',
      '/settings/backups',
      data
    );
  },

  downloadBackup: async (backupId) => {
    if (!backupId) {
      throw new Error('Backup ID is required');
    }
    
    return handleBlobDownload(
      () => api.get(`/settings/backups/${backupId}/download`, {
        responseType: 'blob',
        timeout: 60000 // 60 second timeout for large files
      }),
      backupId
    );
  },

  restoreBackup: async (backupId) => {
    if (!backupId) {
      throw new Error('Backup ID is required');
    }
    
    return handleApiCall(
      () => api.post(`/settings/backups/${backupId}/restore`),
      'POST',
      `/settings/backups/${backupId}/restore`
    );
  },

  deleteBackup: async (backupId) => {
    if (!backupId) {
      throw new Error('Backup ID is required');
    }
    
    return handleApiCall(
      () => api.delete(`/settings/backups/${backupId}`),
      'DELETE',
      `/settings/backups/${backupId}`
    );
  }
};

// Export a helper to check API health
export const checkSettingsHealth = async () => {
  try {
    const response = await api.get('/settings/general');
    return { success: true, message: 'Settings API is healthy' };
  } catch (error) {
    return { 
      success: false, 
      message: 'Settings API is not responding',
      error: error.message 
    };
  }
};

export default settingsApi;