import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { getMovieById, getTheaterById } from './services/api';
import './TheaterSeating.css';

function TheaterSeating() {
  const navigate = useNavigate();
  const { movieId, theaterId } = useParams();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTitle, setShowTitle] = useState('');
  const [showtime, setShowtime] = useState('');
  const [movie, setMovie] = useState(null);
  const [theater, setTheater] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVIP, setIsVIP] = useState(false);
  const [includeParkingPass, setIncludeParkingPass] = useState(false);

  // Get the selected time from the URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const timeParam = queryParams.get('time');
    if (timeParam) {
      setShowtime(timeParam);
    }
    
    // Fetch movie and theater data
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch movie details
        if (movieId) {
          const movieResult = await getMovieById(movieId);
          if (movieResult.success) {
            setMovie(movieResult.data);
            setShowTitle(movieResult.data.title);
          } else {
            setError(movieResult.error || 'Failed to fetch movie details');
          }
        }
        
        // Fetch theater details
        if (theaterId) {
          const theaterResult = await getTheaterById(theaterId);
          if (theaterResult.success) {
            setTheater(theaterResult.data);
          } else {
            setError(theaterResult.error || 'Failed to fetch theater details');
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [movieId, theaterId, location.search]);

  // Theater has a different seating layout than cinema
  // Orchestra section (rows A-G)
  const orchestraRows = 7;
  const orchestraSeatsPerRow = [14, 16, 16, 18, 18, 20, 20];
  const orchestraRowLabels = Array.from({ length: orchestraRows }, (_, i) => String.fromCharCode(65 + i)); // A, B, C, etc.
  
  // Balcony section (rows H-K)
  const balconyRows = 4;
  const balconySeatsPerRow = [12, 14, 14, 14];
  const balconyRowLabels = Array.from({ length: balconyRows }, (_, i) => String.fromCharCode(72 + i)); // H, I, J, K

  // Define VIP rows - first two rows of orchestra
  const vipRows = ['A', 'B'];

  // Some seats are already taken (unavailable)
  const unavailableSeats = [
    'A3', 'A4', 'A11', 'A12',
    'B6', 'B7', 'B8', 'B9',
    'C2', 'C3', 'C4', 'C13', 'C14', 'C15',
    'D5', 'D6', 'D7', 'D12', 'D13',
    'E10', 'E11', 'E12', 'E13',
    'F1', 'F2', 'F19', 'F20',
    'G5', 'G6', 'G7', 'G14', 'G15', 'G16',
    'H3', 'H4', 'H9', 'H10',
    'I7', 'I8', 'I9',
    'J1', 'J2', 'J13', 'J14',
    'K6', 'K7', 'K8', 'K9'
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
    
    // If selecting VIP seats, automatically set isVIP to true
    if (isVipSeat(seatId) && !isVIP) {
      setIsVIP(true);
    }
  };

  // Go back to shows page
  const handleLogoClick = () => {
    navigate(-1);
  };

  // Generate orchestra seating chart
  const renderOrchestraSeats = () => {
    return orchestraRowLabels.map((row, rowIndex) => {
      const isVipRow = vipRows.includes(row);
      
      return (
        <div key={row} className="seat-row">
          <div className={`row-label ${isVipRow ? 'vip-label' : ''}`}>{row}</div>
          {Array.from({ length: orchestraSeatsPerRow[rowIndex] }, (_, i) => {
            const seatNumber = i + 1;
            const seatId = `${row}${seatNumber}`;
            const isUnavailable = unavailableSeats.includes(seatId);
            const isSelected = selectedSeats.includes(seatId);
            const isVip = isVipRow;
            
            return (
              <div 
                key={seatId}
                className={`seat orchestra ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''} ${isVip ? 'vip' : ''}`}
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

  // Generate balcony seating chart
  const renderBalconySeats = () => {
    return balconyRowLabels.map((row, rowIndex) => (
      <div key={row} className="seat-row">
        <div className="row-label">{row}</div>
        {Array.from({ length: balconySeatsPerRow[rowIndex] }, (_, i) => {
          const seatNumber = i + 1;
          const seatId = `${row}${seatNumber}`;
          const isUnavailable = unavailableSeats.includes(seatId);
          const isSelected = selectedSeats.includes(seatId);
          
          return (
            <div 
              key={seatId}
              className={`seat balcony ${isUnavailable ? 'unavailable' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => toggleSeatSelection(seatId)}
              title={`${row}${seatNumber}`}
            >
              {seatNumber}
            </div>
          );
        })}
        <div className="row-label">{row}</div>
      </div>
    ));
  };

  // Calculate base ticket price
  const getBaseTicketPrice = () => {
    return movie?.ticketPrice || 10.00;
  };

  // Calculate total price with VIP pricing and other options
  const calculateTotalPrice = () => {
    const basePrice = getBaseTicketPrice();
    let total = selectedSeats.length * basePrice;
    
    // Add VIP surcharge if isVIP is true (using Decorator pattern on server)
    if (isVIP) {
      total += selectedSeats.length * 5; // $5 per seat VIP surcharge
    }
    
    // Add parking pass if selected (using Decorator pattern on server)
    if (includeParkingPass) {
      total += 8; // $8 parking fee
    }
    
    return total;
  };

  const totalPrice = calculateTotalPrice();

  // Count VIP, orchestra and balcony seats
  const vipSeatsCount = selectedSeats.filter(seatId => isVipSeat(seatId)).length;
  const orchestraSeatsCount = selectedSeats.filter(seatId => 
    orchestraRowLabels.includes(seatId.charAt(0)) && !isVipSeat(seatId)
  ).length;
  const balconySeatsCount = selectedSeats.filter(seatId => 
    balconyRowLabels.includes(seatId.charAt(0))
  ).length;

  // Format price in Egyptian Pounds
  const formatPrice = (price) => {
    return `${price.toFixed(2)} EGP`;
  };

  const handleConfirmSelection = () => {
    if (selectedSeats.length === 0) return;
    
    // Navigate to payment page with relevant info and decorator options
    navigate('/payment', { 
      state: {
        movieId: movieId,
        theaterId: theaterId,
        showtime: showtime,
        seats: selectedSeats,
        price: totalPrice,
        // Decorator pattern options
        isVIP: isVIP,
        parkingPass: includeParkingPass,
        // Additional info
        movieTitle: movie?.title,
        theaterName: theater?.name
      }
    });
  };

  if (loading) {
    return (
      <div className="theater-seating-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading seating chart...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="theater-seating-container">
        <div className="error-message">
          <p>Error: {error}</p>
          <button onClick={handleLogoClick}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="theater-seating-container">
      <img 
        src="/Artboard 1@4x.png" 
        alt="Logo" 
        className="theater-seating-logo"
        onClick={() => navigate('/theater/shows')}
      />
      
      <h1 className="theater-title">Select Seats</h1>
      <div className="show-details">
        <p className="show-info">{showTitle}</p>
        {showtime && <p className="showtime-info">Time: {showtime}</p>}
        {theater && <p className="theater-info">Theater: {theater.name}</p>}
      </div>
      
      <div className="stage-container">
        <div className="stage">STAGE</div>
      </div>
      
      <div className="seating-chart">
        <div className="orchestra-section">
          <h3 className="section-title">Orchestra</h3>
          {renderOrchestraSeats()}
        </div>
        
        <div className="balcony-section">
          <h3 className="section-title">Balcony</h3>
          {renderBalconySeats()}
        </div>
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-example available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat-example selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat-example unavailable"></div>
          <span>Unavailable</span>
        </div>
        <div className="legend-item">
          <div className="seat-example vip"></div>
          <span>VIP</span>
        </div>
      </div>
      
      <div className="booking-options">
        <div className="option-item">
          <input 
            type="checkbox" 
            id="vip-option" 
            checked={isVIP} 
            onChange={e => setIsVIP(e.target.checked)}
            disabled={vipSeatsCount > 0} // Disable if VIP seats are selected
          />
          <label htmlFor="vip-option">VIP Experience (+5 EGP per seat)</label>
        </div>
        
        <div className="option-item">
          <input 
            type="checkbox" 
            id="parking-option" 
            checked={includeParkingPass} 
            onChange={e => setIncludeParkingPass(e.target.checked)}
          />
          <label htmlFor="parking-option">Add Parking Pass (+8 EGP)</label>
        </div>
      </div>
      
      <div className="selection-summary">
        <h3>Your Selection</h3>
        {selectedSeats.length > 0 ? (
          <>
            <p>
              <strong>Seats:</strong> {selectedSeats.join(', ')}
            </p>
            {vipSeatsCount > 0 && (
              <p>
                <strong>VIP Seats:</strong> {vipSeatsCount}
              </p>
            )}
            {orchestraSeatsCount > 0 && (
              <p>
                <strong>Orchestra Seats:</strong> {orchestraSeatsCount}
              </p>
            )}
            {balconySeatsCount > 0 && (
              <p>
                <strong>Balcony Seats:</strong> {balconySeatsCount}
              </p>
            )}
            {isVIP && (
              <p>
                <strong>VIP Experience:</strong> Yes (+5 EGP per seat)
              </p>
            )}
            {includeParkingPass && (
              <p>
                <strong>Parking Pass:</strong> Yes (+8 EGP)
              </p>
            )}
            <p className="total-price">
              <strong>Total Price:</strong> {formatPrice(totalPrice)}
            </p>
          </>
        ) : (
          <p>No seats selected</p>
        )}
      </div>
      
      <button 
        className="confirm-button"
        onClick={handleConfirmSelection}
        disabled={selectedSeats.length === 0}
      >
        Confirm Selection
      </button>
    </div>
  );
}

export default TheaterSeating; 