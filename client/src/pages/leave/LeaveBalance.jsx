// // client/src/pages/leave/LeaveBalance.jsx
// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';  // 🔴 FIX: Added missing Link import
// import { leaveApi } from '../../api/leave.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';

// const LeaveBalance = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [leaveBalance, setLeaveBalance] = useState(null);
//   const [year, setYear] = useState(new Date().getFullYear());
//   const [leaveHistory, setLeaveHistory] = useState([]);

//   useEffect(() => {
//     fetchLeaveBalance();
//     fetchLeaveHistory();
//   }, [year]);

//   const fetchLeaveBalance = async () => {
//     setLoading(true);
//     try {
//       const response = await leaveApi.getMyLeaveBalance(year);
//       if (response.data.success) {
//         setLeaveBalance(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch leave balance error:', error);
//       showToast('Failed to load leave balance', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchLeaveHistory = async () => {
//     try {
//       const response = await leaveApi.getMyLeaves(null, year, 1, 50);
//       if (response.data.success) {
//         setLeaveHistory(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch leave history error:', error);
//     }
//   };

//   const getLeaveTypeIcon = (type) => {
//     const icons = {
//       annual: '🏖️',
//       sick: '🤒',
//       emergency: '🚨',
//       unpaid: '💰',
//       maternity: '👶',
//       paternity: '👶',
//       bereavement: '🕊️'
//     };
//     return icons[type] || '📋';
//   };

//   const getLeaveTypeColor = (type) => {
//     const colors = {
//       annual: 'from-green-500 to-green-600',
//       sick: 'from-yellow-500 to-yellow-600',
//       emergency: 'from-red-500 to-red-600',
//       unpaid: 'from-gray-500 to-gray-600',
//       maternity: 'from-pink-500 to-pink-600',
//       paternity: 'from-blue-500 to-blue-600',
//       bereavement: 'from-purple-500 to-purple-600'
//     };
//     return colors[type] || colors.annual;
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

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       approved: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800',
//       cancelled: 'bg-gray-100 text-gray-800'
//     };
//     return badges[status] || badges.pending;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Leave Balance</h1>
//           <p className="text-gray-500 mt-1">Track your leave entitlements and usage</p>
//         </div>
//         <select
//           value={year}
//           onChange={(e) => setYear(parseInt(e.target.value))}
//           className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//         >
//           <option value={2023}>2023</option>
//           <option value={2024}>2024</option>
//           <option value={2025}>2025</option>
//         </select>
//       </div>

//       {/* Leave Balance Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Annual Leave */}
//         <Card className="overflow-hidden">
//           <div className={`bg-gradient-to-r ${getLeaveTypeColor('annual')} p-4 text-white`}>
//             <div className="flex justify-between items-center">
//               <span className="text-2xl">{getLeaveTypeIcon('annual')}</span>
//               <span className="text-sm opacity-90">Annual Leave</span>
//             </div>
//             <p className="text-3xl font-bold mt-2">{leaveBalance?.annual?.remaining || 0}</p>
//             <p className="text-sm opacity-90">days remaining</p>
//           </div>
//           <div className="p-4">
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">Used</span>
//               <span className="font-medium">{leaveBalance?.annual?.used || 0} / {leaveBalance?.annual?.total || 22} days</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-green-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${((leaveBalance?.annual?.used || 0) / (leaveBalance?.annual?.total || 22)) * 100}%` }}
//               />
//             </div>
//           </div>
//         </Card>

//         {/* Sick Leave */}
//         <Card className="overflow-hidden">
//           <div className={`bg-gradient-to-r ${getLeaveTypeColor('sick')} p-4 text-white`}>
//             <div className="flex justify-between items-center">
//               <span className="text-2xl">{getLeaveTypeIcon('sick')}</span>
//               <span className="text-sm opacity-90">Sick Leave</span>
//             </div>
//             <p className="text-3xl font-bold mt-2">{leaveBalance?.sick?.remaining || 0}</p>
//             <p className="text-sm opacity-90">days remaining</p>
//           </div>
//           <div className="p-4">
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">Used</span>
//               <span className="font-medium">{leaveBalance?.sick?.used || 0} / {leaveBalance?.sick?.total || 12} days</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${((leaveBalance?.sick?.used || 0) / (leaveBalance?.sick?.total || 12)) * 100}%` }}
//               />
//             </div>
//           </div>
//         </Card>

