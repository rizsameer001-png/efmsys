// client/src/hooks/useTaskProgress.js
// import { useTaskActions } from './useTaskActions';

// /**
//  * useTaskProgress - Alias for useTaskActions for backward compatibility
//  * This hook provides task progress management functionality
//  */
// export const useTaskProgress = (taskId, onStatusChange) => {
//   return useTaskActions(taskId, onStatusChange);
// };

// export default useTaskProgress;


// client/src/hooks/useTaskProgress.js
import { useState, useCallback } from 'react';
import { taskApi } from '../api/task.api';
import { trackingApi } from '../api/tracking.api';
import { useToast } from './useToast';

export const useTaskProgress = (taskId, onStatusChange) => {
  const [loading, setLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(null);
  const { showToast } = useToast();

  // Accept Task
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
        showToast('Task accepted successfully!', 'success');
        if (onStatusChange) onStatusChange('accepted', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to accept task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onStatusChange]);

  // Start Task with GPS
  const startTaskWithGPS = useCallback(async () => {
    if (!taskId) {
      showToast('Task ID is required', 'error');
      return;
    }
    
    setLoading(true);
    try {
      // Try to get GPS location
      let location = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000
            });
          });
          location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          };
        } catch (gpsError) {
          console.warn('GPS location failed:', gpsError);
        }
      }
      
      const response = await taskApi.startTask(taskId, location);
      if (response.data.success) {
        setCurrentStatus('in_progress');
        showToast('Task started! GPS tracking active.', 'success');
        if (onStatusChange) onStatusChange('in_progress', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to start task';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onStatusChange]);

  // Update Progress
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
        if (onStatusChange) onStatusChange('progress_updated', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update progress';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onStatusChange]);

  // Upload Evidence
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
        if (onStatusChange) onStatusChange('evidence_uploaded', response.data.data);
        return response.data;
      }
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to upload evidence';
      showToast(message, 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [taskId, showToast, onStatusChange]);

  // Complete Task
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
        if (onStatusChange) onStatusChange('completed', response.data.data);
        
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
  }, [taskId, showToast, onStatusChange]);

  return {
    loading,
    currentStatus,
    acceptTask,
    startTaskWithGPS,
    updateProgress,
    uploadEvidence,
    completeTask
  };
};

export default useTaskProgress;