const mongoose = require('mongoose');
const User = require('../models/User');

// MongoDB connection string
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/seatscene';

// Test data
const testUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'testpass123'
};

async function testMongoDB() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('Successfully connected to MongoDB!');

    // Test 1: Create a user
    console.log('\nTest 1: Creating a user...');
    const newUser = new User(testUser);
    const savedUser = await newUser.save();
    console.log('User created successfully:', {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email
    });

    // Test 2: Find the user
    console.log('\nTest 2: Finding the user...');
    const foundUser = await User.findOne({ email: testUser.email });
    console.log('User found:', {
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email
    });

    // Test 3: Update the user
    console.log('\nTest 3: Updating the user...');
    const updatedUser = await User.findOneAndUpdate(
      { email: testUser.email },
      { username: 'updated_username' },
      { new: true }
    );
    console.log('User updated:', {
      id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email
    });

    // Test 4: Delete the user
    console.log('\nTest 4: Deleting the user...');
    await User.deleteOne({ email: testUser.email });
    console.log('User deleted successfully');

    // Test 5: Verify deletion
    console.log('\nTest 5: Verifying deletion...');
    const deletedUser = await User.findOne({ email: testUser.email });
    console.log('User exists after deletion:', deletedUser ? 'Yes' : 'No');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nMongoDB connection closed');
  }
}

// Run the tests
testMongoDB(); 