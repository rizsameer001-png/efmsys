// client/src/pages/leave/PendingApprovals.jsx
import React, { useState, useEffect } from 'react';
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const PendingApprovals = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [comments, setComments] = useState('');

  useEffect(() => {
    fetchPendingApprovals();
  }, []);

  const fetchPendingApprovals = async () => {
    setLoading(true);
    try {
      const response = await leaveApi.getPendingApprovals();
      if (response.data.success) {
        setPendingLeaves(response.data.data);
      }
    } catch (error) {
      console.error('Fetch pending approvals error:', error);
      showToast('Failed to load pending approvals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (leaveId) => {
    setActionLoading(true);
    try {
      await leaveApi.approveLeave(leaveId, comments);
      showToast('Leave request approved', 'success');
      setSelectedLeave(null);
      setComments('');
      fetchPendingApprovals();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to approve', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (leaveId) => {
    setActionLoading(true);
    try {
      await leaveApi.rejectLeave(leaveId, comments);
      showToast('Leave request rejected', 'warning');
      setSelectedLeave(null);
      setComments('');
      fetchPendingApprovals();
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to reject', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const getApprovalLevel = () => {
    if (user?.role === 'supervisor') return 'Supervisor';
    if (user?.role === 'manager') return 'Manager';
    return 'HR';
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
        <p className="text-gray-500 mt-1">
          {pendingLeaves.length} leave request{pendingLeaves.length !== 1 ? 's' : ''} awaiting your {getApprovalLevel()} approval
        </p>
      </div>

      {pendingLeaves.length === 0 ? (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">No pending leave requests</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {pendingLeaves.map(leave => (
            <Card key={leave._id} className="p-6 hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                {/* Employee Info */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-lg">
                      {leave.employeeId?.firstName?.[0]}{leave.employeeId?.lastName?.[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{leave.employeeId?.firstName} {leave.employeeId?.lastName}</p>
                    <p className="text-sm text-gray-500 capitalize">{leave.employeeId?.role} • {leave.employeeId?.department}</p>
                    <p className="text-xs text-gray-400 mt-1">Employee ID: {leave.employeeId?.employeeId}</p>
                  </div>
                </div>
                
                {/* Leave Details */}
                <div className="flex-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Leave Type</p>
                      <p className="text-sm font-medium capitalize">{leave.leaveType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Duration</p>
                      <p className="text-sm">{new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Total Days</p>
                      <p className="text-sm font-medium">{leave.totalDays} days</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Submitted On</p>
                      <p className="text-sm">{new Date(leave.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">Reason</p>
                    <p className="text-sm text-gray-700">{leave.reason}</p>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="success" onClick={() => setSelectedLeave(leave)}>
                    Review & Approve
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => setSelectedLeave(leave)}>
                    Reject
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Approval Modal */}
      {selectedLeave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Review Leave Request</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Employee:</span>
                  <span className="font-medium">{selectedLeave.employeeId?.firstName} {selectedLeave.employeeId?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Leave Type:</span>
                  <span className="font-medium capitalize">{selectedLeave.leaveType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration:</span>
                  <span>{selectedLeave.totalDays} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Dates:</span>
                  <span>{new Date(selectedLeave.fromDate).toLocaleDateString()} - {new Date(selectedLeave.toDate).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="text-gray-500">Reason:</span>
                  <p className="mt-1 text-gray-700">{selectedLeave.reason}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments / Reason</label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Add comments or rejection reason..."
                />
              </div>
              
              <div className="flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setSelectedLeave(null)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => handleReject(selectedLeave._id)} isLoading={actionLoading}>
                  Reject
                </Button>
                <Button variant="success" onClick={() => handleApprove(selectedLeave._id)} isLoading={actionLoading}>
                  Approve
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingApprovals;