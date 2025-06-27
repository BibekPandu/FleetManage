import React, { useState } from 'react';
import '../common/Form.css';
import './PredictionForm.css';

const PredictionForm = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState({
    vehicleType: 'van',
    engineType: 'diesel',
    averageLoad: 500,
    averageSpeed: 60,
    distance: 150,
    vehicleAge: 3,
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form settings-section">
      <h2 className="form-title">Prediction Parameters</h2>
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Type</label>
          <select id="vehicleType" name="vehicleType" value={formData.vehicleType} onChange={handleChange}>
            <option value="van">Van</option>
            <option value="truck">Truck</option>
            <option value="sedan">Sedan</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="engineType">Engine Type</label>
          <select id="engineType" name="engineType" value={formData.engineType} onChange={handleChange}>
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
            <option value="electric">Electric</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="averageLoad">Average Load (kg)</label>
          <input id="averageLoad" name="averageLoad" type="number" value={formData.averageLoad} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="averageSpeed">Average Speed (km/h)</label>
          <input id="averageSpeed" name="averageSpeed" type="number" value={formData.averageSpeed} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="distance">Distance (km)</label>
          <input id="distance" name="distance" type="number" value={formData.distance} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="vehicleAge">Vehicle Age (years)</label>
          <input id="vehicleAge" name="vehicleAge" type="number" value={formData.vehicleAge} onChange={handleChange} required />
        </div>
      </div>
      <button type="submit" className="form-button" disabled={loading}>
        {loading ? 'Predicting...' : 'Predict Fuel Needed'}
      </button>
    </form>
  );
};

export default PredictionForm;
