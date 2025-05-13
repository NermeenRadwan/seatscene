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
        transactionId: generateTransactionId(paymentMethod)
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
      transactionId: generateTransactionId(paymentMethod)
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
  
  // Different payment methods handling logic
  switch(paymentMethod) {
    case 'credit_card':
    case 'debit_card':
      // Validate card details (this is a simulation)
      if (!cardDetails) {
        console.log('Missing card details');
        return false;
      }
      
      // Check for required card fields
      const requiredFields = ['cardNumber', 'cardHolderName', 'expiryDate', 'cvv'];
      for (const field of requiredFields) {
        if (!cardDetails[field]) {
          console.log(`Missing card field: ${field}`);
          return false;
        }
      }
      
      // Simulate card validation logic
      const cardNumber = cardDetails.cardNumber.replace(/\s/g, '');
      if (cardNumber.length !== 16 || isNaN(cardNumber)) {
        console.log('Invalid card number');
        return false;
      }
      
      // Simulate CVV validation
      if (cardDetails.cvv.length < 3 || isNaN(cardDetails.cvv)) {
        console.log('Invalid CVV');
        return false;
      }
      
      // Simulate expiry date validation (MM/YY format)
      const expiryParts = cardDetails.expiryDate.split('/');
      if (expiryParts.length !== 2) {
        console.log('Invalid expiry date format');
        return false;
      }
      
      const expiryMonth = parseInt(expiryParts[0], 10);
      const expiryYear = parseInt(expiryParts[1], 10) + 2000; // Assuming YY format
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1; // JavaScript months are 0-based
      
      if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        console.log('Card expired');
        return false;
      }
      
      // Simulate successful card processing (95% success rate)
      return Math.random() < 0.95;
      
    case 'paypal':
      // Simulate PayPal processing
      if (!cardDetails || !cardDetails.paypalEmail) {
        console.log('Missing PayPal email');
        return false;
      }
      
      // Validate email format (simple validation)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cardDetails.paypalEmail)) {
        console.log('Invalid PayPal email format');
        return false;
      }
      
      // Simulate successful PayPal processing (90% success rate)
      return Math.random() < 0.9;
      
    case 'cash':
      // Cash payments always succeed in our simulation
      return true;
      
    default:
      console.log(`Unsupported payment method: ${paymentMethod}`);
      return false;
  }
}

// Helper function to generate a mock transaction ID
function generateTransactionId(paymentMethod = 'unknown') {
  const prefix = {
    'credit_card': 'CC',
    'debit_card': 'DC',
    'paypal': 'PP',
    'cash': 'CSH',
    'unknown': 'TXN'
  };
  
  // Get prefix for payment method or use default
  const paymentPrefix = prefix[paymentMethod] || 'TXN';
  
  // Generate a unique transaction ID
  return `${paymentPrefix}${Date.now()}${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
}

// Get available payment methods
exports.getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = [
      {
        id: 'credit_card',
        name: 'Credit Card',
        description: 'Pay with Visa, MasterCard, or American Express',
        requiresAdditionalInfo: true,
        icon: 'credit-card'
      },
      {
        id: 'debit_card',
        name: 'Debit Card',
        description: 'Pay with your bank debit card',
        requiresAdditionalInfo: true,
        icon: 'debit-card'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account',
        requiresAdditionalInfo: true,
        icon: 'paypal'
      },
      {
        id: 'cash',
        name: 'Cash',
        description: 'Pay at the theater',
        requiresAdditionalInfo: false,
        icon: 'cash'
      }
    ];
    
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error fetching payment methods:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Validate credit/debit card
exports.validateCard = async (req, res) => {
  try {
    const { 
      cardNumber, 
      cardHolderName, 
      expiryDate, 
      cvv 
    } = req.body;
    
    // Basic validation
    if (!cardNumber || !cardHolderName || !expiryDate || !cvv) {
      return res.status(400).json({ 
        valid: false, 
        message: 'Missing required card details',
        errors: {}
      });
    }
    
    const errors = {};
    let valid = true;
    
    // Validate card number (basic Luhn algorithm check)
    const cardNumberClean = cardNumber.replace(/\s/g, '');
    if (cardNumberClean.length !== 16 || isNaN(cardNumberClean)) {
      errors.cardNumber = 'Invalid card number';
      valid = false;
    }
    
    // Validate CVV
    if (cvv.length < 3 || isNaN(cvv)) {
      errors.cvv = 'Invalid security code';
      valid = false;
    }
    
    // Validate expiry date
    const expiryParts = expiryDate.split('/');
    if (expiryParts.length !== 2) {
      errors.expiryDate = 'Invalid expiry date format (use MM/YY)';
      valid = false;
    } else {
      const expiryMonth = parseInt(expiryParts[0], 10);
      const expiryYear = parseInt(expiryParts[1], 10) + 2000; // Assuming YY format
      
      const now = new Date();
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      
      if (expiryMonth < 1 || expiryMonth > 12) {
        errors.expiryDate = 'Invalid month';
        valid = false;
      } else if (expiryYear < currentYear || (expiryYear === currentYear && expiryMonth < currentMonth)) {
        errors.expiryDate = 'Card is expired';
        valid = false;
      }
    }
    
    // Return validation result
    res.status(200).json({
      valid,
      message: valid ? 'Card is valid' : 'Invalid card details',
      errors: Object.keys(errors).length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error validating card:', error);
    res.status(500).json({ 
      valid: false,
      message: 'Server error validating card'
    });
  }
};

// Validate PayPal information
exports.validatePayPal = async (req, res) => {
  try {
    const { paypalEmail } = req.body;
    
    // Basic validation
    if (!paypalEmail) {
      return res.status(400).json({ 
        valid: false, 
        message: 'PayPal email is required' 
      });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = emailRegex.test(paypalEmail);
    
    // Return validation result
    res.status(200).json({
      valid,
      message: valid ? 'PayPal email is valid' : 'Invalid PayPal email format'
    });
  } catch (error) {
    console.error('Error validating PayPal information:', error);
    res.status(500).json({ 
      valid: false,
      message: 'Server error validating PayPal information'
    });
  }
};
