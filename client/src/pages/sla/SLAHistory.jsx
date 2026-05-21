// // client/src/pages/sla/SLAHistory.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { slaApi } from '../../api/sla.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SLAHistory = () => {
//   const { taskId } = useParams();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [slaData, setSlaData] = useState(null);
//   const [taskInfo, setTaskInfo] = useState(null);
//   const [escalationHistory, setEscalationHistory] = useState([]);
//   const [breachHistory, setBreachHistory] = useState([]);

//   useEffect(() => {
//     fetchSLAHistory();
//   }, [taskId]);

//   const fetchSLAHistory = async () => {
//     setLoading(true);
//     try {
//       const response = await slaApi.getSLAHistory(taskId);
//       if (response.data.success) {
//         setSlaData(response.data.data);
//         setTaskInfo(response.data.data.task);
//         setEscalationHistory(response.data.data.history?.filter(h => h.type === 'escalation') || []);
//         setBreachHistory(response.data.data.history?.filter(h => h.type === 'breach') || []);
//       }
//     } catch (error) {
//       console.error('Fetch SLA history error:', error);
//       showToast('Failed to load SLA history', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       critical: 'bg-red-100 text-red-800',
//       high: 'bg-orange-100 text-orange-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-green-100 text-green-800'
//     };
//     return colors[priority] || colors.medium;
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       on_track: 'bg-green-100 text-green-800',
//       warning: 'bg-yellow-100 text-yellow-800',
//       at_risk: 'bg-orange-100 text-orange-800',
//       breached: 'bg-red-100 text-red-800'
//     };
//     return statuses[status] || statuses.on_track;
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString();
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes) return '0 min';
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     if (hours > 0) {
//       return `${hours}h ${mins}m`;
//     }
//     return `${mins} min`;
//   };

//   if (loading) return <Spinner />;

//   if (!slaData) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <p className="text-yellow-800">No SLA history found for this task.</p>
//           <Link to="/tasks" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
//             ← Back to Tasks
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SLA History</h1>
//           <p className="text-gray-500 mt-1">Track Service Level Agreement compliance and breaches</p>
//         </div>
//         <Link to={`/tasks/${taskId}`}>
//           <Button variant="secondary" size="sm">
//             ← Back to Task
//           </Button>
//         </Link>
//       </div>

//       {/* Task Information */}
//       {taskInfo && (
//         <Card className="p-6">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <p className="text-sm text-gray-500">Task ID</p>
//               <p className="font-medium">{taskInfo.taskId}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Title</p>
//               <p className="font-medium">{taskInfo.title}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Priority</p>
//               <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(taskInfo.priority)}`}>
//                 {taskInfo.priority}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Status</p>
//               <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(slaData.currentStatus?.status)}`}>
//                 {slaData.currentStatus?.status?.replace('_', ' ')}
//               </span>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">SLA Deadline</p>
//               <p className="font-medium">{formatDateTime(taskInfo.slaDeadline)}</p>
//             </div>
//             <div>
//               <p className="text-sm text-gray-500">Time Remaining</p>
//               <p className={`font-medium ${slaData.currentStatus?.timeRemaining < 2 ? 'text-red-600' : 'text-green-600'}`}>
//                 {slaData.currentStatus?.timeRemaining} hours
//               </p>
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* SLA Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{slaData.totalEscalations || 0}</p>
//           <p className="text-sm text-gray-500">Total Escalations</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{slaData.totalBreaches || 0}</p>
//           <p className="text-sm text-gray-500">Total Breaches</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{slaData.currentStatus?.percentageUsed || 0}%</p>
//           <p className="text-sm text-gray-500">SLA Used</p>
//         </Card>
//       </div>

//       {/* Escalation History */}
//       {escalationHistory.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-red-50">
//             <h3 className="font-semibold text-red-800">🚨 Escalation History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escalated To</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved At</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {escalationHistory.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(item.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                         Level {item.metadata?.escalationLevel || idx + 1}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.metadata?.escalatedToRole || 'Higher Level'}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {item.description || item.metadata?.reason}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.metadata?.resolvedAt ? formatDateTime(item.metadata.resolvedAt) : 'Pending'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Breach History */}
//       {breachHistory.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-red-50">
//             <h3 className="font-semibold text-red-800">⚠️ Breach History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breach Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration Exceeded</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {breachHistory.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(item.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                         {item.metadata?.breachType || 'SLA Breach'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDuration(item.metadata?.breachDuration)}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {item.description || item.metadata?.breachReason || 'SLA deadline exceeded'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* No History Message */}
//       {escalationHistory.length === 0 && breachHistory.length === 0 && (
//         <Card className="p-12 text-center">
//           <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//           <p className="text-gray-500">No SLA history records found for this task.</p>
//           <p className="text-sm text-gray-400 mt-1">This task has no escalations or breaches recorded.</p>
//         </Card>
//       )}

//       {/* SLA Timeline Visualization */}
//       {(escalationHistory.length > 0 || breachHistory.length > 0) && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">📊 SLA Timeline</h3>
//           <div className="relative">
//             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
//             <div className="space-y-6">
//               {[...escalationHistory, ...breachHistory]
//                 .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
//                 .map((item, idx) => (
//                   <div key={idx} className="relative pl-10">
//                     <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                       item.type === 'escalation' ? 'bg-red-100' : 'bg-orange-100'
//                     }`}>
//                       {item.type === 'escalation' ? '🚨' : '⚠️'}
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-4">
//                       <div className="flex justify-between items-start">
//                         <div>
//                           <p className="font-medium text-gray-900">
//                             {item.type === 'escalation' ? 'Escalation' : 'SLA Breach'}
//                           </p>
//                           <p className="text-sm text-gray-500 mt-1">
//                             {formatDateTime(item.timestamp)}
//                           </p>
//                         </div>
//                         {item.type === 'escalation' && (
//                           <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                             Level {item.metadata?.escalationLevel}
//                           </span>
//                         )}
//                       </div>
//                       <p className="text-sm text-gray-600 mt-2">
//                         {item.description || item.metadata?.reason || 'SLA deadline exceeded'}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//             </div>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SLAHistory;



// // client/src/pages/sla/SLAHistory.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { slaApi } from '../../api/sla.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SLAHistory = () => {
//   const { taskId } = useParams();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [slaData, setSlaData] = useState(null);
//   const [taskInfo, setTaskInfo] = useState(null);
//   const [escalationHistory, setEscalationHistory] = useState([]);
//   const [breachHistory, setBreachHistory] = useState([]);

//   useEffect(() => {
//     if (taskId) {
//       fetchSLAHistory();
//     }
//   }, [taskId]);

//   const fetchSLAHistory = async () => {
//     setLoading(true);
//     try {
//       const response = await slaApi.getSLAHistory(taskId);
      
//       // Handle different response structures
//       let data = null;
//       if (response.data && response.data.success) {
//         data = response.data.data;
//       } else if (response.data && !response.data.success) {
//         data = response.data;
//       } else if (response.data && response.data.history) {
//         data = response.data;
//       } else if (response.data && response.data.task) {
//         data = response.data;
//       }
      
//       if (data) {
//         setSlaData(data);
//         setTaskInfo(data.task || null);
        
//         // Safely extract history arrays
//         const history = data.history || data.escalationHistory || [];
//         setEscalationHistory(
//           Array.isArray(history) 
//             ? history.filter(h => h && (h.type === 'escalation' || h.type === 'escalate'))
//             : []
//         );
//         setBreachHistory(
//           Array.isArray(history)
//             ? history.filter(h => h && (h.type === 'breach' || h.type === 'breached'))
//             : []
//         );
//       } else {
//         // No data found
//         setSlaData(null);
//         setTaskInfo(null);
//         setEscalationHistory([]);
//         setBreachHistory([]);
//       }
//     } catch (error) {
//       console.error('Fetch SLA history error:', error);
//       showToast(error.response?.data?.message || 'Failed to load SLA history', 'error');
//       setSlaData(null);
//       setTaskInfo(null);
//       setEscalationHistory([]);
//       setBreachHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       critical: 'bg-red-100 text-red-800',
//       high: 'bg-orange-100 text-orange-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-green-100 text-green-800'
//     };
//     return colors[priority?.toLowerCase()] || colors.medium;
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       on_track: 'bg-green-100 text-green-800',
//       warning: 'bg-yellow-100 text-yellow-800',
//       at_risk: 'bg-orange-100 text-orange-800',
//       breached: 'bg-red-100 text-red-800'
//     };
//     return statuses[status?.toLowerCase()] || statuses.on_track;
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes && minutes !== 0) return 'N/A';
//     if (minutes < 0) return 'Overdue';
//     if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins}m` : ''}`;
//     const days = Math.floor(hours / 24);
//     const remainingHours = hours % 24;
//     return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       on_track: 'On Track',
//       warning: 'Warning',
//       at_risk: 'At Risk',
//       breached: 'Breached'
//     };
//     return statusMap[status?.toLowerCase()] || status || 'Unknown';
//   };

//   const getTimeRemainingText = (hours) => {
//     if (!hours && hours !== 0) return 'N/A';
//     if (hours < 0) return 'Overdue';
//     if (hours < 1) return `${Math.round(hours * 60)} minutes`;
//     if (hours < 24) return `${Math.round(hours)} hours`;
//     return `${Math.round(hours / 24)} days`;
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-96">
//         <Spinner />
//       </div>
//     );
//   }

//   if (!slaData || !taskInfo) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <div className="text-4xl mb-4">📋</div>
//           <p className="text-yellow-800 font-medium">No SLA history found for this task.</p>
//           <p className="text-sm text-yellow-600 mt-1">Task ID: {taskId}</p>
//           <Link to="/tasks" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
//             ← Back to Tasks
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const currentStatus = slaData.currentStatus || slaData.status || {};
//   const timeRemaining = currentStatus.timeRemaining || slaData.timeRemaining;
//   const percentageUsed = currentStatus.percentageUsed || slaData.percentageUsed || 0;
//   const totalEscalations = slaData.totalEscalations || escalationHistory.length || 0;
//   const totalBreaches = slaData.totalBreaches || breachHistory.length || 0;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SLA History</h1>
//           <p className="text-gray-500 mt-1">Track Service Level Agreement compliance and breaches</p>
//         </div>
//         <Link to={`/tasks/${taskId}`}>
//           <Button variant="secondary" size="sm">
//             ← Back to Task
//           </Button>
//         </Link>
//       </div>

//       {/* Task Information */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <p className="text-sm text-gray-500">Task ID</p>
//             <p className="font-medium">{taskInfo.taskId || taskInfo._id?.slice(-8) || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Title</p>
//             <p className="font-medium">{taskInfo.title || 'Untitled Task'}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Priority</p>
//             <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(taskInfo.priority)}`}>
//               {taskInfo.priority?.toUpperCase() || 'MEDIUM'}
//             </span>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">SLA Status</p>
//             <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(currentStatus.status)}`}>
//               {getStatusText(currentStatus.status)}
//             </span>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">SLA Deadline</p>
//             <p className="font-medium">{formatDateTime(taskInfo.slaDeadline)}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Time Remaining</p>
//             <p className={`font-medium ${timeRemaining < 2 ? 'text-red-600' : timeRemaining < 6 ? 'text-orange-600' : 'text-green-600'}`}>
//               {getTimeRemainingText(timeRemaining)}
//             </p>
//           </div>
//         </div>
//       </Card>

//       {/* SLA Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{totalEscalations}</p>
//           <p className="text-sm text-gray-500">Total Escalations</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{totalBreaches}</p>
//           <p className="text-sm text-gray-500">Total Breaches</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{percentageUsed}%</p>
//           <p className="text-sm text-gray-500">SLA Used</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{slaData.escalationLevel || 0}</p>
//           <p className="text-sm text-gray-500">Current Escalation Level</p>
//         </Card>
//       </div>

