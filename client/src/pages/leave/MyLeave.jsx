// // client/src/pages/leave/MyLeave.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { leaveApi } from '../../api/leave.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const MyLeave = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [leaves, setLeaves] = useState([]);
//   const [leaveBalance, setLeaveBalance] = useState(null);
//   const [showApplyModal, setShowApplyModal] = useState(false);
//   const [formData, setFormData] = useState({
//     leaveType: 'annual',
//     fromDate: '',
//     toDate: '',
//     reason: '',
//     emergencyContact: { name: '', phone: '', relation: '' }
//   });
//   const [submitting, setSubmitting] = useState(false);
//   const [filter, setFilter] = useState('all');

//   useEffect(() => {
//     fetchData();
//   }, [filter]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [leavesRes, balanceRes] = await Promise.all([
//         leaveApi.getMyLeaves(filter === 'all' ? null : filter),
//         leaveApi.getMyLeaveBalance()
//       ]);
      
//       if (leavesRes.data.success) setLeaves(leavesRes.data.data);
//       if (balanceRes.data.success) setLeaveBalance(balanceRes.data.data);
//     } catch (error) {
//       console.error('Fetch leave data error:', error);
//       showToast('Failed to load leave data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSubmitting(true);
//     try {
//       const response = await leaveApi.applyLeave(formData);
//       if (response.data.success) {
//         showToast('Leave request submitted successfully', 'success');
//         setShowApplyModal(false);
//         setFormData({
//           leaveType: 'annual',
//           fromDate: '',
//           toDate: '',
//           reason: '',
//           emergencyContact: { name: '', phone: '', relation: '' }
//         });
//         fetchData();
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to submit leave request', 'error');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleCancelLeave = async (id) => {
//     if (window.confirm('Are you sure you want to cancel this leave request?')) {
//       try {
//         await leaveApi.cancelLeave(id);
//         showToast('Leave request cancelled', 'success');
//         fetchData();
//       } catch (error) {
//         showToast('Failed to cancel leave request', 'error');
//       }
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       cancelled: 'bg-gray-100 text-gray-800'
//     };
//     return badges[status] || badges.pending;
//   };

//   const getLeaveTypeLabel = (type) => {
//     const labels = {
//       annual: 'Annual Leave',
//       sick: 'Sick Leave',
//       emergency: 'Emergency Leave',
//       unpaid: 'Unpaid Leave',
//       maternity: 'Maternity Leave',
//       paternity: 'Paternity Leave',
//       bereavement: 'Bereavement Leave'
//     };
//     return labels[type] || type;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
//           <p className="text-gray-500 mt-1">Apply for leave and track your requests</p>
//         </div>
//         <Button onClick={() => setShowApplyModal(true)}>+ Apply for Leave</Button>
//       </div>

//       {/* Leave Balance Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-3xl font-bold text-blue-600">{leaveBalance?.annual?.remaining || 0}</p>
//           <p className="text-sm text-gray-500">Annual Leave</p>
//           <p className="text-xs text-gray-400">Used: {leaveBalance?.annual?.used || 0} / {leaveBalance?.annual?.total || 22}</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-3xl font-bold text-green-600">{leaveBalance?.sick?.remaining || 0}</p>
//           <p className="text-sm text-gray-500">Sick Leave</p>
//           <p className="text-xs text-gray-400">Used: {leaveBalance?.sick?.used || 0} / {leaveBalance?.sick?.total || 12}</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-3xl font-bold text-orange-600">{leaveBalance?.emergency?.remaining || 0}</p>
//           <p className="text-sm text-gray-500">Emergency Leave</p>
//           <p className="text-xs text-gray-400">Used: {leaveBalance?.emergency?.used || 0} / {leaveBalance?.emergency?.total || 6}</p>
//         </Card>
//       </div>

