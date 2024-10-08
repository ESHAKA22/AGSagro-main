const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');

// POST /api/orders - Endpoint to place an order
router.post('/', async (req, res) => {
    try {
        const { customerId, cart, shippingDetails, paymentDate, cartTotal } = req.body;
        const newOrder = new Order({
            customerId,
            cart,
            shippingDetails,
            paymentDate,
            cartTotal,
            status: 'pending',
            createdAt: new Date(),
        });

        await newOrder.save();
        res.status(201).json({ message: 'Order saved successfully', order: newOrder });
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ message: 'Failed to save order', error: error.message });
    }
});



router.get('/', async (req, res) => {
    try {
        const orders = await Order.find(); // Fetch all orders from the database
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Return a 500 error if something goes wrong
    }
});



router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find(); // Fetch all orders from the database
        res.json(orders); // Send the list of orders as a JSON response
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});



module.exports = router;
