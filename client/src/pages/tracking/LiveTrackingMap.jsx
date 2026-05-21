// /**
//  * LIVE TRACKING MAP COMPONENT
//  * Real-time GPS tracking display for technicians
//  */

// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from '@react-google-maps/api';
// import { trackingApi } from '../../api/tracking.api';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import Card from '../common/Card';
// import Spinner from '../common/Spinner';

// const mapContainerStyle = {
//   width: '100%',
//   height: '500px'
// };

// const defaultCenter = {
//   lat: 25.2048,
//   lng: 55.2708
// };

// const LiveTrackingMap = ({ buildingId = null, onTechnicianSelect }) => {
//   const { isLoaded } = useLoadScript({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
//   });
  
//   const { socket, isConnected } = useTaskSocket();
//   const [technicians, setTechnicians] = useState([]);
//   const [selectedTech, setSelectedTech] = useState(null);
//   const [map, setMap] = useState(null);
//   const [center, setCenter] = useState(defaultCenter);
//   const [zoom, setZoom] = useState(12);
//   const [loading, setLoading] = useState(true);

//   // Fetch live locations
//   const fetchLiveLocations = useCallback(async () => {
//     try {
//       const response = await trackingApi.getLiveLocations(buildingId);
//       setTechnicians(response.data.data);
//     } catch (error) {
//       console.error('Failed to fetch live locations:', error);
//     } finally {
//       setLoading(false);
//     }
//   }, [buildingId]);

//   useEffect(() => {
//     fetchLiveLocations();
    
//     // Refresh every 10 seconds
//     const interval = setInterval(fetchLiveLocations, 10000);
//     return () => clearInterval(interval);
//   }, [fetchLiveLocations]);

//   // Socket event listeners for real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     socket.on('location:update', (data) => {
//       setTechnicians(prev => 
//         prev.map(tech => 
//           tech.technician.id === data.technicianId
//             ? { ...tech, location: data.location, lastUpdate: new Date() }
//             : tech
//         )
//       );
//     });

//     socket.on('technician:offline', (data) => {
//       setTechnicians(prev =>
//         prev.map(tech =>
//           tech.technician.id === data.technicianId
//             ? { ...tech, isOnline: false }
//             : tech
//         )
//       );
//     });

//     return () => {
//       socket.off('location:update');
//       socket.off('technician:offline');
//     };
//   }, [socket]);

//   const getMarkerIcon = (status, isOnline) => {
//     if (!isOnline) return '/markers/offline.png';
    
//     const icons = {
//       active: '/markers/green.png',
//       on_break: '/markers/yellow.png',
//       travelling: '/markers/blue.png'
//     };
//     return icons[status] || '/markers/gray.png';
//   };

//   const handleMarkerClick = (technician) => {
//     setSelectedTech(technician);
//     if (onTechnicianSelect) {
//       onTechnicianSelect(technician);
//     }
//   };

//   const handleMapClick = () => {
//     setSelectedTech(null);
//   };

//   if (!isLoaded) return <Spinner text="Loading map..." />;
//   if (loading) return <Spinner text="Loading technician locations..." />;

//   return (
//     <Card className="overflow-hidden">
//       <div className="p-4 border-b bg-gray-50">
//         <div className="flex justify-between items-center">
//           <h3 className="font-semibold">Live Technician Tracking</h3>
//           <div className="flex space-x-4 text-sm">
//             <span className="flex items-center">
//               <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
//               Active
//             </span>
//             <span className="flex items-center">
//               <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
//               On Break
//             </span>
//             <span className="flex items-center">
//               <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
//               Travelling
//             </span>
//             <span className="flex items-center">
//               <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
//               Offline
//             </span>
//           </div>
//         </div>
//         {!isConnected && (
//           <p className="text-sm text-yellow-600 mt-2">
//             ⚠️ Real-time updates disconnected. Reconnecting...
//           </p>
//         )}
//       </div>
      
//       <GoogleMap
//         mapContainerStyle={mapContainerStyle}
//         center={center}
//         zoom={zoom}
//         onLoad={setMap}
//         onClick={handleMapClick}
//       >
//         {technicians.map((tech) => (
//           <Marker
//             key={tech.technician.id}
//             position={{ lat: tech.location.lat, lng: tech.location.lng }}
//             icon={getMarkerIcon(tech.status, tech.isOnline)}
//             onClick={() => handleMarkerClick(tech)}
//           />
//         ))}
        
