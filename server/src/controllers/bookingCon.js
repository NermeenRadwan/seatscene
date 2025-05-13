const Booking = require('../models/BookingMod');
const User = require('../models/UserMod');

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', '-password')
      .populate('movie')
      .populate('theater');
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const booking = await Booking.findById(bookingId)
      .populate('user', '-password')
      .populate('movie')
      .populate('theater');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to view this booking
    if (req.user.role !== 'admin' && booking.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }
    
    res.status(200).json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get bookings by user ID
exports.getUserBookings = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Check if user is authorized to view these bookings
    if (req.user.role !== 'admin' && userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to view these bookings' });
    }
    
    const bookings = await Booking.find({ user: userId })
      .populate('movie')
      .populate('theater')
      .sort({ bookingDate: -1 });
    
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const { 
      movie, 
      theater, 
      showtime, 
      seats, 
      totalPrice,
      paymentMethod 
    } = req.body;
    
    // Create new booking
    const newBooking = new Booking({
      user: req.user.id,
      movie,
      theater,
      showtime,
      seats,
      totalPrice,
      paymentMethod: paymentMethod || 'credit_card',
      status: 'confirmed',
      paymentStatus: 'completed'
    });
    
    const savedBooking = await newBooking.save();
    
    // Add booking to user's bookings array
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { bookings: savedBooking._id } }
    );
    
    const populatedBooking = await Booking.findById(savedBooking._id)
      .populate('movie')
      .populate('theater');
    
    res.status(201).json(populatedBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a booking (admin only or the booking's owner)
exports.updateBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    const updates = req.body;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to update this booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }
    
    // Regular users can only update certain fields
    if (req.user.role !== 'admin') {
      const allowedUpdates = ['paymentMethod'];
      Object.keys(updates).forEach(key => {
        if (!allowedUpdates.includes(key)) {
          delete updates[key];
        }
      });
    }
    
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      updates,
      { new: true }
    )
      .populate('movie')
      .populate('theater');
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a booking (admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete bookings' });
    }
    
    // Remove booking from user's bookings array
    await User.findByIdAndUpdate(
      booking.user,
      { $pull: { bookings: bookingId } }
    );
    
    await Booking.findByIdAndDelete(bookingId);
    
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Cancel a booking (user can cancel their own booking)
exports.cancelBooking = async (req, res) => {
  try {
    const bookingId = req.params.id;
    
    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if user is authorized to cancel this booking
    if (req.user.role !== 'admin' && booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }
    
    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }
    
    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();
    
    const updatedBooking = await Booking.findById(bookingId)
      .populate('movie')
      .populate('theater');
    
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
