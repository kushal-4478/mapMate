import express from "express";
import paymentRoutes from "./routes/paymentRoutes.js";
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

app.use("/api/users", paymentRoutes);

// Middleware for error
// The error middleware should be used after all routes and other middleware
//catch async error GLOBAL ERROR HANDLER
//app.use(errorMiddleware);



export default app;