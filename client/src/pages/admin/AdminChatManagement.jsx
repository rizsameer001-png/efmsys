// // client/src/pages/admin/AdminChatManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const AdminChatManagement = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [exportParams, setExportParams] = useState({
//     startDate: '',
//     endDate: '',
//     chatId: '',
//     format: 'csv'
//   });

//   useEffect(() => {
//     fetchUsers();
//     fetchChats();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await userApi.getUsers({ limit: 100 });
//       if (response.data.success) {
//         setUsers(response.data.data?.users || []);
//       }
//     } catch (error) {
//       console.error('Fetch users error:', error);
//     }
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getAllChats();
//       if (response.data.success) {
//         setChats(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch chats error:', error);
//       showToast('Failed to load chats', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleChat = async (userId, currentStatus) => {
//     try {
//       await chatApi.updateUserChatSettings(userId, { chatEnabled: !currentStatus });
//       showToast(`Chat ${!currentStatus ? 'enabled' : 'disabled'} for user`, 'success');
//       fetchUsers();
//     } catch (error) {
//       showToast('Failed to update chat settings', 'error');
//     }
//   };

//   const handleExportLogs = async () => {
//     try {
//       const response = await chatApi.exportChatLogs(exportParams);
//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `chat_logs_${Date.now()}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast('Chat logs exported successfully', 'success');
//     } catch (error) {
//       showToast('Failed to export chat logs', 'error');
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
//         <p className="text-gray-500 mt-1">Manage user chat permissions and monitor conversations</p>
//       </div>

//       {/* User Chat Settings */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">User Chat Permissions</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map(user => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                         <span className="text-sm">{user.firstName?.[0]}{user.lastName?.[0]}</span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${user.chatEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {user.chatEnabled ? 'Enabled' : 'Disabled'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => handleToggleChat(user._id, user.chatEnabled)}
//                       className={`px-3 py-1 rounded text-white ${user.chatEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
//                     >
//                       {user.chatEnabled ? 'Disable' : 'Enable'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>

//       {/* Chat Monitoring */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Chats</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Message</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {chats.map(chat => (
//                 <tr key={chat._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${chat.chatType === 'group' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
//                       {chat.chatType}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {chat.participants?.map(p => p.name).join(', ')}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {chat.lastMessage?.message}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
//                     <button className="text-red-600 hover:text-red-800">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </tr>
//         </div>
//       </Card>

//       {/* Export Chat Logs */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Chat Logs</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <input
//               type="date"
//               value={exportParams.startDate}
//               onChange={(e) => setExportParams({ ...exportParams, startDate: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <input
//               type="date"
//               value={exportParams.endDate}
//               onChange={(e) => setExportParams({ ...exportParams, endDate: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
//             <select
//               value={exportParams.format}
//               onChange={(e) => setExportParams({ ...exportParams, format: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="csv">CSV</option>
//               <option value="json">JSON</option>
//             </select>
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end">
//           <Button onClick={handleExportLogs}>Export Logs</Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AdminChatManagement;



// client/src/pages/admin/AdminChatManagement.jsx
// import React, { useState, useEffect } from 'react';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const AdminChatManagement = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [users, setUsers] = useState([]);
//   const [chats, setChats] = useState([]);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const [showSettingsModal, setShowSettingsModal] = useState(false);
//   const [exportParams, setExportParams] = useState({
//     startDate: '',
//     endDate: '',
//     chatId: '',
//     format: 'csv'
//   });

//   useEffect(() => {
//     fetchUsers();
//     fetchChats();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const response = await userApi.getUsers({ limit: 100 });
//       if (response.data.success) {
//         setUsers(response.data.data?.users || []);
//       }
//     } catch (error) {
//       console.error('Fetch users error:', error);
//     }
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getAllChats();
//       if (response.data.success) {
//         setChats(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch chats error:', error);
//       showToast('Failed to load chats', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleToggleChat = async (userId, currentStatus) => {
//     try {
//       await chatApi.updateUserChatSettings(userId, { chatEnabled: !currentStatus });
//       showToast(`Chat ${!currentStatus ? 'enabled' : 'disabled'} for user`, 'success');
//       fetchUsers();
//     } catch (error) {
//       showToast('Failed to update chat settings', 'error');
//     }
//   };

//   const handleExportLogs = async () => {
//     try {
//       const response = await chatApi.exportChatLogs(exportParams);
//       const blob = new Blob([response.data], { type: 'text/csv' });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `chat_logs_${Date.now()}.csv`;
//       a.click();
//       URL.revokeObjectURL(url);
//       showToast('Chat logs exported successfully', 'success');
//     } catch (error) {
//       showToast('Failed to export chat logs', 'error');
//     }
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
//         <p className="text-gray-500 mt-1">Manage user chat permissions and monitor conversations</p>
//       </div>

//       {/* User Chat Settings */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">User Chat Permissions</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat Status</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {users.map(user => (
//                 <tr key={user._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
//                         <span className="text-sm">{user.firstName?.[0]}{user.lastName?.[0]}</span>
//                       </div>
//                       <div>
//                         <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
//                         <p className="text-xs text-gray-500">{user.email}</p>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${user.chatEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
//                       {user.chatEnabled ? 'Enabled' : 'Disabled'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button
//                       onClick={() => handleToggleChat(user._id, user.chatEnabled)}
//                       className={`px-3 py-1 rounded text-white ${user.chatEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}`}
//                     >
//                       {user.chatEnabled ? 'Disable' : 'Enable'}
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//            </table>
//         </div>
//       </Card>

