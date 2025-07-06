import React, { useState } from "react";
import StaffList from "../components/staff/StaffList";
import AddStaffDialog from "../components/staff/AddStaffDialog";
import EditStaffDialog from "../components/staff/EditStaffDialog";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import useAuth from "../hooks/useAuth";
import { useStaff } from "../context/StaffContext";

const Staff = () => {
  const { user } = useAuth();
  const canModify = user?.role === "admin" || user?.role === "manager";

  // Debug: Check if user is logged in
  console.log("👤 Current user:", user);
  console.log(
    "🔑 Token in localStorage:",
    localStorage.getItem("fleetfox_token") ? "Exists" : "Missing"
  );

  const {
    staff,
    loading,
    error,
    createStaff,
    updateStaff,
    deleteStaff,
    clearError,
  } = useStaff();

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

  const handleAddStaff = async (staffData) => {
    try {
      await createStaff(staffData);
      setShowAddDialog(false);
    } catch (error) {
      // Error is handled by the context
      console.error("Failed to add staff member:", error);
    }
  };

  const handleEditStaff = async (staffData) => {
    try {
      await updateStaff(selectedStaff.id, staffData);
      setShowEditDialog(false);
      setSelectedStaff(null);
    } catch (error) {
      // Error is handled by the context
      console.error("Failed to edit staff member:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedStaff) {
      try {
        await deleteStaff(selectedStaff.id);
        setShowDeleteDialog(false);
        setSelectedStaff(null);
      } catch (error) {
        // Error is handled by the context
        console.error("Failed to delete staff member:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="staff">
        <div className="page-header">
          <h1>Staff</h1>
        </div>
        <div className="loading">Loading staff...</div>
      </div>
    );
  }

  return (
    <div className="staff">
      <div className="page-header">
        <h1>Staff</h1>
        {canModify && (
          <button onClick={() => setShowAddDialog(true)}>Add Staff</button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}

      <StaffList
        staff={staff}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        canModify={canModify}
      />

      {canModify && showAddDialog && (
        <AddStaffDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddStaff={handleAddStaff}
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
          onEditStaff={handleEditStaff}
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
          message={`Are you sure you want to delete ${selectedStaff?.first_name} ${selectedStaff?.last_name}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Staff;
