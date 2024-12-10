const { registerUser, authenticateUser, fetchUserDetails } = require('../services/userServices');

// Signup Controller
exports.signup = async (req, res, next) => {
  try {
    const userData = req.body;

    // Call the service to register a new user
    const user = await registerUser(userData);

    res.status(201).json({
      success: true,
      message: 'User registered successfully.',
      data: user,
    });
  } catch (error) {
    console.error('Error in signup:', error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// Signin Controller
exports.signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Call the service to authenticate the user
    const result = await authenticateUser(email, password);

    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: result.message,
      });
    }

    res.status(200).json({
      success: true,
      message: 'User signed in successfully.',
      data: {
        user: result.user,
        token: result.token,
      },
    });
  } catch (error) {
    console.error('Error in signin:', error);
    next(error); // Pass the error to the error-handling middleware
  }
};

// Get User Details Controller
exports.getUserDetails = async (req, res, next) => {
  try {
    // Here we are using email from query params
    const { email } = req.query;

    // Check if email is provided
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required to fetch user details.',
      });
    }

    // Call the service to fetch user details from the database
    const user = await fetchUserDetails(email);

    // If user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    // Respond with user details
    res.status(200).json({
      success: true,
      message: 'User details retrieved successfully.',
      data: user,
    });
  } catch (error) {
    console.error('Error fetching user details:', error);
    next(error); // Pass the error to the error-handling middleware
  }
};
