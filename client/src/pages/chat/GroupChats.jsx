// client/src/pages/chat/GroupChats.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const GroupChats = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    participants: []
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchGroups();
    fetchAvailableUsers();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getUserChats();
      if (response.data.success) {
        const groupChats = response.data.data.filter(chat => chat.chatType === 'group');
        setGroups(groupChats);
      }
    } catch (error) {
      console.error('Fetch groups error:', error);
      showToast('Failed to load groups', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await chatApi.getAvailableUsers();
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!formData.groupName.trim() || formData.participants.length === 0) {
      showToast('Please enter group name and select participants', 'error');
      return;
    }

    setCreating(true);
    try {
      const response = await chatApi.createGroupChat({
        groupName: formData.groupName,
        groupDescription: formData.groupDescription,
        participants: formData.participants
      });
      if (response.data.success) {
        showToast('Group created successfully', 'success');
        setShowCreateModal(false);
        setFormData({ groupName: '', groupDescription: '', participants: [] });
        fetchGroups();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create group', 'error');
    } finally {
      setCreating(false);
    }
  };

  const toggleParticipant = (userId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(userId)
        ? prev.participants.filter(id => id !== userId)
        : [...prev.participants, userId]
    }));
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Group Chats</h1>
          <p className="text-gray-500 mt-1">Create and manage group conversations</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>+ New Group</Button>
      </div>

      {groups.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <p className="text-gray-500">No group chats yet</p>
          <p className="text-sm text-gray-400 mt-1">Create a group to chat with multiple people</p>
          <Button variant="secondary" className="mt-4" onClick={() => setShowCreateModal(true)}>
            Create Your First Group
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map(group => (
            <Card key={group._id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                  👥
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{group.groupName}</h3>
                  <p className="text-xs text-gray-500">{group.participants?.length} members</p>
                </div>
              </div>
              {group.groupDescription && (
                <p className="text-sm text-gray-600 mb-3">{group.groupDescription}</p>
              )}
              <div className="flex justify-between items-center pt-3 border-t">
                <div className="flex -space-x-2">
                  {group.participants?.slice(0, 3).map((p, idx) => (
                    <div key={idx} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
                      {p.userId?.firstName?.[0]}
                    </div>
                  ))}
                  {group.participants?.length > 3 && (
                    <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                      +{group.participants.length - 3}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => window.location.href = `/chat?group=${group._id}`}
                  className="text-blue-600 text-sm"
                >
                  Open Chat →
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Group">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Group Description (optional)"
            value={formData.groupDescription}
            onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Members</label>
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
              {availableUsers.map(user => (
                <label key={user._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={formData.participants.includes(user._id)}
                    onChange={() => toggleParticipant(user._id)}
                    className="w-4 h-4"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup} isLoading={creating}>Create Group</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default GroupChats;