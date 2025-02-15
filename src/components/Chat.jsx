import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';

function Chat() {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const { user } = useAuth();
  const { messages, setMessages, isConnected, setIsConnected, wsRef } = useChat();

  const connectWebSocket = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    wsRef.current = new WebSocket(`ws://localhost:8000/ws/chat/${user?.id || 'guest'}`);
    
    wsRef.current.onopen = () => {
      setIsConnected(true);
      addSystemMessage("Connected to AI Assistant");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };

    wsRef.current.onclose = () => {
      setIsConnected(false);
      addSystemMessage("Disconnected from AI Assistant");
      // Attempt to reconnect after 3 seconds
      reconnectTimeoutRef.current = setTimeout(connectWebSocket, 3000);
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      addSystemMessage("Connection error. Trying to reconnect...");
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
    addMessage('user', message);
    setIsTyping(true);
    
    try {
      wsRef.current.send(JSON.stringify({
        message,
        timestamp: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Send error:', error);
      addSystemMessage("Failed to send message. Please try again.");
      setIsTyping(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-24 right-8 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden z-50"
    >
      <div className="p-4 bg-purple-600 text-white flex justify-between items-center">
        <h3 className="font-bold">AI Assistant</h3>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
          {isConnected ? 'Connected' : 'Reconnecting...'}
        </div>
      </div>

      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
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
            </motion.div>
          ))}
        </AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  transition: { repeat: Infinity, duration: 1 }
                }}
              >
                AI is typing...
              </motion.div>
            </div>
          </motion.div>
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
    </motion.div>
  );
}

export default Chat; 