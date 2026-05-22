// import api from './axios.config';

// export const auditApi = {
//   getAuditLogs: (params) => api.get('/audit/logs', { params }),
//   getAuditStats: (params) => api.get('/audit/stats', { params }),
//   exportAuditLogs: (params, format) => api.get('/audit/export', { 
//     params: { ...params, format },
//     responseType: 'blob' 
//   })
// };


import api from './axios.config';

// Debug flag from environment
const DEBUG = import.meta.env.VITE_DEBUG_API === 'true' || localStorage.getItem('debug_api') === 'true';

// Helper for debug logging
const debugLog = (method, url, params = null, data = null) => {
  if (DEBUG) {
    console.log(`[Audit API] ${method} ${url}`);
    if (params) console.log('Params:', params);
    if (data) console.log('Data:', data);
  }
};

// Helper to clean undefined/empty params
const cleanParams = (params) => {
  const cleaned = {};
  if (!params) return cleaned;
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    // Keep values that are not null, undefined, or empty string
    if (value !== null && value !== undefined && value !== '') {
      // Convert dates to ISO string if needed
      if (value instanceof Date) {
        cleaned[key] = value.toISOString();
      } else {
        cleaned[key] = value;
      }
    }
  });
  
  return cleaned;
};

// Error handler wrapper
const handleApiCall = async (apiCall, method, url, params = null, options = {}) => {
  try {
    debugLog(method, url, params);
    const response = await apiCall();
    
    if (DEBUG) {
      console.log(`[Audit API] ${method} ${url} - Success:`, response.status);
      if (response.data && response.data.data?.logs) {
        console.log(`[Audit API] Retrieved ${response.data.data.logs.length} logs`);
      }
    }
    
    return response;
  } catch (error) {
    console.error(`[Audit API Error] ${method} ${url}:`, {
      status: error.response?.status,
      message: error.response?.data?.error || error.message,
      params
    });
    
    // Enhance error with user-friendly message
    const enhancedError = {
      ...error,
      userMessage: error.response?.data?.error || error.userMessage || 'Failed to fetch audit data',
      statusCode: error.response?.status,
      endpoint: url,
      method: method,
      requestParams: params
    };
    
    throw enhancedError;
  }
};

