require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 8070;

// Middleware to handle CORS and allow credentials
app.use(cors({
  origin: 'http://localhost:3000', // Allow only your frontend
  credentials: true,               // Allow credentials (cookies, auth headers, etc.)
}));

// Middleware
app.use(express.json()); // Parse incoming JSON
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'uploads'))); // Serve static files (uploads)

// MongoDB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || process.env.MONGODB_URL || "mongodb+srv://Pamudu:ags123@ags.prm6t.mongodb.net/AGS?retryWrites=true&w=majority&appName=AGS", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection failed:', err.message);
        process.exit(1);
    }
};

connectDB();

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded design files
app.use('/images', express.static(path.join(__dirname, 'images')));   // Serve uploaded images

// Import your routes
const productRoutes = require('./routes/ProductRoutes');
const authRoutes = require('./routes/auth.route.js');
const contractRoutes = require('./routes/contract.route.js');
const editRoutes = require('./routes/edit.route.js');
const supplierRoutes = require('./routes/sup.route.js');
const ClientRouter = require('./routes/clientRouter');
const uploadRouter = require('./routes/uploadRouter');
const loyaltyRouter = require('./routes/loyaltyRouter');
const requestRouter = require('./routes/requests');
const cartRoutes = require('./routes/CartRoutes'); // New import for cart routes
const orderRoutes = require('./routes/orderRoutes');  // Your order routes
const ReturnRoutes = require('./routes/ReturnRoutes'); // Added Return Routes

// Import friend's routes
const customerRouter = require('./routes/customer');
const feedbackRouter = require('./routes/feedbackRoutes');
const newsRouter = require('./routes/newsRoutes');



// Use your routes
app.use('/api/products', productRoutes);

// Example route from friend's server.js
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  Product.findById(id)
    .then(product => res.json(product))
    .catch(err => res.status(500).json({ error: 'Product not found' }));
});

// Use your routes
app.use('/api/auth', authRoutes);
app.use('/api/contract', contractRoutes);
app.use('/api/edit', editRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api', ClientRouter);
app.use('/api', uploadRouter); // Combined API routes for uploads
app.use('/requests', requestRouter); // Requests routes

// Use cart routes
app.use('/api/cart', cartRoutes); // Added cart routes
app.use('/api/requests', requestRouter);
app.use('/api/orders', orderRoutes); // Use the new order routes

app.use('/returns', ReturnRoutes);

// Use friend's routes
app.use('/customer', customerRouter);
app.use('/feedback', feedbackRouter);
app.use('/news', newsRouter);



// Approval route
app.put('/requests/:id/approve', async (req, res) => {
    try {
        const requestId = req.params.id;
        const updatedRequest = await Request.findByIdAndUpdate(requestId, { status: 'Approved' }, { new: true });
        res.json(updatedRequest);
    } catch (error) {
        res.status(500).json({ message: 'Failed to approve request' });
    }
});


app.get('/returns', async (req, res) => {
    const { customerId } = req.query; // Get the customerId from query parameters
  
    try {
      const returnOrders = await ReturnOrderModel.find({ customerId }); // Filter by customerId
      res.status(200).json({ returns: returnOrders });
    } catch (error) {
      res.status(500).json({ error: 'Error fetching return orders' });
    }
});


app.get('/api/orders', async (req, res) => {
    try {
        const orders = await OrderModel.find(); // Fetch all orders from the database
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching orders' });
    }
});




// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
