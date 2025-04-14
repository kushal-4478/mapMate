import React from "react";
import { useLocation } from "react-router-dom";
import "./Confirmation.css";

const Confirmation = () => {
  const location = useLocation();
  const { bookingDetails } = location.state;

  return (
    <div className="confirmation-container">
      <h1>Booking Confirmed!</h1>
      <p>Thank you for your booking.</p>
      <p>
        <strong>Venue:</strong> {bookingDetails.venueName}
      </p>
      <p>
        <strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}
      </p>
      <p>
        <strong>Time:</strong> {bookingDetails.time}
      </p>
      <p>
        <strong>Guests:</strong> {bookingDetails.guests}
      </p>
      <p>
        <strong>Total Amount:</strong> ${bookingDetails.amount}
      </p>
    </div>
  );
};

export default Confirmation;