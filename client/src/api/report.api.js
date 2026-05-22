// // client/src/api/report.api.js
// import api from './axios.config';

// export const reportApi = {
//   // Get reports dashboard
//   getReportsDashboard: () => {
//     return api.get('/reports/dashboard');
//   },
  
//   // Generate custom report
//   generateCustomReport: (config) => {
//     return api.post('/reports/generate', config, {
//       responseType: config.format === 'pdf' ? 'blob' : 'text'
//     });
//   },
  
//   // Save report template
//   saveReportTemplate: (template) => {
//     return api.post('/reports/templates', template);
//   },
  
//   // Get report templates
//   getReportTemplates: () => {
//     return api.get('/reports/templates');
//   },
  
//   // Get analytics dashboard
//   getAnalyticsDashboard: () => {
//     return api.get('/reports/analytics');
//   },
  
//   // Get attendance report
//   getAttendanceReport: (type, startDate, endDate, department) => {
//     return api.get('/reports/attendance', { params: { type, startDate, endDate, department } });
//   },
  
//   // Get task report
//   getTaskReport: (type, startDate, endDate, assignedTo) => {
//     return api.get('/reports/tasks', { params: { type, startDate, endDate, assignedTo } });
//   },
  
//   // Get salary report
//   getSalaryReport: (month, year, department) => {
//     return api.get('/reports/salary', { params: { month, year, department } });
//   },
  
//   // Export report
//   exportReport: (reportId, format) => {
//     return api.get(`/reports/export/${reportId}`, { params: { format }, responseType: 'blob' });
//   },
  
//   // Schedule report
//   scheduleReport: (config) => {
//     return api.post('/reports/schedule', config);
//   },
  
//   // Get scheduled reports
//   getScheduledReports: () => {
//     return api.get('/reports/scheduled');
//   }
// };





// import api from './axios.config';

// export const reportApi = {
//   // Get reports dashboard
//   getReportsDashboard: () => {
//     return api.get('/reports/dashboard');
//   },
  
//   // Generate custom report
//   generateCustomReport: (config) => {
//     return api.post('/reports/builder/generate', config, {
//       responseType: config.format === 'pdf' ? 'blob' : 'text'
//     });
//   },
  
//   // Save report template
//   saveReportTemplate: (template) => {
//     return api.post('/reports/builder/templates', template);
//   },
  
//   // Get report templates
//   getReportTemplates: () => {
//     return api.get('/reports/builder/templates');
//   },
  
//   // Get analytics dashboard
//   getAnalyticsDashboard: () => {
//     return api.get('/reports/analytics');
//   },
  
//   // Get attendance report
//   getAttendanceReport: (params) => {
//     return api.get('/reports/attendance', { params });
//   },
  
//   // Get task report
//   getTaskReport: (params) => {
//     return api.get('/reports/tasks', { params });
//   },
  
//   // Get salary report
//   getSalaryReport: (params) => {
//     return api.get('/reports/financial', { params });
//   },
  
//   // Export attendance report
//   exportAttendanceReport: (params) => {
//     return api.get('/reports/attendance/export', { 
//       params, 
//       responseType: 'blob' 
//     });
//   },
  
//   // Export task report
//   exportTaskReport: (params) => {
//     return api.get('/reports/tasks/export', { 
//       params, 
//       responseType: 'blob' 
//     });
//   },
  
//   // Export financial report
//   exportFinancialReport: (params) => {
//     return api.get('/reports/financial/export', { 
//       params, 
//       responseType: 'blob' 
//     });
//   },
  
//   // Schedule report
//   scheduleReport: (config) => {
//     return api.post('/reports/schedule', config);
//   },
  
//   // Get scheduled reports
//   getScheduledReports: () => {
//     return api.get('/reports/scheduled');
//   },
  
//   // Get report builder fields
//   getReportBuilderFields: () => {
//     return api.get('/reports/builder/fields');
//   },
  
//   // Get SLA report
//   getSLAreport: (params) => {
//     return api.get('/reports/sla', { params });
//   },
  
//   // Get complaint report
//   getComplaintReport: (params) => {
//     return api.get('/reports/complaints', { params });
//   }
// };

// export default reportApi;





import api from './axios.config';

// Debug flag
const DEBUG = import.meta.env.VITE_DEBUG_API === 'true';

// Helper for debug logging
const debugLog = (method, url, data = null) => {
  if (DEBUG) {
    console.log(`[Report API] ${method} ${url}`);
    if (data) console.log('Data:', data);
  }
};

