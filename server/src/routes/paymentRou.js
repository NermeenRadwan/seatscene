const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentCon');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// Get available payment methods
router.get('/methods', paymentController.getPaymentMethods);

// Validate a credit/debit card (no auth required, only validates format)
router.post('/validate/card', paymentController.validateCard);

// Validate PayPal info (no auth required, only validates format)
router.post('/validate/paypal', paymentController.validatePayPal);

// Get all payments (admin only)
router.get('/', authenticateJWT, isAdmin, paymentController.getAllPayments);

// Get payment statistics (admin only)
router.get('/stats', authenticateJWT, isAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Convert to Date objects, default to last 30 days if not provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();
    
    const Payment = require('../models/PaymentMod');
    const stats = await Payment.getPaymentStats(start, end);
    
    res.status(200).json(stats);
  } catch (error) {
    console.error('Error getting payment stats:', error);
    res.status(500).json({ message: 'Error getting payment statistics' });
  }
});

// Get current user's payment history
router.get('/user/history', authenticateJWT, (req, res) => {
  paymentController.getUserPayments(req, res);
});

// Process a payment
router.post('/process', authenticateJWT, paymentController.processPayment);

// Process a refund (admin only)
router.post('/:id/refund', authenticateJWT, isAdmin, paymentController.processRefund);

// Get payment details by ID (this should be last since it uses a wildcard)
router.get('/:id', authenticateJWT, paymentController.getPaymentById);

module.exports = router;
