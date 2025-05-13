const Theater = require('../models/theaterMod');

// Get all theaters
exports.getAllTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find();
    res.status(200).json(theaters);
  } catch (error) {
    console.error('Error fetching theaters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single theater by ID
exports.getTheaterById = async (req, res) => {
  try {
    const theaterId = req.params.id;
    const theater = await Theater.findById(theaterId);
    
    if (!theater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.status(200).json(theater);
  } catch (error) {
    console.error('Error fetching theater:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new theater
exports.createTheater = async (req, res) => {
  try {
    const { 
      name, 
      location, 
      capacity, 
      amenities, 
      seatLayout,
      screens,
      isActive
    } = req.body;
    
    // Create new theater
    const newTheater = new Theater({
      name,
      location,
      capacity,
      amenities: amenities || [],
      seatLayout,
      screens: screens || 1,
      isActive: isActive !== undefined ? isActive : true
    });
    
    const savedTheater = await newTheater.save();
    res.status(201).json(savedTheater);
  } catch (error) {
    console.error('Error creating theater:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a theater
exports.updateTheater = async (req, res) => {
  try {
    const theaterId = req.params.id;
    const updates = req.body;
    
    const updatedTheater = await Theater.findByIdAndUpdate(
      theaterId,
      updates,
      { new: true }
    );
    
    if (!updatedTheater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.status(200).json(updatedTheater);
  } catch (error) {
    console.error('Error updating theater:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a theater
exports.deleteTheater = async (req, res) => {
  try {
    const theaterId = req.params.id;
    
    const deletedTheater = await Theater.findByIdAndDelete(theaterId);
    
    if (!deletedTheater) {
      return res.status(404).json({ message: 'Theater not found' });
    }
    
    res.status(200).json({ message: 'Theater deleted successfully' });
  } catch (error) {
    console.error('Error deleting theater:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get active theaters only
exports.getActiveTheaters = async (req, res) => {
  try {
    const theaters = await Theater.find({ isActive: true });
    res.status(200).json(theaters);
  } catch (error) {
    console.error('Error fetching active theaters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get theaters by location
exports.getTheatersByLocation = async (req, res) => {
  try {
    const { location } = req.params;
    const theaters = await Theater.find({ 
      location: { $regex: location, $options: 'i' } 
    });
    res.status(200).json(theaters);
  } catch (error) {
    console.error('Error fetching theaters by location:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
