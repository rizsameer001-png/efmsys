// // client/src/pages/tasks/TaskDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import Badge from '../../components/common/Badge';
// import Tabs from '../../components/common/Tabs';
// import TaskProgressBar from '../../components/tasks/TaskProgressBar';
// import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
// import TaskCommunication from '../../components/tasks/TaskCommunication';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import { useTaskTimer } from '../../hooks/useTaskTimer';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { formatDateTime } from '../../utils/formatters';

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { taskUpdates } = useTaskSocket();
//   const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
//   const [task, setTask] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('details');

//   useEffect(() => {
//     fetchTask();
//   }, [id]);

//   useEffect(() => {
//     if (taskUpdates[id]) {
//       fetchTask();
//     }
//   }, [taskUpdates, id]);

//   const fetchTask = async () => {
//     setLoading(true);
//     try {
//       const response = await taskApi.getTaskById(id);
//       setTask(response.data.data.task);
//       setProgress(response.data.data.progress);
//     } catch (error) {
//       showToast('Failed to load task', 'error');
//       navigate('/tasks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async () => {
//     try {
//       await taskApi.acceptTask(id);
//       showToast('Task accepted', 'success');
//       fetchTask();
//     } catch (error) {
//       showToast('Failed to accept task', 'error');
//     }
//   };

//   const handleStart = async () => {
//     try {
//       const position = await getCurrentPosition();
//       await taskApi.startTask(id, position);
//       startTimer();
//       showToast('Task started', 'success');
//       fetchTask();
//     } catch (error) {
//       showToast('Failed to start task', 'error');
//     }
//   };

//   const handlePause = async () => {
//     try {
//       await taskApi.pauseTask(id, 'Paused by technician');
//       pauseTimer();
//       showToast('Task paused', 'info');
//       fetchTask();
//     } catch (error) {
//       showToast('Failed to pause task', 'error');
//     }
//   };

//   const handleResume = async () => {
//     try {
//       await taskApi.resumeTask(id);
//       resumeTimer();
//       showToast('Task resumed', 'success');
//       fetchTask();
//     } catch (error) {
//       showToast('Failed to resume task', 'error');
//     }
//   };

//   const handleComplete = async (completionData) => {
//     try {
//       await taskApi.completeTask(id, completionData);
//       showToast('Task completed! Pending verification', 'success');
//       fetchTask();
//     } catch (error) {
//       showToast('Failed to complete task', 'error');
//     }
//   };

//   const handleVerify = async (data) => {
//     try {
//       await taskApi.verifyTask(id, data);
//       showToast('Task verified and closed', 'success');
//       fetchTask();
//     } catch (error) {
//       showToast('Failed to verify task', 'error');
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         reject
//       );
//     });
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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const isTechnician = user?.role === 'technician';
//   const isAssignedToMe = task?.assignment?.assignedTo === user?._id;
//   const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
//   const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
//   const canPause = isTechnician && isAssignedToMe && task?.status === 'in_progress' && !isPaused;
//   const canResume = isTechnician && isAssignedToMe && task?.status === 'in_progress' && isPaused;
//   const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
//   const canVerify = ['supervisor', 'manager'].includes(user?.role) && task?.status === 'completed';

//   if (loading) return <Spinner />;
//   if (!task) return null;

//   const tabs = [
//     { id: 'details', label: 'Details', content: (
//       <div className="space-y-6">
//         {/* Basic Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-500">Task ID</label>
//             <p className="font-mono">{task.taskId}</p>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Status</label>
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Priority</label>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Created</label>
//             <p>{formatDateTime(task.createdAt)}</p>
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="text-sm text-gray-500">Description</label>
//           <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description}</p>
//         </div>

//         {/* Location */}
//         {task.location && (
//           <div>
//             <label className="text-sm text-gray-500">Location</label>
//             <p className="mt-1">📍 {task.location.buildingName}</p>
//             {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
//             {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
//           </div>
//         )}

//         {/* Assignment */}
//         <div>
//           <label className="text-sm text-gray-500">Assignment</label>
//           <p className="mt-1">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//           <p>Assigned by: {task.assignment?.assignedBy?.firstName} {task.assignment?.assignedBy?.lastName}</p>
//           <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
//         </div>

//         {/* Timeline */}
//         {task.timeline && (
//           <div>
//             <label className="text-sm text-gray-500">Timeline</label>
//             <div className="mt-2 space-y-1 text-sm">
//               {task.timeline.acceptedAt && <p>✅ Accepted: {formatDateTime(task.timeline.acceptedAt)}</p>}
//               {task.timeline.startedAt && <p>🔄 Started: {formatDateTime(task.timeline.startedAt)}</p>}
//               {task.timeline.completedAt && <p>✔️ Completed: {formatDateTime(task.timeline.completedAt)}</p>}
//               {task.timeline.verifiedAt && <p>✓ Verified: {formatDateTime(task.timeline.verifiedAt)}</p>}
//             </div>
//           </div>
//         )}

//         {/* SLA Info */}
//         <div>
//           <label className="text-sm text-gray-500">SLA</label>
//           <p className={`mt-1 ${task.slaBreached ? 'text-red-600' : 'text-green-600'}`}>
//             Deadline: {formatDateTime(task.slaDeadline)}
//             {task.slaBreached && <span className="ml-2">⚠️ BREACHED</span>}
//           </p>
//         </div>
//       </div>
//     )},
//     { id: 'progress', label: 'Progress', content: (
//       <div className="space-y-6">
//         <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
        
//         {/* Checklist */}
//         {task.checklist && task.checklist.length > 0 && (
//           <div>
//             <h3 className="font-medium mb-3">Checklist</h3>
//             <div className="space-y-2">
//               {task.checklist.map((item, idx) => (
//                 <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     checked={item.completed}
//                     onChange={() => {}} // Will implement
//                     disabled={!canStart}
//                     className="h-4 w-4 rounded border-gray-300"
//                   />
//                   <div className="flex-1">
//                     <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName}</p>
//                     {item.description && <p className="text-xs text-gray-500">{item.description}</p>}
//                   </div>
//                   {item.imageAfter && <img src={item.imageAfter} className="h-8 w-8 rounded" alt="Evidence" />}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Time Tracking */}
//         {isTechnician && isAssignedToMe && task.status === 'in_progress' && (
//           <div className="bg-gray-100 p-4 rounded-lg text-center">
//             <p className="text-2xl font-mono font-bold">{formatTime()}</p>
//             <div className="flex justify-center space-x-2 mt-2">
//               {!isRunning && !isPaused && <Button size="sm" onClick={handleStart}>Start</Button>}
//               {isRunning && !isPaused && <Button size="sm" variant="warning" onClick={handlePause}>Pause</Button>}
//               {isPaused && <Button size="sm" onClick={handleResume}>Resume</Button>}
//             </div>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'evidence', label: 'Evidence', content: (
//       <TaskEvidenceUpload
//         taskId={task._id}
//         existingImages={task.evidence?.afterImages || []}
//         onUploadComplete={fetchTask}
//         canUpload={canStart || canComplete}
//       />
//     )},
//     { id: 'communication', label: 'Communication', content: (
//       <TaskCommunication taskId={task._id} />
//     )}
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
//           <div className="flex items-center space-x-3 mt-2">
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//         </div>
//         <div className="flex space-x-2">
//           {canAccept && <Button onClick={handleAccept}>Accept Task</Button>}
//           {canStart && <Button onClick={handleStart}>Start Task</Button>}
//           {canComplete && <Button variant="success" onClick={handleComplete}>Complete Task</Button>}
//           {canVerify && <Button variant="success" onClick={handleVerify}>Verify & Close</Button>}
//           <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
//         </div>
//       </div>

//       {/* Action Buttons for Active Task */}
//       {(canPause || canResume) && (
//         <Card className="bg-yellow-50 border-yellow-200">
//           <div className="p-4 flex justify-between items-center">
//             <div>
//               <p className="font-medium">Task In Progress</p>
//               <p className="text-sm text-gray-600">Time spent: {formatTime()}</p>
//             </div>
//             <div className="space-x-2">
//               {canPause && <Button variant="warning" onClick={handlePause}>Pause Task</Button>}
//               {canResume && <Button onClick={handleResume}>Resume Task</Button>}
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Tabs */}
//       <Tabs tabs={tabs} defaultTab="details" />
//     </div>
//   );
// };

// export default TaskDetails;








// // client/src/pages/tasks/TaskDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import Badge from '../../components/common/Badge';
// import Tabs from '../../components/common/Tabs';
// import TaskProgressBar from '../../components/tasks/TaskProgressBar';
// import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
// import TaskCommunication from '../../components/tasks/TaskCommunication';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import { useTaskTimer } from '../../hooks/useTaskTimer';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { formatDateTime } from '../../utils/formatters';

// // Debug logging
// const DEBUG = true;
// const logDebug = (message, data = null) => {
//   if (DEBUG) {
//     console.log(`📋 [TaskDetails] ${message}`);
//     if (data) console.log('   Data:', data);
//   }
// };

// const logError = (message, error) => {
//   console.error(`❌ [TaskDetails] ${message}`);
//   console.error('   Error:', error.response?.data || error.message);
//   if (error.response) {
//     console.error('   Status:', error.response.status);
//   }
// };

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { taskUpdates } = useTaskSocket();
//   const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
//   const [task, setTask] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [availableTechnicians, setAvailableTechnicians] = useState([]);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedTechnician, setSelectedTechnician] = useState('');
//   const [assigning, setAssigning] = useState(false);

//   logDebug(`Initializing TaskDetails for ID: ${id}`);
//   logDebug(`User role: ${user?.role}`);

//   useEffect(() => {
//     fetchTask();
//     fetchAvailableTechnicians();
//   }, [id]);

//   useEffect(() => {
//     if (taskUpdates && taskUpdates[id]) {
//       logDebug(`Received real-time update for task ${id}`);
//       fetchTask();
//     }
//   }, [taskUpdates, id]);

//   const fetchTask = async () => {
//     logDebug(`Fetching task details for ID: ${id}`);
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await taskApi.getTaskById(id);
//       logDebug('Task API response:', response.data);
      
//       if (response.data.success) {
//         const taskData = response.data.data.task || response.data.data;
//         setTask(taskData);
//         setProgress(response.data.data.progress);
//         logDebug(`Task loaded successfully: ${taskData.title}`);
//       } else {
//         const errorMsg = response.data.error || 'Task not found';
//         logError('Task fetch failed', { message: errorMsg });
//         setError(errorMsg);
//         showToast(errorMsg, 'error');
//       }
//     } catch (error) {
//       logError('Failed to fetch task', error);
//       setError(error.response?.data?.error || 'Failed to load task');
//       showToast('Failed to load task details', 'error');
      
//       if (error.response?.status === 404) {
//         navigate('/tasks');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableTechnicians = async () => {
//     logDebug(`Fetching available technicians for task ${id}`);
//     try {
//       const response = await taskApi.getAvailableTechnicians(id);
//       logDebug('Technicians API response:', response.data);
      
