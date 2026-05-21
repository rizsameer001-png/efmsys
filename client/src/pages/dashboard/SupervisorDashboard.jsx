// client/src/pages/dashboard/SupervisorDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SupervisorDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [pendingVerifications, setPendingVerifications] = useState([]);
//   const [teamStats, setTeamStats] = useState({
//     totalTechnicians: 8,
//     activeToday: 6,
//     completedTasks: 12,
//     pendingVerifications: 3
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const tasksRes = await taskApi.getTasks({ status: 'completed', limit: 10 });
//       setPendingVerifications(tasksRes.data.data?.tasks || []);
//     } catch (error) {
//       showToast('Failed to load data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//   };

//   const handleVerify = async (taskId, status) => {
//     try {
//       await taskApi.updateTask(taskId, { status: status === 'approve' ? 'verified' : 'rejected' });
//       showToast(`Task ${status === 'approve' ? 'approved' : 'rejected'}`, 'success');
//       fetchData();
//     } catch (error) {
//       showToast('Failed to update task', 'error');
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
//           <p className="text-gray-500 mt-1">Field operations and technician oversight</p>
//         </div>
//         <Button variant="danger" onClick={handleLogout} size="sm">
//           Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{teamStats.totalTechnicians}</p>
//           <p className="text-sm text-gray-500">Technicians</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{teamStats.activeToday}</p>
//           <p className="text-sm text-gray-500">Active Today</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{teamStats.completedTasks}</p>
//           <p className="text-sm text-gray-500">Completed Today</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-orange-600">{teamStats.pendingVerifications}</p>
//           <p className="text-sm text-gray-500">Pending Review</p>
//         </Card>
//       </div>

//       {/* Pending Verifications */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Pending Verifications</h3>
//         <div className="space-y-4">
//           {pendingVerifications.slice(0, 5).map(task => (
//             <div key={task._id} className="border rounded-lg p-4">
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="font-medium">{task.title}</p>
//                   <p className="text-sm text-gray-500">Task ID: {task.taskId}</p>
//                   <p className="text-sm text-gray-500">Technician: {task.assignment?.assignedToName}</p>
//                   <p className="text-xs text-gray-400">Completed: {task.timeline?.completedAt ? new Date(task.timeline.completedAt).toLocaleString() : 'N/A'}</p>
//                 </div>
//                 <div className="flex space-x-2">
//                   <Button size="sm" variant="success" onClick={() => handleVerify(task._id, 'approve')}>Approve</Button>
//                   <Button size="sm" variant="danger" onClick={() => handleVerify(task._id, 'reject')}>Reject</Button>
//                   <Link to={`/tasks/${task._id}`}>
//                     <Button size="sm" variant="secondary">View Details</Button>
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           ))}
//           {pendingVerifications.length === 0 && (
//             <p className="text-center text-gray-500 py-8">No pending verifications</p>
//           )}
//         </div>
//       </Card>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         <Link to="/tracking/live" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100">
//           <div className="text-2xl mb-1">📍</div>
//           <p className="text-sm font-medium">Live Tracking</p>
//         </Link>
//         <Link to="/tasks/board" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">📋</div>
//           <p className="text-sm font-medium">Task Board</p>
//         </Link>
//         <Link to="/sla/breached" className="bg-red-50 p-4 rounded-lg text-center hover:bg-red-100">
//           <div className="text-2xl mb-1">🚨</div>
//           <p className="text-sm font-medium">SLA Monitor</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SupervisorDashboard;

// // client/src/pages/dashboard/SupervisorDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const SupervisorDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [pendingVerifications, setPendingVerifications] = useState([]);
//   const [teamStats, setTeamStats] = useState({
//     totalTechnicians: 8,
//     activeToday: 6,
//     completedTasks: 12,
//     pendingVerifications: 3
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // 🔴 FIX: Fetch tasks with 'pending_review' status instead of 'completed'
//       const tasksRes = await taskApi.getTasks({ status: 'pending_review', limit: 10 });
      
//       let tasksData = [];
//       if (tasksRes.data && tasksRes.data.success) {
//         tasksData = tasksRes.data.data?.tasks || tasksRes.data.data || [];
//       }
      
