// // client/src/pages/chat/ChatModule.jsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';

// const ChatModule = () => {
//   const { user } = useAuth();
//   const { showToast } = useToast();
//   const [loading, setLoading] = useState(true);
//   const [chats, setChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [messageInput, setMessageInput] = useState('');
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [showNewChatModal, setShowNewChatModal] = useState(false);
//   const [sending, setSending] = useState(false);
//   const messagesEndRef = useRef(null);

//   useEffect(() => {
//     fetchChats();
//     fetchAvailableUsers();
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
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

//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await chatApi.getAvailableUsers();
//       if (response.data.success) {
//         setAvailableUsers(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch available users error:', error);
//     }
//   };

//   const fetchMessages = async (chatId) => {
//     try {
//       const response = await chatApi.getChatMessages(chatId);
//       if (response.data.success) {
//         setMessages(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch messages error:', error);
//       showToast('Failed to load messages', 'error');
//     }
//   };

//   const selectChat = async (chat) => {
//     setCurrentChat(chat);
//     await fetchMessages(chat._id);
//   };

//   const startNewChat = async (targetUserId) => {
//     try {
//       const response = await chatApi.getOrCreateDirectChat(targetUserId);
//       if (response.data.success) {
//         const newChat = response.data.data;
//         setChats(prev => [newChat, ...prev]);
//         selectChat(newChat);
//         setShowNewChatModal(false);
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to start chat', 'error');
//     }
//   };

//   const sendMessage = async () => {
//     if (!messageInput.trim() || !currentChat) return;
    
//     setSending(true);
//     try {
//       const response = await chatApi.sendMessage(currentChat._id, { message: messageInput.trim() });
//       if (response.data.success) {
//         setMessages(prev => [...prev, response.data.data]);
//         setMessageInput('');
        
//         // Update chat list with last message
//         setChats(prev => prev.map(chat => 
//           chat._id === currentChat._id ? {
//             ...chat,
//             lastMessage: { message: messageInput.trim(), timestamp: new Date() }
//           } : chat
//         ));
//       }
//     } catch (error) {
//       showToast('Failed to send message', 'error');
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       sendMessage();
//     }
//   };

//   const formatTime = (dateString) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const isToday = date.toDateString() === now.toDateString();
    
//     if (isToday) {
//       return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     }
//     return date.toLocaleDateString();
//   };

//   const getChatName = (chat) => {
//     if (chat.chatType === 'group') {
//       return chat.groupName;
//     }
//     const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
//     return otherParticipant?.userId?.firstName + ' ' + otherParticipant?.userId?.lastName || 'Unknown';
//   };

//   const getChatAvatar = (chat) => {
//     if (chat.chatType === 'group') {
//       return '👥';
//     }
//     return '👤';
//   };

//   if (loading) return <Spinner />;

//   return (
//     <div className="flex h-[calc(100vh-120px)] gap-4">
//       {/* Chat List Sidebar */}
//       <Card className="w-80 flex flex-col overflow-hidden">
//         <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
//           <h2 className="font-semibold text-gray-900">Messages</h2>
//           <button
//             onClick={() => setShowNewChatModal(true)}
//             className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
//             title="New Chat"
//           >
//             ✏️
//           </button>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           {chats.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p>No conversations yet</p>
//               <button
//                 onClick={() => setShowNewChatModal(true)}
//                 className="text-blue-600 text-sm mt-2"
//               >
//                 Start a chat
//               </button>
//             </div>
//           ) : (
//             chats.map(chat => (
//               <div
//                 key={chat._id}
//                 onClick={() => selectChat(chat)}
//                 className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                   currentChat?._id === chat._id ? 'bg-blue-50' : ''
//                 }`}
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
//                   {getChatAvatar(chat)}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                   <div className="flex justify-between items-start">
//                     <p className="font-medium text-gray-900 truncate">
//                       {getChatName(chat)}
//                     </p>
//                     {chat.lastMessage?.timestamp && (
//                       <span className="text-xs text-gray-400">
//                         {formatTime(chat.lastMessage.timestamp)}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-gray-500 truncate">
//                     {chat.lastMessage?.message || 'No messages yet'}
//                   </p>
//                 </div>
//                 {chat.unreadCount > 0 && (
//                   <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//                     {chat.unreadCount}
//                   </span>
//                 )}
//               </div>
//             ))
//           )}
//         </div>
//       </Card>

