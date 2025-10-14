const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticate, isAdmin } = require('../middleware/auth');
const { sendOrderConfirmationEmail, sendAdminOrderNotification } = require('../utils/email');

// Create new order
router.post('/', authenticate, async (req, res) => {
    try {
        const { items, totalAmount, shippingInfo, paymentReference } = req.body;

        // Generate order number
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        const orderNumber = `LP${timestamp}${random}`;

        const order = await Order.create({
            userId: req.user._id,
            orderNumber,
            items,
            totalAmount,
            shippingInfo,
            paymentInfo: {
                reference: paymentReference,
                status: 'pending'
            }
        });

        // Send admin notification email
        await sendAdminOrderNotification(order);

        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            order
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to create order' 
        });
    }
});

// Get user's orders
router.get('/my-orders', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch orders' 
        });
    }
});

// Get single order
router.get('/:orderId', authenticate, async (req, res) => {
    try {
        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        // Check if user owns the order or is admin
        if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied' 
            });
        }

        res.json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch order' 
        });
    }
});

// Update order payment status
router.put('/:orderId/payment', authenticate, async (req, res) => {
    try {
        const { status, paidAt } = req.body;

        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        order.paymentInfo.status = status;
        if (status === 'success') {
            order.paymentInfo.paidAt = paidAt || new Date();
            order.orderStatus = 'processing';

            // Send order confirmation email to customer
            await sendOrderConfirmationEmail(order, order.shippingInfo.email);
        }
        order.updatedAt = new Date();

        await order.save();

        res.json({
            success: true,
            message: 'Payment status updated',
            order
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update payment status' 
        });
    }
});

// Admin: Get all orders
router.get('/admin/all', authenticate, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch orders' 
        });
    }
});

// Admin: Update order status
router.put('/admin/:orderId/status', authenticate, isAdmin, async (req, res) => {
    try {
        const { orderStatus } = req.body;

        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { orderStatus, updatedAt: new Date() },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ 
                success: false, 
                message: 'Order not found' 
            });
        }

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to update order status' 
        });
    }
});

// Admin: Get statistics
router.get('/admin/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' });
        const processingOrders = await Order.countDocuments({ orderStatus: 'processing' });
        const deliveredOrders = await Order.countDocuments({ orderStatus: 'delivered' });
        
        const totalRevenue = await Order.aggregate([
            { $match: { 'paymentInfo.status': 'success' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        res.json({
            success: true,
            stats: {
                totalOrders,
                pendingOrders,
                processingOrders,
                deliveredOrders,
                totalRevenue: totalRevenue[0]?.total || 0
            }
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch statistics' 
        });
    }
});

module.exports = router;