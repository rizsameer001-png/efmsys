// // client/src/hooks/useTaskSocket.js
// import { useEffect, useState, useCallback } from 'react';
// import { io } from 'socket.io-client';
// import { useAuth } from './useAuth';
// import { useToast } from './useToast';

// const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// export const useTaskSocket = () => {
//   const { user, isAuthenticated } = useAuth();
//   const { showToast } = useToast();
//   const [socket, setSocket] = useState(null);
//   const [taskUpdates, setTaskUpdates] = useState({});
//   const [isConnected, setIsConnected] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated || !user) return;

//     // Initialize socket connection
//     const newSocket = io(SOCKET_URL, {
//       auth: { token: localStorage.getItem('accessToken') },
//       transports: ['websocket'],
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000
//     });

//     setSocket(newSocket);

//     // Connection events
//     newSocket.on('connect', () => {
//       console.log('🔌 Task socket connected');
//       setIsConnected(true);
      
//       // Join user-specific room
//       newSocket.emit('join', { userId: user._id, role: user.role });
//     });

//     newSocket.on('disconnect', () => {
//       console.log('🔌 Task socket disconnected');
//       setIsConnected(false);
//     });

//     newSocket.on('connect_error', (error) => {
//       console.error('Socket connection error:', error);
//       setIsConnected(false);
//     });

//     // Task event listeners
//     newSocket.on('task:assigned', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       showToast(`New task assigned: ${data.title}`, 'info');
//     });

//     newSocket.on('task:updated', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//     });

//     newSocket.on('task:started', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       if (user.role === 'manager' || user.role === 'supervisor') {
//         showToast(`Task ${data.taskId} started by ${data.technicianName}`, 'info');
//       }
//     });

//     newSocket.on('task:progress', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//     });

//     newSocket.on('task:completed', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       showToast(`Task ${data.taskId} completed! Pending verification.`, 'success');
//     });

//     newSocket.on('task:verified', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       showToast(`Task ${data.taskId} verified and closed.`, 'success');
//     });

//     newSocket.on('task:rejected', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       showToast(`Task ${data.taskId} needs rework: ${data.reason}`, 'warning');
//     });

//     newSocket.on('sla:warning', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       showToast(`⚠️ SLA Warning: Task ${data.taskId} is due in ${data.timeRemaining}`, 'warning');
//     });

//     newSocket.on('sla:breached', (data) => {
//       setTaskUpdates(prev => ({ ...prev, [data.taskId]: data }));
//       showToast(`🚨 SLA Breached: Task ${data.taskId} is overdue!`, 'error');
//     });

//     // Cleanup
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [isAuthenticated, user]);

//   const emitTaskUpdate = useCallback((taskId, updateData) => {
//     if (socket && isConnected) {
//       socket.emit('task:update', { taskId, ...updateData });
//     }
//   }, [socket, isConnected]);

//   const emitLocationUpdate = useCallback((taskId, location) => {
//     if (socket && isConnected) {
//       socket.emit('location:update', { taskId, location, userId: user?._id });
//     }
//   }, [socket, isConnected, user]);

//   const clearTaskUpdate = useCallback((taskId) => {
//     setTaskUpdates(prev => {
//       const newUpdates = { ...prev };
//       delete newUpdates[taskId];
//       return newUpdates;
//     });
//   }, []);

//   return {
//     socket,
//     isConnected,
//     taskUpdates,
//     emitTaskUpdate,
//     emitLocationUpdate,
//     clearTaskUpdate
//   };
// };




