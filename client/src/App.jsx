import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Login from './Login';
import SignUp from './SignUp';
import VenueSelection from './VenueSelection';
import CinemaMovies from './CinemaMovies';
import CinemaSeating from './CinemaSeating';
import TheaterShows from './TheaterShows';
import TheaterSeating from './TheaterSeating';
import LocationSelection from './LocationSelection';
import PaymentMethod from './PaymentMethod';
import CardDetails from './CardDetails';
import TicketConfirmation from './TicketConfirmation';
import UserProfile from './UserProfile';
import AdminDashboard from './AdminDashboard';
import ConnectionStatus from './components/ConnectionStatus';

// Button component with navigation
function ContinueButton() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate('/login');
  };
  
  return (
    <button className="App-button" onClick={handleClick}>
      Continue
    </button>
  );
}

// Home component
function Home() {
  return (
    <div className="App">
      <header className="App-header">
        <img 
          src="/Artboard 1@4x.png" 
          className="App-logo" 
          alt="logo" 
          style={{ maxWidth: '300px', height: 'auto', animation: 'none' }}
        />
        <p>
          Welcome Back<code></code> We are happy to see you again!
        </p>
        <ContinueButton />
      </header>
    </div>
  );
}

// Main App component with routing
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/venue-selection" element={<VenueSelection />} />
        <Route path="/cinema/location" element={<LocationSelection />} />
        <Route path="/theater/location" element={<LocationSelection />} />
        <Route path="/cinema/movies" element={<CinemaMovies />} />
        <Route path="/cinema/seating/:movieId" element={<CinemaSeating />} />
        <Route path="/theater/shows" element={<TheaterShows />} />
        <Route path="/theater/seating/:showId" element={<TheaterSeating />} />
        <Route path="/payment" element={<PaymentMethod />} />
        <Route path="/card-details" element={<CardDetails />} />
        <Route path="/ticket-confirmation" element={<TicketConfirmation />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
      <ConnectionStatus />
    </Router>
  );
}

export default App;
