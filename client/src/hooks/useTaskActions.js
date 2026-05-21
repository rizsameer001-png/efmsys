// // client/src/hooks/useTaskActions.js
// import { useState } from 'react';
// import { taskApi } from '../api/task.api';
// import { trackingApi } from '../api/tracking.api';
// import { useToast } from './useToast';

// export const useTaskActions = (taskId, onActionComplete) => {
//   const [loading, setLoading] = useState(false);
//   const { showToast } = useToast();

//   // 🔴 TECHNICIAN ACTIONS
//   const acceptTask = async () => {
//     setLoading(true);
//     try {
//       const response = await taskApi.acceptTask(taskId);
//       if (response.data.success) {
//         showToast('Task accepted successfully!', 'success');
//         if (onActionComplete) onActionComplete('accepted');
//         return response.data;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to accept task', 'error');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const startTask = async (location = null) => {
//     setLoading(true);
//     try {
//       const response = await taskApi.startTask(taskId, location);
//       if (response.data.success) {
//         showToast('Task started!', 'success');
//         if (onActionComplete) onActionComplete('in_progress');
//         return response.data;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to start task', 'error');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const updateProgress = async (percentage) => {
//     setLoading(true);
//     try {
//       const response = await taskApi.updateProgress(taskId, percentage);
//       if (response.data.success) {
//         if (onActionComplete) onActionComplete('progress_updated');
//         return response.data;
//       }
//     } catch (error) {
//       showToast('Failed to update progress', 'error');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const completeTask = async (completionNotes = '', afterImages = []) => {
//     setLoading(true);
//     try {
//       const response = await taskApi.completeTask(taskId, completionNotes, afterImages);
//       if (response.data.success) {
//         showToast('Task completed! Pending verification.', 'success');
//         if (onActionComplete) onActionComplete('completed');
//         await trackingApi.endSession();
//         return response.data;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to complete task', 'error');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 🔴 SUPERVISOR/MANAGER ACTIONS
//   const verifyTask = async (approved, rating = null, notes = '') => {
//     setLoading(true);
//     try {
//       const response = await taskApi.verifyTask(taskId, approved, rating, notes);
//       if (response.data.success) {
//         showToast(approved ? 'Task verified and closed!' : 'Task rejected for rework', 
//                   approved ? 'success' : 'warning');
//         if (onActionComplete) onActionComplete(approved ? 'closed' : 'assigned');
//         return response.data;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to verify task', 'error');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const rejectTask = async (reason) => {
//     setLoading(true);
//     try {
//       const response = await taskApi.rejectTask(taskId, reason);
//       if (response.data.success) {
//         showToast('Task rejected for rework', 'warning');
//         if (onActionComplete) onActionComplete('assigned');
//         return response.data;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to reject task', 'error');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   return {
//     loading,
//     acceptTask,
//     startTask,
//     updateProgress,
//     completeTask,
//     verifyTask,
//     rejectTask
//   };
// };




// client/src/hooks/useTaskActions.js
import { useState, useCallback } from 'react';
import { taskApi } from '../api/task.api';
import { trackingApi } from '../api/tracking.api';
import { useToast } from './useToast';

