import React, { useState } from "react";
import LogbookList from "../components/logbook/LogbookList";
import AddLogEntryDialog from "../components/logbook/AddLogEntryDialog";
import EditLogEntryDialog from "../components/logbook/EditLogEntryDialog";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import useAuth from "../hooks/useAuth";
import { useLogbook } from "../context/LogbookContext";

const Logbook = () => {
  const { user } = useAuth();
  const canModify =
    user?.role === "admin" ||
    user?.role === "manager" ||
    user?.role === "driver";

  // Debug: Check if user is logged in
  // console.log('👤 Current user:', user);
  // console.log('🔑 Token in localStorage:', localStorage.getItem('fleetfox_token') ? 'Exists' : 'Missing');

  const {
    entries,
    loading,
    error,
    addEntry,
    updateEntry,
    deleteEntry,
    clearError,
  } = useLogbook();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);

  const openEditDialog = (entry) => {
    setSelectedEntry(entry);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (entry) => {
    setSelectedEntry(entry);
    setShowDeleteDialog(true);
  };

  const handleAddEntry = async (entryData) => {
    try {
      await addEntry(entryData);
      setShowAddDialog(false);
    } catch (error) {
      // Error is handled by the context
      console.error("Failed to add logbook entry:", error);
    }
  };

  const handleEditEntry = async (entryData) => {
    try {
      await updateEntry(selectedEntry.id, entryData);
      setShowEditDialog(false);
      setSelectedEntry(null);
    } catch (error) {
      // Error is handled by the context
      console.error("Failed to edit logbook entry:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedEntry) {
      try {
        await deleteEntry(selectedEntry.id);
        setShowDeleteDialog(false);
        setSelectedEntry(null);
      } catch (error) {
        // Error is handled by the context
        console.error("Failed to delete logbook entry:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="logbook">
        <div className="page-header">
          <h1>Logbook</h1>
        </div>
        <div className="loading">Loading logbook entries...</div>
      </div>
    );
  }

  return (
    <div className="logbook">
      <div className="page-header">
        <h1>Logbook</h1>
        {canModify && (
          <button onClick={() => setShowAddDialog(true)}>Add Entry</button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}

      <LogbookList
        entries={entries}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        canModify={canModify}
      />

      {canModify && showAddDialog && (
        <AddLogEntryDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddEntry={handleAddEntry}
        />
      )}

      {canModify && selectedEntry && (
        <EditLogEntryDialog
          show={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
          onEditEntry={handleEditEntry}
        />
      )}

      {canModify && (
        <ConfirmationDialog
          show={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedEntry(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this logbook entry? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Logbook;
