import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card3D } from '../components/animations/Card3D';

function Community() {
  const [activeTab, setActiveTab] = useState('discussions');

  const tabs = [
    { id: 'discussions', label: 'Discussions', icon: '💭' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'mentorship', label: 'Mentorship', icon: '🤝' },
    { id: 'events', label: 'Events', icon: '📅' }
  ];

  const discussions = [
    {
      id: 1,
      title: "Voice-Controlled Development Tips",
      author: "Sarah M.",
      tags: ["voice-control", "accessibility", "coding"],
      likes: 45,
      replies: 12
    },
    // Add more discussions...
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
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                {discussions.map((discussion) => (
                  <Card3D key={discussion.id}>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg">
                      <h3 className="text-xl font-bold mb-2">{discussion.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>By {discussion.author}</span>
                        <span>❤️ {discussion.likes}</span>
                        <span>💬 {discussion.replies}</span>
                      </div>
                      <div className="mt-4 flex gap-2">
                        {discussion.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-full text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card3D>
                ))}
              </motion.div>
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
      </div>
    </div>
  );
}

export default Community; 