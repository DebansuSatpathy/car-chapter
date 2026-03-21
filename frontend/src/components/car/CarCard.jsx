import React from 'react';
import './CarCard.css';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80',
];

function CarCard({ car, index = 0 }) {
  const { brand, model, listing_price, images = [], year, km_driven, fuel_type, location } = car;
  const title = `${brand} ${model}`.trim();

  const imageUrl =
    images && images.length > 0
      ? images[0]
      : FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  const formattedPrice = listing_price
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(listing_price)
    : '₹ On Request';

  const formattedKm = km_driven
    ? `${new Intl.NumberFormat('en-IN').format(km_driven)} km`
    : '—';

  return (
    <div className="car-card">
      <div className="car-card__image-wrapper">
        <img className="car-card__image" src={imageUrl} alt={title} loading="lazy" />
        <div className="car-card__badge">
          <span className="car-card__tag car-card__tag--verified">✓ Verified</span>
          {year && <span className="car-card__tag car-card__tag--gold">{year}</span>}
        </div>
        <button className="car-card__favorite" aria-label="Save">♡</button>
      </div>

      <div className="car-card__content">
        <div className="car-card__header">
          <h3 className="car-card__title">{title}</h3>
          <p className="car-card__price">{formattedPrice}</p>
        </div>

        <div className="car-card__details">
          <div className="detail-row">
            <span className="detail-label">Mileage</span>
            <span className="detail-value">{formattedKm}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Fuel</span>
            <span className="detail-value">{fuel_type || '—'}</span>
          </div>
        </div>

        {location && (
          <p className="car-card__location">📍 {location}</p>
        )}

        <div className="car-card__cta">
          <button className="car-card__btn">View Details →</button>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
