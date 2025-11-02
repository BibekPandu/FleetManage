import React from "react";
import "../../styles/Table.css";
import "./ExpensesList.css";

const ExpensesList = ({ expenses, onEdit, onDelete, canModify }) => {
  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  const formatRupees = (amount) => {
    const num = Number(amount);
    if (isNaN(num)) return "Rs. 0.00";
    return `Rs. ${num.toFixed(2)}`;
  };

  const renderDriver = (expense) => {
    const driver = expense.driver || expense.vehicle_driver;
    if (!driver) return "-";
    if (typeof driver === "object" && driver.username) return driver.username;
    return String(driver);
  };

  const renderCategory = (category) => {
    const key = String(category || "").toLowerCase();
    const className = `category-badge category-${key}`;
    return <span className={className}>{category}</span>;
  };

  if (expenses.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>No expenses found. Add your first expense to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Vehicle</th>
            <th>Driver</th>
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td className="amount-cell">{formatRupees(expense.amount)}</td>
              <td>{renderCategory(expense.category)}</td>
              <td>{expense.description}</td>
              <td>
                {expense.make
                  ? (
                    <span className="vehicle-pill">{`${expense.make} ${expense.model} (${expense.license_plate})`}</span>
                  ) : (
                    "-"
                  )}
              </td>
              <td>
                {renderDriver(expense) !== "-" ? (
                  <span className="driver-chip">{renderDriver(expense)}</span>
                ) : (
                  "-"
                )}
              </td>
              {canModify && (
                <td>
                  <button className="btn-edit" onClick={() => onEdit(expense)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => onDelete(expense)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExpensesList;
