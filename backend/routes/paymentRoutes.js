import express from "express";
import { createCheckoutSession } from "../controllers/paymentController.js";

const router = express.Router();

// Route to create a Stripe Checkout session
router.post("/create-checkout-session", createCheckoutSession);

export default router;