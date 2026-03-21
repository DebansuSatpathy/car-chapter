import React from 'react';

function CarPrice({ price, currency }) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);

  return <p className="car-card__price">{formatted}</p>;
}

export default CarPrice;
