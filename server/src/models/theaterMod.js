const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  amenities: {
    type: [String],
    default: []
  },
  seatLayout: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SeatLayout'
  },
  screens: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Theater = mongoose.model('Theater', theaterSchema);
module.exports = Theater;
