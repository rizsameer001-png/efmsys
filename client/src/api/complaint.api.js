// client/src/api/complaint.api.js
//import api from './axios.config';

// export const complaintApi = {
//   // CRUD
//   createComplaint: (data) => api.post('/complaints', data),
//   getComplaints: (params) => api.get('/complaints', { params }),
//   getComplaintById: (id) => api.get(`/complaints/${id}`),
//   updateComplaint: (id, data) => api.put(`/complaints/${id}`, data),
  
//   // Workflow
//   assignComplaint: (id, technicianId) => api.post(`/complaints/${id}/assign`, { technicianId }),
//   startWork: (id) => api.put(`/complaints/${id}/start`),
//   completeWork: (id, data) => api.put(`/complaints/${id}/complete`, data),
//   verifyComplaint: (id, data) => api.put(`/complaints/${id}/verify`, data),
//   addFeedback: (id, data) => api.put(`/complaints/${id}/feedback`, data),
  
//   // Other
//   escalateComplaint: (id, reason) => api.post(`/complaints/${id}/escalate`, { reason }),
//   uploadEvidence: (id, data) => api.post(`/complaints/${id}/evidence`, data),
//   getDashboardStats: () => api.get('/complaints/dashboard/stats')
// };


// client/src/api/complaint.api.js
import api from './axios.config';

export const complaintApi = {
  // ==================== CRUD OPERATIONS ====================
  
  createComplaint: async (data) => {
    try {
      const response = await api.post('/complaints', data);
      console.log('Create complaint response:', response.data);
      return response;
    } catch (error) {
      console.error('Create complaint error:', error);
      throw error;
    }
  },
  
  getComplaints: async (params = {}) => {
    try {
      const response = await api.get('/complaints', { params });
      console.log('Get complaints response:', response.data);
      return response;
    } catch (error) {
      console.error('Get complaints error:', error);
      throw error;
    }
  },
  
  getComplaintById: async (id) => {
    try {
      const response = await api.get(`/complaints/${id}`);
      return response;
    } catch (error) {
      console.error('Get complaint by ID error:', error);
      throw error;
    }
  },
  
  updateComplaint: async (id, data) => {
    try {
      const response = await api.put(`/complaints/${id}`, data);
      return response;
    } catch (error) {
      console.error('Update complaint error:', error);
      throw error;
    }
  },
  
  deleteComplaint: async (id) => {
    try {
      const response = await api.delete(`/complaints/${id}`);
      return response;
    } catch (error) {
      console.error('Delete complaint error:', error);
      throw error;
    }
  },
  
  // ==================== WORKFLOW OPERATIONS ====================
  
  assignComplaint: async (id, technicianId) => {
    try {
      const response = await api.post(`/complaints/${id}/assign`, { technicianId });
      return response;
    } catch (error) {
      console.error('Assign complaint error:', error);
      throw error;
    }
  },
  
  startWork: async (id) => {
    try {
      const response = await api.put(`/complaints/${id}/start`);
      return response;
    } catch (error) {
      console.error('Start work error:', error);
      throw error;
    }
  },
  
  completeWork: async (id, data = {}) => {
    try {
      const response = await api.put(`/complaints/${id}/complete`, data);
      return response;
    } catch (error) {
      console.error('Complete work error:', error);
      throw error;
    }
  },
  
  verifyComplaint: async (id, data) => {
    try {
      const response = await api.put(`/complaints/${id}/verify`, data);
      return response;
    } catch (error) {
      console.error('Verify complaint error:', error);
      throw error;
    }
  },
  
  addFeedback: async (id, data) => {
    try {
      const response = await api.put(`/complaints/${id}/feedback`, data);
      return response;
    } catch (error) {
      console.error('Add feedback error:', error);
      throw error;
    }
  },
  
  // ==================== OTHER OPERATIONS ====================
  
  escalateComplaint: async (id, reason) => {
    try {
      const response = await api.post(`/complaints/${id}/escalate`, { reason });
      return response;
    } catch (error) {
      console.error('Escalate complaint error:', error);
      throw error;
    }
  },
  
  uploadEvidence: async (id, data) => {
    try {
      const response = await api.post(`/complaints/${id}/evidence`, data);
      return response;
    } catch (error) {
      console.error('Upload evidence error:', error);
      throw error;
    }
  },
  
  getDashboardStats: async () => {
    try {
      const response = await api.get('/complaints/dashboard/stats');
      return response;
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }
};