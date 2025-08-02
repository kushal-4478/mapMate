import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css';
import api from './api';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [personalDetails, setPersonalDetails] = useState({
    occupation: '',
    education: '',
    languages: [],
    bio: '',
    age: ''
  });

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get('/api/users/profile');
        setUserData(response.data);
        // Initialize personal details from fetched data
        setPersonalDetails({
          occupation: response.data.personalDetails?.occupation || '',
          education: response.data.personalDetails?.education || '',
          languages: response.data.personalDetails?.languages || [],
          bio: response.data.personalDetails?.bio || '',
          age: response.data.personalDetails?.age || ''
        });
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePersonalDetailsUpdate = async () => {
    try {
      const token = localStorage.getItem('authToken');
      await axios.put(
        `/api/users/update-personal-details`,
        personalDetails,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      // Update local state
      setUserData(prev => ({
        ...prev,
        personalDetails: {
          ...prev.personalDetails,
          ...personalDetails
        }
      }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating personal details:', error);
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <img src={userData?.avatar?.url || '/default-avatar.png'} alt="Profile" />
        </div>
        <h1>{userData?.username}</h1>
        <p className="email">{userData?.email}</p>
      </div>

      <div className="info-card">
        <div className="card-header">
          <h3>Personal Details</h3>
          <button 
            className="edit-button"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Occupation</label>
              <input
                type="text"
                value={personalDetails.occupation}
                onChange={(e) => setPersonalDetails(prev => ({
                  ...prev,
                  occupation: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label>Education</label>
              <input
                type="text"
                value={personalDetails.education}
                onChange={(e) => setPersonalDetails(prev => ({
                  ...prev,
                  education: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label>Languages (comma separated)</label>
              <input
                type="text"
                value={personalDetails.languages.join(', ')}
                onChange={(e) => setPersonalDetails(prev => ({
                  ...prev,
                  languages: e.target.value.split(',').map(lang => lang.trim())
                }))}
              />
            </div>
            <div className="form-group">
              <label>Bio</label>
              <textarea
                value={personalDetails.bio}
                onChange={(e) => setPersonalDetails(prev => ({
                  ...prev,
                  bio: e.target.value
                }))}
              />
            </div>
            <button 
              className="save-button"
              onClick={handlePersonalDetailsUpdate}
            >
              Save Changes
            </button>
          </div>
        ) : (
          <div className="info-grid">
            <div className="info-item">
              <span className="label">Occupation</span>
              <span className="value">{userData?.personalDetails?.occupation || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Education</span>
              <span className="value">{userData?.personalDetails?.education || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <span className="label">Languages</span>
              <span className="value">
                {userData?.personalDetails?.languages?.join(', ') || 'Not specified'}
              </span>
            </div>
            <div className="info-item full-width">
              <span className="label">Bio</span>
              <span className="value">{userData?.personalDetails?.bio || 'No bio available'}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;