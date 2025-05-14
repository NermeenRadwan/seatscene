import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserProfile.css';

function UserProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  // Mock user data (in a real app, this would come from an API or context)
  const [userData, setUserData] = useState({
    name: 'Ahmed Mohamed',
    email: 'ahmed.mohamed@example.com',
    phone: '+20 123 456 7890',
    joinDate: '15 Jan 2023',
    profileImage: '/profile-placeholder.png',
  });
  
  // Mock bookings data (in a real app, this would come from an API)
  const [bookings, setBookings] = useState({
    upcoming: [
      {
        id: 'TKT-A8C4D3E2',
        type: 'Movie',
        title: 'A Working Man',
        date: '24 May 2023',
        time: '7:00 PM',
        seats: 'D4, D5',
        location: 'Mokattam',
        price: '360.00 EGP',
      },
      {
        id: 'TKT-B7F1G3H2',
        type: 'Theater Show',
        title: 'Hamlet',
        date: '30 May 2023',
        time: '7:30 PM',
        seats: 'C8, C9, C10',
        location: 'Maadi',
        price: '750.00 EGP',
      }
    ],
    history: [
      {
        id: 'TKT-J5K7L9M1',
        type: 'Movie',
        title: 'Restart',
        date: '10 Apr 2023',
        time: '5:30 PM',
        seats: 'F7, F8',
        location: 'Tagamo3',
        price: '360.00 EGP',
      },
      {
        id: 'TKT-N3P6Q8R2',
        type: 'Theater Show',
        title: 'Romeo & Juliet',
        date: '22 Mar 2023',
        time: '6:45 PM',
        seats: 'B12, B13',
        location: 'Madinrt nasr',
        price: '500.00 EGP',
      },
      {
        id: 'TKT-S4T7U9V1',
        type: 'Movie',
        title: 'Movie 2',
        date: '15 Feb 2023',
        time: '9:30 PM',
        seats: 'G5',
        location: 'Sheraton',
        price: '150.00 EGP',
      }
    ]
  });
  
  const handleLogoClick = () => {
    navigate('/venue-selection');
  };
  
  const handleContinueBooking = () => {
    navigate('/venue-selection');
  };
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  
  const handleLogout = () => {
    // In a real app, this would clear authentication state
    if (window.confirm('Are you sure you want to log out?')) {
      navigate('/login');
    }
  };
  
  const handleCancelBooking = (booking) => {
    // Set the selected booking and show the refund modal
    setSelectedBooking(booking);
    setShowRefundModal(true);
  };
  
  const handleConfirmCancel = (refundRequested) => {
    // In a real app, this would make an API call to cancel the booking
    // and process a refund if requested
    const updatedUpcoming = bookings.upcoming.filter(booking => booking.id !== selectedBooking.id);
    setBookings({
      ...bookings,
      upcoming: updatedUpcoming
    });
    
    // Show a success message
    alert(`Booking cancelled successfully! ${refundRequested ? 'Refund will be processed within 3-5 business days.' : 'No refund requested.'}`);
    
    // Close the modal
    setShowRefundModal(false);
    setSelectedBooking(null);
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
              <span className="detail-value">{booking.date}</span>
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
  
  return (
    <div className="profile-container">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="profile-logo" 
        onClick={handleLogoClick}
        title="Go to Home"
      />
      
      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-image-container">
            <img 
              src={userData.profileImage} 
              alt="Profile" 
              className="profile-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150';
              }} 
            />
          </div>
          
          <div className="user-details">
            <h2 className="user-name">{userData.name}</h2>
            <p className="user-email">{userData.email}</p>
            <p className="user-phone">{userData.phone}</p>
            <p className="join-date">Member since: {userData.joinDate}</p>
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
              <p>{selectedBooking.date} at {selectedBooking.time}</p>
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