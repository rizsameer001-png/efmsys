// client/src/api/visitorPass.api.js
// import api from './axios.config';

// export const visitorPassApi = {
//   /**
//    * Request a new visitor pass
//    * @param {Object} passData - Visitor pass data
//    * @param {string} passData.visitorName - Name of the visitor
//    * @param {string} passData.visitorPhone - Phone number of the visitor
//    * @param {string} passData.purpose - Purpose of visit (delivery, guest, maintenance, other)
//    * @param {string} passData.visitDate - Date of visit (YYYY-MM-DD)
//    * @param {string} passData.visitTime - Time of visit (optional)
//    * @param {string} passData.vehicleNumber - Vehicle number (optional)
//    * @returns {Promise} - API response
//    */
//   requestPass: (passData) => {
//     return api.post('/visitor-pass/request', passData);
//   },

//   /**
//    * Get all active visitor passes for the current user
//    * @returns {Promise} - List of active passes
//    */
//   getActivePasses: () => {
//     return api.get('/visitor-pass/active');
//   },

//   /**
//    * Get pending visitor pass requests
//    * @returns {Promise} - List of pending requests
//    */
//   getPendingRequests: () => {
//     return api.get('/visitor-pass/pending');
//   },

//   /**
//    * Get visitor pass history
//    * @param {Object} params - Query parameters (page, limit, fromDate, toDate)
//    * @returns {Promise} - List of past passes
//    */
//   getVisitorHistory: (params = {}) => {
//     return api.get('/visitor-pass/history', { params });
//   },

//   /**
//    * Get visitor pass by ID
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - Pass details
//    */
//   getPassById: (passId) => {
//     return api.get(`/visitor-pass/${passId}`);
//   },

//   /**
//    * Cancel a visitor pass request
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - Cancellation response
//    */
//   cancelPass: (passId) => {
//     return api.put(`/visitor-pass/${passId}/cancel`);
//   },

//   /**
//    * Update visitor pass (for pending requests only)
//    * @param {string} passId - Pass ID
//    * @param {Object} passData - Updated pass data
//    * @returns {Promise} - Updated pass
//    */
//   updatePass: (passId, passData) => {
//     return api.put(`/visitor-pass/${passId}`, passData);
//   },

//   /**
//    * Delete a visitor pass (for pending requests only)
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - Deletion response
//    */
//   deletePass: (passId) => {
//     return api.delete(`/visitor-pass/${passId}`);
//   },

//   /**
//    * Get visitor pass statistics
//    * @returns {Promise} - Statistics (total, active, pending, etc.)
//    */
//   getVisitorStats: () => {
//     return api.get('/visitor-pass/stats');
//   },

//   /**
//    * Download visitor pass as PDF
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - PDF blob
//    */
//   downloadPassPDF: (passId) => {
//     return api.get(`/visitor-pass/${passId}/pdf`, { responseType: 'blob' });
//   },

//   /**
//    * Send visitor pass via SMS/Email
//    * @param {string} passId - Pass ID
//    * @param {Object} deliveryMethod - { sms: boolean, email: boolean }
//    * @returns {Promise} - Delivery response
//    */
//   sendPassViaMessage: (passId, deliveryMethod = { sms: true, email: true }) => {
//     return api.post(`/visitor-pass/${passId}/send`, deliveryMethod);
//   },

//   /**
//    * Get upcoming visitor passes
//    * @param {number} days - Number of days to look ahead (default: 7)
//    * @returns {Promise} - List of upcoming passes
//    */
//   getUpcomingPasses: (days = 7) => {
//     return api.get('/visitor-pass/upcoming', { params: { days } });
//   },

//   /**
//    * Check-in a visitor (for security/guard)
//    * @param {string} passId - Pass ID
//    * @param {Object} checkInData - { notes, photo }
//    * @returns {Promise} - Check-in response
//    */
//   checkInVisitor: (passId, checkInData = {}) => {
//     return api.post(`/visitor-pass/${passId}/check-in`, checkInData);
//   },

