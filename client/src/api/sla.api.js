// // client/src/api/sla.api.js
// import api from './axios.config';

// export const slaApi = {
//   /**
//    * Get SLA Dashboard data
//    * @param {string} buildingId - Building ID filter
//    * @param {string} department - Department filter
//    */
//   getSLADashboard: (buildingId = null, department = null) => {
//     const params = {};
//     if (buildingId) params.buildingId = buildingId;
//     if (department) params.department = department;
//     return api.get('/sla/dashboard', { params });
//   },
  
//   /**
//    * Get breached tasks
//    * @param {string} buildingId - Building ID filter
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getBreachedTasks: (buildingId = null, page = 1, limit = 20) => {
//     const params = { page, limit };
//     if (buildingId) params.buildingId = buildingId;
//     return api.get('/sla/breached', { params });
//   },
  
//   /**
//    * Get at-risk tasks
//    * @param {string} buildingId - Building ID filter
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getAtRiskTasks: (buildingId = null, page = 1, limit = 20) => {
//     const params = { page, limit };
//     if (buildingId) params.buildingId = buildingId;
//     return api.get('/sla/at-risk', { params });
//   },
  
//   /**
//    * Get SLA history for a task
//    * @param {string} taskId - Task ID
//    */
//   getSLAHistory: (taskId) => {
//     return api.get(`/sla/history/${taskId}`);
//   },
  
//   /**
//    * Escalate a task
//    * @param {string} taskId - Task ID
//    * @param {string} reason - Escalation reason
//    * @param {string} escalateTo - User ID to escalate to
//    */
//   escalateTask: (taskId, reason, escalateTo = null) => {
//     return api.post(`/sla/${taskId}/escalate`, { reason, escalateTo });
//   },
  
//   /**
//    * Get monthly SLA report
//    * @param {number} year - Year
//    * @param {number} month - Month (1-12)
//    * @param {string} buildingId - Building ID filter
//    * @param {string} department - Department filter
//    */
//   getMonthlySLAReport: (year, month, buildingId = null, department = null) => {
//     const params = { year, month };
//     if (buildingId) params.buildingId = buildingId;
//     if (department) params.department = department;
//     return api.get('/sla/reports/monthly', { params });
//   }
// };



// // client/src/api/sla.api.js
// import api from './axios.config';

// export const slaApi = {
//   /**
//    * Get SLA Dashboard data
//    * @param {Object} params - Query parameters
//    * @param {string} params.buildingId - Building ID filter
//    * @param {string} params.department - Department filter
//    * @param {string} params.priority - Priority filter
//    * @param {Date} params.startDate - Start date
//    * @param {Date} params.endDate - End date
//    */
//   getSLADashboard: async (params = {}) => {
//     try {
//       // Clean up params - remove undefined/null/empty values
//       const cleanParams = {};
//       if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
//       if (params.department && params.department !== 'undefined' && params.department !== '') cleanParams.department = params.department;
//       if (params.priority && params.priority !== 'undefined' && params.priority !== '') cleanParams.priority = params.priority;
//       if (params.startDate) cleanParams.startDate = params.startDate;
//       if (params.endDate) cleanParams.endDate = params.endDate;
      
//       const response = await api.get('/sla/dashboard', { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || {
//           summary: {
//             totalTasks: 0,
//             withinSLA: 0,
//             breached: 0,
//             atRisk: 0,
//             complianceRate: 100
//           },
//           tasks: {
//             breached: [],
//             atRisk: [],
//             withinSLA: []
//           }
//         }
//       };
//     } catch (error) {
//       console.error('Error fetching SLA dashboard:', error);
//       return {
//         success: false,
//         data: {
//           summary: {
//             totalTasks: 0,
//             withinSLA: 0,
//             breached: 0,
//             atRisk: 0,
//             complianceRate: 100
//           },
//           tasks: {
//             breached: [],
//             atRisk: [],
//             withinSLA: []
//           }
//         },
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Get breached tasks
//    * @param {Object} params - Query parameters
//    * @param {string} params.buildingId - Building ID filter
//    * @param {string} params.priority - Priority filter
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getBreachedTasks: async (params = {}) => {
//     try {
//       // Clean up params - remove undefined/null/empty values
//       const cleanParams = {};
//       if (params.page) cleanParams.page = params.page;
//       if (params.limit) cleanParams.limit = params.limit;
//       if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
//       if (params.priority && params.priority !== 'undefined' && params.priority !== '') cleanParams.priority = params.priority;
      
//       const response = await api.get('/sla/breached', { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || [],
//         total: response.data?.total || 0,
//         page: cleanParams.page || 1,
//         limit: cleanParams.limit || 20
//       };
//     } catch (error) {
//       console.error('Error fetching breached tasks:', error);
//       return {
//         success: false,
//         data: [],
//         total: 0,
//         page: params.page || 1,
//         limit: params.limit || 20,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Get at-risk tasks
//    * @param {Object} params - Query parameters
//    * @param {string} params.buildingId - Building ID filter
//    * @param {string} params.priority - Priority filter
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getAtRiskTasks: async (params = {}) => {
//     try {
//       // Clean up params - remove undefined/null/empty values
//       const cleanParams = {};
//       if (params.page) cleanParams.page = params.page;
//       if (params.limit) cleanParams.limit = params.limit;
//       if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
//       if (params.priority && params.priority !== 'undefined' && params.priority !== '') cleanParams.priority = params.priority;
      
//       const response = await api.get('/sla/at-risk', { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || [],
//         total: response.data?.total || 0,
//         page: cleanParams.page || 1,
//         limit: cleanParams.limit || 20
//       };
//     } catch (error) {
//       console.error('Error fetching at-risk tasks:', error);
//       return {
//         success: false,
//         data: [],
//         total: 0,
//         page: params.page || 1,
//         limit: params.limit || 20,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Get SLA history for a task or period
//    * @param {string} taskId - Task ID (optional)
//    * @param {Object} params - Query parameters
//    * @param {Date} params.startDate - Start date
//    * @param {Date} params.endDate - End date
//    * @param {number} params.page - Page number
//    * @param {number} params.limit - Items per page
//    */
//   getSLAHistory: async (taskId = null, params = {}) => {
//     try {
//       let url = '/sla/history';
//       const cleanParams = {};
      
//       // If taskId is provided and valid, use it in URL
//       if (taskId && taskId !== 'undefined' && taskId !== 'null' && taskId !== '') {
//         url = `/sla/history/${taskId}`;
//       }
      
//       // Add pagination and filters
//       if (params.page) cleanParams.page = params.page;
//       if (params.limit) cleanParams.limit = params.limit;
//       if (params.startDate) cleanParams.startDate = params.startDate;
//       if (params.endDate) cleanParams.endDate = params.endDate;
      
//       const response = await api.get(url, { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || [],
//         total: response.data?.total || 0,
//         page: cleanParams.page || 1,
//         limit: cleanParams.limit || 20
//       };
//     } catch (error) {
//       console.error('Error fetching SLA history:', error);
//       return {
//         success: false,
//         data: [],
//         total: 0,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Escalate a task
//    * @param {string} taskId - Task ID
//    * @param {string} reason - Escalation reason
//    * @param {string} escalateTo - User ID to escalate to
//    */
//   escalateTask: async (taskId, reason, escalateTo = null) => {
//     try {
//       if (!taskId || taskId === 'undefined') {
//         throw new Error('Invalid task ID');
//       }
      
//       const payload = { reason };
//       if (escalateTo && escalateTo !== 'undefined') payload.escalateTo = escalateTo;
      
//       const response = await api.post(`/sla/${taskId}/escalate`, payload);
      
//       return {
//         success: true,
//         data: response.data?.data || response.data,
//         message: response.data?.message || 'Task escalated successfully'
//       };
//     } catch (error) {
//       console.error('Error escalating task:', error);
//       return {
//         success: false,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Get monthly SLA report
//    * @param {Object} params - Query parameters
//    * @param {number} params.year - Year
//    * @param {number} params.month - Month (1-12)
//    * @param {string} params.buildingId - Building ID filter
//    * @param {string} params.department - Department filter
//    */
//   getMonthlySLAReport: async (params = {}) => {
//     try {
//       const cleanParams = {};
//       if (params.year) cleanParams.year = params.year;
//       if (params.month) cleanParams.month = params.month;
//       if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
//       if (params.department && params.department !== 'undefined' && params.department !== '') cleanParams.department = params.department;
      
//       const response = await api.get('/sla/reports/monthly', { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || {
//           summary: {
//             totalTasks: 0,
//             met: 0,
//             breached: 0,
//             complianceRate: 0
//           },
//           daily: []
//         }
//       };
//     } catch (error) {
//       console.error('Error fetching monthly SLA report:', error);
//       return {
//         success: false,
//         data: {
//           summary: {
//             totalTasks: 0,
//             met: 0,
//             breached: 0,
//             complianceRate: 0
//           },
//           daily: []
//         },
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Get SLA statistics summary
//    * @param {Object} params - Query parameters
//    * @param {string} params.buildingId - Building ID filter
//    * @param {string} params.period - Period (day, week, month, year)
//    */
//   getSLAStatistics: async (params = {}) => {
//     try {
//       const cleanParams = {};
//       if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
//       if (params.period && params.period !== 'undefined') cleanParams.period = params.period;
      
//       const response = await api.get('/sla/statistics', { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || {
//           totalTasks: 0,
//           complianceRate: 100,
//           averageResponseTime: 0,
//           averageResolutionTime: 0,
//           breachedCount: 0,
//           atRiskCount: 0
//         }
//       };
//     } catch (error) {
//       console.error('Error fetching SLA statistics:', error);
//       return {
//         success: false,
//         data: {
//           totalTasks: 0,
//           complianceRate: 100,
//           averageResponseTime: 0,
//           averageResolutionTime: 0,
//           breachedCount: 0,
//           atRiskCount: 0
//         },
//         error: error.response?.data?.message || error.message
//       };
//     }
//   },
  
//   /**
//    * Get SLA trend data
//    * @param {Object} params - Query parameters
//    * @param {string} params.buildingId - Building ID filter
//    * @param {string} params.period - Period (day, week, month, year)
//    * @param {number} params.limit - Number of periods to return
//    */
//   getSLATrends: async (params = {}) => {
//     try {
//       const cleanParams = {};
//       if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
//       if (params.period && params.period !== 'undefined') cleanParams.period = params.period;
//       if (params.limit) cleanParams.limit = params.limit;
      
//       const response = await api.get('/sla/trends', { params: cleanParams });
      
//       return {
//         success: true,
//         data: response.data?.data || response.data || [],
//         total: response.data?.total || 0
//       };
//     } catch (error) {
//       console.error('Error fetching SLA trends:', error);
//       return {
//         success: false,
//         data: [],
//         total: 0,
//         error: error.response?.data?.message || error.message
//       };
//     }
//   }
// };

// export default slaApi;





// client/src/api/sla.api.js
import api from './axios.config';

export const slaApi = {
  /**
   * Get SLA Dashboard data
   * @param {Object} params - Query parameters
   * @param {string} params.buildingId - Building ID filter
   * @param {string} params.department - Department filter
   * @param {string} params.priority - Priority filter
   * @param {Date} params.startDate - Start date
   * @param {Date} params.endDate - End date
   */
  getSLADashboard: async (params = {}) => {
    try {
      // Clean up params - remove undefined/null/empty values
      const cleanParams = {};
      if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
      if (params.department && params.department !== 'undefined' && params.department !== '') cleanParams.department = params.department;
      if (params.priority && params.priority !== 'undefined' && params.priority !== '') cleanParams.priority = params.priority;
      if (params.startDate) cleanParams.startDate = params.startDate;
      if (params.endDate) cleanParams.endDate = params.endDate;
      
      const response = await api.get('/sla/dashboard', { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || {
          summary: {
            totalTasks: 0,
            withinSLA: 0,
            breached: 0,
            atRisk: 0,
            complianceRate: 100
          },
          tasks: {
            breached: [],
            atRisk: [],
            withinSLA: []
          }
        }
      };
    } catch (error) {
      console.error('Error fetching SLA dashboard:', error);
      return {
        success: false,
        data: {
          summary: {
            totalTasks: 0,
            withinSLA: 0,
            breached: 0,
            atRisk: 0,
            complianceRate: 100
          },
          tasks: {
            breached: [],
            atRisk: [],
            withinSLA: []
          }
        },
        error: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Get SLA Dashboard Summary (quick stats)
   * @param {Object} params - Query parameters
   * @param {string} params.buildingId - Building ID filter
   */
  getSLADashboardSummary: async (params = {}) => {
    try {
      const cleanParams = {};
      if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
      
      const response = await api.get('/sla/summary', { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || {
          summary: {
            totalTasks: 0,
            breachedTasks: 0,
            atRiskTasks: 0,
            onTimeTasks: 0,
            complianceRate: 100
          }
        }
      };
    } catch (error) {
      console.error('Error fetching SLA summary:', error);
      return {
        success: false,
        data: {
          summary: {
            totalTasks: 0,
            breachedTasks: 0,
            atRiskTasks: 0,
            onTimeTasks: 0,
            complianceRate: 100
          }
        },
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get breached tasks
   * @param {Object} params - Query parameters
   * @param {string} params.buildingId - Building ID filter
   * @param {string} params.priority - Priority filter
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  getBreachedTasks: async (params = {}) => {
    try {
      // Clean up params - remove undefined/null/empty values
      const cleanParams = {};
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
      if (params.priority && params.priority !== 'undefined' && params.priority !== '') cleanParams.priority = params.priority;
      
      const response = await api.get('/sla/breached', { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        total: response.data?.total || 0,
        page: cleanParams.page || 1,
        limit: cleanParams.limit || 20
      };
    } catch (error) {
      console.error('Error fetching breached tasks:', error);
      return {
        success: false,
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 20,
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get at-risk tasks
   * @param {Object} params - Query parameters
   * @param {string} params.buildingId - Building ID filter
   * @param {string} params.priority - Priority filter
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  getAtRiskTasks: async (params = {}) => {
    try {
      // Clean up params - remove undefined/null/empty values
      const cleanParams = {};
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
      if (params.priority && params.priority !== 'undefined' && params.priority !== '') cleanParams.priority = params.priority;
      
      const response = await api.get('/sla/at-risk', { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        total: response.data?.total || 0,
        page: cleanParams.page || 1,
        limit: cleanParams.limit || 20
      };
    } catch (error) {
      console.error('Error fetching at-risk tasks:', error);
      return {
        success: false,
        data: [],
        total: 0,
        page: params.page || 1,
        limit: params.limit || 20,
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get SLA history for a task or period
   * @param {string} taskId - Task ID (optional)
   * @param {Object} params - Query parameters
   * @param {Date} params.startDate - Start date
   * @param {Date} params.endDate - End date
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   */
  getSLAHistory: async (taskId = null, params = {}) => {
    try {
      let url = '/sla/history';
      const cleanParams = {};
      
      // If taskId is provided and valid, use it in URL
      if (taskId && taskId !== 'undefined' && taskId !== 'null' && taskId !== '') {
        url = `/sla/history/${taskId}`;
      }
      
      // Add pagination and filters
      if (params.page) cleanParams.page = params.page;
      if (params.limit) cleanParams.limit = params.limit;
      if (params.startDate) cleanParams.startDate = params.startDate;
      if (params.endDate) cleanParams.endDate = params.endDate;
      
      const response = await api.get(url, { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        task: response.data?.task || null,
        summary: response.data?.summary || {
          totalEscalations: 0,
          totalBreaches: 0,
          totalWarnings: 0
        },
        total: response.data?.total || 0,
        page: cleanParams.page || 1,
        limit: cleanParams.limit || 20
      };
    } catch (error) {
      console.error('Error fetching SLA history:', error);
      return {
        success: false,
        data: [],
        task: null,
        summary: {
          totalEscalations: 0,
          totalBreaches: 0,
          totalWarnings: 0
        },
        total: 0,
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Escalate a task
   * @param {string} taskId - Task ID
   * @param {string} reason - Escalation reason
   * @param {string} escalateTo - User ID to escalate to
   */
  escalateTask: async (taskId, reason, escalateTo = null) => {
    try {
      if (!taskId || taskId === 'undefined') {
        throw new Error('Invalid task ID');
      }
      
      const payload = { reason };
      if (escalateTo && escalateTo !== 'undefined') payload.escalateTo = escalateTo;
      
      const response = await api.post(`/sla/escalate/${taskId}`, payload);
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Task escalated successfully'
      };
    } catch (error) {
      console.error('Error escalating task:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get monthly SLA report
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @param {string} buildingId - Building ID filter (optional)
   * @param {string} department - Department filter (optional)
   */
  getMonthlySLAReport: async (year, month, buildingId = null, department = null) => {
    try {
      const params = { year, month };
      if (buildingId && buildingId !== 'undefined' && buildingId !== '') params.buildingId = buildingId;
      if (department && department !== 'undefined' && department !== '') params.department = department;
      
      const response = await api.get('/sla/reports/monthly', { params });
      
      return {
        success: true,
        data: response.data?.data || response.data || {
          summary: {
            totalTasks: 0,
            met: 0,
            breached: 0,
            complianceRate: 0
          },
          dailyBreakdown: [],
          priorityBreakdown: {}
        }
      };
    } catch (error) {
      console.error('Error fetching monthly SLA report:', error);
      return {
        success: false,
        data: {
          summary: {
            totalTasks: 0,
            met: 0,
            breached: 0,
            complianceRate: 0
          },
          dailyBreakdown: [],
          priorityBreakdown: {}
        },
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get date range SLA report
   * @param {string} startDate - Start date (YYYY-MM-DD)
   * @param {string} endDate - End date (YYYY-MM-DD)
   * @param {string} buildingId - Building ID filter (optional)
   * @param {string} department - Department filter (optional)
   */
  getDateRangeReport: async (startDate, endDate, buildingId = null, department = null) => {
    try {
      const params = { startDate, endDate };
      if (buildingId && buildingId !== 'undefined' && buildingId !== '') params.buildingId = buildingId;
      if (department && department !== 'undefined' && department !== '') params.department = department;
      
      const response = await api.get('/sla/reports/date-range', { params });
      
      return {
        success: true,
        data: response.data?.data || response.data || {
          summary: {
            totalTasks: 0,
            breachedTasks: 0,
            onTimeTasks: 0,
            complianceRate: 100
          },
          dailyBreakdown: []
        }
      };
    } catch (error) {
      console.error('Error fetching date range SLA report:', error);
      return {
        success: false,
        data: {
          summary: {
            totalTasks: 0,
            breachedTasks: 0,
            onTimeTasks: 0,
            complianceRate: 100
          },
          dailyBreakdown: []
        },
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Export SLA report
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   * @param {string} format - Export format ('csv' or 'json')
   * @param {string} buildingId - Building ID filter (optional)
   */
  exportSLAReport: async (year, month, format = 'csv', buildingId = null) => {
    try {
      const params = { year, month, format };
      if (buildingId && buildingId !== 'undefined' && buildingId !== '') params.buildingId = buildingId;
      
      const response = await api.get('/sla/reports/export', { 
        params,
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      
      return {
        success: true,
        data: response.data,
        format
      };
    } catch (error) {
      console.error('Error exporting SLA report:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get SLA statistics summary
   * @param {Object} params - Query parameters
   * @param {string} params.buildingId - Building ID filter
   * @param {string} params.period - Period (day, week, month, year)
   */
  getSLAStatistics: async (params = {}) => {
    try {
      const cleanParams = {};
      if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
      if (params.period && params.period !== 'undefined') cleanParams.period = params.period;
      
      const response = await api.get('/sla/statistics', { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || {
          totalTasks: 0,
          complianceRate: 100,
          averageResponseTime: 0,
          averageResolutionTime: 0,
          breachedCount: 0,
          atRiskCount: 0,
          trend: []
        }
      };
    } catch (error) {
      console.error('Error fetching SLA statistics:', error);
      return {
        success: false,
        data: {
          totalTasks: 0,
          complianceRate: 100,
          averageResponseTime: 0,
          averageResolutionTime: 0,
          breachedCount: 0,
          atRiskCount: 0,
          trend: []
        },
        error: error.response?.data?.message || error.message
      };
    }
  },
  
  /**
   * Get SLA trend data
   * @param {Object} params - Query parameters
   * @param {string} params.buildingId - Building ID filter
   * @param {string} params.period - Period (day, week, month, year)
   * @param {number} params.limit - Number of periods to return
   */
  getSLATrends: async (params = {}) => {
    try {
      const cleanParams = {};
      if (params.buildingId && params.buildingId !== 'undefined' && params.buildingId !== '') cleanParams.buildingId = params.buildingId;
      if (params.period && params.period !== 'undefined') cleanParams.period = params.period;
      if (params.limit) cleanParams.limit = params.limit;
      
      const response = await api.get('/sla/trends', { params: cleanParams });
      
      return {
        success: true,
        data: response.data?.data || response.data || [],
        total: response.data?.total || 0
      };
    } catch (error) {
      console.error('Error fetching SLA trends:', error);
      return {
        success: false,
        data: [],
        total: 0,
        error: error.response?.data?.message || error.message
      };
    }
  }
};

export default slaApi;