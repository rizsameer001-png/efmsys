// client/src/pages/tasks/TaskBoard.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { useTaskSocket } from '../../hooks/useTaskSocket';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import TaskCard from '../../components/tasks/TaskCard';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const Column = ({ title, status, tasks, onTaskMove, onTaskClick }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onTaskMove(item.taskId, status),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[280px] bg-gray-50 rounded-lg p-3 ${
        isOver ? 'bg-blue-50 ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex justify-between items-center mb-3 pb-2 border-b">
        <h3 className="font-semibold text-gray-700">{title}</h3>
        <span className="text-sm text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onClick={() => onTaskClick(task._id)}
            showProgress={status === 'in_progress'}
          />
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks
          </div>
        )}
      </div>
    </div>
  );
};

const TaskBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { taskUpdates } = useTaskSocket();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [columns, setColumns] = useState({
    pending: [],
    assigned: [],
    accepted: [],
    in_progress: [],
    waiting_parts: [],
    completed: [],
    verified: [],
    closed: []
  });

  const statusOrder = [
    { key: 'pending', title: '📋 Pending' },
    { key: 'assigned', title: '👤 Assigned' },
    { key: 'accepted', title: '✅ Accepted' },
    { key: 'in_progress', title: '🔄 In Progress' },
    { key: 'waiting_parts', title: '⏳ Waiting Parts' },
    { key: 'completed', title: '✔️ Completed' },
    { key: 'verified', title: '✓ Verified' },
    { key: 'closed', title: '🔒 Closed' }
  ];

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await taskApi.getTasks({ limit: 100 });
      const allTasks = response.data.data.tasks;
      
      // Group tasks by status
      const grouped = {
        pending: [],
        assigned: [],
        accepted: [],
        in_progress: [],
        waiting_parts: [],
        completed: [],
        verified: [],
        closed: []
      };
      
      allTasks.forEach(task => {
        if (grouped[task.status]) {
          grouped[task.status].push(task);
        }
      });
      
      setColumns(grouped);
      setTasks(allTasks);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Real-time updates
  useEffect(() => {
    if (Object.keys(taskUpdates).length > 0) {
      fetchTasks();
    }
  }, [taskUpdates, fetchTasks]);

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      showToast('Task status updated', 'success');
      fetchTasks();
    } catch (error) {
      showToast('Failed to update task status', 'error');
    }
  };

  const handleTaskClick = (taskId) => {
    navigate(`/tasks/${taskId}`);
  };

  if (loading) return <Spinner />;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Task Board</h1>
            <p className="text-gray-500 mt-1">Drag and drop tasks to update status</p>
          </div>
          <Button onClick={() => navigate('/tasks/new')}>+ Create Task</Button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusOrder.map((column) => (
            <Column
              key={column.key}
              title={column.title}
              status={column.key}
              tasks={columns[column.key]}
              onTaskMove={handleTaskMove}
              onTaskClick={handleTaskClick}
            />
          ))}
        </div>
      </div>
    </DndProvider>
  );
};

export default TaskBoard;