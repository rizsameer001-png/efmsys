// /**
//  * TRACKING API SERVICE
//  * Handles GPS tracking and location services
//  */

// import api from './axios.config';

// export const trackingApi = {
//   /**
//    * Update technician location
//    * @param {Object} location - GPS location data
//    */
//   updateLocation: (location) => {
//     return api.post('/tracking/update', location);
//   },

//   /**
//    * Get live locations of all technicians
//    * @param {string} buildingId - Optional building filter
//    */
//   getLiveLocations: (buildingId = null) => {
//     const params = buildingId ? { buildingId } : {};
//     return api.get('/tracking/live', { params });
//   },

//   /**
//    * Get route history for a technician
//    * @param {string} technicianId - Technician ID
//    * @param {Date} startDate - Start date
//    * @param {Date} endDate - End date
//    */
//   getRouteHistory: (technicianId, startDate, endDate) => {
//     return api.get(`/tracking/history/${technicianId}`, {
//       params: { startDate, endDate }
//     });
//   },

//   /**
//    * Get current tracking session
//    */
//   getCurrentSession: () => {
//     return api.get('/tracking/session');
//   },

//   /**
//    * End tracking session
//    */
//   endSession: () => {
//     return api.post('/tracking/end-session');
//   },

//   // ==================== GEOFENCE ====================
  
//   /**
//    * Get all geofences
//    * @param {string} buildingId - Building ID filter
//    */
//   getGeofences: (buildingId = null) => {
//     const params = buildingId ? { buildingId } : {};
//     return api.get('/geofences', { params });
//   },

//   /**
//    * Create geofence
//    * @param {Object} geofenceData - Geofence data
//    */
//   createGeofence: (geofenceData) => {
//     return api.post('/geofences', geofenceData);
//   },

//   /**
//    * Update geofence
//    * @param {string} id - Geofence ID
//    * @param {Object} updates - Updates
//    */
//   updateGeofence: (id, updates) => {
//     return api.put(`/geofences/${id}`, updates);
//   },

//   /**
//    * Delete geofence
//    * @param {string} id - Geofence ID
//    */
//   deleteGeofence: (id) => {
//     return api.delete(`/geofences/${id}`);
//   },

//   /**
//    * Check if location is within geofence
//    * @param {Object} location - GPS location
//    * @param {string} buildingId - Building ID
//    */
//   checkGeofence: (location, buildingId) => {
//     return api.post('/geofences/check', { location, buildingId });
//   }
// };


// /**
//  * TRACKING API SERVICE
//  * Handles GPS tracking and location services
//  */

// import api from './axios.config';

// export const trackingApi = {
//   /**
//    * Update technician location
//    * @param {number} lat - Latitude
//    * @param {number} lng - Longitude
//    * @param {number} accuracy - GPS accuracy
//    * @param {number} speed - Speed in km/h
//    * @param {number} heading - Heading in degrees
//    * @param {string} taskId - Current task ID
//    */
//   updateLocation: (lat, lng, accuracy = 10, speed = 0, heading = 0, taskId = null) => {
//     return api.post('/tracking/update', { lat, lng, accuracy, speed, heading, taskId });
//   },

//   /**
//    * Get live locations of all technicians
//    * @param {string} buildingId - Optional building filter
//    * @param {string} status - Status filter (active/inactive)
//    */
//   getLiveLocations: (buildingId = null, status = null) => {
//     const params = {};
//     if (buildingId) params.buildingId = buildingId;
//     if (status) params.status = status;
//     return api.get('/tracking/live', { params });
//   },

//   /**
//    * Get route history for a technician
//    * @param {string} technicianId - Technician ID
//    * @param {Date} startDate - Start date
//    * @param {Date} endDate - End date
//    * @param {number} page - Page number
//    * @param {number} limit - Items per page
//    */
//   getRouteHistory: (technicianId, startDate = null, endDate = null, page = 1, limit = 500) => {
//     const params = { page, limit };
//     if (startDate) params.startDate = startDate;
//     if (endDate) params.endDate = endDate;
//     return api.get(`/tracking/history/${technicianId}`, { params });
//   },

//   /**
//    * Get current tracking session
//    */
//   getCurrentSession: () => {
//     return api.get('/tracking/session');
//   },

//   /**
//    * End tracking session
//    */
//   endSession: () => {
//     return api.post('/tracking/end-session');
//   },

//   /**
//    * Get technician tracking summary
//    * @param {string} technicianId - Technician ID
//    * @param {string} period - Period (day/week/month)
//    * @param {string} date - Date
//    */
//   getTechnicianTrackingSummary: (technicianId, period = 'day', date = null) => {
//     const params = { period };
//     if (date) params.date = date;
//     return api.get(`/tracking/technician/${technicianId}/summary`, { params });
//   },

