// client/src/pages/buildings/UnitDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';

const UnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnit();
  }, [id]);

  const fetchUnit = async () => {
    try {
      const response = await buildingApi.getUnitById(id);
      setUnit(response.data.data);
    } catch (error) {
      showToast('Failed to load unit details', 'error');
      navigate('/buildings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      try {
        await buildingApi.deleteUnit(id);
        showToast('Unit deleted successfully', 'success');
        navigate(`/buildings/${unit?.buildingId?._id}/units`);
      } catch (error) {
        showToast('Failed to delete unit', 'error');
      }
    }
  };

  if (loading) return <Spinner />;
  if (!unit) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Unit {unit.unitNumber} - Floor {unit.floorNumber}
          </h1>
          <p className="text-gray-500">{unit.buildingId?.name} | {unit.unitType}</p>
        </div>
        <div className="flex gap-2">
          {hasPermission('building.update') && (
            <Button onClick={() => navigate(`/units/${id}/edit`)}>Edit</Button>
          )}
          {hasPermission('building.delete') && (
            <Button variant="danger" onClick={handleDelete}>Delete</Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit Details Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Unit Details</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Unit Number:</dt>
              <dd className="font-medium">{unit.unitNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Floor:</dt>
              <dd>{unit.floorNumber}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Type:</dt>
              <dd className="capitalize">{unit.unitType}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Area:</dt>
              <dd>{unit.details?.area?.value} {unit.details?.area?.unit}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Bedrooms:</dt>
              <dd>{unit.details?.bedrooms || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Bathrooms:</dt>
              <dd>{unit.details?.bathrooms || 0}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Status:</dt>
              <dd>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  unit.occupancy?.status === 'owner_occupied' ? 'bg-green-100 text-green-800' :
                  unit.occupancy?.status === 'tenant_occupied' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {unit.occupancy?.status?.replace('_', ' ') || 'Vacant'}
                </span>
              </dd>
            </div>
          </dl>
        </div>

        {/* Owner Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Owner Information</h3>
          {unit.ownership?.ownerName ? (
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name:</dt>
                <dd className="font-medium">{unit.ownership.ownerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email:</dt>
                <dd>{unit.ownership.ownerEmail || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Phone:</dt>
                <dd>{unit.ownership.ownerPhone || '-'}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-500">No owner assigned</p>
          )}
        </div>

        {/* Tenant Information Card */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Tenant Information</h3>
          {unit.tenant?.isActive ? (
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-gray-500">Name:</dt>
                <dd className="font-medium">{unit.tenant.tenantName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Email:</dt>
                <dd>{unit.tenant.tenantEmail || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Phone:</dt>
                <dd>{unit.tenant.tenantPhone || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Lease Period:</dt>
                <dd>
                  {unit.tenant.leaseStartDate ? new Date(unit.tenant.leaseStartDate).toLocaleDateString() : '-'} 
                  {' - '}
                  {unit.tenant.leaseEndDate ? new Date(unit.tenant.leaseEndDate).toLocaleDateString() : '-'}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gray-500">Monthly Rent:</dt>
                <dd>{unit.tenant.monthlyRent ? `$${unit.tenant.monthlyRent}` : '-'}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-gray-500">No tenant assigned</p>
          )}
        </div>
      </div>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
      </div>
    </div>
  );
};

export default UnitDetails;