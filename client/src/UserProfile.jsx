import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './UserProfile.css';

// Create axios instance with base URL
const api = axios.create({
  baseURL: 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json'
  }
});

function UserProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState({ upcoming: [], history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { state: { from: location.pathname } });
          return;
        }

        // Fetch user profile
        const profileResponse = await api.get('/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (profileResponse.data.user) {
          setUserData(profileResponse.data.user);
          localStorage.setItem('userData', JSON.stringify(profileResponse.data.user));
        }

        // Fetch user bookings
        const bookingsResponse = await api.get('/api/users/bookings', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (bookingsResponse.data.bookings) {
          setBookings(bookingsResponse.data.bookings);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          navigate('/login', { state: { from: location.pathname } });
          return;
        }
        setError(error.response?.data?.message || 'Error loading profile');
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate, location]);

  const handleLogoClick = () => {
    navigate('/venue-selection');
  };

  const handleContinueBooking = () => {
    navigate('/venue-selection');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        const token = localStorage.getItem('token');
        await api.post('/api/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        navigate('/login');
      }
    }
  };

  const handleCancelBooking = (booking) => {
    setSelectedBooking(booking);
    setShowRefundModal(true);
  };

  const handleConfirmCancel = async (refundRequested) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/api/bookings/${selectedBooking.id}/cancel`, 
        { refundRequested },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      const updatedUpcoming = bookings.upcoming.filter(
        booking => booking.id !== selectedBooking.id
      );
      setBookings({
        ...bookings,
        upcoming: updatedUpcoming
      });

      alert(`Booking cancelled successfully! ${
        refundRequested ? 'Refund will be processed within 3-5 business days.' : 'No refund requested.'
      }`);

      setShowRefundModal(false);
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert(error.response?.data?.message || 'Error cancelling booking');
    }
  };

  const handleCancelModal = () => {
    setShowRefundModal(false);
    setSelectedBooking(null);
  };

  const renderBookingCard = (booking, showCancelButton = false) => {
    return (
      <div key={booking.id} className="booking-card">
        <div className="booking-header">
          <div className="booking-type">{booking.type}</div>
          <div className="booking-id">{booking.id}</div>
        </div>
        
        <div className="booking-title">{booking.title}</div>
        
        <div className="booking-details">
          <div className="booking-detail-row">
            <div className="booking-detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">
                {new Date(booking.date).toLocaleDateString()}
              </span>
            </div>
            <div className="booking-detail-item">
              <span className="detail-label">Time:</span>
              <span className="detail-value">{booking.time}</span>
            </div>
          </div>
          
          <div className="booking-detail-row">
            <div className="booking-detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{booking.location}</span>
            </div>
            <div className="booking-detail-item">
              <span className="detail-label">Seats:</span>
              <span className="detail-value">{booking.seats}</span>
            </div>
          </div>
          
          <div className="booking-detail-row">
            <div className="booking-detail-item full-width">
              <span className="detail-label">Price:</span>
              <span className="detail-value">{booking.price}</span>
            </div>
          </div>
          
          {showCancelButton && (
            <button 
              className="cancel-booking-button"
              onClick={() => handleCancelBooking(booking)}
            >
              Cancel Booking
            </button>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error">{error}</div>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="error-container">
        <div className="error">User data not found</div>
        <button 
          className="retry-button"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <img 
        src="/Artboard 1@4x.png" 
        alt="Logo" 
        className="profile-logo" 
        onClick={handleLogoClick}
        title="Go to Home"
      />
      #profile buuton
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-container">
            <img 
              src={userData.profileImage || '/profile-placeholder.png'} 
              alt="Profile" 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }} 
            />
          </div>
          
          <div className="user-details">
            <h2 className="user-name">
              {userData.firstName} {userData.lastName}
            </h2>
            <p className="user-email">{userData.email}</p>
            <p className="user-phone">{userData.phone || 'No phone number'}</p>
            <p className="join-date">
              Member since: {new Date(userData.joinDate).toLocaleDateString()}
            </p>
          </div>
          
          <button 
            className="continue-booking-button"
            onClick={handleContinueBooking}
          >
            Book New Ticket
          </button>
          
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
        
        <div className="bookings-container">
          <div className="tabs">
            <button 
              className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleTabChange('upcoming')}
            >
              Upcoming Bookings
            </button>
            <button 
              className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              Booking History
            </button>
          </div>
          
          <div className="bookings-list">
            {activeTab === 'upcoming' && (
              <>
                {bookings.upcoming.length > 0 ? (
                  bookings.upcoming.map(booking => renderBookingCard(booking, true))
                ) : (
                  <div className="no-bookings">
                    <p>You don't have any upcoming bookings.</p>
                    <button 
                      className="book-now-button"
                      onClick={handleContinueBooking}
                    >
                      Book Now
                    </button>
                  </div>
                )}
              </>
            )}
            
            {activeTab === 'history' && (
              <>
                {bookings.history.length > 0 ? (
                  bookings.history.map(booking => renderBookingCard(booking))
                ) : (
                  <div className="no-bookings">
                    <p>You don't have any booking history yet.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      
      {showRefundModal && selectedBooking && (
        <div className="refund-modal-overlay">
          <div className="refund-modal">
            <h2>Cancel Booking</h2>
            <p>Are you sure you want to cancel your booking for:</p>
            <div className="booking-summary">
              <p className="booking-title-modal">{selectedBooking.title}</p>
              <p>{new Date(selectedBooking.date).toLocaleDateString()} at {selectedBooking.time}</p>
              <p>Seats: {selectedBooking.seats}</p>
              <p>Total Amount: {selectedBooking.price}</p>
            </div>
            
            <div className="refund-options">
              <h3>Refund Options</h3>
              <p>Please select one of the following options:</p>
              
              <div className="refund-buttons">
                <button 
                  className="refund-button"
                  onClick={() => handleConfirmCancel(true)}
                >
                  Cancel with Refund
                </button>
                <button 
                  className="no-refund-button"
                  onClick={() => handleConfirmCancel(false)}
                >
                  Cancel without Refund
                </button>
                <button 
                  className="keep-booking-button"
                  onClick={handleCancelModal}
                >
                  Keep My Booking
                </button>
              </div>
              
              <p className="refund-note">Note: Refunds typically take 3-5 business days to process.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserProfile; 