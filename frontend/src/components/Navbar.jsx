// Navbar.js - UPDATED FONT SIZES
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleBookNow = () => {
    navigate('/rooms');
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-logo">
          <Link to="/" onClick={closeMenu}>
            <div className="logo-content">
              <span className="logo-icon">🏝️</span>
              <div className="logo-text">
                <div className="logo-main">Nandhini</div>
                <div className="logo-sub">Beach Resort</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Main Navigation - LARGER FONT */}
        <div className="nav-main">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/rooms" className={`nav-link ${location.pathname === '/rooms' ? 'active' : ''}`}>
            Rooms & Suites
          </Link>
          <Link to="/gallery" className={`nav-link ${location.pathname === '/gallery' ? 'active' : ''}`}>
            Gallery
          </Link>
          <Link to="/amenities" className={`nav-link ${location.pathname === '/amenities' ? 'active' : ''}`}>
            Amenities
          </Link>
          <Link to="/packages" className={`nav-link ${location.pathname === '/packages' ? 'active' : ''}`}>
            Packages
          </Link>
          <Link to="/reviews" className={`nav-link ${location.pathname === '/reviews' ? 'active' : ''}`}>
            Reviews
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>
        </div>

        {/* Book Now Button */}
        <div className="nav-right">
          <button className="book-now-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
          <span className={isMenuOpen ? 'active' : ''}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-content">
          <Link to="/" className="mobile-link" onClick={closeMenu}>Home</Link>
          <Link to="/rooms" className="mobile-link" onClick={closeMenu}>Rooms & Suites</Link>
          <Link to="/gallery" className="mobile-link" onClick={closeMenu}>Gallery</Link>
          <Link to="/amenities" className="mobile-link" onClick={closeMenu}>Amenities</Link>
          <Link to="/packages" className="mobile-link" onClick={closeMenu}>Packages</Link>
          <Link to="/reviews" className="mobile-link" onClick={closeMenu}>Reviews</Link>
          <Link to="/contact" className="mobile-link" onClick={closeMenu}>Contact</Link>
          
          <button className="mobile-book-btn" onClick={handleBookNow}>
            Book Now
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;