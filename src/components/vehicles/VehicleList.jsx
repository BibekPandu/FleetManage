import React from 'react';
import '../common/Table.css';

const VehicleList = ({ vehicles, onEdit, onDelete, canModify }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Make</th>
            <th>Model</th>
            <th>Year</th>
            <th>VIN</th>
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.id}</td>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>{vehicle.vin}</td>
              {canModify && (
                <td>
                  <button className="btn-edit" onClick={() => onEdit(vehicle)}>Edit</button>
                  <button className="btn-delete" onClick={() => onDelete(vehicle)}>Delete</button>
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
