// client/src/api/user.api.js
import api from './axios.config';
import { API_ENDPOINTS } from './endpoints';

export const userApi = {
  // Get all users
  getUsers: (params = {}) => {
    return api.get(API_ENDPOINTS.USERS, { params });
  },

  // Get user by ID
  getUserById: (id) => {
    return api.get(`${API_ENDPOINTS.USERS}/${id}`);
  },

  // Create user
  createUser: (userData) => {
    return api.post(API_ENDPOINTS.USERS, userData);
  },

  // Update user
  updateUser: (id, userData) => {
    return api.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
  },

  // Delete user
  deleteUser: (id) => {
    return api.delete(`${API_ENDPOINTS.USERS}/${id}`);
  },

  // Bulk import users
  bulkImportUsers: (users) => {
    return api.post(API_ENDPOINTS.USERS_BULK_IMPORT, { users });
  },

  // Export users
  exportUsers: (params = {}) => {
    return api.get(API_ENDPOINTS.USERS_EXPORT, { params });
  },
};