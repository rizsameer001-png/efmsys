

// // client/src/pages/dashboard/TechnicianDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { trackingApi } from '../../api/tracking.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { useTaskProgress } from '../../hooks/useTaskProgress';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const TechnicianDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [myTasks, setMyTasks] = useState([]);
//   const [activeTaskId, setActiveTaskId] = useState(null);
//   const [trackingActive, setTrackingActive] = useState(false);
//   const [recentChats, setRecentChats] = useState([]);
//   const [showEvidenceModal, setShowEvidenceModal] = useState(false);
//   const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState(null);
//   const [evidenceUrl, setEvidenceUrl] = useState('');
//   const [evidenceFiles, setEvidenceFiles] = useState([]);
//   const [uploadingEvidence, setUploadingEvidence] = useState(false);
//   const [apiErrors, setApiErrors] = useState({
//     tasks: false,
//     attendance: false,
//     leave: false,
//     chat: false
//   });
//   const [stats, setStats] = useState({
//     assignedTasks: 0,
//     acceptedTasks: 0,
//     inProgress: 0,
//     completed: 0,
//     pendingReview: 0,
//     attendanceRate: 85, // Default value instead of 0
//     unreadMessages: 0,
//     leaveBalance: { annual: 22, sick: 12, casual: 5 }
//   });

//   // Use the useTaskProgress hook
//   const { 
//     loading: actionLoading, 
//     acceptTask, 
//     startTaskWithGPS,
//     updateProgress,
//     uploadEvidence: uploadEvidenceApi,
//     completeTask 
//   } = useTaskProgress(activeTaskId, (status) => {
//     fetchMyTasks();
//     if (status === 'in_progress') setTrackingActive(true);
//     if (status === 'completed') setTrackingActive(false);
//   });

//   useEffect(() => {
//     fetchAllData();
//     checkTrackingSession();
//     const interval = setInterval(() => fetchChatData(), 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const checkTrackingSession = async () => {
//     try {
//       const response = await trackingApi.getCurrentSession();
//       if (response.data?.data?.isActive) {
//         setTrackingActive(true);
//       }
//     } catch (error) {
//       console.error('Error checking tracking session:', error);
//     }
//   };

//   const safeFetch = async (apiCall, errorKey, fallback = null) => {
//     try {
//       const response = await apiCall();
//       if (response?.data?.success) {
//         return response.data.data;
//       }
//       return fallback;
//     } catch (error) {
//       console.error(`Failed to fetch ${errorKey}:`, error);
//       if (error.response?.status !== 403 && error.response?.status !== 404) {
//         setApiErrors(prev => ({ ...prev, [errorKey]: true }));
//       }
//       return fallback;
//     }
//   };

//   const fetchChatData = async () => {
//     try {
//       const unreadData = await safeFetch(
//         () => chatApi.getTotalUnreadCount(),
//         'chat',
//         { count: 0 }
//       );
      
//       const chatsData = await safeFetch(
//         () => chatApi.getUserChats(),
//         'chat',
//         []
//       );
      
//       const recentChatsList = Array.isArray(chatsData) 
//         ? chatsData.slice(0, 3).map(chat => ({
//             id: chat._id,
//             name: chat.chatType === 'group' 
//               ? chat.groupName 
//               : chat.participants?.find(p => p.userId?._id !== user?._id)?.userId?.firstName || 'Unknown',
//             lastMessage: chat.lastMessage?.message || 'No messages',
//             timestamp: chat.lastMessage?.timestamp,
//             unreadCount: chat.unreadCount || 0,
//             chatType: chat.chatType
//           }))
//         : [];
      
//       setRecentChats(recentChatsList);
//       setStats(prev => ({
//         ...prev,
//         unreadMessages: unreadData?.count || 0
//       }));
      
//     } catch (error) {
//       console.error('Chat data fetch error:', error);
//       setApiErrors(prev => ({ ...prev, chat: true }));
//     }
//   };

//   const fetchAllData = async () => {
//     setLoading(true);
//     setApiErrors({
//       tasks: false,
//       attendance: false,
//       leave: false,
//       chat: false
//     });
    