//       if (response.data.success) {
//         const technicians = response.data.data || [];
//         setAvailableTechnicians(technicians);
//         logDebug(`Found ${technicians.length} available technicians`);
//       }
//     } catch (error) {
//       logError('Failed to fetch technicians', error);
//       // Fallback to getting all technicians
//       try {
//         logDebug('Falling back to get all technicians');
//         const usersRes = await userApi.getUsers({ role: 'technician', limit: 100 });
//         if (usersRes.data.success) {
//           const technicians = usersRes.data.data?.users || [];
//           setAvailableTechnicians(technicians);
//           logDebug(`Found ${technicians.length} technicians via fallback`);
//         }
//       } catch (fallbackError) {
//         logError('Fallback also failed', fallbackError);
//         setAvailableTechnicians([]);
//       }
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!selectedTechnician) {
//       showToast('Please select a technician', 'warning');
//       return;
//     }

//     logDebug(`Assigning task ${id} to technician ${selectedTechnician}`);
//     setAssigning(true);
//     try {
//       const response = await taskApi.assignTask(id, selectedTechnician);
//       logDebug('Assign response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task assigned successfully', 'success');
//         setShowAssignModal(false);
//         setSelectedTechnician('');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to assign task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to assign task', error);
//       showToast(error.response?.data?.error || 'Failed to assign task', 'error');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleAccept = async () => {
//     logDebug(`Accepting task: ${id}`);
//     try {
//       const response = await taskApi.acceptTask(id);
//       logDebug('Accept response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task accepted successfully', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to accept task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to accept task', error);
//       showToast(error.response?.data?.error || 'Failed to accept task', 'error');
//     }
//   };

//   const handleStart = async () => {
//     logDebug(`Starting task: ${id}`);
//     try {
//       let position = null;
//       try {
//         position = await getCurrentPosition();
//         logDebug('Current position obtained:', position);
//       } catch (geoError) {
//         logError('Geolocation error', geoError);
//         showToast('Unable to get location. Please enable GPS.', 'warning');
//       }
      
//       const response = await taskApi.startTask(id, position);
//       logDebug('Start response:', response.data);
      
//       if (response.data.success) {
//         startTimer();
//         showToast('Task started successfully', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to start task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to start task', error);
//       showToast(error.response?.data?.error || 'Failed to start task', 'error');
//     }
//   };

//   const handlePause = async () => {
//     logDebug(`Pausing task: ${id}`);
//     try {
//       const response = await taskApi.pauseTask(id, 'Paused by technician');
//       logDebug('Pause response:', response.data);
      
//       if (response.data.success) {
//         pauseTimer();
//         showToast('Task paused', 'info');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to pause task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to pause task', error);
//       showToast(error.response?.data?.error || 'Failed to pause task', 'error');
//     }
//   };

//   const handleResume = async () => {
//     logDebug(`Resuming task: ${id}`);
//     try {
//       const response = await taskApi.resumeTask(id);
//       logDebug('Resume response:', response.data);
      
//       if (response.data.success) {
//         resumeTimer();
//         showToast('Task resumed', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to resume task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to resume task', error);
//       showToast(error.response?.data?.error || 'Failed to resume task', 'error');
//     }
//   };

//   const handleComplete = async (completionData) => {
//     logDebug(`Completing task: ${id}`, completionData);
//     try {
//       const response = await taskApi.completeTask(id, completionData);
//       logDebug('Complete response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task completed! Pending verification', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to complete task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to complete task', error);
//       showToast(error.response?.data?.error || 'Failed to complete task', 'error');
//     }
//   };

//   const handleVerify = async (data) => {
//     logDebug(`Verifying task: ${id}`, data);
//     try {
//       const response = await taskApi.verifyTask(id, data);
//       logDebug('Verify response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task verified and closed', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to verify task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to verify task', error);
//       showToast(error.response?.data?.error || 'Failed to verify task', 'error');
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           reject(error);
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     });
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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const isTechnician = user?.role === 'technician';
//   const isAssignedToMe = task?.assignment?.assignedTo === user?._id;
//   const canAssign = ['super_admin', 'admin', 'manager'].includes(user?.role) && (!task?.assignment?.assignedTo || task?.status === 'pending');
//   const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
//   const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
//   const canPause = isTechnician && isAssignedToMe && task?.status === 'in_progress' && !isPaused;
//   const canResume = isTechnician && isAssignedToMe && task?.status === 'in_progress' && isPaused;
//   const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
//   const canVerify = ['supervisor', 'manager', 'admin', 'super_admin'].includes(user?.role) && task?.status === 'completed';

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//         <p className="ml-3 text-gray-500">Loading task details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-800 font-medium mb-2">Error Loading Task</p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="primary" onClick={fetchTask}>Retry</Button>
//             <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           <p className="text-yellow-800 font-medium mb-2">Task Not Found</p>
//           <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access.</p>
//           <Button variant="primary" onClick={() => navigate('/tasks')}>
//             Back to Tasks
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'details', label: 'Details', content: (
//       <div className="space-y-6">
//         {/* Basic Info */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-500">Task ID</label>
//             <p className="font-mono">{task.taskId || task._id?.slice(-8)}</p>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Status</label>
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Priority</label>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Created</label>
//             <p>{formatDateTime(task.createdAt)}</p>
//           </div>
//         </div>

//         {/* Description */}
//         <div>
//           <label className="text-sm text-gray-500">Description</label>
//           <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
//         </div>

//         {/* Location */}
//         {task.location && (
//           <div>
//             <label className="text-sm text-gray-500">Location</label>
//             <p className="mt-1">📍 {task.location.buildingName || task.location.building}</p>
//             {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
//             {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
//           </div>
//         )}

//         {/* Assignment */}
//         <div>
//           <label className="text-sm text-gray-500">Assignment</label>
//           <p className="mt-1">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//           {task.assignment?.assignedBy && (
//             <p>Assigned by: {task.assignment?.assignedBy?.firstName} {task.assignment?.assignedBy?.lastName}</p>
//           )}
//           {task.assignment?.assignedAt && (
//             <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
//           )}
//         </div>

//         {/* Timeline */}
//         {task.timeline && (
//           <div>
//             <label className="text-sm text-gray-500">Timeline</label>
//             <div className="mt-2 space-y-1 text-sm">
//               {task.timeline.acceptedAt && <p>✅ Accepted: {formatDateTime(task.timeline.acceptedAt)}</p>}
//               {task.timeline.startedAt && <p>🔄 Started: {formatDateTime(task.timeline.startedAt)}</p>}
//               {task.timeline.completedAt && <p>✔️ Completed: {formatDateTime(task.timeline.completedAt)}</p>}
//               {task.timeline.verifiedAt && <p>✓ Verified: {formatDateTime(task.timeline.verifiedAt)}</p>}
//             </div>
//           </div>
//         )}

//         {/* SLA Info */}
//         <div>
//           <label className="text-sm text-gray-500">SLA</label>
//           <p className={`mt-1 ${task.slaBreached ? 'text-red-600' : 'text-green-600'}`}>
//             Deadline: {formatDateTime(task.slaDeadline)}
//             {task.slaBreached && <span className="ml-2">⚠️ BREACHED</span>}
//           </p>
//         </div>
//       </div>
//     )},
//     { id: 'progress', label: 'Progress', content: (
//       <div className="space-y-6">
//         <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
        
//         {/* Checklist */}
//         {task.checklist && task.checklist.length > 0 && (
//           <div>
//             <h3 className="font-medium mb-3">Checklist</h3>
//             <div className="space-y-2">
//               {task.checklist.map((item, idx) => (
//                 <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
//                   <input
//                     type="checkbox"
//                     checked={item.completed}
//                     onChange={() => {}}
//                     disabled={!canStart}
//                     className="h-4 w-4 rounded border-gray-300"
//                   />
//                   <div className="flex-1">
//                     <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName || item.description}</p>
//                     {item.description && !item.itemName && <p className="text-xs text-gray-500">{item.description}</p>}
//                   </div>
//                   {item.imageAfter && <img src={item.imageAfter} className="h-8 w-8 rounded" alt="Evidence" />}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* Time Tracking */}
//         {isTechnician && isAssignedToMe && task.status === 'in_progress' && (
//           <div className="bg-gray-100 p-4 rounded-lg text-center">
//             <p className="text-2xl font-mono font-bold">{formatTime()}</p>
//             <div className="flex justify-center space-x-2 mt-2">
//               {!isRunning && !isPaused && <Button size="sm" onClick={handleStart}>Start</Button>}
//               {isRunning && !isPaused && <Button size="sm" variant="warning" onClick={handlePause}>Pause</Button>}
//               {isPaused && <Button size="sm" onClick={handleResume}>Resume</Button>}
//             </div>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'evidence', label: 'Evidence', content: (
//       <TaskEvidenceUpload
//         taskId={task._id}
//         existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//         onUploadComplete={fetchTask}
//         canUpload={canStart || canComplete}
//       />
//     )},
//     { id: 'communication', label: 'Communication', content: (
//       <TaskCommunication taskId={task._id} />
//     )}
//   ];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
//           <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//         </div>
//         <div className="flex space-x-2 flex-wrap gap-2">
//           {canAssign && (
//             <Button onClick={() => setShowAssignModal(true)} variant="primary">
//               Assign Task
//             </Button>
//           )}
//           {canAccept && <Button onClick={handleAccept} variant="primary">Accept Task</Button>}
//           {canStart && <Button onClick={handleStart} variant="success">Start Task</Button>}
//           {canComplete && <Button variant="success" onClick={handleComplete}>Complete Task</Button>}
//           {canVerify && <Button variant="success" onClick={handleVerify}>Verify & Close</Button>}
//           <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
//         </div>
//       </div>

//       {/* Action Buttons for Active Task */}
//       {(canPause || canResume) && (
//         <Card className="bg-yellow-50 border-yellow-200">
//           <div className="p-4 flex justify-between items-center flex-wrap gap-4">
//             <div>
//               <p className="font-medium">Task In Progress</p>
//               <p className="text-sm text-gray-600">Time spent: {formatTime()}</p>
//             </div>
//             <div className="space-x-2">
//               {canPause && <Button variant="warning" onClick={handlePause}>Pause Task</Button>}
//               {canResume && <Button onClick={handleResume}>Resume Task</Button>}
//             </div>
//           </div>
//         </Card>
//       )}

//       {/* Tabs */}
//       <Tabs tabs={tabs} defaultTab="details" />

//       {/* Assign Modal */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
//             <h2 className="text-xl font-bold mb-4">Assign Task</h2>
//             <div className="space-y-4">
//               {availableTechnicians.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <p className="text-yellow-800 text-sm">
//                     No technicians available. Please create a technician user first.
//                   </p>
//                   <p className="text-xs text-gray-500 mt-2">
//                     Current technicians in system: {availableTechnicians.length}
//                   </p>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Technician
//                   </label>
//                   <select
//                     value={selectedTechnician}
//                     onChange={(e) => setSelectedTechnician(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a technician...</option>
//                     {availableTechnicians.map(tech => (
//                       <option key={tech._id} value={tech._id}>
//                         {tech.firstName} {tech.lastName} - {tech.email} ({tech.status || 'active'})
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {availableTechnicians.length} technician(s) available
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleAssignTask} 
//                   isLoading={assigning}
//                   disabled={availableTechnicians.length === 0}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskDetails;



