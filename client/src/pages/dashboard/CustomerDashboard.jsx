// // client/src/pages/dashboard/CustomerDashboard.jsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';

// const CustomerDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [stats] = useState({
//     properties: 1,
//     activeComplaints: 2,
//     pendingPayment: 234,
//     resolved: 5
//   });

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage your property.</p>
//         </div>
//         <Button variant="danger" onClick={handleLogout} size="sm">
//           Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="p-6 text-center">
//           <p className="text-2xl font-bold text-blue-600">{stats.properties}</p>
//           <p className="text-sm text-gray-500">My Properties</p>
//         </Card>
//         <Card className="p-6 text-center">
//           <p className="text-2xl font-bold text-orange-600">{stats.activeComplaints}</p>
//           <p className="text-sm text-gray-500">Active Complaints</p>
//         </Card>
//         <Card className="p-6 text-center">
//           <p className="text-2xl font-bold text-red-600">${stats.pendingPayment}</p>
//           <p className="text-sm text-gray-500">Pending Payment</p>
//         </Card>
//         <Card className="p-6 text-center">
//           <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
//           <p className="text-sm text-gray-500">Resolved Issues</p>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/complaints/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100">
//           <div className="text-2xl mb-1">📋</div>
//           <p className="text-sm font-medium">Raise Complaint</p>
//         </Link>
//         <Link to="/services/book" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">🔧</div>
//           <p className="text-sm font-medium">Book Service</p>
//         </Link>
//         <Link to="/payments" className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100">
//           <div className="text-2xl mb-1">💰</div>
//           <p className="text-sm font-medium">Pay Dues</p>
//         </Link>
//         <Link to="/visitor-pass" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-2xl mb-1">🔑</div>
//           <p className="text-sm font-medium">Visitor Pass</p>
//         </Link>
//       </div>

//       {/* Recent Complaints */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Recent Complaints</h3>
//         <div className="space-y-3">
//           <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//             <div>
//               <p className="font-medium">Electrical Issue</p>
//               <p className="text-sm text-gray-500">Submitted: Jan 15, 2024</p>
//             </div>
//             <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
//           </div>
//           <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//             <div>
//               <p className="font-medium">Plumbing Leak</p>
//               <p className="text-sm text-gray-500">Submitted: Jan 10, 2024</p>
//             </div>
//             <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Resolved</span>
//           </div>
//         </div>
//         <Link to="/complaints" className="block text-center mt-4 text-sm text-blue-600">View All Complaints →</Link>
//       </Card>

//       {/* Upcoming Maintenance */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Upcoming Maintenance</h3>
//         <div className="space-y-3">
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="font-medium">AC Service</p>
//               <p className="text-sm text-gray-500">Scheduled: Feb 15, 2024</p>
//             </div>
//             <Button size="sm" variant="secondary">Reschedule</Button>
//           </div>
//           <div className="flex justify-between items-center">
//             <div>
//               <p className="font-medium">Pest Control</p>
//               <p className="text-sm text-gray-500">Scheduled: Feb 20, 2024</p>
//             </div>
//             <Button size="sm" variant="secondary">Reschedule</Button>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default CustomerDashboard;


// client/src/pages/dashboard/CustomerDashboard.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { complaintApi } from '../../api/complaint.api';
// //import { paymentApi } from '../../api/payment.api';
// //import { propertyApi } from '../../api/property.api';

// const CustomerDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     properties: 0,
//     activeComplaints: 0,
//     pendingPayment: 0,
//     resolved: 0,
//     totalSpent: 0
//   });
//   const [recentComplaints, setRecentComplaints] = useState([]);
//   const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
//   const [recentPayments, setRecentPayments] = useState([]);

//   // 🔴 FIX: Use useCallback to prevent infinite loops
//   const fetchDashboardData = useCallback(async () => {
//     setLoading(true);
//     try {
//       // Fetch complaints
//       const complaintsRes = await complaintApi.getMyComplaints({ limit: 5 });
//       let complaints = [];
//       if (complaintsRes.data?.success) {
//         complaints = complaintsRes.data.data?.complaints || complaintsRes.data.data || [];
//       }
//       setRecentComplaints(complaints.slice(0, 3));
      
//       const activeCount = complaints.filter(c => 
//         c.status === 'pending' || c.status === 'in_progress' || c.status === 'assigned'
//       ).length;
//       const resolvedCount = complaints.filter(c => 
//         c.status === 'resolved' || c.status === 'closed' || c.status === 'completed'
//       ).length;

//       // Fetch properties
//       const propertiesRes = await propertyApi.getMyProperties();
//       let properties = [];
//       if (propertiesRes.data?.success) {
//         properties = propertiesRes.data.data?.properties || propertiesRes.data.data || [];
//       }

//       // Fetch payment summary
//       const paymentsRes = await paymentApi.getPaymentSummary();
//       let pendingAmount = 0;
//       if (paymentsRes.data?.success) {
//         pendingAmount = paymentsRes.data.data?.pendingAmount || 0;
//       }

//       // Fetch upcoming maintenance
//       const maintenanceRes = await propertyApi.getUpcomingMaintenance();
//       let maintenance = [];
//       if (maintenanceRes.data?.success) {
//         maintenance = maintenanceRes.data.data || [];
//       }
//       setUpcomingMaintenance(maintenance.slice(0, 2));

//       setStats({
//         properties: properties.length,
//         activeComplaints: activeCount,
//         pendingPayment: pendingAmount,
//         resolved: resolvedCount,
//         totalSpent: paymentsRes.data?.data?.totalSpent || 0
//       });
      
//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       // 🔴 FIX: Don't show error for 403, just use default values
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//       // Set default mock data for demo
//       setStats({
//         properties: 1,
//         activeComplaints: 2,
//         pendingPayment: 234,
//         resolved: 5,
//         totalSpent: 1250
//       });
//       setRecentComplaints([
//         { id: 1, title: 'Electrical Issue', status: 'in_progress', createdAt: '2024-01-15' },
//         { id: 2, title: 'Plumbing Leak', status: 'resolved', createdAt: '2024-01-10' }
//       ]);
//       setUpcomingMaintenance([
//         { id: 1, title: 'AC Service', scheduledDate: '2024-02-15' },
//         { id: 2, title: 'Pest Control', scheduledDate: '2024-02-20' }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }, [showToast]);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//       showToast('Logged out successfully', 'success');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   // 🔴 FIX: Get status badge color
//   const getStatusBadge = (status) => {
//     const statusMap = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-orange-100 text-orange-800',
//       resolved: 'bg-green-100 text-green-800',
//       completed: 'bg-green-100 text-green-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return statusMap[status] || statusMap.pending;
//   };

//   // 🔴 FIX: Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage your property and services.</p>
//         </div>
//         <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//           <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-blue-600">{stats.properties}</p>
//           <p className="text-sm text-gray-500">My Properties</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-orange-600">{stats.activeComplaints}</p>
//           <p className="text-sm text-gray-500">Active Complaints</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-red-600">${stats.pendingPayment.toLocaleString()}</p>
//           <p className="text-sm text-gray-500">Pending Payment</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
//           <p className="text-sm text-gray-500">Resolved Issues</p>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/complaints/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">📋</div>
//           <p className="text-sm font-medium">Raise Complaint</p>
//         </Link>
//         <Link to="/services/book" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-2xl mb-1">🔧</div>
//           <p className="text-sm font-medium">Book Service</p>
//         </Link>
//         <Link to="/payments" className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 transition-colors">
//           <div className="text-2xl mb-1">💰</div>
//           <p className="text-sm font-medium">Pay Dues</p>
//         </Link>
//         <Link to="/visitor-pass" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-2xl mb-1">🔑</div>
//           <p className="text-sm font-medium">Visitor Pass</p>
//         </Link>
//       </div>

