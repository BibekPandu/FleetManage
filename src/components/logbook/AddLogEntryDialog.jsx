import React, { useState } from 'react';
import '../common/Dialog.css';
import '../common/Form.css';
import './AddLogEntryDialog.css';

const AddLogEntryDialog = ({ show, onClose, onAddEntry }) => {
  const [formData, setFormData] = useState({
    date: '',
    vehicle: '',
    driver: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEntry(formData);
    onClose(); // Close dialog after submission
  };
  
  if (!show) {
    return null;
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Log Entry</h2>
           <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="vehicle">Vehicle</label>
            <input id="vehicle" name="vehicle" type="text" value={formData.vehicle} onChange={handleChange} placeholder="e.g., Ford Transit" required />
          </div>
          <div className="form-group">
            <label htmlFor="driver">Driver</label>
            <input id="driver" name="driver" type="text" value={formData.driver} onChange={handleChange} placeholder="e.g., John Doe" required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-button">Add Entry</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLogEntryDialog;

