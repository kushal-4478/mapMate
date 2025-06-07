import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  useEffect(() => {
    console.log('Home component mounted');
  }, []);

  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Dating App</h1>
      
      <div className="features-grid">
        <div className="feature-card">
          <h2>Find Matches</h2>
          <p>Discover potential matches based on your preferences</p>
          <Link to="/dashboard" className="feature-button">
            Go to Dashboard
          </Link>
        </div>

        <div className="feature-card">
          <h2>Book Venue</h2>
          <p>Find and book the perfect venue for your date</p>
          <Link to="/booking" className="feature-button">
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;