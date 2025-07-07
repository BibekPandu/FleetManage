import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";

const EditStaffDialog = ({ show, onClose, staff, onEditStaff }) => {
  const [formData, setFormData] = useState({
    name: "",
    role: "driver",
    status: "active",
  });

  useEffect(() => {
    if (staff) {
      setFormData({
        name: staff.name || "",
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
      <h2>Edit Staff</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </Dialog>
  );
};

export default EditStaffDialog;
