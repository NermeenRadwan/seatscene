import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CinemaMovies.css';

function CinemaMovies() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [location, setLocation] = useState('');
  
  // Get selected location when component mounts
  useEffect(() => {
    const selectedLocation = sessionStorage.getItem('selectedLocation') || 'Default Location';
    setLocation(selectedLocation);
  }, []);
  
  // Define all movie images with showtimes
  const movies = [
    {
      id: 1,
      image: '/movies/486108321_977584814571805_2454693239454343561_n.jpg',
      title: 'Movie 1',
      showtimes: ['10:30 AM', '1:45 PM', '5:00 PM', '8:15 PM', '10:30 PM']
    },
    {
      id: 2,
      image: '/movies/487037607_977584854571801_280065376401584117_n.jpg',
      title: 'Movie 2',
      showtimes: ['11:15 AM', '2:30 PM', '6:45 PM', '9:30 PM']
    },
    {
      id: 3,
      image: '/movies/492230057_1108607967967722_4952923366821650460_n.jpg',
      title: 'Movie 3',
      showtimes: ['12:00 PM', '3:15 PM', '7:30 PM', '10:45 PM']
    },
    {
      id: 4,
      image: '/movies/A-working-man.jpg',
      title: 'Movie 4',
      showtimes: ['10:00 AM', '1:00 PM', '4:00 PM', '7:00 PM', '9:45 PM']
    },
    {
      id: 5,
      image: '/movies/Restart-768x960.jpg',
      title: 'Movie 5',
      showtimes: ['11:45 AM', '2:15 PM', '5:30 PM', '8:45 PM']
    },
    {
      id: 6,
      image: '/movies/_315x420_3777392d70b4e5050e01787bf4f2ce50f44dc0360af2358c2e4f787ecc9fea79.jpg',
      title: 'Movie 6',
      showtimes: ['10:15 AM', '1:30 PM', '4:30 PM', '7:15 PM', '10:00 PM']
    }
  ];

  // Calculate the total number of "pages" (each page shows 2 movies)
  const totalPages = Math.ceil(movies.length / 2);
  
  // Navigate back to venue selection
  const handleLogoClick = () => {
    navigate(-1);
  };

  // Navigate to the next set of movies
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 2 >= movies.length) ? 0 : prevIndex + 2
    );
  };

  // Navigate to the previous set of movies
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 2 < 0) ? Math.floor((movies.length - 1) / 2) * 2 : prevIndex - 2
    );
  };

  // Handle time selection
  const handleTimeSelect = (movieId, time) => {
    setSelectedTimes(prev => ({
      ...prev,
      [movieId]: time
    }));
  };

  // Handle buy ticket button click
  const handleBuyTicket = (movieId) => {
    // Navigate to seating chart for this movie
    if (selectedTimes[movieId]) {
      navigate(`/cinema/seating/${movieId}?time=${encodeURIComponent(selectedTimes[movieId])}`);
    } else {
      alert('Please select a showtime first');
    }
  };

  // Get visible movies for the current slide (2 at a time)
  const visibleMovies = [
    movies[currentIndex],
    currentIndex + 1 < movies.length ? movies[currentIndex + 1] : null
  ].filter(Boolean); // Remove null if there's only one movie in the last slide

  return (
    <div className="cinema-container">
      {/* Logo in the corner */}
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="cinema-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      {/* Page title with location */}
      <h1 className="cinema-title">Cinema</h1>
      <h2 className="cinema-location">{location}</h2>
      
      <div className="carousel-container">
        {/* Left arrow */}
        <button className="arrow-button left-arrow" onClick={prevSlide}>
          &#8249;
        </button>
        
        {/* Movie carousel */}
        <div className="movie-carousel">
          {visibleMovies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <img 
                src={movie.image} 
                alt={movie.title} 
                className="movie-poster"
              />
              <div className="movie-title">{movie.title}</div>
              
              <div className="showtimes-container">
                <h3 className="showtimes-title">Showtimes</h3>
                <div className="showtimes-grid">
                  {movie.showtimes.map(time => (
                    <button 
                      key={time}
                      className={`time-button ${selectedTimes[movie.id] === time ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(movie.id, time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                className="buy-ticket-button"
                onClick={() => handleBuyTicket(movie.id)}
                disabled={!selectedTimes[movie.id]}
              >
                Buy ticket
              </button>
            </div>
          ))}
        </div>
        
        {/* Right arrow */}
        <button className="arrow-button right-arrow" onClick={nextSlide}>
          &#8250;
        </button>
      </div>
      
      {/* Pagination indicators */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div 
            key={index} 
            className={`pagination-dot ${Math.floor(currentIndex / 2) === index ? 'active' : ''}`}
            onClick={() => setCurrentIndex(index * 2)}
          />
        ))}
      </div>
    </div>
  );
}

export default CinemaMovies; 