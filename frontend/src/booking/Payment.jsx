import React, { useState } from "react";
import "./Payment.css";
import { useLocation } from "react-router-dom";
import api from "../services/api";

const Payment = () => {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("usd");
    const [paymentMode, setPaymentMode] = useState("card");

    // ✅ Hook is called here, at the top level
    const location = useLocation();
    const { bookingId, amount: bookingAmount, venueName } = location.state || {};

    const handlePayNow = async () => {
        console.log(process.env.REACT_APP_API_URL);
        try {
            const response = await api.post(
                "/api/payment/create-checkout-session",
                {
                    amount: parseInt(amount || bookingAmount), // fallback to bookingAmount
                    currency: currency,
                    paymentMode: paymentMode,
                    bookingId: bookingId,
                    successUrl: `${process.env.REACT_APP_API_URL}/payment-success`,
                    cancelUrl: `${process.env.REACT_APP_API_URL}/payment-cancel`,
                },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            const { url } = response.data;
            if (!url) throw new Error("Failed to create Checkout session");

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error("Error creating Checkout session:", error);
            alert(error.response?.data?.message || error.message);
        }
    };

    return (
        <div>
            <h1>Complete Your Payment</h1>
            <form>
                <label>
                    Amount:
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter amount"
                        required
                    />
                </label>
                <br />
                <label>
                    Currency:
                    <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                        <option value="usd">USD</option>
                        <option value="eur">EUR</option>
                        <option value="inr">INR</option>
                        {/* Add more currencies as needed */}
                    </select>
                </label>
                <br />
                <label>
                    Payment Mode:
                    <select value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)}>
                        <option value="card">Card</option>
                        {/* Add more payment modes if needed */}
                    </select>
                </label>
                <br />
                <button type="button" onClick={handlePayNow}>
                    Pay Now
                </button>
            </form>
        </div>
    );
};

export default Payment;