//         {selectedTech && (
//           <InfoWindow
//             position={{ lat: selectedTech.location.lat, lng: selectedTech.location.lng }}
//             onCloseClick={() => setSelectedTech(null)}
//           >
//             <div className="p-2 min-w-[200px]">
//               <div className="flex items-center space-x-2 mb-2">
//                 <img
//                   src={selectedTech.technician.profileImage || '/avatar-placeholder.png'}
//                   alt={selectedTech.technician.name}
//                   className="w-10 h-10 rounded-full"
//                 />
//                 <div>
//                   <h4 className="font-semibold">{selectedTech.technician.name}</h4>
//                   <p className="text-xs text-gray-500">{selectedTech.technician.role}</p>
//                 </div>
//               </div>
//               <div className="space-y-1 text-sm">
//                 <p>📍 Status: {selectedTech.status}</p>
//                 {selectedTech.taskId && (
//                   <p>📋 Task: {selectedTech.taskId.slice(-6)}</p>
//                 )}
//                 {selectedTech.location.speed > 0 && (
//                   <p>🎯 Speed: {selectedTech.location.speed} km/h</p>
//                 )}
//                 <p className="text-xs text-gray-400">
//                   Last update: {new Date(selectedTech.lastUpdate).toLocaleTimeString()}
//                 </p>
//               </div>
//               <div className="mt-2 flex space-x-2">
//                 <button className="text-xs text-blue-600 hover:text-blue-800">
//                   Send Message
//                 </button>
//                 <button className="text-xs text-green-600 hover:text-green-800">
//                   View Route
//                 </button>
//               </div>
//             </div>
//           </InfoWindow>
//         )}
//       </GoogleMap>
      
//       {/* Technician List Sidebar */}
//       <div className="p-4 border-t max-h-60 overflow-y-auto">
//         <h4 className="font-medium mb-2">Online Technicians ({technicians.filter(t => t.isOnline).length})</h4>
//         <div className="space-y-2">
//           {technicians.map((tech) => (
//             <div
//               key={tech.technician.id}
//               className="flex items-center justify-between p-2 hover:bg-gray-50 rounded cursor-pointer"
//               onClick={() => {
//                 setCenter({ lat: tech.location.lat, lng: tech.location.lng });
//                 setZoom(15);
//                 setSelectedTech(tech);
//               }}
//             >
//               <div className="flex items-center space-x-3">
//                 <div className={`w-2 h-2 rounded-full ${tech.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
//                 <span>{tech.technician.name}</span>
//               </div>
//               <span className="text-xs text-gray-500">
//                 {tech.location.speed ? `${tech.location.speed} km/h` : 'Stationary'}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </Card>
//   );
// };

// export default LiveTrackingMap;



