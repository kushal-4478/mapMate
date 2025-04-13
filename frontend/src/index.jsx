import React from 'react';
import ReactDOM from 'react-dom/client';
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Web from './web.jsx';
import Login from './Login.jsx';
import Signin from './Signin.jsx';
import Contact from './contact.jsx';
import Dashboard from './components/Dashboard'; // Import the Dashboard component

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Web />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} /> {/* Add the Dashboard route */}
      </Routes>
    </Router>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

