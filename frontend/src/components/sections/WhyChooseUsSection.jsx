import React from 'react';
import './WhyChooseUsSection.css';

const cards = [
  {
    icon: '🎖️',
    title: 'Defence Specialised Platform',
    description: 'Designed exclusively for defence personnel with CSD pricing benefits and military community features. Only serving and veteran personnel can list here.',
  },
  {
    icon: '✔',
    title: 'Every Seller Verified',
    description: 'All dealers and private sellers are authenticated with service IDs and documentation. Zero chance of fraud — we guarantee it.',
  },
  {
    icon: '🤝',
    title: 'CSD Car Assistance',
    description: 'Expert guidance on CSD car purchases. Navigate complex benefits and paperwork with our dedicated support team — at no extra cost.',
  },
];

const stats = [
  { value: '5,000+', label: 'Registered Members' },
  { value: '₹0', label: 'Listing Fee' },
  { value: '24 hrs', label: 'Avg. Approval Time' },
  { value: '98%', label: 'Satisfaction Rate' },
];

function WhyChooseUsSection() {
  return (
    <section className="why">
      <div className="container">
        <div className="why__header">
          <div className="eyebrow">Why CarChapter</div>
          <h2 className="why__title">Your Trusted Defence Car Marketplace</h2>
          <p className="why__subtitle">
            Built for defence personnel, by those who understand your needs.
            Access exclusive benefits, verified listings, and dedicated support.
          </p>
        </div>

        <div className="why__stats">
          {stats.map((s) => (
            <div className="why__stat" key={s.label}>
              <div className="why__stat-value">{s.value}</div>
              <div className="why__stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="why__grid">
          {cards.map((card) => (
            <div className="why-card" key={card.title}>
              <div className="why-card__icon-wrap">{card.icon}</div>
              <h3 className="why-card__title">{card.title}</h3>
              <p className="why-card__description">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default WhyChooseUsSection;
