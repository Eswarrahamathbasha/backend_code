const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Import database connection function

// Load environment variables
dotenv.config();

// Check if essential environment variables are loaded
if (!process.env.MONGO_URI) {
  console.error('Error: MONGODB_URI is not defined in environment variables.');
  process.exit(1);
}

if (!process.env.PORT) {
  console.error('Warning: PORT is not defined, defaulting to 3000.');
}

const app = express();

// Enable CORS with specified origins
app.use(
  cors({
    origin: [
      'https://project-manager-react-liard.vercel.app', // Production URL
      'http://localhost:3000', // Backend URL
      'http://localhost:3001', // Frontend URL
      'http://localhost:3002', // Additional frontend URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Middleware to parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware for request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Initialize database and start server
const initializeServer = async () => {
  try {
    // Connect to the database
    await connectDB();
    console.log('Database connected successfully.');

    // Route imports and API registrations
    app.use('/api/user', require('./routes/userRoutes'));
    app.use('/api/webapp', require('./routes/webAppRoutes'));
    app.use('/api/payment', require('./routes/paymentRoutes'));
    app.use('/api/org', require('./routes/organizationRoutes'));
    app.use('/api/proj', require('./routes/projectRoutes'));
    app.use('/api/add-user', require('./routes/addUserRoutes'));
    app.use('/api', require('./routes/serviceRoutes'));
    app.use('/api/hubingest', require('./routes/hubIngestRoutes'));
    app.use('/api/subscriptions', require('./routes/subscriptionRoutes'));

    // Health check route
    app.get('/', (req, res) => {
      res.status(200).send('Server is deployed and running successfully.');
    });

    // Handle undefined routes
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        message: `Route not found: ${req.method} ${req.url}`,
      });
    });

    // Global error handler
    app.use((err, req, res, next) => {
      console.error('Global error handler triggered:', err);
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
      });
    });

    // Start the server
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to initialize server:', error.message);
    process.exit(1); // Exit process if database connection fails
  }
};

// Initialize the server
initializeServer();
