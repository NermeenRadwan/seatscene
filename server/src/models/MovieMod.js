
const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
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
    type: [String],  // Array of strings like '10:30 AM'
    required: true,
    validate: [arrayLimit, '{PATH} must have at least one showtime']
  }
}, {
  timestamps: true
});

// Custom validator for showtimes
function arrayLimit(val) {
  return val.length > 0;
}

module.exports = mongoose.model('Movie', movieSchema);