// // client/src/pages/tasks/TaskDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import Badge from '../../components/common/Badge';
// import Tabs from '../../components/common/Tabs';
// import TaskProgressBar from '../../components/tasks/TaskProgressBar';
// import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
// import TaskCommunication from '../../components/tasks/TaskCommunication';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import { useTaskTimer } from '../../hooks/useTaskTimer';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { formatDateTime } from '../../utils/formatters';

// // Debug logging
// const DEBUG = true;
// const logDebug = (message, data = null) => {
//   if (DEBUG) {
//     console.log(`📋 [TaskDetails] ${message}`);
//     if (data) console.log('   Data:', data);
//   }
// };

// const logError = (message, error) => {
//   console.error(`❌ [TaskDetails] ${message}`);
//   console.error('   Error:', error.response?.data || error.message);
//   if (error.response) {
//     console.error('   Status:', error.response.status);
//   }
// };

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { taskUpdates } = useTaskSocket();
//   const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
//   const [task, setTask] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [availableTechnicians, setAvailableTechnicians] = useState([]);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedTechnician, setSelectedTechnician] = useState('');
//   const [assigning, setAssigning] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   logDebug(`Initializing TaskDetails for ID: ${id}`);
//   logDebug(`User role: ${user?.role}`);

//   useEffect(() => {
//     fetchTask();
//     fetchTechnicians();
//   }, [id]);

//   useEffect(() => {
//     if (taskUpdates && taskUpdates[id]) {
//       logDebug(`Received real-time update for task ${id}`);
//       fetchTask();
//     }
//   }, [taskUpdates, id]);

//   const fetchTask = async () => {
//     logDebug(`Fetching task details for ID: ${id}`);
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await taskApi.getTaskById(id);
//       logDebug('Task API response:', response.data);
      
//       if (response.data.success) {
//         const taskData = response.data.data.task || response.data.data;
//         setTask(taskData);
//         setProgress(response.data.data.progress);
//         logDebug(`Task loaded successfully: ${taskData.title}`);
//       } else {
//         const errorMsg = response.data.error || 'Task not found';
//         logError('Task fetch failed', { message: errorMsg });
//         setError(errorMsg);
//       }
//     } catch (error) {
//       logError('Failed to fetch task', error);
//       setError(error.response?.data?.error || 'Failed to load task');
      
//       if (error.response?.status === 404) {
//         navigate('/tasks');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Direct fetch technicians from user API
//   const fetchTechnicians = async () => {
//     logDebug('Fetching technicians from user API');
//     try {
//       const response = await userApi.getUsers({ role: 'technician', limit: 100 });
//       logDebug('User API response:', response.data);
      
//       let techniciansList = [];
//       if (response.data?.success) {
//         if (response.data.data?.users) {
//           techniciansList = response.data.data.users;
//         } else if (Array.isArray(response.data.data)) {
//           techniciansList = response.data.data;
//         }
//       }
      
//       setAvailableTechnicians(techniciansList);
//       logDebug(`Found ${techniciansList.length} technicians`);
//     } catch (error) {
//       logError('Failed to fetch technicians', error);
//       setAvailableTechnicians([]);
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!selectedTechnician) {
//       showToast('Please select a technician', 'warning');
//       return;
//     }

//     logDebug(`Assigning task ${id} to technician ${selectedTechnician}`);
//     setAssigning(true);
//     try {
//       const response = await taskApi.assignTask(id, selectedTechnician);
//       logDebug('Assign response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task assigned successfully', 'success');
//         setShowAssignModal(false);
//         setSelectedTechnician('');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to assign task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to assign task', error);
//       showToast(error.response?.data?.error || 'Failed to assign task', 'error');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleStatusUpdate = async (newStatus) => {
//     logDebug(`Updating task status to: ${newStatus}`);
//     setUpdatingStatus(true);
//     try {
//       const response = await taskApi.updateTask(id, { status: newStatus });
//       if (response.data.success) {
//         showToast(`Task marked as ${newStatus}`, 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       logError('Failed to update status', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleStart = async () => {
//     logDebug(`Starting task: ${id}`);
//     try {
//       let position = null;
//       try {
//         position = await getCurrentPosition();
//         logDebug('Current position obtained:', position);
//       } catch (geoError) {
//         logError('Geolocation error', geoError);
//         showToast('Unable to get location. Please enable GPS.', 'warning');
//       }
      
//       const response = await taskApi.startTask(id, position);
//       logDebug('Start response:', response.data);
      
//       if (response.data.success) {
//         startTimer();
//         showToast('Task started successfully', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to start task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to start task', error);
//       showToast(error.response?.data?.error || 'Failed to start task', 'error');
//     }
//   };

//   const handleComplete = async () => {
//     logDebug(`Completing task: ${id}`);
//     try {
//       const response = await taskApi.completeTask(id, 'Task completed by technician');
//       logDebug('Complete response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task completed! Pending verification', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to complete task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to complete task', error);
//       showToast(error.response?.data?.error || 'Failed to complete task', 'error');
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           reject(error);
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     });
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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const isTechnician = user?.role === 'technician';
//   const isAssignedToMe = task?.assignment?.assignedTo === user?._id;
//   const canAssign = ['super_admin', 'admin', 'manager'].includes(user?.role) && (!task?.assignment?.assignedTo || task?.status === 'pending');
//   const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
//   const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
//   const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
//   const canVerify = ['supervisor', 'manager', 'admin', 'super_admin'].includes(user?.role) && task?.status === 'completed';

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//         <p className="ml-3 text-gray-500">Loading task details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-800 font-medium mb-2">Error Loading Task</p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="primary" onClick={fetchTask}>Retry</Button>
//             <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           <p className="text-yellow-800 font-medium mb-2">Task Not Found</p>
//           <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access.</p>
//           <Button variant="primary" onClick={() => navigate('/tasks')}>
//             Back to Tasks
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'details', label: 'Details', content: (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-500">Task ID</label>
//             <p className="font-mono">{task.taskId || task._id?.slice(-8)}</p>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Status</label>
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Priority</label>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Created</label>
//             <p>{formatDateTime(task.createdAt)}</p>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm text-gray-500">Description</label>
//           <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
//         </div>

//         {task.location && (
//           <div>
//             <label className="text-sm text-gray-500">Location</label>
//             <p className="mt-1">📍 {task.location.buildingName || task.location.building || 'N/A'}</p>
//             {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
//             {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
//           </div>
//         )}

//         <div>
//           <label className="text-sm text-gray-500">Assignment</label>
//           <p className="mt-1">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//           {task.assignment?.assignedAt && (
//             <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
//           )}
//         </div>

//         {task.slaDeadline && (
//           <div>
//             <label className="text-sm text-gray-500">SLA Deadline</label>
//             <p className={`mt-1 ${new Date(task.slaDeadline) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
//               {formatDateTime(task.slaDeadline)}
//               {new Date(task.slaDeadline) < new Date() && <span className="ml-2">⚠️ BREACHED</span>}
//             </p>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'progress', label: 'Progress', content: (
//       <div className="space-y-6">
//         <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
//         {task.checklist && task.checklist.length > 0 && (
//           <div>
//             <h3 className="font-medium mb-3">Checklist</h3>
//             <div className="space-y-2">
//               {task.checklist.map((item, idx) => (
//                 <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
//                   <input type="checkbox" checked={item.completed} disabled className="h-4 w-4 rounded" />
//                   <div className="flex-1">
//                     <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName || item.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'evidence', label: 'Evidence', content: (
//       <TaskEvidenceUpload
//         taskId={task._id}
//         existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//         onUploadComplete={fetchTask}
//         canUpload={canStart || canComplete}
//       />
//     )},
//     { id: 'communication', label: 'Communication', content: (
//       <TaskCommunication taskId={task._id} />
//     )}
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
//           <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//         </div>
//         <div className="flex space-x-2 flex-wrap gap-2">
//           {canAssign && (
//             <Button onClick={() => setShowAssignModal(true)} variant="primary">
//               Assign Task
//             </Button>
//           )}
//           {canAccept && (
//             <Button onClick={() => handleStatusUpdate('accepted')} isLoading={updatingStatus} variant="primary">
//               Accept Task
//             </Button>
//           )}
//           {canStart && (
//             <Button onClick={handleStart} isLoading={updatingStatus} variant="success">
//               Start Work
//             </Button>
//           )}
//           {canComplete && (
//             <Button onClick={handleComplete} isLoading={updatingStatus} variant="success">
//               Complete Task
//             </Button>
//           )}
//           {canVerify && (
//             <Button onClick={() => handleStatusUpdate('verified')} isLoading={updatingStatus} variant="success">
//               Verify & Close
//             </Button>
//           )}
//           <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
//         </div>
//       </div>

//       <Tabs tabs={tabs} defaultTab="details" />

//       {/* Assign Modal */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Assign Task</h2>
//             <div className="space-y-4">
//               {availableTechnicians.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <p className="text-yellow-800 text-sm">
//                     No technicians available. Please create a technician user first.
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     size="sm" 
//                     className="mt-2"
//                     onClick={() => navigate('/users/new')}
//                   >
//                     Create Technician
//                   </Button>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Technician
//                   </label>
//                   <select
//                     value={selectedTechnician}
//                     onChange={(e) => setSelectedTechnician(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a technician...</option>
//                     {availableTechnicians.map(tech => (
//                       <option key={tech._id} value={tech._id}>
//                         {tech.firstName} {tech.lastName} - {tech.email} ({tech.designation || 'Technician'})
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {availableTechnicians.length} technician(s) available
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleAssignTask} 
//                   isLoading={assigning}
//                   disabled={availableTechnicians.length === 0}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskDetails;




// // client/src/pages/tasks/TaskDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import Badge from '../../components/common/Badge';
// import Tabs from '../../components/common/Tabs';
// import TaskProgressBar from '../../components/tasks/TaskProgressBar';
// import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
// import TaskCommunication from '../../components/tasks/TaskCommunication';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import { useTaskTimer } from '../../hooks/useTaskTimer';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { formatDateTime } from '../../utils/formatters';

// // Debug logging
// const DEBUG = true;
// const logDebug = (message, data = null) => {
//   if (DEBUG) {
//     console.log(`📋 [TaskDetails] ${message}`);
//     if (data) console.log('   Data:', data);
//   }
// };

// const logError = (message, error) => {
//   console.error(`❌ [TaskDetails] ${message}`);
//   console.error('   Error:', error.response?.data || error.message);
//   if (error.response) {
//     console.error('   Status:', error.response.status);
//   }
// };

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { taskUpdates } = useTaskSocket();
//   const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
//   const [task, setTask] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [availableTechnicians, setAvailableTechnicians] = useState([]);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedTechnician, setSelectedTechnician] = useState('');
//   const [assigning, setAssigning] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   logDebug(`Initializing TaskDetails for ID: ${id}`);
//   logDebug(`User role: ${user?.role}`);

