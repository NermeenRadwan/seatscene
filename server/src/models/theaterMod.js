// models/Theater.js

const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  showtimes: {
    type: [String],  // Array of time strings
    required: true,
    validate: [arrayLimit, '{PATH} must have at least one showtime']
  }
}, {
  timestamps: true
});

// Custom validator to ensure at least one showtime is provided
function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Theater', theaterSchema);
