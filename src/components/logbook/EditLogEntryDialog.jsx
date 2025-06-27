import React, { useState, useEffect } from 'react';
import '../common/Dialog.css';
import '../common/Form.css';
import './EditLogEntryDialog.css';

const EditLogEntryDialog = ({ show, onClose, entry, onEditEntry }) => {
  const [formData, setFormData] = useState({
    date: '',
    vehicle: '',
    driver: '',
    description: '',
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date,
        vehicle: entry.vehicle,
        driver: entry.driver,
        description: entry.description,
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditEntry({ ...entry, ...formData });
    onClose();
  };
  
  if (!show) {
    return null;
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Edit Log Entry</h2>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="vehicle">Vehicle</label>
            <input id="vehicle" name="vehicle" type="text" value={formData.vehicle} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="driver">Driver</label>
            <input id="driver" name="driver" type="text" value={formData.driver} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-button">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLogEntryDialog;
