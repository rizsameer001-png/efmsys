// // client/src/hooks/useAuth.js
// import { useContext } from 'react';
// import { AuthContext } from '../context/AuthContext';

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };






// client/src/hooks/useAuth.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  const { user, loading, isAuthenticated, login, register, logout, updateUser } = context;
  
  /**
   * Get user ID safely (handles both id and _id properties)
   * @returns {string|null} User ID or null if not found
   */
  const getUserId = () => {
    return user?.id || user?._id || null;
  };
  
  /**
   * Get user full name
   * @returns {string} User full name
   */
  const getUserName = () => {
    if (!user) return '';
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'User';
  };
  
  /**
   * Check if user has a specific role
   * @param {string|string[]} roles - Role or array of roles to check
   * @returns {boolean} True if user has any of the specified roles
   */
  const hasRole = (roles) => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  };
  
  /**
   * Check if user is assigned to a specific task
   * @param {Object} task - Task object with assignment
   * @returns {boolean} True if user is assigned to the task
   */
  const isAssignedToTask = (task) => {
    const userId = getUserId();
    if (!userId || !task) return false;
    
    const assignedTo = task.assignment?.assignedTo;
    if (!assignedTo) return false;
    
    // Handle both string ID and object with _id
    const assignedToId = typeof assignedTo === 'object' 
      ? assignedTo._id || assignedTo.id 
      : assignedTo;
    
    return assignedToId?.toString() === userId?.toString();
  };
  
  /**
   * Check if user can update a task
   * @param {Object} task - Task object
   * @returns {boolean} True if user can update the task
   */
  const canUpdateTask = (task) => {
    if (!user || !task) return false;
    
    // Admin and Super Admin can update any task
    if (hasRole(['super_admin', 'admin'])) return true;
    
    // Technician can update only their assigned tasks
    if (hasRole('technician') && isAssignedToTask(task)) return true;
    
    // Supervisor/Manager can verify completed tasks
    if (hasRole(['supervisor', 'manager']) && 
        (task.status === 'completed' || task.status === 'pending_review')) {
      return true;
    }
    
    return false;
  };
  
  /**
   * Get available status transitions for a task
   * @param {Object} task - Task object
   * @returns {string[]} Array of available status options
   */
  const getAvailableStatuses = (task) => {
    if (!task) return [];
    
    // Admin can change to any status
    if (hasRole(['super_admin', 'admin'])) {
      const statuses = ['pending', 'assigned', 'accepted', 'in_progress', 'completed', 'verified'];
      return statuses.filter(s => s !== task.status && s !== 'closed');
    }
    
    // Technician transitions
    if (hasRole('technician') && isAssignedToTask(task)) {
      const transitions = {
        'assigned': ['accepted'],
        'accepted': ['in_progress'],
        'in_progress': ['completed']
      };
      return transitions[task.status] || [];
    }
    
    // Supervisor/Manager transitions
    if (hasRole(['supervisor', 'manager']) && 
        (task.status === 'completed' || task.status === 'pending_review')) {
      return ['verified', 'rejected'];
    }
    
    return [];
  };
  
  return {
    // Original context values
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    
    // Helper methods
    getUserId,
    getUserName,
    hasRole,
    isAssignedToTask,
    canUpdateTask,
    getAvailableStatuses
  };
};