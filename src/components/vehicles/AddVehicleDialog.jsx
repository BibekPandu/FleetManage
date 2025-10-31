import React, { useState } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import { useStaff } from "../../context/StaffContext";
const AddVehicleDialog = ({ show, onClose, onAddVehicle }) => {
  const { staff } = useStaff();
  const [formData, setFormData] = useState({
    vehicle_number: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    fuel_type: "petrol",
    status: "active",
    driver: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.vehicle_number.trim()) {
      newErrors.vehicle_number = "Vehicle number is required";
    }

    if (!formData.make.trim()) {
      newErrors.make = "Make is required";
    }

    if (!formData.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (
      !formData.year ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    ) {
      newErrors.year = "Valid year is required";
    }

    if (!formData.license_plate.trim()) {
      newErrors.license_plate = "License plate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await onAddVehicle(formData);
      // Reset form
      setFormData({
        vehicle_number: "",
        make: "",
        model: "",
        year: new Date().getFullYear(),
        license_plate: "",
        fuel_type: "petrol",
        status: "active",
        driver: "",
      });
      setErrors({});
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      vehicle_number: "",
      make: "",
      model: "",
      year: new Date().getFullYear(),
      license_plate: "",
      fuel_type: "petrol",
      status: "active",
      driver: "",
    });
    setErrors({});
    onClose();
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={handleClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Vehicle</h2>

          <div className="form-group">
            <label htmlFor="vehicle_number">Vehicle Number</label>
            <input
              id="vehicle_number"
              name="vehicle_number"
              type="text"
              value={formData.vehicle_number}
              onChange={handleChange}
              placeholder="e.g., V001"
            />
            {errors.vehicle_number && (
              <div className="form-error">{errors.vehicle_number}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="make">Make</label>
            <input
              id="make"
              name="make"
              type="text"
              value={formData.make}
              onChange={handleChange}
              placeholder="e.g., Ford"
            />
            {errors.make && <div className="form-error">{errors.make}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="model">Model</label>
            <input
              id="model"
              name="model"
              type="text"
              value={formData.model}
              onChange={handleChange}
              placeholder="e.g., Transit"
            />
            {errors.model && <div className="form-error">{errors.model}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear() + 1}
            />
            {errors.year && <div className="form-error">{errors.year}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="license_plate">License Plate</label>
            <input
              id="license_plate"
              name="license_plate"
              type="text"
              value={formData.license_plate}
              onChange={handleChange}
              placeholder="e.g., ABC123"
            />
            {errors.license_plate && (
              <div className="form-error">{errors.license_plate}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="fuel_type">Fuel Type</label>
            <select
              id="fuel_type"
              name="fuel_type"
              value={formData.fuel_type}
              onChange={handleChange}
            >
              <option value="petrol">Petrol</option>
              <option value="diesel">Diesel</option>
              <option value="electric">Electric</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="driver">Driver</label>
            <select
              id="driver"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
            >
              <option value="">No driver</option>
              {staff
                .filter((s) => s.role === "driver" || s.role === "manager")
                .map((s) => (
                  <option key={s.id} value={s.username}>
                    {s.username} ({s.role})
                  </option>
                ))}
            </select>
          </div>

          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="form-button">
              Add Vehicle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleDialog;
