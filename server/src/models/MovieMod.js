const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: false,
    default: "Unknown Director"
  },
  actors: {
    type: [String],
    required: false,
    default: []
  },
  releaseDate: {
    type: Date,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  language: {
    type: String,
    default: 'Arabic'
  },
  country: {
    type: String,
    default: 'Egypt'
  },
  poster: {
    type: String
  },
  trailer: {
    type: String
  },
  isShowing: {
    type: Boolean,
    default: false
  },
  ratings: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Movie = mongoose.model('Movie', MovieSchema);
module.exports = Movie;
