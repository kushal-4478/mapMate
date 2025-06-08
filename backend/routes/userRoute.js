import express from "express"
import { 
  registerUser, 
  loginUser, 
  signOutUser, 
  refreshAccessToken,
  getProfile ,
  updatePersonalDetails
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";
import { getSuggestions } from "../controllers/getSuggestion.js";
import {
    createBooking,
    //createPayment,
    getAllBookings,
    getBookingById,
} from "../controllers/bookingController.js";
import User from '../models/usermodel.js';  // Add this import at the top

import dotenv from 'dotenv';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

dotenv.config({ path: './config/config.env' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dlwjqpagt',
  api_key: '565231318985129',
  api_secret: 'C6O3NaL9aI4F13yrrUqLQF08DdM'
});

// Configure Multer
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

const router = express.Router();

//routing
router.post("/signup", registerUser);

router.post("/login", loginUser);


router.post("/signout", signOutUser);


router.get("/refresh-token", refreshAccessToken);

// Route to fetch location-based suggestions
router.post("/getsuggestions",protect, getSuggestions);

//BOOKING 
// Booking routes
router.post('/book', createBooking); // Create a new booking
//router.post('/create-payment', createPayment); // Create a payment for a booking
router.get('/bookings', getAllBookings); // Get all bookings
router.get('/bookings/:id', getBookingById); // Get a single booking by ID

// Protected profile route
router.get("/profile", protect, getProfile);

router.put("/update-personal-details", protect, updatePersonalDetails);

// Avatar upload route
router.post('/upload-avatar', protect, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Convert buffer to base64
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;

    console.log('Attempting to upload to Cloudinary...'); // Debug log

    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'avatars',
      transformation: [
        { width: 400, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });

    console.log('Cloudinary upload successful:', result); // Debug log

    // Update user in database
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      {
        avatar: {
          public_id: result.public_id,
          url: result.secure_url
        }
      },
      { new: true }
    ).select('-password');

    res.json({ avatar: user.avatar });
  } catch (error) {
    console.error('Avatar upload error:', error);
    res.status(500).json({ message: 'Error uploading avatar' });
  }
});

export default router;