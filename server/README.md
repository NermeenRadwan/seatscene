# SeatScene Server

This is the backend server for the SeatScene application.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root of the server directory with the following variables:
```
PORT=5000
NODE_ENV=development
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

- `src/` - Source code directory
  - `config/` - Configuration files
  - `controllers/` - Route controllers
  - `middleware/` - Custom middleware
  - `models/` - Data models
  - `routes/` - API routes
  - `server.js` - Main application file

## Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests (to be implemented) 