import React, { useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar${scrolled ? ' navbar--scrolled' : ''}`}>
      <div className="container navbar__container">
        <a href="/" className="navbar__logo">
          <div className="navbar__logo-mark">CC</div>
          <span className="navbar__logo-text">Car<span>Chapter</span></span>
        </a>

        <ul className="navbar__links">
          <li><a href="#buy">Buy Cars</a></li>
          <li><a href="#sell">Sell Your Car</a></li>
          <li><a href="#csd">CSD Cars</a></li>
          <li><a href="#benefits">Defence Benefits</a></li>
          <li><a href="#how">How It Works</a></li>
        </ul>

        <div className="navbar__actions">
          <button className="navbar__btn-login">Login</button>
          <button className="navbar__btn-primary">List Your Car</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
