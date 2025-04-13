import express from "express"
import { registerUser,loginUser,signOutUser,refreshAccessToken } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { getSuggestions } from "../controllers/getSuggestion.js";
import {
    createBooking,
    createPayment,
    getAllBookings,
    getBookingById,
} from "../controllers/bookingController.js";


const router = express.Router();

//routing
router.post("/signup", registerUser);

router.post("/login", loginUser);


router.post("/signout", signOutUser);


router.get("/refresh-token", refreshAccessToken);

// Route to fetch location-based suggestions
router.post("/getsuggestions", getSuggestions);

//BOOKING 
// Booking routes
router.post('/book', createBooking); // Create a new booking
router.post('/create-payment', createPayment); // Create a payment for a booking
router.get('/bookings', getAllBookings); // Get all bookings
router.get('/bookings/:id', getBookingById); // Get a single booking by ID

export default router;