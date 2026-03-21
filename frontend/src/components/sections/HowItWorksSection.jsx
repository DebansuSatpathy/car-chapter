import React from 'react';
import './HowItWorksSection.css';

const steps = [
  {
    num: '01',
    title: 'Upload Your Car',
    desc: 'Add details, photos, and your asking price. Our form takes less than 5 minutes to complete.',
    tag: 'Free',
    tagType: 'gold',
  },
  {
    num: '02',
    title: 'We Review & Verify',
    desc: 'Our team authenticates images, verifies seller credentials, and checks your listing for accuracy.',
    tag: 'Within 24 hrs',
    tagType: 'teal',
  },
  {
    num: '03',
    title: 'Your Listing Goes Live',
    desc: 'Once approved, your car is visible to thousands of verified defence buyers across India.',
    tag: 'Instant',
    tagType: 'gold',
  },
];

function HowItWorksSection() {
  return (
    <section className="how" id="how">
      <div className="container">
        <div className="how__header">
          <div className="eyebrow">Simple Process</div>
          <h2 className="how__title">How It Works</h2>
          <p className="how__subtitle">
            From listing to sold — our streamlined process gets your car in front of
            the right buyers, fast.
          </p>
        </div>

        <div className="how__steps">
          {steps.map((s) => (
            <div className="how-step" key={s.num}>
              <div className="how-step__num-wrap">
                <div className="how-step__num">{s.num}</div>
              </div>
              <div className="how-step__body">
                <h3 className="how-step__title">{s.title}</h3>
                <p className="how-step__desc">{s.desc}</p>
                <span className={`how-step__tag how-step__tag--${s.tagType}`}>{s.tag}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="how__cta">
          <button className="how__cta-btn">Start Listing Your Car →</button>
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
