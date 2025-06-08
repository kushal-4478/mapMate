import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfileIcon.css';

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  
  const username = localStorage.getItem('username') || 'U';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const navigateToProfile = () => {
    setIsOpen(false);
    navigate('/profile');
  };

  return (
    <div className="profile-icon-wrapper" ref={dropdownRef}>
      <div 
        className="profile-icon"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{username[0].toUpperCase()}</span>
      </div>

      {isOpen && (
        <div className="profile-dropdown">
          <div className="dropdown-item" onClick={navigateToProfile}>
            <i className="fas fa-user"></i>
            My Profile
          </div>
          <Link to="/bookings" className="dropdown-item">
            <i className="fas fa-calendar"></i>
            My Bookings
          </Link>
          <div className="dropdown-divider"></div>
          <button onClick={handleLogout} className="dropdown-item logout">
            <i className="fas fa-sign-out-alt"></i>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;