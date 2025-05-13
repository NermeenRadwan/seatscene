const Movie = require('../models/MovieMod');
const Theater = require('../models/theaterMod');

// Create a schema for showtimes if not already defined
const mongoose = require('mongoose');
const showTimeSchema = new mongoose.Schema({
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
    required: true
  },
  availableSeats: {
    type: [String],
    required: true
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

// Create the ShowTime model if it doesn't exist
let ShowTime;
try {
  ShowTime = mongoose.model('ShowTime');
} catch (error) {
  ShowTime = mongoose.model('ShowTime', showTimeSchema);
}

// Get all showtimes
exports.getAllShowTimes = async (req, res) => {
  try {
    const showTimes = await ShowTime.find()
      .populate('movie', 'title poster duration')
      .populate('theater', 'name location');
    
    res.status(200).json(showTimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get showtimes for a specific movie
exports.getShowTimesByMovie = async (req, res) => {
  try {
    const movieId = req.params.movieId;
    
    const showTimes = await ShowTime.find({ movie: movieId, isActive: true })
      .populate('movie', 'title poster duration')
      .populate('theater', 'name location')
      .sort({ startTime: 1 });
    
    res.status(200).json(showTimes);
  } catch (error) {
    console.error('Error fetching movie showtimes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get showtimes for a specific theater
exports.getShowTimesByTheater = async (req, res) => {
  try {
    const theaterId = req.params.theaterId;
    
    const showTimes = await ShowTime.find({ theater: theaterId, isActive: true })
      .populate('movie', 'title poster duration')
      .populate('theater', 'name location')
      .sort({ startTime: 1 });
    
    res.status(200).json(showTimes);
  } catch (error) {
    console.error('Error fetching theater showtimes:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new showtime
exports.createShowTime = async (req, res) => {
  try {
    const { movieId, theaterId, startTime, price, availableSeats } = req.body;
    
    // Validate movie and theater existence
    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    const theater = await Theater.findById(theaterId);
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    // Calculate end time based on movie duration
    const startDateTime = new Date(startTime);
    const endDateTime = new Date(startDateTime.getTime() + movie.duration * 60000);
    
    // Create available seats array if not provided
    let seats = availableSeats;
    if (!seats || !seats.length) {
      // Generate default seat layout (e.g., A1-A10, B1-B10, etc.)
      seats = [];
      const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      const seatsPerRow = 10;
      
      for (const row of rows) {
        for (let i = 1; i <= seatsPerRow; i++) {
          seats.push(`${row}${i}`);
        }
      }
    }
    
    // Create new showtime
    const newShowTime = new ShowTime({
      movie: movieId,
      theater: theaterId,
      startTime: startDateTime,
      endTime: endDateTime,
      price,
      availableSeats: seats,
      isActive: true
    });
    
    const savedShowTime = await newShowTime.save();
    
    const populatedShowTime = await ShowTime.findById(savedShowTime._id)
      .populate('movie', 'title poster duration')
      .populate('theater', 'name location');
    
    res.status(201).json(populatedShowTime);
  } catch (error) {
    console.error('Error creating showtime:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a showtime
exports.updateShowTime = async (req, res) => {
  try {
    const showTimeId = req.params.id;
    const updates = req.body;
    
    const showTime = await ShowTime.findById(showTimeId);
    if (!showTime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    // If updating movie, recalculate end time
    if (updates.movieId) {
      const movie = await Movie.findById(updates.movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
      
      const startTime = updates.startTime ? new Date(updates.startTime) : showTime.startTime;
      updates.endTime = new Date(startTime.getTime() + movie.duration * 60000);
      updates.movie = updates.movieId;
      delete updates.movieId;
    } else if (updates.startTime) {
      // If only updating start time, recalculate end time
      const movie = await Movie.findById(showTime.movie);
      const startTime = new Date(updates.startTime);
      updates.endTime = new Date(startTime.getTime() + movie.duration * 60000);
    }
    
    // If updating theater
    if (updates.theaterId) {
      const theater = await Theater.findById(updates.theaterId);
      if (!theater) {
        return res.status(404).json({ message: 'Theater not found' });
      }
      updates.theater = updates.theaterId;
      delete updates.theaterId;
    }
    
    const updatedShowTime = await ShowTime.findByIdAndUpdate(
      showTimeId,
      updates,
      { new: true }
    )
      .populate('movie', 'title poster duration')
      .populate('theater', 'name location');
    
    res.status(200).json(updatedShowTime);
  } catch (error) {
    console.error('Error updating showtime:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a showtime
exports.deleteShowTime = async (req, res) => {
  try {
    const showTimeId = req.params.id;
    
    const deletedShowTime = await ShowTime.findByIdAndDelete(showTimeId);
    
    if (!deletedShowTime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    res.status(200).json({ message: 'Showtime deleted successfully' });
  } catch (error) {
    console.error('Error deleting showtime:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update available seats (used when booking)
exports.updateAvailableSeats = async (req, res) => {
  try {
    const showTimeId = req.params.id;
    const { seats } = req.body;
    
    if (!seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Invalid seats data' });
    }
    
    const showTime = await ShowTime.findById(showTimeId);
    
    if (!showTime) {
      return res.status(404).json({ message: 'Showtime not found' });
    }
    
    // Check if all requested seats are available
    const unavailableSeats = seats.filter(seat => !showTime.availableSeats.includes(seat));
    
    if (unavailableSeats.length > 0) {
      return res.status(400).json({ 
        message: 'Some seats are not available',
        unavailableSeats
      });
    }
    
    // Remove booked seats from available seats
    showTime.availableSeats = showTime.availableSeats.filter(
      seat => !seats.includes(seat)
    );
    
    await showTime.save();
    
    res.status(200).json({
      message: 'Seats updated successfully',
      availableSeats: showTime.availableSeats
    });
  } catch (error) {
    console.error('Error updating available seats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