//       setPendingVerifications(tasksData);
//       setTeamStats(prev => ({ ...prev, pendingVerifications: tasksData.length }));
//     } catch (error) {
//       console.error('Fetch data error:', error);
//       if (error.response?.status !== 403) {
//         showToast('Failed to load data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const handleVerify = async (taskId, action) => {
//     try {
//       const newStatus = action === 'approve' ? 'verified' : 'rejected';
//       await taskApi.updateTask(taskId, { status: newStatus });
//       showToast(`Task ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
//       fetchData(); // Refresh the list
//     } catch (error) {
//       console.error('Update task error:', error);
//       showToast(error.response?.data?.error || 'Failed to update task', 'error');
//     }
//   };

//   // 🔴 FIX: Get status badge color
//   const getStatusBadge = (status) => {
//     const statusMap = {
//       pending_review: 'bg-yellow-100 text-yellow-800',
//       completed: 'bg-green-100 text-green-800',
//       in_progress: 'bg-blue-100 text-blue-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
//     return statusMap[status] || statusMap.pending_review;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Field operations and technician oversight</p>
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
//           <p className="text-2xl font-bold text-blue-600">{teamStats.totalTechnicians}</p>
//           <p className="text-sm text-gray-500">Total Technicians</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{teamStats.activeToday}</p>
//           <p className="text-sm text-gray-500">Active Today</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-purple-600">{teamStats.completedTasks}</p>
//           <p className="text-sm text-gray-500">Completed Tasks</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-orange-600">{teamStats.pendingVerifications}</p>
//           <p className="text-sm text-gray-500">Pending Review</p>
//         </Card>
//       </div>

//       {/* Pending Verifications */}
//       <Card className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Pending Verifications</h3>
//           <Link to="/tasks?status=pending_review" className="text-sm text-blue-600 hover:text-blue-800">
//             View All →
//           </Link>
//         </div>
//         <div className="space-y-4">
//           {pendingVerifications.length > 0 ? (
//             pendingVerifications.slice(0, 5).map(task => (
//               <div key={task._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
//                 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2">
//                       <span className="text-lg">📋</span>
//                       <p className="font-medium text-gray-900">{task.title}</p>
//                     </div>
//                     <p className="text-sm text-gray-500 mt-1">Task ID: {task.taskId || task._id?.slice(-6)}</p>
//                     <p className="text-sm text-gray-500">
//                       Technician: {task.assignment?.assignedToName || 'Unassigned'}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-1">
//                       Completed: {task.timeline?.completedAt 
//                         ? new Date(task.timeline.completedAt).toLocaleString() 
//                         : 'N/A'}
//                     </p>
//                   </div>
//                   <div className="flex flex-wrap gap-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                       {task.status?.replace(/_/g, ' ') || 'Pending Review'}
//                     </span>
//                     <Button 
//                       size="sm" 
//                       variant="success" 
//                       onClick={() => handleVerify(task._id, 'approve')}
//                       className="whitespace-nowrap"
//                     >
//                       ✓ Approve
//                     </Button>
//                     <Button 
//                       size="sm" 
//                       variant="danger" 
//                       onClick={() => handleVerify(task._id, 'reject')}
//                       className="whitespace-nowrap"
//                     >
//                       ✗ Reject
//                     </Button>
//                     <Link to={`/tasks/${task._id}`}>
//                       <Button size="sm" variant="secondary" className="whitespace-nowrap">
//                         View Details
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <p className="text-gray-500">No pending verifications</p>
//               <p className="text-sm text-gray-400 mt-1">All tasks have been reviewed</p>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         <Link to="/tracking/live" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">📍</div>
//           <p className="text-sm font-medium">Live Tracking</p>
//         </Link>
//         <Link to="/tasks/board" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-2xl mb-1">📋</div>
//           <p className="text-sm font-medium">Task Board</p>
//         </Link>
//         <Link to="/sla/breached" className="bg-red-50 p-4 rounded-lg text-center hover:bg-red-100 transition-colors">
//           <div className="text-2xl mb-1">🚨</div>
//           <p className="text-sm font-medium">SLA Monitor</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SupervisorDashboard;





