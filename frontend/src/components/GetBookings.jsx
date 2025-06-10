import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GetBookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const response = await axios.get('http://localhost:5000/api/users/bookings', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const bookingsData = Array.isArray(response.data) ? response.data : 
          (response.data.bookings || []);
        
        setBookings(bookingsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        setError('Failed to fetch bookings');
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) return <div className="loading">Loading your bookings...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="bookings-container">
      <h2>My Bookings</h2>
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((booking) => (
            <div key={booking._id} className="booking-card">
              <div className="booking-header">
                <h3>{booking.venueName || 'Venue Name Not Available'}</h3>
                <span className={`status ${booking.status}`}>
                  {booking.status}
                </span>
              </div>
              
              <div className="booking-details">
                <div className="detail-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <p>{booking.location || 'Location not specified'}</p>
                </div>

                <div className="detail-item">
                  <i className="fas fa-calendar"></i>
                  <p>{booking.date ? formatDate(booking.date) : 'Date not specified'}</p>
                </div>

                <div className="detail-item">
                  <i className="fas fa-clock"></i>
                  <p>{booking.time || 'Time not specified'}</p>
                </div>

                <div className="detail-item">
                  <i className="fas fa-users"></i>
                  <p>{booking.guestCount || '0'} Guests</p>
                </div>

                {booking.tableNumber && (
                  <div className="detail-item">
                    <i className="fas fa-chair"></i>
                    <p>Table {booking.tableNumber}</p>
                  </div>
                )}

                <div className="detail-item">
                  <i className="fas fa-tag"></i>
                  <p>₹{booking.totalAmount || '0'}</p>
                </div>
              </div>

              <div className="booking-footer">
                <div className="special-requests">
                  <h4>Special Requests:</h4>
                  <p>{booking.specialRequests || 'None'}</p>
                </div>

                {booking.status === 'confirmed' && (
                  <button className="cancel-button">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;