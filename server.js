const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const webAppRoutes = require('./routes/webAppRotes');
const organizationRoutes = require('./routes/organizationRoutes');
const projectRoutes = require('./routes/projectRoutes');
const addUserRoutes = require('./routes/addUserRoutes'); // Ensure this is correct
const serviceRoutes = require('./routes/serviceRoutes');
const paymentRoutes = require('./routes/paymentRoutes'); // Import payment routes

const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config(); // Load environment variables
connectDB(); // Database connection

const app = express();

// Middleware
// app.use(cors()); // Add CORS middleware
// Middleware - IMPORTANT: Order matters!
app.use(cors({
  origin: ['https://project-manager-react-amber.vercel.app', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', '*'], // Add all possible origins
  methods: ['GET', 'POST', 'PUT', 'OPTIONS', 'DELETE'], // Explicitly allow POST
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/webAppRoutes', webAppRoutes);
app.use('/api/org', organizationRoutes);
app.use('/api/proj', projectRoutes);
app.use('/api/add-user', addUserRoutes); // Add new user routes
app.use('/api', serviceRoutes);
app.use('/api/payment', paymentRoutes); // Payment-related routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err); // Log the full error for debugging
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

app.get('/', function (req, res) {
  res.send('Its deployed');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});