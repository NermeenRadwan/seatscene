const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/UserMod');
const Movie = require('./models/MovieMod');
const Theater = require('./models/theaterMod');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/seatscene');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample users data
const sampleUsers = [
  {
    username: 'admin',
    email: 'admin@seatscene.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    username: 'user',
    email: 'user@seatscene.com',
    password: 'user123',
    role: 'user'
  }
];

// Sample movies data
const sampleMovies = [
  {
    title: 'The Pharaoh\'s Secret',
    description: 'An archaeologist discovers an ancient Egyptian tomb with a mysterious curse that begins to affect everyone involved in the excavation.',
    director: 'Ahmed Hassan',
    actors: ['Mona Zaki', 'Ahmed Helmy', 'Mahmoud Hemida'],
    releaseDate: '2023-07-15',
    genre: 'Adventure',
    duration: 125,
    language: 'Arabic',
    country: 'Egypt',
    poster: 'https://picsum.photos/id/237/300/450',
    trailer: 'https://www.youtube.com/watch?v=example1',
    isShowing: true,
    ratings: 8.2
  },
  {
    title: 'Cairo Nights',
    description: 'A romantic comedy following the intertwined lives of several couples during a magical night in Cairo.',
    director: 'Laila Ahmed',
    actors: ['Yasmine Sabry', 'Amir Karara', 'Nelly Karim'],
    releaseDate: '2023-09-10',
    genre: 'Romance',
    duration: 112,
    language: 'Arabic',
    country: 'Egypt',
    poster: 'https://picsum.photos/id/238/300/450',
    trailer: 'https://www.youtube.com/watch?v=example2',
    isShowing: true,
    ratings: 7.5,
    ticketPrice: 12.99
  },
  {
    title: 'Desert Storm',
    description: 'An action-packed thriller about a special forces team on a mission in the Sinai desert to stop a terrorist plot.',
    director: 'Tarek Nour',
    actors: ['Mohamed Mamdouh', 'Ahmed Ezz', 'Hend Sabry'],
    releaseDate: '2023-05-22',
    genre: 'Action',
    duration: 135,
    language: 'Arabic',
    country: 'Egypt',
    poster: 'https://picsum.photos/id/239/300/450',
    trailer: 'https://www.youtube.com/watch?v=example3',
    isShowing: true,
    ratings: 8.7,
    ticketPrice: 14.99
  },
  {
    title: 'Alexandria Love Story',
    description: 'A heartwarming story about two youngsters from different backgrounds who meet in Alexandria and fall in love.',
    director: 'Mariam Naoum',
    actors: ['Asser Yassin', 'Jamila Awad', 'Amina Khalil'],
    releaseDate: '2023-08-05',
    genre: 'Drama',
    duration: 118,
    language: 'Arabic',
    country: 'Egypt',
    poster: 'https://picsum.photos/id/240/300/450',
    trailer: 'https://www.youtube.com/watch?v=example4',
    isShowing: true,
    ratings: 8.1,
    ticketPrice: 11.99
  },
  {
    title: 'The Last Pharaoh',
    description: 'An epic historical drama depicting the life and struggles of the last Egyptian pharaoh.',
    director: 'Mohamed Diab',
    actors: ['Khaled El Nabawy', 'Menna Shalabi', 'Basem Samra'],
    releaseDate: '2023-10-20',
    genre: 'Historical',
    duration: 160,
    language: 'Arabic',
    country: 'Egypt',
    poster: 'https://picsum.photos/id/241/300/450',
    trailer: 'https://www.youtube.com/watch?v=example5',
    isShowing: true,
    ratings: 9.2,
    ticketPrice: 16.99
  }
];

// Sample theaters data
const sampleTheaters = [
  {
    name: 'Cairo Cinema Complex',
    location: 'Downtown Cairo',
    capacity: 500,
    amenities: ['IMAX', 'VIP Seating', 'Dolby Atmos', 'Food Court'],
    screens: 8,
    isActive: true
  },
  {
    name: 'Alexandria Star',
    location: 'Alexandria Waterfront',
    capacity: 350,
    amenities: ['3D Screens', 'Recliner Seats', 'Snack Bar'],
    screens: 5,
    isActive: true
  },
  {
    name: 'Giza Grand Theaters',
    location: 'Giza Pyramid Complex',
    capacity: 400,
    amenities: ['Premium Sound', 'Luxury Seating', 'Private Boxes'],
    screens: 6,
    isActive: true
  }
];

// Seed data function
const seedData = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Clear existing data
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theater.deleteMany({});
    
    console.log('Database cleared');
    
    // Create users with hashed passwords
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
        return { ...user, password: hashedPassword };
      })
    );
    
    await User.insertMany(hashedUsers);
    console.log('Users seeded successfully');
    
    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log('Movies seeded successfully');
    
    // Insert sample theaters
    await Theater.insertMany(sampleTheaters);
    console.log('Theaters seeded successfully');
    
    console.log('All data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedData(); 