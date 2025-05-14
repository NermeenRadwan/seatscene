import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PaymentMethod.css';

function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  // Get the query parameters
  const queryParams = new URLSearchParams(location.search);
  const source = queryParams.get('source') || '';
  const id = queryParams.get('id') || '';
  const time = queryParams.get('time') || '';
  const seats = queryParams.get('seats') || '';
  const price = queryParams.get('price') || '0';
  
  const handleLogoClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleContinue = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    
    // Navigate to card details page with payment information
    navigate(`/card-details?method=${selectedMethod}&price=${price}&source=${source}`);
  };

  return (
    <div className="payment-container">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="payment-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <h1 className="payment-title">Choose your payment method:</h1>
      
      <div className="payment-card">
        <div className="payment-methods">
          <div 
            className={`payment-method ${selectedMethod === 'fawry' ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect('fawry')}
          >
            <img src="/payment/unnamed.webp" alt="Fawry" />
          </div>
          
          <div 
            className={`payment-method ${selectedMethod === 'acceptKiosk' ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect('acceptKiosk')}
          >
            <img src="/payment/unnamed.png" alt="Accept Kiosks" />
          </div>
          
          <div 
            className={`payment-method ${selectedMethod === 'vodaCash' ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect('vodaCash')}
          >
            <img src="/payment/voda-cash.png" alt="Voda Cash" />
          </div>
          
          <div 
            className={`payment-method ${selectedMethod === 'paypal' ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect('paypal')}
          >
            <img src="/payment/pngimg.com - paypal_PNG7.png" alt="PayPal" />
          </div>
          
          <div 
            className={`payment-method ${selectedMethod === 'visa' ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect('visa')}
          >
            <img src="/payment/visa-512.webp" alt="Visa" />
          </div>
          
          <div 
            className={`payment-method ${selectedMethod === 'mastercard' ? 'selected' : ''}`}
            onClick={() => handlePaymentSelect('mastercard')}
          >
            <img src="/payment/png-clipart-mastercard-logo-credit-card-visa-brand-mastercard-text-label-thumbnail.png" alt="Mastercard" />
          </div>
        </div>
      </div>
      
      <div className="payment-details">
        <p className="payment-info">
          Total: <span className="highlight">{price} EGP</span>
        </p>
        {seats && (
          <p className="payment-info">
            Seats: <span className="highlight">{seats}</span>
          </p>
        )}
        {time && (
          <p className="payment-info">
            Time: <span className="highlight">{time}</span>
          </p>
        )}
      </div>
      
      <button 
        className="continue-button"
        onClick={handleContinue}
        disabled={!selectedMethod}
      >
        Continue
      </button>
    </div>
  );
}

export default PaymentMethod; 