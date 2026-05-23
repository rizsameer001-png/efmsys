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




// // client/src/pages/chat/ChatModule.jsx
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';
// import { getSocket, disconnectSocket } from '../../utils/socket';

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
//   const [onlineUsers, setOnlineUsers] = useState(new Map());
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const [userTyping, setUserTyping] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const messagesEndRef = useRef(null);
//   const socketRef = useRef(null);

//   // Initialize socket connection
//   useEffect(() => {
//     initSocket();
//     fetchChats();
//     fetchAvailableUsers();
//     fetchOnlineUsers();
//     startHeartbeat();

//     return () => {
//       if (socketRef.current) {
//         disconnectSocket();
//       }
//       stopHeartbeat();
//     };
//   }, []);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Heartbeat to keep user online status
//   let heartbeatInterval;
//   const startHeartbeat = () => {
//     heartbeatInterval = setInterval(async () => {
//       try {
//         await userApi.updateHeartbeat();
//       } catch (error) {
//         console.error('Heartbeat error:', error);
//       }
//     }, 30000); // Every 30 seconds
//   };

//   const stopHeartbeat = () => {
//     if (heartbeatInterval) {
//       clearInterval(heartbeatInterval);
//     }
//   };

//   const initSocket = () => {
//     const socket = getSocket();
//     socketRef.current = socket;

//     // Listen for new messages
//     socket.on('new_message', (data) => {
//       handleNewMessage(data);
//     });

//     // Listen for message read receipts
//     socket.on('message_read', (data) => {
//       updateMessageStatus(data.messageId, 'read');
//     });

//     // Listen for message delivered receipts
//     socket.on('message_delivered', (data) => {
//       updateMessageStatus(data.messageId, 'delivered');
//     });

//     // Listen for user status changes
//     socket.on('user_status_change', (data) => {
//       updateUserOnlineStatus(data.userId, data.status === 'online', data.lastSeen);
//     });

//     // Listen for online users list
//     socket.on('online_users', (users) => {
//       const statusMap = new Map(onlineUsers);
//       users.forEach(user => {
//         statusMap.set(user.userId, {
//           isOnline: true,
//           lastSeen: user.connectedAt,
//           userName: user.userName,
//           userRole: user.userRole
//         });
//       });
//       setOnlineUsers(statusMap);
//     });

//     // Listen for typing indicators
//     socket.on('user_typing', (data) => {
//       if (currentChat?._id === data.chatId && data.userId !== user?._id) {
//         setUserTyping(data);
//         setTimeout(() => {
//           setUserTyping(null);
//         }, 2000);
//       }
//     });

//     // Join user's personal room
//     socket.emit('join_user_room', user?._id);
//   };

//   const fetchOnlineUsers = async () => {
//     try {
//       const response = await userApi.getOnlineUsers();
//       if (response.data.success) {
//         const statusMap = new Map();
//         response.data.data.forEach(user => {
//           statusMap.set(user._id, {
//             isOnline: user.isOnline,
//             lastSeen: user.lastSeen,
//             userName: `${user.firstName} ${user.lastName}`,
//             userRole: user.role
//           });
//         });
//         setOnlineUsers(statusMap);
//       }
//     } catch (error) {
//       console.error('Fetch online users error:', error);
//     }
//   };

//   const updateUserOnlineStatus = (userId, isOnline, lastSeen) => {
//     setOnlineUsers(prev => {
//       const newMap = new Map(prev);
//       const existing = newMap.get(userId) || {};
//       newMap.set(userId, {
//         ...existing,
//         isOnline,
//         lastSeen: lastSeen || new Date()
//       });
//       return newMap;
//     });

//     // Update available users list
//     setAvailableUsers(prev => prev.map(u => 
//       u._id === userId ? { ...u, isOnline, lastSeen } : u
//     ));

//     // Update chats list online status
//     setChats(prev => prev.map(chat => {
//       const otherUserId = getOtherParticipantId(chat);
//       if (otherUserId === userId) {
//         return { ...chat, otherUserOnline: isOnline };
//       }
//       return chat;
//     }));
//   };

//   const getOtherParticipantId = (chat) => {
//     if (chat.chatType === 'group') return null;
//     const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
//     return otherParticipant?.userId?._id;
//   };

//   const getUserOnlineStatus = (userId) => {
//     return onlineUsers.get(userId)?.isOnline || false;
//   };

//   const getLastSeen = (userId) => {
//     const status = onlineUsers.get(userId);
//     if (!status || !status.lastSeen) return null;
//     return status.lastSeen;
//   };

//   const formatLastSeen = (lastSeen) => {
//     if (!lastSeen) return 'Offline';
    
//     const now = new Date();
//     const lastSeenDate = new Date(lastSeen);
//     const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
//     if (diffMinutes < 1) return 'Just now';
//     if (diffMinutes < 60) return `${diffMinutes} min ago`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
//     return `${Math.floor(diffMinutes / 1440)} days ago`;
//   };

//   const sendTypingIndicator = (isTyping) => {
//     if (!currentChat || !socketRef.current) return;
    
//     const event = isTyping ? 'typing_start' : 'typing_stop';
//     socketRef.current.emit(event, { 
//       chatId: currentChat._id, 
//       userName: `${user?.firstName} ${user?.lastName}` 
//     });
//   };

//   const handleMessageInputChange = (e) => {
//     setMessageInput(e.target.value);
    
//     // Send typing indicator
//     if (!isTyping && e.target.value.trim()) {
//       setIsTyping(true);
//       sendTypingIndicator(true);
//     }
    
//     // Clear previous timeout
//     if (typingTimeout) clearTimeout(typingTimeout);
    
//     // Set timeout to stop typing indicator
//     const newTimeout = setTimeout(() => {
//       if (isTyping) {
//         setIsTyping(false);
//         sendTypingIndicator(false);
//       }
//     }, 2000);
    
//     setTypingTimeout(newTimeout);
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
//       if (response.data.success) {
//         const chatsWithStatus = response.data.data.map(chat => {
//           const otherUserId = getOtherParticipantId(chat);
//           return {
//             ...chat,
//             otherUserOnline: otherUserId ? getUserOnlineStatus(otherUserId) : false
//           };
//         });
//         setChats(chatsWithStatus);
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
//         const usersWithStatus = response.data.data.map(u => ({
//           ...u,
//           isOnline: getUserOnlineStatus(u._id),
//           lastSeen: getLastSeen(u._id)
//         }));
//         setAvailableUsers(usersWithStatus);
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
    
//     // Join chat room
//     if (socketRef.current) {
//       socketRef.current.emit('join_chat', chat._id);
//     }
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

//   const handleNewMessage = (data) => {
//     // Update chats list with new message
//     setChats(prev => prev.map(chat => {
//       if (chat._id === data.chatId) {
//         return {
//           ...chat,
//           lastMessage: {
//             message: data.message.message,
//             senderName: data.message.senderName,
//             timestamp: data.message.createdAt
//           },
//           unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount + 1)
//         };
//       }
//       return chat;
//     }));

//     // Update messages if in current chat
//     if (currentChat?._id === data.chatId) {
//       setMessages(prev => [...prev, data.message]);
//       // Send read receipt
//       markMessageAsRead(data.message._id, data.chatId);
//     }
//   };

//   const updateMessageStatus = (messageId, status) => {
//     setMessages(prev => prev.map(msg => 
//       msg._id === messageId ? { ...msg, status } : msg
//     ));
//   };

//   const markMessageAsRead = async (messageId, chatId) => {
//     try {
//       await chatApi.markAsRead(messageId);
//       if (socketRef.current) {
//         socketRef.current.emit('message_read', { messageId, chatId });
//       }
//     } catch (error) {
//       console.error('Mark as read error:', error);
//     }
//   };

//   const sendMessage = async () => {
//     if (!messageInput.trim() || !currentChat) return;
    
//     setSending(true);
//     const messageText = messageInput.trim();
//     setMessageInput('');
    
//     // Stop typing indicator
//     if (isTyping) {
//       setIsTyping(false);
//       sendTypingIndicator(false);
//       if (typingTimeout) clearTimeout(typingTimeout);
//     }
    
//     try {
//       const response = await chatApi.sendMessage(currentChat._id, { message: messageText });
//       if (response.data.success) {
//         const newMessage = response.data.data;
//         setMessages(prev => [...prev, newMessage]);
        
//         // Emit via socket for real-time delivery
//         if (socketRef.current) {
//           socketRef.current.emit('new_message', {
//             chatId: currentChat._id,
//             message: newMessage
//           });
//         }
        
//         // Update chat list with last message
//         setChats(prev => prev.map(chat => 
//           chat._id === currentChat._id ? {
//             ...chat,
//             lastMessage: { message: messageText, timestamp: new Date() }
//           } : chat
//         ));
//       }
//     } catch (error) {
//       showToast('Failed to send message', 'error');
//       setMessageInput(messageText); // Restore message on error
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

//   const filterAvailableUsers = () => {
//     if (!searchQuery) return availableUsers;
//     return availableUsers.filter(u => 
//       `${u.firstName} ${u.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.email?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
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
//             chats.map(chat => {
//               const otherUserId = getOtherParticipantId(chat);
//               const isOnline = otherUserId ? getUserOnlineStatus(otherUserId) : false;
              
//               return (
//                 <div
//                   key={chat._id}
//                   onClick={() => selectChat(chat)}
//                   className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                     currentChat?._id === chat._id ? 'bg-blue-50' : ''
//                   }`}
//                 >
//                   <div className="relative">
//                     <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
//                       {getChatAvatar(chat)}
//                     </div>
//                     {chat.chatType !== 'group' && (
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium text-gray-900 truncate">
//                         {getChatName(chat)}
//                       </p>
//                       {chat.lastMessage?.timestamp && (
//                         <span className="text-xs text-gray-400">
//                           {formatTime(chat.lastMessage.timestamp)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <p className="text-sm text-gray-500 truncate flex-1">
//                         {chat.lastMessage?.message || 'No messages yet'}
//                       </p>
//                       {chat.unreadCount > 0 && (
//                         <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2">
//                           {chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     {chat.chatType !== 'group' && !isOnline && (
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {formatLastSeen(getLastSeen(otherUserId))}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </Card>