//       {/* Escalation History */}
//       {escalationHistory.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-red-50">
//             <h3 className="font-semibold text-red-800">🚨 Escalation History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escalated To</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved At</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {escalationHistory.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(item.timestamp || item.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                         Level {item.level || item.metadata?.escalationLevel || idx + 1}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.escalatedTo || item.metadata?.escalatedToRole || 'Higher Management'}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {item.reason || item.description || item.metadata?.reason || 'SLA deadline approaching'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.resolvedAt ? formatDateTime(item.resolvedAt) : 'Pending'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Breach History */}
//       {breachHistory.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-red-50">
//             <h3 className="font-semibold text-red-800">⚠️ Breach History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breach Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration Exceeded</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {breachHistory.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(item.timestamp || item.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                         {item.type || item.metadata?.breachType || 'SLA Breach'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDuration(item.duration || item.metadata?.breachDuration)}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {item.reason || item.description || item.metadata?.breachReason || 'SLA deadline exceeded'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* No History Message */}
//       {escalationHistory.length === 0 && breachHistory.length === 0 && (
//         <Card className="p-12 text-center">
//           <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <p className="text-gray-500 font-medium">No SLA History Records</p>
//           <p className="text-sm text-gray-400 mt-1">This task has no escalations or breaches recorded.</p>
//           <p className="text-xs text-gray-400 mt-2">The task is currently on track with its SLA deadline.</p>
//         </Card>
//       )}

//       {/* SLA Timeline Visualization */}
//       {(escalationHistory.length > 0 || breachHistory.length > 0) && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">📊 SLA Timeline</h3>
//           <div className="relative">
//             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
//             <div className="space-y-6">
//               {[...escalationHistory, ...breachHistory]
//                 .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
//                 .map((item, idx) => {
//                   const itemDate = item.timestamp || item.createdAt;
//                   const isEscalation = item.type === 'escalation' || item.type === 'escalate';
//                   return (
//                     <div key={idx} className="relative pl-10">
//                       <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                         isEscalation ? 'bg-red-100' : 'bg-orange-100'
//                       }`}>
//                         {isEscalation ? '🚨' : '⚠️'}
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <div className="flex justify-between items-start flex-wrap gap-2">
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {isEscalation ? 'Escalation' : 'SLA Breach'}
//                             </p>
//                             <p className="text-sm text-gray-500 mt-1">
//                               {formatDateTime(itemDate)}
//                             </p>
//                           </div>
//                           {isEscalation && (
//                             <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                               Level {item.level || item.metadata?.escalationLevel}
//                             </span>
//                           )}
//                           {!isEscalation && (
//                             <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
//                               {formatDuration(item.duration || item.metadata?.breachDuration)}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 mt-2">
//                           {item.reason || item.description || item.metadata?.reason || 
//                            (isEscalation ? 'SLA deadline approaching' : 'SLA deadline exceeded')}
//                         </p>
//                         {isEscalation && item.resolvedAt && (
//                           <p className="text-xs text-green-600 mt-2">
//                             ✓ Resolved at {formatDateTime(item.resolvedAt)}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SLAHistory;




// // client/src/pages/sla/SLAHistory.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
// import { slaApi } from '../../api/sla.api';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SLAHistory = () => {
//   const { taskId } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [slaData, setSlaData] = useState(null);
//   const [taskInfo, setTaskInfo] = useState(null);
//   const [escalationHistory, setEscalationHistory] = useState([]);
//   const [breachHistory, setBreachHistory] = useState([]);
//   const [usingMockData, setUsingMockData] = useState(false);

//   useEffect(() => {
//     if (taskId) {
//       fetchSLAHistory();
//     } else {
//       setLoading(false);
//       setError('No task ID provided');
//     }
//   }, [taskId]);

//   // Generate mock SLA history data (fallback when API is unavailable)
//   const generateMockSLAHistory = (task) => {
//     const now = new Date();
//     const createdAt = task.createdAt ? new Date(task.createdAt) : new Date(now - 7 * 24 * 60 * 60 * 1000);
//     const deadline = task.slaDeadline ? new Date(task.slaDeadline) : new Date(now + 2 * 24 * 60 * 60 * 1000);
    
//     const totalHours = (deadline - createdAt) / (1000 * 60 * 60);
//     const elapsedHours = (now - createdAt) / (1000 * 60 * 60);
//     const percentageUsed = Math.min(Math.round((elapsedHours / totalHours) * 100), 100);
    
//     const timeRemaining = Math.max(0, (deadline - now) / (1000 * 60 * 60));
    
//     let status = 'on_track';
//     if (timeRemaining < 0) status = 'breached';
//     else if (timeRemaining < 2) status = 'at_risk';
//     else if (timeRemaining < 6) status = 'warning';
    
//     // Generate mock escalation history
//     const mockEscalations = [];
//     const mockBreaches = [];
    
//     if (percentageUsed > 70) {
//       mockEscalations.push({
//         type: 'escalation',
//         timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
//         level: 1,
//         escalatedTo: 'Supervisor',
//         reason: 'Task approaching SLA deadline',
//         resolvedAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString()
//       });
//     }
    
//     if (percentageUsed > 90) {
//       mockEscalations.push({
//         type: 'escalation',
//         timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
//         level: 2,
//         escalatedTo: 'Manager',
//         reason: 'Task still not completed, SLA at risk',
//         resolvedAt: null
//       });
//     }
    
//     if (timeRemaining < 0) {
//       mockBreaches.push({
//         type: 'breach',
//         timestamp: deadline.toISOString(),
//         duration: Math.abs(timeRemaining) * 60,
//         reason: 'Task missed SLA deadline'
//       });
//     }
    
