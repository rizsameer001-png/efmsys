// client/src/api/visitor.api.js
import api from './axios.config';

export const visitorApi = {
  /**
   * Get all my visitor passes
   * @returns {Promise} List of visitor passes
   */
  getMyVisitorPasses: () => {
    return api.get('/visitor-passes/my');
  },
  
  /**
   * Get visitor pass by ID
   * @param {string} passId - Pass ID
   * @returns {Promise} Visitor pass details
   */
  getVisitorPassById: (passId) => {
    return api.get(`/visitor-passes/${passId}`);
  },
  
  /**
   * Request a new visitor pass
   * @param {Object} data - Pass request data
   * @param {string} data.visitorName - Visitor's full name
   * @param {string} data.visitorPhone - Visitor's phone number
   * @param {string} data.visitorEmail - Visitor's email (optional)
   * @param {string} data.vehicleNumber - Vehicle number (optional)
   * @param {string} data.visitDate - Visit date (YYYY-MM-DD)
   * @param {string} data.visitTime - Visit time (HH:MM)
   * @param {string} data.purpose - Purpose of visit
   * @param {number} data.duration - Duration in hours
   * @param {string} data.unitId - Unit ID (optional, defaults to primary)
   */
  requestPass: (data) => {
    return api.post('/visitor-passes', data);
  },
  
  /**
   * Cancel a visitor pass
   * @param {string} passId - Pass ID
   * @returns {Promise} Cancellation response
   */
  cancelPass: (passId) => {
    return api.put(`/visitor-passes/${passId}/cancel`);
  },
  
  /**
   * Download visitor pass as PDF
   * @param {string} passId - Pass ID
   * @returns {Promise} PDF blob
   */
  downloadPass: (passId) => {
    return api.get(`/visitor-passes/${passId}/download`, { 
      responseType: 'blob' 
    });
  },
  
  /**
   * Get pass statistics
   * @returns {Promise} Pass statistics
   */
  getPassStats: () => {
    return api.get('/visitor-passes/stats');
  },
  
  /**
   * Get upcoming passes
   * @param {number} days - Number of days to look ahead
   * @returns {Promise} List of upcoming passes
   */
  getUpcomingPasses: (days = 7) => {
    return api.get('/visitor-passes/upcoming', { params: { days } });
  },
  
  /**
   * Extend visitor pass duration
   * @param {string} passId - Pass ID
   * @param {number} additionalHours - Additional hours to extend
   * @returns {Promise} Updated pass
   */
  extendPass: (passId, additionalHours) => {
    return api.put(`/visitor-passes/${passId}/extend`, { additionalHours });
  },
  
  /**
   * Get visitor pass QR code
   * @param {string} passId - Pass ID
   * @returns {Promise} QR code image blob
   */
  getPassQRCode: (passId) => {
    return api.get(`/visitor-passes/${passId}/qrcode`, { 
      responseType: 'blob' 
    });
  },
  
  /**
   * Validate visitor pass (for security)
   * @param {string} passCode - Pass code or QR code value
   * @returns {Promise} Validation result
   */
  validatePass: (passCode) => {
    return api.post('/visitor-passes/validate', { passCode });
  },
  
  /**
   * Get access history for a unit
   * @param {string} unitId - Unit ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Access history
   */
  getAccessHistory: (unitId, params = { page: 1, limit: 20 }) => {
    return api.get(`/visitor-passes/history/${unitId}`, { params });
  },
  
  /**
   * Bulk request visitor passes
   * @param {Array} passes - Array of pass request objects
   * @returns {Promise} Bulk creation result
   */
  bulkRequestPasses: (passes) => {
    return api.post('/visitor-passes/bulk', { passes });
  }
};