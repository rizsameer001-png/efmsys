// client/src/pages/sla/BreachedTasks.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import Button from '../../components/common/Button';  // ✅ Fixed path
import Card from '../../components/common/Card';      // ✅ Fixed path
import Table from '../../components/common/Table';    // ✅ Fixed path
import Spinner from '../../components/common/Spinner'; // ✅ Fixed path
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { formatDateTime } from '../../utils/formatters';

const BreachedTasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [escalationReason, setEscalationReason] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);

  useEffect(() => {
    fetchBreachedTasks();
  }, []);

  const fetchBreachedTasks = async () => {
    setLoading(true);
    try {
      const response = await taskApi.getOverdueTasks();
      setTasks(response.data.data || []);
    } catch (error) {
      showToast('Failed to load breached tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    if (!escalationReason) {
      showToast('Please provide an escalation reason', 'error');
      return;
    }
    
    try {
      await taskApi.updateTask(selectedTask._id, {
        escalationLevel: (selectedTask.escalationLevel || 0) + 1,
        escalationReason: escalationReason,
        escalatedAt: new Date()
      });
      showToast('Task escalated successfully', 'success');
      setShowEscalateModal(false);
      setEscalationReason('');
      fetchBreachedTasks();
    } catch (error) {
      showToast('Failed to escalate task', 'error');
    }
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

  const calculateOverdueHours = (deadline) => {
    const overdue = new Date() - new Date(deadline);
    const hours = Math.floor(overdue / (1000 * 60 * 60));
    const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60));
    return { hours, minutes };
  };

  const columns = [
    { key: 'taskId', header: 'Task ID', width: '120px' },
    { key: 'title', header: 'Title', width: '250px' },
    { 
      key: 'priority', 
      header: 'Priority', 
      width: '100px',
      render: (priority) => (
        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityBadge(priority)}`}>
          {priority?.toUpperCase()}
        </span>
      )
    },
    { 
      key: 'assignedTo', 
      header: 'Assigned To', 
      render: (_, row) => row.assignment?.assignedToName || 'Unassigned' 
    },
    { 
      key: 'slaDeadline', 
      header: 'Due Date', 
      render: (date) => formatDateTime(date)
    },
    { 
      key: 'overdue', 
      header: 'Overdue By', 
      render: (_, row) => {
        const { hours, minutes } = calculateOverdueHours(row.slaDeadline);
        return `${hours}h ${minutes}m`;
      }
    },
    { 
      key: 'escalationLevel', 
      header: 'Escalation', 
      render: (level) => level || 0
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '150px',
      render: (_, row) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => navigate(`/tasks/${row._id}`)} 
            className="text-blue-600 hover:text-blue-800"
          >
            View
          </button>
          {['manager', 'admin', 'super_admin'].includes(user?.role) && (
            <button 
              onClick={() => {
                setSelectedTask(row);
                setShowEscalateModal(true);
              }} 
              className="text-orange-600 hover:text-orange-800"
            >
              Escalate
            </button>
          )}
        </div>
      )
    }
  ];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">SLA Breached Tasks</h1>
          <p className="text-gray-500 mt-1">Tasks that have exceeded their SLA deadlines</p>
        </div>
        <Button variant="secondary" onClick={fetchBreachedTasks}>
          Refresh
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-red-800 font-semibold">Total Breached Tasks: {tasks.length}</p>
            <p className="text-red-600 text-sm mt-1">
              These tasks require immediate attention
            </p>
          </div>
          <div className="text-4xl">🚨</div>
        </div>
      </Card>

      {/* Tasks Table */}
      <Card className="overflow-hidden">
        <Table
          columns={columns}
          data={tasks}
          emptyMessage="No breached tasks found"
        />
      </Card>

      {/* Escalate Modal */}
      {showEscalateModal && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold">Escalate Task</h3>
              <p className="text-sm text-gray-500 mt-1">
                Task: {selectedTask.taskId} - {selectedTask.title}
              </p>
            </div>
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Escalation Reason
              </label>
              <textarea
                value={escalationReason}
                onChange={(e) => setEscalationReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Why is this task being escalated?"
              />
              <p className="text-xs text-gray-500 mt-2">
                Current escalation level: {selectedTask.escalationLevel || 0}
              </p>
            </div>
            <div className="px-6 py-4 border-t flex justify-end space-x-3">
              <Button variant="secondary" onClick={() => {
                setShowEscalateModal(false);
                setEscalationReason('');
              }}>
                Cancel
              </Button>
              <Button onClick={handleEscalate}>
                Escalate Task
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BreachedTasks;