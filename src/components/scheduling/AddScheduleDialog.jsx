import React, { useState } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./AddScheduleDialog.css";
import { useSchedules } from "../../context/SchedulesContext";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";

const AddScheduleDialog = ({ show, onClose, onAddSchedule }) => {
  const [formData, setFormData] = useState({
    date: "",
    vehicle: "",
    driver: "",
    task: "",
    status: "scheduled",
  });

  const [loading, setLoading] = useState(false);
  const { vehicles } = useVehicles();
  const { staff } = useStaff();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // const token = localStorage.getItem("fleetfox_token"); // 🔑 Add this line

    try {
      await onAddSchedule(formData);

      // Reset form
      setFormData({
        date: "",
        vehicle: "",
        driver: "",
        task: "",
        status: "scheduled",
      });
    } catch (error) {
      console.error("Error adding schedule:", error);
      alert("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Schedule</h2>

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
            <label htmlFor="task">Task</label>
            <input
              id="task"
              name="task"
              type="text"
              value={formData.task}
              onChange={handleChange}
              placeholder="e.g., Delivery route, Maintenance, Pickup"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="form-button" disabled={loading}>
              {loading ? "Adding..." : "Add Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleDialog;
