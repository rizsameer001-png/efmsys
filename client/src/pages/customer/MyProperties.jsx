// client/src/pages/customer/MyProperties.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyApi } from '../../api/property.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const MyProperties = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [units, setUnits] = useState([]);

  useEffect(() => {
    fetchMyProperties();
  }, []);

  const fetchMyProperties = async () => {
    setLoading(true);
    try {
      const response = await propertyApi.getMyProperties();
      if (response.data.success) {
        setProperties(response.data.data);
      }
    } catch (error) {
      console.error('Fetch properties error:', error);
      showToast('Failed to load properties', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchPropertyUnits = async (propertyId) => {
    try {
      const response = await propertyApi.getPropertyUnits(propertyId);
      if (response.data.success) {
        setUnits(response.data.data);
      }
    } catch (error) {
      console.error('Fetch units error:', error);
      showToast('Failed to load units', 'error');
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    fetchPropertyUnits(property.id);
  };

  const getPropertyTypeIcon = (type) => {
    const icons = {
      residential: '🏠',
      commercial: '🏢',
      office: '💼',
      mall: '🛍️',
      hospital: '🏥',
      hotel: '🏨',
      industrial: '🏭'
    };
    return icons[type] || '🏢';
  };

  const getUnitStatusBadge = (status) => {
    const badges = {
      owner_occupied: 'bg-green-100 text-green-800',
      tenant_occupied: 'bg-blue-100 text-blue-800',
      vacant: 'bg-gray-100 text-gray-800',
      maintenance: 'bg-yellow-100 text-yellow-800'
    };
    return badges[status] || badges.vacant;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED' }).format(amount || 0);
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
        <p className="text-gray-500 mt-1">View and manage your properties and units</p>
      </div>

      {/* Properties Grid */}
      {properties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Property Header */}
              <div className="relative h-32 bg-gradient-to-r from-blue-500 to-indigo-600 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-3xl mb-1">{getPropertyTypeIcon(property.type)}</div>
                    <h3 className="font-bold text-lg">{property.name}</h3>
                    <p className="text-xs opacity-90">{property.code}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    property.status === 'active' ? 'bg-green-500' : 'bg-gray-500'
                  }`}>
                    {property.status}
                  </span>
                </div>
              </div>
              
              {/* Property Details */}
              <div className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>{property.address?.city}, {property.address?.country}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Floors:</span>
                    <span className="font-medium">{property.statistics?.totalFloors || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Units:</span>
                    <span className="font-medium">{property.statistics?.totalUnits || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Occupied Units:</span>
                    <span className="font-medium text-green-600">{property.statistics?.occupiedUnits || 0}</span>
                  </div>
                </div>
                
                <div className="mt-4 pt-3 border-t">
                  <button
                    onClick={() => handleViewProperty(property)}
                    className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500">No properties found</p>
          <p className="text-sm text-gray-400 mt-1">You don't have any properties assigned yet.</p>
          <Link to="/contact" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Contact Admin →
          </Link>
        </Card>
      )}

      {/* Property Details Modal */}
      {selectedProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{selectedProperty.name}</h2>
                <p className="text-sm text-gray-500">{selectedProperty.code}</p>
              </div>
              <button
                onClick={() => setSelectedProperty(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {/* Property Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Type:</span>
                      <span className="capitalize">{selectedProperty.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span className="capitalize">{selectedProperty.status}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Floors:</span>
                      <span>{selectedProperty.statistics?.totalFloors || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Units:</span>
                      <span>{selectedProperty.statistics?.totalUnits || 0}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Address</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{selectedProperty.address?.street}</p>
                    <p>{selectedProperty.address?.city}, {selectedProperty.address?.state}</p>
                    <p>{selectedProperty.address?.country} - {selectedProperty.address?.zipCode}</p>
                  </div>
                </div>
              </div>
              
              {/* Units Section */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Units in this Property</h3>
                {units.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Unit Number</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Floor</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Area</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                          <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {units.map((unit) => (
                          <tr key={unit.id} className="hover:bg-gray-50">
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {unit.unitNumber}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              Floor {unit.floorNumber}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">
                              {unit.unitType}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {unit.details?.area?.value} {unit.details?.area?.unit || 'sqft'}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${getUnitStatusBadge(unit.occupancy?.status)}`}>
                                {unit.occupancy?.status?.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-sm">
                              <Link to={`/complaints/new?unitId=${unit.id}`}>
                                <button className="text-blue-600 hover:text-blue-800">
                                  Report Issue
                                </button>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No units found for this property
                  </div>
                )}
              </div>
              
              {/* Contact Info */}
              {selectedProperty.managementContact && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">Property Management Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Name</p>
                      <p className="font-medium">{selectedProperty.managementContact.name || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Phone</p>
                      <p className="font-medium">{selectedProperty.managementContact.phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Email</p>
                      <p className="font-medium">{selectedProperty.managementContact.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setSelectedProperty(null)}>
                Close
              </Button>
              <Link to="/complaints/new">
                <Button variant="primary">Raise Complaint</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProperties;