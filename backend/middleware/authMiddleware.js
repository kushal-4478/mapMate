import jwt from 'jsonwebtoken';
import User from '../models/usermodel.js';
import asyncHandler from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, res, next) => {
    try {
        // Get token from header
        // console.log(req)
        // console.log("Headers:", req.headers);
        // console.log(req.headers)
        const token = req.headers.authorization?.replace('Bearer ', '');
        console.log('Received token:', token);
        
        // Debug logging

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Please provide a valid Bearer token'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Get user
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Add user to request
        req.user = user;
        next();

    } catch (error) {
        console.error('Auth Error:', error);
        res.status(401).json({
            success: false,
            message: `Authentication failed: ${error.message}`
        });
    }
});