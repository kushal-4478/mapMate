import express from "express";
import paymentRoutes from "./routes/paymentRoutes.js";
import userRoute from "./routes/userRoute.js";
import locationRoutes from "./routes/locationRoutes.js";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.NODE_ENV==='production'?"REACT_APP_API_URL":"http://localhost:3000",
  credentials: true
}));

// Mount routes - ensure userRoute is mounted before paymentRoutes
app.use("/api/users", userRoute);
app.use("/api/users", paymentRoutes);
app.use('/api/location', locationRoutes);

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

export default app;