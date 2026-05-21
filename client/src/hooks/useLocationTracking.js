// /**
//  * LOCATION TRACKING HOOK
//  * Manages GPS location tracking for technicians
//  */

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { trackingApi } from '../api/tracking.api';
// import { useAuth } from './useAuth';
// import { useToast } from './useToast';

// export const useLocationTracking = (taskId = null) => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [isTracking, setIsTracking] = useState(false);
//   const [isWithinGeofence, setIsWithinGeofence] = useState(false);
//   const [geofenceStatus, setGeofenceStatus] = useState(null);
//   const [error, setError] = useState(null);
//   const watchIdRef = useRef(null);
//   const updateIntervalRef = useRef(null);

//   /**
//    * Get current GPS position
//    */
//   const getCurrentPosition = useCallback(() => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }

//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const location = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//             accuracy: position.coords.accuracy,
//             speed: position.coords.speed,
//             heading: position.coords.heading,
//             timestamp: new Date().toISOString()
//           };
//           resolve(location);
//         },
//         (error) => {
//           reject(error);
//         },
//         {
//           enableHighAccuracy: true,
//           timeout: 10000,
//           maximumAge: 0
//         }
//       );
//     });
//   }, []);

//   /**
//    * Start watching position
//    */
//   const startTracking = useCallback(async () => {
//     if (!navigator.geolocation) {
//       setError('Geolocation not supported');
//       return;
//     }

//     setIsTracking(true);
//     setError(null);

//     // Watch position continuously
//     watchIdRef.current = navigator.geolocation.watchPosition(
//       async (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           speed: position.coords.speed,
//           heading: position.coords.heading,
//           timestamp: new Date().toISOString()
//         };
        
//         setCurrentLocation(location);
        
//         // Send location to server periodically
//         if (updateIntervalRef.current) return;
        
//         updateIntervalRef.current = setInterval(async () => {
//           if (location && user?.role === 'technician') {
//             try {
//               await trackingApi.updateLocation({
//                 ...location,
//                 taskId,
//                 technicianId: user._id
//               });
//             } catch (error) {
//               console.error('Failed to update location:', error);
//             }
//           }
//         }, 30000); // Update every 30 seconds
//       },
//       (error) => {
//         console.error('Geolocation error:', error);
//         setError(error.message);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0
//       }
//     );
//   }, [taskId, user]);

//   /**
//    * Stop tracking
//    */
//   const stopTracking = useCallback(() => {
//     if (watchIdRef.current) {
//       navigator.geolocation.clearWatch(watchIdRef.current);
//       watchIdRef.current = null;
//     }
//     if (updateIntervalRef.current) {
//       clearInterval(updateIntervalRef.current);
//       updateIntervalRef.current = null;
//     }
//     setIsTracking(false);
//   }, []);

//   /**
//    * Check if within geofence
//    */
//   const checkGeofence = useCallback(async (location, buildingId) => {
//     try {
//       const response = await trackingApi.checkGeofence(location, buildingId);
//       setIsWithinGeofence(response.data.isWithin);
//       setGeofenceStatus(response.data);
//       return response.data;
//     } catch (error) {
//       console.error('Geofence check failed:', error);
//       return null;
//     }
//   }, []);

//   /**
//    * Get route history
//    */
//   const getRouteHistory = useCallback(async (technicianId, startDate, endDate) => {
//     try {
//       const response = await trackingApi.getRouteHistory(technicianId, startDate, endDate);
//       return response.data.data;
//     } catch (error) {
//       console.error('Failed to get route history:', error);
//       return [];
//     }
//   }, []);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       if (watchIdRef.current) {
//         navigator.geolocation.clearWatch(watchIdRef.current);
//       }
//       if (updateIntervalRef.current) {
//         clearInterval(updateIntervalRef.current);
//       }
//     };
//   }, []);

//   return {
//     currentLocation,
//     isTracking,
//     isWithinGeofence,
//     geofenceStatus,
//     error,
//     startTracking,
//     stopTracking,
//     getCurrentPosition,
//     checkGeofence,
//     getRouteHistory
//   };
// };






