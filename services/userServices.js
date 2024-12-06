const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config/jwt.config');

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, jwtConfig.secret, {
        expiresIn: jwtConfig.expiresIn
    });
};

exports.registerUser = async (data) => {
    const { fullName, email, password, mobile, country, state, companyName, designation } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save user
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

    return await newUser.save();
};

exports.authenticateUser = async (email, password) => {
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
        return {
            success: false,
            message: 'Invalid email or password'
        };
    }

    // Generate JWT token using jwtConfig
    const token = jwt.sign(
        { userId: user._id },
        jwtConfig.secret,
        { expiresIn: jwtConfig.expiresIn }
    );

    // Remove password from user object
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return {
        success: true,
        user: userWithoutPassword,
        token
    };
};