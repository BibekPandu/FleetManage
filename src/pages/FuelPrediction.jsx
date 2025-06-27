import React, { useState } from 'react';
import './FuelPrediction.css';
import PredictionForm from '../components/fuelPrediction/PredictionForm';
import PredictionResult from '../components/fuelPrediction/PredictionResult';

const FuelPrediction = () => {
  const [predictionResult, setPredictionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePredict = async (formData) => {
    setLoading(true);
    setError(null);
    setPredictionResult(null);

    try {
      // In a real app, this URL would be configurable
      const response = await fetch('http://localhost:4000/fuelPredictionStarterPrompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Something went wrong with the prediction service.');
      }

      const result = await response.json();

      // For this demo, we'll just display the generated prompt.
      // A more advanced implementation might use this prompt to call *another* model.
      setPredictionResult({
        prompt: result.prompt,
        inputs: formData,
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fuel-prediction-page">
      <div className="page-header">
        <h1>Fuel Prediction</h1>
      </div>
      <div className="fuel-prediction-container">
        <PredictionForm onPredict={handlePredict} loading={loading} />
        {error && <div className="error-message">{error}</div>}
        <PredictionResult result={predictionResult} loading={loading} />
      </div>
    </div>
  );
};

export default FuelPrediction;
