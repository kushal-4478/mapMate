import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Replace useHistory with useNavigate
import api from "./services/api";
const App = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Use useNavigate instead of useHistory

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value,
    });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    
    const response = await api.post(
  "api/users/login", // Ensure this matches your backend route
  credentials, // Axios automatically JSON-stringifies objects
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);


    const data = await response.data;
    console.log("Login response:", data);
    console.log(data)
    if (!data.success) {
      // Show backend error message if available
      throw new Error(data.message || "Login failed");
    }

    // Check if response has the required data
    if (!data.token) {
      throw new Error("Login failed: Missing token");
    }

    // Store token and user data
    localStorage.setItem("authToken", data.token);
    localStorage.setItem("userId", data._id); // Changed from data.user.id to data._id

    // Show success message
    setMessage("Login successful!");

    // Navigate after a short delay to show the success message
    setTimeout(() => {
      navigate('/home');
    }, 1500);

  } catch (error) {
    setMessage(error.message || "Login failed");
    console.error("Error logging in:", error);
  }
};

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Username or Email"
              value={credentials.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>

          <button className="btn" type="submit">
            Login
          </button>

          <p className="signup-link">
            Don't have an account? <Link to="/signin">Sign up</Link>
          </p>
        </form>
        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
