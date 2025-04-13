import React from 'react';
import { Link } from 'react-router-dom';
import './main.css'; // Import CSS for styling


const MainPage = () => {
  return (
    <div className="main-container">
      <header className="header">
        <h2>Welcome to Our Dating App</h2>
        <h1>❤️ Find the Best Place for Your Love ❤️</h1>
      </header>

      <div className="btn-container">
        <Link to="/login">
          <button className="btn btn-login">Login</button>
        </Link>
        <Link to="/contact">
          <button className="btn btn-contact">Contact</button>
        </Link>
        <Link to="/dashboard">
          <button className="btn btn-dashboard">Dashboard</button>
        </Link>
      </div>

      <footer className="footer">
        <p>© 2025 LoveFinder. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default MainPage;