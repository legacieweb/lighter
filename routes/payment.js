const express = require('express');
const router = express.Router();
const axios = require('axios');
const { authenticate } = require('../middleware/auth');

// Initialize Paystack payment
router.post('/initialize', authenticate, async (req, res) => {
    try {
        const { email, amount, orderData } = req.body;

        console.log('Paystack init - Email:', `"${email}"`, 'Amount:', amount, 'Type:', typeof email);

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email address provided'
            });
        }

        // Convert amount to cents (Paystack uses smallest currency unit)
        const amountInCents = Math.round(amount * 100);

        const response = await axios.post(
            'https://api.paystack.co/transaction/initialize',
            {
                email,
                amount: amountInCents,
                currency: 'USD',
                metadata: {
                    userId: req.user._id,
                    orderData: JSON.stringify(orderData)
                },
                callback_url: `${req.protocol}://${req.get('host')}/payment-callback`
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        console.error('Paystack initialization error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to initialize payment',
            error: error.response?.data?.message || error.message
        });
    }
});

// Verify Paystack payment
router.get('/verify/:reference', authenticate, async (req, res) => {
    try {
        const { reference } = req.params;

        const response = await axios.get(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const paymentData = response.data.data;

        res.json({
            success: true,
            data: {
                status: paymentData.status,
                reference: paymentData.reference,
                amount: paymentData.amount / 100, // Convert from cents to dollars
                paidAt: paymentData.paid_at,
                metadata: paymentData.metadata
            }
        });
    } catch (error) {
        console.error('Paystack verification error:', error.response?.data || error.message);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to verify payment',
            error: error.response?.data?.message || error.message
        });
    }
});

// Webhook endpoint for Paystack
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    try {
        const hash = crypto
            .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
            .update(JSON.stringify(req.body))
            .digest('hex');

        if (hash === req.headers['x-paystack-signature']) {
            const event = req.body;

            // Handle different event types
            if (event.event === 'charge.success') {
                // Payment successful - update order status
                const { reference, metadata } = event.data;
                // Update order in database
                console.log('Payment successful:', reference);
            }
        }

        res.sendStatus(200);
    } catch (error) {
        console.error('Webhook error:', error);
        res.sendStatus(500);
    }
});

module.exports = router;