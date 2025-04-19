import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import app from "./app.js";
import { connectDB } from "./database/mongoDB.js";
import userRoute from "./routes/userRoute.js";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// Load environment variables
dotenv.config({ path: "./backend/config/config.env" });

// Constants
const PORT = process.env.PORT || 0;

// Middleware
app.use(cors({
    origin: "http://localhost:3000", // Frontend URL
    credentials: true, // Allow cookies and credentials
}));

app.use(express.json());
app.use(cookieParser());

// Session Middleware
app.use(
    session({
        secret: "your-secret-key",
        resave: false,
        saveUninitialized: true,
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoute); // User routes
app.use(authRoutes); // Auth routes
app.use("/api/payment", paymentRoutes); // Payment routes (updated path)


// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Dating App Backend!');
});



// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Connect to the database
connectDB();
