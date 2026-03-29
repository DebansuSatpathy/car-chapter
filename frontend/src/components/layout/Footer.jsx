import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            <div className="footer__logo">
              <div className="footer__logo-mark">CC</div>
              <span className="footer__logo-text">Car<span>Chapter</span></span>
            </div>
            <div className="footer__text">
              <p className="footer__tagline">
                Sell your car faster with verified buyers from the defence community.
              </p>
              <p className="footer__tagline footer__tagline--sub">
                We help you find the right buyer, handle the process, and ensure a smooth deal.
              </p>
            </div>
            <div className="footer__socials">
              <a href="#" className="footer__social-link" aria-label="Twitter">𝕏</a>
              <a href="#" className="footer__social-link" aria-label="Instagram">◈</a>
              <a href="#" className="footer__social-link" aria-label="LinkedIn">in</a>
            </div>
          </div>

          {/* Buying */}
          <div className="footer__col">
            <h5>Buying</h5>
            <ul>
              <li><Link to="/buy">Browse All Cars</Link></li>
              <li><Link to="/buy">New Listings</Link></li>
              <li><a href="#csd">CSD Cars</a></li>
              <li><a href="#buy">Best Deals</a></li>
            </ul>
          </div>

          {/* Selling */}
          <div className="footer__col">
            <h5>Selling</h5>
            <ul>
              <li><Link to="/sell">List Your Car</Link></li>
              <li><a href="#how">How It Works</a></li>
              <li><a href="#benefits">Defence Benefits</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer__col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#about">About Us</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; 2026 <span>CarChapter</span>. All rights reserved.
          </p>
          <div className="footer__badges">
            <span className="footer__badge">
              <span className="footer__badge-icon">🔒</span> Secure Platform
            </span>
            <span className="footer__badge">
              <span className="footer__badge-icon">🎖</span> Defence Verified
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
