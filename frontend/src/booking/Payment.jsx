import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { createPayment } from "../services/api";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { bookingId, amount } = location.state;

  const handlePayment = async () => {
    const paymentData = {
      bookingId,
      amount,
      currency: "usd", // Example currency
      paymentMethodId: "pm_card_visa", // Replace with actual payment method ID from Stripe
    };

    try {
      const response = await createPayment(paymentData);
      console.log("Payment successful:", response);
      navigate("/confirmation", { state: { bookingDetails: response.booking } });
    } catch (error) {
      console.error("Error processing payment:", error.response?.data || error.message);
    }
  };

  return (
    <div className="payment-container">
      <h1>Payment for Booking</h1>
      <p>Total Amount: ${amount}</p>
      <button className="pay-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default Payment;