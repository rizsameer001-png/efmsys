// // client/src/pages/settings/BackupRestore.jsx
//npm install archiver
//
// import React, { useState, useEffect } from 'react';
// import { settingsApi } from '../../api/settings.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const BackupRestore = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [backingUp, setBackingUp] = useState(false);
//   const [restoring, setRestoring] = useState(false);
//   const [backups, setBackups] = useState([]);
//   const [backupConfig, setBackupConfig] = useState({
//     includeDatabase: true,
//     includeUploads: true,
//     includeLogs: false,
//     scheduleEnabled: false,
//     scheduleFrequency: 'daily',
//     scheduleTime: '02:00',
//     retentionCount: 10
//   });

//   useEffect(() => {
//     fetchBackups();
//   }, []);

//   const fetchBackups = async () => {
//     setLoading(true);
//     try {
//       const response = await settingsApi.getBackups();
//       if (response.data.success) {
//         setBackups(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch backups error:', error);
//       showToast('Failed to load backups', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateBackup = async () => {
//     setBackingUp(true);
//     try {
//       const response = await settingsApi.createBackup(backupConfig);
//       if (response.data.success) {
//         showToast('Backup created successfully', 'success');
//         fetchBackups();
//       }
//     } catch (error) {
//       showToast('Failed to create backup', 'error');
//     } finally {
//       setBackingUp(false);
//     }
//   };

//   const handleDownloadBackup = async (backupId) => {
//     try {
//       const response = await settingsApi.downloadBackup(backupId);
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `backup_${backupId}.zip`;
//       link.click();
//       URL.revokeObjectURL(url);
//       showToast('Backup downloaded', 'success');
//     } catch (error) {
//       showToast('Failed to download backup', 'error');
//     }
//   };

//   const handleRestoreBackup = async (backupId) => {
//     if (!window.confirm('Restoring will overwrite current data. Are you sure?')) {
//       return;
//     }
    
//     setRestoring(true);
//     try {
//       const response = await settingsApi.restoreBackup(backupId);
//       if (response.data.success) {
//         showToast('Backup restored successfully. System will restart.', 'success');
//         setTimeout(() => window.location.reload(), 3000);
//       }
//     } catch (error) {
//       showToast('Failed to restore backup', 'error');
//     } finally {
//       setRestoring(false);
//     }
//   };

//   const handleDeleteBackup = async (backupId) => {
//     if (!window.confirm('Are you sure you want to delete this backup?')) {
//       return;
//     }
    
//     try {
//       const response = await settingsApi.deleteBackup(backupId);
//       if (response.data.success) {
//         showToast('Backup deleted', 'success');
//         fetchBackups();
//       }
//     } catch (error) {
//       showToast('Failed to delete backup', 'error');
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
//         <p className="text-gray-500 mt-1">Manage system backups and data recovery</p>
//       </div>

//       {/* Create Backup Section */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Create Backup</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={backupConfig.includeDatabase}
//               onChange={(e) => setBackupConfig({ ...backupConfig, includeDatabase: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//             <span className="text-sm text-gray-700">Include Database</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={backupConfig.includeUploads}
//               onChange={(e) => setBackupConfig({ ...backupConfig, includeUploads: e.target.checked})}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//             <span className="text-sm text-gray-700">Include Uploads</span>
//           </label>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={backupConfig.includeLogs}
//               onChange={(e) => setBackupConfig({ ...backupConfig, includeLogs: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//             <span className="text-sm text-gray-700">Include Logs</span>
//           </label>
//         </div>
//         <Button onClick={handleCreateBackup} isLoading={backingUp} variant="primary">
//           🚀 Create Backup Now
//         </Button>
//       </Card>

