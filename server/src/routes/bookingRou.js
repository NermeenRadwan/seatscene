const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingCon');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// All booking routes require authentication
router.use(authenticateJWT);

// User booking routes
router.get('/user', bookingController.getUserBookings);
router.post('/', bookingController.createBooking);
router.put('/:id/cancel', bookingController.cancelBooking);

// Get specific booking (owner or admin)
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);

// Admin-only routes
router.get('/', isAdmin, bookingController.getAllBookings);
router.delete('/:id', isAdmin, bookingController.deleteBooking);

module.exports = router;
