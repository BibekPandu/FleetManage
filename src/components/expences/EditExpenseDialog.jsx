import React, { useState, useEffect } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./EditExpenseDialog.css";
import { useVehicles } from "../../context/VehiclesContext";

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
  });
  const [loading, setLoading] = useState(false);
  const { vehicles } = useVehicles();

  useEffect(() => {
    if (expense) {
      setFormData({
        date: toInputDateString(expense.date),
        amount: expense.amount || "",
        category: expense.category || "",
        description: expense.description || "",
        vehicle_id: expense.vehicle_id || "",
      });
    }
  }, [expense]);

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
            <label htmlFor="vehicle_id">Vehicle</label>
            <select
              id="vehicle_id"
              name="vehicle_id"
              value={formData.vehicle_id}
              onChange={handleChange}
            >
              <option value="">No vehicle</option>
              {vehicles.map((v) => {
                const label = v.license_plate || v.vehicle_number || `${v.make || ""} ${v.model || ""}`.trim();
                return (
                  <option key={v.id} value={v.id}>
                    {label}
                  </option>
                );
              })}
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
              {loading ? "Updating..." : "Update Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExpenseDialog;
