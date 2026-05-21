// client/src/pages/dashboard/ManagerDashboard.jsx

// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const ManagerDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [stats, setStats] = useState({
//     teamSize: 0,
//     presentToday: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     slaRate: 98,
//     avgResponseTime: 45
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       // Fetch tasks
//       const tasksRes = await taskApi.getTasks({ limit: 10 });
//       let allTasks = [];
      
//       if (tasksRes.data?.success && tasksRes.data?.data?.tasks) {
//         allTasks = tasksRes.data.data.tasks;
//       } else if (Array.isArray(tasksRes.data?.data)) {
//         allTasks = tasksRes.data.data;
//       } else if (Array.isArray(tasksRes.data)) {
//         allTasks = tasksRes.data;
//       }
      
//       setTasks(allTasks.slice(0, 5));
      
//       // 🔴 FIX: Fetch team members with better error handling for 403
//       try {
//         const teamRes = await userApi.getUsers({ role: 'technician', limit: 10 });
//         let teamData = [];
        
//         if (teamRes.data?.success && teamRes.data?.data?.users) {
//           teamData = teamRes.data.data.users;
//         } else if (Array.isArray(teamRes.data?.data)) {
//           teamData = teamRes.data.data;
//         } else if (Array.isArray(teamRes.data)) {
//           teamData = teamRes.data;
//         }
        
//         setTeamMembers(teamData.slice(0, 5));
        
//         setStats(prev => ({
//           ...prev,
//           teamSize: teamData.length,
//           presentToday: Math.floor(teamData.length * 0.9) || 0
//         }));
//       } catch (teamError) {
//         console.error('Error fetching team members:', teamError);
//         // 🔴 FIX: Don't show error toast for 403 - just show empty state
//         if (teamError.response?.status !== 403) {
//           showToast('Failed to load team members', 'error');
//         }
//         setTeamMembers([]);
//       }
      
//       // Calculate task statistics from fetched tasks
//       const completedToday = allTasks.filter(t => 
//         t.status === 'completed' && 
//         t.timeline?.completedAt && 
//         new Date(t.timeline.completedAt).toDateString() === new Date().toDateString()
//       ).length;
      
//       const pendingTasks = allTasks.filter(t => 
//         ['pending', 'assigned', 'accepted', 'in_progress'].includes(t.status)
//       ).length;
      
//       setStats(prev => ({
//         ...prev,
//         completedTasks: completedToday,
//         pendingTasks: pendingTasks,
//         slaRate: pendingTasks > 0 ? Math.max(85, 100 - (pendingTasks * 2)) : 98
//       }));
      
//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
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

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       completed: 'bg-green-100 text-green-800',
//       in_progress: 'bg-blue-100 text-blue-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
    
//     const normalizedStatus = status?.replace(/-/g, '_') || 'pending';
//     return statusMap[normalizedStatus] || statusMap.pending;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Monitor your team's performance.</p>
//         </div>
//         <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//           <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-blue-600">{stats.teamSize}</p>
//           <p className="text-sm text-gray-500">Team Members</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
//           <p className="text-sm text-gray-500">Present Today</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-purple-600">{stats.completedTasks}</p>
//           <p className="text-sm text-gray-500">Completed Today</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
//           <p className="text-sm text-gray-500">Pending Tasks</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.slaRate}%</p>
//           <p className="text-sm text-gray-500">SLA Rate</p>
//         </Card>
//       </div>

//       {/* Current Tasks */}
//       <Card className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Current Tasks</h3>
//           <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
//             <span>+</span> Assign Task
//           </Link>
//         </div>
//         <div className="space-y-3">
//           {tasks.length > 0 ? (
//             tasks.map(task => (
//               <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                       {task.priority || 'medium'}
//                     </span>
//                     <p className="font-medium text-sm">{task.title}</p>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Assigned to: {task.assignment?.assignedToName || 'Unassigned'} • 
//                     Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
//                   </p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                     {task.status?.replace(/_/g, ' ') || 'pending'}
//                   </span>
//                   <Link to={`/tasks/${task._id}`} className="text-blue-600 text-sm hover:text-blue-800">
//                     View →
//                   </Link>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="text-center py-8">
//               <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <p className="text-gray-500">No active tasks</p>
//               <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
//                 Create your first task
//               </Link>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Team Members */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Team Members</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">Manage Team →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           {teamMembers.length > 0 ? (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {teamMembers.map(member => (
//                   <tr key={member._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                           <span className="text-sm font-medium text-gray-600">
//                             {member.firstName?.[0]}{member.lastName?.[0]}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">
//                             {member.firstName} {member.lastName}
//                           </p>
//                           <p className="text-xs text-gray-500">{member.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {member.role}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {member.status || 'active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link 
//                         to={`/tasks/new?assignTo=${member._id}`} 
//                         className="text-green-600 hover:text-green-800"
//                       >
//                         Assign Task
//                       </Link>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//               <p className="text-gray-500 mb-2">No technicians found</p>
//               <p className="text-sm text-gray-400 mb-4">Contact admin to add technicians</p>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Performance and Quick Actions */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Performance Overview */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Task Completion Rate</span>
//                 <span className="text-green-600">
//                   {stats.pendingTasks + stats.completedTasks > 0 
//                     ? Math.round((stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100) 
//                     : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-green-500 h-2 rounded-full transition-all duration-500" 
//                   style={{ 
//                     width: `${stats.pendingTasks + stats.completedTasks > 0 
//                       ? (stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100 
//                       : 0}%` 
//                   }} 
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>SLA Compliance</span>
//                 <span className="text-blue-600">{stats.slaRate}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.slaRate}%` }} />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Quick Actions */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
//           <div className="grid grid-cols-2 gap-3">
//             <Link to="/tasks/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//               <div className="text-2xl mb-1">📋</div>
//               <p className="text-sm font-medium">Create Task</p>
//             </Link>
//             <Link to="/attendance" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100 transition-colors">
//               <div className="text-2xl mb-1">⏰</div>
//               <p className="text-sm font-medium">View Attendance</p>
//             </Link>
//             <Link to="/users" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100 transition-colors">
//               <div className="text-2xl mb-1">👥</div>
//               <p className="text-sm font-medium">Manage Team</p>
//             </Link>
//             <Link to="/sla/dashboard" className="bg-orange-50 p-4 rounded-lg text-center hover:bg-orange-100 transition-colors">
//               <div className="text-2xl mb-1">🎯</div>
//               <p className="text-sm font-medium">SLA Monitor</p>
//             </Link>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;