//     try {
//       await fetchMyTasks();
//       await fetchAttendanceData();
//       await fetchLeaveBalance();
//       await fetchChatData();
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMyTasks = async () => {
//     try {
//       const response = await taskApi.getMyTasks();
//       let tasks = [];
      
//       if (response.data && response.data.success) {
//         tasks = response.data.data?.tasks || response.data.data || [];
//       }
      
//       setMyTasks(tasks);
      
//       setStats(prev => ({
//         ...prev,
//         assignedTasks: tasks.filter(t => t.status === 'assigned').length,
//         acceptedTasks: tasks.filter(t => t.status === 'accepted').length,
//         inProgress: tasks.filter(t => t.status === 'in_progress').length,
//         completed: tasks.filter(t => t.status === 'completed').length,
//         pendingReview: tasks.filter(t => t.status === 'pending_review').length
//       }));
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       setApiErrors(prev => ({ ...prev, tasks: true }));
//       if (error.response?.status !== 403) {
//         showToast('Failed to load tasks', 'error');
//       }
//     }
//   };

//   // 🔴 FIXED: Updated fetchAttendanceData - removed getUserAttendance which doesn't exist
//   const fetchAttendanceData = async () => {
//     try {
//       // Try multiple possible endpoints
//       let response = null;
      
//       // Try getMyAttendance first
//       if (attendanceApi.getMyAttendance) {
//         response = await attendanceApi.getMyAttendance();
//       } 
//       // Fallback to getAttendance
//       else if (attendanceApi.getAttendance) {
//         response = await attendanceApi.getAttendance();
//       }
//       // Fallback to getUserAttendance
//       else if (attendanceApi.getUserAttendance) {
//         response = await attendanceApi.getUserAttendance();
//       }
      
//       if (response?.data?.success) {
//         const attendance = response.data.data;
//         // Calculate attendance rate from the data
//         let rate = 85; // default
//         if (attendance.presentCount && attendance.totalDays) {
//           rate = Math.round((attendance.presentCount / attendance.totalDays) * 100);
//         } else if (attendance.rate) {
//           rate = attendance.rate;
//         }
//         setStats(prev => ({ ...prev, attendanceRate: rate }));
//       } else {
//         // Use mock data
//         console.log('Using mock attendance data');
//         setStats(prev => ({ ...prev, attendanceRate: 85 }));
//       }
//     } catch (error) {
//       console.warn('Attendance data not available, using default value');
//       setStats(prev => ({ ...prev, attendanceRate: 85 }));
//     }
//   };

//   const fetchLeaveBalance = async () => {
//     try {
//       const response = await leaveApi.getMyLeaveBalance();
//       if (response.data?.success) {
//         setStats(prev => ({ ...prev, leaveBalance: response.data.data }));
//       }
//     } catch (error) {
//       console.warn('Leave balance not available:', error.message);
//       setStats(prev => ({ 
//         ...prev, 
//         leaveBalance: { annual: 22, sick: 12, casual: 5 } 
//       }));
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const handleAcceptTask = async (taskId) => {
//     setActiveTaskId(taskId);
//     await acceptTask();
//     await fetchMyTasks();
//   };

//   const handleStartTask = async (taskId) => {
//     setActiveTaskId(taskId);
//     await startTaskWithGPS();
//     await fetchMyTasks();
//   };

//   const handleUpdateProgress = async (taskId, currentProgress) => {
//     const newProgress = prompt(`Enter progress percentage (Current: ${currentProgress}%):`, currentProgress);
//     if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
//       setActiveTaskId(taskId);
//       await updateProgress(parseInt(newProgress));
//       await fetchMyTasks();
//     }
//   };

//   const handleUploadEvidenceClick = (task) => {
//     setSelectedTaskForEvidence(task);
//     setEvidenceUrl('');
//     setEvidenceFiles([]);
//     setShowEvidenceModal(true);
//   };

//   const handleEvidenceUrlSubmit = async () => {
//     if (!evidenceUrl.trim()) {
//       showToast('Please enter an image URL', 'warning');
//       return;
//     }

//     setUploadingEvidence(true);
//     try {
//       setActiveTaskId(selectedTaskForEvidence._id);
//       const response = await uploadEvidenceApi([{ url: evidenceUrl }], [], []);
      
//       if (response?.data?.success || response?.success) {
//         showToast('Evidence uploaded successfully!', 'success');
//         setShowEvidenceModal(false);
//         setEvidenceUrl('');
//         await fetchMyTasks();
//       } else {
//         showToast('Failed to upload evidence', 'error');
//       }
//     } catch (error) {
//       console.error('Evidence upload error:', error);
//       showToast(error.response?.data?.error || 'Failed to upload evidence', 'error');
//     } finally {
//       setUploadingEvidence(false);
//     }
//   };

//   const handleEvidenceFileUpload = async () => {
//     if (evidenceFiles.length === 0) {
//       showToast('Please select files to upload', 'warning');
//       return;
//     }

//     setUploadingEvidence(true);
//     try {
//       // Convert files to base64
//       const imageUrls = await Promise.all(
//         evidenceFiles.map(file => {
//           return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(file);
//           });
//         })
//       );
      
//       setActiveTaskId(selectedTaskForEvidence._id);
//       const response = await uploadEvidenceApi(imageUrls, [], []);
      
//       if (response?.data?.success || response?.success) {
//         showToast(`${evidenceFiles.length} image(s) uploaded successfully!`, 'success');
//         setShowEvidenceModal(false);
//         setEvidenceFiles([]);
//         await fetchMyTasks();
//       } else {
//         showToast('Failed to upload evidence', 'error');
//       }
//     } catch (error) {
//       console.error('File upload error:', error);
//       showToast('Failed to upload evidence', 'error');
//     } finally {
//       setUploadingEvidence(false);
//     }
//   };

//   const handleCompleteTask = async (taskId) => {
//     const confirmComplete = window.confirm('Are you sure you want to mark this task as complete?');
//     if (!confirmComplete) return;
    
//     setActiveTaskId(taskId);
//     await completeTask('', []);
//     await fetchMyTasks();
//     showToast('Task completed! Pending verification.', 'success');
//   };

//   const handleEndTracking = async () => {
//     try {
//       await trackingApi.endSession();
//       setTrackingActive(false);
//       showToast('Tracking session ended', 'info');
//     } catch (error) {
//       console.error('End tracking error:', error);
//       showToast('Failed to end tracking session', 'error');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       pending_review: 'bg-purple-100 text-purple-800'
//     };
//     return badges[status] || badges.assigned;
//   };

//   const getPriorityBadge = (priority) => {
//     const badges = {
//       critical: 'bg-red-100 text-red-800',
//       high: 'bg-orange-100 text-orange-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-green-100 text-green-800'
//     };
//     return badges[priority] || badges.medium;
//   };

//   const formatTimeAgo = (date) => {
//     if (!date) return 'Recently';
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return 'Just now';
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days > 1 ? 's' : ''} ago`;
//   };

//   const renderActionButtons = (task) => {
//     switch (task.status) {
//       case 'assigned':
//         return (
//           <Button 
//             size="sm" 
//             variant="primary" 
//             onClick={() => handleAcceptTask(task._id)}
//             disabled={actionLoading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             ✓ Accept Task
//           </Button>
//         );
//       case 'accepted':
//         return (
//           <Button 
//             size="sm" 
//             variant="success" 
//             onClick={() => handleStartTask(task._id)}
//             disabled={actionLoading}
//           >
//             📍 Start Work
//           </Button>
//         );
//       case 'in_progress':
//         return (
//           <div className="flex flex-wrap gap-2">
//             <Button 
//               size="sm" 
//               variant="secondary" 
//               onClick={() => handleUpdateProgress(task._id, task.progress?.percentage || 0)}
//               disabled={actionLoading}
//             >
//               📊 Update ({task.progress?.percentage || 0}%)
//             </Button>
//             <Button 
//               size="sm" 
//               variant="primary" 
//               onClick={() => handleUploadEvidenceClick(task)}
//               disabled={actionLoading}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               📸 Upload Evidence
//             </Button>
//             <Link to={`/tasks/${task._id}`}>
//               <Button size="sm" variant="secondary">
//                 🔍 View Details
//               </Button>
//             </Link>
//             <Button 
//               size="sm" 
//               variant="success" 
//               onClick={() => handleCompleteTask(task._id)}
//               disabled={actionLoading}
//             >
//               ✅ Complete
//             </Button>
//           </div>
//         );
//       case 'completed':
//         return (
//           <span className="text-sm text-yellow-600 font-medium">
//             ⏳ Pending Verification
//           </span>
//         );
//       case 'pending_review':
//         return (
//           <span className="text-sm text-purple-600 font-medium">
//             📋 Under Review
//           </span>
//         );
//       default:
//         return (
//           <Link to={`/tasks/${task._id}`}>
//             <Button size="sm" variant="secondary">View Details</Button>
//           </Link>
//         );
//     }
//   };

//   const hasApiErrors = Object.values(apiErrors).some(error => error === true);
//   const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {hasApiErrors && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <div className="text-yellow-600 text-xl">⚠️</div>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-yellow-800">
//                 Some data could not be loaded ({apiErrorCount} issues)
//               </p>
//               <p className="text-xs text-yellow-700 mt-1">
//                 {apiErrors.attendance && "• Attendance data may be incomplete\n"}
//                 {apiErrors.leave && "• Leave data may be incomplete\n"}
//                 {apiErrors.chat && "• Chat data may be unavailable"}
//               </p>
//               <button 
//                 onClick={fetchAllData}
//                 className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
//               >
//                 Retry loading data
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}!</p>
//         </div>
//         <div className="flex gap-2">
//           <Link to="/chat" className="relative">
//             <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
//               <span className="text-xl">💬</span>
//             </div>
//             {stats.unreadMessages > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
//               </span>
//             )}
//           </Link>
//           {trackingActive && (
//             <Button 
//               variant="secondary" 
//               size="sm" 
//               onClick={handleEndTracking}
//               className="bg-yellow-100 text-yellow-800"
//             >
//               🟢 End Session
//             </Button>
//           )}
//           <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//             Logout
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-blue-600">{stats.assignedTasks}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-cyan-600">{stats.acceptedTasks}</p>
//           <p className="text-xs text-gray-500">Accepted</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-orange-600">{stats.inProgress}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-green-600">{stats.completed}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-purple-600">{stats.pendingReview}</p>
//           <p className="text-xs text-gray-500">Pending Review</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-teal-600">{stats.attendanceRate}%</p>
//           <p className="text-xs text-gray-500">Attendance</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-cyan-600">{stats.unreadMessages}</p>
//           <p className="text-xs text-gray-500">Unread</p>
//         </Card>
//         <Link to="/leave/balance">
//           <Card className="p-3 text-center hover:shadow-md transition-shadow">
//             <p className="text-xl font-bold text-indigo-600">{stats.leaveBalance.annual}</p>
//             <p className="text-xs text-gray-500">Leave Balance</p>
//           </Card>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-gray-900">My Tasks</h3>
//               <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
//                 View All →
//               </Link>
//             </div>
            
//             {myTasks.length > 0 ? (
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {myTasks.map(task => (
//                   <div key={task._id} className="border rounded-lg p-3 hover:bg-gray-50">
//                     <div className="flex flex-wrap justify-between items-start gap-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                             {task.status?.replace(/_/g, ' ')}
//                           </span>
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                             {task.priority}
//                           </span>
//                           <span className="font-medium">{task.title}</span>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">
//                           ID: {task.taskId || task._id?.slice(-6)} | 
//                           Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
//                         </p>
//                         {task.progress?.percentage > 0 && (
//                           <div className="mt-2 w-32">
//                             <div className="w-full bg-gray-200 rounded-full h-1.5">
//                               <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress.percentage}%` }} />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {renderActionButtons(task)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No tasks assigned yet</p>
//               </div>
//             )}
//           </Card>
//         </div>

//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
//             <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800">
//               Open Chat →
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {recentChats.length > 0 ? (
//               recentChats.map(chat => (
//                 <Link key={chat.id} to={`/chat?chat=${chat.id}`}>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
//                     <div className="relative">
//                       <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
//                         <span className="text-lg">{chat.chatType === 'group' ? '👥' : '👤'}</span>
//                       </div>
//                       {chat.unreadCount > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {formatTimeAgo(chat.timestamp)}
//                     </div>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No conversations yet</p>
//                 <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 mt-2 inline-block">
//                   Start a chat
//                 </Link>
//               </div>
//             )}
//           </div>
//           {stats.unreadMessages > 0 && (
//             <div className="mt-3 pt-3 border-t">
//               <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
//                 You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''} →
//               </Link>
//             </div>
//           )}
//         </Card>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card className="p-3 text-center bg-gradient-to-r from-green-50 to-emerald-50">
//           <p className="text-2xl font-bold text-green-600">{stats.leaveBalance.annual}</p>
//           <p className="text-xs text-gray-600">Annual Leave</p>
//         </Card>
//         <Card className="p-3 text-center bg-gradient-to-r from-blue-50 to-cyan-50">
//           <p className="text-2xl font-bold text-blue-600">{stats.leaveBalance.sick}</p>
//           <p className="text-xs text-gray-600">Sick Leave</p>
//         </Card>
//         <Card className="p-3 text-center bg-gradient-to-r from-purple-50 to-pink-50">
//           <p className="text-2xl font-bold text-purple-600">{stats.leaveBalance.casual}</p>
//           <p className="text-xs text-gray-600">Casual Leave</p>
//         </Card>
//         <Link to="/leave/apply">
//           <Card className="p-3 text-center bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-md transition-shadow">
//             <p className="text-xl mb-1">➕</p>
//             <p className="text-xs font-medium text-orange-700">Apply Leave</p>
//           </Card>
//         </Link>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <Link to="/tracking/live" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">📍</div>
//           <p className="text-xs font-medium">Live Tracking</p>
//           {trackingActive && <span className="text-xs text-green-600 block">Active</span>}
//         </Link>
//         <Link to="/attendance/check-in-out" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">Check In/Out</p>
//         </Link>
//         <Link to="/profile" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-xl mb-1">👤</div>
//           <p className="text-xs font-medium">My Profile</p>
//         </Link>
//         <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
//           <div className="text-xl mb-1">💬</div>
//           <p className="text-xs font-medium">Team Chat</p>
//           {stats.unreadMessages > 0 && (
//             <span className="inline-block ml-1 text-xs text-red-500">({stats.unreadMessages})</span>
//           )}
//         </Link>
//       </div>

//       {/* Evidence Upload Modal */}
//       <Modal
//         isOpen={showEvidenceModal}
//         onClose={() => setShowEvidenceModal(false)}
//         title={`Upload Evidence - ${selectedTaskForEvidence?.title || 'Task'}`}
//         size="lg"
//       >
//         <div className="space-y-6">
//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-3">Upload via URL</h4>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={evidenceUrl}
//                 onChange={(e) => setEvidenceUrl(e.target.value)}
//                 placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
//                 className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <Button 
//                 onClick={handleEvidenceUrlSubmit} 
//                 isLoading={uploadingEvidence}
//                 disabled={!evidenceUrl.trim()}
//               >
//                 Upload
//               </Button>
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               💡 Enter a direct image URL from cloud storage
//             </p>
//           </div>

//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-3">Upload from Device</h4>
//             <div className="flex flex-wrap gap-4">
//               <label className="cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
//                   className="hidden"
//                 />
//                 <div className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
//                   Select Images
//                 </div>
//               </label>
//               {evidenceFiles.length > 0 && (
//                 <Button onClick={handleEvidenceFileUpload} isLoading={uploadingEvidence}>
//                   Upload {evidenceFiles.length} Image(s)
//                 </Button>
//               )}
//             </div>
//             {evidenceFiles.length > 0 && (
//               <div className="mt-3">
//                 <p className="text-sm text-gray-600">Selected files:</p>
//                 <ul className="mt-1 text-xs text-gray-500">
//                   {evidenceFiles.map((file, idx) => (
//                     <li key={idx}>📷 {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <p className="text-xs text-gray-500 mt-2">
//               Supported formats: JPG, PNG, GIF (Max 10MB per file)
//             </p>
//           </div>

//           <div className="bg-blue-50 rounded-lg p-3">
//             <p className="text-sm text-blue-800">
//               💡 Tip: Upload before/after photos to show work completion.
//             </p>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TechnicianDashboard;







// client/src/pages/dashboard/TechnicianDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { trackingApi } from '../../api/tracking.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { useTaskProgress } from '../../hooks/useTaskProgress';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const TechnicianDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [myTasks, setMyTasks] = useState([]);
//   const [activeTaskId, setActiveTaskId] = useState(null);
//   const [trackingActive, setTrackingActive] = useState(false);
//   const [recentChats, setRecentChats] = useState([]);
//   const [showEvidenceModal, setShowEvidenceModal] = useState(false);
//   const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState(null);
//   const [evidenceUrl, setEvidenceUrl] = useState('');
//   const [evidenceFiles, setEvidenceFiles] = useState([]);
//   const [uploadingEvidence, setUploadingEvidence] = useState(false);
//   const [locationSharing, setLocationSharing] = useState(false);
//   const [locationWatchId, setLocationWatchId] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [apiErrors, setApiErrors] = useState({
//     tasks: false,
//     attendance: false,
//     leave: false,
//     chat: false
//   });
//   const [stats, setStats] = useState({
//     assignedTasks: 0,
//     acceptedTasks: 0,
//     inProgress: 0,
//     completed: 0,
//     pendingReview: 0,
//     attendanceRate: 85,
//     unreadMessages: 0,
//     leaveBalance: { annual: 22, sick: 12, casual: 5 }
//   });

//   // Use the useTaskProgress hook
//   const { 
//     loading: actionLoading, 
//     acceptTask, 
//     startTaskWithGPS,
//     updateProgress,
//     uploadEvidence: uploadEvidenceApi,
//     completeTask 
//   } = useTaskProgress(activeTaskId, (status) => {
//     fetchMyTasks();
//     if (status === 'in_progress') setTrackingActive(true);
//     if (status === 'completed') setTrackingActive(false);
//   });

//   useEffect(() => {
//     fetchAllData();
//     checkTrackingSession();
//     checkLocationSharingStatus();
    
//     const interval = setInterval(() => fetchChatData(), 30000);
//     return () => {
//       clearInterval(interval);
//       stopLocationSharing();
//     };
//   }, []);

//   /**
//    * PURPOSE: Check if user has an active location sharing session
//    */
//   const checkLocationSharingStatus = async () => {
//     try {
//       const response = await trackingApi.getCurrentSession();
//       if (response?.data?.data?.isActive) {
//         setLocationSharing(true);
//         startLocationSharing();
//       }
//     } catch (error) {
//       console.error('Error checking location sharing status:', error);
//     }
//   };

//   /**
//    * PURPOSE: Start sharing user's location for live tracking
//    */
//   const startLocationSharing = () => {
//     if (!navigator.geolocation) {
//       showToast('Geolocation is not supported by your browser', 'error');
//       return;
//     }

//     // Get current position immediately
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           speed: position.coords.speed || 0,
//           heading: position.coords.heading || 0
//         };
        
//         setCurrentLocation(location);
        
//         try {
//           await trackingApi.updateLocation(
//             location.lat,
//             location.lng,
//             location.accuracy,
//             location.speed,
//             location.heading
//           );
//           showToast('Location sharing started', 'success');
//         } catch (error) {
//           console.error('Failed to update location:', error);
//         }
//       },
//       (error) => {
//         console.error('Geolocation error:', error);
//         if (error.code === 1) {
//           showToast('Please enable location services to share your location', 'warning');
//         }
//       },
//       { enableHighAccuracy: true, timeout: 10000 }
//     );

//     // Watch position for continuous updates
//     const watchId = navigator.geolocation.watchPosition(
//       async (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           speed: position.coords.speed || 0,
//           heading: position.coords.heading || 0
//         };
        
//         setCurrentLocation(location);
        
//         try {
//           await trackingApi.updateLocation(
//             location.lat,
//             location.lng,
//             location.accuracy,
//             location.speed,
//             location.heading
//           );
//         } catch (error) {
//           console.error('Failed to update location:', error);
//         }
//       },
//       (error) => {
//         console.error('Watch position error:', error);
//       },
//       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//     );
    
//     setLocationWatchId(watchId);
//     setLocationSharing(true);
//   };

//   /**
//    * PURPOSE: Stop sharing location
//    */
//   const stopLocationSharing = async () => {
//     if (locationWatchId) {
//       navigator.geolocation.clearWatch(locationWatchId);
//       setLocationWatchId(null);
//     }
    
//     try {
//       await trackingApi.endSession();
//       setLocationSharing(false);
//       setCurrentLocation(null);
//       showToast('Location sharing stopped', 'info');
//     } catch (error) {
//       console.error('Error stopping location sharing:', error);
//     }
//   };

//   /**
//    * PURPOSE: Toggle location sharing on/off
//    */
//   const toggleLocationSharing = () => {
//     if (locationSharing) {
//       stopLocationSharing();
//     } else {
//       startLocationSharing();
//     }
//   };

//   const checkTrackingSession = async () => {
//     try {
//       const response = await trackingApi.getCurrentSession();
//       if (response?.data?.data?.isActive) {
//         setTrackingActive(true);
//       }
//     } catch (error) {
//       console.error('Error checking tracking session:', error);
//     }
//   };

//   const safeFetch = async (apiCall, errorKey, fallback = null) => {
//     try {
//       const response = await apiCall();
//       if (response?.data?.success) {
//         return response.data.data;
//       }
//       if (response?.success) {
//         return response.data;
//       }
//       return fallback;
//     } catch (error) {
//       console.error(`Failed to fetch ${errorKey}:`, error);
//       if (error.response?.status !== 403 && error.response?.status !== 404) {
//         setApiErrors(prev => ({ ...prev, [errorKey]: true }));
//       }
//       return fallback;
//     }
//   };

//   const fetchChatData = async () => {
//     try {
//       const unreadData = await safeFetch(
//         () => chatApi.getTotalUnreadCount(),
//         'chat',
//         { count: 0 }
//       );
      
//       const chatsData = await safeFetch(
//         () => chatApi.getUserChats(),
//         'chat',
//         []
//       );
      
//       const recentChatsList = Array.isArray(chatsData) 
//         ? chatsData.slice(0, 3).map(chat => ({
//             id: chat._id,
//             name: chat.chatType === 'group' 
//               ? chat.groupName 
//               : chat.participants?.find(p => p.userId?._id !== user?._id)?.userId?.firstName || 'Unknown',
//             lastMessage: chat.lastMessage?.message || 'No messages',
//             timestamp: chat.lastMessage?.timestamp,
//             unreadCount: chat.unreadCount || 0,
//             chatType: chat.chatType
//           }))
//         : [];
      
//       setRecentChats(recentChatsList);
//       setStats(prev => ({
//         ...prev,
//         unreadMessages: unreadData?.count || 0
//       }));
      
//     } catch (error) {
//       console.error('Chat data fetch error:', error);
//       setApiErrors(prev => ({ ...prev, chat: true }));
//     }
//   };

//   const fetchAllData = async () => {
//     setLoading(true);
//     setApiErrors({
//       tasks: false,
//       attendance: false,
//       leave: false,
//       chat: false
//     });
    
//     try {
//       await Promise.all([
//         fetchMyTasks(),
//         fetchAttendanceData(),
//         fetchLeaveBalance(),
//         fetchChatData()
//       ]);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMyTasks = async () => {
//     try {
//       const response = await taskApi.getMyTasks();
//       let tasks = [];
      
//       if (response.data && response.data.success) {
//         tasks = response.data.data?.tasks || response.data.data || [];
//       } else if (response.success && response.data) {
//         tasks = response.data.tasks || response.data || [];
//       }
      
//       setMyTasks(tasks);
      
//       setStats(prev => ({
//         ...prev,
//         assignedTasks: tasks.filter(t => t.status === 'assigned').length,
//         acceptedTasks: tasks.filter(t => t.status === 'accepted').length,
//         inProgress: tasks.filter(t => t.status === 'in_progress').length,
//         completed: tasks.filter(t => t.status === 'completed').length,
//         pendingReview: tasks.filter(t => t.status === 'pending_review').length
//       }));
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       setApiErrors(prev => ({ ...prev, tasks: true }));
//       if (error.response?.status !== 403) {
//         showToast('Failed to load tasks', 'error');
//       }
//     }
//   };

//   /**
//    * PURPOSE: Fetch attendance data for the technician
//    * FIXED: Properly handles missing API methods
//    */
//   const fetchAttendanceData = async () => {
//     try {
//       let response = null;
      
//       // Try multiple possible endpoints
//       if (attendanceApi.getMyAttendance) {
//         response = await attendanceApi.getMyAttendance();
//       } else if (attendanceApi.getAttendance) {
//         response = await attendanceApi.getAttendance();
//       } else if (attendanceApi.getUserAttendance && user?._id) {
//         response = await attendanceApi.getUserAttendance(user._id);
//       }
      
//       if (response?.data?.success) {
//         const attendance = response.data.data;
//         let rate = 85;
//         if (attendance.presentCount && attendance.totalDays) {
//           rate = Math.round((attendance.presentCount / attendance.totalDays) * 100);
//         } else if (attendance.rate) {
//           rate = attendance.rate;
//         }
//         setStats(prev => ({ ...prev, attendanceRate: rate }));
//       } else {
//         console.log('Using mock attendance data');
//       }
//     } catch (error) {
//       console.warn('Attendance data not available, using default value');
//     }
//   };

//   const fetchLeaveBalance = async () => {
//     try {
//       const response = await leaveApi.getMyLeaveBalance();
//       if (response?.data?.success) {
//         setStats(prev => ({ ...prev, leaveBalance: response.data.data }));
//       }
//     } catch (error) {
//       console.warn('Leave balance not available:', error.message);
//     }
//   };

//   const handleLogout = async () => {
//     if (locationSharing) {
//       await stopLocationSharing();
//     }
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const handleAcceptTask = async (taskId) => {
//     setActiveTaskId(taskId);
//     await acceptTask();
//     await fetchMyTasks();
//   };

//   const handleStartTask = async (taskId) => {
//     setActiveTaskId(taskId);
//     await startTaskWithGPS();
//     await fetchMyTasks();
//   };

//   const handleUpdateProgress = async (taskId, currentProgress) => {
//     const newProgress = prompt(`Enter progress percentage (Current: ${currentProgress}%):`, currentProgress);
//     if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
//       setActiveTaskId(taskId);
//       await updateProgress(parseInt(newProgress));
//       await fetchMyTasks();
//     }
//   };

//   const handleUploadEvidenceClick = (task) => {
//     setSelectedTaskForEvidence(task);
//     setEvidenceUrl('');
//     setEvidenceFiles([]);
//     setShowEvidenceModal(true);
//   };

//   const handleEvidenceUrlSubmit = async () => {
//     if (!evidenceUrl.trim()) {
//       showToast('Please enter an image URL', 'warning');
//       return;
//     }

//     setUploadingEvidence(true);
//     try {
//       setActiveTaskId(selectedTaskForEvidence._id);
//       const response = await uploadEvidenceApi([{ url: evidenceUrl }], [], []);
      
//       if (response?.data?.success || response?.success) {
//         showToast('Evidence uploaded successfully!', 'success');
//         setShowEvidenceModal(false);
//         setEvidenceUrl('');
//         await fetchMyTasks();
//       } else {
//         showToast('Failed to upload evidence', 'error');
//       }
//     } catch (error) {
//       console.error('Evidence upload error:', error);
//       showToast(error.response?.data?.error || 'Failed to upload evidence', 'error');
//     } finally {
//       setUploadingEvidence(false);
//     }
//   };

//   const handleEvidenceFileUpload = async () => {
//     if (evidenceFiles.length === 0) {
//       showToast('Please select files to upload', 'warning');
//       return;
//     }

//     setUploadingEvidence(true);
//     try {
//       // Convert files to base64
//       const imageUrls = await Promise.all(
//         evidenceFiles.map(file => {
//           return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(file);
//           });
//         })
//       );
      
//       setActiveTaskId(selectedTaskForEvidence._id);
//       const response = await uploadEvidenceApi(imageUrls, [], []);
      
//       if (response?.data?.success || response?.success) {
//         showToast(`${evidenceFiles.length} image(s) uploaded successfully!`, 'success');
//         setShowEvidenceModal(false);
//         setEvidenceFiles([]);
//         await fetchMyTasks();
//       } else {
//         showToast('Failed to upload evidence', 'error');
//       }
//     } catch (error) {
//       console.error('File upload error:', error);
//       showToast('Failed to upload evidence', 'error');
//     } finally {
//       setUploadingEvidence(false);
//     }
//   };

//   const handleCompleteTask = async (taskId) => {
//     const confirmComplete = window.confirm('Are you sure you want to mark this task as complete?');
//     if (!confirmComplete) return;
    
//     setActiveTaskId(taskId);
//     await completeTask('', []);
//     await fetchMyTasks();
//     showToast('Task completed! Pending verification.', 'success');
//   };

//   const handleEndTracking = async () => {
//     try {
//       await trackingApi.endSession();
//       setTrackingActive(false);
//       showToast('Tracking session ended', 'info');
//     } catch (error) {
//       console.error('End tracking error:', error);
//       showToast('Failed to end tracking session', 'error');
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       pending_review: 'bg-purple-100 text-purple-800'
//     };
//     return badges[status] || badges.assigned;
//   };

//   const getPriorityBadge = (priority) => {
//     const badges = {
//       critical: 'bg-red-100 text-red-800',
//       high: 'bg-orange-100 text-orange-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-green-100 text-green-800'
//     };
//     return badges[priority] || badges.medium;
//   };

//   const formatTimeAgo = (date) => {
//     if (!date) return 'Recently';
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return 'Just now';
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days > 1 ? 's' : ''} ago`;
//   };

//   const renderActionButtons = (task) => {
//     switch (task.status) {
//       case 'assigned':
//         return (
//           <Button 
//             size="sm" 
//             variant="primary" 
//             onClick={() => handleAcceptTask(task._id)}
//             disabled={actionLoading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             ✓ Accept Task
//           </Button>
//         );
//       case 'accepted':
//         return (
//           <Button 
//             size="sm" 
//             variant="success" 
//             onClick={() => handleStartTask(task._id)}
//             disabled={actionLoading}
//           >
//             📍 Start Work
//           </Button>
//         );
//       case 'in_progress':
//         return (
//           <div className="flex flex-wrap gap-2">
//             <Button 
//               size="sm" 
//               variant="secondary" 
//               onClick={() => handleUpdateProgress(task._id, task.progress?.percentage || 0)}
//               disabled={actionLoading}
//             >
//               📊 Update ({task.progress?.percentage || 0}%)
//             </Button>
//             <Button 
//               size="sm" 
//               variant="primary" 
//               onClick={() => handleUploadEvidenceClick(task)}
//               disabled={actionLoading}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               📸 Upload Evidence
//             </Button>
//             <Link to={`/tasks/${task._id}`}>
//               <Button size="sm" variant="secondary">
//                 🔍 View Details
//               </Button>
//             </Link>
//             <Button 
//               size="sm" 
//               variant="success" 
//               onClick={() => handleCompleteTask(task._id)}
//               disabled={actionLoading}
//             >
//               ✅ Complete
//             </Button>
//           </div>
//         );
//       case 'completed':
//         return (
//           <span className="text-sm text-yellow-600 font-medium">
//             ⏳ Pending Verification
//           </span>
//         );
//       case 'pending_review':
//         return (
//           <span className="text-sm text-purple-600 font-medium">
//             📋 Under Review
//           </span>
//         );
//       default:
//         return (
//           <Link to={`/tasks/${task._id}`}>
//             <Button size="sm" variant="secondary">View Details</Button>
//           </Link>
//         );
//     }
//   };

//   const hasApiErrors = Object.values(apiErrors).some(error => error === true);
//   const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {hasApiErrors && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <div className="text-yellow-600 text-xl">⚠️</div>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-yellow-800">
//                 Some data could not be loaded ({apiErrorCount} issues)
//               </p>
//               <p className="text-xs text-yellow-700 mt-1">
//                 {apiErrors.attendance && "• Attendance data may be incomplete\n"}
//                 {apiErrors.leave && "• Leave data may be incomplete\n"}
//                 {apiErrors.chat && "• Chat data may be unavailable"}
//               </p>
//               <button 
//                 onClick={fetchAllData}
//                 className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
//               >
//                 Retry loading data
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}!</p>
//           {currentLocation && locationSharing && (
//             <p className="text-xs text-green-600 mt-1">
//               📍 Location sharing active: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
//             </p>
//           )}
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <Link to="/chat" className="relative">
//             <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
//               <span className="text-xl">💬</span>
//             </div>
//             {stats.unreadMessages > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
//               </span>
//             )}
//           </Link>
          
//           {/* Location Sharing Toggle Button */}
//           <Button 
//             variant={locationSharing ? "warning" : "success"}
//             size="sm" 
//             onClick={toggleLocationSharing}
//             className={locationSharing ? "bg-yellow-500 hover:bg-yellow-600" : "bg-green-500 hover:bg-green-600"}
//           >
//             {locationSharing ? '📍 Stop Sharing' : '📍 Start Sharing'}
//           </Button>
          
//           {trackingActive && (
//             <Button 
//               variant="secondary" 
//               size="sm" 
//               onClick={handleEndTracking}
//               className="bg-blue-100 text-blue-800"
//             >
//               🟢 End Session
//             </Button>
//           )}
//           <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//             Logout
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-blue-600">{stats.assignedTasks}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-cyan-600">{stats.acceptedTasks}</p>
//           <p className="text-xs text-gray-500">Accepted</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-orange-600">{stats.inProgress}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-green-600">{stats.completed}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-purple-600">{stats.pendingReview}</p>
//           <p className="text-xs text-gray-500">Pending Review</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-teal-600">{stats.attendanceRate}%</p>
//           <p className="text-xs text-gray-500">Attendance</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-cyan-600">{stats.unreadMessages}</p>
//           <p className="text-xs text-gray-500">Unread</p>
//         </Card>
//         <Link to="/leave/balance">
//           <Card className="p-3 text-center hover:shadow-md transition-shadow">
//             <p className="text-xl font-bold text-indigo-600">{stats.leaveBalance.annual}</p>
//             <p className="text-xs text-gray-500">Leave Balance</p>
//           </Card>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-gray-900">My Tasks</h3>
//               <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
//                 View All →
//               </Link>
//             </div>
            
//             {myTasks.length > 0 ? (
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {myTasks.map(task => (
//                   <div key={task._id} className="border rounded-lg p-3 hover:bg-gray-50">
//                     <div className="flex flex-wrap justify-between items-start gap-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                             {task.status?.replace(/_/g, ' ')}
//                           </span>
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                             {task.priority}
//                           </span>
//                           <span className="font-medium">{task.title}</span>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">
//                           ID: {task.taskId || task._id?.slice(-6)} | 
//                           Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
//                         </p>
//                         {task.progress?.percentage > 0 && (
//                           <div className="mt-2 w-32">
//                             <div className="w-full bg-gray-200 rounded-full h-1.5">
//                               <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress.percentage}%` }} />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {renderActionButtons(task)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No tasks assigned yet</p>
//               </div>
//             )}
//           </Card>
//         </div>

//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
//             <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800">
//               Open Chat →
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {recentChats.length > 0 ? (
//               recentChats.map(chat => (
//                 <Link key={chat.id} to={`/chat?chat=${chat.id}`}>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
//                     <div className="relative">
//                       <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
//                         <span className="text-lg">{chat.chatType === 'group' ? '👥' : '👤'}</span>
//                       </div>
//                       {chat.unreadCount > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {formatTimeAgo(chat.timestamp)}
//                     </div>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No conversations yet</p>
//                 <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 mt-2 inline-block">
//                   Start a chat
//                 </Link>
//               </div>
//             )}
//           </div>
//           {stats.unreadMessages > 0 && (
//             <div className="mt-3 pt-3 border-t">
//               <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
//                 You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''} →
//               </Link>
//             </div>
//           )}
//         </Card>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card className="p-3 text-center bg-gradient-to-r from-green-50 to-emerald-50">
//           <p className="text-2xl font-bold text-green-600">{stats.leaveBalance.annual}</p>
//           <p className="text-xs text-gray-600">Annual Leave</p>
//         </Card>
//         <Card className="p-3 text-center bg-gradient-to-r from-blue-50 to-cyan-50">
//           <p className="text-2xl font-bold text-blue-600">{stats.leaveBalance.sick}</p>
//           <p className="text-xs text-gray-600">Sick Leave</p>
//         </Card>
//         <Card className="p-3 text-center bg-gradient-to-r from-purple-50 to-pink-50">
//           <p className="text-2xl font-bold text-purple-600">{stats.leaveBalance.casual}</p>
//           <p className="text-xs text-gray-600">Casual Leave</p>
//         </Card>
//         <Link to="/leave/apply">
//           <Card className="p-3 text-center bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-md transition-shadow">
//             <p className="text-xl mb-1">➕</p>
//             <p className="text-xs font-medium text-orange-700">Apply Leave</p>
//           </Card>
//         </Link>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <Link to="/tracking/live" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">📍</div>
//           <p className="text-xs font-medium">Live Tracking</p>
//           {locationSharing && <span className="text-xs text-green-600 block">Active</span>}
//         </Link>
//         <Link to="/attendance/check-in-out" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">Check In/Out</p>
//         </Link>
//         <Link to="/profile" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-xl mb-1">👤</div>
//           <p className="text-xs font-medium">My Profile</p>
//         </Link>
//         <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
//           <div className="text-xl mb-1">💬</div>
//           <p className="text-xs font-medium">Team Chat</p>
//           {stats.unreadMessages > 0 && (
//             <span className="inline-block ml-1 text-xs text-red-500">({stats.unreadMessages})</span>
//           )}
//         </Link>
//       </div>

//       {/* Evidence Upload Modal */}
//       <Modal
//         isOpen={showEvidenceModal}
//         onClose={() => setShowEvidenceModal(false)}
//         title={`Upload Evidence - ${selectedTaskForEvidence?.title || 'Task'}`}
//         size="lg"
//       >
//         <div className="space-y-6">
//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-3">Upload via URL</h4>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={evidenceUrl}
//                 onChange={(e) => setEvidenceUrl(e.target.value)}
//                 placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
//                 className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <Button 
//                 onClick={handleEvidenceUrlSubmit} 
//                 isLoading={uploadingEvidence}
//                 disabled={!evidenceUrl.trim()}
//               >
//                 Upload
//               </Button>
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               💡 Enter a direct image URL from cloud storage
//             </p>
//           </div>

//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-3">Upload from Device</h4>
//             <div className="flex flex-wrap gap-4">
//               <label className="cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
//                   className="hidden"
//                 />
//                 <div className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
//                   Select Images
//                 </div>
//               </label>
//               {evidenceFiles.length > 0 && (
//                 <Button onClick={handleEvidenceFileUpload} isLoading={uploadingEvidence}>
//                   Upload {evidenceFiles.length} Image(s)
//                 </Button>
//               )}
//             </div>
//             {evidenceFiles.length > 0 && (
//               <div className="mt-3">
//                 <p className="text-sm text-gray-600">Selected files:</p>
//                 <ul className="mt-1 text-xs text-gray-500">
//                   {evidenceFiles.map((file, idx) => (
//                     <li key={idx}>📷 {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <p className="text-xs text-gray-500 mt-2">
//               Supported formats: JPG, PNG, GIF (Max 10MB per file)
//             </p>
//           </div>

//           <div className="bg-blue-50 rounded-lg p-3">
//             <p className="text-sm text-blue-800">
//               💡 Tip: Upload before/after photos to show work completion.
//             </p>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TechnicianDashboard;








// // client/src/pages/dashboard/TechnicianDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { trackingApi } from '../../api/tracking.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { useTaskProgress } from '../../hooks/useTaskProgress';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const TechnicianDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [myTasks, setMyTasks] = useState([]);
//   const [activeTaskId, setActiveTaskId] = useState(null);
//   const [trackingActive, setTrackingActive] = useState(false);
//   const [recentChats, setRecentChats] = useState([]);
//   const [showEvidenceModal, setShowEvidenceModal] = useState(false);
//   const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState(null);
//   const [evidenceUrl, setEvidenceUrl] = useState('');
//   const [evidenceFiles, setEvidenceFiles] = useState([]);
//   const [uploadingEvidence, setUploadingEvidence] = useState(false);
//   const [locationSharing, setLocationSharing] = useState(false);
//   const [locationWatchId, setLocationWatchId] = useState(null);
//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [locationError, setLocationError] = useState(null);
//   const [apiErrors, setApiErrors] = useState({
//     tasks: false,
//     attendance: false,
//     leave: false,
//     chat: false
//   });
//   const [stats, setStats] = useState({
//     assignedTasks: 0,
//     acceptedTasks: 0,
//     inProgress: 0,
//     completed: 0,
//     pendingReview: 0,
//     attendanceRate: 85,
//     unreadMessages: 0,
//     leaveBalance: { annual: 22, sick: 12, casual: 5 }
//   });

//   // Use the useTaskProgress hook
//   const { 
//     loading: actionLoading, 
//     acceptTask, 
//     startTaskWithGPS,
//     updateProgress,
//     uploadEvidence: uploadEvidenceApi,
//     completeTask 
//   } = useTaskProgress(activeTaskId, (status) => {
//     fetchMyTasks();
//     if (status === 'in_progress') setTrackingActive(true);
//     if (status === 'completed') setTrackingActive(false);
//   });

//   useEffect(() => {
//     fetchAllData();
//     checkTrackingSession();
    
//     const interval = setInterval(() => fetchChatData(), 30000);
//     return () => {
//       clearInterval(interval);
//       stopLocationSharing();
//     };
//   }, []);

//   /**
//    * PURPOSE: Check if user has an active location sharing session
//    */
//   const checkTrackingSession = async () => {
//     try {
//       const response = await trackingApi.getCurrentSession();
//       if (response?.data?.data?.isActive) {
//         setTrackingActive(true);
//       }
//     } catch (error) {
//       console.error('Error checking tracking session:', error);
//     }
//   };

//   /**
//    * PURPOSE: Start sharing user's location for live tracking
//    */
//   const startLocationSharing = () => {
//     if (!navigator.geolocation) {
//       setLocationError('Geolocation is not supported by your browser');
//       showToast('Geolocation is not supported by your browser', 'error');
//       return;
//     }

//     setLocationError(null);
    
//     // First, check if we can get permission
//     navigator.permissions.query({ name: 'geolocation' }).then((result) => {
//       if (result.state === 'denied') {
//         setLocationError('Location permission denied. Please enable location services in your browser settings.');
//         showToast('Please enable location services to share your location', 'warning');
//         return;
//       }
//     });

//     // Get current position immediately
//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           speed: position.coords.speed || 0,
//           heading: position.coords.heading || 0
//         };
        
//         setCurrentLocation(location);
        
//         try {
//           // Try to update location (handle both possible endpoint patterns)
//           if (trackingApi.updateLocation) {
//             await trackingApi.updateLocation(
//               location.lat,
//               location.lng,
//               location.accuracy,
//               location.speed,
//               location.heading
//             );
//           }
//           setLocationSharing(true);
//           showToast('Location sharing started successfully', 'success');
//         } catch (error) {
//           console.error('Failed to update location:', error);
//           setLocationError('Failed to share location. Please try again.');
//           showToast('Failed to share location', 'error');
//         }
//       },
//       (error) => {
//         console.error('Geolocation error:', error);
//         let errorMessage = 'Unable to get your location. ';
//         switch(error.code) {
//           case error.PERMISSION_DENIED:
//             errorMessage += 'Please enable location permissions.';
//             break;
//           case error.POSITION_UNAVAILABLE:
//             errorMessage += 'Location information is unavailable.';
//             break;
//           case error.TIMEOUT:
//             errorMessage += 'Location request timed out.';
//             break;
//           default:
//             errorMessage += 'Unknown error occurred.';
//         }
//         setLocationError(errorMessage);
//         showToast(errorMessage, 'warning');
//       },
//       { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
//     );

//     // Watch position for continuous updates
//     const watchId = navigator.geolocation.watchPosition(
//       async (position) => {
//         const location = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//           accuracy: position.coords.accuracy,
//           speed: position.coords.speed || 0,
//           heading: position.coords.heading || 0
//         };
        
//         setCurrentLocation(location);
        
//         try {
//           if (trackingApi.updateLocation && locationSharing) {
//             await trackingApi.updateLocation(
//               location.lat,
//               location.lng,
//               location.accuracy,
//               location.speed,
//               location.heading
//             );
//           }
//         } catch (error) {
//           console.error('Failed to update location:', error);
//         }
//       },
//       (error) => {
//         console.error('Watch position error:', error);
//       },
//       { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
//     );
    
//     setLocationWatchId(watchId);
//   };

//   /**
//    * PURPOSE: Stop sharing location
//    */
//   const stopLocationSharing = async () => {
//     if (locationWatchId) {
//       navigator.geolocation.clearWatch(locationWatchId);
//       setLocationWatchId(null);
//     }
    
//     try {
//       // Try to end session if endpoint exists
//       if (trackingApi.endSession) {
//         await trackingApi.endSession();
//       }
//       setLocationSharing(false);
//       setCurrentLocation(null);
//       setLocationError(null);
//       showToast('Location sharing stopped', 'info');
//     } catch (error) {
//       console.error('Error stopping location sharing:', error);
//       // Still update UI even if API call fails
//       setLocationSharing(false);
//     }
//   };

//   /**
//    * PURPOSE: Toggle location sharing on/off
//    */
//   const toggleLocationSharing = () => {
//     if (locationSharing) {
//       stopLocationSharing();
//     } else {
//       startLocationSharing();
//     }
//   };

//   const safeFetch = async (apiCall, errorKey, fallback = null) => {
//     try {
//       const response = await apiCall();
//       if (response?.data?.success) {
//         return response.data.data;
//       }
//       if (response?.success) {
//         return response.data;
//       }
//       return fallback;
//     } catch (error) {
//       console.error(`Failed to fetch ${errorKey}:`, error);
//       if (error.response?.status !== 403 && error.response?.status !== 404) {
//         setApiErrors(prev => ({ ...prev, [errorKey]: true }));
//       }
//       return fallback;
//     }
//   };

//   const fetchChatData = async () => {
//     try {
//       const unreadData = await safeFetch(
//         () => chatApi.getTotalUnreadCount(),
//         'chat',
//         { count: 0 }
//       );
      
//       const chatsData = await safeFetch(
//         () => chatApi.getUserChats(),
//         'chat',
//         []
//       );
      
//       const recentChatsList = Array.isArray(chatsData) 
//         ? chatsData.slice(0, 3).map(chat => ({
//             id: chat._id,
//             name: chat.chatType === 'group' 
//               ? chat.groupName 
//               : chat.participants?.find(p => p.userId?._id !== user?._id)?.userId?.firstName || 'Unknown',
//             lastMessage: chat.lastMessage?.message || 'No messages',
//             timestamp: chat.lastMessage?.timestamp,
//             unreadCount: chat.unreadCount || 0,
//             chatType: chat.chatType
//           }))
//         : [];
      
//       setRecentChats(recentChatsList);
//       setStats(prev => ({
//         ...prev,
//         unreadMessages: unreadData?.count || 0
//       }));
      
//     } catch (error) {
//       console.error('Chat data fetch error:', error);
//       setApiErrors(prev => ({ ...prev, chat: true }));
//     }
//   };

//   const fetchAllData = async () => {
//     setLoading(true);
//     setApiErrors({
//       tasks: false,
//       attendance: false,
//       leave: false,
//       chat: false
//     });
    
//     try {
//       await Promise.all([
//         fetchMyTasks(),
//         fetchAttendanceData(),
//         fetchLeaveBalance(),
//         fetchChatData()
//       ]);
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchMyTasks = async () => {
//     try {
//       const response = await taskApi.getMyTasks();
//       let tasks = [];
      
//       if (response.data && response.data.success) {
//         tasks = response.data.data?.tasks || response.data.data || [];
//       } else if (response.success && response.data) {
//         tasks = response.data.tasks || response.data || [];
//       }
      
//       setMyTasks(tasks);
      
//       setStats(prev => ({
//         ...prev,
//         assignedTasks: tasks.filter(t => t.status === 'assigned').length,
//         acceptedTasks: tasks.filter(t => t.status === 'accepted').length,
//         inProgress: tasks.filter(t => t.status === 'in_progress').length,
//         completed: tasks.filter(t => t.status === 'completed').length,
//         pendingReview: tasks.filter(t => t.status === 'pending_review').length
//       }));
//     } catch (error) {
//       console.error('Error fetching tasks:', error);
//       setApiErrors(prev => ({ ...prev, tasks: true }));
//       if (error.response?.status !== 403) {
//         showToast('Failed to load tasks', 'error');
//       }
//     }
//   };

//   /**
//    * PURPOSE: Fetch attendance data for the technician
//    * FIXED: Properly handles missing API methods
//    */
//   const fetchAttendanceData = async () => {
//     try {
//       let response = null;
      
//       // Try multiple possible endpoints
//       if (attendanceApi.getMyAttendance) {
//         response = await attendanceApi.getMyAttendance();
//       } else if (attendanceApi.getAttendance) {
//         response = await attendanceApi.getAttendance();
//       } else if (attendanceApi.getUserAttendance && user?._id) {
//         response = await attendanceApi.getUserAttendance(user._id);
//       }
      
//       if (response?.data?.success) {
//         const attendance = response.data.data;
//         let rate = 85;
//         if (attendance.presentCount && attendance.totalDays) {
//           rate = Math.round((attendance.presentCount / attendance.totalDays) * 100);
//         } else if (attendance.rate) {
//           rate = attendance.rate;
//         }
//         setStats(prev => ({ ...prev, attendanceRate: rate }));
//       } else {
//         console.log('Using mock attendance data');
//       }
//     } catch (error) {
//       console.warn('Attendance data not available, using default value');
//     }
//   };

//   const fetchLeaveBalance = async () => {
//     try {
//       const response = await leaveApi.getMyLeaveBalance();
//       if (response?.data?.success) {
//         setStats(prev => ({ ...prev, leaveBalance: response.data.data }));
//       }
//     } catch (error) {
//       console.warn('Leave balance not available:', error.message);
//     }
//   };

//   const handleLogout = async () => {
//     if (locationSharing) {
//       await stopLocationSharing();
//     }
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const handleAcceptTask = async (taskId) => {
//     setActiveTaskId(taskId);
//     await acceptTask();
//     await fetchMyTasks();
//   };

//   const handleStartTask = async (taskId) => {
//     setActiveTaskId(taskId);
//     await startTaskWithGPS();
//     await fetchMyTasks();
//   };

//   const handleUpdateProgress = async (taskId, currentProgress) => {
//     const newProgress = prompt(`Enter progress percentage (Current: ${currentProgress}%):`, currentProgress);
//     if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
//       setActiveTaskId(taskId);
//       await updateProgress(parseInt(newProgress));
//       await fetchMyTasks();
//     }
//   };

//   const handleUploadEvidenceClick = (task) => {
//     setSelectedTaskForEvidence(task);
//     setEvidenceUrl('');
//     setEvidenceFiles([]);
//     setShowEvidenceModal(true);
//   };

//   const handleEvidenceUrlSubmit = async () => {
//     if (!evidenceUrl.trim()) {
//       showToast('Please enter an image URL', 'warning');
//       return;
//     }

//     setUploadingEvidence(true);
//     try {
//       setActiveTaskId(selectedTaskForEvidence._id);
//       const response = await uploadEvidenceApi([{ url: evidenceUrl }], [], []);
      
//       if (response?.data?.success || response?.success) {
//         showToast('Evidence uploaded successfully!', 'success');
//         setShowEvidenceModal(false);
//         setEvidenceUrl('');
//         await fetchMyTasks();
//       } else {
//         showToast('Failed to upload evidence', 'error');
//       }
//     } catch (error) {
//       console.error('Evidence upload error:', error);
//       showToast(error.response?.data?.error || 'Failed to upload evidence', 'error');
//     } finally {
//       setUploadingEvidence(false);
//     }
//   };

//   const handleEvidenceFileUpload = async () => {
//     if (evidenceFiles.length === 0) {
//       showToast('Please select files to upload', 'warning');
//       return;
//     }

//     setUploadingEvidence(true);
//     try {
//       // Convert files to base64
//       const imageUrls = await Promise.all(
//         evidenceFiles.map(file => {
//           return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(file);
//           });
//         })
//       );
      
//       setActiveTaskId(selectedTaskForEvidence._id);
//       const response = await uploadEvidenceApi(imageUrls, [], []);
      
//       if (response?.data?.success || response?.success) {
//         showToast(`${evidenceFiles.length} image(s) uploaded successfully!`, 'success');
//         setShowEvidenceModal(false);
//         setEvidenceFiles([]);
//         await fetchMyTasks();
//       } else {
//         showToast('Failed to upload evidence', 'error');
//       }
//     } catch (error) {
//       console.error('File upload error:', error);
//       showToast('Failed to upload evidence', 'error');
//     } finally {
//       setUploadingEvidence(false);
//     }
//   };

//   const handleCompleteTask = async (taskId) => {
//     const confirmComplete = window.confirm('Are you sure you want to mark this task as complete?');
//     if (!confirmComplete) return;
    
//     setActiveTaskId(taskId);
//     await completeTask('', []);
//     await fetchMyTasks();
//     showToast('Task completed! Pending verification.', 'success');
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       pending_review: 'bg-purple-100 text-purple-800'
//     };
//     return badges[status] || badges.assigned;
//   };

//   const getPriorityBadge = (priority) => {
//     const badges = {
//       critical: 'bg-red-100 text-red-800',
//       high: 'bg-orange-100 text-orange-800',
//       medium: 'bg-yellow-100 text-yellow-800',
//       low: 'bg-green-100 text-green-800'
//     };
//     return badges[priority] || badges.medium;
//   };

//   const formatTimeAgo = (date) => {
//     if (!date) return 'Recently';
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return 'Just now';
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days > 1 ? 's' : ''} ago`;
//   };

//   const renderActionButtons = (task) => {
//     switch (task.status) {
//       case 'assigned':
//         return (
//           <Button 
//             size="sm" 
//             variant="primary" 
//             onClick={() => handleAcceptTask(task._id)}
//             disabled={actionLoading}
//             className="bg-green-600 hover:bg-green-700"
//           >
//             ✓ Accept Task
//           </Button>
//         );
//       case 'accepted':
//         return (
//           <Button 
//             size="sm" 
//             variant="success" 
//             onClick={() => handleStartTask(task._id)}
//             disabled={actionLoading}
//           >
//             📍 Start Work
//           </Button>
//         );
//       case 'in_progress':
//         return (
//           <div className="flex flex-wrap gap-2">
//             <Button 
//               size="sm" 
//               variant="secondary" 
//               onClick={() => handleUpdateProgress(task._id, task.progress?.percentage || 0)}
//               disabled={actionLoading}
//             >
//               📊 Update ({task.progress?.percentage || 0}%)
//             </Button>
//             <Button 
//               size="sm" 
//               variant="primary" 
//               onClick={() => handleUploadEvidenceClick(task)}
//               disabled={actionLoading}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               📸 Upload Evidence
//             </Button>
//             <Link to={`/tasks/${task._id}`}>
//               <Button size="sm" variant="secondary">
//                 🔍 View Details
//               </Button>
//             </Link>
//             <Button 
//               size="sm" 
//               variant="success" 
//               onClick={() => handleCompleteTask(task._id)}
//               disabled={actionLoading}
//             >
//               ✅ Complete
//             </Button>
//           </div>
//         );
//       case 'completed':
//         return (
//           <span className="text-sm text-yellow-600 font-medium">
//             ⏳ Pending Verification
//           </span>
//         );
//       case 'pending_review':
//         return (
//           <span className="text-sm text-purple-600 font-medium">
//             📋 Under Review
//           </span>
//         );
//       default:
//         return (
//           <Link to={`/tasks/${task._id}`}>
//             <Button size="sm" variant="secondary">View Details</Button>
//           </Link>
//         );
//     }
//   };

//   const hasApiErrors = Object.values(apiErrors).some(error => error === true);
//   const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {hasApiErrors && (
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <div className="text-yellow-600 text-xl">⚠️</div>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-yellow-800">
//                 Some data could not be loaded ({apiErrorCount} issues)
//               </p>
//               <p className="text-xs text-yellow-700 mt-1">
//                 {apiErrors.attendance && "• Attendance data may be incomplete\n"}
//                 {apiErrors.leave && "• Leave data may be incomplete\n"}
//                 {apiErrors.chat && "• Chat data may be unavailable"}
//               </p>
//               <button 
//                 onClick={fetchAllData}
//                 className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
//               >
//                 Retry loading data
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {locationError && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-start gap-3">
//             <div className="text-red-600 text-xl">⚠️</div>
//             <div className="flex-1">
//               <p className="text-sm font-medium text-red-800">Location Error</p>
//               <p className="text-xs text-red-700 mt-1">{locationError}</p>
//               <button 
//                 onClick={() => {
//                   setLocationError(null);
//                   startLocationSharing();
//                 }}
//                 className="mt-2 text-xs text-red-800 underline hover:text-red-900"
//               >
//                 Try again
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}!</p>
//           {currentLocation && locationSharing && (
//             <p className="text-xs text-green-600 mt-1">
//               📍 Location sharing active: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
//             </p>
//           )}
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <Link to="/chat" className="relative">
//             <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
//               <span className="text-xl">💬</span>
//             </div>
//             {stats.unreadMessages > 0 && (
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
//               </span>
//             )}
//           </Link>
          
//           {/* Location Sharing Toggle Button */}
//           <Button 
//             variant={locationSharing ? "warning" : "success"}
//             size="sm" 
//             onClick={toggleLocationSharing}
//             className={locationSharing ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
//           >
//             {locationSharing ? '📍 Stop Sharing' : '📍 Start Sharing'}
//           </Button>
          
//           {trackingActive && (
//             <Button 
//               variant="secondary" 
//               size="sm" 
//               onClick={() => setTrackingActive(false)}
//               className="bg-blue-100 text-blue-800"
//             >
//               🟢 Active
//             </Button>
//           )}
//           <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
//             Logout
//           </Button>
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-blue-600">{stats.assignedTasks}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-cyan-600">{stats.acceptedTasks}</p>
//           <p className="text-xs text-gray-500">Accepted</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-orange-600">{stats.inProgress}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-green-600">{stats.completed}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-purple-600">{stats.pendingReview}</p>
//           <p className="text-xs text-gray-500">Pending Review</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-teal-600">{stats.attendanceRate}%</p>
//           <p className="text-xs text-gray-500">Attendance</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-cyan-600">{stats.unreadMessages}</p>
//           <p className="text-xs text-gray-500">Unread</p>
//         </Card>
//         <Link to="/leave/balance">
//           <Card className="p-3 text-center hover:shadow-md transition-shadow">
//             <p className="text-xl font-bold text-indigo-600">{stats.leaveBalance.annual}</p>
//             <p className="text-xs text-gray-500">Leave Balance</p>
//           </Card>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         <div className="lg:col-span-2">
//           <Card className="p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="font-semibold text-gray-900">My Tasks</h3>
//               <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
//                 View All →
//               </Link>
//             </div>
            
//             {myTasks.length > 0 ? (
//               <div className="space-y-3 max-h-96 overflow-y-auto">
//                 {myTasks.map(task => (
//                   <div key={task._id} className="border rounded-lg p-3 hover:bg-gray-50">
//                     <div className="flex flex-wrap justify-between items-start gap-2">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                             {task.status?.replace(/_/g, ' ')}
//                           </span>
//                           <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                             {task.priority}
//                           </span>
//                           <span className="font-medium">{task.title}</span>
//                         </div>
//                         <p className="text-xs text-gray-500 mt-1">
//                           ID: {task.taskId || task._id?.slice(-6)} | 
//                           Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
//                         </p>
//                         {task.progress?.percentage > 0 && (
//                           <div className="mt-2 w-32">
//                             <div className="w-full bg-gray-200 rounded-full h-1.5">
//                               <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress.percentage}%` }} />
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-2">
//                         {renderActionButtons(task)}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500">No tasks assigned yet</p>
//               </div>
//             )}
//           </Card>
//         </div>

//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
//             <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800">
//               Open Chat →
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {recentChats.length > 0 ? (
//               recentChats.map(chat => (
//                 <Link key={chat.id} to={`/chat?chat=${chat.id}`}>
//                   <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
//                     <div className="relative">
//                       <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center">
//                         <span className="text-lg">{chat.chatType === 'group' ? '👥' : '👤'}</span>
//                       </div>
//                       {chat.unreadCount > 0 && (
//                         <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                           {chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-gray-900 truncate">{chat.name}</p>
//                       <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
//                     </div>
//                     <div className="text-xs text-gray-400">
//                       {formatTimeAgo(chat.timestamp)}
//                     </div>
//                   </div>
//                 </Link>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No conversations yet</p>
//                 <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 mt-2 inline-block">
//                   Start a chat
//                 </Link>
//               </div>
//             )}
//           </div>
//           {stats.unreadMessages > 0 && (
//             <div className="mt-3 pt-3 border-t">
//               <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
//                 You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''} →
//               </Link>
//             </div>
//           )}
//         </Card>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Card className="p-3 text-center bg-gradient-to-r from-green-50 to-emerald-50">
//           <p className="text-2xl font-bold text-green-600">{stats.leaveBalance.annual}</p>
//           <p className="text-xs text-gray-600">Annual Leave</p>
//         </Card>
//         <Card className="p-3 text-center bg-gradient-to-r from-blue-50 to-cyan-50">
//           <p className="text-2xl font-bold text-blue-600">{stats.leaveBalance.sick}</p>
//           <p className="text-xs text-gray-600">Sick Leave</p>
//         </Card>
//         <Card className="p-3 text-center bg-gradient-to-r from-purple-50 to-pink-50">
//           <p className="text-2xl font-bold text-purple-600">{stats.leaveBalance.casual}</p>
//           <p className="text-xs text-gray-600">Casual Leave</p>
//         </Card>
//         <Link to="/leave/apply">
//           <Card className="p-3 text-center bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-md transition-shadow">
//             <p className="text-xl mb-1">➕</p>
//             <p className="text-xs font-medium text-orange-700">Apply Leave</p>
//           </Card>
//         </Link>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//         <Link to="/tracking/live" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">📍</div>
//           <p className="text-xs font-medium">Live Tracking</p>
//           {locationSharing && <span className="text-xs text-green-600 block">Sharing Active</span>}
//         </Link>
//         <Link to="/attendance/check-in-out" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">Check In/Out</p>
//         </Link>
//         <Link to="/profile" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-xl mb-1">👤</div>
//           <p className="text-xs font-medium">My Profile</p>
//         </Link>
//         <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
//           <div className="text-xl mb-1">💬</div>
//           <p className="text-xs font-medium">Team Chat</p>
//           {stats.unreadMessages > 0 && (
//             <span className="inline-block ml-1 text-xs text-red-500">({stats.unreadMessages})</span>
//           )}
//         </Link>
//       </div>

//       {/* Evidence Upload Modal */}
//       <Modal
//         isOpen={showEvidenceModal}
//         onClose={() => setShowEvidenceModal(false)}
//         title={`Upload Evidence - ${selectedTaskForEvidence?.title || 'Task'}`}
//         size="lg"
//       >
//         <div className="space-y-6">
//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-3">Upload via URL</h4>
//             <div className="flex gap-2">
//               <input
//                 type="text"
//                 value={evidenceUrl}
//                 onChange={(e) => setEvidenceUrl(e.target.value)}
//                 placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
//                 className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               />
//               <Button 
//                 onClick={handleEvidenceUrlSubmit} 
//                 isLoading={uploadingEvidence}
//                 disabled={!evidenceUrl.trim()}
//               >
//                 Upload
//               </Button>
//             </div>
//             <p className="text-xs text-gray-500 mt-2">
//               💡 Enter a direct image URL from cloud storage
//             </p>
//           </div>

//           <div className="border rounded-lg p-4">
//             <h4 className="font-medium text-gray-900 mb-3">Upload from Device</h4>
//             <div className="flex flex-wrap gap-4">
//               <label className="cursor-pointer">
//                 <input
//                   type="file"
//                   accept="image/*"
//                   multiple
//                   onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
//                   className="hidden"
//                 />
//                 <div className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
//                   Select Images
//                 </div>
//               </label>
//               {evidenceFiles.length > 0 && (
//                 <Button onClick={handleEvidenceFileUpload} isLoading={uploadingEvidence}>
//                   Upload {evidenceFiles.length} Image(s)
//                 </Button>
//               )}
//             </div>
//             {evidenceFiles.length > 0 && (
//               <div className="mt-3">
//                 <p className="text-sm text-gray-600">Selected files:</p>
//                 <ul className="mt-1 text-xs text-gray-500">
//                   {evidenceFiles.map((file, idx) => (
//                     <li key={idx}>📷 {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
//                   ))}
//                 </ul>
//               </div>
//             )}
//             <p className="text-xs text-gray-500 mt-2">
//               Supported formats: JPG, PNG, GIF (Max 10MB per file)
//             </p>
//           </div>

//           <div className="bg-blue-50 rounded-lg p-3">
//             <p className="text-sm text-blue-800">
//               💡 Tip: Upload before/after photos to show work completion.
//             </p>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TechnicianDashboard;


// client/src/pages/dashboard/TechnicianDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { attendanceApi } from '../../api/attendance.api';
import { leaveApi } from '../../api/leave.api';
import { chatApi } from '../../api/chat.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTaskProgress } from '../../hooks/useTaskProgress';
import { useLocationTracking } from '../../hooks/useLocationTracking';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const TechnicianDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [myTasks, setMyTasks] = useState([]);
  const [activeTaskId, setActiveTaskId] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedTaskForEvidence, setSelectedTaskForEvidence] = useState(null);
  const [evidenceUrl, setEvidenceUrl] = useState('');
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [uploadingEvidence, setUploadingEvidence] = useState(false);
  const [apiErrors, setApiErrors] = useState({
    tasks: false,
    attendance: false,
    leave: false,
    chat: false
  });
  const [stats, setStats] = useState({
    assignedTasks: 0,
    acceptedTasks: 0,
    inProgress: 0,
    completed: 0,
    pendingReview: 0,
    attendanceRate: 85,
    unreadMessages: 0,
    leaveBalance: { annual: 22, sick: 12, casual: 5 }
  });

  // Use the enhanced location tracking hook with persistence
  const { 
    currentLocation, 
    isTracking: locationSharing, 
    error: locationError,
    toggleTracking: toggleLocationSharing,
    stopTracking: stopLocationSharing
  } = useLocationTracking();

  // Use the useTaskProgress hook
  const { 
    loading: actionLoading, 
    acceptTask, 
    startTaskWithGPS,
    updateProgress,
    uploadEvidence: uploadEvidenceApi,
    completeTask 
  } = useTaskProgress(activeTaskId, (status) => {
    fetchMyTasks();
  });

  useEffect(() => {
    fetchAllData();
    const interval = setInterval(() => fetchChatData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const safeFetch = async (apiCall, errorKey, fallback = null) => {
    try {
      const response = await apiCall();
      if (response?.data?.success) {
        return response.data.data;
      }
      if (response?.success) {
        return response.data;
      }
      return fallback;
    } catch (error) {
      console.error(`Failed to fetch ${errorKey}:`, error);
      if (error.response?.status !== 403 && error.response?.status !== 404) {
        setApiErrors(prev => ({ ...prev, [errorKey]: true }));
      }
      return fallback;
    }
  };

  const fetchChatData = async () => {
    try {
      const unreadData = await safeFetch(
        () => chatApi.getTotalUnreadCount(),
        'chat',
        { count: 0 }
      );
      
      const chatsData = await safeFetch(
        () => chatApi.getUserChats(),
        'chat',
        []
      );
      
      const recentChatsList = Array.isArray(chatsData) 
        ? chatsData.slice(0, 3).map(chat => ({
            id: chat._id,
            name: chat.chatType === 'group' 
              ? chat.groupName 
              : chat.participants?.find(p => p.userId?._id !== user?._id)?.userId?.firstName || 'Unknown',
            lastMessage: chat.lastMessage?.message || 'No messages',
            timestamp: chat.lastMessage?.timestamp,
            unreadCount: chat.unreadCount || 0,
            chatType: chat.chatType
          }))
        : [];
      
      setRecentChats(recentChatsList);
      setStats(prev => ({
        ...prev,
        unreadMessages: unreadData?.count || 0
      }));
      
    } catch (error) {
      console.error('Chat data fetch error:', error);
      setApiErrors(prev => ({ ...prev, chat: true }));
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    setApiErrors({
      tasks: false,
      attendance: false,
      leave: false,
      chat: false
    });
    
    try {
      await Promise.all([
        fetchMyTasks(),
        fetchAttendanceData(),
        fetchLeaveBalance(),
        fetchChatData()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyTasks = async () => {
    try {
      const response = await taskApi.getMyTasks();
      let tasks = [];
      
      if (response.data && response.data.success) {
        tasks = response.data.data?.tasks || response.data.data || [];
      } else if (response.success && response.data) {
        tasks = response.data.tasks || response.data || [];
      }
      
      setMyTasks(tasks);
      
      setStats(prev => ({
        ...prev,
        assignedTasks: tasks.filter(t => t.status === 'assigned').length,
        acceptedTasks: tasks.filter(t => t.status === 'accepted').length,
        inProgress: tasks.filter(t => t.status === 'in_progress').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pendingReview: tasks.filter(t => t.status === 'pending_review').length
      }));
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setApiErrors(prev => ({ ...prev, tasks: true }));
      if (error.response?.status !== 403) {
        showToast('Failed to load tasks', 'error');
      }
    }
  };

  /**
   * PURPOSE: Fetch attendance data for the technician
   */
  const fetchAttendanceData = async () => {
    try {
      let response = null;
      
      // Try multiple possible endpoints
      if (attendanceApi.getMyAttendance) {
        response = await attendanceApi.getMyAttendance();
      } else if (attendanceApi.getAttendance) {
        response = await attendanceApi.getAttendance();
      } else if (attendanceApi.getUserAttendance && user?._id) {
        response = await attendanceApi.getUserAttendance(user._id);
      }
      
      if (response?.data?.success) {
        const attendance = response.data.data;
        let rate = 85;
        if (attendance.presentCount && attendance.totalDays) {
          rate = Math.round((attendance.presentCount / attendance.totalDays) * 100);
        } else if (attendance.rate) {
          rate = attendance.rate;
        }
        setStats(prev => ({ ...prev, attendanceRate: rate }));
      } else {
        console.log('Using mock attendance data');
      }
    } catch (error) {
      console.warn('Attendance data not available, using default value');
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const response = await leaveApi.getMyLeaveBalance();
      if (response?.data?.success) {
        setStats(prev => ({ ...prev, leaveBalance: response.data.data }));
      }
    } catch (error) {
      console.warn('Leave balance not available:', error.message);
    }
  };

  const handleLogout = async () => {
    if (locationSharing) {
      await stopLocationSharing();
    }
    await logout();
    navigate('/login');
    showToast('Logged out successfully', 'success');
  };

  const handleAcceptTask = async (taskId) => {
    setActiveTaskId(taskId);
    await acceptTask();
    await fetchMyTasks();
  };

  const handleStartTask = async (taskId) => {
    setActiveTaskId(taskId);
    await startTaskWithGPS();
    await fetchMyTasks();
  };

  const handleUpdateProgress = async (taskId, currentProgress) => {
    const newProgress = prompt(`Enter progress percentage (Current: ${currentProgress}%):`, currentProgress);
    if (newProgress !== null && !isNaN(newProgress) && newProgress >= 0 && newProgress <= 100) {
      setActiveTaskId(taskId);
      await updateProgress(parseInt(newProgress));
      await fetchMyTasks();
    }
  };

  const handleUploadEvidenceClick = (task) => {
    setSelectedTaskForEvidence(task);
    setEvidenceUrl('');
    setEvidenceFiles([]);
    setShowEvidenceModal(true);
  };

  const handleEvidenceUrlSubmit = async () => {
    if (!evidenceUrl.trim()) {
      showToast('Please enter an image URL', 'warning');
      return;
    }

    setUploadingEvidence(true);
    try {
      setActiveTaskId(selectedTaskForEvidence._id);
      const response = await uploadEvidenceApi([{ url: evidenceUrl }], [], []);
      
      if (response?.data?.success || response?.success) {
        showToast('Evidence uploaded successfully!', 'success');
        setShowEvidenceModal(false);
        setEvidenceUrl('');
        await fetchMyTasks();
      } else {
        showToast('Failed to upload evidence', 'error');
      }
    } catch (error) {
      console.error('Evidence upload error:', error);
      showToast(error.response?.data?.error || 'Failed to upload evidence', 'error');
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleEvidenceFileUpload = async () => {
    if (evidenceFiles.length === 0) {
      showToast('Please select files to upload', 'warning');
      return;
    }

    setUploadingEvidence(true);
    try {
      // Convert files to base64
      const imageUrls = await Promise.all(
        evidenceFiles.map(file => {
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
          });
        })
      );
      
      setActiveTaskId(selectedTaskForEvidence._id);
      const response = await uploadEvidenceApi(imageUrls, [], []);
      
      if (response?.data?.success || response?.success) {
        showToast(`${evidenceFiles.length} image(s) uploaded successfully!`, 'success');
        setShowEvidenceModal(false);
        setEvidenceFiles([]);
        await fetchMyTasks();
      } else {
        showToast('Failed to upload evidence', 'error');
      }
    } catch (error) {
      console.error('File upload error:', error);
      showToast('Failed to upload evidence', 'error');
    } finally {
      setUploadingEvidence(false);
    }
  };

  const handleCompleteTask = async (taskId) => {
    const confirmComplete = window.confirm('Are you sure you want to mark this task as complete?');
    if (!confirmComplete) return;
    
    setActiveTaskId(taskId);
    await completeTask('', []);
    await fetchMyTasks();
    showToast('Task completed! Pending verification.', 'success');
  };

  const getStatusBadge = (status) => {
    const badges = {
      assigned: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      pending_review: 'bg-purple-100 text-purple-800'
    };
    return badges[status] || badges.assigned;
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return badges[priority] || badges.medium;
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

  const renderActionButtons = (task) => {
    switch (task.status) {
      case 'assigned':
        return (
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => handleAcceptTask(task._id)}
            disabled={actionLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            ✓ Accept Task
          </Button>
        );
      case 'accepted':
        return (
          <Button 
            size="sm" 
            variant="success" 
            onClick={() => handleStartTask(task._id)}
            disabled={actionLoading}
          >
            📍 Start Work
          </Button>
        );
      case 'in_progress':
        return (
          <div className="flex flex-wrap gap-2">
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => handleUpdateProgress(task._id, task.progress?.percentage || 0)}
              disabled={actionLoading}
            >
              📊 Update ({task.progress?.percentage || 0}%)
            </Button>
            <Button 
              size="sm" 
              variant="primary" 
              onClick={() => handleUploadEvidenceClick(task)}
              disabled={actionLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              📸 Upload Evidence
            </Button>
            <Link to={`/tasks/${task._id}`}>
              <Button size="sm" variant="secondary">
                🔍 View Details
              </Button>
            </Link>
            <Button 
              size="sm" 
              variant="success" 
              onClick={() => handleCompleteTask(task._id)}
              disabled={actionLoading}
            >
              ✅ Complete
            </Button>
          </div>
        );
      case 'completed':
        return (
          <span className="text-sm text-yellow-600 font-medium">
            ⏳ Pending Verification
          </span>
        );
      case 'pending_review':
        return (
          <span className="text-sm text-purple-600 font-medium">
            📋 Under Review
          </span>
        );
      default:
        return (
          <Link to={`/tasks/${task._id}`}>
            <Button size="sm" variant="secondary">View Details</Button>
          </Link>
        );
    }
  };

  const hasApiErrors = Object.values(apiErrors).some(error => error === true);
  const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {hasApiErrors && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">
                Some data could not be loaded ({apiErrorCount} issues)
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {apiErrors.attendance && "• Attendance data may be incomplete\n"}
                {apiErrors.leave && "• Leave data may be incomplete\n"}
                {apiErrors.chat && "• Chat data may be unavailable"}
              </p>
              <button 
                onClick={fetchAllData}
                className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
              >
                Retry loading data
              </button>
            </div>
          </div>
        </div>
      )}

      {locationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="text-red-600 text-xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">Location Error</p>
              <p className="text-xs text-red-700 mt-1">{locationError}</p>
              <button 
                onClick={toggleLocationSharing}
                className="mt-2 text-xs text-red-800 underline hover:text-red-900"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Technician Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}!</p>
          {currentLocation && locationSharing && (
            <p className="text-xs text-green-600 mt-1">
              📍 Location sharing active: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <Link to="/chat" className="relative">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
              <span className="text-xl">💬</span>
            </div>
            {stats.unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
              </span>
            )}
          </Link>
          
          {/* Location Sharing Toggle Button - Uses persistent hook */}
          <Button 
            variant={locationSharing ? "warning" : "success"}
            size="sm" 
            onClick={toggleLocationSharing}
            className={locationSharing ? "bg-yellow-500 hover:bg-yellow-600 text-white" : "bg-green-500 hover:bg-green-600 text-white"}
          >
            {locationSharing ? '📍 Stop Sharing' : '📍 Start Sharing'}
          </Button>
          
          <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600 text-white">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{stats.assignedTasks}</p>
          <p className="text-xs text-gray-500">Assigned</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-cyan-600">{stats.acceptedTasks}</p>
          <p className="text-xs text-gray-500">Accepted</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-orange-600">{stats.inProgress}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-purple-600">{stats.pendingReview}</p>
          <p className="text-xs text-gray-500">Pending Review</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-teal-600">{stats.attendanceRate}%</p>
          <p className="text-xs text-gray-500">Attendance</p>
        </Card>
        <Card className="p-3 text-center">
          <p className="text-xl font-bold text-cyan-600">{stats.unreadMessages}</p>
          <p className="text-xs text-gray-500">Unread</p>
        </Card>
        <Link to="/leave/balance">
          <Card className="p-3 text-center hover:shadow-md transition-shadow">
            <p className="text-xl font-bold text-indigo-600">{stats.leaveBalance.annual}</p>
            <p className="text-xs text-gray-500">Leave Balance</p>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">My Tasks</h3>
              <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">
                View All →
              </Link>
            </div>
            
            {myTasks.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {myTasks.map(task => (
                  <div key={task._id} className="border rounded-lg p-3 hover:bg-gray-50">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadge(task.status)}`}>
                            {task.status?.replace(/_/g, ' ')}
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
                            {task.priority}
                          </span>
                          <span className="font-medium">{task.title}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          ID: {task.taskId || task._id?.slice(-6)} | 
                          Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
                        </p>
                        {task.progress?.percentage > 0 && (
                          <div className="mt-2 w-32">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress.percentage}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {renderActionButtons(task)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No tasks assigned yet</p>
              </div>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
            <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800">
              Open Chat →
            </Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
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
                <p className="text-gray-500">No conversations yet</p>
                <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 mt-2 inline-block">
                  Start a chat
                </Link>
              </div>
            )}
          </div>
          {stats.unreadMessages > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
                You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''} →
              </Link>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-3 text-center bg-gradient-to-r from-green-50 to-emerald-50">
          <p className="text-2xl font-bold text-green-600">{stats.leaveBalance.annual}</p>
          <p className="text-xs text-gray-600">Annual Leave</p>
        </Card>
        <Card className="p-3 text-center bg-gradient-to-r from-blue-50 to-cyan-50">
          <p className="text-2xl font-bold text-blue-600">{stats.leaveBalance.sick}</p>
          <p className="text-xs text-gray-600">Sick Leave</p>
        </Card>
        <Card className="p-3 text-center bg-gradient-to-r from-purple-50 to-pink-50">
          <p className="text-2xl font-bold text-purple-600">{stats.leaveBalance.casual}</p>
          <p className="text-xs text-gray-600">Casual Leave</p>
        </Card>
        <Link to="/leave/apply">
          <Card className="p-3 text-center bg-gradient-to-r from-orange-50 to-red-50 hover:shadow-md transition-shadow">
            <p className="text-xl mb-1">➕</p>
            <p className="text-xs font-medium text-orange-700">Apply Leave</p>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link to="/tracking/live" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-xl mb-1">📍</div>
          <p className="text-xs font-medium">Live Tracking</p>
          {locationSharing && <span className="text-xs text-green-600 block">Sharing Active</span>}
        </Link>
        <Link to="/attendance/check-in-out" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
          <div className="text-xl mb-1">⏰</div>
          <p className="text-xs font-medium">Check In/Out</p>
        </Link>
        <Link to="/profile" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
          <div className="text-xl mb-1">👤</div>
          <p className="text-xs font-medium">My Profile</p>
        </Link>
        <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
          <div className="text-xl mb-1">💬</div>
          <p className="text-xs font-medium">Team Chat</p>
          {stats.unreadMessages > 0 && (
            <span className="inline-block ml-1 text-xs text-red-500">({stats.unreadMessages})</span>
          )}
        </Link>
      </div>

      {/* Evidence Upload Modal */}
      <Modal
        isOpen={showEvidenceModal}
        onClose={() => setShowEvidenceModal(false)}
        title={`Upload Evidence - ${selectedTaskForEvidence?.title || 'Task'}`}
        size="lg"
      >
        <div className="space-y-6">
          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Upload via URL</h4>
            <div className="flex gap-2">
              <input
                type="text"
                value={evidenceUrl}
                onChange={(e) => setEvidenceUrl(e.target.value)}
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <Button 
                onClick={handleEvidenceUrlSubmit} 
                isLoading={uploadingEvidence}
                disabled={!evidenceUrl.trim()}
              >
                Upload
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              💡 Enter a direct image URL from cloud storage
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Upload from Device</h4>
            <div className="flex flex-wrap gap-4">
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
                  className="hidden"
                />
                <div className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                  Select Images
                </div>
              </label>
              {evidenceFiles.length > 0 && (
                <Button onClick={handleEvidenceFileUpload} isLoading={uploadingEvidence}>
                  Upload {evidenceFiles.length} Image(s)
                </Button>
              )}
            </div>
            {evidenceFiles.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">Selected files:</p>
                <ul className="mt-1 text-xs text-gray-500">
                  {evidenceFiles.map((file, idx) => (
                    <li key={idx}>📷 {file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF (Max 10MB per file)
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              💡 Tip: Upload before/after photos to show work completion.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TechnicianDashboard;





