import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import NavHeader from './NavHeader';

function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  // Admin credentials
  const ADMIN_USERNAME = 'admin';
  const ADMIN_PASSWORD = 'admin123';

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoginError('');
    
    // Check if the credentials match admin credentials
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      // Navigate to admin dashboard for admin users
      navigate('/admin-dashboard');
    } else {
      // For regular users, we just navigate to venue selection
      // In a real app, you would validate user credentials against a database
      navigate('/venue-selection');
    }
  };

  return (
    <div className="login-container">
      <NavHeader />
      <div className="login-box">
        <h2>Login</h2>
        
        {loginError && <div className="login-error">{loginError}</div>}
        
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              className="login-input" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="login-input" 
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        
        <p className="login-footer">
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login; 