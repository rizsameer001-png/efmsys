// // client/src/pages/notifications/NotificationList.jsx
// import React, { useState, useEffect } from 'react';
// import { notificationApi } from '../../api/notification.api';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';

// const NotificationList = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [notifications, setNotifications] = useState([]);
//   const [stats, setStats] = useState({ total: 0, unread: 0 });
//   const [filter, setFilter] = useState('all');
//   const [page, setPage] = useState(1);
//   const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });

//   useEffect(() => {
//     fetchNotifications();
//     fetchStats();
//   }, [filter, page]);

//   const fetchNotifications = async () => {
//     setLoading(true);
//     try {
//       const response = await notificationApi.getNotifications(filter, page);
//       if (response.data.success) {
//         setNotifications(response.data.data.notifications);
//         setPagination(response.data.data.pagination);
//       }
//     } catch (error) {
//       console.error('Fetch notifications error:', error);
//       showToast('Failed to load notifications', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const response = await notificationApi.getNotificationStats();
//       if (response.data.success) {
//         setStats(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch stats error:', error);
//     }
//   };

//   const handleMarkAsRead = async (notificationId) => {
//     try {
//       const response = await notificationApi.markAsRead(notificationId);
//       if (response.data.success) {
//         fetchNotifications();
//         fetchStats();
//       }
//     } catch (error) {
//       showToast('Failed to mark as read', 'error');
//     }
//   };

//   const handleMarkAllAsRead = async () => {
//     try {
//       const response = await notificationApi.markAllAsRead();
//       if (response.data.success) {
//         fetchNotifications();
//         fetchStats();
//         showToast('All notifications marked as read', 'success');
//       }
//     } catch (error) {
//       showToast('Failed to mark all as read', 'error');
//     }
//   };

//   const handleDelete = async (notificationId) => {
//     if (!window.confirm('Delete this notification?')) return;
//     try {
//       const response = await notificationApi.deleteNotification(notificationId);
//       if (response.data.success) {
//         fetchNotifications();
//         fetchStats();
//         showToast('Notification deleted', 'success');
//       }
//     } catch (error) {
//       showToast('Failed to delete notification', 'error');
//     }
//   };

//   const getNotificationIcon = (type, priority) => {
//     const icons = {
//       task: '📋',
//       complaint: '⚠️',
//       attendance: '⏰',
//       leave: '🏖️',
//       salary: '💰',
//       approval: '✅',
//       reminder: '🔔',
//       alert: '🚨',
//       system: '⚙️'
//     };
//     return icons[type] || '📬';
//   };

//   const getPriorityColor = (priority) => {
//     const colors = {
//       low: 'bg-gray-100',
//       medium: 'bg-blue-50',
//       high: 'bg-yellow-50',
//       urgent: 'bg-red-50'
//     };
//     return colors[priority] || 'bg-gray-50';
//   };

//   const getPriorityBorder = (priority) => {
//     const borders = {
//       low: 'border-gray-200',
//       medium: 'border-blue-200',
//       high: 'border-yellow-200',
//       urgent: 'border-red-200'
//     };
//     return borders[priority] || 'border-gray-200';
//   };

//   const formatTimeAgo = (dateString) => {
//     const date = new Date(dateString);
//     const seconds = Math.floor((Date.now() - date) / 1000);
    
//     if (seconds < 60) return `${seconds} seconds ago`;
//     const minutes = Math.floor(seconds / 60);
//     if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
//     const hours = Math.floor(minutes / 60);
//     if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
//     const days = Math.floor(hours / 24);
//     if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
//     const weeks = Math.floor(days / 7);
//     if (weeks < 4) return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
//     const months = Math.floor(days / 30);
//     return `${months} month${months > 1 ? 's' : ''} ago`;
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
//           <p className="text-gray-500 mt-1">Stay updated with latest activities</p>
//         </div>
//         {stats.unread > 0 && (
//           <Button variant="secondary" size="sm" onClick={handleMarkAllAsRead}>
//             Mark all as read
//           </Button>
//         )}
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
//           <p className="text-sm text-gray-500">Total Notifications</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-green-600">{stats.unread}</p>
//           <p className="text-sm text-gray-500">Unread</p>
//         </Card>
//         <Card className="p-4 text-center">
//           <p className="text-2xl font-bold text-purple-600">{stats.total - stats.unread}</p>
//           <p className="text-sm text-gray-500">Read</p>
//         </Card>
//       </div>

//       {/* Filter Tabs */}
//       <div className="flex gap-2 border-b">
//         <button
//           onClick={() => setFilter('all')}
//           className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//         >
//           All
//         </button>
//         <button
//           onClick={() => setFilter('unread')}
//           className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//         >
//           Unread
//         </button>
//         <button
//           onClick={() => setFilter('read')}
//           className={`px-4 py-2 text-sm font-medium transition-colors ${filter === 'read' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
//         >
//           Read
//         </button>
//       </div>

