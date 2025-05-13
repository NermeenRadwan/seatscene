const User = require('../models/users'); // Adjust the path as necessary

exports.register = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    user = new User({
      username,
      email,
      password,
    });

    await user.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updatePassword = async (req, res) => {
  const { username, newPassword } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  const { username } = req.query; 

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    const user = await User.findOne({ username }); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({
      username: user.username, 
      email: user.email,
      location: "Cairo, Egypt", 
    });  
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { username, newUsername, email } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.username = newUsername || user.username;
    user.email = email || user.email;

    await user.save();
    res.status(200).json(user); 
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};


// Add this function to your existing controller
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email _id'); // Fetch all users with specific fields
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

exports.deleteUser = async (req, res) => {
  const userId = req.params.id; // Get user ID from request parameters
  try {
    const deletedUser = await User.findByIdAndDelete(userId); // Find and delete the user
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' }); // User not found
    }
    res.status(200).json({ message: 'User deleted successfully' }); // Success response
  } catch (error) {
    console.error('Error deleting user:', error); // Log error for debugging
    res.status(500).json({ message: 'Failed to delete user' }); // Error response
  }
};
exports.getUserCount = async (req, res) => {
  try {
    const userCount = await User.countDocuments(); // Count all user documents
    console.log("User Count:", userCount); // Log user count for debugging
    res.status(200).json({ count: userCount });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ message: 'Error fetching user count' });
  }
};