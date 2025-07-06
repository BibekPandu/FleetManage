// EditScheduleDialog.js

import React, { useState, useEffect } from "react";
import "../common/Dialog.css";
import "../common/Form.css";
import "./EditScheduleDialog.css";

const EditScheduleDialog = ({ show, onClose, schedule, onEditSchedule }) => {
  const [formData, setFormData] = useState({
    date: "",
    vehicle: "",
    driver: "",
    task: "",
    status: "scheduled",
  });

  const [loading, setLoading] = useState(false);

  // Helper function to format ISO date string to YYYY-MM-DD
  const formatIsoDateToInputDate = (isoDateString) => {
    if (!isoDateString) return "";
    // Create a Date object from the ISO string
    const date = new Date(isoDateString);
    // Get year, month, and day
    const year = date.getFullYear();
    // Month is 0-indexed, so add 1 and pad with '0' if less than 10
    const month = String(date.getMonth() + 1).padStart(2, "0");
    // Day of the month, pad with '0' if less than 10
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (schedule) {
      setFormData({
        // Apply the formatting here
        date: formatIsoDateToInputDate(schedule.date), // <--- MODIFIED LINE
        vehicle: schedule.vehicle || "",
        driver: schedule.driver || "",
        task: schedule.task || "",
        status: schedule.status || "scheduled",
      });
    }
  }, [schedule]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // When sending the data back, ensure your backend can handle the format you send.
      // If your backend expects the ISO format, you might need to convert it back here
      // or ensure it can handle the YYYY-MM-DD format and convert it internally.
      // For now, we pass the formData directly, assuming your backend is flexible
      // or will be updated to handle YYYY-MM-DD for date inputs.
      await onEditSchedule(schedule.id, formData);
    } catch (error) {
      // Error is handled by parent
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Edit Schedule</h2>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date} // This will now be YYYY-MM-DD
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicle">Vehicle</label>
            <input
              id="vehicle"
              name="vehicle"
              type="text"
              value={formData.vehicle}
              onChange={handleChange}
              placeholder="e.g., Truck-001, Van-002"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="driver">Driver</label>
            <input
              id="driver"
              name="driver"
              type="text"
              value={formData.driver}
              onChange={handleChange}
              placeholder="e.g., John Doe, Jane Smith"
              required
            />
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
              {loading ? "Updating..." : "Update Schedule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScheduleDialog;
