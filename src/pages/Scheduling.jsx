import React, { useState } from 'react';
import './Scheduling.css';
import ScheduleList from '../components/scheduling/ScheduleList';
import AddScheduleDialog from '../components/scheduling/AddScheduleDialog';
import EditScheduleDialog from '../components/scheduling/EditScheduleDialog';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useSchedules } from '../context/SchedulesContext';
import useAuth from '../hooks/useAuth';

const Scheduling = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';
  const { schedules, addSchedule, editSchedule, deleteSchedule } = useSchedules();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const openEditDialog = (schedule) => {
    setSelectedSchedule(schedule);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedSchedule) {
      deleteSchedule(selectedSchedule.id);
      setShowDeleteDialog(false);
      setSelectedSchedule(null);
    }
  };

  return (
    <div className="scheduling">
      <div className="page-header">
        <h1>Scheduling</h1>
        {canModify && <button onClick={() => setShowAddDialog(true)}>Add Schedule</button>}
      </div>
      <ScheduleList schedules={schedules} onEdit={openEditDialog} onDelete={openDeleteDialog} canModify={canModify} />
      {canModify && (
        <AddScheduleDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddSchedule={addSchedule}
        />
      )}
      {canModify && selectedSchedule && (
        <EditScheduleDialog
          show={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedSchedule(null);
          }}
          schedule={selectedSchedule}
          onEditSchedule={editSchedule}
        />
      )}
      {canModify && (
        <ConfirmationDialog
          show={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedSchedule(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete this schedule? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Scheduling;