//   // ==================== GEOFENCE ====================
  
//   /**
//    * Get all geofences
//    * @param {string} buildingId - Building ID filter
//    * @param {boolean} isActive - Active filter
//    */
//   getGeofences: (buildingId = null, isActive = null) => {
//     const params = {};
//     if (buildingId) params.buildingId = buildingId;
//     if (isActive !== null) params.isActive = isActive;
//     return api.get('/geofences', { params });
//   },

//   /**
//    * Get geofence by ID
//    * @param {string} id - Geofence ID
//    */
//   getGeofenceById: (id) => {
//     return api.get(`/geofences/${id}`);
//   },

//   /**
//    * Create geofence
//    * @param {Object} geofenceData - Geofence data
//    */
//   createGeofence: (geofenceData) => {
//     return api.post('/geofences', geofenceData);
//   },

//   /**
//    * Update geofence
//    * @param {string} id - Geofence ID
//    * @param {Object} updates - Updates
//    */
//   updateGeofence: (id, updates) => {
//     return api.put(`/geofences/${id}`, updates);
//   },

//   /**
//    * Delete geofence
//    * @param {string} id - Geofence ID
//    */
//   deleteGeofence: (id) => {
//     return api.delete(`/geofences/${id}`);
//   },

//   /**
//    * Check if location is within geofence
//    * @param {number} latitude - Latitude
//    * @param {number} longitude - Longitude
//    * @param {string} userId - User ID (optional)
//    */
//   checkLocation: (latitude, longitude, userId = null) => {
//     return api.post('/geofences/check', { latitude, longitude, userId });
//   },

//   /**
//    * Get geofences by building
//    * @param {string} buildingId - Building ID
//    */
//   getGeofencesByBuilding: (buildingId) => {
//     return api.get(`/geofences/building/${buildingId}`);
//   },

//   /**
//    * Bulk create geofences
//    * @param {Array} geofences - Array of geofence data
//    */
//   bulkCreateGeofences: (geofences) => {
//     return api.post('/geofences/bulk', { geofences });
//   }
// };




/**
 * TRACKING API SERVICE
 * Handles GPS tracking and location services
 */

import api from './axios.config';

