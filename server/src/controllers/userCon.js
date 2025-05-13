const User = require('../models/UserMod');
const jwt = require('jsonwebtoken');

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single user by ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName, phoneNumber } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already in use' 
          : 'Username already taken' 
      });
    }
    
    // Create new user
    const newUser = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      phoneNumber
    });
    
    const savedUser = await newUser.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { id: savedUser._id, role: savedUser.role },
      process.env.JWT_SECRET || 'seatscene-secret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      user: {
        id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        role: savedUser.role
      },
      token
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'seatscene-secret',
      { expiresIn: '1d' }
    );
    
    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a user
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    
    // Don't allow role changes from this endpoint
    delete updates.role;
    
    // If updating password, hash it
    if (updates.password) {
      const user = await User.findById(userId);
      user.password = updates.password;
      await user.save();
      
      // Remove password from updates so we don't overwrite the hashed one
      delete updates.password;
      
      // Update other fields if any
      if (Object.keys(updates).length > 0) {
        await User.findByIdAndUpdate(userId, updates);
      }
      
      const updatedUser = await User.findById(userId).select('-password');
      return res.status(200).json(updatedUser);
    }
    
    // If not updating password, just update normally
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    const deletedUser = await User.findByIdAndDelete(userId);
    
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
