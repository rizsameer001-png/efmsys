// client/src/pages/buildings/BuildingHierarchy.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

const BuildingHierarchy = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [hierarchy, setHierarchy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedFloors, setExpandedFloors] = useState({});

  useEffect(() => {
    fetchHierarchy();
  }, [id]);

  const fetchHierarchy = async () => {
    try {
      const response = await buildingApi.getBuildingHierarchy(id);
      setHierarchy(response.data.data);
    } catch (error) {
      showToast('Failed to load building hierarchy', 'error');
      navigate('/buildings');
    } finally {
      setLoading(false);
    }
  };

  const toggleFloor = (floorNumber) => {
    setExpandedFloors(prev => ({
      ...prev,
      [floorNumber]: !prev[floorNumber]
    }));
  };

  const getOccupancyBadge = (status) => {
    const badges = {
      vacant: 'bg-gray-100 text-gray-800',
      owner_occupied: 'bg-green-100 text-green-800',
      tenant_occupied: 'bg-blue-100 text-blue-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || badges.vacant;
  };

  if (loading) return <Spinner />;
  if (!hierarchy) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{hierarchy.building.name}</h1>
          <p className="text-gray-500">Building Hierarchy View</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/buildings/${id}/units`)}>
          Manage Units
        </Button>
      </div>

      {/* Building Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600">{hierarchy.building.statistics?.totalFloors || 0}</p>
            <p className="text-sm text-gray-500">Total Floors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{hierarchy.building.statistics?.totalUnits || 0}</p>
            <p className="text-sm text-gray-500">Total Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-600">{hierarchy.building.statistics?.occupiedUnits || 0}</p>
            <p className="text-sm text-gray-500">Occupied Units</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{hierarchy.building.statistics?.vacantUnits || 0}</p>
            <p className="text-sm text-gray-500">Vacant Units</p>
          </div>
        </div>
      </div>

      {/* Floor Hierarchy */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold">Floor & Unit Hierarchy</h2>
        </div>
        
        {hierarchy.floors.map((floor) => (
          <div key={floor.floorNumber} className="border-b last:border-b-0">
            <button
              onClick={() => toggleFloor(floor.floorNumber)}
              className="w-full px-6 py-3 flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedFloors[floor.floorNumber] ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="font-semibold text-lg">Floor {floor.floorNumber}</span>
                <span className="text-sm text-gray-500">({floor.unitCount} units)</span>
              </div>
            </button>
            
            {expandedFloors[floor.floorNumber] && (
              <div className="px-6 pb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {floor.units.map((unit) => (
                    <div
                      key={unit.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => navigate(`/units/${unit.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold text-lg">Unit {unit.unitNumber}</h4>
                          <p className="text-sm text-gray-500">{unit.unitType}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getOccupancyBadge(unit.occupancyStatus)}`}>
                          {unit.occupancyStatus?.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="mt-3 text-sm">
                        {unit.area && (
                          <p className="text-gray-600">Area: {unit.area.value} {unit.area.unit}</p>
                        )}
                        {unit.ownerName && (
                          <p className="text-gray-600">Owner: {unit.ownerName}</p>
                        )}
                        {unit.isRented && unit.tenantName && (
                          <p className="text-gray-600">Tenant: {unit.tenantName}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuildingHierarchy;