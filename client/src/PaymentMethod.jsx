import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createBooking } from './services/api';
import './PaymentMethod.css';

function PaymentMethod() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  // Get booking data from location state (passed from TheaterSeating)
  const bookingData = location.state || {};
  
  const handleLogoClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handlePaymentSelect = (method) => {
    setSelectedMethod(method);
    setError(null);
  };

  const mapPaymentMethodToAPI = (method) => {
    // Map UI payment methods to API payment methods
    switch(method) {
      case 'visa':
      case 'mastercard':
        return 'credit_card';
      case 'paypal':
        return 'paypal';
      case 'vodaCash':
        return 'mobile_payment';
      case 'fawry':
      case 'acceptKiosk':
        return 'payment_service';
      default:
        return 'credit_card';
    }
  };

  const handleContinue = async () => {
    if (!selectedMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // Create a booking with the decorator pattern options
      const bookingPayload = {
        movie: bookingData.movieId,
        theater: bookingData.theaterId,
        showtime: bookingData.showtime,
        seats: bookingData.seats,
        // Decorator pattern options
        isVIP: bookingData.isVIP,
        parkingPass: bookingData.parkingPass,
        // Payment details
        paymentMethod: mapPaymentMethodToAPI(selectedMethod),
        paymentDetails: {
          // These would be collected on the next screen in a real app
          // For now, we'll use dummy data
          cardNumber: '4111111111111111',
          expiryDate: '12/25',
          cvv: '123',
          email: 'user@example.com',
          token: 'sample-token'
        }
      };
      
      // Create booking (which will use the facade pattern on the server)
      const result = await createBooking(bookingPayload);
      
      if (result.success) {
        // Navigate to confirmation page
        navigate('/ticket-confirmation', { 
          state: {
            booking: result.data,
            movieTitle: bookingData.movieTitle,
            theaterName: bookingData.theaterName,
            paymentMethod: selectedMethod
          }
        });
      } else {
        setError(result.error || 'Failed to process booking');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="payment-container">
      <img 
        src="/Artboard 1@4x.png" 
        alt="Logo" 
        className="payment-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
      
      <h1 className="payment-title">Choose your payment method:</h1>
      
      {error && <div className="payment-error">{error}</div>}
      
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
          Total: <span className="highlight">{bookingData.price} EGP</span>
        </p>
        {bookingData.seats && (
          <p className="payment-info">
            Seats: <span className="highlight">{bookingData.seats.join(', ')}</span>
          </p>
        )}
        {bookingData.showtime && (
          <p className="payment-info">
            Time: <span className="highlight">{bookingData.showtime}</span>
          </p>
        )}
        {bookingData.movieTitle && (
          <p className="payment-info">
            Movie: <span className="highlight">{bookingData.movieTitle}</span>
          </p>
        )}
        {bookingData.theaterName && (
          <p className="payment-info">
            Theater: <span className="highlight">{bookingData.theaterName}</span>
          </p>
        )}
        {bookingData.isVIP && (
          <p className="payment-info">
            VIP Experience: <span className="highlight">Yes</span>
          </p>
        )}
        {bookingData.parkingPass && (
          <p className="payment-info">
            Parking Pass: <span className="highlight">Yes</span>
          </p>
        )}
      </div>
      
      <button 
        className="continue-button"
        onClick={handleContinue}
        disabled={!selectedMethod || isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Continue'}
      </button>
    </div>
  );
}

export default PaymentMethod; 