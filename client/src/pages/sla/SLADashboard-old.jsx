// client/src/pages/sla/SLADashboard.jsx
import React, { useState, useEffect } from 'react';
import { taskApi } from '../../api/task.api';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';

const SLADashboard = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    summary: {
      totalTasks: 0,
      breachedTasks: 0,
      atRiskTasks: 0,
      onTimeTasks: 0,
      complianceRate: 100
    },
    averageResolutionTime: 0,
    slaByPriority: []
  });
  const [breachedTasks, setBreachedTasks] = useState([]);
  const [atRiskTasks, setAtRiskTasks] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, breachedRes, atRiskRes] = await Promise.all([
        taskApi.getTaskStatistics(),
        taskApi.getOverdueTasks(),
        fetchAtRiskTasks()
      ]);
      
      setStats(statsRes.data.data);
      setBreachedTasks(breachedRes.data.data || []);
    } catch (error) {
      showToast('Failed to load SLA data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAtRiskTasks = async () => {
    try {
      const response = await taskApi.getTasks({ 
        status: 'in_progress',
        sortBy: 'slaDeadline',
        sortOrder: 'asc'
      });
      const tasks = response.data.data.tasks || [];
      const now = new Date();
      const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
      
      const atRisk = tasks.filter(task => 
        task.slaDeadline && 
        new Date(task.slaDeadline) > now && 
        new Date(task.slaDeadline) < twoHoursFromNow &&
        !task.slaBreached
      );
      setAtRiskTasks(atRisk);
      return atRisk;
    } catch (error) {
      return [];
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || colors.medium;
  };

  const formatTimeRemaining = (deadline) => {
    const remaining = new Date(deadline) - new Date();
    if (remaining <= 0) return 'Overdue';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)} days ${hours % 24} hours`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">SLA Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor Service Level Agreement compliance</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.summary.totalTasks}</p>
          <p className="text-sm text-gray-500">Total Tasks</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.summary.onTimeTasks}</p>
          <p className="text-sm text-gray-500">On Time</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-red-600">{stats.summary.breachedTasks}</p>
          <p className="text-sm text-gray-500">Breached</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">{stats.summary.atRiskTasks}</p>
          <p className="text-sm text-gray-500">At Risk</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">{stats.summary.complianceRate}%</p>
          <p className="text-sm text-gray-500">Compliance Rate</p>
        </Card>
      </div>

      {/* SLA by Priority */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">SLA Compliance by Priority</h3>
        <div className="space-y-4">
          {stats.slaByPriority.map(priority => (
            <div key={priority._id}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize font-medium">{priority._id || 'Unknown'}</span>
                <span>{priority.complianceRate || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    (priority.complianceRate || 0) >= 90 ? 'bg-green-500' :
                    (priority.complianceRate || 0) >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${priority.complianceRate || 0}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{priority.total || 0} total tasks</span>
                <span>{priority.breached || 0} breached</span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* At Risk Tasks */}
      {atRiskTasks.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-yellow-800">⚠️ At Risk Tasks ({atRiskTasks.length})</h3>
          </div>
          <div className="space-y-3">
            {atRiskTasks.map(task => (
              <div key={task._id} className={`p-4 rounded-lg border ${getPriorityColor(task.priority)}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm opacity-75">{task.taskId}</p>
                    <p className="text-xs mt-1">
                      Assigned to: {task.assignment?.assignedToName || 'Unassigned'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-sm">⏰ {formatTimeRemaining(task.slaDeadline)}</p>
                    <p className="text-xs opacity-75">Priority: {task.priority}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Breached Tasks */}
      {breachedTasks.length > 0 && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-red-800">🚨 Breached Tasks ({breachedTasks.length})</h3>
          </div>
          <div className="space-y-3">
            {breachedTasks.map(task => (
              <div key={task._id} className="p-4 rounded-lg border border-red-200 bg-red-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-red-800">{task.title}</p>
                    <p className="text-sm text-red-600">{task.taskId}</p>
                    <p className="text-xs mt-1 text-red-500">
                      Assigned to: {task.assignment?.assignedToName || 'Unassigned'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-red-600">
                      Due: {new Date(task.slaDeadline).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Issues */}
      {atRiskTasks.length === 0 && breachedTasks.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-lg font-semibold text-green-600">All SLA targets met!</h3>
          <p className="text-gray-500 mt-1">All tasks are within their SLA deadlines</p>
        </Card>
      )}
    </div>
  );
};

export default SLADashboard;