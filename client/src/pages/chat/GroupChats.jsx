// // client/src/pages/chat/GroupChats.jsx
// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const GroupChats = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [groups, setGroups] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [formData, setFormData] = useState({
//     groupName: '',
//     groupDescription: '',
//     participants: []
//   });
//   const [creating, setCreating] = useState(false);

//   useEffect(() => {
//     fetchGroups();
//     fetchAvailableUsers();
//   }, []);

//   const fetchGroups = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
//       if (response.data.success) {
//         const groupChats = response.data.data.filter(chat => chat.chatType === 'group');
//         setGroups(groupChats);
//       }
//     } catch (error) {
//       console.error('Fetch groups error:', error);
//       showToast('Failed to load groups', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await chatApi.getAvailableUsers();
//       if (response.data.success) {
//         setAvailableUsers(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch users error:', error);
//     }
//   };

//   const handleCreateGroup = async () => {
//     if (!formData.groupName.trim() || formData.participants.length === 0) {
//       showToast('Please enter group name and select participants', 'error');
//       return;
//     }

//     setCreating(true);
//     try {
//       const response = await chatApi.createGroupChat({
//         groupName: formData.groupName,
//         groupDescription: formData.groupDescription,
//         participants: formData.participants
//       });
//       if (response.data.success) {
//         showToast('Group created successfully', 'success');
//         setShowCreateModal(false);
//         setFormData({ groupName: '', groupDescription: '', participants: [] });
//         fetchGroups();
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to create group', 'error');
//     } finally {
//       setCreating(false);
//     }
//   };

//   const toggleParticipant = (userId) => {
//     setFormData(prev => ({
//       ...prev,
//       participants: prev.participants.includes(userId)
//         ? prev.participants.filter(id => id !== userId)
//         : [...prev.participants, userId]
//     }));
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Group Chats</h1>
//           <p className="text-gray-500 mt-1">Create and manage group conversations</p>
//         </div>
//         <Button onClick={() => setShowCreateModal(true)}>+ New Group</Button>
//       </div>

//       {groups.length === 0 ? (
//         <Card className="p-12 text-center">
//           <div className="text-5xl mb-4">👥</div>
//           <p className="text-gray-500">No group chats yet</p>
//           <p className="text-sm text-gray-400 mt-1">Create a group to chat with multiple people</p>
//           <Button variant="secondary" className="mt-4" onClick={() => setShowCreateModal(true)}>
//             Create Your First Group
//           </Button>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {groups.map(group => (
//             <Card key={group._id} className="p-4 hover:shadow-md transition-shadow">
//               <div className="flex items-center gap-3 mb-3">
//                 <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
//                   👥
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{group.groupName}</h3>
//                   <p className="text-xs text-gray-500">{group.participants?.length} members</p>
//                 </div>
//               </div>
//               {group.groupDescription && (
//                 <p className="text-sm text-gray-600 mb-3">{group.groupDescription}</p>
//               )}
//               <div className="flex justify-between items-center pt-3 border-t">
//                 <div className="flex -space-x-2">
//                   {group.participants?.slice(0, 3).map((p, idx) => (
//                     <div key={idx} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs">
//                       {p.userId?.firstName?.[0]}
//                     </div>
//                   ))}
//                   {group.participants?.length > 3 && (
//                     <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
//                       +{group.participants.length - 3}
//                     </div>
//                   )}
//                 </div>
//                 <button
//                   onClick={() => window.location.href = `/chat?group=${group._id}`}
//                   className="text-blue-600 text-sm"
//                 >
//                   Open Chat →
//                 </button>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* Create Group Modal */}
//       <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Group">
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Group Name"
//             value={formData.groupName}
//             onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
//             className="w-full px-3 py-2 border rounded-lg"
//           />
//           <textarea
//             placeholder="Group Description (optional)"
//             value={formData.groupDescription}
//             onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
//             rows={2}
//             className="w-full px-3 py-2 border rounded-lg"
//           />
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Add Members</label>
//             <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
//               {availableUsers.map(user => (
//                 <label key={user._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg">
//                   <input
//                     type="checkbox"
//                     checked={formData.participants.includes(user._id)}
//                     onChange={() => toggleParticipant(user._id)}
//                     className="w-4 h-4"
//                   />
//                   <div>
//                     <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
//                     <p className="text-sm text-gray-500 capitalize">{user.role}</p>
//                   </div>
//                 </label>
//               ))}
//             </div>
//           </div>
//           <div className="flex justify-end gap-3 pt-4">
//             <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
//             <Button onClick={handleCreateGroup} isLoading={creating}>Create Group</Button>
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default GroupChats;








