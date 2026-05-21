// client/src/pages/customer/ServiceRequests.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintApi } from '../../api/complaint.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const ServiceRequests = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    completed: 0
  });

  useEffect(() => {
    fetchServiceRequests();
  }, []);

  const fetchServiceRequests = async () => {
    setLoading(true);
    try {
      const response = await complaintApi.getMyComplaints();
      if (response.data.success) {
        const complaints = response.data.data?.complaints || response.data.data || [];
        setRequests(complaints);
        
        setStats({
          total: complaints.length,
          open: complaints.filter(c => c.status === 'open' || c.status === 'pending').length,
          inProgress: complaints.filter(c => c.status === 'in_progress' || c.status === 'assigned').length,
          completed: complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length
        });
      }
    } catch (error) {
      console.error('Fetch service requests error:', error);
      showToast('Failed to load service requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      resolved: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.open;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return badges[priority] || badges.medium;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Requests</h1>
          <p className="text-gray-500 mt-1">Track your maintenance and service requests</p>
        </div>
        <Link to="/complaints/new">
          <Button>+ New Service Request</Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Requests</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.open}</p>
          <p className="text-sm text-gray-500">Open</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-indigo-600">{stats.inProgress}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </Card>
      </div>

      {/* Service Requests List */}
      {requests.length > 0 ? (
        <div className="space-y-4">
          {requests.map(request => (
            <Card key={request._id} className="p-5 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(request.status)}`}>
                      {request.status?.replace(/_/g, ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className="text-xs text-gray-400">#{request.ticketNumber}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{request.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{request.description}</p>
                  <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-400">
                    <span>📅 Submitted: {formatDate(request.createdAt)}</span>
                    {request.assignment?.assignedToName && (
                      <span>👤 Assigned to: {request.assignment.assignedToName}</span>
                    )}
                    {request.slaDeadline && (
                      <span className={new Date(request.slaDeadline) < new Date() ? 'text-red-500' : ''}>
                        ⏰ Due: {formatDate(request.slaDeadline)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to={`/complaints/${request._id}`}>
                    <Button size="sm" variant="secondary">View Details</Button>
                  </Link>
                  {request.status === 'open' && (
                    <Button size="sm" variant="danger">Cancel</Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="text-gray-500">No service requests found</p>
          <p className="text-sm text-gray-400 mt-1">Submit your first service request</p>
          <Link to="/complaints/new">
            <Button variant="secondary" className="mt-4">Submit Request</Button>
          </Link>
        </Card>
      )}
    </div>
  );
};

export default ServiceRequests;