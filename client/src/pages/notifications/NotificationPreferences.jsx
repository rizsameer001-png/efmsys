// // client/src/pages/notifications/NotificationPreferences.jsx
// import React, { useState, useEffect } from 'react';
// import { notificationApi } from '../../api/notification.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const NotificationPreferences = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [preferences, setPreferences] = useState({
//     emailNotifications: true,
//     pushNotifications: true,
//     smsNotifications: false,
//     desktopAlerts: true,
//     soundAlerts: false,
//     quietHours: {
//       enabled: false,
//       start: '22:00',
//       end: '08:00'
//     },
//     categories: {
//       taskAssigned: true,
//       taskUpdated: true,
//       taskCompleted: true,
//       complaintRaised: true,
//       complaintResolved: true,
//       leaveApproved: true,
//       leaveRejected: true,
//       attendanceReminder: true,
//       salarySlipAvailable: true,
//       systemAnnouncement: true,
//       securityAlert: true
//     },
//     channels: {
//       email: ['taskAssigned', 'complaintRaised', 'salarySlipAvailable'],
//       push: ['taskAssigned', 'taskUpdated', 'complaintResolved'],
//       sms: ['securityAlert']
//     }
//   });

//   useEffect(() => {
//     fetchPreferences();
//   }, []);

//   const fetchPreferences = async () => {
//     setLoading(true);
//     try {
//       const response = await notificationApi.getPreferences();
//       if (response.data.success) {
//         setPreferences(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch preferences error:', error);
//       showToast('Failed to load preferences', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const response = await notificationApi.updatePreferences(preferences);
//       if (response.data.success) {
//         showToast('Preferences saved successfully', 'success');
//       }
//     } catch (error) {
//       showToast('Failed to save preferences', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleCategoryToggle = (category) => {
//     setPreferences(prev => ({
//       ...prev,
//       categories: {
//         ...prev.categories,
//         [category]: !prev.categories[category]
//       }
//     }));
//   };

//   const handleChannelToggle = (channel, category) => {
//     setPreferences(prev => {
//       const current = [...prev.channels[channel]];
//       if (current.includes(category)) {
//         return {
//           ...prev,
//           channels: {
//             ...prev.channels,
//             [channel]: current.filter(c => c !== category)
//           }
//         };
//       } else {
//         return {
//           ...prev,
//           channels: {
//             ...prev.channels,
//             [channel]: [...current, category]
//           }
//         };
//       }
//     });
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
//         <p className="text-gray-500 mt-1">Customize how you receive notifications</p>
//       </div>

//       {/* General Preferences */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">General Preferences</h3>
//         <div className="space-y-3">
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Email Notifications</span>
//               <p className="text-xs text-gray-500">Receive notifications via email</p>
//             </div>
//             <div className="relative inline-block w-10">
//               <input
//                 type="checkbox"
//                 checked={preferences.emailNotifications}
//                 onChange={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${preferences.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Push Notifications</span>
//               <p className="text-xs text-gray-500">Receive browser push notifications</p>
//             </div>
//             <div className="relative inline-block w-10">
//               <input
//                 type="checkbox"
//                 checked={preferences.pushNotifications}
//                 onChange={() => setPreferences({ ...preferences, pushNotifications: !preferences.pushNotifications })}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${preferences.pushNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">SMS Notifications</span>
//               <p className="text-xs text-gray-500">Receive SMS alerts for important updates</p>
//             </div>
//             <div className="relative inline-block w-10">
//               <input
//                 type="checkbox"
//                 checked={preferences.smsNotifications}
//                 onChange={() => setPreferences({ ...preferences, smsNotifications: !preferences.smsNotifications })}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${preferences.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Desktop Alerts</span>
//               <p className="text-xs text-gray-500">Show popup notifications on desktop</p>
//             </div>
//             <div className="relative inline-block w-10">
//               <input
//                 type="checkbox"
//                 checked={preferences.desktopAlerts}
//                 onChange={() => setPreferences({ ...preferences, desktopAlerts: !preferences.desktopAlerts })}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${preferences.desktopAlerts ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>

