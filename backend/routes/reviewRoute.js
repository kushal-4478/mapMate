import express from 'express';
import {
  addReview,
  getUserReviews,
  getAverageRating
} from '../controllers/reviewController.js';

const router = express.Router();

router.post('/add', addReview);
router.get('/:userId', getUserReviews);
router.get('/average/:userId', getAverageRating);

export default router;
