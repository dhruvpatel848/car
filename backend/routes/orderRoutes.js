const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { Parser } = require('json2csv');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Debug Route
router.get('/ping', (req, res) => {
    console.log('GET /api/orders/ping hit');
    res.send('Orders API is working');
});

// Get Booked Slots for a Date
router.get('/slots', async (req, res) => {
    try {
        const { date } = req.query;
        if (!date) return res.status(400).json({ message: 'Date is required' });

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const orders = await Order.find({
            appointmentDate: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            status: { $ne: 'Cancelled' }
        }).select('appointmentTime');

        const bookedSlots = orders.map(order => order.appointmentTime);
        res.json(bookedSlots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Razorpay Order
router.post('/create-razorpay-order', async (req, res) => {
    try {
        const { amount, receipt } = req.body;
        const options = {
            amount: amount * 100, // Amount in paise
            currency: 'INR',
            receipt: receipt
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (err) {
        console.error('Razorpay Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Verify Razorpay Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Update Order Status
            await Order.findByIdAndUpdate(orderId, {
                paymentStatus: 'Paid',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id,
                status: 'Confirmed'
            });

            res.json({ success: true, message: 'Payment Verified' });
        } else {
            res.status(400).json({ success: false, message: 'Invalid Signature' });
        }
    } catch (err) {
        console.error('Verification Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// Create Order (Standard)
router.post('/', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Get All Orders (Admin)
router.get('/', async (req, res) => {
    console.log('GET /api/orders hit');
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        console.log(`Found ${orders.length} orders`);
        res.json(orders);
    } catch (err) {
        console.error('Error fetching orders:', err);
        res.status(500).json({ message: err.message });
    }
});

// Update Order Status
router.put('/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedOrder);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Download CSV
router.get('/csv', async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query).lean();

        const fields = ['_id', 'customerName', 'customerEmail', 'serviceName', 'amount', 'status', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(orders);

        res.header('Content-Type', 'text/csv');
        res.attachment('orders.csv');
        return res.send(csv);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