//       {/* Leave History Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Leave History</h3>
//           <select
//             value={filter}
//             onChange={(e) => setFilter(e.target.value)}
//             className="px-3 py-1 border rounded-lg text-sm"
//           >
//             <option value="all">All Requests</option>
//             <option value="pending">Pending</option>
//             <option value="approved">Approved</option>
//             <option value="rejected">Rejected</option>
//           </select>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {leaves.map(leave => (
//                 <tr key={leave._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     {getLeaveTypeLabel(leave.leaveType)}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.totalDays}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
//                       {leave.status}
//                     </span>
//                    </td>
//                   <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     {leave.status === 'pending' && (
//                       <button
//                         onClick={() => handleCancelLeave(leave._id)}
//                         className="text-red-600 hover:text-red-800"
//                       >
//                         Cancel
//                       </button>
//                     )}
//                     {leave.status === 'approved' && (
//                       <span className="text-gray-400">-</span>
//                     )}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Apply Leave Modal */}
//       {showApplyModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
//             <div className="p-6">
//               <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
//               <form onSubmit={handleSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
//                   <select
//                     value={formData.leaveType}
//                     onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="annual">Annual Leave</option>
//                     <option value="sick">Sick Leave</option>
//                     <option value="emergency">Emergency Leave</option>
//                   </select>
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
//                     <input
//                       type="date"
//                       value={formData.fromDate}
//                       onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
//                     <input
//                       type="date"
//                       value={formData.toDate}
//                       onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
//                       className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
//                   <textarea
//                     value={formData.reason}
//                     onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
//                     rows={3}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                     placeholder="Please provide reason for leave..."
//                     required
//                   />
//                 </div>
//                 <div className="pt-4 border-t">
//                   <p className="text-sm font-medium text-gray-700 mb-2">Emergency Contact (Optional)</p>
//                   <div className="grid grid-cols-2 gap-4">
//                     <input
//                       type="text"
//                       placeholder="Contact Name"
//                       value={formData.emergencyContact.name}
//                       onChange={(e) => setFormData({
//                         ...formData,
//                         emergencyContact: { ...formData.emergencyContact, name: e.target.value }
//                       })}
//                       className="px-3 py-2 border rounded-lg"
//                     />
//                     <input
//                       type="text"
//                       placeholder="Phone Number"
//                       value={formData.emergencyContact.phone}
//                       onChange={(e) => setFormData({
//                         ...formData,
//                         emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
//                       })}
//                       className="px-3 py-2 border rounded-lg"
//                     />
//                   </div>
//                 </div>
//                 <div className="flex justify-end gap-3 pt-4">
//                   <Button type="button" variant="secondary" onClick={() => setShowApplyModal(false)}>
//                     Cancel
//                   </Button>
//                   <Button type="submit" isLoading={submitting}>
//                     Submit Request
//                   </Button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyLeave;