//       {/* Notifications List */}
//       <div className="space-y-3">
//         {notifications.length > 0 ? (
//           notifications.map((notification) => (
//             <div
//               key={notification._id}
//               className={`relative p-4 rounded-lg border ${getPriorityBorder(notification.priority)} ${getPriorityColor(notification.priority)} ${!notification.isRead ? 'bg-blue-50' : ''}`}
//             >
//               <div className="flex gap-4">
//                 <div className="flex-shrink-0">
//                   <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm">
//                     {getNotificationIcon(notification.type, notification.priority)}
//                   </div>
//                 </div>
//                 <div className="flex-1">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <h3 className="font-semibold text-gray-900">{notification.title}</h3>
//                       <p className="text-gray-600 mt-1">{notification.body}</p>
//                       <div className="flex items-center gap-3 mt-2">
//                         <span className="text-xs text-gray-400">
//                           {formatTimeAgo(notification.createdAt)}
//                         </span>
//                         {notification.priority === 'urgent' && (
//                           <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
//                             Urgent
//                           </span>
//                         )}
//                       </div>
//                     </div>
//                     <div className="flex gap-2">
//                       {!notification.isRead && (
//                         <button
//                           onClick={() => handleMarkAsRead(notification._id)}
//                           className="text-green-600 hover:text-green-800 text-sm"
//                           title="Mark as read"
//                         >
//                           ✓
//                         </button>
//                       )}
//                       <button
//                         onClick={() => handleDelete(notification._id)}
//                         className="text-red-600 hover:text-red-800 text-sm"
//                         title="Delete"
//                       >
//                         🗑️
//                       </button>
//                     </div>
//                   </div>
//                   {notification.referenceId && (
//                     <div className="mt-3">
//                       <button
//                         onClick={() => {/* Navigate to reference */}}
//                         className="text-sm text-blue-600 hover:text-blue-800"
//                       >
//                         View Details →
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <div className="text-center py-12 bg-gray-50 rounded-lg">
//             <div className="text-6xl mb-4">📭</div>
//             <p className="text-gray-500">No notifications</p>
//             <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
//           </div>
//         )}
//       </div>

//       {/* Pagination */}
//       {pagination.pages > 1 && (
//         <div className="flex justify-center mt-4">
//           <div className="flex space-x-2">
//             <button
//               onClick={() => setPage(page - 1)}
//               disabled={page === 1}
//               className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
//             >
//               Previous
//             </button>
//             <span className="px-3 py-1 text-sm">Page {page} of {pagination.pages}</span>
//             <button
//               onClick={() => setPage(page + 1)}
//               disabled={page === pagination.pages}
//               className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationList;