export const useTaskActions = (taskId, onActionComplete) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const { showToast } = useToast();

  // ==================== TECHNICIAN ACTIONS ====================
  
  /**
   * Accept Task - Technician accepts the assigned task
   */
  const acceptTask = useCallback(async () => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.acceptTask(taskId);
      if (response.data.success) {
        setCurrentStatus('accepted');
        showToast('Task accepted successfully! You can now start working.', 'success');
        if (onActionComplete) onActionComplete('accepted', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to accept task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Start Task - Technician starts working on the task with GPS verification
   * @param {Object} location - GPS location { lat, lng, accuracy }
   */
  const startTask = useCallback(async (location = null) => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.startTask(taskId, location);
      if (response.data.success) {
        setCurrentStatus('in_progress');
        showToast('Task started! GPS tracking active.', 'success');
        if (onActionComplete) onActionComplete('in_progress', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to start task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Update Progress - Update task progress percentage
   * @param {number} percentage - Progress percentage (0-100)
   */
  const updateProgress = useCallback(async (percentage) => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    if (percentage < 0 || percentage > 100) {
      showToast('Progress must be between 0 and 100', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.updateProgress(taskId, percentage);
      if (response.data.success) {
        showToast(`Progress updated to ${percentage}%`, 'success');
        if (onActionComplete) onActionComplete('progress_updated', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update progress';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Update Checklist - Update checklist item status
   * @param {string} itemId - Checklist item ID
   * @param {boolean} completed - Completion status
   * @param {string} notes - Optional notes
   * @param {string} imageAfter - After image URL
   */
  const updateChecklist = useCallback(async (itemId, completed, notes = null, imageAfter = null) => {
    if (!taskId || !itemId) {
      showToast('Task ID and Item ID are required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.updateChecklist(taskId, itemId, completed, imageAfter, notes);
      if (response.data.success) {
        showToast(`Checklist item ${completed ? 'completed' : 'updated'}`, 'success');
        if (onActionComplete) onActionComplete('checklist_updated', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update checklist';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Upload Evidence - Upload work evidence (images, videos, documents)
   * @param {Array} images - Array of image URLs or objects
   * @param {Array} videos - Array of video URLs or objects
   * @param {Array} documents - Array of document objects
   */
  const uploadEvidence = useCallback(async (images = [], videos = [], documents = []) => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.uploadEvidence(taskId, images, videos, documents);
      if (response.data.success) {
        showToast('Evidence uploaded successfully!', 'success');
        if (onActionComplete) onActionComplete('evidence_uploaded', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to upload evidence';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Pause Task - Pause the current task (waiting for parts, break, etc.)
   * @param {string} reason - Reason for pausing
   */
  const pauseTask = useCallback(async (reason) => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.pauseTask(taskId, reason);
      if (response.data.success) {
        setCurrentStatus('waiting_parts');
        showToast(`Task paused: ${reason || 'Waiting for parts'}`, 'info');
        if (onActionComplete) onActionComplete('waiting_parts', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to pause task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Resume Task - Resume a paused task
   */
  const resumeTask = useCallback(async () => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.resumeTask(taskId);
      if (response.data.success) {
        setCurrentStatus('in_progress');
        showToast('Task resumed!', 'success');
        if (onActionComplete) onActionComplete('in_progress', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to resume task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Complete Task - Mark task as completed with evidence
   * @param {string} completionNotes - Notes about completion
   * @param {Array} afterImages - After work images
   */
  const completeTask = useCallback(async (completionNotes = '', afterImages = []) => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.completeTask(taskId, completionNotes, afterImages);
      if (response.data.success) {
        setCurrentStatus('completed');
        showToast('Task completed! Pending supervisor verification.', 'success');
        if (onActionComplete) onActionComplete('completed', response.data.data);
        
        // End tracking session
        try {
          await trackingApi.endSession();
        } catch (trackingError) {
          console.error('Error ending tracking session:', trackingError);
        }
        
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to complete task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  // ==================== SUPERVISOR/MANAGER ACTIONS ====================
  
  /**
   * Verify Task - Supervisor/Manager verifies and closes the task
   * @param {boolean} approved - Whether the task is approved
   * @param {number} rating - Rating (1-5)
   * @param {string} notes - Verification notes
   */
  const verifyTask = useCallback(async (approved, rating = null, notes = '') => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.verifyTask(taskId, approved, rating, notes);
      if (response.data.success) {
        setCurrentStatus(approved ? 'closed' : 'assigned');
        const message = approved ? 'Task verified and closed!' : 'Task rejected for rework';
        showToast(message, approved ? 'success' : 'warning');
        if (onActionComplete) onActionComplete(approved ? 'closed' : 'assigned', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to verify task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Reject Task - Supervisor/Manager rejects task for rework
   * @param {string} reason - Rejection reason
   */
  const rejectTask = useCallback(async (reason) => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      const response = await taskApi.rejectTask(taskId, reason);
      if (response.data.success) {
        setCurrentStatus('assigned');
        showToast('Task rejected for rework', 'warning');
        if (onActionComplete) onActionComplete('assigned', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to reject task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onActionComplete]);

  /**
   * Get current location using browser geolocation
   * @returns {Promise<Object|null>} Location object or null
   */
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null);
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  }, []);

  /**
   * Start task with automatic GPS location
   */
  const startTaskWithGPS = useCallback(async () => {
    const location = await getCurrentLocation();
    return startTask(location);
  }, [getCurrentLocation, startTask]);

  /**
   * Reset loading and status
   */
  const reset = useCallback(() => {
    setLoading(false);
    setCurrentStatus(null);
  }, []);

  return {
    // State
    loading,
    currentStatus,
    
    // Technician Actions
    acceptTask,
    startTask,
    startTaskWithGPS,
    updateProgress,
    updateChecklist,
    uploadEvidence,
    pauseTask,
    resumeTask,
    completeTask,
    
    // Supervisor/Manager Actions
    verifyTask,
    rejectTask,
    
    // Utilities
    getCurrentLocation,
    reset
  };
};

export default useTaskActions;