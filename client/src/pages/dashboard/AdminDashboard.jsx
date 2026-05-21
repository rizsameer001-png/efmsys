// // client/src/pages/dashboard/AdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const AdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [buildings, setBuildings] = useState([]);
//   const [recentTasks, setRecentTasks] = useState([]);
//   const [pendingApprovals, setPendingApprovals] = useState([
//     { id: 1, type: 'leave', title: 'Leave Request', employee: 'John Doe', days: 3, status: 'pending' },
//     { id: 2, type: 'purchase', title: 'Purchase Order', item: 'HVAC Parts', amount: 2500, status: 'pending' },
//     { id: 3, type: 'asset', title: 'Asset Registration', asset: 'Generator #GEN-003', status: 'pending' }
//   ]);
//   const [stats, setStats] = useState({
//     totalStaff: 0,
//     activeStaff: 0,
//     openComplaints: 0,
//     tasksToday: 0,
//     pendingApprovals: 0,
//     buildingsCount: 0,
//     occupancyRate: 0
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
//       // Fetch buildings
//       const buildingsRes = await buildingApi.getBuildings();
//       const buildingsData = buildingsRes.data.data?.buildings || [];
//       setBuildings(buildingsData.slice(0, 4));
      
//       // Fetch users for staff count
//       const usersRes = await userApi.getUsers({ limit: 1 });
//       const totalStaff = usersRes.data.data?.pagination?.total || 0;
      
//       // Fetch tasks
//       const tasksRes = await taskApi.getTasks({ limit: 5 });
//       const tasks = tasksRes.data.data?.tasks || [];
//       setRecentTasks(tasks);
      
//       setStats({
//         totalStaff: totalStaff,
//         activeStaff: Math.floor(totalStaff * 0.85),
//         openComplaints: 23,
//         tasksToday: tasks.filter(t => new Date(t.createdAt).toDateString() === new Date().toDateString()).length,
//         pendingApprovals: pendingApprovals.length,
//         buildingsCount: buildingsData.length,
//         occupancyRate: 78
//       });
      
//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       showToast('Failed to load dashboard data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprove = (id) => {
//     setPendingApprovals(prev => prev.filter(item => item.id !== id));
//     showToast('Request approved successfully', 'success');
//   };

//   const handleReject = (id) => {
//     setPendingApprovals(prev => prev.filter(item => item.id !== id));
//     showToast('Request rejected', 'warning');
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header with Logout */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
//           <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage buildings, staff, and operations.</p>
//         </div>
//         <Button variant="danger" onClick={handleLogout} size="sm">
//           <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//           </svg>
//           Logout
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{stats.totalStaff}</p>
//           <p className="text-sm text-gray-500">Total Staff</p>
//           <p className="text-xs text-green-600 mt-1">+12 this month</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{stats.activeStaff}</p>
//           <p className="text-sm text-gray-500">Active Staff</p>
//           <p className="text-xs text-gray-500 mt-1">{stats.totalStaff - stats.activeStaff} on leave</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-orange-600">{stats.openComplaints}</p>
//           <p className="text-sm text-gray-500">Open Complaints</p>
//           <p className="text-xs text-red-600 mt-1">8 high priority</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{stats.tasksToday}</p>
//           <p className="text-sm text-gray-500">Tasks Today</p>
//           <p className="text-xs text-gray-500 mt-1">Due in 8 hours</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{stats.pendingApprovals}</p>
//           <p className="text-sm text-gray-500">Pending Approvals</p>
//           <p className="text-xs text-yellow-600 mt-1">Requires action</p>
//         </Card>
//       </div>

