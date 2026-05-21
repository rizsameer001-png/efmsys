// client/src/pages/chat/ChatSettings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const ChatSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: { email: true, push: true, sound: true },
    theme: 'light',
    blockedUsers: []
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getUserChatSettings();
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
      showToast('Failed to load chat settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      // Update settings API call
      showToast('Settings saved successfully', 'success');
    } catch (error) {
      showToast('Failed to save settings', 'error');
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

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat Settings</h1>
        <p className="text-gray-500 mt-1">Manage your chat preferences</p>
      </div>

      {/* Notification Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔔 Notifications</h3>
        <div className="space-y-3">
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <span className="font-medium">Email Notifications</span>
              <p className="text-xs text-gray-500">Receive chat notifications via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.email}
              onChange={() => toggleNotification('email')}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <span className="font-medium">Push Notifications</span>
              <p className="text-xs text-gray-500">Receive push notifications</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.push}
              onChange={() => toggleNotification('push')}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
          <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
            <div>
              <span className="font-medium">Sound Alerts</span>
              <p className="text-xs text-gray-500">Play sound for new messages</p>
            </div>
            <input
              type="checkbox"
              checked={settings.notifications.sound}
              onChange={() => toggleNotification('sound')}
              className="w-4 h-4 rounded border-gray-300"
            />
          </label>
        </div>
      </Card>

      {/* Appearance */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 Appearance</h3>
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
      </Card>

      {/* Blocked Users */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🚫 Blocked Users</h3>
        {settings.blockedUsers?.length > 0 ? (
          <div className="space-y-2">
            {settings.blockedUsers.map(user => (
              <div key={user.userId} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span>{user.name}</span>
                <button className="text-blue-600 text-sm">Unblock</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No blocked users</p>
        )}
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={saveSettings} isLoading={saving}>
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default ChatSettings;