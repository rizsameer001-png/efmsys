// client/src/pages/tasks/TaskVerification.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const TaskVerification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [verificationNotes, setVerificationNotes] = useState('');
  const [rating, setRating] = useState(5);
  const [approved, setApproved] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await taskApi.getTaskById(id);
      if (response.data.success) {
        setTask(response.data.data);
      }
    } catch (error) {
      console.error('Fetch task error:', error);
      showToast('Failed to load task', 'error');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!verificationNotes && !approved) {
      showToast('Please provide a reason for rejection', 'warning');
      return;
    }
    
    setSubmitting(true);
    try {
      await taskApi.verifyTask(id, approved, approved ? rating : null, verificationNotes);
      showToast(
        approved ? 'Task verified and closed successfully!' : 'Task rejected for rework',
        approved ? 'success' : 'warning'
      );
      navigate('/tasks');
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to verify task', 'error');
    } finally {
      setSubmitting(false);
    }
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
      completed: 'bg-green-100 text-green-800',
      in_progress: 'bg-blue-100 text-blue-800',
      assigned: 'bg-yellow-100 text-yellow-800',
      pending: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.pending;
  };

  if (loading) return <Spinner />;
  if (!task) return <div className="text-center py-12">Task not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Verification</h1>
          <p className="text-gray-500 mt-1">Review and verify completed task</p>
        </div>
        <Button variant="secondary" onClick={() => navigate(`/tasks/${id}`)}>
          Back to Task
        </Button>
      </div>

      {/* Task Details Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className="text-sm text-gray-500">ID: {task.taskId}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Completed By</div>
            <div className="font-medium">{task.assignment?.assignedToName || 'Unknown'}</div>
            <div className="text-sm text-gray-500 mt-2">Completed At</div>
            <div className="font-medium">{new Date(task.timeline?.completedAt).toLocaleString()}</div>
          </div>
        </div>
      </Card>

      {/* Evidence Review Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Work Evidence</h3>
        
        <div className="space-y-4">
          {/* After Images */}
          {task.evidence?.afterImages?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Completion Images</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {task.evidence.afterImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img.url} 
                    alt={`Evidence ${idx + 1}`} 
                    className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90"
                    onClick={() => window.open(img.url, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Before Images */}
          {task.evidence?.beforeImages?.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Before Images</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {task.evidence.beforeImages.map((img, idx) => (
                  <img 
                    key={idx} 
                    src={img.url} 
                    alt={`Before ${idx + 1}`} 
                    className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90"
                    onClick={() => window.open(img.url, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Technician Notes */}
          {task.technicianNotes && task.technicianNotes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Technician Notes</p>
              <div className="space-y-2">
                {task.technicianNotes.map((note, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-700">{note.note}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(note.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {!task.evidence?.afterImages?.length && !task.technicianNotes?.length && (
            <p className="text-center text-gray-500 py-4">No evidence or notes uploaded</p>
          )}
        </div>
      </Card>

      {/* Checklist Review */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Task Checklist</h3>
        <div className="space-y-2">
          {task.checklist?.map((item) => (
            <div key={item.itemId} className="flex items-center gap-3 p-2">
              <div className={`w-4 h-4 rounded-full ${item.completed ? 'bg-green-500' : 'bg-gray-300'}`} />
              <span className={`flex-1 ${item.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {item.itemName}
              </span>
              {item.completed && item.completedAt && (
                <span className="text-xs text-gray-400">
                  {new Date(item.completedAt).toLocaleString()}
                </span>
              )}
            </div>
          ))}
          {(!task.checklist || task.checklist.length === 0) && (
            <p className="text-center text-gray-500 py-4">No checklist items</p>
          )}
        </div>
      </Card>

      {/* Verification Form */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Verification Decision</h3>
        
        <div className="space-y-4">
          {/* Approval/Rejection Toggle */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={approved}
                onChange={() => setApproved(true)}
                className="w-4 h-4 text-green-600"
              />
              <span className="text-green-700">✅ Approve & Close</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                checked={!approved}
                onChange={() => setApproved(false)}
                className="w-4 h-4 text-red-600"
              />
              <span className="text-red-700">❌ Reject & Request Rework</span>
            </label>
          </div>
          
          {/* Rating (Only for Approval) */}
          {approved && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-2xl ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Comments/Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {approved ? 'Verification Comments' : 'Reason for Rejection'}
            </label>
            <textarea
              value={verificationNotes}
              onChange={(e) => setVerificationNotes(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder={approved ? "Add any additional comments..." : "Please specify why this task needs rework..."}
              required={!approved}
            />
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="secondary" onClick={() => navigate(`/tasks/${id}`)}>
              Cancel
            </Button>
            <Button 
              variant={approved ? "success" : "danger"} 
              onClick={handleVerify}
              isLoading={submitting}
            >
              {approved ? 'Approve & Close Task' : 'Reject & Request Rework'}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default TaskVerification;