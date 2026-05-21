// /**
//  * TASK API SERVICE
//  * Handles all task-related API calls
//  */

// import api from './axios.config';

// export const taskApi = {
//   // ==================== TASK CRUD ====================
  
//   /**
//    * Create a new task
//    * @param {Object} taskData - Task data
//    */
//   createTask: (taskData) => {
//     return api.post('/tasks', taskData);
//   },

//   /**
//    * Get all tasks with filters
//    * @param {Object} params - Query parameters
//    */
//   getTasks: (params = {}) => {
//     return api.get('/tasks', { params });
//   },

//   /**
//    * Get my assigned tasks (for technicians)
//    */
//   getMyTasks: () => {
//     return api.get('/tasks/my');
//   },

//   /**
//    * Get task by ID
//    * @param {string} id - Task ID
//    */
//   getTaskById: (id) => {
//     return api.get(`/tasks/${id}`);
//   },

//   /**
//    * Update task
//    * @param {string} id - Task ID
//    * @param {Object} updates - Updates to apply
//    */
//   updateTask: (id, updates) => {
//     return api.put(`/tasks/${id}`, updates);
//   },

//   /**
//    * Delete task
//    * @param {string} id - Task ID
//    */
//   deleteTask: (id) => {
//     return api.delete(`/tasks/${id}`);
//   },

//   // ==================== TASK ASSIGNMENT ====================
  
//   /**
//    * Assign task to technician
//    * @param {string} id - Task ID
//    * @param {string} technicianId - Technician ID
//    */
//   assignTask: (id, technicianId) => {
//     return api.post(`/tasks/${id}/assign`, { technicianId });
//   },

//   /**
//    * Auto-assign task to best matching technician
//    * @param {string} id - Task ID
//    */
//   autoAssignTask: (id) => {
//     return api.post(`/tasks/${id}/auto-assign`);
//   },

//   /**
//    * Reassign task to different technician
//    * @param {string} id - Task ID
//    * @param {string} technicianId - New technician ID
//    * @param {string} reason - Reassignment reason
//    */
//   reassignTask: (id, technicianId, reason) => {
//     return api.post(`/tasks/${id}/reassign`, { technicianId, reason });
//   },

//   // ==================== TASK PROGRESS ====================
  
//   /**
//    * Accept task
//    * @param {string} id - Task ID
//    */
//   acceptTask: (id) => {
//     return api.put(`/tasks/${id}/accept`);
//   },

//   /**
//    * Start task
//    * @param {string} id - Task ID
//    * @param {Object} location - GPS location
//    */
//   startTask: (id, location) => {
//     return api.put(`/tasks/${id}/start`, { location });
//   },

//   /**
//    * Update task progress
//    * @param {string} id - Task ID
//    * @param {Object} progressData - Progress data
//    */
//   updateProgress: (id, progressData) => {
//     return api.put(`/tasks/${id}/progress`, progressData);
//   },

//   /**
//    * Pause task
//    * @param {string} id - Task ID
//    * @param {string} reason - Pause reason
//    */
//   pauseTask: (id, reason) => {
//     return api.put(`/tasks/${id}/pause`, { reason });
//   },

//   /**
//    * Resume task
//    * @param {string} id - Task ID
//    */
//   resumeTask: (id) => {
//     return api.put(`/tasks/${id}/resume`);
//   },

//   /**
//    * Complete task
//    * @param {string} id - Task ID
//    * @param {Object} completionData - Completion data with evidence
//    */
//   completeTask: (id, completionData) => {
//     return api.put(`/tasks/${id}/complete`, completionData);
//   },

//   /**
//    * Verify task
//    * @param {string} id - Task ID
//    * @param {Object} verificationData - Verification data
//    */
//   verifyTask: (id, verificationData) => {
//     return api.put(`/tasks/${id}/verify`, verificationData);
//   },

//   /**
//    * Reject task
//    * @param {string} id - Task ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectTask: (id, reason) => {
//     return api.put(`/tasks/${id}/reject`, { reason });
//   },

//   // ==================== STATISTICS ====================
  
//   /**
//    * Get overdue tasks
//    */
//   getOverdueTasks: () => {
//     return api.get('/tasks/overdue');
//   },

//   /**
//    * Get task statistics
//    */
//   getTaskStatistics: () => {
//     return api.get('/tasks/statistics');
//   }
// };


// /**
//  * TASK API SERVICE
//  * Handles all task-related API calls
//  */

// import api from './axios.config';

// export const taskApi = {
//   // ==================== TASK CRUD ====================
  
//   /**
//    * Create a new task
//    * @param {Object} taskData - Task data
//    */
//   createTask: (taskData) => {
//     return api.post('/tasks', taskData);
//   },

//   /**
//    * Get all tasks with filters
//    * @param {Object} params - Query parameters
//    */
//   getTasks: (params = {}) => {
//     return api.get('/tasks', { params });
//   },

//   /**
//    * Get task list with stats (Main dashboard endpoint)
//    */
//   getTaskList: (params = {}) => {
//     return api.get('/tasks/list', { params });
//   },

//   /**
//    * Get my assigned tasks (for technicians)
//    */
//   getMyTasks: () => {
//     return api.get('/tasks/my');
//   },

//   /**
//    * Get task by ID
//    * @param {string} id - Task ID
//    */
//   getTaskById: (id) => {
//     return api.get(`/tasks/${id}`);
//   },

//   /**
//    * Update task
//    * @param {string} id - Task ID
//    * @param {Object} updates - Updates to apply
//    */
//   updateTask: (id, updates) => {
//     return api.put(`/tasks/${id}`, updates);
//   },

//   /**
//    * Delete task
//    * @param {string} id - Task ID
//    */
//   deleteTask: (id) => {
//     return api.delete(`/tasks/${id}`);
//   },

