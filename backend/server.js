import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "express-session";
import path from 'path';
import { fileURLToPath } from 'url';
import app from "./app.js";
import { connectDB } from "./database/mongoDB.js";
import userRoute from "./routes/userRoute.js";
import passport from "./config/passportConfig.js";
import authRoutes from "./routes/authRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: "./config/config.env" });

// Constants
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_URL
        : process.env.BASE_URL,
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Session Middleware with secure settings for production
app.use(
    session({
        secret: process.env.SESSION_SECRET || "your-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        }
    })
);

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/users", userRoute); // User routes
app.use(authRoutes); // Auth routes
app.use("/api/payment", paymentRoutes); // Payment routes (updated path)

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    const frontendBuildPath = path.join(__dirname, '../frontend/build');
    app.use(express.static(frontendBuildPath));
    
    app.get('*', (req, res) => {
        res.sendFile(path.join(frontendBuildPath, 'index.html'));
    });
}

// Default Route
app.get('/', (req, res) => {
    res.send('Welcome to the Dating App Backend!');
});

const startServer = async () => {
    try {
        // Connect to MongoDB first
        await connectDB();
        
        // Then start the Express server
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

// Replace the existing server start code with this:
startServer();
