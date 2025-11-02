import React, { useState, useEffect } from "react";
import Dialog from "../common/Dialog";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./AddLogEntryDialog.css";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";

const EditLogEntryDialog = ({ show, onClose, entry, onEditEntry }) => {
  const [formData, setFormData] = useState({
    date: "",
    vehicle: "",
    driver: "",
    description: "",
    startKm: "",
    endKm: "",
  });
  const { vehicles } = useVehicles();
  const { staff } = useStaff();
  const [openDropdown, setOpenDropdown] = useState(null);

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
        startKm: "",
        endKm: "",
      });
    }
  }, [entry]);

  const formatVehicleLabel = (v) => {
    return v.license_plate || v.vehicle_number || `${v.make || ""} ${v.model || ""}`.trim();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startKm" || name === "endKm") {
      const next = { ...formData, [name]: value };
      const start = parseFloat(next.startKm);
      const end = parseFloat(next.endKm);
      const distance = !isNaN(start) && !isNaN(end) ? Math.max(0, end - start) : "";
      setFormData({ ...next, description: distance === "" ? "" : String(distance) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const selectVehicle = (v) => {
    const label = formatVehicleLabel(v);
    const next = { ...formData, vehicle: label };
    if (v.driver) {
      next.driver = v.driver;
    }
    setFormData(next);
    setOpenDropdown(null);
  };

  const selectDriver = (username) => {
    const next = { ...formData, driver: username };
    const assignedVehicle = vehicles.find((veh) => veh.driver && veh.driver === username);
    if (assignedVehicle) {
      next.vehicle = formatVehicleLabel(assignedVehicle);
    }
    setFormData(next);
    setOpenDropdown(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Only send the fields that the API expects
    const { startKm, endKm, ...apiFormData } = formData;
    onEditEntry(apiFormData);
    onClose();
  };

  if (!show) return null;

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
          <div className="custom-select" onBlur={() => setOpenDropdown(null)}>
            <button
              type="button"
              className="custom-select-toggle"
              aria-haspopup="listbox"
              aria-expanded={openDropdown === 'vehicle'}
              onClick={() => setOpenDropdown(openDropdown === 'vehicle' ? null : 'vehicle')}
            >
              {formData.vehicle || 'Select vehicle'}
              <span className="caret" />
            </button>
            {openDropdown === 'vehicle' && (
              <div className="custom-select-menu" role="listbox" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {vehicles.map((v) => (
                  <div
                    key={v.id}
                    role="option"
                    className={`custom-select-option${formData.vehicle === formatVehicleLabel(v) ? ' selected' : ''}`}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => selectVehicle(v)}
                  >
                    {formatVehicleLabel(v)}{v.driver ? ` — ${v.driver}` : ''}
                  </div>
                ))}
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
              aria-expanded={openDropdown === 'driver'}
              onClick={() => setOpenDropdown(openDropdown === 'driver' ? null : 'driver')}
            >
              {formData.driver || 'Select driver'}
              <span className="caret" />
            </button>
            {openDropdown === 'driver' && (
              <div className="custom-select-menu" role="listbox" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                {staff
                  .filter((s) => s.role === "driver" || s.role === "manager")
                  .map((s) => (
                    <div
                      key={s.id}
                      role="option"
                      className={`custom-select-option${formData.driver === s.username ? ' selected' : ''}`}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => selectDriver(s.username)}
                    >
                      {s.username} ({s.role})
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="startKm">Start KM</label>
          <input
            id="startKm"
            name="startKm"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 1020.5"
            value={formData.startKm}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endKm">End KM</label>
          <input
            id="endKm"
            name="endKm"
            type="number"
            min="0"
            step="0.1"
            placeholder="e.g. 1032.8"
            value={formData.endKm}
            onChange={handleChange}
            required
          />
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
            readOnly
            required
          />
        </div>

        <div className="dialog-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="form-button">
            Save Changes
          </button>
        </div>
      </form>
    </Dialog>
  );
};

export default EditLogEntryDialog;