//   // ==================== TASK ASSIGNMENT ====================
  
//   /**
//    * Assign task to technician
//    * @param {string} id - Task ID
//    * @param {string} technicianId - Technician ID
//    */
//   assignTask: (id, technicianId) => {
//     return api.post(`/tasks/${id}/assign`, { technicianId });
//   },

//   /**
//    * Auto-assign task to best matching technician
//    * @param {string} id - Task ID
//    */
//   autoAssignTask: (id) => {
//     return api.post(`/tasks/${id}/auto-assign`);
//   },

//   /**
//    * Reassign task to different technician
//    * @param {string} id - Task ID
//    * @param {string} technicianId - New technician ID
//    * @param {string} reason - Reassignment reason
//    */
//   reassignTask: (id, technicianId, reason) => {
//     return api.post(`/tasks/${id}/reassign`, { technicianId, reason });
//   },

//   /**
//    * Get available technicians for a task
//    * @param {string} id - Task ID
//    */
//   getAvailableTechnicians: (id) => {
//     return api.get(`/tasks/available-technicians/${id}`);
//   },

//   /**
//    * Get technician workload
//    * @param {string} technicianId - Technician ID
//    */
//   getTechnicianWorkload: (technicianId) => {
//     return api.get(`/tasks/technician/${technicianId}/workload`);
//   },

//   /**
//    * Get assignment history
//    * @param {string} id - Task ID
//    */
//   getAssignmentHistory: (id) => {
//     return api.get(`/tasks/${id}/assignment-history`);
//   },

//   // ==================== TASK PROGRESS ====================
  
//   /**
//    * Accept task
//    * @param {string} id - Task ID
//    */
//   acceptTask: (id) => {
//     return api.put(`/tasks/${id}/accept`);
//   },

//   /**
//    * Start task
//    * @param {string} id - Task ID
//    * @param {Object} location - GPS location
//    */
//   startTask: (id, location) => {
//     return api.put(`/tasks/${id}/start`, { location });
//   },

//   /**
//    * Update task progress
//    * @param {string} id - Task ID
//    * @param {number} percentage - Progress percentage
//    */
//   updateProgress: (id, percentage) => {
//     return api.put(`/tasks/${id}/progress`, { percentage });
//   },

//   /**
//    * Update checklist item
//    * @param {string} id - Task ID
//    * @param {string} itemId - Checklist item ID
//    * @param {boolean} completed - Completion status
//    * @param {string} imageAfter - After image URL
//    * @param {string} notes - Notes
//    */
//   updateChecklist: (id, itemId, completed, imageAfter = null, notes = null) => {
//     return api.put(`/tasks/${id}/update-checklist`, { itemId, completed, imageAfter, notes });
//   },

//   /**
//    * Upload evidence
//    * @param {string} id - Task ID
//    * @param {Array} images - Images array
//    * @param {Array} videos - Videos array
//    * @param {Array} documents - Documents array
//    */
//   uploadEvidence: (id, images = [], videos = [], documents = []) => {
//     return api.put(`/tasks/${id}/upload-evidence`, { images, videos, documents });
//   },

//   /**
//    * Pause task
//    * @param {string} id - Task ID
//    * @param {string} reason - Pause reason
//    */
//   pauseTask: (id, reason) => {
//     return api.put(`/tasks/${id}/pause`, { reason });
//   },

//   /**
//    * Resume task
//    * @param {string} id - Task ID
//    */
//   resumeTask: (id) => {
//     return api.put(`/tasks/${id}/resume`);
//   },

//   /**
//    * Complete task
//    * @param {string} id - Task ID
//    * @param {string} completionNotes - Completion notes
//    * @param {Array} afterImages - After images
//    */
//   completeTask: (id, completionNotes = '', afterImages = []) => {
//     return api.put(`/tasks/${id}/complete`, { completionNotes, afterImages });
//   },

//   /**
//    * Verify task
//    * @param {string} id - Task ID
//    * @param {boolean} approved - Approval status
//    * @param {number} rating - Rating (1-5)
//    * @param {string} notes - Verification notes
//    */
//   verifyTask: (id, approved, rating = null, notes = '') => {
//     return api.put(`/tasks/${id}/verify`, { approved, rating, notes });
//   },

//   /**
//    * Reject task
//    * @param {string} id - Task ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectTask: (id, reason) => {
//     return api.put(`/tasks/${id}/reject`, { reason });
//   },

//   /**
//    * Get task progress details
//    * @param {string} id - Task ID
//    */
//   getTaskProgress: (id) => {
//     return api.get(`/tasks/${id}/progress`);
//   },

//   /**
//    * Get technician daily progress
//    * @param {string} technicianId - Technician ID
//    * @param {string} date - Date (YYYY-MM-DD)
//    */
//   getDailyProgress: (technicianId, date = null) => {
//     const params = date ? { date } : {};
//     return api.get(`/tasks/technician/${technicianId}/daily-progress`, { params });
//   },

//   // ==================== STATISTICS & FILTERS ====================
  
//   /**
//    * Get overdue tasks
//    */
//   getOverdueTasks: () => {
//     return api.get('/tasks/overdue');
//   },

//   /**
//    * Get task statistics
//    */
//   getTaskStatistics: () => {
//     return api.get('/tasks/statistics');
//   },

//   /**
//    * Get tasks by status
//    * @param {string} status - Status filter
//    */
//   getTasksByStatus: (status) => {
//     return api.get(`/tasks/status/${status}`);
//   },

//   /**
//    * Get tasks by priority
//    * @param {string} priority - Priority filter
//    */
//   getTasksByPriority: (priority) => {
//     return api.get(`/tasks/priority/${priority}`);
//   },

//   /**
//    * Get tasks by building
//    * @param {string} buildingId - Building ID
//    */
//   getTasksByBuilding: (buildingId) => {
//     return api.get(`/tasks/building/${buildingId}`);
//   },

