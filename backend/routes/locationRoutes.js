import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { 
    shareLocation,
    updateLocation,
    getSharedLocations,
    findMidpoint 
} from '../controllers/locationController.js';

const router = express.Router();

router.post('/share', protect, shareLocation);
router.put('/update', protect, updateLocation);
router.get('/shared', protect, getSharedLocations);
router.get('/midpoint/:userId', protect, findMidpoint);

export default router;