//   useEffect(() => {
//     fetchTask();
//     // Only fetch technicians for admin/manager roles to avoid 403 errors
//     if (['super_admin', 'admin', 'manager'].includes(user?.role)) {
//       fetchTechnicians();
//     }
//   }, [id, user?.role]);

//   useEffect(() => {
//     if (taskUpdates && taskUpdates[id]) {
//       logDebug(`Received real-time update for task ${id}`);
//       fetchTask();
//     }
//   }, [taskUpdates, id]);

//   const fetchTask = async () => {
//     logDebug(`Fetching task details for ID: ${id}`);
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await taskApi.getTaskById(id);
//       logDebug('Task API response:', response.data);
      
//       if (response.data.success) {
//         const taskData = response.data.data.task || response.data.data;
//         setTask(taskData);
//         setProgress(response.data.data.progress);
//         logDebug(`Task loaded successfully: ${taskData.title}`);
//       } else {
//         const errorMsg = response.data.error || 'Task not found';
//         logError('Task fetch failed', { message: errorMsg });
//         setError(errorMsg);
//       }
//     } catch (error) {
//       logError('Failed to fetch task', error);
//       setError(error.response?.data?.error || 'Failed to load task');
      
//       if (error.response?.status === 404) {
//         navigate('/tasks');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Direct fetch technicians from user API
//   const fetchTechnicians = async () => {
//     logDebug('Fetching technicians from user API');
//     try {
//       const response = await userApi.getUsers({ role: 'technician', limit: 100 });
//       logDebug('User API response:', response.data);
      
//       let techniciansList = [];
//       if (response.data?.success) {
//         if (response.data.data?.users) {
//           techniciansList = response.data.data.users;
//         } else if (Array.isArray(response.data.data)) {
//           techniciansList = response.data.data;
//         }
//       }
      
//       setAvailableTechnicians(techniciansList);
//       logDebug(`Found ${techniciansList.length} technicians`);
//     } catch (error) {
//       logError('Failed to fetch technicians', error);
//       setAvailableTechnicians([]);
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!selectedTechnician) {
//       showToast('Please select a technician', 'warning');
//       return;
//     }

//     logDebug(`Assigning task ${id} to technician ${selectedTechnician}`);
//     setAssigning(true);
//     try {
//       const response = await taskApi.assignTask(id, selectedTechnician);
//       logDebug('Assign response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task assigned successfully', 'success');
//         setShowAssignModal(false);
//         setSelectedTechnician('');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to assign task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to assign task', error);
//       showToast(error.response?.data?.error || 'Failed to assign task', 'error');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleStatusUpdate = async (newStatus) => {
//     logDebug(`Updating task status to: ${newStatus}`);
//     setUpdatingStatus(true);
//     try {
//       const response = await taskApi.updateTask(id, { status: newStatus });
//       if (response.data.success) {
//         showToast(`Task marked as ${newStatus}`, 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       logError('Failed to update status', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleStart = async () => {
//     logDebug(`Starting task: ${id}`);
//     try {
//       let position = null;
//       try {
//         position = await getCurrentPosition();
//         logDebug('Current position obtained:', position);
//       } catch (geoError) {
//         logError('Geolocation error', geoError);
//         showToast('Unable to get location. Please enable GPS.', 'warning');
//       }
      
//       const response = await taskApi.startTask(id, position);
//       logDebug('Start response:', response.data);
      
//       if (response.data.success) {
//         startTimer();
//         showToast('Task started successfully', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to start task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to start task', error);
//       showToast(error.response?.data?.error || 'Failed to start task', 'error');
//     }
//   };

//   const handleComplete = async () => {
//     logDebug(`Completing task: ${id}`);
//     try {
//       const response = await taskApi.completeTask(id, 'Task completed by technician');
//       logDebug('Complete response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task completed! Pending verification', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to complete task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to complete task', error);
//       showToast(error.response?.data?.error || 'Failed to complete task', 'error');
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           reject(error);
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     });
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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const isTechnician = user?.role === 'technician';
//   const isAssignedToMe = task?.assignment?.assignedTo === user?._id;
//   const canAssign = ['super_admin', 'admin', 'manager'].includes(user?.role) && (!task?.assignment?.assignedTo || task?.status === 'pending');
//   const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
//   const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
//   const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
//   const canVerify = ['supervisor', 'manager', 'admin', 'super_admin'].includes(user?.role) && task?.status === 'completed';
  
//   // 🔴 FIXED: canUpload logic for technicians
//   // Technicians can upload evidence when task is in progress or accepted
//   const canUpload = (isTechnician && isAssignedToMe && (task?.status === 'in_progress' || task?.status === 'accepted'));

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//         <p className="ml-3 text-gray-500">Loading task details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-800 font-medium mb-2">Error Loading Task</p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="primary" onClick={fetchTask}>Retry</Button>
//             <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           <p className="text-yellow-800 font-medium mb-2">Task Not Found</p>
//           <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access.</p>
//           <Button variant="primary" onClick={() => navigate('/tasks')}>
//             Back to Tasks
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'details', label: 'Details', content: (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-500">Task ID</label>
//             <p className="font-mono">{task.taskId || task._id?.slice(-8)}</p>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Status</label>
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Priority</label>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Created</label>
//             <p>{formatDateTime(task.createdAt)}</p>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm text-gray-500">Description</label>
//           <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
//         </div>

//         {task.location && (
//           <div>
//             <label className="text-sm text-gray-500">Location</label>
//             <p className="mt-1">📍 {task.location.buildingName || task.location.building || 'N/A'}</p>
//             {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
//             {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
//           </div>
//         )}

//         <div>
//           <label className="text-sm text-gray-500">Assignment</label>
//           <p className="mt-1">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//           {task.assignment?.assignedAt && (
//             <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
//           )}
//         </div>

//         {task.slaDeadline && (
//           <div>
//             <label className="text-sm text-gray-500">SLA Deadline</label>
//             <p className={`mt-1 ${new Date(task.slaDeadline) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
//               {formatDateTime(task.slaDeadline)}
//               {new Date(task.slaDeadline) < new Date() && <span className="ml-2">⚠️ BREACHED</span>}
//             </p>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'progress', label: 'Progress', content: (
//       <div className="space-y-6">
//         <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
        
//         {/* 🔴 ADDED: Evidence Upload in Progress Tab for easier access */}
//         {canUpload && (
//           <div className="border rounded-lg p-4 bg-blue-50">
//             <h4 className="font-medium text-gray-900 mb-3">📸 Upload Evidence</h4>
//             <TaskEvidenceUpload
//               taskId={task._id}
//               existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//               onUploadComplete={fetchTask}
//               canUpload={true}
//             />
//           </div>
//         )}
        
//         {task.checklist && task.checklist.length > 0 && (
//           <div>
//             <h3 className="font-medium mb-3">Checklist</h3>
//             <div className="space-y-2">
//               {task.checklist.map((item, idx) => (
//                 <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
//                   <input type="checkbox" checked={item.completed} disabled className="h-4 w-4 rounded" />
//                   <div className="flex-1">
//                     <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName || item.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'evidence', label: 'Evidence', content: (
//       <TaskEvidenceUpload
//         taskId={task._id}
//         existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//         onUploadComplete={fetchTask}
//         canUpload={canUpload}
//       />
//     )},
//     { id: 'communication', label: 'Communication', content: (
//       <TaskCommunication taskId={task._id} />
//     )}
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
//           <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//         </div>
//         <div className="flex space-x-2 flex-wrap gap-2">
//           {canAssign && (
//             <Button onClick={() => setShowAssignModal(true)} variant="primary">
//               Assign Task
//             </Button>
//           )}
//           {canAccept && (
//             <Button onClick={() => handleStatusUpdate('accepted')} isLoading={updatingStatus} variant="primary">
//               Accept Task
//             </Button>
//           )}
//           {canStart && (
//             <Button onClick={handleStart} isLoading={updatingStatus} variant="success">
//               Start Work
//             </Button>
//           )}
//           {canComplete && (
//             <Button onClick={handleComplete} isLoading={updatingStatus} variant="success">
//               Complete Task
//             </Button>
//           )}
//           {canVerify && (
//             <Button onClick={() => handleStatusUpdate('verified')} isLoading={updatingStatus} variant="success">
//               Verify & Close
//             </Button>
//           )}
//           <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
//         </div>
//       </div>

//       <Tabs tabs={tabs} defaultTab="details" />

//       {/* Assign Modal */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Assign Task</h2>
//             <div className="space-y-4">
//               {availableTechnicians.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <p className="text-yellow-800 text-sm">
//                     No technicians available. Please create a technician user first.
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     size="sm" 
//                     className="mt-2"
//                     onClick={() => navigate('/users/new')}
//                   >
//                     Create Technician
//                   </Button>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Technician
//                   </label>
//                   <select
//                     value={selectedTechnician}
//                     onChange={(e) => setSelectedTechnician(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a technician...</option>
//                     {availableTechnicians.map(tech => (
//                       <option key={tech._id} value={tech._id}>
//                         {tech.firstName} {tech.lastName} - {tech.email} ({tech.designation || 'Technician'})
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {availableTechnicians.length} technician(s) available
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleAssignTask} 
//                   isLoading={assigning}
//                   disabled={availableTechnicians.length === 0}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskDetails;






// client/src/pages/tasks/TaskDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import Badge from '../../components/common/Badge';
// import Tabs from '../../components/common/Tabs';
// import TaskProgressBar from '../../components/tasks/TaskProgressBar';
// import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
// import TaskCommunication from '../../components/tasks/TaskCommunication';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import { useTaskTimer } from '../../hooks/useTaskTimer';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { formatDateTime } from '../../utils/formatters';

// // Debug logging
// const DEBUG = true;
// const logDebug = (message, data = null) => {
//   if (DEBUG) {
//     console.log(`📋 [TaskDetails] ${message}`);
//     if (data) console.log('   Data:', data);
//   }
// };

// const logError = (message, error) => {
//   console.error(`❌ [TaskDetails] ${message}`);
//   console.error('   Error:', error.response?.data || error.message);
//   if (error.response) {
//     console.error('   Status:', error.response.status);
//   }
// };

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { taskUpdates } = useTaskSocket();
//   const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
//   const [task, setTask] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [availableTechnicians, setAvailableTechnicians] = useState([]);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedTechnician, setSelectedTechnician] = useState('');
//   const [assigning, setAssigning] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(false);

//   logDebug(`Initializing TaskDetails for ID: ${id}`);
//   logDebug(`User role: ${user?.role}`);
//   logDebug(`User ID: ${user?._id}`);

//   useEffect(() => {
//     fetchTask();
//     // Only fetch technicians for admin/manager roles to avoid 403 errors
//     if (['super_admin', 'admin', 'manager'].includes(user?.role)) {
//       fetchTechnicians();
//     }
//   }, [id, user?.role]);

//   useEffect(() => {
//     if (taskUpdates && taskUpdates[id]) {
//       logDebug(`Received real-time update for task ${id}`);
//       fetchTask();
//     }
//   }, [taskUpdates, id]);

//   const fetchTask = async () => {
//     logDebug(`Fetching task details for ID: ${id}`);
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await taskApi.getTaskById(id);
//       logDebug('Task API response:', response.data);
      
//       if (response.data.success) {
//         const taskData = response.data.data.task || response.data.data;
//         setTask(taskData);
//         setProgress(response.data.data.progress);
//         logDebug(`Task loaded successfully: ${taskData.title}`);
//         logDebug(`Task assignedTo: ${taskData.assignment?.assignedTo}`);
//       } else {
//         const errorMsg = response.data.error || 'Task not found';
//         logError('Task fetch failed', { message: errorMsg });
//         setError(errorMsg);
//       }
//     } catch (error) {
//       logError('Failed to fetch task', error);
//       setError(error.response?.data?.error || 'Failed to load task');
      
//       if (error.response?.status === 404) {
//         navigate('/tasks');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Direct fetch technicians from user API
//   const fetchTechnicians = async () => {
//     logDebug('Fetching technicians from user API');
//     try {
//       const response = await userApi.getUsers({ role: 'technician', limit: 100 });
//       logDebug('User API response:', response.data);
      
//       let techniciansList = [];
//       if (response.data?.success) {
//         if (response.data.data?.users) {
//           techniciansList = response.data.data.users;
//         } else if (Array.isArray(response.data.data)) {
//           techniciansList = response.data.data;
//         }
//       }
      
//       setAvailableTechnicians(techniciansList);
//       logDebug(`Found ${techniciansList.length} technicians`);
//     } catch (error) {
//       logError('Failed to fetch technicians', error);
//       setAvailableTechnicians([]);
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!selectedTechnician) {
//       showToast('Please select a technician', 'warning');
//       return;
//     }

//     logDebug(`Assigning task ${id} to technician ${selectedTechnician}`);
//     setAssigning(true);
//     try {
//       const response = await taskApi.assignTask(id, selectedTechnician);
//       logDebug('Assign response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task assigned successfully', 'success');
//         setShowAssignModal(false);
//         setSelectedTechnician('');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to assign task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to assign task', error);
//       showToast(error.response?.data?.error || 'Failed to assign task', 'error');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleStatusUpdate = async (newStatus) => {
//     logDebug(`Updating task status to: ${newStatus}`);
//     setUpdatingStatus(true);
//     try {
//       const response = await taskApi.updateTask(id, { status: newStatus });
//       if (response.data.success) {
//         showToast(`Task marked as ${newStatus}`, 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       logError('Failed to update status', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleStart = async () => {
//     logDebug(`Starting task: ${id}`);
//     try {
//       let position = null;
//       try {
//         position = await getCurrentPosition();
//         logDebug('Current position obtained:', position);
//       } catch (geoError) {
//         logError('Geolocation error', geoError);
//         showToast('Unable to get location. Please enable GPS.', 'warning');
//       }
      
//       const response = await taskApi.startTask(id, position);
//       logDebug('Start response:', response.data);
      
//       if (response.data.success) {
//         startTimer();
//         showToast('Task started successfully', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to start task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to start task', error);
//       showToast(error.response?.data?.error || 'Failed to start task', 'error');
//     }
//   };

//   const handleComplete = async () => {
//     logDebug(`Completing task: ${id}`);
//     try {
//       const response = await taskApi.completeTask(id, 'Task completed by technician');
//       logDebug('Complete response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task completed! Pending verification', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to complete task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to complete task', error);
//       showToast(error.response?.data?.error || 'Failed to complete task', 'error');
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           reject(error);
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     });
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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const isTechnician = user?.role === 'technician';
//   // 🔴 FIX: Properly compare ObjectId values
//   const isAssignedToMe = task?.assignment?.assignedTo?.toString() === user?._id?.toString();
//   const canAssign = ['super_admin', 'admin', 'manager'].includes(user?.role) && (!task?.assignment?.assignedTo || task?.status === 'pending');
//   const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
//   const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
//   const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
//   const canVerify = ['supervisor', 'manager', 'admin', 'super_admin'].includes(user?.role) && task?.status === 'completed';
  
//   // 🔴 FIX: Technicians can upload evidence when task is in progress or accepted
//   const canUpload = isTechnician && isAssignedToMe && (task?.status === 'in_progress' || task?.status === 'accepted');

//   // Debug permission values
//   console.log('🔍 Permission Check:', {
//     isTechnician,
//     isAssignedToMe,
//     taskAssignedTo: task?.assignment?.assignedTo,
//     userId: user?._id,
//     taskStatus: task?.status,
//     canUpload
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//         <p className="ml-3 text-gray-500">Loading task details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-800 font-medium mb-2">Error Loading Task</p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="primary" onClick={fetchTask}>Retry</Button>
//             <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           <p className="text-yellow-800 font-medium mb-2">Task Not Found</p>
//           <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access.</p>
//           <Button variant="primary" onClick={() => navigate('/tasks')}>
//             Back to Tasks
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'details', label: 'Details', content: (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-500">Task ID</label>
//             <p className="font-mono">{task.taskId || task._id?.slice(-8)}</p>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Status</label>
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Priority</label>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Created</label>
//             <p>{formatDateTime(task.createdAt)}</p>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm text-gray-500">Description</label>
//           <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
//         </div>

//         {task.location && (
//           <div>
//             <label className="text-sm text-gray-500">Location</label>
//             <p className="mt-1">📍 {task.location.buildingName || task.location.building || 'N/A'}</p>
//             {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
//             {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
//           </div>
//         )}

//         <div>
//           <label className="text-sm text-gray-500">Assignment</label>
//           <p className="mt-1">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//           {task.assignment?.assignedAt && (
//             <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
//           )}
//         </div>

//         {task.slaDeadline && (
//           <div>
//             <label className="text-sm text-gray-500">SLA Deadline</label>
//             <p className={`mt-1 ${new Date(task.slaDeadline) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
//               {formatDateTime(task.slaDeadline)}
//               {new Date(task.slaDeadline) < new Date() && <span className="ml-2">⚠️ BREACHED</span>}
//             </p>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'progress', label: 'Progress', content: (
//       <div className="space-y-6">
//         <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
        
//         {/* Evidence Upload in Progress Tab for easier access */}
//         {canUpload && (
//           <div className="border rounded-lg p-4 bg-blue-50">
//             <h4 className="font-medium text-gray-900 mb-3">📸 Upload Evidence</h4>
//             <TaskEvidenceUpload
//               taskId={task._id}
//               existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//               onUploadComplete={fetchTask}
//               canUpload={true}
//             />
//           </div>
//         )}
        
//         {task.checklist && task.checklist.length > 0 && (
//           <div>
//             <h3 className="font-medium mb-3">Checklist</h3>
//             <div className="space-y-2">
//               {task.checklist.map((item, idx) => (
//                 <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
//                   <input type="checkbox" checked={item.completed} disabled className="h-4 w-4 rounded" />
//                   <div className="flex-1">
//                     <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName || item.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'evidence', label: 'Evidence', content: (
//       <TaskEvidenceUpload
//         taskId={task._id}
//         existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//         onUploadComplete={fetchTask}
//         canUpload={canUpload}
//       />
//     )},
//     { id: 'communication', label: 'Communication', content: (
//       <TaskCommunication taskId={task._id} />
//     )}
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
//           <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//         </div>
//         <div className="flex space-x-2 flex-wrap gap-2">
//           {canAssign && (
//             <Button onClick={() => setShowAssignModal(true)} variant="primary">
//               Assign Task
//             </Button>
//           )}
//           {canAccept && (
//             <Button onClick={() => handleStatusUpdate('accepted')} isLoading={updatingStatus} variant="primary">
//               Accept Task
//             </Button>
//           )}
//           {canStart && (
//             <Button onClick={handleStart} isLoading={updatingStatus} variant="success">
//               Start Work
//             </Button>
//           )}
//           {canComplete && (
//             <Button onClick={handleComplete} isLoading={updatingStatus} variant="success">
//               Complete Task
//             </Button>
//           )}
//           {canVerify && (
//             <Button onClick={() => handleStatusUpdate('verified')} isLoading={updatingStatus} variant="success">
//               Verify & Close
//             </Button>
//           )}
//           <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
//         </div>
//       </div>

//       <Tabs tabs={tabs} defaultTab="details" />

//       {/* Assign Modal */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Assign Task</h2>
//             <div className="space-y-4">
//               {availableTechnicians.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <p className="text-yellow-800 text-sm">
//                     No technicians available. Please create a technician user first.
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     size="sm" 
//                     className="mt-2"
//                     onClick={() => navigate('/users/new')}
//                   >
//                     Create Technician
//                   </Button>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Technician
//                   </label>
//                   <select
//                     value={selectedTechnician}
//                     onChange={(e) => setSelectedTechnician(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a technician...</option>
//                     {availableTechnicians.map(tech => (
//                       <option key={tech._id} value={tech._id}>
//                         {tech.firstName} {tech.lastName} - {tech.email} ({tech.designation || 'Technician'})
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {availableTechnicians.length} technician(s) available
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleAssignTask} 
//                   isLoading={assigning}
//                   disabled={availableTechnicians.length === 0}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskDetails;









// // client/src/pages/tasks/TaskDetails.jsx
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { taskApi } from '../../api/task.api';
// import { userApi } from '../../api/user.api';
// import Button from '../../components/common/Button';
// import Card from '../../components/common/Card';
// import Spinner from '../../components/common/Spinner';
// import Badge from '../../components/common/Badge';
// import Tabs from '../../components/common/Tabs';
// import Modal from '../../components/common/Modal';  // 🔴 ADD THIS MISSING IMPORT
// import TaskProgressBar from '../../components/tasks/TaskProgressBar';
// import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
// import TaskCommunication from '../../components/tasks/TaskCommunication';
// import { useTaskSocket } from '../../hooks/useTaskSocket';
// import { useTaskTimer } from '../../hooks/useTaskTimer';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { formatDateTime } from '../../utils/formatters';

// // Debug logging
// const DEBUG = true;
// const logDebug = (message, data = null) => {
//   if (DEBUG) {
//     console.log(`📋 [TaskDetails] ${message}`);
//     if (data) console.log('   Data:', data);
//   }
// };

// const logError = (message, error) => {
//   console.error(`❌ [TaskDetails] ${message}`);
//   console.error('   Error:', error.response?.data || error.message);
//   if (error.response) {
//     console.error('   Status:', error.response.status);
//   }
// };

// const TaskDetails = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const { taskUpdates } = useTaskSocket();
//   const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
//   const [task, setTask] = useState(null);
//   const [progress, setProgress] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState('details');
//   const [availableTechnicians, setAvailableTechnicians] = useState([]);
//   const [showAssignModal, setShowAssignModal] = useState(false);
//   const [selectedTechnician, setSelectedTechnician] = useState('');
//   const [assigning, setAssigning] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(false);
//   const [showVerifyModal, setShowVerifyModal] = useState(false);
//   const [verificationRating, setVerificationRating] = useState(5);
//   const [verificationNotes, setVerificationNotes] = useState('');
//   const [verificationApproved, setVerificationApproved] = useState(true);

//   logDebug(`Initializing TaskDetails for ID: ${id}`);
//   logDebug(`User role: ${user?.role}`);
//   logDebug(`User ID: ${user?._id}`);

