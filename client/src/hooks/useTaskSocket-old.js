/**
 * TASK SOCKET HOOK
 * Real-time task updates via WebSocket
 */

import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

export const useTaskSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [socket, setSocket] = useState(null);
  const [taskUpdates, setTaskUpdates] = useState({});
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    // Initialize socket connection
    const newSocket = io(SOCKET_URL, {
      auth: { token: localStorage.getItem('accessToken') },
      transports: ['websocket']
    });

    setSocket(newSocket);

    // Connection events
    newSocket.on('connect', () => {
      console.log('🔌 Task socket connected');
      setIsConnected(true);
      
      // Join user-specific room
      newSocket.emit('join', { userId: user._id, role: user.role });
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Task socket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // ==================== TASK EVENT LISTENERS ====================
    
    // New task assigned
    newSocket.on('task:assigned', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      showToast(`New task assigned: ${data.title}`, 'info');
    });

    // Task updated
    newSocket.on('task:updated', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
    });

    // Task started
    newSocket.on('task:started', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      if (user.role === 'manager' || user.role === 'supervisor') {
        showToast(`Task ${data.taskId} started by ${data.technicianName}`, 'info');
      }
    });

    // Task progress
    newSocket.on('task:progress', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
    });

    // Task completed
    newSocket.on('task:completed', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      showToast(`Task ${data.taskId} completed! Pending verification.`, 'success');
    });

    // Task verified
    newSocket.on('task:verified', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      showToast(`Task ${data.taskId} verified and closed.`, 'success');
    });

    // Task rejected
    newSocket.on('task:rejected', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      showToast(`Task ${data.taskId} needs rework: ${data.reason}`, 'warning');
    });

    // SLA breach warning
    newSocket.on('sla:warning', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      showToast(`⚠️ SLA Warning: Task ${data.taskId} is due in ${data.timeRemaining}`, 'warning');
    });

    // SLA breached
    newSocket.on('sla:breached', (data) => {
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
      showToast(`🚨 SLA Breached: Task ${data.taskId} is overdue!`, 'error');
    });

    // Cleanup
    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, user]);

  /**
   * Emit task update
   */
  const emitTaskUpdate = useCallback((taskId, updateData) => {
    if (socket && isConnected) {
      socket.emit('task:update', { taskId, ...updateData });
    }
  }, [socket, isConnected]);

  /**
   * Emit location update
   */
  const emitLocationUpdate = useCallback((taskId, location) => {
    if (socket && isConnected) {
      socket.emit('location:update', { taskId, location, userId: user?._id });
    }
  }, [socket, isConnected, user]);

  /**
   * Clear specific task update
   */
  const clearTaskUpdate = useCallback((taskId) => {
    setTaskUpdates(prev => {
      const newUpdates = { ...prev };
      delete newUpdates[taskId];
      return newUpdates;
    });
  }, []);

  return {
    socket,
    isConnected,
    taskUpdates,
    emitTaskUpdate,
    emitLocationUpdate,
    clearTaskUpdate
  };
};