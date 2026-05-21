// client/src/components/tasks/TaskEvidenceUpload.jsx
import React, { useState } from 'react';
import { taskApi } from '../../api/task.api';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';

const TaskEvidenceUpload = ({ taskId, existingImages = [], onUploadComplete, canUpload = true }) => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(existingImages);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      showToast('Please select files to upload', 'warning');
      return;
    }

    setUploading(true);
    try {
      // Simulate upload - replace with actual API call
      const uploadedUrls = selectedFiles.map(file => URL.createObjectURL(file));
      setImages(prev => [...prev, ...uploadedUrls]);
      showToast(`${selectedFiles.length} files uploaded successfully`, 'success');
      setSelectedFiles([]);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      showToast('Upload failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  if (!canUpload) {
    return (
      <div className="text-center py-8 text-gray-500">
        You don't have permission to upload evidence for this task
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Existing Images */}
      {images.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Existing Evidence</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative">
                <img src={img} alt={`Evidence ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* File Selection */}
      <div>
        <label className="block w-full p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-blue-500 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-4xl mb-2">📸</div>
          <p className="text-gray-600">Click or drag files to upload</p>
          <p className="text-xs text-gray-400 mt-1">Images, videos, and documents</p>
        </label>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Selected Files ({selectedFiles.length})</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {selectedFiles.map((file, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm truncate">{file.name}</span>
                <button
                  onClick={() => removeFile(idx)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <Button onClick={uploadFiles} isLoading={uploading} className="mt-3">
            Upload {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskEvidenceUpload;