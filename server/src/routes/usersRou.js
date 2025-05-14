const express = require('express');
const router = express.Router();
const userController = require('../controllers/userCon');
const { authenticateJWT, isAdmin } = require('../middleware/auth');
const User = require('../models/UserMod');
const { verifyTokenMiddleware } = require('../utils/jwtHelper');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Protected routes (require authentication)
router.get('/profile/:id', authenticateJWT, async (req, res) => {
  try {
    // Only allow users to access their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching user profile',
      error: error.message 
    });
  }
});

// Get user by ID (protected)
router.get('/:id', authenticateJWT, userController.getUserById);

// Update user (protected)
router.put('/:id', authenticateJWT, async (req, res) => {
  try {
    // Only allow users to update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await userController.updateUser(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
});

// Admin only routes
router.get('/', authenticateJWT, isAdmin, userController.getAllUsers);
router.delete('/:id', authenticateJWT, isAdmin, userController.deleteUser);

// GET /api/users/profile
router.get('/profile', verifyTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Format the response
    const userProfile = {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      joinDate: user.createdAt,
      profileImage: user.profileImage || '/profile-placeholder.png',
      role: user.role,
      isActive: user.isActive
    };

    res.json({ user: userProfile });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/users/bookings
router.get('/bookings', verifyTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'bookings',
        select: 'id type title date time seats location price status',
        options: { sort: { date: -1 } }
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Separate bookings into upcoming and history
    const now = new Date();
    const bookings = {
      upcoming: user.bookings.filter(booking => 
        new Date(booking.date) >= now && booking.status !== 'cancelled'
      ),
      history: user.bookings.filter(booking => 
        new Date(booking.date) < now || booking.status === 'cancelled'
      )
    };

    res.json({ bookings });
  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 