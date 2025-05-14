import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LocationSelection.css';

function LocationSelection() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine if we're selecting location for cinema or theater
  const isTheater = location.pathname.includes('theater');
  const isCinema = location.pathname.includes('cinema');
  
  const handleLogoClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleLocationSelect = (locationName) => {
    // Store the selected location in session storage
    sessionStorage.setItem('selectedLocation', locationName);
    
    // Navigate to the appropriate page based on whether we're in theater or cinema flow
    if (isTheater) {
      navigate('/theater/shows');
    } else if (isCinema) {
      navigate('/cinema/movies');
    }
  };

  // Location options
  const locations = [
    'Mokattam',
    'Madinet nasr',
    'Tagamo3',
    'Maadi',
    'Sheraton'
  ];

  return (
    <div className="venue-container">
      <img 
        src="/Artboard 1@4x.png" 
        alt="Logo" 
        className="venue-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <h1 className="location-title">Location:</h1>
      
      <div className="venue-content">
        {locations.map((location) => (
          <button 
            key={location}
            className="venue-button location-button"
            onClick={() => handleLocationSelect(location)}
          >
            {location}
          </button>
        ))}
      </div>
      
      <div className="contact-info">
        Contact information
      </div>
    </div>
  );
}

export default LocationSelection; 