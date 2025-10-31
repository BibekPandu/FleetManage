import React, { useState } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./AddLogEntryDialog.css";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";

const AddLogEntryDialog = ({ show, onClose, onAddEntry }) => {
  const [formData, setFormData] = useState({
    date: "",
    vehicle: "",
    driver: "",
    description: "",
  });
  const { vehicles } = useVehicles();
  const { staff } = useStaff();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onAddEntry(formData);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Log Entry</h2>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="vehicle">Vehicle</label>
            <select
              id="vehicle"
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select vehicle
              </option>
              {vehicles.map((v) => {
                const label = v.license_plate || v.vehicle_number || `${v.make || ""} ${v.model || ""}`.trim();
                const value = label;
                return (
                  <option key={v.id} value={value}>
                    {label}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="driver">Driver</label>
            <select
              id="driver"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select driver
              </option>
              {staff
                .filter((s) => s.role === "driver" || s.role === "manager")
                .map((s) => (
                  <option key={s.id} value={s.username}>
                    {s.username} ({s.role})
                  </option>
                ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Distance (km)</label>
            <input
              id="description"
              name="description"
              type="number"
              min="0"
              step="0.1"
              placeholder="e.g. 12.5"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="form-button">
              Add Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLogEntryDialog;
