import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/usermodel.js";

export const protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        res.status(401);
        throw new Error("Not authorized, no token");
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "yourAccessTokenSecret");

        // Attach the user to the request
        req.user = await User.findById(decoded.id).select("-password");

        next();
    } catch (error) {
        res.status(401);
        throw new Error("Not authorized, token failed");
    }
});