//       {/* Chat Window */}
//       {currentChat ? (
//         <Card className="flex-1 flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50">
//             <div className="flex items-center gap-3">
//               <div className="relative">
//                 <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
//                   {getChatAvatar(currentChat)}
//                 </div>
//                 {currentChat.chatType !== 'group' && (
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                     getUserOnlineStatus(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
//                   }`} />
//                 )}
//               </div>
//               <div className="flex-1">
//                 <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
//                 {currentChat.chatType === 'direct' && (
//                   <p className="text-xs">
//                     {getUserOnlineStatus(getOtherParticipantId(currentChat)) ? (
//                       <span className="text-green-600">● Online</span>
//                     ) : (
//                       <span className="text-gray-500">
//                         Last seen {formatLastSeen(getLastSeen(getOtherParticipantId(currentChat)))}
//                       </span>
//                     )}
//                   </p>
//                 )}
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
//                     <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
//                     <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'} flex justify-end items-center gap-1`}>
//                       {formatTime(msg.createdAt)}
//                       {isOwn && msg.status === 'read' && <span>✓✓</span>}
//                       {isOwn && msg.status === 'delivered' && <span>✓✓</span>}
//                       {isOwn && msg.status === 'sent' && <span>✓</span>}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             {userTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-gray-100 rounded-lg p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
//                     <span className="text-xs text-gray-500 ml-1">{userTyping.userName} is typing...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
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
//               onChange={handleMessageInputChange}
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
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <div className="space-y-2 max-h-96 overflow-y-auto">
//             {filterAvailableUsers().length === 0 ? (
//               <p className="text-center text-gray-500 py-4">No users found</p>
//             ) : (
//               filterAvailableUsers().map(userItem => {
//                 const isOnline = getUserOnlineStatus(userItem._id);
//                 return (
//                   <div
//                     key={userItem._id}
//                     onClick={() => startNewChat(userItem._id)}
//                     className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
//                   >
//                     <div className="relative">
//                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                         <span className="font-medium">
//                           {userItem.firstName?.[0]}{userItem.lastName?.[0]}
//                         </span>
//                       </div>
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex justify-between items-center">
//                         <p className="font-medium text-gray-900">
//                           {userItem.firstName} {userItem.lastName}
//                         </p>
//                         {isOnline && <span className="text-xs text-green-600">Online</span>}
//                       </div>
//                       <p className="text-sm text-gray-500 capitalize">{userItem.role}</p>
//                       {!isOnline && (
//                         <p className="text-xs text-gray-400">
//                           Last seen {formatLastSeen(getLastSeen(userItem._id))}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </Modal>
//     </div>
//   );
// };

// export default ChatModule;
















// // // client/src/pages/chat/ChatModule.jsx
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';
// import { getSocket, disconnectSocket } from '../../utils/socket';

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
//   const [onlineUsers, setOnlineUsers] = useState(new Map());
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const [userTyping, setUserTyping] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [messagePage, setMessagePage] = useState(1);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const socketRef = useRef(null);
//   let heartbeatInterval = null;

//   // Initialize socket connection
//   useEffect(() => {
//     if (user?._id) {
//       initSocket();
//       fetchChats();
//       fetchAvailableUsers();
//       fetchOnlineUsers();
//       startHeartbeat();
//     }

//     return () => {
//       if (socketRef.current) {
//         disconnectSocket();
//       }
//       stopHeartbeat();
//     };
//   }, [user?._id]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Heartbeat to keep user online status
//   const startHeartbeat = () => {
//     heartbeatInterval = setInterval(async () => {
//       try {
//         await userApi.updateHeartbeat();
//       } catch (error) {
//         console.error('Heartbeat error:', error);
//       }
//     }, 30000); // Every 30 seconds
//   };

//   const stopHeartbeat = () => {
//     if (heartbeatInterval) {
//       clearInterval(heartbeatInterval);
//       heartbeatInterval = null;
//     }
//   };

//   const initSocket = () => {
//     if (!user?._id) return;
    
//     const socket = getSocket();
//     socketRef.current = socket;

//     // Listen for new messages
//     socket.on('new_message', (data) => {
//       handleNewMessage(data);
//     });

//     // Listen for message read receipts
//     socket.on('message_read', (data) => {
//       updateMessageStatus(data.messageId, 'read');
//     });

//     // Listen for message delivered receipts
//     socket.on('message_delivered', (data) => {
//       updateMessageStatus(data.messageId, 'delivered');
//     });

//     // Listen for user status changes
//     socket.on('user_status_change', (data) => {
//       updateUserOnlineStatus(data.userId, data.status === 'online', data.lastSeen);
//     });

//     // Listen for online users list
//     socket.on('online_users', (users) => {
//       const statusMap = new Map(onlineUsers);
//       users.forEach(userData => {
//         statusMap.set(userData.userId, {
//           isOnline: true,
//           lastSeen: userData.connectedAt,
//           userName: userData.userName,
//           userRole: userData.userRole
//         });
//       });
//       setOnlineUsers(statusMap);
//     });

//     // Listen for typing indicators
//     socket.on('user_typing', (data) => {
//       if (currentChat?._id === data.chatId && data.userId !== user?._id) {
//         setUserTyping(data);
//         setTimeout(() => {
//           setUserTyping(null);
//         }, 2000);
//       }
//     });

//     // Join user's personal room
//     socket.emit('join_user_room', user?._id);
//   };

//   const fetchOnlineUsers = async () => {
//     try {
//       const response = await userApi.getOnlineUsers();
//       if (response.data.success) {
//         const statusMap = new Map();
//         response.data.data.forEach(userData => {
//           statusMap.set(userData._id, {
//             isOnline: userData.isOnline,
//             lastSeen: userData.lastSeen,
//             userName: `${userData.firstName} ${userData.lastName}`,
//             userRole: userData.role
//           });
//         });
//         setOnlineUsers(statusMap);
//       }
//     } catch (error) {
//       console.error('Fetch online users error:', error);
//     }
//   };

//   const updateUserOnlineStatus = (userId, isOnline, lastSeen) => {
//     setOnlineUsers(prev => {
//       const newMap = new Map(prev);
//       const existing = newMap.get(userId) || {};
//       newMap.set(userId, {
//         ...existing,
//         isOnline,
//         lastSeen: lastSeen || new Date()
//       });
//       return newMap;
//     });

//     // Update available users list
//     setAvailableUsers(prev => prev.map(u => 
//       u._id === userId ? { ...u, isOnline, lastSeen } : u
//     ));

//     // Update chats list online status
//     setChats(prev => prev.map(chat => {
//       const otherUserId = getOtherParticipantId(chat);
//       if (otherUserId === userId) {
//         return { ...chat, otherUserOnline: isOnline };
//       }
//       return chat;
//     }));
//   };

//   const getOtherParticipantId = (chat) => {
//     if (!chat || chat.chatType === 'group') return null;
//     const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
//     return otherParticipant?.userId?._id || otherParticipant?.userId;
//   };

//   const getUserOnlineStatus = (userId) => {
//     return onlineUsers.get(userId)?.isOnline || false;
//   };

//   const getLastSeen = (userId) => {
//     const status = onlineUsers.get(userId);
//     if (!status || !status.lastSeen) return null;
//     return status.lastSeen;
//   };

//   const formatLastSeen = (lastSeen) => {
//     if (!lastSeen) return 'Offline';
    
//     const now = new Date();
//     const lastSeenDate = new Date(lastSeen);
//     const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
//     if (diffMinutes < 1) return 'Just now';
//     if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
//     return `${Math.floor(diffMinutes / 1440)} days ago`;
//   };

//   const sendTypingIndicator = (isTypingNow) => {
//     if (!currentChat || !socketRef.current) return;
    
//     socketRef.current.emit('typing', { 
//       chatId: currentChat._id, 
//       to: getOtherParticipantId(currentChat),
//       name: `${user?.firstName} ${user?.lastName}`,
//       isTyping: isTypingNow
//     });
//   };

//   const handleMessageInputChange = (e) => {
//     setMessageInput(e.target.value);
    
//     // Send typing indicator
//     if (!isTyping && e.target.value.trim()) {
//       setIsTyping(true);
//       sendTypingIndicator(true);
//     }
    
//     // Clear previous timeout
//     if (typingTimeout) clearTimeout(typingTimeout);
    
//     // Set timeout to stop typing indicator
//     const newTimeout = setTimeout(() => {
//       if (isTyping) {
//         setIsTyping(false);
//         sendTypingIndicator(false);
//       }
//     }, 2000);
    
//     setTypingTimeout(newTimeout);
//   };

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
//       if (response.data.success) {
//         const chatsWithStatus = (response.data.data || []).map(chat => {
//           const otherUserId = getOtherParticipantId(chat);
//           return {
//             ...chat,
//             otherUserOnline: otherUserId ? getUserOnlineStatus(otherUserId) : false,
//             unreadCount: chat.unreadCount || 0
//           };
//         });
//         setChats(chatsWithStatus);
//       }
//     } catch (error) {
//       console.error('Fetch chats error:', error);
//       showToast(error.userMessage || 'Failed to load chats', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await chatApi.getAvailableUsers();
//       if (response.data.success) {
//         const usersWithStatus = (response.data.data || []).map(u => ({
//           ...u,
//           isOnline: getUserOnlineStatus(u._id),
//           lastSeen: getLastSeen(u._id)
//         }));
//         setAvailableUsers(usersWithStatus);
//       }
//     } catch (error) {
//       console.error('Fetch available users error:', error);
//     }
//   };

//   const fetchMessages = async (chatId, reset = true) => {
//     if (reset) {
//       setMessages([]);
//       setMessagePage(1);
//       setHasMoreMessages(true);
//     }
    
//     setLoadingMessages(true);
//     try {
//       const page = reset ? 1 : messagePage;
//       const response = await chatApi.getChatMessages(chatId, page, 50);
//       if (response.data.success) {
//         const newMessages = response.data.data || [];
//         if (reset) {
//           setMessages(newMessages);
//         } else {
//           setMessages(prev => [...newMessages, ...prev]);
//         }
//         setHasMoreMessages(newMessages.length === 50);
//         setMessagePage(page + 1);
        
//         // Mark messages as read
//         if (newMessages.length > 0 && socketRef.current) {
//           socketRef.current.emit('mark_chat_read', { chatId });
//         }
//       }
//     } catch (error) {
//       console.error('Fetch messages error:', error);
//       showToast(error.userMessage || 'Failed to load messages', 'error');
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   const loadMoreMessages = () => {
//     if (!loadingMessages && hasMoreMessages && currentChat) {
//       fetchMessages(currentChat._id, false);
//     }
//   };

//   const selectChat = async (chat) => {
//     if (currentChat?._id === chat._id) return;
    
//     setCurrentChat(chat);
//     await fetchMessages(chat._id, true);
    
//     // Join chat room
//     if (socketRef.current) {
//       socketRef.current.emit('join_chat', chat._id);
//     }
    
//     // Mark chat as read
//     setChats(prev => prev.map(c => 
//       c._id === chat._id ? { ...c, unreadCount: 0 } : c
//     ));
//   };

//   const startNewChat = async (targetUserId) => {
//     try {
//       const response = await chatApi.getOrCreateDirectChat(targetUserId);
//       if (response.data.success) {
//         const newChat = response.data.data;
//         setChats(prev => [newChat, ...prev]);
//         await selectChat(newChat);
//         setShowNewChatModal(false);
//         setSearchQuery('');
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || error.userMessage || 'Failed to start chat', 'error');
//     }
//   };

//   const handleNewMessage = (data) => {
//     const { chatId, message } = data;
    
//     // Update chats list with new message
//     setChats(prev => prev.map(chat => {
//       if (chat._id === chatId) {
//         return {
//           ...chat,
//           lastMessage: {
//             message: message.message,
//             senderName: message.senderName,
//             timestamp: message.createdAt
//           },
//           unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount || 0) + 1,
//           updatedAt: message.createdAt
//         };
//       }
//       return chat;
//     }));

//     // Update messages if in current chat
//     if (currentChat?._id === chatId) {
//       setMessages(prev => [...prev, message]);
//       // Send read receipt
//       if (socketRef.current) {
//         socketRef.current.emit('message_read', { messageId: message._id, chatId });
//       }
//     } else {
//       // Play notification sound (optional)
//       // playNotificationSound();
//     }
//   };

//   const updateMessageStatus = (messageId, status) => {
//     setMessages(prev => prev.map(msg => 
//       msg._id === messageId ? { ...msg, status } : msg
//     ));
//   };

//   const sendMessage = async () => {
//     if (!messageInput.trim() || !currentChat || sending) return;
    
//     setSending(true);
//     const messageText = messageInput.trim();
//     setMessageInput('');
    
//     // Stop typing indicator
//     if (isTyping) {
//       setIsTyping(false);
//       sendTypingIndicator(false);
//       if (typingTimeout) clearTimeout(typingTimeout);
//     }
    
//     try {
//       const response = await chatApi.sendMessage(currentChat._id, { message: messageText });
//       if (response.data.success) {
//         const newMessage = response.data.data;
//         setMessages(prev => [...prev, newMessage]);
        
//         // Emit via socket for real-time delivery
//         if (socketRef.current) {
//           socketRef.current.emit('new_message', {
//             chatId: currentChat._id,
//             message: newMessage,
//             to: getOtherParticipantId(currentChat)
//           });
//         }
        
//         // Update chat list with last message
//         setChats(prev => prev.map(chat => 
//           chat._id === currentChat._id ? {
//             ...chat,
//             lastMessage: { 
//               message: messageText, 
//               senderName: `${user?.firstName} ${user?.lastName}`,
//               timestamp: new Date() 
//             },
//             updatedAt: new Date()
//           } : chat
//         ));
        
//         scrollToBottom();
//       }
//     } catch (error) {
//       console.error('Send message error:', error);
//       showToast(error.userMessage || 'Failed to send message', 'error');
//       setMessageInput(messageText); // Restore message on error
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
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const isToday = date.toDateString() === now.toDateString();
      
//       if (isToday) {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       }
//       return date.toLocaleDateString();
//     } catch (error) {
//       return '';
//     }
//   };

//   const getChatName = (chat) => {
//     if (!chat) return 'Unknown';
//     if (chat.chatType === 'group') {
//       return chat.groupName || 'Group Chat';
//     }
//     const otherParticipant = chat.participants?.find(p => 
//       p.userId?._id !== user?._id && p.userId?._id !== user?.id
//     );
//     if (otherParticipant?.userId) {
//       const participantUser = otherParticipant.userId;
//       return `${participantUser.firstName || ''} ${participantUser.lastName || ''}`.trim() || 'Unknown User';
//     }
//     return 'Unknown User';
//   };

//   const getChatAvatar = (chat) => {
//     if (chat.chatType === 'group') {
//       return '👥';
//     }
//     return '👤';
//   };

//   const filterAvailableUsers = () => {
//     if (!searchQuery) return availableUsers;
//     return availableUsers.filter(u => 
//       `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.email?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   // Sort chats by last message time
//   const sortedChats = [...chats].sort((a, b) => {
//     const timeA = a.updatedAt || a.lastMessage?.timestamp;
//     const timeB = b.updatedAt || b.lastMessage?.timestamp;
//     return new Date(timeB) - new Date(timeA);
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <Spinner />
//       </div>
//     );
//   }

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
//           {sortedChats.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p className="text-4xl mb-2">💬</p>
//               <p>No conversations yet</p>
//               <button
//                 onClick={() => setShowNewChatModal(true)}
//                 className="text-blue-600 text-sm mt-2 hover:underline"
//               >
//                 Start a chat
//               </button>
//             </div>
//           ) : (
//             sortedChats.map(chat => {
//               const otherUserId = getOtherParticipantId(chat);
//               const isOnline = otherUserId ? getUserOnlineStatus(otherUserId) : false;
//               const chatName = getChatName(chat);
//               const lastMessage = chat.lastMessage?.message || 'No messages yet';
//               const lastTime = chat.lastMessage?.timestamp || chat.updatedAt;
              
//               return (
//                 <div
//                   key={chat._id}
//                   onClick={() => selectChat(chat)}
//                   className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                     currentChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
//                   }`}
//                 >
//                   <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                       {chatName.charAt(0).toUpperCase()}
//                     </div>
//                     {chat.chatType !== 'group' && (
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium text-gray-900 truncate">
//                         {chatName}
//                       </p>
//                       {lastTime && (
//                         <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
//                           {formatTime(lastTime)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <p className="text-sm text-gray-500 truncate flex-1">
//                         {lastMessage}
//                       </p>
//                       {chat.unreadCount > 0 && (
//                         <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2 min-w-[20px] text-center">
//                           {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     {chat.chatType !== 'group' && !isOnline && otherUserId && (
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {formatLastSeen(getLastSeen(otherUserId))}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </Card>

//       {/* Chat Window */}
//       {currentChat ? (
//         <Card className="flex-1 flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="relative flex-shrink-0">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                   {getChatName(currentChat).charAt(0).toUpperCase()}
//                 </div>
//                 {currentChat.chatType !== 'group' && (
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                     getUserOnlineStatus(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
//                   }`} />
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
//                 {currentChat.chatType === 'direct' && (
//                   <p className="text-xs">
//                     {getUserOnlineStatus(getOtherParticipantId(currentChat)) ? (
//                       <span className="text-green-600">● Online</span>
//                     ) : (
//                       <span className="text-gray-500">
//                         {formatLastSeen(getLastSeen(getOtherParticipantId(currentChat)))}
//                       </span>
//                     )}
//                   </p>
//                 )}
//                 {currentChat.chatType === 'group' && (
//                   <p className="text-xs text-gray-500">
//                     {currentChat.participants?.length || 0} members
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div 
//             ref={messagesContainerRef}
//             className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white"
//           >
//             {hasMoreMessages && messages.length >= 50 && (
//               <div className="flex justify-center">
//                 <button
//                   onClick={loadMoreMessages}
//                   disabled={loadingMessages}
//                   className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
//                 >
//                   {loadingMessages ? 'Loading...' : 'Load more messages'}
//                 </button>
//               </div>
//             )}
            
//             {messages.length === 0 && !loadingMessages ? (
//               <div className="flex flex-col items-center justify-center h-full text-center">
//                 <div className="text-5xl mb-4">💬</div>
//                 <p className="text-gray-500">No messages yet</p>
//                 <p className="text-sm text-gray-400">Send a message to start the conversation</p>
//               </div>
//             ) : (
//               messages.map((msg, idx) => {
//                 const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id || msg.senderId === user?.id;
//                 return (
//                   <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in`}>
//                     <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 shadow-sm'} rounded-2xl p-3`}>
//                       {!isOwn && currentChat.chatType === 'group' && (
//                         <p className="text-xs font-medium mb-1 text-blue-600">{msg.senderName}</p>
//                       )}
//                       <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
//                       <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
//                         {formatTime(msg.createdAt)}
//                         {isOwn && msg.status === 'read' && <span>✓✓</span>}
//                         {isOwn && msg.status === 'delivered' && <span>✓✓</span>}
//                         {isOwn && msg.status === 'sent' && <span>✓</span>}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
            
//             {userTyping && (
//               <div className="flex justify-start animate-fade-in">
//                 <div className="bg-white shadow-sm rounded-2xl p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                     <span className="text-xs text-gray-500 ml-1">{userTyping.userName} is typing...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {sending && (
//               <div className="flex justify-end animate-fade-in">
//                 <div className="bg-gray-200 rounded-2xl p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t bg-white">
//             <div className="flex gap-2">
//               <textarea
//                 value={messageInput}
//                 onChange={handleMessageInputChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 rows={1}
//                 style={{ maxHeight: '100px' }}
//                 onInput={(e) => {
//                   e.target.style.height = 'auto';
//                   e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={sending || !messageInput.trim()}
//                 className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
//               >
//                 <span>Send</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </Card>
//       ) : (
//         <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//           <div className="text-center">
//             <div className="text-6xl mb-4">💬</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Chat</h3>
//             <p className="text-gray-500 mb-4">Select a conversation or start a new chat</p>
//             <button
//               onClick={() => setShowNewChatModal(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//             >
//               Start New Chat
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* New Chat Modal */}
//       <Modal isOpen={showNewChatModal} onClose={() => {
//         setShowNewChatModal(false);
//         setSearchQuery('');
//       }} title="New Chat">
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Search users by name or email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             autoFocus
//           />
//           <div className="space-y-2 max-h-96 overflow-y-auto">
//             {filterAvailableUsers().length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No users found</p>
//                 {searchQuery && (
//                   <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
//                 )}
//               </div>
//             ) : (
//               filterAvailableUsers().map(userItem => {
//                 const isOnline = getUserOnlineStatus(userItem._id);
//                 const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.trim();
//                 return (
//                   <div
//                     key={userItem._id}
//                     onClick={() => startNewChat(userItem._id)}
//                     className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all hover:shadow-sm"
//                   >
//                     <div className="relative flex-shrink-0">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
//                         {fullName.charAt(0).toUpperCase() || 'U'}
//                       </div>
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
//                       }`} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <p className="font-medium text-gray-900 truncate">
//                           {fullName || 'Unknown User'}
//                         </p>
//                         {isOnline && <span className="text-xs text-green-600">Online</span>}
//                       </div>
//                       <p className="text-sm text-gray-500 capitalize">{userItem.role || 'User'}</p>
//                       {!isOnline && (
//                         <p className="text-xs text-gray-400">
//                           {formatLastSeen(getLastSeen(userItem._id))}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </Modal>

//       {/* Add animation styles */}
//       <style jsx>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//         .animate-bounce {
//           animation: bounce 1.4s infinite ease-in-out;
//         }
//         @keyframes bounce {
//           0%, 60%, 100% {
//             transform: translateY(0);
//           }
//           30% {
//             transform: translateY(-10px);
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatModule;














// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';
// import { getSocket, disconnectSocket, onSocketEvent, offSocketEvent } from '../../utils/socket';

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
//   const [onlineUsers, setOnlineUsers] = useState(new Map());
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const [userTyping, setUserTyping] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [messagePage, setMessagePage] = useState(1);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const heartbeatIntervalRef = useRef(null);
//   const unsubscribeFunctions = useRef([]);

//   // Initialize socket connection
//   useEffect(() => {
//     if (user?._id) {
//       initSocket();
//       fetchChats();
//       fetchAvailableUsers();
//       fetchOnlineUsers();
//       startHeartbeat();
//     }

//     return () => {
//       // Clean up socket listeners
//       unsubscribeFunctions.current.forEach(unsubscribe => {
//         if (typeof unsubscribe === 'function') unsubscribe();
//       });
//       unsubscribeFunctions.current = [];
      
//       if (heartbeatIntervalRef.current) {
//         clearInterval(heartbeatIntervalRef.current);
//       }
//     };
//   }, [user?._id]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Heartbeat to keep user online status
//   const startHeartbeat = () => {
//     heartbeatIntervalRef.current = setInterval(async () => {
//       try {
//         await userApi.updateHeartbeat();
//       } catch (error) {
//         console.error('Heartbeat error:', error);
//       }
//     }, 30000);
//   };

//   const initSocket = () => {
//     if (!user?._id) return;
    
//     const socket = getSocket();
    
//     // Socket event listeners with cleanup
//     const unsubscribeNewMessage = onSocketEvent('new_message', handleNewMessage);
//     const unsubscribeMessageRead = onSocketEvent('message_read', (data) => updateMessageStatus(data.messageId, 'read'));
//     const unsubscribeMessageDelivered = onSocketEvent('message_delivered', (data) => updateMessageStatus(data.messageId, 'delivered'));
//     const unsubscribeUserStatus = onSocketEvent('user_status_change', (data) => updateUserOnlineStatus(data.userId, data.status === 'online', data.lastSeen));
//     const unsubscribeOnlineUsers = onSocketEvent('online_users', (users) => {
//       const statusMap = new Map(onlineUsers);
//       users.forEach(userData => {
//         statusMap.set(userData.userId, {
//           isOnline: true,
//           lastSeen: userData.connectedAt,
//           userName: userData.userName,
//           userRole: userData.userRole
//         });
//       });
//       setOnlineUsers(statusMap);
//     });
//     const unsubscribeUserTyping = onSocketEvent('user_typing', (data) => {
//       if (currentChat?._id === data.chatId && data.userId !== user?._id) {
//         setUserTyping(data);
//         setTimeout(() => setUserTyping(null), 2000);
//       }
//     });
    
//     unsubscribeFunctions.current = [
//       unsubscribeNewMessage,
//       unsubscribeMessageRead,
//       unsubscribeMessageDelivered,
//       unsubscribeUserStatus,
//       unsubscribeOnlineUsers,
//       unsubscribeUserTyping
//     ];
    
//     // Join user's personal room
//     if (socket && socket.connected) {
//       socket.emit('join_user_room', user?._id);
//     }
//   };

//   const fetchOnlineUsers = async () => {
//     try {
//       const response = await userApi.getOnlineUsers();
//       if (response.data.success) {
//         const statusMap = new Map();
//         response.data.data.forEach(userData => {
//           statusMap.set(userData._id, {
//             isOnline: userData.isUserOnline || userData.isOnline,
//             lastSeen: userData.lastSeen,
//             userName: `${userData.firstName} ${userData.lastName}`,
//             userRole: userData.role
//           });
//         });
//         setOnlineUsers(statusMap);
//       }
//     } catch (error) {
//       console.error('Fetch online users error:', error);
//     }
//   };

//   const updateUserOnlineStatus = (userId, isOnline, lastSeen) => {
//     setOnlineUsers(prev => {
//       const newMap = new Map(prev);
//       const existing = newMap.get(userId) || {};
//       newMap.set(userId, {
//         ...existing,
//         isOnline,
//         lastSeen: lastSeen || new Date()
//       });
//       return newMap;
//     });

//     setAvailableUsers(prev => prev.map(u => 
//       u._id === userId ? { ...u, isOnline, lastSeen } : u
//     ));

//     setChats(prev => prev.map(chat => {
//       const otherUserId = getOtherParticipantId(chat);
//       if (otherUserId === userId) {
//         return { ...chat, otherUserOnline: isOnline };
//       }
//       return chat;
//     }));
//   };

//   const getOtherParticipantId = (chat) => {
//     if (!chat || chat.chatType === 'group') return null;
//     const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
//     return otherParticipant?.userId?._id || otherParticipant?.userId;
//   };

//   const getUserOnlineStatus = (userId) => {
//     return onlineUsers.get(userId)?.isOnline || false;
//   };

//   const getLastSeen = (userId) => {
//     const status = onlineUsers.get(userId);
//     if (!status || !status.lastSeen) return null;
//     return status.lastSeen;
//   };

//   const formatLastSeen = (lastSeen) => {
//     if (!lastSeen) return 'Offline';
    
//     const now = new Date();
//     const lastSeenDate = new Date(lastSeen);
//     const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
//     if (diffMinutes < 1) return 'Just now';
//     if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
//     return `${Math.floor(diffMinutes / 1440)} days ago`;
//   };

//   const sendTypingIndicator = (isTypingNow) => {
//     const socket = getSocket();
//     if (!currentChat || !socket || !socket.connected) return;
    
//     socket.emit('typing', { 
//       chatId: currentChat._id, 
//       to: getOtherParticipantId(currentChat),
//       name: `${user?.firstName} ${user?.lastName}`,
//       isTyping: isTypingNow
//     });
//   };

//   const handleMessageInputChange = (e) => {
//     setMessageInput(e.target.value);
    
//     if (!isTyping && e.target.value.trim()) {
//       setIsTyping(true);
//       sendTypingIndicator(true);
//     }
    
//     if (typingTimeout) clearTimeout(typingTimeout);
    
//     const newTimeout = setTimeout(() => {
//       if (isTyping) {
//         setIsTyping(false);
//         sendTypingIndicator(false);
//       }
//     }, 2000);
    
//     setTypingTimeout(newTimeout);
//   };

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
//       if (response.data.success) {
//         const chatsWithStatus = (response.data.data || []).map(chat => {
//           const otherUserId = getOtherParticipantId(chat);
//           return {
//             ...chat,
//             otherUserOnline: otherUserId ? getUserOnlineStatus(otherUserId) : false,
//             unreadCount: chat.unreadCount || 0
//           };
//         });
//         setChats(chatsWithStatus);
//       }
//     } catch (error) {
//       console.error('Fetch chats error:', error);
//       showToast(error.userMessage || 'Failed to load chats', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await chatApi.getAvailableUsers();
//       if (response.data.success) {
//         const usersWithStatus = (response.data.data || []).map(u => ({
//           ...u,
//           isOnline: getUserOnlineStatus(u._id),
//           lastSeen: getLastSeen(u._id)
//         }));
//         setAvailableUsers(usersWithStatus);
//       }
//     } catch (error) {
//       console.error('Fetch available users error:', error);
//     }
//   };

//   const fetchMessages = async (chatId, reset = true) => {
//     if (reset) {
//       setMessages([]);
//       setMessagePage(1);
//       setHasMoreMessages(true);
//     }
    
//     setLoadingMessages(true);
//     try {
//       const page = reset ? 1 : messagePage;
//       const response = await chatApi.getChatMessages(chatId, page, 50);
//       if (response.data.success) {
//         const newMessages = response.data.data || [];
//         if (reset) {
//           setMessages(newMessages);
//         } else {
//           setMessages(prev => [...newMessages, ...prev]);
//         }
//         setHasMoreMessages(newMessages.length === 50);
//         setMessagePage(page + 1);
        
//         const socket = getSocket();
//         if (newMessages.length > 0 && socket && socket.connected) {
//           socket.emit('mark_chat_read', { chatId });
//         }
//       }
//     } catch (error) {
//       console.error('Fetch messages error:', error);
//       showToast(error.userMessage || 'Failed to load messages', 'error');
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   const loadMoreMessages = () => {
//     if (!loadingMessages && hasMoreMessages && currentChat) {
//       fetchMessages(currentChat._id, false);
//     }
//   };

//   const selectChat = async (chat) => {
//     if (currentChat?._id === chat._id) return;
    
//     setCurrentChat(chat);
//     await fetchMessages(chat._id, true);
    
//     const socket = getSocket();
//     if (socket && socket.connected) {
//       socket.emit('join_chat', chat._id);
//     }
    
//     setChats(prev => prev.map(c => 
//       c._id === chat._id ? { ...c, unreadCount: 0 } : c
//     ));
//   };

//   const startNewChat = async (targetUserId) => {
//     try {
//       const response = await chatApi.getOrCreateDirectChat(targetUserId);
//       if (response.data.success) {
//         const newChat = response.data.data;
//         setChats(prev => [newChat, ...prev]);
//         await selectChat(newChat);
//         setShowNewChatModal(false);
//         setSearchQuery('');
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || error.userMessage || 'Failed to start chat', 'error');
//     }
//   };

//   const handleNewMessage = (data) => {
//     const { chatId, message } = data;
    
//     setChats(prev => prev.map(chat => {
//       if (chat._id === chatId) {
//         return {
//           ...chat,
//           lastMessage: {
//             message: message.message,
//             senderName: message.senderName,
//             timestamp: message.createdAt
//           },
//           unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount || 0) + 1,
//           updatedAt: message.createdAt
//         };
//       }
//       return chat;
//     }));

//     if (currentChat?._id === chatId) {
//       setMessages(prev => [...prev, message]);
//       const socket = getSocket();
//       if (socket && socket.connected) {
//         socket.emit('message_read', { messageId: message._id, chatId });
//       }
//     }
//   };

//   const updateMessageStatus = (messageId, status) => {
//     setMessages(prev => prev.map(msg => 
//       msg._id === messageId ? { ...msg, status } : msg
//     ));
//   };

//   const sendMessage = async () => {
//     if (!messageInput.trim() || !currentChat || sending) return;
    
//     setSending(true);
//     const messageText = messageInput.trim();
//     setMessageInput('');
    
//     if (isTyping) {
//       setIsTyping(false);
//       sendTypingIndicator(false);
//       if (typingTimeout) clearTimeout(typingTimeout);
//     }
    
//     try {
//       const response = await chatApi.sendMessage(currentChat._id, { message: messageText });
//       if (response.data.success) {
//         const newMessage = response.data.data;
//         setMessages(prev => [...prev, newMessage]);
        
//         const socket = getSocket();
//         if (socket && socket.connected) {
//           socket.emit('new_message', {
//             chatId: currentChat._id,
//             message: newMessage,
//             to: getOtherParticipantId(currentChat)
//           });
//         }
        
//         setChats(prev => prev.map(chat => 
//           chat._id === currentChat._id ? {
//             ...chat,
//             lastMessage: { 
//               message: messageText, 
//               senderName: `${user?.firstName} ${user?.lastName}`,
//               timestamp: new Date() 
//             },
//             updatedAt: new Date()
//           } : chat
//         ));
        
//         scrollToBottom();
//       }
//     } catch (error) {
//       console.error('Send message error:', error);
//       showToast(error.userMessage || 'Failed to send message', 'error');
//       setMessageInput(messageText);
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
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const isToday = date.toDateString() === now.toDateString();
      
//       if (isToday) {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       }
//       return date.toLocaleDateString();
//     } catch (error) {
//       return '';
//     }
//   };

//   const getChatName = (chat) => {
//     if (!chat) return 'Unknown';
//     if (chat.chatType === 'group') {
//       return chat.groupName || 'Group Chat';
//     }
//     const otherParticipant = chat.participants?.find(p => 
//       p.userId?._id !== user?._id && p.userId?._id !== user?.id
//     );
//     if (otherParticipant?.userId) {
//       const participantUser = otherParticipant.userId;
//       return `${participantUser.firstName || ''} ${participantUser.lastName || ''}`.trim() || 'Unknown User';
//     }
//     return 'Unknown User';
//   };

//   const getChatAvatar = (chat) => {
//     if (chat.chatType === 'group') return '👥';
//     return '👤';
//   };

//   const filterAvailableUsers = () => {
//     if (!searchQuery) return availableUsers;
//     return availableUsers.filter(u => 
//       `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.email?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const sortedChats = [...chats].sort((a, b) => {
//     const timeA = a.updatedAt || a.lastMessage?.timestamp;
//     const timeB = b.updatedAt || b.lastMessage?.timestamp;
//     return new Date(timeB) - new Date(timeA);
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <Spinner />
//       </div>
//     );
//   }

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
//             type="button"
//           >
//             ✏️
//           </button>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           {sortedChats.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p className="text-4xl mb-2">💬</p>
//               <p>No conversations yet</p>
//               <button
//                 onClick={() => setShowNewChatModal(true)}
//                 className="text-blue-600 text-sm mt-2 hover:underline"
//                 type="button"
//               >
//                 Start a chat
//               </button>
//             </div>
//           ) : (
//             sortedChats.map(chat => {
//               const otherUserId = getOtherParticipantId(chat);
//               const isOnline = otherUserId ? getUserOnlineStatus(otherUserId) : false;
//               const chatName = getChatName(chat);
//               const lastMessage = chat.lastMessage?.message || 'No messages yet';
//               const lastTime = chat.lastMessage?.timestamp || chat.updatedAt;
              
//               return (
//                 <div
//                   key={chat._id}
//                   onClick={() => selectChat(chat)}
//                   onKeyPress={(e) => e.key === 'Enter' && selectChat(chat)}
//                   role="button"
//                   tabIndex={0}
//                   className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                     currentChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
//                   }`}
//                 >
//                   <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                       {chatName.charAt(0).toUpperCase()}
//                     </div>
//                     {chat.chatType !== 'group' && (
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium text-gray-900 truncate">
//                         {chatName}
//                       </p>
//                       {lastTime && (
//                         <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
//                           {formatTime(lastTime)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <p className="text-sm text-gray-500 truncate flex-1">
//                         {lastMessage}
//                       </p>
//                       {chat.unreadCount > 0 && (
//                         <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2 min-w-[20px] text-center">
//                           {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     {chat.chatType !== 'group' && !isOnline && otherUserId && (
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {formatLastSeen(getLastSeen(otherUserId))}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </Card>

//       {/* Chat Window */}
//       {currentChat ? (
//         <Card className="flex-1 flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="relative flex-shrink-0">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                   {getChatName(currentChat).charAt(0).toUpperCase()}
//                 </div>
//                 {currentChat.chatType !== 'group' && (
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                     getUserOnlineStatus(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
//                   }`} />
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
//                 {currentChat.chatType === 'direct' && (
//                   <p className="text-xs">
//                     {getUserOnlineStatus(getOtherParticipantId(currentChat)) ? (
//                       <span className="text-green-600">● Online</span>
//                     ) : (
//                       <span className="text-gray-500">
//                         {formatLastSeen(getLastSeen(getOtherParticipantId(currentChat)))}
//                       </span>
//                     )}
//                   </p>
//                 )}
//                 {currentChat.chatType === 'group' && (
//                   <p className="text-xs text-gray-500">
//                     {currentChat.participants?.length || 0} members
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div 
//             ref={messagesContainerRef}
//             className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white"
//           >
//             {hasMoreMessages && messages.length >= 50 && (
//               <div className="flex justify-center">
//                 <button
//                   onClick={loadMoreMessages}
//                   disabled={loadingMessages}
//                   className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
//                   type="button"
//                 >
//                   {loadingMessages ? 'Loading...' : 'Load more messages'}
//                 </button>
//               </div>
//             )}
            
//             {messages.length === 0 && !loadingMessages ? (
//               <div className="flex flex-col items-center justify-center h-full text-center">
//                 <div className="text-5xl mb-4">💬</div>
//                 <p className="text-gray-500">No messages yet</p>
//                 <p className="text-sm text-gray-400">Send a message to start the conversation</p>
//               </div>
//             ) : (
//               messages.map((msg, idx) => {
//                 const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id || msg.senderId === user?.id;
//                 return (
//                   <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 shadow-sm'} rounded-2xl p-3`}>
//                       {!isOwn && currentChat.chatType === 'group' && (
//                         <p className="text-xs font-medium mb-1 text-blue-600">{msg.senderName}</p>
//                       )}
//                       <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
//                       <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
//                         {formatTime(msg.createdAt)}
//                         {isOwn && msg.status === 'read' && <span>✓✓</span>}
//                         {isOwn && msg.status === 'delivered' && <span>✓✓</span>}
//                         {isOwn && msg.status === 'sent' && <span>✓</span>}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
            
//             {userTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white shadow-sm rounded-2xl p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                     <span className="text-xs text-gray-500 ml-1">{userTyping.userName} is typing...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {sending && (
//               <div className="flex justify-end">
//                 <div className="bg-gray-200 rounded-2xl p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t bg-white">
//             <div className="flex gap-2">
//               <textarea
//                 value={messageInput}
//                 onChange={handleMessageInputChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 rows={1}
//                 style={{ maxHeight: '100px', overflow: 'auto' }}
//                 onInput={(e) => {
//                   const target = e.target;
//                   target.style.height = 'auto';
//                   target.style.height = Math.min(target.scrollHeight, 100) + 'px';
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={sending || !messageInput.trim()}
//                 className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
//                 type="button"
//               >
//                 <span>Send</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </Card>
//       ) : (
//         <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//           <div className="text-center">
//             <div className="text-6xl mb-4">💬</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Chat</h3>
//             <p className="text-gray-500 mb-4">Select a conversation or start a new chat</p>
//             <button
//               onClick={() => setShowNewChatModal(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//               type="button"
//             >
//               Start New Chat
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* New Chat Modal */}
//       <Modal isOpen={showNewChatModal} onClose={() => {
//         setShowNewChatModal(false);
//         setSearchQuery('');
//       }} title="New Chat">
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Search users by name or email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             autoFocus
//           />
//           <div className="space-y-2 max-h-96 overflow-y-auto">
//             {filterAvailableUsers().length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No users found</p>
//                 {searchQuery && (
//                   <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
//                 )}
//               </div>
//             ) : (
//               filterAvailableUsers().map(userItem => {
//                 const isOnline = getUserOnlineStatus(userItem._id);
//                 const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.trim();
//                 return (
//                   <div
//                     key={userItem._id}
//                     onClick={() => startNewChat(userItem._id)}
//                     onKeyPress={(e) => e.key === 'Enter' && startNewChat(userItem._id)}
//                     role="button"
//                     tabIndex={0}
//                     className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all hover:shadow-sm"
//                   >
//                     <div className="relative flex-shrink-0">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
//                         {fullName.charAt(0).toUpperCase() || 'U'}
//                       </div>
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <p className="font-medium text-gray-900 truncate">
//                           {fullName || 'Unknown User'}
//                         </p>
//                         {isOnline && <span className="text-xs text-green-600">Online</span>}
//                       </div>
//                       <p className="text-sm text-gray-500 capitalize">{userItem.role || 'User'}</p>
//                       {!isOnline && (
//                         <p className="text-xs text-gray-400">
//                           {formatLastSeen(getLastSeen(userItem._id))}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </Modal>

//       {/* CSS Animations - Removed jsx attribute */}
//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//         @keyframes bounce {
//           0%, 60%, 100% {
//             transform: translateY(0);
//           }
//           30% {
//             transform: translateY(-10px);
//           }
//         }
//         .animate-bounce {
//           animation: bounce 1.4s infinite ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatModule;














// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { useAuth } from '../../hooks/useAuth';
// import { useToast } from '../../hooks/useToast';
// import { chatApi } from '../../api/chat.api';
// import { userApi } from '../../api/user.api';
// import Card from '../../components/common/Card';
// import Button from '../../components/common/Button';
// import Spinner from '../../components/common/Spinner';
// import Modal from '../../components/common/Modal';
// import { getSocket, disconnectSocket, onSocketEvent, offSocketEvent } from '../../utils/socket';

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
//   const [onlineUsers, setOnlineUsers] = useState(new Map());
//   const [isTyping, setIsTyping] = useState(false);
//   const [typingTimeout, setTypingTimeout] = useState(null);
//   const [userTyping, setUserTyping] = useState(null);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [loadingMessages, setLoadingMessages] = useState(false);
//   const [messagePage, setMessagePage] = useState(1);
//   const [hasMoreMessages, setHasMoreMessages] = useState(true);
//   const messagesEndRef = useRef(null);
//   const messagesContainerRef = useRef(null);
//   const heartbeatIntervalRef = useRef(null);
//   const unsubscribeFunctions = useRef([]);

//   // Initialize socket connection
//   useEffect(() => {
//     if (user?._id) {
//       initSocket();
//       fetchChats();
//       fetchAvailableUsers();
//       fetchOnlineUsers();
//       startHeartbeat();
//     }

//     return () => {
//       // Clean up socket listeners
//       unsubscribeFunctions.current.forEach(unsubscribe => {
//         if (typeof unsubscribe === 'function') unsubscribe();
//       });
//       unsubscribeFunctions.current = [];
      
//       if (heartbeatIntervalRef.current) {
//         clearInterval(heartbeatIntervalRef.current);
//       }
//     };
//   }, [user?._id]);

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   // Heartbeat to keep user online status
//   const startHeartbeat = () => {
//     heartbeatIntervalRef.current = setInterval(async () => {
//       try {
//         await userApi.updateHeartbeat();
//       } catch (error) {
//         console.error('Heartbeat error:', error);
//       }
//     }, 30000);
//   };

//   const initSocket = () => {
//     if (!user?._id) return;
    
//     const socket = getSocket();
    
//     // Socket event listeners with cleanup
//     const unsubscribeNewMessage = onSocketEvent('new_message', handleNewMessage);
//     const unsubscribeMessageRead = onSocketEvent('message_read', (data) => updateMessageStatus(data.messageId, 'read'));
//     const unsubscribeMessageDelivered = onSocketEvent('message_delivered', (data) => updateMessageStatus(data.messageId, 'delivered'));
//     const unsubscribeUserStatus = onSocketEvent('user_status_change', (data) => updateUserOnlineStatus(data.userId, data.status === 'online', data.lastSeen));
    
//     // 🔴 FIXED: online_users handler - properly extracts user names
//     const unsubscribeOnlineUsers = onSocketEvent('online_users', (users) => {
//       console.log('👥 Received online users from socket:', users);
//       const statusMap = new Map();
//       const userList = Array.isArray(users) ? users : [];
//       userList.forEach(userData => {
//         const userId = userData.userId || userData._id;
//         const userName = userData.userName || userData.name || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || 'User';
//         statusMap.set(userId, {
//           isOnline: true,
//           lastSeen: userData.lastSeen || userData.connectedAt || new Date(),
//           userName: userName,
//           userRole: userData.userRole || userData.role
//         });
//       });
//       setOnlineUsers(statusMap);
//     });
    
//     const unsubscribeUserTyping = onSocketEvent('user_typing', (data) => {
//       if (currentChat?._id === data.chatId && data.userId !== user?._id) {
//         setUserTyping(data);
//         setTimeout(() => setUserTyping(null), 2000);
//       }
//     });
    
//     unsubscribeFunctions.current = [
//       unsubscribeNewMessage,
//       unsubscribeMessageRead,
//       unsubscribeMessageDelivered,
//       unsubscribeUserStatus,
//       unsubscribeOnlineUsers,
//       unsubscribeUserTyping
//     ];
    
//     // Join user's personal room
//     if (socket && socket.connected) {
//       socket.emit('join_user_room', user?._id);
//     }
//   };

//   // 🔴 FIXED: fetchOnlineUsers - properly formats user names
//   const fetchOnlineUsers = async () => {
//     try {
//       const response = await userApi.getOnlineUsers();
//       console.log('📡 Online users API response:', response.data);
//       if (response.data.success) {
//         const statusMap = new Map();
//         const users = response.data.data || [];
//         users.forEach(userData => {
//           const fullName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
//           statusMap.set(userData._id, {
//             isOnline: true,
//             lastSeen: userData.lastSeen || new Date(),
//             userName: fullName || userData.name || userData.userName || userData.email || 'User',
//             userRole: userData.role
//           });
//         });
//         console.log('✅ Online users map:', statusMap);
//         setOnlineUsers(statusMap);
//       }
//     } catch (error) {
//       console.error('Fetch online users error:', error);
//     }
//   };

//   const updateUserOnlineStatus = (userId, isOnline, lastSeen) => {
//     setOnlineUsers(prev => {
//       const newMap = new Map(prev);
//       const existing = newMap.get(userId) || {};
//       newMap.set(userId, {
//         ...existing,
//         isOnline,
//         lastSeen: lastSeen || new Date()
//       });
//       return newMap;
//     });

//     setAvailableUsers(prev => prev.map(u => 
//       u._id === userId ? { ...u, isOnline, lastSeen } : u
//     ));

//     setChats(prev => prev.map(chat => {
//       const otherUserId = getOtherParticipantId(chat);
//       if (otherUserId === userId) {
//         return { ...chat, otherUserOnline: isOnline };
//       }
//       return chat;
//     }));
//   };

//   const getOtherParticipantId = (chat) => {
//     if (!chat || chat.chatType === 'group') return null;
//     const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
//     return otherParticipant?.userId?._id || otherParticipant?.userId;
//   };

//   const getUserOnlineStatus = (userId) => {
//     const status = onlineUsers.get(userId);
//     return status?.isOnline || false;
//   };

//   const getUserName = (userId) => {
//     const status = onlineUsers.get(userId);
//     return status?.userName || 'User';
//   };

//   const getLastSeen = (userId) => {
//     const status = onlineUsers.get(userId);
//     if (!status || !status.lastSeen) return null;
//     return status.lastSeen;
//   };

//   const formatLastSeen = (lastSeen) => {
//     if (!lastSeen) return 'Offline';
    
//     const now = new Date();
//     const lastSeenDate = new Date(lastSeen);
//     const diffMinutes = Math.floor((now - lastSeenDate) / (1000 * 60));
    
//     if (diffMinutes < 1) return 'Just now';
//     if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
//     if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
//     return `${Math.floor(diffMinutes / 1440)} days ago`;
//   };

//   const sendTypingIndicator = (isTypingNow) => {
//     const socket = getSocket();
//     if (!currentChat || !socket || !socket.connected) return;
    
//     socket.emit('typing', { 
//       chatId: currentChat._id, 
//       to: getOtherParticipantId(currentChat),
//       name: `${user?.firstName} ${user?.lastName}`,
//       isTyping: isTypingNow
//     });
//   };

//   const handleMessageInputChange = (e) => {
//     setMessageInput(e.target.value);
    
//     if (!isTyping && e.target.value.trim()) {
//       setIsTyping(true);
//       sendTypingIndicator(true);
//     }
    
//     if (typingTimeout) clearTimeout(typingTimeout);
    
//     const newTimeout = setTimeout(() => {
//       if (isTyping) {
//         setIsTyping(false);
//         sendTypingIndicator(false);
//       }
//     }, 2000);
    
//     setTypingTimeout(newTimeout);
//   };

//   const scrollToBottom = () => {
//     setTimeout(() => {
//       messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }, 100);
//   };

//   const fetchChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
//       if (response.data.success) {
//         const chatsWithStatus = (response.data.data || []).map(chat => {
//           const otherUserId = getOtherParticipantId(chat);
//           return {
//             ...chat,
//             otherUserOnline: otherUserId ? getUserOnlineStatus(otherUserId) : false,
//             unreadCount: chat.unreadCount || 0
//           };
//         });
//         setChats(chatsWithStatus);
//       }
//     } catch (error) {
//       console.error('Fetch chats error:', error);
//       showToast(error.userMessage || 'Failed to load chats', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchAvailableUsers = async () => {
//     try {
//       const response = await chatApi.getAvailableUsers();
//       if (response.data.success) {
//         const usersWithStatus = (response.data.data || []).map(u => ({
//           ...u,
//           isOnline: getUserOnlineStatus(u._id),
//           lastSeen: getLastSeen(u._id),
//           fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim()
//         }));
//         setAvailableUsers(usersWithStatus);
//       }
//     } catch (error) {
//       console.error('Fetch available users error:', error);
//     }
//   };

//   const fetchMessages = async (chatId, reset = true) => {
//     if (reset) {
//       setMessages([]);
//       setMessagePage(1);
//       setHasMoreMessages(true);
//     }
    
//     setLoadingMessages(true);
//     try {
//       const page = reset ? 1 : messagePage;
//       const response = await chatApi.getChatMessages(chatId, page, 50);
//       if (response.data.success) {
//         const newMessages = response.data.data || [];
//         if (reset) {
//           setMessages(newMessages);
//         } else {
//           setMessages(prev => [...newMessages, ...prev]);
//         }
//         setHasMoreMessages(newMessages.length === 50);
//         setMessagePage(page + 1);
        
//         const socket = getSocket();
//         if (newMessages.length > 0 && socket && socket.connected) {
//           socket.emit('mark_chat_read', { chatId });
//         }
//       }
//     } catch (error) {
//       console.error('Fetch messages error:', error);
//       showToast(error.userMessage || 'Failed to load messages', 'error');
//     } finally {
//       setLoadingMessages(false);
//     }
//   };

//   const loadMoreMessages = () => {
//     if (!loadingMessages && hasMoreMessages && currentChat) {
//       fetchMessages(currentChat._id, false);
//     }
//   };

//   const selectChat = async (chat) => {
//     if (currentChat?._id === chat._id) return;
    
//     setCurrentChat(chat);
//     await fetchMessages(chat._id, true);
    
//     const socket = getSocket();
//     if (socket && socket.connected) {
//       socket.emit('join_chat', chat._id);
//     }
    
//     setChats(prev => prev.map(c => 
//       c._id === chat._id ? { ...c, unreadCount: 0 } : c
//     ));
//   };

//   const startNewChat = async (targetUserId) => {
//     try {
//       const response = await chatApi.getOrCreateDirectChat(targetUserId);
//       if (response.data.success) {
//         const newChat = response.data.data;
//         setChats(prev => [newChat, ...prev]);
//         await selectChat(newChat);
//         setShowNewChatModal(false);
//         setSearchQuery('');
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || error.userMessage || 'Failed to start chat', 'error');
//     }
//   };

