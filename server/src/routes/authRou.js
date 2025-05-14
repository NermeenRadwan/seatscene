const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/UserMod'); // Ensure path matches your structure
const { 
  generateAuthTokens, 
  verifyTokenMiddleware,
  verifyToken,
  JWT_CONFIG 
} = require('../utils/jwtHelper');

// Input validation middleware
const validateSignupInput = (req, res, next) => {
  const { username, email, password } = req.body;
  const errors = [];

  if (!username || username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }

  if (!email || !email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
    errors.push('Please enter a valid email address');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

const validateLoginInput = (req, res, next) => {
  const { username, password } = req.body;
  const errors = [];

  if (!username) {
    errors.push('Username is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  next();
};

// Rate limiting middleware (simple implementation)
const loginAttempts = new Map();
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes

const rateLimiter = (req, res, next) => {
  const ip = req.ip;
  const now = Date.now();
  const userAttempts = loginAttempts.get(ip) || [];

  // Remove attempts older than the window
  const recentAttempts = userAttempts.filter(time => now - time < WINDOW_MS);

  if (recentAttempts.length >= MAX_ATTEMPTS) {
    return res.status(429).json({ 
      message: 'Too many login attempts. Please try again later.',
      retryAfter: Math.ceil((recentAttempts[0] + WINDOW_MS - now) / 1000)
    });
  }

  recentAttempts.push(now);
  loginAttempts.set(ip, recentAttempts);
  next();
};

// POST /api/auth/login
router.post('/login', rateLimiter, validateLoginInput, async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokens = generateAuthTokens(user);
    await user.updateLastLogin();

    // Clear login attempts on successful login
    loginAttempts.delete(req.ip);

    res.status(200).json({
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/signup
router.post('/signup', validateSignupInput, async (req, res) => {
  const { username, password, email, firstName, lastName } = req.body;

  try {
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });
    
    if (existingUser) {
      return res.status(409).json({ 
        message: existingUser.username === username 
          ? 'Username already exists' 
          : 'Email already exists'
      });
    }

    const user = new User({
      username,
      email,
      password,
      firstName,
      lastName,
      role: 'user',
      isActive: true
    });

    await user.save();
    const tokens = generateAuthTokens(user);

    res.status(201).json({
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      },
      message: 'Registration successful'
    });
  } catch (error) {
    console.error('Signup error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: Object.values(error.errors).map(err => err.message)
      });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/refresh-token
router.post('/refresh-token', async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = verifyToken(refreshToken);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    const tokens = generateAuthTokens(user);
    res.json(tokens);
  } catch (error) {
    return res.status(401).json({ 
      message: error.message || 'Invalid refresh token'
    });
  }
});

// GET /api/auth/me
router.get('/me', verifyTokenMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password -__v')
      .lean();

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Account is deactivated' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /api/auth/logout
router.post('/logout', verifyTokenMiddleware, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return a success message
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

