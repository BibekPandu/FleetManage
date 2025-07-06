import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import "../common/Dialog.css";
import "../common/Form.css";
import "./EditLogEntryDialog.css";

const EditLogEntryDialog = ({ show, onClose, entry, onEditEntry }) => {
  const [formData, setFormData] = useState({
    date: "",
    vehicle: "",
    driver: "",
    description: "",
  });

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date || "",
        vehicle: entry.vehicle || "",
        driver: entry.driver || "",
        description: entry.description || "",
      });
    }
  }, [entry]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditEntry(formData);
    onClose();
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <h2>Edit Log Entry</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Vehicle</label>
          <input
            type="text"
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Driver</label>
          <input
            type="text"
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </Dialog>
  );
};

export default EditLogEntryDialog;
