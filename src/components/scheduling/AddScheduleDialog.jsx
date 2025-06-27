import React, { useState } from 'react';
import '../common/Dialog.css';
import '../common/Form.css';
import './AddScheduleDialog.css';

const AddScheduleDialog = ({ show, onClose, onAddSchedule }) => {
  const [formData, setFormData] = useState({
    date: '',
    vehicle: '',
    driver: '',
    task: '',
    status: 'Scheduled',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddSchedule(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Schedule</h2>
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
            <label htmlFor="task">Task</label>
            <input id="task" name="task" type="text" value={formData.task} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Scheduled">Scheduled</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-button">Add Schedule</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleDialog;
