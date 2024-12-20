// const mongoose = require('mongoose');

// const subscriptionSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true }, // Email address (name field updated)
//   type: { type: String, required: true, enum: ['Free', 'Basic', 'Premium'] }, // Subscription type
//   details: { type: String, required: true }, // Additional subscription details
//   id: { type: String, required: true, unique: true }, // Unique subscription ID
//   status: { type: String, required: true, enum: ['Active', 'Expired', 'Pending'] }, // Subscription status
// });

// const Subscription = mongoose.model('Subscription', subscriptionSchema);

// module.exports = Subscription;