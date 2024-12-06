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
app.use(cors()); // Add CORS middleware
app.use(express.json());

// Routes
app.use('/api/user', userRoutes);
app.use('/api/webAppRoutes', webAppRoutes)

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.get('/', function (req, res) {
  res.send('Its deployed');
});

//for not getting cores errors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers", "*"
    //"Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});