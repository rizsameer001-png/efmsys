// client/src/pages/tasks/TaskAssignment.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import { useToast } from '../../hooks/useToast';

const TaskAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [task, setTask] = useState(null);
  const [availableTechnicians, setAvailableTechnicians] = useState([]);
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [reason, setReason] = useState('');

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [taskRes, techRes] = await Promise.all([
        taskApi.getTaskById(id),
        taskApi.getAvailableTechnicians(id)
      ]);
      setTask(taskRes.data.data.task);
      setAvailableTechnicians(techRes.data.data);
    } catch (error) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAutoAssign = async () => {
    setAssigning(true);
    try {
      await taskApi.autoAssignTask(id);
      showToast('Task auto-assigned successfully', 'success');
      navigate(`/tasks/${id}`);
    } catch (error) {
      showToast('Auto-assignment failed', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const handleManualAssign = async () => {
    if (!selectedTechnician) {
      showToast('Please select a technician', 'error');
      return;
    }
    setAssigning(true);
    try {
      await taskApi.assignTask(id, selectedTechnician);
      showToast('Task assigned successfully', 'success');
      navigate(`/tasks/${id}`);
    } catch (error) {
      showToast('Assignment failed', 'error');
    } finally {
      setAssigning(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) return <Spinner />;
  if (!task) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Assign Task</h1>
        <p className="text-gray-500 mt-1">{task.taskId} - {task.title}</p>
      </div>

      {/* Task Summary */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <p className="font-medium capitalize">{task.priority}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p>{task.location?.buildingName || 'N/A'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Description</p>
            <p className="text-sm">{task.description}</p>
          </div>
        </div>
      </Card>

      {/* Auto Assign Option */}
      <Card className="p-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">Auto-Assign</h3>
            <p className="text-sm text-gray-500">
              Let the system find the best technician based on skills, workload, and proximity
            </p>
          </div>
          <Button onClick={handleAutoAssign} isLoading={assigning} disabled={assigning}>
            Auto-Assign
          </Button>
        </div>
      </Card>

      {/* Manual Assign Option */}
      <Card className="p-6">
        <h3 className="font-medium mb-4">Manual Assignment</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            {availableTechnicians.map((tech) => (
              <div
                key={tech.technician._id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedTechnician === tech.technician._id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-300 hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTechnician(tech.technician._id)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{tech.technician.name}</p>
                    <p className="text-sm text-gray-500">{tech.technician.designation}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-lg font-bold ${getScoreColor(tech.score)}`}>
                      {Math.round(tech.score)}%
                    </p>
                    <p className="text-xs text-gray-500">Match Score</p>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Active Tasks:</span>
                    <span className="ml-2 font-medium">{tech.currentWorkload.activeTasks}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Skills:</span>
                    <span className="ml-2 font-medium">{tech.matchedSkills?.length || 0}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Rating:</span>
                    <span className="ml-2 font-medium">{tech.technician.performanceRating || 'N/A'}</span>
                  </div>
                </div>
              </div>
            ))}
            {availableTechnicians.length === 0 && (
              <p className="text-center text-gray-500 py-8">No technicians available</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assignment Notes (Optional)
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Add any notes for the technician..."
            />
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => navigate(`/tasks/${id}`)}>Cancel</Button>
            <Button onClick={handleManualAssign} isLoading={assigning} disabled={assigning}>
              Assign Selected Technician
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskAssignment;