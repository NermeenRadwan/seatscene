const Movie = require('../models/MovieMod');

// Get all movies
exports.getAllMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single movie by ID
exports.getMovieById = async (req, res) => {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.status(200).json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new movie
exports.createMovie = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      director, 
      actors, 
      releaseDate, 
      genre, 
      duration, 
      language, 
      country, 
      poster, 
      trailer,
      isShowing,
      ratings
    } = req.body;
    
    // Create new movie
    const newMovie = new Movie({
      title,
      description,
      director,
      actors: actors || [],
      releaseDate,
      genre,
      duration,
      language: language || 'Arabic',
      country: country || 'Egypt',
      poster,
      trailer,
      isShowing: isShowing || false,
      ratings: ratings || 0
    });
    
    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    console.error('Error creating movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a movie
exports.updateMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    const updates = req.body;
    
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      updates,
      { new: true }
    );
    
    if (!updatedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.status(200).json(updatedMovie);
  } catch (error) {
    console.error('Error updating movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a movie
exports.deleteMovie = async (req, res) => {
  try {
    const movieId = req.params.id;
    
    const deletedMovie = await Movie.findByIdAndDelete(movieId);
    
    if (!deletedMovie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get movies that are currently showing
exports.getShowingMovies = async (req, res) => {
  try {
    const movies = await Movie.find({ isShowing: true });
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching showing movies:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get movies by genre
exports.getMoviesByGenre = async (req, res) => {
  try {
    const { genre } = req.params;
    const movies = await Movie.find({ genre });
    res.status(200).json(movies);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