//       {/* Chat Window */}
//       {currentChat ? (
//         <Card className="flex-1 flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
//                 {getChatAvatar(currentChat)}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
//                 {currentChat.chatType === 'group' && (
//                   <p className="text-xs text-gray-500">
//                     {currentChat.participants?.length} members
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-3">
//             {messages.map((msg, idx) => {
//               const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id;
//               return (
//                 <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                   <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
//                     {!isOwn && (
//                       <p className="text-xs font-medium mb-1">{msg.senderName}</p>
//                     )}
//                     <p className="text-sm">{msg.message}</p>
//                     <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'} flex justify-end`}>
//                       {formatTime(msg.createdAt)}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             {sending && (
//               <div className="flex justify-end">
//                 <div className="bg-gray-200 rounded-lg p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
//                   </div>
//                 </div>
//               </div>
//             )}
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t flex gap-2">
//             <textarea
//               value={messageInput}
//               onChange={(e) => setMessageInput(e.target.value)}
//               onKeyPress={handleKeyPress}
//               placeholder="Type a message..."
//               className="flex-1 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
//               rows={1}
//             />
//             <button
//               onClick={sendMessage}
//               disabled={sending || !messageInput.trim()}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//             >
//               Send
//             </button>
//           </div>
//         </Card>
//       ) : (
//         <Card className="flex-1 flex items-center justify-center">
//           <div className="text-center">
//             <div className="text-5xl mb-4">💬</div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
//             <p className="text-gray-500">Choose a conversation to start messaging</p>
//           </div>
//         </Card>
//       )}

//       {/* New Chat Modal */}
//       <Modal isOpen={showNewChatModal} onClose={() => setShowNewChatModal(false)} title="New Chat">
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Search users..."
//             className="w-full px-3 py-2 border rounded-lg"
//           />
//           <div className="space-y-2 max-h-96 overflow-y-auto">
//             {availableUsers.map(user => (
//               <div
//                 key={user._id}
//                 onClick={() => startNewChat(user._id)}
//                 className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
//               >
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                   <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
//                 </div>
//                 <div>
//                   <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
//                   <p className="text-sm text-gray-500 capitalize">{user.role}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ChatModule;




// client/src/pages/chat/ChatModule.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import { userApi } from '../../api/user.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { getSocket, disconnectSocket } from '../../utils/socket';

