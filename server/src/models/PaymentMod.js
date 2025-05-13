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
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'EGP'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'cash', 'wallet'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  gateway: {
    type: String,
    enum: ['stripe', 'paypal', 'manual', 'cash', 'internal'],
    default: 'manual'
  },
  gatewayResponse: {
    type: Object
  },
  paymentDate: {
    type: Date,
    default: Date.now
  },
  additionalFees: {
    serviceFee: {
      type: Number,
      default: 0
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    }
  },
  billingInfo: {
    name: String,
    email: String,
    phone: String,
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    }
  },
  metadata: {
    type: Map,
    of: String
  },
  refundInfo: {
    refundId: String,
    refundDate: Date,
    refundAmount: Number,
    refundReason: String,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes for faster queries
paymentSchema.index({ booking: 1 });
paymentSchema.index({ user: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ paymentDate: -1 });
paymentSchema.index({ status: 1 });

// Update timestamps before saving
paymentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to update payment status
paymentSchema.methods.updateStatus = function(newStatus, gatewayResponse = null) {
  this.status = newStatus;
  
  if (gatewayResponse) {
    this.gatewayResponse = gatewayResponse;
  }
  
  this.updatedAt = Date.now();
  return this.save();
};

// Method to process refund
paymentSchema.methods.processRefund = async function(amount, reason, refundedBy) {
  if (this.status !== 'completed') {
    throw new Error(`Cannot refund payment with status: ${this.status}`);
  }
  
  // In a real app, this would integrate with the payment gateway's refund API
  const refundAmount = amount || this.amount;
  
  this.status = 'refunded';
  this.refundInfo = {
    refundId: 'REF' + Date.now(),
    refundDate: new Date(),
    refundAmount: refundAmount,
    refundReason: reason || 'Customer requested refund',
    refundedBy: refundedBy
  };
  
  this.updatedAt = Date.now();
  return this.save();
};

// Static method to get payment by transaction ID
paymentSchema.statics.findByTransactionId = function(transactionId) {
  return this.findOne({ transactionId });
};

// Static method to get user's payment history
paymentSchema.statics.getUserPaymentHistory = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ paymentDate: -1 })
    .limit(limit)
    .populate('booking')
    .exec();
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function(startDate, endDate) {
  try {
    const stats = await this.aggregate([
      {
        $match: {
          paymentDate: { 
            $gte: startDate, 
            $lte: endDate 
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          averageAmount: { $avg: '$amount' },
          count: { $sum: 1 },
          methods: {
            $push: '$paymentMethod'
          }
        }
      },
      {
        $addFields: {
          methodStats: {
            $arrayToObject: {
              $map: {
                input: {
                  $setUnion: '$methods'
                },
                as: 'method',
                in: [
                  '$$method',
                  {
                    $size: {
                      $filter: {
                        input: '$methods',
                        cond: { $eq: ['$$this', '$$method'] }
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    ]);
    
    return stats[0] || { 
      totalAmount: 0, 
      averageAmount: 0, 
      count: 0,
      methodStats: {}
    };
  } catch (error) {
    console.error('Error getting payment stats:', error);
    throw error;
  }
};

const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment; 