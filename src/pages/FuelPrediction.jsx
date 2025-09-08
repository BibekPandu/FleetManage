import React, { useState } from "react";
import PredictionForm from "../components/fuelPrediction/PredictionForm";
import PredictionResult from "../components/fuelPrediction/PredictionResult";

const FuelPrediction = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      const token = localStorage.getItem("fleetfox_token");

      const response = await fetch(
        `${process.env.REACT_APP_API_BASE_URL || ''}/fuel-prediction/predict`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to predict fuel consumption"
        );
      }

      const result = await response.json();
      setPredictionResult(result.prediction);
    } catch (err) {
      console.error("Fuel prediction error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fuel-prediction-page">
      <div className="page-header">
        <h1>Fuel Prediction</h1>
        {/* <p className="page-description">
          Predict fuel consumption using multiple regression algorithm based on
          vehicle characteristics, load, speed, distance, weather, and terrain
          conditions.
        </p> */}
      </div>
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <PredictionForm onPredict={handlePredict} loading={loading} />
        {error && <div className="error-message">{error}</div>}
        <PredictionResult result={predictionResult} loading={loading} />
      </div>
    </div>
  );
};

export default FuelPrediction;