//   const handleNewMessage = (data) => {
//     const { chatId, message } = data;
    
//     setChats(prev => prev.map(chat => {
//       if (chat._id === chatId) {
//         return {
//           ...chat,
//           lastMessage: {
//             message: message.message,
//             senderName: message.senderName,
//             timestamp: message.createdAt
//           },
//           unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount || 0) + 1,
//           updatedAt: message.createdAt
//         };
//       }
//       return chat;
//     }));

//     if (currentChat?._id === chatId) {
//       setMessages(prev => [...prev, message]);
//       const socket = getSocket();
//       if (socket && socket.connected) {
//         socket.emit('message_read', { messageId: message._id, chatId });
//       }
//     }
//   };

//   const updateMessageStatus = (messageId, status) => {
//     setMessages(prev => prev.map(msg => 
//       msg._id === messageId ? { ...msg, status } : msg
//     ));
//   };

//   const sendMessage = async () => {
//     if (!messageInput.trim() || !currentChat || sending) return;
    
//     setSending(true);
//     const messageText = messageInput.trim();
//     setMessageInput('');
    
//     if (isTyping) {
//       setIsTyping(false);
//       sendTypingIndicator(false);
//       if (typingTimeout) clearTimeout(typingTimeout);
//     }
    
//     try {
//       const response = await chatApi.sendMessage(currentChat._id, { message: messageText });
//       if (response.data.success) {
//         const newMessage = response.data.data;
//         setMessages(prev => [...prev, newMessage]);
        
