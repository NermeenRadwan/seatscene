import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CardDetails.css';

function CardDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cardNumber, setCardNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Get the query parameters from the previous page
  const queryParams = new URLSearchParams(location.search);
  const paymentMethod = queryParams.get('method') || '';
  const price = queryParams.get('price') || '0';
  const source = queryParams.get('source') || '';
  
  const handleLogoClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!cardNumber.trim() || !password.trim()) {
      alert('Please fill in all fields');
      return;
    }
    
    // Simulate processing
    setIsProcessing(true);
    
    setTimeout(() => {
      setIsProcessing(false);
      
      // Navigate to ticket confirmation page with all the booking details
      navigate(`/ticket-confirmation?source=${source}&price=${price}&method=${paymentMethod}`
        + (queryParams.get('id') ? `&id=${queryParams.get('id')}` : '')
        + (queryParams.get('time') ? `&time=${queryParams.get('time')}` : '')
        + (queryParams.get('seats') ? `&seats=${queryParams.get('seats')}` : '')
      );
    }, 1500);
  };
  
  return (
    <div className="card-details-container">
      <img 
        src="/Artboard 1@4x.png" 
        alt="Logo" 
        className="card-details-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <div className="card-details-form-container">
        <form className="card-details-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="cardNumber">Card / Phone Number:</label>
            <input
              type="text"
              id="cardNumber"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="Enter card or phone number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="confirm-button"
            disabled={isProcessing}
          >
            {isProcessing ? 'Processing...' : 'Confirm'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CardDetails; 