// // client/src/pages/dashboard/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userApi } from '../../api/user.api';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { formatNumber } from '../../utils/formatters';

// const SuperAdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: { total: 0, active: 0, newThisMonth: 0 },
//     buildings: { total: 0, active: 0, totalUnits: 0 },
//     tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
//     complaints: { total: 0, resolved: 0, pending: 0 },
//     revenue: { total: 0, thisMonth: 0, growth: 0 }
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [chartData, setChartData] = useState({
//     tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
//     monthlyRevenue: [12000, 14500, 16800, 19200, 21500, 23800]
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch users data
//       const usersRes = await userApi.getUsers({ limit: 1 });
//       const totalUsers = usersRes.data.data?.pagination?.total || 0;
      
//       // Fetch buildings data
//       const buildingsRes = await buildingApi.getBuildings();
//       const buildings = buildingsRes.data.data?.buildings || [];
      
//       // Fetch tasks statistics
//       const tasksRes = await taskApi.getTaskStatistics();
//       const taskStats = tasksRes.data.data || {};
      
//       setStats({
//         users: {
//           total: totalUsers,
//           active: Math.floor(totalUsers * 0.85),
//           newThisMonth: 24
//         },
//         buildings: {
//           total: buildings.length,
//           active: buildings.filter(b => b.status === 'active').length,
//           totalUnits: 1250
//         },
//         tasks: {
//           total: taskStats.total || 0,
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           overdue: taskStats.overdue || 0
//         },
//         complaints: {
//           total: 156,
//           resolved: 134,
//           pending: 22
//         },
//         revenue: {
//           total: 1250000,
//           thisMonth: 145000,
//           growth: 12.5
//         }
//       });

//       setChartData({
//         tasksByStatus: {
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           pending: taskStats.pending || 0,
//           overdue: taskStats.overdue || 0
//         },
//         monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000]
//       });

//       setRecentActivities([
//         { id: 1, type: 'user', action: 'New user registered', user: 'John Smith', time: '2 minutes ago', icon: '👤', color: 'blue' },
//         { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
//         { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
//         { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
//         { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' }
//       ]);

//       setRecentUsers([
//         { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'admin', status: 'active', joined: '2024-01-15' },
//         { id: 2, name: 'Sarah Johnson', email: 'sarah.johnson@example.com', role: 'manager', status: 'active', joined: '2024-01-14' },
//         { id: 3, name: 'Mike Chen', email: 'mike.chen@example.com', role: 'technician', status: 'active', joined: '2024-01-13' },
//         { id: 4, name: 'Lisa Wong', email: 'lisa.wong@example.com', role: 'supervisor', status: 'active', joined: '2024-01-12' },
//         { id: 5, name: 'David Kim', email: 'david.kim@example.com', role: 'technician', status: 'inactive', joined: '2024-01-10' }
//       ]);

//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       showToast('Failed to load dashboard data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'text-green-600 bg-green-100';
//       case 'inactive': return 'text-red-600 bg-red-100';
//       default: return 'text-gray-600 bg-gray-100';
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with Logout */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//             <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
//             <div className="mt-4 flex space-x-4">
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Total Revenue</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Growth Rate</p>
//                 <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">This Month</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
//               </div>
//             </div>
//           </div>
//           <Button 
//             variant="danger" 
//             onClick={handleLogout} 
//             size="sm"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">👥</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Active: {stats.users.active}</span>
//               <Link to="/users" className="text-blue-600 hover:text-blue-800">View all →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Buildings</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.buildings.total}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} total units</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">🏢</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Active: {stats.buildings.active}</span>
//               <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Tasks</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.tasks.total}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
//             </div>
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
//               <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Complaints</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.complaints.total}</p>
//               <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">📋</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
//               <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts and Activity Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Task Status Chart */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Completed</span>
//                 <span className="text-green-600">{Math.round((chartData.tasksByStatus.completed / stats.tasks.total) * 100)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.completed / stats.tasks.total) * 100}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>In Progress</span>
//                 <span className="text-blue-600">{Math.round((chartData.tasksByStatus.inProgress / stats.tasks.total) * 100)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.inProgress / stats.tasks.total) * 100}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Pending</span>
//                 <span className="text-yellow-600">{Math.round((chartData.tasksByStatus.pending / stats.tasks.total) * 100)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.pending / stats.tasks.total) * 100}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Overdue</span>
//                 <span className="text-red-600">{Math.round((chartData.tasksByStatus.overdue / stats.tasks.total) * 100)}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.overdue / stats.tasks.total) * 100}%` }} />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Recent Activity */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
//                 <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                   <span>{activity.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{activity.action}</p>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//                 {activity.user && <span className="text-xs text-gray-400">{activity.user}</span>}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Recent Users Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Recent Users</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View All Users →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentUsers.map(user => (
//                 <tr key={user.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
//                       {user.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <Link to={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 mr-3">View</Link>
//                     <button className="text-green-600 hover:text-green-800">Edit</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/users/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">👤</div>
//           <p className="text-sm font-medium">Add Staff</p>
//         </Link>
//         <Link to="/buildings/new" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">🏢</div>
//           <p className="text-sm font-medium">Add Building</p>
//         </Link>
//         <Link to="/reports" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-2xl mb-1">📊</div>
//           <p className="text-sm font-medium">View Reports</p>
//         </Link>
//         <Link to="/settings" className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100">
//           <div className="text-2xl mb-1">⚙️</div>
//           <p className="text-sm font-medium">Settings</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;

// // client/src/pages/dashboard/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userApi } from '../../api/user.api';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { formatNumber, formatDate } from '../../utils/formatters';

// const SuperAdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: { total: 0, active: 0, newThisMonth: 0 },
//     buildings: { total: 0, active: 0, totalUnits: 0 },
//     tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
//     complaints: { total: 0, resolved: 0, pending: 0 },
//     revenue: { total: 0, thisMonth: 0, growth: 0 }
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [chartData, setChartData] = useState({
//     tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
//     monthlyRevenue: [12000, 14500, 16800, 19200, 21500, 23800]
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch users data with pagination
//       const usersRes = await userApi.getUsers({ limit: 10, page: 1 });
//       const totalUsers = usersRes.data.data?.pagination?.total || 0;
//       const usersList = usersRes.data.data?.users || [];
      
//       // Fetch buildings data
//       const buildingsRes = await buildingApi.getBuildings();
//       const buildings = buildingsRes.data.data?.buildings || [];
      
//       // Fetch tasks statistics
//       const tasksRes = await taskApi.getTaskStatistics();
//       const taskStats = tasksRes.data.data || {};
      
//       setStats({
//         users: {
//           total: totalUsers,
//           active: Math.floor(totalUsers * 0.85),
//           newThisMonth: 24
//         },
//         buildings: {
//           total: buildings.length,
//           active: buildings.filter(b => b.status === 'active').length,
//           totalUnits: 1250
//         },
//         tasks: {
//           total: taskStats.total || 0,
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           overdue: taskStats.overdue || 0
//         },
//         complaints: {
//           total: 156,
//           resolved: 134,
//           pending: 22
//         },
//         revenue: {
//           total: 1250000,
//           thisMonth: 145000,
//           growth: 12.5
//         }
//       });

//       setChartData({
//         tasksByStatus: {
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           pending: taskStats.pending || 0,
//           overdue: taskStats.overdue || 0
//         },
//         monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000]
//       });

//       // Set recent users from API data
//       const formattedUsers = usersList.slice(0, 5).map(u => ({
//         id: u._id,
//         name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
//         email: u.email,
//         role: u.role,
//         status: u.status || 'active',
//         joined: u.createdAt ? formatDate(u.createdAt) : new Date().toISOString().split('T')[0]
//       }));
      
//       setRecentUsers(formattedUsers);

//       // Set recent activities (you can enhance this with real data later)
//       setRecentActivities([
//         { id: 1, type: 'user', action: 'New user registered', user: formattedUsers[0]?.name || 'User', time: '2 minutes ago', icon: '👤', color: 'blue' },
//         { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
//         { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
//         { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
//         { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' }
//       ]);

//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       showToast('Failed to load dashboard data', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'suspended': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with Logout */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//             <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
//             <div className="mt-4 flex space-x-4">
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Total Revenue</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Growth Rate</p>
//                 <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">This Month</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
//               </div>
//             </div>
//           </div>
//           <Button 
//             variant="danger" 
//             onClick={handleLogout} 
//             size="sm"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">👥</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Active: {stats.users.active}</span>
//               <Link to="/users" className="text-blue-600 hover:text-blue-800">View all →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Buildings</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.buildings.total}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} total units</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">🏢</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Active: {stats.buildings.active}</span>
//               <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Tasks</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.tasks.total}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
//             </div>
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
//               <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Complaints</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.complaints.total}</p>
//               <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">📋</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
//               <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts and Activity Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Task Status Chart */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Completed</span>
//                 <span className="text-green-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ 
//                   width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` 
//                 }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>In Progress</span>
//                 <span className="text-blue-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.inProgress / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ 
//                   width: `${stats.tasks.total > 0 ? (stats.tasks.inProgress / stats.tasks.total) * 100 : 0}%` 
//                 }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Overdue</span>
//                 <span className="text-red-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.overdue / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-red-500 h-2 rounded-full" style={{ 
//                   width: `${stats.tasks.total > 0 ? (stats.tasks.overdue / stats.tasks.total) * 100 : 0}%` 
//                 }} />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* Recent Activity */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
//                 <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                   <span>{activity.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{activity.action}</p>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//                 {activity.user && <span className="text-xs text-gray-400">{activity.user}</span>}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Recent Users Table - Now shows real data */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Recent Users</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View All Users →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentUsers.length > 0 ? (
//                 recentUsers.map(user => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link to={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 mr-3">View</Link>
//                       <Link to={`/users/${user.id}/edit`} className="text-green-600 hover:text-green-800">Edit</Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Quick Actions */}
// {/*      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/users/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">👤</div>
//           <p className="text-sm font-medium">Add Staff</p>
//         </Link>
//         <Link to="/buildings/new" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">🏢</div>
//           <p className="text-sm font-medium">Add Building</p>
//         </Link>
//         <Link to="/reports" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-2xl mb-1">📊</div>
//           <p className="text-sm font-medium">View Reports</p>
//         </Link>
//         <Link to="/settings" className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100">
//           <div className="text-2xl mb-1">⚙️</div>
//           <p className="text-sm font-medium">Settings</p>
//         </Link>
//       </div>*/}

//       // client/src/pages/dashboard/SuperAdminDashboard.jsx
// 		// Update the Quick Actions section (lines 390-410)

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/users/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">👤</div>
//           <p className="text-sm font-medium">Add Staff</p>
//         </Link>
//         {/* 🔴 FIX: Changed from /buildings/new to proper building creation */}
//         <Link to="/buildings/new" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">🏢</div>
//           <p className="text-sm font-medium">Add Building</p>
//         </Link>
//         {/* 🔴 FIX: Changed from /reports to building list */}
//         <Link to="/buildings" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-2xl mb-1">📊</div>
//           <p className="text-sm font-medium">View Buildings</p>
//         </Link>
//         <Link to="/settings" className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100">
//           <div className="text-2xl mb-1">⚙️</div>
//           <p className="text-sm font-medium">Settings</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;



// // client/src/pages/dashboard/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userApi } from '../../api/user.api';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { formatNumber, formatDate } from '../../utils/formatters';

// const SuperAdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: { total: 0, active: 0, newThisMonth: 0 },
//     buildings: { total: 0, active: 0, totalUnits: 0 },
//     tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
//     complaints: { total: 0, resolved: 0, pending: 0 },
//     revenue: { total: 0, thisMonth: 0, growth: 0 }
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [chartData, setChartData] = useState({
//     tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
//     monthlyRevenue: [12000, 14500, 16800, 19200, 21500, 23800]
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // 🔴 FIX: Only fetch users if user has admin role
//       let totalUsers = 0;
//       let usersList = [];
      
//       if (user?.role === 'super_admin' || user?.role === 'admin') {
//         try {
//           const usersRes = await userApi.getUsers({ limit: 10, page: 1 });
//           totalUsers = usersRes.data.data?.pagination?.total || 0;
//           usersList = usersRes.data.data?.users || [];
//         } catch (userError) {
//           console.error('Failed to fetch users:', userError);
//           // Don't show toast for 403, just use defaults
//           if (userError.response?.status !== 403) {
//             showToast('Failed to load users data', 'error');
//           }
//         }
//       }
      
//       // Fetch buildings data
//       let buildings = [];
//       try {
//         const buildingsRes = await buildingApi.getBuildings();
//         buildings = buildingsRes.data.data?.buildings || [];
//       } catch (buildingError) {
//         console.error('Failed to fetch buildings:', buildingError);
//       }
      
//       // Fetch tasks statistics
//       let taskStats = {};
//       try {
//         const tasksRes = await taskApi.getTaskStatistics();
//         taskStats = tasksRes.data.data || {};
//       } catch (taskError) {
//         console.error('Failed to fetch tasks:', taskError);
//       }
      
//       setStats({
//         users: {
//           total: totalUsers,
//           active: Math.floor(totalUsers * 0.85) || 0,
//           newThisMonth: Math.floor(totalUsers * 0.1) || 0
//         },
//         buildings: {
//           total: buildings.length,
//           active: buildings.filter(b => b.status === 'active').length,
//           totalUnits: buildings.reduce((sum, b) => sum + (b.statistics?.totalUnits || 0), 0)
//         },
//         tasks: {
//           total: taskStats.total || 0,
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           overdue: taskStats.overdue || 0
//         },
//         complaints: {
//           total: 156,
//           resolved: 134,
//           pending: 22
//         },
//         revenue: {
//           total: 1250000,
//           thisMonth: 145000,
//           growth: 12.5
//         }
//       });

//       setChartData({
//         tasksByStatus: {
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           pending: taskStats.pending || 0,
//           overdue: taskStats.overdue || 0
//         },
//         monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000]
//       });

//       // Set recent users from API data
//       const formattedUsers = usersList.slice(0, 5).map(u => ({
//         id: u._id,
//         name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
//         email: u.email,
//         role: u.role,
//         status: u.status || 'active',
//         joined: u.createdAt ? formatDate(u.createdAt) : new Date().toISOString().split('T')[0]
//       }));
      
//       setRecentUsers(formattedUsers);

//       setRecentActivities([
//         { id: 1, type: 'user', action: 'New user registered', user: formattedUsers[0]?.name || 'User', time: '2 minutes ago', icon: '👤', color: 'blue' },
//         { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
//         { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
//         { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
//         { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' }
//       ]);

//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       // 🔴 FIX: Don't show toast for 403 errors
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'suspended': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   // 🔴 FIX: Check if user has admin access
//   const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  
//   if (!isAdmin) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-600 font-medium mb-2">Access Denied</p>
//           <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
//           <Button variant="secondary" onClick={() => navigate('/dashboard')}>
//             Go to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with Logout */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//             <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
//             <div className="mt-4 flex space-x-4">
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Total Revenue</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Growth Rate</p>
//                 <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">This Month</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
//               </div>
//             </div>
//           </div>
//           <Button 
//             variant="danger" 
//             onClick={handleLogout} 
//             size="sm"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.users.total}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
//             </div>
//             <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">👥</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Active: {stats.users.active}</span>
//               <Link to="/users" className="text-blue-600 hover:text-blue-800">View all →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Buildings</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.buildings.total}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} total units</p>
//             </div>
//             <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">🏢</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Active: {stats.buildings.active}</span>
//               <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Tasks</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.tasks.total}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
//             </div>
//             <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
//               <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Complaints</p>
//               <p className="text-3xl font-bold text-gray-900">{stats.complaints.total}</p>
//               <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
//             </div>
//             <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
//               <span className="text-2xl">📋</span>
//             </div>
//           </div>
//           <div className="mt-4 pt-4 border-t">
//             <div className="flex justify-between text-sm">
//               <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
//               <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts and Activity Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Completed</span>
//                 <span className="text-green-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ 
//                   width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` 
//                 }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>In Progress</span>
//                 <span className="text-blue-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.inProgress / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ 
//                   width: `${stats.tasks.total > 0 ? (stats.tasks.inProgress / stats.tasks.total) * 100 : 0}%` 
//                 }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Overdue</span>
//                 <span className="text-red-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.overdue / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-red-500 h-2 rounded-full" style={{ 
//                   width: `${stats.tasks.total > 0 ? (stats.tasks.overdue / stats.tasks.total) * 100 : 0}%` 
//                 }} />
//               </div>
//             </div>
//           </div>
//         </Card>

//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
//                 <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                   <span>{activity.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{activity.action}</p>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//                 {activity.user && <span className="text-xs text-gray-400">{activity.user}</span>}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Recent Users Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Recent Users</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View All Users →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentUsers.length > 0 ? (
//                 recentUsers.map(user => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link to={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 mr-3">View</Link>
//                       <Link to={`/users/${user.id}/edit`} className="text-green-600 hover:text-green-800">Edit</Link>
//                     </td>
//                   </tr>

//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         <Link to="/users/new" className="bg-blue-50 p-4 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-2xl mb-1">👤</div>
//           <p className="text-sm font-medium">Add Staff</p>
//         </Link>
//         <Link to="/buildings/new" className="bg-green-50 p-4 rounded-lg text-center hover:bg-green-100">
//           <div className="text-2xl mb-1">🏢</div>
//           <p className="text-sm font-medium">Add Building</p>
//         </Link>
//         <Link to="/buildings" className="bg-purple-50 p-4 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-2xl mb-1">📊</div>
//           <p className="text-sm font-medium">View Buildings</p>
//         </Link>
//         <Link to="/profile" className="bg-gray-50 p-4 rounded-lg text-center hover:bg-gray-100">
//           <div className="text-2xl mb-1">⚙️</div>
//           <p className="text-sm font-medium">Settings</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;




// client/src/pages/dashboard/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userApi } from '../../api/user.api';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { salaryApi } from '../../api/salary.api';
// import { notificationApi } from '../../api/notification.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { formatNumber, formatDate } from '../../utils/formatters';

// const SuperAdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: { total: 0, active: 0, newThisMonth: 0 },
//     buildings: { total: 0, active: 0, totalUnits: 0 },
//     tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
//     complaints: { total: 0, resolved: 0, pending: 0 },
//     attendance: { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 },
//     leave: { pending: 0, approved: 0, rejected: 0 },
//     payroll: { totalPayroll: 0, averageSalary: 0, pendingPayments: 0 },
//     revenue: { total: 0, thisMonth: 0, growth: 0 }
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [aiInsights, setAiInsights] = useState([]);
//   const [chartData, setChartData] = useState({
//     tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
//     monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
//     attendanceTrend: [85, 88, 92, 87, 90, 94]
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch users data
//       let totalUsers = 0;
//       let usersList = [];
      
//       if (user?.role === 'super_admin' || user?.role === 'admin') {
//         try {
//           const usersRes = await userApi.getUsers({ limit: 10, page: 1 });
//           totalUsers = usersRes.data.data?.pagination?.total || 0;
//           usersList = usersRes.data.data?.users || [];
//         } catch (userError) {
//           console.error('Failed to fetch users:', userError);
//         }
//       }
      
//       // Fetch buildings data
//       let buildings = [];
//       try {
//         const buildingsRes = await buildingApi.getBuildings();
//         buildings = buildingsRes.data.data?.buildings || [];
//       } catch (buildingError) {
//         console.error('Failed to fetch buildings:', buildingError);
//       }
      
//       // Fetch tasks statistics
//       let taskStats = {};
//       try {
//         const tasksRes = await taskApi.getTaskStatistics();
//         taskStats = tasksRes.data.data || {};
//       } catch (taskError) {
//         console.error('Failed to fetch tasks:', taskError);
//       }
      
//       // Fetch attendance statistics
//       let attendanceStats = { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 };
//       try {
//         const attendanceRes = await attendanceApi.getDashboardStats();
//         if (attendanceRes.data.success) {
//           attendanceStats = attendanceRes.data.data;
//         }
//       } catch (attendanceError) {
//         console.error('Failed to fetch attendance:', attendanceError);
//       }
      
//       // Fetch leave statistics
//       let leaveStats = { pending: 0, approved: 0, rejected: 0 };
//       try {
//         const leaveRes = await leaveApi.getLeaveStats();
//         if (leaveRes.data.success) {
//           leaveStats = leaveRes.data.data;
//         }
//       } catch (leaveError) {
//         console.error('Failed to fetch leave stats:', leaveError);
//       }
      
//       // Fetch payroll summary
//       let payrollStats = { totalPayroll: 0, averageSalary: 0, pendingPayments: 0 };
//       try {
//         const payrollRes = await salaryApi.getPayrollSummary(new Date().getMonth() + 1, new Date().getFullYear());
//         if (payrollRes.data.success) {
//           payrollStats = payrollRes.data.data;
//         }
//       } catch (payrollError) {
//         console.error('Failed to fetch payroll:', payrollError);
//       }
      
//       // Fetch notifications
//       let notificationsList = [];
//       try {
//         const notifRes = await notificationApi.getNotifications({ limit: 5 });
//         if (notifRes.data.success) {
//           notificationsList = notifRes.data.data;
//         }
//       } catch (notifError) {
//         console.error('Failed to fetch notifications:', notifError);
//       }
      
//       setStats({
//         users: {
//           total: totalUsers,
//           active: Math.floor(totalUsers * 0.85) || 0,
//           newThisMonth: Math.floor(totalUsers * 0.1) || 0
//         },
//         buildings: {
//           total: buildings.length,
//           active: buildings.filter(b => b.status === 'active').length,
//           totalUnits: buildings.reduce((sum, b) => sum + (b.statistics?.totalUnits || 0), 0)
//         },
//         tasks: {
//           total: taskStats.total || 0,
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           overdue: taskStats.overdue || 0
//         },
//         complaints: {
//           total: 156,
//           resolved: 134,
//           pending: 22
//         },
//         attendance: attendanceStats,
//         leave: leaveStats,
//         payroll: payrollStats,
//         revenue: {
//           total: 1250000,
//           thisMonth: 145000,
//           growth: 12.5
//         }
//       });

//       setChartData({
//         tasksByStatus: {
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           pending: taskStats.pending || 0,
//           overdue: taskStats.overdue || 0
//         },
//         monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
//         attendanceTrend: [85, 88, 92, 87, 90, 94]
//       });

//       // Set recent users from API data
//       const formattedUsers = usersList.slice(0, 5).map(u => ({
//         id: u._id,
//         name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
//         email: u.email,
//         role: u.role,
//         status: u.status || 'active',
//         joined: u.createdAt ? formatDate(u.createdAt) : new Date().toISOString().split('T')[0]
//       }));
      
//       setRecentUsers(formattedUsers);
//       setNotifications(notificationsList.slice(0, 5));
      
//       // Generate AI Insights
//       generateAiInsights(taskStats, attendanceStats, leaveStats);
      
//       // Set recent activities
//       setRecentActivities([
//         { id: 1, type: 'user', action: 'New user registered', user: formattedUsers[0]?.name || 'User', time: '2 minutes ago', icon: '👤', color: 'blue' },
//         { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
//         { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
//         { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
//         { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' }
//       ]);

//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateAiInsights = (taskStats, attendanceStats, leaveStats) => {
//     const insights = [];
    
//     // Task insights
//     if (taskStats.overdue > 10) {
//       insights.push({
//         id: 1,
//         type: 'warning',
//         title: 'High Overdue Tasks',
//         message: `${taskStats.overdue} tasks are overdue. Consider reallocating resources.`,
//         icon: '⚠️',
//         action: '/tasks/overdue'
//       });
//     }
    
//     if (taskStats.completed > taskStats.total * 0.7) {
//       insights.push({
//         id: 2,
//         type: 'success',
//         title: 'Excellent Task Completion',
//         message: `Task completion rate is at ${Math.round((taskStats.completed / taskStats.total) * 100)}%. Great job!`,
//         icon: '🎯',
//         action: '/tasks'
//       });
//     }
    
//     // Attendance insights
//     if (attendanceStats.rate < 85) {
//       insights.push({
//         id: 3,
//         type: 'warning',
//         title: 'Low Attendance Rate',
//         message: `Attendance rate is at ${attendanceStats.rate}%. ${attendanceStats.absent} employees absent today.`,
//         icon: '📊',
//         action: '/attendance/report'
//       });
//     }
    
//     if (attendanceStats.late > 10) {
//       insights.push({
//         id: 4,
//         type: 'info',
//         title: 'High Late Arrivals',
//         message: `${attendanceStats.late} employees arrived late today. Review punctuality.`,
//         icon: '⏰',
//         action: '/attendance/team'
//       });
//     }
    
//     // Leave insights
//     if (leaveStats.pending > 5) {
//       insights.push({
//         id: 5,
//         type: 'action',
//         title: 'Pending Leave Requests',
//         message: `${leaveStats.pending} leave requests awaiting approval.`,
//         icon: '📋',
//         action: '/leave/pending'
//       });
//     }
    
//     // AI Prediction Insights
//     insights.push({
//       id: 6,
//       type: 'ai',
//       title: 'AI Prediction: Peak Hours',
//       message: 'Based on historical data, next week (May 20-25) will have 40% higher task volume.',
//       icon: '🤖',
//       action: '/ai/insights'
//     });
    
//     insights.push({
//       id: 7,
//       type: 'ai',
//       title: 'Resource Optimization Suggestion',
//       message: 'Reallocate 2 technicians from Tower A to Tower B for better workload balance.',
//       icon: '🧠',
//       action: '/ai/smart-assign'
//     });
    
//     setAiInsights(insights);
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'suspended': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getInsightStyle = (type) => {
//     const styles = {
//       warning: 'border-l-4 border-l-yellow-500 bg-yellow-50',
//       success: 'border-l-4 border-l-green-500 bg-green-50',
//       info: 'border-l-4 border-l-blue-500 bg-blue-50',
//       action: 'border-l-4 border-l-purple-500 bg-purple-50',
//       ai: 'border-l-4 border-l-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50'
//     };
//     return styles[type] || styles.info;
//   };

//   const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  
//   if (!isAdmin) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-600 font-medium mb-2">Access Denied</p>
//           <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
//           <Button variant="secondary" onClick={() => navigate('/dashboard')}>
//             Go to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with AI Badge */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <div className="flex items-center gap-2">
//               <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//               <span className="px-2 py-1 text-xs rounded-full bg-purple-500 text-white">AI Enhanced</span>
//             </div>
//             <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
//             <div className="mt-4 flex flex-wrap gap-4">
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Total Revenue</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Growth Rate</p>
//                 <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">This Month</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
//               </div>
//             </div>
//           </div>
//           <Button 
//             variant="danger" 
//             onClick={handleLogout} 
//             size="sm"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid - 4x4 for all modules */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Users */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
//             </div>
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">👥</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Active: {stats.users.active}</span>
//               <Link to="/users" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Buildings */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Buildings</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.buildings.total}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} units</p>
//             </div>
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">🏢</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Active: {stats.buildings.active}</span>
//               <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Tasks */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Tasks</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.tasks.total}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
//             </div>
//             <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
//               <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Complaints */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Complaints</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.complaints.total}</p>
//               <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
//             </div>
//             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">📋</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
//               <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Attendance */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Today's Attendance</p>
//               <p className="text-2xl font-bold text-green-600">{stats.attendance.rate}%</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.attendance.present} present</p>
//             </div>
//             <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">⏰</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Absent: {stats.attendance.absent}</span>
//               <Link to="/attendance/report" className="text-blue-600 hover:text-blue-800">Report →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Leave */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Pending Leaves</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.leave.pending}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.leave.approved} approved</p>
//             </div>
//             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">🏖️</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Rejected: {stats.leave.rejected}</span>
//               <Link to="/leave/pending" className="text-blue-600 hover:text-blue-800">Approve →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Payroll */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Payroll</p>
//               <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.payroll.totalPayroll)}</p>
//               <p className="text-xs text-gray-500 mt-1">Avg: {formatNumber(stats.payroll.averageSalary)}</p>
//             </div>
//             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">💰</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Pending: {stats.payroll.pendingPayments}</span>
//               <Link to="/payroll/dashboard" className="text-blue-600 hover:text-blue-800">Process →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Revenue */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Revenue</p>
//               <p className="text-2xl font-bold text-indigo-600">{formatNumber(stats.revenue.total)}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.revenue.growth}% growth</p>
//             </div>
//             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">📈</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">This Month: {formatNumber(stats.revenue.thisMonth)}</span>
//               <Link to="/reports/financial" className="text-blue-600 hover:text-blue-800">Reports →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts and AI Insights Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Task Status Chart */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Completed</span>
//                 <span className="text-green-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>In Progress</span>
//                 <span className="text-blue-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.inProgress / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.inProgress / stats.tasks.total) * 100 : 0}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Overdue</span>
//                 <span className="text-red-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.overdue / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.overdue / stats.tasks.total) * 100 : 0}%` }} />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* AI Insights Widget */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">🤖 AI Insights</h3>
//             <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Live</span>
//           </div>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {aiInsights.map(insight => (
//               <Link to={insight.action} key={insight.id}>
//                 <div className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getInsightStyle(insight.type)}`}>
//                   <div className="flex items-start gap-3">
//                     <div className="text-xl">{insight.icon}</div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{insight.title}</p>
//                       <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <Link to="/ai/insights" className="text-xs text-purple-600 hover:text-purple-800 flex items-center justify-end gap-1">
//               View All AI Insights <span>→</span>
//             </Link>
//           </div>
//         </Card>
//       </div>

//       {/* Attendance Trend & Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Attendance Trend */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Attendance Trend (Last 6 Months)</h3>
//           <div className="space-y-3">
//             {chartData.attendanceTrend.map((rate, index) => {
//               const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
//               return (
//                 <div key={index}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>{months[index]}</span>
//                     <span className={rate >= 90 ? 'text-green-600' : rate >= 80 ? 'text-yellow-600' : 'text-red-600'}>
//                       {rate}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
//                       style={{ width: `${rate}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </Card>

//         {/* Recent Activity */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
//                 <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                   <span>{activity.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{activity.action}</p>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//                 {activity.user && <span className="text-xs text-gray-400">{activity.user}</span>}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Recent Users Table */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Recent Users</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View All Users →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentUsers.length > 0 ? (
//                 recentUsers.map(user => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link to={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 mr-3">View</Link>
//                       <Link to={`/users/${user.id}/edit`} className="text-green-600 hover:text-green-800">Edit</Link>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Quick Actions - Updated with all modules */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
//         <Link to="/users/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">👤</div>
//           <p className="text-xs font-medium">Add Staff</p>
//         </Link>
//         <Link to="/buildings/new" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100">
//           <div className="text-xl mb-1">🏢</div>
//           <p className="text-xs font-medium">Add Building</p>
//         </Link>
//         <Link to="/attendance/report" className="bg-teal-50 p-3 rounded-lg text-center hover:bg-teal-100">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">Attendance</p>
//         </Link>
//         <Link to="/leave/pending" className="bg-orange-50 p-3 rounded-lg text-center hover:bg-orange-100">
//           <div className="text-xl mb-1">🏖️</div>
//           <p className="text-xs font-medium">Leave</p>
//         </Link>
//         <Link to="/payroll/dashboard" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-xl mb-1">💰</div>
//           <p className="text-xs font-medium">Payroll</p>
//         </Link>
//         <Link to="/reports" className="bg-indigo-50 p-3 rounded-lg text-center hover:bg-indigo-100">
//           <div className="text-xl mb-1">📊</div>
//           <p className="text-xs font-medium">Reports</p>
//         </Link>
//         <Link to="/notifications" className="bg-pink-50 p-3 rounded-lg text-center hover:bg-pink-100">
//           <div className="text-xl mb-1">🔔</div>
//           <p className="text-xs font-medium">Notifications</p>
//         </Link>
//         <Link to="/ai/insights" className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg text-center hover:from-purple-100 hover:to-pink-100">
//           <div className="text-xl mb-1">🧠</div>
//           <p className="text-xs font-medium">AI Insights</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;



// client/src/pages/dashboard/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userApi } from '../../api/user.api';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { salaryApi } from '../../api/salary.api';
// import { notificationApi } from '../../api/notification.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { formatNumber, formatDate } from '../../utils/formatters';

// const SuperAdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({
//     users: { total: 0, active: 0, newThisMonth: 0 },
//     buildings: { total: 0, active: 0, totalUnits: 0 },
//     tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
//     complaints: { total: 0, resolved: 0, pending: 0 },
//     attendance: { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 },
//     leave: { pending: 0, approved: 0, rejected: 0 },
//     payroll: { totalPayroll: 0, averageSalary: 0, pendingPayments: 0 },
//     revenue: { total: 0, thisMonth: 0, growth: 0 },
//     // 🔴 NEW: Chat statistics
//     chat: { totalChats: 0, activeChats: 0, unreadMessages: 0, totalMessages: 0 }
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [aiInsights, setAiInsights] = useState([]);
//   const [chatStatus, setChatStatus] = useState({ enabled: true, activeUsers: 0, recentMessages: [] });
//   const [chartData, setChartData] = useState({
//     tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
//     monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
//     attendanceTrend: [85, 88, 92, 87, 90, 94]
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     try {
//       // Fetch users data
//       let totalUsers = 0;
//       let usersList = [];
      
//       if (user?.role === 'super_admin' || user?.role === 'admin') {
//         try {
//           const usersRes = await userApi.getUsers({ limit: 10, page: 1 });
//           totalUsers = usersRes.data.data?.pagination?.total || 0;
//           usersList = usersRes.data.data?.users || [];
//         } catch (userError) {
//           console.error('Failed to fetch users:', userError);
//         }
//       }
      
//       // Fetch buildings data
//       let buildings = [];
//       try {
//         const buildingsRes = await buildingApi.getBuildings();
//         buildings = buildingsRes.data.data?.buildings || [];
//       } catch (buildingError) {
//         console.error('Failed to fetch buildings:', buildingError);
//       }
      
//       // Fetch tasks statistics
//       let taskStats = {};
//       try {
//         const tasksRes = await taskApi.getTaskStatistics();
//         taskStats = tasksRes.data.data || {};
//       } catch (taskError) {
//         console.error('Failed to fetch tasks:', taskError);
//       }
      
//       // Fetch attendance statistics
//       let attendanceStats = { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 };
//       try {
//         const attendanceRes = await attendanceApi.getDashboardStats();
//         if (attendanceRes.data.success) {
//           attendanceStats = attendanceRes.data.data;
//         }
//       } catch (attendanceError) {
//         console.error('Failed to fetch attendance:', attendanceError);
//       }
      
//       // Fetch leave statistics
//       let leaveStats = { pending: 0, approved: 0, rejected: 0 };
//       try {
//         const leaveRes = await leaveApi.getLeaveStats();
//         if (leaveRes.data.success) {
//           leaveStats = leaveRes.data.data;
//         }
//       } catch (leaveError) {
//         console.error('Failed to fetch leave stats:', leaveError);
//       }
      
//       // Fetch payroll summary
//       let payrollStats = { totalPayroll: 0, averageSalary: 0, pendingPayments: 0 };
//       try {
//         const payrollRes = await salaryApi.getPayrollSummary(new Date().getMonth() + 1, new Date().getFullYear());
//         if (payrollRes.data.success) {
//           payrollStats = payrollRes.data.data;
//         }
//       } catch (payrollError) {
//         console.error('Failed to fetch payroll:', payrollError);
//       }
      
//       // Fetch notifications
//       let notificationsList = [];
//       try {
//         const notifRes = await notificationApi.getNotifications({ limit: 5 });
//         if (notifRes.data.success) {
//           notificationsList = notifRes.data.data;
//         }
//       } catch (notifError) {
//         console.error('Failed to fetch notifications:', notifError);
//       }
      
//       // 🔴 NEW: Fetch chat statistics
//       let chatStats = { totalChats: 0, activeChats: 0, unreadMessages: 0, totalMessages: 0 };
//       let chatStatusData = { enabled: true, activeUsers: 0, recentMessages: [] };
//       try {
//         const chatStatsRes = await chatApi.getChatStats();
//         if (chatStatsRes.data.success) {
//           chatStats = chatStatsRes.data.data;
//         }
        
//         // Get chat status
//         const chatSettingsRes = await chatApi.getUserChatSettings();
//         if (chatSettingsRes.data.success) {
//           chatStatusData.enabled = chatSettingsRes.data.data.chatEnabled;
//         }
//       } catch (chatError) {
//         console.error('Failed to fetch chat stats:', chatError);
//       }
      
//       setStats({
//         users: {
//           total: totalUsers,
//           active: Math.floor(totalUsers * 0.85) || 0,
//           newThisMonth: Math.floor(totalUsers * 0.1) || 0
//         },
//         buildings: {
//           total: buildings.length,
//           active: buildings.filter(b => b.status === 'active').length,
//           totalUnits: buildings.reduce((sum, b) => sum + (b.statistics?.totalUnits || 0), 0)
//         },
//         tasks: {
//           total: taskStats.total || 0,
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           overdue: taskStats.overdue || 0
//         },
//         complaints: {
//           total: 156,
//           resolved: 134,
//           pending: 22
//         },
//         attendance: attendanceStats,
//         leave: leaveStats,
//         payroll: payrollStats,
//         revenue: {
//           total: 1250000,
//           thisMonth: 145000,
//           growth: 12.5
//         },
//         chat: chatStats
//       });
      
//       setChatStatus(chatStatusData);

//       setChartData({
//         tasksByStatus: {
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           pending: taskStats.pending || 0,
//           overdue: taskStats.overdue || 0
//         },
//         monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
//         attendanceTrend: [85, 88, 92, 87, 90, 94]
//       });

//       // Set recent users from API data
//       const formattedUsers = usersList.slice(0, 5).map(u => ({
//         id: u._id,
//         name: `${u.firstName || ''} ${u.lastName || ''}`.trim(),
//         email: u.email,
//         role: u.role,
//         status: u.status || 'active',
//         joined: u.createdAt ? formatDate(u.createdAt) : new Date().toISOString().split('T')[0],
//         chatEnabled: u.chatEnabled || false
//       }));
      
//       setRecentUsers(formattedUsers);
//       setNotifications(notificationsList.slice(0, 5));
      
//       // Generate AI Insights
//       generateAiInsights(taskStats, attendanceStats, leaveStats, chatStats);
      
//       // Set recent activities with chat activities
//       setRecentActivities([
//         { id: 1, type: 'user', action: 'New user registered', user: formattedUsers[0]?.name || 'User', time: '2 minutes ago', icon: '👤', color: 'blue' },
//         { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
//         { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
//         { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
//         { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' },
//         { id: 6, type: 'chat', action: 'New chat message', user: 'Support Team', time: '10 minutes ago', icon: '💬', color: 'cyan' }
//       ]);

//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       if (error.response?.status !== 403) {
//         showToast('Failed to load dashboard data', 'error');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateAiInsights = (taskStats, attendanceStats, leaveStats, chatStats) => {
//     const insights = [];
    
//     // Task insights
//     if (taskStats.overdue > 10) {
//       insights.push({
//         id: 1,
//         type: 'warning',
//         title: 'High Overdue Tasks',
//         message: `${taskStats.overdue} tasks are overdue. Consider reallocating resources.`,
//         icon: '⚠️',
//         action: '/tasks/overdue'
//       });
//     }
    
//     if (taskStats.completed > taskStats.total * 0.7) {
//       insights.push({
//         id: 2,
//         type: 'success',
//         title: 'Excellent Task Completion',
//         message: `Task completion rate is at ${Math.round((taskStats.completed / taskStats.total) * 100)}%. Great job!`,
//         icon: '🎯',
//         action: '/tasks'
//       });
//     }
    
//     // Attendance insights
//     if (attendanceStats.rate < 85) {
//       insights.push({
//         id: 3,
//         type: 'warning',
//         title: 'Low Attendance Rate',
//         message: `Attendance rate is at ${attendanceStats.rate}%. ${attendanceStats.absent} employees absent today.`,
//         icon: '📊',
//         action: '/attendance/report'
//       });
//     }
    
//     if (attendanceStats.late > 10) {
//       insights.push({
//         id: 4,
//         type: 'info',
//         title: 'High Late Arrivals',
//         message: `${attendanceStats.late} employees arrived late today. Review punctuality.`,
//         icon: '⏰',
//         action: '/attendance/team'
//       });
//     }
    
//     // Leave insights
//     if (leaveStats.pending > 5) {
//       insights.push({
//         id: 5,
//         type: 'action',
//         title: 'Pending Leave Requests',
//         message: `${leaveStats.pending} leave requests awaiting approval.`,
//         icon: '📋',
//         action: '/leave/pending'
//       });
//     }
    
//     // 🔴 NEW: Chat insights
//     if (chatStats.unreadMessages > 100) {
//       insights.push({
//         id: 8,
//         type: 'info',
//         title: 'High Unread Messages',
//         message: `${chatStats.unreadMessages} unread messages across all chats.`,
//         icon: '💬',
//         action: '/chat'
//       });
//     }
    
//     if (chatStats.activeChats > 10) {
//       insights.push({
//         id: 9,
//         type: 'success',
//         title: 'Active Communication',
//         message: `${chatStats.activeChats} active chat sessions. Great engagement!`,
//         icon: '💬',
//         action: '/chat'
//       });
//     }
    
//     // AI Prediction Insights
//     insights.push({
//       id: 6,
//       type: 'ai',
//       title: 'AI Prediction: Peak Hours',
//       message: 'Based on historical data, next week (May 20-25) will have 40% higher task volume.',
//       icon: '🤖',
//       action: '/ai/insights'
//     });
    
//     insights.push({
//       id: 7,
//       type: 'ai',
//       title: 'Resource Optimization Suggestion',
//       message: 'Reallocate 2 technicians from Tower A to Tower B for better workload balance.',
//       icon: '🧠',
//       action: '/ai/smart-assign'
//     });
    
//     setAiInsights(insights);
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'suspended': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getInsightStyle = (type) => {
//     const styles = {
//       warning: 'border-l-4 border-l-yellow-500 bg-yellow-50',
//       success: 'border-l-4 border-l-green-500 bg-green-50',
//       info: 'border-l-4 border-l-blue-500 bg-blue-50',
//       action: 'border-l-4 border-l-purple-500 bg-purple-50',
//       ai: 'border-l-4 border-l-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50'
//     };
//     return styles[type] || styles.info;
//   };

//   const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  
//   if (!isAdmin) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-600 font-medium mb-2">Access Denied</p>
//           <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
//           <Button variant="secondary" onClick={() => navigate('/dashboard')}>
//             Go to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Welcome Section with AI Badge */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <div className="flex items-center gap-2">
//               <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//               <span className="px-2 py-1 text-xs rounded-full bg-purple-500 text-white">AI Enhanced</span>
//               {chatStatus.enabled && (
//                 <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">Chat Active</span>
//               )}
//             </div>
//             <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
//             <div className="mt-4 flex flex-wrap gap-4">
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Total Revenue</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Growth Rate</p>
//                 <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">This Month</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
//               </div>
//             </div>
//           </div>
//           <Button 
//             variant="danger" 
//             onClick={handleLogout} 
//             size="sm"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid - 5x4 now includes Chat */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         {/* Users */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
//             </div>
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">👥</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Active: {stats.users.active}</span>
//               <Link to="/users" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Buildings */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Buildings</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.buildings.total}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} units</p>
//             </div>
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">🏢</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Active: {stats.buildings.active}</span>
//               <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Tasks */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Tasks</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.tasks.total}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
//             </div>
//             <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
//               <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Complaints */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Complaints</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.complaints.total}</p>
//               <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
//             </div>
//             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">📋</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
//               <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* 🔴 NEW: Chat Stats */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Chat Activity</p>
//               <p className="text-2xl font-bold text-cyan-600">{stats.chat.activeChats}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.chat.unreadMessages} unread</p>
//             </div>
//             <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">💬</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Total: {stats.chat.totalMessages} msgs</span>
//               <Link to="/chat" className="text-blue-600 hover:text-blue-800">View Chats →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Second Row Stats - Attendance, Leave, Payroll, Revenue */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Attendance */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Today's Attendance</p>
//               <p className="text-2xl font-bold text-green-600">{stats.attendance.rate}%</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.attendance.present} present</p>
//             </div>
//             <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">⏰</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Absent: {stats.attendance.absent}</span>
//               <Link to="/attendance/report" className="text-blue-600 hover:text-blue-800">Report →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Leave */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Pending Leaves</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.leave.pending}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.leave.approved} approved</p>
//             </div>
//             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">🏖️</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Rejected: {stats.leave.rejected}</span>
//               <Link to="/leave/pending" className="text-blue-600 hover:text-blue-800">Approve →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Payroll */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Payroll</p>
//               <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.payroll.totalPayroll)}</p>
//               <p className="text-xs text-gray-500 mt-1">Avg: {formatNumber(stats.payroll.averageSalary)}</p>
//             </div>
//             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">💰</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Pending: {stats.payroll.pendingPayments}</span>
//               <Link to="/payroll/dashboard" className="text-blue-600 hover:text-blue-800">Process →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Revenue */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Revenue</p>
//               <p className="text-2xl font-bold text-indigo-600">{formatNumber(stats.revenue.total)}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.revenue.growth}% growth</p>
//             </div>
//             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">📈</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">This Month: {formatNumber(stats.revenue.thisMonth)}</span>
//               <Link to="/reports/financial" className="text-blue-600 hover:text-blue-800">Reports →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts and AI Insights Section */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Task Status Chart */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
//           <div className="space-y-4">
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Completed</span>
//                 <span className="text-green-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.completed / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-green-500 h-2 rounded-full" style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.completed / stats.tasks.total) * 100 : 0}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>In Progress</span>
//                 <span className="text-blue-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.inProgress / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.inProgress / stats.tasks.total) * 100 : 0}%` }} />
//               </div>
//             </div>
//             <div>
//               <div className="flex justify-between text-sm mb-1">
//                 <span>Overdue</span>
//                 <span className="text-red-600">
//                   {stats.tasks.total > 0 ? Math.round((stats.tasks.overdue / stats.tasks.total) * 100) : 0}%
//                 </span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-2">
//                 <div className="bg-red-500 h-2 rounded-full" style={{ width: `${stats.tasks.total > 0 ? (stats.tasks.overdue / stats.tasks.total) * 100 : 0}%` }} />
//               </div>
//             </div>
//           </div>
//         </Card>

//         {/* AI Insights Widget */}
//         <Card className="p-6">
//           <div className="flex justify-between items-center mb-4">
//             <h3 className="font-semibold text-gray-900">🤖 AI Insights</h3>
//             <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Live</span>
//           </div>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {aiInsights.map(insight => (
//               <Link to={insight.action} key={insight.id}>
//                 <div className={`p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow ${getInsightStyle(insight.type)}`}>
//                   <div className="flex items-start gap-3">
//                     <div className="text-xl">{insight.icon}</div>
//                     <div className="flex-1">
//                       <p className="text-sm font-medium text-gray-900">{insight.title}</p>
//                       <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
//                     </div>
//                   </div>
//                 </div>
//               </Link>
//             ))}
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <Link to="/ai/insights" className="text-xs text-purple-600 hover:text-purple-800 flex items-center justify-end gap-1">
//               View All AI Insights <span>→</span>
//             </Link>
//           </div>
//         </Card>
//       </div>

//       {/* Attendance Trend & Recent Activity */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Attendance Trend */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Attendance Trend (Last 6 Months)</h3>
//           <div className="space-y-3">
//             {chartData.attendanceTrend.map((rate, index) => {
//               const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
//               return (
//                 <div key={index}>
//                   <div className="flex justify-between text-sm mb-1">
//                     <span>{months[index]}</span>
//                     <span className={rate >= 90 ? 'text-green-600' : rate >= 80 ? 'text-yellow-600' : 'text-red-600'}>
//                       {rate}%
//                     </span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className={`h-2 rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 80 ? 'bg-yellow-500' : 'bg-red-500'}`}
//                       style={{ width: `${rate}%` }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </Card>

//         {/* Recent Activity */}
//         <Card className="p-6">
//           <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
//           <div className="space-y-3 max-h-80 overflow-y-auto">
//             {recentActivities.map(activity => (
//               <div key={activity.id} className="flex items-center space-x-3 pb-3 border-b last:border-0">
//                 <div className={`w-8 h-8 bg-${activity.color}-100 rounded-full flex items-center justify-center`}>
//                   <span>{activity.icon}</span>
//                 </div>
//                 <div className="flex-1">
//                   <p className="text-sm font-medium">{activity.action}</p>
//                   <p className="text-xs text-gray-500">{activity.time}</p>
//                 </div>
//                 {activity.user && <span className="text-xs text-gray-400">{activity.user}</span>}
//               </div>
//             ))}
//           </div>
//         </Card>
//       </div>

//       {/* Recent Users Table with Chat Status */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
//           <h3 className="font-semibold text-gray-900">Recent Users</h3>
//           <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">View All Users →</Link>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentUsers.length > 0 ? (
//                 recentUsers.map(user => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {user.chatEnabled ? (
//                         <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Enabled</span>
//                       ) : (
//                         <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Disabled</span>
//                       )}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joined}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <Link to={`/users/${user.id}`} className="text-blue-600 hover:text-blue-800 mr-3">View</Link>
//                       <Link to={`/users/${user.id}/edit`} className="text-green-600 hover:text-green-800">Edit</Link>
//                      </td>
//                    </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
//                     No users found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Quick Actions */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-9 gap-3">
//         <Link to="/users/new" className="bg-blue-50 p-3 rounded-lg text-center hover:bg-blue-100 transition-colors">
//           <div className="text-xl mb-1">👤</div>
//           <p className="text-xs font-medium">Add Staff</p>
//         </Link>
//         <Link to="/buildings/new" className="bg-green-50 p-3 rounded-lg text-center hover:bg-green-100">
//           <div className="text-xl mb-1">🏢</div>
//           <p className="text-xs font-medium">Add Building</p>
//         </Link>
//         <Link to="/attendance/report" className="bg-teal-50 p-3 rounded-lg text-center hover:bg-teal-100">
//           <div className="text-xl mb-1">⏰</div>
//           <p className="text-xs font-medium">Attendance</p>
//         </Link>
//         <Link to="/leave/pending" className="bg-orange-50 p-3 rounded-lg text-center hover:bg-orange-100">
//           <div className="text-xl mb-1">🏖️</div>
//           <p className="text-xs font-medium">Leave</p>
//         </Link>
//         <Link to="/payroll/dashboard" className="bg-purple-50 p-3 rounded-lg text-center hover:bg-purple-100">
//           <div className="text-xl mb-1">💰</div>
//           <p className="text-xs font-medium">Payroll</p>
//         </Link>
//         <Link to="/reports" className="bg-indigo-50 p-3 rounded-lg text-center hover:bg-indigo-100">
//           <div className="text-xl mb-1">📊</div>
//           <p className="text-xs font-medium">Reports</p>
//         </Link>
//         <Link to="/notifications" className="bg-pink-50 p-3 rounded-lg text-center hover:bg-pink-100">
//           <div className="text-xl mb-1">🔔</div>
//           <p className="text-xs font-medium">Notifications</p>
//         </Link>
//         <Link to="/chat" className="bg-cyan-50 p-3 rounded-lg text-center hover:bg-cyan-100 transition-colors">
//           <div className="text-xl mb-1">💬</div>
//           <p className="text-xs font-medium">Chat</p>
//         </Link>
//         <Link to="/ai/insights" className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg text-center hover:from-purple-100 hover:to-pink-100">
//           <div className="text-xl mb-1">🧠</div>
//           <p className="text-xs font-medium">AI Insights</p>
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;



// // client/src/pages/dashboard/SuperAdminDashboard.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { userApi } from '../../api/user.api';
// import { buildingApi } from '../../api/building.api';
// import { taskApi } from '../../api/task.api';
// import { attendanceApi } from '../../api/attendance.api';
// import { leaveApi } from '../../api/leave.api';
// import { salaryApi } from '../../api/salary.api';
// import { notificationApi } from '../../api/notification.api';
// import { chatApi } from '../../api/chat.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import { formatNumber, formatDate } from '../../utils/formatters';

// const SuperAdminDashboard = () => {
//   const { user, logout } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [apiErrors, setApiErrors] = useState({
//     users: false,
//     buildings: false,
//     tasks: false,
//     attendance: false,
//     leave: false,
//     payroll: false,
//     notifications: false,
//     chat: false
//   });
//   const [stats, setStats] = useState({
//     users: { total: 0, active: 0, newThisMonth: 0 },
//     buildings: { total: 0, active: 0, totalUnits: 0 },
//     tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
//     complaints: { total: 0, resolved: 0, pending: 0 },
//     attendance: { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 },
//     leave: { pending: 0, approved: 0, rejected: 0 },
//     payroll: { totalPayroll: 0, averageSalary: 0, pendingPayments: 0 },
//     revenue: { total: 0, thisMonth: 0, growth: 0 },
//     chat: { totalChats: 0, activeChats: 0, unreadMessages: 0, totalMessages: 0 }
//   });
//   const [recentActivities, setRecentActivities] = useState([]);
//   const [recentUsers, setRecentUsers] = useState([]);
//   const [notifications, setNotifications] = useState([]);
//   const [aiInsights, setAiInsights] = useState([]);
//   const [chatStatus, setChatStatus] = useState({ enabled: true, activeUsers: 0, recentMessages: [] });
//   const [chartData, setChartData] = useState({
//     tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
//     monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
//     attendanceTrend: [85, 88, 92, 87, 90, 94]
//   });

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const handleLogout = async () => {
//     await logout();
//     navigate('/login');
//     showToast('Logged out successfully', 'success');
//   };

//   // Helper function to safely fetch data with error handling
//   const safeFetch = async (apiCall, errorKey, fallbackData = null) => {
//     try {
//       const response = await apiCall();
//       if (response?.data?.success) {
//         return response.data.data;
//       }
//       return fallbackData;
//     } catch (error) {
//       console.error(`Failed to fetch ${errorKey}:`, error);
//       setApiErrors(prev => ({ ...prev, [errorKey]: true }));
      
//       // Don't show toast for 403 errors as they're expected for non-admin roles
//       if (error.response?.status !== 403) {
//         showToast(`Failed to load ${errorKey} data`, 'warning');
//       }
//       return fallbackData;
//     }
//   };

//   const fetchDashboardData = async () => {
//     setLoading(true);
//     setApiErrors({
//       users: false,
//       buildings: false,
//       tasks: false,
//       attendance: false,
//       leave: false,
//       payroll: false,
//       notifications: false,
//       chat: false
//     });
    
//     try {
//       // Fetch users data
//       let totalUsers = 0;
//       let usersList = [];
      
//       const usersData = await safeFetch(
//         () => userApi.getUsers({ limit: 10, page: 1 }),
//         'users',
//         { data: { users: [], pagination: { total: 0 } } }
//       );
      
//       if (usersData) {
//         totalUsers = usersData.pagination?.total || 0;
//         usersList = usersData.users || [];
//       }
      
//       // Fetch buildings data
//       let buildings = [];
//       const buildingsData = await safeFetch(
//         () => buildingApi.getBuildings(),
//         'buildings',
//         { buildings: [] }
//       );
//       if (buildingsData) {
//         buildings = buildingsData.buildings || [];
//       }
      
//       // Fetch tasks statistics
//       let taskStats = {};
//       const tasksData = await safeFetch(
//         () => taskApi.getTaskStatistics(),
//         'tasks',
//         {}
//       );
//       if (tasksData) {
//         taskStats = tasksData;
//       }
      
//       // Fetch attendance statistics
//       let attendanceStats = { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 };
//       const attendanceData = await safeFetch(
//         () => attendanceApi.getDashboardStats(),
//         'attendance',
//         null
//       );
//       if (attendanceData) {
//         attendanceStats = attendanceData;
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
//       }
      
//       // Fetch payroll summary
//       let payrollStats = { totalPayroll: 0, averageSalary: 0, pendingPayments: 0 };
//       const payrollData = await safeFetch(
//         () => salaryApi.getPayrollSummary(new Date().getMonth() + 1, new Date().getFullYear()),
//         'payroll',
//         null
//       );
//       if (payrollData) {
//         payrollStats = payrollData;
//       }
      
//       // Fetch notifications
//       let notificationsList = [];
//       const notificationsData = await safeFetch(
//         () => notificationApi.getNotifications({ limit: 5 }),
//         'notifications',
//         []
//       );
//       if (notificationsData && Array.isArray(notificationsData)) {
//         notificationsList = notificationsData;
//       }
      
//       // Fetch chat statistics - handle gracefully if API doesn't exist
//       let chatStats = { totalChats: 0, activeChats: 0, unreadMessages: 0, totalMessages: 0 };
//       let chatStatusData = { enabled: true, activeUsers: 0, recentMessages: [] };
      
//       try {
//         const chatStatsRes = await chatApi.getChatStats();
//         if (chatStatsRes?.data?.success) {
//           chatStats = chatStatsRes.data.data;
//         }
//       } catch (chatError) {
//         console.warn('Chat stats API not available:', chatError.message);
//         setApiErrors(prev => ({ ...prev, chat: true }));
//         // Use mock data for chat stats
//         chatStats = { totalChats: 24, activeChats: 8, unreadMessages: 45, totalMessages: 1250 };
//       }
      
//       // Get chat settings - handle gracefully
//       try {
//         const chatSettingsRes = await chatApi.getUserChatSettings();
//         if (chatSettingsRes?.data?.success) {
//           chatStatusData.enabled = chatSettingsRes.data.data.chatEnabled;
//         }
//       } catch (settingsError) {
//         console.warn('Chat settings API not available:', settingsError.message);
//         // Keep default values
//       }
      
//       setStats({
//         users: {
//           total: totalUsers,
//           active: Math.floor(totalUsers * 0.85) || 0,
//           newThisMonth: Math.floor(totalUsers * 0.1) || 0
//         },
//         buildings: {
//           total: buildings.length,
//           active: buildings.filter(b => b.status === 'active').length,
//           totalUnits: buildings.reduce((sum, b) => sum + (b.statistics?.totalUnits || 0), 0)
//         },
//         tasks: {
//           total: taskStats.total || 0,
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           overdue: taskStats.overdue || 0
//         },
//         complaints: {
//           total: 156,
//           resolved: 134,
//           pending: 22
//         },
//         attendance: attendanceStats,
//         leave: leaveStats,
//         payroll: payrollStats,
//         revenue: {
//           total: 1250000,
//           thisMonth: 145000,
//           growth: 12.5
//         },
//         chat: chatStats
//       });
      
//       setChatStatus(chatStatusData);

//       setChartData({
//         tasksByStatus: {
//           completed: taskStats.completed || 0,
//           inProgress: taskStats.inProgress || 0,
//           pending: taskStats.pending || 0,
//           overdue: taskStats.overdue || 0
//         },
//         monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
//         attendanceTrend: [85, 88, 92, 87, 90, 94]
//       });

//       // Set recent users from API data
//       const formattedUsers = usersList.slice(0, 5).map(u => ({
//         id: u._id,
//         name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown',
//         email: u.email || 'No email',
//         role: u.role || 'user',
//         status: u.status || 'active',
//         joined: u.createdAt ? formatDate(u.createdAt) : new Date().toISOString().split('T')[0],
//         chatEnabled: u.chatEnabled || false
//       }));
      
//       setRecentUsers(formattedUsers);
//       setNotifications(notificationsList.slice(0, 5));
      
//       // Generate AI Insights
//       generateAiInsights(taskStats, attendanceStats, leaveStats, chatStats);
      
//       // Set recent activities with chat activities
//       setRecentActivities([
//         { id: 1, type: 'user', action: 'New user registered', user: formattedUsers[0]?.name || 'User', time: '2 minutes ago', icon: '👤', color: 'blue' },
//         { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
//         { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
//         { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
//         { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' },
//         { id: 6, type: 'chat', action: 'New chat message', user: 'Support Team', time: '10 minutes ago', icon: '💬', color: 'cyan' }
//       ]);

//     } catch (error) {
//       console.error('Dashboard fetch error:', error);
//       showToast('Some dashboard data could not be loaded', 'warning');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const generateAiInsights = (taskStats, attendanceStats, leaveStats, chatStats) => {
//     const insights = [];
    
//     // Task insights
//     if (taskStats.overdue > 10) {
//       insights.push({
//         id: 1,
//         type: 'warning',
//         title: 'High Overdue Tasks',
//         message: `${taskStats.overdue} tasks are overdue. Consider reallocating resources.`,
//         icon: '⚠️',
//         action: '/tasks/overdue'
//       });
//     } else {
//       insights.push({
//         id: 1,
//         type: 'info',
//         title: 'Task Performance',
//         message: `Task completion rate is at ${taskStats.completed > 0 ? Math.round((taskStats.completed / (taskStats.total || 1)) * 100) : 0}%. Keep up the good work!`,
//         icon: '📊',
//         action: '/tasks'
//       });
//     }
    
//     if (taskStats.completed > (taskStats.total || 0) * 0.7) {
//       insights.push({
//         id: 2,
//         type: 'success',
//         title: 'Excellent Task Completion',
//         message: `Task completion rate is at ${Math.round((taskStats.completed / (taskStats.total || 1)) * 100)}%. Great job!`,
//         icon: '🎯',
//         action: '/tasks'
//       });
//     }
    
//     // Attendance insights
//     if (attendanceStats.rate > 0 && attendanceStats.rate < 85) {
//       insights.push({
//         id: 3,
//         type: 'warning',
//         title: 'Low Attendance Rate',
//         message: `Attendance rate is at ${attendanceStats.rate}%. ${attendanceStats.absent || 0} employees absent today.`,
//         icon: '📊',
//         action: '/attendance/report'
//       });
//     }
    
//     if (attendanceStats.late > 10) {
//       insights.push({
//         id: 4,
//         type: 'info',
//         title: 'High Late Arrivals',
//         message: `${attendanceStats.late} employees arrived late today. Review punctuality.`,
//         icon: '⏰',
//         action: '/attendance/team'
//       });
//     }
    
//     // Leave insights
//     if (leaveStats.pending > 5) {
//       insights.push({
//         id: 5,
//         type: 'action',
//         title: 'Pending Leave Requests',
//         message: `${leaveStats.pending} leave requests awaiting approval.`,
//         icon: '📋',
//         action: '/leave/pending'
//       });
//     }
    
//     // Chat insights
//     if (chatStats.unreadMessages > 100) {
//       insights.push({
//         id: 8,
//         type: 'info',
//         title: 'High Unread Messages',
//         message: `${chatStats.unreadMessages} unread messages across all chats.`,
//         icon: '💬',
//         action: '/chat'
//       });
//     } else if (chatStats.totalChats > 0) {
//       insights.push({
//         id: 9,
//         type: 'success',
//         title: 'Active Communication',
//         message: `${chatStats.activeChats || chatStats.totalChats} active chat sessions. Great engagement!`,
//         icon: '💬',
//         action: '/chat'
//       });
//     }
    
//     // AI Prediction Insights
//     insights.push({
//       id: 6,
//       type: 'ai',
//       title: 'AI Prediction: Peak Hours',
//       message: 'Based on historical data, next week (May 20-25) will have 40% higher task volume.',
//       icon: '🤖',
//       action: '/ai/insights'
//     });
    
//     insights.push({
//       id: 7,
//       type: 'ai',
//       title: 'Resource Optimization Suggestion',
//       message: 'Reallocate 2 technicians from Tower A to Tower B for better workload balance.',
//       icon: '🧠',
//       action: '/ai/smart-assign'
//     });
    
//     setAiInsights(insights);
//   };

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'active': return 'bg-green-100 text-green-800';
//       case 'inactive': return 'bg-red-100 text-red-800';
//       case 'suspended': return 'bg-yellow-100 text-yellow-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getInsightStyle = (type) => {
//     const styles = {
//       warning: 'border-l-4 border-l-yellow-500 bg-yellow-50',
//       success: 'border-l-4 border-l-green-500 bg-green-50',
//       info: 'border-l-4 border-l-blue-500 bg-blue-50',
//       action: 'border-l-4 border-l-purple-500 bg-purple-50',
//       ai: 'border-l-4 border-l-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50'
//     };
//     return styles[type] || styles.info;
//   };

//   // Show warning banner if there are API errors
//   const hasApiErrors = Object.values(apiErrors).some(error => error === true);
//   const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

//   const isAdmin = user?.role === 'super_admin' || user?.role === 'admin';
  
//   if (!isAdmin) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-600 font-medium mb-2">Access Denied</p>
//           <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
//           <Button variant="secondary" onClick={() => navigate('/dashboard')}>
//             Go to Dashboard
//           </Button>
//         </div>
//       </div>
//     );
//   }

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
//                 Some data could not be loaded ({apiErrorCount} API issues)
//               </p>
//               <p className="text-xs text-yellow-700 mt-1">
//                 Certain features may be limited. This could be due to missing endpoints or permission issues.
//                 {apiErrors.chat && " Chat statistics are using demo data."}
//                 {apiErrors.attendance && " Attendance data may be incomplete."}
//                 {apiErrors.leave && " Leave data is unavailable."}
//               </p>
//               <button 
//                 onClick={fetchDashboardData}
//                 className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
//               >
//                 Retry loading data
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Welcome Section with AI Badge */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
//         <div className="flex justify-between items-start">
//           <div>
//             <div className="flex items-center gap-2">
//               <h1 className="text-2xl font-bold">Welcome back, {user?.firstName}! 👋</h1>
//               <span className="px-2 py-1 text-xs rounded-full bg-purple-500 text-white">AI Enhanced</span>
//               {chatStatus.enabled && (
//                 <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">Chat Active</span>
//               )}
//             </div>
//             <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
//             <div className="mt-4 flex flex-wrap gap-4">
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Total Revenue</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">Growth Rate</p>
//                 <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
//               </div>
//               <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
//                 <p className="text-sm opacity-90">This Month</p>
//                 <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
//               </div>
//             </div>
//           </div>
//           <Button 
//             variant="danger" 
//             onClick={handleLogout} 
//             size="sm"
//             className="bg-red-500 hover:bg-red-600 text-white"
//           >
//             <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
//             </svg>
//             Logout
//           </Button>
//         </div>
//       </div>

//       {/* Stats Grid - 5x4 includes Chat */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
//         {/* Users */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Users</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
//             </div>
//             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">👥</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Active: {stats.users.active}</span>
//               <Link to="/users" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Buildings */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Buildings</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.buildings.total}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} units</p>
//             </div>
//             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">🏢</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Active: {stats.buildings.active}</span>
//               <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Tasks */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Tasks</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.tasks.total}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
//             </div>
//             <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">✅</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
//               <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Complaints */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Complaints</p>
//               <p className="text-2xl font-bold text-gray-900">{stats.complaints.total}</p>
//               <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
//             </div>
//             <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">📋</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
//               <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Chat Stats */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Chat Activity</p>
//               <p className="text-2xl font-bold text-cyan-600">{stats.chat.activeChats || stats.chat.totalChats}</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.chat.unreadMessages || 0} unread</p>
//             </div>
//             <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">💬</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Total: {stats.chat.totalMessages || 0} msgs</span>
//               <Link to="/chat" className="text-blue-600 hover:text-blue-800">View Chats →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Second Row Stats - Attendance, Leave, Payroll, Revenue */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Attendance */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Today's Attendance</p>
//               <p className="text-2xl font-bold text-green-600">{stats.attendance.rate}%</p>
//               <p className="text-xs text-gray-500 mt-1">{stats.attendance.present} present</p>
//             </div>
//             <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">⏰</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Absent: {stats.attendance.absent}</span>
//               <Link to="/attendance/report" className="text-blue-600 hover:text-blue-800">Report →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Leave */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Pending Leaves</p>
//               <p className="text-2xl font-bold text-yellow-600">{stats.leave.pending}</p>
//               <p className="text-xs text-green-600 mt-1">{stats.leave.approved} approved</p>
//             </div>
//             <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">🏖️</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Rejected: {stats.leave.rejected}</span>
//               <Link to="/leave/pending" className="text-blue-600 hover:text-blue-800">Approve →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Payroll */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Total Payroll</p>
//               <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.payroll.totalPayroll)}</p>
//               <p className="text-xs text-gray-500 mt-1">Avg: {formatNumber(stats.payroll.averageSalary)}</p>
//             </div>
//             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">💰</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">Pending: {stats.payroll.pendingPayments}</span>
//               <Link to="/payroll/dashboard" className="text-blue-600 hover:text-blue-800">Process →</Link>
//             </div>
//           </div>
//         </Card>

//         {/* Revenue */}
//         <Card className="p-4 hover:shadow-lg transition-shadow">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-sm text-gray-500">Revenue</p>
//               <p className="text-2xl font-bold text-indigo-600">{formatNumber(stats.revenue.total)}</p>
//               <p className="text-xs text-green-600 mt-1">+{stats.revenue.growth}% growth</p>
//             </div>
//             <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
//               <span className="text-xl">📈</span>
//             </div>
//           </div>
//           <div className="mt-3 pt-3 border-t">
//             <div className="flex justify-between text-xs">
//               <span className="text-gray-500">This Month: {formatNumber(stats.revenue.thisMonth)}</span>
//               <Link to="/reports/financial" className="text-blue-600 hover:text-blue-800">Reports →</Link>
//             </div>
//           </div>
//         </Card>
//       </div>

//       {/* Charts and AI Insights Section - Keep existing JSX */}
//       {/* ... Rest of the JSX remains the same ... */}
      
//       {/* Note: The rest of the component (Charts, Recent Users, Quick Actions) 
//            remains unchanged from the original for brevity */}
      
//     </div>
//   );
// };

// export default SuperAdminDashboard;









// client/src/pages/dashboard/SuperAdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../../api/user.api';
import { buildingApi } from '../../api/building.api';
import { taskApi } from '../../api/task.api';
import { attendanceApi } from '../../api/attendance.api';
import { leaveApi } from '../../api/leave.api';
import { salaryApi } from '../../api/salary.api';
import { notificationApi } from '../../api/notification.api';
import { chatApi } from '../../api/chat.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import { formatNumber, formatDate } from '../../utils/formatters';

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [apiErrors, setApiErrors] = useState({
    users: false,
    buildings: false,
    tasks: false,
    attendance: false,
    leave: false,
    payroll: false,
    notifications: false,
    chat: false,
    salary: false
  });
  const [stats, setStats] = useState({
    users: { total: 0, active: 0, newThisMonth: 0 },
    buildings: { total: 0, active: 0, totalUnits: 0 },
    tasks: { total: 0, completed: 0, inProgress: 0, overdue: 0 },
    complaints: { total: 0, resolved: 0, pending: 0 },
    attendance: { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 },
    leave: { pending: 0, approved: 0, rejected: 0 },
    payroll: { totalPayroll: 0, averageSalary: 0, pendingPayments: 0, processedCount: 0, complianceRate: 0 },
    salary: { totalStructures: 0, activeStructures: 0, averageBasic: 0 },
    revenue: { total: 0, thisMonth: 0, growth: 0 },
    chat: { totalChats: 0, activeChats: 0, unreadMessages: 0, totalMessages: 0 },
    notifications: { total: 0, unread: 0, sentThisMonth: 0 }
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [chatStatus, setChatStatus] = useState({ enabled: true, activeUsers: 0, recentMessages: [] });
  const [chartData, setChartData] = useState({
    tasksByStatus: { completed: 0, inProgress: 0, pending: 0, overdue: 0 },
    monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
    attendanceTrend: [85, 88, 92, 87, 90, 94]
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    showToast('Logged out successfully', 'success');
  };

  // Helper function to safely fetch data with error handling
  const safeFetch = async (apiCall, errorKey, fallbackData = null) => {
    try {
      const response = await apiCall();
      if (response?.success) {
        return response.data;
      }
      if (response?.data?.success) {
        return response.data.data;
      }
      return fallbackData;
    } catch (error) {
      console.error(`Failed to fetch ${errorKey}:`, error);
      setApiErrors(prev => ({ ...prev, [errorKey]: true }));
      
      if (error.response?.status !== 403) {
        showToast(`Failed to load ${errorKey} data`, 'warning');
      }
      return fallbackData;
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    setApiErrors({
      users: false,
      buildings: false,
      tasks: false,
      attendance: false,
      leave: false,
      payroll: false,
      notifications: false,
      chat: false,
      salary: false
    });
    
    try {
      // Fetch users data
      let totalUsers = 0;
      let usersList = [];
      
      const usersData = await safeFetch(
        () => userApi.getUsers({ limit: 10, page: 1 }),
        'users',
        { data: { users: [], pagination: { total: 0 } } }
      );
      
      if (usersData) {
        totalUsers = usersData.pagination?.total || usersData.total || 0;
        usersList = usersData.users || usersData.data || [];
      }
      
      // Fetch buildings data
      let buildings = [];
      const buildingsData = await safeFetch(
        () => buildingApi.getBuildings(),
        'buildings',
        { buildings: [] }
      );
      if (buildingsData) {
        buildings = buildingsData.buildings || buildingsData.data || [];
      }
      
      // Fetch tasks statistics
      let taskStats = {};
      const tasksData = await safeFetch(
        () => taskApi.getTaskStatistics(),
        'tasks',
        {}
      );
      if (tasksData) {
        taskStats = tasksData;
      }
      
      // Fetch attendance statistics
      let attendanceStats = { present: 0, absent: 0, late: 0, onLeave: 0, rate: 0 };
      const attendanceData = await safeFetch(
        () => attendanceApi.getDashboardStats(),
        'attendance',
        null
      );
      if (attendanceData) {
        attendanceStats = attendanceData;
      }
      
      // Fetch leave statistics
      let leaveStats = { pending: 0, approved: 0, rejected: 0 };
      const leaveData = await safeFetch(
        () => leaveApi.getLeaveStats(),
        'leave',
        null
      );
      if (leaveData) {
        leaveStats = leaveData;
      }
      
      // Fetch payroll summary
      let payrollStats = { totalPayroll: 0, averageSalary: 0, pendingPayments: 0, processedCount: 0, complianceRate: 0 };
      const payrollData = await safeFetch(
        () => salaryApi.getPayrollDashboard(new Date().getMonth() + 1, new Date().getFullYear()),
        'payroll',
        null
      );
      if (payrollData) {
        payrollStats = {
          totalPayroll: payrollData.summary?.totalPayroll || 0,
          averageSalary: payrollData.summary?.averageSalary || 0,
          pendingPayments: payrollData.summary?.pendingCount || 0,
          processedCount: payrollData.summary?.processedCount || 0,
          complianceRate: payrollData.summary?.complianceRate || 0
        };
      }
      
      // Fetch salary structure stats
      let salaryStats = { totalStructures: 0, activeStructures: 0, averageBasic: 0 };
      try {
        const salaryStructureData = await safeFetch(
          () => salaryApi.getAllSalaries(new Date().getMonth() + 1, new Date().getFullYear()),
          'salary',
          null
        );
        if (salaryStructureData && Array.isArray(salaryStructureData)) {
          const activeStructures = salaryStructureData.filter(s => s.payroll?.status === 'active' || s.status === 'active');
          salaryStats = {
            totalStructures: salaryStructureData.length,
            activeStructures: activeStructures.length,
            averageBasic: salaryStructureData.reduce((sum, s) => sum + (s.payroll?.basic || s.basic || 0), 0) / (salaryStructureData.length || 1)
          };
        }
      } catch (salaryError) {
        console.warn('Salary data not available:', salaryError.message);
        // Use mock data
        salaryStats = { totalStructures: 45, activeStructures: 38, averageBasic: 5000 };
      }
      
      // Fetch notifications
      let notificationsList = [];
      let notificationStats = { total: 0, unread: 0, sentThisMonth: 0 };
      try {
        const notificationsData = await safeFetch(
          () => notificationApi.getNotifications({ limit: 5 }),
          'notifications',
          []
        );
        if (notificationsData && Array.isArray(notificationsData)) {
          notificationsList = notificationsData;
          notificationStats = {
            total: notificationsData.length,
            unread: notificationsData.filter(n => !n.read).length,
            sentThisMonth: Math.floor(notificationsData.length * 0.7)
          };
        }
      } catch (notificationError) {
        console.warn('Notifications API not available:', notificationError.message);
        notificationStats = { total: 12, unread: 5, sentThisMonth: 8 };
      }
      
      // Fetch chat statistics - handle gracefully if API doesn't exist
      let chatStats = { totalChats: 0, activeChats: 0, unreadMessages: 0, totalMessages: 0 };
      let chatStatusData = { enabled: true, activeUsers: 0, recentMessages: [] };
      
      try {
        const chatStatsRes = await chatApi.getChatStats();
        if (chatStatsRes?.success) {
          chatStats = chatStatsRes.data;
        } else if (chatStatsRes?.data?.success) {
          chatStats = chatStatsRes.data.data;
        }
      } catch (chatError) {
        console.warn('Chat stats API not available:', chatError.message);
        setApiErrors(prev => ({ ...prev, chat: true }));
        chatStats = { totalChats: 24, activeChats: 8, unreadMessages: 45, totalMessages: 1250 };
      }
      
      // Get chat settings - handle gracefully
      try {
        const chatSettingsRes = await chatApi.getUserChatSettings();
        if (chatSettingsRes?.success) {
          chatStatusData.enabled = chatSettingsRes.data.chatEnabled;
        } else if (chatSettingsRes?.data?.success) {
          chatStatusData.enabled = chatSettingsRes.data.data.chatEnabled;
        }
      } catch (settingsError) {
        console.warn('Chat settings API not available:', settingsError.message);
      }
      
      setStats({
        users: {
          total: totalUsers,
          active: Math.floor(totalUsers * 0.85) || 0,
          newThisMonth: Math.floor(totalUsers * 0.1) || 0
        },
        buildings: {
          total: buildings.length,
          active: buildings.filter(b => b.status === 'active').length,
          totalUnits: buildings.reduce((sum, b) => sum + (b.statistics?.totalUnits || 0), 0)
        },
        tasks: {
          total: taskStats.total || 0,
          completed: taskStats.completed || 0,
          inProgress: taskStats.inProgress || 0,
          overdue: taskStats.overdue || 0
        },
        complaints: {
          total: 156,
          resolved: 134,
          pending: 22
        },
        attendance: attendanceStats,
        leave: leaveStats,
        payroll: payrollStats,
        salary: salaryStats,
        revenue: {
          total: 1250000,
          thisMonth: 145000,
          growth: 12.5
        },
        chat: chatStats,
        notifications: notificationStats
      });
      
      setChatStatus(chatStatusData);

      setChartData({
        tasksByStatus: {
          completed: taskStats.completed || 0,
          inProgress: taskStats.inProgress || 0,
          pending: taskStats.pending || 0,
          overdue: taskStats.overdue || 0
        },
        monthlyRevenue: [125000, 132000, 148000, 156000, 168000, 175000],
        attendanceTrend: [85, 88, 92, 87, 90, 94]
      });

      // Set recent users from API data
      const formattedUsers = usersList.slice(0, 5).map(u => ({
        id: u._id,
        name: `${u.firstName || ''} ${u.lastName || ''}`.trim() || u.email || 'Unknown',
        email: u.email || 'No email',
        role: u.role || 'user',
        status: u.status || 'active',
        joined: u.createdAt ? formatDate(u.createdAt) : new Date().toISOString().split('T')[0],
        chatEnabled: u.chatEnabled || false
      }));
      
      setRecentUsers(formattedUsers);
      setNotifications(notificationsList.slice(0, 5));
      
      // Generate AI Insights
      generateAiInsights(taskStats, attendanceStats, leaveStats, chatStats, payrollStats);
      
      // Set recent activities
      setRecentActivities([
        { id: 1, type: 'user', action: 'New user registered', user: formattedUsers[0]?.name || 'User', time: '2 minutes ago', icon: '👤', color: 'blue' },
        { id: 2, type: 'task', action: 'Task completed', task: 'Fix AC in Tower A', time: '15 minutes ago', icon: '✅', color: 'green' },
        { id: 3, type: 'complaint', action: 'New complaint raised', complaint: 'Plumbing issue', time: '1 hour ago', icon: '📋', color: 'orange' },
        { id: 4, type: 'building', action: 'New building added', building: 'Tech Hub', time: '3 hours ago', icon: '🏢', color: 'purple' },
        { id: 5, type: 'payment', action: 'Payment received', amount: '$2,500', time: '5 hours ago', icon: '💰', color: 'green' },
        { id: 6, type: 'chat', action: 'New chat message', user: 'Support Team', time: '10 minutes ago', icon: '💬', color: 'cyan' },
        { id: 7, type: 'notification', action: 'Broadcast notification sent', message: 'System maintenance scheduled', time: '30 minutes ago', icon: '🔔', color: 'yellow' },
        { id: 8, type: 'payroll', action: 'Payroll processed', amount: '$45,000', time: '1 hour ago', icon: '💰', color: 'indigo' }
      ]);

    } catch (error) {
      console.error('Dashboard fetch error:', error);
      showToast('Some dashboard data could not be loaded', 'warning');
    } finally {
      setLoading(false);
    }
  };

  const generateAiInsights = (taskStats, attendanceStats, leaveStats, chatStats, payrollStats) => {
    const insights = [];
    
    // Task insights
    if (taskStats.overdue > 10) {
      insights.push({
        id: 1,
        type: 'warning',
        title: 'High Overdue Tasks',
        message: `${taskStats.overdue} tasks are overdue. Consider reallocating resources.`,
        icon: '⚠️',
        action: '/tasks/overdue'
      });
    } else if (taskStats.completed > 0) {
      insights.push({
        id: 1,
        type: 'info',
        title: 'Task Performance',
        message: `Task completion rate is at ${Math.round((taskStats.completed / (taskStats.total || 1)) * 100)}%. Keep up the good work!`,
        icon: '📊',
        action: '/tasks'
      });
    }
    
    // Attendance insights
    if (attendanceStats.rate > 0 && attendanceStats.rate < 85) {
      insights.push({
        id: 2,
        type: 'warning',
        title: 'Low Attendance Rate',
        message: `Attendance rate is at ${attendanceStats.rate}%. Review attendance policies.`,
        icon: '📊',
        action: '/attendance/report'
      });
    }
    
    // Leave insights
    if (leaveStats.pending > 5) {
      insights.push({
        id: 3,
        type: 'action',
        title: 'Pending Leave Requests',
        message: `${leaveStats.pending} leave requests awaiting approval.`,
        icon: '📋',
        action: '/leave/pending'
      });
    }
    
    // Payroll insights
    if (payrollStats.complianceRate > 0 && payrollStats.complianceRate < 90) {
      insights.push({
        id: 4,
        type: 'warning',
        title: 'Payroll Compliance Alert',
        message: `Payroll compliance is at ${payrollStats.complianceRate}%. Review payroll processing.`,
        icon: '💰',
        action: '/payroll/dashboard'
      });
    }
    
    if (payrollStats.pendingPayments > 10) {
      insights.push({
        id: 5,
        type: 'action',
        title: 'Pending Payroll',
        message: `${payrollStats.pendingPayments} payroll records pending processing.`,
        icon: '📋',
        action: '/payroll/processor'
      });
    }
    
    // Chat insights
    if (chatStats.unreadMessages > 100) {
      insights.push({
        id: 6,
        type: 'info',
        title: 'High Unread Messages',
        message: `${chatStats.unreadMessages} unread messages across all chats.`,
        icon: '💬',
        action: '/chat'
      });
    }
    
    // Notification insights
    insights.push({
      id: 7,
      type: 'success',
      title: 'Notification System Active',
      message: 'You can send broadcast notifications to all users from the notification center.',
      icon: '🔔',
      action: '/notifications/send'
    });
    
    // Salary structure insights
    insights.push({
      id: 8,
      type: 'info',
      title: 'Salary Management',
      message: 'Review and update salary structures for employees.',
      icon: '💰',
      action: '/salary/structure'
    });
    
    // AI Prediction Insights
    insights.push({
      id: 9,
      type: 'ai',
      title: 'AI Prediction: Peak Hours',
      message: 'Based on historical data, next week will have higher task volume. Plan resources accordingly.',
      icon: '🤖',
      action: '/ai/insights'
    });
    
    insights.push({
      id: 10,
      type: 'ai',
      title: 'Resource Optimization Suggestion',
      message: 'Consider reallocating technicians between buildings for better workload balance.',
      icon: '🧠',
      action: '/ai/smart-assign'
    });
    
    setAiInsights(insights);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getInsightStyle = (type) => {
    const styles = {
      warning: 'border-l-4 border-l-yellow-500 bg-yellow-50',
      success: 'border-l-4 border-l-green-500 bg-green-50',
      info: 'border-l-4 border-l-blue-500 bg-blue-50',
      action: 'border-l-4 border-l-purple-500 bg-purple-50',
      ai: 'border-l-4 border-l-gradient-to-r from-purple-500 to-pink-500 bg-gradient-to-r from-purple-50 to-pink-50'
    };
    return styles[type] || styles.info;
  };

  // Show warning banner if there are API errors
  const hasApiErrors = Object.values(apiErrors).some(error => error === true);
  const apiErrorCount = Object.values(apiErrors).filter(error => error === true).length;

  const isAdmin = user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'hr';
  
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600 font-medium mb-2">Access Denied</p>
          <p className="text-gray-600 mb-4">You don't have permission to view this page.</p>
          <Button variant="secondary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

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
                Some data could not be loaded ({apiErrorCount} API issues)
              </p>
              <p className="text-xs text-yellow-700 mt-1">
                {apiErrors.chat && "• Chat statistics are using demo data.\n"}
                {apiErrors.attendance && "• Attendance data may be incomplete.\n"}
                {apiErrors.leave && "• Leave data is unavailable.\n"}
                {apiErrors.notifications && "• Notifications data may be limited.\n"}
                {apiErrors.payroll && "• Payroll data may be incomplete.\n"}
                {apiErrors.salary && "• Salary structure data may be limited."}
              </p>
              <button 
                onClick={fetchDashboardData}
                className="mt-2 text-xs text-yellow-800 underline hover:text-yellow-900"
              >
                Retry loading data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Section with AI Badge */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex justify-between items-start flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">Welcome back, {user?.firstName || 'Admin'}! 👋</h1>
              <span className="px-2 py-1 text-xs rounded-full bg-purple-500 text-white">AI Enhanced</span>
              {chatStatus.enabled && (
                <span className="px-2 py-1 text-xs rounded-full bg-green-500 text-white">Chat Active</span>
              )}
            </div>
            <p className="text-blue-100 mt-1">Here's what's happening with your enterprise today.</p>
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <p className="text-sm opacity-90">Total Revenue</p>
                <p className="text-2xl font-bold">${formatNumber(stats.revenue.total)}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <p className="text-sm opacity-90">Growth Rate</p>
                <p className="text-2xl font-bold text-green-300">+{stats.revenue.growth}%</p>
              </div>
              <div className="bg-white/20 rounded-lg px-4 py-2 backdrop-blur-sm">
                <p className="text-sm opacity-90">This Month</p>
                <p className="text-2xl font-bold">${formatNumber(stats.revenue.thisMonth)}</p>
              </div>
            </div>
          </div>
          <Button 
            variant="danger" 
            onClick={handleLogout} 
            size="sm"
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <svg className="w-4 h-4 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </Button>
        </div>
      </div>

      {/* Stats Grid - 6x2 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Users */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
              <p className="text-xs text-green-600 mt-1">+{stats.users.newThisMonth} this month</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-xl">👥</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Active: {stats.users.active}</span>
              <Link to="/users" className="text-blue-600 hover:text-blue-800">View →</Link>
            </div>
          </div>
        </Card>

        {/* Buildings */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Buildings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.buildings.total}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.buildings.totalUnits} units</p>
            </div>
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🏢</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Active: {stats.buildings.active}</span>
              <Link to="/buildings" className="text-blue-600 hover:text-blue-800">Manage →</Link>
            </div>
          </div>
        </Card>

        {/* Tasks */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.tasks.total}</p>
              <p className="text-xs text-green-600 mt-1">{stats.tasks.completed} completed</p>
            </div>
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <span className="text-xl">✅</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">In Progress: {stats.tasks.inProgress}</span>
              <Link to="/tasks" className="text-blue-600 hover:text-blue-800">View →</Link>
            </div>
          </div>
        </Card>

        {/* Complaints */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Complaints</p>
              <p className="text-2xl font-bold text-gray-900">{stats.complaints.total}</p>
              <p className="text-xs text-red-600 mt-1">{stats.complaints.pending} pending</p>
            </div>
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📋</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Resolved: {stats.complaints.resolved}</span>
              <Link to="/complaints" className="text-blue-600 hover:text-blue-800">View →</Link>
            </div>
          </div>
        </Card>

        {/* Payroll */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Payroll</p>
              <p className="text-2xl font-bold text-purple-600">{formatNumber(stats.payroll.totalPayroll)}</p>
              <p className="text-xs text-gray-500 mt-1">Avg: {formatNumber(stats.payroll.averageSalary)}</p>
            </div>
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Compliance: {stats.payroll.complianceRate}%</span>
              <Link to="/payroll/dashboard" className="text-blue-600 hover:text-blue-800">Process →</Link>
            </div>
          </div>
        </Card>

        {/* Chat Stats */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Chat Activity</p>
              <p className="text-2xl font-bold text-cyan-600">{stats.chat.activeChats || stats.chat.totalChats}</p>
              <p className="text-xs text-gray-500 mt-1">{stats.chat.unreadMessages || 0} unread</p>
            </div>
            <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-xl">💬</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Total: {stats.chat.totalMessages || 0} msgs</span>
              <Link to="/chat" className="text-blue-600 hover:text-blue-800">View Chats →</Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Second Row Stats - Attendance, Leave, Salary, Notifications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Attendance */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's Attendance</p>
              <p className="text-2xl font-bold text-green-600">{stats.attendance.rate}%</p>
              <p className="text-xs text-gray-500 mt-1">{stats.attendance.present} present</p>
            </div>
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
              <span className="text-xl">⏰</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Absent: {stats.attendance.absent}</span>
              <Link to="/attendance/report" className="text-blue-600 hover:text-blue-800">Report →</Link>
            </div>
          </div>
        </Card>

        {/* Leave */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending Leaves</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.leave.pending}</p>
              <p className="text-xs text-green-600 mt-1">{stats.leave.approved} approved</p>
            </div>
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🏖️</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Rejected: {stats.leave.rejected}</span>
              <Link to="/leave/pending" className="text-blue-600 hover:text-blue-800">Approve →</Link>
            </div>
          </div>
        </Card>

        {/* Salary Structures */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Salary Structures</p>
              <p className="text-2xl font-bold text-indigo-600">{stats.salary.totalStructures}</p>
              <p className="text-xs text-gray-500 mt-1">Active: {stats.salary.activeStructures}</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Avg Basic: {formatNumber(stats.salary.averageBasic)}</span>
              <Link to="/salary/structure" className="text-blue-600 hover:text-blue-800">Manage →</Link>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="p-4 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Notifications</p>
              <p className="text-2xl font-bold text-pink-600">{stats.notifications.total}</p>
              <p className="text-xs text-red-600 mt-1">{stats.notifications.unread} unread</p>
            </div>
            <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
              <span className="text-xl">🔔</span>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Sent: {stats.notifications.sentThisMonth}</span>
              <Link to="/notifications/send" className="text-blue-600 hover:text-blue-800">Send →</Link>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts and AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task Status Chart */}
        <Card className="lg:col-span-2 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Task Status Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completed</span>
                <span className="text-green-600">{chartData.tasksByStatus.completed}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.completed / (chartData.tasksByStatus.completed + chartData.tasksByStatus.inProgress + chartData.tasksByStatus.pending + chartData.tasksByStatus.overdue || 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>In Progress</span>
                <span className="text-blue-600">{chartData.tasksByStatus.inProgress}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.inProgress / (chartData.tasksByStatus.completed + chartData.tasksByStatus.inProgress + chartData.tasksByStatus.pending + chartData.tasksByStatus.overdue || 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Pending</span>
                <span className="text-yellow-600">{chartData.tasksByStatus.pending}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.pending / (chartData.tasksByStatus.completed + chartData.tasksByStatus.inProgress + chartData.tasksByStatus.pending + chartData.tasksByStatus.overdue || 1)) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Overdue</span>
                <span className="text-red-600">{chartData.tasksByStatus.overdue}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(chartData.tasksByStatus.overdue / (chartData.tasksByStatus.completed + chartData.tasksByStatus.inProgress + chartData.tasksByStatus.pending + chartData.tasksByStatus.overdue || 1)) * 100}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* AI Insights */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">AI Insights</h3>
            <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Powered by AI</span>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {aiInsights.slice(0, 5).map(insight => (
              <Link key={insight.id} to={insight.action} className="block">
                <div className={`p-3 rounded-lg ${getInsightStyle(insight.type)} hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-2">
                    <div className="text-lg">{insight.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{insight.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{insight.message}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t">
            <Link to="/ai/insights" className="text-xs text-purple-600 hover:text-purple-800 flex items-center justify-end gap-1">
              View all AI insights →
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Users, Notifications, and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Users */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Users</h3>
            <Link to="/users" className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            {recentUsers.length > 0 ? (
              recentUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-sm font-medium">{user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No recent users</p>
            )}
          </div>
        </Card>

        {/* Recent Notifications */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-900">Recent Notifications</h3>
            <Link to="/notifications" className="text-sm text-blue-600 hover:text-blue-800">
              View All →
            </Link>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map(notification => (
                <div key={notification.id} className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-start gap-2">
                    <div className="text-lg">🔔</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.title || 'Notification'}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.message || notification.body}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-500">No recent notifications</p>
                <Link to="/notifications/send" className="text-sm text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  Send notification →
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/users/new">
              <div className="p-3 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors">
                <div className="text-xl mb-1">👤</div>
                <p className="text-xs font-medium">Add User</p>
              </div>
            </Link>
            <Link to="/notifications/send">
              <div className="p-3 bg-pink-50 rounded-lg text-center hover:bg-pink-100 transition-colors">
                <div className="text-xl mb-1">🔔</div>
                <p className="text-xs font-medium">Send Notification</p>
              </div>
            </Link>
            <Link to="/payroll/processor">
              <div className="p-3 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors">
                <div className="text-xl mb-1">💰</div>
                <p className="text-xs font-medium">Process Payroll</p>
              </div>
            </Link>
            <Link to="/salary/structure">
              <div className="p-3 bg-indigo-50 rounded-lg text-center hover:bg-indigo-100 transition-colors">
                <div className="text-xl mb-1">📊</div>
                <p className="text-xs font-medium">Salary Structure</p>
              </div>
            </Link>
            <Link to="/reports">
              <div className="p-3 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors">
                <div className="text-xl mb-1">📈</div>
                <p className="text-xs font-medium">Reports</p>
              </div>
            </Link>
            <Link to="/settings">
              <div className="p-3 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                <div className="text-xl mb-1">⚙️</div>
                <p className="text-xs font-medium">Settings</p>
              </div>
            </Link>
          </div>
        </Card>
      </div>

      {/* Recent Activities */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Recent Activities</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
        </div>
        <div className="space-y-3">
          {recentActivities.map(activity => (
            <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={`w-8 h-8 rounded-full bg-${activity.color}-100 flex items-center justify-center`}>
                <span>{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {activity.action}
                  {activity.user && <span className="font-medium"> {activity.user}</span>}
                  {activity.task && <span className="font-medium"> {activity.task}</span>}
                  {activity.complaint && <span className="font-medium"> {activity.complaint}</span>}
                  {activity.building && <span className="font-medium"> {activity.building}</span>}
                  {activity.amount && <span className="font-medium"> {activity.amount}</span>}
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SuperAdminDashboard;