//     return {
//       task: {
//         _id: task._id,
//         taskId: task.taskId || task._id?.slice(-8),
//         title: task.title || 'Untitled Task',
//         priority: task.priority || 'medium',
//         slaDeadline: task.slaDeadline,
//         createdAt: task.createdAt
//       },
//       currentStatus: {
//         status: status,
//         timeRemaining: timeRemaining,
//         percentageUsed: percentageUsed
//       },
//       totalEscalations: mockEscalations.length,
//       totalBreaches: mockBreaches.length,
//       escalationLevel: mockEscalations.length,
//       history: [...mockEscalations, ...mockBreaches],
//       escalationHistory: mockEscalations,
//       breachHistory: mockBreaches
//     };
//   };

//   const fetchSLAHistory = async () => {
//     setLoading(true);
//     setError(null);
//     setUsingMockData(false);
    
//     try {
//       // First, try to fetch task details
//       let taskDetails = null;
//       try {
//         const taskResponse = await taskApi.getTaskById(taskId);
//         if (taskResponse?.data?.success) {
//           taskDetails = taskResponse.data.data;
//         } else if (taskResponse?.data) {
//           taskDetails = taskResponse.data;
//         }
//       } catch (taskError) {
//         console.log('Task API error, will use mock data:', taskError.message);
//       }
      
//       // Try to fetch SLA history
//       let response = null;
//       try {
//         response = await slaApi.getSLAHistory(taskId);
//       } catch (slaError) {
//         console.log('SLA API error, will use mock data:', slaError.message);
//       }
      
//       // Process response or use mock data
//       let data = null;
      
//       if (response?.data?.success && response.data.data) {
//         data = response.data.data;
//       } else if (response?.data && response.data.history) {
//         data = response.data;
//       } else if (response?.data && response.data.task) {
//         data = response.data;
//       } else if (taskDetails) {
//         // Generate mock data based on task details
//         data = generateMockSLAHistory(taskDetails);
//         setUsingMockData(true);
//       } else {
//         // Create a mock task object and generate data
//         const mockTask = {
//           _id: taskId,
//           taskId: taskId.slice(-8),
//           title: 'Sample Task',
//           priority: 'medium',
//           slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
//           createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
//         };
//         data = generateMockSLAHistory(mockTask);
//         setUsingMockData(true);
//       }
      
//       if (data) {
//         setSlaData(data);
//         setTaskInfo(data.task || null);
        
//         // Safely extract history arrays
//         const history = data.history || data.escalationHistory || [];
//         const escalations = Array.isArray(history) 
//           ? history.filter(h => h && (h.type === 'escalation' || h.type === 'escalate'))
//           : [];
//         const breaches = Array.isArray(history)
//           ? history.filter(h => h && (h.type === 'breach' || h.type === 'breached'))
//           : [];
        
//         setEscalationHistory(escalations);
//         setBreachHistory(breaches);
        
//         if (usingMockData) {
//           showToast('Using demo data - SLA history API not available', 'info');
//         }
//       } else {
//         throw new Error('No data available');
//       }
      
//     } catch (error) {
//       console.error('Fetch SLA history error:', error);
//       setError(error.message || 'Failed to load SLA history');
//       showToast(error.response?.data?.message || 'Failed to load SLA history', 'error');
      
//       // Set empty data
//       setSlaData(null);
//       setTaskInfo(null);
//       setEscalationHistory([]);
//       setBreachHistory([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       critical: 'bg-red-100 text-red-800',
//       high: 'bg-orange-100 text-orange-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-green-100 text-green-800'
//     };
//     return colors[priority?.toLowerCase()] || colors.medium;
//   };

//   const getStatusBadge = (status) => {
//     const statuses = {
//       on_track: 'bg-green-100 text-green-800',
//       warning: 'bg-yellow-100 text-yellow-800',
//       at_risk: 'bg-orange-100 text-orange-800',
//       breached: 'bg-red-100 text-red-800'
//     };
//     return statuses[status?.toLowerCase()] || statuses.on_track;
//   };

//   const formatDateTime = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch (error) {
//       return dateString;
//     }
//   };

//   const formatDuration = (minutes) => {
//     if (!minutes && minutes !== 0) return 'N/A';
//     if (minutes < 0) return 'Overdue';
//     if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins}m` : ''}`;
//     const days = Math.floor(hours / 24);
//     const remainingHours = hours % 24;
//     return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
//   };

//   const getStatusText = (status) => {
//     const statusMap = {
//       on_track: 'On Track',
//       warning: 'Warning',
//       at_risk: 'At Risk',
//       breached: 'Breached'
//     };
//     return statusMap[status?.toLowerCase()] || status || 'Unknown';
//   };

//   const getTimeRemainingText = (hours) => {
//     if (!hours && hours !== 0) return 'N/A';
//     if (hours < 0) return 'Overdue';
//     if (hours < 1) return `${Math.round(hours * 60)} minutes`;
//     if (hours < 24) return `${Math.round(hours)} hours`;
//     return `${Math.round(hours / 24)} days`;
//   };

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-96">
//         <Spinner />
//         <p className="text-gray-500 mt-4">Loading SLA history...</p>
//       </div>
//     );
//   }

//   if (error && !slaData) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <div className="text-4xl mb-4">❌</div>
//           <p className="text-red-800 font-medium">Error loading SLA history</p>
//           <p className="text-sm text-red-600 mt-1">{error}</p>
//           <div className="flex gap-3 justify-center mt-4">
//             <button onClick={fetchSLAHistory} className="text-blue-600 hover:text-blue-800">
//               Retry
//             </button>
//             <Link to="/tasks" className="text-gray-600 hover:text-gray-800">
//               Back to Tasks
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!slaData || !taskInfo) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <div className="text-4xl mb-4">📋</div>
//           <p className="text-yellow-800 font-medium">No SLA history found for this task.</p>
//           <p className="text-sm text-yellow-600 mt-1">Task ID: {taskId}</p>
//           <Link to="/tasks" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
//             ← Back to Tasks
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   const currentStatus = slaData.currentStatus || slaData.status || {};
//   const timeRemaining = currentStatus.timeRemaining || slaData.timeRemaining;
//   const percentageUsed = currentStatus.percentageUsed || slaData.percentageUsed || 0;
//   const totalEscalations = slaData.totalEscalations || escalationHistory.length || 0;
//   const totalBreaches = slaData.totalBreaches || breachHistory.length || 0;

