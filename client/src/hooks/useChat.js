// // client/src/hooks/useChat.js
// import { useState, useEffect, useCallback, useRef } from 'react';
// import { chatApi } from '../api/chat.api';
// import { useToast } from './useToast';
// import { getSocket, disconnectSocket } from '../utils/socket';

// export const useChat = () => {
//   const [chats, setChats] = useState([]);
//   const [currentChat, setCurrentChat] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [sending, setSending] = useState(false);
//   const [availableUsers, setAvailableUsers] = useState([]);
//   const [chatEnabled, setChatEnabled] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const { showToast } = useToast();
//   const socketRef = useRef(null);

//   // Initialize socket connection
//   useEffect(() => {
//     initSocket();
//     fetchChatSettings();
//     fetchUserChats();
//     fetchAvailableUsers();

//     return () => {
//       if (socketRef.current) {
//         disconnectSocket();
//       }
//     };
//   }, []);

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

//     // Listen for message deletions
//     socket.on('message_deleted', (data) => {
//       removeMessage(data.messageId);
//     });

//     return socket;
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
//       // Mark as read automatically
//       markMessageAsRead(data.message._id);
//     }

//     // Update unread count
//     if (currentChat?._id !== data.chatId) {
//       setUnreadCount(prev => prev + 1);
//     }
//   };

//   const updateMessageStatus = (messageId, status) => {
//     setMessages(prev => prev.map(msg => 
//       msg._id === messageId ? { ...msg, status } : msg
//     ));
//   };

//   const removeMessage = (messageId) => {
//     setMessages(prev => prev.filter(msg => msg._id !== messageId));
//   };

//   const markMessageAsRead = async (messageId) => {
//     try {
//       await chatApi.markAsRead(messageId);
//     } catch (error) {
//       console.error('Mark as read error:', error);
//     }
//   };

//   const fetchChatSettings = async () => {
//     try {
//       const response = await chatApi.getUserChatSettings();
//       if (response.data.success) {
//         setChatEnabled(response.data.data.chatEnabled);
//       }
//     } catch (error) {
//       console.error('Fetch chat settings error:', error);
//     }
//   };

//   const fetchUserChats = async () => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getUserChats();
//       if (response.data.success) {
//         setChats(response.data.data);
//         const totalUnread = response.data.data.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
//         setUnreadCount(totalUnread);
//       }
//     } catch (error) {
//       console.error('Fetch user chats error:', error);
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

//   const fetchChatMessages = async (chatId, page = 1) => {
//     setLoading(true);
//     try {
//       const response = await chatApi.getChatMessages(chatId, page);
//       if (response.data.success) {
//         setMessages(response.data.data);
//       }
//     } catch (error) {
//       console.error('Fetch chat messages error:', error);
//       showToast('Failed to load messages', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectChat = async (chat) => {
//     setCurrentChat(chat);
//     await fetchChatMessages(chat._id);
    
//     // Reset unread count for this chat
//     setChats(prev => prev.map(c => 
//       c._id === chat._id ? { ...c, unreadCount: 0 } : c
//     ));
//   };

//   const startDirectChat = async (targetUserId) => {
//     try {
//       const response = await chatApi.getOrCreateDirectChat(targetUserId);
//       if (response.data.success) {
//         const newChat = response.data.data;
//         setChats(prev => [newChat, ...prev]);
//         selectChat(newChat);
//         return newChat;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to start chat', 'error');
//       throw error;
//     }
//   };

//   const sendMessage = async (chatId, messageData) => {
//     setSending(true);
//     try {
//       const response = await chatApi.sendMessage(chatId, messageData);
//       if (response.data.success) {
//         const newMessage = response.data.data;
//         setMessages(prev => [...prev, newMessage]);
        
//         // Update chat list with new last message
//         setChats(prev => prev.map(chat => 
//           chat._id === chatId ? {
//             ...chat,
//             lastMessage: {
//               message: newMessage.message || (newMessage.attachments?.length ? '📎 Attachment' : ''),
//               senderName: newMessage.senderName,
//               timestamp: newMessage.createdAt
//             }
//           } : chat
//         ));
        
//         return newMessage;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to send message', 'error');
//       throw error;
//     } finally {
//       setSending(false);
//     }
//   };

//   const createGroupChat = async (groupData) => {
//     try {
//       const response = await chatApi.createGroupChat(groupData);
//       if (response.data.success) {
//         const newChat = response.data.data;
//         setChats(prev => [newChat, ...prev]);
//         selectChat(newChat);
//         showToast('Group created successfully', 'success');
//         return newChat;
//       }
//     } catch (error) {
//       showToast(error.response?.data?.error || 'Failed to create group', 'error');
//       throw error;
//     }
//   };

