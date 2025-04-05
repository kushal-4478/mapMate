const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Payment handler
export const createPayment = async (req, res) => {
    try {
        const { amount, currency, paymentMethodId } = req.body;

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method: paymentMethodId,
            confirm: true,
        });

        res.status(200).json({
            success: true,
            paymentIntent,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

