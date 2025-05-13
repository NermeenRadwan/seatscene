const Booking = require('../models/BookingMod');

// Create a schema for payments if not already defined
const mongoose = require('mongoose');
const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  paymentDate: {
    type: Date,
    default: Date.now
  }
});

// Create the Payment model if it doesn't exist
let Payment;
try {
  Payment = mongoose.model('Payment');
} catch (error) {
  Payment = mongoose.model('Payment', paymentSchema);
}

// Process a payment
exports.processPayment = async (req, res) => {
  try {
    const { 
      bookingId,
      paymentMethod,
      cardDetails
    } = req.body;
    
    // Find the booking
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    
    // Check if the booking belongs to the user
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to process payment for this booking' });
    }
    
    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment && existingPayment.status === 'completed') {
      return res.status(400).json({ message: 'Payment already completed for this booking' });
    }
    
    // Mock payment processing
    // In a real application, this would integrate with a payment gateway
    const isPaymentSuccessful = simulatePaymentProcessing(paymentMethod, cardDetails);
    
    if (!isPaymentSuccessful) {
      // If payment failed
      const failedPayment = new Payment({
        booking: bookingId,
        user: req.user.id,
        amount: booking.totalPrice,
        paymentMethod,
        status: 'failed',
        transactionId: generateTransactionId()
      });
      
      await failedPayment.save();
      
      return res.status(400).json({ 
        success: false,
        message: 'Payment processing failed',
        payment: failedPayment
      });
    }
    
    // If payment successful
    const newPayment = new Payment({
      booking: bookingId,
      user: req.user.id,
      amount: booking.totalPrice,
      paymentMethod,
      status: 'completed',
      transactionId: generateTransactionId()
    });
    
    const savedPayment = await newPayment.save();
    
    // Update booking payment status
    booking.paymentStatus = 'completed';
    await booking.save();
    
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      payment: savedPayment
    });
  } catch (error) {
    console.error('Error processing payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payment details
exports.getPaymentById = async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    const payment = await Payment.findById(paymentId)
      .populate('booking')
      .populate('user', '-password');
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if the user is authorized to view this payment
    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this payment' });
    }
    
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get payments by user
exports.getUserPayments = async (req, res) => {
  try {
    const userId = req.params.userId || req.user.id;
    
    // Check if user is authorized to view these payments
    if (userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these payments' });
    }
    
    const payments = await Payment.find({ user: userId })
      .populate('booking')
      .sort({ paymentDate: -1 });
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching user payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Process a refund (admin only)
exports.processRefund = async (req, res) => {
  try {
    const paymentId = req.params.id;
    
    // Only admin can process refunds
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to process refunds' });
    }
    
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    // Check if payment is eligible for refund
    if (payment.status !== 'completed') {
      return res.status(400).json({ 
        message: `Cannot refund payment with status: ${payment.status}` 
      });
    }
    
    // Process refund (mock)
    payment.status = 'refunded';
    await payment.save();
    
    // Update booking status
    const booking = await Booking.findById(payment.booking);
    if (booking) {
      booking.status = 'cancelled';
      booking.paymentStatus = 'refunded';
      await booking.save();
    }
    
    res.status(200).json({
      success: true,
      message: 'Refund processed successfully',
      payment
    });
  } catch (error) {
    console.error('Error processing refund:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all payments (admin only)
exports.getAllPayments = async (req, res) => {
  try {
    // Only admin can view all payments
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view all payments' });
    }
    
    const payments = await Payment.find()
      .populate('booking')
      .populate('user', '-password')
      .sort({ paymentDate: -1 });
    
    res.status(200).json(payments);
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to simulate payment processing
function simulatePaymentProcessing(paymentMethod, cardDetails) {
  // In a real application, this would integrate with a payment gateway
  // For now, we'll just return true to simulate successful payment
  return true;
}

// Helper function to generate a mock transaction ID
function generateTransactionId() {
  return 'TXN' + Date.now() + Math.floor(Math.random() * 1000000);
}