//   // useEffect(() => {
//   //   fetchTask();
//   //   // Only fetch technicians for admin/manager roles to avoid 403 errors
//   //   if (['super_admin', 'admin', 'manager'].includes(user?.role)) {
//   //     fetchTechnicians();
//   //   }
//   // }, [id, user?.role]);

//   // 🔴 FIX: In the useEffect, ensure user ID is properly retrieved
// useEffect(() => {
//   console.log('🔍 TaskDetails - User:', user);
//   console.log('🔍 TaskDetails - User ID:', user?._id);
//   fetchTask();
//   if (['super_admin', 'admin', 'manager'].includes(user?.role)) {
//     fetchTechnicians();
//   }
// }, [id, user?.role, user?._id]);


//   useEffect(() => {
//     if (taskUpdates && taskUpdates[id]) {
//       logDebug(`Received real-time update for task ${id}`);
//       fetchTask();
//     }
//   }, [taskUpdates, id]);

//   const fetchTask = async () => {
//     logDebug(`Fetching task details for ID: ${id}`);
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await taskApi.getTaskById(id);
//       logDebug('Task API response:', response.data);
      
//       if (response.data.success) {
//         const taskData = response.data.data.task || response.data.data;
//         setTask(taskData);
//         setProgress(response.data.data.progress);
//         logDebug(`Task loaded successfully: ${taskData.title}`);
//         logDebug(`Task status: ${taskData.status}`);
//         logDebug(`Task assignedTo: ${taskData.assignment?.assignedTo}`);
//       } else {
//         const errorMsg = response.data.error || 'Task not found';
//         logError('Task fetch failed', { message: errorMsg });
//         setError(errorMsg);
//       }
//     } catch (error) {
//       logError('Failed to fetch task', error);
//       setError(error.response?.data?.error || 'Failed to load task');
      
//       if (error.response?.status === 404) {
//         navigate('/tasks');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Direct fetch technicians from user API
//   const fetchTechnicians = async () => {
//     logDebug('Fetching technicians from user API');
//     try {
//       const response = await userApi.getUsers({ role: 'technician', limit: 100 });
//       logDebug('User API response:', response.data);
      
//       let techniciansList = [];
//       if (response.data?.success) {
//         if (response.data.data?.users) {
//           techniciansList = response.data.data.users;
//         } else if (Array.isArray(response.data.data)) {
//           techniciansList = response.data.data;
//         }
//       }
      
//       setAvailableTechnicians(techniciansList);
//       logDebug(`Found ${techniciansList.length} technicians`);
//     } catch (error) {
//       logError('Failed to fetch technicians', error);
//       setAvailableTechnicians([]);
//     }
//   };

//   const handleAssignTask = async () => {
//     if (!selectedTechnician) {
//       showToast('Please select a technician', 'warning');
//       return;
//     }

//     logDebug(`Assigning task ${id} to technician ${selectedTechnician}`);
//     setAssigning(true);
//     try {
//       const response = await taskApi.assignTask(id, selectedTechnician);
//       logDebug('Assign response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task assigned successfully', 'success');
//         setShowAssignModal(false);
//         setSelectedTechnician('');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to assign task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to assign task', error);
//       showToast(error.response?.data?.error || 'Failed to assign task', 'error');
//     } finally {
//       setAssigning(false);
//     }
//   };

//   const handleStatusUpdate = async (newStatus) => {
//     logDebug(`Updating task status to: ${newStatus}`);
//     setUpdatingStatus(true);
//     try {
//       const response = await taskApi.updateTask(id, { status: newStatus });
//       if (response.data.success) {
//         showToast(`Task marked as ${newStatus.replace(/_/g, ' ')}`, 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to update status', 'error');
//       }
//     } catch (error) {
//       logError('Failed to update status', error);
//       showToast(error.response?.data?.error || 'Failed to update status', 'error');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleVerifyTask = async () => {
//     logDebug(`Verifying task: ${id}, approved: ${verificationApproved}`);
//     setUpdatingStatus(true);
//     try {
//       const response = await taskApi.verifyTask(id, verificationApproved, verificationRating, verificationNotes);
//       if (response.data.success) {
//         showToast(verificationApproved ? 'Task verified and closed!' : 'Task rejected for rework', 
//           verificationApproved ? 'success' : 'warning');
//         setShowVerifyModal(false);
//         setVerificationNotes('');
//         setVerificationRating(5);
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to verify task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to verify task', error);
//       showToast(error.response?.data?.error || 'Failed to verify task', 'error');
//     } finally {
//       setUpdatingStatus(false);
//     }
//   };

//   const handleStart = async () => {
//     logDebug(`Starting task: ${id}`);
//     try {
//       let position = null;
//       try {
//         position = await getCurrentPosition();
//         logDebug('Current position obtained:', position);
//       } catch (geoError) {
//         logError('Geolocation error', geoError);
//         showToast('Unable to get location. Please enable GPS.', 'warning');
//       }
      
//       const response = await taskApi.startTask(id, position);
//       logDebug('Start response:', response.data);
      
//       if (response.data.success) {
//         startTimer();
//         showToast('Task started successfully', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to start task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to start task', error);
//       showToast(error.response?.data?.error || 'Failed to start task', 'error');
//     }
//   };

//   const handleComplete = async () => {
//     logDebug(`Completing task: ${id}`);
//     try {
//       const response = await taskApi.completeTask(id, 'Task completed by technician');
//       logDebug('Complete response:', response.data);
      
//       if (response.data.success) {
//         showToast('Task completed! Pending verification', 'success');
//         await fetchTask();
//       } else {
//         showToast(response.data.error || 'Failed to complete task', 'error');
//       }
//     } catch (error) {
//       logError('Failed to complete task', error);
//       showToast(error.response?.data?.error || 'Failed to complete task', 'error');
//     }
//   };

//   const getCurrentPosition = () => {
//     return new Promise((resolve, reject) => {
//       if (!navigator.geolocation) {
//         reject(new Error('Geolocation not supported'));
//         return;
//       }
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           resolve({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           });
//         },
//         (error) => {
//           reject(error);
//         },
//         { enableHighAccuracy: true, timeout: 10000 }
//       );
//     });
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

//   const getStatusColor = (status) => {
//     const colors = {
//       pending: 'bg-gray-100 text-gray-800',
//       assigned: 'bg-blue-100 text-blue-800',
//       accepted: 'bg-purple-100 text-purple-800',
//       in_progress: 'bg-indigo-100 text-indigo-800',
//       completed: 'bg-green-100 text-green-800',
//       verified: 'bg-teal-100 text-teal-800',
//       closed: 'bg-gray-100 text-gray-800',
//       rejected: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   // 🔴 FIX 1: Fix ObjectId comparison for assigned technician
//   const isTechnician = user?.role === 'technician';
//   const isAssignedToMe = task?.assignment?.assignedTo?.toString() === user?._id?.toString();
  
//   // 🔴 FIX 2: Enhanced permission checks for supervisor
//   const canAssign = ['super_admin', 'admin', 'manager'].includes(user?.role) && (!task?.assignment?.assignedTo || task?.status === 'pending');
//   const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
//   const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
//   const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
  
//   // 🔴 FIX 3: Supervisor can verify/reject completed tasks
//   const canVerify = (['supervisor', 'manager', 'admin', 'super_admin'].includes(user?.role) && 
//     (task?.status === 'completed' || task?.status === 'pending_review'));
  
//   // 🔴 FIX 4: Technicians can upload evidence when task is in progress or accepted
//   const canUpload = (isTechnician && isAssignedToMe && (task?.status === 'in_progress' || task?.status === 'accepted'));

