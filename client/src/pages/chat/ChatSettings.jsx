// // client/src/pages/chat/ChatSettings.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const ChatSettings = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [settings, setSettings] = useState({
//     notifications: { email: true, push: true, sound: true },
//     theme: 'light',
//     blockedUsers: []
//   });

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   const fetchSettings = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChatSettings();
//       if (response.data.success) {
//         setSettings(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch settings error:', error);
//       showToast('Failed to load chat settings', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const saveSettings = async () => {
//     setSaving(true);
//     try {
//       // Update settings API call
//       showToast('Settings saved successfully', 'success');
//     } catch (error) {
//       showToast('Failed to save settings', 'error');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const toggleNotification = (type) => {
//     setSettings(prev => ({
//       ...prev,
//       notifications: {
//         ...prev.notifications,
//         [type]: !prev.notifications[type]
//       }
//     }));
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Chat Settings</h1>
//         <p className="text-gray-500 mt-1">Manage your chat preferences</p>
//       </div>

//       {/* Notification Settings */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Notifications</h3>
//         <div className="space-y-3">
//           <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
//             <div>
//               <span className="font-medium">Email Notifications</span>
//               <p className="text-xs text-gray-500">Receive chat notifications via email</p>
//             </div>
//             <input
//               type="checkbox"
//               checked={settings.notifications.email}
//               onChange={() => toggleNotification('email')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
//             <div>
//               <span className="font-medium">Push Notifications</span>
//               <p className="text-xs text-gray-500">Receive push notifications</p>
//             </div>
//             <input
//               type="checkbox"
//               checked={settings.notifications.push}
//               onChange={() => toggleNotification('push')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//           <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
//             <div>
//               <span className="font-medium">Sound Alerts</span>
//               <p className="text-xs text-gray-500">Play sound for new messages</p>
//             </div>
//             <input
//               type="checkbox"
//               checked={settings.notifications.sound}
//               onChange={() => toggleNotification('sound')}
//               className="w-4 h-4 rounded border-gray-300"
//             />
//           </label>
//         </div>
//       </Card>

//       {/* Appearance */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Appearance</h3>
//         <div className="flex gap-3">
//           <button
//             onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
//             className={`flex-1 p-3 rounded-lg border-2 transition-all ${
//               settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//             }`}
//           >
//             ☀️ Light
//           </button>
//           <button
//             onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
//             className={`flex-1 p-3 rounded-lg border-2 transition-all ${
//               settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
//             }`}
//           >
//             🌙 Dark
//           </button>
//         </div>
//       </Card>

//       {/* Blocked Users */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">🚫 Blocked Users</h3>
//         {settings.blockedUsers?.length > 0 ? (
//           <div className="space-y-2">
//             {settings.blockedUsers.map(user => (
//               <div key={user.userId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
//                 <span>{user.name}</span>
//                 <button className="text-blue-600 text-sm">Unblock</button>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <p className="text-gray-500 text-center py-4">No blocked users</p>
//         )}
//       </Card>

//       {/* Save Button */}
//       <div className="flex justify-end">
//         <Button onClick={saveSettings} isLoading={saving}>
//           Save Settings
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ChatSettings;