//       {/* Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Complaints */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
//             <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-800">
//               View All →
//             </Link>
//           </div>
//           <div className="space-y-3">
//             {recentComplaints.length > 0 ? (
//               recentComplaints.map(complaint => (
//                 <div key={complaint._id || complaint.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div>
//                     <p className="font-medium text-gray-900">{complaint.title || complaint.subject}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Submitted: {formatDate(complaint.createdAt || complaint.createdAt)}
//                     </p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(complaint.status)}`}>
//                     {complaint.status?.replace(/_/g, ' ') || 'Pending'}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No complaints found</p>
//                 <Link to="/complaints/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
//                   Raise your first complaint
//                 </Link>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Upcoming Maintenance */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Upcoming Maintenance</h3>
//             <span className="text-xs text-gray-500">This month</span>
//           </div>
//           <div className="space-y-3">
//             {upcomingMaintenance.length > 0 ? (
//               upcomingMaintenance.map(maintenance => (
//                 <div key={maintenance._id || maintenance.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div>
//                     <p className="font-medium text-gray-900">{maintenance.title}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Scheduled: {formatDate(maintenance.scheduledDate || maintenance.date)}
//                     </p>
//                   </div>
//                   <Button size="sm" variant="secondary">Reschedule</Button>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No upcoming maintenance</p>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Recent Payments */}
//       {recentPayments.length > 0 && (
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Payments</h3>
//             <Link to="/payments/history" className="text-sm text-blue-600 hover:text-blue-800">
//               View History →
//             </Link>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
//                   <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentPayments.map(payment => (
//                   <tr key={payment._id || payment.id} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 text-sm text-gray-500">{formatDate(payment.date)}</td>
//                     <td className="px-4 py-2 text-sm text-gray-900">{payment.description}</td>
//                     <td className="px-4 py-2 text-sm font-medium text-gray-900">${payment.amount}</td>
//                     <td className="px-4 py-2">
//                       <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
//                         {payment.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default CustomerDashboard;


// // client/src/pages/dashboard/CustomerDashboard.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const CustomerDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     properties: 1,
//     activeComplaints: 0,
//     pendingPayment: 0,
//     resolved: 0
//   });
//   const [recentComplaints, setRecentComplaints] = useState([]);
//   const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);

//   // 🔴 FIX: Simplified data fetching without external APIs
//   const fetchDashboardData = useCallback(async () => {
//     setLoading(true);
//     try {
//       // 🔴 FIX: Try to fetch complaints from existing API
//       let complaints = [];
//       let activeCount = 2;
//       let resolvedCount = 3;
      
//       try {
//         // Try to fetch from complaint API if available
//         const { complaintApi } = await import('../../api/complaint.api').catch(() => ({ complaintApi: null }));
//         if (complaintApi && complaintApi.getMyComplaints) {
//           const response = await complaintApi.getMyComplaints({ limit: 5 });
//           if (response.data?.success) {
//             complaints = response.data.data?.complaints || response.data.data || [];
//             activeCount = complaints.filter(c => 
//               c.status === 'pending' || c.status === 'in_progress' || c.status === 'assigned'
//             ).length;
//             resolvedCount = complaints.filter(c => 
//               c.status === 'resolved' || c.status === 'closed' || c.status === 'completed'
//             ).length;
//           }
//         }
//       } catch (apiError) {
//         console.log('Complaint API not available, using mock data');
//       }
      
//       // Use mock data if no complaints fetched
//       if (complaints.length === 0) {
//         complaints = [
//           { id: 1, title: 'Electrical Issue - Power fluctuation', status: 'in_progress', createdAt: '2024-01-15' },
//           { id: 2, title: 'Plumbing Leak in Kitchen', status: 'pending', createdAt: '2024-01-10' },
//           { id: 3, title: 'AC not cooling properly', status: 'resolved', createdAt: '2024-01-05' }
//         ];
//         activeCount = 2;
//         resolvedCount = 1;
//       }
      
//       setRecentComplaints(complaints.slice(0, 3));
      
//       // Mock maintenance data
//       const maintenance = [
//         { id: 1, title: 'AC Service - Summer Preparation', scheduledDate: '2024-02-15' },
//         { id: 2, title: 'Annual Fire Safety Check', scheduledDate: '2024-02-20' }
//       ];
//       setUpcomingMaintenance(maintenance);
      
//       setStats({
//         properties: 1,
//         activeComplaints: activeCount,
//         pendingPayment: 234,
//         resolved: resolvedCount
//       });
      
