const mongoose = require('mongoose');
const Movie = require('./models/MovieMod');
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

// Sample movies data from CinemaMovies.jsx
const sampleMovies = [
  {
    title: 'Movie 1',
    description: 'An exciting adventure film with stunning visuals and an engaging plot.',
    director: 'John Director',
    actors: ['Actor One', 'Actor Two', 'Actor Three'],
    releaseDate: new Date('2023-07-15'),
    genre: 'Adventure',
    duration: 125,
    language: 'English',
    country: 'USA',
    poster: '/movies/486108321_977584814571805_2454693239454343561_n.jpg',
    trailer: 'https://www.youtube.com/watch?v=example1',
    isShowing: true,
    ratings: 8.2,
    ticketPrice: 12.99
  },
  {
    title: 'Movie 2',
    description: 'A heartwarming romantic comedy about unexpected love in the big city.',
    director: 'Jane Director',
    actors: ['Actor Four', 'Actor Five', 'Actor Six'],
    releaseDate: new Date('2023-08-20'),
    genre: 'Romance',
    duration: 112,
    language: 'English',
    country: 'USA',
    poster: '/movies/487037607_977584854571801_280065376401584117_n.jpg',
    trailer: 'https://www.youtube.com/watch?v=example2',
    isShowing: true,
    ratings: 7.5,
    ticketPrice: 11.99
  },
  {
    title: 'Movie 3',
    description: 'A thrilling action movie with spectacular special effects and intense fight scenes.',
    director: 'Action Director',
    actors: ['Actor Seven', 'Actor Eight', 'Actor Nine'],
    releaseDate: new Date('2023-06-10'),
    genre: 'Action',
    duration: 135,
    language: 'English',
    country: 'USA',
    poster: '/movies/492230057_1108607967967722_4952923366821650460_n.jpg',
    trailer: 'https://www.youtube.com/watch?v=example3',
    isShowing: true,
    ratings: 8.7,
    ticketPrice: 13.99
  },
  {
    title: 'Movie 4',
    description: 'A thought-provoking drama about family relationships and personal growth.',
    director: 'Drama Director',
    actors: ['Actor Ten', 'Actor Eleven', 'Actor Twelve'],
    releaseDate: new Date('2023-09-05'),
    genre: 'Drama',
    duration: 128,
    language: 'English',
    country: 'USA',
    poster: '/movies/A-working-man.jpg',
    trailer: 'https://www.youtube.com/watch?v=example4',
    isShowing: true,
    ratings: 8.9,
    ticketPrice: 12.99
  },
  {
    title: 'Movie 5',
    description: 'A hilarious comedy that will have you laughing from start to finish.',
    director: 'Comedy Director',
    actors: ['Actor Thirteen', 'Actor Fourteen', 'Actor Fifteen'],
    releaseDate: new Date('2023-07-28'),
    genre: 'Comedy',
    duration: 105,
    language: 'English',
    country: 'USA',
    poster: '/movies/Restart-768x960.jpg',
    trailer: 'https://www.youtube.com/watch?v=example5',
    isShowing: true,
    ratings: 7.8,
    ticketPrice: 11.99
  },
  {
    title: 'Movie 6',
    description: 'A spine-chilling horror film that will keep you on the edge of your seat.',
    director: 'Horror Director',
    actors: ['Actor Sixteen', 'Actor Seventeen', 'Actor Eighteen'],
    releaseDate: new Date('2023-08-15'),
    genre: 'Horror',
    duration: 118,
    language: 'English',
    country: 'USA',
    poster: '/movies/_315x420_3777392d70b4e5050e01787bf4f2ce50f44dc0360af2358c2e4f787ecc9fea79.jpg',
    trailer: 'https://www.youtube.com/watch?v=example6',
    isShowing: true,
    ratings: 7.2,
    ticketPrice: 12.99
  }
];

// Seed data function
const seedMovies = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Only delete existing movies with these titles to avoid removing other movies
    const titlesToDelete = sampleMovies.map(movie => movie.title);
    await Movie.deleteMany({ title: { $in: titlesToDelete } });
    
    console.log('Deleted existing movies with the same titles');
    
    // Insert sample movies
    await Movie.insertMany(sampleMovies);
    console.log('Movies from CinemaMovies.jsx seeded successfully');
    
    console.log('All movies have been added to MongoDB!');
    process.exit();
  } catch (error) {
    console.error(`Error seeding movies: ${error.message}`);
    process.exit(1);
  }
};

// Run the seed function
seedMovies(); 