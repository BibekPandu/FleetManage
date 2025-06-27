import React, { useState, useEffect } from 'react';
import Dialog from '../common/Dialog';
import './EditStaffDialog.css';

const EditStaffDialog = ({ show, onClose, staff, onEditStaff }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('Active');

  useEffect(() => {
    if (staff) {
      setName(staff.name);
      setRole(staff.role);
      setStatus(staff.status);
    }
  }, [staff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditStaff({ ...staff, name, role, status });
    onClose();
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <h2>Edit Staff</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <input type="text" value={role} onChange={(e) => setRole(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Terminated">Terminated</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </Dialog>
  );
};

export default EditStaffDialog;
