// client/src/api/role.api.js
import api from './axios.config';
import { API_ENDPOINTS } from './endpoints';

export const roleApi = {
  // Get all roles
  getRoles: () => {
    return api.get(API_ENDPOINTS.ROLES);
  },

  // Get role by ID
  getRoleById: (id) => {
    return api.get(`${API_ENDPOINTS.ROLES}/${id}`);
  },

  // Create role
  createRole: (roleData) => {
    return api.post(API_ENDPOINTS.ROLES, roleData);
  },

  // Update role
  updateRole: (id, roleData) => {
    return api.put(`${API_ENDPOINTS.ROLES}/${id}`, roleData);
  },

  // Delete role
  deleteRole: (id) => {
    return api.delete(`${API_ENDPOINTS.ROLES}/${id}`);
  },

  // Get permissions
  getPermissions: (module = null) => {
    const params = module ? { module } : {};
    return api.get(API_ENDPOINTS.ROLES_PERMISSIONS, { params });
  },

  // Assign role to user
  assignRoleToUser: (userId, roleName, customPermissions = []) => {
    return api.post(API_ENDPOINTS.ROLES_ASSIGN, { userId, roleName, customPermissions });
  },
};