//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <div>
//               <span className="text-gray-700">Sound Alerts</span>
//               <p className="text-xs text-gray-500">Play sound for new notifications</p>
//             </div>
//             <div className="relative inline-block w-10">
//               <input
//                 type="checkbox"
//                 checked={preferences.soundAlerts}
//                 onChange={() => setPreferences({ ...preferences, soundAlerts: !preferences.soundAlerts })}
//                 className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
//               />
//               <label className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${preferences.soundAlerts ? 'bg-blue-600' : 'bg-gray-300'}`} />
//             </div>
//           </label>
//         </div>
//       </Card>

//       {/* Quiet Hours */}
//       <Card className="p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="font-semibold text-gray-900">Quiet Hours</h3>
//           <label className="flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={preferences.quietHours.enabled}
//               onChange={() => setPreferences({
//                 ...preferences,
//                 quietHours: { ...preferences.quietHours, enabled: !preferences.quietHours.enabled }
//               })}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//             <span className="text-sm text-gray-700">Enable Quiet Hours</span>
//           </label>
//         </div>
//         {preferences.quietHours.enabled && (
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
//               <input
//                 type="time"
//                 value={preferences.quietHours.start}
//                 onChange={(e) => setPreferences({
//                   ...preferences,
//                   quietHours: { ...preferences.quietHours, start: e.target.value }
//                 })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
//               <input
//                 type="time"
//                 value={preferences.quietHours.end}
//                 onChange={(e) => setPreferences({
//                   ...preferences,
//                   quietHours: { ...preferences.quietHours, end: e.target.value }
//                 })}
//                 className="w-full px-3 py-2 border rounded-lg"
//               />
//             </div>
//           </div>
//         )}
//       </Card>

//       {/* Notification Categories */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Notification Categories</h3>
//         <div className="space-y-3">
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">📋 Task Assigned</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.taskAssigned}
//               onChange={() => handleCategoryToggle('taskAssigned')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">🔄 Task Updated</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.taskUpdated}
//               onChange={() => handleCategoryToggle('taskUpdated')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">✅ Task Completed</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.taskCompleted}
//               onChange={() => handleCategoryToggle('taskCompleted')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">⚠️ Complaint Raised</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.complaintRaised}
//               onChange={() => handleCategoryToggle('complaintRaised')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">👍 Complaint Resolved</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.complaintResolved}
//               onChange={() => handleCategoryToggle('complaintResolved')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">✅ Leave Approved</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.leaveApproved}
//               onChange={() => handleCategoryToggle('leaveApproved')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">❌ Leave Rejected</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.leaveRejected}
//               onChange={() => handleCategoryToggle('leaveRejected')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">⏰ Attendance Reminder</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.attendanceReminder}
//               onChange={() => handleCategoryToggle('attendanceReminder')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">💰 Salary Slip Available</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.salarySlipAvailable}
//               onChange={() => handleCategoryToggle('salarySlipAvailable')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">📢 System Announcement</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.systemAnnouncement}
//               onChange={() => handleCategoryToggle('systemAnnouncement')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between cursor-pointer p-3 hover:bg-gray-50 rounded-lg">
//             <span className="text-gray-700">🔒 Security Alert</span>
//             <input
//               type="checkbox"
//               checked={preferences.categories.securityAlert}
//               onChange={() => handleCategoryToggle('securityAlert')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//         </div>
//       </Card>

//       {/* Channel Selection */}
//       <Card className="p-6">
//         <h3 className="font-semibold text-gray-900 mb-4">Channel Preferences</h3>
//         <p className="text-sm text-gray-500 mb-4">Select which channels to use for each notification type</p>
        
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead>
//               <tr className="border-b">
//                 <th className="py-2 text-left text-sm font-medium text-gray-700">Category</th>
//                 <th className="py-2 text-center text-sm font-medium text-gray-700">Email</th>
//                 <th className="py-2 text-center text-sm font-medium text-gray-700">Push</th>
//                 <th className="py-2 text-center text-sm font-medium text-gray-700">SMS</th>
//               </tr>
//             </thead>
//             <tbody>
//               <tr className="border-b">
//                 <td className="py-2 text-sm text-gray-600">Task Assigned</td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.email.includes('taskAssigned')}
//                     onChange={() => handleChannelToggle('email', 'taskAssigned')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.push.includes('taskAssigned')}
//                     onChange={() => handleChannelToggle('push', 'taskAssigned')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.sms.includes('taskAssigned')}
//                     onChange={() => handleChannelToggle('sms', 'taskAssigned')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//               </tr>
//               <tr className="border-b">
//                 <td className="py-2 text-sm text-gray-600">Complaint Raised</td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.email.includes('complaintRaised')}
//                     onChange={() => handleChannelToggle('email', 'complaintRaised')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.push.includes('complaintRaised')}
//                     onChange={() => handleChannelToggle('push', 'complaintRaised')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.sms.includes('complaintRaised')}
//                     onChange={() => handleChannelToggle('sms', 'complaintRaised')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//               </tr>
//               <tr className="border-b">
//                 <td className="py-2 text-sm text-gray-600">Leave Approved</td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.email.includes('leaveApproved')}
//                     onChange={() => handleChannelToggle('email', 'leaveApproved')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.push.includes('leaveApproved')}
//                     onChange={() => handleChannelToggle('push', 'leaveApproved')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.sms.includes('leaveApproved')}
//                     onChange={() => handleChannelToggle('sms', 'leaveApproved')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//               </tr>
//               <tr className="border-b">
//                 <td className="py-2 text-sm text-gray-600">Salary Slip Available</td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.email.includes('salarySlipAvailable')}
//                     onChange={() => handleChannelToggle('email', 'salarySlipAvailable')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.push.includes('salarySlipAvailable')}
//                     onChange={() => handleChannelToggle('push', 'salarySlipAvailable')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//                 <td className="py-2 text-center">
//                   <input
//                     type="checkbox"
//                     checked={preferences.channels.sms.includes('salarySlipAvailable')}
//                     onChange={() => handleChannelToggle('sms', 'salarySlipAvailable')}
//                     className="w-4 h-4"
//                   />
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Action Buttons */}
//       <div className="flex justify-end gap-3">
//         <Button variant="secondary" onClick={fetchPreferences}>
//           Reset
//         </Button>
//         <Button onClick={handleSave} isLoading={saving}>
//           Save Preferences
//         </Button>
//       </div>

//       <style jsx>{`
//         .toggle-checkbox:checked {
//           right: 0;
//           border-color: #3B82F6;
//         }
//         .toggle-checkbox:checked + .toggle-label {
//           background-color: #3B82F6;
//         }
//         .toggle-checkbox {
//           right: 0;
//           transition: all 0.3s ease;
//         }
//         .toggle-checkbox:checked {
//           right: 1rem;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NotificationPreferences;







// client/src/pages/notifications/NotificationPreferences.jsx
import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notification.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const NotificationPreferences = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // 🔴 FIX: Initialize preferences with default values and ensure quietHours exists
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    inApp: true,
    sound: true,
    quietHours: {
      enabled: false,
      start: '22:00',
      end: '07:00'
    },
    categories: {
      task: { email: true, push: true, inApp: true },
      complaint: { email: true, push: true, inApp: true },
      attendance: { email: true, push: true, inApp: true },
      leave: { email: true, push: true, inApp: true },
      salary: { email: true, push: true, inApp: true },
      payment: { email: true, push: true, inApp: true },
      approval: { email: true, push: true, inApp: true },
      reminder: { email: true, push: true, inApp: true },
      alert: { email: true, push: true, inApp: true },
      system: { email: true, push: true, inApp: true },
      chat: { email: true, push: true, inApp: true },
      maintenance: { email: true, push: true, inApp: true },
      inspection: { email: true, push: true, inApp: true }
    }
  });

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getPreferences();
      if (response.data.success) {
        const data = response.data.data;
        // 🔴 FIX: Ensure quietHours exists with default values
        setPreferences({
          email: data.email !== undefined ? data.email : true,
          push: data.push !== undefined ? data.push : true,
          inApp: data.inApp !== undefined ? data.inApp : true,
          sound: data.sound !== undefined ? data.sound : true,
          quietHours: {
            enabled: data.quietHours?.enabled || false,
            start: data.quietHours?.start || '22:00',
            end: data.quietHours?.end || '07:00'
          },
          categories: {
            ...preferences.categories,
            ...data.categories
          }
        });
      }
    } catch (error) {
      console.error('Fetch preferences error:', error);
      showToast('Failed to load notification preferences', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async () => {
    setSaving(true);
    try {
      const response = await notificationApi.updatePreferences(preferences);
      if (response.data.success) {
        showToast('Preferences updated successfully', 'success');
      } else {
        showToast(response.data.error || 'Failed to update preferences', 'error');
      }
    } catch (error) {
      console.error('Update preferences error:', error);
      showToast(error.response?.data?.error || 'Failed to update preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChannelChange = (channel) => {
    setPreferences(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  const handleCategoryChange = (category, channel) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: {
          ...prev.categories[category],
          [channel]: !prev.categories[category][channel]
        }
      }
    }));
  };

  const handleQuietHoursChange = (field, value) => {
    setPreferences(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        [field]: value
      }
    }));
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Notification Preferences</h1>
        <p className="text-gray-500 mt-1">Customize how and when you receive notifications</p>
      </div>

      {/* Global Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Global Settings</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium text-gray-900">Email Notifications</span>
              <p className="text-sm text-gray-500">Receive notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.email}
              onChange={() => handleChannelChange('email')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium text-gray-900">Push Notifications</span>
              <p className="text-sm text-gray-500">Receive push notifications on your device</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.push}
              onChange={() => handleChannelChange('push')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium text-gray-900">In-App Notifications</span>
              <p className="text-sm text-gray-500">Show notifications within the app</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.inApp}
              onChange={() => handleChannelChange('inApp')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>

          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium text-gray-900">Sound Alerts</span>
              <p className="text-sm text-gray-500">Play sound for new notifications</p>
            </div>
            <input
              type="checkbox"
              checked={preferences.sound}
              onChange={() => handleChannelChange('sound')}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          </label>
        </div>
      </Card>

      {/* Quiet Hours */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quiet Hours</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.quietHours?.enabled || false}
              onChange={(e) => handleQuietHoursChange('enabled', e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700">Enable Quiet Hours</span>
          </label>

          {preferences.quietHours?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  value={preferences.quietHours.start || '22:00'}
                  onChange={(e) => handleQuietHoursChange('start', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time
                </label>
                <input
                  type="time"
                  value={preferences.quietHours.end || '07:00'}
                  onChange={(e) => handleQuietHoursChange('end', e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
          <p className="text-sm text-gray-500 ml-8">
            During quiet hours, you won't receive any notifications (except alerts)
          </p>
        </div>
      </Card>

      {/* Category Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Categories</h3>
        <div className="space-y-4">
          {Object.entries(preferences.categories).map(([category, settings]) => (
            <div key={category} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 capitalize mb-3">
                {category.replace('_', ' ')} Notifications
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={() => handleCategoryChange(category, 'email')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Email</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={() => handleCategoryChange(category, 'push')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Push</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.inApp}
                    onChange={() => handleCategoryChange(category, 'inApp')}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">In-App</span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={fetchPreferences}>
          Reset
        </Button>
        <Button variant="primary" onClick={updatePreferences} isLoading={saving}>
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default NotificationPreferences;







