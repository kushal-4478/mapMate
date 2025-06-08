import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Perfect Meeting Point</h1>
      <p className="subtitle">Connect. Meet. Share Moments.</p>
      
      <div className="features-grid">
        <div className="feature-card">
          <h2>Find Connections</h2>
          <p>Meet friends, partners, or business connections</p>
          <Link to="/explore" className="feature-button">
            Explore People
          </Link>
        </div>

        <div className="feature-card">
          <h2>Group Meetups</h2>
          <p>Create or join group activities and events</p>
          <Link to="/groups" className="feature-button">
            Discover Groups
          </Link>
        </div>

        <div className="feature-card">
          <h2>Perfect Venues</h2>
          <p>Find and book ideal meeting locations</p>
          <Link to="/venues" className="feature-button">
            Find Venues
          </Link>
        </div>

        <div className="feature-card">
          <h2>Family Events</h2>
          <p>Plan family gatherings and celebrations</p>
          <Link to="/events" className="feature-button">
            Plan Event
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;