// Helper for error handling
const handleResponse = async (promise, method, url) => {
  try {
    debugLog(method, url);
    const response = await promise;
    return response;
  } catch (error) {
    console.error(`[Report API Error] ${method} ${url}:`, error.response?.data || error.message);
    throw error;
  }
};

export const reportApi = {
  // ==================== DASHBOARD ====================
  
  /**
   * Get reports dashboard data
   * @returns {Promise} Dashboard data including available reports and recent reports
   */
  getReportsDashboard: () => {
    return handleResponse(
      api.get('/reports/dashboard'),
      'GET',
      '/reports/dashboard'
    );
  },
  
  // ==================== CUSTOM REPORT BUILDER ====================
  
  /**
   * Generate custom report with configuration
   * @param {Object} config - Report configuration
   * @param {string} config.name - Report name
   * @param {string} config.module - Module name (attendance, tasks, salary, etc.)
   * @param {string} config.reportType - Report type (summary, detailed, aggregate)
   * @param {Array} config.fields - Selected fields to include
   * @param {string} config.format - Output format (pdf, csv, excel, json)
   * @returns {Promise} Generated report data or blob
   */
  generateCustomReport: (config) => {
    const responseType = config.format === 'pdf' ? 'blob' : 
                        config.format === 'csv' ? 'text' : 
                        config.format === 'excel' ? 'blob' : 'json';
    
    return handleResponse(
      api.post('/reports/builder/generate', config, { responseType }),
      'POST',
      '/reports/builder/generate'
    );
  },
  
  /**
   * Save report as template for future use
   * @param {Object} template - Template configuration
   * @returns {Promise} Saved template data
   */
  saveReportTemplate: (template) => {
    return handleResponse(
      api.post('/reports/builder/templates', template),
      'POST',
      '/reports/builder/templates'
    );
  },
  
  /**
   * Get all saved report templates
   * @returns {Promise} List of saved templates
   */
  getReportTemplates: () => {
    return handleResponse(
      api.get('/reports/builder/templates'),
      'GET',
      '/reports/builder/templates'
    );
  },
  
  /**
   * Get available fields for report builder
   * @returns {Promise} Available fields by module
   */
  getReportBuilderFields: () => {
    return handleResponse(
      api.get('/reports/builder/fields'),
      'GET',
      '/reports/builder/fields'
    );
  },
  
  // ==================== ANALYTICS ====================
  
  /**
   * Get analytics dashboard data
   * @returns {Promise} Analytics data with KPIs and trends
   */
  getAnalyticsDashboard: () => {
    return handleResponse(
      api.get('/reports/analytics'),
      'GET',
      '/reports/analytics'
    );
  },
  
  // ==================== ATTENDANCE REPORTS ====================
  
  /**
   * Get attendance report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date (YYYY-MM-DD)
   * @param {string} params.endDate - End date (YYYY-MM-DD)
   * @param {string} params.department - Department filter
   * @param {string} params.employeeId - Employee ID filter
   * @param {string} params.reportType - Report type (summary, detailed, department)
   * @returns {Promise} Attendance report data
   */
  getAttendanceReport: (params) => {
    // Clean up undefined params
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/attendance', { params: cleanParams }),
      'GET',
      '/reports/attendance'
    );
  },
  
  /**
   * Export attendance report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.department - Department filter
   * @param {string} params.format - Export format (csv, excel)
   * @returns {Promise} Blob data for download
   */
  exportAttendanceReport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/attendance/export', { 
        params: cleanParams, 
        responseType: 'blob' 
      }),
      'GET',
      '/reports/attendance/export'
    );
  },
  
  // ==================== TASK REPORTS ====================
  
  /**
   * Get task report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.status - Task status filter
   * @param {string} params.priority - Priority filter
   * @param {string} params.technicianId - Technician ID filter
   * @param {string} params.groupBy - Group by field (status, priority, technician)
   * @returns {Promise} Task report data
   */
  getTaskReport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/tasks', { params: cleanParams }),
      'GET',
      '/reports/tasks'
    );
  },
  
  /**
   * Export task report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.format - Export format (csv, excel)
   * @returns {Promise} Blob data for download
   */
  exportTaskReport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/tasks/export', { 
        params: cleanParams, 
        responseType: 'blob' 
      }),
      'GET',
      '/reports/tasks/export'
    );
  },
  
  // ==================== FINANCIAL REPORTS ====================
  
  /**
   * Get financial/salary report
   * @param {Object} params - Filter parameters
   * @param {number} params.year - Year
   * @param {number} params.month - Month (1-12)
   * @param {string} params.reportType - Report type (payroll_summary, department_payroll)
   * @param {string} params.department - Department filter
   * @returns {Promise} Financial report data
   */
  getSalaryReport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/financial', { params: cleanParams }),
      'GET',
      '/reports/financial'
    );
  },
  
  /**
   * Export financial report
   * @param {Object} params - Filter parameters
   * @param {number} params.year - Year
   * @param {number} params.month - Month
   * @param {string} params.format - Export format (csv, excel, pdf)
   * @returns {Promise} Blob data for download
   */
  exportFinancialReport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/financial/export', { 
        params: cleanParams, 
        responseType: 'blob' 
      }),
      'GET',
      '/reports/financial/export'
    );
  },
  
  // ==================== SLA REPORTS ====================
  
  /**
   * Get SLA compliance report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @returns {Promise} SLA report data
   */
  getSLAreport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/sla', { params: cleanParams }),
      'GET',
      '/reports/sla'
    );
  },
  
  // ==================== COMPLAINT REPORTS ====================
  
  /**
   * Get complaint report
   * @param {Object} params - Filter parameters
   * @param {string} params.startDate - Start date
   * @param {string} params.endDate - End date
   * @param {string} params.category - Complaint category
   * @returns {Promise} Complaint report data
   */
  getComplaintReport: (params) => {
    const cleanParams = {};
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        cleanParams[key] = params[key];
      }
    });
    return handleResponse(
      api.get('/reports/complaints', { params: cleanParams }),
      'GET',
      '/reports/complaints'
    );
  },
  
  // ==================== SCHEDULED REPORTS ====================
  
  /**
   * Schedule a report for automatic generation
   * @param {Object} config - Schedule configuration
   * @param {string} config.reportId - Report template ID
   * @param {string} config.frequency - Schedule frequency (daily, weekly, monthly)
   * @param {string} config.time - Time to send (HH:MM)
   * @param {Array} config.recipients - Email recipients
   * @returns {Promise} Schedule confirmation
   */
  scheduleReport: (config) => {
    return handleResponse(
      api.post('/reports/schedule', config),
      'POST',
      '/reports/schedule'
    );
  },
  
  /**
   * Get all scheduled reports
   * @returns {Promise} List of scheduled reports
   */
  getScheduledReports: () => {
    return handleResponse(
      api.get('/reports/scheduled'),
      'GET',
      '/reports/scheduled'
    );
  },
  
  // ==================== ALIASES FOR BACKWARD COMPATIBILITY ====================
  // These methods preserve old functionality
  
  /**
   * @deprecated Use getAttendanceReport instead
   */
  getAttendanceReportOld: (type, startDate, endDate, department) => {
    console.warn('getAttendanceReportOld is deprecated. Use getAttendanceReport with params object instead.');
    return reportApi.getAttendanceReport({ type, startDate, endDate, department });
  },
  
  /**
   * @deprecated Use getTaskReport instead
   */
  getTaskReportOld: (type, startDate, endDate, assignedTo) => {
    console.warn('getTaskReportOld is deprecated. Use getTaskReport with params object instead.');
    return reportApi.getTaskReport({ type, startDate, endDate, assignedTo });
  },
  
  /**
   * @deprecated Use getSalaryReport instead
   */
  getSalaryReportOld: (month, year, department) => {
    console.warn('getSalaryReportOld is deprecated. Use getSalaryReport with params object instead.');
    return reportApi.getSalaryReport({ month, year, department });
  },
  
  /**
   * @deprecated Use exportAttendanceReport or exportTaskReport instead
   */
  exportReport: (reportId, format) => {
    console.warn('exportReport is deprecated. Use specific export methods instead.');
    return handleResponse(
      api.get(`/reports/export/${reportId}`, { 
        params: { format }, 
        responseType: 'blob' 
      }),
      'GET',
      `/reports/export/${reportId}`
    );
  }
};

// Export individual functions for direct imports
export const {
  getReportsDashboard,
  generateCustomReport,
  saveReportTemplate,
  getReportTemplates,
  getReportBuilderFields,
  getAnalyticsDashboard,
  getAttendanceReport,
  exportAttendanceReport,
  getTaskReport,
  exportTaskReport,
  getSalaryReport,
  exportFinancialReport,
  getSLAreport,
  getComplaintReport,
  scheduleReport,
  getScheduledReports
} = reportApi;

export default reportApi;