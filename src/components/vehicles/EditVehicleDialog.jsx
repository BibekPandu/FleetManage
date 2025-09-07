import React, { useState, useEffect } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";

const EditVehicleDialog = ({ show, onClose, vehicle, onEditVehicle }) => {
  const [formData, setFormData] = useState({
    vehicle_number: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    license_plate: "",
    fuel_type: "petrol",
    status: "active",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (vehicle) {
      setFormData({
        vehicle_number: vehicle.vehicle_number || "",
        make: vehicle.make || "",
        model: vehicle.model || "",
        year: vehicle.year || new Date().getFullYear(),
        license_plate: vehicle.license_plate || "",
        fuel_type: vehicle.fuel_type || "petrol",
        status: vehicle.status || "active",
      });
    }
  }, [vehicle]);

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
      await onEditVehicle(formData);
    } catch (error) {
      // Error is handled by the parent component
    }
  };

  if (!show || !vehicle) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Edit Vehicle</h2>

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

          <div className="dialog-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button type="submit" className="form-button">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleDialog;
