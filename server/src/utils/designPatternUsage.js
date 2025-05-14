// Example usage of the design patterns in the SeatScene application

// Import the patterns
const movieFactory = require('../factories/movieFact');
const theaterFactory = require('../factories/theaterFact');
const { Booking, VIPSeatingDecorator, FoodBeverageDecorator, ParkingPassDecorator } = require('../decorators/bookingDec');
const { bookingNotifier } = require('../observers/bookingObs');
const paymentFacade = require('../facades/paymentFac');

/**
 * Example function to demonstrate creating a movie using the Factory pattern
 */
const createMovieExample = () => {
  // Create an action movie
  const actionMovieData = {
    title: 'Desert Storm',
    description: 'An action-packed thriller about a special forces team on a mission in the Sinai desert.',
    director: 'Tarek Nour',
    actors: ['Mohamed Mamdouh', 'Ahmed Ezz', 'Hend Sabry'],
    releaseDate: new Date('2023-05-22'),
    duration: 135,
    specialEffects: ['Explosions', 'Car chases', 'Helicopter scenes'],
    stunts: ['Desert jump', 'Building climb']
  };
  
  const actionMovie = movieFactory.createMovie('action', actionMovieData);
  console.log('Action Movie Details:', actionMovie.getDetails());
  
  return actionMovie;
};

/**
 * Example function to demonstrate creating a theater using the Factory pattern
 */
const createTheaterExample = () => {
  // Create a luxury theater
  const luxuryTheaterData = {
    name: 'Cairo VIP Cinema',
    location: 'Downtown Cairo',
    capacity: 200,
    amenities: ['VIP Seating', 'Fine Dining', 'Private Boxes'],
    screens: 4
  };
  
  const luxuryTheater = theaterFactory.createTheater('luxury', luxuryTheaterData);
  console.log('Luxury Theater Details:', luxuryTheater.getDetails());
  
  return luxuryTheater;
};

/**
 * Example function to demonstrate the Decorator pattern with bookings
 */
const createBookingExample = () => {
  // Create a basic booking
  const bookingData = {
    movieId: '60d21b4667d0d8992e610c85',
    userId: '60d21b4667d0d8992e610c86',
    theaterId: '60d21b4667d0d8992e610c87',
    showtime: '2023-07-15T18:30:00.000Z',
    seats: ['A1', 'A2', 'A3']
  };
  
  let booking = new Booking(bookingData);
  console.log('Basic Booking:', booking.getBookingDetails());
  
  // Add VIP seating
  booking = new VIPSeatingDecorator(booking);
  console.log('With VIP Seating:', booking.getBookingDetails());
  
  // Add food and beverages
  const foodOptions = [
    { name: 'Popcorn Large', price: 8.99 },
    { name: 'Soda Combo', price: 5.99 },
    { name: 'Nachos', price: 7.99 }
  ];
  
  booking = new FoodBeverageDecorator(booking, foodOptions);
  console.log('With Food & Beverages:', booking.getBookingDetails());
  
  // Add parking pass
  booking = new ParkingPassDecorator(booking);
  console.log('With Parking Pass:', booking.getBookingDetails());
  
  return booking;
};

/**
 * Example function to demonstrate the Observer pattern with booking notifications
 */
const notifyBookingExample = (bookingDetails) => {
  // The booking has been created, now notify all observers
  console.log('Notifying all observers about the new booking...');
  
  // Add user data for the notification
  bookingDetails.user = {
    email: 'user@example.com',
    phone: '+201234567890'
  };
  
  // Add movie data for the notification
  bookingDetails.movie = {
    title: 'Desert Storm',
    showtime: '6:30 PM'
  };
  
  // Notify all observers
  bookingNotifier.notify(bookingDetails);
  
  return true;
};

/**
 * Example function to demonstrate the Facade pattern with payment processing
 */
const processPaymentExample = (bookingDetails) => {
  console.log('Processing payment through the Payment Facade...');
  
  // Process credit card payment
  const paymentResult = paymentFacade.processPayment('credit_card', bookingDetails.totalPrice, {
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123',
    cardholderName: 'John Doe'
  });
  
  console.log('Payment Result:', paymentResult);
  
  return paymentResult;
};

/**
 * Main function to demonstrate all patterns working together
 */
const demonstrateAllPatterns = () => {
  console.log('===== DEMONSTRATING ALL DESIGN PATTERNS =====');
  
  // 1. Create a movie using Factory pattern
  console.log('\n1. FACTORY PATTERN - Creating a movie');
  const movie = createMovieExample();
  
  // 2. Create a theater using Factory pattern
  console.log('\n2. FACTORY PATTERN - Creating a theater');
  const theater = createTheaterExample();
  
  // 3. Create a booking with decorators
  console.log('\n3. DECORATOR PATTERN - Creating and enhancing a booking');
  const booking = createBookingExample();
  
  // 4. Notify about the booking using Observer pattern
  console.log('\n4. OBSERVER PATTERN - Sending notifications');
  notifyBookingExample(booking.getBookingDetails());
  
  // 5. Process payment using Facade pattern
  console.log('\n5. FACADE PATTERN - Processing payment');
  processPaymentExample(booking.getBookingDetails());
  
  console.log('\n===== ALL PATTERNS DEMONSTRATED SUCCESSFULLY =====');
};

module.exports = {
  demonstrateAllPatterns,
  createMovieExample,
  createTheaterExample,
  createBookingExample,
  notifyBookingExample,
  processPaymentExample
}; 