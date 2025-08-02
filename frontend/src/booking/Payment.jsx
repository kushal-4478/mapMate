import React, { useState } from "react";
import "./Payment.css"; // Import your CSS file for styling
const Payment = () => {
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState("usd"); // Default currency
    const [paymentMode, setPaymentMode] = useState("card"); // Default payment mode

    const handlePayNow = async () => {
        try {
            const response = await fetch(`/api/payment/create-checkout-session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    amount: parseInt(amount), // Convert amount to integer (smallest currency unit)
                    currency: currency, // ISO currency code (e.g., "usd")
                    paymentMode: paymentMode, // Payment mode (e.g., "card")
                    successUrl: `${REACT_APP_API_URL}/payment-success`, // Success page URL
                    cancelUrl: `${REACT_APP_API_URL}/payment-cancel`, // Cancel page URL
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const { url } = await response.json();

            if (!url) {
                throw new Error("Failed to create Checkout session");
            }

            // Redirect to Stripe Checkout
            window.location.href = url;
        } catch (error) {
            console.error("Error creating Checkout session:", error.message);
            alert(error.message);
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