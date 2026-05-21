// client/src/api/property.api.js
import api from './axios.config';

export const propertyApi = {
  // Get my properties (owned units)
  getMyProperties: () => {
    return api.get('/customer/properties');
  },
  
  // Get units for a specific property
  getPropertyUnits: (propertyId) => {
    return api.get(`/customer/properties/${propertyId}/units`);
  },
  
  // Get property details
  getPropertyDetails: (propertyId) => {
    return api.get(`/customer/properties/${propertyId}`);
  },
  
  // Get maintenance history for property
  getMaintenanceHistory: (propertyId, params = {}) => {
    return api.get(`/customer/properties/${propertyId}/maintenance`, { params });
  },
  
  // Get documents for property
  getPropertyDocuments: (propertyId) => {
    return api.get(`/customer/properties/${propertyId}/documents`);
  }
};