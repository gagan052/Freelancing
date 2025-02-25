import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

function Chat() {
  // State management
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Refs
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);
  
  // Contexts
  const { user } = useAuth();
  const { messages, setMessages, isConnected, setIsConnected, wsRef } = useChat();
  
  // Theme settings
  const chatTheme = {
    light: {
      bg: 'bg-white',
      text: 'text-gray-800',
      border: 'border-gray-200',
      hover: 'hover:bg-gray-50',
      messageBg: {
        sent: 'bg-blue-500 text-white',
        received: 'bg-gray-100 text-gray-800'
      }
    },
    dark: {
      bg: 'bg-gray-900',
      text: 'text-gray-100',
      border: 'border-gray-700',
      hover: 'hover:bg-gray-800',
      messageBg: {
        sent: 'bg-blue-600 text-white',
        received: 'bg-gray-800 text-gray-100'
      }
    }
  };

  const addNotification = (message, type = 'info') => {
    setNotifications(prev => [...prev, {
      id: Date.now(),
      message,
      type,
      timestamp: new Date().toISOString()
    }]);
  };

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = process.env.VITE_WS_HOST || window.location.host;
    wsRef.current = new WebSocket(`${protocol}//${host}/ws/chat/${user?.id || 'guest'}`);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      addNotification('Connected to AI Assistant', 'success');
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      addNotification('Disconnected from AI Assistant', 'error');
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      addNotification('Connection error. Trying to reconnect...', 'error');
    };

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.error) {
          addSystemMessage(`Error: ${data.error}`);
        } else {
          addMessage('assistant', data.message);
        }
      } catch (error) {
        console.error('Message parsing error:', error);
        addSystemMessage("Error processing message");
      } finally {
        setIsTyping(false);
      }
    };
  };

  useEffect(() => {
    if (user) {
      connectWebSocket();
    }
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role, content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      role,
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const addSystemMessage = (content) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'system',
      content,
      timestamp: new Date().toISOString()
    }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || !isConnected) return;

    const message = inputMessage.trim();
    setInputMessage('');
    setIsSending(true);
    
    try {
      addMessage('user', message);
      wsRef.current.send(JSON.stringify({
        message,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Send error:', error);
      addNotification('Failed to send message', 'error');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-8 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50 transition-all duration-200">
      <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
        <h3 className="font-bold">AI Assistant</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          {isConnected ? 'Connected' : 'Reconnecting...'}
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} transition-all duration-200`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-purple-600 text-white'
                  : message.role === 'system'
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-md'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
              <div className="animate-pulse">
                AI is typing...
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={isConnected ? "Type your message..." : "Connecting..."}
            className="flex-1 p-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputMessage.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default Chat; 