// client/src/pages/settings/IntegrationSettings.jsx
import React, { useState, useEffect } from 'react';
import { settingsApi } from '../../api/settings.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';

const IntegrationSettings = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState({ name: '', permissions: [], expiresIn: '30' });
  const [integrations, setIntegrations] = useState({
    slack: { enabled: false, webhookUrl: '', channel: '#notifications' },
    teams: { enabled: false, webhookUrl: '' },
    whatsapp: { enabled: false, apiKey: '', phoneNumberId: '' },
    googleCalendar: { enabled: false, apiKey: '', calendarId: '' },
    zapier: { enabled: false, webhookUrl: '' },
    webhooks: {
      taskCreated: '',
      taskCompleted: '',
      complaintRaised: '',
      leaveApplied: ''
    },
    apiKeys: []
  });

  useEffect(() => {
    fetchIntegrationSettings();
  }, []);

  const fetchIntegrationSettings = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getIntegrationSettings();
      if (response.data.success) {
        setIntegrations(response.data.data);
      }
    } catch (error) {
      console.error('Fetch integration settings error:', error);
      showToast('Failed to load integration settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (integration) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        enabled: !prev[integration].enabled
      }
    }));
  };

  const handleIntegrationChange = (integration, field, value) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [field]: value
      }
    }));
  };

  const handleWebhookChange = (event, value) => {
    setIntegrations(prev => ({
      ...prev,
      webhooks: {
        ...prev.webhooks,
        [event]: value
      }
    }));
  };

  const handleGenerateApiKey = async () => {
    try {
      const response = await settingsApi.generateApiKey(newApiKey);
      if (response.data.success) {
        showToast('API Key generated successfully', 'success');
        setShowApiModal(false);
        setNewApiKey({ name: '', permissions: [], expiresIn: '30' });
        fetchIntegrationSettings();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to generate API key', 'error');
    }
  };

  const handleRevokeApiKey = async (keyId) => {
    if (window.confirm('Are you sure you want to revoke this API key?')) {
      try {
        const response = await settingsApi.revokeApiKey(keyId);
        if (response.data.success) {
          showToast('API key revoked successfully', 'success');
          fetchIntegrationSettings();
        }
      } catch (error) {
        showToast('Failed to revoke API key', 'error');
      }
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await settingsApi.updateIntegrationSettings(integrations);
      if (response.data.success) {
        showToast('Integration settings saved successfully', 'success');
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to save settings', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integration Settings</h1>
          <p className="text-gray-500 mt-1">Connect third-party services and manage API keys</p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          Save Settings
        </Button>
      </div>

      {/* Slack Integration */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              💬
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Slack Integration</h3>
              <p className="text-sm text-gray-500">Send notifications to Slack channels</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrations.slack.enabled}
              onChange={() => handleToggle('slack')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        
        {integrations.slack.enabled && (
          <div className="mt-4 space-y-4 pl-16">
            <Input
              label="Webhook URL"
              value={integrations.slack.webhookUrl}
              onChange={(e) => handleIntegrationChange('slack', 'webhookUrl', e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
            />
            <Input
              label="Default Channel"
              value={integrations.slack.channel}
              onChange={(e) => handleIntegrationChange('slack', 'channel', e.target.value)}
              placeholder="#notifications"
            />
          </div>
        )}
      </Card>

      {/* Microsoft Teams Integration */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              💼
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Microsoft Teams</h3>
              <p className="text-sm text-gray-500">Send notifications to Teams channels</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrations.teams.enabled}
              onChange={() => handleToggle('teams')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
        
        {integrations.teams.enabled && (
          <div className="mt-4 space-y-4 pl-16">
            <Input
              label="Webhook URL"
              value={integrations.teams.webhookUrl}
              onChange={(e) => handleIntegrationChange('teams', 'webhookUrl', e.target.value)}
              placeholder="https://your-domain.webhook.office.com/..."
            />
          </div>
        )}
      </Card>

      {/* WhatsApp Business Integration */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">
              📱
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">WhatsApp Business</h3>
              <p className="text-sm text-gray-500">Send notifications via WhatsApp</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrations.whatsapp.enabled}
              onChange={() => handleToggle('whatsapp')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>
        
        {integrations.whatsapp.enabled && (
          <div className="mt-4 space-y-4 pl-16">
            <Input
              label="API Key"
              type="password"
              value={integrations.whatsapp.apiKey}
              onChange={(e) => handleIntegrationChange('whatsapp', 'apiKey', e.target.value)}
              placeholder="Enter WhatsApp Business API key"
            />
            <Input
              label="Phone Number ID"
              value={integrations.whatsapp.phoneNumberId}
              onChange={(e) => handleIntegrationChange('whatsapp', 'phoneNumberId', e.target.value)}
              placeholder="Phone number ID from Meta"
            />
          </div>
        )}
      </Card>

      {/* Google Calendar Integration */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-2xl">
              📅
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Google Calendar</h3>
              <p className="text-sm text-gray-500">Sync tasks and events to Google Calendar</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrations.googleCalendar.enabled}
              onChange={() => handleToggle('googleCalendar')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
          </label>
        </div>
        
        {integrations.googleCalendar.enabled && (
          <div className="mt-4 space-y-4 pl-16">
            <Input
              label="API Key"
              type="password"
              value={integrations.googleCalendar.apiKey}
              onChange={(e) => handleIntegrationChange('googleCalendar', 'apiKey', e.target.value)}
              placeholder="Google Calendar API key"
            />
            <Input
              label="Calendar ID"
              value={integrations.googleCalendar.calendarId}
              onChange={(e) => handleIntegrationChange('googleCalendar', 'calendarId', e.target.value)}
              placeholder="primary or calendar@domain.com"
            />
          </div>
        )}
      </Card>

      {/* Zapier Integration */}
      <Card className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Zapier Integration</h3>
              <p className="text-sm text-gray-500">Connect with 5000+ apps via Zapier</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={integrations.zapier.enabled}
              onChange={() => handleToggle('zapier')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
        
        {integrations.zapier.enabled && (
          <div className="mt-4 pl-16">
            <Input
              label="Webhook URL"
              value={integrations.zapier.webhookUrl}
              onChange={(e) => handleIntegrationChange('zapier', 'webhookUrl', e.target.value)}
              placeholder="https://hooks.zapier.com/..."
            />
            <p className="text-sm text-gray-500 mt-2">
              Create a Zap in Zapier and copy your webhook URL here.
            </p>
          </div>
        )}
      </Card>

      {/* Webhooks */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Custom Webhooks</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Created</label>
            <Input
              value={integrations.webhooks.taskCreated}
              onChange={(e) => handleWebhookChange('taskCreated', e.target.value)}
              placeholder="https://your-server.com/webhook/task-created"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Completed</label>
            <Input
              value={integrations.webhooks.taskCompleted}
              onChange={(e) => handleWebhookChange('taskCompleted', e.target.value)}
              placeholder="https://your-server.com/webhook/task-completed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complaint Raised</label>
            <Input
              value={integrations.webhooks.complaintRaised}
              onChange={(e) => handleWebhookChange('complaintRaised', e.target.value)}
              placeholder="https://your-server.com/webhook/complaint-raised"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Leave Applied</label>
            <Input
              value={integrations.webhooks.leaveApplied}
              onChange={(e) => handleWebhookChange('leaveApplied', e.target.value)}
              placeholder="https://your-server.com/webhook/leave-applied"
            />
          </div>
        </div>
      </Card>

      {/* API Keys Management */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">🔑 API Keys</h3>
          <Button size="sm" onClick={() => setShowApiModal(true)}>+ Generate API Key</Button>
        </div>
        
        {integrations.apiKeys?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expires</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {integrations.apiKeys.map((key) => (
                  <tr key={key.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{key.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                      {key.key.substring(0, 8)}...{key.key.substring(key.key.length - 4)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(key.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleRevokeApiKey(key.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Revoke
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No API keys generated yet
          </div>
        )}
      </Card>

      {/* Generate API Key Modal */}
      <Modal isOpen={showApiModal} onClose={() => setShowApiModal(false)} title="Generate API Key">
        <div className="space-y-4">
          <Input
            label="Key Name"
            value={newApiKey.name}
            onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
            placeholder="e.g., Mobile App, Third-party Integration"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newApiKey.permissions.includes('read')}
                  onChange={(e) => {
                    const perms = e.target.checked 
                      ? [...newApiKey.permissions, 'read']
                      : newApiKey.permissions.filter(p => p !== 'read');
                    setNewApiKey({ ...newApiKey, permissions: perms });
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Read Access</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newApiKey.permissions.includes('write')}
                  onChange={(e) => {
                    const perms = e.target.checked 
                      ? [...newApiKey.permissions, 'write']
                      : newApiKey.permissions.filter(p => p !== 'write');
                    setNewApiKey({ ...newApiKey, permissions: perms });
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Write Access</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={newApiKey.permissions.includes('admin')}
                  onChange={(e) => {
                    const perms = e.target.checked 
                      ? [...newApiKey.permissions, 'admin']
                      : newApiKey.permissions.filter(p => p !== 'admin');
                    setNewApiKey({ ...newApiKey, permissions: perms });
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm">Admin Access</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expires In (Days)</label>
            <select
              value={newApiKey.expiresIn}
              onChange={(e) => setNewApiKey({ ...newApiKey, expiresIn: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            >
              <option value="30">30 days</option>
              <option value="60">60 days</option>
              <option value="90">90 days</option>
              <option value="180">180 days</option>
              <option value="365">365 days</option>
              <option value="never">Never expire</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowApiModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateApiKey}>
              Generate Key
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default IntegrationSettings;