// client/src/pages/leave/MyLeave.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const MyLeave = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [formData, setFormData] = useState({
    leaveType: 'annual',
    fromDate: '',
    toDate: '',
    reason: '',
    halfDay: false,
    emergencyContact: { name: '', phone: '', relation: '' }
  });
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchData();
  }, [filter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [leavesRes, balanceRes] = await Promise.all([
        leaveApi.getMyLeaves(filter === 'all' ? null : filter),
        leaveApi.getMyLeaveBalance()
      ]);
      
      if (leavesRes.data.success) setLeaves(leavesRes.data.data);
      if (balanceRes.data.success) setLeaveBalance(balanceRes.data.data);
    } catch (error) {
      console.error('Fetch leave data error:', error);
      showToast('Failed to load leave data', 'error');
    } finally {
      setLoading(false);
    }
  };

  // 🔴 FIXED: Updated handleSubmit with proper date formatting
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (!formData.fromDate || !formData.toDate) {
      showToast('Please select both from and to dates', 'error');
      return;
    }
    
    const fromDate = new Date(formData.fromDate);
    const toDate = new Date(formData.toDate);
    
    if (fromDate > toDate) {
      showToast('From date cannot be after to date', 'error');
      return;
    }
    
    if (fromDate < new Date()) {
      showToast('Cannot apply for leave in the past', 'error');
      return;
    }
    
    setSubmitting(true);
    try {
      // 🔴 FIX: Format data correctly for backend
      const leaveData = {
        leaveType: formData.leaveType,
        fromDate: formData.fromDate, // Already in YYYY-MM-DD format
        toDate: formData.toDate,
        reason: formData.reason,
        halfDay: formData.halfDay || false
      };
      
      console.log('📋 Submitting leave request:', leaveData);
      
      const response = await leaveApi.applyLeave(leaveData);
      
      if (response.data.success) {
        showToast('Leave request submitted successfully!', 'success');
        setShowApplyModal(false);
        setFormData({
          leaveType: 'annual',
          fromDate: '',
          toDate: '',
          reason: '',
          halfDay: false,
          emergencyContact: { name: '', phone: '', relation: '' }
        });
        fetchData();
      } else {
        showToast(response.data.error || 'Failed to submit leave request', 'error');
      }
    } catch (error) {
      console.error('Leave submission error:', error);
      showToast(error.response?.data?.error || 'Failed to submit leave request', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelLeave = async (id) => {
    if (window.confirm('Are you sure you want to cancel this leave request?')) {
      try {
        await leaveApi.cancelLeave(id);
        showToast('Leave request cancelled', 'success');
        fetchData();
      } catch (error) {
        showToast('Failed to cancel leave request', 'error');
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-gray-100 text-gray-800'
    };
    return badges[status] || badges.pending;
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      annual: 'Annual Leave',
      sick: 'Sick Leave',
      casual: 'Casual Leave',
      emergency: 'Emergency Leave',
      unpaid: 'Unpaid Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      bereavement: 'Bereavement Leave'
    };
    return labels[type] || type;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-gray-500 mt-1">Apply for leave and track your requests</p>
        </div>
        <Button onClick={() => setShowApplyModal(true)}>+ Apply for Leave</Button>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-blue-600">{leaveBalance?.annual || 22}</p>
          <p className="text-sm text-gray-500">Annual Leave</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-green-600">{leaveBalance?.sick || 12}</p>
          <p className="text-sm text-gray-500">Sick Leave</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-purple-600">{leaveBalance?.casual || 5}</p>
          <p className="text-sm text-gray-500">Casual Leave</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-3xl font-bold text-orange-600">{leaveBalance?.emergency || 3}</p>
          <p className="text-sm text-gray-500">Emergency Leave</p>
        </Card>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Approved
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </Card>

      {/* Leave History Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Leave History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Leave Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaves.length > 0 ? (
                leaves.map(leave => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getLeaveTypeLabel(leave.leaveType)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(leave.fromDate)} - {formatDate(leave.toDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {leave.totalDays} day{leave.totalDays !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {leave.status === 'pending' && (
                        <button
                          onClick={() => handleCancelLeave(leave._id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Cancel
                        </button>
                      )}
                      {leave.status === 'approved' && (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    No leave requests found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Apply Leave Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Apply for Leave</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Leave Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.leaveType}
                    onChange={(e) => setFormData({ ...formData, leaveType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="annual">Annual Leave (22 days)</option>
                    <option value="sick">Sick Leave (12 days)</option>
                    <option value="casual">Casual Leave (5 days)</option>
                    <option value="emergency">Emergency Leave (3 days)</option>
                    <option value="unpaid">Unpaid Leave</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      From Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.fromDate}
                      onChange={(e) => setFormData({ ...formData, fromDate: e.target.value })}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      To Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.toDate}
                      onChange={(e) => setFormData({ ...formData, toDate: e.target.value })}
                      min={formData.fromDate || new Date().toISOString().split('T')[0]}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="halfDay"
                    checked={formData.halfDay}
                    onChange={(e) => setFormData({ ...formData, halfDay: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <label htmlFor="halfDay" className="text-sm text-gray-700">
                    Half Day Leave
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Please provide reason for leave..."
                    required
                  />
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-2">Emergency Contact (Optional)</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      value={formData.emergencyContact.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, name: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder="Relation (e.g., Spouse, Parent)"
                      value={formData.emergencyContact.relation}
                      onChange={(e) => setFormData({
                        ...formData,
                        emergencyContact: { ...formData.emergencyContact, relation: e.target.value }
                      })}
                      className="w-full px-3 py-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-sm text-blue-800">
                    💡 Note: Leave requests will be reviewed by your manager. You will receive a notification once approved.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="secondary" onClick={() => setShowApplyModal(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" isLoading={submitting}>
                    Submit Request
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLeave;