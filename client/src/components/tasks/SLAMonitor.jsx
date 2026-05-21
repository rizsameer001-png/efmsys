/**
 * SLA MONITOR COMPONENT
 * Displays SLA status and alerts for tasks
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Button from '../common/Button';

const SLAMonitor = ({ tasks = [] }) => {
  const navigate = useNavigate();
  const [atRiskTasks, setAtRiskTasks] = useState([]);
  const [breachedTasks, setBreachedTasks] = useState([]);

  useEffect(() => {
    // Analyze tasks for SLA status
    const now = new Date();
    
    const atRisk = tasks.filter(task => {
      if (!task.slaDeadline || task.status === 'closed') return false;
      const timeRemaining = new Date(task.slaDeadline) - now;
      const hoursRemaining = timeRemaining / (1000 * 60 * 60);
      return hoursRemaining <= 2 && hoursRemaining > 0 && !task.slaBreached;
    });
    
    const breached = tasks.filter(task => 
      task.slaDeadline && new Date(task.slaDeadline) < now && !task.slaBreached && task.status !== 'closed'
    );
    
    setAtRiskTasks(atRisk);
    setBreachedTasks(breached);
  }, [tasks]);

  if (atRiskTasks.length === 0 && breachedTasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* Breached Tasks */}
      {breachedTasks.length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-red-800 font-semibold flex items-center">
                <span className="text-xl mr-2">🚨</span>
                SLA Breached ({breachedTasks.length})
              </h3>
              <Button variant="danger" size="sm" onClick={() => navigate('/tasks/overdue')}>
                View All
              </Button>
            </div>
            <div className="space-y-2">
              {breachedTasks.slice(0, 3).map(task => (
                <div key={task._id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{task.taskId}</span> - {task.title}
                  </div>
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="text-red-700 hover:text-red-900"
                  >
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* At-Risk Tasks */}
      {atRiskTasks.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-yellow-800 font-semibold flex items-center">
                <span className="text-xl mr-2">⚠️</span>
                SLA At Risk ({atRiskTasks.length})
              </h3>
            </div>
            <div className="space-y-2">
              {atRiskTasks.slice(0, 3).map(task => (
                <div key={task._id} className="flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium">{task.taskId}</span> - {task.title}
                    <span className="text-yellow-700 ml-2">
                      Due in {Math.ceil((new Date(task.slaDeadline) - new Date()) / (1000 * 60))} min
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/tasks/${task._id}`)}
                    className="text-yellow-700 hover:text-yellow-900"
                  >
                    View →
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SLAMonitor;