// client/src/pages/notifications/NotificationManagement.jsx
import React, { useState, useEffect } from 'react';
import { notificationApi } from '../../api/notification.api';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const NotificationManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [filters, setFilters] = useState({ type: '', status: '', search: '' });
  const [templates, setTemplates] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    type: 'system',
    priority: 'medium',
    targetType: 'roles',
    targetRoles: [],
    targetDepartments: [],
    targetUsers: []
  });

  const isAdmin = ['super_admin', 'admin'].includes(user?.role);
  const canSendToTeam = ['manager', 'supervisor'].includes(user?.role);

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
    fetchRoles();
    fetchDepartments();
    fetchTemplates();
  }, [filters.page, filters.type, filters.status]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getAllNotifications({
        page: filters.page,
        limit: 20,
        type: filters.type,
        status: filters.status
      });
      if (response.data.success) {
        setNotifications(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      showToast('Failed to load notifications', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userApi.getUsers({ limit: 500 });
      if (response.data.success) {
        setUsers(response.data.data?.users || []);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await userApi.getUsersByRole();
      setRoles(['technician', 'supervisor', 'manager', 'hr', 'admin', 'customer']);
    } catch (error) {
      console.error('Fetch roles error:', error);
      setRoles(['technician', 'supervisor', 'manager', 'hr', 'admin', 'customer']);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await userApi.getDepartmentStats();
      setDepartments(['maintenance', 'electrical', 'plumbing', 'hvac', 'security', 'cleaning', 'administration']);
    } catch (error) {
      setDepartments(['maintenance', 'electrical', 'plumbing', 'hvac', 'security', 'cleaning', 'administration']);
    }
  };

  const fetchTemplates = async () => {
    try {
      const response = await notificationApi.getTemplates();
      if (response.data.success) {
        setTemplates(response.data.data);
      }
    } catch (error) {
      console.error('Fetch templates error:', error);
    }
  };

  const handleSendNotification = async () => {
    if (!formData.title || !formData.body) {
      showToast('Please fill in title and body', 'warning');
      return;
    }

    setSending(true);
    try {
      let response;
      const payload = {
        title: formData.title,
        body: formData.body,
        type: formData.type,
        priority: formData.priority,
        data: {}
      };

      if (formData.targetType === 'broadcast' && isAdmin) {
        payload.roles = formData.targetRoles;
        payload.departments = formData.targetDepartments;
        response = await notificationApi.sendBroadcast(payload);
      } else if (formData.targetType === 'team' && canSendToTeam) {
        response = await notificationApi.sendTeamNotification(payload);
      } else if (formData.targetType === 'users') {
        payload.targetUsers = formData.targetUsers;
        response = await notificationApi.sendNotification(payload);
      } else if (formData.targetType === 'roles') {
        payload.targetRoles = formData.targetRoles;
        response = await notificationApi.sendNotification(payload);
      } else if (formData.targetType === 'departments') {
        payload.targetDepartments = formData.targetDepartments;
        response = await notificationApi.sendNotification(payload);
      }

      if (response?.data?.success) {
        showToast('Notification sent successfully!', 'success');
        setShowSendModal(false);
        setFormData({
          title: '',
          body: '',
          type: 'system',
          priority: 'medium',
          targetType: 'roles',
          targetRoles: [],
          targetDepartments: [],
          targetUsers: []
        });
        fetchNotifications();
      }
    } catch (error) {
      console.error('Send notification error:', error);
      showToast(error.response?.data?.error || 'Failed to send notification', 'error');
    } finally {
      setSending(false);
    }
  };

  const handleDeleteNotification = async (id) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        const response = await notificationApi.deleteNotification(id);
        if (response.data.success) {
          showToast('Notification deleted', 'success');
          fetchNotifications();
        }
      } catch (error) {
        showToast('Failed to delete notification', 'error');
      }
    }
  };

  const handleBulkDelete = async () => {
    const selectedIds = notifications.filter(n => n.selected).map(n => n._id);
    if (selectedIds.length === 0) {
      showToast('Please select notifications to delete', 'warning');
      return;
    }
    
    if (window.confirm(`Delete ${selectedIds.length} notifications?`)) {
      try {
        const response = await notificationApi.bulkDeleteNotifications(selectedIds);
        if (response.data.success) {
          showToast(`${response.data.count} notifications deleted`, 'success');
          fetchNotifications();
        }
      } catch (error) {
        showToast('Failed to delete notifications', 'error');
      }
    }
  };

  const applyTemplate = (template) => {
    setFormData(prev => ({
      ...prev,
      title: template.subject,
      body: template.body
    }));
    setShowTemplateModal(false);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notification Management</h1>
          <p className="text-gray-500 mt-1">Send and manage system notifications</p>
        </div>
        <div className="flex gap-2">
          {(isAdmin || canSendToTeam) && (
            <Button onClick={() => setShowSendModal(true)} variant="primary">
              + Send Notification
            </Button>
          )}
          {isAdmin && notifications.some(n => n.selected) && (
            <Button onClick={handleBulkDelete} variant="danger">
              Delete Selected
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{pagination.total}</p>
          <p className="text-sm text-gray-500">Total Sent</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">
            {notifications.filter(n => n.isRead).length}
          </p>
          <p className="text-sm text-gray-500">Read</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">
            {notifications.filter(n => !n.isRead).length}
          </p>
          <p className="text-sm text-gray-500">Unread</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {notifications.length}
          </p>
          <p className="text-sm text-gray-500">This Page</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value, page: 1 }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Types</option>
            <option value="task">Task</option>
            <option value="complaint">Complaint</option>
            <option value="attendance">Attendance</option>
            <option value="leave">Leave</option>
            <option value="salary">Salary</option>
            <option value="system">System</option>
            <option value="announcement">Announcement</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value, page: 1 }))}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
          </select>
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
            className="flex-1 px-3 py-2 border rounded-lg"
          />
          <Button variant="secondary" onClick={() => setFilters({ type: '', status: '', search: '', page: 1 })}>
            Clear
          </Button>
        </div>
      </Card>

      {/* Notifications Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {isAdmin && <th className="px-4 py-3 w-10"><input type="checkbox" className="w-4 h-4" /></th>}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Recipient</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sent At</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {notifications.map(notification => (
                <tr key={notification._id} className="hover:bg-gray-50">
                  {isAdmin && (
                    <td className="px-4 py-3">
                      <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{notification.title}</div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">{notification.body}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {notification.userId?.firstName} {notification.userId?.lastName}
                    <div className="text-xs text-gray-400">{notification.userId?.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 capitalize">
                      {notification.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(notification.priority)} capitalize`}>
                      {notification.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${notification.isRead ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {notification.isRead ? 'Read' : 'Unread'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* Send Notification Modal */}
      <Modal
        isOpen={showSendModal}
        onClose={() => setShowSendModal(false)}
        title="Send Notification"
        size="lg"
      >
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Template Selection */}
          <div className="flex justify-between items-center">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowTemplateModal(true)}
            >
              📋 Use Template
            </Button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Notification title"
            />
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message Body <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notification message..."
            />
          </div>

          {/* Type and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="system">System</option>
                <option value="announcement">Announcement</option>
                <option value="task">Task</option>
                <option value="complaint">Complaint</option>
                <option value="attendance">Attendance</option>
                <option value="leave">Leave</option>
                <option value="salary">Salary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Target Audience */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Send To</label>
            <div className="space-y-2">
              {isAdmin && (
                <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="targetType"
                    value="broadcast"
                    checked={formData.targetType === 'broadcast'}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  />
                  <span>📢 Broadcast (All Users)</span>
                </label>
              )}
              {canSendToTeam && (
                <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                  <input
                    type="radio"
                    name="targetType"
                    value="team"
                    checked={formData.targetType === 'team'}
                    onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                  />
                  <span>👥 My Team</span>
                </label>
              )}
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="targetType"
                  value="roles"
                  checked={formData.targetType === 'roles'}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                />
                <span>🎭 Select Roles</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="targetType"
                  value="departments"
                  checked={formData.targetType === 'departments'}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                />
                <span>🏢 Select Departments</span>
              </label>
              <label className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                <input
                  type="radio"
                  name="targetType"
                  value="users"
                  checked={formData.targetType === 'users'}
                  onChange={(e) => setFormData({ ...formData, targetType: e.target.value })}
                />
                <span>👤 Specific Users</span>
              </label>
            </div>
          </div>

          {/* Role Selection */}
          {formData.targetType === 'roles' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Roles</label>
              <div className="flex flex-wrap gap-2">
                {roles.map(role => (
                  <label key={role} className="flex items-center gap-2 px-3 py-1 border rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.targetRoles.includes(role)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, targetRoles: [...prev.targetRoles, role] }));
                        } else {
                          setFormData(prev => ({ ...prev, targetRoles: prev.targetRoles.filter(r => r !== role) }));
                        }
                      }}
                    />
                    <span className="capitalize">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Department Selection */}
          {formData.targetType === 'departments' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Departments</label>
              <div className="flex flex-wrap gap-2">
                {departments.map(dept => (
                  <label key={dept} className="flex items-center gap-2 px-3 py-1 border rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.targetDepartments.includes(dept)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, targetDepartments: [...prev.targetDepartments, dept] }));
                        } else {
                          setFormData(prev => ({ ...prev, targetDepartments: prev.targetDepartments.filter(d => d !== dept) }));
                        }
                      }}
                    />
                    <span className="capitalize">{dept}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* User Selection */}
          {formData.targetType === 'users' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Users</label>
              <div className="max-h-60 overflow-y-auto border rounded-lg p-2">
                {users.map(user => (
                  <label key={user._id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.targetUsers.includes(user._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, targetUsers: [...prev.targetUsers, user._id] }));
                        } else {
                          setFormData(prev => ({ ...prev, targetUsers: prev.targetUsers.filter(id => id !== user._id) }));
                        }
                      }}
                    />
                    <span>{user.firstName} {user.lastName} ({user.email})</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowSendModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} isLoading={sending}>
              Send Notification
            </Button>
          </div>
        </div>
      </Modal>

      {/* Templates Modal */}
      <Modal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        title="Notification Templates"
        size="md"
      >
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {templates.map(template => (
            <div
              key={template.id}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => applyTemplate(template)}
            >
              <h4 className="font-medium text-gray-900">{template.name}</h4>
              <p className="text-sm text-gray-500">{template.subject}</p>
              <p className="text-xs text-gray-400 mt-1">{template.body}</p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default NotificationManagement;