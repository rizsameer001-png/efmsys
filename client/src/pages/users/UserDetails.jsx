// client/src/pages/users/UserDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userApi } from '../../api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import { formatDate, formatDateTime } from '../../utils/formatters';

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await userApi.getUserById(id);
      setUser(response.data.data);
    } catch (error) {
      showToast('Failed to load user details', 'error');
      navigate('/users');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userApi.deleteUser(id);
        showToast('User deleted successfully', 'success');
        navigate('/users');
      } catch (error) {
        showToast('Failed to delete user', 'error');
      }
    }
  };

  if (loading) return <Spinner />;
  if (!user) return null;

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`;
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-2xl font-bold text-blue-600">
            {initials || 'U'}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{fullName}</h1>
            <p className="text-gray-500">{user.role?.replace('_', ' ').toUpperCase()}</p>
          </div>
        </div>
        <div className="flex space-x-3">
          {hasPermission('user.update') && (
            <Button onClick={() => navigate(`/users/${id}/edit`)}>Edit User</Button>
          )}
          {hasPermission('user.delete') && (
            <Button variant="danger" onClick={handleDelete}>Delete User</Button>
          )}
        </div>
      </div>

      {/* User Information Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Basic Information
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Employee ID</dt>
              <dd className="font-medium">{user.employeeId || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Email</dt>
              <dd className="text-blue-600">{user.email}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Phone</dt>
              <dd>{user.phone}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Alternate Phone</dt>
              <dd>{user.alternatePhone || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Date of Birth</dt>
              <dd>{user.dateOfBirth ? formatDate(user.dateOfBirth) : '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Gender</dt>
              <dd className="capitalize">{user.gender || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Nationality</dt>
              <dd>{user.nationality || '-'}</dd>
            </div>
          </dl>
        </Card>

        {/* Employment Information */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Employment Information
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Role</dt>
              <dd className="capitalize">{user.role}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Designation</dt>
              <dd>{user.designation || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Department</dt>
              <dd className="capitalize">{user.department || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Employment Type</dt>
              <dd className="capitalize">{user.employeeType?.replace('_', ' ') || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Joining Date</dt>
              <dd>{user.joiningDate ? formatDate(user.joiningDate) : '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Reporting Manager</dt>
              <dd>{user.reportingManager?.firstName} {user.reportingManager?.lastName || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Supervisor</dt>
              <dd>{user.supervisor?.firstName} {user.supervisor?.lastName || '-'}</dd>
            </div>
          </dl>
        </Card>

        {/* Shift & Location */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Shift & Location
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Shift Timing</dt>
              <dd>{user.shiftTiming?.start} - {user.shiftTiming?.end}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Time Zone</dt>
              <dd>{user.shiftTiming?.timezone || 'Asia/Dubai'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Work Location</dt>
              <dd>{user.workLocation || '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Assigned Buildings</dt>
              <dd>{user.assignedBuildings?.map(b => b.name).join(', ') || '-'}</dd>
            </div>
          </dl>
        </Card>

        {/* Status & Activity */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Status & Activity
          </h3>
          <dl className="space-y-3">
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Status</dt>
              <dd>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 
                  user.status === 'inactive' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status || 'inactive'}
                </span>
              </dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Email Verified</dt>
              <dd>{user.emailVerified ? '✅ Yes' : '❌ No'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Phone Verified</dt>
              <dd>{user.phoneVerified ? '✅ Yes' : '❌ No'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Last Login</dt>
              <dd>{user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '-'}</dd>
            </div>
            <div className="flex justify-between border-b pb-2">
              <dt className="text-gray-500">Joined</dt>
              <dd>{user.createdAt ? formatDate(user.createdAt) : '-'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button variant="secondary" onClick={() => navigate('/users')}>
          Back to Users
        </Button>
      </div>
    </div>
  );
};

export default UserDetails;