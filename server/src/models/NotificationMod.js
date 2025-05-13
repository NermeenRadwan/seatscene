const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['booking', 'payment', 'promotion', 'system', 'reminder'],
    required: true
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['booking', 'movie', 'theater', 'payment', 'user', 'system'],
      required: true
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isActionRequired: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  expiresAt: {
    type: Date
  },
  actions: [{
    label: String,
    url: String,
    actionType: {
      type: String,
      enum: ['link', 'button', 'dismiss']
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isRead: 1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  return this.save();
};

// Static method to get unread notifications count for a user
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({ user: userId, isRead: false });
};

// Static method to get recent notifications for a user
notificationSchema.statics.getRecentForUser = function(userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .exec();
};

// Static method to mark all notifications as read for a user
notificationSchema.statics.markAllRead = function(userId) {
  return this.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } }
  );
};

// Static method to create a booking notification
notificationSchema.statics.createBookingNotification = async function(userId, booking, type = 'booking') {
  try {
    await booking.populate('movie theater').execPopulate();
    
    let title, message;
    
    switch(type) {
      case 'confirmation':
        title = 'Booking Confirmed';
        message = `Your booking for ${booking.movie.title} at ${booking.theater.name} has been confirmed.`;
        break;
      case 'reminder':
        title = 'Upcoming Movie Reminder';
        message = `Reminder: Your movie ${booking.movie.title} at ${booking.theater.name} is scheduled for ${new Date(booking.showtime).toLocaleString()}.`;
        break;
      case 'cancellation':
        title = 'Booking Cancelled';
        message = `Your booking for ${booking.movie.title} at ${booking.theater.name} has been cancelled.`;
        break;
      default:
        title = 'Booking Update';
        message = `There's an update to your booking for ${booking.movie.title}.`;
    }
    
    const notification = new this({
      user: userId,
      title,
      message,
      type: 'booking',
      relatedEntity: {
        entityType: 'booking',
        entityId: booking._id
      },
      isActionRequired: type === 'cancellation',
      actions: [
        {
          label: 'View Booking',
          url: `/bookings/${booking._id}`,
          actionType: 'link'
        }
      ]
    });
    
    return notification.save();
  } catch (error) {
    console.error('Error creating booking notification:', error);
    throw error;
  }
};

const Notification = mongoose.model('Notification', notificationSchema);
module.exports = Notification;
