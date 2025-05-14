import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './CinemaSeating.css';

function CinemaSeating() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [movieTitle, setMovieTitle] = useState('');
  const [showtime, setShowtime] = useState('');

  // Get the selected time from the URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const timeParam = queryParams.get('time');
    if (timeParam) {
      setShowtime(timeParam);
    }
  }, [location.search]);

  // Define movie data - in a real app this would come from a database
  const movieData = {
    1: { title: 'Movie 1', price: 150, vipPrice: 250 },
    2: { title: 'Movie 2', price: 150, vipPrice: 250 },
    3: { title: 'Movie 3', price: 150, vipPrice: 250 },
    4: { title: 'Movie 4', price: 180, vipPrice: 300 },
    5: { title: 'Movie 5', price: 180, vipPrice: 300 }
  };

  // Set movie title when component mounts
  useEffect(() => {
    if (movieData[movieId]) {
      setMovieTitle(movieData[movieId].title);
    }
  }, [movieId]);

  // Create seating layout
  const rows = 8;
  const seatsPerRow = 12;
  const rowLabels = Array.from({ length: rows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, etc.
  
  // Define VIP rows - rows A and B are VIP
  const vipRows = ['A', 'B'];

  // Some seats are already taken (unavailable)
  const unavailableSeats = [
    'A3', 'A4', 'A5',
    'B5', 'B6',
    'C2', 'C3', 'C7', 'C8',
    'D1', 'D2', 'D11', 'D12',
    'E4', 'E5', 'E6', 'E7',
    'F10', 'F11', 'F12',
    'G1', 'G2', 'G3', 'G8', 'G9'
  ];

  // Check if a seat is VIP
  const isVipSeat = (seatId) => {
    return vipRows.includes(seatId.charAt(0));
  };

  // Handle seat selection
  const toggleSeatSelection = (seatId) => {
    if (unavailableSeats.includes(seatId)) return;

    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(seat => seat !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // Go back to movies page
  const handleLogoClick = () => {
    navigate(-1);
  };

  // Generate seating chart rows
  const renderSeats = () => {
    return rowLabels.map(row => {
      const isVipRow = vipRows.includes(row);
      
      return (
        <div key={row} className="seat-row">
          <div className={`row-label ${isVipRow ? 'vip-label' : ''}`}>{row}</div>
          {Array.from({ length: seatsPerRow }, (_, i) => {
            const seatNumber = i + 1;
            const seatId = `${row}${seatNumber}`;
            const isUnavailable = unavailableSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);
            const isVip = isVipRow;
            
            return (
              <div 
                key={seatId}
                className={`seat ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''} ${isVip ? 'vip' : ''}`}
                onClick={() => toggleSeatSelection(seatId)}
                title={`${row}${seatNumber}${isVip ? ' (VIP)' : ''}`}
              >
                {seatNumber}
              </div>
            );
          })}
          <div className={`row-label ${isVipRow ? 'vip-label' : ''}`}>{row}</div>
        </div>
      );
    });
  };

  // Calculate total price including VIP seats
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const price = isVipSeat(seatId) 
        ? movieData[movieId]?.vipPrice || 250 
        : movieData[movieId]?.price || 150;
      return total + price;
    }, 0);
  };

  const totalPrice = calculateTotalPrice();

  // Count VIP and regular seats
  const vipSeatsCount = selectedSeats.filter(seatId => isVipSeat(seatId)).length;
  const regularSeatsCount = selectedSeats.length - vipSeatsCount;

  // Format price in Egyptian Pounds
  const formatPrice = (price) => {
    return `${price.toFixed(2)} EGP`;
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) return;
    
    // Navigate to payment page with relevant info
    navigate(`/payment?source=cinema&id=${movieId}&time=${encodeURIComponent(showtime)}&seats=${encodeURIComponent(selectedSeats.join(', '))}&price=${totalPrice}`);
  };

  const handleCancelBooking = () => {
    // Show confirmation dialog
    if (window.confirm('Are you sure you want to cancel your booking?')) {
      // Navigate back to venue selection
      navigate('/venue-selection');
    }
  };

  return (
    <div className="seating-container">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="seating-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <h1 className="seating-title">Select Seats</h1>
      <div className="movie-details">
        <p className="movie-info">{movieTitle}</p>
        {showtime && <p className="showtime-info">Time: {showtime}</p>}
      </div>
      
      <div className="screen-container">
        <div className="screen">SCREEN</div>
      </div>
      
      <div className="seating-chart">
        {renderSeats()}
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Regular Seat</span>
        </div>
        <div className="legend-item">
          <div className="seat vip"></div>
          <span>VIP Seat</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat unavailable"></div>
          <span>Unavailable</span>
        </div>
      </div>
      
      <div className="selection-summary">
        <p className="selected-seats-label">
          {selectedSeats.length > 0 
            ? `Selected seats: ${selectedSeats.sort().join(', ')}` 
            : 'No seats selected'}
        </p>
        <p className="price-summary">
          Total: {formatPrice(totalPrice)}
        </p>
        {selectedSeats.length > 0 && (
          <div className="price-breakdown">
            {regularSeatsCount > 0 && (
              <p className="price-per-seat">
                Regular: {regularSeatsCount} × {formatPrice(movieData[movieId]?.price || 150)}
              </p>
            )}
            {vipSeatsCount > 0 && (
              <p className="price-per-seat vip-price">
                VIP: {vipSeatsCount} × {formatPrice(movieData[movieId]?.vipPrice || 250)}
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="action-buttons">
        <button 
          className="back-button" 
          onClick={() => navigate(-1)}
        >
          Back to Movies
        </button>
        <button 
          className="cancel-button" 
          onClick={handleCancelBooking}
        >
          Cancel Booking
        </button>
        <button 
          className="confirm-button" 
          disabled={selectedSeats.length === 0}
          onClick={handleConfirmSelection}
        >
          Confirm Selection
        </button>
      </div>
    </div>
  );
}

export default CinemaSeating; 