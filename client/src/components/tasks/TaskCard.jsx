/**
 * TASK CARD COMPONENT
 * Displays task summary in card format for kanban boards
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Tooltip from '../common/Tooltip';
import TaskProgressBar from './TaskProgressBar';

const TaskCard = ({ task, onAssign, onUpdate, showProgress = true, variant = 'default' }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || colors.medium;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      assigned: '📋',
      accepted: '👍',
      in_progress: '🔄',
      waiting_parts: '⏰',
      completed: '✅',
      verified: '✓',
      closed: '🔒'
    };
    return icons[status] || '📌';
  };

  const formatTimeRemaining = (deadline) => {
    const remaining = new Date(deadline) - new Date();
    if (remaining <= 0) return 'Overdue';
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  };

  const isOverdue = task.slaDeadline && new Date(task.slaDeadline) < new Date();

  return (
    <Card
      className={`mb-3 cursor-pointer hover:shadow-md transition-shadow ${variant === 'warning' ? 'border-yellow-400 bg-yellow-50' : ''}`}
      onClick={() => navigate(`/tasks/${task._id}`)}
      padding={false}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center space-x-2">
            <span className="text-lg">{getStatusIcon(task.status)}</span>
            <span className="font-mono text-sm text-gray-500">{task.taskId}</span>
          </div>
          <Tooltip content={`Priority: ${task.priority}`}>
            <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
          </Tooltip>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{task.title}</h4>

        {/* Location */}
        {task.location?.buildingName && (
          <p className="text-sm text-gray-500 mb-2">
            📍 {task.location.buildingName}
            {task.location.unitNumber && ` - Unit ${task.location.unitNumber}`}
          </p>
        )}

        {/* Assigned To */}
        {task.assignment?.assignedToName && (
          <p className="text-sm text-gray-500 mb-2">
            👤 {task.assignment.assignedToName}
          </p>
        )}

        {/* Progress Bar */}
        {showProgress && task.status === 'in_progress' && (
          <div className="mb-3">
            <TaskProgressBar percentage={task.progress?.percentage || 0} />
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100">
          <div className="flex space-x-2">
            <Badge variant={isOverdue ? 'danger' : 'default'}>
              {isOverdue ? '⚠️ Overdue' : formatTimeRemaining(task.slaDeadline)}
            </Badge>
            <Badge variant="info">{task.priority}</Badge>
          </div>
          
          {/* Action Buttons */}
          <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
            {task.status === 'pending' && onAssign && (
              <button
                onClick={() => onAssign(task)}
                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                title="Assign Task"
              >
                📋
              </button>
            )}
            {task.status === 'assigned' && task.assignment?.assignedTo === task.currentUser && (
              <button
                onClick={() => onUpdate?.(task, 'accept')}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Accept Task"
              >
                ✅
              </button>
            )}
            {task.status === 'in_progress' && (
              <button
                onClick={() => onUpdate?.(task, 'complete')}
                className="p-1 text-green-600 hover:bg-green-50 rounded"
                title="Complete Task"
              >
                ✔️
              </button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;