export const auditApi = {
  /**
   * Get audit logs with pagination and filters
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.action - Action type (CREATE, UPDATE, DELETE, etc.)
   * @param {string} params.user - Username to filter by
   * @param {string} params.module - Module name
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 50)
   * @param {string} params.sortBy - Sort field (default: createdAt)
   * @param {string} params.sortOrder - Sort order (asc/desc, default: desc)
   */
  getAuditLogs: async (params = {}) => {
    const cleanedParams = cleanParams(params);
    
    // Ensure default values
    if (!cleanedParams.page) cleanedParams.page = 1;
    if (!cleanedParams.limit) cleanedParams.limit = 50;
    if (!cleanedParams.sortOrder) cleanedParams.sortOrder = 'desc';
    if (!cleanedParams.sortBy) cleanedParams.sortBy = 'createdAt';
    
    return handleApiCall(
      () => api.get('/audit/logs', { params: cleanedParams }),
      'GET',
      '/audit/logs',
      cleanedParams
    );
  },

  /**
   * Get audit statistics
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   */
  getAuditStats: async (params = {}) => {
    const cleanedParams = cleanParams(params);
    
    return handleApiCall(
      () => api.get('/audit/stats', { params: cleanedParams }),
      'GET',
      '/audit/stats',
      cleanedParams
    );
  },

  /**
   * Export audit logs to CSV or JSON
   * @param {Object} params - Query parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.action - Action type filter
   * @param {string} params.user - Username filter
   * @param {string} params.module - Module filter
   * @param {string} format - Export format ('csv' or 'json')
   * @returns {Promise<Blob>} - File blob for download
   */
  exportAuditLogs: async (params = {}, format = 'csv') => {
    const cleanedParams = cleanParams(params);
    cleanedParams.format = format;
    
    try {
      debugLog('GET', '/audit/export', cleanedParams);
      
      const response = await api.get('/audit/export', {
        params: cleanedParams,
        responseType: 'blob'
      });
      
      if (DEBUG) {
        console.log(`[Audit API] Export - Success: ${format.toUpperCase()} file ready`);
        console.log(`[Audit API] File size: ${response.data.size} bytes`);
      }
      
      return response;
    } catch (error) {
      console.error(`[Audit API Error] Export:`, error);
      
      // Try to parse error from blob response
      let errorMessage = 'Failed to export audit logs';
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          errorMessage = parsed.error || parsed.message || errorMessage;
        } catch (e) {
          // If can't parse, use default message
        }
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      
      const enhancedError = {
        ...error,
        userMessage: errorMessage,
        statusCode: error.response?.status,
        endpoint: '/audit/export',
        method: 'GET'
      };
      
      throw enhancedError;
    }
  },

  /**
   * Get available actions list (for filter dropdown)
   * @returns {Promise<Object>} - List of available actions
   */
  getAvailableActions: async () => {
    return handleApiCall(
      () => api.get('/audit/actions'),
      'GET',
      '/audit/actions'
    );
  },

  /**
   * Get available modules list (for filter dropdown)
   * @returns {Promise<Object>} - List of available modules
   */
  getAvailableModules: async () => {
    return handleApiCall(
      () => api.get('/audit/modules'),
      'GET',
      '/audit/modules'
    );
  },

  /**
   * Get audit summary by date range
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @returns {Promise<Object>} - Summary statistics
   */
  getAuditSummary: async (startDate, endDate) => {
    const params = cleanParams({ startDate, endDate });
    
    return handleApiCall(
      () => api.get('/audit/summary', { params }),
      'GET',
      '/audit/summary',
      params
    );
  },

  /**
   * Get user activity timeline
   * @param {string} userId - User ID
   * @param {number} days - Number of days to look back (default: 7)
   * @returns {Promise<Object>} - User activity timeline
   */
  getUserActivity: async (userId, days = 7) => {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return handleApiCall(
      () => api.get(`/audit/users/${userId}/activity`, { params: { days } }),
      'GET',
      `/audit/users/${userId}/activity`,
      { days }
    );
  },

  /**
   * Get detailed log by ID
   * @param {string} logId - Audit log ID
   * @returns {Promise<Object>} - Detailed log entry
   */
  getAuditLogById: async (logId) => {
    if (!logId) {
      throw new Error('Log ID is required');
    }
    
    return handleApiCall(
      () => api.get(`/audit/logs/${logId}`),
      'GET',
      `/audit/logs/${logId}`
    );
  },

  /**
   * Download audit report
   * @param {Object} params - Report parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.reportType - Type of report (summary, detailed, user-activity)
   * @returns {Promise<Blob>} - PDF/Excel report
   */
  downloadAuditReport: async (params = {}, reportType = 'detailed') => {
    const cleanedParams = cleanParams(params);
    cleanedParams.reportType = reportType;
    
    try {
      debugLog('GET', '/audit/report', cleanedParams);
      
      const response = await api.get('/audit/report', {
        params: cleanedParams,
        responseType: 'blob'
      });
      
      if (DEBUG) {
        console.log(`[Audit API] Report downloaded: ${reportType}`);
      }
      
      return response;
    } catch (error) {
      console.error(`[Audit API Error] Download report:`, error);
      
      let errorMessage = 'Failed to download audit report';
      if (error.response?.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          const parsed = JSON.parse(text);
          errorMessage = parsed.error || parsed.message || errorMessage;
        } catch (e) {
          // Use default message
        }
      }
      
      const enhancedError = {
        ...error,
        userMessage: errorMessage,
        statusCode: error.response?.status
      };
      
      throw enhancedError;
    }
  }
};

// Helper function to download blob files
export const downloadBlobFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Helper function to format export filename
export const getExportFilename = (format = 'csv', prefix = 'audit-logs') => {
  const date = new Date().toISOString().split('T')[0];
  const time = new Date().toTimeString().split(' ')[0].replace(/:/g, '-');
  return `${prefix}_${date}_${time}.${format}`;
};

// Default export
export default auditApi;