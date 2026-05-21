// // client/src/components/tasks/TaskEvidenceUpload.jsx
// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import Button from '../common/Button';
// import { useToast } from '../../hooks/useToast';
// import { taskApi } from '../../api/task.api';

// const TaskEvidenceUpload = ({ taskId, existingImages = [], onUploadComplete, canUpload = true }) => {
//   const { showToast } = useToast();
//   const [uploading, setUploading] = useState(false);
//   const [images, setImages] = useState(existingImages);
//   const [files, setFiles] = useState([]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
//       'video/*': ['.mp4', '.mov', '.avi']
//     },
//     maxSize: 5242880, // 5MB
//     onDrop: (acceptedFiles) => {
//       setFiles(prev => [...prev, ...acceptedFiles]);
//     }
//   });

//   const removeFile = (index) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const uploadFiles = async () => {
//     if (files.length === 0) {
//       showToast('Please select files to upload', 'warning');
//       return;
//     }

//     setUploading(true);
//     try {
//       // Simulate upload - replace with actual API call
//       const uploadedUrls = files.map(file => URL.createObjectURL(file));
//       setImages(prev => [...prev, ...uploadedUrls]);
//       showToast(`${files.length} file(s) uploaded successfully`, 'success');
//       setFiles([]);
//       if (onUploadComplete) onUploadComplete();
//     } catch (error) {
//       showToast('Upload failed', 'error');
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (!canUpload) {
//     return (
//       <div className="text-center py-8 text-gray-500">
//         You don't have permission to upload evidence for this task
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Existing Images */}
//       {images.length > 0 && (
//         <div>
//           <h4 className="font-medium mb-2">Existing Evidence ({images.length})</h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//             {images.map((img, idx) => (
//               <div key={idx} className="relative group">
//                 <img 
//                   src={img} 
//                   alt={`Evidence ${idx + 1}`} 
//                   className="w-full h-32 object-cover rounded-lg border"
//                 />
//                 <button
//                   onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Dropzone for file upload */}
//       <div
//         {...getRootProps()}
//         className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
//           isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
//         }`}
//       >
//         <input {...getInputProps()} />
//         <div className="text-4xl mb-2">📸</div>
//         <p className="text-gray-600">
//           {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
//         </p>
//         <p className="text-xs text-gray-400 mt-1">
//           Images (JPG, PNG, GIF) or Videos (MP4) up to 5MB
//         </p>
//       </div>

//       {/* Selected Files Preview */}
//       {files.length > 0 && (
//         <div>
//           <h4 className="font-medium mb-2">Selected Files ({files.length})</h4>
//           <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2">
//             {files.map((file, idx) => (
//               <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded">
//                 <div className="flex items-center space-x-2">
//                   <span className="text-lg">
//                     {file.type.startsWith('image/') ? '🖼️' : '🎥'}
//                   </span>
//                   <span className="text-sm truncate max-w-[200px]">{file.name}</span>
//                   <span className="text-xs text-gray-400">
//                     {(file.size / 1024).toFixed(1)} KB
//                   </span>
//                 </div>
//                 <button
//                   onClick={() => removeFile(idx)}
//                   className="text-red-500 hover:text-red-700"
//                 >
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//           <Button 
//             onClick={uploadFiles} 
//             isLoading={uploading} 
//             className="mt-3 w-full"
//           >
//             Upload {files.length} file{files.length > 1 ? 's' : ''}
//           </Button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskEvidenceUpload;




// // client/src/components/tasks/TaskEvidenceUpload.jsx
// import React, { useState } from 'react';
// import { useDropzone } from 'react-dropzone';
// import Button from '../common/Button';
// import { useToast } from '../../hooks/useToast';
// import { taskApi } from '../../api/task.api';

