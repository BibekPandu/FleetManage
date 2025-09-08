import React from "react";
import "./PredictionResult.css";

const PredictionResult = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="prediction-result settings-section">
        <h3>Calculating Fuel Consumption...</h3>
        <div className="loading-animation">
          <div className="spinner"></div>
          <p>Running multiple regression algorithm...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="prediction-result settings-section">
      <h3>📊 Multiple Regression Fuel Prediction Results</h3>

      <div className="prediction-summary">
        <div className="summary-card primary">
          <h4>Total Fuel Needed</h4>
          <div className="fuel-amount">
            <span className="amount">{result.totalFuelNeeded}</span>
            <span className="unit">liters</span>
          </div>
          <p className="distance">for {result.distance} km trip</p>
        </div>

        <div className="summary-card">
          <h4>Fuel Efficiency</h4>
          <div className="efficiency">
            <span className="amount">{result.efficiency}</span>
            <span className="unit">km/l</span>
          </div>
          <p>Distance per liter</p>
        </div>

        <div className="summary-card">
          <h4>Total Cost</h4>
          <div className="cost">
            <span className="currency">NPR</span>
            <span className="amount">{result.totalCost}</span>
          </div>
          <p>@ NPR {result.fuelPrice}/liter</p>
        </div>
      </div>

      <div className="prediction-details">
        <h4>📈 Detailed Breakdown</h4>

        <div className="detail-grid">
          <div className="detail-item">
            <label>Fuel Consumption per 100km:</label>
            <span>{result.fuelConsumptionPer100km} liters</span>
          </div>

          <div className="detail-item">
            <label>Total Distance:</label>
            <span>{result.distance} km</span>
          </div>

          <div className="detail-item">
            <label>Fuel Price:</label>
            <span>NPR {result.fuelPrice}/liter</span>
          </div>

          <div className="detail-item">
            <label>Total Cost:</label>
            <span>NPR {result.totalCost}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionResult;
