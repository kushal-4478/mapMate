import './App.css'
import React,{useState} from "react"
import {Link} from "react-router-dom"
import {useHistory} from "react-router-dom";

 const App =()=>{
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
    interest: "",
    profilePicture: null,
  });
    

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0], // Save only the first file
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const formToSend = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'profilePicture') {
        formToSend.append(key, formData[key]); // Append the file
      } else {
        formToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch("http://localhost:5000/signup", {
        method: "POST",
        body: formToSend, // Send FormData as body
      });

      if (response.ok) {
        alert("Sign up successful!");
        // Redirect to login page after successful signup
      } else {
        alert("Error: " + (await response.text()));
      }
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };





    return (
        <div class="container">
        <div class="Signinbox">
        <h1>Sign up</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* name */}
         <div class="form">
            <label htmlFor="username">
                Username
                </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}

              placeholder="Enter Your Name"
              />
            
            
         </div>
         {/* email */}
         <div class="form">
            <label>
                Email
                </label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter You Email"
            />
            
         </div>
         {/* password */}
         <div class="form">
            <label>
                Password
                </label>
            <input
               type="password"
               name="password"
               value={formData.password}
               onChange={handleChange}

               placeholder="Enter Password"
               />
           
           
         </div>
         {/* confirm password */}
         <div class="form">
            <label>
                Confirm Password
                </label>
            <input
             type="password"
             name="confirmPassword"
             value={formData.confirmPassword}
             onChange={handleChange}
             placeholder="Confirm Password"
             />
          
            
         </div>
         {/* age */}
          <div class="form">
            <label>
                Age
                </label>
            <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Enter You Age"
             />
 
            
             
             </div>
             {/* gender */}
             <div class="form">
                <label>
                    Gender
                    </label>
                <input
                   type="text"
                   name="gender"
                   value={formData.gender}
                   onChange={handleChange}
                   placeholder="Enter Your gender"
                   />
                
                
             </div>
             {/* interest */}
             <div class="form">
                <label>
                    Interest
                    </label>
                <input
                   type="text"
                   name="interest"
                   value={formData.interest}
                   onChange={handleChange}
                   placeholder="Enter your area of interest"
                   />
                
               
             </div>
             {/* profilepicture */}
             <div className="form">
            <label className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-gray-300 hover:border-blue-500 cursor-pointer">
            <div >
                  Upload Image
                </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                
              />
             
                
             
                
             
            </label>
          </div>

             <button 
             type="submit" className="signbutton">
                Sign in

             </button>
             <p className="signup-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
             </form>
             <div class="sign">
               <h3>Continue with</h3>
             </div>
             <div className="social-buttons">
    <a href="http://localhost:3000/auth/google" className="social-btn google-btn">
        <img src="/google.png" alt="Google"  class="img"/>
       
    </a>
    <a href="http://localhost:3000/auth/facebook" className="social-btn facebook-btn">
        <img src="/facebook.png" alt="Facebook" />
        
    </a>
</div>
          </div>
          </div>
       


    );
}
export default App;