// client/src/pages/notifications/NotificationList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { notificationApi } from '../../api/notification.api';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const NotificationList = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]); // 🔴 Initialize as empty array
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    read: 0,
    byType: {}
  });
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    inApp: true,
    quietHours: { enabled: false, start: '22:00', end: '07:00' }
  });

  useEffect(() => {
    fetchNotifications();
    fetchStats();
    fetchPreferences();
  }, [filter, page]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await notificationApi.getNotifications({
        type: filter !== 'all' ? filter : undefined,
        page,
        limit: 20
      });
      
      if (response.data.success) {
        // 🔴 FIX: Safely handle response data - ensure it's an array
        const notificationsData = response.data.data || [];
        setNotifications(Array.isArray(notificationsData) ? notificationsData : []);
        setTotalPages(response.data.pagination?.pages || 1);
      } else {
        setNotifications([]);
      }
    } catch (error) {
      console.error('Fetch notifications error:', error);
      showToast('Failed to load notifications', 'error');
      setNotifications([]); // 🔴 Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await notificationApi.getNotificationStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Fetch stats error:', error);
      // Set default stats
      setStats({ total: 0, unread: 0, read: 0, byType: {} });
    }
  };

  const fetchPreferences = async () => {
    try {
      const response = await notificationApi.getPreferences();
      if (response.data.success) {
        setPreferences(response.data.data);
      }
    } catch (error) {
      console.error('Fetch preferences error:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await notificationApi.markAsRead(id);
      if (response.data.success) {
        // Update local state
        setNotifications(prev => prev.map(notif => 
          notif._id === id ? { ...notif, isRead: true } : notif
        ));
        setStats(prev => ({ ...prev, unread: Math.max(0, prev.unread - 1), read: prev.read + 1 }));
        showToast('Notification marked as read', 'success');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      showToast('Failed to mark as read', 'error');
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await notificationApi.markAllAsRead();
      if (response.data.success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        setStats(prev => ({ ...prev, unread: 0, read: prev.total }));
        showToast('All notifications marked as read', 'success');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      showToast('Failed to mark all as read', 'error');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const response = await notificationApi.deleteNotification(id);
      if (response.data.success) {
        setNotifications(prev => prev.filter(notif => notif._id !== id));
        setStats(prev => ({ ...prev, total: prev.total - 1, unread: prev.unread - (notifications.find(n => n._id === id)?.isRead ? 0 : 1) }));
        showToast('Notification deleted', 'success');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      showToast('Failed to delete notification', 'error');
    }
  };

  const updatePreferences = async () => {
    try {
      const response = await notificationApi.updatePreferences(preferences);
      if (response.data.success) {
        showToast('Preferences updated successfully', 'success');
        setShowSettings(false);
      }
    } catch (error) {
      console.error('Update preferences error:', error);
      showToast('Failed to update preferences', 'error');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      task: '📋',
      complaint: '⚠️',
      attendance: '⏰',
      leave: '🏖️',
      salary: '💰',
      payment: '💳',
      approval: '✓',
      reminder: '🔔',
      alert: '🚨',
      system: '⚙️',
      chat: '💬',
      maintenance: '🔧',
      inspection: '🔍'
    };
    return icons[type] || '📢';
  };

  const getTypeColor = (type) => {
    const colors = {
      task: 'bg-blue-100 text-blue-800',
      complaint: 'bg-red-100 text-red-800',
      attendance: 'bg-green-100 text-green-800',
      leave: 'bg-yellow-100 text-yellow-800',
      salary: 'bg-purple-100 text-purple-800',
      payment: 'bg-green-100 text-green-800',
      approval: 'bg-teal-100 text-teal-800',
      reminder: 'bg-orange-100 text-orange-800',
      alert: 'bg-red-100 text-red-800',
      system: 'bg-gray-100 text-gray-800',
      chat: 'bg-cyan-100 text-cyan-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 mt-1">Stay updated with your latest activities</p>
        </div>
        <div className="flex gap-2">
          {stats.unread > 0 && (
            <Button onClick={markAllAsRead} variant="secondary" size="sm">
              Mark all as read
            </Button>
          )}
          <Button onClick={() => setShowSettings(true)} variant="secondary" size="sm">
            ⚙️ Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-500">Total Notifications</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">{stats.unread}</p>
          <p className="text-sm text-gray-500">Unread</p>
        </Card>
        <Card className="p-4 text-center">
          <p className="text-2xl font-bold text-gray-600">{stats.read}</p>
          <p className="text-sm text-gray-500">Read</p>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'unread' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => setFilter('task')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'task' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Tasks
        </button>
        <button
          onClick={() => setFilter('complaint')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'complaint' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Complaints
        </button>
        <button
          onClick={() => setFilter('attendance')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'attendance' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => setFilter('leave')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'leave' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Leave
        </button>
        <button
          onClick={() => setFilter('chat')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            filter === 'chat' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Chat
        </button>
      </div>

      {/* Notifications List */}
      <Card className="overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔔</div>
            <p className="text-gray-500">No notifications found</p>
            <p className="text-sm text-gray-400 mt-1">When you receive notifications, they will appear here</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {notifications.map(notification => (
              <div
                key={notification._id}
                className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.isRead ? 'bg-blue-50' : ''}`}
                onClick={() => !notification.isRead && markAsRead(notification._id)}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getTypeColor(notification.type)}`}>
                    <span className="text-lg">{getTypeIcon(notification.type)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">{notification.body}</p>
                        {notification.data && Object.keys(notification.data).length > 0 && (
                          <div className="mt-2 text-xs text-gray-400">
                            {notification.data.taskId && <span>Task ID: {notification.data.taskId}</span>}
                            {notification.data.complaintId && <span>Complaint ID: {notification.data.complaintId}</span>}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{formatTimeAgo(notification.createdAt)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification._id);
                          }}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="mt-2">
                        <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            variant="secondary"
            size="sm"
          >
            Previous
          </Button>
          <span className="px-4 py-2 text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          <Button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            variant="secondary"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Notification Settings"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Notification Channels</h4>
            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <span className="font-medium">In-App Notifications</span>
                  <p className="text-xs text-gray-500">Show notifications within the app</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.inApp}
                  onChange={(e) => setPreferences({ ...preferences, inApp: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <span className="font-medium">Email Notifications</span>
                  <p className="text-xs text-gray-500">Receive notifications via email</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.email}
                  onChange={(e) => setPreferences({ ...preferences, email: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between p-2 bg-gray-50 rounded-lg cursor-pointer">
                <div>
                  <span className="font-medium">Push Notifications</span>
                  <p className="text-xs text-gray-500">Receive push notifications on your device</p>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.push}
                  onChange={(e) => setPreferences({ ...preferences, push: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </label>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">Quiet Hours</h4>
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={preferences.quietHours?.enabled}
                onChange={(e) => setPreferences({
                  ...preferences,
                  quietHours: { ...preferences.quietHours, enabled: e.target.checked }
                })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span>Enable Quiet Hours</span>
            </label>
            {preferences.quietHours?.enabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.start}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      quietHours: { ...preferences.quietHours, start: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    value={preferences.quietHours.end}
                    onChange={(e) => setPreferences({
                      ...preferences,
                      quietHours: { ...preferences.quietHours, end: e.target.value }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowSettings(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={updatePreferences}>
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default NotificationList;