/**
 * LOCATION TRACKING HOOK
 * Manages GPS location tracking for technicians with persistence across navigation
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { trackingApi } from '../api/tracking.api';
import { useAuth } from './useAuth';
import { useToast } from './useToast';

// Storage key for persistence
const LOCATION_TRACKING_KEY = 'location_tracking_state';

export const useLocationTracking = (taskId = null) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isWithinGeofence, setIsWithinGeofence] = useState(false);
  const [geofenceStatus, setGeofenceStatus] = useState(null);
  const [error, setError] = useState(null);
  const watchIdRef = useRef(null);
  const updateIntervalRef = useRef(null);
  const serverUpdateIntervalRef = useRef(null);
  const isRestoringRef = useRef(false);

  /**
   * Save tracking state to localStorage for persistence
   */
  const saveTrackingState = useCallback((tracking, location = null) => {
    if (!user?._id) return;
    
    const state = {
      isTracking: tracking,
      userId: user._id,
      taskId: taskId,
      lastLocation: location,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(LOCATION_TRACKING_KEY, JSON.stringify(state));
  }, [user?._id, taskId]);

  /**
   * Load tracking state from localStorage
   */
  const loadTrackingState = useCallback(() => {
    try {
      const saved = localStorage.getItem(LOCATION_TRACKING_KEY);
      if (saved) {
        const state = JSON.parse(saved);
        // Only restore if it's the same user and less than 1 hour old
        if (state.userId === user?._id && 
            state.isTracking &&
            new Date() - new Date(state.timestamp) < 60 * 60 * 1000) {
          return state;
        }
      }
    } catch (error) {
      console.error('Failed to load tracking state:', error);
    }
    return null;
  }, [user?._id]);

  /**
   * Get current GPS position
   */
  const getCurrentPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            speed: position.coords.speed || 0,
            heading: position.coords.heading || 0,
            timestamp: new Date().toISOString()
          };
          resolve(location);
        },
        (error) => {
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, []);

  /**
   * Send location to server
   */
  const sendLocationToServer = useCallback(async (location) => {
    if (!user?._id || user.role !== 'technician') return;
    
    try {
      await trackingApi.updateLocation(
        location.lat,
        location.lng,
        location.accuracy,
        location.speed || 0,
        location.heading || 0,
        taskId
      );
      return true;
    } catch (error) {
      console.error('Failed to update location on server:', error);
      return false;
    }
  }, [user, taskId]);

  /**
   * Start watching position with persistence
   */
  const startTracking = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      showToast('Geolocation not supported', 'error');
      return;
    }

    // Stop any existing tracking first
    if (watchIdRef.current || updateIntervalRef.current || serverUpdateIntervalRef.current) {
      stopTracking();
    }

    setIsTracking(true);
    setError(null);
    
    // Save state to localStorage
    saveTrackingState(true, currentLocation);

    // Get initial position
    try {
      const initialLocation = await getCurrentPosition();
      setCurrentLocation(initialLocation);
      await sendLocationToServer(initialLocation);
      showToast('Location tracking started', 'success');
    } catch (error) {
      console.error('Initial position error:', error);
      if (error.code === 1) {
        setError('Please enable location permissions');
        showToast('Please enable location permissions', 'warning');
      } else {
        setError(error.message);
      }
    }

    // Watch position continuously
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0,
          timestamp: new Date().toISOString()
        };
        
        setCurrentLocation(location);
        
        // Save updated location to localStorage
        saveTrackingState(true, location);
      },
      (error) => {
        console.error('Geolocation watch error:', error);
        setError(error.message);
        if (error.code === 1) {
          stopTracking();
          showToast('Location permission denied. Stopping tracking.', 'error');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    // Send location to server periodically (every 15 seconds for real-time)
    serverUpdateIntervalRef.current = setInterval(async () => {
      if (currentLocation && user?.role === 'technician') {
        await sendLocationToServer(currentLocation);
      }
    }, 15000); // Update every 15 seconds

    // Also update when visibility changes (tab becomes active)
    const handleVisibilityChange = () => {
      if (!document.hidden && isTracking && currentLocation) {
        sendLocationToServer(currentLocation);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Store cleanup function
    window._trackingCleanup = () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
    
  }, [user, taskId, getCurrentPosition, sendLocationToServer, saveTrackingState, showToast, currentLocation]);

  /**
   * Stop tracking and clear persistence
   */
  const stopTracking = useCallback(async () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    if (serverUpdateIntervalRef.current) {
      clearInterval(serverUpdateIntervalRef.current);
      serverUpdateIntervalRef.current = null;
    }
    
    // Clean up visibility listener
    if (window._trackingCleanup) {
      window._trackingCleanup();
      window._trackingCleanup = null;
    }
    
    setIsTracking(false);
    
    // Clear localStorage persistence
    localStorage.removeItem(LOCATION_TRACKING_KEY);
    
    // Notify server that tracking ended
    if (user?.role === 'technician') {
      try {
        await trackingApi.endSession();
      } catch (error) {
        console.error('Failed to end session:', error);
      }
    }
    
    showToast('Location tracking stopped', 'info');
  }, [user, showToast]);

  /**
   * Restore tracking state after page refresh or navigation
   */
  const restoreTracking = useCallback(async () => {
    if (isRestoringRef.current) return;
    isRestoringRef.current = true;
    
    const savedState = loadTrackingState();
    if (savedState && savedState.isTracking && !isTracking) {
      console.log('Restoring location tracking session...');
      await startTracking();
      if (savedState.lastLocation) {
        setCurrentLocation(savedState.lastLocation);
      }
      showToast('Location tracking restored', 'info');
    }
    
    isRestoringRef.current = false;
  }, [loadTrackingState, isTracking, startTracking, showToast]);

  /**
   * Toggle tracking on/off
   */
  const toggleTracking = useCallback(() => {
    if (isTracking) {
      stopTracking();
    } else {
      startTracking();
    }
  }, [isTracking, startTracking, stopTracking]);

  /**
   * Check if within geofence
   */
  const checkGeofence = useCallback(async (location, buildingId) => {
    try {
      const response = await trackingApi.checkLocation(location.lat, location.lng);
      setIsWithinGeofence(response.data.isWithin);
      setGeofenceStatus(response.data);
      return response.data;
    } catch (error) {
      console.error('Geofence check failed:', error);
      return null;
    }
  }, []);

  /**
   * Get route history
   */
  const getRouteHistory = useCallback(async (technicianId, startDate, endDate) => {
    try {
      const response = await trackingApi.getRouteHistory(technicianId, startDate, endDate);
      return response.data.data;
    } catch (error) {
      console.error('Failed to get route history:', error);
      return [];
    }
  }, []);

  // Auto-restore tracking on mount (for technicians)
  useEffect(() => {
    if (user?.role === 'technician') {
      restoreTracking();
    }
    
    // Cleanup on unmount - but DON'T stop tracking here!
    // We want tracking to continue even when navigating away
    return () => {
      // Only cleanup if the user is logging out
      // For navigation, we keep the tracking alive via persistence
      if (!user) {
        if (watchIdRef.current) {
          navigator.geolocation.clearWatch(watchIdRef.current);
        }
        if (updateIntervalRef.current) {
          clearInterval(updateIntervalRef.current);
        }
        if (serverUpdateIntervalRef.current) {
          clearInterval(serverUpdateIntervalRef.current);
        }
      }
    };
  }, [user, restoreTracking]);

  return {
    currentLocation,
    isTracking,
    isWithinGeofence,
    geofenceStatus,
    error,
    startTracking,
    stopTracking,
    toggleTracking,        // New: toggle on/off
    restoreTracking,       // New: manually restore tracking
    getCurrentPosition,
    checkGeofence,
    getRouteHistory
  };
};