import Review from "../models/review.js";
import User from "../models/usermodel.js";
import mongoose from "mongoose";

// POST: Add a review
export const addReview = async (req, res) => {
  const { reviewerId, revieweeId, rating, comment } = req.body;

  if (!reviewerId || !revieweeId || !rating) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  if (reviewerId === revieweeId) {
    return res.status(400).json({ message: "You cannot review yourself" });
  }

  try {
    // const users = await User.find({});
    // console.log(users);

    const userExists = await User.findById(revieweeId);
    if (!userExists) {
      return res.status(404).json({ message: "User not found" });
    }

    const review = new Review({ reviewer: reviewerId, reviewee: revieweeId, rating, comment });
    await review.save();
    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this user" });
    }
    res.status(500).json({ message: "Error saving review", error: err.message });
  }
};

// GET: All reviews for a user
export const getUserReviews = async (req, res) => {
  const { userId } = req.params;
  try {
    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "username profilePicture");
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews", error: err.message });
  }
};

// GET: Average rating
export const getAverageRating = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await Review.aggregate([
      { $match: { reviewee: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: "$reviewee",
          avgRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ avgRating: 0, totalReviews: 0 });
    }

    const { avgRating, totalReviews } = result[0];
    res.json({ avgRating: avgRating.toFixed(1), totalReviews });
  } catch (err) {
    res.status(500).json({ message: "Error calculating average rating", error: err.message });
  }
};
