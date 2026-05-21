// // client/src/api/leave.api.js
// import api from './axios.config';

// export const leaveApi = {
//   // Apply for leave
//   applyLeave: (data) => {
//     return api.post('/leave/apply', data);
//   },
  
//   // Get my leaves
//   getMyLeaves: (status, year, page = 1, limit = 20) => {
//     const params = { page, limit };
//     if (status) params.status = status;
//     if (year) params.year = year;
//     return api.get('/leave/my', { params });
//   },
  
//   // Get my leave balance
//   getMyLeaveBalance: (year) => {
//     const params = year ? { year } : {};
//     return api.get('/leave/balance', { params });
//   },
  
//   // Cancel leave request
//   cancelLeave: (id) => {
//     return api.put(`/leave/${id}/cancel`);
//   },
  
//   // Get pending approvals (Manager/Supervisor/HR)
//   getPendingApprovals: (page = 1, limit = 20) => {
//     return api.get('/leave/pending', { params: { page, limit } });
//   },
  
//   // Approve leave
//   approveLeave: (id, comments) => {
//     return api.put(`/leave/${id}/approve`, { comments });
//   },
  
//   // Reject leave
//   rejectLeave: (id, reason) => {
//     return api.put(`/leave/${id}/reject`, { reason });
//   },
  
//   // Get team leave calendar (Manager/Supervisor)
//   getTeamLeaveCalendar: (year, month) => {
//     const params = { year, month };
//     return api.get('/leave/team-calendar', { params });
//   }
// };



// // client/src/api/leave.api.js
// import api from './axios.config';

// export const leaveApi = {
//   // Apply for leave
//   applyLeave: (data) => {
//     return api.post('/leave/apply', data);
//   },
  
//   // Get my leaves
//   getMyLeaves: (status, year, page = 1, limit = 20) => {
//     const params = { page, limit };
//     if (status) params.status = status;
//     if (year) params.year = year;
//     return api.get('/leave/my', { params });
//   },
  
//   // Get my leave balance
//   getMyLeaveBalance: (year) => {
//     const params = year ? { year } : {};
//     return api.get('/leave/balance', { params });
//   },
  
//   // Cancel leave request
//   cancelLeave: (id) => {
//     return api.put(`/leave/${id}/cancel`);
//   },
  
//   // Get pending approvals (Manager/Supervisor/HR)
//   getPendingApprovals: (page = 1, limit = 20) => {
//     return api.get('/leave/pending', { params: { page, limit } });
//   },
  
//   // Approve leave
//   approveLeave: (id, comments) => {
//     return api.put(`/leave/${id}/approve`, { comments });
//   },
  
//   // Reject leave
//   rejectLeave: (id, reason) => {
//     return api.put(`/leave/${id}/reject`, { reason });
//   },
  
//   // Get team leave calendar (Manager/Supervisor)
//   getTeamLeaveCalendar: (year, month) => {
//     const params = { year, month };
//     return api.get('/leave/team-calendar', { params });
//   },

//   // ==================== LEAVE STATISTICS METHODS ====================

//   /**
//    * Get leave statistics (Admin/Super Admin)
//    * @param {object} params - Query parameters (year, month, department)
//    * @returns {Promise} - Leave statistics
//    */
//   getLeaveStats: async (params = {}) => {
//     const response = await api.get('/leave/stats', { params });
//     return response;
//   },

//   /**
//    * Get leave statistics for dashboard
//    * @param {object} params - Query parameters
//    * @returns {Promise} - Dashboard leave statistics
//    */
//   getLeaveDashboardStats: async (params = {}) => {
//     const response = await api.get('/leave/dashboard-stats', { params });
//     return response;
//   },

//   /**
//    * Get all leave requests (Admin/Super Admin)
//    * @param {object} params - Query parameters (page, limit, status, fromDate, toDate)
//    * @returns {Promise} - List of leave requests
//    */
//   getAllLeaveRequests: async (params = {}) => {
//     const response = await api.get('/leave/all', { params });
//     return response;
//   },