//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       // Set default mock data
//       setStats({
//         properties: 1,
//         activeComplaints: 2,
//         pendingPayment: 234,
//         resolved: 5
//       });
//       setRecentComplaints([
//         { id: 1, title: 'Electrical Issue', status: 'in_progress', createdAt: '2024-01-15' },
//         { id: 2, title: 'Plumbing Leak', status: 'pending', createdAt: '2024-01-10' },
//         { id: 3, title: 'AC Service Request', status: 'resolved', createdAt: '2024-01-05' }
//       ]);
//       setUpcomingMaintenance([
//         { id: 1, title: 'AC Service', scheduledDate: '2024-02-15' },
//         { id: 2, title: 'Pest Control', scheduledDate: '2024-02-20' }
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchDashboardData();
//   }, [fetchDashboardData]);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login');
//       showToast('Logged out successfully', 'success');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       pending: 'bg-yellow-100 text-yellow-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-orange-100 text-orange-800',
//       'in-progress': 'bg-orange-100 text-orange-800',
//       resolved: 'bg-green-100 text-green-800',
//       completed: 'bg-green-100 text-green-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return statusMap[status] || statusMap.pending;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage your property and services.</p>
//         </div>
//         <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//           <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-blue-600">{stats.properties}</p>
//           <p className="text-sm text-gray-500">My Properties</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-orange-600">{stats.activeComplaints}</p>
//           <p className="text-sm text-gray-500">Active Complaints</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-red-600">${stats.pendingPayment}</p>
//           <p className="text-sm text-gray-500">Pending Payment</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
//           <p className="text-sm text-gray-500">Resolved Issues</p>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/complaints/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">📋</div>
//           <p className="text-sm font-medium">Raise Complaint</p>
//         </Link>
//         <Link to="/services/book" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-2xl mb-1">🔧</div>
//           <p className="text-sm font-medium">Book Service</p>
//         </Link>
//         <Link to="/payments" className="bg-yellow-50 p-4 rounded-lg text-center hover:bg-yellow-100 transition-colors">
//           <div className="text-2xl mb-1">💰</div>
//           <p className="text-sm font-medium">Pay Dues</p>
//         </Link>
//         <Link to="/visitor-pass" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-2xl mb-1">🔑</div>
//           <p className="text-sm font-medium">Visitor Pass</p>
//         </Link>
//       </div>

//       {/* Two Column Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Complaints */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
//             <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-800">
//               View All →
//             </Link>
//           </div>
//           <div className="space-y-3">
//             {recentComplaints.length > 0 ? (
//               recentComplaints.map(complaint => (
//                 <div key={complaint._id || complaint.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div>
//                     <p className="font-medium text-gray-900">{complaint.title || complaint.subject}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Submitted: {formatDate(complaint.createdAt || complaint.createdAt)}
//                     </p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(complaint.status)}`}>
//                     {complaint.status?.replace(/_/g, ' ') || 'Pending'}
//                   </span>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No complaints found</p>
//                 <Link to="/complaints/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
//                   Raise your first complaint
//                 </Link>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Upcoming Maintenance */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Upcoming Maintenance</h3>
//             <span className="text-xs text-gray-500">This month</span>
//           </div>
//           <div className="space-y-3">
//             {upcomingMaintenance.length > 0 ? (
//               upcomingMaintenance.map(maintenance => (
//                 <div key={maintenance._id || maintenance.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div>
//                     <p className="font-medium text-gray-900">{maintenance.title}</p>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Scheduled: {formatDate(maintenance.scheduledDate || maintenance.date)}
//                     </p>
//                   </div>
//                   <Button size="sm" variant="secondary">Reschedule</Button>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No upcoming maintenance</p>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Help & Support Section */}
//       <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4">
//           <div>
//             <h3 className="font-semibold text-gray-900">Need Help?</h3>
//             <p className="text-sm text-gray-600 mt-1">24/7 Customer support available</p>
//           </div>
//           <div className="flex gap-3">
//             <Link to="/contact">
//               <Button variant="secondary">
//                 <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//                 </svg>
//                 Email Support
//               </Button>
//             </Link>
//             <Link to="/faq">
//               <Button variant="secondary">FAQ</Button>
//             </Link>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default CustomerDashboard;