//   return (
//     <div className="space-y-6">
//       {/* Demo Mode Banner */}
//       {usingMockData && (
//         <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
//           <p className="text-sm text-blue-700">
//             ℹ️ Showing demo data. Connect to backend for real SLA history.
//           </p>
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">SLA History</h1>
//           <p className="text-gray-500 mt-1">Track Service Level Agreement compliance and breaches</p>
//         </div>
//         <div className="flex gap-2">
//           <button onClick={fetchSLAHistory} className="text-blue-600 hover:text-blue-800 text-sm">
//             ↻ Refresh
//           </button>
//           <Link to={`/tasks/${taskId}`}>
//             <Button variant="secondary" size="sm">
//               ← Back to Task
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Task Information */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div>
//             <p className="text-sm text-gray-500">Task ID</p>
//             <p className="font-medium">{taskInfo.taskId || taskInfo._id?.slice(-8) || 'N/A'}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Title</p>
//             <p className="font-medium">{taskInfo.title || 'Untitled Task'}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Priority</p>
//             <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(taskInfo.priority)}`}>
//               {taskInfo.priority?.toUpperCase() || 'MEDIUM'}
//             </span>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">SLA Status</p>
//             <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(currentStatus.status)}`}>
//               {getStatusText(currentStatus.status)}
//             </span>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">SLA Deadline</p>
//             <p className="font-medium">{formatDateTime(taskInfo.slaDeadline)}</p>
//           </div>
//           <div>
//             <p className="text-sm text-gray-500">Time Remaining</p>
//             <p className={`font-medium ${timeRemaining < 2 ? 'text-red-600' : timeRemaining < 6 ? 'text-orange-600' : 'text-green-600'}`}>
//               {getTimeRemainingText(timeRemaining)}
//             </p>
//           </div>
//         </div>
//       </Card>

//       {/* SLA Summary */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{totalEscalations}</p>
//           <p className="text-sm text-gray-500">Total Escalations</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{totalBreaches}</p>
//           <p className="text-sm text-gray-500">Total Breaches</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{percentageUsed}%</p>
//           <p className="text-sm text-gray-500">SLA Used</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{slaData.escalationLevel || 0}</p>
//           <p className="text-sm text-gray-500">Current Escalation Level</p>
//         </Card>
//       </div>

//       {/* Escalation History */}
//       {escalationHistory.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-red-50">
//             <h3 className="font-semibold text-red-800">🚨 Escalation History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escalated To</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved At</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {escalationHistory.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(item.timestamp || item.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                         Level {item.level || item.metadata?.escalationLevel || idx + 1}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.escalatedTo || item.metadata?.escalatedToRole || 'Higher Management'}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {item.reason || item.description || item.metadata?.reason || 'SLA deadline approaching'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {item.resolvedAt ? formatDateTime(item.resolvedAt) : 'Pending'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* Breach History */}
//       {breachHistory.length > 0 && (
//         <Card className="overflow-hidden">
//           <div className="px-6 py-4 border-b bg-red-50">
//             <h3 className="font-semibold text-red-800">⚠️ Breach History</h3>
//           </div>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breach Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration Exceeded</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {breachHistory.map((item, idx) => (
//                   <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDateTime(item.timestamp || item.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                         {item.type || item.metadata?.breachType || 'SLA Breach'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDuration(item.duration || item.metadata?.breachDuration)}
//                     </td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       {item.reason || item.description || item.metadata?.breachReason || 'SLA deadline exceeded'}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       )}

//       {/* No History Message */}
//       {escalationHistory.length === 0 && breachHistory.length === 0 && (
//         <Card className="p-12 text-center">
//           <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <p className="text-gray-500 font-medium">No SLA History Records</p>
//           <p className="text-sm text-gray-400 mt-1">This task has no escalations or breaches recorded.</p>
//           <p className="text-xs text-gray-400 mt-2">The task is currently on track with its SLA deadline.</p>
//         </Card>
//       )}

//       {/* SLA Timeline Visualization */}
//       {(escalationHistory.length > 0 || breachHistory.length > 0) && (
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">📊 SLA Timeline</h3>
//           <div className="relative">
//             <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
//             <div className="space-y-6">
//               {[...escalationHistory, ...breachHistory]
//                 .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
//                 .map((item, idx) => {
//                   const itemDate = item.timestamp || item.createdAt;
//                   const isEscalation = item.type === 'escalation' || item.type === 'escalate';
//                   return (
//                     <div key={idx} className="relative pl-10">
//                       <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
//                         isEscalation ? 'bg-red-100' : 'bg-orange-100'
//                       }`}>
//                         {isEscalation ? '🚨' : '⚠️'}
//                       </div>
//                       <div className="bg-gray-50 rounded-lg p-4">
//                         <div className="flex justify-between items-start flex-wrap gap-2">
//                           <div>
//                             <p className="font-medium text-gray-900">
//                               {isEscalation ? 'Escalation' : 'SLA Breach'}
//                             </p>
//                             <p className="text-sm text-gray-500 mt-1">
//                               {formatDateTime(itemDate)}
//                             </p>
//                           </div>
//                           {isEscalation && (
//                             <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
//                               Level {item.level || item.metadata?.escalationLevel}
//                             </span>
//                           )}
//                           {!isEscalation && (
//                             <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
//                               {formatDuration(item.duration || item.metadata?.breachDuration)}
//                             </span>
//                           )}
//                         </div>
//                         <p className="text-sm text-gray-600 mt-2">
//                           {item.reason || item.description || item.metadata?.reason || 
//                            (isEscalation ? 'SLA deadline approaching' : 'SLA deadline exceeded')}
//                         </p>
//                         {isEscalation && item.resolvedAt && (
//                           <p className="text-xs text-green-600 mt-2">
//                             ✓ Resolved at {formatDateTime(item.resolvedAt)}
//                           </p>
//                         )}
//                       </div>
//                     </div>
//                   );
//                 })}
//             </div>
//           </div>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default SLAHistory;








