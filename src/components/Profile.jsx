import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const { user, userProfile, updateProfile } = useAuth();

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        full_name: e.target.fullName.value,
        username: e.target.username.value,
        bio: e.target.bio.value
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          <p>User ID: {user.id}</p>
          {userProfile && (
            <form onSubmit={handleUpdateProfile}>
              <input 
                name="fullName"
                defaultValue={userProfile.full_name}
                placeholder="Full Name"
              />
              <input 
                name="username"
                defaultValue={userProfile.username}
                placeholder="Username"
              />
              <textarea 
                name="bio"
                defaultValue={userProfile.bio}
                placeholder="Bio"
              />
              <button type="submit">Update Profile</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default Profile; 