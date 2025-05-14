import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavHeader.css';

function NavHeader() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="nav-header">
      <img 
        src="/ArtboVard 1@4x.png" 
        alt="Logo" 
        className="nav-logo" 
        onClick={handleLogoClick}
        title="Go back"
      />
    </div>
  );
}

export default NavHeader; 