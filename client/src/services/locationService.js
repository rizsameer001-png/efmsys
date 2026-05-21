// client/src/services/locationService.js

class LocationService {
  constructor() {
    this.watchId = null;
    this.isSharing = false;
    this.currentLocation = null;
    this.listeners = [];
    this.updateInterval = null;
    this.userId = null;
  }

  /**
   * Initialize location service with user ID
   */
  init(userId) {
    this.userId = userId;
    this.checkStoredSession();
  }

  /**
   * Check if there's a stored active session
   */
  checkStoredSession() {
    const stored = localStorage.getItem('locationSharing');
    if (stored) {
      const session = JSON.parse(stored);
      if (session.active && session.userId === this.userId) {
        // Session was active, restart location sharing
        this.startSharing();
      }
    }
  }

  /**
   * Start sharing location
   */
  startSharing() {
    if (!navigator.geolocation) {
      this.notifyError('Geolocation is not supported');
      return false;
    }

    // Store session in localStorage
    localStorage.setItem('locationSharing', JSON.stringify({
      active: true,
      userId: this.userId,
      startedAt: new Date().toISOString()
    }));

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      (position) => this.handleLocationUpdate(position),
      (error) => this.handleLocationError(error),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    // Start watching position
    this.watchId = navigator.geolocation.watchPosition(
      (position) => this.handleLocationUpdate(position),
      (error) => this.handleLocationError(error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    // Start periodic updates as backup
    this.updateInterval = setInterval(() => {
      if (this.currentLocation) {
        this.sendLocationToServer(this.currentLocation);
      }
    }, 30000); // Send every 30 seconds as backup

    this.isSharing = true;
    this.notifyStatusChange(true, this.currentLocation);
    return true;
  }

  /**
   * Stop sharing location
   */
  stopSharing() {
    if (this.watchId) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    // Remove stored session
    localStorage.removeItem('locationSharing');

    this.isSharing = false;
    this.currentLocation = null;
    this.notifyStatusChange(false, null);
    
    // Optional: Call API to end session
    this.endSession();
  }

  /**
   * Handle location update from geolocation API
   */
  handleLocationUpdate(position) {
    const location = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
      accuracy: position.coords.accuracy,
      speed: position.coords.speed || 0,
      heading: position.coords.heading || 0,
      timestamp: new Date().toISOString()
    };
    
    this.currentLocation = location;
    this.sendLocationToServer(location);
    this.notifyLocationUpdate(location);
  }

  /**
   * Handle location error
   */
  handleLocationError(error) {
    let message = 'Location error: ';
    switch(error.code) {
      case error.PERMISSION_DENIED:
        message += 'Permission denied. Please enable location services.';
        this.stopSharing();
        break;
      case error.POSITION_UNAVAILABLE:
        message += 'Position unavailable.';
        break;
      case error.TIMEOUT:
        message += 'Request timed out.';
        break;
      default:
        message += 'Unknown error.';
    }
    this.notifyError(message);
  }

  /**
   * Send location to server
   */
  async sendLocationToServer(location) {
    try {
      // Import dynamically to avoid circular dependencies
      const { trackingApi } = await import('../api/tracking.api');
      await trackingApi.updateLocation(
        location.lat,
        location.lng,
        location.accuracy,
        location.speed,
        location.heading
      );
    } catch (error) {
      console.error('Failed to send location to server:', error);
    }
  }

  /**
   * End tracking session on server
   */
  async endSession() {
    try {
      const { trackingApi } = await import('../api/tracking.api');
      await trackingApi.endSession();
    } catch (error) {
      console.error('Failed to end session:', error);
    }
  }

  /**
   * Add listener for location updates
   */
  addListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove listener
   */
  removeListener(callback) {
    this.listeners = this.listeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners of location update
   */
  notifyLocationUpdate(location) {
    this.listeners.forEach(callback => {
      if (callback.onLocationUpdate) {
        callback.onLocationUpdate(location);
      }
    });
  }

  /**
   * Notify all listeners of status change
   */
  notifyStatusChange(isSharing, location) {
    this.listeners.forEach(callback => {
      if (callback.onStatusChange) {
        callback.onStatusChange(isSharing, location);
      }
    });
  }

  /**
   * Notify all listeners of error
   */
  notifyError(error) {
    this.listeners.forEach(callback => {
      if (callback.onError) {
        callback.onError(error);
      }
    });
  }

  /**
   * Get current sharing status
   */
  getSharingStatus() {
    return {
      isSharing: this.isSharing,
      currentLocation: this.currentLocation
    };
  }
}

// Create singleton instance
export const locationService = new LocationService();