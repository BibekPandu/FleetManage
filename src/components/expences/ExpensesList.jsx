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
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense.id}>
              <td>{formatDate(expense.date)}</td>
              <td>{formatRupees(expense.amount)}</td>
              <td>{renderCategory(expense.category)}</td>
              <td>{expense.description}</td>
              <td>
                {expense.make
                  ? `${expense.make} ${expense.model} (${expense.license_plate})`
                  : "-"}
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
