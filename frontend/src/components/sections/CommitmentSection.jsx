import React from 'react';
import './CommitmentSection.css';
import UploadFormCard from './UploadFormCard';
import CommitmentFeatureItem from './CommitmentFeatureItem';

function CommitmentSection() {
  return (
    <section className="commitment">
      <div className="container commitment__container">
        <div className="commitment__left">
          <UploadFormCard />
        </div>
        <div className="commitment__right">
          <div className="eyebrow">Our Commitment</div>
          <h2 className="commitment__title">
            Every car is reviewed before it goes live.
          </h2>
          <p className="commitment__desc">
            Our team carefully examines every submission to ensure accuracy and
            trustworthiness before making it available to defence buyers.
          </p>
          <div className="commitment__features">
            <CommitmentFeatureItem
              icon="📷"
              title="Image Authentication"
              description="We verify that photos are original, unaltered, and accurately represent the vehicle."
            />
            <CommitmentFeatureItem
              icon="🎖"
              title="Seller Verification"
              description="Sellers are vetted with service ID checks to ensure only defence personnel list here."
            />
            <CommitmentFeatureItem
              icon="⚡"
              title="Fast Approval"
              description="Most listings go live within 24 hours of submission — no unnecessary delays."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default CommitmentSection;