// client/src/hooks/useTaskSocket.js
/**
 * TASK WEBSOCKET HOOK
 * 
 * PURPOSE:
 * - Provides real-time communication between frontend and backend for task management
 * - Handles live updates for task assignments, progress, completion, and SLA monitoring
 * - Manages WebSocket connection lifecycle with authentication
 * - Enables real-time location tracking for technicians
 * 
 * HOW IT WORKS:
 * 1. Connects to WebSocket server when user is authenticated
 * 2. Uses JWT token for authentication
 * 3. Joins user-specific rooms based on role
 * 4. Listens for server-sent events and updates UI in real-time
 * 5. Emits client events for task updates and location sharing
 * 
 * COMMUNICATION FLOW:
 * 
 * Server -> Client Events (Receiving):
 * ┌─────────────────┬────────────────────────────────────────────────────────────┐
 * │ Event Name      │ Description                                               │
 * ├─────────────────┼────────────────────────────────────────────────────────────┤
 * │ connect         │ Socket connection established                             │
 * │ disconnect      │ Socket connection lost                                    │
 * │ connect_error   │ Connection failed (network/auth issues)                   │
 * │ task:assigned   │ New task assigned to current user                         │
 * │ task:updated    │ Task details updated (priority, deadline, etc.)           │
 * │ task:started    │ Technician started working on task                        │
 * │ task:progress   │ Task progress percentage updated                          │
 * │ task:completed  │ Task marked as completed (pending verification)           │
 * │ task:verified   │ Task verified and closed by supervisor/admin              │
 * │ task:rejected   │ Task rejected, needs rework                               │
 * │ task:reassigned │ Task reassigned to different technician                   │
 * │ sla:warning     │ Task approaching SLA deadline (warning)                   │
 * │ sla:breached    │ Task missed SLA deadline                                  │
 * │ location:update │ Technician location updated (real-time tracking)          │
 * │ technician:online│ Technician came online                                   │
 * │ technician:offline│ Technician went offline                                 │
 * └─────────────────┴────────────────────────────────────────────────────────────┘
 * 
 * Client -> Server Events (Sending):
 * ┌─────────────────┬────────────────────────────────────────────────────────────┐
 * │ Event Name      │ Description                                               │
 * ├─────────────────┼────────────────────────────────────────────────────────────┤
 * │ join            │ Join user-specific room                                   │
 * │ task:update     │ Send task status/progress update                          │
 * │ location:update │ Send technician location update                           │
 * │ task:complete   │ Request task completion                                   │
 * │ task:verify     │ Verify completed task                                     │
 * │ task:reject     │ Reject task with reason                                   │
 * └─────────────────┴────────────────────────────────────────────────────────────┘
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

// WebSocket server URL - configurable via environment variables
const SOCKET_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// Reconnection configuration
const RECONNECTION_CONFIG = {
  attempts: 5,           // Maximum reconnection attempts
  delay: 1000,          // Initial delay between attempts (ms)
  maxDelay: 5000        // Maximum delay between attempts (ms)
};

export const useTaskSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  
  // Socket instance reference
  const [socket, setSocket] = useState(null);
  
  // Store real-time task updates by task ID
  const [taskUpdates, setTaskUpdates] = useState({});
  
  // Connection status indicator
  const [isConnected, setIsConnected] = useState(false);
  
  // Reconnection attempt counter
  const reconnectAttemptsRef = useRef(0);

  /**
   * Initialize WebSocket connection when user is authenticated
   * Cleanup and disconnect when user logs out
   */
  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !user) {
      // Clean up existing socket if user logs out
      if (socket) {
        console.log('🔌 User logged out, disconnecting socket...');
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Get authentication token
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('❌ No authentication token found for WebSocket connection');
      return;
    }

    console.log(`🔌 Initializing WebSocket connection to ${SOCKET_URL}...`);

    // Create new socket connection with authentication
    const newSocket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],     // Use WebSocket only (more efficient than polling)
      reconnection: true,             // Enable automatic reconnection
      reconnectionAttempts: RECONNECTION_CONFIG.attempts,
      reconnectionDelay: RECONNECTION_CONFIG.delay,
      reconnectionDelayMax: RECONNECTION_CONFIG.maxDelay,
      timeout: 10000                  // Connection timeout (ms)
    });

    setSocket(newSocket);

    // ========== CONNECTION EVENT HANDLERS ==========
    
    /**
     * EVENT: connect
     * TRIGGERED: When WebSocket connection successfully established
     * FUNCTION: Sets connection status, joins user room, clears reconnection counter
     */
    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected successfully');
      setIsConnected(true);
      reconnectAttemptsRef.current = 0;
      
      // Join user-specific room for targeted notifications
      // This ensures user only receives events intended for them
      newSocket.emit('join', { 
        userId: user._id, 
        role: user.role,
        email: user.email
      });
      
      console.log(`📡 Joined room for user: ${user._id} (${user.role})`);
    });

    /**
     * EVENT: disconnect
     * TRIGGERED: When WebSocket connection lost (network issue, server restart)
     * FUNCTION: Updates connection status, notifies user (if not intentional)
     */
    newSocket.on('disconnect', (reason) => {
      console.log(`⚠️ WebSocket disconnected: ${reason}`);
      setIsConnected(false);
      
      // Show toast only for unexpected disconnections
      if (reason !== 'io client disconnect') {
        showToast('Real-time updates disconnected. Reconnecting...', 'warning');
      }
    });

    /**
     * EVENT: connect_error
     * TRIGGERED: When connection attempt fails (auth error, server down)
     * FUNCTION: Logs error, attempts reconnection
     */
    newSocket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error.message);
      setIsConnected(false);
      
      // Attempt to reconnect with exponential backoff
      if (reconnectAttemptsRef.current < RECONNECTION_CONFIG.attempts) {
        reconnectAttemptsRef.current++;
        const delay = Math.min(
          RECONNECTION_CONFIG.delay * Math.pow(2, reconnectAttemptsRef.current - 1),
          RECONNECTION_CONFIG.maxDelay
        );
        console.log(`🔄 Reconnection attempt ${reconnectAttemptsRef.current} in ${delay}ms...`);
        setTimeout(() => {
          if (newSocket) newSocket.connect();
        }, delay);
      } else {
        showToast('Unable to connect to real-time server. Please refresh the page.', 'error');
      }
    });

    // ========== TASK EVENT HANDLERS ==========
    
    /**
     * EVENT: task:assigned
     * TRIGGERED: When a new task is assigned to the current user
     * SENDER: Server (after task creation/assignment)
     * RECIPIENT: Assigned technician
     * PURPOSE: Notify technician of new task assignment in real-time
     */
    newSocket.on('task:assigned', (data) => {
      console.log('📋 New task assigned:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'assigned', timestamp: new Date() } }));
      showToast(`📋 New task assigned: ${data.title}`, 'info');
    });

    /**
     * EVENT: task:updated
     * TRIGGERED: When task details are updated (priority, deadline, description)
     * SENDER: Manager/Admin
     * RECIPIENT: All users assigned to the task
     * PURPOSE: Keep all stakeholders informed of task changes
     */
    newSocket.on('task:updated', (data) => {
      console.log('✏️ Task updated:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'updated', timestamp: new Date() } }));
    });

    /**
     * EVENT: task:started
     * TRIGGERED: When technician starts working on a task
     * SENDER: Technician (frontend)
     * RECIPIENT: Manager, Supervisor, Admin
     * PURPOSE: Alert management that work has begun on a task
     */
    newSocket.on('task:started', (data) => {
      console.log('▶️ Task started:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'started', timestamp: new Date() } }));
      
      // Show toast only for managers/supervisors (not for the technician who started it)
      if (user.role === 'manager' || user.role === 'supervisor' || user.role === 'admin') {
        showToast(`▶️ Task ${data.taskId} started by ${data.technicianName || data.technician}`, 'info');
      }
    });

    /**
     * EVENT: task:progress
     * TRIGGERED: When task progress percentage is updated
     * SENDER: Technician (via update progress button)
     * RECIPIENT: Manager, Supervisor, Admin, Task Creator
     * PURPOSE: Track task completion progress in real-time
     */
    newSocket.on('task:progress', (data) => {
      console.log('📊 Task progress updated:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'progress', timestamp: new Date() } }));
    });

    /**
     * EVENT: task:completed
     * TRIGGERED: When technician marks task as complete
     * SENDER: Technician (via complete task button)
     * RECIPIENT: Manager, Supervisor, Admin
     * PURPOSE: Notify management that task is ready for verification
     */
    newSocket.on('task:completed', (data) => {
      console.log('✅ Task completed:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'completed', timestamp: new Date() } }));
      showToast(`✅ Task ${data.taskId} completed! Pending verification.`, 'success');
    });

    /**
     * EVENT: task:verified
     * TRIGGERED: When supervisor/admin verifies and closes a completed task
     * SENDER: Supervisor/Admin
     * RECIPIENT: Technician who completed the task
     * PURPOSE: Notify technician that their work has been approved
     */
    newSocket.on('task:verified', (data) => {
      console.log('✔️ Task verified:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'verified', timestamp: new Date() } }));
      showToast(`✔️ Task ${data.taskId} verified and closed. Good work!`, 'success');
    });

    /**
     * EVENT: task:rejected
     * TRIGGERED: When supervisor/admin rejects a completed task
     * SENDER: Supervisor/Admin
     * RECIPIENT: Technician who completed the task
     * PURPOSE: Notify technician that task needs rework with specific reason
     */
    newSocket.on('task:rejected', (data) => {
      console.log('❌ Task rejected:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'rejected', timestamp: new Date() } }));
      showToast(`❌ Task ${data.taskId} needs rework: ${data.reason || 'Quality issues'}`, 'warning');
    });

    /**
     * EVENT: task:reassigned
     * TRIGGERED: When task is reassigned to a different technician
     * SENDER: Manager/Admin
     * RECIPIENT: Previous and new technician
     * PURPOSE: Notify both technicians of reassignment
     */
    newSocket.on('task:reassigned', (data) => {
      console.log('🔄 Task reassigned:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'reassigned', timestamp: new Date() } }));
      if (data.newTechnicianId === user._id) {
        showToast(`🔄 Task ${data.taskId} has been reassigned to you`, 'info');
      }
    });

    // ========== SLA MONITORING EVENT HANDLERS ==========
    
    /**
     * EVENT: sla:warning
     * TRIGGERED: When task is approaching SLA deadline (e.g., 2 hours remaining)
     * SENDER: Server (background SLA monitoring service)
     * RECIPIENT: All stakeholders (technician, manager, supervisor)
     * PURPOSE: Alert team of impending SLA breach to take preventive action
     */
    newSocket.on('sla:warning', (data) => {
      console.log('⚠️ SLA Warning:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'sla_warning', timestamp: new Date() } }));
      showToast(`⚠️ SLA Warning: Task ${data.taskId} is due in ${data.timeRemaining || 'less than 2 hours'}`, 'warning');
    });

    /**
     * EVENT: sla:breached
     * TRIGGERED: When task misses SLA deadline
     * SENDER: Server (background SLA monitoring service)
     * RECIPIENT: All stakeholders (technician, manager, supervisor, admin)
     * PURPOSE: Alert management of SLA violation for escalation
     */
    newSocket.on('sla:breached', (data) => {
      console.log('🚨 SLA Breached:', data);
      setTaskUpdates(prev => ({ ...prev, [data.taskId]: { ...data, type: 'sla_breached', timestamp: new Date() } }));
      showToast(`🚨 SLA Breached: Task ${data.taskId} is overdue!`, 'error');
    });

    // ========== LOCATION TRACKING EVENT HANDLERS ==========
    
    /**
     * EVENT: location:update
     * TRIGGERED: When technician's GPS location changes
     * SENDER: Technician (via location tracking service)
     * RECIPIENT: Manager, Supervisor, Admin (for live tracking)
     * PURPOSE: Enable real-time technician location tracking on map
     */
    newSocket.on('location:update', (data) => {
      console.log('📍 Location update received:', data);
      setTaskUpdates(prev => ({ 
        ...prev, 
        [`location_${data.userId}`]: { 
          ...data, 
          type: 'location', 
          timestamp: new Date() 
        } 
      }));
    });

    /**
     * EVENT: technician:online
     * TRIGGERED: When technician comes online and starts location sharing
     * SENDER: Technician (frontend)
     * RECIPIENT: Manager, Supervisor, Admin
     * PURPOSE: Notify management of technician availability
     */
    newSocket.on('technician:online', (data) => {
      console.log('🟢 Technician online:', data);
      if (user.role === 'manager' || user.role === 'supervisor' || user.role === 'admin') {
        showToast(`🟢 ${data.technicianName || 'Technician'} is now online`, 'success');
      }
    });

    /**
     * EVENT: technician:offline
     * TRIGGERED: When technician stops location sharing or disconnects
     * SENDER: Technician (frontend) or server (heartbeat timeout)
     * RECIPIENT: Manager, Supervisor, Admin
     * PURPOSE: Update status on live tracking map
     */
    newSocket.on('technician:offline', (data) => {
      console.log('🔴 Technician offline:', data);
      if (user.role === 'manager' || user.role === 'supervisor' || user.role === 'admin') {
        showToast(`🔴 ${data.technicianName || 'Technician'} went offline`, 'warning');
      }
    });

    // ========== HEARTBEAT AND PING/PONG ==========
    
    /**
     * EVENT: ping/pong (automatic)
     * TRIGGERED: Automatically by socket.io library
     * PURPOSE: Keep connection alive and detect disconnections
     * Server sends ping, client responds with pong
     */
    newSocket.on('pong', (latency) => {
      // Console log only in development mode
      if (import.meta.env.DEV) {
        console.log(`💓 WebSocket latency: ${latency}ms`);
      }
    });

    // ========== CLEANUP ==========
    // Disconnect socket when component unmounts or user logs out
    return () => {
      console.log('🔌 Cleaning up WebSocket connection...');
      
      // Remove all event listeners to prevent memory leaks
      newSocket.off('connect');
      newSocket.off('disconnect');
      newSocket.off('connect_error');
      newSocket.off('task:assigned');
      newSocket.off('task:updated');
      newSocket.off('task:started');
      newSocket.off('task:progress');
      newSocket.off('task:completed');
      newSocket.off('task:verified');
      newSocket.off('task:rejected');
      newSocket.off('task:reassigned');
      newSocket.off('sla:warning');
      newSocket.off('sla:breached');
      newSocket.off('location:update');
      newSocket.off('technician:online');
      newSocket.off('technician:offline');
      newSocket.off('pong');
      
      // Disconnect the socket
      newSocket.disconnect();
    };
  }, [isAuthenticated, user, showToast]); // Re-initialize when auth state changes

  // ========== CLIENT EMIT FUNCTIONS ==========
  
  /**
   * PURPOSE: Send task status/progress update to server
   * FUNCTION: Emits 'task:update' event to notify all stakeholders
   * @param {string} taskId - ID of the task being updated
   * @param {Object} updateData - Task update data (status, progress, etc.)
   */
  const emitTaskUpdate = useCallback((taskId, updateData) => {
    if (socket && isConnected) {
      socket.emit('task:update', { 
        taskId, 
        ...updateData, 
        userId: user?._id,
        timestamp: new Date().toISOString()
      });
      console.log(`📤 Task update emitted for ${taskId}:`, updateData);
    } else {
      console.warn('⚠️ Cannot emit task update - socket not connected');
    }
  }, [socket, isConnected, user]);

  /**
   * PURPOSE: Send technician location update to server
   * FUNCTION: Emits 'location:update' event for real-time tracking
   * @param {string} taskId - Current task ID (can be null)
   * @param {Object} location - GPS coordinates {lat, lng, accuracy, speed}
   */
  const emitLocationUpdate = useCallback((taskId, location) => {
    if (socket && isConnected) {
      socket.emit('location:update', { 
        taskId, 
        location, 
        userId: user?._id,
        timestamp: new Date().toISOString()
      });
      // Don't log every location update to avoid console spam
    } else {
      console.warn('⚠️ Cannot emit location update - socket not connected');
    }
  }, [socket, isConnected, user]);

  /**
   * PURPOSE: Request task completion
   * FUNCTION: Emits 'task:complete' event for verification
   * @param {string} taskId - ID of task being completed
   * @param {Array} evidence - Evidence URLs or files
   */
  const emitTaskComplete = useCallback((taskId, evidence = []) => {
    if (socket && isConnected) {
      socket.emit('task:complete', { 
        taskId, 
        evidence,
        userId: user?._id,
        completedAt: new Date().toISOString()
      });
      console.log(`✅ Task completion requested for ${taskId}`);
    }
  }, [socket, isConnected, user]);

  /**
   * PURPOSE: Verify completed task (Supervisor/Admin only)
   * FUNCTION: Emits 'task:verify' event to close task
   * @param {string} taskId - ID of task to verify
   * @param {string} notes - Verification notes (optional)
   */
  const emitTaskVerify = useCallback((taskId, notes = '') => {
    if (socket && isConnected) {
      socket.emit('task:verify', { 
        taskId, 
        notes,
        verifiedBy: user?._id,
        verifiedAt: new Date().toISOString()
      });
      console.log(`✔️ Task verification emitted for ${taskId}`);
    }
  }, [socket, isConnected, user]);

  /**
   * PURPOSE: Reject completed task (Supervisor/Admin only)
   * FUNCTION: Emits 'task:reject' event to send task back for rework
   * @param {string} taskId - ID of task to reject
   * @param {string} reason - Reason for rejection
   */
  const emitTaskReject = useCallback((taskId, reason) => {
    if (socket && isConnected) {
      socket.emit('task:reject', { 
        taskId, 
        reason,
        rejectedBy: user?._id,
        rejectedAt: new Date().toISOString()
      });
      console.log(`❌ Task rejection emitted for ${taskId}: ${reason}`);
    }
  }, [socket, isConnected, user]);

  /**
   * PURPOSE: Clear task update from local state
   * FUNCTION: Removes specific task from updates object (after user views it)
   * @param {string} taskId - ID of task to clear from updates
   */
  const clearTaskUpdate = useCallback((taskId) => {
    setTaskUpdates(prev => {
      const newUpdates = { ...prev };
      delete newUpdates[taskId];
      return newUpdates;
    });
  }, []);

  /**
   * PURPOSE: Clear all task updates
   * FUNCTION: Resets task updates state (after user marks all as read)
   */
  const clearAllTaskUpdates = useCallback(() => {
    setTaskUpdates({});
    console.log('📋 All task updates cleared');
  }, []);

  /**
   * PURPOSE: Get unread task updates count
   * FUNCTION: Returns number of unread task updates
   * @returns {number} Count of pending updates
   */
  const getUnreadCount = useCallback(() => {
    return Object.keys(taskUpdates).length;
  }, [taskUpdates]);

  return {
    // Socket instance and connection status
    socket,                    // Socket.io instance for advanced usage
    isConnected,              // Boolean indicating if WebSocket is connected
    
    // Task updates data
    taskUpdates,              // Object containing all recent task updates
    getUnreadCount,          // Function to get count of unread updates
    
    // Emit functions (client -> server)
    emitTaskUpdate,          // Send task status/progress update
    emitLocationUpdate,      // Send technician location update
    emitTaskComplete,        // Request task completion
    emitTaskVerify,          // Verify completed task (Supervisor/Admin)
    emitTaskReject,          // Reject completed task (Supervisor/Admin)
    
    // Utility functions
    clearTaskUpdate,         // Clear specific task update
    clearAllTaskUpdates      // Clear all task updates
  };
};








