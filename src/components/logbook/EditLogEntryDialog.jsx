import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./EditLogEntryDialog.css";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";

const EditLogEntryDialog = ({ show, onClose, entry, onEditEntry }) => {
  const [formData, setFormData] = useState({
    date: "",
    vehicle: "",
    driver: "",
    description: "",
  });
  const { vehicles } = useVehicles();
  const { staff } = useStaff();

  useEffect(() => {
    if (entry) {
      setFormData({
        date: entry.date
          ? (typeof entry.date === "string"
              ? (entry.date.includes("T") ? entry.date.split("T")[0] : entry.date)
              : new Date(entry.date).toISOString().slice(0, 10))
          : "",
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
      <form onSubmit={handleSubmit} className="settings-section">
        <h2>Edit Log Entry</h2>
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
          <select
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
          <label>Driver</label>
          <select
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
          <label>Distance (km)</label>
          <input
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
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="form-button">Save Changes</button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditLogEntryDialog;
