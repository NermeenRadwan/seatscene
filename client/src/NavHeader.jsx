import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './NavHeader.css';

// Create axios instance
const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

function NavHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // Fetch user data from the server
        const response = await api.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.user) {
          setUser(response.data.user);
          localStorage.setItem('userData', JSON.stringify(response.data.user));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [location.pathname]);

  const handleLogoClick = () => {
    if (user) {
      navigate('/venue-selection');
    } else {
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await api.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/profile' } });
      return;
    }
    setIsMenuOpen(false);
    navigate('/profile');
  };

  const handleAdminDashboard = () => {
    setIsMenuOpen(false);
    navigate('/admin');
  };

  const handleVenuesClick = () => {
    setIsMenuOpen(false);
    navigate('/venue-selection');
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.user-menu')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  if (loading) {
    return <div className="nav-header loading">Loading...</div>;
  }

  return (
    <header className="nav-header">
      <div className="nav-left">
        <div className="nav-logo" onClick={handleLogoClick}>
          <img src="/Artboard 1@4x.png" alt="SeatScene Logo" />
        </div>
      </div>

      <div className="nav-right">
        {user ? (
          <div className="user-menu">
            <button 
              className="user-menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {user.username}
            </button>
            
            {isMenuOpen && (
              <div className="user-dropdown">
                <button onClick={handleProfileClick}>My Profile</button>
                {user.role === 'admin' && (
                  <button onClick={handleAdminDashboard}>Admin Dashboard</button>
                )}
                <button onClick={handleVenuesClick}>Venues</button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-buttons">
            <button 
              className="login-button"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            <button 
              className="signup-button"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavHeader; 