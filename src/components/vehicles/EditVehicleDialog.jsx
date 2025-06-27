import React, { useState, useEffect } from 'react';
import Dialog from '../common/Dialog';
import './EditVehicleDialog.css';

const EditVehicleDialog = ({ show, onClose, vehicle, onEditVehicle }) => {
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (vehicle) {
      setMake(vehicle.make);
      setModel(vehicle.model);
      setYear(vehicle.year);
      setStatus(vehicle.status);
    }
  }, [vehicle]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditVehicle({ ...vehicle, make, model, year, status });
    onClose();
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <h2>Edit Vehicle</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Make</label>
          <input type="text" value={make} onChange={(e) => setMake(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Model</label>
          <input type="text" value={model} onChange={(e) => setModel(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Year</label>
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </Dialog>
  );
};

export default EditVehicleDialog;
