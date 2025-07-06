import React, { useState } from 'react';
import ScheduleList from '../components/scheduling/ScheduleList';
import AddScheduleDialog from '../components/scheduling/AddScheduleDialog';
import EditScheduleDialog from '../components/scheduling/EditScheduleDialog';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import { useSchedules } from '../context/SchedulesContext';
import useAuth from '../hooks/useAuth';

const Scheduling = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';
  const { 
    schedules, 
    loading, 
    error, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule, 
    clearError 
  } = useSchedules();

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

  const handleAddSchedule = async (scheduleData) => {
    try {
      await addSchedule(scheduleData);
      setShowAddDialog(false);
    } catch (error) {
      // Error is handled by the context
      console.error('Failed to add schedule:', error);
    }
  };

  const handleEditSchedule = async (scheduleData) => {
    try {
      await updateSchedule(selectedSchedule.id, scheduleData);
      setShowEditDialog(false);
      setSelectedSchedule(null);
    } catch (error) {
      // Error is handled by the context
      console.error('Failed to edit schedule:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedSchedule) {
      try {
        await deleteSchedule(selectedSchedule.id);
        setShowDeleteDialog(false);
        setSelectedSchedule(null);
      } catch (error) {
        // Error is handled by the context
        console.error('Failed to delete schedule:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="scheduling">
        <div className="page-header">
          <h1>Scheduling</h1>
        </div>
        <div className="loading">Loading schedules...</div>
      </div>
    );
  }

  return (
    <div className="scheduling">
      <div className="page-header">
        <h1>Scheduling</h1>
        {canModify && <button onClick={() => setShowAddDialog(true)}>Add Schedule</button>}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}

      <ScheduleList 
        schedules={schedules} 
        onEdit={openEditDialog} 
        onDelete={openDeleteDialog} 
        canModify={canModify} 
      />

      {canModify && showAddDialog && (
        <AddScheduleDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddSchedule={handleAddSchedule}
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
          onEditSchedule={handleEditSchedule}
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
