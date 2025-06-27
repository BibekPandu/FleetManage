import React, { createContext, useState, useContext } from 'react';

const FuelPredictionContext = createContext();

export const FuelPredictionProvider = ({ children }) => {
  const [predictions, setPredictions] = useState([]);
  const value = { predictions, setPredictions };

  return (
    <FuelPredictionContext.Provider value={value}>
      {children}
    </FuelPredictionContext.Provider>
  );
};

export const useFuelPrediction = () => useContext(FuelPredictionContext);