//   /**
//    * Check-out a visitor (for security/guard)
//    * @param {string} passId - Pass ID
//    * @param {Object} checkOutData - { notes }
//    * @returns {Promise} - Check-out response
//    */
//   checkOutVisitor: (passId, checkOutData = {}) => {
//     return api.post(`/visitor-pass/${passId}/check-out`, checkOutData);
//   },

//   /**
//    * Approve visitor pass (for admin/security)
//    * @param {string} passId - Pass ID
//    * @param {Object} approvalData - { approved, remarks }
//    * @returns {Promise} - Approval response
//    */
//   approvePass: (passId, approvalData = { approved: true, remarks: '' }) => {
//     return api.put(`/visitor-pass/${passId}/approve`, approvalData);
//   },

//   /**
//    * Reject visitor pass (for admin/security)
//    * @param {string} passId - Pass ID
//    * @param {string} reason - Rejection reason
//    * @returns {Promise} - Rejection response
//    */
//   rejectPass: (passId, reason) => {
//     return api.put(`/visitor-pass/${passId}/reject`, { reason });
//   },

//   /**
//    * Get all visitor passes (admin only)
//    * @param {Object} params - Query parameters (page, limit, status, fromDate, toDate)
//    * @returns {Promise} - List of all passes
//    */
//   getAllPasses: (params = {}) => {
//     return api.get('/visitor-pass/admin/all', { params });
//   },

//   /**
//    * Get visitor pass analytics (admin only)
//    * @param {Object} params - Query parameters (year, month)
//    * @returns {Promise} - Analytics data
//    */
//   getPassAnalytics: (params = {}) => {
//     return api.get('/visitor-pass/admin/analytics', { params });
//   },

//   /**
//    * Export visitor passes (admin only)
//    * @param {Object} params - Query parameters (fromDate, toDate, format)
//    * @returns {Promise} - Export file (CSV/Excel)
//    */
//   exportPasses: (params = {}) => {
//     return api.get('/visitor-pass/admin/export', { 
//       params, 
//       responseType: 'blob' 
//     });
//   },

//   /**
//    * Bulk approve visitor passes (admin only)
//    * @param {array} passIds - Array of pass IDs
//    * @param {string} remarks - Approval remarks
//    * @returns {Promise} - Bulk approval response
//    */
//   bulkApprovePasses: (passIds, remarks = '') => {
//     return api.post('/visitor-pass/admin/bulk-approve', { passIds, remarks });
//   },

//   /**
//    * Bulk reject visitor passes (admin only)
//    * @param {array} passIds - Array of pass IDs
//    * @param {string} reason - Rejection reason
//    * @returns {Promise} - Bulk rejection response
//    */
//   bulkRejectPasses: (passIds, reason) => {
//     return api.post('/visitor-pass/admin/bulk-reject', { passIds, reason });
//   }
// };

// export default visitorPassApi;


// client/src/api/visitorPass.api.js
// import api from './axios.config';

// export const visitorPassApi = {
//   /**
//    * Request a new visitor pass
//    * @param {Object} passData - Visitor pass data
//    * @param {string} passData.visitorName - Name of the visitor
//    * @param {string} passData.visitorPhone - Phone number of the visitor
//    * @param {string} passData.purpose - Purpose of visit (delivery, guest, maintenance, other)
//    * @param {string} passData.visitDate - Date of visit (YYYY-MM-DD)
//    * @param {string} passData.visitTime - Time of visit (optional)
//    * @param {string} passData.vehicleNumber - Vehicle number (optional)
//    * @returns {Promise} - API response
//    */
//   requestPass: (passData) => {
//     return api.post('/visitor-pass/request', passData);
//   },

//   /**
//    * Get all active visitor passes for the current user
//    * @returns {Promise} - List of active passes
//    */
//   getActivePasses: () => {
//     return api.get('/visitor-pass/active');
//   },