//   /**
//    * Get leave request by ID
//    * @param {string} id - Leave request ID
//    * @returns {Promise} - Leave request details
//    */
//   getLeaveRequestById: async (id) => {
//     const response = await api.get(`/leave/${id}`);
//     return response;
//   },

//   /**
//    * Get leave balance for a specific user (Admin/Super Admin)
//    * @param {string} userId - User ID
//    * @param {number} year - Year
//    * @returns {Promise} - User leave balance
//    */
//   getUserLeaveBalance: async (userId, year) => {
//     const params = year ? { year } : {};
//     const response = await api.get(`/leave/balance/${userId}`, { params });
//     return response;
//   },

//   /**
//    * Get leave summary by department
//    * @param {number} year - Year
//    * @returns {Promise} - Department-wise leave summary
//    */
//   getLeaveSummaryByDepartment: async (year) => {
//     const params = year ? { year } : {};
//     const response = await api.get('/leave/summary/department', { params });
//     return response;
//   },

//   /**
//    * Get leave summary by month
//    * @param {number} year - Year
//    * @returns {Promise} - Month-wise leave summary
//    */
//   getLeaveSummaryByMonth: async (year) => {
//     const params = year ? { year } : {};
//     const response = await api.get('/leave/summary/month', { params });
//     return response;
//   },

//   /**
//    * Get leave types
//    * @returns {Promise} - List of leave types
//    */
//   getLeaveTypes: async () => {
//     const response = await api.get('/leave/types');
//     return response;
//   },

//   /**
//    * Get leave policy
//    * @returns {Promise} - Leave policy details
//    */
//   getLeavePolicy: async () => {
//     const response = await api.get('/leave/policy');
//     return response;
//   },

//   /**
//    * Update leave policy (Admin/Super Admin only)
//    * @param {object} policyData - Policy data
//    * @returns {Promise} - Updated policy
//    */
//   updateLeavePolicy: async (policyData) => {
//     const response = await api.put('/leave/policy', policyData);
//     return response;
//   },

//   // ==================== BULK LEAVE OPERATIONS ====================

//   /**
//    * Bulk approve leave requests (Admin/Super Admin)
//    * @param {array} leaveIds - Array of leave request IDs
//    * @param {string} comments - Approval comments
//    * @returns {Promise} - Bulk approval result
//    */
//   bulkApproveLeaves: async (leaveIds, comments = '') => {
//     const response = await api.post('/leave/bulk/approve', { leaveIds, comments });
//     return response;
//   },

//   /**
//    * Bulk reject leave requests (Admin/Super Admin)
//    * @param {array} leaveIds - Array of leave request IDs
//    * @param {string} reason - Rejection reason
//    * @returns {Promise} - Bulk rejection result
//    */
//   bulkRejectLeaves: async (leaveIds, reason) => {
//     const response = await api.post('/leave/bulk/reject', { leaveIds, reason });
//     return response;
//   },

//   // ==================== LEAVE REPORTING ====================

//   /**
//    * Export leave reports (Admin/Super Admin)
//    * @param {object} params - Query parameters (fromDate, toDate, format)
//    * @returns {Promise} - Blob response for file download
//    */
//   exportLeaveReport: async (params = {}) => {
//     const response = await api.get('/leave/export', { 
//       params, 
//       responseType: 'blob' 
//     });
//     return response;
//   },

//   /**
//    * Get leave analytics
//    * @param {object} params - Query parameters (year, department)
//    * @returns {Promise} - Leave analytics data
//    */
//   getLeaveAnalytics: async (params = {}) => {
//     const response = await api.get('/leave/analytics', { params });
//     return response;
//   },

//   // ==================== LEAVE REQUEST ACTIONS ====================

//   /**
//    * Update leave request (employee)
//    * @param {string} id - Leave request ID
//    * @param {object} data - Updated leave data
//    * @returns {Promise} - Updated leave request
//    */
//   updateLeaveRequest: async (id, data) => {
//     const response = await api.put(`/leave/${id}`, data);
//     return response;
//   },

//   /**
//    * Delete leave request (employee)
//    * @param {string} id - Leave request ID
//    * @returns {Promise} - Deletion result
//    */
//   deleteLeaveRequest: async (id) => {
//     const response = await api.delete(`/leave/${id}`);
//     return response;
//   },

