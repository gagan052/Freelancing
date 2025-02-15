import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { ChartBarIcon, BriefcaseIcon, StarIcon, ClockIcon } from '@heroicons/react/24/outline';

function Profile() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    skills: user?.skills || [],
    bio: user?.bio || '',
    disability: user?.disability || '',
    experience: user?.experience || '',
    education: user?.education || '',
  });

  // Mock dashboard data
  const dashboardStats = {
    projectsCompleted: 15,
    activeProjects: 3,
    totalEarnings: '$12,450',
    rating: 4.8,
    hoursWorked: 256,
    clientReviews: 12,
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement profile update logic
    console.log('Updated Profile:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Dashboard Stats */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Total Earnings</h3>
            <ChartBarIcon className="w-6 h-6" />
          </div>
          <p className="text-3xl font-bold">{dashboardStats.totalEarnings}</p>
          <p className="text-purple-100">Lifetime earnings</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <BriefcaseIcon className="w-6 h-6 text-purple-600" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-purple-600">{dashboardStats.projectsCompleted}</p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{dashboardStats.activeProjects}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Rating</h3>
            <StarIcon className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{dashboardStats.rating}/5.0</p>
          <p className="text-sm text-gray-600">{dashboardStats.clientReviews} client reviews</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hours Worked</h3>
            <ClockIcon className="w-6 h-6 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-600">{dashboardStats.hoursWorked}h</p>
          <p className="text-sm text-gray-600">Total hours tracked</p>
        </div>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://via.placeholder.com/100'}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold dark:text-white">{profileData.name || 'Your Name'}</h1>
              <p className="text-gray-600 dark:text-gray-300">{profileData.disability || 'Disability Type'}</p>
            </div>
          </div>
          <Button
            variant="secondary"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="Full Name"
              type="text"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              disabled={!isEditing}
            />

            <Input
              label="Disability Type"
              type="text"
              value={profileData.disability}
              onChange={(e) => setProfileData({ ...profileData, disability: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="label">Bio</label>
            <textarea
              className="input min-h-[100px]"
              value={profileData.bio}
              onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
              disabled={!isEditing}
              placeholder="Tell clients about yourself..."
            />
          </div>

          <div>
            <label className="label">Skills</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {profileData.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  {isEditing && (
                    <button
                      className="ml-2 text-purple-500 hover:text-purple-700"
                      onClick={() => {
                        const newSkills = profileData.skills.filter((_, i) => i !== index);
                        setProfileData({ ...profileData, skills: newSkills });
                      }}
                    >
                      ×
                    </button>
                  )}
                </span>
              ))}
            </div>
            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                className="text-sm"
                onClick={() => {
                  const skill = prompt('Enter new skill');
                  if (skill) {
                    setProfileData({
                      ...profileData,
                      skills: [...profileData.skills, skill],
                    });
                  }
                }}
              >
                + Add Skill
              </Button>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="label">Experience</label>
              <textarea
                className="input min-h-[150px]"
                value={profileData.experience}
                onChange={(e) => setProfileData({ ...profileData, experience: e.target.value })}
                disabled={!isEditing}
                placeholder="Share your work experience..."
              />
            </div>

            <div>
              <label className="label">Education</label>
              <textarea
                className="input min-h-[150px]"
                value={profileData.education}
                onChange={(e) => setProfileData({ ...profileData, education: e.target.value })}
                disabled={!isEditing}
                placeholder="Share your educational background..."
              />
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end">
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          )}
        </form>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 dark:text-white">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: 'project', text: 'Completed Website Development Project', date: '2 days ago' },
            { type: 'payment', text: 'Received payment for Logo Design', date: '5 days ago' },
            { type: 'review', text: 'Got a 5-star review from Client', date: '1 week ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium dark:text-white">{activity.text}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{activity.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile; 