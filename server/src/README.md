# SeatScene Server

This is the server-side component of the SeatScene movie ticket booking application.

## Features

- RESTful API for movies, theaters, bookings, users, and payments
- MongoDB integration for data storage
- JWT authentication for secure API access
- Role-based access control (admin vs. regular users)
- Design patterns implementation for maintainable code

## Design Patterns

SeatScene implements several design patterns to improve code organization and maintainability:

1. **Observer Pattern** - For notifications when booking events occur
2. **Facade Pattern** - For simplifying payment processing
3. **Decorator Pattern** - For dynamically adding features to bookings
4. **Factory Pattern** - For creating different types of movies and theaters

For detailed information on the design patterns, see [README-PATTERNS.md](./README-PATTERNS.md).

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file with the following variables:
   ```
   PORT=5001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```

3. Seed the database:
   ```
   node src/seedData.js
   ```

4. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Movies
- `GET /api/movies` - Get all movies
- `GET /api/movies/showing` - Get currently showing movies
- `GET /api/movies/:id` - Get a specific movie
- `POST /api/movies` - Create a new movie (admin only)
- `PUT /api/movies/:id` - Update a movie (admin only)
- `DELETE /api/movies/:id` - Delete a movie (admin only)

### Theaters
- `GET /api/theaters` - Get all theaters
- `GET /api/theaters/:id` - Get a specific theater
- `POST /api/theaters` - Create a new theater (admin only)
- `PUT /api/theaters/:id` - Update a theater (admin only)
- `DELETE /api/theaters/:id` - Delete a theater (admin only)

### Bookings
- `GET /api/bookings` - Get all bookings (admin only)
- `GET /api/bookings/:id` - Get a specific booking
- `GET /api/bookings/user` - Get current user's bookings
- `POST /api/bookings` - Create a new booking
- `PUT /api/bookings/:id` - Update a booking
- `DELETE /api/bookings/:id` - Delete a booking (admin only)
- `PUT /api/bookings/:id/cancel` - Cancel a booking

### Users
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update current user profile

### Payments
- `GET /api/payments/methods` - Get available payment methods
- `POST /api/payments/process` - Process a payment 