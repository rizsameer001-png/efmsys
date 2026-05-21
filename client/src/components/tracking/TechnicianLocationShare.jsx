// client/src/components/tracking/TechnicianLocationShare.jsx
import React, { useState, useEffect } from 'react';
import { trackingApi } from '../../api/tracking.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const TechnicianLocationShare = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [watchId, setWatchId] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  // Check if user is a technician
  const isTechnician = user?.role === 'technician' || user?.role === 'supervisor';

  const startLocationSharing = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }

    setIsSharing(true);
    
    // Get current position
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0
        };
        
        setCurrentLocation(location);
        
        // Send to backend
        try {
          await trackingApi.updateLocation(
            location.lat,
            location.lng,
            location.accuracy,
            location.speed,
            location.heading
          );
          showToast('Location sharing started', 'success');
        } catch (error) {
          console.error('Failed to update location:', error);
          showToast('Failed to share location', 'error');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        showToast('Unable to get your location. Please enable location services.', 'error');
        setIsSharing(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Watch position for continuous updates
    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          speed: position.coords.speed || 0,
          heading: position.coords.heading || 0
        };
        
        setCurrentLocation(location);
        
        try {
          await trackingApi.updateLocation(
            location.lat,
            location.lng,
            location.accuracy,
            location.speed,
            location.heading
          );
        } catch (error) {
          console.error('Failed to update location:', error);
        }
      },
      (error) => {
        console.error('Watch position error:', error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    
    setWatchId(id);
  };

  const stopLocationSharing = () => {
    if (watchId) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
    }
    setIsSharing(false);
    setCurrentLocation(null);
    showToast('Location sharing stopped', 'info');
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  if (!isTechnician) return null;

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold">Location Sharing</h3>
          <p className="text-sm text-gray-500">
            {isSharing 
              ? 'Your location is being shared with managers' 
              : 'Enable location sharing for live tracking'}
          </p>
          {currentLocation && (
            <p className="text-xs text-gray-400 mt-1">
              📍 Lat: {currentLocation.lat.toFixed(6)}, Lng: {currentLocation.lng.toFixed(6)}
            </p>
          )}
        </div>
        <button
          onClick={isSharing ? stopLocationSharing : startLocationSharing}
          className={`px-4 py-2 rounded-lg transition-colors ${
            isSharing 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isSharing ? 'Stop Sharing' : 'Start Sharing'}
        </button>
      </div>
    </div>
  );
};

export default TechnicianLocationShare;