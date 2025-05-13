const mongoose = require('mongoose');
const User = require('../models/UserMod');
const Movie = require('../models/MovieMod');
const Theater = require('../models/theaterMod');
const Booking = require('../models/BookingMod');

// Get dashboard statistics
exports.getDashboardStats = async (req, res) => {
  try {
    // Count users, movies, theaters, and bookings
    const [userCount, movieCount, theaterCount, bookingCount] = await Promise.all([
      User.countDocuments(),
      Movie.countDocuments(),
      Theater.countDocuments(),
      Booking.countDocuments()
    ]);
    
    // Get recent bookings
    const recentBookings = await Booking.find()
      .sort({ bookingDate: -1 })
      .limit(5)
      .populate('user', 'username')
      .populate('movie', 'title')
      .populate('theater', 'name');
    
    // Get revenue statistics
    const totalRevenue = await calculateTotalRevenue();
    const monthlyRevenue = await calculateMonthlyRevenue();
    
    res.status(200).json({
      counts: {
        users: userCount,
        movies: movieCount,
        theaters: theaterCount,
        bookings: bookingCount
      },
      recentBookings,
      revenue: {
        total: totalRevenue,
        monthly: monthlyRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!userId || !role) {
      return res.status(400).json({ message: 'User ID and role are required' });
    }
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }
    
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    res.status(200).json({
      message: `User role updated to ${role}`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get system status
exports.getSystemStatus = async (req, res) => {
  try {
    // Check database connection
    const dbStatus = mongoose.connection.readyState === 1;
    
    // Get server uptime
    const uptime = process.uptime();
    
    // Calculate active users (mock data)
    const activeUsers = Math.floor(Math.random() * 100);
    
    res.status(200).json({
      status: 'operational',
      database: dbStatus ? 'connected' : 'disconnected',
      uptime: formatUptime(uptime),
      activeUsers,
      serverTime: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting system status:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create an admin account from an existing user
exports.createAdminAccount = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if already an admin
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'User is already an admin' });
    }
    
    user.role = 'admin';
    await user.save();
    
    res.status(200).json({
      message: 'Admin account created successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Error creating admin account:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to calculate total revenue
async function calculateTotalRevenue() {
  try {
    const result = await Booking.aggregate([
      {
        $match: { 
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$totalPrice' }
        }
      }
    ]);
    
    return result.length > 0 ? result[0].total : 0;
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return 0;
  }
}

// Helper function to calculate monthly revenue
async function calculateMonthlyRevenue() {
  try {
    const result = await Booking.aggregate([
      {
        $match: { 
          paymentStatus: 'completed'
        }
      },
      {
        $group: {
          _id: { 
            year: { $year: '$bookingDate' },
            month: { $month: '$bookingDate' }
          },
          revenue: { $sum: '$totalPrice' }
        }
      },
      {
        $sort: { '_id.year': -1, '_id.month': -1 }
      },
      {
        $limit: 12
      }
    ]);
    
    // Format the result
    return result.map(item => ({
      year: item._id.year,
      month: item._id.month,
      revenue: item.revenue
    }));
  } catch (error) {
    console.error('Error calculating monthly revenue:', error);
    return [];
  }
}

// Helper function to format uptime
function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${days}d ${hours}h ${minutes}m ${remainingSeconds}s`;
}
