// client/src/pages/complaints/ComplaintDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintApi } from '../../api/complaint.api';
import { userApi } from '../../api/user.api';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Spinner from '../../components/common/Spinner';
import Badge from '../../components/common/Badge';
import Tabs from '../../components/common/Tabs';
import Modal from '../../components/common/Modal';
import Rating from '../../components/common/Rating';
import { useToast } from '../../hooks/useToast';
import { useAuth } from '../../hooks/useAuth';
import { usePermission } from '../../hooks/usePermission';
import { formatDateTime, formatDate } from '../../utils/formatters';
import { COMPLAINT_STATUS, PRIORITY_OPTIONS } from '../../constants/complaintCategories';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hasPermission } = usePermission();
  const { showToast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [technicians, setTechnicians] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedTechnician, setSelectedTechnician] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, comment: '', resolvedSatisfactorily: true });
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  useEffect(() => {
    fetchComplaint();
    fetchTechnicians();
  }, [id]);

  const fetchComplaint = async () => {
    setLoading(true);
    try {
      const response = await complaintApi.getComplaintById(id);
      setComplaint(response.data.data);
    } catch (error) {
      showToast('Failed to load complaint details', 'error');
      navigate('/complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const response = await userApi.getUsers({ role: 'technician', status: 'active', limit: 50 });
      setTechnicians(response.data.data.users || []);
    } catch (error) {
      console.error('Failed to fetch technicians:', error);
    }
  };

  const handleAssign = async () => {
    if (!selectedTechnician) {
      showToast('Please select a technician', 'error');
      return;
    }
    
    try {
      await complaintApi.assignComplaint(id, selectedTechnician);
      showToast('Complaint assigned successfully', 'success');
      setShowAssignModal(false);
      fetchComplaint();
    } catch (error) {
      showToast('Failed to assign complaint', 'error');
    }
  };

  const handleStartWork = async () => {
    try {
      await complaintApi.startWork(id);
      showToast('Work started on complaint', 'success');
      fetchComplaint();
    } catch (error) {
      showToast('Failed to start work', 'error');
    }
  };

  const handleCompleteWork = async () => {
    try {
      await complaintApi.completeWork(id, { notes: 'Work completed', images: evidenceFiles });
      showToast('Work completed. Pending verification.', 'success');
      fetchComplaint();
    } catch (error) {
      showToast('Failed to complete work', 'error');
    }
  };

  const handleVerify = async (approved) => {
    try {
      await complaintApi.verifyComplaint(id, { approved, notes: approved ? 'Verified' : 'Needs rework' });
      showToast(approved ? 'Complaint verified' : 'Complaint rejected for rework', 'success');
      fetchComplaint();
    } catch (error) {
      showToast('Failed to verify complaint', 'error');
    }
  };

  const handleSubmitFeedback = async () => {
    try {
      await complaintApi.addFeedback(id, feedbackData);
      showToast('Feedback submitted. Complaint closed.', 'success');
      setShowFeedbackModal(false);
      fetchComplaint();
    } catch (error) {
      showToast('Failed to submit feedback', 'error');
    }
  };

  const handleEscalate = async () => {
    try {
      await complaintApi.escalateComplaint(id, 'Escalated by manager');
      showToast('Complaint escalated', 'success');
      fetchComplaint();
    } catch (error) {
      showToast('Failed to escalate', 'error');
    }
  };

  const handleUploadEvidence = async () => {
    if (evidenceFiles.length === 0) {
      showToast('Please select files to upload', 'error');
      return;
    }
    
    setUploading(true);
    try {
      await complaintApi.uploadEvidence(id, { images: evidenceFiles });
      showToast('Evidence uploaded successfully', 'success');
      setEvidenceFiles([]);
      fetchComplaint();
    } catch (error) {
      showToast('Failed to upload evidence', 'error');
    } finally {
      setUploading(false);
    }
  };

  const getStatusConfig = (status) => {
    return COMPLAINT_STATUS.find(s => s.value === status) || { label: status, color: 'bg-gray-100 text-gray-800', icon: '📋' };
  };

  const getPriorityConfig = (priority) => {
    return PRIORITY_OPTIONS.find(p => p.value === priority) || { label: priority, color: 'bg-gray-100 text-gray-800' };
  };

  const canAssign = ['admin', 'manager', 'supervisor'].includes(user?.role) && complaint?.status === 'open';
  const canStart = complaint?.assignment?.assignedTo === user?._id && complaint?.status === 'assigned';
  const canComplete = complaint?.assignment?.assignedTo === user?._id && complaint?.status === 'in_progress';
  const canVerify = ['supervisor', 'manager', 'admin'].includes(user?.role) && complaint?.status === 'completed';
  const canGiveFeedback = complaint?.customerId === user?._id && complaint?.status === 'verified';
  const canEscalate = ['manager', 'admin'].includes(user?.role) && ['open', 'assigned', 'in_progress'].includes(complaint?.status);

  if (loading) return <Spinner />;
  if (!complaint) return null;

  const tabs = [
    {
      id: 'details',
      label: 'Details',
      content: (
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Ticket Number</p>
              <p className="font-mono font-medium">{complaint.ticketNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <Badge variant={getStatusConfig(complaint.status).color}>
                {getStatusConfig(complaint.status).icon} {getStatusConfig(complaint.status).label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Priority</p>
              <Badge variant={getPriorityConfig(complaint.priority).color}>
                {getPriorityConfig(complaint.priority).label}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-500">Category</p>
              <p className="capitalize">{complaint.category}</p>
            </div>
          </div>

          {/* Title & Description */}
          <div>
            <p className="text-sm text-gray-500">Title</p>
            <p className="font-medium">{complaint.title}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Description</p>
            <p className="whitespace-pre-wrap">{complaint.description}</p>
          </div>

          {/* Location */}
          {complaint.location && (
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p>🏢 {complaint.location.buildingName || complaint.location.buildingId?.name}</p>
              {complaint.location.floorNumber && <p>📍 Floor: {complaint.location.floorNumber}</p>}
              {complaint.location.unitNumber && <p>🏠 Unit: {complaint.location.unitNumber}</p>}
              {complaint.location.exactLocation && <p>📍 {complaint.location.exactLocation}</p>}
            </div>
          )}

          {/* Assignment */}
          <div>
            <p className="text-sm text-gray-500">Assignment</p>
            <p>Assigned to: {complaint.assignment?.assignedToName || 'Not assigned'}</p>
            {complaint.assignment?.assignedAt && <p>Assigned at: {formatDateTime(complaint.assignment.assignedAt)}</p>}
          </div>

          {/* SLA Info */}
          <div>
            <p className="text-sm text-gray-500">SLA Deadline</p>
            <p className={complaint.slaBreached ? 'text-red-600' : 'text-green-600'}>
              {formatDateTime(complaint.slaDeadline)}
              {complaint.slaBreached && <span className="ml-2 text-red-600">⚠️ BREACHED</span>}
            </p>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-sm text-gray-500">Timeline</p>
            <div className="space-y-1 text-sm mt-2">
              {complaint.timeline?.raisedAt && <p>📅 Raised: {formatDateTime(complaint.timeline.raisedAt)}</p>}
              {complaint.timeline?.assignedAt && <p>📋 Assigned: {formatDateTime(complaint.timeline.assignedAt)}</p>}
              {complaint.timeline?.startedAt && <p>🔄 Started: {formatDateTime(complaint.timeline.startedAt)}</p>}
              {complaint.timeline?.completedAt && <p>✅ Completed: {formatDateTime(complaint.timeline.completedAt)}</p>}
              {complaint.timeline?.verifiedAt && <p>✓ Verified: {formatDateTime(complaint.timeline.verifiedAt)}</p>}
              {complaint.timeline?.closedAt && <p>🔒 Closed: {formatDateTime(complaint.timeline.closedAt)}</p>}
            </div>
          </div>

          {/* Customer Feedback */}
          {complaint.customerFeedback && (
            <div>
              <p className="text-sm text-gray-500">Customer Feedback</p>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span>Rating: </span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                      <span key={star} className={star <= complaint.customerFeedback.rating ? 'text-yellow-400' : 'text-gray-300'}>
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                {complaint.customerFeedback.comment && <p className="mt-2 text-gray-600">"{complaint.customerFeedback.comment}"</p>}
                <p className="text-xs text-gray-400 mt-1">{formatDateTime(complaint.customerFeedback.submittedAt)}</p>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      id: 'evidence',
      label: 'Evidence',
      content: (
        <div className="space-y-4">
          {/* Existing Images */}
          {complaint.evidence?.images?.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Uploaded Images ({complaint.evidence.images.length})</h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {complaint.evidence.images.map((img, idx) => (
                  <div key={idx} className="relative group cursor-pointer" onClick={() => { setSelectedImage(img.url); setShowEvidenceModal(true); }}>
                    <img src={img.url} alt={`Evidence ${idx + 1}`} className="w-full h-24 object-cover rounded-lg border" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Voice Note */}
          {complaint.evidence?.voiceNote && (
            <div>
              <h4 className="font-medium mb-2">Voice Note</h4>
              <audio controls src={complaint.evidence.voiceNote} className="w-full" />
            </div>
          )}

          {/* Upload New Evidence */}
          {canComplete && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mt-4">
              <h4 className="font-medium mb-2">Upload New Evidence</h4>
              <input
                type="file"
                multiple
                accept="image/*,video/*,audio/*"
                onChange={(e) => setEvidenceFiles(Array.from(e.target.files))}
                className="mb-2"
              />
              {evidenceFiles.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm text-gray-600">{evidenceFiles.length} file(s) selected</p>
                  <Button size="sm" onClick={handleUploadEvidence} isLoading={uploading} className="mt-2">
                    Upload Evidence
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )
    },
    {
      id: 'technician-notes',
      label: 'Technician Notes',
      content: (
        <div className="space-y-3">
          {complaint.technicianNotes?.length > 0 ? (
            complaint.technicianNotes.map((note, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                <p className="text-sm">{note.note}</p>
                <p className="text-xs text-gray-400 mt-1">by {note.createdBy?.firstName || 'Technician'} at {formatDateTime(note.createdAt)}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8">No technician notes</p>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complaint Details</h1>
          <p className="text-gray-500 mt-1">Ticket #{complaint.ticketNumber}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="secondary" onClick={() => navigate('/complaints')}>Back</Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {canAssign && (
          <Button onClick={() => setShowAssignModal(true)}>Assign Technician</Button>
        )}
        {canStart && (
          <Button onClick={handleStartWork}>Start Work</Button>
        )}
        {canComplete && (
          <Button variant="success" onClick={handleCompleteWork}>Mark Complete</Button>
        )}
        {canVerify && (
          <>
            <Button variant="success" onClick={() => handleVerify(true)}>Approve & Verify</Button>
            <Button variant="danger" onClick={() => handleVerify(false)}>Reject & Rework</Button>
          </>
        )}
        {canGiveFeedback && (
          <Button onClick={() => setShowFeedbackModal(true)}>Give Feedback</Button>
        )}
        {canEscalate && (
          <Button variant="warning" onClick={handleEscalate}>Escalate</Button>
        )}
      </div>

      {/* Customer Info Card */}
      <Card className="p-4 bg-blue-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
            <span className="text-blue-600 text-lg">👤</span>
          </div>
          <div>
            <p className="font-medium">{complaint.customerName}</p>
            <p className="text-sm text-gray-600">{complaint.customerEmail} | {complaint.customerPhone}</p>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs tabs={tabs} defaultTab="details" />

      {/* Assign Modal */}
      <Modal isOpen={showAssignModal} onClose={() => setShowAssignModal(false)} title="Assign Technician" size="md">
        <div className="space-y-4">
          <select
            value={selectedTechnician}
            onChange={(e) => setSelectedTechnician(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Technician</option>
            {technicians.map(tech => (
              <option key={tech._id} value={tech._id}>{tech.firstName} {tech.lastName}</option>
            ))}
          </select>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowAssignModal(false)}>Cancel</Button>
            <Button onClick={handleAssign}>Assign</Button>
          </div>
        </div>
      </Modal>

      {/* Feedback Modal */}
      <Modal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} title="Submit Feedback" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Rating</label>
            <Rating value={feedbackData.rating} onChange={(rating) => setFeedbackData({ ...feedbackData, rating })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Was your issue resolved satisfactorily?</label>
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" checked={feedbackData.resolvedSatisfactorily} onChange={() => setFeedbackData({ ...feedbackData, resolvedSatisfactorily: true })} />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" checked={!feedbackData.resolvedSatisfactorily} onChange={() => setFeedbackData({ ...feedbackData, resolvedSatisfactorily: false })} />
                <span>No</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Comments (Optional)</label>
            <textarea
              value={feedbackData.comment}
              onChange={(e) => setFeedbackData({ ...feedbackData, comment: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Share your experience..."
            />
          </div>
          <div className="flex justify-end space-x-3">
            <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>Cancel</Button>
            <Button onClick={handleSubmitFeedback}>Submit Feedback</Button>
          </div>
        </div>
      </Modal>

      {/* Evidence Image Modal */}
      <Modal isOpen={showEvidenceModal} onClose={() => setShowEvidenceModal(false)} title="Evidence" size="lg">
        {selectedImage && <img src={selectedImage} alt="Evidence" className="w-full rounded-lg" />}
      </Modal>
    </div>
  );
};

export default ComplaintDetails;