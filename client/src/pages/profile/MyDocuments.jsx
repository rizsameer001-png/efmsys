// client/src/pages/profile/MyDocuments.jsx
import React, { useState, useEffect } from 'react';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const MyDocuments = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [formData, setFormData] = useState({
    type: 'passport',
    number: '',
    expiryDate: '',
    file: null
  });

  const documentTypes = [
    { value: 'passport', label: 'Passport', icon: '🛂' },
    { value: 'visa', label: 'Visa', icon: '📇' },
    { value: 'emirates_id', label: 'Emirates ID', icon: '🆔' },
    { value: 'pan_card', label: 'PAN Card', icon: '💳' },
    { value: 'driving_license', label: 'Driving License', icon: '🚗' },
    { value: 'contract', label: 'Employment Contract', icon: '📄' },
    { value: 'offer_letter', label: 'Offer Letter', icon: '📧' },
    { value: 'degree', label: 'Degree Certificate', icon: '🎓' },
    { value: 'medical', label: 'Medical Certificate', icon: '🏥' },
    { value: 'other', label: 'Other', icon: '📁' }
  ];

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await userApi.getMyDocuments();
      if (response.data.success) {
        setDocuments(response.data.data);
      }
    } catch (error) {
      console.error('Fetch documents error:', error);
      showToast('Failed to load documents', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      setFormData({ ...formData, file });
    }
  };

  const handleUpload = async () => {
    if (!formData.file) {
      showToast('Please select a file to upload', 'error');
      return;
    }

    setUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('type', formData.type);
      uploadData.append('number', formData.number);
      uploadData.append('expiryDate', formData.expiryDate);
      uploadData.append('document', formData.file);
      
      const response = await userApi.uploadDocument(uploadData);
      if (response.data.success) {
        showToast('Document uploaded successfully', 'success');
        setShowUploadModal(false);
        setFormData({
          type: 'passport',
          number: '',
          expiryDate: '',
          file: null
        });
        fetchDocuments();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to upload document', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        const response = await userApi.deleteDocument(docId);
        if (response.data.success) {
          showToast('Document deleted successfully', 'success');
          fetchDocuments();
        }
      } catch (error) {
        showToast('Failed to delete document', 'error');
      }
    }
  };

  const handleDownload = async (docId, fileName) => {
    try {
      const response = await userApi.downloadDocument(docId);
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Download started', 'success');
    } catch (error) {
      showToast('Failed to download document', 'error');
    }
  };

  const getDocumentIcon = (type) => {
    const doc = documentTypes.find(d => d.value === type);
    return doc?.icon || '📄';
  };

  const getDocumentLabel = (type) => {
    const doc = documentTypes.find(d => d.value === type);
    return doc?.label || type;
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return null;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysLeft = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysLeft < 0) return { text: 'Expired', color: 'bg-red-100 text-red-800' };
    if (daysLeft < 30) return { text: `Expires in ${daysLeft} days`, color: 'bg-yellow-100 text-yellow-800' };
    return { text: `Expires in ${daysLeft} days`, color: 'bg-green-100 text-green-800' };
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Documents</h1>
          <p className="text-gray-500 mt-1">Manage your personal and employment documents</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          + Upload Document
        </Button>
      </div>

      {/* Documents Grid */}
      {documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => {
            const expiryStatus = getExpiryStatus(doc.expiryDate);
            return (
              <Card key={doc._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl">
                      {getDocumentIcon(doc.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{getDocumentLabel(doc.type)}</h3>
                      {doc.number && (
                        <p className="text-sm text-gray-500">No: {doc.number}</p>
                      )}
                      {doc.expiryDate && (
                        <p className={`text-xs mt-1 inline-block px-2 py-0.5 rounded-full ${expiryStatus?.color}`}>
                          {expiryStatus?.text}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(doc._id, `${doc.type}_${doc.number || 'document'}.pdf`)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                      title="Download"
                    >
                      📥
                    </button>
                    <button
                      onClick={() => setSelectedDocument(doc)}
                      className="p-1 text-gray-600 hover:text-gray-800"
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      onClick={() => handleDelete(doc._id)}
                      className="p-1 text-red-600 hover:text-red-800"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-400">
                    Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                  {doc.verified && (
                    <p className="text-xs text-green-600 mt-1">✓ Verified by HR</p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500">No documents uploaded yet</p>
          <p className="text-sm text-gray-400 mt-1">Upload your important documents for secure storage</p>
          <Button variant="secondary" className="mt-4" onClick={() => setShowUploadModal(true)}>
            Upload Your First Document
          </Button>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal isOpen={showUploadModal} onClose={() => setShowUploadModal(false)} title="Upload Document">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Number (Optional)</label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="e.g., A1234567"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date (Optional)</label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">File (PDF, JPG, PNG - Max 5MB)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} isLoading={uploading}>
              Upload Document
            </Button>
          </div>
        </div>
      </Modal>

      {/* Document Details Modal */}
      {selectedDocument && (
        <Modal isOpen={!!selectedDocument} onClose={() => setSelectedDocument(null)} title="Document Details">
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-3xl">
                {getDocumentIcon(selectedDocument.type)}
              </div>
              <div>
                <h3 className="text-lg font-semibold">{getDocumentLabel(selectedDocument.type)}</h3>
                {selectedDocument.number && (
                  <p className="text-gray-600">Number: {selectedDocument.number}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Uploaded On</p>
                <p className="font-medium">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</p>
              </div>
              {selectedDocument.expiryDate && (
                <div>
                  <p className="text-sm text-gray-500">Expiry Date</p>
                  <p className="font-medium">{new Date(selectedDocument.expiryDate).toLocaleDateString()}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  selectedDocument.verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedDocument.verified ? 'Verified' : 'Pending Verification'}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500">File Size</p>
                <p className="font-medium">{(selectedDocument.fileSize / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setSelectedDocument(null)}>
                Close
              </Button>
              <Button variant="primary" onClick={() => {
                handleDownload(selectedDocument._id, `${selectedDocument.type}_${selectedDocument.number || 'document'}.pdf`);
                setSelectedDocument(null);
              }}>
                Download Document
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MyDocuments;