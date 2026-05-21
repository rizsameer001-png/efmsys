// client/src/pages/error/MaintenanceMode.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';

const MaintenanceMode = () => {
  const [countdown, setCountdown] = useState(null);
  const [maintenanceInfo, setMaintenanceInfo] = useState({
    title: 'System Maintenance',
    message: 'We are currently performing scheduled maintenance to improve your experience.',
    startTime: null,
    endTime: null,
    expectedDuration: '2 hours',
    contactEmail: 'support@fms.com',
    contactPhone: '+971 4 123 4567'
  });

  useEffect(() => {
    // Fetch maintenance info from API
    const fetchMaintenanceInfo = async () => {
      try {
        // const response = await settingsApi.getMaintenanceStatus();
        // if (response.data.success) {
        //   setMaintenanceInfo(response.data.data);
        //   if (response.data.data.endTime) {
        //     startCountdown(new Date(response.data.data.endTime));
        //   }
        // }
      } catch (error) {
        console.error('Fetch maintenance info error:', error);
      }
    };
    
    fetchMaintenanceInfo();
  }, []);

  const startCountdown = (endTime) => {
    const interval = setInterval(() => {
      const now = new Date();
      const diff = endTime - now;
      
      if (diff <= 0) {
        clearInterval(interval);
        setCountdown(null);
        // Optionally redirect to home or show refresh button
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown({ hours, minutes, seconds });
      }
    }, 1000);
    
    return () => clearInterval(interval);
  };

  const formatTime = (num) => {
    return String(num).padStart(2, '0');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Maintenance Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 bg-yellow-500 rounded-full flex items-center justify-center animate-pulse">
              <svg className="w-16 h-16 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a2 2 0 100-4 2 2 0 000 4z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.042 21.672L13.684 16.6m-4.082 0L8.288 21.672m4.082-12.114l.932 3.306m-3.684 0l.932-3.306" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-white text-xs">🔧</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-white">
            {maintenanceInfo.title}
          </h1>
          <p className="mt-2 text-gray-300">
            {maintenanceInfo.message}
          </p>
        </div>

        {/* Countdown Timer */}
        {countdown && (
          <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-sm text-gray-300 mb-2">Expected to be back online in:</p>
            <div className="flex justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{formatTime(countdown.hours)}</div>
                <div className="text-xs text-gray-400">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{formatTime(countdown.minutes)}</div>
                <div className="text-xs text-gray-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{formatTime(countdown.seconds)}</div>
                <div className="text-xs text-gray-400">Seconds</div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Details */}
        <div className="bg-white/5 rounded-lg p-4">
          <div className="flex items-center justify-center gap-2 text-gray-300 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Expected Duration: {maintenanceInfo.expectedDuration}</span>
          </div>
          {maintenanceInfo.startTime && (
            <div className="flex items-center justify-center gap-2 text-gray-300 text-sm mt-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Started: {new Date(maintenanceInfo.startTime).toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Contact Information */}
        <div className="bg-white/5 rounded-lg p-4">
          <p className="text-sm text-gray-300 mb-2">Need immediate assistance?</p>
          <div className="flex flex-col gap-2">
            <a href={`mailto:${maintenanceInfo.contactEmail}`} className="text-blue-400 hover:text-blue-300">
              📧 {maintenanceInfo.contactEmail}
            </a>
            <a href={`tel:${maintenanceInfo.contactPhone}`} className="text-blue-400 hover:text-blue-300">
              📞 {maintenanceInfo.contactPhone}
            </a>
          </div>
        </div>

        {/* Check Status Button */}
        <div className="pt-4">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Check Status
          </button>
        </div>

        {/* Footer */}
        <div className="pt-8">
          <p className="text-xs text-gray-500">
            We apologize for any inconvenience. Our team is working hard to restore service.
          </p>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;