//   /**
//    * Get pending visitor pass requests
//    * @returns {Promise} - List of pending requests
//    */
//   getPendingRequests: () => {
//     return api.get('/visitor-pass/pending');
//   },

//   /**
//    * Get visitor pass history
//    * @param {Object} params - Query parameters (page, limit, fromDate, toDate)
//    * @returns {Promise} - List of past passes
//    */
//   getVisitorHistory: (params = {}) => {
//     return api.get('/visitor-pass/history', { params });
//   },

//   /**
//    * Get visitor pass by ID
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - Pass details
//    */
//   getPassById: (passId) => {
//     return api.get(`/visitor-pass/${passId}`);
//   },

//   /**
//    * Cancel a visitor pass request
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - Cancellation response
//    */
//   cancelPass: (passId) => {
//     return api.put(`/visitor-pass/${passId}/cancel`);
//   },

//   /**
//    * Update visitor pass (for pending requests only)
//    * @param {string} passId - Pass ID
//    * @param {Object} passData - Updated pass data
//    * @returns {Promise} - Updated pass
//    */
//   updatePass: (passId, passData) => {
//     return api.put(`/visitor-pass/${passId}`, passData);
//   },

//   /**
//    * Delete a visitor pass (for pending requests only)
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - Deletion response
//    */
//   deletePass: (passId) => {
//     return api.delete(`/visitor-pass/${passId}`);
//   },

//   /**
//    * Get visitor pass statistics
//    * @returns {Promise} - Statistics (total, active, pending, etc.)
//    */
//   getVisitorStats: () => {
//     return api.get('/visitor-pass/stats');
//   },

//   /**
//    * Download visitor pass as PDF
//    * @param {string} passId - Pass ID
//    * @returns {Promise} - PDF blob
//    */
//   downloadPassPDF: (passId) => {
//     return api.get(`/visitor-pass/${passId}/pdf`, { responseType: 'blob' });
//   },

//   /**
//    * Send visitor pass via SMS/Email
//    * @param {string} passId - Pass ID
//    * @param {Object} deliveryMethod - { sms: boolean, email: boolean }
//    * @returns {Promise} - Delivery response
//    */
//   sendPassViaMessage: (passId, deliveryMethod = { sms: true, email: true }) => {
//     return api.post(`/visitor-pass/${passId}/send`, deliveryMethod);
//   },

//   /**
//    * Get upcoming visitor passes
//    * @param {number} days - Number of days to look ahead (default: 7)
//    * @returns {Promise} - List of upcoming passes
//    */
//   getUpcomingPasses: (days = 7) => {
//     return api.get('/visitor-pass/upcoming', { params: { days } });
//   },

//   /**
//    * Check-in a visitor (for security/guard)
//    * @param {string} passId - Pass ID
//    * @param {Object} checkInData - { notes, photo }
//    * @returns {Promise} - Check-in response
//    */
//   checkInVisitor: (passId, checkInData = {}) => {
//     return api.post(`/visitor-pass/${passId}/check-in`, checkInData);
//   },

//   /**
//    * Check-out a visitor (for security/guard)
//    * @param {string} passId - Pass ID
//    * @param {Object} checkOutData - { notes }
//    * @returns {Promise} - Check-out response
//    */
//   checkOutVisitor: (passId, checkOutData = {}) => {
//     return api.post(`/visitor-pass/${passId}/check-out`, checkOutData);
//   },

//   /**
//    * Approve visitor pass (for admin/security)
//    * @param {string} passId - Pass ID
//    * @param {Object} approvalData - { approved, remarks }
//    * @returns {Promise} - Approval response
//    */
//   approvePass: (passId, approvalData = { approved: true, remarks: '' }) => {
//     return api.put(`/visitor-pass/${passId}/approve`, approvalData);
//   },

//   /**
//    * Reject visitor pass (for admin/security)
//    * @param {string} passId - Pass ID
//    * @param {string} reason - Rejection reason
//    * @returns {Promise} - Rejection response
//    */
//   rejectPass: (passId, reason) => {
//     return api.put(`/visitor-pass/${passId}/reject`, { reason });
//   },