// client/src/pages/dashboard/SupervisorDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { userApi } from '../../api/user.api';
import { attendanceApi } from '../../api/attendance.api';
import { leaveApi } from '../../api/leave.api';
import { chatApi } from '../../api/chat.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const SupervisorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [apiErrors, setApiErrors] = useState({
    tasks: false,
    team: false,
    attendance: false,
    leave: false,
    chat: false
  });
  const [teamStats, setTeamStats] = useState({
    totalTechnicians: 0,
    activeToday: 0,
    onLeave: 0,
    completedTasks: 0,
    pendingVerifications: 0,
    inProgressTasks: 0,
    attendanceRate: 0,
    unreadMessages: 0,
    activeChats: 0
  });

  useEffect(() => {
    fetchData();
    // Refresh chat data every 30 seconds
    const interval = setInterval(() => fetchChatData(), 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    showToast('Logged out successfully', 'success');
  };

  // Safe fetch helper
  const safeFetch = async (apiCall, errorKey, fallback = null) => {
    try {
      const response = await apiCall();
      if (response?.data?.success) {
        return response.data.data;
      }
      return fallback;
    } catch (error) {
      console.error(`Failed to fetch ${errorKey}:`, error);
      
      // Don't mark as error for 403 or 404 (expected)
      if (error.response?.status !== 403 && error.response?.status !== 404) {
        setApiErrors(prev => ({ ...prev, [errorKey]: true }));
      }
      
      // Return mock data for development
      if (errorKey === 'attendance') {
        return { present: 6, absent: 2, onLeave: 1, rate: 75 };
      }
      if (errorKey === 'leave') {
        return { pending: 1, approved: 3, rejected: 0 };
      }
      if (errorKey === 'chat') {
        return { count: 0, unreadCount: 0 };
      }
      
      return fallback;
    }
  };

  // Fetch chat data
  const fetchChatData = async () => {
    try {
      // Get unread messages count
      const unreadData = await safeFetch(
        () => chatApi.getTotalUnreadCount(),
        'chat',
        { count: 0 }
      );
      
      // Get user's chats
      const chatsData = await safeFetch(
        () => chatApi.getUserChats(),
        'chat',
        []
      );
      
      // Calculate active chats
      const activeChats = Array.isArray(chatsData) 
        ? chatsData.filter(chat => {
            const lastMsg = chat.lastMessage?.timestamp;
            if (!lastMsg) return false;
            const hoursDiff = (Date.now() - new Date(lastMsg)) / (1000 * 60 * 60);
            return hoursDiff < 24;
          }).length
        : 0;
      
      // Get recent chats
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
      setTeamStats(prev => ({
        ...prev,
        unreadMessages: unreadData?.count || 0,
        activeChats: activeChats
      }));
      
    } catch (error) {
      console.error('Chat data fetch error:', error);
      setApiErrors(prev => ({ ...prev, chat: true }));
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setApiErrors({
      tasks: false,
      team: false,
      attendance: false,
      leave: false,
      chat: false
    });
    
    try {
      // Fetch pending verifications
      const tasksRes = await taskApi.getTasks({ status: 'pending_review', limit: 10 });
      let tasksData = [];
      if (tasksRes.data && tasksRes.data.success) {
        tasksData = tasksRes.data.data?.tasks || tasksRes.data.data || [];
      }
      setPendingVerifications(tasksData);
      
      // Fetch all tasks for statistics
      const allTasksRes = await taskApi.getTasks({ limit: 100 });
      let allTasks = [];
      if (allTasksRes.data && allTasksRes.data.success) {
        allTasks = allTasksRes.data.data?.tasks || allTasksRes.data.data || [];
      }
      
      const completedTasks = allTasks.filter(t => t.status === 'completed').length;
      const inProgressTasks = allTasks.filter(t => t.status === 'in_progress').length;
      
      // Fetch team members (technicians)
      let teamData = [];
      try {
        const teamRes = await userApi.getUsers({ role: 'technician', limit: 50 });
        if (teamRes.data?.success) {
          if (teamRes.data.data?.users) {
            teamData = teamRes.data.data.users;
          } else if (Array.isArray(teamRes.data.data)) {
            teamData = teamRes.data.data;
          }
        }
      } catch (teamError) {
        console.error('Error fetching team members:', teamError);
        if (teamError.response?.status !== 403) {
          setApiErrors(prev => ({ ...prev, team: true }));
        }
      }
      setTeamMembers(teamData.slice(0, 5));
      
      // Fetch attendance statistics
      const attendanceData = await safeFetch(
        () => attendanceApi.getDashboardStats(),
        'attendance',
        null
      );
      
      // Fetch leave statistics
      const leaveData = await safeFetch(
        () => leaveApi.getLeaveStats(),
        'leave',
        null
      );
      
      // Fetch chat data
      await fetchChatData();
      
      setTeamStats(prev => ({
        ...prev,
        totalTechnicians: teamData.length,
        activeToday: attendanceData?.present || Math.floor(teamData.length * 0.75) || 0,
        onLeave: attendanceData?.onLeave || 0,
        completedTasks: completedTasks,
        pendingVerifications: tasksData.length,
        inProgressTasks: inProgressTasks,
        attendanceRate: attendanceData?.rate || 75
      }));
      
    } catch (error) {
      console.error('Fetch data error:', error);
      if (error.response?.status !== 403) {
        showToast('Failed to load data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (taskId, action) => {
    try {
      const newStatus = action === 'approve' ? 'verified' : 'rejected';
      await taskApi.updateTask(taskId, { status: newStatus });
      showToast(`Task ${action === 'approve' ? 'approved' : 'rejected'} successfully`, 'success');
      fetchData(); // Refresh the list
    } catch (error) {
      console.error('Update task error:', error);
      showToast(error.response?.data?.error || 'Failed to update task', 'error');
    }
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pending_review: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return statusMap[status] || statusMap.pending_review;
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

  // Show warning banner if there are API errors
  const hasApiErrors = Object.values(apiErrors).some(error => error === true);
  const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* API Error Warning Banner */}
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
                onClick={fetchData}
                className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
              >
                Retry loading data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header with Logout and Chat Notification */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Field operations and technician oversight</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Chat Notification Badge */}
          <Link to="/chat" className="relative">
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
              <span className="text-xl">💬</span>
            </div>
            {teamStats.unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {teamStats.unreadMessages > 9 ? '9+' : teamStats.unreadMessages}
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

      {/* Stats Grid - 7 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">{teamStats.totalTechnicians}</p>
          <p className="text-sm text-gray-500">Total Technicians</p>
          <Link to="/users?role=technician" className="text-xs text-blue-600 mt-1 block hover:underline">View all →</Link>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{teamStats.activeToday}</p>
          <p className="text-sm text-gray-500">Active Today</p>
          <p className="text-xs text-gray-400 mt-1">{teamStats.onLeave} on leave</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">{teamStats.completedTasks}</p>
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <p className="text-xs text-gray-500 mt-1">This period</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-orange-600">{teamStats.pendingVerifications}</p>
          <p className="text-sm text-gray-500">Pending Review</p>
          {teamStats.inProgressTasks > 0 && (
            <p className="text-xs text-blue-600 mt-1">{teamStats.inProgressTasks} in progress</p>
          )}
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-cyan-600">{teamStats.attendanceRate}%</p>
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <Link to="/attendance/report" className="text-xs text-blue-600 mt-1 block hover:underline">Details →</Link>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-indigo-600">{teamStats.unreadMessages}</p>
          <p className="text-sm text-gray-500">Unread Messages</p>
          {teamStats.activeChats > 0 && (
            <p className="text-xs text-green-600 mt-1">{teamStats.activeChats} active chats</p>
          )}
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-yellow-600">{teamStats.onLeave}</p>
          <p className="text-sm text-gray-500">On Leave</p>
          <Link to="/leave/team-calendar" className="text-xs text-blue-600 mt-1 block hover:underline">View Calendar →</Link>
        </Card>
      </div>

      {/* Main Content Grid - Pending Verifications and Recent Chats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Verifications */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-gray-900">Pending Verifications</h3>
              <Link to="/tasks?status=pending_review" className="text-sm text-blue-600 hover:text-blue-800">
                View All →
              </Link>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {pendingVerifications.length > 0 ? (
                pendingVerifications.slice(0, 5).map(task => (
                  <div key={task._id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">📋</span>
                          <p className="font-medium text-gray-900">{task.title}</p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Task ID: {task.taskId || task._id?.slice(-6)}</p>
                        <p className="text-sm text-gray-500">
                          Technician: {task.assignment?.assignedToName || 'Unassigned'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Completed: {task.timeline?.completedAt 
                            ? new Date(task.timeline.completedAt).toLocaleString() 
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
                          {task.status?.replace(/_/g, ' ') || 'Pending Review'}
                        </span>
                        <Button 
                          size="sm" 
                          variant="success" 
                          onClick={() => handleVerify(task._id, 'approve')}
                          className="whitespace-nowrap"
                        >
                          ✓ Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="danger" 
                          onClick={() => handleVerify(task._id, 'reject')}
                          className="whitespace-nowrap"
                        >
                          ✗ Reject
                        </Button>
                        <Link to={`/tasks/${task._id}`}>
                          <Button size="sm" variant="secondary" className="whitespace-nowrap">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">No pending verifications</p>
                  <p className="text-sm text-gray-400 mt-1">All tasks have been reviewed</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Recent Chats */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
            <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
              Open Chat <span>→</span>
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
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-gray-500">No conversations yet</p>
                <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 mt-2 inline-block">
                  Start a chat
                </Link>
              </div>
            )}
          </div>
          {teamStats.unreadMessages > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
                You have {teamStats.unreadMessages} unread message{teamStats.unreadMessages !== 1 ? 's' : ''} →
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Team Members */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <Link to="/users?role=technician" className="text-sm text-blue-600 hover:text-blue-800">Manage Team →</Link>
        </div>
        <div className="overflow-x-auto">
          {teamMembers.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {teamMembers.map(member => (
                  <tr key={member._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-gray-600">
                            {member.firstName?.[0]}{member.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {member.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {member.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {member.currentTasks || 0} active
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <Link 
                          to={`/tasks/new?assignTo=${member._id}`} 
                          className="text-green-600 hover:text-green-800"
                          title="Assign Task"
                        >
                          📋
                        </Link>
                        <Link 
                          to={`/chat?user=${member._id}`} 
                          className="text-cyan-600 hover:text-cyan-800"
                          title="Send Message"
                        >
                          💬
                        </Link>
                        <Link 
                          to={`/tracking/live?userId=${member._id}`} 
                          className="text-blue-600 hover:text-blue-800"
                          title="Live Tracking"
                        >
                          📍
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <p className="text-gray-500 mb-2">No technicians found in your team</p>
              <p className="text-sm text-gray-400 mb-4">Contact admin to add technicians</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Link to="/tracking/live" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-xl mb-1">📍</div>
          <p className="text-xs font-medium">Live Tracking</p>
        </Link>
        <Link to="/tasks/board" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
          <div className="text-xl mb-1">📋</div>
          <p className="text-xs font-medium">Task Board</p>
        </Link>
        <Link to="/sla/breached" className="bg-red-50 p-3 rounded-lg text-center hover:bg-red-100 transition-colors">
          <div className="text-xl mb-1">🚨</div>
          <p className="text-xs font-medium">SLA Monitor</p>
        </Link>
        <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
          <div className="text-xl mb-1">💬</div>
          <p className="text-xs font-medium">Team Chat</p>
        </Link>
        <Link to="/attendance/report" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
          <div className="text-xl mb-1">📊</div>
          <p className="text-xs font-medium">Attendance</p>
        </Link>
        <Link to="/leave/team-calendar" className="bg-yellow-50 p-3 rounded-lg text-center hover:bg-yellow-100 transition-colors">
          <div className="text-xl mb-1">📅</div>
          <p className="text-xs font-medium">Leave Calendar</p>
        </Link>
      </div>
    </div>
  );
};

export default SupervisorDashboard;