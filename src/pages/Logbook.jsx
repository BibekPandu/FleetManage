import React, { useState } from 'react';
import './Logbook.css';
import LogbookList from '../components/logbook/LogbookList';
import AddLogEntryDialog from '../components/logbook/AddLogEntryDialog';
import EditLogEntryDialog from '../components/logbook/EditLogEntryDialog';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import useAuth from '../hooks/useAuth';
import { useLogbook } from '../context/LogbookContext';

const Logbook = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';

  const { entries, addEntry, editEntry, deleteEntry } = useLogbook();

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

  const handleConfirmDelete = () => {
    if (selectedEntry) {
      deleteEntry(selectedEntry.id);
      setShowDeleteDialog(false);
      setSelectedEntry(null);
    }
  };

  return (
    <div className="logbook">
      <div className="page-header">
        <h1>Logbook</h1>
        {canModify && <button onClick={() => setShowAddDialog(true)}>Add Log Entry</button>}
      </div>
      <LogbookList entries={entries} onEdit={openEditDialog} onDelete={openDeleteDialog} canModify={canModify} />
      {canModify && showAddDialog && (
        <AddLogEntryDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddEntry={addEntry}
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
          onEditEntry={editEntry}
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
          message={`Are you sure you want to delete this log entry? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Logbook;