import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import { userApi } from '../../api/user.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const GroupChats = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMembersModal, setShowAddMembersModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  // Group Settings
  const [groupSettings, setGroupSettings] = useState({
    autoDeleteAfter: 0,
    onlyAdminCanMessage: false,
    allowMedia: true,
    allowLinks: true,
    allowMentions: true,
    requireApproval: false
  });
  
  const [formData, setFormData] = useState({
    groupName: '',
    groupDescription: '',
    groupIcon: '',
    participants: []
  });

  const autoDeleteOptions = [
    { value: 0, label: 'Never' },
    { value: 1, label: 'After 1 day' },
    { value: 7, label: 'After 7 days' },
    { value: 30, label: 'After 30 days' },
    { value: 90, label: 'After 90 days' }
  ];

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
      const response = await chatApi.getAllUsers();
      if (response.data.success) {
        setAvailableUsers(response.data.data);
      }
    } catch (error) {
      console.error('Fetch users error:', error);
    }
  };

  const fetchGroupDetails = async (groupId) => {
    try {
      const response = await chatApi.getChatDetails(groupId);
      if (response.data.success) {
        setSelectedGroup(response.data.data);
        setGroupSettings({
          autoDeleteAfter: response.data.data.autoDeleteAfter || 0,
          onlyAdminCanMessage: response.data.data.onlyAdminCanMessage || false,
          allowMedia: response.data.data.allowMedia !== false,
          allowLinks: response.data.data.allowLinks !== false,
          allowMentions: response.data.data.allowMentions !== false,
          requireApproval: response.data.data.requireApproval || false
        });
      }
    } catch (error) {
      console.error('Fetch group details error:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!formData.groupName.trim()) {
      showToast('Please enter group name', 'error');
      return;
    }
    if (formData.participants.length === 0) {
      showToast('Please select at least one participant', 'error');
      return;
    }

    setCreating(true);
    try {
      const response = await chatApi.createGroupChat({
        groupName: formData.groupName,
        groupDescription: formData.groupDescription,
        groupIcon: formData.groupIcon,
        participants: formData.participants,
        settings: groupSettings
      });
      if (response.data.success) {
        showToast('Group created successfully', 'success');
        setShowCreateModal(false);
        setFormData({ groupName: '', groupDescription: '', groupIcon: '', participants: [] });
        fetchGroups();
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create group', 'error');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdateGroup = async () => {
    if (!selectedGroup) return;
    setUpdating(true);
    try {
      const response = await chatApi.updateGroupChat(selectedGroup._id, {
        groupName: formData.groupName,
        groupDescription: formData.groupDescription,
        groupIcon: formData.groupIcon
      });
      if (response.data.success) {
        showToast('Group updated successfully', 'success');
        setShowEditModal(false);
        fetchGroups();
        fetchGroupDetails(selectedGroup._id);
      }
    } catch (error) {
      showToast('Failed to update group', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateSettings = async () => {
    if (!selectedGroup) return;
    setUpdating(true);
    try {
      const response = await chatApi.updateGroupSettings(selectedGroup._id, groupSettings);
      if (response.data.success) {
        showToast('Group settings updated successfully', 'success');
        setShowSettingsModal(false);
        fetchGroupDetails(selectedGroup._id);
      }
    } catch (error) {
      showToast('Failed to update settings', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleAddMembers = async () => {
    if (!selectedGroup || formData.participants.length === 0) return;
    setUpdating(true);
    try {
      const response = await chatApi.addGroupParticipants(selectedGroup._id, formData.participants);
      if (response.data.success) {
        showToast('Members added successfully', 'success');
        setShowAddMembersModal(false);
        setFormData(prev => ({ ...prev, participants: [] }));
        fetchGroups();
        fetchGroupDetails(selectedGroup._id);
      }
    } catch (error) {
      showToast('Failed to add members', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemoveMember = async (groupId, memberId, memberName) => {
    if (!window.confirm(`Remove ${memberName} from this group?`)) return;
    try {
      const response = await chatApi.removeGroupParticipant(groupId, memberId);
      if (response.data.success) {
        showToast('Member removed successfully', 'success');
        fetchGroups();
        fetchGroupDetails(groupId);
      }
    } catch (error) {
      showToast('Failed to remove member', 'error');
    }
  };

  const handleLeaveGroup = async (groupId, groupName) => {
    if (!window.confirm(`Are you sure you want to leave "${groupName}"?`)) return;
    try {
      const response = await chatApi.leaveGroup(groupId);
      if (response.data.success) {
        showToast('You left the group', 'success');
        fetchGroups();
        setShowGroupDetailsModal(false);
      }
    } catch (error) {
      showToast('Failed to leave group', 'error');
    }
  };

  const handleDeleteGroup = async (groupId, groupName) => {
    if (!window.confirm(`Delete "${groupName}"? This action cannot be undone.`)) return;
    try {
      const response = await chatApi.deleteGroup(groupId);
      if (response.data.success) {
        showToast('Group deleted successfully', 'success');
        fetchGroups();
        setShowGroupDetailsModal(false);
      }
    } catch (error) {
      showToast('Failed to delete group', 'error');
    }
  };

  const handleClearChat = async (groupId) => {
    if (!window.confirm('Clear all messages in this group? This action cannot be undone.')) return;
    try {
      const response = await chatApi.clearGroupChat(groupId);
      if (response.data.success) {
        showToast('Chat cleared successfully', 'success');
      }
    } catch (error) {
      showToast('Failed to clear chat', 'error');
    }
  };

  const handleExportChat = async (groupId) => {
    try {
      const response = await chatApi.exportGroupChat(groupId);
      const blob = new Blob([response.data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `group_chat_export_${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Chat exported successfully', 'success');
    } catch (error) {
      showToast('Failed to export chat', 'error');
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

  const openGroupDetails = async (group) => {
    await fetchGroupDetails(group._id);
    setFormData({
      groupName: group.groupName,
      groupDescription: group.groupDescription || '',
      groupIcon: group.groupIcon || '',
      participants: []
    });
    setShowGroupDetailsModal(true);
  };

  const filteredUsers = availableUsers.filter(u => 
    `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isAdmin = (group) => {
    return group.createdBy?._id === user?._id || group.createdBy === user?._id || user?.role === 'super_admin';
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
          {groups.map(group => {
            const isGroupAdmin = isAdmin(group);
            return (
              <Card key={group._id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xl">
                    {group.groupIcon || '👥'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{group.groupName}</h3>
                    <p className="text-xs text-gray-500">{group.participants?.length} members</p>
                  </div>
                  {isGroupAdmin && (
                    <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Admin
                    </div>
                  )}
                </div>
                {group.groupDescription && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{group.groupDescription}</p>
                )}
                <div className="flex justify-between items-center pt-3 border-t">
                  <div className="flex -space-x-2">
                    {group.participants?.slice(0, 3).map((p, idx) => (
                      <div key={idx} className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                        {p.userId?.firstName?.[0]}{p.userId?.lastName?.[0]}
                      </div>
                    ))}
                    {group.participants?.length > 3 && (
                      <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-xs text-white">
                        +{group.participants.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openGroupDetails(group)}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => window.location.href = `/chat?group=${group._id}`}
                      className="text-green-600 text-sm hover:text-green-700"
                    >
                      Open Chat →
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Group">
        <div className="space-y-4 max-h-[80vh] overflow-y-auto">
          <input
            type="text"
            placeholder="Group Name *"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Group Description (optional)"
            value={formData.groupDescription}
            onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Group Icon (emoji) - optional"
            value={formData.groupIcon}
            onChange={(e) => setFormData({ ...formData, groupIcon: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={2}
          />
          
          {/* Group Settings */}
          <div className="border rounded-lg p-3">
            <h4 className="font-medium text-gray-900 mb-2">Group Settings</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Delete Messages</label>
                <select
                  value={groupSettings.autoDeleteAfter}
                  onChange={(e) => setGroupSettings({ ...groupSettings, autoDeleteAfter: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  {autoDeleteOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Only admins can send messages</span>
                <input
                  type="checkbox"
                  checked={groupSettings.onlyAdminCanMessage}
                  onChange={(e) => setGroupSettings({ ...groupSettings, onlyAdminCanMessage: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Allow media sharing</span>
                <input
                  type="checkbox"
                  checked={groupSettings.allowMedia}
                  onChange={(e) => setGroupSettings({ ...groupSettings, allowMedia: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Require admin approval to join</span>
                <input
                  type="checkbox"
                  checked={groupSettings.requireApproval}
                  onChange={(e) => setGroupSettings({ ...groupSettings, requireApproval: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Members *</label>
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No users found</p>
              ) : (
                filteredUsers.map(userItem => (
                  <label key={userItem._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg">
                    <input
                      type="checkbox"
                      checked={formData.participants.includes(userItem._id)}
                      onChange={() => toggleParticipant(userItem._id)}
                      className="w-4 h-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{userItem.firstName} {userItem.lastName}</p>
                      <p className="text-sm text-gray-500 capitalize">{userItem.role}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup} isLoading={creating}>Create Group</Button>
          </div>
        </div>
      </Modal>

      {/* Group Details Modal */}
      {selectedGroup && (
        <Modal isOpen={showGroupDetailsModal} onClose={() => setShowGroupDetailsModal(false)} title="Group Details">
          <div className="space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-3xl mx-auto">
                {selectedGroup.groupIcon || '👥'}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mt-2">{selectedGroup.groupName}</h2>
              <p className="text-gray-500">{selectedGroup.groupDescription}</p>
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-900">Members ({selectedGroup.participants?.length})</h3>
                {isAdmin(selectedGroup) && (
                  <button
                    onClick={() => {
                      setShowAddMembersModal(true);
                      setFormData(prev => ({ ...prev, participants: [] }));
                    }}
                    className="text-blue-600 text-sm"
                  >
                    + Add Members
                  </button>
                )}
              </div>
              <div className="space-y-2">
                {selectedGroup.participants?.map(member => {
                  const isMemberAdmin = member.userId?._id === selectedGroup.createdBy?._id;
                  return (
                    <div key={member.userId?._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">
                            {member.userId?.firstName} {member.userId?.lastName}
                          </p>
                          {isMemberAdmin && (
                            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Admin</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.userId?.email}</p>
                      </div>
                      {isAdmin(selectedGroup) && member.userId?._id !== user?._id && !isMemberAdmin && (
                        <button
                          onClick={() => handleRemoveMember(selectedGroup._id, member.userId?._id, `${member.userId?.firstName} ${member.userId?.lastName}`)}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-2">Group Actions</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setShowGroupDetailsModal(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  ✏️ Edit Group Info
                </button>
                <button
                  onClick={() => {
                    setShowSettingsModal(true);
                    setShowGroupDetailsModal(false);
                  }}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  ⚙️ Group Settings
                </button>
                <button
                  onClick={() => handleClearChat(selectedGroup._id)}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-yellow-600"
                >
                  🗑️ Clear Chat History
                </button>
                <button
                  onClick={() => handleExportChat(selectedGroup._id)}
                  className="w-full text-left px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  📤 Export Chat
                </button>
                <button
                  onClick={() => handleLeaveGroup(selectedGroup._id, selectedGroup.groupName)}
                  className="w-full text-left px-3 py-2 bg-red-50 rounded-lg hover:bg-red-100 text-red-600"
                >
                  🚪 Leave Group
                </button>
                {isAdmin(selectedGroup) && (
                  <button
                    onClick={() => handleDeleteGroup(selectedGroup._id, selectedGroup.groupName)}
                    className="w-full text-left px-3 py-2 bg-red-50 rounded-lg hover:bg-red-100 text-red-600"
                  >
                    🗑️ Delete Group
                  </button>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Group Modal */}
      {selectedGroup && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Group">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Group Name"
              value={formData.groupName}
              onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              placeholder="Group Description"
              value={formData.groupDescription}
              onChange={(e) => setFormData({ ...formData, groupDescription: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Group Icon (emoji)"
              value={formData.groupIcon}
              onChange={(e) => setFormData({ ...formData, groupIcon: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={2}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
              <Button onClick={handleUpdateGroup} isLoading={updating}>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Group Settings Modal */}
      {selectedGroup && (
        <Modal isOpen={showSettingsModal} onClose={() => setShowSettingsModal(false)} title="Group Settings">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Delete Messages</label>
              <select
                value={groupSettings.autoDeleteAfter}
                onChange={(e) => setGroupSettings({ ...groupSettings, autoDeleteAfter: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {autoDeleteOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="font-medium text-gray-700">Only admins can send messages</span>
                <p className="text-xs text-gray-500">Restrict messaging to group admins only</p>
              </div>
              <input
                type="checkbox"
                checked={groupSettings.onlyAdminCanMessage}
                onChange={(e) => setGroupSettings({ ...groupSettings, onlyAdminCanMessage: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="font-medium text-gray-700">Allow media sharing</span>
                <p className="text-xs text-gray-500">Members can share images, videos, and files</p>
              </div>
              <input
                type="checkbox"
                checked={groupSettings.allowMedia}
                onChange={(e) => setGroupSettings({ ...groupSettings, allowMedia: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="font-medium text-gray-700">Allow links</span>
                <p className="text-xs text-gray-500">Members can share external links</p>
              </div>
              <input
                type="checkbox"
                checked={groupSettings.allowLinks}
                onChange={(e) => setGroupSettings({ ...groupSettings, allowLinks: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
            </label>
            
            <label className="flex items-center justify-between py-2">
              <div>
                <span className="font-medium text-gray-700">Require admin approval to join</span>
                <p className="text-xs text-gray-500">New members need admin approval</p>
              </div>
              <input
                type="checkbox"
                checked={groupSettings.requireApproval}
                onChange={(e) => setGroupSettings({ ...groupSettings, requireApproval: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300"
              />
            </label>
            
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowSettingsModal(false)}>Cancel</Button>
              <Button onClick={handleUpdateSettings} isLoading={updating}>Save Settings</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Members Modal */}
      {selectedGroup && (
        <Modal isOpen={showAddMembersModal} onClose={() => setShowAddMembersModal(false)} title="Add Members">
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="space-y-2 max-h-60 overflow-y-auto border rounded-lg p-2">
              {filteredUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No users found</p>
              ) : (
                filteredUsers
                  .filter(u => !selectedGroup.participants?.some(p => p.userId?._id === u._id))
                  .map(userItem => (
                    <label key={userItem._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={formData.participants.includes(userItem._id)}
                        onChange={() => toggleParticipant(userItem._id)}
                        className="w-4 h-4"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{userItem.firstName} {userItem.lastName}</p>
                        <p className="text-sm text-gray-500 capitalize">{userItem.role}</p>
                      </div>
                    </label>
                  ))
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowAddMembersModal(false)}>Cancel</Button>
              <Button onClick={handleAddMembers} isLoading={updating}>Add Members</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default GroupChats;