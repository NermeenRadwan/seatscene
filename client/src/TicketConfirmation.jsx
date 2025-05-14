import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './TicketConfirmation.css';

function TicketConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [notificationSent, setNotificationSent] = useState(false);
  const [ticketInfo, setTicketInfo] = useState({});
  
  // Get all the query parameters from the URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const source = queryParams.get('source') || '';
    const id = queryParams.get('id') || '';
    const time = queryParams.get('time') || '';
    const seats = queryParams.get('seats') || '';
    const price = queryParams.get('price') || '0';
    const paymentMethod = queryParams.get('method') || '';
    const locationName = queryParams.get('location') || sessionStorage.getItem('selectedLocation') || 'Default Location';
    
    // Determine if it's a movie or show based on the source
    const isMovie = source === 'cinema';
    
    // Get the title based on ID and source
    let title = '';
    if (isMovie) {
      const movieTitles = {
        '1': 'Movie 1',
        '2': 'Movie 2',
        '3': 'Movie 3',
        '4': 'A Working Man',
        '5': 'Restart',
        '6': 'The Matrix'
      };
      title = movieTitles[id] || '';
    } else {
      const showTitles = {
        '1': 'Hamlet',
        '2': 'Romeo & Juliet',
        '3': 'The Phantom',
        '4': 'King Lear',
        '5': 'Macbeth'
      };
      title = showTitles[id] || '';
    }
    
    // Create a ticket information object
    const ticketData = {
      title,
      type: isMovie ? 'Movie' : 'Theater Show',
      time,
      seats,
      price,
      location: locationName,
      paymentMethod,
      date: new Date().toLocaleDateString(),
      ticketId: generateTicketId()
    };
    
    setTicketInfo(ticketData);
    
    // Simulate sending notification after 1 second
    setTimeout(() => {
      console.log('Notification sent:', ticketData);
      setNotificationSent(true);
    }, 1000);
  }, [location.search]);
  
  // Generate a random ticket ID
  const generateTicketId = () => {
    return 'TKT-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  };
  
  const handleHomeClick = () => {
    navigate('/venue-selection');
  };
  
  const handleViewProfile = () => {
    navigate('/profile');
  };
  
  return (
    <div className="ticket-confirmation-container">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="ticket-logo" 
        onClick={handleHomeClick}
        title="Go to Home"
      />
      
      <div className="ticket-card">
        <div className="ticket-header">
          <h1>Booking Confirmed!</h1>
          {notificationSent && (
            <div className="notification-badge">
              <i className="notification-icon">✓</i>
              <span>Notification Sent</span>
            </div>
          )}
        </div>
        
        <div className="ticket-details">
          <div className="ticket-title">{ticketInfo.title}</div>
          <div className="ticket-type">{ticketInfo.type}</div>
          
          <div className="ticket-info-row">
            <div className="ticket-info-item">
              <span className="label">Date:</span>
              <span className="value">{ticketInfo.date}</span>
            </div>
            <div className="ticket-info-item">
              <span className="label">Time:</span>
              <span className="value">{ticketInfo.time}</span>
            </div>
          </div>
          
          <div className="ticket-info-row">
            <div className="ticket-info-item">
              <span className="label">Location:</span>
              <span className="value">{ticketInfo.location}</span>
            </div>
            <div className="ticket-info-item">
              <span className="label">Seats:</span>
              <span className="value">{ticketInfo.seats}</span>
            </div>
          </div>
          
          <div className="ticket-info-row">
            <div className="ticket-info-item">
              <span className="label">Price:</span>
              <span className="value">{ticketInfo.price} EGP</span>
            </div>
            <div className="ticket-info-item">
              <span className="label">Payment:</span>
              <span className="value">{ticketInfo.paymentMethod}</span>
            </div>
          </div>
          
          <div className="ticket-id">
            <span className="label">Ticket ID:</span>
            <span className="value">{ticketInfo.ticketId}</span>
          </div>
        </div>
        
        <div className="qr-code">
          <div className="qr-placeholder"></div>
          <p>Scan at entrance</p>
        </div>
        
        <div className="ticket-footer">
          <p>Thank you for booking with us!</p>
          <p className="small">Please arrive 15 minutes before showtime.</p>
        </div>
      </div>
      
      <div className="confirmation-buttons">
        <button 
          className="home-button"
          onClick={handleHomeClick}
        >
          Back to Home
        </button>
        
        <button 
          className="profile-button"
          onClick={handleViewProfile}
        >
          View My Profile
        </button>
      </div>
    </div>
  );
}

export default TicketConfirmation; 