//       {/* Chat Monitoring */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Chats</h3>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat Type</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Message</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {chats.map(chat => (
//                 <tr key={chat._id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className={`px-2 py-1 text-xs rounded-full ${chat.chatType === 'group' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
//                       {chat.chatType}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {chat.participants?.map(p => p.name).join(', ')}
//                   </td>
//                   <td className="px-6 py-4 text-sm text-gray-500">
//                     {chat.lastMessage?.message}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm">
//                     <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
//                     <button className="text-red-600 hover:text-red-800">Delete</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//            </table>
//         </div>
//       </Card>

//       {/* Export Chat Logs */}
//       <Card className="p-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Chat Logs</h3>
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
//             <input
//               type="date"
//               value={exportParams.startDate}
//               onChange={(e) => setExportParams({ ...exportParams, startDate: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
//             <input
//               type="date"
//               value={exportParams.endDate}
//               onChange={(e) => setExportParams({ ...exportParams, endDate: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
//             <select
//               value={exportParams.format}
//               onChange={(e) => setExportParams({ ...exportParams, format: e.target.value })}
//               className="w-full px-3 py-2 border rounded-lg"
//             >
//               <option value="csv">CSV</option>
//               <option value="json">JSON</option>
//             </select>
//           </div>
//         </div>
//         <div className="mt-4 flex justify-end">
//           <Button onClick={handleExportLogs}>Export Logs</Button>
//         </div>
//       </Card>
//     </div>
//   );
// };

// export default AdminChatManagement;




// client/src/pages/admin/AdminChatManagement.jsx
import React, { useState, useEffect } from 'react';
import { chatApi } from '../../api/chat.api';
import { userApi } from '../../api/user.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';

const AdminChatManagement = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [exportParams, setExportParams] = useState({
    startDate: '',
    endDate: '',
    chatId: '',
    format: 'csv'
  });
  const [togglingUser, setTogglingUser] = useState(null);

  useEffect(() => {
    fetchUsers();
    fetchChats();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userApi.getUsers({ limit: 100 });
      // Handle different response structures
      let usersList = [];
      if (response.data?.success && response.data?.data?.users) {
        usersList = response.data.data.users;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        usersList = response.data.data;
      } else if (Array.isArray(response.data)) {
        usersList = response.data;
      }
      setUsers(usersList);
    } catch (error) {
      console.error('Fetch users error:', error);
      showToast('Failed to load users', 'error');
    }
  };

  const fetchChats = async () => {
    try {
      const response = await chatApi.getAllChats();
      if (response.data?.success) {
        setChats(response.data.data || []);
      }
    } catch (error) {
      console.error('Fetch chats error:', error);
      showToast('Failed to load chats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChat = async (userId, currentStatus) => {
    setTogglingUser(userId);
    try {
      // Use the user API toggle endpoint if available, otherwise chat API
      await userApi.toggleChatEnabled?.(userId, { chatEnabled: !currentStatus }) 
        || await chatApi.updateUserChatSettings(userId, { chatEnabled: !currentStatus });
      
      showToast(`Chat ${!currentStatus ? 'enabled' : 'disabled'} for user`, 'success');
      
      // Update local state
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, chatEnabled: !currentStatus } : u
      ));
    } catch (error) {
      console.error('Toggle chat error:', error);
      showToast(error.response?.data?.error || 'Failed to update chat settings', 'error');
    } finally {
      setTogglingUser(null);
    }
  };

  const handleExportLogs = async () => {
    try {
      const response = await chatApi.exportChatLogs(exportParams);
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `chat_logs_${Date.now()}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Chat logs exported successfully', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showToast('Failed to export chat logs', 'error');
    }
  };

  const getChatParticipants = (chat) => {
    if (!chat.participants) return 'N/A';
    return chat.participants.map(p => p.name || p.userId?.name || 'Unknown').join(', ');
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Chat Management</h1>
        <p className="text-gray-500 mt-1">Manage user chat permissions and monitor conversations</p>
      </div>

      {/* User Chat Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Chat Permissions</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map(userItem => (
                  <tr key={userItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                          <span className="text-sm font-medium">
                            {userItem.firstName?.[0]}{userItem.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {userItem.firstName} {userItem.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{userItem.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {userItem.role || 'customer'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        userItem.chatEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {userItem.chatEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleToggleChat(userItem._id, userItem.chatEnabled)}
                        disabled={togglingUser === userItem._id}
                        className={`px-3 py-1 rounded text-white transition-colors ${
                          userItem.chatEnabled 
                            ? 'bg-red-600 hover:bg-red-700' 
                            : 'bg-green-600 hover:bg-green-700'
                        } ${togglingUser === userItem._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        {togglingUser === userItem._id ? '...' : (userItem.chatEnabled ? 'Disable' : 'Enable')}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Chat Monitoring */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Chats</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chat Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Participants</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Message</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {chats.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    No active chats found
                  </td>
                </tr>
              ) : (
                chats.map(chat => (
                  <tr key={chat._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        chat.chatType === 'group' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {chat.chatType || 'direct'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {getChatParticipants(chat)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-md truncate">
                      {chat.lastMessage?.message || 'No messages'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                      <button className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Export Chat Logs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Chat Logs</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={exportParams.startDate}
              onChange={(e) => setExportParams({ ...exportParams, startDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={exportParams.endDate}
              onChange={(e) => setExportParams({ ...exportParams, endDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chat ID (Optional)</label>
            <input
              type="text"
              value={exportParams.chatId}
              onChange={(e) => setExportParams({ ...exportParams, chatId: e.target.value })}
              placeholder="Filter by chat ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
            <select
              value={exportParams.format}
              onChange={(e) => setExportParams({ ...exportParams, format: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={handleExportLogs}>Export Logs</Button>
        </div>
      </Card>
    </div>
  );
};

export default AdminChatManagement;