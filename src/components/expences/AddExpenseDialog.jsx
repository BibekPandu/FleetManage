import React, { useState } from "react";
import "../../styles/Dialog.css";
import "../../styles/Form.css";
import "./AddExpenseDialog.css";

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

const AddExpenseDialog = ({ show, onClose, onAddExpense }) => {
  const [formData, setFormData] = useState({
    date: "",
    amount: "",
    category: "",
    description: "",
    vehicle_id: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddExpense({
        ...formData,
        date: toInputDateString(formData.date),
        vehicle_id: cleanVehicleId(formData.vehicle_id),
      });
      setFormData({
        date: "",
        amount: "",
        category: "",
        description: "",
        vehicle_id: "",
      });
    } catch (error) {
      alert("Error adding expense.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  if (!show) return null;

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} className="settings-section">
          <h2>Add Expense</h2>
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
            <input
              id="category"
              name="category"
              type="text"
              value={formData.category}
              onChange={handleChange}
              required
            />
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
            <label htmlFor="vehicle_id">Vehicle ID</label>
            <input
              id="vehicle_id"
              name="vehicle_id"
              type="number"
              value={formData.vehicle_id}
              onChange={handleChange}
            />
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
              {loading ? "Adding..." : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseDialog;
