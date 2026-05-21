// // client/src/pages/sla/AtRiskTasks.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import { Link } from 'react-router-dom';
// import { slaApi } from '../../api/sla.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import SearchBar from '../../components/common/SearchBar';

// const AtRiskTasks = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [tasks, setTasks] = useState([]);
//   const [stats, setStats] = useState({
//     total: 0,
//     critical: 0,
//     high: 0,
//     medium: 0,
//     low: 0
//   });
//   const [filters, setFilters] = useState({
//     buildingId: '',
//     priority: '',
//     page: 1,
//     limit: 20
//   });
//   const [pagination, setPagination] = useState({
//     page: 1,
//     limit: 20,
//     total: 0,
//     pages: 0
//   });
//   const [buildings, setBuildings] = useState([]);
//   const [escalating, setEscalating] = useState(false);

//   useEffect(() => {
//     fetchAtRiskTasks();
//     fetchBuildings();
//   }, [filters.page, filters.buildingId, filters.priority]);

//   const fetchAtRiskTasks = async () => {
//     setLoading(true);
//     try {
//       const response = await slaApi.getAtRiskTasks(filters);
//       if (response.data.success) {
//         setTasks(response.data.data);
//         setPagination(response.data.pagination);
        
//         // Calculate stats
//         const statsData = {
//           total: response.data.data.length,
//           critical: response.data.data.filter(t => t.priority === 'critical').length,
//           high: response.data.data.filter(t => t.priority === 'high').length,
//           medium: response.data.data.filter(t => t.priority === 'medium').length,
//           low: response.data.data.filter(t => t.priority === 'low').length
//         };
//         setStats(statsData);
//       }
//     } catch (error) {
//       console.error('Fetch at-risk tasks error:', error);
//       showToast('Failed to load at-risk tasks', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchBuildings = async () => {
//     try {
//       const { buildingApi } = await import('../../api/building.api');
//       const response = await buildingApi.getBuildings();
//       if (response.data.success) {
//         setBuildings(response.data.data.buildings || []);
//       }
//     } catch (error) {
//       console.error('Fetch buildings error:', error);
//     }
//   };

//   const handleEscalate = async (taskId, escalationLevel) => {
//     if (!window.confirm(`Escalate this task to level ${escalationLevel + 1}?`)) {
//       return;
//     }
    
//     setEscalating(true);
//     try {
//       const response = await slaApi.escalateTask(taskId, `Auto-escalated due to SLA risk at ${new Date().toLocaleString()}`);
//       if (response.data.success) {
//         showToast(`Task escalated to level ${escalationLevel + 1}`, 'success');
//         fetchAtRiskTasks();
//       }
//     } catch (error) {
//       showToast('Failed to escalate task', 'error');
//     } finally {
//       setEscalating(false);
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

//   const getRiskLevel = (timeRemaining) => {
//     if (timeRemaining <= 30) return { level: 'Critical', color: 'bg-red-100 text-red-800' };
//     if (timeRemaining <= 60) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
//     if (timeRemaining <= 120) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
//     return { level: 'Low', color: 'bg-green-100 text-green-800' };
//   };

//   const formatTimeRemaining = (minutes) => {
//     if (minutes < 60) return `${minutes} minutes`;
//     const hours = Math.floor(minutes / 60);
//     const mins = minutes % 60;
//     if (hours < 24) return `${hours}h ${mins}m`;
//     const days = Math.floor(hours / 24);
//     return `${days}d ${hours % 24}h`;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">At-Risk Tasks</h1>
//           <p className="text-gray-500 mt-1">Tasks approaching SLA deadline - Action Required</p>
//         </div>
//         <div className="flex gap-2">
//           <Link to="/sla/dashboard">
//             <Button variant="secondary" size="sm">
//               ← Back to Dashboard
//             </Button>
//           </Link>
//           <Link to="/sla/breached">
//             <Button variant="danger" size="sm">
//               View Breached Tasks
//             </Button>
//           </Link>
//         </div>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{stats.total}</p>
//           <p className="text-sm text-gray-500">Total At-Risk</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
//           <p className="text-sm text-gray-500">Critical</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
//           <p className="text-sm text-gray-500">High</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
//           <p className="text-sm text-gray-500">Medium</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{stats.low}</p>
//           <p className="text-sm text-gray-500">Low</p>
//         </Card>
//       </div>

