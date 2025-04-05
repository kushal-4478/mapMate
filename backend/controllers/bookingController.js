import Stripe from 'stripe';
import Booking from '../models/bookingModel.js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Stripe with your secret key
const stripe = new Stripe('sk_test_51RAcrtITbk4wZ4pzy1ClslzaaUPiac2HqSXMEzCqM1mpyZjdK17Z8I8XXnTcqwNVyhZs6ucmgxsGKeSqoDy2VCMs00UPjxdwuX');
// Create a new booking
export const createBooking = async (req, res) => {
    try {
        const { userId, venueName, venueType, placeId, address, location, date, time, guests, amount } = req.body;

        // Validate required fields
        if (!userId || !venueName || !date || !time || !amount) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Create a new booking
        const booking = new Booking({
            userId,
            venueName,
            venueType,
            placeId,
            address,
            location,
            date,
            time,
            guests,
            amount,
            status: "pending", // Default status
        });

        // Save the booking to the database
        const savedBooking = await booking.save();
        res.status(201).json({ success: true, bookingId: savedBooking._id });
    } catch (error) {
        console.error("Error creating booking:", error.message);
        res.status(500).json({ success: false, message: "Failed to create booking", error: error.message });
    }
};

// Create a payment for a booking
export const createPayment = async (req, res) => {
    try {
        const { bookingId, amount, currency, paymentMethodId } = req.body;

        // Validate required fields
        if (!bookingId || !amount || !currency || !paymentMethodId) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Create a payment intent with a return_url
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Stripe expects the amount in cents/paise
            currency,
            payment_method: paymentMethodId,
            confirm: true,
            return_url: "https://your-frontend-url.com/payment-success", // Replace with your frontend's success page URL
        });

        // Update the booking status to "confirmed" after successful payment
        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: "confirmed", paymentId: paymentIntent.id },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({ success: false, message: "Booking not found" });
        }

        res.status(200).json({
            success: true,
            message: "Payment successful and booking confirmed",
            paymentIntent,
            booking,
        });
    } catch (error) {
        console.error("Error processing payment:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

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