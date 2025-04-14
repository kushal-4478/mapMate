import Stripe from "stripe";

const stripe = new Stripe("sk_test_51RAcrtITbk4wZ4pzy1ClslzaaUPiac2HqSXMEzCqM1mpyZjdK17Z8I8XXnTcqwNVyhZs6ucmgxsGKeSqoDy2VCMs00UPjxdwuX");

export const createCheckoutSession = async (req, res) => {
    try {
        console.log("Request Body:", req.body); // Log the request body

        const { amount, currency, paymentMode, successUrl, cancelUrl } = req.body;

        // Validate required fields
        if (!amount || !currency || !successUrl || !cancelUrl) {
            console.error("Missing required fields:", { amount, currency, successUrl, cancelUrl });
            return res.status(400).json({ success: false, message: "Amount, currency, successUrl, and cancelUrl are required" });
        }

        // Create a Stripe Checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: [paymentMode], // Use the payment mode sent from the frontend
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: "Your Product Name", // Replace with the actual product name
                        },
                        unit_amount: Math.round(amount * 100), // Convert to smallest currency unit (e.g., cents)
                    },
                    quantity: 1,
                },
            ],
            mode: "payment", // Use "payment" mode for one-time payments
            success_url: successUrl, // Redirect here after successful payment
            cancel_url: cancelUrl, // Redirect here if the payment is canceled
        });

        console.log("Checkout Session URL:", session.url); // Log the session URL
        res.status(200).json({ success: true, url: session.url });
    } catch (error) {
        console.error("Error creating Checkout Session:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};
