const mongoose = require('mongoose');

const seatLayoutSchema = new mongoose.Schema({
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rows: {
    type: Number,
    required: true,
    min: 1
  },
  seatsPerRow: {
    type: Number,
    required: true,
    min: 1
  },
  seatMap: {
    type: Map,
    of: {
      type: String,
      enum: ['available', 'reserved', 'blocked', 'premium', 'accessible'],
      default: 'available'
    }
  },
  rowLabels: {
    type: [String],
    default: function() {
      // Default row labels (A, B, C, etc.)
      const labels = [];
      for (let i = 0; i < this.rows; i++) {
        labels.push(String.fromCharCode(65 + i)); // ASCII 65 is 'A'
      }
      return labels;
    }
  },
  screenPosition: {
    type: String,
    enum: ['top', 'bottom', 'left', 'right'],
    default: 'top'
  },
  aisleSeats: {
    type: [String],
    default: []
  },
  premiumSeats: {
    type: [String],
    default: []
  },
  accessibleSeats: {
    type: [String], 
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
seatLayoutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to check if a seat exists
seatLayoutSchema.methods.seatExists = function(seatId) {
  return this.seatMap.has(seatId);
};

// Method to check if a seat is available
seatLayoutSchema.methods.isSeatAvailable = function(seatId) {
  return this.seatMap.get(seatId) === 'available';
};

// Method to reserve a seat
seatLayoutSchema.methods.reserveSeat = function(seatId) {
  if (this.seatExists(seatId) && this.isSeatAvailable(seatId)) {
    this.seatMap.set(seatId, 'reserved');
    return true;
  }
  return false;
};

// Method to generate a default seat map
seatLayoutSchema.methods.generateDefaultSeatMap = function() {
  const seatMap = new Map();
  
  for (let i = 0; i < this.rows; i++) {
    const rowLabel = this.rowLabels[i] || String.fromCharCode(65 + i);
    for (let j = 1; j <= this.seatsPerRow; j++) {
      const seatId = `${rowLabel}${j}`;
      seatMap.set(seatId, 'available');
    }
  }
  
  this.seatMap = seatMap;
  return seatMap;
};

const SeatLayout = mongoose.model('SeatLayout', seatLayoutSchema);
module.exports = SeatLayout;
