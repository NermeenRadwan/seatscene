const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  showtime: {
    type: Date,
    required: true
  },
  seats: {
    type: [String],
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash'],
    default: 'credit_card'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'completed'
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
