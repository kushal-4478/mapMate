import React,{useState} from 'react'
import {Link} from 'react-router-dom'
import {useHistory} from 'react-router-dom'
//aditya ashok pawar
const App = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const history = useHistory();

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
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        // Store JWT token in localStorage
        localStorage.setItem("authToken", data.token);
        alert("Login successful!");
        history.push("/dashboard"); // Redirect to a protected page
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Login</h2>

        <form>
          <div className="form-group">
            <label>Username or Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Username or Email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              required
            />
          </div>

          <button className="btn" type="submit">Login</button>

          <p className="signup-link">
            Don't have an account? <Link to="/signin">Sign up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default App;
