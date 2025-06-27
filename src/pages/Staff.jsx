import React, { useState } from 'react';
import './Staff.css';
import StaffList from '../components/staff/StaffList';
import AddStaffDialog from '../components/staff/AddStaffDialog';
import EditStaffDialog from '../components/staff/EditStaffDialog';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import useAuth from '../hooks/useAuth';
import { useStaff } from '../context/StaffContext';

const Staff = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';

  const { staff, addStaff, editStaff, deleteStaff } = useStaff();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const openEditDialog = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = () => {
    if (selectedStaff) {
      deleteStaff(selectedStaff.id);
      setShowDeleteDialog(false);
      setSelectedStaff(null);
    }
  };

  return (
    <div className="staff">
      <div className="page-header">
        <h1>Staff</h1>
        {canModify && <button onClick={() => setShowAddDialog(true)}>Add Staff</button>}
      </div>
      <StaffList staff={staff} onEdit={openEditDialog} onDelete={openDeleteDialog} canModify={canModify} />
      {canModify && showAddDialog && (
        <AddStaffDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddStaff={addStaff}
        />
      )}
      {canModify && selectedStaff && (
        <EditStaffDialog
          show={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedStaff(null);
          }}
          staff={selectedStaff}
          onEditStaff={editStaff}
        />
      )}
      {canModify && (
        <ConfirmationDialog
          show={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedStaff(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${selectedStaff?.name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Staff;