export const trackingApi = {
  /**
   * Update technician location
   * @param {number} lat - Latitude
   * @param {number} lng - Longitude
   * @param {number} accuracy - GPS accuracy
   * @param {number} speed - Speed in km/h
   * @param {number} heading - Heading in degrees
   * @param {string} taskId - Current task ID
   */
  updateLocation: (lat, lng, accuracy = 10, speed = 0, heading = 0, taskId = null) => {
    return api.post('/tracking/update', { lat, lng, accuracy, speed, heading, taskId });
  },

  /**
   * Get live locations of all technicians
   * @param {string} buildingId - Optional building filter
   * @param {string} status - Status filter (active/inactive)
   * @returns {Promise} - Returns { success, data: [], total, message }
   */
  getLiveLocations: async (buildingId = null, status = null) => {
    try {
      const params = {};
      if (buildingId) params.buildingId = buildingId;
      if (status) params.status = status;
      
      const response = await api.get('/tracking/live', { params });
      
      // Ensure consistent response structure with array data
      let techniciansData = [];
      
      if (response.data) {
        if (response.data.success && Array.isArray(response.data.data)) {
          techniciansData = response.data.data;
        } else if (Array.isArray(response.data)) {
          techniciansData = response.data;
        } else if (response.data.technicians && Array.isArray(response.data.technicians)) {
          techniciansData = response.data.technicians;
        } else if (response.data.data && !Array.isArray(response.data.data)) {
          // If data is object, try to extract array from it
          techniciansData = response.data.data.technicians || 
                           response.data.data.users || 
                           response.data.data.items || [];
          if (!Array.isArray(techniciansData)) {
            techniciansData = [];
          }
        }
      }
      
      return {
        success: true,
        data: techniciansData,
        total: techniciansData.length,
        message: response.data?.message || 'Locations fetched successfully'
      };
    } catch (error) {
      console.error('Error in getLiveLocations:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.response?.data?.message || error.message || 'Failed to fetch live locations'
      };
    }
  },

  /**
   * Get route history for a technician
   * @param {string} technicianId - Technician ID
   * @param {Date} startDate - Start date
   * @param {Date} endDate - End date
   * @param {number} page - Page number
   * @param {number} limit - Items per page
   */
  getRouteHistory: async (technicianId, startDate = null, endDate = null, page = 1, limit = 500) => {
    try {
      const params = { page, limit };
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      
      const response = await api.get(`/tracking/history/${technicianId}`, { params });
      
      return {
        success: true,
        data: Array.isArray(response.data?.data) ? response.data.data : 
              Array.isArray(response.data) ? response.data : [],
        total: response.data?.total || 0,
        page,
        limit
      };
    } catch (error) {
      console.error('Error in getRouteHistory:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Get current tracking session
   */
  getCurrentSession: async () => {
    try {
      const response = await api.get('/tracking/session');
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Error in getCurrentSession:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * End tracking session
   */
  endSession: async () => {
    try {
      const response = await api.post('/tracking/end-session');
      return {
        success: true,
        data: response.data?.data,
        message: response.data?.message || 'Session ended successfully'
      };
    } catch (error) {
      console.error('Error in endSession:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Get technician tracking summary
   * @param {string} technicianId - Technician ID
   * @param {string} period - Period (day/week/month)
   * @param {string} date - Date
   */
  getTechnicianTrackingSummary: async (technicianId, period = 'day', date = null) => {
    try {
      const params = { period };
      if (date) params.date = date;
      
      const response = await api.get(`/tracking/technician/${technicianId}/summary`, { params });
      
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Error in getTechnicianTrackingSummary:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message
      };
    }
  },

  // ==================== GEOFENCE ====================
  
  /**
   * Get all geofences
   * @param {string} buildingId - Building ID filter
   * @param {boolean} isActive - Active filter
   */
  getGeofences: async (buildingId = null, isActive = null) => {
    try {
      const params = {};
      if (buildingId) params.buildingId = buildingId;
      if (isActive !== null) params.isActive = isActive;
      
      const response = await api.get('/geofences', { params });
      
      return {
        success: true,
        data: Array.isArray(response.data?.data) ? response.data.data : 
              Array.isArray(response.data) ? response.data : [],
        total: response.data?.total || 0,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Error in getGeofences:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Get geofence by ID
   * @param {string} id - Geofence ID
   */
  getGeofenceById: async (id) => {
    try {
      const response = await api.get(`/geofences/${id}`);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Error in getGeofenceById:', error);
      return {
        success: false,
        data: null,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Create geofence
   * @param {Object} geofenceData - Geofence data
   */
  createGeofence: async (geofenceData) => {
    try {
      const response = await api.post('/geofences', geofenceData);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Geofence created successfully'
      };
    } catch (error) {
      console.error('Error in createGeofence:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Update geofence
   * @param {string} id - Geofence ID
   * @param {Object} updates - Updates
   */
  updateGeofence: async (id, updates) => {
    try {
      const response = await api.put(`/geofences/${id}`, updates);
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || 'Geofence updated successfully'
      };
    } catch (error) {
      console.error('Error in updateGeofence:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Delete geofence
   * @param {string} id - Geofence ID
   */
  deleteGeofence: async (id) => {
    try {
      const response = await api.delete(`/geofences/${id}`);
      return {
        success: true,
        message: response.data?.message || 'Geofence deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteGeofence:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Check if location is within geofence
   * @param {number} latitude - Latitude
   * @param {number} longitude - Longitude
   * @param {string} userId - User ID (optional)
   */
  checkLocation: async (latitude, longitude, userId = null) => {
    try {
      const response = await api.post('/geofences/check', { latitude, longitude, userId });
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Error in checkLocation:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Get geofences by building
   * @param {string} buildingId - Building ID
   */
  getGeofencesByBuilding: async (buildingId) => {
    try {
      const response = await api.get(`/geofences/building/${buildingId}`);
      return {
        success: true,
        data: Array.isArray(response.data?.data) ? response.data.data : 
              Array.isArray(response.data) ? response.data : [],
        total: response.data?.total || 0,
        message: response.data?.message
      };
    } catch (error) {
      console.error('Error in getGeofencesByBuilding:', error);
      return {
        success: false,
        data: [],
        total: 0,
        message: error.response?.data?.message || error.message
      };
    }
  },

  /**
   * Bulk create geofences
   * @param {Array} geofences - Array of geofence data
   */
  bulkCreateGeofences: async (geofences) => {
    try {
      const response = await api.post('/geofences/bulk', { geofences });
      return {
        success: true,
        data: response.data?.data || response.data,
        message: response.data?.message || `${geofences.length} geofences created successfully`
      };
    } catch (error) {
      console.error('Error in bulkCreateGeofences:', error);
      return {
        success: false,
        message: error.response?.data?.message || error.message
      };
    }
  }
};

export default trackingApi;