//   const blockUser = async (userId) => {
//     try {
//       await chatApi.blockUser(userId);
//       showToast('User blocked successfully', 'success');
//       fetchAvailableUsers();
//     } catch (error) {
//       showToast('Failed to block user', 'error');
//     }
//   };

//   const unblockUser = async (userId) => {
//     try {
//       await chatApi.unblockUser(userId);
//       showToast('User unblocked successfully', 'success');
//       fetchAvailableUsers();
//     } catch (error) {
//       showToast('Failed to unblock user', 'error');
//     }
//   };

//   return {
//     chats,
//     currentChat,
//     messages,
//     loading,
//     sending,
//     availableUsers,
//     chatEnabled,
//     unreadCount,
//     selectChat,
//     startDirectChat,
//     sendMessage,
//     createGroupChat,
//     fetchUserChats,
//     blockUser,
//     unblockUser
//   };
// };


// client/src/hooks/useChat.js
import { useState, useEffect, useCallback, useRef } from 'react';
import { chatApi } from '../api/chat.api';
import { userApi } from '../api/user.api';
import { useToast } from './useToast';
import { getSocket, disconnectSocket } from '../utils/socket';

export const useChat = () => {
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [chatEnabled, setChatEnabled] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(new Map()); // userId -> { isOnline, lastSeen, user }
  const [typingUsers, setTypingUsers] = useState(new Map()); // chatId -> Map of userId -> timeout
  const { showToast } = useToast();
  const socketRef = useRef(null);
  const typingTimeoutsRef = useRef(new Map());

  // Initialize socket connection
  useEffect(() => {
    initSocket();
    fetchChatSettings();
    fetchUserChats();
    fetchAvailableUsers();
    fetchOnlineUsers();

    return () => {
      if (socketRef.current) {
        disconnectSocket();
      }
      // Clear all typing timeouts
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      typingTimeoutsRef.current.clear();
    };
  }, []);

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

    // Listen for message deletions
    socket.on('message_deleted', (data) => {
      removeMessage(data.messageId);
    });

    // 🔴 NEW: Listen for user status changes
    socket.on('user_status_change', (data) => {
      updateUserOnlineStatus(data.userId, data.isOnline, data.lastSeen);
    });

    // 🔴 NEW: Listen for online users list
    socket.on('online_users', (users) => {
      const statusMap = new Map(onlineUsers);
      users.forEach(user => {
        statusMap.set(user._id, {
          isOnline: true,
          lastSeen: user.lastSeen,
          user: user
        });
      });
      setOnlineUsers(statusMap);
    });

    // 🔴 NEW: Listen for typing indicators
    socket.on('user_typing', (data) => {
      handleTypingIndicator(data);
    });

    return socket;
  };

  // 🔴 NEW: Handle typing indicator
  const handleTypingIndicator = (data) => {
    const { chatId, userId, userName, isTyping } = data;
    
    // Only update if this is the current chat
    if (currentChat?._id !== chatId) return;
    
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      const chatTyping = newMap.get(chatId) || new Map();
      
      if (isTyping) {
        chatTyping.set(userId, { userName, timestamp: Date.now() });
        
        // Clear existing timeout for this user
        const timeoutKey = `${chatId}_${userId}`;
        if (typingTimeoutsRef.current.has(timeoutKey)) {
          clearTimeout(typingTimeoutsRef.current.get(timeoutKey));
        }
        
        // Set timeout to remove typing indicator after 3 seconds of no activity
        const timeout = setTimeout(() => {
          setTypingUsers(prevMap => {
            const updatedMap = new Map(prevMap);
            const updatedChatTyping = updatedMap.get(chatId);
            if (updatedChatTyping) {
              updatedChatTyping.delete(userId);
              if (updatedChatTyping.size === 0) {
                updatedMap.delete(chatId);
              } else {
                updatedMap.set(chatId, updatedChatTyping);
              }
            }
            return updatedMap;
          });
          typingTimeoutsRef.current.delete(timeoutKey);
        }, 3000);
        
        typingTimeoutsRef.current.set(timeoutKey, timeout);
        newMap.set(chatId, chatTyping);
      } else {
        chatTyping.delete(userId);
        if (chatTyping.size === 0) {
          newMap.delete(chatId);
        } else {
          newMap.set(chatId, chatTyping);
        }
      }
      
      return newMap;
    });
  };

  // 🔴 NEW: Send typing indicator
  const sendTypingIndicator = (chatId, userName, isTyping) => {
    if (socketRef.current && currentChat?._id === chatId) {
      socketRef.current.emit('typing_start', { chatId, userName });
      
      // If starting to type, send stop after 2 seconds of no activity
      if (isTyping) {
        const timeoutKey = `typing_stop_${chatId}`;
        if (typingTimeoutsRef.current.has(timeoutKey)) {
          clearTimeout(typingTimeoutsRef.current.get(timeoutKey));
        }
        const timeout = setTimeout(() => {
          socketRef.current?.emit('typing_stop', { chatId, userName });
          typingTimeoutsRef.current.delete(timeoutKey);
        }, 2000);
        typingTimeoutsRef.current.set(timeoutKey, timeout);
      }
    }
  };

  // 🔴 NEW: Get typing users for current chat
  const getTypingUsers = () => {
    if (!currentChat) return [];
    const chatTyping = typingUsers.get(currentChat._id);
    if (!chatTyping) return [];
    return Array.from(chatTyping.values()).map(t => t.userName);
  };

  // 🔴 NEW: Get formatted typing text
  const getTypingText = () => {
    const typingUserList = getTypingUsers();
    if (typingUserList.length === 0) return null;
    if (typingUserList.length === 1) return `${typingUserList[0]} is typing...`;
    if (typingUserList.length === 2) return `${typingUserList[0]} and ${typingUserList[1]} are typing...`;
    return `${typingUserList.length} people are typing...`;
  };

  // 🔴 NEW: Fetch online users
  const fetchOnlineUsers = async () => {
    try {
      const response = await userApi.getOnlineUsers();
      if (response.data.success) {
        const statusMap = new Map();
        response.data.data.forEach(user => {
          statusMap.set(user._id, {
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            user: user
          });
        });
        setOnlineUsers(statusMap);
      }
    } catch (error) {
      console.error('Fetch online users error:', error);
    }
  };

  // 🔴 NEW: Update user online status
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

    // Update user status in available users list
    setAvailableUsers(prev => prev.map(user => 
      user._id === userId ? { ...user, isOnline, lastSeen } : user
    ));

    // Update user status in chats list
    setChats(prev => prev.map(chat => {
      const otherParticipant = chat.participants?.find(p => p.userId?._id === userId);
      if (otherParticipant) {
        return {
          ...chat,
          participants: chat.participants.map(p => 
            p.userId?._id === userId ? { ...p, userId: { ...p.userId, isOnline, lastSeen } } : p
          )
        };
      }
      return chat;
    }));
  };

  // 🔴 NEW: Get user online status
  const getUserOnlineStatus = (userId) => {
    return onlineUsers.get(userId)?.isOnline || false;
  };

  // 🔴 NEW: Get last seen time
  const getLastSeen = (userId) => {
    const status = onlineUsers.get(userId);
    if (!status || !status.lastSeen) return null;
    return status.lastSeen;
  };

  // 🔴 NEW: Format last seen time
  const formatLastSeen = (lastSeen) => {
    if (!lastSeen) return 'Offline';
    
    const now = new Date();
    const lastSeenDate = new Date(lastSeen);
    const diffSeconds = Math.floor((now - lastSeenDate) / 1000);
    
    if (diffSeconds < 60) return 'Just now';
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return lastSeenDate.toLocaleDateString();
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
      // Mark as read automatically
      markMessageAsRead(data.message._id);
    }

    // Update unread count
    if (currentChat?._id !== data.chatId) {
      setUnreadCount(prev => prev + 1);
    }
  };

  const updateMessageStatus = (messageId, status) => {
    setMessages(prev => prev.map(msg => 
      msg._id === messageId ? { ...msg, status } : msg
    ));
  };

  const removeMessage = (messageId) => {
    setMessages(prev => prev.filter(msg => msg._id !== messageId));
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await chatApi.markAsRead(messageId);
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  };

  const fetchChatSettings = async () => {
    try {
      const response = await chatApi.getUserChatSettings();
      if (response.data.success) {
        setChatEnabled(response.data.data.chatEnabled);
      }
    } catch (error) {
      console.error('Fetch chat settings error:', error);
    }
  };

  const fetchUserChats = async () => {
    setLoading(true);
    try {
      const response = await chatApi.getUserChats();
      if (response.data.success) {
        // Add online status to chat participants
        const chatsWithStatus = response.data.data.map(chat => ({
          ...chat,
          participants: chat.participants?.map(p => ({
            ...p,
            userId: {
              ...p.userId,
              isOnline: getUserOnlineStatus(p.userId?._id),
              lastSeen: getLastSeen(p.userId?._id)
            }
          }))
        }));
        setChats(chatsWithStatus);
        const totalUnread = chatsWithStatus.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Fetch user chats error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const response = await chatApi.getAvailableUsers();
      if (response.data.success) {
        // Add online status to users
        const usersWithStatus = response.data.data.map(user => ({
          ...user,
          isOnline: getUserOnlineStatus(user._id),
          lastSeen: getLastSeen(user._id)
        }));
        setAvailableUsers(usersWithStatus);
      }
    } catch (error) {
      console.error('Fetch available users error:', error);
    }
  };

  const fetchChatMessages = async (chatId, page = 1) => {
    setLoading(true);
    try {
      const response = await chatApi.getChatMessages(chatId, page);
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error('Fetch chat messages error:', error);
      showToast('Failed to load messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectChat = async (chat) => {
    // Leave previous chat room
    if (currentChat?._id && socketRef.current) {
      socketRef.current.emit('leave_chat', currentChat._id);
      // Clear typing indicators for previous chat
      setTypingUsers(prev => {
        const newMap = new Map(prev);
        newMap.delete(currentChat._id);
        return newMap;
      });
    }
    
    setCurrentChat(chat);
    await fetchChatMessages(chat._id);
    
    // Join new chat room
    if (socketRef.current) {
      socketRef.current.emit('join_chat', chat._id);
    }
    
    // Reset unread count for this chat
    setChats(prev => prev.map(c => 
      c._id === chat._id ? { ...c, unreadCount: 0 } : c
    ));
  };

  const startDirectChat = async (targetUserId) => {
    try {
      const response = await chatApi.getOrCreateDirectChat(targetUserId);
      if (response.data.success) {
        const newChat = response.data.data;
        // Add online status to participants
        if (newChat.participants) {
          newChat.participants = newChat.participants.map(p => ({
            ...p,
            userId: {
              ...p.userId,
              isOnline: getUserOnlineStatus(p.userId?._id),
              lastSeen: getLastSeen(p.userId?._id)
            }
          }));
        }
        setChats(prev => [newChat, ...prev]);
        selectChat(newChat);
        return newChat;
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to start chat', 'error');
      throw error;
    }
  };

  const sendMessage = async (chatId, messageData) => {
    setSending(true);
    try {
      const response = await chatApi.sendMessage(chatId, messageData);
      if (response.data.success) {
        const newMessage = response.data.data;
        setMessages(prev => [...prev, newMessage]);
        
        // Update chat list with new last message
        setChats(prev => prev.map(chat => 
          chat._id === chatId ? {
            ...chat,
            lastMessage: {
              message: newMessage.message || (newMessage.attachments?.length ? '📎 Attachment' : ''),
              senderName: newMessage.senderName,
              timestamp: newMessage.createdAt
            }
          } : chat
        ));
        
        return newMessage;
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to send message', 'error');
      throw error;
    } finally {
      setSending(false);
    }
  };

  const createGroupChat = async (groupData) => {
    try {
      const response = await chatApi.createGroupChat(groupData);
      if (response.data.success) {
        const newChat = response.data.data;
        setChats(prev => [newChat, ...prev]);
        selectChat(newChat);
        showToast('Group created successfully', 'success');
        return newChat;
      }
    } catch (error) {
      showToast(error.response?.data?.error || 'Failed to create group', 'error');
      throw error;
    }
  };

  const blockUser = async (userId) => {
    try {
      await chatApi.blockUser(userId);
      showToast('User blocked successfully', 'success');
      fetchAvailableUsers();
    } catch (error) {
      showToast('Failed to block user', 'error');
    }
  };

  const unblockUser = async (userId) => {
    try {
      await chatApi.unblockUser(userId);
      showToast('User unblocked successfully', 'success');
      fetchAvailableUsers();
    } catch (error) {
      showToast('Failed to unblock user', 'error');
    }
  };

  return {
    chats,
    currentChat,
    messages,
    loading,
    sending,
    availableUsers,
    chatEnabled,
    unreadCount,
    onlineUsers,
    typingUsers,
    getTypingText,
    getUserOnlineStatus,
    getLastSeen,
    formatLastSeen,
    sendTypingIndicator,
    selectChat,
    startDirectChat,
    sendMessage,
    createGroupChat,
    fetchUserChats,
    blockUser,
    unblockUser,
    fetchOnlineUsers
  };
};