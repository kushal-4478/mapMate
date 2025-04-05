import Booking from "../models/bookingModel.js"

export const createBooking = async (req, res) => {
  try {
    // Save booking with status 'pending'
    const booking = new Booking({ ...req.body, status: 'pending' });
    await booking.save();
    res.status(201).json({ success: true, bookingId: booking._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const confirmBooking = async (req, res) => {
  const { bookingId, paymentId } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: 'confirmed', paymentId },
      { new: true }
    );
    res.status(200).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
