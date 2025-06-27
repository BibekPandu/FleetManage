import React, { createContext, useState, useContext } from 'react';

const VehiclesContext = createContext();

export const VehiclesProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([
    { id: 1, make: 'Ford', model: 'Transit', year: 2021, vin: '12345XYZ' },
    { id: 2, make: 'Mercedes-Benz', model: 'Sprinter', year: 2022, vin: '67890ABC' },
  ]);

  const addVehicle = (newVehicle) => {
    setVehicles([...vehicles, { ...newVehicle, id: vehicles.length + 1 }]);
  };

  const editVehicle = (updatedVehicle) => {
    setVehicles(
      vehicles.map((vehicle) =>
        vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
      )
    );
  };

  const deleteVehicle = (vehicleId) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== vehicleId));
  };

  const value = { vehicles, addVehicle, editVehicle, deleteVehicle };

  return (
    <VehiclesContext.Provider value={value}>
      {children}
    </VehiclesContext.Provider>
  );
};

export const useVehicles = () => useContext(VehiclesContext);
