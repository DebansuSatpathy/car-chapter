import React from 'react';
import './HowStepCard.css';

function HowStepCard({ step, title, description, accentColor }) {
  return (
    <div className="how-step-card">
      <div className="how-step-card__icon-wrapper">
        <div className="how-step-card__icon">{/* placeholder svg */}
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="20" r="20" fill="var(--bg-card)" />
          </svg>
        </div>
        <div className={`how-step-card__step-badge badge--${accentColor}`}>{step}</div>
      </div>
      <h3 className="how-step-card__title">{title}</h3>
      <p className="how-step-card__description">{description}</p>
    </div>
  );
}

export default HowStepCard;
