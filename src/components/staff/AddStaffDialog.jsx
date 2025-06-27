import React, { useState } from 'react';
import '../common/Dialog.css';
import '../common/Form.css';
import './AddStaffDialog.css';

const AddStaffDialog = ({ show, onClose, onAddStaff }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    status: 'Active',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddStaff(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={e => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Staff</h2>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <input id="role" name="role" type="text" value={formData.role} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" value={formData.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Terminated">Terminated</option>
            </select>
          </div>
          <div className="dialog-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="form-button">Add Staff</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaffDialog;