const ChatModule = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Map());
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [userTyping, setUserTyping] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Initialize socket connection
  useEffect(() => {
    initSocket();
    fetchChats();
    fetchAvailableUsers();
    fetchOnlineUsers();
    startHeartbeat();

    return () => {
      if (socketRef.current) {
        disconnectSocket();
      }
      stopHeartbeat();
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Heartbeat to keep user online status
  let heartbeatInterval;
  const startHeartbeat = () => {
    heartbeatInterval = setInterval(async () => {
      try {
        await userApi.updateHeartbeat();
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    }, 30000); // Every 30 seconds
  };

  const stopHeartbeat = () => {
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
  };

  const initSocket = () => {
    const socket = getSocket();
    socketRef.current = socket;

    // Listen for new messages
    socket.on('new_message', (data) => {
      handleNewMessage(data);
    });

    // Listen for message read receipts
    socket.on('message_read', (data) => {
      updateMessageStatus(data.messageId, 'read');
    });

    // Listen for message delivered receipts
    socket.on('message_delivered', (data) => {
      updateMessageStatus(data.messageId, 'delivered');
    });

    // Listen for user status changes
    socket.on('user_status_change', (data) => {
      updateUserOnlineStatus(data.userId, data.status === 'online', data.lastSeen);
    });

    // Listen for online users list
    socket.on('online_users', (users) => {
      const statusMap = new Map(onlineUsers);
      users.forEach(user => {
        statusMap.set(user.userId, {
          isOnline: true,
          lastSeen: user.connectedAt,
          userName: user.userName,
          userRole: user.userRole
        });
      });
      setOnlineUsers(statusMap);
    });

    // Listen for typing indicators
    socket.on('user_typing', (data) => {
      if (currentChat?._id === data.chatId && data.userId !== user?._id) {
        setUserTyping(data);
        setTimeout(() => {
          setUserTyping(null);
        }, 2000);
      }
    });

    // Join user's personal room
    socket.emit('join_user_room', user?._id);
  };

  const fetchOnlineUsers = async () => {
    try {
      const response = await userApi.getOnlineUsers();
      if (response.data.success) {
        const statusMap = new Map();
        response.data.data.forEach(user => {
          statusMap.set(user._id, {
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            userName: `${user.firstName} ${user.lastName}`,
            userRole: user.role
          });
        });
        setOnlineUsers(statusMap);
      }
    } catch (error) {
      console.error('Fetch online users error:', error);
    }
  };

  const updateUserOnlineStatus = (userId, isOnline, lastSeen) => {
    setOnlineUsers(prev => {
      const newMap = new Map(prev);
      const existing = newMap.get(userId) || {};
      newMap.set(userId, {
        ...existing,
        isOnline,
        lastSeen: lastSeen || new Date()
      });
      return newMap;
    });

    // Update available users list
    setAvailableUsers(prev => prev.map(u => 
      u._id === userId ? { ...u, isOnline, lastSeen } : u
    ));

    // Update chats list online status
    setChats(prev => prev.map(chat => {
      const otherUserId = getOtherParticipantId(chat);
      if (otherUserId === userId) {
        return { ...chat, otherUserOnline: isOnline };
      }
      return chat;
    }));
  };

  const getOtherParticipantId = (chat) => {
    if (chat.chatType === 'group') return null;
    const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
    return otherParticipant?.userId?._id;
  };

  const getUserOnlineStatus = (userId) => {
    return onlineUsers.get(userId)?.isOnline || false;
  };

  const getLastSeen = (userId) => {
    const status = onlineUsers.get(userId);
    if (!status || !status.lastSeen) return null;
    return status.lastSeen;
  };

  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Offline';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  const sendTypingIndicator = (isTyping) => {
    if (!currentChat || !socketRef.current) return;
    
    const event = isTyping ? 'typing_start' : 'typing_stop';
    socketRef.current.emit(event, { 
      chatId: currentChat._id, 
      userName: `${user?.firstName} ${user?.lastName}` 
    });
  };

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
    
    // Send typing indicator
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }
    
    // Clear previous timeout
    if (typingTimeout) clearTimeout(typingTimeout);
    
    // Set timeout to stop typing indicator
    const newTimeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTypingIndicator(false);
      }
    }, 2000);
    
    setTypingTimeout(newTimeout);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getUserChats();
      if (response.data.success) {
        const chatsWithStatus = response.data.data.map(chat => {
          const otherUserId = getOtherParticipantId(chat);
          return {
            ...chat,
            otherUserOnline: otherUserId ? getUserOnlineStatus(otherUserId) : false
          };
        });
        setChats(chatsWithStatus);
      }
    } catch (error) {
      console.error('Fetch chats error:', error);
      showToast('Failed to load chats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await chatApi.getAvailableUsers();
      if (response.data.success) {
        const usersWithStatus = response.data.data.map(u => ({
          ...u,
          isOnline: getUserOnlineStatus(u._id),
          lastSeen: getLastSeen(u._id)
        }));
        setAvailableUsers(usersWithStatus);
      }
    } catch (error) {
      console.error('Fetch available users error:', error);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const response = await chatApi.getChatMessages(chatId);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
      showToast('Failed to load messages', 'error');
    }
  };

  const selectChat = async (chat) => {
    setCurrentChat(chat);
    await fetchMessages(chat._id);
    
    // Join chat room
    if (socketRef.current) {
      socketRef.current.emit('join_chat', chat._id);
    }
  };

  const startNewChat = async (targetUserId) => {
    try {
      const response = await chatApi.getOrCreateDirectChat(targetUserId);
      if (response.data.success) {
        const newChat = response.data.data;
        setChats(prev => [newChat, ...prev]);
        selectChat(newChat);
        setShowNewChatModal(false);
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to start chat', 'error');
    }
  };

  const handleNewMessage = (data) => {
    // Update chats list with new message
    setChats(prev => prev.map(chat => {
      if (chat._id === data.chatId) {
        return {
          ...chat,
          lastMessage: {
            message: data.message.message,
            senderName: data.message.senderName,
            timestamp: data.message.createdAt
          },
          unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount + 1)
        };
      }
      return chat;
    }));

    // Update messages if in current chat
    if (currentChat?._id === data.chatId) {
      setMessages(prev => [...prev, data.message]);
      // Send read receipt
      markMessageAsRead(data.message._id, data.chatId);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    setMessages(prev => prev.map(msg => 
      msg._id === messageId ? { ...msg, status } : msg
    ));
  };

  const markMessageAsRead = async (messageId, chatId) => {
    try {
      await chatApi.markAsRead(messageId);
      if (socketRef.current) {
        socketRef.current.emit('message_read', { messageId, chatId });
      }
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentChat) return;
    
    setSending(true);
    const messageText = messageInput.trim();
    setMessageInput('');
    
    // Stop typing indicator
    if (isTyping) {
      setIsTyping(false);
      sendTypingIndicator(false);
      if (typingTimeout) clearTimeout(typingTimeout);
    }
    
    try {
      const response = await chatApi.sendMessage(currentChat._id, { message: messageText });
      if (response.data.success) {
        const newMessage = response.data.data;
        setMessages(prev => [...prev, newMessage]);
        
        // Emit via socket for real-time delivery
        if (socketRef.current) {
          socketRef.current.emit('new_message', {
            chatId: currentChat._id,
            message: newMessage
          });
        }
        
        // Update chat list with last message
        setChats(prev => prev.map(chat => 
          chat._id === currentChat._id ? {
            ...chat,
            lastMessage: { message: messageText, timestamp: new Date() }
          } : chat
        ));
      }
    } catch (error) {
      showToast('Failed to send message', 'error');
      setMessageInput(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString();
  };

  const getChatName = (chat) => {
    if (chat.chatType === 'group') {
      return chat.groupName;
    }
    const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
    return otherParticipant?.userId?.firstName + ' ' + otherParticipant?.userId?.lastName || 'Unknown';
  };

  const getChatAvatar = (chat) => {
    if (chat.chatType === 'group') {
      return '👥';
    }
    return '👤';
  };

  const filterAvailableUsers = () => {
    if (!searchQuery) return availableUsers;
    return availableUsers.filter(u => 
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  if (loading) return <Spinner />;

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Chat List Sidebar */}
      <Card className="w-80 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Messages</h2>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            title="New Chat"
          >
            ✏️
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No conversations yet</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="text-blue-600 text-sm mt-2"
              >
                Start a chat
              </button>
            </div>
          ) : (
            chats.map(chat => {
              const otherUserId = getOtherParticipantId(chat);
              const isOnline = otherUserId ? getUserOnlineStatus(otherUserId) : false;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentChat?._id === chat._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                      {getChatAvatar(chat)}
                    </div>
                    {chat.chatType !== 'group' && (
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-gray-900 truncate">
                        {getChatName(chat)}
                      </p>
                      {chat.lastMessage?.timestamp && (
                        <span className="text-xs text-gray-400">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate flex-1">
                        {chat.lastMessage?.message || 'No messages yet'}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                    {chat.chatType !== 'group' && !isOnline && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatLastSeen(getLastSeen(otherUserId))}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Chat Window */}
      {currentChat ? (
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                  {getChatAvatar(currentChat)}
                </div>
                {currentChat.chatType !== 'group' && (
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    getUserOnlineStatus(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
                {currentChat.chatType === 'direct' && (
                  <p className="text-xs">
                    {getUserOnlineStatus(getOtherParticipantId(currentChat)) ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      <span className="text-gray-500">
                        Last seen {formatLastSeen(getLastSeen(getOtherParticipantId(currentChat)))}
                      </span>
                    )}
                  </p>
                )}
                {currentChat.chatType === 'group' && (
                  <p className="text-xs text-gray-500">
                    {currentChat.participants?.length} members
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => {
              const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id;
              return (
                <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'} flex justify-end items-center gap-1`}>
                      {formatTime(msg.createdAt)}
                      {isOwn && msg.status === 'read' && <span>✓✓</span>}
                      {isOwn && msg.status === 'delivered' && <span>✓✓</span>}
                      {isOwn && msg.status === 'sent' && <span>✓</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {userTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                    <span className="text-xs text-gray-500 ml-1">{userTyping.userName} is typing...</span>
                  </div>
                </div>
              </div>
            )}
            {sending && (
              <div className="flex justify-end">
                <div className="bg-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t flex gap-2">
            <textarea
              value={messageInput}
              onChange={handleMessageInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={sending || !messageInput.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send
            </button>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a chat</h3>
            <p className="text-gray-500">Choose a conversation to start messaging</p>
          </div>
        </Card>
      )}

      {/* New Chat Modal */}
      <Modal isOpen={showNewChatModal} onClose={() => setShowNewChatModal(false)} title="New Chat">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filterAvailableUsers().length === 0 ? (
              <p className="text-center text-gray-500 py-4">No users found</p>
            ) : (
              filterAvailableUsers().map(userItem => {
                const isOnline = getUserOnlineStatus(userItem._id);
                return (
                  <div
                    key={userItem._id}
                    onClick={() => startNewChat(userItem._id)}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="font-medium">
                          {userItem.firstName?.[0]}{userItem.lastName?.[0]}
                        </span>
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-900">
                          {userItem.firstName} {userItem.lastName}
                        </p>
                        {isOnline && <span className="text-xs text-green-600">Online</span>}
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{userItem.role}</p>
                      {!isOnline && (
                        <p className="text-xs text-gray-400">
                          Last seen {formatLastSeen(getLastSeen(userItem._id))}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatModule;