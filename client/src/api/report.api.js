// client/src/api/report.api.js
import api from './axios.config';

export const reportApi = {
  // Get reports dashboard
  getReportsDashboard: () => {
    return api.get('/reports/dashboard');
  },
  
  // Generate custom report
  generateCustomReport: (config) => {
    return api.post('/reports/generate', config, {
      responseType: config.format === 'pdf' ? 'blob' : 'text'
    });
  },
  
  // Save report template
  saveReportTemplate: (template) => {
    return api.post('/reports/templates', template);
  },
  
  // Get report templates
  getReportTemplates: () => {
    return api.get('/reports/templates');
  },
  
  // Get analytics dashboard
  getAnalyticsDashboard: () => {
    return api.get('/reports/analytics');
  },
  
  // Get attendance report
  getAttendanceReport: (type, startDate, endDate, department) => {
    return api.get('/reports/attendance', { params: { type, startDate, endDate, department } });
  },
  
  // Get task report
  getTaskReport: (type, startDate, endDate, assignedTo) => {
    return api.get('/reports/tasks', { params: { type, startDate, endDate, assignedTo } });
  },
  
  // Get salary report
  getSalaryReport: (month, year, department) => {
    return api.get('/reports/salary', { params: { month, year, department } });
  },
  
  // Export report
  exportReport: (reportId, format) => {
    return api.get(`/reports/export/${reportId}`, { params: { format }, responseType: 'blob' });
  },
  
  // Schedule report
  scheduleReport: (config) => {
    return api.post('/reports/schedule', config);
  },
  
  // Get scheduled reports
  getScheduledReports: () => {
    return api.get('/reports/scheduled');
  }
};