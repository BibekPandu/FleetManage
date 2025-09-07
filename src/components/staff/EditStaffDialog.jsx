import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import "../../styles/Dialog.css";
import "../../styles/Form.css";

const EditStaffDialog = ({ show, onClose, staff, onEditStaff }) => {
  const [formData, setFormData] = useState({
    username: "",
    role: "driver",
    status: "active",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        username: staff.username || "",
        role: staff.role || "driver",
        status: staff.status || "active",
      });
    }
  }, [staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditStaff(formData);
    onClose();
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <form onSubmit={handleSubmit} className="settings-section">
        <h2>Edit Staff</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="driver">Driver</option>
            <option value="mechanic">Mechanic</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="form-button">Save Changes</button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditStaffDialog;
