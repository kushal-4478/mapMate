import React, { useState } from "react";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Sign up successful!");
        // Redirect to login page or dashboard
        window.location.href = "/login";
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="Signinbox">
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit}>
          <div className="form">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter Your Name"
              required
            />
          </div>

          <div className="form">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Your Email"
              required
            />
          </div>

          <div className="form">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              required
            />
          </div>

          <div className="form">
            <label>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              required
            />
          </div>

          <div className="form">
            <label>Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter Your Age"
              required
            />
          </div>

          <div className="form">
            <label>Gender</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              placeholder="Enter Your Gender"
              required
            />
          </div>

          <button type="submit" className="signbutton">
            Sign up
          </button>
          <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
        <div class="sign">
               <h3>Continue with</h3>
             </div>
             // ...existing code...
<div className="social-buttons">
    <a href="http://localhost:3000/auth/google" className="social-btn google-btn">
        <img 
            src="/images/google.png"
            alt="Google" 
            className="social-icon"
        />
    </a>
    <a href="http://localhost:3000/auth/facebook" className="social-btn facebook-btn">
        <img 
            src="/images/facebook.png"
            alt="Facebook" 
            className="social-icon"
        />
    </a>
</div>
  
      </div>
    </div>
  );
};

export default SignUp;