//   /**
//    * Get all visitor passes (admin only)
//    * @param {Object} params - Query parameters (page, limit, status, fromDate, toDate)
//    * @returns {Promise} - List of all passes
//    */
//   getAllPasses: (params = {}) => {
//     return api.get('/visitor-pass/admin/all', { params });
//   },

//   /**
//    * Get visitor pass analytics (admin only)
//    * @param {Object} params - Query parameters (year, month)
//    * @returns {Promise} - Analytics data
//    */
//   getPassAnalytics: (params = {}) => {
//     return api.get('/visitor-pass/admin/analytics', { params });
//   },

//   /**
//    * Export visitor passes (admin only)
//    * @param {Object} params - Query parameters (fromDate, toDate, format)
//    * @returns {Promise} - Export file (CSV/Excel)
//    */
//   exportPasses: (params = {}) => {
//     return api.get('/visitor-pass/admin/export', { 
//       params, 
//       responseType: 'blob' 
//     });
//   },

//   /**
//    * Bulk approve visitor passes (admin only)
//    * @param {array} passIds - Array of pass IDs
//    * @param {string} remarks - Approval remarks
//    * @returns {Promise} - Bulk approval response
//    */
//   bulkApprovePasses: (passIds, remarks = '') => {
//     return api.post('/visitor-pass/admin/bulk-approve', { passIds, remarks });
//   },

//   /**
//    * Bulk reject visitor passes (admin only)
//    * @param {array} passIds - Array of pass IDs
//    * @param {string} reason - Rejection reason
//    * @returns {Promise} - Bulk rejection response
//    */
//   bulkRejectPasses: (passIds, reason) => {
//     return api.post('/visitor-pass/admin/bulk-reject', { passIds, reason });
//   }
// };

// export default visitorPassApi;



// client/src/api/visitorPass.api.js
import api from './axios.config';

