import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  placeId: { type: String, required: true },

  category: { type: String, required: true }, // e.g., "restaurant", "concert", "museum"
  title: { type: String, required: true }, // name of the event/place
  address: { type: String, required: true },

  date: { type: String, required: true },
  time: { type: String, required: true },

  guests: { type: Number, required: true },
  amount: { type: Number, required: true },

  status: { type: String, default: 'pending' },
  paymentId: { type: String },
});

export default mongoose.model('Booking', bookingSchema);
