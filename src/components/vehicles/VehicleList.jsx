import React from 'react';
import '../common/Table.css';
import './VehicleList.css';

const VehicleList = ({ vehicles, onEdit, onDelete, canModify }) => {
  const getStatusBadge = (status) => {
    const statusClasses = {
      active: 'status-active',
      maintenance: 'status-maintenance',
      inactive: 'status-inactive'
    };
    
    return (
      <span className={`status-badge ${statusClasses[status] || 'status-inactive'}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getFuelTypeLabel = (fuelType) => {
    const fuelLabels = {
      petrol: 'Petrol',
      diesel: 'Diesel',
      electric: 'Electric',
      hybrid: 'Hybrid'
    };
    
    return fuelLabels[fuelType] || fuelType;
  };

  if (vehicles.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>No vehicles found. Add your first vehicle to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Vehicle #</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>License Plate</th>
            <th>Fuel Type</th>
            <th>Status</th>
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.vehicle_number}</td>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.license_plate}</td>
              <td>{getFuelTypeLabel(vehicle.fuel_type)}</td>
              <td>{getStatusBadge(vehicle.status)}</td>
              {canModify && (
                <td className="actions">
                  <button className="btn-edit" onClick={() => onEdit(vehicle)}>
                    Edit
                  </button>
                  <button className="btn-delete" onClick={() => onDelete(vehicle)}>
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleList;
