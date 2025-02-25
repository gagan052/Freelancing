import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card3D } from '../components/animations/Card3D';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';

function Community() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('discussions');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState(new Set());
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('checking');
  const [discussions, setDiscussions] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [isCreatingDiscussion, setIsCreatingDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '', tags: [] });
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: '💭' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'mentorship', label: 'Mentorship', icon: '🤝' },
    { id: 'events', label: 'Events', icon: '📅' }
  ];

  const mentors = [
    {
      name: "David Chen",
      expertise: ["React", "Accessibility", "Voice UI"],
      rating: 4.9,
      image: "/path/to/image.jpg",
      availability: "Available for mentoring"
    },
    // Add more mentors...
  ];

  const upcomingEvents = [
    {
      title: "Accessible Web Development Workshop",
      date: "2024-03-15",
      time: "10:00 AM PST",
      type: "Virtual",
      attendees: 120
    },
    // Add more events...
  ];

  const EMOJI_LIST = ['😊', '👍', '❤️', '😄', '😮', '🎉', '👋', '🤝', '💡', '✨', '🚀', '💪', '👏', '🙌', '💭', '💻', '📱', '🎯'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const checkConnection = async () => {
      try {
        setConnectionStatus('checking');
        const { error } = await supabase.from('community_messages').select('count');
        
        if (error) {
          console.error('Connection check failed:', error);
          setConnectionStatus('error');
          setError('Database connection failed. Please check your configuration.');
          return;
        }

        setConnectionStatus('connected');
        fetchMessages();
      } catch (error) {
        console.error('Connection error:', error);
        setConnectionStatus('error');
        setError('Failed to connect to the database. Please try again later.');
      }
    };

    checkConnection();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchMessages = async () => {
    try {
      console.log('Fetching messages...');
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Fetched messages:', data);
      setMessages(data || []);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setError('Failed to load messages. Please try again later.');
      setIsLoading(false);
    }
  };

  const setupMessageSubscription = () => {
    return supabase
      .channel('public:community_messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'community_messages' 
        }, 
        (payload) => {
          console.log('New message received:', payload);
          setMessages(current => [...current, payload.new]);
        }
      )
      .subscribe();
  };

  const setupTypingSubscription = () => {
    return supabase
      .channel('typing_status')
      .on('broadcast', { event: 'typing' }, ({ payload }) => {
        if (payload.user_id !== user.id) {
          setTypingUsers(prev => new Set([...prev, payload.username]));
          setTimeout(() => {
            setTypingUsers(prev => {
              const newSet = new Set(prev);
              newSet.delete(payload.username);
              return newSet;
            });
          }, 3000);
        }
      })
      .subscribe();
  };

  const broadcastTyping = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    supabase.channel('typing_status').send({
      type: 'broadcast',
      event: 'typing',
      payload: { user_id: user.id, username: user.email.split('@')[0] }
    });

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    broadcastTyping();
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('chat-attachments')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('chat-attachments')
        .getPublicUrl(filePath);

      await sendMessage({
        message: newMessage,
        attachment_url: publicUrl,
        attachment_type: file.type
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file');
    }
  };

  const handleEmojiClick = (emoji) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleReaction = async (messageId, reaction) => {
    try {
      const { data: existingReaction } = await supabase
        .from('message_reactions')
        .select('*')
        .eq('message_id', messageId)
        .eq('user_id', user.id)
        .single();

      if (existingReaction) {
        if (existingReaction.reaction === reaction) {
          await supabase
            .from('message_reactions')
            .delete()
            .eq('id', existingReaction.id);
        } else {
          await supabase
            .from('message_reactions')
            .update({ reaction })
            .eq('id', existingReaction.id);
        }
      } else {
        await supabase
          .from('message_reactions')
          .insert([{ message_id: messageId, user_id: user.id, reaction }]);
      }
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !fileInputRef.current?.files[0]) return;
    
    try {
      if (fileInputRef.current?.files[0]) {
        const file = fileInputRef.current.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('chat-attachments')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('chat-attachments')
          .getPublicUrl(filePath);

        await sendMessage({
          message: newMessage.trim(),
          attachment_url: publicUrl,
          attachment_type: file.type
        });
      } else {
        await sendMessage({ message: newMessage.trim() });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const sendMessage = async (messageData) => {
    try {
      const { error } = await supabase
        .from('community_messages')
        .insert([{
          user_id: user.id,
          username: user.email.split('@')[0],
          user_avatar: user.user_metadata?.avatar_url,
          ...messageData
        }]);

      if (error) throw error;
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderMessage = (message) => {
    const isOwnMessage = message.user_id === user.id;
    
    return (
      <motion.div
        key={message.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex items-start space-x-3 ${isOwnMessage ? 'justify-end' : ''}`}
      >
        {!isOwnMessage && (
          <img
            src={message.user_avatar || '/default-avatar.png'}
            alt={message.username}
            className="w-8 h-8 rounded-full"
          />
        )}
        <div className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
          <div
            className={`rounded-lg px-4 py-2 max-w-sm ${
              isOwnMessage
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            <div className="font-medium mb-1">{message.username}</div>
            <div>{message.message}</div>
            {message.attachment_url && (
              <div className="mt-2">
                {message.attachment_type?.startsWith('image/') ? (
                  <img
                    src={message.attachment_url}
                    alt="attachment"
                    className="max-w-full rounded"
                  />
                ) : (
                  <a
                    href={message.attachment_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-500"
                  >
                    📎 Attachment
                  </a>
                )}
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {formatDate(message.created_at)}
          </div>
          <div className="flex gap-1 mt-1">
            {['👍', '❤️', '😄', '😮'].map(reaction => (
              <button
                key={reaction}
                onClick={() => handleReaction(message.id, reaction)}
                className="hover:scale-125 transition-transform"
              >
                {reaction}
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    );
  };

  const fetchDiscussions = async () => {
    try {
      const { data, error } = await supabase
        .from('community_discussions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscussions(data || []);
    } catch (error) {
      console.error('Error fetching discussions:', error);
      setError('Failed to load discussions');
    }
  };

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('community_projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('community_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError('Failed to load events');
    }
  };

  useEffect(() => {
    if (user) {
      switch (activeTab) {
        case 'discussions':
          fetchDiscussions();
          break;
        case 'projects':
          fetchProjects();
          break;
        case 'events':
          fetchEvents();
          break;
      }
    }
  }, [activeTab, user]);

  const handleLikeDiscussion = async (discussionId) => {
    try {
      const { data: existingLike } = await supabase
        .from('discussion_likes')
        .select('*')
        .eq('discussion_id', discussionId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('discussion_likes')
          .delete()
          .eq('id', existingLike.id);
        
        await supabase
          .from('community_discussions')
          .update({ likes: discussions.find(d => d.id === discussionId).likes - 1 })
          .eq('id', discussionId);
      } else {
        await supabase
          .from('discussion_likes')
          .insert([{ discussion_id: discussionId, user_id: user.id }]);
        
        await supabase
          .from('community_discussions')
          .update({ likes: discussions.find(d => d.id === discussionId).likes + 1 })
          .eq('id', discussionId);
      }

      fetchDiscussions();
    } catch (error) {
      console.error('Error handling like:', error);
      setError('Failed to update like');
    }
  };

  const handleCreateDiscussion = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('community_discussions')
        .insert([{
          title: newDiscussion.title,
          content: newDiscussion.content,
          tags: newDiscussion.tags,
          user_id: user.id,
          username: user.email.split('@')[0]
        }]);

      if (error) throw error;
      setNewDiscussion({ title: '', content: '', tags: [] });
      setIsCreatingDiscussion(false);
      fetchDiscussions();
    } catch (error) {
      console.error('Error creating discussion:', error);
      setError('Failed to create discussion');
    }
  };

  const CreateDiscussionForm = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-6"
    >
      <form onSubmit={handleCreateDiscussion}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title</label>
          <input
            type="text"
            value={newDiscussion.title}
            onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-lg border p-2 dark:bg-gray-700"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Content</label>
          <textarea
            value={newDiscussion.content}
            onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
            className="w-full rounded-lg border p-2 dark:bg-gray-700"
            rows="4"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
          <input
            type="text"
            value={newDiscussion.tags.join(', ')}
            onChange={(e) => setNewDiscussion(prev => ({ 
              ...prev, 
              tags: e.target.value.split(',').map(tag => tag.trim()) 
            }))}
            className="w-full rounded-lg border p-2 dark:bg-gray-700"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => setIsCreatingDiscussion(false)}
            className="px-4 py-2 rounded-lg border"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-500 text-white"
          >
            Create Discussion
          </button>
        </div>
      </form>
    </motion.div>
  );

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      setPosts([...posts, {
        id: Date.now(),
        content: newPost,
        timestamp: new Date().toLocaleString(),
        author: 'Current User'
      }]);
      setNewPost('');
    }
  };

  if (connectionStatus === 'checking') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600">Checking connection...</p>
        </div>
      </div>
    );
  }

  if (connectionStatus === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Connection Error</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            {error || 'Unable to connect to the database. Please check your configuration.'}
          </p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              If the problem persists, please check:
              <ul className="list-disc list-inside mt-2">
                <li>Your internet connection</li>
                <li>Supabase project status</li>
                <li>Environment variables configuration</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Please Login</h2>
          <p className="text-gray-600">You need to be logged in to access the community.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600">Loading community...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchMessages}
            className="mt-4 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            EnableFreelance Community
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Connect, Share, and Grow Together
          </p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-8">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {activeTab === 'discussions' && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Discussions</h2>
                  <button
                    onClick={() => setIsCreatingDiscussion(true)}
                    className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    New Discussion
                  </button>
                </div>

                {isCreatingDiscussion && <CreateDiscussionForm />}

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  {discussions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No discussions yet. Be the first to start one!
                    </div>
                  ) : (
                    discussions.map((discussion) => (
                      <Card3D key={discussion.id}>
                        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                          <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span>By {discussion.username}</span>
                            <button 
                              onClick={() => handleLikeDiscussion(discussion.id)}
                              className="flex items-center gap-1 hover:text-purple-500"
                            >
                              ❤️ {discussion.likes || 0}
                            </button>
                          </div>
                          <p className="mt-3 text-gray-600 dark:text-gray-300">
                            {discussion.content}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {discussion.tags?.map((tag) => (
                              <span
                                key={tag}
                                className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-sm"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                          <div className="mt-4 text-sm text-gray-500">
                            {new Date(discussion.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </Card3D>
                    ))
                  )}
                </motion.div>
              </>
            )}

            {/* Add similar sections for other tabs */}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Community Stats</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">5,000+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Members</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1,200+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Projects</div>
                </div>
              </div>
            </div>

            {/* Featured Mentors */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Featured Mentors</h3>
              <div className="space-y-4">
                {mentors.map((mentor) => (
                  <div key={mentor.name} className="flex items-center gap-4">
                    <img
                      src={mentor.image}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div className="font-bold">{mentor.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {mentor.expertise.join(" • ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <div key={event.title} className="border-b last:border-0 pb-4">
                    <div className="font-bold">{event.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {event.date} at {event.time}
                    </div>
                    <div className="text-sm text-purple-600">
                      {event.type} • {event.attendees} attending
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Chat Section */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Community Chat</h2>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <div className="h-[600px] overflow-y-auto mb-6 space-y-4 p-4">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>

          {typingUsers.size > 0 && (
            <div className="text-sm text-gray-500 italic mb-2">
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                value={newMessage}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white min-h-[80px] resize-none"
                rows="3"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="absolute bottom-2 right-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full p-1"
              >
                😊
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-6 gap-1">
                    {EMOJI_LIST.map(emoji => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => handleEmojiClick(emoji)}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx"
            />
            
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              📎
            </button>

            <button
              type="submit"
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Forum Section */}
      <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
        <form onSubmit={handlePostSubmit} className="post-form">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your thoughts..."
          />
          <button type="submit">Post</button>
        </form>
        <div className="posts-list">
          {posts.map(post => (
            <div key={post.id} className="post-item">
              <div className="post-header">
                <span className="post-author">{post.author}</span>
                <span className="post-time">{post.timestamp}</span>
              </div>
              <p className="post-content">{post.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Community; 