//       {/* Filters */}
//       <Card className="p-4">
//         <div className="flex flex-col md:flex-row gap-4">
//           <div className="flex-1">
//             <SearchBar
//               value={filters.search}
//               onChange={(value) => setFilters({ ...filters, search: value, page: 1 })}
//               placeholder="Search tasks..."
//             />
//           </div>
//           <select
//             value={filters.buildingId}
//             onChange={(e) => setFilters({ ...filters, buildingId: e.target.value, page: 1 })}
//             className="px-3 py-2 border rounded-lg"
//           >
//             <option value="">All Buildings</option>
//             {buildings.map(building => (
//               <option key={building._id} value={building._id}>{building.name}</option>
//             ))}
//           </select>
//           <select
//             value={filters.priority}
//             onChange={(e) => setFilters({ ...filters, priority: e.target.value, page: 1 })}
//             className="px-3 py-2 border rounded-lg"
//           >
//             <option value="">All Priorities</option>
//             <option value="critical">Critical</option>
//             <option value="high">High</option>
//             <option value="medium">Medium</option>
//             <option value="low">Low</option>
//           </select>
//         </div>
//       </Card>

//       {/* At-Risk Tasks List */}
//       <div className="space-y-4">
//         {tasks.length > 0 ? (
//           tasks.map((task) => {
//             const risk = getRiskLevel(task.timeRemaining);
//             return (
//               <Card key={task._id} className="p-6 hover:shadow-md transition-shadow">
//                 <div className="flex flex-col md:flex-row justify-between gap-4">
//                   {/* Task Info */}
//                   <div className="flex-1">
//                     <div className="flex items-center gap-2 mb-2">
//                       <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
//                         {task.priority?.toUpperCase()}
//                       </span>
//                       <span className={`px-2 py-1 text-xs rounded-full ${risk.color}`}>
//                         ⚠️ {risk.level} Risk
//                       </span>
//                       <span className="text-xs text-gray-400">ID: {task.taskId}</span>
//                     </div>
//                     <h3 className="font-semibold text-gray-900 text-lg">{task.title}</h3>
//                     <p className="text-gray-600 mt-1">{task.description}</p>
                    
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
//                       <div>
//                         <p className="text-xs text-gray-500">Assigned To</p>
//                         <p className="text-sm font-medium">{task.assignment?.assignedToName || 'Unassigned'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Building</p>
//                         <p className="text-sm">{task.location?.buildingName || 'N/A'}</p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">SLA Deadline</p>
//                         <p className="text-sm font-medium text-red-600">
//                           {new Date(task.slaDeadline).toLocaleString()}
//                         </p>
//                       </div>
//                       <div>
//                         <p className="text-xs text-gray-500">Time Remaining</p>
//                         <p className={`text-sm font-bold ${risk.level === 'Critical' ? 'text-red-600 animate-pulse' : risk.level === 'High' ? 'text-orange-600' : 'text-yellow-600'}`}>
//                           {formatTimeRemaining(task.timeRemaining)}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Actions */}
//                   <div className="flex flex-col gap-2 min-w-[120px]">
//                     <Link to={`/tasks/${task._id}`}>
//                       <Button size="sm" variant="secondary" className="w-full">
//                         View Details
//                       </Button>
//                     </Link>
//                     <Button 
//                       size="sm" 
//                       variant="danger" 
//                       className="w-full"
//                       onClick={() => handleEscalate(task._id, task.escalationLevel || 0)}
//                       disabled={escalating}
//                     >
//                       Escalate
//                     </Button>
//                     <Link to={`/tasks/${task._id}/assign`}>
//                       <Button size="sm" variant="primary" className="w-full">
//                         Reassign
//                       </Button>
//                     </Link>
//                   </div>
//                 </div>
                
//                 {/* Progress Bar */}
//                 <div className="mt-4">
//                   <div className="flex justify-between text-xs mb-1">
//                     <span>Progress</span>
//                     <span>{task.progress?.percentage || 0}%</span>
//                   </div>
//                   <div className="w-full bg-gray-200 rounded-full h-2">
//                     <div 
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${task.progress?.percentage || 0}%` }}
//                     />
//                   </div>
//                 </div>
//               </Card>
//             );
//           })
//         ) : (
//           <Card className="p-12 text-center">
//             <div className="flex flex-col items-center">
//               <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
//                 <span className="text-4xl">✅</span>
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No At-Risk Tasks</h3>
//               <p className="text-gray-500">All tasks are on track with their SLA deadlines</p>
//               <Link to="/sla/dashboard" className="mt-4">
//                 <Button variant="secondary">View SLA Dashboard</Button>
//               </Link>
//             </div>
//           </Card>
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination.pages > 1 && (
//         <div className="flex justify-center mt-4">
//           <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
//             <button
//               onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
//               disabled={filters.page === 1}
//               className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Previous
//             </button>
//             <div className="flex gap-1">
//               {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
//                 let pageNum;
//                 if (pagination.pages <= 5) {
//                   pageNum = i + 1;
//                 } else if (filters.page <= 3) {
//                   pageNum = i + 1;
//                 } else if (filters.page >= pagination.pages - 2) {
//                   pageNum = pagination.pages - 4 + i;
//                 } else {
//                   pageNum = filters.page - 2 + i;
//                 }
//                 return (
//                   <button
//                     key={pageNum}
//                     onClick={() => setFilters({ ...filters, page: pageNum })}
//                     className={`px-3 py-1 rounded-md text-sm transition-colors ${
//                       filters.page === pageNum
//                         ? 'bg-blue-600 text-white'
//                         : 'hover:bg-gray-100'
//                     }`}
//                   >
//                     {pageNum}
//                   </button>
//                 );
//               })}
//             </div>
//             <button
//               onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
//               disabled={filters.page === pagination.pages}
//               className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Urgent Action Banner */}
//       {stats.critical > 0 && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-4">
//           <div className="flex items-center gap-3">
//             <div className="flex-shrink-0">
//               <span className="text-2xl">🚨</span>
//             </div>
//             <div>
//               <h4 className="font-semibold text-red-800">Urgent Action Required</h4>
//               <p className="text-sm text-red-700">
//                 {stats.critical} task{stats.critical !== 1 ? 's are' : ' is'} at critical risk of SLA breach. 
//                 Immediate attention needed.
//               </p>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Recommendation Section */}
//       <Card className="p-6 bg-blue-50">
//         <h3 className="font-semibold text-blue-800 mb-2">💡 Recommendations</h3>
//         <ul className="text-sm text-blue-700 space-y-1">
//           <li>• Prioritize critical at-risk tasks for immediate action</li>
//           <li>• Consider reallocating resources to high-priority tasks</li>
//           <li>• Escalate tasks that cannot be completed on time</li>
//           <li>• Review workload distribution for affected technicians</li>
//         </ul>
//       </Card>
//     </div>
//   );
// };

// export default AtRiskTasks;





// client/src/pages/sla/AtRiskTasks.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { slaApi } from '../../api/sla.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const AtRiskTasks = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    critical: 0,
    high: 0,
    medium: 0,
    low: 0
  });
  const [filters, setFilters] = useState({
    search: '',
    buildingId: '',
    priority: '',
    page: 1,
    limit: 20
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const [buildings, setBuildings] = useState([]);
  const [escalating, setEscalating] = useState(false);

  useEffect(() => {
    fetchAtRiskTasks();
    fetchBuildings();
  }, [filters.page, filters.buildingId, filters.priority, filters.search]);

  const fetchAtRiskTasks = async () => {
    setLoading(true);
    try {
      const response = await slaApi.getAtRiskTasks(filters);
      
      // Handle different response structures
      let tasksData = [];
      let paginationData = { page: 1, limit: 20, total: 0, pages: 0 };
      
      if (response.data && response.data.success) {
        tasksData = response.data.data || [];
        paginationData = response.data.pagination || paginationData;
      } else if (response.data && Array.isArray(response.data)) {
        tasksData = response.data;
      } else if (response.data && response.data.tasks) {
        tasksData = response.data.tasks;
      } else if (Array.isArray(response)) {
        tasksData = response;
      }
      
      setTasks(tasksData);
      setPagination(paginationData);
      
      // Calculate stats safely
      const statsData = {
        total: tasksData.length,
        critical: tasksData.filter(t => t && (t.priority === 'critical' || t.priority === 'Critical')).length,
        high: tasksData.filter(t => t && (t.priority === 'high' || t.priority === 'High')).length,
        medium: tasksData.filter(t => t && (t.priority === 'medium' || t.priority === 'Medium')).length,
        low: tasksData.filter(t => t && (t.priority === 'low' || t.priority === 'Low')).length
      };
      setStats(statsData);
      
    } catch (error) {
      console.error('Fetch at-risk tasks error:', error);
      showToast(error.response?.data?.message || 'Failed to load at-risk tasks', 'error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildings = async () => {
    try {
      const { buildingApi } = await import('../../api/building.api');
      const response = await buildingApi.getBuildings();
      
      let buildingsData = [];
      if (response.data && response.data.success) {
        buildingsData = response.data.data?.buildings || response.data.data || [];
      } else if (response.data && Array.isArray(response.data)) {
        buildingsData = response.data;
      }
      
      setBuildings(buildingsData);
    } catch (error) {
      console.error('Fetch buildings error:', error);
    }
  };

  const handleEscalate = async (taskId, escalationLevel = 0) => {
    const nextLevel = escalationLevel + 1;
    if (!window.confirm(`⚠️ Are you sure you want to escalate this task to Level ${nextLevel}?\n\nThis will notify higher management and mark the task as escalated.`)) {
      return;
    }
    
    setEscalating(true);
    try {
      const response = await slaApi.escalateTask(taskId, `Auto-escalated due to SLA risk at ${new Date().toLocaleString()}`);
      
      if (response.data && (response.data.success || response.status === 200)) {
        showToast(`✅ Task escalated to Level ${nextLevel} successfully`, 'success');
        fetchAtRiskTasks(); // Refresh the list
      } else {
        throw new Error('Escalation failed');
      }
    } catch (error) {
      console.error('Escalation error:', error);
      showToast(error.response?.data?.message || 'Failed to escalate task', 'error');
    } finally {
      setEscalating(false);
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

  const getRiskLevel = (timeRemaining) => {
    if (!timeRemaining && timeRemaining !== 0) return { level: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    if (timeRemaining <= 30) return { level: 'Critical', color: 'bg-red-100 text-red-800' };
    if (timeRemaining <= 60) return { level: 'High', color: 'bg-orange-100 text-orange-800' };
    if (timeRemaining <= 120) return { level: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { level: 'Low', color: 'bg-green-100 text-green-800' };
  };

  const formatTimeRemaining = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    if (minutes < 0) return 'Overdue';
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ${mins > 0 ? `${mins}m` : ''}`;
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days} day${days !== 1 ? 's' : ''} ${remainingHours > 0 ? `${remainingHours}h` : ''}`;
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setFilters(prev => ({ ...prev, page: newPage }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">At-Risk Tasks</h1>
          <p className="text-gray-500 mt-1">Tasks approaching SLA deadline - Action Required</p>
        </div>
        <div className="flex gap-2">
          <Link to="/sla/dashboard">
            <Button variant="secondary" size="sm">
              ← Back to Dashboard
            </Button>
          </Link>
          <Link to="/sla/breached">
            <Button variant="danger" size="sm">
              View Breached Tasks
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-sm text-gray-500">Total At-Risk</p>
        </Card>
        <Card className="p-4 text-center bg-red-50">
          <p className="text-2xl font-bold text-red-600">{stats.critical}</p>
          <p className="text-sm text-red-600">Critical</p>
        </Card>
        <Card className="p-4 text-center bg-orange-50">
          <p className="text-2xl font-bold text-orange-600">{stats.high}</p>
          <p className="text-sm text-orange-600">High Risk</p>
        </Card>
        <Card className="p-4 text-center bg-yellow-50">
          <p className="text-2xl font-bold text-yellow-600">{stats.medium}</p>
          <p className="text-sm text-yellow-600">Medium Risk</p>
        </Card>
        <Card className="p-4 text-center bg-green-50">
          <p className="text-2xl font-bold text-green-600">{stats.low}</p>
          <p className="text-sm text-green-600">Low Risk</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search tasks by title or ID..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filters.buildingId}
            onChange={(e) => handleFilterChange('buildingId', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Buildings</option>
            {buildings.map(building => (
              <option key={building._id || building.id} value={building._id || building.id}>
                {building.name}
              </option>
            ))}
          </select>
          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </Card>

      {/* At-Risk Tasks List */}
      <div className="space-y-4">
        {tasks.length > 0 ? (
          tasks.map((task) => {
            const risk = getRiskLevel(task.timeRemaining);
            const taskId = task._id || task.id;
            const taskNumber = task.taskId || task.taskNumber || taskId?.slice(-6);
            const title = task.title || 'Untitled Task';
            const description = task.description || 'No description provided';
            const assignedTo = task.assignedTo?.name || task.assignedToName || task.assignment?.assignedToName || 'Unassigned';
            const buildingName = task.building?.name || task.location?.buildingName || 'N/A';
            const slaDeadline = task.slaDeadline || task.deadline;
            const progressPercentage = task.progress?.percentage || task.progress || 0;
            const escalationLevel = task.escalationLevel || 0;
            
            return (
              <Card key={taskId} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  {/* Task Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                        {task.priority?.toUpperCase() || 'MEDIUM'}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${risk.color}`}>
                        ⚠️ {risk.level} Risk
                      </span>
                      <span className="text-xs text-gray-400">ID: {taskNumber}</span>
                      {escalationLevel > 0 && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                          Escalated L{escalationLevel}
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
                    <p className="text-gray-600 mt-1 text-sm line-clamp-2">{description}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                      <div>
                        <p className="text-xs text-gray-500">Assigned To</p>
                        <p className="text-sm font-medium">{assignedTo}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Building</p>
                        <p className="text-sm">{buildingName}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">SLA Deadline</p>
                        <p className="text-sm font-medium text-red-600">
                          {slaDeadline ? new Date(slaDeadline).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Time Remaining</p>
                        <p className={`text-sm font-bold ${
                          risk.level === 'Critical' ? 'text-red-600 animate-pulse' : 
                          risk.level === 'High' ? 'text-orange-600' : 
                          risk.level === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                          {formatTimeRemaining(task.timeRemaining)}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-row md:flex-col gap-2 min-w-[120px]">
                    <Link to={`/tasks/${taskId}`} className="flex-1">
                      <Button size="sm" variant="secondary" className="w-full">
                        View Details
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="w-full"
                      onClick={() => handleEscalate(taskId, escalationLevel)}
                      disabled={escalating}
                    >
                      {escalating ? 'Escalating...' : `Escalate to L${escalationLevel + 1}`}
                    </Button>
                    <Link to={`/tasks/${taskId}/assign`} className="flex-1">
                      <Button size="sm" variant="primary" className="w-full">
                        Reassign
                      </Button>
                    </Link>
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <Card className="p-12 text-center">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <span className="text-4xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No At-Risk Tasks</h3>
              <p className="text-gray-500">All tasks are on track with their SLA deadlines</p>
              <Link to="/sla/dashboard" className="mt-4">
                <Button variant="secondary">View SLA Dashboard</Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow px-4 py-2">
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                let pageNum;
                if (pagination.pages <= 5) {
                  pageNum = i + 1;
                } else if (filters.page <= 3) {
                  pageNum = i + 1;
                } else if (filters.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i;
                } else {
                  pageNum = filters.page - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md text-sm transition-colors ${
                      filters.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === pagination.pages}
              className="px-3 py-1 border rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Urgent Action Banner */}
      {stats.critical > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <span className="text-2xl">🚨</span>
            </div>
            <div>
              <h4 className="font-semibold text-red-800">Urgent Action Required</h4>
              <p className="text-sm text-red-700">
                {stats.critical} task{stats.critical !== 1 ? 's are' : ' is'} at critical risk of SLA breach. 
                Immediate attention needed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recommendation Section */}
      <Card className="p-6 bg-blue-50">
        <h3 className="font-semibold text-blue-800 mb-2">💡 Recommendations</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Prioritize critical at-risk tasks for immediate action</li>
          <li>• Consider reallocating resources to high-priority tasks</li>
          <li>• Escalate tasks that cannot be completed on time</li>
          <li>• Review workload distribution for affected technicians</li>
          {stats.critical > 0 && (
            <li className="font-semibold">• {stats.critical} critical task(s) require immediate attention!</li>
          )}
        </ul>
      </Card>
    </div>
  );
};

export default AtRiskTasks;