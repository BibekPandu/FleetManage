import React, { useMemo, useState } from "react";
import "../../styles/Form.css";
import "./PredictionForm.css";

const PredictionFormKpl = ({ onPredict, loading }) => {
  const [formData, setFormData] = useState({
    cylinders: 4,
    horsepower: 90,
    displacement_in_cc: 1600,
    weight_in_kg: 1200,
    acceleration: 15,
    model_year: 75,
    origin: 1,
    distance: 100,
    fuelPriceNPR: "",
  });

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "number") {
      const nextValue = value === "" ? "" : Number(value);
      setFormData({ ...formData, [name]: nextValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const clampNumber = (name, value) => {
    const ranges = {
      cylinders: { min: 3, max: 12 },
      horsepower: { min: 1, max: 500 },
      displacement_in_cc: { min: 100, max: 10000 },
      weight_in_kg: { min: 300, max: 5000 },
      acceleration: { min: 1, max: 40 },
      model_year: { min: 60, max: 100 },
      distance: { min: 1, max: 1000 },
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
      { key: "cylinders", min: 3, max: 12 },
      { key: "horsepower", min: 1, max: 500 },
      { key: "displacement_in_cc", min: 100, max: 10000 },
      { key: "weight_in_kg", min: 300, max: 5000 },
      { key: "acceleration", min: 1, max: 40 },
      { key: "model_year", min: 60, max: 100 },
      { key: "distance", min: 1, max: 1000 },
    ];
    reqNums.forEach(({ key, min, max }) => {
      const v = formData[key];
      if (v === "" || Number.isNaN(Number(v))) {
        errs[key] = "Required";
      } else if (Number(v) < min || Number(v) > max) {
        errs[key] = `Must be ${min}-${max}`;
      }
    });
    if (![1, 2, 3].includes(Number(formData.origin))) {
      errs.origin = "Must be 1, 2, or 3";
    }
    return errs;
  }, [formData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const toNumber = (val) => (val === "" || val === null || typeof val === "undefined" ? undefined : Number(val));
    const payload = {
      cylinders: Number(formData.cylinders),
      horsepower: Number(formData.horsepower),
      displacement_in_cc: Number(formData.displacement_in_cc),
      weight_in_kg: Number(formData.weight_in_kg),
      acceleration: Number(formData.acceleration),
      model_year: Number(formData.model_year),
      origin: Number(formData.origin),
      distance: Number(formData.distance),
    };
    const price = toNumber(formData.fuelPriceNPR);
    if (typeof price === "number" && !Number.isNaN(price)) {
      payload.fuelPriceNPR = price;
    }
    onPredict(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="prediction-form settings-section">
      <h2 className="form-title">Car Specs Regression (km/l)</h2>
      <p className="form-description">Predict mileage using multiple linear regression on car specifications.</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="cylinders">Cylinders</label>
          <input id="cylinders" name="cylinders" type="number" min="3" max="12" value={formData.cylinders === "" ? "" : formData.cylinders} onChange={handleChange} onBlur={handleBlur} required />
          {errors.cylinders && <div className="form-hint">{errors.cylinders}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="horsepower">Horsepower</label>
          <input id="horsepower" name="horsepower" type="number" min="1" value={formData.horsepower === "" ? "" : formData.horsepower} onChange={handleChange} onBlur={handleBlur} required />
          {errors.horsepower && <div className="form-hint">{errors.horsepower}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="displacement_in_cc">Displacement (cc)</label>
          <input id="displacement_in_cc" name="displacement_in_cc" type="number" min="100" value={formData.displacement_in_cc === "" ? "" : formData.displacement_in_cc} onChange={handleChange} onBlur={handleBlur} required />
          {errors.displacement_in_cc && <div className="form-hint">{errors.displacement_in_cc}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="weight_in_kg">Weight (kg)</label>
          <input id="weight_in_kg" name="weight_in_kg" type="number" min="300" value={formData.weight_in_kg === "" ? "" : formData.weight_in_kg} onChange={handleChange} onBlur={handleBlur} required />
          {errors.weight_in_kg && <div className="form-hint">{errors.weight_in_kg}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="acceleration">Acceleration</label>
          <input id="acceleration" name="acceleration" type="number" min="1" value={formData.acceleration === "" ? "" : formData.acceleration} onChange={handleChange} onBlur={handleBlur} required />
          {errors.acceleration && <div className="form-hint">{errors.acceleration}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="model_year">Model Year</label>
          <input id="model_year" name="model_year" type="number" min="60" max="100" value={formData.model_year === "" ? "" : formData.model_year} onChange={handleChange} onBlur={handleBlur} required />
          {errors.model_year && <div className="form-hint">{errors.model_year}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="origin">Origin (1=USA,2=Europe,3=Japan)</label>
          <select id="origin" name="origin" value={formData.origin} onChange={handleChange}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
          </select>
          {errors.origin && <div className="form-hint">{errors.origin}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="distance">Distance (km)</label>
          <input id="distance" name="distance" type="number" min="1" max="1000" value={formData.distance === "" ? "" : formData.distance} onChange={handleChange} onBlur={handleBlur} required />
          {errors.distance && <div className="form-hint">{errors.distance}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="fuelPriceNPR">Fuel Price (NPR/liter) - optional</label>
          <input id="fuelPriceNPR" name="fuelPriceNPR" type="number" min="0" step="0.01" placeholder="Leave blank to use default Nepal price" value={formData.fuelPriceNPR} onChange={handleChange} onBlur={handleBlur} />
          <div className="form-hint">Leave blank to use default price</div>
        </div>
      </div>

      <button type="submit" className="form-button" disabled={loading || Object.keys(errors).length > 0}>
        {loading ? "Calculating..." : "Predict Mileage (Regression)"}
      </button>
    </form>
  );
};

export default PredictionFormKpl;
