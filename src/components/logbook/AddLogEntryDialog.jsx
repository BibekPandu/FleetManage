import React, { useState, useEffect, useCallback, useMemo } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./AddLogEntryDialog.css";
import { useVehicles } from "../../context/VehiclesContext";
import { useStaff } from "../../context/StaffContext";
import { useLogbook } from "../../context/LogbookContext";

const AddLogEntryDialog = ({ show, onClose, onAddEntry }) => {
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
  const { entries } = useLogbook();
  const [openDropdown, setOpenDropdown] = useState(null); // 'vehicle' | 'driver' | null

  // Format vehicle label consistently
  const formatVehicleLabel = (vehicle) => {
    if (!vehicle) return "";
    return (
      vehicle.license_plate ||
      vehicle.vehicle_number ||
      `${vehicle.make || ""} ${vehicle.model || ""}`
    ).trim();
  };

  // Get all used vehicles and drivers for the selected date
  const getUsedOptions = useCallback(() => {
    const usedVehicles = new Set();
    const usedDrivers = new Set();

    if (!formData.date) return { usedVehicles, usedDrivers };

    // Normalize the selected date for comparison (YYYY-MM-DD format)
    const selectedDate = new Date(formData.date).toISOString().split("T")[0];

    console.log("Checking entries for date:", selectedDate);

    entries.forEach((entry) => {
      if (!entry?.date) return;

      // Normalize entry date (handle both ISO string and YYYY-MM-DD formats)
      const entryDate = entry.date.split("T")[0];

      if (entryDate === selectedDate) {
        // Add vehicle if it exists (handle both string and object formats)
        if (entry.vehicle) {
          const vehicleLabel = typeof entry.vehicle === "string"
            ? entry.vehicle.trim().toLowerCase()
            : formatVehicleLabel(entry.vehicle).toLowerCase();
          usedVehicles.add(vehicleLabel);
          console.log("Marking vehicle as used:", vehicleLabel);
        }

        // Add driver if it exists (handle both string and object formats)
        if (entry.driver) {
          const driverName = typeof entry.driver === "string"
            ? entry.driver.trim().toLowerCase()
            : (entry.driver.username || "").toString().trim().toLowerCase();
          if (driverName) {
            usedDrivers.add(driverName);
            console.log("Marking driver as used:", driverName);
          }
        }
      }
    });

    return { usedVehicles, usedDrivers };
  }, [formData.date, entries]);

  // Filter out vehicles and drivers that already have an entry for the selected date
  const getAvailableOptions = useCallback(() => {
    if (!formData.date)
      return {
        availableVehicles: [...vehicles],
        availableDrivers: staff.filter((s) => s.role === "driver" || s.role === "manager"),
      };

    const { usedVehicles, usedDrivers } = getUsedOptions();

    console.log("Used vehicles for date:", Array.from(usedVehicles));
    console.log("Used drivers for date:", Array.from(usedDrivers));

    // Filter vehicles that aren't used for the selected date
    const availableVehicles = vehicles.filter((vehicle) => {
      if (!vehicle) return false;
      const vehicleLabel = formatVehicleLabel(vehicle).toLowerCase();
      const isUsed = usedVehicles.has(vehicleLabel);
      return !isUsed;
    });

    // Filter drivers that aren't used for the selected date and have the right role
    const availableDrivers = staff.filter((staffMember) => {
      if (!staffMember) return false;
      const isDriver = staffMember.role === "driver" || staffMember.role === "manager";
      if (!isDriver) return false;

      const username = (staffMember.username || "").toString().trim().toLowerCase();
      const isUsed = usedDrivers.has(username);
      return !isUsed;
    });

    console.log("Available vehicles:", availableVehicles.map((v) => formatVehicleLabel(v)));
    console.log("Available drivers:", availableDrivers.map((d) => d.username));

    return { availableVehicles, availableDrivers };
  }, [formData.date, vehicles, staff, getUsedOptions]);

  // Memoize the available options to prevent unnecessary re-renders
  const { availableVehicles, availableDrivers } = useMemo(() => getAvailableOptions(), [
    getAvailableOptions,
  ]);

  // Debug effect to log changes
  useEffect(() => {
    console.group("Logbook Form State");
    console.log("Selected date:", formData.date);
    console.log("Available vehicles:", availableVehicles.map((v) => formatVehicleLabel(v)));
    console.log("Available drivers:", availableDrivers.map((d) => d.username));
    console.groupEnd();
  }, [formData.date, availableVehicles, availableDrivers]);

  // Reset vehicle and driver when date changes
  useEffect(() => {
    if (formData.date) {
      setFormData((prev) => ({
        ...prev,
        vehicle: "",
        driver: "",
      }));
    }
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "startKm" || name === "endKm") {
      const next = { ...formData, [name]: value };
      const start = parseFloat(next.startKm);
      const end = parseFloat(next.endKm);
      const distance =
        !isNaN(start) && !isNaN(end) ? Math.max(0, end - start) : "";
      setFormData({
        ...next,
        description: distance === "" ? "" : String(distance),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Helper function to normalize dates to YYYY-MM-DD format
  const normalizeDate = (dateString) => {
    if (!dateString) return '';
    
    // If it's already in YYYY-MM-DD format
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Try to parse as M/D/YYYY or M/D/YY
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Invalid date format:', dateString);
      return '';
    }
    
    // Format as YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Helper function to normalize strings for comparison
  const normalizeString = (str) => {
    if (!str) return '';
    return str.toString().trim().toLowerCase().replace(/\s+/g, ' ');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.date || !formData.vehicle || !formData.driver) {
      alert("Please fill in all required fields");
      return;
    }

    // Normalize the current form data for comparison
    const normalizedFormDate = normalizeDate(formData.date);
    const normalizedFormVehicle = normalizeString(formData.vehicle);
    const normalizedFormDriver = normalizeString(formData.driver);

    if (!normalizedFormDate) {
      alert("Invalid date format. Please use YYYY-MM-DD format.");
      return;
    }

    console.log('Checking for duplicates with:', {
      date: normalizedFormDate,
      vehicle: normalizedFormVehicle,
      driver: normalizedFormDriver,
      existingEntries: entries.map(e => ({
        date: e.date,
        normalizedDate: normalizeDate(e.date),
        vehicle: e.vehicle,
        driver: e.driver
      }))
    });

    // Check for duplicates
    const isDuplicate = entries.some(entry => {
      if (!entry || !entry.date) return false;
      
      const entryDate = normalizeDate(entry.date);
      const entryVehicle = normalizeString(entry.vehicle);
      const entryDriver = normalizeString(entry.driver);
      
      const sameDate = entryDate === normalizedFormDate;
      const sameVehicle = entryVehicle === normalizedFormVehicle;
      const sameDriver = entryDriver === normalizedFormDriver;
      
      if (sameDate && (sameVehicle || sameDriver)) {
        console.log('Found duplicate entry:', {
          entryDate,
          entryVehicle,
          entryDriver,
          formDate: normalizedFormDate,
          formVehicle: normalizedFormVehicle,
          formDriver: normalizedFormDriver
        });
        return true;
      }
      return false;
    });

    if (isDuplicate) {
      alert("This vehicle or driver already has an entry for the selected date");
      return;
    }

    // Prepare the data in the format expected by the API
    const entryData = {
      date: formData.date,
      vehicle: formData.vehicle,
      driver: formData.driver,
      description: formData.description || "", // This contains the calculated distance
      start_km: formData.startKm ? parseFloat(formData.startKm) : null,
      end_km: formData.endKm ? parseFloat(formData.endKm) : null,
    };

    console.log("Submitting log entry:", entryData);

    try {
      await onAddEntry(entryData);
      onClose();
    } catch (error) {
      console.error("Error adding log entry:", error);
      alert(
        `Failed to add log entry: ${
          error.message || "Please check the console for details"
        }`
      );
    }
  };

  const selectVehicle = (vehicle) => {
    if (!vehicle) return;
    
    // Get the vehicle label
    const vehicleLabel = formatVehicleLabel(vehicle);
    
    // Find the driver assigned to this vehicle
    let driver = "";
    if (vehicle.driver) {
      // If vehicle.driver is a string (username), use it directly
      if (typeof vehicle.driver === 'string') {
        driver = vehicle.driver;
      } 
      // If vehicle.driver is an object with username
      else if (vehicle.driver.username) {
        driver = vehicle.driver.username;
      }
      // If vehicle has a driver ID, find the driver in staff
      else if (vehicle.driver) {
        const driverObj = staff.find(s => s.id === vehicle.driver);
        driver = driverObj ? driverObj.username : "";
      }
    }
    
    setFormData(prev => ({
      ...prev,
      vehicle: vehicleLabel,
      driver: driver,
      // Clear the driver field if no driver is assigned to the vehicle
      ...(driver ? {} : { driver: "" })
    }));
    
    setOpenDropdown(null);
  };

  const selectDriver = (username) => {
    if (!username) return;
    const next = { ...formData, driver: username };
    // If there is a vehicle assigned to this driver, select it
    const assignedVehicle = vehicles.find(
      (veh) =>
        veh.driver &&
        veh.driver.toString().toLowerCase() === username.toLowerCase()
    );
    if (assignedVehicle) {
      next.vehicle = formatVehicleLabel(assignedVehicle);
    }
    setFormData(next);
    setOpenDropdown(null);
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
            <div className="custom-select" onBlur={() => setOpenDropdown(null)}>
              <button
                type="button"
                className="custom-select-toggle"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === "vehicle"}
                onClick={() =>
                  setOpenDropdown(openDropdown === "vehicle" ? null : "vehicle")
                }
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
                  {availableVehicles.length > 0 ? (
                    availableVehicles.map((v) => (
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
                    <div className="no-options">
                      No available vehicles for this date
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="driver">Driver</label>
            <div className="custom-select" onBlur={() => setOpenDropdown(null)}>
              <button
                type="button"
                className="custom-select-toggle"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === "driver"}
                onClick={() =>
                  setOpenDropdown(openDropdown === "driver" ? null : "driver")
                }
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
                    <div className="no-options">
                      No available drivers for this date
                    </div>
                  )}
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
            <label htmlFor="description">Distance (km)</label>
            <input
              id="description"
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