//       {/* Buildings Overview */}
//       <Card className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Buildings Overview</h3>
//           <div className="flex space-x-2">
//             <Link to="/buildings" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
//             <Link to="/buildings/new" className="text-sm text-green-600 hover:text-green-800">+ Add New</Link>
//           </div>
//         </div>
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//           {buildings.map(building => (
//             <Link key={building._id} to={`/buildings/${building._id}`} className="block">
//               <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <h4 className="font-medium text-gray-900">{building.name}</h4>
//                     <p className="text-xs text-gray-500">{building.code}</p>
//                   </div>
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     building.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
//                   }`}>
//                     {building.status}
//                   </span>
//                 </div>
//                 <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
//                   <div>
//                     <p className="text-gray-500">Units</p>
//                     <p className="font-medium">{building.statistics?.totalUnits || 0}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-500">Floors</p>
//                     <p className="font-medium">{building.statistics?.totalFloors || 0}</p>
//                   </div>
//                 </div>
//                 <p className="text-xs text-gray-400 mt-2 truncate">{building.address?.city}, {building.address?.country}</p>
//               </div>
//             </Link>
//           ))}
//         </div>
//         {buildings.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             No buildings added yet. <Link to="/buildings/new" className="text-blue-600">Add your first building</Link>
//           </div>
//         )}
//       </Card>

//       {/* Recent Tasks and Pending Approvals */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Recent Tasks */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Recent Tasks</h3>
//             <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
//           </div>
//           <div className="space-y-3">
//             {recentTasks.slice(0, 5).map(task => (
//               <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <div>
//                   <p className="font-medium text-sm">{task.title}</p>
//                   <p className="text-xs text-gray-500">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//                 </div>
//                 <div className="flex items-center space-x-2">
//                   <span className={`px-2 py-1 text-xs rounded-full ${
//                     task.priority === 'critical' ? 'bg-red-100 text-red-800' :
//                     task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
//                     'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {task.priority}
//                   </span>
//                   <Link to={`/tasks/${task._id}`} className="text-blue-600 text-sm">View →</Link>
//                 </div>
//               </div>
//             ))}
//             {recentTasks.length === 0 && (
//               <p className="text-center text-gray-500 py-8">No tasks found</p>
//             )}
//           </div>
//         </Card>

//         {/* Pending Approvals */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
//             <span className="text-sm text-orange-600">{stats.pendingApprovals} pending</span>
//           </div>
//           <div className="space-y-3">
//             {pendingApprovals.map(approval => (
//               <div key={approval.id} className="border rounded-lg p-3">
//                 <div className="flex justify-between items-start">
//                   <div>
//                     <div className="flex items-center space-x-2">
//                       <span className={`px-2 py-0.5 text-xs rounded-full ${
//                         approval.type === 'leave' ? 'bg-blue-100 text-blue-800' :
//                         approval.type === 'purchase' ? 'bg-purple-100 text-purple-800' :
//                         'bg-green-100 text-green-800'
//                       }`}>
//                         {approval.type}
//                       </span>
//                       <p className="font-medium text-sm">{approval.title}</p>
//                     </div>
//                     {approval.employee && <p className="text-xs text-gray-500 mt-1">Employee: {approval.employee}</p>}
//                     {approval.amount && <p className="text-xs text-gray-500">Amount: ${approval.amount}</p>}
//                     {approval.days && <p className="text-xs text-gray-500">Duration: {approval.days} days</p>}
//                   </div>
//                   <div className="flex space-x-2">
//                     <Button size="sm" variant="success" onClick={() => handleApprove(approval.id)}>Approve</Button>
//                     <Button size="sm" variant="danger" onClick={() => handleReject(approval.id)}>Reject</Button>
//                   </div>
//                 </div>
//               </div>
//             ))}
//             {pendingApprovals.length === 0 && (
//               <p className="text-center text-gray-500 py-8">No pending approvals</p>
//             )}
//           </div>
//         </Card>
//       </div>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/users/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">👤</div>
//           <p className="text-sm font-medium">Add Staff</p>
//         </Link>
//         <Link to="/tasks/new" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">📋</div>
//           <p className="text-sm font-medium">Create Task</p>
//         </Link>
//         <Link to="/reports" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-2xl mb-1">📊</div>
//           <p className="text-sm font-medium">View Reports</p>
//         </Link>
//         <Link to="/attendance" className="bg-orange-50 p-4 rounded-lg text-center hover:bg-orange-100">
//           <div className="text-2xl mb-1">⏰</div>
//           <p className="text-sm font-medium">Attendance</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




// client/src/pages/dashboard/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buildingApi } from '../../api/building.api';
import { taskApi } from '../../api/task.api';
import { userApi } from '../../api/user.api';
import { attendanceApi } from '../../api/attendance.api';
import { leaveApi } from '../../api/leave.api';
import { complaintApi } from '../../api/complaint.api';
import { chatApi } from '../../api/chat.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [buildings, setBuildings] = useState([]);
  const [recentTasks, setRecentTasks] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [apiErrors, setApiErrors] = useState({
    buildings: false,
    tasks: false,
    users: false,
    attendance: false,
    leave: false,
    complaints: false
  });
  const [stats, setStats] = useState({
    totalStaff: 0,
    activeStaff: 0,
    onLeave: 0,
    openComplaints: 0,
    tasksToday: 0,
    pendingApprovals: 0,
    buildingsCount: 0,
    occupancyRate: 78,
    attendanceRate: 0,
    unreadMessages: 0
  });

  useEffect(() => {
    fetchData();
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
      setApiErrors(prev => ({ ...prev, [errorKey]: true }));
      if (error.response?.status !== 403 && error.response?.status !== 404) {
        showToast(`Failed to load ${errorKey} data`, 'warning');
      }
      return fallback;
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setApiErrors({
      buildings: false,
      tasks: false,
      users: false,
      attendance: false,
      leave: false,
      complaints: false
    });
    
    try {
      // Fetch buildings
      const buildingsData = await safeFetch(
        () => buildingApi.getBuildings(),
        'buildings',
        { buildings: [] }
      );
      const buildingsList = buildingsData?.buildings || [];
      setBuildings(buildingsList.slice(0, 4));
      
      // Fetch users for staff count
      const usersData = await safeFetch(
        () => userApi.getUsers({ limit: 1 }),
        'users',
        { pagination: { total: 0 } }
      );
      const totalStaff = usersData?.pagination?.total || 0;
      
      // Fetch tasks
      const tasksData = await safeFetch(
        () => taskApi.getTasks({ limit: 5 }),
        'tasks',
        { tasks: [] }
      );
      const tasks = tasksData?.tasks || [];
      setRecentTasks(tasks);
      
      // Fetch complaints
      const complaintsData = await safeFetch(
        () => complaintApi.getComplaints({ limit: 5 }),
        'complaints',
        { complaints: [] }
      );
      const complaints = complaintsData?.complaints || [];
      setRecentComplaints(complaints);
      
      // Fetch attendance stats
      let attendanceRate = 0;
      let onLeave = 0;
      const attendanceData = await safeFetch(
        () => attendanceApi.getDashboardStats(),
        'attendance',
        null
      );
      if (attendanceData) {
        attendanceRate = attendanceData.rate || 0;
        onLeave = attendanceData.onLeave || 0;
      }
      
      // Fetch leave stats
      let pendingLeaves = 0;
      const leaveData = await safeFetch(
        () => leaveApi.getLeaveStats(),
        'leave',
        null
      );
      if (leaveData) {
        pendingLeaves = leaveData.pending || 0;
      }
      
      // Fetch chat unread count
      let unreadMessages = 0;
      const chatData = await safeFetch(
        () => chatApi.getTotalUnreadCount(),
        'chat',
        null
      );
      if (chatData) {
        unreadMessages = chatData.count || 0;
      }
      
      // Calculate pending approvals (leaves + other approvals)
      const pendingApprovalsList = [];
      
      // Add pending leaves to approvals
      if (pendingLeaves > 0) {
        pendingApprovalsList.push({
          id: 'leave_summary',
          type: 'leave',
          title: 'Leave Requests',
          description: `${pendingLeaves} pending leave requests`,
          count: pendingLeaves,
          status: 'pending'
        });
      }
      
      setPendingApprovals(pendingApprovalsList);
      
      setStats({
        totalStaff: totalStaff,
        activeStaff: Math.floor(totalStaff * 0.85),
        onLeave: onLeave,
        openComplaints: complaints.filter(c => c.status !== 'closed' && c.status !== 'resolved').length,
        tasksToday: tasks.filter(t => {
          const taskDate = new Date(t.createdAt || t.dueDate);
          return taskDate.toDateString() === new Date().toDateString();
        }).length,
        pendingApprovals: pendingApprovalsList.length + (pendingLeaves > 0 ? 1 : 0),
        buildingsCount: buildingsList.length,
        occupancyRate: 78,
        attendanceRate: attendanceRate,
        unreadMessages: unreadMessages
      });
      
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      showToast('Failed to load dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = (id) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    showToast('Request approved successfully', 'success');
  };

  const handleReject = (id) => {
    setPendingApprovals(prev => prev.filter(item => item.id !== id));
    showToast('Request rejected', 'warning');
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
                {apiErrors.buildings && "• Buildings data unavailable\n"}
                {apiErrors.tasks && "• Tasks data unavailable\n"}
                {apiErrors.attendance && "• Attendance data unavailable\n"}
                {apiErrors.leave && "• Leave data unavailable"}
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

      {/* Header with Logout */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, {user?.firstName}! Manage buildings, staff, and operations.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Chat Notification */}
          {stats.unreadMessages > 0 && (
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
          )}
          <Button variant="danger" onClick={handleLogout} size="sm">
            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-blue-600">{stats.totalStaff}</p>
          <p className="text-sm text-gray-500">Total Staff</p>
          <p className="text-xs text-green-600 mt-1">+12 this month</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-green-600">{stats.activeStaff}</p>
          <p className="text-sm text-gray-500">Active Staff</p>
          <p className="text-xs text-gray-500 mt-1">{stats.onLeave} on leave</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-orange-600">{stats.openComplaints}</p>
          <p className="text-sm text-gray-500">Open Complaints</p>
          <Link to="/complaints" className="text-xs text-blue-600 mt-1 block hover:underline">View all →</Link>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-purple-600">{stats.tasksToday}</p>
          <p className="text-sm text-gray-500">Tasks Today</p>
          <Link to="/tasks?filter=today" className="text-xs text-blue-600 mt-1 block hover:underline">View tasks →</Link>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-red-600">{stats.pendingApprovals}</p>
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <Link to="/approvals" className="text-xs text-blue-600 mt-1 block hover:underline">Review →</Link>
        </Card>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Buildings</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.buildingsCount}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Occupancy: {stats.occupancyRate}%</span>
              <Link to="/buildings" className="text-blue-600">Manage →</Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Attendance Rate</p>
              <p className="text-2xl font-bold text-teal-600">{stats.attendanceRate}%</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Today's attendance</span>
              <Link to="/attendance/report" className="text-blue-600">View →</Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Unread Messages</p>
              <p className="text-2xl font-bold text-cyan-600">{stats.unreadMessages}</p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Active conversations</span>
              <Link to="/chat" className="text-blue-600">Open Chat →</Link>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500">Resolution Rate</p>
              <p className="text-2xl font-bold text-green-600">87%</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Complaints resolved</span>
              <Link to="/complaints/resolved" className="text-blue-600">Details →</Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Buildings Overview */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Buildings Overview</h3>
          <div className="flex space-x-2">
            <Link to="/buildings" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
            <Link to="/buildings/new" className="text-sm text-green-600 hover:text-green-800">+ Add New</Link>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {buildings.map(building => (
            <Link key={building._id} to={`/buildings/${building._id}`} className="block">
              <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900">{building.name}</h4>
                    <p className="text-xs text-gray-500">{building.code}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    building.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {building.status || 'active'}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-gray-500">Units</p>
                    <p className="font-medium">{building.statistics?.totalUnits || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Floors</p>
                    <p className="font-medium">{building.statistics?.totalFloors || 0}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 truncate">
                  {building.address?.city}, {building.address?.country}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {buildings.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No buildings added yet. <Link to="/buildings/new" className="text-blue-600">Add your first building</Link>
          </div>
        )}
      </Card>

      {/* Recent Tasks and Pending Approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Tasks */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Tasks</h3>
            <Link to="/tasks" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentTasks.slice(0, 5).map(task => (
              <div key={task._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-gray-500">
                    Assigned to: {task.assignment?.assignedToName || 'Unassigned'}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs text-gray-400 mt-1">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    task.priority === 'critical' ? 'bg-red-100 text-red-800' :
                    task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority || 'medium'}
                  </span>
                  <Link to={`/tasks/${task._id}`} className="text-blue-600 text-sm hover:underline">View →</Link>
                </div>
              </div>
            ))}
            {recentTasks.length === 0 && (
              <p className="text-center text-gray-500 py-8">No tasks found</p>
            )}
          </div>
        </Card>

        {/* Recent Complaints */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Complaints</h3>
            <Link to="/complaints" className="text-sm text-blue-600 hover:text-blue-800">View All →</Link>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {recentComplaints.slice(0, 5).map(complaint => (
              <div key={complaint._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="font-medium text-sm">{complaint.title}</p>
                  <p className="text-xs text-gray-500">
                    {complaint.customerName || complaint.customerId?.name || 'Customer'}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    complaint.status === 'open' ? 'bg-red-100 text-red-800' :
                    complaint.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
                    complaint.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                    complaint.status === 'completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {complaint.status || 'open'}
                  </span>
                  <Link to={`/complaints/${complaint._id}`} className="text-blue-600 text-sm hover:underline">View →</Link>
                </div>
              </div>
            ))}
            {recentComplaints.length === 0 && (
              <p className="text-center text-gray-500 py-8">No complaints found</p>
            )}
          </div>
        </Card>
      </div>

      {/* Pending Approvals Section */}
      {pendingApprovals.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Pending Approvals</h3>
            <span className="text-sm text-orange-600">{stats.pendingApprovals} pending</span>
          </div>
          <div className="space-y-3">
            {pendingApprovals.map(approval => (
              <div key={approval.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        approval.type === 'leave' ? 'bg-blue-100 text-blue-800' :
                        approval.type === 'purchase' ? 'bg-purple-100 text-purple-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {approval.type}
                      </span>
                      <p className="font-medium text-sm">{approval.title}</p>
                    </div>
                    {approval.description && (
                      <p className="text-xs text-gray-500 mt-1">{approval.description}</p>
                    )}
                    {approval.employee && (
                      <p className="text-xs text-gray-500 mt-1">Employee: {approval.employee}</p>
                    )}
                    {approval.amount && (
                      <p className="text-xs text-gray-500">Amount: ${approval.amount}</p>
                    )}
                    {approval.days && (
                      <p className="text-xs text-gray-500">Duration: {approval.days} days</p>
                    )}
                    {approval.count && (
                      <p className="text-xs text-gray-500">{approval.count} requests pending</p>
                    )}
                  </div>
                  {approval.id !== 'leave_summary' && (
                    <div className="flex space-x-2">
                      <Button size="sm" variant="success" onClick={() => handleApprove(approval.id)}>Approve</Button>
                      <Button size="sm" variant="danger" onClick={() => handleReject(approval.id)}>Reject</Button>
                    </div>
                  )}
                  {approval.id === 'leave_summary' && (
                    <Link to="/leave/pending">
                      <Button size="sm" variant="primary">Review All</Button>
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <Link to="/users/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
          <div className="text-xl mb-1">👤</div>
          <p className="text-xs font-medium">Add Staff</p>
        </Link>
        <Link to="/tasks/new" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100">
          <div className="text-xl mb-1">📋</div>
          <p className="text-xs font-medium">Create Task</p>
        </Link>
        <Link to="/buildings/new" className="bg-indigo-50 p-3 rounded-lg text-center hover:bg-indigo-100">
          <div className="text-xl mb-1">🏢</div>
          <p className="text-xs font-medium">Add Building</p>
        </Link>
        <Link to="/reports" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100">
          <div className="text-xl mb-1">📊</div>
          <p className="text-xs font-medium">View Reports</p>
        </Link>
        <Link to="/attendance" className="bg-orange-50 p-3 rounded-lg text-center hover:bg-orange-100">
          <div className="text-xl mb-1">⏰</div>
          <p className="text-xs font-medium">Attendance</p>
        </Link>
        <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100">
          <div className="text-xl mb-1">💬</div>
          <p className="text-xs font-medium">Chat</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;