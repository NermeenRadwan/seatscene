import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './VenueSelection.css';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

function VenueSelection() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLogoClick = () => {
    try {
      navigate(-1);
    } catch {
      setError('Navigation failed. Please try again.');
    }
  };

  const handleCinemaClick = async () => {
    try {
      setIsLoading(true);
      setError('');
      await navigate('/cinema/location');
    } catch {
      setError('Failed to navigate to cinema section. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTheaterClick = async () => {
    try {
      setIsLoading(true);
      setError('');
      await navigate('/theater/location');
    } catch {
      setError('Failed to navigate to theater section. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleProfileClick = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/profile' } });
        return;
      }

      // Verify token by making a request to the server
      const response = await api.get('/api/users/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.data.user) {
        throw new Error('No user data received');
      }

      // If token is valid and user data exists, navigate to profile
      navigate('/profile');
    } catch (error) {
      console.error('Profile navigation error:', error);
      if (error.response?.status === 401 || error.message === 'No user data received') {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login', { state: { from: '/profile' } });
      } else {
        setError('Failed to access profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="venue-container">
      {error && <div className="error-message">{error}</div>}
      
      <div className="venue-header">
        <img 
          src="/Artboard 1@4x.png" 
          alt="SeatScene Logo" 
          className="venue-logo" 
          onClick={handleLogoClick}
          title="Go back"
        />
        
        <div className="venue-nav-buttons">
          <button 
            className="profile-nav-button"
            onClick={handleProfileClick}
            title={isAuthenticated ? "View Profile" : "Login"}
            disabled={isLoading}
            aria-label={isAuthenticated ? "View Profile" : "Login"}
          >
            <i className="user-icon" aria-hidden="true">👤</i>
            {isAuthenticated ? 'My Profile' : 'Login'}
          </button>

          <button 
            className="profile-button"
            onClick={handleProfileClick}
            title="Go to Profile"
            disabled={isLoading}
            aria-label="Go to Profile"
          >
            <i className="profile-icon" aria-hidden="true">👤</i>
            Profile
          </button>
        </div>
      </div>
      
      <div className="venue-content">
        <button 
          className="venue-button cinema-button"
          onClick={handleCinemaClick}
          disabled={isLoading}
          aria-label="Select Cinema"
        >
          {isLoading ? 'Loading...' : 'Cinema'}
        </button>
        
        <button 
          className="venue-button theater-button"
          onClick={handleTheaterClick}
          disabled={isLoading}
          aria-label="Select Theater"
        >
          {isLoading ? 'Loading...' : 'Theater'}
        </button>
      </div>
      
      <div className="contact-info">
        <h3>Contact Us</h3>
        <p>Email: support@seatscene.com</p>
        <p>Phone: (555) 123-4567</p>
        <p>Hours: Mon-Fri 9AM-6PM</p>
      </div>
    </div>
  );
}

export default VenueSelection; 