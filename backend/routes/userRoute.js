import express from "express"
import { registerUser,loginUser,signOutUser,refreshAccessToken } from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { getSuggestions } from "../controllers/getSuggestion.js";
import {createBooking, confirmBooking } from "../controllers/bookingController.js"
import { createPayment } from "../controllers/paymentController.js";
const router = express.Router();

//routing
router.post("/register", registerUser);

router.post("/login", loginUser);


router.post("/signout", signOutUser);


router.get("/refresh-token", refreshAccessToken);

// Route to fetch location-based suggestions
router.post("/suggestions", getSuggestions);

//BOOKING 
router.post('/book', createBooking);
router.post('/confirm-booking', confirmBooking);

//PAYMENT
router.post('/create-payment', createPayment);

export default router;