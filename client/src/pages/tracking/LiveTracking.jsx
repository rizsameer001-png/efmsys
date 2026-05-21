// // client/src/pages/tracking/LiveTracking.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { trackingApi } from '../../api/tracking.api';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// // Load Google Maps script
// const loadGoogleMapsScript = () => {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve();
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// };

// const LiveTracking = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { socket } = useTaskSocket();
//   const [technicians, setTechnicians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedTech, setSelectedTech] = useState(null);
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState({});
//   const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 });

//   useEffect(() => {
//     loadGoogleMapsScript()
//       .then(() => setMapLoaded(true))
//       .catch(() => showToast('Failed to load Google Maps', 'error'));
//   }, []);

//   const fetchTechnicians = useCallback(async () => {
//     try {
//       const response = await trackingApi.getLiveLocations();
//       setTechnicians(response.data.data);
//     } catch (error) {
//       showToast('Failed to fetch technician locations', 'error');
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   useEffect(() => {
//     fetchTechnicians();
//     const interval = setInterval(fetchTechnicians, 10000);
//     return () => clearInterval(interval);
//   }, [fetchTechnicians]);

//   // Socket listeners for real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     socket.on('technician:location', (data) => {
//       setTechnicians(prev => 
//         prev.map(tech => 
//           tech.technician.id === data.userId
//             ? { ...tech, location: data.location, lastUpdate: new Date() }
//             : tech
//         )
//       );
      
//       // Update marker if map is loaded
//       if (map && markers[data.userId]) {
//         const position = new window.google.maps.LatLng(data.location.lat, data.location.lng);
//         markers[data.userId].setPosition(position);
//       }
//     });

//     socket.on('technician:offline', (data) => {
//       setTechnicians(prev =>
//         prev.map(tech =>
//           tech.technician.id === data.userId
//             ? { ...tech, isOnline: false }
//             : tech
//         )
//       );
//     });

//     return () => {
//       socket.off('technician:location');
//       socket.off('technician:offline');
//     };
//   }, [socket, map, markers]);

//   // Initialize map
//   useEffect(() => {
//     if (!mapLoaded || !document.getElementById('map')) return;

//     const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//       center,
//       zoom: 12,
//       styles: [
//         {
//           featureType: 'poi',
//           elementType: 'labels',
//           stylers: [{ visibility: 'off' }]
//         }
//       ]
//     });
//     setMap(mapInstance);
//   }, [mapLoaded]);

//   // Update markers when technicians change
//   useEffect(() => {
//     if (!map || !window.google) return;

//     // Clear existing markers
//     Object.values(markers).forEach(marker => marker.setMap(null));
    
//     const newMarkers = {};
    
//     technicians.forEach(tech => {
//       if (!tech.location) return;
      
//       const icon = getMarkerIcon(tech.status, tech.isOnline);
//       const marker = new window.google.maps.Marker({
//         position: { lat: tech.location.lat, lng: tech.location.lng },
//         map,
//         icon,
//         title: tech.technician.name
//       });
      
//       const infoWindow = new window.google.maps.InfoWindow({
//         content: `
//           <div style="padding: 8px;">
//             <strong>${tech.technician.name}</strong><br/>
//             Status: ${tech.status}<br/>
//             Speed: ${tech.location.speed || 0} km/h<br/>
//             Last update: ${new Date(tech.lastUpdate).toLocaleTimeString()}
//           </div>
//         `
//       });
      
//       marker.addListener('click', () => {
//         infoWindow.open(map, marker);
//         setSelectedTech(tech);
//       });
      
//       newMarkers[tech.technician.id] = marker;
//     });
    
//     setMarkers(newMarkers);
//   }, [technicians, map]);

//   const getMarkerIcon = (status, isOnline) => {
//     if (!isOnline) return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
//     switch(status) {
//       case 'active': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
//       case 'on_break': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
//       case 'travelling': return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
//       default: return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
//     }
//   };

//   const centerOnTechnician = (tech) => {
//     if (map && tech.location) {
//       map.setCenter({ lat: tech.location.lat, lng: tech.location.lng });
//       map.setZoom(15);
//       setSelectedTech(tech);
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
//         <p className="text-gray-500 mt-1">Real-time technician location tracking</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Technician List */}
//         <Card className="lg:col-span-1 p-4">
//           <h3 className="font-semibold mb-3">Online Technicians ({technicians.filter(t => t.isOnline).length})</h3>
//           <div className="space-y-2 max-h-[500px] overflow-y-auto">
//             {technicians.map(tech => (
//               <div
//                 key={tech.technician.id}
//                 className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                   selectedTech?.technician.id === tech.technician.id
//                     ? 'bg-blue-50 border border-blue-200'
//                     : 'hover:bg-gray-50 border border-transparent'
//                 }`}
//                 onClick={() => centerOnTechnician(tech)}
//               >
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center space-x-2">
//                     <div className={`w-2 h-2 rounded-full ${tech.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
//                     <span className="font-medium">{tech.technician.name}</span>
//                   </div>
//                   <span className="text-xs text-gray-500">
//                     {tech.location.speed ? `${tech.location.speed} km/h` : 'Stationary'}
//                   </span>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-1">
//                   Last update: {new Date(tech.lastUpdate).toLocaleTimeString()}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </Card>

//         {/* Map */}
//         <Card className="lg:col-span-3 overflow-hidden p-0">
//           <div id="map" style={{ width: '100%', height: '500px' }} />
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LiveTracking;




// client/src/pages/tracking/LiveTracking.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { trackingApi } from '../../api/tracking.api';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// // Load Google Maps script
// const loadGoogleMapsScript = () => {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve();
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// };

// const LiveTracking = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { socket } = useTaskSocket();
//   const [technicians, setTechnicians] = useState([]); // Initialize as empty array
//   const [loading, setLoading] = useState(true);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedTech, setSelectedTech] = useState(null);
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState({});
//   const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 });

//   useEffect(() => {
//     loadGoogleMapsScript()
//       .then(() => setMapLoaded(true))
//       .catch(() => showToast('Failed to load Google Maps', 'error'));
//   }, []);

//   const fetchTechnicians = useCallback(async () => {
//     try {
//       const response = await trackingApi.getLiveLocations();
      
//       // Ensure we always have an array
//       let techniciansData = [];
//       if (response.data && response.data.success) {
//         techniciansData = Array.isArray(response.data.data) ? response.data.data : [];
//       } else if (Array.isArray(response.data)) {
//         techniciansData = response.data;
//       } else if (response.data && response.data.technicians) {
//         techniciansData = Array.isArray(response.data.technicians) ? response.data.technicians : [];
//       }
      
//       setTechnicians(techniciansData);
//     } catch (error) {
//       console.error('Failed to fetch technician locations:', error);
//       showToast('Failed to fetch technician locations', 'error');
//       setTechnicians([]); // Set empty array on error
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   useEffect(() => {
//     fetchTechnicians();
//     const interval = setInterval(fetchTechnicians, 10000);
//     return () => clearInterval(interval);
//   }, [fetchTechnicians]);

//   // Socket listeners for real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     socket.on('technician:location', (data) => {
//       setTechnicians(prev => {
//         // Ensure prev is an array
//         const prevArray = Array.isArray(prev) ? prev : [];
//         return prevArray.map(tech => 
//           tech.technician?.id === data.userId
//             ? { ...tech, location: data.location, lastUpdate: new Date() }
//             : tech
//         );
//       });
      
//       // Update marker if map is loaded
//       if (map && markers[data.userId] && window.google) {
//         const position = new window.google.maps.LatLng(data.location.lat, data.location.lng);
//         markers[data.userId].setPosition(position);
//       }
//     });

//     socket.on('technician:offline', (data) => {
//       setTechnicians(prev => {
//         const prevArray = Array.isArray(prev) ? prev : [];
//         return prevArray.map(tech =>
//           tech.technician?.id === data.userId
//             ? { ...tech, isOnline: false }
//             : tech
//         );
//       });
//     });

//     return () => {
//       socket.off('technician:location');
//       socket.off('technician:offline');
//     };
//   }, [socket, map, markers]);

//   // Initialize map
//   useEffect(() => {
//     if (!mapLoaded || !document.getElementById('map') || !window.google) return;

//     try {
//       const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//         center,
//         zoom: 12,
//         styles: [
//           {
//             featureType: 'poi',
//             elementType: 'labels',
//             stylers: [{ visibility: 'off' }]
//           }
//         ]
//       });
//       setMap(mapInstance);
//     } catch (error) {
//       console.error('Error initializing map:', error);
//       showToast('Failed to initialize map', 'error');
//     }
//   }, [mapLoaded]);

//   // Update markers when technicians change
//   useEffect(() => {
//     if (!map || !window.google) return;

//     // Clear existing markers
//     Object.values(markers).forEach(marker => {
//       if (marker && marker.setMap) {
//         marker.setMap(null);
//       }
//     });
    
//     const newMarkers = {};
    
//     // Ensure technicians is an array before iterating
//     const techniciansArray = Array.isArray(technicians) ? technicians : [];
    
//     techniciansArray.forEach(tech => {
//       if (!tech || !tech.location || !tech.location.lat || !tech.location.lng) return;
      
//       try {
//         const icon = getMarkerIcon(tech.status, tech.isOnline);
//         const marker = new window.google.maps.Marker({
//           position: { lat: tech.location.lat, lng: tech.location.lng },
//           map,
//           icon,
//           title: tech.technician?.name || 'Unknown Technician'
//         });
        
//         const infoWindow = new window.google.maps.InfoWindow({
//           content: `
//             <div style="padding: 8px; min-width: 150px;">
//               <strong>${tech.technician?.name || 'Unknown'}</strong><br/>
//               <strong>${tech.technician?.role || 'Technician'}</strong><br/>
//               Status: ${tech.status || 'Unknown'}<br/>
//               Speed: ${tech.location.speed || 0} km/h<br/>
//               Last update: ${tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
//             </div>
//           `
//         });
        
//         marker.addListener('click', () => {
//           infoWindow.open(map, marker);
//           setSelectedTech(tech);
//         });
        
//         newMarkers[tech.technician?.id || tech.id] = marker;
//       } catch (error) {
//         console.error('Error creating marker:', error);
//       }
//     });
    
//     setMarkers(newMarkers);
//   }, [technicians, map]);

//   const getMarkerIcon = (status, isOnline) => {
//     if (!isOnline) return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
//     switch(status) {
//       case 'active': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
//       case 'on_break': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
//       case 'travelling': return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
//       default: return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
//     }
//   };

//   const centerOnTechnician = (tech) => {
//     if (map && tech && tech.location && tech.location.lat && tech.location.lng) {
//       map.setCenter({ lat: tech.location.lat, lng: tech.location.lng });
//       map.setZoom(15);
//       setSelectedTech(tech);
//     }
//   };

//   // Calculate online technicians safely
//   const onlineCount = Array.isArray(technicians) 
//     ? technicians.filter(t => t && t.isOnline).length 
//     : 0;

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
//         <p className="text-gray-500 mt-1">Real-time technician location tracking</p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Technician List */}
//         <Card className="lg:col-span-1 p-4">
//           <h3 className="font-semibold mb-3">
//             Online Technicians ({onlineCount})
//           </h3>
//           <div className="space-y-2 max-h-[500px] overflow-y-auto">
//             {Array.isArray(technicians) && technicians.length > 0 ? (
//               technicians.map(tech => {
//                 if (!tech || !tech.technician) return null;
//                 return (
//                   <div
//                     key={tech.technician.id || tech.id}
//                     className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                       selectedTech?.technician?.id === tech.technician?.id
//                         ? 'bg-blue-50 border border-blue-200'
//                         : 'hover:bg-gray-50 border border-transparent'
//                     }`}
//                     onClick={() => centerOnTechnician(tech)}
//                   >
//                     <div className="flex items-center justify-between">
//                       <div className="flex items-center space-x-2">
//                         <div className={`w-2 h-2 rounded-full ${tech.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
//                         <span className="font-medium">{tech.technician?.name || 'Unknown'}</span>
//                       </div>
//                       <span className="text-xs text-gray-500">
//                         {tech.location?.speed ? `${tech.location.speed} km/h` : 'Stationary'}
//                       </span>
//                     </div>
//                     <p className="text-xs text-gray-400 mt-1">
//                       Status: {tech.status || 'Unknown'}
//                     </p>
//                     <p className="text-xs text-gray-400">
//                       Last update: {tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
//                     </p>
//                   </div>
//                 );
//               })
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 No technicians available
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Map */}
//         <Card className="lg:col-span-3 overflow-hidden p-0">
//           {mapLoaded ? (
//             <div id="map" style={{ width: '100%', height: '500px' }} />
//           ) : (
//             <div className="flex justify-center items-center h-[500px] bg-gray-100">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading map...</p>
//               </div>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LiveTracking;







// // client/src/pages/tracking/LiveTracking.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { trackingApi } from '../../api/tracking.api';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// // Load Google Maps script
// const loadGoogleMapsScript = () => {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve();
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// };

// const LiveTracking = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { socket } = useTaskSocket();
//   const [technicians, setTechnicians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedTech, setSelectedTech] = useState(null);
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState({});
//   const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 });

//   useEffect(() => {
//     loadGoogleMapsScript()
//       .then(() => setMapLoaded(true))
//       .catch((err) => {
//         console.error('Failed to load Google Maps:', err);
//         showToast('Failed to load Google Maps', 'error');
//       });
//   }, []);

//   const fetchTechnicians = useCallback(async () => {
//     try {
//       setError(null);
//       const response = await trackingApi.getLiveLocations();
      
//       console.log('API Response:', response);
      
//       // Extract technicians data from response
//       let techniciansData = [];
      
//       if (response && response.success && Array.isArray(response.data)) {
//         techniciansData = response.data;
//       } else if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
//         techniciansData = response.data.data;
//       } else if (response && response.data && Array.isArray(response.data)) {
//         techniciansData = response.data;
//       } else if (response && Array.isArray(response)) {
//         techniciansData = response;
//       } else if (response && response.data && response.data.data && response.data.data.technicians) {
//         techniciansData = response.data.data.technicians;
//       }
      
//       console.log('Extracted technicians data:', techniciansData);
      
//       // Validate and format technicians data
//       const validTechnicians = techniciansData.filter(tech => {
//         if (!tech) return false;
        
//         // Ensure technician has required fields
//         if (!tech.technician && !tech.id) return false;
        
//         // Ensure location exists
//         if (!tech.location || typeof tech.location.lat === 'undefined' || typeof tech.location.lng === 'undefined') {
//           console.warn('Technician missing location:', tech);
//           return false;
//         }
        
//         return true;
//       });
      
//       console.log(`Valid technicians: ${validTechnicians.length}`);
//       setTechnicians(validTechnicians);
      
//       // Auto-center on first technician if available
//       if (validTechnicians.length > 0 && validTechnicians[0].location) {
//         setCenter({
//           lat: validTechnicians[0].location.lat,
//           lng: validTechnicians[0].location.lng
//         });
//       }
      
//     } catch (error) {
//       console.error('Failed to fetch technician locations:', error);
//       setError(error.message || 'Failed to fetch locations');
//       showToast('Failed to fetch technician locations', 'error');
//       setTechnicians([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   useEffect(() => {
//     fetchTechnicians();
//     const interval = setInterval(fetchTechnicians, 10000);
//     return () => clearInterval(interval);
//   }, [fetchTechnicians]);

//   // Socket listeners for real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     socket.on('technician:location', (data) => {
//       console.log('Real-time location update:', data);
//       setTechnicians(prev => 
//         prev.map(tech => 
//           (tech.technician?.id === data.userId || tech.id === data.userId)
//             ? { ...tech, location: data.location, lastUpdate: new Date() }
//             : tech
//         )
//       );
      
//       // Update marker if map is loaded
//       if (map && markers[data.userId] && window.google) {
//         const position = new window.google.maps.LatLng(data.location.lat, data.location.lng);
//         markers[data.userId].setPosition(position);
//       }
//     });

//     socket.on('technician:offline', (data) => {
//       console.log('Technician offline:', data);
//       setTechnicians(prev =>
//         prev.map(tech =>
//           (tech.technician?.id === data.userId || tech.id === data.userId)
//             ? { ...tech, isOnline: false }
//             : tech
//         )
//       );
//     });

//     return () => {
//       socket.off('technician:location');
//       socket.off('technician:offline');
//     };
//   }, [socket, map, markers]);

//   // Initialize map
//   useEffect(() => {
//     if (!mapLoaded || !document.getElementById('map') || !window.google) return;

//     try {
//       const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//         center,
//         zoom: 12,
//         styles: [
//           {
//             featureType: 'poi',
//             elementType: 'labels',
//             stylers: [{ visibility: 'off' }]
//           }
//         ]
//       });
//       setMap(mapInstance);
//     } catch (error) {
//       console.error('Error initializing map:', error);
//       showToast('Failed to initialize map', 'error');
//     }
//   }, [mapLoaded]);

//   // Update markers when technicians change
//   useEffect(() => {
//     if (!map || !window.google) return;

//     // Clear existing markers
//     Object.values(markers).forEach(marker => {
//       if (marker && marker.setMap) {
//         marker.setMap(null);
//       }
//     });
    
//     const newMarkers = {};
    
//     technicians.forEach(tech => {
//       if (!tech || !tech.location) return;
      
//       try {
//         const isOnline = tech.isOnline !== false;
//         const status = tech.status || 'active';
        
//         const icon = getMarkerIcon(status, isOnline);
//         const marker = new window.google.maps.Marker({
//           position: { lat: tech.location.lat, lng: tech.location.lng },
//           map,
//           icon,
//           title: tech.technician?.name || tech.name || 'Technician'
//         });
        
//         const infoWindow = new window.google.maps.InfoWindow({
//           content: `
//             <div style="padding: 8px; min-width: 150px;">
//               <strong>${tech.technician?.name || tech.name || 'Unknown'}</strong><br/>
//               <strong>${tech.technician?.role || tech.role || 'Technician'}</strong><br/>
//               Status: ${status}<br/>
//               Speed: ${tech.location.speed || 0} km/h<br/>
//               Last update: ${tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
//             </div>
//           `
//         });
        
//         marker.addListener('click', () => {
//           infoWindow.open(map, marker);
//           setSelectedTech(tech);
//         });
        
//         newMarkers[tech.technician?.id || tech.id] = marker;
//       } catch (error) {
//         console.error('Error creating marker:', error);
//       }
//     });
    
//     setMarkers(newMarkers);
//   }, [technicians, map]);

//   const getMarkerIcon = (status, isOnline) => {
//     if (!isOnline) return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
//     switch(status) {
//       case 'active': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
//       case 'on_break': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
//       case 'travelling': return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
//       default: return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
//     }
//   };

//   const centerOnTechnician = (tech) => {
//     if (map && tech && tech.location) {
//       map.setCenter({ lat: tech.location.lat, lng: tech.location.lng });
//       map.setZoom(15);
//       setSelectedTech(tech);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   const onlineCount = technicians.filter(t => t && t.isOnline !== false).length;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
//         <p className="text-gray-500 mt-1">Real-time technician location tracking</p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           <p className="font-medium">Error: {error}</p>
//           <p className="text-sm mt-1">Please check if technicians have enabled location sharing.</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Technician List */}
//         <Card className="lg:col-span-1 p-4">
//           <h3 className="font-semibold mb-3">
//             Online Technicians ({onlineCount})
//           </h3>
//           <div className="space-y-2 max-h-[500px] overflow-y-auto">
//             {technicians.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <div className="text-4xl mb-2">📍</div>
//                 <p>No technicians available</p>
//                 <p className="text-xs mt-1">Technicians need to enable location sharing</p>
//               </div>
//             ) : (
//               technicians.map(tech => (
//                 <div
//                   key={tech.technician?.id || tech.id}
//                   className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                     selectedTech?.technician?.id === tech.technician?.id
//                       ? 'bg-blue-50 border border-blue-200'
//                       : 'hover:bg-gray-50 border border-transparent'
//                   }`}
//                   onClick={() => centerOnTechnician(tech)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <div className={`w-2 h-2 rounded-full ${tech.isOnline !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
//                       <span className="font-medium">{tech.technician?.name || tech.name || 'Unknown'}</span>
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {tech.location?.speed ? `${tech.location.speed} km/h` : 'Stationary'}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Status: {tech.status || 'Active'}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     Last update: {tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>

//         {/* Map */}
//         <Card className="lg:col-span-3 overflow-hidden p-0">
//           {mapLoaded ? (
//             <div id="map" style={{ width: '100%', height: '500px' }} />
//           ) : (
//             <div className="flex justify-center items-center h-[500px] bg-gray-100">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading map...</p>
//               </div>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LiveTracking;





// // client/src/pages/tracking/LiveTracking.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { trackingApi } from '../../api/tracking.api';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import { useToast } from '../../hooks/useToast';
// import { useAuth } from '../../hooks/useAuth';

// // Load Google Maps script
// const loadGoogleMapsScript = () => {
//   return new Promise((resolve, reject) => {
//     if (window.google && window.google.maps) {
//       resolve();
//       return;
//     }
//     const script = document.createElement('script');
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
//     script.async = true;
//     script.defer = true;
//     script.onload = resolve;
//     script.onerror = reject;
//     document.head.appendChild(script);
//   });
// };

// const LiveTracking = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { socket } = useTaskSocket();
//   const [technicians, setTechnicians] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedTech, setSelectedTech] = useState(null);
//   const [map, setMap] = useState(null);
//   const [markers, setMarkers] = useState({});
//   const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 });

//   useEffect(() => {
//     loadGoogleMapsScript()
//       .then(() => setMapLoaded(true))
//       .catch((err) => {
//         console.error('Failed to load Google Maps:', err);
//         showToast('Failed to load Google Maps', 'error');
//       });
//   }, []);

//   const fetchTechnicians = useCallback(async () => {
//     try {
//       setError(null);
//       const response = await trackingApi.getLiveLocations();
      
//       console.log('API Response:', response);
      
//       // Extract technicians data from response
//       let techniciansData = [];
      
//       if (response && response.success && Array.isArray(response.data)) {
//         techniciansData = response.data;
//       } else if (response && response.data && response.data.success && Array.isArray(response.data.data)) {
//         techniciansData = response.data.data;
//       } else if (response && response.data && Array.isArray(response.data)) {
//         techniciansData = response.data;
//       } else if (response && Array.isArray(response)) {
//         techniciansData = response;
//       }
      
//       console.log('Raw technicians data:', techniciansData);
      
//       // Transform and validate technicians data
//       const validTechnicians = techniciansData.map(tech => {
//         // Handle different data structures
//         let transformedTech = {};
        
//         // Extract technician info
//         if (tech.technician) {
//           // Structure: { technician: { id, name, role }, location: { lat, lng }, ... }
//           transformedTech.id = tech.technician.id || tech.technician._id;
//           transformedTech.name = tech.technician.name || tech.technician.firstName + ' ' + (tech.technician.lastName || '');
//           transformedTech.role = tech.technician.role || 'Technician';
//           transformedTech.avatar = tech.technician.avatar || tech.technician.profileImage;
//         } else {
//           // Structure: { id, name, role, location, ... }
//           transformedTech.id = tech.id || tech._id;
//           transformedTech.name = tech.name || (tech.firstName + ' ' + (tech.lastName || '')) || 'Technician';
//           transformedTech.role = tech.role || 'Technician';
//           transformedTech.avatar = tech.avatar || tech.profileImage;
//         }
        
//         // Extract location
//         if (tech.location) {
//           transformedTech.location = {
//             lat: parseFloat(tech.location.lat),
//             lng: parseFloat(tech.location.lng),
//             accuracy: tech.location.accuracy || 10,
//             speed: tech.location.speed || 0,
//             heading: tech.location.heading || 0
//           };
//         } else if (tech.lat && tech.lng) {
//           transformedTech.location = {
//             lat: parseFloat(tech.lat),
//             lng: parseFloat(tech.lng),
//             accuracy: tech.accuracy || 10,
//             speed: tech.speed || 0,
//             heading: tech.heading || 0
//           };
//         }
        
//         // Extract other fields
//         transformedTech.status = tech.status || 'active';
//         transformedTech.isOnline = tech.isOnline !== false;
//         transformedTech.lastUpdate = tech.lastUpdate || tech.lastSeen || tech.timestamp || new Date().toISOString();
//         transformedTech.taskId = tech.taskId || tech.currentTask;
        
//         return transformedTech;
//       }).filter(tech => {
//         // Only keep technicians with valid location
//         if (!tech.location || !tech.location.lat || !tech.location.lng) {
//           console.warn('Technician missing location:', tech);
//           return false;
//         }
//         return true;
//       });
      
//       console.log('Valid technicians after transformation:', validTechnicians);
//       setTechnicians(validTechnicians);
      
//       // Auto-center on first technician if available
//       if (validTechnicians.length > 0 && validTechnicians[0].location) {
//         setCenter({
//           lat: validTechnicians[0].location.lat,
//           lng: validTechnicians[0].location.lng
//         });
//         // Also center the map if it exists
//         if (map) {
//           map.setCenter({ lat: validTechnicians[0].location.lat, lng: validTechnicians[0].location.lng });
//           map.setZoom(14);
//         }
//       }
      
//     } catch (error) {
//       console.error('Failed to fetch technician locations:', error);
//       setError(error.message || 'Failed to fetch locations');
//       showToast('Failed to fetch technician locations', 'error');
//       setTechnicians([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [map, showToast]);

//   useEffect(() => {
//     fetchTechnicians();
//     const interval = setInterval(fetchTechnicians, 10000);
//     return () => clearInterval(interval);
//   }, [fetchTechnicians]);

//   // Socket listeners for real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleLocationUpdate = (data) => {
//       console.log('Real-time location update:', data);
//       setTechnicians(prev => 
//         prev.map(tech => {
//           if (tech.id === data.userId || tech.id === data.technicianId) {
//             return {
//               ...tech,
//               location: data.location,
//               lastUpdate: new Date().toISOString()
//             };
//           }
//           return tech;
//         })
//       );
      
//       // Update marker if map is loaded
//       if (map && markers[data.userId] && window.google) {
//         const position = new window.google.maps.LatLng(data.location.lat, data.location.lng);
//         markers[data.userId].setPosition(position);
//       }
//     };

//     socket.on('technician:location', handleLocationUpdate);
//     socket.on('location:update', handleLocationUpdate);

//     socket.on('technician:offline', (data) => {
//       setTechnicians(prev =>
//         prev.map(tech =>
//           tech.id === data.userId || tech.id === data.technicianId
//             ? { ...tech, isOnline: false }
//             : tech
//         )
//       );
//     });

//     return () => {
//       socket.off('technician:location', handleLocationUpdate);
//       socket.off('location:update', handleLocationUpdate);
//       socket.off('technician:offline');
//     };
//   }, [socket, map, markers]);

//   // Initialize map
//   useEffect(() => {
//     if (!mapLoaded || !document.getElementById('map') || !window.google) return;

//     try {
//       const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
//         center,
//         zoom: 12,
//         styles: [
//           {
//             featureType: 'poi',
//             elementType: 'labels',
//             stylers: [{ visibility: 'off' }]
//           }
//         ]
//       });
//       setMap(mapInstance);
//     } catch (error) {
//       console.error('Error initializing map:', error);
//       showToast('Failed to initialize map', 'error');
//     }
//   }, [mapLoaded, center]);

//   // Update markers when technicians change
//   useEffect(() => {
//     if (!map || !window.google) return;

//     // Clear existing markers
//     Object.values(markers).forEach(marker => {
//       if (marker && marker.setMap) {
//         marker.setMap(null);
//       }
//     });
    
//     const newMarkers = {};
    
//     technicians.forEach(tech => {
//       if (!tech || !tech.location) return;
      
//       try {
//         const isOnline = tech.isOnline !== false;
//         const status = tech.status || 'active';
        
//         const icon = getMarkerIcon(status, isOnline);
//         const marker = new window.google.maps.Marker({
//           position: { lat: tech.location.lat, lng: tech.location.lng },
//           map,
//           icon,
//           title: tech.name || 'Technician'
//         });
        
//         const infoWindow = new window.google.maps.InfoWindow({
//           content: `
//             <div style="padding: 8px; min-width: 150px;">
//               <strong>${tech.name || 'Unknown Technician'}</strong><br/>
//               <strong>${tech.role || 'Technician'}</strong><br/>
//               Status: ${status}<br/>
//               Speed: ${tech.location.speed || 0} km/h<br/>
//               Last update: ${tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
//             </div>
//           `
//         });
        
//         marker.addListener('click', () => {
//           infoWindow.open(map, marker);
//           setSelectedTech(tech);
//         });
        
//         newMarkers[tech.id] = marker;
//       } catch (error) {
//         console.error('Error creating marker:', error);
//       }
//     });
    
//     setMarkers(newMarkers);
//   }, [technicians, map]);

//   const getMarkerIcon = (status, isOnline) => {
//     if (!isOnline) return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
//     switch(status) {
//       case 'active': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
//       case 'on_break': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
//       case 'travelling': return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
//       default: return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
//     }
//   };

//   const centerOnTechnician = (tech) => {
//     if (map && tech && tech.location) {
//       map.setCenter({ lat: tech.location.lat, lng: tech.location.lng });
//       map.setZoom(15);
//       setSelectedTech(tech);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   const onlineCount = technicians.filter(t => t && t.isOnline !== false).length;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
//         <p className="text-gray-500 mt-1">Real-time technician location tracking</p>
//       </div>

//       {error && (
//         <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
//           <p className="font-medium">Error: {error}</p>
//           <p className="text-sm mt-1">Please check if technicians have enabled location sharing.</p>
//         </div>
//       )}

//       <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
//         {/* Technician List */}
//         <Card className="lg:col-span-1 p-4">
//           <h3 className="font-semibold mb-3">
//             Online Technicians ({onlineCount})
//           </h3>
//           <div className="space-y-2 max-h-[500px] overflow-y-auto">
//             {technicians.length === 0 ? (
//               <div className="text-center py-8 text-gray-500">
//                 <div className="text-4xl mb-2">📍</div>
//                 <p>No technicians available</p>
//                 <p className="text-xs mt-1">Technicians need to enable location sharing</p>
//               </div>
//             ) : (
//               technicians.map(tech => (
//                 <div
//                   key={tech.id}
//                   className={`p-3 rounded-lg cursor-pointer transition-colors ${
//                     selectedTech?.id === tech.id
//                       ? 'bg-blue-50 border border-blue-200'
//                       : 'hover:bg-gray-50 border border-transparent'
//                   }`}
//                   onClick={() => centerOnTechnician(tech)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <div className={`w-2 h-2 rounded-full ${tech.isOnline !== false ? 'bg-green-500' : 'bg-gray-400'}`} />
//                       <span className="font-medium">{tech.name || 'Unknown Technician'}</span>
//                     </div>
//                     <span className="text-xs text-gray-500">
//                       {tech.location?.speed ? `${tech.location.speed} km/h` : 'Stationary'}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-400 mt-1">
//                     Status: {tech.status || 'Active'}
//                   </p>
//                   <p className="text-xs text-gray-400">
//                     Last update: {tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
//                   </p>
//                 </div>
//               ))
//             )}
//           </div>
//         </Card>

//         {/* Map */}
//         <Card className="lg:col-span-3 overflow-hidden p-0">
//           {mapLoaded ? (
//             <div id="map" style={{ width: '100%', height: '500px' }} />
//           ) : (
//             <div className="flex justify-center items-center h-[500px] bg-gray-100">
//               <div className="text-center">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
//                 <p className="mt-2 text-gray-600">Loading map...</p>
//               </div>
//             </div>
//           )}
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default LiveTracking;





// client/src/pages/tracking/LiveTracking.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { trackingApi } from '../../api/tracking.api';
import { useTaskSocket } from '../../hooks/useTaskSocket';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

// Load Google Maps script once
let googleMapsPromise = null;

const loadGoogleMapsScript = () => {
  if (googleMapsPromise) return googleMapsPromise;
  
  googleMapsPromise = new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return googleMapsPromise;
};

const LiveTracking = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { socket } = useTaskSocket();
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});
  const mapInstanceRef = useRef(null);
  const isMapInitializedRef = useRef(false);
  const fetchIntervalRef = useRef(null);
  const [center, setCenter] = useState({ lat: 25.2048, lng: 55.2708 });

  // Load Google Maps script once on mount
  useEffect(() => {
    loadGoogleMapsScript()
      .then(() => setMapLoaded(true))
      .catch((err) => {
        console.error('Failed to load Google Maps:', err);
        setError('Failed to load Google Maps. Please refresh the page.');
        showToast('Failed to load Google Maps', 'error');
      });
  }, []);

  // Initialize map when mapLoaded becomes true
  useEffect(() => {
    if (!mapLoaded || !document.getElementById('map') || !window.google || isMapInitializedRef.current) return;

    try {
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center,
        zoom: 12,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ],
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
        zoomControl: true
      });
      
      mapInstanceRef.current = mapInstance;
      isMapInitializedRef.current = true;
      
      // Small delay to ensure map is ready
      setTimeout(() => {
        if (technicians.length > 0 && technicians[0].location) {
          mapInstance.setCenter({ lat: technicians[0].location.lat, lng: technicians[0].location.lng });
          mapInstance.setZoom(14);
        }
      }, 500);
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setError('Failed to initialize map');
      showToast('Failed to initialize map', 'error');
    }
  }, [mapLoaded, center]);

  const transformTechnicianData = useCallback((techData) => {
    // Extract technician info
    let id, name, role;
    
    if (techData.technician) {
      id = techData.technician.id || techData.technician._id;
      name = techData.technician.name || 
             (techData.technician.firstName ? `${techData.technician.firstName} ${techData.technician.lastName || ''}`.trim() : null) ||
             'Technician';
      role = techData.technician.role || 'Technician';
    } else {
      id = techData.id || techData._id;
      name = techData.name || 
             (techData.firstName ? `${techData.firstName} ${techData.lastName || ''}`.trim() : null) ||
             'Technician';
      role = techData.role || 'Technician';
    }
    
    // Extract location
    let location = null;
    if (techData.location) {
      location = {
        lat: parseFloat(techData.location.lat),
        lng: parseFloat(techData.location.lng),
        accuracy: techData.location.accuracy || 10,
        speed: techData.location.speed || 0,
        heading: techData.location.heading || 0
      };
    } else if (techData.lat && techData.lng) {
      location = {
        lat: parseFloat(techData.lat),
        lng: parseFloat(techData.lng),
        accuracy: techData.accuracy || 10,
        speed: techData.speed || 0,
        heading: techData.heading || 0
      };
    }
    
    return {
      id,
      name: name || 'Technician',
      role: role || 'Technician',
      location,
      status: techData.status || 'active',
      isOnline: techData.isOnline !== false,
      lastUpdate: techData.lastUpdate || techData.lastSeen || techData.timestamp || new Date().toISOString(),
      taskId: techData.taskId || techData.currentTask
    };
  }, []);

  const fetchTechnicians = useCallback(async () => {
    try {
      const response = await trackingApi.getLiveLocations();
      
      let techniciansData = [];
      
      if (response?.success && Array.isArray(response.data)) {
        techniciansData = response.data;
      } else if (response?.data?.success && Array.isArray(response.data.data)) {
        techniciansData = response.data.data;
      } else if (response?.data && Array.isArray(response.data)) {
        techniciansData = response.data;
      }
      
      const validTechnicians = techniciansData
        .map(tech => transformTechnicianData(tech))
        .filter(tech => tech.location && tech.location.lat && tech.location.lng);
      
      setTechnicians(validTechnicians);
      
      // Update markers on map
      updateMarkers(validTechnicians);
      
      // Auto-center on first technician
      if (validTechnicians.length > 0 && validTechnicians[0].location && mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ 
          lat: validTechnicians[0].location.lat, 
          lng: validTechnicians[0].location.lng 
        });
        mapInstanceRef.current.setZoom(14);
      }
      
    } catch (error) {
      console.error('Failed to fetch technician locations:', error);
      if (error.code !== 'ECONNABORTED') {
        setError(error.message || 'Failed to fetch locations');
      }
    } finally {
      setLoading(false);
    }
  }, [transformTechnicianData]);

  // Update markers on map
  const updateMarkers = useCallback((techList) => {
    if (!mapInstanceRef.current || !window.google) return;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      if (marker && marker.setMap) {
        marker.setMap(null);
      }
    });
    
    const newMarkers = {};
    
    techList.forEach(tech => {
      if (!tech.location) return;
      
      try {
        const isOnline = tech.isOnline !== false;
        const status = tech.status || 'active';
        
        const iconUrl = getMarkerIconUrl(status, isOnline);
        const marker = new window.google.maps.Marker({
          position: { lat: tech.location.lat, lng: tech.location.lng },
          map: mapInstanceRef.current,
          icon: iconUrl,
          title: tech.name || 'Technician'
        });
        
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px; min-width: 150px;">
              <strong>${tech.name || 'Unknown Technician'}</strong><br/>
              <strong>${tech.role || 'Technician'}</strong><br/>
              Status: ${status}<br/>
              Speed: ${tech.location.speed || 0} km/h<br/>
              Last update: ${new Date(tech.lastUpdate).toLocaleTimeString()}
            </div>
          `
        });
        
        marker.addListener('click', () => {
          infoWindow.open(mapInstanceRef.current, marker);
          setSelectedTech(tech);
        });
        
        newMarkers[tech.id] = marker;
      } catch (error) {
        console.error('Error creating marker:', error);
      }
    });
    
    markersRef.current = newMarkers;
  }, []);

  const getMarkerIconUrl = (status, isOnline) => {
    if (!isOnline) return 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png';
    switch(status) {
      case 'active': return 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
      case 'on_break': return 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
      case 'travelling': return 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
      default: return 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchTechnicians();
    
    fetchIntervalRef.current = setInterval(fetchTechnicians, 15000);
    
    return () => {
      if (fetchIntervalRef.current) {
        clearInterval(fetchIntervalRef.current);
      }
      // Clear markers on unmount
      Object.values(markersRef.current).forEach(marker => {
        if (marker && marker.setMap) {
          marker.setMap(null);
        }
      });
    };
  }, [fetchTechnicians]);

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (data) => {
      console.log('Real-time location update:', data);
      setTechnicians(prev => {
        const updated = prev.map(tech => {
          if (tech.id === data.userId || tech.id === data.technicianId) {
            return {
              ...tech,
              location: data.location,
              lastUpdate: new Date().toISOString()
            };
          }
          return tech;
        });
        // Update markers after state update
        setTimeout(() => updateMarkers(updated), 100);
        return updated;
      });
    };

    socket.on('technician:location', handleLocationUpdate);
    socket.on('location:update', handleLocationUpdate);

    socket.on('technician:offline', (data) => {
      setTechnicians(prev => {
        const updated = prev.map(tech =>
          tech.id === data.userId || tech.id === data.technicianId
            ? { ...tech, isOnline: false }
            : tech
        );
        setTimeout(() => updateMarkers(updated), 100);
        return updated;
      });
    });

    return () => {
      socket.off('technician:location', handleLocationUpdate);
      socket.off('location:update', handleLocationUpdate);
      socket.off('technician:offline');
    };
  }, [socket, updateMarkers]);

  const centerOnTechnician = useCallback((tech) => {
    if (mapInstanceRef.current && tech && tech.location) {
      mapInstanceRef.current.setCenter({ lat: tech.location.lat, lng: tech.location.lng });
      mapInstanceRef.current.setZoom(15);
      setSelectedTech(tech);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  const onlineCount = technicians.filter(t => t && t.isOnline !== false).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Live Tracking</h1>
        <p className="text-gray-500 mt-1">Real-time technician location tracking</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="font-medium">Error: {error}</p>
          <p className="text-sm mt-1">Please refresh the page and try again.</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Technician List */}
        <Card className="lg:col-span-1 p-4">
          <h3 className="font-semibold mb-3">
            Online Technicians ({onlineCount})
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {technicians.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">📍</div>
                <p>No technicians available</p>
                <p className="text-xs mt-1">Technicians need to enable location sharing</p>
              </div>
            ) : (
              technicians.map(tech => (
                <div
                  key={tech.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedTech?.id === tech.id
                      ? 'bg-blue-50 border border-blue-200'
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                  onClick={() => centerOnTechnician(tech)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${tech.isOnline !== false ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                      <span className="font-medium">{tech.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {tech.location?.speed ? `${tech.location.speed} km/h` : 'Stationary'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Status: <span className="capitalize">{tech.status}</span>
                  </p>
                  <p className="text-xs text-gray-400">
                    Last update: {tech.lastUpdate ? new Date(tech.lastUpdate).toLocaleTimeString() : 'Just now'}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Map */}
        <Card className="lg:col-span-3 overflow-hidden p-0">
          <div 
            id="map" 
            ref={mapRef}
            style={{ width: '100%', height: '500px' }}
          />
          {!mapLoaded && (
            <div className="flex justify-center items-center h-[500px] bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading map...</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LiveTracking;