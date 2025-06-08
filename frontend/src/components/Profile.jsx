import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          console.error('No auth token found');
          return;
        }

        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = async (e) => {
    try {
      const file = e.target.files[0];
      if (!file) return;

      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:5000/api/users/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const data = await response.json();
      setUserData(prev => ({
        ...prev,
        avatar: data.avatar
      }));

    } catch (error) {
      console.error('Image upload error:', error);
      // Add user feedback here
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img 
            src={userData?.avatar?.url || '/default-avatar.png'} 
            alt="Profile" 
          />
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="upload-input"
          />
        </div>
        <h1>{userData?.username}</h1>
        <p className="email">{userData?.email}</p>
      </div>

      <div className="profile-content">
        <div className="info-card">
          <h3>Personal Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Age</span>
              <span className="value">{userData?.age || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Gender</span>
              <span className="value">{userData?.gender || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Occupation</span>
              <span className="value">
                {userData?.personalDetails?.occupation || 'Not specified'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Education</span>
              <span className="value">
                {userData?.personalDetails?.education || 'Not specified'}
              </span>
            </div>
            <div className="info-item">
              <span className="label">Languages</span>
              <span className="value">
                {userData?.personalDetails?.languages?.join(', ') || 'Not specified'}
              </span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>Bio</h3>
          <p className="bio-text">
            {userData?.personalDetails?.bio || 'No bio available'}
          </p>
        </div>

        <div className="info-card">
          <h3>Interests</h3>
          <div className="interests-grid">
            {userData?.interests?.length > 0 ? (
              userData.interests.map((interest, index) => (
                <span key={index} className="interest-tag">
                  {interest}
                </span>
              ))
            ) : (
              <p>No interests added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;