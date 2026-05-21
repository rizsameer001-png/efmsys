// client/src/pages/chat/ChatModule.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';

const ChatModule = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const {
    chats,
    currentChat,
    messages,
    loading,
    sending,
    availableUsers,
    chatEnabled,
    unreadCount,
    selectChat,
    startDirectChat,
    sendMessage,
    createGroupChat,
    blockUser,
    unblockUser
  } = useChat();
  
  const [messageInput, setMessageInput] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [attachments, setAttachments] = useState([]);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() && attachments.length === 0) return;
    if (!currentChat) return;

    const messageData = {
      message: messageInput.trim(),
      attachments: attachments.map(file => ({
        url: URL.createObjectURL(file),
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type
      }))
    };

    try {
      await sendMessage(currentChat._id, messageData);
      setMessageInput('');
      setAttachments([]);
    } catch (error) {
      console.error('Send message error:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleStartDirectChat = async (targetUserId) => {
    await startDirectChat(targetUserId);
    setShowNewChatModal(false);
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedUsers.length === 0) {
      showToast('Please enter group name and select participants', 'error');
      return;
    }

    await createGroupChat({
      groupName,
      groupDescription,
      participants: selectedUsers
    });
    
    setShowGroupModal(false);
    setGroupName('');
    setGroupDescription('');
    setSelectedUsers([]);
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

  const getChatAvatar = (chat) => {
    if (chat.chatType === 'group') {
      return '👥';
    }
    const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
    return otherParticipant?.userId?.profileImage || otherParticipant?.userId?.firstName?.[0] || '👤';
  };

  const getChatName = (chat) => {
    if (chat.chatType === 'group') {
      return chat.groupName;
    }
    const otherParticipant = chat.participants?.find(p => p.userId?._id !== user?._id);
    return otherParticipant?.userId?.firstName + ' ' + otherParticipant?.userId?.lastName || 'Unknown';
  };

  const getMessageStatusIcon = (status) => {
    switch(status) {
      case 'sent': return '✓';
      case 'delivered': return '✓✓';
      case 'read': return '✓✓ (read)';
      default: return '✓';
    }
  };

  if (!chatEnabled) {
    return (
      <div className="text-center py-12">
        <Card className="p-12 max-w-md mx-auto">
          <div className="text-4xl mb-4">💬</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Chat is Disabled</h2>
          <p className="text-gray-500">Your chat access has been disabled by the administrator.</p>
          <p className="text-sm text-gray-400 mt-2">Please contact your system administrator for assistance.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4">
      {/* Chat List Sidebar */}
      <Card className="w-80 flex flex-col overflow-hidden">
        <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Messages</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowNewChatModal(true)}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              title="New Chat"
            >
              ✏️
            </button>
            <button
              onClick={() => setShowGroupModal(true)}
              className="p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              title="New Group"
            >
              👥
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : chats.length === 0 ? (
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
            chats.map(chat => (
              <div
                key={chat._id}
                onClick={() => selectChat(chat)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 transition-colors ${
                  currentChat?._id === chat._id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                  {getChatAvatar(chat)}
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
                  <p className="text-sm text-gray-500 truncate">
                    {chat.lastMessage?.senderName === `${user?.firstName} ${user?.lastName}` 
                      ? `You: ${chat.lastMessage?.message}` 
                      : chat.lastMessage?.message}
                  </p>
                </div>
                {chat.unreadCount > 0 && (
                  <span className="bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Chat Window */}
      {currentChat ? (
        <Card className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
                {getChatAvatar(currentChat)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{getChatName(currentChat)}</h3>
                {currentChat.chatType === 'group' && (
                  <p className="text-xs text-gray-500">
                    {currentChat.participants?.length} members
                  </p>
                )}
              </div>
            </div>
            <button className="p-1.5 rounded-full hover:bg-gray-200 transition-colors">
              ⋮
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => {
              const isOwn = msg.senderId?._id === user?._id;
              return (
                <div key={msg._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isOwn ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-900'} rounded-lg p-3`}>
                    {!isOwn && (
                      <p className="text-xs font-medium mb-1">{msg.senderName}</p>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    {msg.attachments?.length > 0 && (
                      <div className="mt-2 space-y-1">
                        {msg.attachments.map((att, i) => (
                          <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="text-xs underline block">
                            📎 {att.fileName}
                          </a>
                        ))}
                      </div>
                    )}
                    <div className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-400'} flex justify-end gap-1`}>
                      <span>{formatTime(msg.createdAt)}</span>
                      {isOwn && <span>{getMessageStatusIcon(msg.status)}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
            {sending && (
              <div className="flex justify-end">
                <div className="bg-gray-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Attachment Preview */}
          {attachments.length > 0 && (
            <div className="px-4 py-2 border-t flex gap-2 flex-wrap">
              {attachments.map((file, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg px-2 py-1 text-sm flex items-center gap-2">
                  <span>📎 {file.name}</span>
                  <button onClick={() => removeAttachment(idx)} className="text-red-500">×</button>
                </div>
              ))}
            </div>
          )}

          {/* Message Input */}
          <div className="p-4 border-t flex gap-2">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              📎
            </button>
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={sending || (!messageInput.trim() && attachments.length === 0)}
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
            className="w-full px-3 py-2 border rounded-lg"
            onChange={(e) => {
              const search = e.target.value.toLowerCase();
              // Filter users based on search
            }}
          />
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {availableUsers.map(user => (
              <div
                key={user._id}
                onClick={() => handleStartDirectChat(user._id)}
                className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                  {user.profileImage ? (
                    <img src={user.profileImage} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                  <p className="text-sm text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Create Group Modal */}
      <Modal isOpen={showGroupModal} onClose={() => setShowGroupModal(false)} title="Create Group">
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <textarea
            placeholder="Group Description (optional)"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Members</label>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {availableUsers.map(user => (
                <label key={user._id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user._id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers([...selectedUsers, user._id]);
                      } else {
                        setSelectedUsers(selectedUsers.filter(id => id !== user._id));
                      }
                    }}
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
            <Button variant="secondary" onClick={() => setShowGroupModal(false)}>Cancel</Button>
            <Button onClick={handleCreateGroup}>Create Group</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ChatModule;