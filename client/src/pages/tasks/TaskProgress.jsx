// client/src/pages/tasks/TaskProgress.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskApi } from '../../api/task.api';
import { trackingApi } from '../../api/tracking.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { useTaskProgress } from '../../hooks/useTaskProgress';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const TaskProgress = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState(null);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [checklistItems, setChecklistItems] = useState([]);
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [evidenceImages, setEvidenceImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const { 
    loading: actionLoading, 
    updateProgress, 
    updateChecklist, 
    uploadEvidence 
  } = useTaskProgress(id, () => {
    fetchTask();
  });

  useEffect(() => {
    fetchTask();
    startTracking();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const response = await taskApi.getTaskById(id);
      if (response.data.success) {
        setTask(response.data.data);
        setProgressPercentage(response.data.data.progress?.percentage || 0);
        setChecklistItems(response.data.data.checklist || []);
      }
    } catch (error) {
      console.error('Fetch task error:', error);
      showToast('Failed to load task', 'error');
      navigate('/tasks');
    } finally {
      setLoading(false);
    }
  };

  const startTracking = async () => {
    try {
      const session = await trackingApi.getCurrentSession();
      if (!session.data?.data?.isActive) {
        // Start tracking session
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            await trackingApi.updateLocation(
              position.coords.latitude,
              position.coords.longitude
            );
          });
        }
      }
    } catch (error) {
      console.error('Start tracking error:', error);
    }
  };

  const handleUpdateProgress = async () => {
    await updateProgress(progressPercentage);
    showToast(`Progress updated to ${progressPercentage}%`, 'success');
  };

  const handleChecklistUpdate = async (itemId, completed) => {
    await updateChecklist(itemId, completed);
    setChecklistItems(prev => prev.map(item => 
      item.itemId === itemId ? { ...item, completed } : item
    ));
  };

  const handleUploadEvidence = async () => {
    if (evidenceImages.length === 0) {
      showToast('Please select images to upload', 'warning');
      return;
    }
    
    setUploading(true);
    await uploadEvidence(evidenceImages, [], []);
    setEvidenceImages([]);
    setUploading(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    // In a real app, you would upload to server and get URLs
    // For demo, we'll create object URLs
    const imageUrls = files.map(file => ({ url: URL.createObjectURL(file) }));
    setEvidenceImages(prev => [...prev, ...imageUrls]);
  };

  const handleAddNote = async () => {
    if (!technicianNotes.trim()) return;
    
    setUploading(true);
    try {
      await taskApi.updateTask(id, { 
        technicianNotes: [...(task?.technicianNotes || []), {
          note: technicianNotes,
          createdBy: user._id,
          createdAt: new Date()
        }]
      });
      setTechnicianNotes('');
      fetchTask();
      showToast('Note added successfully', 'success');
    } catch (error) {
      showToast('Failed to add note', 'error');
    } finally {
      setUploading(false);
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

  if (loading) return <Spinner />;
  if (!task) return <div className="text-center py-12">Task not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Progress</h1>
          <p className="text-gray-500 mt-1">Track and update your work progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => navigate(`/tasks/${id}`)}>
            Back to Task
          </Button>
        </div>
      </div>

      {/* Task Info Card */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-sm text-gray-500">ID: {task.taskId}</span>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            <p className="text-gray-600 mt-2">{task.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-500">Due Date</div>
            <div className="font-medium">{new Date(task.slaDeadline).toLocaleDateString()}</div>
            {task.location?.buildingName && (
              <>
                <div className="text-sm text-gray-500 mt-2">Location</div>
                <div className="font-medium">{task.location.buildingName}</div>
                {task.location.unitNumber && <div className="text-sm">Unit {task.location.unitNumber}</div>}
              </>
            )}
          </div>
        </div>
      </Card>

      {/* Progress Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Progress Tracking</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span className="font-medium">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
          
          <div className="flex gap-4">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progressPercentage}
              onChange={(e) => setProgressPercentage(parseInt(e.target.value))}
              className="flex-1"
            />
            <Button 
              onClick={handleUpdateProgress} 
              isLoading={actionLoading}
              size="sm"
            >
              Update Progress
            </Button>
          </div>
        </div>
      </Card>

      {/* Checklist Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Task Checklist</h3>
        <div className="space-y-3">
          {checklistItems.map((item) => (
            <div key={item.itemId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={(e) => handleChecklistUpdate(item.itemId, e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={actionLoading}
                />
                <div>
                  <p className={`font-medium ${item.completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                    {item.itemName}
                  </p>
                  {item.description && (
                    <p className="text-sm text-gray-500">{item.description}</p>
                  )}
                </div>
              </div>
              {item.completed && item.completedAt && (
                <span className="text-xs text-gray-400">
                  Completed: {new Date(item.completedAt).toLocaleString()}
                </span>
              )}
            </div>
          ))}
          {checklistItems.length === 0 && (
            <p className="text-center text-gray-500 py-4">No checklist items</p>
          )}
        </div>
      </Card>

      {/* Evidence Upload Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upload Evidence</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Work Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          
          {evidenceImages.length > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {evidenceImages.map((img, idx) => (
                <div key={idx} className="relative">
                  <img src={img.url} alt={`Evidence ${idx + 1}`} className="w-full h-24 object-cover rounded-lg" />
                  <button
                    onClick={() => setEvidenceImages(prev => prev.filter((_, i) => i !== idx))}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <Button onClick={handleUploadEvidence} isLoading={uploading} variant="secondary">
            📸 Upload Evidence
          </Button>
        </div>
      </Card>

      {/* Technician Notes Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Work Notes</h3>
        <div className="space-y-4">
          <textarea
            value={technicianNotes}
            onChange={(e) => setTechnicianNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Add work notes, issues encountered, materials used..."
          />
          <Button onClick={handleAddNote} isLoading={uploading} variant="secondary">
            Add Note
          </Button>
          
          {task.technicianNotes && task.technicianNotes.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="font-medium text-gray-700">Previous Notes:</p>
              {task.technicianNotes.map((note, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">{note.note}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(note.createdAt).toLocaleString()} - {note.createdBy?.name || 'Technician'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={() => navigate(`/tasks/${id}`)}>
          Cancel
        </Button>
        <Button 
          variant="success" 
          onClick={() => navigate(`/tasks/${id}/complete`)}
          disabled={progressPercentage < 100}
        >
          Mark as Complete
        </Button>
      </div>
      {progressPercentage < 100 && (
        <p className="text-sm text-yellow-600 text-right">Reach 100% progress to mark task as complete</p>
      )}
    </div>
  );
};

export default TaskProgress;