//         {/* Emergency Leave */}
//         <Card className="overflow-hidden">
//           <div className={`bg-gradient-to-r ${getLeaveTypeColor('emergency')} p-4 text-white`}>
//             <div className="flex justify-between items-center">
//               <span className="text-2xl">{getLeaveTypeIcon('emergency')}</span>
//               <span className="text-sm opacity-90">Emergency Leave</span>
//             </div>
//             <p className="text-3xl font-bold mt-2">{leaveBalance?.emergency?.remaining || 0}</p>
//             <p className="text-sm opacity-90">days remaining</p>
//           </div>
//           <div className="p-4">
//             <div className="flex justify-between text-sm mb-1">
//               <span className="text-gray-600">Used</span>
//               <span className="font-medium">{leaveBalance?.emergency?.used || 0} / {leaveBalance?.emergency?.total || 6} days</span>
//             </div>
//             <div className="w-full bg-gray-200 rounded-full h-2">
//               <div 
//                 className="bg-red-500 h-2 rounded-full transition-all duration-500"
//                 style={{ width: `${((leaveBalance?.emergency?.used || 0) / (leaveBalance?.emergency?.total || 6)) * 100}%` }}
//               />
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Leave Summary */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Leave Summary {year}</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div className="p-3 bg-green-50 rounded-lg">
//             <p className="text-sm text-green-600">Total Annual Leave</p>
//             <p className="text-2xl font-bold text-green-700">{leaveBalance?.annual?.total || 22} days</p>
//           </div>
//           <div className="p-3 bg-yellow-50 rounded-lg">
//             <p className="text-sm text-yellow-600">Total Sick Leave</p>
//             <p className="text-2xl font-bold text-yellow-700">{leaveBalance?.sick?.total || 12} days</p>
//           </div>
//           <div className="p-3 bg-red-50 rounded-lg">
//             <p className="text-sm text-red-600">Total Emergency Leave</p>
//             <p className="text-2xl font-bold text-red-700">{leaveBalance?.emergency?.total || 6} days</p>
//           </div>
//         </div>
//       </Card>

