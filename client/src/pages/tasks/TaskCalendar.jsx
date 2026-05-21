// client/src/pages/tasks/TaskCalendar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

const TaskCalendar = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    generateCalendar();
  }, [currentDate, tasks]);

  const fetchTasks = async () => {
    try {
      const response = await taskApi.getTasks({ limit: 200 });
      setTasks(response.data.data.tasks);
    } catch (error) {
      showToast('Failed to load tasks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    setCalendarDays(days);
  };

  const getTasksForDate = (date) => {
    if (!date) return [];
    return tasks.filter(task => {
      const taskDate = new Date(task.slaDeadline);
      return taskDate.toDateString() === date.toDateString();
    });
  };

  const getTaskColor = (priority) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || colors.medium;
  };

  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Calendar</h1>
          <p className="text-gray-500 mt-1">View tasks by due date</p>
        </div>
      </div>

      <Card className="p-6">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-gray-100 rounded">
            ← Previous
          </button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-gray-100 rounded">
            Next →
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, idx) => {
            const dayTasks = date ? getTasksForDate(date) : [];
            const isToday = date && new Date().toDateString() === date.toDateString();
            
            return (
              <div
                key={idx}
                className={`min-h-[100px] border rounded-lg p-2 ${
                  isToday ? 'bg-blue-50 border-blue-300' : 'bg-white'
                }`}
              >
                {date && (
                  <>
                    <div className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-gray-600'}`}>
                      {date.getDate()}
                    </div>
                    <div className="mt-1 space-y-1">
                      {dayTasks.slice(0, 3).map(task => (
                        <div
                          key={task._id}
                          onClick={() => navigate(`/tasks/${task._id}`)}
                          className={`text-xs p-1 rounded cursor-pointer text-white ${getTaskColor(task.priority)} truncate`}
                        >
                          {task.taskId}
                        </div>
                      ))}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-gray-400 text-center">
                          +{dayTasks.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend */}
      <Card className="p-4">
        <div className="flex space-x-4">
          <div className="flex items-center"><div className="w-3 h-3 bg-red-500 rounded mr-1"></div><span className="text-sm">Critical</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-orange-500 rounded mr-1"></div><span className="text-sm">High</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div><span className="text-sm">Medium</span></div>
          <div className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1"></div><span className="text-sm">Low</span></div>
        </div>
      </Card>
    </div>
  );
};

export default TaskCalendar;