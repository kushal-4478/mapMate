import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainPage from "./web";
import FindVenue from "./components/FindVenue"; // Change Dashboard to FindVenue
import Login from "./Login";
import SignUp from "./SignUp"; // Changed from Signin
import Contact from "./contact";
import Navbar from "./components/Navbar";
import Home from './components/Home';
import Booking from './booking/Booking';
import Payment from './booking/Payment';
import Confirmation from './booking/Confirmation';
import PaymentSuccess from './booking/PaymentSuccess';
import PaymentCancel from './booking/PaymentCancel';
import PrivateRoute from './components/PrivateRoute';
import Profile from './components/Profile';
import GetBookings from './components/GetBookings'; // Add this import
import { AppProvider } from './context/AppContext';
import LandingPage from './components/LandingPage';
import LocationSharing from './components/LocationSharing';

const App = () => {
  return (
    <AppProvider> 
        <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} /> {/* Changed from /signin */}
        <Route path="/contact" element={<Contact />} />
        <Route 
          path="/home" 
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } 
        />
        <Route
          path="/find-venue"  // Changed from /dashboard
          element={
            <PrivateRoute>
              <FindVenue />  // Changed from Dashboard
            </PrivateRoute>
          }
        />
        <Route path="/booking" element={
          <PrivateRoute>
            <Booking />
          </PrivateRoute>
        } />
        <Route path="/payment" element={
          <PrivateRoute>
            <Payment />
          </PrivateRoute>
        } />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancel" element={<PaymentCancel />} />
        <Route 
          path="/profile" 
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/my-bookings" 
          element={
            <PrivateRoute>
              <GetBookings />
            </PrivateRoute>
          } 
        />
        <Route path="/location-sharing" element={<LocationSharing />} />
        <Route path="*" element={<h1>404: Page Not Found</h1>} />
      </Routes>
    </Router>
    </AppProvider>
    
  );
};

export default App;