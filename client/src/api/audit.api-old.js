// client/src/api/audit.api.js
import api from './axios.config';

export const auditApi = {
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/audit/logs', { params });
      return { success: true, data: response.data?.data || [], pagination: response.data?.pagination };
    } catch (error) {
      return { success: false, data: [], error: error.message };
    }
  },
  
  getAuditStats: async () => {
    try {
      const response = await api.get('/audit/stats');
      return { success: true, data: response.data?.data || {} };
    } catch (error) {
      return { success: false, data: null, error: error.message };
    }
  },
  
  exportAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/audit/export', { params, responseType: 'blob' });
      return { success: true, blob: response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
};

export default auditApi;