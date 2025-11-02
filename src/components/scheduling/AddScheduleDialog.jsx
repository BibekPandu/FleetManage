import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./AddScheduleDialog.css";
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

  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const { vehicles } = useVehicles();
  const { staff } = useStaff();

  // Format vehicle label consistently
  const formatVehicleLabel = (vehicle) => {
    if (!vehicle) return "";
    return (
      vehicle.license_plate ||
      vehicle.vehicle_number ||
      `${vehicle.make || ""} ${vehicle.model || ""}`
    ).trim();
  };

  // Get available drivers (filtered by role)
  const availableDrivers = useMemo(
    () => staff.filter((s) => s.role === "driver" || s.role === "manager"),
    [staff]
  );

  // Handle vehicle selection
  const selectVehicle = (vehicle) => {
    if (!vehicle) return;

    const vehicleLabel = formatVehicleLabel(vehicle);

    // Find the driver assigned to this vehicle
    let driver = "";
    if (vehicle.driver) {
      if (typeof vehicle.driver === "string") {
        driver = vehicle.driver;
      } else if (vehicle.driver.username) {
        driver = vehicle.driver.username;
      } else if (vehicle.driver) {
        const driverObj = staff.find((s) => s.id === vehicle.driver);
        driver = driverObj ? driverObj.username : "";
      }
    }

    setFormData((prev) => ({
      ...prev,
      vehicle: vehicleLabel,
      driver: driver,
      ...(driver ? {} : { driver: "" }),
    }));

    setOpenDropdown(null);
  };

  // Handle driver selection
  const selectDriver = (username) => {
    if (!username) return;

    // Find the vehicle assigned to this driver
    const driverVehicle = vehicles.find(
      (v) =>
        v.driver &&
        ((typeof v.driver === "string" && v.driver === username) ||
          v.driver.username === username ||
          v.driver === username)
    );

    setFormData((prev) => ({
      ...prev,
      driver: username,
      vehicle: driverVehicle ? formatVehicleLabel(driverVehicle) : prev.vehicle,
    }));

    setOpenDropdown(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onAddSchedule(formData);
      setFormData({
        date: "",
        vehicle: "",
        driver: "",
        task: "",
        status: "scheduled",
      });
      onClose();
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
            <label>Vehicle</label>
            <div className="custom-select" onBlur={() => setOpenDropdown(null)}>
              <button
                type="button"
                className="custom-select-toggle"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === "vehicle"}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDropdown(
                    openDropdown === "vehicle" ? null : "vehicle"
                  );
                }}
              >
                {formData.vehicle || "Select vehicle"}
                <span className="caret" />
              </button>
              {openDropdown === "vehicle" && (
                <div
                  className="custom-select-menu"
                  role="listbox"
                  style={{ maxHeight: "180px", overflowY: "auto" }}
                >
                  {vehicles.length > 0 ? (
                    vehicles.map((v) => (
                      <div
                        key={v.id}
                        role="option"
                        className={`custom-select-option${
                          formData.vehicle === formatVehicleLabel(v)
                            ? " selected"
                            : ""
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectVehicle(v)}
                      >
                        {formatVehicleLabel(v)}
                        {v.driver ? ` — ${v.driver}` : ""}
                      </div>
                    ))
                  ) : (
                    <div className="no-options">No vehicles available</div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Driver</label>
            <div className="custom-select" onBlur={() => setOpenDropdown(null)}>
              <button
                type="button"
                className="custom-select-toggle"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === "driver"}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDropdown(openDropdown === "driver" ? null : "driver");
                }}
              >
                {formData.driver || "Select driver"}
                <span className="caret" />
              </button>
              {openDropdown === "driver" && (
                <div
                  className="custom-select-menu"
                  role="listbox"
                  style={{ maxHeight: "180px", overflowY: "auto" }}
                >
                  {availableDrivers.length > 0 ? (
                    availableDrivers.map((s) => (
                      <div
                        key={s.id}
                        role="option"
                        className={`custom-select-option${
                          formData.driver === s.username ? " selected" : ""
                        }`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectDriver(s.username)}
                      >
                        {s.username} ({s.role})
                      </div>
                    ))
                  ) : (
                    <div className="no-options">No drivers available</div>
                  )}
                </div>
              )}
            </div>
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
