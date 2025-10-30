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
    if (type === "number") {
      // Allow empty string while typing to avoid NaN warnings
      const nextValue = value === "" ? "" : Number(value);
      setFormData({ ...formData, [name]: nextValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Build payload with safe numeric parsing and omit optional price if empty
    const toNumber = (val) => (val === "" || val === null || typeof val === "undefined" ? undefined : Number(val));
    const payload = {
      vehicleType: formData.vehicleType,
      engineType: formData.engineType,
      averageLoad: Number(formData.averageLoad),
      averageSpeed: Number(formData.averageSpeed),
      distance: Number(formData.distance),
      vehicleAge: Number(formData.vehicleAge),
      weather: formData.weather,
      terrain: formData.terrain,
    };
    const price = toNumber(formData.fuelPriceNPR);
    if (typeof price === "number" && !Number.isNaN(price)) {
      payload.fuelPriceNPR = price;
    }
    onPredict(payload);
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
            value={formData.averageLoad === "" ? "" : formData.averageLoad}
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
            value={formData.averageSpeed === "" ? "" : formData.averageSpeed}
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
            value={formData.distance === "" ? "" : formData.distance}
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
            value={formData.vehicleAge === "" ? "" : formData.vehicleAge}
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
