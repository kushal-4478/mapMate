import { useState } from "react";
import "./contact.css";

const Contact = () => {
  const [contact, setContact] = useState({
    name: "",
    email: "",
    number: "",
    message: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    setContact({ ...contact, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contact),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      alert("✅ " + data.message);
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Something went wrong! " + error.message);
    }
  };
  

  return (
    <div className="contact-container">
      <h2>Contact Us 💌</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input type="text" name="name" value={contact.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={contact.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Phone Number:</label>
          <input type="number" name="number" value={contact.number} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Message:</label>
          <textarea name="message" value={contact.message} onChange={handleChange} required />
        </div>

        <button type="submit">Send ❤️</button>
      </form>
    </div>
  );
};

export default Contact;