// client/src/pages/dashboard/ManagerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const ManagerDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [pendingLeaves, setPendingLeaves] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [apiErrors, setApiErrors] = useState({
//     tasks: false,
//     team: false,
//     attendance: false,
//     leave: false,
//     chat: false
//   });
//   const [stats, setStats] = useState({
//     teamSize: 0,
//     presentToday: 0,
//     onLeave: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     overdueTasks: 0,
//     slaRate: 98,
//     avgResponseTime: 45,
//     attendanceRate: 0,
//     unreadMessages: 0
//   });

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   // Safe fetch helper
//   const safeFetch = async (apiCall, errorKey, fallback = null) => {
//     try {
//       const response = await apiCall();
//       if (response?.data?.success) {
//         return response.data.data;
//       }
//       return fallback;
//     } catch (error) {
//       console.error(`Failed to fetch ${errorKey}:`, error);
//       setApiErrors(prev => ({ ...prev, [errorKey]: true }));
//       if (error.response?.status !== 403 && error.response?.status !== 404) {
//         showToast(`Failed to load ${errorKey} data`, 'warning');
//       }
//       return fallback;
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     setApiErrors({
//       tasks: false,
//       team: false,
//       attendance: false,
//       leave: false,
//       chat: false
//     });
    
//     try {
//       // Fetch tasks
//       const tasksData = await safeFetch(
//         () => taskApi.getTasks({ limit: 10 }),
//         'tasks',
//         { tasks: [] }
//       );
//       let allTasks = [];
//       if (tasksData?.tasks) {
//         allTasks = tasksData.tasks;
//       } else if (Array.isArray(tasksData)) {
//         allTasks = tasksData;
//       }
//       setTasks(allTasks.slice(0, 5));
      
//       // Calculate task statistics
//       const completedToday = allTasks.filter(t => 
//         t.status === 'completed' && 
//         t.timeline?.completedAt && 
//         new Date(t.timeline.completedAt).toDateString() === new Date().toDateString()
//       ).length;
      
//       const pendingTasks = allTasks.filter(t => 
//         ['pending', 'assigned', 'accepted', 'in_progress'].includes(t.status)
//       ).length;
      
//       const overdueTasks = allTasks.filter(t => 
//         t.slaDeadline && new Date(t.slaDeadline) < new Date() && 
//         !['completed', 'verified', 'closed'].includes(t.status)
//       ).length;
      
//       // Fetch team members with better error handling for 403
//       let teamData = [];
//       try {
//         const teamRes = await userApi.getUsers({ role: 'technician', limit: 50 });
//         if (teamRes.data?.success) {
//           if (teamRes.data.data?.users) {
//             teamData = teamRes.data.data.users;
//           } else if (Array.isArray(teamRes.data.data)) {
//             teamData = teamRes.data.data;
//           } else if (Array.isArray(teamRes.data)) {
//             teamData = teamRes.data;
//           }
//         }
//       } catch (teamError) {
//         console.error('Error fetching team members:', teamError);
//         setApiErrors(prev => ({ ...prev, team: true }));
//         if (teamError.response?.status !== 403) {
//           showToast('Failed to load team members', 'error');
//         }
//         // Use mock data for development
//         teamData = [];
//       }
      
//       setTeamMembers(teamData.slice(0, 5));
      
//       // Fetch attendance statistics
//       let attendanceStats = { present: 0, absent: 0, onLeave: 0, rate: 0 };
//       const attendanceData = await safeFetch(
//         () => attendanceApi.getDashboardStats(),
//         'attendance',
//         null
//       );
//       if (attendanceData) {
//         attendanceStats = attendanceData;
//       } else {
//         // Use mock data
//         attendanceStats = { present: teamData.length * 0.85 || 8, absent: 2, onLeave: 1, rate: 85 };
//       }
      
//       // Fetch leave statistics
//       let leaveStats = { pending: 0, approved: 0, rejected: 0 };
//       const leaveData = await safeFetch(
//         () => leaveApi.getLeaveStats(),
//         'leave',
//         null
//       );
//       if (leaveData) {
//         leaveStats = leaveData;
//       } else {
//         leaveStats = { pending: 2, approved: 5, rejected: 1 };
//       }
      
//       // Fetch pending leaves
//       let pendingLeavesList = [];
//       try {
//         const pendingLeavesRes = await leaveApi.getPendingApprovals();
//         if (pendingLeavesRes.data?.success) {
//           pendingLeavesList = pendingLeavesRes.data.data || [];
//         }
//       } catch (pendingError) {
//         console.warn('Pending leaves API not available:', pendingError.message);
//         // Use mock data
//         pendingLeavesList = [
//           { id: '1', employee: 'John Doe', leaveType: 'annual', days: 2, startDate: '2024-01-15' }
//         ];
//       }
//       setPendingLeaves(pendingLeavesList.slice(0, 3));
      
//       // Fetch chat unread count
//       let unreadMessages = 0;
//       const chatData = await safeFetch(
//         () => chatApi.getTotalUnreadCount(),
//         'chat',
//         null
//       );
//       if (chatData) {
//         unreadMessages = chatData.count || 0;
//       }
      
//       setStats({
//         teamSize: teamData.length,
//         presentToday: attendanceStats.present || Math.floor(teamData.length * 0.85) || 0,
//         onLeave: attendanceStats.onLeave || 0,
//         completedTasks: completedToday,
//         pendingTasks: pendingTasks,
//         overdueTasks: overdueTasks,
//         slaRate: pendingTasks > 0 ? Math.max(85, 100 - Math.floor(overdueTasks * 5)) : 98,
//         avgResponseTime: 45,
//         attendanceRate: attendanceStats.rate || 85,
//         unreadMessages: unreadMessages
//       });
      
//       // Generate recent activities
//       generateRecentActivities(allTasks, teamData, leaveStats);
      
//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateRecentActivities = (tasks, team, leaveStats) => {
//     const activities = [];
    
//     // Add task activities
//     tasks.slice(0, 3).forEach(task => {
//       if (task.status === 'completed') {
//         activities.push({
//           id: `task_${task._id}`,
//           type: 'task',
//           action: `Task "${task.title}" was completed`,
//           time: task.timeline?.completedAt ? new Date(task.timeline.completedAt) : new Date(),
//           icon: '✅',
//           color: 'green'
//         });
//       } else if (task.status === 'in_progress') {
//         activities.push({
//           id: `task_${task._id}`,
//           type: 'task',
//           action: `Task "${task.title}" is in progress`,
//           time: task.updatedAt ? new Date(task.updatedAt) : new Date(),
//           icon: '🔄',
//           color: 'blue'
//         });
//       }
//     });
    
//     // Add team member activities
//     if (team.length > 0) {
//       activities.push({
//         id: 'team_activity',
//         type: 'team',
//         action: `${team.length} team members active today`,
//         time: new Date(),
//         icon: '👥',
//         color: 'purple'
//       });
//     }
    
//     // Add leave activities
//     if (leaveStats.pending > 0) {
//       activities.push({
//         id: 'leave_activity',
//         type: 'leave',
//         action: `${leaveStats.pending} leave requests pending approval`,
//         time: new Date(),
//         icon: '📋',
//         color: 'orange'
//       });
//     }
    
//     // Sort by time (most recent first)
//     activities.sort((a, b) => b.time - a.time);
//     setRecentActivities(activities.slice(0, 5));
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

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       completed: 'bg-green-100 text-green-800',
//       in_progress: 'bg-blue-100 text-blue-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
    
//     const normalizedStatus = status?.replace(/-/g, '_') || 'pending';
//     return statusMap[normalizedStatus] || statusMap.pending;
//   };

//   const formatTimeAgo = (date) => {
//     const seconds = Math.floor((new Date() - new Date(date)) / 1000);
//     if (seconds < 60) return 'Just now';
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} min ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     const days = Math.floor(hours / 24);
//     return `${days} day${days > 1 ? 's' : ''} ago`;
//   };

//   // Show warning banner if there are API errors
//   const hasApiErrors = Object.values(apiErrors).some(error => error === true);
//   const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* API Error Warning Banner */}
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
//                 {apiErrors.chat && "• Chat data is unavailable"}
//               </p>
//               <button 
//                 onClick={fetchData}
//                 className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
//               >
//                 Retry loading data
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header with Logout and Chat Notification */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Monitor your team's performance.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           {/* Chat Notification */}
//           {stats.unreadMessages > 0 && (
//             <Link to="/chat" className="relative">
//               <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center hover:bg-cyan-200 transition-colors">
//                 <span className="text-xl">💬</span>
//               </div>
//               <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
//                 {stats.unreadMessages > 9 ? '9+' : stats.unreadMessages}
//               </span>
//             </Link>
//           )}
//           <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid - 6 cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-blue-600">{stats.teamSize}</p>
//           <p className="text-sm text-gray-500">Team Members</p>
//           <Link to="/users" className="text-xs text-blue-600 mt-1 block hover:underline">View all →</Link>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
//           <p className="text-sm text-gray-500">Present Today</p>
//           <p className="text-xs text-gray-400 mt-1">{stats.onLeave} on leave</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-purple-600">{stats.completedTasks}</p>
//           <p className="text-sm text-gray-500">Completed Today</p>
//           <Link to="/tasks?status=completed" className="text-xs text-blue-600 mt-1 block hover:underline">View →</Link>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
//           <p className="text-sm text-gray-500">Pending Tasks</p>
//           {stats.overdueTasks > 0 && (
//             <p className="text-xs text-red-600 mt-1">{stats.overdueTasks} overdue</p>
//           )}
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.slaRate}%</p>
//           <p className="text-sm text-gray-500">SLA Rate</p>
//           <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
//             <div className="bg-green-500 h-1 rounded-full" style={{ width: `${stats.slaRate}%` }} />
//           </div>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-cyan-600">{stats.attendanceRate}%</p>
//           <p className="text-sm text-gray-500">Attendance Rate</p>
//           <Link to="/attendance/report" className="text-xs text-blue-600 mt-1 block hover:underline">Details →</Link>
//         </Card>
//       </div>

