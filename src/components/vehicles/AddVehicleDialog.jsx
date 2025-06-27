import React, { useState } from 'react';
import '../common/Dialog.css';
import '../common/Form.css';
import './AddVehicleDialog.css';

const AddVehicleDialog = ({ show, onClose, onAddVehicle }) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddVehicle(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Vehicle</h2>
          <div className="form-group">
            <label htmlFor="make">Make</label>
            <input id="make" name="make" type="text" value={formData.make} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input id="model" name="model" type="text" value={formData.model} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input id="year" name="year" type="number" value={formData.year} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Out of Service">Out of Service</option>
            </select>
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-button">Add Vehicle</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleDialog;
