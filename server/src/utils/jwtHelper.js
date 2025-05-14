const jwt = require('jsonwebtoken');

// JWT configuration
const JWT_CONFIG = {
  secret: process.env.JWT_SECRET || 'seatscene-super-secret-key-2024',
  expiresIn: '24h',
  refreshExpiresIn: '7d'
};

/**
 * Generate a new JWT token
 * @param {Object} payload - The data to encode in the token
 * @returns {String} The generated JWT token
 */
const generateToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.expiresIn });
  } catch (error) {
    throw new Error('Error generating token: ' + error.message);
  }
};

/**
 * Generate a refresh token
 * @param {Object} payload - The data to encode in the token
 * @returns {String} The generated refresh token
 */
const generateRefreshToken = (payload) => {
  try {
    return jwt.sign(payload, JWT_CONFIG.secret, { expiresIn: JWT_CONFIG.refreshExpiresIn });
  } catch (error) {
    throw new Error('Error generating refresh token: ' + error.message);
  }
};

/**
 * Verify a JWT token
 * @param {String} token - The JWT token to verify
 * @returns {Object} The decoded token payload
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_CONFIG.secret);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    throw new Error('Invalid token');
  }
};

/**
 * Extract token from Authorization header
 * @param {Object} req - Express request object
 * @returns {String|null} The extracted token or null
 */
const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
};

/**
 * Generate tokens for user authentication
 * @param {Object} user - User object
 * @returns {Object} Object containing access token and refresh token
 */
const generateAuthTokens = (user) => {
  const payload = {
    id: user._id,
    username: user.username,
    role: user.role
  };

  return {
    accessToken: generateToken(payload),
    refreshToken: generateRefreshToken(payload)
  };
};

/**
 * Middleware to verify JWT token
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const verifyTokenMiddleware = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req);
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: error.message });
  }
};

/**
 * Middleware to check if user has admin role
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const isAdminMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
  }
  next();
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  extractTokenFromHeader,
  generateAuthTokens,
  verifyTokenMiddleware,
  isAdminMiddleware,
  JWT_CONFIG
};
