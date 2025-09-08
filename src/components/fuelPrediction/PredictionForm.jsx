import React, { useState } from "react";
import "../../styles/Form.css";
import "./PredictionForm.css";

const PredictionForm = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState({
    vehicleType: "van",
    engineType: "diesel",
    averageLoad: 500,
    averageSpeed: 60,
    distance: 150,
    vehicleAge: 3,
    weather: "sunny",
    terrain: "flat",
    fuelPriceNPR: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? parseFloat(value) : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onPredict(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form settings-section">
      <h2 className="form-title">Multiple Regression Fuel Prediction</h2>
      <p className="form-description">
        Enter vehicle and trip parameters to predict fuel consumption using our
        advanced multiple regression algorithm.
      </p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="vehicleType">Vehicle Type</label>
          <select
            id="vehicleType"
            name="vehicleType"
            value={formData.vehicleType}
            onChange={handleChange}
          >
            <option value="van">Van</option>
            <option value="truck">Truck</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            <option value="bus">Bus</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="engineType">Engine Type</label>
          <select
            id="engineType"
            name="engineType"
            value={formData.engineType}
            onChange={handleChange}
          >
            <option value="diesel">Diesel</option>
            <option value="gasoline">Gasoline</option>
            <option value="electric">Electric</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="averageLoad">Average Load (kg)</label>
          <input
            id="averageLoad"
            name="averageLoad"
            type="number"
            min="0"
            max="5000"
            value={formData.averageLoad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="averageSpeed">Average Speed (km/h)</label>
          <input
            id="averageSpeed"
            name="averageSpeed"
            type="number"
            min="10"
            max="120"
            value={formData.averageSpeed}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="distance">Distance (km)</label>
          <input
            id="distance"
            name="distance"
            type="number"
            min="1"
            max="1000"
            value={formData.distance}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="vehicleAge">Vehicle Age (years)</label>
          <input
            id="vehicleAge"
            name="vehicleAge"
            type="number"
            min="0"
            max="20"
            value={formData.vehicleAge}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="weather">Weather Conditions</label>
          <select
            id="weather"
            name="weather"
            value={formData.weather}
            onChange={handleChange}
          >
            <option value="sunny">Sunny</option>
            <option value="rainy">Rainy</option>
            <option value="snowy">Snowy</option>
            <option value="windy">Windy</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="terrain">Terrain Type</label>
          <select
            id="terrain"
            name="terrain"
            value={formData.terrain}
            onChange={handleChange}
          >
            <option value="flat">Flat</option>
            <option value="hilly">Hilly</option>
            <option value="mountainous">Mountainous</option>
            <option value="urban">Urban</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="fuelPriceNPR">Fuel Price (NPR/liter) - optional</label>
          <input
            id="fuelPriceNPR"
            name="fuelPriceNPR"
            type="number"
            min="0"
            step="0.01"
            placeholder="Leave blank to use default Nepal price"
            value={formData.fuelPriceNPR}
            onChange={handleChange}
          />
        </div>
      </div>

      <button type="submit" className="form-button" disabled={loading}>
        {loading ? "Calculating..." : "Predict Fuel Consumption"}
      </button>
    </form>
  );
};

export default PredictionForm;
