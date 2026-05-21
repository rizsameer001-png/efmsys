// client/src/pages/tracking/RouteHistory.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { trackingApi } from '../../api/tracking.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { formatDate, formatDateTime } from '../../utils/formatters';

const RouteHistory = () => {
  const { technicianId } = useParams();
  const { showToast } = useToast();
  const [routes, setRoutes] = useState([]);
  const [technician, setTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchRouteHistory();
  }, [technicianId, dateRange]);

  const fetchRouteHistory = async () => {
    setLoading(true);
    try {
      const response = await trackingApi.getRouteHistory(
        technicianId,
        dateRange.startDate,
        dateRange.endDate
      );
      setRoutes(response.data.data);
    } catch (error) {
      showToast('Failed to load route history', 'error');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (points) => {
    let distance = 0;
    for (let i = 1; i < points.length; i++) {
      distance += calculateDistanceBetweenPoints(
        points[i-1].lat, points[i-1].lng,
        points[i].lat, points[i].lng
      );
    }
    return (distance / 1000).toFixed(2);
  };

  const calculateDistanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const groupRoutesByDate = () => {
    const grouped = {};
    routes.forEach(route => {
      const date = new Date(route.timestamp).toISOString().split('T')[0];
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(route);
    });
    return grouped;
  };

  if (loading) return <Spinner />;

  const groupedRoutes = groupRoutesByDate();
  const totalDistance = calculateDistance(routes);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Route History</h1>
        <p className="text-gray-500 mt-1">View technician movement history</p>
      </div>

      {/* Date Range Filter */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="px-3 py-2 border rounded-lg"
            />
          </div>
          <Button onClick={fetchRouteHistory}>Apply Filter</Button>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{Object.keys(groupedRoutes).length}</p>
          <p className="text-sm text-gray-500">Active Days</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{totalDistance} km</p>
          <p className="text-sm text-gray-500">Total Distance</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{routes.length}</p>
          <p className="text-sm text-gray-500">Location Points</p>
        </Card>
      </div>

      {/* Route List */}
      {Object.entries(groupedRoutes).map(([date, dayRoutes]) => (
        <Card key={date} className="overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b">
            <h3 className="font-semibold">{formatDate(date)}</h3>
            <p className="text-sm text-gray-500">{dayRoutes.length} location points</p>
          </div>
          <div className="divide-y">
            {dayRoutes.slice(0, 20).map((route, idx) => (
              <div key={idx} className="px-4 py-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{formatDateTime(route.timestamp)}</span>
                  <span className="text-gray-500">
                    {route.speed ? `${route.speed} km/h` : 'Stationary'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  📍 {route.lat.toFixed(6)}, {route.lng.toFixed(6)}
                </div>
              </div>
            ))}
            {dayRoutes.length > 20 && (
              <div className="px-4 py-2 text-center text-gray-400 text-sm">
                +{dayRoutes.length - 20} more points
              </div>
            )}
          </div>
        </Card>
      ))}

      {routes.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-gray-500">No route data found for selected period</p>
        </Card>
      )}
    </div>
  );
};

export default RouteHistory;