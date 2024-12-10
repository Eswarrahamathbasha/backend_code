const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt.config');

// Utility function to generate a JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn,
  });
};

// Register a new user
exports.registerUser = async (data) => {
  try {
    const { fullName, email, password, mobile, country, state, companyName, designation } = data;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('A user with this email already exists.');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save the new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      mobile,
      country,
      state,
      companyName,
      designation,
    });

    const savedUser = await newUser.save();

    // Return the user data without the password
    const userWithoutPassword = savedUser.toObject();
    delete userWithoutPassword.password;

    return userWithoutPassword;
  } catch (error) {
    console.error('Error in registerUser:', error.message);
    throw error;
  }
};

// Authenticate an existing user
exports.authenticateUser = async (email, password) => {
  try {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Compare the provided password with the stored hash
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Generate a JWT token
    const token = generateToken(user._id);

    // Remove the password field before returning the user object
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
      success: true,
      message: 'Authentication successful',
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error('Error in authenticateUser:', error.message);
    throw error;
  }
};

// Fetch user details by email
exports.fetchUserDetails = async (email) => {
  try {
    // Fetch the user details from the database, excluding the password field
    const user = await User.findOne({ email }).select('-password'); // Exclude the password field
    if (!user) {
      throw new Error('User not found.');
    }

    return user;
  } catch (error) {
    console.error('Error in fetchUserDetails:', error.message);
    throw error;
  }
};