//       {/* Scheduled Backup Settings */}
//       <Card className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Scheduled Backups</h3>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={backupConfig.scheduleEnabled}
//               onChange={(e) => setBackupConfig({ ...backupConfig, scheduleEnabled: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//             <span className="text-sm text-gray-700">Enable Scheduled Backups</span>
//           </label>
//         </div>
//         {backupConfig.scheduleEnabled && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
//               <select
//                 value={backupConfig.scheduleFrequency}
//                 onChange={(e) => setBackupConfig({ ...backupConfig, scheduleFrequency: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               >
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
//               <input
//                 type="time"
//                 value={backupConfig.scheduleTime}
//                 onChange={(e) => setBackupConfig({ ...backupConfig, scheduleTime: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Retention Count</label>
//               <input
//                 type="number"
//                 value={backupConfig.retentionCount}
//                 onChange={(e) => setBackupConfig({ ...backupConfig, retentionCount: parseInt(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg"
//                 min={1}
//                 max={50}
//               />
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Backup List */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">Available Backups</h3>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Backup Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Size</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created By</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {backups.length > 0 ? (
//                 backups.map((backup) => (
//                   <tr key={backup.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {backup.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {new Date(backup.createdAt).toLocaleString()}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatFileSize(backup.size)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs rounded-full ${backup.type === 'auto' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
//                         {backup.type === 'auto' ? 'Scheduled' : 'Manual'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{backup.createdBy}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex space-x-2">
//                         <button
//                           onClick={() => handleDownloadBackup(backup.id)}
//                           className="text-blue-600 hover:text-blue-800"
//                           title="Download"
//                         >
//                           📥
//                         </button>
//                         <button
//                           onClick={() => handleRestoreBackup(backup.id)}
//                           className="text-green-600 hover:text-green-800"
//                           title="Restore"
//                           disabled={restoring}
//                         >
//                           🔄
//                         </button>
//                         <button
//                           onClick={() => handleDeleteBackup(backup.id)}
//                           className="text-red-600 hover:text-red-800"
//                           title="Delete"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
//                     No backups available
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Restore Warning */}
//       <Card className="p-6 bg-yellow-50 border border-yellow-200">
//         <div className="flex gap-3">
//           <span className="text-2xl">⚠️</span>
//           <div>
//             <h4 className="font-semibold text-yellow-800">Important Notes</h4>
//             <ul className="text-sm text-yellow-700 mt-1 space-y-1">
//               <li>• Restoring a backup will overwrite current data</li>
//               <li>• It's recommended to create a backup before restoring</li>
//               <li>• Large backups may take several minutes to restore</li>
//               <li>• System may restart during restore process</li>
//             </ul>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default BackupRestore;






// import React, { useState, useEffect } from 'react';
// import { settingsApi } from '../../api/settings.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const BackupRestore = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [backingUp, setBackingUp] = useState(false);
//   const [restoring, setRestoring] = useState(false);
//   const [downloading, setDownloading] = useState(null);
//   const [backups, setBackups] = useState([]);
//   const [backupConfig, setBackupConfig] = useState({
//     includeDatabase: true,
//     includeUploads: true,
//     includeLogs: false,
//     scheduleEnabled: false,
//     scheduleFrequency: 'daily',
//     scheduleTime: '02:00',
//     retentionCount: 10
//   });

//   useEffect(() => {
//     fetchBackups();
//   }, []);

//   const fetchBackups = async () => {
//     setLoading(true);
//     try {
//       const response = await settingsApi.getBackups();
//       if (response.data.success) {
//         // Ensure each backup has a unique id
//         const backupsWithId = response.data.data.map(backup => ({
//           ...backup,
//           uniqueId: backup._id || backup.id || `backup_${backup.createdAt}_${Math.random()}`
//         }));
//         setBackups(backupsWithId);
//       }
//     } catch (error) {
//       console.error('Fetch backups error:', error);
//       showToast(error.userMessage || 'Failed to load backups', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCreateBackup = async () => {
//     setBackingUp(true);
//     try {
//       const response = await settingsApi.createBackup({
//         type: 'manual',
//         ...backupConfig
//       });
//       if (response.data.success) {
//         showToast('Backup created successfully', 'success');
//         fetchBackups();
//       }
//     } catch (error) {
//       console.error('Create backup error:', error);
//       showToast(error.userMessage || 'Failed to create backup', 'error');
//     } finally {
//       setBackingUp(false);
//     }
//   };

//   const handleDownloadBackup = async (backupId, backupName) => {
//     setDownloading(backupId);
//     try {
//       const response = await settingsApi.downloadBackup(backupId);
      
//       // Create blob and download
//       const blob = new Blob([response.data], { type: 'application/zip' });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = backupName || `backup_${backupId}.zip`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
//       URL.revokeObjectURL(url);
      
//       showToast('Backup downloaded successfully', 'success');
//     } catch (error) {
//       console.error('Download backup error:', error);
//       showToast(error.userMessage || 'Failed to download backup', 'error');
//     } finally {
//       setDownloading(null);
//     }
//   };

//   const handleRestoreBackup = async (backupId, backupName) => {
//     if (!window.confirm(`Are you sure you want to restore "${backupName}"? This will overwrite current data.`)) {
//       return;
//     }
    
//     setRestoring(true);
//     try {
//       const response = await settingsApi.restoreBackup(backupId);
//       if (response.data.success) {
//         showToast('Backup restored successfully. Page will reload.', 'success');
//         setTimeout(() => window.location.reload(), 2000);
//       }
//     } catch (error) {
//       console.error('Restore backup error:', error);
//       showToast(error.userMessage || 'Failed to restore backup', 'error');
//     } finally {
//       setRestoring(false);
//     }
//   };

//   const handleDeleteBackup = async (backupId, backupName) => {
//     if (!window.confirm(`Are you sure you want to delete "${backupName}"? This action cannot be undone.`)) {
//       return;
//     }
    
//     try {
//       const response = await settingsApi.deleteBackup(backupId);
//       if (response.data.success) {
//         showToast('Backup deleted successfully', 'success');
//         fetchBackups();
//       }
//     } catch (error) {
//       console.error('Delete backup error:', error);
//       showToast(error.userMessage || 'Failed to delete backup', 'error');
//     }
//   };

//   const formatFileSize = (bytes) => {
//     if (!bytes || bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleString();
//     } catch (error) {
//       return 'Invalid date';
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
//         <p className="text-gray-500 mt-1">Manage system backups and data recovery</p>
//       </div>

//       {/* Create Backup Section */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Create Backup</h3>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//           <label className="flex items-center gap-2" key="include-database">
//             <input
//               type="checkbox"
//               checked={backupConfig.includeDatabase}
//               onChange={(e) => setBackupConfig({ ...backupConfig, includeDatabase: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-700">Include Database</span>
//           </label>
//           <label className="flex items-center gap-2" key="include-uploads">
//             <input
//               type="checkbox"
//               checked={backupConfig.includeUploads}
//               onChange={(e) => setBackupConfig({ ...backupConfig, includeUploads: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-700">Include Uploads</span>
//           </label>
//           <label className="flex items-center gap-2" key="include-logs">
//             <input
//               type="checkbox"
//               checked={backupConfig.includeLogs}
//               onChange={(e) => setBackupConfig({ ...backupConfig, includeLogs: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-700">Include Logs</span>
//           </label>
//         </div>
//         <Button 
//           onClick={handleCreateBackup} 
//           isLoading={backingUp} 
//           variant="primary"
//           disabled={backingUp}
//         >
//           {backingUp ? 'Creating Backup...' : '🚀 Create Backup Now'}
//         </Button>
//       </Card>

//       {/* Scheduled Backup Settings */}
//       <Card className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Scheduled Backups</h3>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={backupConfig.scheduleEnabled}
//               onChange={(e) => setBackupConfig({ ...backupConfig, scheduleEnabled: e.target.checked })}
//               className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
//             />
//             <span className="text-sm text-gray-700">Enable Scheduled Backups</span>
//           </label>
//         </div>
//         {backupConfig.scheduleEnabled && (
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div key="frequency">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
//               <select
//                 value={backupConfig.scheduleFrequency}
//                 onChange={(e) => setBackupConfig({ ...backupConfig, scheduleFrequency: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//               </select>
//             </div>
//             <div key="time">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
//               <input
//                 type="time"
//                 value={backupConfig.scheduleTime}
//                 onChange={(e) => setBackupConfig({ ...backupConfig, scheduleTime: e.target.value })}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//               />
//             </div>
//             <div key="retention">
//               <label className="block text-sm font-medium text-gray-700 mb-1">Retention Count</label>
//               <input
//                 type="number"
//                 value={backupConfig.retentionCount}
//                 onChange={(e) => setBackupConfig({ ...backupConfig, retentionCount: parseInt(e.target.value) })}
//                 className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//                 min={1}
//                 max={50}
//               />
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Backup List */}
//       <Card className="overflow-hidden">
//         <div className="px-6 py-4 border-b bg-gray-50">
//           <h3 className="font-semibold text-gray-900">Available Backups</h3>
//           <p className="text-sm text-gray-500 mt-1">Total backups: {backups.length}</p>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backup Name</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {backups.length > 0 ? (
//                 backups.map((backup) => (
//                   <tr key={backup.uniqueId || backup._id || backup.id} className="hover:bg-gray-50 transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {backup.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatDate(backup.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {formatFileSize(backup.size)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                         backup.type === 'auto' 
//                           ? 'bg-blue-100 text-blue-800' 
//                           : 'bg-green-100 text-green-800'
//                       }`}>
//                         {backup.type === 'auto' ? 'Scheduled' : 'Manual'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {backup.createdBy || 'System'}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm">
//                       <div className="flex space-x-3">
//                         <button
//                           onClick={() => handleDownloadBackup(backup._id || backup.id, backup.name)}
//                           className="text-blue-600 hover:text-blue-800 transition-colors"
//                           title="Download"
//                           disabled={downloading === (backup._id || backup.id)}
//                         >
//                           {downloading === (backup._id || backup.id) ? '⏳' : '📥'}
//                         </button>
//                         <button
//                           onClick={() => handleRestoreBackup(backup._id || backup.id, backup.name)}
//                           className="text-green-600 hover:text-green-800 transition-colors"
//                           title="Restore"
//                           disabled={restoring}
//                         >
//                           🔄
//                         </button>
//                         <button
//                           onClick={() => handleDeleteBackup(backup._id || backup.id, backup.name)}
//                           className="text-red-600 hover:text-red-800 transition-colors"
//                           title="Delete"
//                         >
//                           🗑️
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
//                     <div className="flex flex-col items-center gap-2">
//                       <span className="text-4xl">📦</span>
//                       <p>No backups available</p>
//                       <p className="text-sm">Create your first backup using the button above</p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Restore Warning */}
//       <Card className="p-6 bg-yellow-50 border border-yellow-200">
//         <div className="flex gap-3">
//           <span className="text-2xl">⚠️</span>
//           <div className="flex-1">
//             <h4 className="font-semibold text-yellow-800">Important Notes</h4>
//             <ul className="text-sm text-yellow-700 mt-2 space-y-1">
//               <li key="note-1">• Restoring a backup will overwrite current data</li>
//               <li key="note-2">• It's recommended to create a backup before restoring</li>
//               <li key="note-3">• Large backups may take several minutes to restore</li>
//               <li key="note-4">• The page will reload after successful restoration</li>
//               <li key="note-5">• Keep backups stored in a secure location</li>
//             </ul>
//           </div>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default BackupRestore;







