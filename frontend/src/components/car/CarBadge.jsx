import React from 'react';
import '../common/Badge.css';

function CarBadge({ text }) {
  return <span className="badge badge--success">{text}</span>;
}

export default CarBadge;
