const mongoose = require('mongoose');
const Return = require("../Models/ReturnModel");
const cloudinary = require('cloudinary').v2;

const { sendNotification } = require('../Services/notificationService');

cloudinary.config({
    cloud_name: 'dqkkx268v',
    api_key: '789921236797756',
    api_secret: 'TQDm-lN55Rk4rm8E5kyi2lz2pyw',
});

// Add a new return order with customerId
const addReturn = async (req, res, next) => {
    const { ordernu, name, email, phone, image, qty, reason, customerId } = req.body; // Include customerId in request body
    try {
        // Upload the image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
            folder: 'return-orders',
        });

        const imageUrl = cloudinaryResponse.secure_url;

        // Create a new return order with the Cloudinary image URL and customerId
        const newReturn = new Return({ ordernu, name, email, phone, image: imageUrl, qty, reason, customerId });
        await newReturn.save();

        return res.status(201).json({ message: "Return added successfully", newReturn });
    } catch (err) {
        console.error("Error adding return:", err);
        return res.status(500).json({ message: "Unable to add return" });
    }
};

// Create a return order with image upload and customerId
const createReturnOrder = async (req, res) => {
    try {
        const { ordernu, name, email, phone, image, qty, reason, customerId } = req.body; // Include customerId in request body

        // Upload the image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(image, {
            folder: 'return-orders',
        });

        const imageUrl = cloudinaryResponse.secure_url;

        // Save the return order with the Cloudinary image URL and customerId
        const newReturnOrder = new Return({
            ordernu,
            name,
            email,
            phone,
            image: imageUrl,
            qty,
            reason,
            customerId,
        });

        await newReturnOrder.save();
        res.status(201).json({ message: "Return Order created successfully", newReturnOrder });
    } catch (error) {
        console.error("Error creating return order:", error);
        res.status(500).json({ message: "Error creating return order", error });
    }
};

// Get all return orders for a specific customer
const getAllReturn = async (req, res, next) => {
    const { status, customerId } = req.query; // Get customerId from query parameters
    let returns;
    try {
        // Filter returns based on status and customerId
        returns = await Return.find(customerId ? { customerId, status } : { status });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(200).json({ returns });
};

const getById = async (req, res, next) => {
    const id = req.params.id;
    let returnOrder;
    try {
        returnOrder = await Return.findById(id);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    if (!returnOrder) {
        return res.status(404).json({ message: "No return found" });
    }
    return res.status(200).json({ returnOrder });
};

const updateReturn = async (req, res, next) => {
    const id = req.params.id;
    const { ordernu, name, email, phone, image, qty, reason, customerId } = req.body;
    let returnOrder;
    try {
        returnOrder = await Return.findByIdAndUpdate(id, { ordernu, name, email, phone, image, qty, reason, customerId });
        returnOrder = await returnOrder.save();
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
    return res.status(200).json({ returnOrder });
};

const deleteReturn = async (req, res, next) => {
    const id = req.params.id;
    try {
        // Check if return order exists
        const returnOrder = await Return.findById(id);
        if (!returnOrder) {
            return res.status(404).json({ message: "Return order not found" });
        }

        // Delete the return order
        await Return.findByIdAndDelete(id);
        return res.status(200).json({ message: "Return successfully deleted" });
    } catch (err) {
        console.error("Error deleting return order:", err);
        return res.status(500).json({ message: "Error deleting return order" });
    }
};

const approveReturn = async (req, res, next) => {
    const id = req.params.id;
    try {
        const returnOrder = await Return.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
        if (!returnOrder) {
            return res.status(404).json({ message: 'Return order not found' });
        }
        res.status(200).json({ returnOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error approving return', error });
    }
};

const rejectReturn = async (req, res, next) => {
    const id = req.params.id;
    try {
        const returnOrder = await Return.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
        if (!returnOrder) {
            return res.status(404).json({ message: 'Return order not found' });
        }
        res.status(200).json({ returnOrder });
    } catch (error) {
        res.status(500).json({ message: 'Error rejecting return', error });
    }
};

exports.addReturn = addReturn;
exports.createReturnOrder = createReturnOrder;
exports.getAllReturn = getAllReturn;
exports.getById = getById;
exports.updateReturn = updateReturn;
exports.deleteReturn = deleteReturn;
exports.approveReturn = approveReturn;
exports.rejectReturn = rejectReturn;
