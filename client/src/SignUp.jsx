import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SignUp.css';
import NavHeader from './NavHeader';

function SignUp() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you would create the account here
    navigate('/venue-selection');
  };

  return (
    <div className="signup-container">
      <NavHeader />
      <div className="signup-box">
        <h2>Create Account</h2>
        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullname">Full Name</label>
            <input 
              type="text" 
              id="fullname" 
              className="signup-input" 
              placeholder="Enter your full name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              className="signup-input" 
              placeholder="Enter your email"
            />
          </div>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              className="signup-input" 
              placeholder="Choose a username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="signup-input" 
              placeholder="Create a password"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className="signup-input" 
              placeholder="Confirm your password"
            />
          </div>
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
        <p className="signup-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp; 