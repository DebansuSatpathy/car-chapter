import React from 'react';
import Button from '../common/Button';
import './UploadFormCard.css';

function UploadFormCard() {
  return (
    <div className="upload-form-card">
      <div className="upload-form-card__header">
        <div className="dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <h3 className="upload-form-card__title">Upload Your Car</h3>
      </div>

      <form className="upload-form-card__form">
        <div className="form-row">
          <input type="text" placeholder="Car Make" />
          <input type="text" placeholder="Model" />
        </div>
        <div className="form-row">
          <input type="number" placeholder="Year" />
          <input type="number" placeholder="Mileage" />
        </div>
        <div className="form-row">
          <input type="number" placeholder="Price ($)" />
          <input type="text" placeholder="Location" />
        </div>

        <div className="upload-area">
          <div className="upload-area__icon">📁</div>
          <p className="upload-area__text">Click to upload car images</p>
          <p className="upload-area__help">Up to 10 images, max 5MB each</p>
        </div>

        <Button variant="primary" fullWidth>
          Submit for Review
        </Button>
      </form>
    </div>
  );
}

export default UploadFormCard;
