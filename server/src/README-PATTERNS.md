# Design Patterns in SeatScene

This document explains the design patterns implemented in the SeatScene application and how to use them.

## 1. Observer Pattern

**Location:** `server/src/observers/bookingObs.js`

The Observer pattern is used for sending notifications when booking events occur.

### How it works:
- `BookingSubject` maintains a list of observers and notifies them when a booking is created or updated
- Observers include `EmailNotificationObserver`, `SMSNotificationObserver`, and `AdminNotificationObserver`
- Each observer implements an `update()` method that gets called when a booking event happens

### How to use:
```javascript
const { bookingNotifier } = require('../observers/bookingObs');

// When a booking is created or updated
bookingNotifier.notify(bookingData);
```

## 2. Facade Pattern

**Location:** `server/src/facades/paymentFac.js`

The Facade pattern simplifies the payment processing interface by hiding the complexity of multiple payment methods.

### How it works:
- `PaymentFacade` provides a simple interface for processing payments
- It encapsulates the complexity of different payment processors (credit card, PayPal, Apple Pay)
- It also handles payment record management

### How to use:
```javascript
const paymentFacade = require('../facades/paymentFac');

// Process a payment
const paymentResult = paymentFacade.processPayment(
  'credit_card', // payment method
  totalAmount,   // amount to charge
  paymentDetails // card details, PayPal info, etc.
);

if (paymentResult.success) {
  // Payment successful
} else {
  // Payment failed
}
```

## 3. Decorator Pattern

**Location:** `server/src/decorators/bookingDec.js`

The Decorator pattern is used to add additional features to bookings dynamically.

### How it works:
- `Booking` is the base component
- `BookingDecorator` is the base decorator
- Concrete decorators include `VIPSeatingDecorator`, `FoodBeverageDecorator`, and `ParkingPassDecorator`
- Each decorator adds functionality and cost to the booking

### How to use:
```javascript
const { Booking, VIPSeatingDecorator, FoodBeverageDecorator, ParkingPassDecorator } = require('../decorators/bookingDec');

// Create a basic booking
let booking = new Booking(bookingData);

// Add VIP seating
booking = new VIPSeatingDecorator(booking);

// Add food and beverages
const foodOptions = [
  { name: 'Popcorn', price: 5.99 },
  { name: 'Soda', price: 2.99 }
];
booking = new FoodBeverageDecorator(booking, foodOptions);

// Add parking pass
booking = new ParkingPassDecorator(booking);

// Get the final booking details with all enhancements
const bookingDetails = booking.getBookingDetails();
```

## 4. Factory Pattern

**Locations:** 
- `server/src/factories/movieFact.js`
- `server/src/factories/theaterFact.js`

The Factory pattern is used to create different types of movies and theaters.

### How it works:
- `MovieFactory` creates different types of movies (Action, Comedy, Drama, Horror)
- `TheaterFactory` creates different types of theaters (Standard, Multiplex, Luxury, Drive-In)
- Each factory has methods to create objects from scratch or from database records

### How to use:
```javascript
const movieFactory = require('../factories/movieFact');
const theaterFactory = require('../factories/theaterFact');

// Create a movie
const actionMovie = movieFactory.createMovie('action', movieData);

// Create a theater
const luxuryTheater = theaterFactory.createTheater('luxury', theaterData);

// Create from database records
const movie = movieFactory.createMovieFromDB(movieRecord);
const theater = theaterFactory.createTheaterFromDB(theaterRecord);
```

## Running the Demo

To see all design patterns working together, run:

```
node src/scripts/demoPatterns.js
```

This will demonstrate:
1. Creating movies and theaters using the Factory pattern
2. Creating and enhancing bookings with the Decorator pattern
3. Sending notifications using the Observer pattern
4. Processing payments using the Facade pattern 