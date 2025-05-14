import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './TheaterShows.css';

function TheaterShows() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedTimes, setSelectedTimes] = useState({});
  const [location, setLocation] = useState('');
  
  // Get selected location when component mounts
  useEffect(() => {
    const selectedLocation = sessionStorage.getItem('selectedLocation') || 'Default Location';
    setLocation(selectedLocation);
  }, []);
  
  // Define all theater shows with showtimes
  const shows = [
    {
      id: 1,
      image: '/theatre/495275248_1131731725661708_297651124075801289_n.jpg',
      title: 'Show 1',
      showtimes: ['11:00 AM', '3:00 PM', '7:30 PM']
    },
    {
      id: 2,
      image: '/theatre/496213673_1138437781657769_5697159806305068806_n.jpg',
      title: 'Show 2',
      showtimes: ['10:30 AM', '2:30 PM', '6:45 PM']
    },
    {
      id: 3,
      image: '/theatre/493274729_1126641609504053_8009155663524457803_n.jpg',
      title: 'Show 3',
      showtimes: ['12:15 PM', '4:00 PM', '8:15 PM']
    },
    {
      id: 4,
      image: '/theatre/493373507_1128054366029444_8302520480561744172_n.jpg',
      title: 'Show 4',
      showtimes: ['1:00 PM', '5:30 PM', '9:00 PM']
    },
    {
      id: 5,
      image: '/theatre/495622724_1138441151657432_891423765107114574_n.jpg',
      title: 'Show 5',
      showtimes: ['10:00 AM', '2:00 PM', '7:00 PM']
    }
  ];

  // Calculate the total number of "pages" (each page shows 2 shows)
  const totalPages = Math.ceil(shows.length / 2);
  
  // Navigate back to venue selection
  const handleLogoClick = () => {
    navigate(-1);
  };

  // Navigate to the next set of shows
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 2 >= shows.length) ? 0 : prevIndex + 2
    );
  };

  // Navigate to the previous set of shows
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex - 2 < 0) ? Math.floor((shows.length - 1) / 2) * 2 : prevIndex - 2
    );
  };

  // Handle time selection
  const handleTimeSelect = (showId, time) => {
    setSelectedTimes(prev => ({
      ...prev,
      [showId]: time
    }));
  };

  // Handle buy ticket button click
  const handleBuyTicket = (showId) => {
    if (selectedTimes[showId]) {
      navigate(`/theater/seating/${showId}?time=${encodeURIComponent(selectedTimes[showId])}`);
    } else {
      alert('Please select a showtime first');
    }
  };

  // Get visible shows for the current slide (2 at a time)
  const visibleShows = [
    shows[currentIndex],
    currentIndex + 1 < shows.length ? shows[currentIndex + 1] : null
  ].filter(Boolean); // Remove null if there's only one show in the last slide

  return (
    <div className="theater-container">
      {/* Logo in the corner */}
      <img 
        src="/Artboard 1@4x.png" 
        alt="Logo" 
        className="theater-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      {/* Page title with location */}
      <h1 className="theater-title">Theater</h1>
      <h2 className="theater-location">{location}</h2>
      
      <div className="carousel-container">
        {/* Left arrow */}
        <button className="arrow-button left-arrow" onClick={prevSlide}>
          &#8249;
        </button>
        
        {/* Theater carousel */}
        <div className="show-carousel">
          {visibleShows.map((show) => (
            <div key={show.id} className="show-card">
              <img 
                src={show.image} 
                alt={show.title} 
                className="show-poster"
              />
              <div className="show-title">{show.title}</div>
              
              <div className="showtimes-container">
                <h3 className="showtimes-title">Showtimes</h3>
                <div className="showtimes-grid">
                  {show.showtimes.map(time => (
                    <button 
                      key={time}
                      className={`time-button ${selectedTimes[show.id] === time ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(show.id, time)}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
              
              <button 
                className="buy-ticket-button"
                onClick={() => handleBuyTicket(show.id)}
                disabled={!selectedTimes[show.id]}
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

export default TheaterShows; 