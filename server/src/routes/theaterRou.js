const express = require('express');
const router = express.Router();
const theaterController = require('../controllers/theaterCon');
const { authenticateJWT, isAdmin } = require('../middleware/auth');

// Public routes
router.get('/', theaterController.getAllTheaters);
router.get('/active', theaterController.getActiveTheaters);
router.get('/:id', theaterController.getTheaterById);
router.get('/location/:location', theaterController.getTheatersByLocation);

// Admin-only routes
router.post('/', authenticateJWT, isAdmin, theaterController.createTheater);
router.put('/:id', authenticateJWT, isAdmin, theaterController.updateTheater);
router.delete('/:id', authenticateJWT, isAdmin, theaterController.deleteTheater);

module.exports = router;
