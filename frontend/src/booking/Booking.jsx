import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createBooking } from "../services/api";
import "./Booking.css";

const Booking = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { place } = location.state; // Get the selected place from state
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [guests, setGuests] = useState(1);
  const [amount, setAmount] = useState(100); // Assume a default amount per guest
  const [error, setError] = useState("");

  const handleBooking = async () => {
    // Validate if placeId exists
    // if (!place || !place.id) {
    //   setError("Place ID is required but not provided.");
    //   console.error("Error: Place ID is missing.");
    //   return;
    // }

    const bookingData = {
      userId: "USER_ID", // Replace with actual user ID from auth
      placeId: place.id || "123456", // Ensure placeId is included
      category: place.types[0] || "venue", // Use first type or default
      title: place.name, // Venue name included here
      venueName: place.name, // Explicitly include venueName
      venueType: place.types[0] || "general", // Include venueType
      address: place.address,
      location: place.location || "Unknown Location", // Add location if available
      date: date, // Should be in ISO format (YYYY-MM-DD)
      time: time,
      guests: parseInt(guests),
      amount: parseFloat(amount),
    };

    try {
      const response = await createBooking(bookingData);
      if (response.success) {
        navigate("/payment", { 
          state: { 
            bookingId: response.bookingId, 
            amount: bookingData.amount 
          } 
        });
      }
    } catch (error) {
      console.error("Error creating booking:", error.response?.data || error);
      setError(error.response?.data?.message || "Failed to create booking.");
    }
  };

  return (
    <div className="booking-container">
      <h1>Booking for {place?.name || "Unknown Venue"}</h1>
      <p>{place?.address || "Address not available"}</p>
      {error && <div className="error-message">{error}</div>}
      <label>
        Date:
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </label>
      <label>
        Time:
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </label>
      <label>
        Number of Guests:
        <input
          type="number"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          min="1"
        />
      </label>
      <button className="proceed-button" onClick={handleBooking}>
        Book Your Seat
      </button>
    </div>
  );
};

export default Booking;