/**
 * LIVE TRACKING MAP COMPONENT
 * Real-time GPS tracking display for technicians
 * 
 * PURPOSE: Displays real-time locations of technicians on Google Maps
 * with live updates via WebSocket and periodic polling
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, Marker, Polyline, InfoWindow, useLoadScript } from '@react-google-maps/api';
import { trackingApi } from '../../api/tracking.api';
import { useTaskSocket } from '../../hooks/useTaskSocket';
import Card from '../common/Card';
import Spinner from '../common/Spinner';

const mapContainerStyle = {
  width: '100%',
  height: '500px'
};

const defaultCenter = {
  lat: 25.2048,
  lng: 55.2708
};

const LiveTrackingMap = ({ buildingId = null, onTechnicianSelect }) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });
  
  const { socket, isConnected } = useTaskSocket();
  const [technicians, setTechnicians] = useState([]);
  const [selectedTech, setSelectedTech] = useState(null);
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(12);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchTime, setLastFetchTime] = useState(null);

  /**
   * PURPOSE: Fetches live locations from API
   * Handles different response formats and ensures data is an array
   * Shows error toast if fetch fails
   */
  const fetchLiveLocations = useCallback(async () => {
    try {
      const response = await trackingApi.getLiveLocations(buildingId);
      
      // Debug logging to see what's coming from API
      console.log('Live locations API response:', response);
      
      let techniciansData = [];
      
      // SAFELY EXTRACT TECHNICIANS DATA from different response formats
      if (response && response.success && Array.isArray(response.data)) {
        techniciansData = response.data;
      } 
      else if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
        techniciansData = response.data.data;
      }
      else if (response && Array.isArray(response.data)) {
        techniciansData = response.data;
      }
      else if (response && response.data && Array.isArray(response.data.technicians)) {
        techniciansData = response.data.technicians;
      }
      else if (response && response.data && response.data.data && Array.isArray(response.data.data.technicians)) {
        techniciansData = response.data.data.technicians;
      }
      else if (response && response.technicians && Array.isArray(response.technicians)) {
        techniciansData = response.technicians;
      }
      
      // Ensure each technician has required fields
      const validTechnicians = techniciansData.filter(tech => {
        if (!tech || !tech.location) {
          console.warn('Invalid technician data:', tech);
          return false;
        }
        return true;
      });
      
      console.log(`Fetched ${validTechnicians.length} technicians with valid locations`);
      setTechnicians(validTechnicians);
      setLastFetchTime(new Date());
      setError(null);
      
      // Auto-center on first technician if none selected and we have data
      if (validTechnicians.length > 0 && center === defaultCenter && !selectedTech) {
        const firstTech = validTechnicians[0];
        if (firstTech.location && firstTech.location.lat && firstTech.location.lng) {
          setCenter({ lat: firstTech.location.lat, lng: firstTech.location.lng });
        }
      }
      
    } catch (error) {
      console.error('Failed to fetch live locations:', error);
      setError(error.message || 'Failed to fetch locations');
      setTechnicians([]);
    } finally {
      setLoading(false);
    }
  }, [buildingId, center, selectedTech]);

  // Initial fetch and polling
  useEffect(() => {
    fetchLiveLocations();
    
    // Refresh every 10 seconds (polling fallback)
    const interval = setInterval(fetchLiveLocations, 10000);
    return () => clearInterval(interval);
  }, [fetchLiveLocations]);

  /**
   * PURPOSE: Socket event listeners for real-time updates
   * Updates technician locations in real-time when received
   */
  useEffect(() => {
    if (!socket) return;

    // Handle location update events
    const handleLocationUpdate = (data) => {
      console.log('Real-time location update received:', data);
      setTechnicians(prev => {
        const index = prev.findIndex(t => 
          (t.technician?.id === data.technicianId) || 
          (t.id === data.technicianId) ||
          (t.technician?._id === data.technicianId)
        );
        
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            ...updated[index],
            location: data.location,
            lastUpdate: new Date(),
            isOnline: true
          };
          return updated;
        }
        return prev;
      });
    };

    // Handle technician online status
    const handleTechnicianOnline = (data) => {
      console.log('Technician online:', data);
      setTechnicians(prev => {
        const index = prev.findIndex(t => 
          (t.technician?.id === data.technicianId) || 
          (t.id === data.technicianId)
        );
        
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], isOnline: true };
          return updated;
        }
        return prev;
      });
    };

    // Handle technician offline status
    const handleTechnicianOffline = (data) => {
      console.log('Technician offline:', data);
      setTechnicians(prev => {
        const index = prev.findIndex(t => 
          (t.technician?.id === data.technicianId) || 
          (t.id === data.technicianId)
        );
        
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], isOnline: false };
          return updated;
        }
        return prev;
      });
    };

    socket.on('location:update', handleLocationUpdate);
    socket.on('technician:online', handleTechnicianOnline);
    socket.on('technician:offline', handleTechnicianOffline);
    socket.on('tracking:update', handleLocationUpdate);

    return () => {
      socket.off('location:update', handleLocationUpdate);
      socket.off('technician:online', handleTechnicianOnline);
      socket.off('technician:offline', handleTechnicianOffline);
      socket.off('tracking:update', handleLocationUpdate);
    };
  }, [socket]);

  /**
   * PURPOSE: Returns marker icon URL based on technician status
   * @param {string} status - Technician status (active, on_break, travelling)
   * @param {boolean} isOnline - Whether technician is online
   */
  const getMarkerIcon = (status, isOnline) => {
    if (!isOnline) return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
    
    const icons = {
      active: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      on_break: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      travelling: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
    };
    return icons[status] || 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
  };

  /**
   * PURPOSE: Handles marker click - selects technician and shows info window
   * @param {Object} technician - Selected technician object
   */
  const handleMarkerClick = (technician) => {
    setSelectedTech(technician);
    if (onTechnicianSelect) {
      onTechnicianSelect(technician);
    }
  };

  /**
   * PURPOSE: Centers map on a specific technician
   * @param {Object} technician - Technician to center on
   */
  const centerOnTechnician = (technician) => {
    if (technician && technician.location) {
      setCenter({ lat: technician.location.lat, lng: technician.location.lng });
      setZoom(15);
      setSelectedTech(technician);
    }
  };

  const handleMapClick = () => {
    setSelectedTech(null);
  };

  // Calculate online count safely
  const onlineCount = Array.isArray(technicians) 
    ? technicians.filter(t => t && t.isOnline !== false).length 
    : 0;

  if (!isLoaded) return <Spinner text="Loading map..." />;
  
  if (loading) return <Spinner text="Loading technician locations..." />;

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b bg-gray-50">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">Live Technician Tracking</h3>
          <div className="flex space-x-4 text-sm">
            <span className="flex items-center">
              <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
              Active
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></span>
              On Break
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
              Travelling
            </span>
            <span className="flex items-center">
              <span className="w-3 h-3 bg-gray-400 rounded-full mr-1"></span>
              Offline
            </span>
          </div>
        </div>
        
        {/* Connection Status */}
        {!isConnected && (
          <p className="text-sm text-yellow-600 mt-2">
            ⚠️ Real-time updates disconnected. Reconnecting...
          </p>
        )}
        
        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 mt-2">
            ❌ Error: {error}
          </p>
        )}
        
        {/* Last Update Info */}
        {lastFetchTime && (
          <p className="text-xs text-gray-500 mt-2">
            Last updated: {lastFetchTime.toLocaleTimeString()}
          </p>
        )}
      </div>
      
      {/* Google Map */}
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={zoom}
        onLoad={setMap}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true
        }}
      >
        {Array.isArray(technicians) && technicians.map((tech, index) => {
          // Skip if no valid location
          if (!tech || !tech.location || !tech.location.lat || !tech.location.lng) {
            return null;
          }
          
          return (
            <Marker
              key={tech.technician?.id || tech.id || index}
              position={{ lat: tech.location.lat, lng: tech.location.lng }}
              icon={getMarkerIcon(tech.status, tech.isOnline)}
              onClick={() => handleMarkerClick(tech)}
              title={tech.technician?.name || tech.name || 'Technician'}
            />
          );
        })}
        
        {selectedTech && selectedTech.location && (
          <InfoWindow
            position={{ lat: selectedTech.location.lat, lng: selectedTech.location.lng }}
            onCloseClick={() => setSelectedTech(null)}
          >
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center space-x-2 mb-2">
                {selectedTech.technician?.profileImage ? (
                  <img
                    src={selectedTech.technician.profileImage}
                    alt={selectedTech.technician.name || 'Technician'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">
                      {(selectedTech.technician?.name?.[0] || selectedTech.name?.[0] || 'T').toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold">{selectedTech.technician?.name || selectedTech.name || 'Unknown'}</h4>
                  <p className="text-xs text-gray-500">{selectedTech.technician?.role || selectedTech.role || 'Technician'}</p>
                </div>
              </div>
              <div className="space-y-1 text-sm">
                <p>📍 Status: <span className="capitalize">{selectedTech.status || 'Active'}</span></p>
                {selectedTech.taskId && (
                  <p>📋 Task: {selectedTech.taskId.slice(-6)}</p>
                )}
                {selectedTech.location?.speed > 0 && (
                  <p>🎯 Speed: {selectedTech.location.speed} km/h</p>
                )}
                <p className="text-xs text-gray-400">
                  Last update: {selectedTech.lastUpdate 
                    ? new Date(selectedTech.lastUpdate).toLocaleTimeString() 
                    : 'Just now'}
                </p>
              </div>
              <div className="mt-2 flex space-x-2">
                <button 
                  className="text-xs text-blue-600 hover:text-blue-800"
                  onClick={() => {
                    // TODO: Implement send message
                    console.log('Send message to:', selectedTech);
                  }}
                >
                  Send Message
                </button>
                <button 
                  className="text-xs text-green-600 hover:text-green-800"
                  onClick={() => {
                    // TODO: Implement view route history
                    console.log('View route for:', selectedTech);
                  }}
                >
                  View Route
                </button>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      
      {/* Technician List Sidebar */}
      <div className="p-4 border-t max-h-60 overflow-y-auto">
        <h4 className="font-medium mb-2">
          Online Technicians ({onlineCount})
          {onlineCount === 0 && !loading && (
            <span className="text-sm text-gray-500 ml-2">- No online technicians</span>
          )}
        </h4>
        
        {Array.isArray(technicians) && technicians.length > 0 ? (
          <div className="space-y-2">
            {technicians.map((tech, index) => {
              const isOnline = tech.isOnline !== false;
              const techName = tech.technician?.name || tech.name || 'Unknown';
              const techLocation = tech.location;
              
              return (
                <div
                  key={tech.technician?.id || tech.id || index}
                  className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                    isOnline ? 'hover:bg-blue-50' : 'hover:bg-gray-50'
                  } ${selectedTech === tech ? 'bg-blue-100' : ''}`}
                  onClick={() => techLocation && centerOnTechnician(tech)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <div>
                      <span className="text-sm font-medium">{techName}</span>
                      {tech.status && (
                        <span className="text-xs text-gray-500 ml-2 capitalize">({tech.status})</span>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">
                    {techLocation?.speed ? `${techLocation.speed} km/h` : 'Stationary'}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📍</div>
            <p>No technician locations available</p>
            <p className="text-xs mt-1">Technicians need to enable location sharing</p>
          </div>
        )}
      </div>
      
      {/* Refresh Button */}
      <div className="p-2 border-t bg-gray-50 text-center">
        <button
          onClick={fetchLiveLocations}
          className="text-xs text-blue-600 hover:text-blue-800"
        >
          ↻ Refresh locations
        </button>
      </div>
    </Card>
  );
};

export default LiveTrackingMap;