//   // Debug permission values
//   console.log('🔍 Permission Check:', {
//     isTechnician,
//     isAssignedToMe,
//     taskAssignedTo: task?.assignment?.assignedTo,
//     userId: user?._id,
//     taskStatus: task?.status,
//     canAccept,
//     canStart,
//     canComplete,
//     canVerify,
//     canUpload
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner size="lg" />
//         <p className="ml-3 text-gray-500">Loading task details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//           </svg>
//           <p className="text-red-800 font-medium mb-2">Error Loading Task</p>
//           <p className="text-gray-600 mb-4">{error}</p>
//           <div className="flex gap-3 justify-center">
//             <Button variant="primary" onClick={fetchTask}>Retry</Button>
//             <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (!task) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
//           <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//           </svg>
//           <p className="text-yellow-800 font-medium mb-2">Task Not Found</p>
//           <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access.</p>
//           <Button variant="primary" onClick={() => navigate('/tasks')}>
//             Back to Tasks
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   const tabs = [
//     { id: 'details', label: 'Details', content: (
//       <div className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="text-sm text-gray-500">Task ID</label>
//             <p className="font-mono">{task.taskId || task._id?.slice(-8)}</p>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Status</label>
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Priority</label>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//           <div>
//             <label className="text-sm text-gray-500">Created</label>
//             <p>{formatDateTime(task.createdAt)}</p>
//           </div>
//         </div>

//         <div>
//           <label className="text-sm text-gray-500">Description</label>
//           <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
//         </div>

//         {task.location && (
//           <div>
//             <label className="text-sm text-gray-500">Location</label>
//             <p className="mt-1">📍 {task.location.buildingName || task.location.building || 'N/A'}</p>
//             {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
//             {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
//           </div>
//         )}

//         <div>
//           <label className="text-sm text-gray-500">Assignment</label>
//           <p className="mt-1">Assigned to: {task.assignment?.assignedToName || 'Unassigned'}</p>
//           <p className="text-xs text-gray-500">Assigned To ID: {task.assignment?.assignedTo || 'N/A'}</p>
//           <p className="text-xs text-gray-500">Current User ID: {user?._id}</p>
//           {task.assignment?.assignedAt && (
//             <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
//           )}
//         </div>

//         {task.slaDeadline && (
//           <div>
//             <label className="text-sm text-gray-500">SLA Deadline</label>
//             <p className={`mt-1 ${new Date(task.slaDeadline) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
//               {formatDateTime(task.slaDeadline)}
//               {new Date(task.slaDeadline) < new Date() && <span className="ml-2">⚠️ BREACHED</span>}
//             </p>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'progress', label: 'Progress', content: (
//       <div className="space-y-6">
//         <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
        
//         {canUpload && (
//           <div className="border rounded-lg p-4 bg-blue-50">
//             <h4 className="font-medium text-gray-900 mb-3">📸 Upload Evidence</h4>
//             <TaskEvidenceUpload
//               taskId={task._id}
//               existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//               onUploadComplete={fetchTask}
//               canUpload={true}
//             />
//           </div>
//         )}
        
//         {task.checklist && task.checklist.length > 0 && (
//           <div>
//             <h3 className="font-medium mb-3">Checklist</h3>
//             <div className="space-y-2">
//               {task.checklist.map((item, idx) => (
//                 <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
//                   <input type="checkbox" checked={item.completed} disabled className="h-4 w-4 rounded" />
//                   <div className="flex-1">
//                     <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName || item.description}</p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     )},
//     { id: 'evidence', label: 'Evidence', content: (
//       <TaskEvidenceUpload
//         taskId={task._id}
//         existingImages={task.evidence?.afterImages || task.evidence?.images || []}
//         onUploadComplete={fetchTask}
//         canUpload={canUpload}
//       />
//     )},
//     { id: 'communication', label: 'Communication', content: (
//       <TaskCommunication taskId={task._id} />
//     )}
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-start flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
//           <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
//             <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
//             <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
//           </div>
//         </div>
//         <div className="flex space-x-2 flex-wrap gap-2">
//           {canAssign && (
//             <Button onClick={() => setShowAssignModal(true)} variant="primary">
//               Assign Task
//             </Button>
//           )}
//           {canAccept && (
//             <Button onClick={() => handleStatusUpdate('accepted')} isLoading={updatingStatus} variant="primary">
//               Accept Task
//             </Button>
//           )}
//           {canStart && (
//             <Button onClick={handleStart} isLoading={updatingStatus} variant="success">
//               Start Work
//             </Button>
//           )}
//           {canComplete && (
//             <Button onClick={handleComplete} isLoading={updatingStatus} variant="success">
//               Complete Task
//             </Button>
//           )}
//           {canVerify && (
//             <Button onClick={() => setShowVerifyModal(true)} variant="success" className="bg-teal-600 hover:bg-teal-700">
//               Verify Task
//             </Button>
//           )}
//           <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
//         </div>
//       </div>

//       <Tabs tabs={tabs} defaultTab="details" />

//       {/* Verify Modal */}
//       <Modal
//         isOpen={showVerifyModal}
//         onClose={() => setShowVerifyModal(false)}
//         title="Verify Task"
//         size="md"
//       >
//         <div className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Decision
//             </label>
//             <div className="flex gap-4">
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   checked={verificationApproved}
//                   onChange={() => setVerificationApproved(true)}
//                   className="w-4 h-4"
//                 />
//                 <span>✅ Approve & Close</span>
//               </label>
//               <label className="flex items-center gap-2">
//                 <input
//                   type="radio"
//                   checked={!verificationApproved}
//                   onChange={() => setVerificationApproved(false)}
//                   className="w-4 h-4"
//                 />
//                 <span>❌ Reject for Rework</span>
//               </label>
//             </div>
//           </div>

//           {verificationApproved && (
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">
//                 Rating (1-5)
//               </label>
//               <select
//                 value={verificationRating}
//                 onChange={(e) => setVerificationRating(parseInt(e.target.value))}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
//                 <option value={4}>⭐⭐⭐⭐ - Good</option>
//                 <option value={3}>⭐⭐⭐ - Average</option>
//                 <option value={2}>⭐⭐ - Poor</option>
//                 <option value={1}>⭐ - Very Poor</option>
//               </select>
//             </div>
//           )}

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Notes
//             </label>
// {/*            <textarea
//               value={verificationNotes}
//               onChange={(e) => setVerificationNotes(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder={verificationApprooved ? "Any additional comments..." : "Please provide reason for rejection and rework instructions"}
//             />*/}
//             // Fix the typo - change `verificationApprooved` to `verificationApproved` (line ~0)

//             <textarea
//               value={verificationNotes}
//               onChange={(e) => setVerificationNotes(e.target.value)}
//               rows={3}
//               className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder={verificationApproved ? "Any additional comments..." : "Please provide reason for rejection and rework instructions"}
//             />
//           </div>

//           <div className="flex justify-end gap-3 pt-4">
//             <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
//               Cancel
//             </Button>
//             <Button 
//               variant="primary" 
//               onClick={handleVerifyTask} 
//               isLoading={updatingStatus}
//             >
//               {verificationApproved ? 'Approve & Close' : 'Reject & Send for Rework'}
//             </Button>
//           </div>
//         </div>
//       </Modal>

//       {/* Assign Modal */}
//       {showAssignModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg p-6 max-w-md w-full">
//             <h2 className="text-xl font-bold mb-4">Assign Task</h2>
//             <div className="space-y-4">
//               {availableTechnicians.length === 0 ? (
//                 <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
//                   <p className="text-yellow-800 text-sm">
//                     No technicians available. Please create a technician user first.
//                   </p>
//                   <Button 
//                     variant="primary" 
//                     size="sm" 
//                     className="mt-2"
//                     onClick={() => navigate('/users/new')}
//                   >
//                     Create Technician
//                   </Button>
//                 </div>
//               ) : (
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Select Technician
//                   </label>
//                   <select
//                     value={selectedTechnician}
//                     onChange={(e) => setSelectedTechnician(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">Select a technician...</option>
//                     {availableTechnicians.map(tech => (
//                       <option key={tech._id} value={tech._id}>
//                         {tech.firstName} {tech.lastName} - {tech.email} ({tech.designation || 'Technician'})
//                       </option>
//                     ))}
//                   </select>
//                   <p className="text-xs text-gray-500 mt-1">
//                     {availableTechnicians.length} technician(s) available
//                   </p>
//                 </div>
//               )}
//               <div className="flex justify-end gap-2 pt-4">
//                 <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
//                   Cancel
//                 </Button>
//                 <Button 
//                   variant="primary" 
//                   onClick={handleAssignTask} 
//                   isLoading={assigning}
//                   disabled={availableTechnicians.length === 0}
//                 >
//                   Assign
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskDetails;










// client/src/pages/tasks/TaskDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { userApi } from '../../api/user.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import Modal from '../../components/common/Modal';
import TaskProgressBar from '../../components/tasks/TaskProgressBar';
import TaskEvidenceUpload from '../../components/tasks/TaskEvidenceUpload';
import TaskCommunication from '../../components/tasks/TaskCommunication';
import { useTaskSocket } from '../../hooks/useTaskSocket';
import { useTaskTimer } from '../../hooks/useTaskTimer';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { formatDateTime } from '../../utils/formatters';

// Debug logging
const DEBUG = true;
const logDebug = (message, data = null) => {
  if (DEBUG) {
    console.log(`📋 [TaskDetails] ${message}`);
    if (data) console.log('   Data:', data);
  }
};

const logError = (message, error) => {
  console.error(`❌ [TaskDetails] ${message}`);
  console.error('   Error:', error.response?.data || error.message);
  if (error.response) {
    console.error('   Status:', error.response.status);
  }
};

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { taskUpdates } = useTaskSocket();
  const { timeSpent, startTimer, pauseTimer, resumeTimer, formatTime, isRunning, isPaused } = useTaskTimer();
  const [task, setTask] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('details');
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationRating, setVerificationRating] = useState(5);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [verificationApproved, setVerificationApproved] = useState(true);

  // 🔴 FIX: Get user ID from multiple possible sources
  const userId = user?.id || user?._id || user?.userId;

  logDebug(`Initializing TaskDetails for ID: ${id}`);
  logDebug(`User role: ${user?.role}`);
  logDebug(`User ID: ${userId}`);
  logDebug(`Full user object:`, user);

  // 🔴 FIX: In the useEffect, ensure user ID is properly retrieved
  useEffect(() => {
    console.log('🔍 TaskDetails - User:', user);
    console.log('🔍 TaskDetails - User ID:', userId);
    fetchTask();
    if (['super_admin', 'admin', 'manager'].includes(user?.role)) {
      fetchTechnicians();
    }
  }, [id, user?.role, userId]);

  useEffect(() => {
    if (taskUpdates && taskUpdates[id]) {
      logDebug(`Received real-time update for task ${id}`);
      fetchTask();
    }
  }, [taskUpdates, id]);

  const fetchTask = async () => {
    logDebug(`Fetching task details for ID: ${id}`);
    setLoading(true);
    setError(null);
    try {
      const response = await taskApi.getTaskById(id);
      logDebug('Task API response:', response.data);
      
      if (response.data.success) {
        const taskData = response.data.data.task || response.data.data;
        setTask(taskData);
        setProgress(response.data.data.progress);
        logDebug(`Task loaded successfully: ${taskData.title}`);
        logDebug(`Task status: ${taskData.status}`);
        logDebug(`Task assignedTo:`, taskData.assignment?.assignedTo);
      } else {
        const errorMsg = response.data.error || 'Task not found';
        logError('Task fetch failed', { message: errorMsg });
        setError(errorMsg);
      }
    } catch (error) {
      logError('Failed to fetch task', error);
      setError(error.response?.data?.error || 'Failed to load task');
      
      if (error.response?.status === 404) {
        navigate('/tasks');
      }
    } finally {
      setLoading(false);
    }
  };

  // Direct fetch technicians from user API
  const fetchTechnicians = async () => {
    logDebug('Fetching technicians from user API');
    try {
      const response = await userApi.getUsers({ role: 'technician', limit: 100 });
      logDebug('User API response:', response.data);
      
      let techniciansList = [];
      if (response.data?.success) {
        if (response.data.data?.users) {
          techniciansList = response.data.data.users;
        } else if (Array.isArray(response.data.data)) {
          techniciansList = response.data.data;
        }
      }
      
      setAvailableTechnicians(techniciansList);
      logDebug(`Found ${techniciansList.length} technicians`);
    } catch (error) {
      logError('Failed to fetch technicians', error);
      setAvailableTechnicians([]);
    }
  };

  const handleAssignTask = async () => {
    if (!selectedTechnician) {
      showToast('Please select a technician', 'warning');
      return;
    }

    logDebug(`Assigning task ${id} to technician ${selectedTechnician}`);
    setAssigning(true);
    try {
      const response = await taskApi.assignTask(id, selectedTechnician);
      logDebug('Assign response:', response.data);
      
      if (response.data.success) {
        showToast('Task assigned successfully', 'success');
        setShowAssignModal(false);
        setSelectedTechnician('');
        await fetchTask();
      } else {
        showToast(response.data.error || 'Failed to assign task', 'error');
      }
    } catch (error) {
      logError('Failed to assign task', error);
      showToast(error.response?.data?.error || 'Failed to assign task', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    logDebug(`Updating task status to: ${newStatus}`);
    setUpdatingStatus(true);
    try {
      const response = await taskApi.updateTask(id, { status: newStatus });
      if (response.data.success) {
        showToast(`Task marked as ${newStatus.replace(/_/g, ' ')}`, 'success');
        await fetchTask();
      } else {
        showToast(response.data.error || 'Failed to update status', 'error');
      }
    } catch (error) {
      logError('Failed to update status', error);
      showToast(error.response?.data?.error || 'Failed to update status', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleVerifyTask = async () => {
    logDebug(`Verifying task: ${id}, approved: ${verificationApproved}`);
    setUpdatingStatus(true);
    try {
      const response = await taskApi.verifyTask(id, verificationApproved, verificationRating, verificationNotes);
      if (response.data.success) {
        showToast(verificationApproved ? 'Task verified and closed!' : 'Task rejected for rework', 
          verificationApproved ? 'success' : 'warning');
        setShowVerifyModal(false);
        setVerificationNotes('');
        setVerificationRating(5);
        await fetchTask();
      } else {
        showToast(response.data.error || 'Failed to verify task', 'error');
      }
    } catch (error) {
      logError('Failed to verify task', error);
      showToast(error.response?.data?.error || 'Failed to verify task', 'error');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleStart = async () => {
    logDebug(`Starting task: ${id}`);
    try {
      let position = null;
      try {
        position = await getCurrentPosition();
        logDebug('Current position obtained:', position);
      } catch (geoError) {
        logError('Geolocation error', geoError);
        showToast('Unable to get location. Please enable GPS.', 'warning');
      }
      
      const response = await taskApi.startTask(id, position);
      logDebug('Start response:', response.data);
      
      if (response.data.success) {
        startTimer();
        showToast('Task started successfully', 'success');
        await fetchTask();
      } else {
        showToast(response.data.error || 'Failed to start task', 'error');
      }
    } catch (error) {
      logError('Failed to start task', error);
      showToast(error.response?.data?.error || 'Failed to start task', 'error');
    }
  };

  const handleComplete = async () => {
    logDebug(`Completing task: ${id}`);
    try {
      const response = await taskApi.completeTask(id, 'Task completed by technician');
      logDebug('Complete response:', response.data);
      
      if (response.data.success) {
        showToast('Task completed! Pending verification', 'success');
        await fetchTask();
      } else {
        showToast(response.data.error || 'Failed to complete task', 'error');
      }
    } catch (error) {
      logError('Failed to complete task', error);
      showToast(error.response?.data?.error || 'Failed to complete task', 'error');
    }
  };

  const getCurrentPosition = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-gray-100 text-gray-800',
      assigned: 'bg-blue-100 text-blue-800',
      accepted: 'bg-purple-100 text-purple-800',
      in_progress: 'bg-indigo-100 text-indigo-800',
      completed: 'bg-green-100 text-green-800',
      verified: 'bg-teal-100 text-teal-800',
      closed: 'bg-gray-100 text-gray-800',
      rejected: 'bg-red-100 text-red-800'
    };
    return colors[status] || colors.pending;
  };

  // 🔴 FIX: Helper functions to safely get assigned values (prevent object rendering)
  const getAssignedToName = () => {
    if (task?.assignment?.assignedToName && typeof task.assignment.assignedToName === 'string') {
      return task.assignment.assignedToName;
    }
    if (task?.assignment?.assignedTo && typeof task.assignment.assignedTo === 'object') {
      const tech = task.assignment.assignedTo;
      return `${tech.firstName || ''} ${tech.lastName || ''}`.trim() || tech.email || 'Technician';
    }
    return 'Unassigned';
  };

  const getAssignedToId = () => {
    if (task?.assignment?.assignedTo && typeof task.assignment.assignedTo === 'object') {
      return task.assignment.assignedTo._id || task.assignment.assignedTo.id || 'N/A';
    }
    if (task?.assignment?.assignedTo && typeof task.assignment.assignedTo === 'string') {
      return task.assignment.assignedTo;
    }
    return 'N/A';
  };

  // 🔴 FIX: Use userId variable for comparisons
  const isTechnician = user?.role === 'technician';
  const isAssignedToMe = task?.assignment?.assignedTo?.toString() === userId?.toString();
  
  const canAssign = ['super_admin', 'admin', 'manager'].includes(user?.role) && (!task?.assignment?.assignedTo || task?.status === 'pending');
  const canAccept = isTechnician && isAssignedToMe && task?.status === 'assigned';
  const canStart = isTechnician && isAssignedToMe && task?.status === 'accepted';
  const canComplete = isTechnician && isAssignedToMe && task?.status === 'in_progress';
  const canVerify = (['supervisor', 'manager', 'admin', 'super_admin'].includes(user?.role) && 
    (task?.status === 'completed' || task?.status === 'pending_review'));
  const canUpload = (isTechnician && isAssignedToMe && (task?.status === 'in_progress' || task?.status === 'accepted'));

  // Debug permission values
  console.log('🔍 Permission Check:', {
    isTechnician,
    isAssignedToMe,
    taskAssignedTo: task?.assignment?.assignedTo,
    userId: userId,
    taskStatus: task?.status,
    canAccept,
    canStart,
    canComplete,
    canVerify,
    canUpload
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
        <p className="ml-3 text-gray-500">Loading task details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-800 font-medium mb-2">Error Loading Task</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <Button variant="primary" onClick={fetchTask}>Retry</Button>
            <Button variant="secondary" onClick={() => navigate('/tasks')}>Back to Tasks</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <svg className="w-16 h-16 text-yellow-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-yellow-800 font-medium mb-2">Task Not Found</p>
          <p className="text-gray-600 mb-4">The task you're looking for doesn't exist or you don't have access.</p>
          <Button variant="primary" onClick={() => navigate('/tasks')}>
            Back to Tasks
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'details', label: 'Details', content: (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-500">Task ID</label>
            <p className="font-mono">{task.taskId || task._id?.slice(-8)}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Status</label>
            <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
          </div>
          <div>
            <label className="text-sm text-gray-500">Priority</label>
            <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
          </div>
          <div>
            <label className="text-sm text-gray-500">Created</label>
            <p>{formatDateTime(task.createdAt)}</p>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-500">Description</label>
          <p className="mt-1 text-gray-700 whitespace-pre-wrap">{task.description || 'No description provided'}</p>
        </div>

        {task.location && (
          <div>
            <label className="text-sm text-gray-500">Location</label>
            <p className="mt-1">📍 {task.location.buildingName || task.location.building || 'N/A'}</p>
            {task.location.unitNumber && <p>Unit: {task.location.unitNumber}</p>}
            {task.location.floorNumber && <p>Floor: {task.location.floorNumber}</p>}
          </div>
        )}

        <div>
          <label className="text-sm text-gray-500">Assignment</label>
          <p className="mt-1">Assigned to: {getAssignedToName()}</p>
          <p className="text-xs text-gray-500">Assigned To ID: {getAssignedToId()}</p>
          <p className="text-xs text-gray-500">Current User ID: {userId || 'N/A'}</p>
          {task.assignment?.assignedAt && (
            <p>Assigned at: {formatDateTime(task.assignment?.assignedAt)}</p>
          )}
        </div>

        {task.slaDeadline && (
          <div>
            <label className="text-sm text-gray-500">SLA Deadline</label>
            <p className={`mt-1 ${new Date(task.slaDeadline) < new Date() ? 'text-red-600' : 'text-green-600'}`}>
              {formatDateTime(task.slaDeadline)}
              {new Date(task.slaDeadline) < new Date() && <span className="ml-2">⚠️ BREACHED</span>}
            </p>
          </div>
        )}
      </div>
    )},
    { id: 'progress', label: 'Progress', content: (
      <div className="space-y-6">
        <TaskProgressBar percentage={task.progress?.percentage || 0} size="lg" />
        
        {canUpload && (
          <div className="border rounded-lg p-4 bg-blue-50">
            <h4 className="font-medium text-gray-900 mb-3">📸 Upload Evidence</h4>
            <TaskEvidenceUpload
              taskId={task._id}
              existingImages={task.evidence?.afterImages || task.evidence?.images || []}
              onUploadComplete={fetchTask}
              canUpload={true}
            />
          </div>
        )}
        
        {task.checklist && task.checklist.length > 0 && (
          <div>
            <h3 className="font-medium mb-3">Checklist</h3>
            <div className="space-y-2">
              {task.checklist.map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                  <input type="checkbox" checked={item.completed} disabled className="h-4 w-4 rounded" />
                  <div className="flex-1">
                    <p className={item.completed ? 'line-through text-gray-400' : ''}>{item.itemName || item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )},
    { id: 'evidence', label: 'Evidence', content: (
      <TaskEvidenceUpload
        taskId={task._id}
        existingImages={task.evidence?.afterImages || task.evidence?.images || []}
        onUploadComplete={fetchTask}
        canUpload={canUpload}
      />
    )},
    { id: 'communication', label: 'Communication', content: (
      <TaskCommunication taskId={task._id} />
    )}
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex items-center space-x-3 mt-2 flex-wrap gap-2">
            <Badge variant={getStatusColor(task.status)}>{task.status?.replace('_', ' ')}</Badge>
            <Badge variant={getPriorityColor(task.priority)}>{task.priority?.toUpperCase()}</Badge>
          </div>
        </div>
        <div className="flex space-x-2 flex-wrap gap-2">
          {canAssign && (
            <Button onClick={() => setShowAssignModal(true)} variant="primary">
              Assign Task
            </Button>
          )}
          {canAccept && (
            <Button onClick={() => handleStatusUpdate('accepted')} isLoading={updatingStatus} variant="primary">
              Accept Task
            </Button>
          )}
          {canStart && (
            <Button onClick={handleStart} isLoading={updatingStatus} variant="success">
              Start Work
            </Button>
          )}
          {canComplete && (
            <Button onClick={handleComplete} isLoading={updatingStatus} variant="success">
              Complete Task
            </Button>
          )}
          {canVerify && (
            <Button onClick={() => setShowVerifyModal(true)} variant="success" className="bg-teal-600 hover:bg-teal-700">
              Verify Task
            </Button>
          )}
          <Button variant="secondary" onClick={() => navigate('/tasks')}>Back</Button>
        </div>
      </div>

      <Tabs tabs={tabs} defaultTab="details" />

      {/* Verify Modal */}
      <Modal
        isOpen={showVerifyModal}
        onClose={() => setShowVerifyModal(false)}
        title="Verify Task"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Decision
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={verificationApproved}
                  onChange={() => setVerificationApproved(true)}
                  className="w-4 h-4"
                />
                <span>✅ Approve & Close</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={!verificationApproved}
                  onChange={() => setVerificationApproved(false)}
                  className="w-4 h-4"
                />
                <span>❌ Reject for Rework</span>
              </label>
            </div>
          </div>

          {verificationApproved && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating (1-5)
              </label>
              <select
                value={verificationRating}
                onChange={(e) => setVerificationRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ - Excellent</option>
                <option value={4}>⭐⭐⭐⭐ - Good</option>
                <option value={3}>⭐⭐⭐ - Average</option>
                <option value={2}>⭐⭐ - Poor</option>
                <option value={1}>⭐ - Very Poor</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={verificationApproved ? "Any additional comments..." : "Please provide reason for rejection and rework instructions"}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleVerifyTask} 
              isLoading={updatingStatus}
            >
              {verificationApproved ? 'Approve & Close' : 'Reject & Send for Rework'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Assign Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Assign Task</h2>
            <div className="space-y-4">
              {availableTechnicians.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800 text-sm">
                    No technicians available. Please create a technician user first.
                  </p>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => navigate('/users/new')}
                  >
                    Create Technician
                  </Button>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Technician
                  </label>
                  <select
                    value={selectedTechnician}
                    onChange={(e) => setSelectedTechnician(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a technician...</option>
                    {availableTechnicians.map(tech => (
                      <option key={tech._id} value={tech._id}>
                        {tech.firstName} {tech.lastName} - {tech.email} ({tech.designation || 'Technician'})
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    {availableTechnicians.length} technician(s) available
                  </p>
                </div>
              )}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={() => setShowAssignModal(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="primary" 
                  onClick={handleAssignTask} 
                  isLoading={assigning}
                  disabled={availableTechnicians.length === 0}
                >
                  Assign
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;