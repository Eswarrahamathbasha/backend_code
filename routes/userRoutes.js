const express = require('express');
const { signup, signin, getUserDetails } = require('../controllers/userController'); // Import getUserDetails
const { signupValidator } = require('../validators/signupValidators');
const { signinValidator } = require('../validators/signupValidators');
const { validateRequest } = require('../middlewares/validationMiddleware');

const router = express.Router();

// Define the signup route with validators
router.post('/signup', signupValidator, validateRequest, signup);

// Define the signin route with validators
router.post('/signin', signinValidator, validateRequest, signin);

// Add the route to fetch user details
router.get('/user-details', getUserDetails);

// Test route to verify userRoutes.js is functioning
router.get('/test', (req, res) => {
  res.json({ success: true, message: 'User route is working' });
  console.log('Its working');
});

module.exports = router;
