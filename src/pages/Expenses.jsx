import React, { useState } from "react";
import "./Expenses.css";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ description: "", amount: "", date: "" });
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false); // For future backend

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) {
      setError("All fields are required.");
      return;
    }
    setExpenses([
      { ...form, amount: parseFloat(form.amount), id: Date.now() },
      ...expenses,
    ]);
    setForm({ description: "", amount: "", date: "" });
    setError("");
    setShowAdd(false);
  };

  if (loading) {
    return (
      <div className="expenses">
        <div className="page-header">
          <h1>Expenses</h1>
        </div>
        <div className="loading">Loading expenses...</div>
      </div>
    );
  }

  return (
    <div className="expenses">
      <div className="page-header">
        <h1>Expenses</h1>
        <button onClick={() => setShowAdd((v) => !v)} className="add-btn">
          {showAdd ? "Cancel" : "Add Expense"}
        </button>
      </div>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError("")}></button>
        </div>
      )}
      {showAdd && (
        <form className="expenses-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
          />
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
          <button type="submit" className="form-button">
            Save
          </button>
        </form>
      )}
      <table className="expenses-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: "center" }}>
                No expenses yet.
              </td>
            </tr>
          ) : (
            expenses.map((exp) => (
              <tr key={exp.id}>
                <td>{exp.date}</td>
                <td>{exp.description}</td>
                <td>${exp.amount.toFixed(2)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Expenses;
