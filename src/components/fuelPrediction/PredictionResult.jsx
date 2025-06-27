import React from 'react';
import './PredictionResult.css';

const PredictionResult = ({ result, loading }) => {
  if (loading) {
    return (
      <div className="prediction-result settings-section">
        <h3>Generating Prediction...</h3>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
        <div className="skeleton-line"></div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="prediction-result settings-section">
      <h3>AI-Generated Prediction Prompt</h3>
      <p>Based on your inputs, the AI has generated the following prompt, which could be used to train a predictive model:</p>
      <pre className="prompt-code-block">
        <code>{result.prompt}</code>
      </pre>
    </div>
  );
};

export default PredictionResult;