import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const BackupRestore = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [backups, setBackups] = useState([]);
  const [backupConfig, setBackupConfig] = useState({
    includeDatabase: true,
    includeUploads: true,
    includeLogs: false,
    scheduleEnabled: false,
    scheduleFrequency: 'daily',
    scheduleTime: '02:00',
    retentionCount: 10
  });

  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getBackups();
      if (response.data.success) {
        // Ensure each backup has a unique id
        const backupsWithId = response.data.data.map(backup => ({
          ...backup,
          uniqueId: backup._id || backup.id || `backup_${backup.createdAt}_${Math.random()}`
        }));
        setBackups(backupsWithId);
      }
    } catch (error) {
      console.error('Fetch backups error:', error);
      showToast(error.userMessage || 'Failed to load backups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setBackingUp(true);
    try {
      const response = await settingsApi.createBackup({
        type: 'manual',
        ...backupConfig
      });
      if (response.data.success) {
        showToast(response.data.message || 'Backup created successfully', 'success');
        fetchBackups();
      }
    } catch (error) {
      console.error('Create backup error:', error);
      showToast(error.userMessage || 'Failed to create backup', 'error');
    } finally {
      setBackingUp(false);
    }
  };

  const handleDownloadBackup = async (backupId, backupName) => {
    setDownloading(backupId);
    let url = null;
    
    try {
      const response = await settingsApi.downloadBackup(backupId);
      
      // Check if response has data
      if (!response.data || response.data.size === 0) {
        throw new Error('Downloaded file is empty');
      }
      
      // Create blob from response data
      const blob = new Blob([response.data], { type: 'application/zip' });
      
      // Verify blob size
      if (blob.size === 0) {
        throw new Error('Created blob is empty');
      }
      
      // Create download link
      url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = backupName || `backup_${backupId}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message with file size
      const fileSizeKB = (blob.size / 1024).toFixed(2);
      showToast(`Backup downloaded successfully (${fileSizeKB} KB)`, 'success');
      
    } catch (error) {
      console.error('Download backup error:', error);
      showToast(error.userMessage || error.message || 'Failed to download backup', 'error');
    } finally {
      // Clean up URL object after download
      if (url) {
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      }
      setDownloading(null);
    }
  };

  const handleRestoreBackup = async (backupId, backupName) => {
    if (!window.confirm(`⚠️ WARNING: Restoring "${backupName}" will overwrite ALL current data.\n\nThis action cannot be undone. Are you absolutely sure?`)) {
      return;
    }
    
    setRestoring(true);
    try {
      const response = await settingsApi.restoreBackup(backupId);
      if (response.data.success) {
        showToast(response.data.message || 'Backup restored successfully. Page will reload.', 'success');
        setTimeout(() => window.location.reload(), 3000);
      }
    } catch (error) {
      console.error('Restore backup error:', error);
      showToast(error.userMessage || 'Failed to restore backup', 'error');
    } finally {
      setRestoring(false);
    }
  };

  const handleDeleteBackup = async (backupId, backupName) => {
    if (!window.confirm(`Are you sure you want to delete "${backupName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await settingsApi.deleteBackup(backupId);
      if (response.data.success) {
        showToast('Backup deleted successfully', 'success');
        fetchBackups();
      }
    } catch (error) {
      console.error('Delete backup error:', error);
      showToast(error.userMessage || 'Failed to delete backup', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Backup & Restore</h1>
        <p className="text-gray-500 mt-1">Manage system backups and data recovery</p>
      </div>

      {/* Create Backup Section */}
      <Card className="p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Create Backup</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <label className="flex items-center gap-2" key="include-database">
            <input
              type="checkbox"
              checked={backupConfig.includeDatabase}
              onChange={(e) => setBackupConfig({ ...backupConfig, includeDatabase: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Database</span>
          </label>
          <label className="flex items-center gap-2" key="include-uploads">
            <input
              type="checkbox"
              checked={backupConfig.includeUploads}
              onChange={(e) => setBackupConfig({ ...backupConfig, includeUploads: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Uploads</span>
          </label>
          <label className="flex items-center gap-2" key="include-logs">
            <input
              type="checkbox"
              checked={backupConfig.includeLogs}
              onChange={(e) => setBackupConfig({ ...backupConfig, includeLogs: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Logs</span>
          </label>
        </div>
        <Button 
          onClick={handleCreateBackup} 
          isLoading={backingUp} 
          variant="primary"
          disabled={backingUp}
        >
          {backingUp ? 'Creating Backup...' : '🚀 Create Backup Now'}
        </Button>
      </Card>

      {/* Scheduled Backup Settings */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-900">Scheduled Backups</h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={backupConfig.scheduleEnabled}
              onChange={(e) => setBackupConfig({ ...backupConfig, scheduleEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Enable Scheduled Backups</span>
          </label>
        </div>
        {backupConfig.scheduleEnabled && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div key="frequency">
              <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
              <select
                value={backupConfig.scheduleFrequency}
                onChange={(e) => setBackupConfig({ ...backupConfig, scheduleFrequency: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div key="time">
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                value={backupConfig.scheduleTime}
                onChange={(e) => setBackupConfig({ ...backupConfig, scheduleTime: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div key="retention">
              <label className="block text-sm font-medium text-gray-700 mb-1">Retention Count</label>
              <input
                type="number"
                value={backupConfig.retentionCount}
                onChange={(e) => setBackupConfig({ ...backupConfig, retentionCount: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                min={1}
                max={50}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Backup List */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-900">Available Backups</h3>
          <p className="text-sm text-gray-500 mt-1">Total backups: {backups.length}</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Backup Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created By</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {backups.length > 0 ? (
                backups.map((backup) => (
                  <tr key={backup.uniqueId || backup._id || backup.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {backup.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(backup.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatFileSize(backup.size)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        backup.type === 'auto' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {backup.type === 'auto' ? 'Scheduled' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {backup.createdBy || 'System'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleDownloadBackup(backup._id || backup.id, backup.name)}
                          className="text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download"
                          disabled={downloading === (backup._id || backup.id)}
                        >
                          {downloading === (backup._id || backup.id) ? '⏳ Downloading...' : '📥 Download'}
                        </button>
                        <button
                          onClick={() => handleRestoreBackup(backup._id || backup.id, backup.name)}
                          className="text-green-600 hover:text-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Restore"
                          disabled={restoring}
                        >
                          🔄 Restore
                        </button>
                        <button
                          onClick={() => handleDeleteBackup(backup._id || backup.id, backup.name)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                          title="Delete"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📦</span>
                      <p>No backups available</p>
                      <p className="text-sm">Create your first backup using the button above</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Restore Warning */}
      <Card className="p-6 bg-yellow-50 border border-yellow-200">
        <div className="flex gap-3">
          <span className="text-2xl">⚠️</span>
          <div className="flex-1">
            <h4 className="font-semibold text-yellow-800">Important Notes</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li key="note-1">• Restoring a backup will overwrite ALL current data</li>
              <li key="note-2">• It's strongly recommended to create a backup before restoring</li>
              <li key="note-3">• Large backups may take several minutes to restore</li>
              <li key="note-4">• The page will automatically reload after successful restoration</li>
              <li key="note-5">• Keep backup files stored in a secure location</li>
              <li key="note-6">• Backups include database, uploads, and configuration files</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BackupRestore;