import React from 'react';
import './CommitmentFeatureItem.css';

function CommitmentFeatureItem({ icon, title, description }) {
  return (
    <div className="commitment-feature">
      <div className="commitment-feature__icon">{icon}</div>
      <div>
        <h4 className="commitment-feature__title">{title}</h4>
        <p className="commitment-feature__description">{description}</p>
      </div>
    </div>
  );
}

export default CommitmentFeatureItem;
