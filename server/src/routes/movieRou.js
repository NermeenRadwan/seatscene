const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieCon');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', movieController.getAllMovies);
router.get('/showing', movieController.getShowingMovies);
router.get('/:id', movieController.getMovieById);
router.get('/genre/:genre', movieController.getMoviesByGenre);

// Admin-only routes
router.post('/', authenticateJWT, isAdmin, movieController.createMovie);
router.put('/:id', authenticateJWT, isAdmin, movieController.updateMovie);
router.delete('/:id', authenticateJWT, isAdmin, movieController.deleteMovie);

module.exports = router;