//updated SLAHistory.jsx that properly handles both scenarios (with and without taskId) and uses the updated API endpoints:
// client/src/pages/sla/SLAHistory.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { slaApi } from '../../api/sla.api';
import { taskApi } from '../../api/task.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const SLAHistory = () => {
  const { taskId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [slaData, setSlaData] = useState(null);
  const [taskInfo, setTaskInfo] = useState(null);
  const [allHistory, setAllHistory] = useState([]);
  const [summary, setSummary] = useState({
    totalEscalations: 0,
    totalBreaches: 0,
    totalWarnings: 0
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [filters, setFilters] = useState({
    startDate: searchParams.get('startDate') || '',
    endDate: searchParams.get('endDate') || ''
  });
  const [usingMockData, setUsingMockData] = useState(false);

  // Determine if we're viewing history for a specific task or all history
  const hasTaskId = taskId && taskId !== 'undefined' && taskId !== 'null';

  useEffect(() => {
    if (hasTaskId) {
      fetchTaskSLAHistory();
    } else {
      fetchAllSLAHistory();
    }
  }, [taskId, pagination.page, filters]);

  /**
   * Generate mock SLA history data (fallback when API is unavailable)
   */
  const generateMockSLAHistory = (task) => {
    const now = new Date();
    const createdAt = task.createdAt ? new Date(task.createdAt) : new Date(now - 7 * 24 * 60 * 60 * 1000);
    const deadline = task.slaDeadline ? new Date(task.slaDeadline) : new Date(now + 2 * 24 * 60 * 60 * 1000);
    
    const totalHours = (deadline - createdAt) / (1000 * 60 * 60);
    const elapsedHours = (now - createdAt) / (1000 * 60 * 60);
    const percentageUsed = totalHours > 0 ? Math.min(Math.round((elapsedHours / totalHours) * 100), 100) : 0;
    
    const timeRemaining = (deadline - now) / (1000 * 60 * 60);
    
    let status = 'on_track';
    if (timeRemaining < 0) status = 'breached';
    else if (timeRemaining < 2) status = 'at_risk';
    else if (timeRemaining < 6) status = 'warning';
    
    // Generate mock escalation and breach history
    const mockHistory = [];
    
    if (percentageUsed > 70) {
      mockHistory.push({
        type: 'escalation',
        timestamp: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
        level: 1,
        escalatedTo: 'Supervisor',
        reason: 'Task approaching SLA deadline',
        description: 'Task approaching SLA deadline - level 1 escalation',
        metadata: { escalationLevel: 1, reason: 'Task approaching SLA deadline' }
      });
    }
    
    if (percentageUsed > 90) {
      mockHistory.push({
        type: 'escalation',
        timestamp: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        level: 2,
        escalatedTo: 'Manager',
        reason: 'Task still not completed, SLA at risk',
        description: 'Task still not completed, SLA at risk - level 2 escalation',
        metadata: { escalationLevel: 2, reason: 'Task still not completed' }
      });
    }
    
    if (timeRemaining < 0) {
      mockHistory.push({
        type: 'breach',
        timestamp: deadline.toISOString(),
        duration: Math.abs(timeRemaining) * 60,
        reason: 'Task missed SLA deadline',
        description: 'SLA deadline breached',
        metadata: { breachDuration: Math.abs(timeRemaining) * 60, breachReason: 'Task missed SLA deadline' }
      });
    }
    
    return {
      task: {
        _id: task._id,
        taskId: task.taskId || task._id?.slice(-8),
        title: task.title || 'Untitled Task',
        priority: task.priority || 'medium',
        slaDeadline: task.slaDeadline,
        createdAt: task.createdAt
      },
      currentStatus: {
        status: status,
        timeRemaining: timeRemaining,
        percentageUsed: percentageUsed,
        hoursRemaining: Math.max(0, timeRemaining),
        minutesRemaining: Math.max(0, timeRemaining * 60)
      },
      totalEscalations: mockHistory.filter(h => h.type === 'escalation').length,
      totalBreaches: mockHistory.filter(h => h.type === 'breach').length,
      escalationLevel: mockHistory.filter(h => h.type === 'escalation').length,
      history: mockHistory,
      summary: {
        totalEscalations: mockHistory.filter(h => h.type === 'escalation').length,
        totalBreaches: mockHistory.filter(h => h.type === 'breach').length,
        totalWarnings: mockHistory.filter(h => h.type === 'warning').length
      }
    };
  };

  /**
   * Fetch SLA history for a specific task
   */
  const fetchTaskSLAHistory = async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    
    try {
      // First, fetch task details
      let taskDetails = null;
      try {
        const taskResponse = await taskApi.getTaskById(taskId);
        if (taskResponse?.data?.success) {
          taskDetails = taskResponse.data.data;
        } else if (taskResponse?.data) {
          taskDetails = taskResponse.data;
        }
      } catch (taskError) {
        console.log('Task API error:', taskError.message);
      }
      
      // Fetch SLA history
      let response = null;
      try {
        response = await slaApi.getSLAHistory(taskId);
        console.log('SLA history response:', response);
      } catch (slaError) {
        console.log('SLA API error:', slaError.message);
      }
      
      let data = null;
      
      if (response?.success && response.data) {
        data = response.data;
      } else if (response?.data?.success && response.data.data) {
        data = response.data.data;
      } else if (response?.data && (response.data.history || response.data.task)) {
        data = response.data;
      } else if (taskDetails) {
        data = generateMockSLAHistory(taskDetails);
        setUsingMockData(true);
        showToast('Using demo data - SLA history API not available', 'info');
      } else {
        const mockTask = {
          _id: taskId,
          taskId: taskId.slice(-8),
          title: 'Sample Task',
          priority: 'medium',
          slaDeadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        };
        data = generateMockSLAHistory(mockTask);
        setUsingMockData(true);
        showToast('Using demo data - Task not found', 'info');
      }
      
      if (data) {
        setSlaData(data);
        setTaskInfo(data.task || null);
        
        const historyArray = data.history || data.escalationHistory || [];
        setAllHistory(historyArray);
        
        setSummary({
          totalEscalations: data.totalEscalations || data.summary?.totalEscalations || 0,
          totalBreaches: data.totalBreaches || data.summary?.totalBreaches || 0,
          totalWarnings: data.totalWarnings || data.summary?.totalWarnings || 0
        });
      } else {
        throw new Error('No data available');
      }
      
    } catch (error) {
      console.error('Fetch task SLA history error:', error);
      setError(error.message || 'Failed to load SLA history');
      showToast(error.response?.data?.message || 'Failed to load SLA history', 'error');
      setSlaData(null);
      setTaskInfo(null);
      setAllHistory([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetch all SLA history (for admin view)
   */
  const fetchAllSLAHistory = async () => {
    setLoading(true);
    setError(null);
    setUsingMockData(false);
    
    try {
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      
      const response = await slaApi.getSLAHistory(null, params);
      console.log('All SLA history response:', response);
      
      if (response?.success && response.data) {
        const historyData = Array.isArray(response.data) ? response.data : 
                           (response.data.data || response.data.history || []);
        setAllHistory(historyData);
        setPagination({
          page: response.page || pagination.page,
          limit: response.limit || pagination.limit,
          total: response.total || historyData.length,
          pages: response.pages || Math.ceil((response.total || historyData.length) / pagination.limit)
        });
        setSummary({
          totalEscalations: response.summary?.totalEscalations || 0,
          totalBreaches: response.summary?.totalBreaches || 0,
          totalWarnings: response.summary?.totalWarnings || 0
        });
      } else if (response?.data?.success && response.data.data) {
        const historyData = response.data.data;
        setAllHistory(historyData);
        setPagination(prev => ({
          ...prev,
          total: response.data.total || historyData.length,
          pages: response.data.pages || Math.ceil((response.data.total || historyData.length) / prev.limit)
        }));
      } else {
        setAllHistory([]);
        if (!usingMockData) {
          showToast('No SLA history records found', 'info');
        }
      }
      
    } catch (error) {
      console.error('Fetch all SLA history error:', error);
      setError(error.message || 'Failed to load SLA history');
      showToast(error.response?.data?.message || 'Failed to load SLA history', 'error');
      setAllHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority?.toLowerCase()] || colors.medium;
  };

  const getStatusBadge = (status) => {
    const statuses = {
      on_track: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      at_risk: 'bg-orange-100 text-orange-800',
      breached: 'bg-red-100 text-red-800'
    };
    return statuses[status?.toLowerCase()] || statuses.on_track;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return dateString;
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    if (minutes < 0) return 'Overdue';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''}${mins > 0 ? ` ${mins}m` : ''}`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} day${days !== 1 ? 's' : ''}${remainingHours > 0 ? ` ${remainingHours}h` : ''}`;
  };

  const getStatusText = (status) => {
    const statusMap = {
      on_track: 'On Track',
      warning: 'Warning',
      at_risk: 'At Risk',
      breached: 'Breached'
    };
    return statusMap[status?.toLowerCase()] || status || 'Unknown';
  };

  const getTimeRemainingText = (hours) => {
    if (!hours && hours !== 0) return 'N/A';
    if (hours < 0) return 'Overdue';
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours < 24) return `${Math.round(hours)} hours`;
    return `${Math.round(hours / 24)} days`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const applyFilters = () => {
    fetchAllSLAHistory();
  };

  const resetFilters = () => {
    setFilters({ startDate: '', endDate: '' });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-96">
        <Spinner />
        <p className="text-gray-500 mt-4">Loading SLA history...</p>
      </div>
    );
  }

  // Show error for specific task view with no data
  if (error && hasTaskId && !slaData) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-800 font-medium">Error loading SLA history</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <div className="flex gap-3 justify-center mt-4">
            <button onClick={fetchTaskSLAHistory} className="text-blue-600 hover:text-blue-800">
              Retry
            </button>
            <Link to="/tasks" className="text-gray-600 hover:text-gray-800">
              Back to Tasks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show error for all history view with no data
  if (error && !hasTaskId && allHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">❌</div>
          <p className="text-red-800 font-medium">Error loading SLA history</p>
          <p className="text-sm text-red-600 mt-1">{error}</p>
          <button onClick={fetchAllSLAHistory} className="text-blue-600 hover:text-blue-800 mt-4">
            Retry
          </button>
        </div>
      </div>
    );
  }

  // No data state for specific task
  if (hasTaskId && (!slaData || !taskInfo)) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <div className="text-4xl mb-4">📋</div>
          <p className="text-yellow-800 font-medium">No SLA history found for this task.</p>
          <p className="text-sm text-yellow-600 mt-1">Task ID: {taskId}</p>
          <Link to="/tasks" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            ← Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  // Render all history view (no specific task)
  if (!hasTaskId) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SLA History</h1>
            <p className="text-gray-500 mt-1">View all SLA events across the system</p>
          </div>
          <Link to="/sla/dashboard">
            <Button variant="secondary" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="p-4">
          <div className="flex gap-4 flex-wrap items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                className="px-3 py-2 border rounded-lg"
              />
            </div>
            <Button onClick={applyFilters}>Apply Filters</Button>
            <Button variant="secondary" onClick={resetFilters}>Reset</Button>
          </div>
        </Card>

        {/* History Table */}
        <Card className="overflow-hidden">
          {allHistory.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">No SLA history records found</p>
              <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or check back later.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allHistory.map((item, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateTime(item.timestamp || item.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="font-medium text-gray-900">{item.taskTitle || 'Unknown Task'}</div>
                          <div className="text-xs text-gray-500">{item.taskNumber || item.taskId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.type === 'escalation' ? 'bg-red-100 text-red-800' :
                            item.type === 'breach' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {item.type === 'escalation' ? '🚨 Escalation' :
                             item.type === 'breach' ? '⚠️ Breach' :
                             '📋 ' + (item.type || 'Event')}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                          {item.description || item.reason || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {item.taskId && (
                            <Link to={`/sla/history/${item.taskId}`} className="text-blue-600 hover:text-blue-800">
                              View Details →
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t flex justify-between items-center">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-500">
                    Page {pagination.page} of {pagination.pages}
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </Card>
      </div>
    );
  }

  // Render specific task SLA history view
  const currentStatus = slaData.currentStatus || slaData.status || {};
  const timeRemaining = currentStatus.timeRemaining || slaData.timeRemaining;
  const percentageUsed = currentStatus.percentageUsed || slaData.percentageUsed || 0;
  const totalEscalations = slaData.totalEscalations || summary.totalEscalations || 0;
  const totalBreaches = slaData.totalBreaches || summary.totalBreaches || 0;
  const escalationHistory = allHistory.filter(h => h.type === 'escalation');
  const breachHistory = allHistory.filter(h => h.type === 'breach');

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      {usingMockData && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-sm text-blue-700">
            ℹ️ Showing demo data. Connect to backend for real SLA history.
          </p>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SLA History</h1>
          <p className="text-gray-500 mt-1">Track Service Level Agreement compliance and breaches</p>
        </div>
        <div className="flex gap-2">
          <button onClick={fetchTaskSLAHistory} className="text-blue-600 hover:text-blue-800 text-sm">
            ↻ Refresh
          </button>
          <Link to={`/tasks/${taskId}`}>
            <Button variant="secondary" size="sm">
              ← Back to Task
            </Button>
          </Link>
        </div>
      </div>

      {/* Task Information */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Task ID</p>
            <p className="font-medium">{taskInfo?.taskId || taskInfo?._id?.slice(-8) || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-medium">{taskInfo?.title || 'Untitled Task'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getPriorityColor(taskInfo?.priority)}`}>
              {taskInfo?.priority?.toUpperCase() || 'MEDIUM'}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">SLA Status</p>
            <span className={`inline-block px-2 py-1 text-xs rounded-full ${getStatusBadge(currentStatus.status)}`}>
              {getStatusText(currentStatus.status)}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">SLA Deadline</p>
            <p className="font-medium">{formatDateTime(taskInfo?.slaDeadline)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Time Remaining</p>
            <p className={`font-medium ${timeRemaining < 2 ? 'text-red-600' : timeRemaining < 6 ? 'text-orange-600' : 'text-green-600'}`}>
              {getTimeRemainingText(timeRemaining)}
            </p>
          </div>
        </div>
      </Card>

      {/* SLA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{totalEscalations}</p>
          <p className="text-sm text-gray-500">Total Escalations</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{totalBreaches}</p>
          <p className="text-sm text-gray-500">Total Breaches</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{percentageUsed}%</p>
          <p className="text-sm text-gray-500">SLA Used</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{slaData.escalationLevel || 0}</p>
          <p className="text-sm text-gray-500">Current Escalation Level</p>
        </Card>
      </div>

      {/* Escalation History */}
      {escalationHistory.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b bg-red-50">
            <h3 className="font-semibold text-red-800">🚨 Escalation History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Escalated To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resolved At</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {escalationHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(item.timestamp || item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Level {item.level || item.metadata?.escalationLevel || idx + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.escalatedTo || item.metadata?.escalatedToRole || 'Higher Management'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.reason || item.description || item.metadata?.reason || 'SLA deadline approaching'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.resolvedAt ? formatDateTime(item.resolvedAt) : 'Pending'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Breach History */}
      {breachHistory.length > 0 && (
        <Card className="overflow-hidden">
          <div className="px-6 py-4 border-b bg-red-50">
            <h3 className="font-semibold text-red-800">⚠️ Breach History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date & Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Breach Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration Exceeded</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {breachHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDateTime(item.timestamp || item.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        {item.type || item.metadata?.breachType || 'SLA Breach'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(item.duration || item.metadata?.breachDuration)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.reason || item.description || item.metadata?.breachReason || 'SLA deadline exceeded'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* No History Message */}
      {escalationHistory.length === 0 && breachHistory.length === 0 && (
        <Card className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-500 font-medium">No SLA History Records</p>
          <p className="text-sm text-gray-400 mt-1">This task has no escalations or breaches recorded.</p>
          <p className="text-xs text-gray-400 mt-2">The task is currently on track with its SLA deadline.</p>
        </Card>
      )}

      {/* SLA Timeline Visualization */}
      {(escalationHistory.length > 0 || breachHistory.length > 0) && (
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">📊 SLA Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              {[...escalationHistory, ...breachHistory]
                .sort((a, b) => new Date(b.timestamp || b.createdAt) - new Date(a.timestamp || a.createdAt))
                .map((item, idx) => {
                  const itemDate = item.timestamp || item.createdAt;
                  const isEscalation = item.type === 'escalation';
                  return (
                    <div key={idx} className="relative pl-10">
                      <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isEscalation ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        {isEscalation ? '🚨' : '⚠️'}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <p className="font-medium text-gray-900">
                              {isEscalation ? 'Escalation' : 'SLA Breach'}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              {formatDateTime(itemDate)}
                            </p>
                          </div>
                          {isEscalation && (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                              Level {item.level || item.metadata?.escalationLevel}
                            </span>
                          )}
                          {!isEscalation && (
                            <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-800">
                              {formatDuration(item.duration || item.metadata?.breachDuration)}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                          {item.reason || item.description || item.metadata?.reason || 
                           (isEscalation ? 'SLA deadline approaching' : 'SLA deadline exceeded')}
                        </p>
                        {isEscalation && item.resolvedAt && (
                          <p className="text-xs text-green-600 mt-2">
                            ✓ Resolved at {formatDateTime(item.resolvedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SLAHistory;

