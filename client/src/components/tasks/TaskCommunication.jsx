// client/src/components/tasks/TaskCommunication.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useTaskSocket } from '../../hooks/useTaskSocket';
import { useAuth } from '../../hooks/useAuth';
import Button from '../common/Button';
import { useToast } from '../../hooks/useToast';

const TaskCommunication = ({ taskId }) => {
  const { user } = useAuth();
  const { socket, isConnected } = useTaskSocket();
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    // Join task chat room
    socket.emit('join-task-chat', { taskId });

    // Listen for new messages
    socket.on(`task:message:${taskId}`, (message) => {
      setMessages(prev => [...prev, message]);
      scrollToBottom();
    });

    // Listen for typing indicators
    socket.on(`task:typing:${taskId}`, ({ userId, isTyping: typing }) => {
      setTypingUsers(prev => {
        if (typing && !prev.includes(userId)) {
          return [...prev, userId];
        }
        if (!typing) {
          return prev.filter(id => id !== userId);
        }
        return prev;
      });
    });

    // Load previous messages
    loadMessages();

    return () => {
      socket.off(`task:message:${taskId}`);
      socket.off(`task:typing:${taskId}`);
    };
  }, [socket, taskId]);

  const loadMessages = async () => {
    // Load messages from API - implement as needed
    setMessages([
      {
        id: 1,
        userId: 'system',
        userName: 'System',
        message: 'Chat started for this task',
        timestamp: new Date(),
        isSystem: true
      }
    ]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    if (!isConnected) {
      showToast('Not connected to chat server', 'error');
      return;
    }

    const message = {
      id: Date.now(),
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      message: newMessage,
      timestamp: new Date(),
      isSystem: false
    };

    socket.emit('task:message', { taskId, message });
    setMessages(prev => [...prev, message]);
    setNewMessage('');
    scrollToBottom();
  };

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit('task:typing', { taskId, isTyping: true });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('task:typing', { taskId, isTyping: false });
    }, 1000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[400px] border rounded-lg bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.userId === user._id ? 'justify-end' : 'justify-start'}`}
          >
            {msg.isSystem ? (
              <div className="text-center text-xs text-gray-400 my-2">
                {msg.message}
              </div>
            ) : (
              <div className={`max-w-[70%] ${msg.userId === user._id ? 'order-2' : 'order-1'}`}>
                {msg.userId !== user._id && (
                  <p className="text-xs text-gray-500 mb-1">{msg.userName}</p>
                )}
                <div className={`rounded-lg px-3 py-2 ${
                  msg.userId === user._id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm break-words">{msg.message}</p>
                  <p className={`text-xs mt-1 ${
                    msg.userId === user._id ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Typing Indicator */}
        {typingUsers.length > 0 && (
          <div className="text-sm text-gray-400 italic">
            {typingUsers.length === 1 ? 'Someone is typing...' : `${typingUsers.length} people are typing...`}
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-3">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            onKeyUp={handleTyping}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Button onClick={sendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          {isConnected ? '✅ Connected' : '⚠️ Reconnecting...'}
        </p>
      </div>
    </div>
  );
};

export default TaskCommunication;