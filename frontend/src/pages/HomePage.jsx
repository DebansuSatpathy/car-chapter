import React, { useEffect, useState } from 'react';
import { fetchCars } from '../api/carApi';
import CarCard from '../components/car/CarCard';
import './HomePage.css';

function HomePage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchCars()
      .then((data) => {
        setCars(data || []);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load cars.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="home-page">
      <h1 className="home-page__heading">Available Cars</h1>

      {loading && <p className="home-page__status">Loading cars...</p>}
      {error && <p className="home-page__status home-page__status--error">{error}</p>}

      {!loading && !error && cars.length === 0 && (
        <p className="home-page__status">No cars in stock currently.</p>
      )}

      <div className="home-page__grid">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </main>
  );
}

export default HomePage;
