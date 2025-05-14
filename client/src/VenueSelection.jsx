import React from 'react';
import { useNavigate } from 'react-router-dom';
import './VenueSelection.css';

function VenueSelection() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleCinemaClick = () => {
    navigate('/cinema/location');
  };

  const handleTheaterClick = () => {
    navigate('/theater/location');
  };
  
  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <div className="venue-container">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="venue-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <button 
        className="profile-nav-button"
        onClick={handleProfileClick}
        title="View Profile"
      >
        <i className="user-icon">👤</i>
        My Profile
      </button>
      
      <div className="venue-content">
        <button 
          className="venue-button cinema-button"
          onClick={handleCinemaClick}
        >
          Cinema
        </button>
        
        <button 
          className="venue-button theater-button"
          onClick={handleTheaterClick}
        >
          Theater
        </button>
      </div>
      
      <div className="contact-info">
        Contact information
      </div>
    </div>
  );
}

export default VenueSelection; 