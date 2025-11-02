import React, { useState, useEffect, useMemo } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./EditExpenseDialog.css";
import "../scheduling/EditScheduleDialog.css";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";

function toInputDateString(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toISOString().slice(0, 10);
}

function cleanVehicleId(val) {
  if (val === "" || val === undefined || val === null) return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
}

const EditExpenseDialog = ({ show, onClose, expense, onEditExpense }) => {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
    vehicle_id: "",
    driver: "",
  });
  const [openDropdown, setOpenDropdown] = useState(null);
  const [loading, setLoading] = useState(false);
  const { vehicles } = useVehicles();
  const { staff } = useStaff();

  const formatVehicleLabel = (vehicle) => {
    if (!vehicle) return "";
    return (
      vehicle.license_plate ||
      vehicle.vehicle_number ||
      `${vehicle.make || ""} ${vehicle.model || ""}`
    ).trim();
  };

  const availableDrivers = useMemo(
    () => staff.filter((s) => s.role === "driver" || s.role === "manager"),
    [staff]
  );

  useEffect(() => {
    if (expense) {
      setFormData({
        date: toInputDateString(expense.date),
        amount: expense.amount || "",
        category: expense.category || "",
        description: expense.description || "",
        vehicle_id: expense.vehicle_id || "",
        driver: expense.driver || "",
      });
    }
  }, [expense]);

  // Preselect driver from the current vehicle when dialog opens or vehicles load
  useEffect(() => {
    if (!expense) return;
    if (!formData.vehicle_id || formData.driver) return;
    const vehicle = vehicles.find((v) => String(v.id) === String(formData.vehicle_id));
    if (!vehicle || !vehicle.driver) return;
    let driver = "";
    if (typeof vehicle.driver === "string") driver = vehicle.driver;
    else if (vehicle.driver.username) driver = vehicle.driver.username;
    else {
      const driverObj = staff.find((s) => s.id === vehicle.driver);
      driver = driverObj ? driverObj.username : "";
    }
    if (driver) {
      setFormData((prev) => ({ ...prev, driver }));
    }
  }, [expense, vehicles, formData.vehicle_id, formData.driver, staff]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onEditExpense(expense.id, {
        ...formData,
        date: toInputDateString(formData.date),
        vehicle_id: cleanVehicleId(formData.vehicle_id),
      });
    } catch (error) {
      alert("Error updating expense.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!show || !expense) return null;

  const selectedVehicle = vehicles.find((v) => String(v.id) === String(formData.vehicle_id));
  const selectedVehicleLabel = selectedVehicle ? formatVehicleLabel(selectedVehicle) : "";

  const selectVehicle = (vehicle) => {
    if (!vehicle) return;
    let driver = "";
    if (vehicle.driver) {
      if (typeof vehicle.driver === "string") {
        driver = vehicle.driver;
      } else if (vehicle.driver.username) {
        driver = vehicle.driver.username;
      } else {
        const driverObj = staff.find((s) => s.id === vehicle.driver);
        driver = driverObj ? driverObj.username : "";
      }
    }
    setFormData((prev) => ({ ...prev, vehicle_id: vehicle.id, driver: driver || "" }));
    setOpenDropdown(null);
  };

  const selectDriver = (username) => {
    if (!username) return;
    const driverVehicle = vehicles.find(
      (v) =>
        v.driver &&
        ((typeof v.driver === "string" && v.driver === username) ||
          v.driver?.username === username ||
          v.driver === username)
    );
    setFormData((prev) => ({
      ...prev,
      driver: username,
      vehicle_id: driverVehicle ? driverVehicle.id : prev.vehicle_id,
    }));
    setOpenDropdown(null);
  };

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Edit Expense</h2>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={toInputDateString(formData.date)}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount</label>
            <input
              id="amount"
              name="amount"
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              <option value="Fuel">Fuel</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Insurance">Insurance</option>
              <option value="Toll">Toll</option>
              <option value="Parking">Parking</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
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
                  setOpenDropdown(openDropdown === "vehicle" ? null : "vehicle");
                }}
              >
                {selectedVehicleLabel || "Select vehicle"}
                <span className="caret" />
              </button>
              {openDropdown === "vehicle" && (
                <div className="custom-select-menu" role="listbox" style={{ maxHeight: "180px", overflowY: "auto" }}>
                  {vehicles.length > 0 ? (
                    vehicles.map((v) => (
                      <div
                        key={v.id}
                        role="option"
                        className={`custom-select-option${String(formData.vehicle_id) === String(v.id) ? " selected" : ""}`}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => selectVehicle(v)}
                      >
                        {formatVehicleLabel(v)}{v.driver ? ` — ${typeof v.driver === "object" ? v.driver.username : v.driver}` : ""}
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
                <div className="custom-select-menu" role="listbox" style={{ maxHeight: "180px", overflowY: "auto" }}>
                  {availableDrivers.length > 0 ? (
                    availableDrivers.map((s) => (
                      <div
                        key={s.id}
                        role="option"
                        className={`custom-select-option${formData.driver === s.username ? " selected" : ""}`}
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
              {loading ? "Updating..." : "Update Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseDialog;
