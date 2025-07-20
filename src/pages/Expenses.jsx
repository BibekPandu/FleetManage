import React, { useState } from 'react';
import './Expenses.css';
import { useExpenses } from '../context/ExpensesContext';
import useAuth from '../hooks/useAuth';
import ExpensesList from '../components/expences/ExpensesList';
import AddExpenseDialog from '../components/expences/AddExpenseDialog';
import EditExpenseDialog from '../components/expences/EditExpenseDialog';
import ConfirmationDialog from '../components/common/ConfirmationDialog';

const Expenses = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';
  const { expenses, loading, error, addExpense, updateExpense, deleteExpense, clearError } = useExpenses();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);

  const openEditDialog = (expense) => {
    setSelectedExpense(expense);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (expense) => {
    setSelectedExpense(expense);
    setShowDeleteDialog(true);
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await addExpense(expenseData);
      setShowAddDialog(false);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleEditExpense = async (id, formData) => {
    try {
      await updateExpense(id, formData);
      setShowEditDialog(false);
      setSelectedExpense(null);
    } catch (error) {
      // Error is handled by the context
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedExpense) {
      try {
        await deleteExpense(selectedExpense.id);
        setShowDeleteDialog(false);
        setSelectedExpense(null);
      } catch (error) {
        // Error is handled by the context
      }
    }
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
        {canModify && <button onClick={() => setShowAddDialog(true)}>Add Expense</button>}
      </div>
      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>&times;</button>
        </div>
      )}
      <ExpensesList
        expenses={expenses}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        canModify={canModify}
      />
      {canModify && showAddDialog && (
        <AddExpenseDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddExpense={handleAddExpense}
        />
      )}
      {canModify && selectedExpense && (
        <EditExpenseDialog
          show={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedExpense(null);
          }}
          expense={selectedExpense}
          onEditExpense={handleEditExpense}
        />
      )}
      {canModify && (
        <ConfirmationDialog
          show={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedExpense(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this expense? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Expenses;
