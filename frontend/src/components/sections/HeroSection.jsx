import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

function HeroSection() {
  const bgRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (bgRef.current) bgRef.current.classList.add('loaded');
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="hero">
      <div className="hero__bg" ref={bgRef} />
      <div className="hero__overlay" />

      <div className="container hero__container">
        <div className="hero__inner">
          <div className="hero__badge">
            <span className="hero__badge-dot" />
            Trusted by 5,000+ Defence Personnel
          </div>

          <h1 className="hero__heading">
            India's Trusted Car Platform
            <span className="hero__heading-accent">for Defence Personnel</span>
          </h1>

          <p className="hero__sub">
            Explore verified car listings, connect with trusted buyers and sellers, and get
            assistance with CSD purchases — all in one place.
          </p>

          <div className="hero__search">
            <input
              className="hero__search-input"
              type="text"
              placeholder="Search by brand, model or location..."
            />
            <div className="hero__search-divider" />
            <select className="hero__search-select">
              <option>All Makes</option>
              <option>Maruti</option>
              <option>Hyundai</option>
              <option>Toyota</option>
              <option>Honda</option>
              <option>Tata</option>
              <option>Mahindra</option>
            </select>
            <div className="hero__search-divider" />
            <select className="hero__search-select">
              <option>Any Budget</option>
              <option>Under ₹5L</option>
              <option>₹5L – ₹10L</option>
              <option>₹10L – ₹20L</option>
              <option>Above ₹20L</option>
            </select>
            <button className="hero__search-btn" onClick={() => navigate('/buy')}>
              Search
            </button>
          </div>

          <div className="hero__actions">
            <button className="hero__btn-primary" onClick={() => navigate('/sell')}>
              Upload Your Car
            </button>
            <button className="hero__btn-outline" onClick={() => navigate('/buy')}>
              Browse Listings
            </button>
            <button className="hero__btn-outline">CSD Assistance</button>
          </div>

          <div className="hero__trust">
            <div className="trust-item">
              <span className="trust-item__value">5,000+</span>
              <span className="trust-item__label">Verified Sellers</span>
            </div>
            <div className="trust-item">
              <span className="trust-item__value">₹0</span>
              <span className="trust-item__label">Listing Fee</span>
            </div>
            <div className="trust-item">
              <span className="trust-item__value">24 hrs</span>
              <span className="trust-item__label">Avg. Sale Time</span>
            </div>
            <div className="trust-item">
              <span className="trust-item__value">100%</span>
              <span className="trust-item__label">Verified Cars</span>
            </div>
          </div>
        </div>
      </div>

      <div className="hero__card">
        <span className="hero__card-label">Listed This Week</span>
        <span className="hero__card-value">240+</span>
        <span className="hero__card-sub">New vehicles across India</span>
      </div>

      <div className="hero__scroll">
        <div className="hero__scroll-line" />
        <span className="hero__scroll-text">Scroll</span>
      </div>
    </section>
  );
}

export default HeroSection;