//         const socket = getSocket();
//         if (socket && socket.connected) {
//           socket.emit('new_message', {
//             chatId: currentChat._id,
//             message: newMessage,
//             to: getOtherParticipantId(currentChat)
//           });
//         }
        
//         setChats(prev => prev.map(chat => 
//           chat._id === currentChat._id ? {
//             ...chat,
//             lastMessage: { 
//               message: messageText, 
//               senderName: `${user?.firstName} ${user?.lastName}`,
//               timestamp: new Date() 
//             },
//             updatedAt: new Date()
//           } : chat
//         ));
        
//         scrollToBottom();
//       }
//     } catch (error) {
//       console.error('Send message error:', error);
//       showToast(error.userMessage || 'Failed to send message', 'error');
//       setMessageInput(messageText);
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
//     if (!dateString) return '';
//     try {
//       const date = new Date(dateString);
//       const now = new Date();
//       const isToday = date.toDateString() === now.toDateString();
      
//       if (isToday) {
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//       }
//       return date.toLocaleDateString();
//     } catch (error) {
//       return '';
//     }
//   };

//   const getChatName = (chat) => {
//     if (!chat) return 'Unknown';
//     if (chat.chatType === 'group') {
//       return chat.groupName || 'Group Chat';
//     }
//     const otherParticipant = chat.participants?.find(p => 
//       p.userId?._id !== user?._id && p.userId?._id !== user?.id
//     );
//     if (otherParticipant?.userId) {
//       const participantUser = otherParticipant.userId;
//       return `${participantUser.firstName || ''} ${participantUser.lastName || ''}`.trim() || 'Unknown User';
//     }
//     return 'Unknown User';
//   };

