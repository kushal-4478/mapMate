import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Booking.css';

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const venue = location.state?.venue;

  // Redirect if no venue data
  useEffect(() => {
    if (!venue) {
      navigate('/find-venue');
    }
  }, [venue, navigate]);

  const [bookingData, setBookingData] = useState({
    venueName: venue?.name || '',
    location: venue?.location || '',
    date: '',
    time: '',
    guestCount: 1,
    tableNumber: '',
    specialRequests: '',
    totalAmount: venue?.price_level ? venue.price_level * 1000 : 2000 // Default price calculation
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No auth token found');
      }

      const response = await axios.post(
        'http://localhost:5000/api/users/book',
        {
          ...bookingData,
          venueName: venue.name,
          location: venue.vicinity || venue.location,
          coordinates: venue.coordinates
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        navigate('/payment', { 
          state: { 
            bookingId: response.data.booking._id,
            amount: bookingData.totalAmount,
            venueName: venue.name
          }
        });
      }
    } catch (error) {
      console.error('Booking error:', error.response?.data?.message || error.message);
      alert(`Booking failed: ${error.response?.data?.message || 'Please try again'}`);
    }
  };

  if (!venue) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="booking-container">
      <div className="venue-summary">
        <h2>{venue.name}</h2>
        <p>{venue.vicinity || venue.location}</p>
        {venue.rating && (
          <div className="venue-rating">
            Rating: {venue.rating} ⭐ ({venue.user_ratings_total} reviews)
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            required
            min={new Date().toISOString().split('T')[0]}
            value={bookingData.date}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              date: e.target.value
            }))}
          />
        </div>

        <div className="form-group">
          <label>Time</label>
          <input
            type="time"
            required
            value={bookingData.time}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              time: e.target.value
            }))}
          />
        </div>

        <div className="form-group">
          <label>Number of Guests</label>
          <input
            type="number"
            min="1"
            required
            value={bookingData.guestCount}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              guestCount: parseInt(e.target.value)
            }))}
          />
        </div>

        <div className="form-group">
          <label>Special Requests (Optional)</label>
          <textarea
            value={bookingData.specialRequests}
            onChange={(e) => setBookingData(prev => ({
              ...prev,
              specialRequests: e.target.value
            }))}
            maxLength="500"
          />
        </div>

        <div className="booking-summary">
          <h3>Booking Summary</h3>
          <p>Venue: {venue.name}</p>
          <p>Location: {venue.vicinity || venue.location}</p>
          <p>Price Level: {'₹'.repeat(venue.price_level || 1)}</p>
          <p className="total-amount">Total Amount: ₹{bookingData.totalAmount}</p>
        </div>

        <button type="submit" className="submit-button">
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default Booking;