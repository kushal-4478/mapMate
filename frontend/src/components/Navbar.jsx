import React from 'react';
import { Link } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './Navbar.css';

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        MeetPoint Pro
      </Link>
      
      <div className="nav-links">
        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link> {/* Changed from /signin */}
          </>
        ) : (
          <>
            <Link to="/home">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/find-venue">Find Venues</Link>
            <Link to="/my-bookings">My Bookings</Link>
            <ProfileIcon />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;