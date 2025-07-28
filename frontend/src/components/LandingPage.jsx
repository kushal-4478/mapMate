import React from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <header className="hero-section">
        <h1>Welcome to MeetPoint Pro</h1>
        <p className="tagline">Find the ideal spot to meet halfway</p>
        <div className="cta-buttons">
          <Link to="/login" className="cta-button login">Login</Link>
          <Link to="/signup" className="cta-button signup">Sign Up</Link> {/* Changed from /signin */}
        </div>
      </header>

      <section className="features-section">
        <h2>Why Choose Perfect Meeting Point?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="feature-icon location-icon">📍</i>
            <h3>Smart Location Finding</h3>
            <p>Find convenient meeting spots halfway between you and your friends</p>
          </div>
          
          <div className="feature-card">
            <i className="feature-icon venue-icon">🏪</i>
            <h3>Venue Discovery</h3>
            <p>Discover restaurants, cafes, and entertainment spots in your meeting area</p>
          </div>

          <div className="feature-card">
            <i className="feature-icon booking-icon">📅</i>
            <h3>Easy Booking</h3>
            <p>Book venues directly through our platform with just a few clicks</p>
          </div>

          <div className="feature-card">
            <i className="feature-icon social-icon">👥</i>
            <h3>Social Planning</h3>
            <p>Coordinate with friends and share meeting details easily</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter Locations</h3>
            <p>Input your location and your friend's location</p>
          </div>
          
          <div className="step">
            <div className="step-number">2</div>
            <h3>Find Midpoint</h3>
            <p>We calculate the perfect meeting point</p>
          </div>
          
          <div className="step">
            <div className="step-number">3</div>
            <h3>Choose Venue</h3>
            <p>Select from curated venues near the midpoint</p>
          </div>
          
          <div className="step">
            <div className="step-number">4</div>
            <h3>Book & Meet</h3>
            <p>Book your venue and enjoy your meeting</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="get-started">
          <h2>Ready to Find Your Perfect Meeting Point?</h2>
          <Link to="/signin" className="cta-button signup">Get Started</Link>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;