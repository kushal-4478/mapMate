import React from 'react';
import { Link } from 'react-router-dom';
import ProfileIcon from './ProfileIcon';
import './Navbar.css';

const Navbar = () => {
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <nav className="navbar">
      <Link to="/" className="nav-logo">
        Perfect Meeting Point
      </Link>
      
      <div className="nav-links">
        {isAuthenticated ? (
          <>
            <Link to="/home">Home</Link>
            <Link to="/explore">Explore</Link>
            <Link to="/connections">Connections</Link>
            <Link to="/venues">Find Venues</Link>
            <ProfileIcon />
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signin">Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;