import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51RAcrtITbk4wZ4pzy1ClslzaaUPiac2HqSXMEzCqM1mpyZjdK17Z8I8XXnTcqwNVyhZs6ucmgxsGKeSqoDy2VCMs00UPjxdwuX');
// Create a new booking
export const createBooking = async (req, res) => {
  const { userId, venueName, venueType, placeId, address, location, date, time, guests, amount } = req.body;

  if (!userId) {
    return res.status(400).json({ success: false, message: "User ID is required" });
  }
  if (!venueName) {
    return res.status(400).json({ success: false, message: "Venue name is required" });
  }
  if (!venueType) {
    return res.status(400).json({ success: false, message: "Venue type is required" });
  }
  if (!placeId) {
    return res.status(400).json({ success: false, message: "Place ID is required" });
  }
  if (!address) {
    return res.status(400).json({ success: false, message: "Address is required" });
  }
  if (!location) {
    return res.status(400).json({ success: false, message: "Location is required" });
  }
  if (!date) {
    return res.status(400).json({ success: false, message: "Date is required" });
  }
  if (!time) {
    return res.status(400).json({ success: false, message: "Time is required" });
  }
  if (!guests) {
    return res.status(400).json({ success: false, message: "Number of guests is required" });
  }
  if (!amount) {
    return res.status(400).json({ success: false, message: "Amount is required" });
  }

  // if (!userId || !venueName || !date || !time || !amount || !placeId) {
  //   return res.status(400).json({ success: false, message: "Missing required fields for booking" });
  // }

  try {
    const booking = new Booking({
      userId,
      placeId,
      category: venueType,
      title: venueName,
      address,
      location,
      date,
      time,
      guests,
      amount,
      status: "pending",
    });

    const savedBooking = await booking.save();
    res.status(201).json({ success: true, bookingId: savedBooking._id });
  } catch (error) {
    console.error("Error creating booking:", error.message);
    res.status(500).json({ success: false, message: "Failed to create booking", error: error.message });
  }
};

// // Create a payment for a booking
// export const createPayment = async (req, res) => {
//   try {
//     const { bookingId, amount, currency, paymentMethodId } = req.body;

//     if (!bookingId || !amount || !currency || !paymentMethodId) {
//       return res.status(400).json({ success: false, message: "Missing required fields" });
//     }

//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100,
//       currency,
//       payment_method: paymentMethodId,
//       confirm: true,
//       return_url : "http://localhost:3000/api/users/confirmation",
//     });

//     const booking = await Booking.findByIdAndUpdate(
//       bookingId,
//       { status: "confirmed", paymentId: paymentIntent.id },
//       { new: true }
//     );

//     if (!booking) {
//       return res.status(404).json({ success: false, message: "Booking not found" });
//     }

//     res.status(200).json({ success: true, booking });
//   } catch (error) {
//     console.error("Error processing payment:", error.message);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// Get all bookings
export const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find(); // Fetch all bookings
        res.status(200).json({ success: true, bookings });
    } catch (error) {
        console.error("Error fetching bookings:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch bookings", error: error.message });
    }
};

// Get a single booking by ID
export const getBookingById = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id); // Fetch booking by ID
        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }
        res.status(200).json({ success: true, booking });
    } catch (error) {
        console.error("Error fetching booking:", error.message);
        res.status(500).json({ success: false, message: "Failed to fetch booking", error: error.message });
    }
};