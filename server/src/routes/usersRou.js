const express = require('express');
const router = express.Router();
const userController = require('../controllers/userCon');
const { authenticateJWT, isAdmin } = require('../middleware/auth');
const User = require('../models/UserMod');

// Public routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Profile route - must be before the generic /:id route
router.get('/profile/:id', authenticateJWT, async (req, res) => {
  try {
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

// Protected routes (require authentication)
router.get('/:id', authenticateJWT, userController.getUserById);
router.put('/:id', authenticateJWT, userController.updateUser);

// Admin only routes
router.get('/', authenticateJWT, isAdmin, userController.getAllUsers);
router.delete('/:id', authenticateJWT, isAdmin, userController.deleteUser);

module.exports = router; 