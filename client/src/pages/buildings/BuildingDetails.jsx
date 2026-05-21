// client/src/pages/buildings/BuildingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const BuildingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchBuilding();
  }, [id]);

  const fetchBuilding = async () => {
    try {
      const response = await buildingApi.getBuildingById(id);
      setBuilding(response.data.data.building);
    } catch (error) {
      showToast('Failed to load building details', 'error');
      navigate('/buildings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this building?')) {
      try {
        await buildingApi.deleteBuilding(id);
        showToast('Building deleted successfully', 'success');
        navigate('/buildings');
      } catch (error) {
        showToast(error.response?.data?.error || 'Failed to delete building', 'error');
      }
    }
  };

  if (loading) return <Spinner />;
  if (!building) return null;

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'units', label: 'Units' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'statistics', label: 'Statistics' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{building.name}</h1>
          <p className="text-gray-500">Code: {building.code} | Type: {building.type}</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('building.update') && (
            <Button onClick={() => navigate(`/buildings/${id}/edit`)}>Edit</Button>
          )}
          {hasPermission('building.delete') && (
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          )}
          <Button variant="secondary" onClick={() => navigate(`/buildings/${id}/hierarchy`)}>
            View Hierarchy
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                building.status === 'active' ? 'bg-green-100 text-green-800' :
                building.status === 'maintenance' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {building.status?.toUpperCase()}
              </span>
            </div>

            {/* Address */}
            <div>
              <h3 className="text-lg font-medium mb-2">Address</h3>
              <p className="text-gray-600">
                {building.address?.street}<br />
                {building.address?.city}, {building.address?.state}<br />
                {building.address?.country} - {building.address?.zipCode}
              </p>
            </div>

            {/* Contact Info */}
            {building.contactInfo && (building.contactInfo.phone || building.contactInfo.email) && (
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Information</h3>
                {building.contactInfo.phone && <p>📞 {building.contactInfo.phone}</p>}
                {building.contactInfo.email && <p>✉️ {building.contactInfo.email}</p>}
                {building.contactInfo.website && <p>🌐 {building.contactInfo.website}</p>}
              </div>
            )}
          </div>
        )}

        {activeTab === 'units' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Units</h3>
              {hasPermission('building.create') && (
                <Button size="sm" onClick={() => navigate(`/units/new/${id}`)}>
                  + Add Unit
                </Button>
              )}
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={() => navigate(`/buildings/${id}/units`)}
            >
              Manage All Units →
            </Button>
          </div>
        )}

        {activeTab === 'contacts' && building.emergencyContacts?.length > 0 && (
          <div className="space-y-4">
            {building.emergencyContacts.map((contact, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.role}</p>
                    {contact.phone && <p className="text-sm">📞 {contact.phone}</p>}
                    {contact.email && <p className="text-sm">✉️ {contact.email}</p>}
                  </div>
                  {contact.isPrimary && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Primary
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{building.statistics?.totalFloers || 0}</p>
              <p className="text-sm text-gray-500">Total Floors</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{building.statistics?.totalUnits || 0}</p>
              <p className="text-sm text-gray-500">Total Units</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-orange-600">{building.statistics?.occupiedUnits || 0}</p>
              <p className="text-sm text-gray-500">Occupied Units</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">{building.parking?.totalSlots || 0}</p>
              <p className="text-sm text-gray-500">Parking Slots</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BuildingDetails;