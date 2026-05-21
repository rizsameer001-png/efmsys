// client/src/pages/profile/Settings.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../../components/common/Button';
//import { useToast } from '../../context/ToastContext';
import { useToast } from '../../hooks/useToast';

const Settings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    push: true,
  });

  const handleSave = () => {
    showToast('Settings saved successfully!', 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500">Manage your account preferences and notifications.</p>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Email Notifications</span>
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                className="rounded border-gray-300 text-blue-600"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">SMS Notifications</span>
              <input
                type="checkbox"
                checked={notifications.sms}
                onChange={(e) => setNotifications({ ...notifications, sms: e.target.checked })}
                className="rounded border-gray-300 text-blue-600"
              />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Push Notifications</span>
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                className="rounded border-gray-300 text-blue-600"
              />
            </label>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-lg font-medium mb-4">Account Information</h3>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-gray-500">Email</dt>
              <dd className="text-gray-900">{user?.email}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Role</dt>
              <dd className="text-gray-900 capitalize">{user?.role}</dd>
            </div>
          </dl>
        </div>

        <div className="px-6 py-4 flex justify-end">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;