import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import { userApi } from '../../api/user.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const ChatSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showExpiryModal, setShowExpiryModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const [expiryDays, setExpiryDays] = useState(7);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [settings, setSettings] = useState({
    // Notification Settings
    notifications: { 
      email: true, 
      push: true, 
      sound: true,
      desktop: true,
      mentions: true,
      groupMentions: true
    },
    
    // Privacy Settings
    privacy: {
      showOnlineStatus: true,
      showLastSeen: true,
      showReadReceipts: true,
      allowMessagesFrom: 'everyone', // everyone, contacts, nobody
      blockUnknown: false
    },
    
    // Message Settings
    messageSettings: {
      autoDeleteAfter: 0, // days (0 = never)
      saveMediaToGallery: true,
      allowForwarding: true,
      allowScreenshots: true
    },
    
    // Chat Appearance
    theme: 'light',
    fontSize: 'medium', // small, medium, large
    chatBackground: 'default',
    enterToSend: true,
    showTimestamps: true,
    
    // Data Management
    blockedUsers: [],
    archivedChats: [],
    mutedChats: []
  });

  const fontSizes = [
    { value: 'small', label: 'Small', class: 'text-sm' },
    { value: 'medium', label: 'Medium', class: 'text-base' },
    { value: 'large', label: 'Large', class: 'text-lg' }
  ];

  const allowFromOptions = [
    { value: 'everyone', label: 'Everyone' },
    { value: 'contacts', label: 'My Contacts' },
    { value: 'nobody', label: 'Nobody' }
  ];

  const autoDeleteOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'After 1 day' },
    { value: 7, label: 'After 7 days' },
    { value: 30, label: 'After 30 days' },
    { value: 90, label: 'After 90 days' }
  ];

  useEffect(() => {
    fetchSettings();
    fetchAvailableUsers();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getUserChatSettings();
      if (response.data.success) {
        setSettings(prev => ({ ...prev, ...response.data.data }));
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      showToast('Failed to load chat settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await chatApi.getAllUsers();
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      await chatApi.updateUserChatSettings(settings);
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      console.error('Save settings error:', error);
      showToast(error.response?.data?.error || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const togglePrivacy = (key) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [key]: !prev.privacy[key]
      }
    }));
  };

  const toggleMessageSetting = (key) => {
    setSettings(prev => ({
      ...prev,
      messageSettings: {
        ...prev.messageSettings,
        [key]: !prev.messageSettings[key]
      }
    }));
  };

  const blockUser = async (userId) => {
    try {
      await chatApi.blockUser(userId);
      showToast('User blocked successfully', 'success');
      fetchSettings();
      setShowBlockModal(false);
      setSearchQuery('');
    } catch (error) {
      showToast('Failed to block user', 'error');
    }
  };

  const unblockUser = async (userId) => {
    try {
      await chatApi.unblockUser(userId);
      showToast('User unblocked successfully', 'success');
      fetchSettings();
    } catch (error) {
      showToast('Failed to unblock user', 'error');
    }
  };

  const muteChat = async (chatId, duration) => {
    try {
      await chatApi.muteChat(chatId, duration);
      showToast('Chat muted successfully', 'success');
      fetchSettings();
    } catch (error) {
      showToast('Failed to mute chat', 'error');
    }
  };

  const archiveChat = async (chatId) => {
    try {
      await chatApi.archiveChat(chatId);
      showToast('Chat archived', 'success');
      fetchSettings();
    } catch (error) {
      showToast('Failed to archive chat', 'error');
    }
  };

  const clearChat = async (chatId) => {
    if (window.confirm('Are you sure you want to clear all messages in this chat? This action cannot be undone.')) {
      try {
        await chatApi.clearChat(chatId);
        showToast('Chat cleared successfully', 'success');
        fetchSettings();
      } catch (error) {
        showToast('Failed to clear chat', 'error');
      }
    }
  };

  const deleteAccountData = async () => {
    if (window.confirm('WARNING: This will delete all your chat data. This action cannot be undone. Are you sure?')) {
      try {
        await chatApi.deleteAllChatData();
        showToast('All chat data deleted', 'success');
        fetchSettings();
      } catch (error) {
        showToast('Failed to delete chat data', 'error');
      }
    }
  };

  const setAutoDelete = async () => {
    try {
      await chatApi.setAutoDeleteSettings(expiryDays);
      setSettings(prev => ({
        ...prev,
        messageSettings: {
          ...prev.messageSettings,
          autoDeleteAfter: expiryDays
        }
      }));
      showToast(`Messages will auto-delete after ${expiryDays} days`, 'success');
      setShowExpiryModal(false);
    } catch (error) {
      showToast('Failed to set auto-delete', 'error');
    }
  };

  const exportChatData = async () => {
    try {
      const response = await chatApi.exportChatData();
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat_export_${new Date().toISOString()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Chat data exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export chat data', 'error');
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat Settings</h1>
        <p className="text-gray-500 mt-1">Manage your chat preferences, privacy, and data</p>
      </div>

      {/* Notification Settings */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔔 Notifications</h3>
          <button className="text-sm text-blue-600 hover:text-blue-700">Configure All</button>
        </div>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Email Notifications</span>
              <p className="text-xs text-gray-500">Receive chat notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={() => toggleNotification('email')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Push Notifications</span>
              <p className="text-xs text-gray-500">Receive push notifications on your device</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={() => toggleNotification('push')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Sound Alerts</span>
              <p className="text-xs text-gray-500">Play sound for new messages</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.sound}
              onChange={() => toggleNotification('sound')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Desktop Notifications</span>
              <p className="text-xs text-gray-500">Show desktop notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.desktop}
              onChange={() => toggleNotification('desktop')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Mentions Only</span>
              <p className="text-xs text-gray-500">Only notify when @mentioned</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.mentions}
              onChange={() => toggleNotification('mentions')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </Card>

      {/* Privacy Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔒 Privacy</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Show Online Status</span>
              <p className="text-xs text-gray-500">Let others see when you're online</p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showOnlineStatus}
              onChange={() => togglePrivacy('showOnlineStatus')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Show Last Seen</span>
              <p className="text-xs text-gray-500">Let others see when you were last active</p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showLastSeen}
              onChange={() => togglePrivacy('showLastSeen')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Show Read Receipts</span>
              <p className="text-xs text-gray-500">Let others know when you've read their messages</p>
            </div>
            <input
              type="checkbox"
              checked={settings.privacy.showReadReceipts}
              onChange={() => togglePrivacy('showReadReceipts')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Allow Messages From</label>
            <div className="flex gap-3">
              {allowFromOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, allowMessagesFrom: option.value }
                  }))}
                  className={`flex-1 px-3 py-2 rounded-lg border transition-all ${
                    settings.privacy.allowMessagesFrom === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Message Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💬 Message Settings</h3>
        <div className="space-y-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Delete Messages</label>
            <div className="flex gap-2 flex-wrap">
              {autoDeleteOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setExpiryDays(option.value);
                    if (option.value !== 0) setShowExpiryModal(true);
                    else setAutoDelete();
                  }}
                  className={`px-3 py-2 rounded-lg border transition-all ${
                    settings.messageSettings.autoDeleteAfter === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Save Media to Gallery</span>
              <p className="text-xs text-gray-500">Automatically save received media to your device</p>
            </div>
            <input
              type="checkbox"
              checked={settings.messageSettings.saveMediaToGallery}
              onChange={() => toggleMessageSetting('saveMediaToGallery')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Allow Message Forwarding</span>
              <p className="text-xs text-gray-500">Allow others to forward your messages</p>
            </div>
            <input
              type="checkbox"
              checked={settings.messageSettings.allowForwarding}
              onChange={() => toggleMessageSetting('allowForwarding')}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </Card>

      {/* Appearance Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Appearance</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <div className="flex gap-3">
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'light' }))}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  settings.theme === 'light' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                ☀️ Light
              </button>
              <button
                onClick={() => setSettings(prev => ({ ...prev, theme: 'dark' }))}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  settings.theme === 'dark' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                🌙 Dark
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <div className="flex gap-3">
              {fontSizes.map(size => (
                <button
                  key={size.value}
                  onClick={() => setSettings(prev => ({ ...prev, fontSize: size.value }))}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${size.class} ${
                    settings.fontSize === size.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </div>
          
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
            <div>
              <span className="font-medium">Enter to Send</span>
              <p className="text-xs text-gray-500">Press Enter to send message (Shift+Enter for new line)</p>
            </div>
            <input
              type="checkbox"
              checked={settings.enterToSend}
              onChange={() => setSettings(prev => ({ ...prev, enterToSend: !prev.enterToSend }))}
              className="w-4 h-4 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>
      </Card>

      {/* Blocked Users */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🚫 Blocked Users</h3>
          <button
            onClick={() => setShowBlockModal(true)}
            className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
          >
            + Block User
          </button>
        </div>
        {settings.blockedUsers?.length > 0 ? (
          <div className="space-y-2">
            {settings.blockedUsers.map(blocked => (
              <div key={blocked.userId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{blocked.name}</p>
                  <p className="text-xs text-gray-500">Blocked on {new Date(blocked.blockedAt).toLocaleDateString()}</p>
                </div>
                <button
                  onClick={() => unblockUser(blocked.userId)}
                  className="text-blue-600 text-sm hover:text-blue-700"
                >
                  Unblock
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No blocked users</p>
        )}
      </Card>

      {/* Data Management */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📁 Data Management</h3>
        <div className="space-y-3">
          <button
            onClick={exportChatData}
            className="w-full p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-left"
          >
            📤 Export Chat Data
          </button>
          <button
            onClick={() => window.location.href = '/chat/archived'}
            className="w-full p-3 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors text-left"
          >
            📦 View Archived Chats
          </button>
          <button
            onClick={deleteAccountData}
            className="w-full p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-left"
          >
            🗑️ Delete All Chat Data
          </button>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end gap-3 sticky bottom-4">
        <Button variant="secondary" onClick={fetchSettings}>
          Reset
        </Button>
        <Button onClick={saveSettings} isLoading={saving}>
          Save All Settings
        </Button>
      </div>

      {/* Block User Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)} title="Block User">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search users to block..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No users found</p>
            ) : (
              filteredUsers.map(blockUserItem => (
                <div
                  key={blockUserItem._id}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {blockUserItem.firstName} {blockUserItem.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{blockUserItem.email}</p>
                  </div>
                  <button
                    onClick={() => blockUser(blockUserItem._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-sm"
                  >
                    Block
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>

      {/* Auto-Delete Confirmation Modal */}
      <Modal isOpen={showExpiryModal} onClose={() => setShowExpiryModal(false)} title="Auto-Delete Messages">
        <div className="space-y-4">
          <p className="text-gray-600">
            Messages will be automatically deleted after <strong>{expiryDays} days</strong>.
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setShowExpiryModal(false)}>
              Cancel
            </Button>
            <Button onClick={setAutoDelete}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatSettings;