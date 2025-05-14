# Connecting SeatScene Client to Server

This document explains how the client-side React application connects to the server-side API and uses the design patterns implemented on the server.

## API Service

The main connection point is the `api.js` file in the `services` directory. This file provides functions to interact with the server API endpoints.

### Key Features:

1. **API Base URL**: All requests are made to `http://localhost:5001/api`
2. **Error Handling**: Consistent error handling across all API calls
3. **Authentication**: JWT tokens are stored in localStorage and included in request headers
4. **Design Pattern Integration**: Client-side support for server-side design patterns

## Using Server-Side Design Patterns

### 1. Observer Pattern

The client doesn't directly use the Observer pattern, but it benefits from the notifications sent by the server when a booking is created or updated.

### 2. Facade Pattern

The client uses the Payment Facade through the API service:

```javascript
// In PaymentMethod.jsx
import { createBooking } from './services/api';

// When creating a booking with payment
const bookingPayload = {
  // Booking details
  movie: movieId,
  theater: theaterId,
  showtime: showtime,
  seats: seats,
  // Payment details (used by the Payment Facade on the server)
  paymentMethod: 'credit_card',
  paymentDetails: {
    cardNumber: '4111111111111111',
    expiryDate: '12/25',
    cvv: '123'
  }
};

const result = await createBooking(bookingPayload);
```

### 3. Decorator Pattern

The client sends options to the server to use the Booking Decorator pattern:

```javascript
// In TheaterSeating.jsx
// When creating a booking with enhanced features
const bookingData = {
  // Basic booking details
  movieId: movieId,
  theaterId: theaterId,
  showtime: showtime,
  seats: selectedSeats,
  // Decorator options
  isVIP: true,               // Adds VIP seating enhancement
  parkingPass: true,         // Adds parking pass
  foodOptions: [             // Adds food and beverages
    { name: 'Popcorn', price: 8.99 },
    { name: 'Soda', price: 5.99 }
  ]
};

// Pass to payment page
navigate('/payment', { state: bookingData });
```

### 4. Factory Pattern

The client doesn't directly use the Factory pattern, but it consumes the data created by the Movie and Theater factories:

```javascript
// In CinemaMovies.jsx
import { getShowingMovies } from './services/api';

// Fetch movies created by the Movie Factory on the server
const fetchMovies = async () => {
  const result = await getShowingMovies();
  if (result.success) {
    setMovies(result.data);
  }
};
```

## Flow of Data

1. **User Selects Movie/Theater**: Client fetches data from server using API service
2. **User Selects Seats**: Client prepares booking with decorator options
3. **User Selects Payment Method**: Client sends booking data with payment details
4. **Server Processes Booking**:
   - Creates booking using Decorator pattern
   - Processes payment using Facade pattern
   - Sends notifications using Observer pattern
5. **Client Shows Confirmation**: Displays booking details including decorator enhancements

## Running the Application

1. Start the server:
   ```
   cd server && npm start
   ```

2. Start the client:
   ```
   cd client && npm run dev
   ```

3. Access the application at `http://localhost:5173` 