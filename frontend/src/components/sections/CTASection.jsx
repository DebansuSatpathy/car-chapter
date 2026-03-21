import React from 'react';
import './CTASection.css';

function CTASection() {
  return (
    <section className="cta">
      <div className="cta__bg" />
      <div className="cta__overlay" />
      <div className="container">
        <div className="cta__body">
          <div className="eyebrow">Get Started Today</div>
          <h2 className="cta__title">
            Ready to sell your car <span>for the right price?</span>
          </h2>
          <p className="cta__text">
            Join 5,000+ defence personnel who trust CarChapter. List your vehicle
            for free and connect with verified buyers from the armed forces community.
          </p>
          <div className="cta__buttons">
            <button className="cta__btn-primary">Upload Your Car — It's Free</button>
            <button className="cta__btn-outline">Browse Listings</button>
          </div>
          <div className="cta__trust">
            <span className="cta__trust-item">
              <span className="cta__trust-icon">✓</span> No listing fees
            </span>
            <span className="cta__trust-item">
              <span className="cta__trust-icon">✓</span> Verified buyers only
            </span>
            <span className="cta__trust-item">
              <span className="cta__trust-icon">✓</span> CSD pricing support
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
