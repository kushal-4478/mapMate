import mongoose from "mongoose";
import asyncHandler from "../utils/asyncHandler.js"; // Correct path to asyncHandler.js

 export const connectDB = asyncHandler(async () => {
    const conn = await mongoose.connect(process.env.MONGO_DB_URL, {
     
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
});

