import app from "./app.js"
import dotenv from "dotenv"
import express from "express";
import  {connectDB} from "../backend/database/mongoDB.js"

///config
dotenv.config({ path: "./backend/config/config.env" });

//console.log(process.env.PORT);
const PORT = process.env.PORT || 0;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Dating App Backend!');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

connectDB();