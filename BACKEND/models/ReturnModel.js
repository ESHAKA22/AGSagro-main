const mongoose = require("mongoose");

const returnSchema = new mongoose.Schema({
    ordernu: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    image: { type: String, required: true },
    qty: { type: Number, required: true },
    reason: { type: String, required: true },
    customerId: { type: String, required: true }, // Add this field to track the customer
});

const Return = mongoose.model("Return", returnSchema);
module.exports = Return;