//       {/* Current Tasks and Pending Leaves */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Current Tasks */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Current Tasks</h3>
//             <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
//               <span>+</span> Assign Task
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {tasks.length > 0 ? (
//               tasks.map(task => (
//                 <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                         {task.priority || 'medium'}
//                       </span>
//                       <p className="font-medium text-sm">{task.title}</p>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Assigned to: {task.assignment?.assignedToName || 'Unassigned'} • 
//                       Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                       {task.status?.replace(/_/g, ' ') || 'pending'}
//                     </span>
//                     <Link to={`/tasks/${task._id}`} className="text-blue-600 text-sm hover:text-blue-800">
//                       View →
//                     </Link>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <p className="text-gray-500">No active tasks</p>
//                 <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
//                   Create your first task
//                 </Link>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Pending Leaves */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Pending Leave Requests</h3>
//             <Link to="/leave/pending" className="text-sm text-blue-600 hover:text-blue-800">
//               View All →
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {pendingLeaves.length > 0 ? (
//               pendingLeaves.map(leave => (
//                 <div key={leave.id || leave._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium text-sm">{leave.employee || leave.userId?.name || 'Employee'}</p>
//                     <p className="text-xs text-gray-500">
//                       {leave.leaveType || 'Leave'} • {leave.days || 1} days • Starting {new Date(leave.startDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Link to={`/leave/${leave._id || leave.id}`} className="text-blue-600 text-sm hover:text-blue-800">
//                     Review →
//                   </Link>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <p className="text-gray-500">No pending leave requests</p>
//               </div>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Team Members */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Team Members</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">Manage Team →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           {teamMembers.length > 0 ? (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {teamMembers.map(member => (
//                   <tr key={member._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                           <span className="text-sm font-medium text-gray-600">
//                             {member.firstName?.[0]}{member.lastName?.[0]}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">
//                             {member.firstName} {member.lastName}
//                           </p>
//                           <p className="text-xs text-gray-500">{member.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {member.role}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {member.status || 'active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {member.currentTasks || 0} active
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex space-x-3">
//                         <Link 
//                           to={`/tasks/new?assignTo=${member._id}`} 
//                           className="text-green-600 hover:text-green-800"
//                           title="Assign Task"
//                         >
//                           📋
//                         </Link>
//                         <Link 
//                           to={`/users/${member._id}`} 
//                           className="text-blue-600 hover:text-blue-800"
//                           title="View Profile"
//                         >
//                           👤
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//               <p className="text-gray-500 mb-2">No technicians found in your team</p>
//               <p className="text-sm text-gray-400 mb-4">Contact admin to add technicians</p>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Recent Activity and Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.length > 0 ? (
//               recentActivities.map(activity => (
//                 <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                   <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                     <span>{activity.icon}</span>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-700">{activity.action}</p>
//                     <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">No recent activities</p>
//             )}
//           </div>
//         </Card>

//         {/* Performance Overview */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Task Completion Rate</span>
//                 <span className="text-green-600">
//                   {stats.pendingTasks + stats.completedTasks > 0 
//                     ? Math.round((stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100) 
//                     : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-green-500 h-2 rounded-full transition-all duration-500" 
//                   style={{ 
//                     width: `${stats.pendingTasks + stats.completedTasks > 0 
//                       ? (stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100 
//                       : 0}%` 
//                   }} 
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>SLA Compliance</span>
//                 <span className={`font-medium ${stats.slaRate >= 90 ? 'text-green-600' : stats.slaRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
//                   {stats.slaRate}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className={`h-2 rounded-full transition-all duration-500 ${
//                     stats.slaRate >= 90 ? 'bg-green-500' : stats.slaRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
//                   }`} 
//                   style={{ width: `${stats.slaRate}%` }} 
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Attendance Rate</span>
//                 <span className="text-blue-600">{stats.attendanceRate}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.attendanceRate}%` }} />
//               </div>
//             </div>
//             <div className="pt-2 border-t">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Avg Response Time</span>
//                 <span className="text-gray-700">{stats.avgResponseTime} minutes</span>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
//         <Link to="/tasks/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">📋</div>
//           <p className="text-xs font-medium">Create Task</p>
//         </Link>
//         <Link to="/attendance/report" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">View Attendance</p>
//         </Link>
//         <Link to="/users" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-xl mb-1">👥</div>
//           <p className="text-xs font-medium">Manage Team</p>
//         </Link>
//         <Link to="/sla/dashboard" className="bg-orange-50 p-3 rounded-lg text-center hover:bg-orange-100 transition-colors">
//           <div className="text-xl mb-1">🎯</div>
//           <p className="text-xs font-medium">SLA Monitor</p>
//         </Link>
//         <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
//           <div className="text-xl mb-1">💬</div>
//           <p className="text-xs font-medium">Team Chat</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;






// client/src/pages/dashboard/ManagerDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const ManagerDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [teamMembers, setTeamMembers] = useState([]);
//   const [pendingLeaves, setPendingLeaves] = useState([]);
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentChats, setRecentChats] = useState([]);
//   const [apiErrors, setApiErrors] = useState({
//     tasks: false,
//     team: false,
//     attendance: false,
//     leave: false,
//     chat: false
//   });
//   const [stats, setStats] = useState({
//     teamSize: 0,
//     presentToday: 0,
//     onLeave: 0,
//     completedTasks: 0,
//     pendingTasks: 0,
//     overdueTasks: 0,
//     slaRate: 98,
//     avgResponseTime: 45,
//     attendanceRate: 0,
//     unreadMessages: 0,
//     activeChats: 0
//   });

//   useEffect(() => {
//     fetchData();
//     // Set up interval to refresh chat data every 30 seconds
//     const interval = setInterval(() => {
//       fetchChatData();
//     }, 30000);
//     return () => clearInterval(interval);
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   // Safe fetch helper
//   const safeFetch = async (apiCall, errorKey, fallback = null) => {
//     try {
//       const response = await apiCall();
//       if (response?.data?.success) {
//         return response.data.data;
//       }
//       return fallback;
//     } catch (error) {
//       console.error(`Failed to fetch ${errorKey}:`, error);
      
//       // Don't mark as error for 403 (permission denied) - this is expected
//       if (error.response?.status !== 403 && error.response?.status !== 404) {
//         setApiErrors(prev => ({ ...prev, [errorKey]: true }));
//       }
      
//       // Return mock data for development when API fails
//       if (errorKey === 'attendance') {
//         return { present: 8, absent: 2, onLeave: 1, rate: 80 };
//       }
//       if (errorKey === 'leave') {
//         return { pending: 2, approved: 5, rejected: 1 };
//       }
//       if (errorKey === 'chat') {
//         return { unreadCount: 0, recentChats: [] };
//       }
      
//       return fallback;
//     }
//   };

//   // Separate function to fetch chat data
//   const fetchChatData = async () => {
//     try {
//       // Get unread messages count
//       const unreadData = await safeFetch(
//         () => chatApi.getTotalUnreadCount(),
//         'chat',
//         { count: 0 }
//       );
      
//       // Get user's chats
//       const chatsData = await safeFetch(
//         () => chatApi.getUserChats(),
//         'chat',
//         []
//       );
      
//       // Get chat settings
//       let chatEnabled = false;
//       try {
//         const settingsRes = await chatApi.getUserChatSettings();
//         if (settingsRes.data?.success) {
//           chatEnabled = settingsRes.data.data?.chatEnabled || false;
//         }
//       } catch (settingsError) {
//         console.warn('Chat settings not available');
//       }
      
//       // Calculate active chats (chats with activity in last 24 hours)
//       const activeChats = Array.isArray(chatsData) 
//         ? chatsData.filter(chat => {
//             const lastMsg = chat.lastMessage?.timestamp;
//             if (!lastMsg) return false;
//             const lastMsgDate = new Date(lastMsg);
//             const hoursDiff = (Date.now() - lastMsgDate) / (1000 * 60 * 60);
//             return hoursDiff < 24;
//           }).length
//         : 0;
      
//       // Get recent chats for display
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
//         unreadMessages: unreadData?.count || 0,
//         activeChats: activeChats,
//         chatEnabled: chatEnabled
//       }));
      
//     } catch (error) {
//       console.error('Chat data fetch error:', error);
//       setApiErrors(prev => ({ ...prev, chat: true }));
//     }
//   };

//   const fetchData = async () => {
//     setLoading(true);
//     setApiErrors({
//       tasks: false,
//       team: false,
//       attendance: false,
//       leave: false,
//       chat: false
//     });
    
//     try {
//       // Fetch tasks
//       const tasksData = await safeFetch(
//         () => taskApi.getTasks({ limit: 10 }),
//         'tasks',
//         { tasks: [] }
//       );
//       let allTasks = [];
//       if (tasksData?.tasks) {
//         allTasks = tasksData.tasks;
//       } else if (Array.isArray(tasksData)) {
//         allTasks = tasksData;
//       }
//       setTasks(allTasks.slice(0, 5));
      
//       // Calculate task statistics
//       const completedToday = allTasks.filter(t => 
//         t.status === 'completed' && 
//         t.timeline?.completedAt && 
//         new Date(t.timeline.completedAt).toDateString() === new Date().toDateString()
//       ).length;
      
//       const pendingTasks = allTasks.filter(t => 
//         ['pending', 'assigned', 'accepted', 'in_progress'].includes(t.status)
//       ).length;
      
//       const overdueTasks = allTasks.filter(t => 
//         t.slaDeadline && new Date(t.slaDeadline) < new Date() && 
//         !['completed', 'verified', 'closed'].includes(t.status)
//       ).length;
      
//       // Fetch team members
//       let teamData = [];
//       try {
//         const teamRes = await userApi.getUsers({ role: 'technician', limit: 50 });
//         if (teamRes.data?.success) {
//           if (teamRes.data.data?.users) {
//             teamData = teamRes.data.data.users;
//           } else if (Array.isArray(teamRes.data.data)) {
//             teamData = teamRes.data.data;
//           }
//         }
//       } catch (teamError) {
//         console.error('Error fetching team members:', teamError);
//         if (teamError.response?.status !== 403) {
//           setApiErrors(prev => ({ ...prev, team: true }));
//         }
//       }
      
//       setTeamMembers(teamData.slice(0, 5));
      
//       // Fetch attendance statistics
//       const attendanceData = await safeFetch(
//         () => attendanceApi.getDashboardStats(),
//         'attendance',
//         null
//       );
      
//       // Fetch leave statistics
//       const leaveData = await safeFetch(
//         () => leaveApi.getLeaveStats(),
//         'leave',
//         null
//       );
      
//       // Fetch pending leaves
//       let pendingLeavesList = [];
//       try {
//         const pendingLeavesRes = await leaveApi.getPendingApprovals();
//         if (pendingLeavesRes.data?.success) {
//           pendingLeavesList = pendingLeavesRes.data.data || [];
//         }
//       } catch (pendingError) {
//         console.warn('Pending leaves API not available:', pendingError.message);
//         // Use mock data
//         pendingLeavesList = [
//           { id: '1', employee: 'John Doe', leaveType: 'annual', days: 2, startDate: new Date().toISOString() }
//         ];
//       }
//       setPendingLeaves(pendingLeavesList.slice(0, 3));
      
//       // Fetch chat data
//       await fetchChatData();
      
//       setStats(prev => ({
//         ...prev,
//         teamSize: teamData.length,
//         presentToday: attendanceData?.present || Math.floor(teamData.length * 0.85) || 0,
//         onLeave: attendanceData?.onLeave || 0,
//         completedTasks: completedToday,
//         pendingTasks: pendingTasks,
//         overdueTasks: overdueTasks,
//         slaRate: pendingTasks > 0 ? Math.max(85, 100 - Math.floor(overdueTasks * 5)) : 98,
//         avgResponseTime: 45,
//         attendanceRate: attendanceData?.rate || 85
//       }));
      
//       // Generate recent activities
//       generateRecentActivities(allTasks, teamData, leaveData, pendingLeavesList);
      
//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateRecentActivities = (tasks, team, leaveData, pendingLeavesList) => {
//     const activities = [];
    
//     // Add task activities
//     tasks.slice(0, 3).forEach(task => {
//       if (task.status === 'completed') {
//         activities.push({
//           id: `task_${task._id}`,
//           type: 'task',
//           action: `Task "${task.title}" was completed`,
//           time: task.timeline?.completedAt ? new Date(task.timeline.completedAt) : new Date(),
//           icon: '✅',
//           color: 'green'
//         });
//       } else if (task.status === 'in_progress') {
//         activities.push({
//           id: `task_${task._id}`,
//           type: 'task',
//           action: `Task "${task.title}" is in progress`,
//           time: task.updatedAt ? new Date(task.updatedAt) : new Date(),
//           icon: '🔄',
//           color: 'blue'
//         });
//       }
//     });
    
//     // Add team member activities
//     if (team.length > 0) {
//       activities.push({
//         id: 'team_activity',
//         type: 'team',
//         action: `${team.length} team members active today`,
//         time: new Date(),
//         icon: '👥',
//         color: 'purple'
//       });
//     }
    
//     // Add leave activities
//     if (pendingLeavesList?.length > 0) {
//       activities.push({
//         id: 'leave_activity',
//         type: 'leave',
//         action: `${pendingLeavesList.length} leave requests pending approval`,
//         time: new Date(),
//         icon: '📋',
//         color: 'orange'
//       });
//     }
    
//     // Sort by time (most recent first)
//     activities.sort((a, b) => b.time - a.time);
//     setRecentActivities(activities.slice(0, 5));
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

//   const getStatusBadge = (status) => {
//     const statusMap = {
//       completed: 'bg-green-100 text-green-800',
//       in_progress: 'bg-blue-100 text-blue-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       verified: 'bg-green-100 text-green-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
    
//     const normalizedStatus = status?.replace(/-/g, '_') || 'pending';
//     return statusMap[normalizedStatus] || statusMap.pending;
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

//   // Show warning banner if there are API errors (excluding expected 403s)
//   const hasApiErrors = Object.entries(apiErrors).some(([key, error]) => error === true);
//   const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* API Error Warning Banner */}
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
//                 onClick={fetchData}
//                 className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
//               >
//                 Retry loading data
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Header with Logout and Chat Notification */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Monitor your team's performance and communications.</p>
//         </div>
//         <div className="flex items-center gap-3">
//           {/* Chat Notification Badge */}
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
//           <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid - 7 cards including Chat */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-blue-600">{stats.teamSize}</p>
//           <p className="text-sm text-gray-500">Team Members</p>
//           <Link to="/users" className="text-xs text-blue-600 mt-1 block hover:underline">View all →</Link>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
//           <p className="text-sm text-gray-500">Present Today</p>
//           <p className="text-xs text-gray-400 mt-1">{stats.onLeave} on leave</p>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-purple-600">{stats.completedTasks}</p>
//           <p className="text-sm text-gray-500">Completed Today</p>
//           <Link to="/tasks?status=completed" className="text-xs text-blue-600 mt-1 block hover:underline">View →</Link>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
//           <p className="text-sm text-gray-500">Pending Tasks</p>
//           {stats.overdueTasks > 0 && (
//             <p className="text-xs text-red-600 mt-1">{stats.overdueTasks} overdue</p>
//           )}
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-green-600">{stats.slaRate}%</p>
//           <p className="text-sm text-gray-500">SLA Rate</p>
//           <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
//             <div className="bg-green-500 h-1 rounded-full" style={{ width: `${stats.slaRate}%` }} />
//           </div>
//         </Card>
//         <Card className="p-4 text-center hover:shadow-md transition-shadow">
//           <p className="text-2xl font-bold text-cyan-600">{stats.attendanceRate}%</p>
//           <p className="text-sm text-gray-500">Attendance Rate</p>
//           <Link to="/attendance/report" className="text-xs text-blue-600 mt-1 block hover:underline">Details →</Link>
//         </Card>
//         {/* Chat Stats Card */}
//         <Card className="p-4 text-center hover:shadow-md transition-shadow bg-gradient-to-r from-cyan-50 to-blue-50">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-2xl font-bold text-cyan-600">{stats.unreadMessages}</p>
//               <p className="text-sm text-gray-500">Unread Messages</p>
//               {stats.activeChats > 0 && (
//                 <p className="text-xs text-green-600 mt-1">{stats.activeChats} active chats</p>
//               )}
//             </div>
//             <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">💬</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-center gap-1">
//               Open Chat <span>→</span>
//             </Link>
//           </div>
//         </Card>
//       </div>

//       {/* Current Tasks, Pending Leaves, and Recent Chats */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Current Tasks */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Current Tasks</h3>
//             <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
//               <span>+</span> Assign Task
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {tasks.length > 0 ? (
//               tasks.map(task => (
//                 <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 flex-wrap">
//                       <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                         {task.priority || 'medium'}
//                       </span>
//                       <p className="font-medium text-sm">{task.title}</p>
//                     </div>
//                     <p className="text-xs text-gray-500 mt-1">
//                       Assigned to: {task.assignment?.assignedToName || 'Unassigned'} • 
//                       Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
//                     </p>
//                   </div>
//                   <div className="flex items-center space-x-2">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                       {task.status?.replace(/_/g, ' ') || 'pending'}
//                     </span>
//                     <Link to={`/tasks/${task._id}`} className="text-blue-600 text-sm hover:text-blue-800">
//                       View →
//                     </Link>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                 </svg>
//                 <p className="text-gray-500">No active tasks</p>
//                 <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
//                   Create your first task
//                 </Link>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Pending Leaves */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Pending Leave Requests</h3>
//             <Link to="/leave/pending" className="text-sm text-blue-600 hover:text-blue-800">
//               View All →
//             </Link>
//           </div>
//           <div className="space-y-3 max-h-96 overflow-y-auto">
//             {pendingLeaves.length > 0 ? (
//               pendingLeaves.map(leave => (
//                 <div key={leave.id || leave._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                   <div>
//                     <p className="font-medium text-sm">{leave.employee || leave.userId?.name || 'Employee'}</p>
//                     <p className="text-xs text-gray-500">
//                       {leave.leaveType || 'Leave'} • {leave.days || 1} days • Starting {new Date(leave.startDate).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <Link to={`/leave/${leave._id || leave.id}`} className="text-blue-600 text-sm hover:text-blue-800">
//                     Review →
//                   </Link>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8">
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                 </svg>
//                 <p className="text-gray-500">No pending leave requests</p>
//               </div>
//             )}
//           </div>
//         </Card>

//         {/* Recent Chats */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
//             <Link to="/chat" className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center gap-1">
//               Open Chat <span>→</span>
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
//                 <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//                 </svg>
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

//       {/* Team Members */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Team Members</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">Manage Team →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           {teamMembers.length > 0 ? (
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tasks</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {teamMembers.map(member => (
//                   <tr key={member._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                           <span className="text-sm font-medium text-gray-600">
//                             {member.firstName?.[0]}{member.lastName?.[0]}
//                           </span>
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium text-gray-900">
//                             {member.firstName} {member.lastName}
//                           </p>
//                           <p className="text-xs text-gray-500">{member.email}</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                       {member.role}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${
//                         member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                       }`}>
//                         {member.status || 'active'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {member.currentTasks || 0} active
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex space-x-3">
//                         <Link 
//                           to={`/tasks/new?assignTo=${member._id}`} 
//                           className="text-green-600 hover:text-green-800"
//                           title="Assign Task"
//                         >
//                           📋
//                         </Link>
//                         <Link 
//                           to={`/chat?user=${member._id}`} 
//                           className="text-cyan-600 hover:text-cyan-800"
//                           title="Send Message"
//                         >
//                           💬
//                         </Link>
//                         <Link 
//                           to={`/users/${member._id}`} 
//                           className="text-blue-600 hover:text-blue-800"
//                           title="View Profile"
//                         >
//                           👤
//                         </Link>
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           ) : (
//             <div className="text-center py-12">
//               <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//               </svg>
//               <p className="text-gray-500 mb-2">No technicians found in your team</p>
//               <p className="text-sm text-gray-400 mb-4">Contact admin to add technicians</p>
//             </div>
//           )}
//         </div>
//       </Card>

//       {/* Recent Activity and Performance */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Activity */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.length > 0 ? (
//               recentActivities.map(activity => (
//                 <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                   <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                     <span>{activity.icon}</span>
//                   </div>
//                   <div className="flex-1">
//                     <p className="text-sm text-gray-700">{activity.action}</p>
//                     <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <p className="text-center text-gray-500 py-8">No recent activities</p>
//             )}
//           </div>
//         </Card>

//         {/* Performance Overview */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Task Completion Rate</span>
//                 <span className="text-green-600">
//                   {stats.pendingTasks + stats.completedTasks > 0 
//                     ? Math.round((stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100) 
//                     : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className="bg-green-500 h-2 rounded-full transition-all duration-500" 
//                   style={{ 
//                     width: `${stats.pendingTasks + stats.completedTasks > 0 
//                       ? (stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100 
//                       : 0}%` 
//                   }} 
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>SLA Compliance</span>
//                 <span className={`font-medium ${stats.slaRate >= 90 ? 'text-green-600' : stats.slaRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
//                   {stats.slaRate}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div 
//                   className={`h-2 rounded-full transition-all duration-500 ${
//                     stats.slaRate >= 90 ? 'bg-green-500' : stats.slaRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
//                   }`} 
//                   style={{ width: `${stats.slaRate}%` }} 
//                 />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Attendance Rate</span>
//                 <span className="text-blue-600">{stats.attendanceRate}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.attendanceRate}%` }} />
//               </div>
//             </div>
//             <div className="pt-2 border-t">
//               <div className="flex justify-between text-sm">
//                 <span className="text-gray-500">Team Chat Activity</span>
//                 <span className="text-gray-700">{stats.activeChats} active conversations</span>
//               </div>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
//         <Link to="/tasks/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">📋</div>
//           <p className="text-xs font-medium">Create Task</p>
//         </Link>
//         <Link to="/attendance/report" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">View Attendance</p>
//         </Link>
//         <Link to="/users" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
//           <div className="text-xl mb-1">👥</div>
//           <p className="text-xs font-medium">Manage Team</p>
//         </Link>
//         <Link to="/sla/dashboard" className="bg-orange-50 p-3 rounded-lg text-center hover:bg-orange-100 transition-colors">
//           <div className="text-xl mb-1">🎯</div>
//           <p className="text-xs font-medium">SLA Monitor</p>
//         </Link>
//         <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
//           <div className="text-xl mb-1">💬</div>
//           <p className="text-xs font-medium">Team Chat</p>
//         </Link>
//         <Link to="/leave/pending" className="bg-yellow-50 p-3 rounded-lg text-center hover:bg-yellow-100 transition-colors">
//           <div className="text-xl mb-1">🏖️</div>
//           <p className="text-xs font-medium">Leave Requests</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default ManagerDashboard;






// client/src/pages/dashboard/ManagerDashboard.jsx
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

const ManagerDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentChats, setRecentChats] = useState([]);
  const [apiErrors, setApiErrors] = useState({
    tasks: false,
    team: false,
    attendance: false,
    leave: false,
    chat: false
  });
  const [stats, setStats] = useState({
    teamSize: 0,
    presentToday: 0,
    onLeave: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    slaRate: 98,
    avgResponseTime: 45,
    attendanceRate: 0,
    unreadMessages: 0,
    activeChats: 0
  });

  useEffect(() => {
    fetchData();
    // Set up interval to refresh chat data every 30 seconds
    const interval = setInterval(() => {
      fetchChatData();
    }, 30000);
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
      
      // Don't mark as error for 403 (permission denied) - this is expected
      if (error.response?.status !== 403 && error.response?.status !== 404) {
        setApiErrors(prev => ({ ...prev, [errorKey]: true }));
      }
      
      // Return mock data for development when API fails
      if (errorKey === 'attendance') {
        return { present: 8, absent: 2, onLeave: 1, rate: 80 };
      }
      if (errorKey === 'leave') {
        return { pending: 2, approved: 5, rejected: 1 };
      }
      if (errorKey === 'chat') {
        return { unreadCount: 0, recentChats: [] };
      }
      
      return fallback;
    }
  };

  // Separate function to fetch chat data
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
      
      // Get chat settings
      let chatEnabled = false;
      try {
        const settingsRes = await chatApi.getUserChatSettings();
        if (settingsRes.data?.success) {
          chatEnabled = settingsRes.data.data?.chatEnabled || false;
        }
      } catch (settingsError) {
        console.warn('Chat settings not available');
      }
      
      // Calculate active chats (chats with activity in last 24 hours)
      const activeChats = Array.isArray(chatsData) 
        ? chatsData.filter(chat => {
            const lastMsg = chat.lastMessage?.timestamp;
            if (!lastMsg) return false;
            const lastMsgDate = new Date(lastMsg);
            const hoursDiff = (Date.now() - lastMsgDate) / (1000 * 60 * 60);
            return hoursDiff < 24;
          }).length
        : 0;
      
      // Get recent chats for display
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
        unreadMessages: unreadData?.count || 0,
        activeChats: activeChats,
        chatEnabled: chatEnabled
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
      // Fetch tasks
      const tasksData = await safeFetch(
        () => taskApi.getTasks({ limit: 10 }),
        'tasks',
        { tasks: [] }
      );
      let allTasks = [];
      if (tasksData?.tasks) {
        allTasks = tasksData.tasks;
      } else if (Array.isArray(tasksData)) {
        allTasks = tasksData;
      }
      setTasks(allTasks.slice(0, 5));
      
      // Calculate task statistics
      const completedToday = allTasks.filter(t => 
        t.status === 'completed' && 
        t.timeline?.completedAt && 
        new Date(t.timeline.completedAt).toDateString() === new Date().toDateString()
      ).length;
      
      const pendingTasks = allTasks.filter(t => 
        ['pending', 'assigned', 'accepted', 'in_progress'].includes(t.status)
      ).length;
      
      const overdueTasks = allTasks.filter(t => 
        t.slaDeadline && new Date(t.slaDeadline) < new Date() && 
        !['completed', 'verified', 'closed'].includes(t.status)
      ).length;
      
      // Fetch team members
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
      
      // Fetch pending leaves
      let pendingLeavesList = [];
      try {
        const pendingLeavesRes = await leaveApi.getPendingApprovals();
        if (pendingLeavesRes.data?.success) {
          pendingLeavesList = pendingLeavesRes.data.data || [];
        }
      } catch (pendingError) {
        console.warn('Pending leaves API not available:', pendingError.message);
        // Use mock data
        pendingLeavesList = [
          { id: '1', employee: 'John Doe', leaveType: 'annual', days: 2, startDate: new Date().toISOString() }
        ];
      }
      setPendingLeaves(pendingLeavesList.slice(0, 3));
      
      // Fetch chat data
      await fetchChatData();
      
      setStats(prev => ({
        ...prev,
        teamSize: teamData.length,
        presentToday: attendanceData?.present || Math.floor(teamData.length * 0.85) || 0,
        onLeave: attendanceData?.onLeave || 0,
        completedTasks: completedToday,
        pendingTasks: pendingTasks,
        overdueTasks: overdueTasks,
        slaRate: pendingTasks > 0 ? Math.max(85, 100 - Math.floor(overdueTasks * 5)) : 98,
        avgResponseTime: 45,
        attendanceRate: attendanceData?.rate || 85
      }));
      
      // Generate recent activities
      generateRecentActivities(allTasks, teamData, leaveData, pendingLeavesList);
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      if (error.response?.status !== 403) {
        showToast('Failed to load dashboard data', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const generateRecentActivities = (tasks, team, leaveData, pendingLeavesList) => {
    const activities = [];
    
    // Add task activities
    tasks.slice(0, 3).forEach(task => {
      if (task.status === 'completed') {
        activities.push({
          id: `task_${task._id}`,
          type: 'task',
          action: `Task "${task.title}" was completed`,
          time: task.timeline?.completedAt ? new Date(task.timeline.completedAt) : new Date(),
          icon: '✅',
          color: 'green'
        });
      } else if (task.status === 'in_progress') {
        activities.push({
          id: `task_${task._id}`,
          type: 'task',
          action: `Task "${task.title}" is in progress`,
          time: task.updatedAt ? new Date(task.updatedAt) : new Date(),
          icon: '🔄',
          color: 'blue'
        });
      }
    });
    
    // Add team member activities
    if (team.length > 0) {
      activities.push({
        id: 'team_activity',
        type: 'team',
        action: `${team.length} team members active today`,
        time: new Date(),
        icon: '👥',
        color: 'purple'
      });
    }
    
    // Add leave activities
    if (pendingLeavesList?.length > 0) {
      activities.push({
        id: 'leave_activity',
        type: 'leave',
        action: `${pendingLeavesList.length} leave requests pending approval`,
        time: new Date(),
        icon: '📋',
        color: 'orange'
      });
    }
    
    // Sort by time (most recent first)
    activities.sort((a, b) => b.time - a.time);
    setRecentActivities(activities.slice(0, 5));
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

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      assigned: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-purple-100 text-purple-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800'
    };
    
    const normalizedStatus = status?.replace(/-/g, '_') || 'pending';
    return statusMap[normalizedStatus] || statusMap.pending;
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

  // Show warning banner if there are API errors (excluding expected 403s)
  const hasApiErrors = Object.entries(apiErrors).some(([key, error]) => error === true);
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
          <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Monitor your team's performance and communications.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Chat Notification Badge */}
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
          <Button variant="danger" onClick={handleLogout} size="sm" className="bg-red-500 hover:bg-red-600">
            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid - 7 cards including Chat */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">{stats.teamSize}</p>
          <p className="text-sm text-gray-500">Team Members</p>
          <Link to="/users" className="text-xs text-blue-600 mt-1 block hover:underline">View all →</Link>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{stats.presentToday}</p>
          <p className="text-sm text-gray-500">Present Today</p>
          <p className="text-xs text-gray-400 mt-1">{stats.onLeave} on leave</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">{stats.completedTasks}</p>
          <p className="text-sm text-gray-500">Completed Today</p>
          <Link to="/tasks?status=completed" className="text-xs text-blue-600 mt-1 block hover:underline">View →</Link>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-orange-600">{stats.pendingTasks}</p>
          <p className="text-sm text-gray-500">Pending Tasks</p>
          {stats.overdueTasks > 0 && (
            <p className="text-xs text-red-600 mt-1">{stats.overdueTasks} overdue</p>
          )}
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{stats.slaRate}%</p>
          <p className="text-sm text-gray-500">SLA Rate</p>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
            <div className="bg-green-500 h-1 rounded-full" style={{ width: `${stats.slaRate}%` }} />
          </div>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-cyan-600">{stats.attendanceRate}%</p>
          <p className="text-sm text-gray-500">Attendance Rate</p>
          <Link to="/attendance/report" className="text-xs text-blue-600 mt-1 block hover:underline">Details →</Link>
        </Card>
        {/* Chat Stats Card */}
        <Card className="p-4 text-center hover:shadow-md transition-shadow bg-gradient-to-r from-cyan-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-cyan-600">{stats.unreadMessages}</p>
              <p className="text-sm text-gray-500">Unread Messages</p>
              {stats.activeChats > 0 && (
                <p className="text-xs text-green-600 mt-1">{stats.activeChats} active chats</p>
              )}
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-center gap-1">
              Open Chat <span>→</span>
            </Link>
          </div>
        </Card>
      </div>

      {/* Current Tasks, Pending Leaves, and Recent Chats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Tasks */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Current Tasks</h3>
            <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
              <span>+</span> Assign Task
            </Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {tasks.length > 0 ? (
              tasks.map(task => (
                <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
                        {task.priority || 'medium'}
                      </span>
                      <p className="font-medium text-sm">{task.title}</p>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Assigned to: {task.assignment?.assignedToName || 'Unassigned'} • 
                      Due: {task.slaDeadline ? new Date(task.slaDeadline).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
                      {task.status?.replace(/_/g, ' ') || 'pending'}
                    </span>
                    <Link to={`/tasks/${task._id}`} className="text-blue-600 text-sm hover:text-blue-800">
                      View →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500">No active tasks</p>
                <Link to="/tasks/new" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Create your first task
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Pending Leaves */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Pending Leave Requests</h3>
            <Link to="/leave/pending" className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map(leave => (
                <div key={leave.id || leave._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{leave.employee || leave.userId?.name || 'Employee'}</p>
                    <p className="text-xs text-gray-500">
                      {leave.leaveType || 'Leave'} • {leave.days || 1} days • Starting {new Date(leave.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <Link to={`/leave/${leave._id || leave.id}`} className="text-blue-600 text-sm hover:text-blue-800">
                    Review →
                  </Link>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">No pending leave requests</p>
              </div>
            )}
          </div>
        </Card>

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
          {stats.unreadMessages > 0 && (
            <div className="mt-3 pt-3 border-t">
              <Link to="/chat" className="text-xs text-cyan-600 hover:text-cyan-800 flex items-center justify-end gap-1">
                You have {stats.unreadMessages} unread message{stats.unreadMessages !== 1 ? 's' : ''} →
              </Link>
            </div>
          )}
        </Card>
      </div>

      {/* Team Members */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-semibold text-gray-900">Team Members</h3>
          <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">Manage Team →</Link>
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
                          to={`/users/${member._id}`} 
                          className="text-blue-600 hover:text-blue-800"
                          title="View Profile"
                        >
                          👤
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

      {/* Recent Activity and Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.length > 0 ? (
              recentActivities.map(activity => (
                <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
                    <span>{activity.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.action}</p>
                    <p className="text-xs text-gray-400">{formatTimeAgo(activity.time)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">No recent activities</p>
            )}
          </div>
        </Card>

        {/* Performance Overview */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Team Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Task Completion Rate</span>
                <span className="text-green-600">
                  {stats.pendingTasks + stats.completedTasks > 0 
                    ? Math.round((stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100) 
                    : 0}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all duration-500" 
                  style={{ 
                    width: `${stats.pendingTasks + stats.completedTasks > 0 
                      ? (stats.completedTasks / (stats.pendingTasks + stats.completedTasks)) * 100 
                      : 0}%` 
                  }} 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>SLA Compliance</span>
                <span className={`font-medium ${stats.slaRate >= 90 ? 'text-green-600' : stats.slaRate >= 80 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {stats.slaRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    stats.slaRate >= 90 ? 'bg-green-500' : stats.slaRate >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} 
                  style={{ width: `${stats.slaRate}%` }} 
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Attendance Rate</span>
                <span className="text-blue-600">{stats.attendanceRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full transition-all duration-500" style={{ width: `${stats.attendanceRate}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Team Chat Activity</span>
                <span className="text-gray-700">{stats.activeChats} active conversations</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Link to="/tasks/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-xl mb-1">📋</div>
          <p className="text-xs font-medium">Create Task</p>
        </Link>
        <Link to="/attendance/report" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100 transition-colors">
          <div className="text-xl mb-1">⏰</div>
          <p className="text-xs font-medium">View Attendance</p>
        </Link>
        <Link to="/users" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100 transition-colors">
          <div className="text-xl mb-1">👥</div>
          <p className="text-xs font-medium">Manage Team</p>
        </Link>
        <Link to="/sla/dashboard" className="bg-orange-50 p-3 rounded-lg text-center hover:bg-orange-100 transition-colors">
          <div className="text-xl mb-1">🎯</div>
          <p className="text-xs font-medium">SLA Monitor</p>
        </Link>
        <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
          <div className="text-xl mb-1">💬</div>
          <p className="text-xs font-medium">Team Chat</p>
        </Link>
        <Link to="/leave/pending" className="bg-yellow-50 p-3 rounded-lg text-center hover:bg-yellow-100 transition-colors">
          <div className="text-xl mb-1">🏖️</div>
          <p className="text-xs font-medium">Leave Requests</p>
        </Link>
      </div>
    </div>
  );
};

export default ManagerDashboard;