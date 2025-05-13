const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
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
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  availableSeats: {
    type: [String],
    required: true
  },
  bookedSeats: {
    type: [String],
    default: []
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  showType: {
    type: String,
    enum: ['regular', 'premiere', 'matinee', 'special', 'private'],
    default: 'regular'
  },
  screen: {
    type: String,
    default: 'Screen 1'
  },
  discounts: {
    student: {
      type: Number,
      default: 0 // percentage
    },
    senior: {
      type: Number,
      default: 0 // percentage
    },
    children: {
      type: Number,
      default: 0 // percentage
    }
  },
  specialNotes: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for fast queries by date range
scheduleSchema.index({ startTime: 1 });
scheduleSchema.index({ movie: 1, startTime: 1 });
scheduleSchema.index({ theater: 1, startTime: 1 });

// Virtual property to check if show is full
scheduleSchema.virtual('isFull').get(function() {
  return this.availableSeats.length === 0;
});

// Virtual property to calculate occupancy percentage
scheduleSchema.virtual('occupancyPercentage').get(function() {
  const totalSeats = this.availableSeats.length + this.bookedSeats.length;
  if (totalSeats === 0) return 0;
  return (this.bookedSeats.length / totalSeats) * 100;
});

// Method to book seats
scheduleSchema.methods.bookSeats = function(seats) {
  // Check if all requested seats are available
  const unavailableSeats = seats.filter(seat => !this.availableSeats.includes(seat));
  if (unavailableSeats.length > 0) {
    return {
      success: false,
      unavailableSeats
    };
  }
  
  // Remove seats from available and add to booked
  this.availableSeats = this.availableSeats.filter(seat => !seats.includes(seat));
  this.bookedSeats.push(...seats);
  
  return {
    success: true,
    availableSeats: this.availableSeats,
    bookedSeats: this.bookedSeats
  };
};

// Method to cancel booking (return seats to available)
scheduleSchema.methods.cancelBooking = function(seats) {
  // Check if all seats are currently booked
  const validSeats = seats.filter(seat => this.bookedSeats.includes(seat));
  if (validSeats.length !== seats.length) {
    return {
      success: false,
      message: 'Some seats are not currently booked'
    };
  }
  
  // Move seats from booked back to available
  this.bookedSeats = this.bookedSeats.filter(seat => !seats.includes(seat));
  this.availableSeats.push(...seats);
  
  // Sort available seats for consistency
  this.availableSeats.sort();
  
  return {
    success: true,
    availableSeats: this.availableSeats,
    bookedSeats: this.bookedSeats
  };
};

// Static method to find upcoming shows for a movie
scheduleSchema.statics.findUpcomingByMovie = function(movieId) {
  return this.find({
    movie: movieId,
    startTime: { $gte: new Date() },
    isActive: true,
    isCancelled: false
  })
  .sort({ startTime: 1 })
  .populate('theater', 'name location')
  .exec();
};

// Static method to find shows by date range
scheduleSchema.statics.findByDateRange = function(startDate, endDate) {
  return this.find({
    startTime: { 
      $gte: startDate,
      $lte: endDate
    },
    isActive: true,
    isCancelled: false
  })
  .sort({ startTime: 1 })
  .populate('movie', 'title poster duration')
  .populate('theater', 'name location')
  .exec();
};

const Schedule = mongoose.model('Schedule', scheduleSchema);
module.exports = Schedule;
