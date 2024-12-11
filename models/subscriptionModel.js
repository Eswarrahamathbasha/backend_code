const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Free Trial", "Basic", "Premium"
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // Duration in days
}, { timestamps: true });

module.exports = mongoose.model('Subscription', subscriptionSchema);