export const visitorPassApi = {
  /**
   * Request a new visitor pass
   * @param {Object} passData - Visitor pass data
   * @param {string} passData.visitorName - Name of the visitor
   * @param {string} passData.visitorPhone - Phone number of the visitor
   * @param {string} passData.purpose - Purpose of visit (delivery, guest, maintenance, other)
   * @param {string} passData.visitDate - Date of visit (YYYY-MM-DD)
   * @param {string} passData.visitTime - Time of visit (optional)
   * @param {string} passData.vehicleNumber - Vehicle number (optional)
   * @returns {Promise} - API response
   */
  requestPass: (passData) => {
    console.log('🔍 POST /visitor-pass/request', passData);
    return api.post('/visitor-pass/request', passData);
  },

  /**
   * Get all active visitor passes for the current user
   * @returns {Promise} - List of active passes
   */
  getActivePasses: () => {
    console.log('🔍 GET /visitor-pass/active');
    return api.get('/visitor-pass/active')
      .then(res => {
        console.log('✅ Active passes response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Active passes error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get pending visitor pass requests
   * @returns {Promise} - List of pending requests
   */
  getPendingRequests: () => {
    console.log('🔍 GET /visitor-pass/pending');
    return api.get('/visitor-pass/pending')
      .then(res => {
        console.log('✅ Pending requests response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Pending requests error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get visitor pass history
   * @param {Object} params - Query parameters (page, limit, fromDate, toDate)
   * @returns {Promise} - List of past passes
   */
  getVisitorHistory: (params = {}) => {
    console.log('🔍 GET /visitor-pass/history', params);
    return api.get('/visitor-pass/history', { params })
      .then(res => {
        console.log('✅ History response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ History error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get upcoming passes
   * @param {number} days - Number of days to look ahead (default: 7)
   * @returns {Promise} - List of upcoming passes
   */
  getUpcomingPasses: (days = 7) => {
    console.log('🔍 GET /visitor-pass/upcoming', { days });
    return api.get('/visitor-pass/upcoming', { params: { days } })
      .then(res => {
        console.log('✅ Upcoming passes response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Upcoming passes error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get visitor pass by ID
   * @param {string} passId - Pass ID
   * @returns {Promise} - Pass details
   */
  getPassById: (passId) => {
    console.log('🔍 GET /visitor-pass/' + passId);
    return api.get(`/visitor-pass/${passId}`)
      .then(res => {
        console.log('✅ Pass details response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Pass details error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Cancel a visitor pass request
   * @param {string} passId - Pass ID
   * @returns {Promise} - Cancellation response
   */
  cancelPass: (passId) => {
    console.log('🔍 PUT /visitor-pass/' + passId + '/cancel');
    return api.put(`/visitor-pass/${passId}/cancel`)
      .then(res => {
        console.log('✅ Cancel response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Cancel error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Update visitor pass (for pending requests only)
   * @param {string} passId - Pass ID
   * @param {Object} passData - Updated pass data
   * @returns {Promise} - Updated pass
   */
  updatePass: (passId, passData) => {
    console.log('🔍 PUT /visitor-pass/' + passId, passData);
    return api.put(`/visitor-pass/${passId}`, passData)
      .then(res => {
        console.log('✅ Update response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Update error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Delete a visitor pass (for pending requests only)
   * @param {string} passId - Pass ID
   * @returns {Promise} - Deletion response
   */
  deletePass: (passId) => {
    console.log('🔍 DELETE /visitor-pass/' + passId);
    return api.delete(`/visitor-pass/${passId}`)
      .then(res => {
        console.log('✅ Delete response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Delete error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get visitor pass statistics
   * @returns {Promise} - Statistics (total, active, pending, etc.)
   */
  getVisitorStats: () => {
    console.log('🔍 GET /visitor-pass/stats');
    return api.get('/visitor-pass/stats')
      .then(res => {
        console.log('✅ Stats response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Stats error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Download visitor pass as PDF
   * @param {string} passId - Pass ID
   * @returns {Promise} - PDF blob
   */
  downloadPassPDF: (passId) => {
    console.log('🔍 GET /visitor-pass/' + passId + '/pdf');
    return api.get(`/visitor-pass/${passId}/pdf`, { responseType: 'blob' })
      .then(res => {
        console.log('✅ PDF download response:', res);
        return res;
      })
      .catch(err => {
        console.error('❌ PDF download error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Send visitor pass via SMS/Email
   * @param {string} passId - Pass ID
   * @param {Object} deliveryMethod - { sms: boolean, email: boolean }
   * @returns {Promise} - Delivery response
   */
  sendPassViaMessage: (passId, deliveryMethod = { sms: true, email: true }) => {
    console.log('🔍 POST /visitor-pass/' + passId + '/send', deliveryMethod);
    return api.post(`/visitor-pass/${passId}/send`, deliveryMethod)
      .then(res => {
        console.log('✅ Send response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Send error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get visitor pass QR code
   * @param {string} passId - Pass ID
   * @returns {Promise} - QR code image blob
   */
  getPassQRCode: (passId) => {
    console.log('🔍 GET /visitor-pass/' + passId + '/qrcode');
    return api.get(`/visitor-pass/${passId}/qrcode`, { responseType: 'blob' })
      .then(res => {
        console.log('✅ QR code response:', res);
        return res;
      })
      .catch(err => {
        console.error('❌ QR code error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  // ==================== ADMIN/SECURITY ENDPOINTS ====================

  /**
   * Check-in a visitor (for security/guard)
   * @param {string} passId - Pass ID
   * @param {Object} checkInData - { notes, photo }
   * @returns {Promise} - Check-in response
   */
  checkInVisitor: (passId, checkInData = {}) => {
    console.log('🔍 POST /visitor-pass/' + passId + '/check-in', checkInData);
    return api.post(`/visitor-pass/${passId}/check-in`, checkInData)
      .then(res => {
        console.log('✅ Check-in response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Check-in error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Check-out a visitor (for security/guard)
   * @param {string} passId - Pass ID
   * @param {Object} checkOutData - { notes }
   * @returns {Promise} - Check-out response
   */
  checkOutVisitor: (passId, checkOutData = {}) => {
    console.log('🔍 POST /visitor-pass/' + passId + '/check-out', checkOutData);
    return api.post(`/visitor-pass/${passId}/check-out`, checkOutData)
      .then(res => {
        console.log('✅ Check-out response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Check-out error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Approve visitor pass (for admin/security)
   * @param {string} passId - Pass ID
   * @param {Object} approvalData - { approved, remarks }
   * @returns {Promise} - Approval response
   */
  approvePass: (passId, approvalData = { approved: true, remarks: '' }) => {
    console.log('🔍 PUT /visitor-pass/' + passId + '/approve', approvalData);
    return api.put(`/visitor-pass/${passId}/approve`, approvalData)
      .then(res => {
        console.log('✅ Approve response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Approve error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Reject visitor pass (for admin/security)
   * @param {string} passId - Pass ID
   * @param {string} reason - Rejection reason
   * @returns {Promise} - Rejection response
   */
  rejectPass: (passId, reason) => {
    console.log('🔍 PUT /visitor-pass/' + passId + '/reject', { reason });
    return api.put(`/visitor-pass/${passId}/reject`, { reason })
      .then(res => {
        console.log('✅ Reject response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Reject error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get all visitor passes (admin only)
   * @param {Object} params - Query parameters (page, limit, status, fromDate, toDate)
   * @returns {Promise} - List of all passes
   */
  getAllPasses: (params = {}) => {
    console.log('🔍 GET /visitor-pass/admin/all', params);
    return api.get('/visitor-pass/admin/all', { params })
      .then(res => {
        console.log('✅ All passes response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ All passes error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Get visitor pass analytics (admin only)
   * @param {Object} params - Query parameters (year, month)
   * @returns {Promise} - Analytics data
   */
  getPassAnalytics: (params = {}) => {
    console.log('🔍 GET /visitor-pass/admin/analytics', params);
    return api.get('/visitor-pass/admin/analytics', { params })
      .then(res => {
        console.log('✅ Analytics response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Analytics error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Export visitor passes (admin only)
   * @param {Object} params - Query parameters (fromDate, toDate, format)
   * @returns {Promise} - Export file (CSV/Excel)
   */
  exportPasses: (params = {}) => {
    console.log('🔍 GET /visitor-pass/admin/export', params);
    return api.get('/visitor-pass/admin/export', { 
      params, 
      responseType: 'blob' 
    })
      .then(res => {
        console.log('✅ Export response:', res);
        return res;
      })
      .catch(err => {
        console.error('❌ Export error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Bulk approve visitor passes (admin only)
   * @param {array} passIds - Array of pass IDs
   * @param {string} remarks - Approval remarks
   * @returns {Promise} - Bulk approval response
   */
  bulkApprovePasses: (passIds, remarks = '') => {
    console.log('🔍 POST /visitor-pass/admin/bulk-approve', { passIds, remarks });
    return api.post('/visitor-pass/admin/bulk-approve', { passIds, remarks })
      .then(res => {
        console.log('✅ Bulk approve response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Bulk approve error:', err.response?.status, err.response?.data);
        throw err;
      });
  },

  /**
   * Bulk reject visitor passes (admin only)
   * @param {array} passIds - Array of pass IDs
   * @param {string} reason - Rejection reason
   * @returns {Promise} - Bulk rejection response
   */
  bulkRejectPasses: (passIds, reason) => {
    console.log('🔍 POST /visitor-pass/admin/bulk-reject', { passIds, reason });
    return api.post('/visitor-pass/admin/bulk-reject', { passIds, reason })
      .then(res => {
        console.log('✅ Bulk reject response:', res.data);
        return res;
      })
      .catch(err => {
        console.error('❌ Bulk reject error:', err.response?.status, err.response?.data);
        throw err;
      });
  }
};

export default visitorPassApi;