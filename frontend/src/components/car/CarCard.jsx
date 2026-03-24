import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { WebsiteImages } from '../../constants/constant';
import './CarCard.css';

/** Matches car_listings shape (make, photos[], price) used across Buy / Sell / Admin */
function heroImageUrl(listing) {
  const photos = listing.photos || [];
  const hero = photos[listing.hero_index] ?? photos[0];
  return hero?.url || null;
}

function CarCard({ car, index = 0 }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const make = car.make ?? car.brand;
  const model = car.model;
  const { year, km_driven } = car;
  const price = car.price ?? car.listing_price;
  const fuel = car.fuel ?? car.fuel_type;
  const location = car.city ?? car.location;

  const title = [make, model].filter(Boolean).join(' ') || 'Listing';

  const imageUrl =
    heroImageUrl(car) ||
    (Array.isArray(car.images) && car.images[0]) ||
    WebsiteImages.HeroImage;

  const formattedPrice =
    price && isAuthenticated
      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(price)
      : price && !isAuthenticated
        ? '₹ •••••••'
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
            <span className="detail-value">{fuel || '—'}</span>
          </div>
        </div>

        {location && (
          <p className="car-card__location">📍 {location}</p>
        )}

        <div className="car-card__cta">
          <button
            type="button"
            className="car-card__btn"
            onClick={() => car?.id != null && navigate(`/buy?car=${encodeURIComponent(car.id)}`)}
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
}

export default CarCard;