//       {/* Leave History Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">Leave History</h3>
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
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {leaveHistory.length > 0 ? (
//                 leaveHistory.map(leave => (
//                   <tr key={leave._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <span className="text-lg">{getLeaveTypeIcon(leave.leaveType)}</span>
//                         <span className="text-sm text-gray-900">{getLeaveTypeLabel(leave.leaveType)}</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{leave.totalDays} days</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
//                         {leave.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{leave.reason}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(leave.createdAt).toLocaleDateString()}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No leave history found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Quick Actions */}
//       <div className="flex justify-end">
//         <Link to="/leave/my">
//           <Button variant="primary">+ Apply for Leave</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default LeaveBalance;




// client/src/pages/leave/LeaveBalance.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { leaveApi } from '../../api/leave.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';  // 🔴 FIX: Added missing Button import
import Spinner from '../../components/common/Spinner';

const LeaveBalance = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [leaveBalance, setLeaveBalance] = useState(null);
  const [year, setYear] = useState(new Date().getFullYear());
  const [leaveHistory, setLeaveHistory] = useState([]);

  useEffect(() => {
    fetchLeaveBalance();
    fetchLeaveHistory();
  }, [year]);

  const fetchLeaveBalance = async () => {
    setLoading(true);
    try {
      const response = await leaveApi.getMyLeaveBalance(year);
      if (response.data.success) {
        setLeaveBalance(response.data.data);
      }
    } catch (error) {
      console.error('Fetch leave balance error:', error);
      showToast('Failed to load leave balance', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaveHistory = async () => {
    try {
      const response = await leaveApi.getMyLeaves(null, year, 1, 50);
      if (response.data.success) {
        setLeaveHistory(response.data.data);
      }
    } catch (error) {
      console.error('Fetch leave history error:', error);
    }
  };

  const getLeaveTypeIcon = (type) => {
    const icons = {
      annual: '🏖️',
      sick: '🤒',
      emergency: '🚨',
      unpaid: '💰',
      maternity: '👶',
      paternity: '👶',
      bereavement: '🕊️'
    };
    return icons[type] || '📋';
  };

  const getLeaveTypeColor = (type) => {
    const colors = {
      annual: 'from-green-500 to-green-600',
      sick: 'from-yellow-500 to-yellow-600',
      emergency: 'from-red-500 to-red-600',
      unpaid: 'from-gray-500 to-gray-600',
      maternity: 'from-pink-500 to-pink-600',
      paternity: 'from-blue-500 to-blue-600',
      bereavement: 'from-purple-500 to-purple-600'
    };
    return colors[type] || colors.annual;
  };

  const getLeaveTypeLabel = (type) => {
    const labels = {
      annual: 'Annual Leave',
      sick: 'Sick Leave',
      emergency: 'Emergency Leave',
      unpaid: 'Unpaid Leave',
      maternity: 'Maternity Leave',
      paternity: 'Paternity Leave',
      bereavement: 'Bereavement Leave'
    };
    return labels[type] || type;
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

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Balance</h1>
          <p className="text-gray-500 mt-1">Track your leave entitlements and usage</p>
        </div>
        <select
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Annual Leave */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${getLeaveTypeColor('annual')} p-4 text-white`}>
            <div className="flex justify-between items-center">
              <span className="text-2xl">{getLeaveTypeIcon('annual')}</span>
              <span className="text-sm opacity-90">Annual Leave</span>
            </div>
            <p className="text-3xl font-bold mt-2">{leaveBalance?.annual?.remaining || 0}</p>
            <p className="text-sm opacity-90">days remaining</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">{leaveBalance?.annual?.used || 0} / {leaveBalance?.annual?.total || 22} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((leaveBalance?.annual?.used || 0) / (leaveBalance?.annual?.total || 22)) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Sick Leave */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${getLeaveTypeColor('sick')} p-4 text-white`}>
            <div className="flex justify-between items-center">
              <span className="text-2xl">{getLeaveTypeIcon('sick')}</span>
              <span className="text-sm opacity-90">Sick Leave</span>
            </div>
            <p className="text-3xl font-bold mt-2">{leaveBalance?.sick?.remaining || 0}</p>
            <p className="text-sm opacity-90">days remaining</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">{leaveBalance?.sick?.used || 0} / {leaveBalance?.sick?.total || 12} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((leaveBalance?.sick?.used || 0) / (leaveBalance?.sick?.total || 12)) * 100}%` }}
              />
            </div>
          </div>
        </Card>

        {/* Emergency Leave */}
        <Card className="overflow-hidden">
          <div className={`bg-gradient-to-r ${getLeaveTypeColor('emergency')} p-4 text-white`}>
            <div className="flex justify-between items-center">
              <span className="text-2xl">{getLeaveTypeIcon('emergency')}</span>
              <span className="text-sm opacity-90">Emergency Leave</span>
            </div>
            <p className="text-3xl font-bold mt-2">{leaveBalance?.emergency?.remaining || 0}</p>
            <p className="text-sm opacity-90">days remaining</p>
          </div>
          <div className="p-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Used</span>
              <span className="font-medium">{leaveBalance?.emergency?.used || 0} / {leaveBalance?.emergency?.total || 6} days</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${((leaveBalance?.emergency?.used || 0) / (leaveBalance?.emergency?.total || 6)) * 100}%` }}
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Leave Summary */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Leave Summary {year}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-green-600">Total Annual Leave</p>
            <p className="text-2xl font-bold text-green-700">{leaveBalance?.annual?.total || 22} days</p>
          </div>
          <div className="p-3 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-600">Total Sick Leave</p>
            <p className="text-2xl font-bold text-yellow-700">{leaveBalance?.sick?.total || 12} days</p>
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-600">Total Emergency Leave</p>
            <p className="text-2xl font-bold text-red-700">{leaveBalance?.emergency?.total || 6} days</p>
          </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied On</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {leaveHistory.length > 0 ? (
                leaveHistory.map(leave => (
                  <tr key={leave._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{getLeaveTypeIcon(leave.leaveType)}</span>
                        <span className="text-sm text-gray-900">{getLeaveTypeLabel(leave.leaveType)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.fromDate).toLocaleDateString()} - {new Date(leave.toDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {leave.totalDays} day{leave.totalDays !== 1 ? 's' : ''}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(leave.status)}`}>
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No leave history found for {year}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="flex justify-end gap-3">
        <Link to="/leave/apply">
          <Button variant="primary">+ Apply for Leave</Button>
        </Link>
        <Link to="/leave/my">
          <Button variant="secondary">View All Leaves</Button>
        </Link>
      </div>
    </div>
  );
};

export default LeaveBalance;