//   /**
//    * Get tasks by technician
//    * @param {string} technicianId - Technician ID
//    */
//   getTasksByTechnician: (technicianId) => {
//     return api.get(`/tasks/technician/${technicianId}`);
//   },

//   /**
//    * Export tasks to CSV
//    */
//   exportTasksToCSV: (params = {}) => {
//     return api.get('/tasks/export/csv', { params });
//   }
// };






// /**
//  * TASK API SERVICE
//  * Handles all task-related API calls
//  */

// import api from './axios.config';

// // Debug flag - set to false in production
// const DEBUG = true;

// // Helper function for logging
// const logDebug = (message, data = null) => {
//   if (DEBUG) {
//     console.log(`📋 [Task API] ${message}`);
//     if (data) console.log('   Data:', data);
//   }
// };

// const logError = (message, error) => {
//   console.error(`❌ [Task API] ${message}`);
//   console.error('   Error:', error.response?.data || error.message);
//   if (error.response) {
//     console.error('   Status:', error.response.status);
//     console.error('   URL:', error.config?.url);
//   }
// };

// export const taskApi = {
//   // ==================== TASK CRUD ====================
  
//   /**
//    * Create a new task
//    * @param {Object} taskData - Task data
//    */
//   createTask: async (taskData) => {
//     logDebug('Creating new task:', taskData);
//     try {
//       const response = await api.post('/tasks', taskData);
//       logDebug('Task created successfully:', response.data);
//       return response;
//     } catch (error) {
//       logError('Failed to create task', error);
//       throw error;
//     }
//   },

//   /**
//    * Get all tasks with filters
//    * @param {Object} params - Query parameters
//    */
//   getTasks: async (params = {}) => {
//     logDebug('Fetching tasks with params:', params);
//     try {
//       const response = await api.get('/tasks', { params });
//       logDebug(`Fetched ${response.data?.data?.tasks?.length || 0} tasks`);
//       return response;
//     } catch (error) {
//       logError('Failed to fetch tasks', error);
//       throw error;
//     }
//   },

//   /**
//    * Get task list with stats (Main dashboard endpoint)
//    */
//   getTaskList: async (params = {}) => {
//     logDebug('Fetching task list with params:', params);
//     try {
//       const response = await api.get('/tasks/list', { params });
//       logDebug(`Fetched task list: ${response.data?.data?.tasks?.length || 0} tasks`);
//       return response;
//     } catch (error) {
//       logError('Failed to fetch task list', error);
//       throw error;
//     }
//   },

//   /**
//    * Get my assigned tasks (for technicians)
//    */
//   getMyTasks: async () => {
//     logDebug('Fetching my assigned tasks');
//     try {
//       const response = await api.get('/tasks/my');
//       logDebug(`Fetched ${response.data?.data?.tasks?.length || 0} assigned tasks`);
//       return response;
//     } catch (error) {
//       logError('Failed to fetch my tasks', error);
//       throw error;
//     }
//   },

//   /**
//    * Get task by ID
//    * @param {string} id - Task ID
//    */
//   getTaskById: async (id) => {
//     logDebug(`Fetching task by ID: ${id}`);
//     try {
//       const response = await api.get(`/tasks/${id}`);
//       logDebug('Task fetched successfully');
//       return response;
//     } catch (error) {
//       logError(`Failed to fetch task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Update task
//    * @param {string} id - Task ID
//    * @param {Object} updates - Updates to apply
//    */
//   updateTask: async (id, updates) => {
//     logDebug(`Updating task ${id}:`, updates);
//     try {
//       const response = await api.put(`/tasks/${id}`, updates);
//       logDebug(`Task ${id} updated successfully`);
//       return response;
//     } catch (error) {
//       logError(`Failed to update task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Delete task
//    * @param {string} id - Task ID
//    */
//   deleteTask: async (id) => {
//     logDebug(`Deleting task: ${id}`);
//     try {
//       const response = await api.delete(`/tasks/${id}`);
//       logDebug(`Task ${id} deleted successfully`);
//       return response;
//     } catch (error) {
//       logError(`Failed to delete task ${id}`, error);
//       throw error;
//     }
//   },

//   // ==================== TASK ASSIGNMENT ====================
  
//   /**
//    * Assign task to technician
//    * @param {string} id - Task ID
//    * @param {string} technicianId - Technician ID
//    */
//   assignTask: async (id, technicianId) => {
//     logDebug(`Assigning task ${id} to technician ${technicianId}`);
//     try {
//       const response = await api.post(`/tasks/${id}/assign`, { technicianId });
//       logDebug(`Task ${id} assigned successfully`);
//       return response;
//     } catch (error) {
//       logError(`Failed to assign task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Auto-assign task to best matching technician
//    * @param {string} id - Task ID
//    */
//   autoAssignTask: async (id) => {
//     logDebug(`Auto-assigning task: ${id}`);
//     try {
//       const response = await api.post(`/tasks/${id}/auto-assign`);
//       logDebug(`Task ${id} auto-assigned successfully`);
//       return response;
//     } catch (error) {
//       logError(`Failed to auto-assign task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Reassign task to different technician
//    * @param {string} id - Task ID
//    * @param {string} technicianId - New technician ID
//    * @param {string} reason - Reassignment reason
//    */
//   reassignTask: async (id, technicianId, reason) => {
//     logDebug(`Reassigning task ${id} to ${technicianId}, reason: ${reason}`);
//     try {
//       const response = await api.post(`/tasks/${id}/reassign`, { technicianId, reason });
//       logDebug(`Task ${id} reassigned successfully`);
//       return response;
//     } catch (error) {
//       logError(`Failed to reassign task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get available technicians for a task
//    * @param {string} id - Task ID
//    */
//   getAvailableTechnicians: async (id) => {
//     logDebug(`Fetching available technicians for task: ${id}`);
//     try {
//       const response = await api.get(`/tasks/available-technicians/${id}`);
//       logDebug(`Found ${response.data?.data?.length || 0} available technicians`);
//       return response;
//     } catch (error) {
//       logError(`Failed to get available technicians for task ${id}`, error);
//       // Return empty array instead of throwing to handle gracefully
//       return { 
//         data: { 
//           success: false, 
//           data: [], 
//           count: 0,
//           error: error.response?.data?.error || error.message 
//         } 
//       };
//     }
//   },

//   /**
//    * Get technician workload
//    * @param {string} technicianId - Technician ID
//    */
//   getTechnicianWorkload: async (technicianId) => {
//     logDebug(`Fetching workload for technician: ${technicianId}`);
//     try {
//       const response = await api.get(`/tasks/technician/${technicianId}/workload`);
//       logDebug('Workload fetched successfully');
//       return response;
//     } catch (error) {
//       logError(`Failed to get workload for technician ${technicianId}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get assignment history
//    * @param {string} id - Task ID
//    */
//   getAssignmentHistory: async (id) => {
//     logDebug(`Fetching assignment history for task: ${id}`);
//     try {
//       const response = await api.get(`/tasks/${id}/assignment-history`);
//       logDebug(`Fetched ${response.data?.data?.length || 0} assignment records`);
//       return response;
//     } catch (error) {
//       logError(`Failed to get assignment history for task ${id}`, error);
//       throw error;
//     }
//   },

//   // ==================== TASK PROGRESS ====================
  
//   /**
//    * Accept task
//    * @param {string} id - Task ID
//    */
//   acceptTask: async (id) => {
//     logDebug(`Accepting task: ${id}`);
//     try {
//       const response = await api.put(`/tasks/${id}/accept`);
//       logDebug(`Task ${id} accepted`);
//       return response;
//     } catch (error) {
//       logError(`Failed to accept task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Start task
//    * @param {string} id - Task ID
//    * @param {Object} location - GPS location
//    */
//   startTask: async (id, location) => {
//     logDebug(`Starting task: ${id}`, { location });
//     try {
//       const response = await api.put(`/tasks/${id}/start`, { location });
//       logDebug(`Task ${id} started`);
//       return response;
//     } catch (error) {
//       logError(`Failed to start task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Update task progress
//    * @param {string} id - Task ID
//    * @param {number} percentage - Progress percentage
//    */
//   updateProgress: async (id, percentage) => {
//     logDebug(`Updating progress for task ${id} to ${percentage}%`);
//     try {
//       const response = await api.put(`/tasks/${id}/progress`, { percentage });
//       logDebug(`Progress updated for task ${id}`);
//       return response;
//     } catch (error) {
//       logError(`Failed to update progress for task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Update checklist item
//    * @param {string} id - Task ID
//    * @param {string} itemId - Checklist item ID
//    * @param {boolean} completed - Completion status
//    * @param {string} imageAfter - After image URL
//    * @param {string} notes - Notes
//    */
//   updateChecklist: async (id, itemId, completed, imageAfter = null, notes = null) => {
//     logDebug(`Updating checklist item ${itemId} for task ${id}`, { completed });
//     try {
//       const response = await api.put(`/tasks/${id}/update-checklist`, { itemId, completed, imageAfter, notes });
//       logDebug(`Checklist item updated`);
//       return response;
//     } catch (error) {
//       logError(`Failed to update checklist for task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Upload evidence
//    * @param {string} id - Task ID
//    * @param {Array} images - Images array
//    * @param {Array} videos - Videos array
//    * @param {Array} documents - Documents array
//    */
//   uploadEvidence: async (id, images = [], videos = [], documents = []) => {
//     logDebug(`Uploading evidence for task ${id}`, { images: images.length, videos: videos.length, documents: documents.length });
//     try {
//       const response = await api.put(`/tasks/${id}/upload-evidence`, { images, videos, documents });
//       logDebug(`Evidence uploaded for task ${id}`);
//       return response;
//     } catch (error) {
//       logError(`Failed to upload evidence for task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Pause task
//    * @param {string} id - Task ID
//    * @param {string} reason - Pause reason
//    */
//   pauseTask: async (id, reason) => {
//     logDebug(`Pausing task: ${id}, reason: ${reason}`);
//     try {
//       const response = await api.put(`/tasks/${id}/pause`, { reason });
//       logDebug(`Task ${id} paused`);
//       return response;
//     } catch (error) {
//       logError(`Failed to pause task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Resume task
//    * @param {string} id - Task ID
//    */
//   resumeTask: async (id) => {
//     logDebug(`Resuming task: ${id}`);
//     try {
//       const response = await api.put(`/tasks/${id}/resume`);
//       logDebug(`Task ${id} resumed`);
//       return response;
//     } catch (error) {
//       logError(`Failed to resume task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Complete task
//    * @param {string} id - Task ID
//    * @param {string} completionNotes - Completion notes
//    * @param {Array} afterImages - After images
//    */
//   completeTask: async (id, completionNotes = '', afterImages = []) => {
//     logDebug(`Completing task: ${id}`);
//     try {
//       const response = await api.put(`/tasks/${id}/complete`, { completionNotes, afterImages });
//       logDebug(`Task ${id} completed`);
//       return response;
//     } catch (error) {
//       logError(`Failed to complete task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Verify task
//    * @param {string} id - Task ID
//    * @param {boolean} approved - Approval status
//    * @param {number} rating - Rating (1-5)
//    * @param {string} notes - Verification notes
//    */
//   verifyTask: async (id, approved, rating = null, notes = '') => {
//     logDebug(`Verifying task: ${id}, approved: ${approved}`);
//     try {
//       const response = await api.put(`/tasks/${id}/verify`, { approved, rating, notes });
//       logDebug(`Task ${id} verified`);
//       return response;
//     } catch (error) {
//       logError(`Failed to verify task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Reject task
//    * @param {string} id - Task ID
//    * @param {string} reason - Rejection reason
//    */
//   rejectTask: async (id, reason) => {
//     logDebug(`Rejecting task: ${id}, reason: ${reason}`);
//     try {
//       const response = await api.put(`/tasks/${id}/reject`, { reason });
//       logDebug(`Task ${id} rejected`);
//       return response;
//     } catch (error) {
//       logError(`Failed to reject task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get task progress details
//    * @param {string} id - Task ID
//    */
//   getTaskProgress: async (id) => {
//     logDebug(`Fetching progress for task: ${id}`);
//     try {
//       const response = await api.get(`/tasks/${id}/progress`);
//       logDebug('Progress fetched successfully');
//       return response;
//     } catch (error) {
//       logError(`Failed to get progress for task ${id}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get technician daily progress
//    * @param {string} technicianId - Technician ID
//    * @param {string} date - Date (YYYY-MM-DD)
//    */
//   getDailyProgress: async (technicianId, date = null) => {
//     const params = date ? { date } : {};
//     logDebug(`Fetching daily progress for technician ${technicianId}`, params);
//     try {
//       const response = await api.get(`/tasks/technician/${technicianId}/daily-progress`, { params });
//       logDebug('Daily progress fetched successfully');
//       return response;
//     } catch (error) {
//       logError(`Failed to get daily progress for technician ${technicianId}`, error);
//       throw error;
//     }
//   },

//   // ==================== STATISTICS & FILTERS ====================
  
//   /**
//    * Get overdue tasks
//    */
//   getOverdueTasks: async () => {
//     logDebug('Fetching overdue tasks');
//     try {
//       const response = await api.get('/tasks/overdue');
//       logDebug(`Fetched ${response.data?.data?.length || 0} overdue tasks`);
//       return response;
//     } catch (error) {
//       logError('Failed to fetch overdue tasks', error);
//       throw error;
//     }
//   },

//   /**
//    * Get task statistics
//    */
//   getTaskStatistics: async () => {
//     logDebug('Fetching task statistics');
//     try {
//       const response = await api.get('/tasks/statistics');
//       logDebug('Statistics fetched successfully:', response.data);
//       return response;
//     } catch (error) {
//       logError('Failed to fetch task statistics', error);
//       throw error;
//     }
//   },

//   /**
//    * Get tasks by status
//    * @param {string} status - Status filter
//    */
//   getTasksByStatus: async (status) => {
//     logDebug(`Fetching tasks by status: ${status}`);
//     try {
//       const response = await api.get(`/tasks/status/${status}`);
//       logDebug(`Fetched ${response.data?.data?.length || 0} tasks with status ${status}`);
//       return response;
//     } catch (error) {
//       logError(`Failed to fetch tasks by status ${status}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get tasks by priority
//    * @param {string} priority - Priority filter
//    */
//   getTasksByPriority: async (priority) => {
//     logDebug(`Fetching tasks by priority: ${priority}`);
//     try {
//       const response = await api.get(`/tasks/priority/${priority}`);
//       logDebug(`Fetched ${response.data?.data?.length || 0} tasks with priority ${priority}`);
//       return response;
//     } catch (error) {
//       logError(`Failed to fetch tasks by priority ${priority}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get tasks by building
//    * @param {string} buildingId - Building ID
//    */
//   getTasksByBuilding: async (buildingId) => {
//     logDebug(`Fetching tasks by building: ${buildingId}`);
//     try {
//       const response = await api.get(`/tasks/building/${buildingId}`);
//       logDebug(`Fetched ${response.data?.data?.length || 0} tasks for building ${buildingId}`);
//       return response;
//     } catch (error) {
//       logError(`Failed to fetch tasks by building ${buildingId}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Get tasks by technician
//    * @param {string} technicianId - Technician ID
//    */
//   getTasksByTechnician: async (technicianId) => {
//     logDebug(`Fetching tasks by technician: ${technicianId}`);
//     try {
//       const response = await api.get(`/tasks/technician/${technicianId}`);
//       logDebug(`Fetched ${response.data?.data?.length || 0} tasks for technician ${technicianId}`);
//       return response;
//     } catch (error) {
//       logError(`Failed to fetch tasks by technician ${technicianId}`, error);
//       throw error;
//     }
//   },

//   /**
//    * Export tasks to CSV
//    * @param {Object} params - Query parameters
//    */
//   exportTasksToCSV: async (params = {}) => {
//     logDebug('Exporting tasks to CSV', params);
//     try {
//       const response = await api.get('/tasks/export/csv', { params, responseType: 'blob' });
//       logDebug('CSV export successful');
//       return response;
//     } catch (error) {
//       logError('Failed to export tasks to CSV', error);
//       throw error;
//     }
//   }
// };

// export default taskApi;









/**
 * TASK API SERVICE
 * Handles all task-related API calls
 */

import api from './axios.config';

// Debug flag - set to false in production
const DEBUG = true;

// Helper function for logging
const logDebug = (message, data = null) => {
  if (DEBUG) {
    console.log(`📋 [Task API] ${message}`);
    if (data) console.log('   Data:', data);
  }
};

const logError = (message, error) => {
  console.error(`❌ [Task API] ${message}`);
  console.error('   Error:', error.response?.data || error.message);
  if (error.response) {
    console.error('   Status:', error.response.status);
    console.error('   URL:', error.config?.url);
  }
};

