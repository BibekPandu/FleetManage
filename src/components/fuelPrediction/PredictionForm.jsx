import React, { useMemo, useState } from "react";
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

  const clampNumber = (name, value) => {
    const ranges = {
      averageLoad: { min: 0, max: 5000 },
      averageSpeed: { min: 10, max: 120 },
      distance: { min: 1, max: 1000 },
      vehicleAge: { min: 0, max: 20 },
      fuelPriceNPR: { min: 0, max: 1000 },
    };
    const range = ranges[name];
    if (!range) return value;
    const num = Number(value);
    if (Number.isNaN(num)) return range.min;
    return Math.min(range.max, Math.max(range.min, num));
  };

  const handleBlur = (e) => {
    const { name, value, type } = e.target;
    if (type !== "number") return;
    const clamped = clampNumber(name, value === "" ? 0 : value);
    setFormData({ ...formData, [name]: clamped });
  };

  const errors = useMemo(() => {
    const errs = {};
    const reqNums = [
      { key: "averageLoad", min: 0, max: 5000 },
      { key: "averageSpeed", min: 10, max: 120 },
      { key: "distance", min: 1, max: 1000 },
      { key: "vehicleAge", min: 0, max: 20 },
    ];
    reqNums.forEach(({ key, min, max }) => {
      const v = formData[key];
      if (v === "" || Number.isNaN(Number(v))) {
        errs[key] = "Required";
      } else if (Number(v) < min || Number(v) > max) {
        errs[key] = `Must be ${min}-${max}`;
      }
    });
    return errs;
  }, [formData]);

  const applyPreset = (preset) => {
    setFormData(preset);
  };

  const randomize = () => {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const next = {
      vehicleType: pick(["van", "truck", "sedan", "suv", "bus"]),
      engineType: pick(["diesel", "gasoline", "electric", "hybrid"]),
      averageLoad: rand(0, 5000),
      averageSpeed: rand(10, 120),
      distance: rand(10, 500),
      vehicleAge: rand(0, 15),
      weather: pick(["sunny", "rainy", "snowy", "windy"]),
      terrain: pick(["flat", "hilly", "mountainous", "urban"]),
      fuelPriceNPR: "",
    };
    setFormData(next);
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

      <div className="prediction-toolbar">
        <button type="button" className="form-button" onClick={() => applyPreset({
          vehicleType: "van", engineType: "diesel", averageLoad: 200, averageSpeed: 60, distance: 120, vehicleAge: 2, weather: "sunny", terrain: "flat", fuelPriceNPR: ""
        })}>Preset: Efficient</button>
        <button type="button" className="form-button" onClick={() => applyPreset({
          vehicleType: "truck", engineType: "diesel", averageLoad: 1800, averageSpeed: 70, distance: 220, vehicleAge: 6, weather: "rainy", terrain: "hilly", fuelPriceNPR: ""
        })}>Preset: Heavy Duty</button>
        <button type="button" className="form-button" onClick={() => applyPreset({
          vehicleType: "sedan", engineType: "gasoline", averageLoad: 300, averageSpeed: 50, distance: 40, vehicleAge: 4, weather: "sunny", terrain: "urban", fuelPriceNPR: ""
        })}>Preset: Urban Sedan</button>
        <button type="button" className="form-button" onClick={() => applyPreset({
          vehicleType: "bus", engineType: "diesel", averageLoad: 2500, averageSpeed: 75, distance: 180, vehicleAge: 8, weather: "windy", terrain: "mountainous", fuelPriceNPR: ""
        })}>Preset: Mountain Bus</button>
        <button type="button" className="form-button" onClick={() => applyPreset({
          vehicleType: "suv", engineType: "electric", averageLoad: 400, averageSpeed: 65, distance: 160, vehicleAge: 1, weather: "sunny", terrain: "urban", fuelPriceNPR: 0
        })}>Preset: EV Showcase</button>
        <button type="button" className="form-button" onClick={randomize}>Randomize</button>
      </div>

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
            onBlur={handleBlur}
          />
          {errors.averageLoad && <div className="form-hint">{errors.averageLoad}</div>}
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
            onBlur={handleBlur}
          />
          {errors.averageSpeed && <div className="form-hint">{errors.averageSpeed}</div>}
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
            onBlur={handleBlur}
          />
          {errors.distance && <div className="form-hint">{errors.distance}</div>}
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
            onBlur={handleBlur}
          />
          {errors.vehicleAge && <div className="form-hint">{errors.vehicleAge}</div>}
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
            onBlur={handleBlur}
          />
          <div className="form-hint">Leave blank to use default price</div>
        </div>
      </div>

      <button type="submit" className="form-button" disabled={loading || Object.keys(errors).length > 0}>
        {loading ? "Calculating..." : "Predict Fuel Consumption"}
      </button>
    </form>
  );
};

export default PredictionForm;