// client/src/pages/dashboard/CustomerDashboard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import { visitorPassApi } from '../../api/visitorPass.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showVisitorModal, setShowVisitorModal] = useState(false);
  const [recentChats, setRecentChats] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [visitorForm, setVisitorForm] = useState({
    visitorName: '',
    visitorPhone: '',
    purpose: '',
    visitDate: '',
    visitTime: '',
    vehicleNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [stats, setStats] = useState({
    properties: 1,
    activeComplaints: 0,
    pendingPayment: 0,
    resolved: 0,
    activeVisitors: 0,
    pendingVisitors: 0
  });
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
  const [recentVisitors, setRecentVisitors] = useState([]);

  // Fetch chat data
  const fetchChatData = useCallback(async () => {
    try {
      // Get unread messages count
      const unreadRes = await chatApi.getTotalUnreadCount();
      if (unreadRes.data?.success) {
        setUnreadMessages(unreadRes.data.data?.count || 0);
      }
      
      // Get user's chats
      const chatsRes = await chatApi.getUserChats();
      if (chatsRes.data?.success) {
        const chats = chatsRes.data.data || [];
        const recentChatsList = chats.slice(0, 3).map(chat => ({
          id: chat._id,
          name: chat.chatType === 'group' 
            ? chat.groupName 
            : chat.participants?.find(p => p.userId?._id !== user?._id)?.userId?.firstName || 'Support',
          lastMessage: chat.lastMessage?.message || 'No messages',
          timestamp: chat.lastMessage?.timestamp,
          unreadCount: chat.unreadCount || 0,
          chatType: chat.chatType
        }));
        setRecentChats(recentChatsList);
      }
    } catch (error) {
      console.warn('Chat data not available:', error.message);
    }
  }, [user]);

  // Fetch visitor pass data
  const fetchVisitorData = useCallback(async () => {
    try {
      // Get active visitor passes
      const activeRes = await visitorPassApi.getActivePasses();
      if (activeRes.data?.success) {
        const activeVisitors = activeRes.data.data?.length || 0;
        setStats(prev => ({ ...prev, activeVisitors: activeVisitors }));
      }
      
      // Get pending visitor requests
      const pendingRes = await visitorPassApi.getPendingRequests();
      if (pendingRes.data?.success) {
        const pendingVisitors = pendingRes.data.data?.length || 0;
        setStats(prev => ({ ...prev, pendingVisitors: pendingVisitors }));
      }
      
      // Get recent visitors
      const historyRes = await visitorPassApi.getVisitorHistory();
      if (historyRes.data?.success) {
        const visitors = historyRes.data.data?.slice(0, 3) || [];
        setRecentVisitors(visitors);
      }
    } catch (error) {
      console.warn('Visitor pass API not available:', error.message);
      // Use mock data for development
      setStats(prev => ({ 
        ...prev, 
        activeVisitors: 0, 
        pendingVisitors: 1 
      }));
      setRecentVisitors([
        { id: 1, visitorName: 'John Smith', visitDate: '2024-01-15', status: 'approved' },
        { id: 2, visitorName: 'Mary Johnson', visitDate: '2024-01-10', status: 'completed' }
      ]);
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch complaints
      let complaints = [];
      let activeCount = 2;
      let resolvedCount = 3;
      
      try {
        const { complaintApi } = await import('../../api/complaint.api').catch(() => ({ complaintApi: null }));
        if (complaintApi && complaintApi.getMyComplaints) {
          const response = await complaintApi.getMyComplaints({ limit: 5 });
          if (response.data?.success) {
            complaints = response.data.data?.complaints || response.data.data || [];
            activeCount = complaints.filter(c => 
              c.status === 'pending' || c.status === 'in_progress' || c.status === 'assigned'
            ).length;
            resolvedCount = complaints.filter(c => 
              c.status === 'resolved' || c.status === 'closed' || c.status === 'completed'
            ).length;
          }
        }
      } catch (apiError) {
        console.log('Complaint API not available, using mock data');
      }
      
      if (complaints.length === 0) {
        complaints = [
          { _id: 1, title: 'Electrical Issue - Power fluctuation', status: 'in_progress', createdAt: '2024-01-15' },
          { _id: 2, title: 'Plumbing Leak in Kitchen', status: 'pending', createdAt: '2024-01-10' },
          { _id: 3, title: 'AC not cooling properly', status: 'resolved', createdAt: '2024-01-05' }
        ];
        activeCount = 2;
        resolvedCount = 1;
      }
      
      setRecentComplaints(complaints.slice(0, 3));
      
      // Mock maintenance data
      const maintenance = [
        { _id: 1, title: 'AC Service - Summer Preparation', scheduledDate: '2024-02-15' },
        { _id: 2, title: 'Annual Fire Safety Check', scheduledDate: '2024-02-20' }
      ];
      setUpcomingMaintenance(maintenance);
      
      setStats(prev => ({
        ...prev,
        properties: 1,
        activeComplaints: activeCount,
        pendingPayment: 234,
        resolved: resolvedCount
      }));
      
      // Fetch chat data
      await fetchChatData();
      
      // Fetch visitor data
      await fetchVisitorData();
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      setStats({
        properties: 1,
        activeComplaints: 2,
        pendingPayment: 234,
        resolved: 5,
        activeVisitors: 0,
        pendingVisitors: 1
      });
      setRecentComplaints([
        { _id: 1, title: 'Electrical Issue', status: 'in_progress', createdAt: '2024-01-15' },
        { _id: 2, title: 'Plumbing Leak', status: 'pending', createdAt: '2024-01-10' },
        { _id: 3, title: 'AC Service Request', status: 'resolved', createdAt: '2024-01-05' }
      ]);
      setUpcomingMaintenance([
        { _id: 1, title: 'AC Service', scheduledDate: '2024-02-15' },
        { _id: 2, title: 'Pest Control', scheduledDate: '2024-02-20' }
      ]);
    } finally {
      setLoading(false);
    }
  }, [fetchChatData, fetchVisitorData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      showToast('Logged out successfully', 'success');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleVisitorSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await visitorPassApi.requestPass(visitorForm);
      if (response.data?.success) {
        showToast('Visitor pass requested successfully', 'success');
        setShowVisitorModal(false);
        setVisitorForm({
          visitorName: '',
          visitorPhone: '',
          purpose: '',
          visitDate: '',
          visitTime: '',
          vehicleNumber: ''
        });
        await fetchVisitorData();
      } else {
        showToast(response.data?.error || 'Failed to request visitor pass', 'error');
      }
    } catch (error) {
      console.error('Visitor pass request error:', error);
      showToast(error.response?.data?.error || 'Failed to request visitor pass', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleVisitorInputChange = (e) => {
    setVisitorForm({
      ...visitorForm,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-orange-100 text-orange-800',
      'in-progress': 'bg-orange-100 text-orange-800',
      resolved: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || statusMap.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const formatTimeAgo = (date) => {
    if (!date) return 'Recently';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Logout and Chat Notification */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customer Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage your property and services.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Chat Notification Badge */}
          <Link to="/chat" className="relative">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
              <span className="text-xl">💬</span>
            </div>
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>
          <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">{stats.properties}</p>
          <p className="text-sm text-gray-500">My Properties</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-orange-600">{stats.activeComplaints}</p>
          <p className="text-sm text-gray-500">Active Complaints</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-red-600">${stats.pendingPayment}</p>
          <p className="text-sm text-gray-500">Pending Payment</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
          <p className="text-sm text-gray-500">Resolved Issues</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">{stats.activeVisitors}</p>
          <p className="text-sm text-gray-500">Active Visitors</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-yellow-600">{stats.pendingVisitors}</p>
          <p className="text-sm text-gray-500">Pending Passes</p>
          <Link to="/visitor-pass" className="text-xs text-blue-600 mt-1 block hover:underline">View →</Link>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Link to="/complaints/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-xl mb-1">📋</div>
          <p className="text-xs font-medium">Raise Complaint</p>
        </Link>
        <Link to="/services/book" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
          <div className="text-xl mb-1">🔧</div>
          <p className="text-xs font-medium">Book Service</p>
        </Link>
        <Link to="/payments" className="bg-yellow-50 p-3 rounded-lg text-center hover:bg-yellow-100 transition-colors">
          <div className="text-xl mb-1">💰</div>
          <p className="text-xs font-medium">Pay Dues</p>
        </Link>
        <button 
          onClick={() => setShowVisitorModal(true)}
          className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors"
        >
          <div className="text-xl mb-1">🔑</div>
          <p className="text-xs font-medium">Request Visitor Pass</p>
        </button>
        <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors relative">
          <div className="text-xl mb-1">💬</div>
          <p className="text-xs font-medium">Support Chat</p>
          {unreadMessages > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {unreadMessages}
            </span>
          )}
        </Link>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Complaints */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
            <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </Link>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentComplaints.length > 0 ? (
              recentComplaints.map(complaint => (
                <div key={complaint._id || complaint.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{complaint.title || complaint.subject}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted: {formatDate(complaint.createdAt || complaint.createdAt)}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(complaint.status)}`}>
                    {complaint.status?.replace(/_/g, ' ') || 'Pending'}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No complaints found</p>
                <Link to="/complaints/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Raise your first complaint
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Chats */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
            <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800">
              Open Chat →
            </Link>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentChats.length > 0 ? (
              recentChats.map(chat => (
                <Link key={chat.id} to={`/chat?chat=${chat.id}`}>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
                        <span className="text-lg">{chat.chatType === 'group' ? '👥' : '👤'}</span>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
                      <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    <div className="text-xs text-gray-400">
                      {formatTimeAgo(chat.timestamp)}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">No conversations yet</p>
                <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 mt-2 inline-block">
                  Start a chat with support
                </Link>
              </div>
            )}
          </div>
          {unreadMessages > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
                You have {unreadMessages} unread message{unreadMessages !== 1 ? 's' : ''} →
              </Link>
            </div>
          )}
        </Card>

        {/* Upcoming Maintenance & Visitors */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Upcoming Maintenance</h3>
            <span className="text-xs text-gray-500">This month</span>
          </div>
          <div className="space-y-3 mb-6">
            {upcomingMaintenance.length > 0 ? (
              upcomingMaintenance.map(maintenance => (
                <div key={maintenance._id || maintenance.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium text-gray-900">{maintenance.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Scheduled: {formatDate(maintenance.scheduledDate || maintenance.date)}
                    </p>
                  </div>
                  <Button size="sm" variant="secondary">Reschedule</Button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No upcoming maintenance</p>
            )}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Recent Visitors</h3>
              <button 
                onClick={() => setShowVisitorModal(true)}
                className="text-sm text-purple-600 hover:text-purple-800"
              >
                + Request Pass
              </button>
            </div>
            <div className="space-y-2">
              {recentVisitors.length > 0 ? (
                recentVisitors.map(visitor => (
                  <div key={visitor.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{visitor.visitorName}</p>
                      <p className="text-xs text-gray-500">{formatDate(visitor.visitDate)}</p>
                    </div>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(visitor.status)}`}>
                      {visitor.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 text-sm py-4">No recent visitors</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Help & Support Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-semibold text-gray-900">Need Help?</h3>
            <p className="text-sm text-gray-600 mt-1">24/7 Customer support available via chat</p>
          </div>
          <div className="flex gap-3">
            <Link to="/chat">
              <Button variant="primary" className="bg-cyan-600 hover:bg-cyan-700">
                <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Live Chat
              </Button>
            </Link>
            <Link to="/faq">
              <Button variant="secondary">FAQ</Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Visitor Pass Request Modal */}
      <Modal 
        isOpen={showVisitorModal} 
        onClose={() => setShowVisitorModal(false)} 
        title="Request Visitor Pass"
        size="lg"
      >
        <form onSubmit={handleVisitorSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="visitorName"
                value={visitorForm.visitorName}
                onChange={handleVisitorInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter visitor name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="visitorPhone"
                value={visitorForm.visitorPhone}
                onChange={handleVisitorInputChange}
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Enter visitor phone number"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose of Visit <span className="text-red-500">*</span>
            </label>
            <select
              name="purpose"
              value={visitorForm.purpose}
              onChange={handleVisitorInputChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select purpose</option>
              <option value="delivery">Delivery</option>
              <option value="guest">Guest Visit</option>
              <option value="maintenance">Maintenance</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="visitDate"
                value={visitorForm.visitDate}
                onChange={handleVisitorInputChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visit Time
              </label>
              <input
                type="time"
                name="visitTime"
                value={visitorForm.visitTime}
                onChange={handleVisitorInputChange}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Number (Optional)
            </label>
            <input
              type="text"
              name="vehicleNumber"
              value={visitorForm.vehicleNumber}
              onChange={handleVisitorInputChange}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              placeholder="Enter vehicle number for parking"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowVisitorModal(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={submitting} className="bg-purple-600 hover:bg-purple-700">
              Request Pass
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CustomerDashboard;