export const taskApi = {
  // ==================== TASK CRUD ====================
  
  /**
   * Create a new task
   * @param {Object} taskData - Task data
   */
  createTask: async (taskData) => {
    logDebug('Creating new task:', taskData);
    try {
      const response = await api.post('/tasks', taskData);
      logDebug('Task created successfully:', response.data);
      return response;
    } catch (error) {
      logError('Failed to create task', error);
      throw error;
    }
  },

  /**
   * Get all tasks with filters
   * @param {Object} params - Query parameters
   */
  getTasks: async (params = {}) => {
    logDebug('Fetching tasks with params:', params);
    try {
      const response = await api.get('/tasks', { params });
      logDebug(`Fetched ${response.data?.data?.tasks?.length || 0} tasks`);
      return response;
    } catch (error) {
      logError('Failed to fetch tasks', error);
      throw error;
    }
  },

  /**
   * Get task list with stats (Main dashboard endpoint)
   */
  getTaskList: async (params = {}) => {
    logDebug('Fetching task list with params:', params);
    try {
      const response = await api.get('/tasks/list', { params });
      logDebug(`Fetched task list: ${response.data?.data?.tasks?.length || 0} tasks`);
      return response;
    } catch (error) {
      logError('Failed to fetch task list', error);
      throw error;
    }
  },

  /**
   * Get my assigned tasks (for technicians)
   */
  getMyTasks: async () => {
    logDebug('Fetching my assigned tasks');
    try {
      const response = await api.get('/tasks/my');
      logDebug(`Fetched ${response.data?.data?.tasks?.length || 0} assigned tasks`);
      return response;
    } catch (error) {
      logError('Failed to fetch my tasks', error);
      throw error;
    }
  },

  /**
   * Get task by ID
   * @param {string} id - Task ID
   */
  getTaskById: async (id) => {
    logDebug(`Fetching task by ID: ${id}`);
    try {
      const response = await api.get(`/tasks/${id}`);
      logDebug('Task fetched successfully');
      return response;
    } catch (error) {
      logError(`Failed to fetch task ${id}`, error);
      throw error;
    }
  },

  /**
   * Update task
   * @param {string} id - Task ID
   * @param {Object} updates - Updates to apply
   */
  updateTask: async (id, updates) => {
    logDebug(`Updating task ${id}:`, updates);
    try {
      const response = await api.put(`/tasks/${id}`, updates);
      logDebug(`Task ${id} updated successfully`);
      return response;
    } catch (error) {
      logError(`Failed to update task ${id}`, error);
      throw error;
    }
  },

  /**
   * Delete task
   * @param {string} id - Task ID
   */
  deleteTask: async (id) => {
    logDebug(`Deleting task: ${id}`);
    try {
      const response = await api.delete(`/tasks/${id}`);
      logDebug(`Task ${id} deleted successfully`);
      return response;
    } catch (error) {
      logError(`Failed to delete task ${id}`, error);
      throw error;
    }
  },

  // ==================== TASK ASSIGNMENT ====================
  
  /**
   * Assign task to technician
   * @param {string} id - Task ID
   * @param {string} technicianId - Technician ID
   */
  assignTask: async (id, technicianId) => {
    logDebug(`Assigning task ${id} to technician ${technicianId}`);
    try {
      const response = await api.post(`/tasks/${id}/assign`, { technicianId });
      logDebug(`Task ${id} assigned successfully`);
      return response;
    } catch (error) {
      logError(`Failed to assign task ${id}`, error);
      throw error;
    }
  },

  /**
   * Auto-assign task to best matching technician
   * @param {string} id - Task ID
   */
  autoAssignTask: async (id) => {
    logDebug(`Auto-assigning task: ${id}`);
    try {
      const response = await api.post(`/tasks/${id}/auto-assign`);
      logDebug(`Task ${id} auto-assigned successfully`);
      return response;
    } catch (error) {
      logError(`Failed to auto-assign task ${id}`, error);
      throw error;
    }
  },

  /**
   * Reassign task to different technician
   * @param {string} id - Task ID
   * @param {string} technicianId - New technician ID
   * @param {string} reason - Reassignment reason
   */
  reassignTask: async (id, technicianId, reason) => {
    logDebug(`Reassigning task ${id} to ${technicianId}, reason: ${reason}`);
    try {
      const response = await api.post(`/tasks/${id}/reassign`, { technicianId, reason });
      logDebug(`Task ${id} reassigned successfully`);
      return response;
    } catch (error) {
      logError(`Failed to reassign task ${id}`, error);
      throw error;
    }
  },

  /**
   * Get available technicians for a task
   * @param {string} id - Task ID
   */
  getAvailableTechnicians: async (id) => {
    logDebug(`Fetching available technicians for task: ${id}`);
    try {
      const response = await api.get(`/tasks/available-technicians/${id}`);
      logDebug(`Found ${response.data?.data?.length || 0} available technicians`);
      return response;
    } catch (error) {
      logError(`Failed to get available technicians for task ${id}`, error);
      // Return empty array instead of throwing to handle gracefully
      return { 
        data: { 
          success: false, 
          data: [], 
          count: 0,
          error: error.response?.data?.error || error.message 
        } 
      };
    }
  },

  /**
   * Get technician workload
   * @param {string} technicianId - Technician ID
   */
  getTechnicianWorkload: async (technicianId) => {
    logDebug(`Fetching workload for technician: ${technicianId}`);
    try {
      const response = await api.get(`/tasks/technician/${technicianId}/workload`);
      logDebug('Workload fetched successfully');
      return response;
    } catch (error) {
      logError(`Failed to get workload for technician ${technicianId}`, error);
      throw error;
    }
  },

  /**
   * Get assignment history
   * @param {string} id - Task ID
   */
  getAssignmentHistory: async (id) => {
    logDebug(`Fetching assignment history for task: ${id}`);
    try {
      const response = await api.get(`/tasks/${id}/assignment-history`);
      logDebug(`Fetched ${response.data?.data?.length || 0} assignment records`);
      return response;
    } catch (error) {
      logError(`Failed to get assignment history for task ${id}`, error);
      throw error;
    }
  },

  // ==================== TASK PROGRESS ====================
  
  /**
   * Accept task
   * @param {string} id - Task ID
   */
  acceptTask: async (id) => {
    logDebug(`Accepting task: ${id}`);
    try {
      const response = await api.put(`/tasks/${id}/accept`);
      logDebug(`Task ${id} accepted`);
      return response;
    } catch (error) {
      logError(`Failed to accept task ${id}`, error);
      throw error;
    }
  },

  /**
   * Start task
   * @param {string} id - Task ID
   * @param {Object} location - GPS location
   */
  startTask: async (id, location) => {
    logDebug(`Starting task: ${id}`, { location });
    try {
      const response = await api.put(`/tasks/${id}/start`, { location });
      logDebug(`Task ${id} started`);
      return response;
    } catch (error) {
      logError(`Failed to start task ${id}`, error);
      throw error;
    }
  },

  /**
   * Update task progress
   * @param {string} id - Task ID
   * @param {number} percentage - Progress percentage
   */
  updateProgress: async (id, percentage) => {
    logDebug(`Updating progress for task ${id} to ${percentage}%`);
    try {
      const response = await api.put(`/tasks/${id}/progress`, { percentage });
      logDebug(`Progress updated for task ${id}`);
      return response;
    } catch (error) {
      logError(`Failed to update progress for task ${id}`, error);
      throw error;
    }
  },

  /**
   * Update checklist item
   * @param {string} id - Task ID
   * @param {string} itemId - Checklist item ID
   * @param {boolean} completed - Completion status
   * @param {string} imageAfter - After image URL
   * @param {string} notes - Notes
   */
  updateChecklist: async (id, itemId, completed, imageAfter = null, notes = null) => {
    logDebug(`Updating checklist item ${itemId} for task ${id}`, { completed });
    try {
      const response = await api.put(`/tasks/${id}/update-checklist`, { itemId, completed, imageAfter, notes });
      logDebug(`Checklist item updated`);
      return response;
    } catch (error) {
      logError(`Failed to update checklist for task ${id}`, error);
      throw error;
    }
  },

  /**
   * Upload evidence - IMPROVED VERSION
   * @param {string} id - Task ID
   * @param {Array} images - Images array (base64 strings or URLs)
   * @param {Array} videos - Videos array
   * @param {Array} documents - Documents array
   * @returns {Promise} - API response with uploaded evidence details
   */
  uploadEvidence: async (id, images = [], videos = [], documents = []) => {
    logDebug(`📤 Uploading evidence for task ${id}`, { 
      images: images.length, 
      videos: videos.length, 
      documents: documents.length 
    });
    
    try {
      // Validate input
      if (!id) {
        throw new Error('Task ID is required');
      }
      
      if (images.length === 0 && videos.length === 0 && documents.length === 0) {
        throw new Error('No files to upload');
      }
      
      // Prepare the request payload
      const payload = { 
        images: images.map(img => {
          // If image is a File object, we need to convert it
          if (img instanceof File) {
            // This would need to be handled differently - for now, skip
            console.warn('File objects should be converted to base64 before calling this method');
            return null;
          }
          return img;
        }).filter(Boolean),
        videos: videos.map(vid => {
          if (vid instanceof File) return null;
          return vid;
        }).filter(Boolean),
        documents: documents.map(doc => {
          if (doc instanceof File) return null;
          return doc;
        }).filter(Boolean)
      };
      
      logDebug('📤 Upload payload prepared', { 
        imagesCount: payload.images.length,
        videosCount: payload.videos.length 
      });
      
      // Make API call
      const response = await api.put(`/tasks/${id}/upload-evidence`, payload);
      
      logDebug('✅ Evidence uploaded successfully:', response.data);
      return response;
      
    } catch (error) {
      logError('❌ Failed to upload evidence', error);
      
      // Return a structured error response
      return {
        data: {
          success: false,
          error: error.response?.data?.error || error.message || 'Failed to upload evidence',
          details: error.response?.data
        }
      };
    }
  },

  /**
   * Upload evidence with file (handles File objects by converting to base64)
   * @param {string} id - Task ID
   * @param {File[]} files - Array of File objects
   * @returns {Promise} - API response
   */
  uploadEvidenceFiles: async (id, files) => {
    logDebug(`📤 Uploading ${files.length} file(s) for task ${id}`);
    
    try {
      // Convert files to base64
      const base64Images = await Promise.all(
        files.map(file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });
        })
      );
      
      // Upload using the main uploadEvidence method
      return await taskApi.uploadEvidence(id, base64Images, [], []);
      
    } catch (error) {
      logError('❌ Failed to upload evidence files', error);
      return {
        data: {
          success: false,
          error: error.message || 'Failed to upload files'
        }
      };
    }
  },

  /**
   * Pause task
   * @param {string} id - Task ID
   * @param {string} reason - Pause reason
   */
  pauseTask: async (id, reason) => {
    logDebug(`Pausing task: ${id}, reason: ${reason}`);
    try {
      const response = await api.put(`/tasks/${id}/pause`, { reason });
      logDebug(`Task ${id} paused`);
      return response;
    } catch (error) {
      logError(`Failed to pause task ${id}`, error);
      throw error;
    }
  },

  /**
   * Resume task
   * @param {string} id - Task ID
   */
  resumeTask: async (id) => {
    logDebug(`Resuming task: ${id}`);
    try {
      const response = await api.put(`/tasks/${id}/resume`);
      logDebug(`Task ${id} resumed`);
      return response;
    } catch (error) {
      logError(`Failed to resume task ${id}`, error);
      throw error;
    }
  },

  /**
   * Complete task
   * @param {string} id - Task ID
   * @param {string} completionNotes - Completion notes
   * @param {Array} afterImages - After images
   */
  completeTask: async (id, completionNotes = '', afterImages = []) => {
    logDebug(`Completing task: ${id}`);
    try {
      const response = await api.put(`/tasks/${id}/complete`, { completionNotes, afterImages });
      logDebug(`Task ${id} completed`);
      return response;
    } catch (error) {
      logError(`Failed to complete task ${id}`, error);
      throw error;
    }
  },

  /**
   * Verify task
   * @param {string} id - Task ID
   * @param {boolean} approved - Approval status
   * @param {number} rating - Rating (1-5)
   * @param {string} notes - Verification notes
   */
  verifyTask: async (id, approved, rating = null, notes = '') => {
    logDebug(`Verifying task: ${id}, approved: ${approved}`);
    try {
      const response = await api.put(`/tasks/${id}/verify`, { approved, rating, notes });
      logDebug(`Task ${id} verified`);
      return response;
    } catch (error) {
      logError(`Failed to verify task ${id}`, error);
      throw error;
    }
  },

  /**
   * Reject task
   * @param {string} id - Task ID
   * @param {string} reason - Rejection reason
   */
  rejectTask: async (id, reason) => {
    logDebug(`Rejecting task: ${id}, reason: ${reason}`);
    try {
      const response = await api.put(`/tasks/${id}/reject`, { reason });
      logDebug(`Task ${id} rejected`);
      return response;
    } catch (error) {
      logError(`Failed to reject task ${id}`, error);
      throw error;
    }
  },

  /**
   * Get task progress details
   * @param {string} id - Task ID
   */
  getTaskProgress: async (id) => {
    logDebug(`Fetching progress for task: ${id}`);
    try {
      const response = await api.get(`/tasks/${id}/progress`);
      logDebug('Progress fetched successfully');
      return response;
    } catch (error) {
      logError(`Failed to get progress for task ${id}`, error);
      throw error;
    }
  },

  /**
   * Get technician daily progress
   * @param {string} technicianId - Technician ID
   * @param {string} date - Date (YYYY-MM-DD)
   */
  getDailyProgress: async (technicianId, date = null) => {
    const params = date ? { date } : {};
    logDebug(`Fetching daily progress for technician ${technicianId}`, params);
    try {
      const response = await api.get(`/tasks/technician/${technicianId}/daily-progress`, { params });
      logDebug('Daily progress fetched successfully');
      return response;
    } catch (error) {
      logError(`Failed to get daily progress for technician ${technicianId}`, error);
      throw error;
    }
  },

  // ==================== STATISTICS & FILTERS ====================
  
  /**
   * Get overdue tasks
   */
  getOverdueTasks: async () => {
    logDebug('Fetching overdue tasks');
    try {
      const response = await api.get('/tasks/overdue');
      logDebug(`Fetched ${response.data?.data?.length || 0} overdue tasks`);
      return response;
    } catch (error) {
      logError('Failed to fetch overdue tasks', error);
      throw error;
    }
  },

  /**
   * Get task statistics
   */
  getTaskStatistics: async () => {
    logDebug('Fetching task statistics');
    try {
      const response = await api.get('/tasks/statistics');
      logDebug('Statistics fetched successfully:', response.data);
      return response;
    } catch (error) {
      logError('Failed to fetch task statistics', error);
      throw error;
    }
  },

  /**
   * Get tasks by status
   * @param {string} status - Status filter
   */
  getTasksByStatus: async (status) => {
    logDebug(`Fetching tasks by status: ${status}`);
    try {
      const response = await api.get(`/tasks/status/${status}`);
      logDebug(`Fetched ${response.data?.data?.length || 0} tasks with status ${status}`);
      return response;
    } catch (error) {
      logError(`Failed to fetch tasks by status ${status}`, error);
      throw error;
    }
  },

  /**
   * Get tasks by priority
   * @param {string} priority - Priority filter
   */
  getTasksByPriority: async (priority) => {
    logDebug(`Fetching tasks by priority: ${priority}`);
    try {
      const response = await api.get(`/tasks/priority/${priority}`);
      logDebug(`Fetched ${response.data?.data?.length || 0} tasks with priority ${priority}`);
      return response;
    } catch (error) {
      logError(`Failed to fetch tasks by priority ${priority}`, error);
      throw error;
    }
  },

  /**
   * Get tasks by building
   * @param {string} buildingId - Building ID
   */
  getTasksByBuilding: async (buildingId) => {
    logDebug(`Fetching tasks by building: ${buildingId}`);
    try {
      const response = await api.get(`/tasks/building/${buildingId}`);
      logDebug(`Fetched ${response.data?.data?.length || 0} tasks for building ${buildingId}`);
      return response;
    } catch (error) {
      logError(`Failed to fetch tasks by building ${buildingId}`, error);
      throw error;
    }
  },

  /**
   * Get tasks by technician
   * @param {string} technicianId - Technician ID
   */
  getTasksByTechnician: async (technicianId) => {
    logDebug(`Fetching tasks by technician: ${technicianId}`);
    try {
      const response = await api.get(`/tasks/technician/${technicianId}`);
      logDebug(`Fetched ${response.data?.data?.length || 0} tasks for technician ${technicianId}`);
      return response;
    } catch (error) {
      logError(`Failed to fetch tasks by technician ${technicianId}`, error);
      throw error;
    }
  },

  /**
   * Export tasks to CSV
   * @param {Object} params - Query parameters
   */
  exportTasksToCSV: async (params = {}) => {
    logDebug('Exporting tasks to CSV', params);
    try {
      const response = await api.get('/tasks/export/csv', { params, responseType: 'blob' });
      logDebug('CSV export successful');
      return response;
    } catch (error) {
      logError('Failed to export tasks to CSV', error);
      throw error;
    }
  }
};

export default taskApi;