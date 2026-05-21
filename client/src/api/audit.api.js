// client/src/api/audit.api.js
import api from './axios.config';

export const auditApi = {
  getAuditLogs: (filters) => {
    return api.get('/audit/logs', { params: filters });
  },
  
  getAuditStats: () => {
    return api.get('/audit/stats');
  },
  
  exportAuditLogs: (filters, format) => {
    return api.get('/audit/export', { 
      params: { ...filters, format },
      responseType: 'blob'
    });
  }
};