import express from "express";

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());



// Middleware for error
// The error middleware should be used after all routes and other middleware
//catch async error GLOBAL ERROR HANDLER
//app.use(errorMiddleware);

export default app;