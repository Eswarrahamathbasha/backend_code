const Subscription = require('../models/subscription');

/**
 * Updates or creates a subscription for a user based on their email.
 * @param {Object} req - The request object containing email, type, details, id, and status.
 * @param {Object} res - The response object to send results.
 */
const upsertSubscription = async (req, res) => {
  const { email, type, details, id, status } = req.body;

  // Validate required fields
  if (!email || !type || !details || !id || !status) {
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }

  // Additional validation for field formats
  if (!email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  if (!['Free', 'Basic', 'Premium'].includes(type)) {
    return res.status(400).json({ success: false, message: 'Invalid subscription type' });
  }

  if (!['Active', 'Expired', 'Pending'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid subscription status' });
  }

  try {
    // Upsert the subscription
    const subscription = await Subscription.findOneAndUpdate(
      { email },
      { email, type, details, id, status },
      { new: true, upsert: true } // Create if not found
    );

    if (!subscription) {
      console.error('Database Error: Failed to update or create subscription.');
      return res.status(500).json({ success: false, message: 'Failed to update or create subscription.' });
    }

    console.log('Subscription successfully updated or created:', subscription);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error in upsertSubscription:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

/**
 * Retrieves subscription details by a user's email.
 * @param {Object} req - The request object containing email as a parameter.
 * @param {Object} res - The response object to send results.
 */
const getSubscriptionByEmail = async (req, res) => {
  const { email } = req.params;

  // Validate email parameter
  if (!email) {
    console.error('Validation Error: Missing email parameter in getSubscriptionByEmail.');
    return res.status(400).json({ success: false, message: 'Email is required as a parameter.' });
  }

  if (!email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }

  try {
    // Fetch subscription by email
    const subscription = await Subscription.findOne({ email });

    if (!subscription) {
      console.error('Not Found: No subscription found for email:', email);
      return res.status(404).json({ success: false, message: 'Subscription not found.' });
    }

    console.log('Subscription retrieved successfully:', subscription);
    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    console.error('Error in getSubscriptionByEmail:', error);
    res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

// Debug log to ensure functions are correctly exported
console.log('Exporting upsertSubscription and getSubscriptionByEmail functions.');

module.exports = {
  upsertSubscription,
  getSubscriptionByEmail,
};