//   // ==================== LEAVE CALENDAR ====================

//   /**
//    * Get company leave calendar (all holidays and leaves)
//    * @param {number} year - Year
//    * @returns {Promise} - Company calendar
//    */
//   getCompanyLeaveCalendar: async (year) => {
//     const params = year ? { year } : {};
//     const response = await api.get('/leave/company-calendar', { params });
//     return response;
//   },

//   /**
//    * Get team leave summary
//    * @param {object} params - Query parameters (year, month, department)
//    * @returns {Promise} - Team leave summary
//    */
//   getTeamLeaveSummary: async (params = {}) => {
//     const response = await api.get('/leave/team-summary', { params });
//     return response;
//   },

//   // ==================== LEAVE ENTITLEMENT ====================

//   /**
//    * Get user leave entitlement
//    * @param {string} userId - User ID
//    * @param {number} year - Year
//    * @returns {Promise} - Leave entitlement
//    */
//   getLeaveEntitlement: async (userId, year) => {
//     const params = year ? { year } : {};
//     const response = await api.get(`/leave/entitlement/${userId}`, { params });
//     return response;
//   },

//   /**
//    * Update leave entitlement (Admin/Super Admin)
//    * @param {string} userId - User ID
//    * @param {object} entitlementData - Entitlement data
//    * @returns {Promise} - Updated entitlement
//    */
//   updateLeaveEntitlement: async (userId, entitlementData) => {
//     const response = await api.put(`/leave/entitlement/${userId}`, entitlementData);
//     return response;
//   },

//   /**
//    * Bulk update leave entitlement (Admin/Super Admin)
//    * @param {array} entitlements - Array of entitlements
//    * @returns {Promise} - Bulk update result
//    */
//   bulkUpdateLeaveEntitlement: async (entitlements) => {
//     const response = await api.post('/leave/entitlement/bulk', { entitlements });
//     return response;
//   }
// };

// export default leaveApi;



// client/src/api/leave.api.js
import api from './axios.config';

// Debug flag
const DEBUG = true;

const logDebug = (message, data = null) => {
  if (DEBUG) {
    console.log(`📋 [Leave API] ${message}`);
    if (data) console.log('   Data:', data);
  }
};

const logError = (message, error) => {
  console.error(`❌ [Leave API] ${message}`);
  console.error('   Error:', error.response?.data || error.message);
  if (error.response) {
    console.error('   Status:', error.response.status);
  }
};

