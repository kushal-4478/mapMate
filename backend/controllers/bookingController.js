import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51RAcrtITbk4wZ4pzy1ClslzaaUPiac2HqSXMEzCqM1mpyZjdK17Z8I8XXnTcqwNVyhZs6ucmgxsGKeSqoDy2VCMs00UPjxdwuX');

export const createBooking = asyncHandler(async (req, res) => {
  try {
    const {
      venueName,
      location,
      date,
      time,
      guestCount,
      tableNumber,
      totalAmount,
      specialRequests
    } = req.body;
   console.log(req.user)
    const booking = await Booking.create({
      userId: req.user._id,
      venueName,
      location,
      date,
      time,
      guestCount,
      tableNumber,
      totalAmount,
      specialRequests,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export const getAllBookings = asyncHandler(async (req, res) => {
  try {
  
    const bookings = await Booking.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      bookings
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export const updateBookingStatus = asyncHandler(async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

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