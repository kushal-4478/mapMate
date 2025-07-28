import asyncHandler from 'express-async-handler';
import User from '../models/usermodel.js';

export const shareLocation = asyncHandler(async (req, res) => {
    const { targetUserId } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
        'locationSharing.isSharing': true,
        $addToSet: { 'locationSharing.sharedWith': targetUserId }
    });

    res.status(200).json({
        success: true,
        message: 'Location sharing enabled'
    });
});

export const updateLocation = asyncHandler(async (req, res) => {
    const { latitude, longitude } = req.body;
    const userId = req.user._id;

    await User.findByIdAndUpdate(userId, {
        'locationSharing.currentLocation.coordinates': [longitude, latitude],
        'locationSharing.currentLocation.lastUpdated': Date.now()
    });

    res.status(200).json({
        success: true,
        message: 'Location updated'
    });
});

export const getSharedLocations = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const users = await User.find({
        'locationSharing.sharedWith': userId,
        'locationSharing.isSharing': true
    });

    res.status(200).json({
        success: true,
        locations: users.map(user => ({
            userId: user._id,
            username: user.username,
            location: user.locationSharing.currentLocation
        }))
    });
});

export const findMidpoint = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const [user1, user2] = await Promise.all([
        User.findById(currentUserId),
        User.findById(userId)
    ]);

    const coord1 = user1.locationSharing.currentLocation.coordinates;
    const coord2 = user2.locationSharing.currentLocation.coordinates;

    const midpoint = {
        type: 'Point',
        coordinates: [
            (coord1[0] + coord2[0]) / 2,
            (coord1[1] + coord2[1]) / 2
        ]
    };

    res.status(200).json({
        success: true,
        midpoint
    });
});