//   const getChatAvatar = (chat) => {
//     if (chat.chatType === 'group') return '👥';
//     return '👤';
//   };

//   const filterAvailableUsers = () => {
//     if (!searchQuery) return availableUsers;
//     return availableUsers.filter(u => 
//       `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       u.email?.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   const sortedChats = [...chats].sort((a, b) => {
//     const timeA = a.updatedAt || a.lastMessage?.timestamp;
//     const timeB = b.updatedAt || b.lastMessage?.timestamp;
//     return new Date(timeB) - new Date(timeA);
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <Spinner />
//       </div>
//     );
//   }

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
//             type="button"
//           >
//             ✏️
//           </button>
//         </div>
        
//         <div className="flex-1 overflow-y-auto">
//           {sortedChats.length === 0 ? (
//             <div className="text-center py-8 text-gray-500">
//               <p className="text-4xl mb-2">💬</p>
//               <p>No conversations yet</p>
//               <button
//                 onClick={() => setShowNewChatModal(true)}
//                 className="text-blue-600 text-sm mt-2 hover:underline"
//                 type="button"
//               >
//                 Start a chat
//               </button>
//             </div>
//           ) : (
//             sortedChats.map(chat => {
//               const otherUserId = getOtherParticipantId(chat);
//               const isOnline = otherUserId ? getUserOnlineStatus(otherUserId) : false;
//               const chatName = getChatName(chat);
//               const lastMessage = chat.lastMessage?.message || 'No messages yet';
//               const lastTime = chat.lastMessage?.timestamp || chat.updatedAt;
              
