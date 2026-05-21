// // client/src/pages/tasks/TaskList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import SearchBar from '../../components/common/SearchBar';

// const TaskList = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [stats, setStats] = useState({
//     status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//     priority: { critical: 0, high: 0, medium: 0, low: 0 },
//     overdue: 0
//   });
//   const [filters, setFilters] = useState({
//     status: '',
//     priority: '',
//     search: '',
//     page: 1,
//     limit: 10
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0
//   });

//   // Fetch tasks with filters
//   const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: filters.page,
//         limit: filters.limit,
//         status: filters.status || undefined,
//         priority: filters.priority || undefined,
//         search: filters.search || undefined
//       };
      
//       const response = await taskApi.getTaskList(params);
      
//       if (response.data && response.data.success) {
//         setTasks(response.data.data?.tasks || []);
//         setStats(response.data.data?.stats || stats);
//         setPagination(response.data.data?.pagination || pagination);
//       } else {
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error('Fetch tasks error:', error);
//       showToast('Failed to load tasks', 'error');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, showToast]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setFilters(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-green-100 text-green-800',
//       closed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return badges[status] || badges.pending;
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const isOverdue = (slaDeadline) => {
//     if (!slaDeadline) return false;
//     return new Date(slaDeadline) < new Date();
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
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-gray-500 mt-1">Manage and track all tasks</p>
//         </div>
//         {hasPermission('task.create') && (
//           <Button onClick={() => navigate('/tasks/new')}>
//             + Create Task
//           </Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-blue-600">{stats.status?.total || 0}</p>
//           <p className="text-xs text-gray-500">Total Tasks</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-yellow-600">{stats.status?.assigned || 0}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-indigo-600">{stats.status?.in_progress || 0}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-green-600">{stats.status?.completed || 0}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-red-600">{stats.overdue || 0}</p>
//           <p className="text-xs text-gray-500">Overdue</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-purple-600">{stats.status?.pending || 0}</p>
//           <p className="text-xs text-gray-500">Pending</p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => handleFilterChange('search', value)}
//               placeholder="Search by title, task ID, or description..."
//             />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="assigned">Assigned</option>
//             <option value="accepted">Accepted</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="verified">Verified</option>
//             <option value="closed">Closed</option>
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => handleFilterChange('priority', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Priority</option>
//             <option value="critical">Critical</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//       </Card>

//       {/* Tasks Table */}
//       <Card className="overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {tasks.length > 0 ? (
//                 tasks.map((task) => (
//                   <tr key={task._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
//                       {task.taskId || task._id?.slice(-6)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{task.title}</div>
//                       <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                         {task.priority || 'medium'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                         {task.status?.replace(/_/g, ' ') || 'unknown'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {task.assignment?.assignedToName || 'Unassigned'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <span className={isOverdue(task.slaDeadline) ? 'text-red-600 font-medium' : 'text-gray-500'}>
//                         {formatDate(task.slaDeadline)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <div className="w-16 bg-gray-200 rounded-full h-1.5">
//                           <div 
//                             className="bg-blue-600 h-1.5 rounded-full"
//                             style={{ width: `${task.progress?.percentage || 0}%` }}
//                           />
//                         </div>
//                         <span className="text-xs text-gray-500">{task.progress?.percentage || 0}%</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex space-x-2">
//                         <Link 
//                           to={`/tasks/${task._id}`} 
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           View
//                         </Link>
//                         {task.status === 'assigned' && user?.role === 'technician' && (
//                           <Link 
//                             to={`/tasks/${task._id}/accept`} 
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             Accept
//                           </Link>
//                         )}
//                         {task.status === 'in_progress' && user?.role === 'technician' && (
//                           <Link 
//                             to={`/tasks/${task._id}/progress`} 
//                             className="text-indigo-600 hover:text-indigo-800"
//                           >
//                             Update
//                           </Link>
//                         )}
//                         {hasPermission('task.assign') && task.status === 'pending' && (
//                           <Link 
//                             to={`/tasks/${task._id}/assign`} 
//                             className="text-purple-600 hover:text-purple-800"
//                           >
//                             Assign
//                           </Link>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center">
//                       <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                       </svg>
//                       <p className="text-gray-500">No tasks found</p>
//                       {hasPermission('task.create') && (
//                         <Button variant="secondary" className="mt-4" onClick={() => navigate('/tasks/new')}>
//                           Create your first task
//                         </Button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t flex items-center justify-between">
//             <div className="text-sm text-gray-500">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default TaskList;

// // client/src/pages/tasks/TaskList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import SearchBar from '../../components/common/SearchBar';

// const TaskList = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [stats, setStats] = useState({
//     status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//     priority: { critical: 0, high: 0, medium: 0, low: 0 },
//     overdue: 0
//   });
//   const [filters, setFilters] = useState({
//     status: '',
//     priority: '',
//     search: '',
//     page: 1,
//     limit: 10
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0
//   });

//   // Fetch tasks with filters
//   const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: filters.page,
//         limit: filters.limit,
//         status: filters.status || undefined,
//         priority: filters.priority || undefined,
//         search: filters.search || undefined
//       };
      
//       const response = await taskApi.getTaskList(params);
      
//       if (response.data && response.data.success) {
//         setTasks(response.data.data?.tasks || []);
//         setStats(response.data.data?.stats || stats);
//         setPagination(response.data.data?.pagination || pagination);
//       } else {
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error('Fetch tasks error:', error);
//       showToast('Failed to load tasks', 'error');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, showToast]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setFilters(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-green-100 text-green-800',
//       closed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return badges[status] || badges.pending;
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const isOverdue = (slaDeadline) => {
//     if (!slaDeadline) return false;
//     return new Date(slaDeadline) < new Date();
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
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-gray-500 mt-1">Manage and track all tasks</p>
//         </div>
//         {hasPermission('task.create') && (
//           <Button onClick={() => navigate('/tasks/new')}>
//             + Create Task
//           </Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-blue-600">{stats.status?.total || 0}</p>
//           <p className="text-xs text-gray-500">Total Tasks</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-yellow-600">{stats.status?.assigned || 0}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-indigo-600">{stats.status?.in_progress || 0}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-green-600">{stats.status?.completed || 0}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-red-600">{stats.overdue || 0}</p>
//           <p className="text-xs text-gray-500">Overdue</p>
//         </Card>
//         <Card className="p-3 text-center">
//           <p className="text-xl font-bold text-purple-600">{stats.status?.pending || 0}</p>
//           <p className="text-xs text-gray-500">Pending</p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => handleFilterChange('search', value)}
//               placeholder="Search by title, task ID, or description..."
//             />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="assigned">Assigned</option>
//             <option value="accepted">Accepted</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="verified">Verified</option>
//             <option value="closed">Closed</option>
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => handleFilterChange('priority', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Priority</option>
//             <option value="critical">Critical</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//       </Card>

//       {/* Tasks Table */}
//       <Card className="overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {tasks.length > 0 ? (
//                 tasks.map((task) => (
//                   <tr key={task._id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
//                       {task.taskId || task._id?.slice(-6)}
//                     </td>
//                     <td className="px-6 py-4">
//                       <div className="text-sm font-medium text-gray-900">{task.title}</div>
//                       <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                         {task.priority || 'medium'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                         {task.status?.replace(/_/g, ' ') || 'unknown'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {task.assignment?.assignedToName || 'Unassigned'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <span className={isOverdue(task.slaDeadline) ? 'text-red-600 font-medium' : 'text-gray-500'}>
//                         {formatDate(task.slaDeadline)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center gap-2">
//                         <div className="w-16 bg-gray-200 rounded-full h-1.5">
//                           <div 
//                             className="bg-blue-600 h-1.5 rounded-full"
//                             style={{ width: `${task.progress?.percentage || 0}%` }}
//                           />
//                         </div>
//                         <span className="text-xs text-gray-500">{task.progress?.percentage || 0}%</span>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex space-x-2">
//                         <Link 
//                           to={`/tasks/${task._id}`} 
//                           className="text-blue-600 hover:text-blue-800"
//                         >
//                           View
//                         </Link>
//                         {task.status === 'assigned' && user?.role === 'technician' && (
//                           <Link 
//                             to={`/tasks/${task._id}/accept`} 
//                             className="text-green-600 hover:text-green-800"
//                           >
//                             Accept
//                           </Link>
//                         )}
//                         {task.status === 'in_progress' && user?.role === 'technician' && (
//                           <Link 
//                             to={`/tasks/${task._id}/progress`} 
//                             className="text-indigo-600 hover:text-indigo-800"
//                           >
//                             Update
//                           </Link>
//                         )}
//                         {hasPermission('task.assign') && task.status === 'pending' && (
//                           <Link 
//                             to={`/tasks/${task._id}/assign`} 
//                             className="text-purple-600 hover:text-purple-800"
//                           >
//                             Assign
//                           </Link>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center">
//                       <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                       </svg>
//                       <p className="text-gray-500">No tasks found</p>
//                       {hasPermission('task.create') && (
//                         <Button variant="secondary" className="mt-4" onClick={() => navigate('/tasks/new')}>
//                           Create your first task
//                         </Button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t flex items-center justify-between">
//             <div className="text-sm text-gray-500">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// };

// export default TaskList;












// // client/src/pages/tasks/TaskList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import SearchBar from '../../components/common/SearchBar';
// import Modal from '../../components/common/Modal';

// const TaskList = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusNotes, setStatusNotes] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [stats, setStats] = useState({
//     status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//     priority: { critical: 0, high: 0, medium: 0, low: 0 },
//     overdue: 0
//   });
//   const [filters, setFilters] = useState({
//     status: '',
//     priority: '',
//     search: '',
//     page: 1,
//     limit: 10
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0
//   });

//   // Status transition options
//   const statusTransitions = {
//     pending: ['assigned'],
//     assigned: ['accepted', 'pending'],
//     accepted: ['in_progress', 'assigned'],
//     in_progress: ['completed', 'accepted'],
//     completed: ['verified', 'in_progress'],
//     verified: ['closed', 'completed'],
//     closed: []
//   };

//   const getAvailableStatuses = (currentStatus) => {
//     return statusTransitions[currentStatus] || [];
//   };

//   // Fetch tasks with filters
//   const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: filters.page,
//         limit: filters.limit,
//         status: filters.status || undefined,
//         priority: filters.priority || undefined,
//         search: filters.search || undefined
//       };
      
//       const response = await taskApi.getTaskList(params);
      
//       if (response.data && response.data.success) {
//         setTasks(response.data.data?.tasks || []);
//         setStats(response.data.data?.stats || stats);
//         setPagination(response.data.data?.pagination || pagination);
//       } else {
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error('Fetch tasks error:', error);
//       showToast('Failed to load tasks', 'error');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, showToast]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setFilters(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!selectedTask || !newStatus) return;
    
//     setUpdating(true);
//     try {
//       const updateData = { 
//         status: newStatus,
//         notes: statusNotes 
//       };
      
//       const response = await taskApi.updateTask(selectedTask._id, updateData);
      
//       if (response.data.success) {
//         showToast(`Task status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
//         setShowStatusModal(false);
//         setSelectedTask(null);
//         setNewStatus('');
//         setStatusNotes('');
//         fetchTasks(); // Refresh the list
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       console.error('Status update error:', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const openStatusModal = (task, status) => {
//     setSelectedTask(task);
//     setNewStatus(status);
//     setStatusNotes('');
//     setShowStatusModal(true);
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800'
//     };
//     return badges[status] || badges.pending;
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const isOverdue = (slaDeadline) => {
//     if (!slaDeadline) return false;
//     return new Date(slaDeadline) < new Date();
//   };

//   // Check if user can update task status
//   const canUpdateStatus = (task) => {
//     const userRole = user?.role;
//     const isAssignedToMe = task.assignment?.assignedTo === user?._id;
    
//     if (userRole === 'super_admin' || userRole === 'admin') return true;
//     if (userRole === 'technician' && isAssignedToMe) return true;
//     if (userRole === 'supervisor' && (task.status === 'completed' || task.status === 'in_progress')) return true;
//     if (userRole === 'manager' && (task.status === 'completed' || task.status === 'in_progress')) return true;
    
//     return false;
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
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-gray-500 mt-1">Manage and track all tasks</p>
//         </div>
//         {hasPermission('task.create') && (
//           <Button onClick={() => navigate('/tasks/new')}>
//             + Create Task
//           </Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-blue-600">{stats.status?.total || 0}</p>
//           <p className="text-xs text-gray-500">Total Tasks</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-yellow-600">{stats.status?.assigned || 0}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-indigo-600">{stats.status?.in_progress || 0}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-green-600">{stats.status?.completed || 0}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-red-600">{stats.overdue || 0}</p>
//           <p className="text-xs text-gray-500">Overdue</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-purple-600">{stats.status?.pending || 0}</p>
//           <p className="text-xs text-gray-500">Pending</p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => handleFilterChange('search', value)}
//               placeholder="Search by title, task ID, or description..."
//             />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="assigned">Assigned</option>
//             <option value="accepted">Accepted</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="verified">Verified</option>
//             <option value="closed">Closed</option>
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => handleFilterChange('priority', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Priority</option>
//             <option value="critical">Critical</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//           <Button 
//             variant="secondary" 
//             onClick={() => {
//               setFilters({ status: '', priority: '', search: '', page: 1, limit: 10 });
//             }}
//           >
//             Clear Filters
//           </Button>
//         </div>
//       </Card>

//       {/* Tasks Table */}
//       <Card className="overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {tasks.length > 0 ? (
//                 tasks.map((task) => {
//                   const availableStatuses = getAvailableStatuses(task.status);
//                   const showStatusButtons = canUpdateStatus(task) && availableStatuses.length > 0;
                  
//                   return (
//                     <tr key={task._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
//                         {task.taskId || task._id?.slice(-6)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{task.title}</div>
//                         <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                           {task.priority || 'medium'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                           {task.status?.replace(/_/g, ' ') || 'unknown'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {task.assignment?.assignedToName || 'Unassigned'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <span className={isOverdue(task.slaDeadline) ? 'text-red-600 font-medium' : 'text-gray-500'}>
//                           {formatDate(task.slaDeadline)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <div className="w-16 bg-gray-200 rounded-full h-1.5">
//                             <div 
//                               className="bg-blue-600 h-1.5 rounded-full"
//                               style={{ width: `${task.progress?.percentage || 0}%` }}
//                             />
//                           </div>
//                           <span className="text-xs text-gray-500">{task.progress?.percentage || 0}%</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex flex-wrap gap-2">
//                           <Link 
//                             to={`/tasks/${task._id}`} 
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             View
//                           </Link>
//                           {showStatusButtons && (
//                             <div className="relative group">
//                               <button className="text-green-600 hover:text-green-800">
//                                 Update Status ▼
//                               </button>
//                               <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
//                                 {availableStatuses.map(status => (
//                                   <button
//                                     key={status}
//                                     onClick={() => openStatusModal(task, status)}
//                                     className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                                   >
//                                     {status.replace(/_/g, ' ')}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                           {hasPermission('task.assign') && task.status === 'pending' && (
//                             <Link 
//                               to={`/tasks/${task._id}/assign`} 
//                               className="text-purple-600 hover:text-purple-800"
//                             >
//                               Assign
//                             </Link>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center">
//                       <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                       </svg>
//                       <p className="text-gray-500">No tasks found</p>
//                       {hasPermission('task.create') && (
//                         <Button variant="secondary" className="mt-4" onClick={() => navigate('/tasks/new')}>
//                           Create your first task
//                         </Button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t flex items-center justify-between flex-wrap gap-4">
//             <div className="text-sm text-gray-500">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Status Update Modal */}
//       <Modal
//         isOpen={showStatusModal}
//         onClose={() => setShowStatusModal(false)}
//         title={`Update Task Status - ${selectedTask?.title || ''}`}
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Status
//             </label>
//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select status...</option>
//               {selectedTask && getAvailableStatuses(selectedTask.status).map(status => (
//                 <option key={status} value={status}>
//                   {status.replace(/_/g, ' ').toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={statusNotes}
//               onChange={(e) => setStatusNotes(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Add any notes about this status update..."
//             />
//           </div>
          
//           {newStatus === 'completed' && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//               <p className="text-sm text-green-800">
//                 💡 Tip: Add before/after images in the task details page after marking as completed.
//               </p>
//             </div>
//           )}
          
//           {newStatus === 'verified' && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-sm text-blue-800">
//                 💡 Verifying this task will close it. Make sure all work is completed properly.
//               </p>
//             </div>
//           )}
          
//           <div className="flex justify-end gap-3 pt-4">
//             <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
//               Cancel
//             </Button>
//             <Button 
//               variant="primary" 
//               onClick={handleStatusUpdate} 
//               isLoading={updating}
//               disabled={!newStatus}
//             >
//               Update Status
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TaskList;









// client/src/pages/tasks/TaskList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import SearchBar from '../../components/common/SearchBar';
// import Modal from '../../components/common/Modal';

// const TaskList = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusNotes, setStatusNotes] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [stats, setStats] = useState({
//     status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//     priority: { critical: 0, high: 0, medium: 0, low: 0 },
//     overdue: 0
//   });
//   const [filters, setFilters] = useState({
//     status: '',
//     priority: '',
//     search: '',
//     page: 1,
//     limit: 10
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0
//   });

//   // Debug user role
//   console.log('🔍 TaskList - User Role:', user?.role);
//   console.log('🔍 TaskList - User ID:', user?._id);

//   // Status transition options based on user role
//   const getAvailableStatuses = (currentStatus, userRole, isAssignedToMe) => {
//     // Admin and Super Admin can change to any status except closed
//     if (userRole === 'super_admin' || userRole === 'admin') {
//       const statuses = ['pending', 'assigned', 'accepted', 'in_progress', 'completed', 'verified'];
//       return statuses.filter(s => s !== currentStatus && s !== 'closed');
//     }
    
//     // Technician status transitions
//     if (userRole === 'technician' && isAssignedToMe) {
//       const transitions = {
//         'assigned': ['accepted'],
//         'accepted': ['in_progress'],
//         'in_progress': ['completed']
//       };
//       return transitions[currentStatus] || [];
//     }
    
//     // Supervisor can only verify/reject completed tasks
//     if (userRole === 'supervisor' && currentStatus === 'completed') {
//       return ['verified', 'rejected'];
//     }
    
//     // Manager can verify/reject completed tasks
//     if (userRole === 'manager' && currentStatus === 'completed') {
//       return ['verified', 'rejected'];
//     }
    
//     return [];
//   };

//   // Fetch tasks with filters
//   const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: filters.page,
//         limit: filters.limit,
//         status: filters.status || undefined,
//         priority: filters.priority || undefined,
//         search: filters.search || undefined
//       };
      
//       const response = await taskApi.getTaskList(params);
      
//       if (response.data && response.data.success) {
//         setTasks(response.data.data?.tasks || []);
//         setStats(response.data.data?.stats || stats);
//         setPagination(response.data.data?.pagination || pagination);
//       } else {
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error('Fetch tasks error:', error);
//       showToast('Failed to load tasks', 'error');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, showToast]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setFilters(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!selectedTask || !newStatus) return;
    
//     setUpdating(true);
//     try {
//       const updateData = { 
//         status: newStatus,
//         notes: statusNotes 
//       };
      
//       const response = await taskApi.updateTask(selectedTask._id, updateData);
      
//       if (response.data.success) {
//         showToast(`Task status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
//         setShowStatusModal(false);
//         setSelectedTask(null);
//         setNewStatus('');
//         setStatusNotes('');
//         fetchTasks(); // Refresh the list
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       console.error('Status update error:', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const openStatusModal = (task, status) => {
//     setSelectedTask(task);
//     setNewStatus(status);
//     setStatusNotes('');
//     setShowStatusModal(true);
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
//     return badges[status] || badges.pending;
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const isOverdue = (slaDeadline) => {
//     if (!slaDeadline) return false;
//     return new Date(slaDeadline) < new Date();
//   };

//   // 🔴 FIXED: Enhanced canUpdateStatus function with proper role-based permissions
//   const canUpdateStatus = (task) => {
//     const userRole = user?.role;
//     const isAssignedToMe = task.assignment?.assignedTo?.toString() === user?._id?.toString();
    
//     console.log('🔍 canUpdateStatus check:', {
//       taskId: task._id,
//       taskStatus: task.status,
//       userRole,
//       isAssignedToMe,
//       taskAssignedTo: task.assignment?.assignedTo
//     });
    
//     // Super Admin and Admin can update any task
//     if (userRole === 'super_admin' || userRole === 'admin') {
//       console.log('✅ Admin/Super Admin - can update');
//       return true;
//     }
    
//     // Technician can update only their assigned tasks
//     if (userRole === 'technician' && isAssignedToMe) {
//       console.log('✅ Assigned Technician - can update');
//       return true;
//     }
    
//     // Supervisor can verify/reject completed tasks
//     if (userRole === 'supervisor' && (task.status === 'completed' || task.status === 'pending_review')) {
//       console.log('✅ Supervisor - can verify/reject completed task');
//       return true;
//     }
    
//     // Manager can verify/reject completed tasks
//     if (userRole === 'manager' && (task.status === 'completed' || task.status === 'pending_review')) {
//       console.log('✅ Manager - can verify/reject completed task');
//       return true;
//     }
    
//     console.log('❌ No permission to update task');
//     return false;
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
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-gray-500 mt-1">Manage and track all tasks</p>
//         </div>
//         {hasPermission('task.create') && (
//           <Button onClick={() => navigate('/tasks/new')}>
//             + Create Task
//           </Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-blue-600">{stats.status?.total || 0}</p>
//           <p className="text-xs text-gray-500">Total Tasks</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-yellow-600">{stats.status?.assigned || 0}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-indigo-600">{stats.status?.in_progress || 0}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-green-600">{stats.status?.completed || 0}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-red-600">{stats.overdue || 0}</p>
//           <p className="text-xs text-gray-500">Overdue</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-purple-600">{stats.status?.pending || 0}</p>
//           <p className="text-xs text-gray-500">Pending</p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => handleFilterChange('search', value)}
//               placeholder="Search by title, task ID, or description..."
//             />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="assigned">Assigned</option>
//             <option value="accepted">Accepted</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="verified">Verified</option>
//             <option value="closed">Closed</option>
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => handleFilterChange('priority', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Priority</option>
//             <option value="critical">Critical</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//           <Button 
//             variant="secondary" 
//             onClick={() => {
//               setFilters({ status: '', priority: '', search: '', page: 1, limit: 10 });
//             }}
//           >
//             Clear Filters
//           </Button>
//         </div>
//       </Card>

//       {/* Tasks Table */}
//       <Card className="overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {tasks.length > 0 ? (
//                 tasks.map((task) => {
//                   const isAssignedToMe = task.assignment?.assignedTo?.toString() === user?._id?.toString();
//                   const availableStatuses = getAvailableStatuses(task.status, user?.role, isAssignedToMe);
//                   const showStatusButtons = canUpdateStatus(task) && availableStatuses.length > 0;
                  
//                   return (
//                     <tr key={task._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
//                         {task.taskId || task._id?.slice(-6)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{task.title}</div>
//                         <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                           {task.priority || 'medium'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                           {task.status?.replace(/_/g, ' ') || 'unknown'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {task.assignment?.assignedToName || 'Unassigned'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <span className={isOverdue(task.slaDeadline) ? 'text-red-600 font-medium' : 'text-gray-500'}>
//                           {formatDate(task.slaDeadline)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <div className="w-16 bg-gray-200 rounded-full h-1.5">
//                             <div 
//                               className="bg-blue-600 h-1.5 rounded-full"
//                               style={{ width: `${task.progress?.percentage || 0}%` }}
//                             />
//                           </div>
//                           <span className="text-xs text-gray-500">{task.progress?.percentage || 0}%</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex flex-wrap gap-2">
//                           <Link 
//                             to={`/tasks/${task._id}`} 
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             View
//                           </Link>
//                           {showStatusButtons && (
//                             <div className="relative group">
//                               <button className="text-green-600 hover:text-green-800">
//                                 Update Status ▼
//                               </button>
//                               <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
//                                 {availableStatuses.map(status => (
//                                   <button
//                                     key={status}
//                                     onClick={() => openStatusModal(task, status)}
//                                     className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                                   >
//                                     {status.replace(/_/g, ' ')}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                           {hasPermission('task.assign') && task.status === 'pending' && (
//                             <Link 
//                               to={`/tasks/${task._id}/assign`} 
//                               className="text-purple-600 hover:text-purple-800"
//                             >
//                               Assign
//                             </Link>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center">
//                       <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                       </svg>
//                       <p className="text-gray-500">No tasks found</p>
//                       {hasPermission('task.create') && (
//                         <Button variant="secondary" className="mt-4" onClick={() => navigate('/tasks/new')}>
//                           Create your first task
//                         </Button>
//                       )}
//                     </div>
//                   </td>
//                 </table>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t flex items-center justify-between flex-wrap gap-4">
//             <div className="text-sm text-gray-500">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Status Update Modal */}
//       <Modal
//         isOpen={showStatusModal}
//         onClose={() => setShowStatusModal(false)}
//         title={`Update Task Status - ${selectedTask?.title || ''}`}
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Status
//             </label>
//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select status...</option>
//               {selectedTask && getAvailableStatuses(selectedTask.status, user?.role, false).map(status => (
//                 <option key={status} value={status}>
//                   {status.replace(/_/g, ' ').toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={statusNotes}
//               onChange={(e) => setStatusNotes(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Add any notes about this status update..."
//             />
//           </div>
          
//           {newStatus === 'completed' && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//               <p className="text-sm text-green-800">
//                 💡 Tip: Add before/after images in the task details page after marking as completed.
//               </p>
//             </div>
//           )}
          
//           {newStatus === 'verified' && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-sm text-blue-800">
//                 💡 Verifying this task will close it. Make sure all work is completed properly.
//               </p>
//             </div>
//           )}
          
//           {newStatus === 'rejected' && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-sm text-red-800">
//                 💡 Rejecting this task will send it back for rework. Please provide detailed feedback.
//               </p>
//             </div>
//           )}
          
//           <div className="flex justify-end gap-3 pt-4">
//             <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
//               Cancel
//             </Button>
//             <Button 
//               variant="primary" 
//               onClick={handleStatusUpdate} 
//               isLoading={updating}
//               disabled={!newStatus}
//             >
//               Update Status
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TaskList;















// // client/src/pages/tasks/TaskList.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { usePermission } from '../../hooks/usePermission';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import SearchBar from '../../components/common/SearchBar';
// import Modal from '../../components/common/Modal';

// const TaskList = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { showToast } = useToast();
//   const { hasPermission } = usePermission();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [selectedTask, setSelectedTask] = useState(null);
//   const [showStatusModal, setShowStatusModal] = useState(false);
//   const [newStatus, setNewStatus] = useState('');
//   const [statusNotes, setStatusNotes] = useState('');
//   const [updating, setUpdating] = useState(false);
//   const [stats, setStats] = useState({
//     status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
//     priority: { critical: 0, high: 0, medium: 0, low: 0 },
//     overdue: 0
//   });
//   const [filters, setFilters] = useState({
//     status: '',
//     priority: '',
//     search: '',
//     page: 1,
//     limit: 10
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 10,
//     total: 0,
//     pages: 0
//   });

//   // Debug user role
//   console.log('🔍 TaskList - User Role:', user?.role);
//   console.log('🔍 TaskList - User ID:', user?._id);

//   // Status transition options based on user role
//   const getAvailableStatuses = (currentStatus, userRole, isAssignedToMe) => {
//     // Admin and Super Admin can change to any status except closed
//     if (userRole === 'super_admin' || userRole === 'admin') {
//       const statuses = ['pending', 'assigned', 'accepted', 'in_progress', 'completed', 'verified'];
//       return statuses.filter(s => s !== currentStatus && s !== 'closed');
//     }
    
//     // Technician status transitions
//     if (userRole === 'technician' && isAssignedToMe) {
//       const transitions = {
//         'assigned': ['accepted'],
//         'accepted': ['in_progress'],
//         'in_progress': ['completed']
//       };
//       return transitions[currentStatus] || [];
//     }
    
//     // Supervisor can only verify/reject completed tasks
//     if (userRole === 'supervisor' && currentStatus === 'completed') {
//       return ['verified', 'rejected'];
//     }
    
//     // Manager can verify/reject completed tasks
//     if (userRole === 'manager' && currentStatus === 'completed') {
//       return ['verified', 'rejected'];
//     }
    
//     return [];
//   };

//   // Fetch tasks with filters
//   const fetchTasks = useCallback(async () => {
//     setLoading(true);
//     try {
//       const params = {
//         page: filters.page,
//         limit: filters.limit,
//         status: filters.status || undefined,
//         priority: filters.priority || undefined,
//         search: filters.search || undefined
//       };
      
//       const response = await taskApi.getTaskList(params);
      
//       if (response.data && response.data.success) {
//         setTasks(response.data.data?.tasks || []);
//         setStats(response.data.data?.stats || stats);
//         setPagination(response.data.data?.pagination || pagination);
//       } else {
//         setTasks([]);
//       }
//     } catch (error) {
//       console.error('Fetch tasks error:', error);
//       showToast('Failed to load tasks', 'error');
//       setTasks([]);
//     } finally {
//       setLoading(false);
//     }
//   }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, showToast]);

//   useEffect(() => {
//     fetchTasks();
//   }, [fetchTasks]);

//   const handleFilterChange = (name, value) => {
//     setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
//   };

//   const handlePageChange = (newPage) => {
//     if (newPage >= 1 && newPage <= pagination.pages) {
//       setFilters(prev => ({ ...prev, page: newPage }));
//     }
//   };

//   const handleStatusUpdate = async () => {
//     if (!selectedTask || !newStatus) return;
    
//     setUpdating(true);
//     try {
//       const updateData = { 
//         status: newStatus,
//         notes: statusNotes 
//       };
      
//       const response = await taskApi.updateTask(selectedTask._id, updateData);
      
//       if (response.data.success) {
//         showToast(`Task status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
//         setShowStatusModal(false);
//         setSelectedTask(null);
//         setNewStatus('');
//         setStatusNotes('');
//         fetchTasks(); // Refresh the list
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       console.error('Status update error:', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdating(false);
//     }
//   };

//   const openStatusModal = (task, status) => {
//     setSelectedTask(task);
//     setNewStatus(status);
//     setStatusNotes('');
//     setShowStatusModal(true);
//   };

//   const getStatusBadge = (status) => {
//     const badges = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-yellow-100 text-yellow-800',
//       accepted: 'bg-blue-100 text-blue-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800',
//       cancelled: 'bg-red-100 text-red-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
//     return badges[status] || badges.pending;
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

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString();
//   };

//   const isOverdue = (slaDeadline) => {
//     if (!slaDeadline) return false;
//     return new Date(slaDeadline) < new Date();
//   };

//   // 🔴 FIXED: Enhanced canUpdateStatus function with proper role-based permissions
//   const canUpdateStatus = (task) => {
//     const userRole = user?.role;
//     const isAssignedToMe = task.assignment?.assignedTo?.toString() === user?._id?.toString();
    
//     console.log('🔍 canUpdateStatus check:', {
//       taskId: task._id,
//       taskStatus: task.status,
//       userRole,
//       isAssignedToMe,
//       taskAssignedTo: task.assignment?.assignedTo
//     });
    
//     // Super Admin and Admin can update any task
//     if (userRole === 'super_admin' || userRole === 'admin') {
//       console.log('✅ Admin/Super Admin - can update');
//       return true;
//     }
    
//     // Technician can update only their assigned tasks
//     if (userRole === 'technician' && isAssignedToMe) {
//       console.log('✅ Assigned Technician - can update');
//       return true;
//     }
    
//     // Supervisor can verify/reject completed tasks
//     if (userRole === 'supervisor' && (task.status === 'completed' || task.status === 'pending_review')) {
//       console.log('✅ Supervisor - can verify/reject completed task');
//       return true;
//     }
    
//     // Manager can verify/reject completed tasks
//     if (userRole === 'manager' && (task.status === 'completed' || task.status === 'pending_review')) {
//       console.log('✅ Manager - can verify/reject completed task');
//       return true;
//     }
    
//     console.log('❌ No permission to update task');
//     return false;
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
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
//           <p className="text-gray-500 mt-1">Manage and track all tasks</p>
//         </div>
//         {hasPermission('task.create') && (
//           <Button onClick={() => navigate('/tasks/new')}>
//             + Create Task
//           </Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-blue-600">{stats.status?.total || 0}</p>
//           <p className="text-xs text-gray-500">Total Tasks</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-yellow-600">{stats.status?.assigned || 0}</p>
//           <p className="text-xs text-gray-500">Assigned</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-indigo-600">{stats.status?.in_progress || 0}</p>
//           <p className="text-xs text-gray-500">In Progress</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-green-600">{stats.status?.completed || 0}</p>
//           <p className="text-xs text-gray-500">Completed</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-red-600">{stats.overdue || 0}</p>
//           <p className="text-xs text-gray-500">Overdue</p>
//         </Card>
//         <Card className="p-3 text-center hover:shadow-md transition-shadow">
//           <p className="text-xl font-bold text-purple-600">{stats.status?.pending || 0}</p>
//           <p className="text-xs text-gray-500">Pending</p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => handleFilterChange('search', value)}
//               placeholder="Search by title, task ID, or description..."
//             />
//           </div>
//           <select
//             value={filters.status}
//             onChange={(e) => handleFilterChange('status', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Status</option>
//             <option value="pending">Pending</option>
//             <option value="assigned">Assigned</option>
//             <option value="accepted">Accepted</option>
//             <option value="in_progress">In Progress</option>
//             <option value="completed">Completed</option>
//             <option value="verified">Verified</option>
//             <option value="closed">Closed</option>
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => handleFilterChange('priority', e.target.value)}
//             className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="">All Priority</option>
//             <option value="critical">Critical</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//           <Button 
//             variant="secondary" 
//             onClick={() => {
//               setFilters({ status: '', priority: '', search: '', page: 1, limit: 10 });
//             }}
//           >
//             Clear Filters
//           </Button>
//         </div>
//       </Card>

//       {/* Tasks Table */}
//       <Card className="overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {tasks.length > 0 ? (
//                 tasks.map((task) => {
//                   const isAssignedToMe = task.assignment?.assignedTo?.toString() === user?._id?.toString();
//                   const availableStatuses = getAvailableStatuses(task.status, user?.role, isAssignedToMe);
//                   const showStatusButtons = canUpdateStatus(task) && availableStatuses.length > 0;
                  
//                   return (
//                     <tr key={task._id} className="hover:bg-gray-50 transition-colors">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
//                         {task.taskId || task._id?.slice(-6)}
//                       </td>
//                       <td className="px-6 py-4">
//                         <div className="text-sm font-medium text-gray-900">{task.title}</div>
//                         <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
//                           {task.priority || 'medium'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
//                           {task.status?.replace(/_/g, ' ') || 'unknown'}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                         {task.assignment?.assignedToName || 'Unassigned'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <span className={isOverdue(task.slaDeadline) ? 'text-red-600 font-medium' : 'text-gray-500'}>
//                           {formatDate(task.slaDeadline)}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="flex items-center gap-2">
//                           <div className="w-16 bg-gray-200 rounded-full h-1.5">
//                             <div 
//                               className="bg-blue-600 h-1.5 rounded-full"
//                               style={{ width: `${task.progress?.percentage || 0}%` }}
//                             />
//                           </div>
//                           <span className="text-xs text-gray-500">{task.progress?.percentage || 0}%</span>
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm">
//                         <div className="flex flex-wrap gap-2">
//                           <Link 
//                             to={`/tasks/${task._id}`} 
//                             className="text-blue-600 hover:text-blue-800"
//                           >
//                             View
//                           </Link>
//                           {showStatusButtons && (
//                             <div className="relative group">
//                               <button className="text-green-600 hover:text-green-800">
//                                 Update Status ▼
//                               </button>
//                               <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
//                                 {availableStatuses.map(status => (
//                                   <button
//                                     key={status}
//                                     onClick={() => openStatusModal(task, status)}
//                                     className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
//                                   >
//                                     {status.replace(/_/g, ' ')}
//                                   </button>
//                                 ))}
//                               </div>
//                             </div>
//                           )}
//                           {hasPermission('task.assign') && task.status === 'pending' && (
//                             <Link 
//                               to={`/tasks/${task._id}/assign`} 
//                               className="text-purple-600 hover:text-purple-800"
//                             >
//                               Assign
//                             </Link>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center">
//                       <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//                       </svg>
//                       <p className="text-gray-500">No tasks found</p>
//                       {hasPermission('task.create') && (
//                         <Button variant="secondary" className="mt-4" onClick={() => navigate('/tasks/new')}>
//                           Create your first task
//                         </Button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pagination.pages > 1 && (
//           <div className="px-6 py-4 border-t flex items-center justify-between flex-wrap gap-4">
//             <div className="text-sm text-gray-500">
//               Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
//               {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(pagination.page - 1)}
//                 disabled={pagination.page === 1}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Previous
//               </button>
//               <span className="px-3 py-1 text-sm">
//                 Page {pagination.page} of {pagination.pages}
//               </span>
//               <button
//                 onClick={() => handlePageChange(pagination.page + 1)}
//                 disabled={pagination.page === pagination.pages}
//                 className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Status Update Modal */}
//       <Modal
//         isOpen={showStatusModal}
//         onClose={() => setShowStatusModal(false)}
//         title={`Update Task Status - ${selectedTask?.title || ''}`}
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               New Status
//             </label>
//             <select
//               value={newStatus}
//               onChange={(e) => setNewStatus(e.target.value)}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             >
//               <option value="">Select status...</option>
//               {selectedTask && getAvailableStatuses(selectedTask.status, user?.role, false).map(status => (
//                 <option key={status} value={status}>
//                   {status.replace(/_/g, ' ').toUpperCase()}
//                 </option>
//               ))}
//             </select>
//           </div>
          
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes (Optional)
//             </label>
//             <textarea
//               value={statusNotes}
//               onChange={(e) => setStatusNotes(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Add any notes about this status update..."
//             />
//           </div>
          
//           {newStatus === 'completed' && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-3">
//               <p className="text-sm text-green-800">
//                 💡 Tip: Add before/after images in the task details page after marking as completed.
//               </p>
//             </div>
//           )}
          
//           {newStatus === 'verified' && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//               <p className="text-sm text-blue-800">
//                 💡 Verifying this task will close it. Make sure all work is completed properly.
//               </p>
//             </div>
//           )}
          
//           {newStatus === 'rejected' && (
//             <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//               <p className="text-sm text-red-800">
//                 💡 Rejecting this task will send it back for rework. Please provide detailed feedback.
//               </p>
//             </div>
//           )}
          
//           <div className="flex justify-end gap-3 pt-4">
//             <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
//               Cancel
//             </Button>
//             <Button 
//               variant="primary" 
//               onClick={handleStatusUpdate} 
//               isLoading={updating}
//               disabled={!newStatus}
//             >
//               Update Status
//             </Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default TaskList;





// client/src/pages/tasks/TaskList.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { usePermission } from '../../hooks/usePermission';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import SearchBar from '../../components/common/SearchBar';
import Modal from '../../components/common/Modal';

const TaskList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { hasPermission } = usePermission();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    status: { pending: 0, assigned: 0, in_progress: 0, completed: 0, total: 0 },
    priority: { critical: 0, high: 0, medium: 0, low: 0 },
    overdue: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  // Debug user role
  console.log('🔍 TaskList - User Role:', user?.role);
  console.log('🔍 TaskList - User ID:', user?._id);

  // Status transition options based on user role
  const getAvailableStatuses = (currentStatus, userRole, isAssignedToMe) => {
    // Admin and Super Admin can change to any status except closed
    if (userRole === 'super_admin' || userRole === 'admin') {
      const statuses = ['pending', 'assigned', 'accepted', 'in_progress', 'completed', 'verified'];
      return statuses.filter(s => s !== currentStatus && s !== 'closed');
    }
    
    // Technician status transitions
    if (userRole === 'technician' && isAssignedToMe) {
      const transitions = {
        'assigned': ['accepted'],
        'accepted': ['in_progress'],
        'in_progress': ['completed']
      };
      return transitions[currentStatus] || [];
    }
    
    // Supervisor can only verify/reject completed tasks
    if (userRole === 'supervisor' && (currentStatus === 'completed' || currentStatus === 'pending_review')) {
      return ['verified', 'rejected'];
    }
    
    // Manager can verify/reject completed tasks
    if (userRole === 'manager' && (currentStatus === 'completed' || currentStatus === 'pending_review')) {
      return ['verified', 'rejected'];
    }
    
    return [];
  };

  // Fetch tasks with filters
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page,
        limit: filters.limit,
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        search: filters.search || undefined
      };
      
      const response = await taskApi.getTaskList(params);
      
      if (response.data && response.data.success) {
        setTasks(response.data.data?.tasks || []);
        setStats(response.data.data?.stats || stats);
        setPagination(response.data.data?.pagination || pagination);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Fetch tasks error:', error);
      showToast('Failed to load tasks', 'error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.limit, filters.status, filters.priority, filters.search, showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  const handleStatusUpdate = async () => {
    if (!selectedTask || !newStatus) return;
    
    setUpdating(true);
    try {
      const updateData = { 
        status: newStatus,
        notes: statusNotes 
      };
      
      const response = await taskApi.updateTask(selectedTask._id, updateData);
      
      if (response.data.success) {
        showToast(`Task status updated to ${newStatus.replace(/_/g, ' ')}`, 'success');
        setShowStatusModal(false);
        setSelectedTask(null);
        setNewStatus('');
        setStatusNotes('');
        fetchTasks(); // Refresh the list
      } else {
        showToast(response.data.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      console.error('Status update error:', error);
      showToast(error.response?.data?.error || 'Failed to update status', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const openStatusModal = (task, status) => {
    setSelectedTask(task);
    setNewStatus(status);
    setStatusNotes('');
    setShowStatusModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-gray-100 text-gray-800',
      assigned: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      verified: 'bg-teal-100 text-teal-800',
      closed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return badges[status] || badges.pending;
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const isOverdue = (slaDeadline) => {
    if (!slaDeadline) return false;
    return new Date(slaDeadline) < new Date();
  };

  // 🔴 FIXED: Enhanced canUpdateStatus function with proper role-based permissions
  const canUpdateStatus = (task) => {
    const userRole = user?.role;
    const userId = user?._id;
    const isAssignedToMe = task.assignment?.assignedTo?.toString() === userId?.toString();
    
    console.log('🔍 canUpdateStatus check:', {
      taskId: task._id,
      taskStatus: task.status,
      userRole,
      userId,
      isAssignedToMe,
      taskAssignedTo: task.assignment?.assignedTo
    });
    
    // Super Admin and Admin can update any task
    if (userRole === 'super_admin' || userRole === 'admin') {
      console.log('✅ Admin/Super Admin - can update');
      return true;
    }
    
    // Technician can update only their assigned tasks
    if (userRole === 'technician' && isAssignedToMe) {
      console.log('✅ Assigned Technician - can update');
      return true;
    }
    
    // Supervisor can verify/reject completed tasks
    if (userRole === 'supervisor' && (task.status === 'completed' || task.status === 'pending_review')) {
      console.log('✅ Supervisor - can verify/reject completed task');
      return true;
    }
    
    // Manager can verify/reject completed tasks
    if (userRole === 'manager' && (task.status === 'completed' || task.status === 'pending_review')) {
      console.log('✅ Manager - can verify/reject completed task');
      return true;
    }
    
    console.log('❌ No permission to update task');
    return false;
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage and track all tasks</p>
        </div>
        {hasPermission('task.create') && (
          <Button onClick={() => navigate('/tasks/new')}>
            + Create Task
          </Button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-blue-600">{stats.status?.total || 0}</p>
          <p className="text-xs text-gray-500">Total Tasks</p>
        </Card>
        <Card className="p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-yellow-600">{stats.status?.assigned || 0}</p>
          <p className="text-xs text-gray-500">Assigned</p>
        </Card>
        <Card className="p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-indigo-600">{stats.status?.in_progress || 0}</p>
          <p className="text-xs text-gray-500">In Progress</p>
        </Card>
        <Card className="p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-green-600">{stats.status?.completed || 0}</p>
          <p className="text-xs text-gray-500">Completed</p>
        </Card>
        <Card className="p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-red-600">{stats.overdue || 0}</p>
          <p className="text-xs text-gray-500">Overdue</p>
        </Card>
        <Card className="p-3 text-center hover:shadow-md transition-shadow">
          <p className="text-xl font-bold text-purple-600">{stats.status?.pending || 0}</p>
          <p className="text-xs text-gray-500">Pending</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={filters.search}
              onChange={(value) => handleFilterChange('search', value)}
              placeholder="Search by title, task ID, or description..."
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="accepted">Accepted</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priority</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <Button 
            variant="secondary" 
            onClick={() => {
              setFilters({ status: '', priority: '', search: '', page: 1, limit: 10 });
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Progress</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks.length > 0 ? (
                tasks.map((task) => {
                  const isAssignedToMe = task.assignment?.assignedTo?.toString() === user?._id?.toString();
                  const availableStatuses = getAvailableStatuses(task.status, user?.role, isAssignedToMe);
                  const showStatusButtons = canUpdateStatus(task) && availableStatuses.length > 0;
                  
                  return (
                    <tr key={task._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                        {task.taskId || task._id?.slice(-6)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{task.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{task.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(task.priority)}`}>
                          {task.priority || 'medium'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(task.status)}`}>
                          {task.status?.replace(/_/g, ' ') || 'unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {task.assignment?.assignedToName || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={isOverdue(task.slaDeadline) ? 'text-red-600 font-medium' : 'text-gray-500'}>
                          {formatDate(task.slaDeadline)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${task.progress?.percentage || 0}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{task.progress?.percentage || 0}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex flex-wrap gap-2">
                          <Link 
                            to={`/tasks/${task._id}`} 
                            className="text-blue-600 hover:text-blue-800"
                          >
                            View
                          </Link>
                          {showStatusButtons && (
                            <div className="relative group">
                              <button className="text-green-600 hover:text-green-800">
                                Update Status ▼
                              </button>
                              <div className="absolute right-0 mt-1 w-36 bg-white border rounded-lg shadow-lg hidden group-hover:block z-10">
                                {availableStatuses.map(status => (
                                  <button
                                    key={status}
                                    onClick={() => openStatusModal(task, status)}
                                    className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                                  >
                                    {status.replace(/_/g, ' ')}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {hasPermission('task.assign') && task.status === 'pending' && (
                            <Link 
                              to={`/tasks/${task._id}/assign`} 
                              className="text-purple-600 hover:text-purple-800"
                            >
                              Assign
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center">
                      <svg className="w-16 h-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="text-gray-500">No tasks found</p>
                      {hasPermission('task.create') && (
                        <Button variant="secondary" className="mt-4" onClick={() => navigate('/tasks/new')}>
                          Create your first task
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} tasks
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                Page {pagination.page} of {pagination.pages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title={`Update Task Status - ${selectedTask?.title || ''}`}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select status...</option>
              {selectedTask && getAvailableStatuses(selectedTask.status, user?.role, false).map(status => (
                <option key={status} value={status}>
                  {status.replace(/_/g, ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              value={statusNotes}
              onChange={(e) => setStatusNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes about this status update..."
            />
          </div>
          
          {newStatus === 'completed' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-sm text-green-800">
                💡 Tip: Add before/after images in the task details page after marking as completed.
              </p>
            </div>
          )}
          
          {newStatus === 'verified' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                💡 Verifying this task will close it. Make sure all work is completed properly.
              </p>
            </div>
          )}
          
          {newStatus === 'rejected' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">
                💡 Rejecting this task will send it back for rework. Please provide detailed feedback.
              </p>
            </div>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleStatusUpdate} 
              isLoading={updating}
              disabled={!newStatus}
            >
              Update Status
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TaskList;