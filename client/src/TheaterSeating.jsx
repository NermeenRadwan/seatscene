import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './TheaterSeating.css';

function TheaterSeating() {
  const navigate = useNavigate();
  const { showId } = useParams();
  const location = useLocation();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showTitle, setShowTitle] = useState('');
  const [showtime, setShowtime] = useState('');

  // Get the selected time from the URL query params
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const timeParam = queryParams.get('time');
    if (timeParam) {
      setShowtime(timeParam);
    }
  }, [location.search]);

  // Define show data - in a real app this would come from a database
  const showData = {
    1: { title: 'Show 1', price: 250, vipPrice: 400 },
    2: { title: 'Show 2', price: 250, vipPrice: 400 },
    3: { title: 'Show 3', price: 300, vipPrice: 450 },
    4: { title: 'Show 4', price: 300, vipPrice: 450 },
    5: { title: 'Show 5', price: 280, vipPrice: 420 }
  };

  // Set show title when component mounts
  useEffect(() => {
    if (showData[showId]) {
      setShowTitle(showData[showId].title);
    }
  }, [showId]);

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

  // Calculate total price with VIP pricing
  const calculateTotalPrice = () => {
    return selectedSeats.reduce((total, seatId) => {
      const price = isVipSeat(seatId) 
        ? showData[showId]?.vipPrice || 400 
        : showData[showId]?.price || 250;
      return total + price;
    }, 0);
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
    
    // Navigate to payment page with relevant info
    navigate(`/payment?source=theater&id=${showId}&time=${encodeURIComponent(showtime)}&seats=${encodeURIComponent(selectedSeats.join(', '))}&price=${totalPrice}`);
  };

  return (
    <div className="theater-seating-container">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="theater-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <h1 className="theater-title">Select Seats</h1>
      <div className="show-details">
        <p className="show-info">{showTitle}</p>
        {showtime && <p className="showtime-info">Time: {showtime}</p>}
      </div>
      
      <div className="stage-container">
        <div className="stage">STAGE</div>
      </div>
      
      <div className="seating-sections">
        {/* Orchestra section */}
        <div className="section-label">Orchestra <span className="vip-notice">(Rows A-B are VIP)</span></div>
        <div className="orchestra-section">
          {renderOrchestraSeats()}
        </div>
        
        {/* Divider between sections */}
        <div className="section-divider"></div>
        
        {/* Balcony section */}
        <div className="section-label">Balcony</div>
        <div className="balcony-section">
          {renderBalconySeats()}
        </div>
      </div>
      
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat orchestra available"></div>
          <span>Orchestra</span>
        </div>
        <div className="legend-item">
          <div className="seat orchestra vip"></div>
          <span>VIP</span>
        </div>
        <div className="legend-item">
          <div className="seat balcony available"></div>
          <span>Balcony</span>
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
            {vipSeatsCount > 0 && (
              <p className="price-per-seat vip-price">
                VIP: {vipSeatsCount} × {formatPrice(showData[showId]?.vipPrice || 400)}
              </p>
            )}
            {orchestraSeatsCount > 0 && (
              <p className="price-per-seat">
                Orchestra: {orchestraSeatsCount} × {formatPrice(showData[showId]?.price || 250)}
              </p>
            )}
            {balconySeatsCount > 0 && (
              <p className="price-per-seat">
                Balcony: {balconySeatsCount} × {formatPrice(showData[showId]?.price || 250)}
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
          Back to Shows
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

export default TheaterSeating; 