//               return (
//                 <div
//                   key={chat._id}
//                   onClick={() => selectChat(chat)}
//                   onKeyPress={(e) => e.key === 'Enter' && selectChat(chat)}
//                   role="button"
//                   tabIndex={0}
//                   className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
//                     currentChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
//                   }`}
//                 >
//                   <div className="relative flex-shrink-0">
//                     <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                       {chatName.charAt(0).toUpperCase()}
//                     </div>
//                     {chat.chatType !== 'group' && (
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     )}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex justify-between items-start">
//                       <p className="font-medium text-gray-900 truncate">
//                         {chatName}
//                       </p>
//                       {lastTime && (
//                         <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
//                           {formatTime(lastTime)}
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex justify-between items-center">
//                       <p className="text-sm text-gray-500 truncate flex-1">
//                         {lastMessage}
//                       </p>
//                       {chat.unreadCount > 0 && (
//                         <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2 min-w-[20px] text-center">
//                           {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
//                         </span>
//                       )}
//                     </div>
//                     {chat.chatType !== 'group' && !isOnline && otherUserId && (
//                       <p className="text-xs text-gray-400 mt-0.5">
//                         {formatLastSeen(getLastSeen(otherUserId))}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       </Card>

//       {/* Chat Window */}
//       {currentChat ? (
//         <Card className="flex-1 flex flex-col overflow-hidden">
//           {/* Chat Header */}
//           <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="relative flex-shrink-0">
//                 <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
//                   {getChatName(currentChat).charAt(0).toUpperCase()}
//                 </div>
//                 {currentChat.chatType !== 'group' && (
//                   <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                     getUserOnlineStatus(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
//                   }`} />
//                 )}
//               </div>
//               <div>
//                 <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
//                 {currentChat.chatType === 'direct' && (
//                   <p className="text-xs">
//                     {getUserOnlineStatus(getOtherParticipantId(currentChat)) ? (
//                       <span className="text-green-600">● Online</span>
//                     ) : (
//                       <span className="text-gray-500">
//                         {formatLastSeen(getLastSeen(getOtherParticipantId(currentChat)))}
//                       </span>
//                     )}
//                   </p>
//                 )}
//                 {currentChat.chatType === 'group' && (
//                   <p className="text-xs text-gray-500">
//                     {currentChat.participants?.length || 0} members
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Messages Area */}
//           <div 
//             ref={messagesContainerRef}
//             className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white"
//           >
//             {hasMoreMessages && messages.length >= 50 && (
//               <div className="flex justify-center">
//                 <button
//                   onClick={loadMoreMessages}
//                   disabled={loadingMessages}
//                   className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
//                   type="button"
//                 >
//                   {loadingMessages ? 'Loading...' : 'Load more messages'}
//                 </button>
//               </div>
//             )}
            