export const leaveApi = {
  // ==================== LEAVE REQUEST ====================
  
  /**
   * Apply for leave
   * @param {Object} data - Leave request data
   * @param {string} data.leaveType - Type of leave (annual, sick, casual, etc.)
   * @param {string} data.fromDate - Start date (YYYY-MM-DD)
   * @param {string} data.toDate - End date (YYYY-MM-DD)
   * @param {string} data.reason - Reason for leave
   * @param {boolean} data.halfDay - Whether it's a half day leave
   */
  applyLeave: async (data) => {
    logDebug('Applying for leave with data:', data);
    
    try {
      // Validate required fields
      const requiredFields = ['leaveType', 'fromDate', 'toDate', 'reason'];
      const missingFields = requiredFields.filter(field => !data[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }
      
      // Format dates to ISO string if they are Date objects
      const formattedData = {
        leaveType: data.leaveType,
        fromDate: data.fromDate instanceof Date ? data.fromDate.toISOString().split('T')[0] : data.fromDate,
        toDate: data.toDate instanceof Date ? data.toDate.toISOString().split('T')[0] : data.toDate,
        reason: data.reason,
        halfDay: data.halfDay || false
      };
      
      logDebug('Sending formatted leave data:', formattedData);
      
      const response = await api.post('/leave/apply', formattedData);
      logDebug('Leave request successful:', response.data);
      return response;
    } catch (error) {
      logError('Failed to apply for leave', error);
      throw error;
    }
  },
  
  // ==================== LEAVE RETRIEVAL ====================
  
  /**
   * Get my leaves
   * @param {string} status - Filter by status (pending, approved, rejected)
   * @param {number} year - Filter by year
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getMyLeaves: async (status, year, page = 1, limit = 20) => {
    const params = { page, limit };
    if (status) params.status = status;
    if (year) params.year = year;
    logDebug('Fetching my leaves with params:', params);
    try {
      const response = await api.get('/leave/my', { params });
      logDebug(`Fetched ${response.data?.data?.length || 0} leaves`);
      return response;
    } catch (error) {
      logError('Failed to fetch my leaves', error);
      throw error;
    }
  },
  
  /**
   * Get my leave balance
   * @param {number} year - Year to get balance for
   */
  getMyLeaveBalance: async (year) => {
    const params = year ? { year } : {};
    logDebug('Fetching leave balance', params);
    try {
      const response = await api.get('/leave/balance', { params });
      logDebug('Leave balance fetched:', response.data);
      return response;
    } catch (error) {
      logError('Failed to fetch leave balance', error);
      throw error;
    }
  },
  
  // ==================== LEAVE ACTIONS ====================
  
  /**
   * Cancel leave request
   * @param {string} id - Leave request ID
   */
  cancelLeave: async (id) => {
    logDebug(`Cancelling leave request: ${id}`);
    try {
      const response = await api.put(`/leave/${id}/cancel`);
      logDebug('Leave cancelled successfully');
      return response;
    } catch (error) {
      logError('Failed to cancel leave', error);
      throw error;
    }
  },
  
  /**
   * Update leave request (employee)
   * @param {string} id - Leave request ID
   * @param {object} data - Updated leave data
   */
  updateLeaveRequest: async (id, data) => {
    logDebug(`Updating leave request ${id}:`, data);
    try {
      const response = await api.put(`/leave/${id}`, data);
      logDebug('Leave request updated successfully');
      return response;
    } catch (error) {
      logError('Failed to update leave request', error);
      throw error;
    }
  },
  
  /**
   * Delete leave request (employee)
   * @param {string} id - Leave request ID
   */
  deleteLeaveRequest: async (id) => {
    logDebug(`Deleting leave request: ${id}`);
    try {
      const response = await api.delete(`/leave/${id}`);
      logDebug('Leave request deleted successfully');
      return response;
    } catch (error) {
      logError('Failed to delete leave request', error);
      throw error;
    }
  },
  
  // ==================== APPROVER ACTIONS ====================
  
  /**
   * Get pending approvals (Manager/Supervisor/HR)
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getPendingApprovals: async (page = 1, limit = 20) => {
    logDebug('Fetching pending approvals', { page, limit });
    try {
      const response = await api.get('/leave/pending', { params: { page, limit } });
      logDebug(`Fetched ${response.data?.data?.length || 0} pending approvals`);
      return response;
    } catch (error) {
      logError('Failed to fetch pending approvals', error);
      throw error;
    }
  },
  
  /**
   * Approve leave
   * @param {string} id - Leave request ID
   * @param {string} comments - Approval comments
   */
  approveLeave: async (id, comments) => {
    logDebug(`Approving leave: ${id}`, { comments });
    try {
      const response = await api.put(`/leave/${id}/approve`, { comments });
      logDebug('Leave approved successfully');
      return response;
    } catch (error) {
      logError('Failed to approve leave', error);
      throw error;
    }
  },
  
  /**
   * Reject leave
   * @param {string} id - Leave request ID
   * @param {string} reason - Rejection reason
   */
  rejectLeave: async (id, reason) => {
    logDebug(`Rejecting leave: ${id}`, { reason });
    try {
      const response = await api.put(`/leave/${id}/reject`, { reason });
      logDebug('Leave rejected successfully');
      return response;
    } catch (error) {
      logError('Failed to reject leave', error);
      throw error;
    }
  },
  
  // ==================== LEAVE CALENDAR ====================
  
  /**
   * Get team leave calendar (Manager/Supervisor)
   * @param {number} year - Year
   * @param {number} month - Month (1-12)
   */
  getTeamLeaveCalendar: async (year, month) => {
    const params = { year, month };
    logDebug('Fetching team leave calendar', params);
    try {
      const response = await api.get('/leave/team-calendar', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch team leave calendar', error);
      throw error;
    }
  },
  
  /**
   * Get company leave calendar (all holidays and leaves)
   * @param {number} year - Year
   */
  getCompanyLeaveCalendar: async (year) => {
    const params = year ? { year } : {};
    logDebug('Fetching company leave calendar', params);
    try {
      const response = await api.get('/leave/company-calendar', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch company leave calendar', error);
      throw error;
    }
  },
  
  /**
   * Get team leave summary
   * @param {object} params - Query parameters (year, month, department)
   */
  getTeamLeaveSummary: async (params = {}) => {
    logDebug('Fetching team leave summary', params);
    try {
      const response = await api.get('/leave/team-summary', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch team leave summary', error);
      throw error;
    }
  },
  
  // ==================== LEAVE STATISTICS ====================
  
  /**
   * Get leave statistics (Admin/Super Admin)
   * @param {object} params - Query parameters (year, month, department)
   */
  getLeaveStats: async (params = {}) => {
    logDebug('Fetching leave statistics', params);
    try {
      const response = await api.get('/leave/stats', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch leave statistics', error);
      throw error;
    }
  },
  
  /**
   * Get leave statistics for dashboard
   * @param {object} params - Query parameters
   */
  getLeaveDashboardStats: async (params = {}) => {
    logDebug('Fetching leave dashboard stats', params);
    try {
      const response = await api.get('/leave/dashboard-stats', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch leave dashboard stats', error);
      throw error;
    }
  },
  
  /**
   * Get all leave requests (Admin/Super Admin)
   * @param {object} params - Query parameters (page, limit, status, fromDate, toDate)
   */
  getAllLeaveRequests: async (params = {}) => {
    logDebug('Fetching all leave requests', params);
    try {
      const response = await api.get('/leave/all', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch all leave requests', error);
      throw error;
    }
  },
  
  /**
   * Get leave request by ID
   * @param {string} id - Leave request ID
   */
  getLeaveRequestById: async (id) => {
    logDebug(`Fetching leave request: ${id}`);
    try {
      const response = await api.get(`/leave/${id}`);
      return response;
    } catch (error) {
      logError('Failed to fetch leave request', error);
      throw error;
    }
  },
  
  // ==================== LEAVE BALANCE FOR USERS ====================
  
  /**
   * Get leave balance for a specific user (Admin/Super Admin)
   * @param {string} userId - User ID
   * @param {number} year - Year
   */
  getUserLeaveBalance: async (userId, year) => {
    const params = year ? { year } : {};
    logDebug(`Fetching leave balance for user ${userId}`, params);
    try {
      const response = await api.get(`/leave/balance/${userId}`, { params });
      return response;
    } catch (error) {
      logError('Failed to fetch user leave balance', error);
      throw error;
    }
  },
  
  /**
   * Get leave summary by department
   * @param {number} year - Year
   */
  getLeaveSummaryByDepartment: async (year) => {
    const params = year ? { year } : {};
    logDebug('Fetching leave summary by department', params);
    try {
      const response = await api.get('/leave/summary/department', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch leave summary by department', error);
      throw error;
    }
  },
  
  /**
   * Get leave summary by month
   * @param {number} year - Year
   */
  getLeaveSummaryByMonth: async (year) => {
    const params = year ? { year } : {};
    logDebug('Fetching leave summary by month', params);
    try {
      const response = await api.get('/leave/summary/month', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch leave summary by month', error);
      throw error;
    }
  },
  
  // ==================== LEAVE TYPES & POLICY ====================
  
  /**
   * Get leave types
   */
  getLeaveTypes: async () => {
    logDebug('Fetching leave types');
    try {
      const response = await api.get('/leave/types');
      return response;
    } catch (error) {
      logError('Failed to fetch leave types', error);
      throw error;
    }
  },
  
  /**
   * Get leave policy
   */
  getLeavePolicy: async () => {
    logDebug('Fetching leave policy');
    try {
      const response = await api.get('/leave/policy');
      return response;
    } catch (error) {
      logError('Failed to fetch leave policy', error);
      throw error;
    }
  },
  
  /**
   * Update leave policy (Admin/Super Admin only)
   * @param {object} policyData - Policy data
   */
  updateLeavePolicy: async (policyData) => {
    logDebug('Updating leave policy', policyData);
    try {
      const response = await api.put('/leave/policy', policyData);
      return response;
    } catch (error) {
      logError('Failed to update leave policy', error);
      throw error;
    }
  },
  
  // ==================== BULK OPERATIONS ====================
  
  /**
   * Bulk approve leave requests (Admin/Super Admin)
   * @param {array} leaveIds - Array of leave request IDs
   * @param {string} comments - Approval comments
   */
  bulkApproveLeaves: async (leaveIds, comments = '') => {
    logDebug(`Bulk approving ${leaveIds.length} leave requests`);
    try {
      const response = await api.post('/leave/bulk/approve', { leaveIds, comments });
      return response;
    } catch (error) {
      logError('Failed to bulk approve leaves', error);
      throw error;
    }
  },
  
  /**
   * Bulk reject leave requests (Admin/Super Admin)
   * @param {array} leaveIds - Array of leave request IDs
   * @param {string} reason - Rejection reason
   */
  bulkRejectLeaves: async (leaveIds, reason) => {
    logDebug(`Bulk rejecting ${leaveIds.length} leave requests`);
    try {
      const response = await api.post('/leave/bulk/reject', { leaveIds, reason });
      return response;
    } catch (error) {
      logError('Failed to bulk reject leaves', error);
      throw error;
    }
  },
  
  // ==================== LEAVE REPORTING ====================
  
  /**
   * Export leave reports (Admin/Super Admin)
   * @param {object} params - Query parameters (fromDate, toDate, format)
   */
  exportLeaveReport: async (params = {}) => {
    logDebug('Exporting leave report', params);
    try {
      const response = await api.get('/leave/export', { 
        params, 
        responseType: 'blob' 
      });
      return response;
    } catch (error) {
      logError('Failed to export leave report', error);
      throw error;
    }
  },
  
  /**
   * Get leave analytics
   * @param {object} params - Query parameters (year, department)
   */
  getLeaveAnalytics: async (params = {}) => {
    logDebug('Fetching leave analytics', params);
    try {
      const response = await api.get('/leave/analytics', { params });
      return response;
    } catch (error) {
      logError('Failed to fetch leave analytics', error);
      throw error;
    }
  },
  
  // ==================== LEAVE ENTITLEMENT ====================
  
  /**
   * Get user leave entitlement
   * @param {string} userId - User ID
   * @param {number} year - Year
   */
  getLeaveEntitlement: async (userId, year) => {
    const params = year ? { year } : {};
    logDebug(`Fetching leave entitlement for user ${userId}`, params);
    try {
      const response = await api.get(`/leave/entitlement/${userId}`, { params });
      return response;
    } catch (error) {
      logError('Failed to fetch leave entitlement', error);
      throw error;
    }
  },
  
  /**
   * Update leave entitlement (Admin/Super Admin)
   * @param {string} userId - User ID
   * @param {object} entitlementData - Entitlement data
   */
  updateLeaveEntitlement: async (userId, entitlementData) => {
    logDebug(`Updating leave entitlement for user ${userId}`, entitlementData);
    try {
      const response = await api.put(`/leave/entitlement/${userId}`, entitlementData);
      return response;
    } catch (error) {
      logError('Failed to update leave entitlement', error);
      throw error;
    }
  },
  
  /**
   * Bulk update leave entitlement (Admin/Super Admin)
   * @param {array} entitlements - Array of entitlements
   */
  bulkUpdateLeaveEntitlement: async (entitlements) => {
    logDebug(`Bulk updating ${entitlements.length} leave entitlements`);
    try {
      const response = await api.post('/leave/entitlement/bulk', { entitlements });
      return response;
    } catch (error) {
      logError('Failed to bulk update leave entitlements', error);
      throw error;
    }
  }
};

export default leaveApi;