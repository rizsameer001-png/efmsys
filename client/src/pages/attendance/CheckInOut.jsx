// client/src/pages/attendance/CheckInOut.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { attendanceApi } from '../../api/attendance.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const CheckInOut = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [todayStatus, setTodayStatus] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [geolocationSupported, setGeolocationSupported] = useState(true);

  useEffect(() => {
    checkGeolocationSupport();
    fetchTodayStatus();
  }, []);

  const checkGeolocationSupport = () => {
    if (!navigator.geolocation) {
      setGeolocationSupported(false);
      setLocationError('Geolocation is not supported by your browser');
    }
  };

  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Unable to get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied. Please enable location access.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const fetchTodayStatus = async () => {
    setLoading(true);
    try {
      const response = await attendanceApi.getMyAttendance();
      if (response.data.success) {
        setTodayStatus(response.data.data.today);
      }
    } catch (error) {
      console.error('Fetch attendance status error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setChecking(true);
    setLocationError(null);
    
    try {
      let gpsLocation = null;
      if (geolocationSupported) {
        try {
          gpsLocation = await getCurrentLocation();
          setLocation(gpsLocation);
        } catch (locError) {
          setLocationError(locError.message);
          // Continue without GPS if user chooses
          if (!window.confirm(`${locError.message}\n\nContinue without GPS location?`)) {
            setChecking(false);
            return;
          }
        }
      }
      
      const response = await attendanceApi.checkIn({ gpsLocation, method: gpsLocation ? 'gps' : 'manual' });
      if (response.data.success) {
        showToast('✅ Check-in successful!', 'success');
        fetchTodayStatus();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Check-in failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  const handleCheckOut = async () => {
    setChecking(true);
    setLocationError(null);
    
    try {
      let gpsLocation = null;
      if (geolocationSupported) {
        try {
          gpsLocation = await getCurrentLocation();
          setLocation(gpsLocation);
        } catch (locError) {
          setLocationError(locError.message);
          if (!window.confirm(`${locError.message}\n\nContinue without GPS location?`)) {
            setChecking(false);
            return;
          }
        }
      }
      
      const response = await attendanceApi.checkOut({ gpsLocation, method: gpsLocation ? 'gps' : 'manual' });
      if (response.data.success) {
        showToast('✅ Check-out successful!', 'success');
        fetchTodayStatus();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Check-out failed', 'error');
    } finally {
      setChecking(false);
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Check In / Check Out</h1>
        <p className="text-gray-500 mt-1">Record your daily attendance with GPS verification</p>
      </div>

      {/* Current Date Card */}
      <Card className="p-6 text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <p className="text-lg opacity-90">Today is</p>
        <p className="text-2xl font-bold">{formatDate()}</p>
      </Card>

      {/* Status Card */}
      <Card className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-500">Status</p>
            <p className={`text-lg font-semibold ${
              todayStatus?.status === 'present' ? 'text-green-600' :
              todayStatus?.status === 'late' ? 'text-yellow-600' :
              'text-red-600'
            }`}>
              {todayStatus?.status === 'present' ? '✅ Present' :
               todayStatus?.status === 'late' ? '⏰ Late' :
               todayStatus?.status === 'absent' ? '❌ Absent' :
               'Not Checked In'}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Check In Time</p>
            <p className="text-lg font-semibold">{formatTime(todayStatus?.checkInTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Check Out Time</p>
            <p className="text-lg font-semibold">{formatTime(todayStatus?.checkOutTime)}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Total Hours</p>
            <p className="text-lg font-semibold">{todayStatus?.totalHours || 0} hrs</p>
          </div>
        </div>
      </Card>

      {/* GPS Location Status */}
      {!geolocationSupported && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-sm">
            ⚠️ Geolocation is not supported by your browser. GPS verification will be skipped.
          </p>
        </Card>
      )}

      {locationError && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-sm">⚠️ {locationError}</p>
        </Card>
      )}

      {location && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-green-800 text-sm">
            📍 Location captured: Lat {location.lat.toFixed(6)}, Lng {location.lng.toFixed(6)}
            {location.accuracy && ` (Accuracy: ±${Math.round(location.accuracy)}m)`}
          </p>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-center gap-4">
          {!todayStatus?.checkInTime && (
            <Button 
              onClick={handleCheckIn} 
              isLoading={checking}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              <span className="mr-2">✅</span>
              Check In
            </Button>
          )}
          
          {todayStatus?.checkInTime && !todayStatus?.checkOutTime && (
            <Button 
              onClick={handleCheckOut} 
              isLoading={checking}
              variant="secondary"
              className="px-8 py-3 text-lg"
            >
              <span className="mr-2">🏁</span>
              Check Out
            </Button>
          )}
          
          {todayStatus?.checkInTime && todayStatus?.checkOutTime && (
            <div className="text-center text-green-600">
              <p className="text-lg font-semibold">✓ Today's attendance completed</p>
              <p className="text-sm">Total hours worked: {todayStatus.totalHours} hours</p>
            </div>
          )}
        </div>
      </Card>

      {/* Work Hours Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Today's Work Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Expected Work Hours</span>
            <span className="font-medium">8 hours</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Actual Work Hours</span>
            <span className="font-medium text-green-600">{todayStatus?.totalHours || 0} hours</span>
          </div>
          {todayStatus?.lateMinutes > 0 && (
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span className="text-yellow-700">Late by</span>
              <span className="font-medium text-yellow-700">{todayStatus.lateMinutes} minutes</span>
            </div>
          )}
          {todayStatus?.overtimeHours > 0 && (
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700">Overtime</span>
              <span className="font-medium text-blue-700">{todayStatus.overtimeHours} hours</span>
            </div>
          )}
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-2">📋 Instructions</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check In when you start your work shift</li>
          <li>• Check Out when you finish your work shift</li>
          <li>• GPS location is required for verification</li>
          <li>• Expected check-in time is 9:00 AM</li>
          <li>• Late check-ins will be marked as "Late"</li>
        </ul>
      </Card>
    </div>
  );
};

export default CheckInOut;