//             {messages.length === 0 && !loadingMessages ? (
//               <div className="flex flex-col items-center justify-center h-full text-center">
//                 <div className="text-5xl mb-4">💬</div>
//                 <p className="text-gray-500">No messages yet</p>
//                 <p className="text-sm text-gray-400">Send a message to start the conversation</p>
//               </div>
//             ) : (
//               messages.map((msg, idx) => {
//                 const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id || msg.senderId === user?.id;
//                 return (
//                   <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
//                     <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 shadow-sm'} rounded-2xl p-3`}>
//                       {!isOwn && currentChat.chatType === 'group' && (
//                         <p className="text-xs font-medium mb-1 text-blue-600">{msg.senderName}</p>
//                       )}
//                       <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
//                       <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
//                         {formatTime(msg.createdAt)}
//                         {isOwn && msg.status === 'read' && <span>✓✓</span>}
//                         {isOwn && msg.status === 'delivered' && <span>✓✓</span>}
//                         {isOwn && msg.status === 'sent' && <span>✓</span>}
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
            
//             {userTyping && (
//               <div className="flex justify-start">
//                 <div className="bg-white shadow-sm rounded-2xl p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                     <span className="text-xs text-gray-500 ml-1">{userTyping.userName} is typing...</span>
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             {sending && (
//               <div className="flex justify-end">
//                 <div className="bg-gray-200 rounded-2xl p-3">
//                   <div className="flex items-center gap-1">
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
//                     <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
//                   </div>
//                 </div>
//               </div>
//             )}
            
//             <div ref={messagesEndRef} />
//           </div>

//           {/* Message Input */}
//           <div className="p-4 border-t bg-white">
//             <div className="flex gap-2">
//               <textarea
//                 value={messageInput}
//                 onChange={handleMessageInputChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder="Type a message..."
//                 className="flex-1 px-4 py-2 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
//                 rows={1}
//                 style={{ maxHeight: '100px', overflow: 'auto' }}
//                 onInput={(e) => {
//                   const target = e.target;
//                   target.style.height = 'auto';
//                   target.style.height = Math.min(target.scrollHeight, 100) + 'px';
//                 }}
//               />
//               <button
//                 onClick={sendMessage}
//                 disabled={sending || !messageInput.trim()}
//                 className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
//                 type="button"
//               >
//                 <span>Send</span>
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         </Card>
//       ) : (
//         <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
//           <div className="text-center">
//             <div className="text-6xl mb-4">💬</div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Chat</h3>
//             <p className="text-gray-500 mb-4">Select a conversation or start a new chat</p>
//             <button
//               onClick={() => setShowNewChatModal(true)}
//               className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
//               type="button"
//             >
//               Start New Chat
//             </button>
//           </div>
//         </Card>
//       )}

//       {/* New Chat Modal */}
//       <Modal isOpen={showNewChatModal} onClose={() => {
//         setShowNewChatModal(false);
//         setSearchQuery('');
//       }} title="New Chat">
//         <div className="space-y-4">
//           <input
//             type="text"
//             placeholder="Search users by name or email..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             autoFocus
//           />
//           <div className="space-y-2 max-h-96 overflow-y-auto">
//             {filterAvailableUsers().length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">No users found</p>
//                 {searchQuery && (
//                   <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
//                 )}
//               </div>
//             ) : (
//               filterAvailableUsers().map(userItem => {
//                 const isOnline = getUserOnlineStatus(userItem._id);
//                 const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.trim();
//                 return (
//                   <div
//                     key={userItem._id}
//                     onClick={() => startNewChat(userItem._id)}
//                     onKeyPress={(e) => e.key === 'Enter' && startNewChat(userItem._id)}
//                     role="button"
//                     tabIndex={0}
//                     className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all hover:shadow-sm"
//                   >
//                     <div className="relative flex-shrink-0">
//                       <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
//                         {fullName.charAt(0).toUpperCase() || 'U'}
//                       </div>
//                       <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
//                         isOnline ? 'bg-green-500' : 'bg-gray-400'
//                       }`} />
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <div className="flex justify-between items-center">
//                         <p className="font-medium text-gray-900 truncate">
//                           {fullName || 'Unknown User'}
//                         </p>
//                         {isOnline && <span className="text-xs text-green-600">Online</span>}
//                       </div>
//                       <p className="text-sm text-gray-500 capitalize">{userItem.role || 'User'}</p>
//                       {!isOnline && (
//                         <p className="text-xs text-gray-400">
//                           {formatLastSeen(getLastSeen(userItem._id))}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>
//         </div>
//       </Modal>

//       {/* CSS Animations - Removed jsx attribute */}
//       <style>{`
//         @keyframes fade-in {
//           from {
//             opacity: 0;
//             transform: translateY(10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fade-in {
//           animation: fade-in 0.3s ease-out;
//         }
//         @keyframes bounce {
//           0%, 60%, 100% {
//             transform: translateY(0);
//           }
//           30% {
//             transform: translateY(-10px);
//           }
//         }
//         .animate-bounce {
//           animation: bounce 1.4s infinite ease-in-out;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default ChatModule;















import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { chatApi } from '../../api/chat.api';
import { userApi } from '../../api/user.api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { getSocket, disconnectSocket, onSocketEvent, offSocketEvent } from '../../utils/socket';

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
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagePage, setMessagePage] = useState(1);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const unsubscribeFunctions = useRef([]);

  // Initialize socket connection
  useEffect(() => {
    if (user?._id) {
      initSocket();
      fetchChats();
      fetchAvailableUsers();
      fetchOnlineUsers();
      startHeartbeat();
    }

    return () => {
      // Clean up socket listeners
      unsubscribeFunctions.current.forEach(unsubscribe => {
        if (typeof unsubscribe === 'function') unsubscribe();
      });
      unsubscribeFunctions.current = [];
      
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
    };
  }, [user?._id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Heartbeat to keep user online status
  const startHeartbeat = () => {
    heartbeatIntervalRef.current = setInterval(async () => {
      try {
        await userApi.updateHeartbeat();
      } catch (error) {
        console.error('Heartbeat error:', error);
      }
    }, 30000);
  };

  const initSocket = () => {
    if (!user?._id) return;
    
    const socket = getSocket();
    
    // Socket event listeners with cleanup
    const unsubscribeNewMessage = onSocketEvent('new_message', handleNewMessage);
    const unsubscribeMessageRead = onSocketEvent('message_read', (data) => updateMessageStatus(data.messageId, 'read'));
    const unsubscribeMessageDelivered = onSocketEvent('message_delivered', (data) => updateMessageStatus(data.messageId, 'delivered'));
    const unsubscribeUserStatus = onSocketEvent('user_status_change', (data) => updateUserOnlineStatus(data.userId, data.status === 'online', data.lastSeen));
    
    // 🔴 FIXED: online_users handler - properly extracts user names
    const unsubscribeOnlineUsers = onSocketEvent('online_users', (users) => {
      console.log('👥 Received online users from socket:', users);
      const statusMap = new Map();
      const userList = Array.isArray(users) ? users : [];
      userList.forEach(userData => {
        const userId = userData.userId || userData._id;
        // 🔴 FIX: Extract name from multiple possible formats
        let userName = userData.userName || userData.name;
        if (!userName && (userData.firstName || userData.lastName)) {
          userName = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
        }
        if (!userName) {
          userName = userData.email || 'User';
        }
        statusMap.set(userId, {
          isOnline: true,
          lastSeen: userData.lastSeen || userData.connectedAt || new Date(),
          userName: userName,
          userRole: userData.userRole || userData.role,
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email
        });
      });
      console.log('✅ Online users map size:', statusMap.size);
      setOnlineUsers(statusMap);
    });
    
    const unsubscribeUserTyping = onSocketEvent('user_typing', (data) => {
      if (currentChat?._id === data.chatId && data.userId !== user?._id) {
        setUserTyping(data);
        setTimeout(() => setUserTyping(null), 2000);
      }
    });
    
    unsubscribeFunctions.current = [
      unsubscribeNewMessage,
      unsubscribeMessageRead,
      unsubscribeMessageDelivered,
      unsubscribeUserStatus,
      unsubscribeOnlineUsers,
      unsubscribeUserTyping
    ];
    
    // Join user's personal room
    if (socket && socket.connected) {
      socket.emit('join_user_room', user?._id);
      console.log('✅ Joined user room:', user?._id);
    }
  };

  // 🔴 FIXED: fetchOnlineUsers - properly formats user names from API response
  const fetchOnlineUsers = async () => {
    try {
      const response = await userApi.getOnlineUsers();
      console.log('📡 Online users API response:', response.data);
      
      if (response.data.success) {
        const statusMap = new Map();
        const users = response.data.data || [];
        
        users.forEach(userData => {
          // 🔴 FIX: Properly extract user name from API response
          const firstName = userData.firstName || '';
          const lastName = userData.lastName || '';
          const fullName = `${firstName} ${lastName}`.trim();
          const displayName = fullName || userData.name || userData.userName || userData.email || 'User';
          
          statusMap.set(userData._id, {
            isOnline: true,
            lastSeen: userData.lastSeen || new Date(),
            userName: displayName,
            userRole: userData.role,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
          });
        });
        
        console.log('✅ Online users map:', Array.from(statusMap.entries()));
        setOnlineUsers(statusMap);
        
        // Also update available users list with online status
        setAvailableUsers(prev => prev.map(user => ({
          ...user,
          isOnline: statusMap.has(user._id),
          lastSeen: statusMap.get(user._id)?.lastSeen
        })));
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

    setAvailableUsers(prev => prev.map(u => 
      u._id === userId ? { ...u, isOnline, lastSeen } : u
    ));

    setChats(prev => prev.map(chat => {
      const otherUserId = getOtherParticipantId(chat);
      if (otherUserId === userId) {
        return { ...chat, otherUserOnline: isOnline };
      }
      return chat;
    }));
  };

  const getOtherParticipantId = (chat) => {
    if (!chat || chat.chatType === 'group') return null;
    const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
    return otherParticipant?.userId?._id || otherParticipant?.userId;
  };

  const getUserOnlineStatus = (userId) => {
    const status = onlineUsers.get(userId);
    return status?.isOnline || false;
  };

  const getUserName = (userId) => {
    const status = onlineUsers.get(userId);
    return status?.userName || 'User';
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
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} hours ago`;
    return `${Math.floor(diffMinutes / 1440)} days ago`;
  };

  const sendTypingIndicator = (isTypingNow) => {
    const socket = getSocket();
    if (!currentChat || !socket || !socket.connected) return;
    
    socket.emit('typing', { 
      chatId: currentChat._id, 
      to: getOtherParticipantId(currentChat),
      name: `${user?.firstName} ${user?.lastName}`,
      isTyping: isTypingNow
    });
  };

  const handleMessageInputChange = (e) => {
    setMessageInput(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      sendTypingIndicator(true);
    }
    
    if (typingTimeout) clearTimeout(typingTimeout);
    
    const newTimeout = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        sendTypingIndicator(false);
      }
    }, 2000);
    
    setTypingTimeout(newTimeout);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const fetchChats = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getUserChats();
      if (response.data.success) {
        const chatsWithStatus = (response.data.data || []).map(chat => {
          const otherUserId = getOtherParticipantId(chat);
          return {
            ...chat,
            otherUserOnline: otherUserId ? getUserOnlineStatus(otherUserId) : false,
            unreadCount: chat.unreadCount || 0
          };
        });
        setChats(chatsWithStatus);
      }
    } catch (error) {
      console.error('Fetch chats error:', error);
      showToast(error.userMessage || 'Failed to load chats', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await chatApi.getAvailableUsers();
      if (response.data.success) {
        const usersWithStatus = (response.data.data || []).map(u => ({
          ...u,
          isOnline: getUserOnlineStatus(u._id),
          lastSeen: getLastSeen(u._id),
          fullName: `${u.firstName || ''} ${u.lastName || ''}`.trim()
        }));
        setAvailableUsers(usersWithStatus);
      }
    } catch (error) {
      console.error('Fetch available users error:', error);
    }
  };

  const fetchMessages = async (chatId, reset = true) => {
    if (reset) {
      setMessages([]);
      setMessagePage(1);
      setHasMoreMessages(true);
    }
    
    setLoadingMessages(true);
    try {
      const page = reset ? 1 : messagePage;
      const response = await chatApi.getChatMessages(chatId, page, 50);
      if (response.data.success) {
        const newMessages = response.data.data || [];
        if (reset) {
          setMessages(newMessages);
        } else {
          setMessages(prev => [...newMessages, ...prev]);
        }
        setHasMoreMessages(newMessages.length === 50);
        setMessagePage(page + 1);
        
        const socket = getSocket();
        if (newMessages.length > 0 && socket && socket.connected) {
          socket.emit('mark_chat_read', { chatId });
        }
      }
    } catch (error) {
      console.error('Fetch messages error:', error);
      showToast(error.userMessage || 'Failed to load messages', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  const loadMoreMessages = () => {
    if (!loadingMessages && hasMoreMessages && currentChat) {
      fetchMessages(currentChat._id, false);
    }
  };

  const selectChat = async (chat) => {
    if (currentChat?._id === chat._id) return;
    
    setCurrentChat(chat);
    await fetchMessages(chat._id, true);
    
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit('join_chat', chat._id);
    }
    
    setChats(prev => prev.map(c => 
      c._id === chat._id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const startNewChat = async (targetUserId) => {
    try {
      const response = await chatApi.getOrCreateDirectChat(targetUserId);
      if (response.data.success) {
        const newChat = response.data.data;
        setChats(prev => [newChat, ...prev]);
        await selectChat(newChat);
        setShowNewChatModal(false);
        setSearchQuery('');
      }
    } catch (error) {
      showToast(error.response?.data?.error || error.userMessage || 'Failed to start chat', 'error');
    }
  };

  const handleNewMessage = (data) => {
    const { chatId, message } = data;
    
    setChats(prev => prev.map(chat => {
      if (chat._id === chatId) {
        return {
          ...chat,
          lastMessage: {
            message: message.message,
            senderName: message.senderName,
            timestamp: message.createdAt
          },
          unreadCount: chat._id === currentChat?._id ? 0 : (chat.unreadCount || 0) + 1,
          updatedAt: message.createdAt
        };
      }
      return chat;
    }));

    if (currentChat?._id === chatId) {
      setMessages(prev => [...prev, message]);
      const socket = getSocket();
      if (socket && socket.connected) {
        socket.emit('message_read', { messageId: message._id, chatId });
      }
    }
  };

  const updateMessageStatus = (messageId, status) => {
    setMessages(prev => prev.map(msg => 
      msg._id === messageId ? { ...msg, status } : msg
    ));
  };

  const sendMessage = async () => {
    if (!messageInput.trim() || !currentChat || sending) return;
    
    setSending(true);
    const messageText = messageInput.trim();
    setMessageInput('');
    
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
        
        const socket = getSocket();
        if (socket && socket.connected) {
          socket.emit('new_message', {
            chatId: currentChat._id,
            message: newMessage,
            to: getOtherParticipantId(currentChat)
          });
        }
        
        setChats(prev => prev.map(chat => 
          chat._id === currentChat._id ? {
            ...chat,
            lastMessage: { 
              message: messageText, 
              senderName: `${user?.firstName} ${user?.lastName}`,
              timestamp: new Date() 
            },
            updatedAt: new Date()
          } : chat
        ));
        
        scrollToBottom();
      }
    } catch (error) {
      console.error('Send message error:', error);
      showToast(error.userMessage || 'Failed to send message', 'error');
      setMessageInput(messageText);
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
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      
      if (isToday) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
      return date.toLocaleDateString();
    } catch (error) {
      return '';
    }
  };

  const getChatName = (chat) => {
    if (!chat) return 'Unknown';
    if (chat.chatType === 'group') {
      return chat.groupName || 'Group Chat';
    }
    const otherParticipant = chat.participants?.find(p => 
      p.userId?._id !== user?._id && p.userId?._id !== user?.id
    );
    if (otherParticipant?.userId) {
      const participantUser = otherParticipant.userId;
      return `${participantUser.firstName || ''} ${participantUser.lastName || ''}`.trim() || 'Unknown User';
    }
    return 'Unknown User';
  };

  const getChatAvatar = (chat) => {
    if (chat.chatType === 'group') return '👥';
    return '👤';
  };

  const filterAvailableUsers = () => {
    if (!searchQuery) return availableUsers;
    return availableUsers.filter(u => 
      `${u.firstName || ''} ${u.lastName || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const sortedChats = [...chats].sort((a, b) => {
    const timeA = a.updatedAt || a.lastMessage?.timestamp;
    const timeB = b.updatedAt || b.lastMessage?.timestamp;
    return new Date(timeB) - new Date(timeA);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner />
      </div>
    );
  }

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
            type="button"
          >
            ✏️
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {sortedChats.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">💬</p>
              <p>No conversations yet</p>
              <button
                onClick={() => setShowNewChatModal(true)}
                className="text-blue-600 text-sm mt-2 hover:underline"
                type="button"
              >
                Start a chat
              </button>
            </div>
          ) : (
            sortedChats.map(chat => {
              const otherUserId = getOtherParticipantId(chat);
              const isOnline = otherUserId ? getUserOnlineStatus(otherUserId) : false;
              const chatName = getChatName(chat);
              const lastMessage = chat.lastMessage?.message || 'No messages yet';
              const lastTime = chat.lastMessage?.timestamp || chat.updatedAt;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => selectChat(chat)}
                  onKeyPress={(e) => e.key === 'Enter' && selectChat(chat)}
                  role="button"
                  tabIndex={0}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                    currentChat?._id === chat._id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                      {chatName.charAt(0).toUpperCase()}
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
                        {chatName}
                      </p>
                      {lastTime && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatTime(lastTime)}
                        </span>
                      )}
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500 truncate flex-1">
                        {lastMessage}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full ml-2 min-w-[20px] text-center">
                          {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                        </span>
                      )}
                    </div>
                    {chat.chatType !== 'group' && !isOnline && otherUserId && (
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
          <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-lg font-semibold">
                  {getChatName(currentChat).charAt(0).toUpperCase()}
                </div>
                {currentChat.chatType !== 'group' && (
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    getUserOnlineStatus(getOtherParticipantId(currentChat)) ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
                {currentChat.chatType === 'direct' && (
                  <p className="text-xs">
                    {getUserOnlineStatus(getOtherParticipantId(currentChat)) ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      <span className="text-gray-500">
                        {formatLastSeen(getLastSeen(getOtherParticipantId(currentChat)))}
                      </span>
                    )}
                  </p>
                )}
                {currentChat.chatType === 'group' && (
                  <p className="text-xs text-gray-500">
                    {currentChat.participants?.length || 0} members
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div 
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-50 to-white"
          >
            {hasMoreMessages && messages.length >= 50 && (
              <div className="flex justify-center">
                <button
                  onClick={loadMoreMessages}
                  disabled={loadingMessages}
                  className="text-sm text-blue-500 hover:text-blue-600 disabled:opacity-50"
                  type="button"
                >
                  {loadingMessages ? 'Loading...' : 'Load more messages'}
                </button>
              </div>
            )}
            
            {messages.length === 0 && !loadingMessages ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-gray-500">No messages yet</p>
                <p className="text-sm text-gray-400">Send a message to start the conversation</p>
              </div>
            ) : (
              messages.map((msg, idx) => {
                const isOwn = msg.senderId?._id === user?._id || msg.senderId === user?._id || msg.senderId === user?.id;
                return (
                  <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 shadow-sm'} rounded-2xl p-3`}>
                      {!isOwn && currentChat.chatType === 'group' && (
                        <p className="text-xs font-medium mb-1 text-blue-600">{msg.senderName}</p>
                      )}
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.message}</p>
                      <div className={`text-xs mt-1 flex justify-end items-center gap-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'}`}>
                        {formatTime(msg.createdAt)}
                        {isOwn && msg.status === 'read' && <span>✓✓</span>}
                        {isOwn && msg.status === 'delivered' && <span>✓✓</span>}
                        {isOwn && msg.status === 'sent' && <span>✓</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            
            {userTyping && (
              <div className="flex justify-start">
                <div className="bg-white shadow-sm rounded-2xl p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    <span className="text-xs text-gray-500 ml-1">{userTyping.userName} is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            {sending && (
              <div className="flex justify-end">
                <div className="bg-gray-200 rounded-2xl p-3">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t bg-white">
            <div className="flex gap-2">
              <textarea
                value={messageInput}
                onChange={handleMessageInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 border rounded-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                rows={1}
                style={{ maxHeight: '100px', overflow: 'auto' }}
                onInput={(e) => {
                  const target = e.target;
                  target.style.height = 'auto';
                  target.style.height = Math.min(target.scrollHeight, 100) + 'px';
                }}
              />
              <button
                onClick={sendMessage}
                disabled={sending || !messageInput.trim()}
                className="px-5 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                type="button"
              >
                <span>Send</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </Card>
      ) : (
        <Card className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Chat</h3>
            <p className="text-gray-500 mb-4">Select a conversation or start a new chat</p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              type="button"
            >
              Start New Chat
            </button>
          </div>
        </Card>
      )}

      {/* New Chat Modal */}
      <Modal isOpen={showNewChatModal} onClose={() => {
        setShowNewChatModal(false);
        setSearchQuery('');
      }} title="New Chat">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filterAvailableUsers().length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No users found</p>
                {searchQuery && (
                  <p className="text-sm text-gray-400 mt-1">Try a different search term</p>
                )}
              </div>
            ) : (
              filterAvailableUsers().map(userItem => {
                const isOnline = getUserOnlineStatus(userItem._id);
                const fullName = `${userItem.firstName || ''} ${userItem.lastName || ''}`.trim();
                return (
                  <div
                    key={userItem._id}
                    onClick={() => startNewChat(userItem._id)}
                    onKeyPress={(e) => e.key === 'Enter' && startNewChat(userItem._id)}
                    role="button"
                    tabIndex={0}
                    className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-all hover:shadow-sm"
                  >
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {fullName.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                        isOnline ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium text-gray-900 truncate">
                          {fullName || 'Unknown User'}
                        </p>
                        {isOnline && <span className="text-xs text-green-600">Online</span>}
                      </div>
                      <p className="text-sm text-gray-500 capitalize">{userItem.role || 'User'}</p>
                      {!isOnline && (
                        <p className="text-xs text-gray-400">
                          {formatLastSeen(getLastSeen(userItem._id))}
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

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        @keyframes bounce {
          0%, 60%, 100% {
            transform: translateY(0);
          }
          30% {
            transform: translateY(-10px);
          }
        }
        .animate-bounce {
          animation: bounce 1.4s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ChatModule;