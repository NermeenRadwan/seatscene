const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/usersRou');
const paymentRoutes = require('./routes/paymentRou');
const movieRoutes = require('./routes/movieRou');
const theaterRoutes = require('./routes/theaterRou');
const bookingRoutes = require('./routes/bookingRou');
const authRoutes = require('./routes/authRou');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:3000'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to SeatScene API' });
});

app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/auth', authRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const newPort = PORT + 1;
    console.log(`Port ${PORT} is in use, trying port ${newPort}...`);
    app.listen(newPort, () => {
      console.log(`Server is running on port ${newPort}`);
      console.log(`CORS enabled for origins: ${corsOptions.origin.join(', ')}`);
    });
  } else {
    console.error('Server error:', err);
  }
});
