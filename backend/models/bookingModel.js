import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  placeId: { type: String, required: false },

  category: { type: String, required: true }, // e.g., "restaurant", "concert", "museum"
  title: { type: String, required: true }, // name of the event/place
  address: { type: String, required: true },

  date: { type: Date, required: true }, // Changed to Date type
  time: { type: String, required: true },

  guests: { 
    type: Number, 
    required: true,
    min: [1, 'Number of guests must be at least 1'] 
  },
  amount: { 
    type: Number, 
    required: true,
    min: [0, 'Amount cannot be negative'] 
  },

  status: { type: String, default: 'pending' },
  paymentId: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Booking', bookingSchema);
