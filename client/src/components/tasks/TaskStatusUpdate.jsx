// client/src/components/tasks/TaskStatusUpdate.jsx
import React, { useState } from 'react';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';

const TaskStatusUpdate = ({ taskId, currentStatus, onUpdate }) => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');
  const [images, setImages] = useState([]);

  const statusOptions = [
    { value: 'accepted', label: 'Accept Task', color: 'blue' },
    { value: 'in_progress', label: 'Start Work', color: 'indigo' },
    { value: 'completed', label: 'Mark Complete', color: 'green' }
  ];

  const handleStatusUpdate = async (newStatus) => {
    setLoading(true);
    try {
      const response = await taskApi.updateTask(taskId, { status: newStatus, notes });
      if (response.data.success) {
        showToast(`Task marked as ${newStatus}`, 'success');
        onUpdate?.();
      }
    } catch (error) {
      showToast('Failed to update status', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableActions = () => {
    switch(currentStatus) {
      case 'assigned':
        return [{ value: 'accepted', label: 'Accept Task', color: 'blue' }];
      case 'accepted':
        return [{ value: 'in_progress', label: 'Start Work', color: 'indigo' }];
      case 'in_progress':
        return [{ value: 'completed', label: 'Complete Task', color: 'green' }];
      default:
        return [];
    }
  };

  const actions = getAvailableActions();

  if (actions.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {actions.map(action => (
          <Button
            key={action.value}
            variant="primary"
            onClick={() => handleStatusUpdate(action.value)}
            isLoading={loading}
            className={`bg-${action.color}-600 hover:bg-${action.color}-700`}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TaskStatusUpdate;