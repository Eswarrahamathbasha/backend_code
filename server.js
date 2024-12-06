const express = require('express');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const webAppRoutes = require('./routes/webAppRotes')
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config(); // Load environment variables
connectDB(); // Database connection

const app = express();

// Middleware
// app.use(cors()); // Add CORS middleware
// Middleware - IMPORTANT: Order matters!
app.use(cors({
  origin: ['https://react-liard.vercel.app', 'http://localhost:3000'], // Add all possible origins
  methods: ['GET', 'POST', 'OPTIONS'], // Explicitly allow POST
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/user', userRoutes);
app.use('/api/webAppRoutes', webAppRoutes)

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