// const TaskEvidenceUpload = ({ taskId, existingImages = [], onUploadComplete, canUpload = true }) => {
//   const { showToast } = useToast();
//   const [uploading, setUploading] = useState(false);
//   const [images, setImages] = useState(existingImages);
//   const [files, setFiles] = useState([]);
//   const [imageUrl, setImageUrl] = useState('');
//   const [uploadMethod, setUploadMethod] = useState('file'); // 'file' or 'url'

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({
//     accept: {
//       'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
//       'video/*': ['.mp4', '.mov', '.avi', '.webm']
//     },
//     maxSize: 10485760, // 10MB
//     onDrop: (acceptedFiles) => {
//       setFiles(prev => [...prev, ...acceptedFiles]);
//     }
//   });

//   const removeFile = (index) => {
//     setFiles(prev => prev.filter((_, i) => i !== index));
//   };

//   const uploadFiles = async () => {
//     if (files.length === 0) {
//       showToast('Please select files to upload', 'warning');
//       return;
//     }

//     setUploading(true);
//     try {
//       // Convert files to base64 for preview and upload
//       const uploadedUrls = await Promise.all(
//         files.map(file => {
//           return new Promise((resolve) => {
//             const reader = new FileReader();
//             reader.onloadend = () => resolve(reader.result);
//             reader.readAsDataURL(file);
//           });
//         })
//       );
      
//       // Call API to upload evidence
//       const response = await taskApi.uploadEvidence(taskId, uploadedUrls, []);
      
//       if (response.data.success) {
//         setImages(prev => [...prev, ...uploadedUrls]);
//         showToast(`${files.length} file(s) uploaded successfully`, 'success');
//         setFiles([]);
//         if (onUploadComplete) onUploadComplete();
//       } else {
//         showToast(response.data.error || 'Upload failed', 'error');
//       }
//     } catch (error) {
//       console.error('Upload error:', error);
//       showToast(error.response?.data?.error || 'Upload failed', 'error');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const uploadFromUrl = async () => {
//     if (!imageUrl.trim()) {
//       showToast('Please enter an image URL', 'warning');
//       return;
//     }

//     // Validate URL format
//     try {
//       new URL(imageUrl);
//     } catch {
//       showToast('Please enter a valid URL', 'warning');
//       return;
//     }

//     setUploading(true);
//     try {
//       const response = await taskApi.uploadEvidence(taskId, [imageUrl], []);
      
//       if (response.data.success) {
//         setImages(prev => [...prev, imageUrl]);
//         showToast('Image uploaded successfully from URL', 'success');
//         setImageUrl('');
//         if (onUploadComplete) onUploadComplete();
//       } else {
//         showToast(response.data.error || 'Upload failed', 'error');
//       }
//     } catch (error) {
//       console.error('URL upload error:', error);
//       showToast(error.response?.data?.error || 'Failed to upload from URL', 'error');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const removeImage = async (index, imageUrl) => {
//     setImages(prev => prev.filter((_, i) => i !== index));
//     // Optionally call API to delete image
//     showToast('Image removed', 'info');
//   };

//   if (!canUpload) {
//     return (
//       <div className="text-center py-12">
//         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
//           <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//           </svg>
//           <p className="text-yellow-800 font-medium mb-2">Permission Required</p>
//           <p className="text-sm text-gray-600">
//             You don't have permission to upload evidence for this task.
//             <br />
//             Only the assigned technician can upload evidence when the task is in progress.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Upload Method Toggle */}
//       <div className="flex gap-2 border-b pb-2">
//         <button
//           onClick={() => setUploadMethod('file')}
//           className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
//             uploadMethod === 'file'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           📁 Upload from Device
//         </button>
//         <button
//           onClick={() => setUploadMethod('url')}
//           className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
//             uploadMethod === 'url'
//               ? 'text-blue-600 border-b-2 border-blue-600'
//               : 'text-gray-500 hover:text-gray-700'
//           }`}
//         >
//           🔗 Upload from URL
//         </button>
//       </div>

//       {/* URL Upload Method */}
//       {uploadMethod === 'url' && (
//         <div className="border rounded-lg p-4 bg-gray-50">
//           <h4 className="font-medium text-gray-900 mb-3">Enter Image URL</h4>
//           <div className="flex gap-2">
//             <input
//               type="text"
//               value={imageUrl}
//               onChange={(e) => setImageUrl(e.target.value)}
//               placeholder="https://example.com/image.jpg"
//               className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             />
//             <Button 
//               onClick={uploadFromUrl} 
//               isLoading={uploading} 
//               disabled={!imageUrl.trim()}
//               variant="primary"
//             >
//               Upload URL
//             </Button>
//           </div>
//           <p className="text-xs text-gray-500 mt-2">
//             💡 Tip: You can use any image URL from cloud storage (Google Drive, Dropbox, Imgur, etc.)
//           </p>
//           <div className="mt-3 p-2 bg-blue-50 rounded-lg">
//             <p className="text-xs text-blue-700">
//               🖼️ Supported formats: JPG, PNG, GIF, WebP. The image will be displayed directly from the URL.
//             </p>
//           </div>
//         </div>
//       )}

//       {/* File Upload Method */}
//       {uploadMethod === 'file' && (
//         <>
//           {/* Dropzone for file upload */}
//           <div
//             {...getRootProps()}
//             className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
//               isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
//             }`}
//           >
//             <input {...getInputProps()} />
//             <div className="text-5xl mb-3">📸</div>
//             <p className="text-gray-600 font-medium">
//               {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               Upload images as evidence for completed work
//             </p>
//             <p className="text-xs text-gray-400 mt-2">
//               Supported formats: JPG, PNG, GIF, MP4 (Max 10MB per file)
//             </p>
//           </div>

//           {/* Selected Files Preview */}
//           {files.length > 0 && (
//             <div className="border rounded-lg p-4">
//               <div className="flex justify-between items-center mb-3">
//                 <h4 className="font-medium text-gray-900">Selected Files ({files.length})</h4>
//                 <button
//                   onClick={() => setFiles([])}
//                   className="text-xs text-red-500 hover:text-red-700"
//                 >
//                   Clear All
//                 </button>
//               </div>
//               <div className="space-y-2 max-h-60 overflow-y-auto">
//                 {files.map((file, idx) => (
//                   <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
//                     <div className="flex items-center space-x-3">
//                       <span className="text-2xl">
//                         {file.type.startsWith('image/') ? '🖼️' : '🎥'}
//                       </span>
//                       <div>
//                         <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
//                         <p className="text-xs text-gray-400">
//                           {(file.size / 1024).toFixed(1)} KB
//                         </p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => removeFile(idx)}
//                       className="text-red-500 hover:text-red-700 p-1"
//                       title="Remove"
//                     >
//                       <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                       </svg>
//                     </button>
//                   </div>
//                 ))}
//               </div>
//               <Button 
//                 onClick={uploadFiles} 
//                 isLoading={uploading} 
//                 className="mt-4 w-full"
//                 variant="primary"
//               >
//                 Upload {files.length} File{files.length > 1 ? 's' : ''}
//               </Button>
//             </div>
//           )}
//         </>
//       )}

//       {/* Existing Evidence Gallery */}
//       {images.length > 0 && (
//         <div className="border rounded-lg p-4">
//           <div className="flex justify-between items-center mb-3">
//             <h4 className="font-medium text-gray-900">
//               📷 Evidence Gallery ({images.length})
//             </h4>
//           </div>
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
//             {images.map((img, idx) => (
//               <div key={idx} className="relative group">
//                 <img 
//                   src={img.url || img} 
//                   alt={`Evidence ${idx + 1}`} 
//                   className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
//                   onClick={() => window.open(img.url || img, '_blank')}
//                 />
//                 <button
//                   onClick={() => removeImage(idx, img.url || img)}
//                   className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                   title="Remove"
//                 >
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//                 {img.description && (
//                   <p className="text-xs text-gray-500 mt-1 truncate">{img.description}</p>
//                 )}
//               </div>
//             ))}
//           </div>
//           <p className="text-xs text-gray-400 mt-3 text-center">
//             Click on any image to view full size
//           </p>
//         </div>
//       )}

//       {/* Tips Section */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
//         <p className="text-sm text-blue-800 font-medium mb-1">💡 Tips for Evidence Upload:</p>
//         <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
//           <li>Upload before and after photos to show work completion</li>
//           <li>Use clear, well-lit photos for better documentation</li>
//           <li>You can upload multiple images at once</li>
//           <li>Images are stored securely and can be accessed later</li>
//           <li>For large videos, consider using cloud storage and share the URL</li>
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default TaskEvidenceUpload;




// client/src/components/tasks/TaskEvidenceUpload.jsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';
import { taskApi } from '../../api/task.api';

const TaskEvidenceUpload = ({ taskId, existingImages = [], onUploadComplete, canUpload = true }) => {
  const { showToast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState(existingImages);
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState('file');
  const [uploadProgress, setUploadProgress] = useState(0);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    maxSize: 10485760, // 10MB
    onDrop: (acceptedFiles) => {
      setFiles(prev => [...prev, ...acceptedFiles]);
    }
  });

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      showToast('Please select files to upload', 'warning');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    
    try {
      // Convert files to base64 with progress tracking
      const uploadedUrls = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const base64 = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
        uploadedUrls.push(base64);
        setUploadProgress(((i + 1) / files.length) * 100);
      }
      
      // Call API to upload evidence
      const response = await taskApi.uploadEvidence(taskId, uploadedUrls, []);
      
      if (response.data?.success) {
        setImages(prev => [...prev, ...uploadedUrls]);
        showToast(
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span>{files.length} file(s) uploaded successfully!</span>
          </div>, 
          'success'
        );
        setFiles([]);
        setUploadProgress(0);
        if (onUploadComplete) onUploadComplete();
      } else {
        showToast(response.data?.error || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast(error.response?.data?.error || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const uploadFromUrl = async () => {
    if (!imageUrl.trim()) {
      showToast('Please enter an image URL', 'warning');
      return;
    }

    // Validate URL format
    try {
      new URL(imageUrl);
    } catch {
      showToast('Please enter a valid URL', 'warning');
      return;
    }

    setUploading(true);
    try {
      const response = await taskApi.uploadEvidence(taskId, [imageUrl], []);
      
      if (response.data?.success) {
        setImages(prev => [...prev, imageUrl]);
        showToast('✅ Image uploaded successfully from URL!', 'success');
        setImageUrl('');
        if (onUploadComplete) onUploadComplete();
      } else {
        showToast(response.data?.error || 'Upload failed', 'error');
      }
    } catch (error) {
      console.error('URL upload error:', error);
      showToast(error.response?.data?.error || 'Failed to upload from URL', 'error');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async (index, imageUrl) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    showToast('Image removed', 'info');
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    showToast('Image URL copied to clipboard!', 'success');
  };

  if (!canUpload) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <svg className="w-12 h-12 text-yellow-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-yellow-800 font-medium mb-2">Permission Required</p>
          <p className="text-sm text-gray-600">
            Only the assigned technician can upload evidence when the task is in progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Method Toggle */}
      <div className="flex gap-2 border-b pb-2">
        <button
          onClick={() => setUploadMethod('file')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            uploadMethod === 'file'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          📁 Upload from Device
        </button>
        <button
          onClick={() => setUploadMethod('url')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            uploadMethod === 'url'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          🔗 Upload from URL
        </button>
      </div>

      {/* URL Upload Method */}
      {uploadMethod === 'url' && (
        <div className="border rounded-lg p-4 bg-gray-50">
          <h4 className="font-medium text-gray-900 mb-3">Enter Image URL</h4>
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button 
              onClick={uploadFromUrl} 
              isLoading={uploading} 
              disabled={!imageUrl.trim()}
              variant="primary"
            >
              Upload URL
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            💡 Tip: You can use any image URL from cloud storage (Google Drive, Dropbox, Imgur, etc.)
          </p>
        </div>
      )}

      {/* File Upload Method */}
      {uploadMethod === 'file' && (
        <>
          {/* Upload Progress Bar */}
          {uploading && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between text-sm mb-2">
                <span>Uploading {files.length} file(s)...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Dropzone for file upload */}
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-5xl mb-3">📸</div>
            <p className="text-gray-600 font-medium">
              {isDragActive ? 'Drop files here' : 'Click or drag files to upload'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Upload images as evidence for completed work
            </p>
            <p className="text-xs text-gray-400 mt-2">
              Supported formats: JPG, PNG, GIF, MP4 (Max 10MB per file)
            </p>
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && !uploading && (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium text-gray-900">Selected Files ({files.length})</h4>
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <img 
                            src={URL.createObjectURL(file)} 
                            alt="Preview" 
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-xl">🎥</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              {/* 🔴 SUBMIT BUTTON - Now clearly visible */}
              <Button 
                onClick={uploadFiles} 
                isLoading={uploading} 
                className="mt-4 w-full"
                variant="primary"
                size="md"
              >
                📤 Upload {files.length} File{files.length > 1 ? 's' : ''}
              </Button>
            </div>
          )}

          {/* No files selected message */}
          {files.length === 0 && !uploading && (
            <div className="text-center py-8 text-gray-400 border rounded-lg">
              <p>No files selected. Click or drag to select images.</p>
            </div>
          )}
        </>
      )}

      {/* Existing Evidence Gallery */}
      {images.length > 0 && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-medium text-gray-900">
              📷 Evidence Gallery ({images.length})
            </h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img 
                  src={img.url || img} 
                  alt={`Evidence ${idx + 1}`} 
                  className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => window.open(img.url || img, '_blank')}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(img.url || img);
                    }}
                    className="w-full text-center text-xs"
                  >
                    Copy URL
                  </button>
                </div>
                <button
                  onClick={() => removeImage(idx, img.url || img)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">
            Click on any image to view full size | Hover to copy URL
          </p>
        </div>
      )}

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-sm text-blue-800 font-medium mb-1">💡 Tips for Evidence Upload:</p>
        <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
          <li>Upload before and after photos to show work completion</li>
          <li>Use clear, well-lit photos for better documentation</li>
          <li>You can upload multiple images at once</li>
          <li>Click on images to view full size</li>
          <li>Hover over images to copy the URL</li>
          <li>For large videos, consider using cloud storage and share the URL</li>
        </ul>
      </div>
    </div>
  );
};

export default TaskEvidenceUpload;