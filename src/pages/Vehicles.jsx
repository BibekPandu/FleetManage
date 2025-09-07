import React, { useState } from "react";
import "../styles/Vehicles.css";
import VehicleList from "../components/vehicles/VehicleList";
import AddVehicleDialog from "../components/vehicles/AddVehicleDialog";
import EditVehicleDialog from "../components/vehicles/EditVehicleDialog";
import ConfirmationDialog from "../components/common/ConfirmationDialog";
import useAuth from "../hooks/useAuth";
import { useVehicles } from "../context/VehiclesContext";

const Vehicles = () => {
  const { user } = useAuth();
  const canModify = user?.role === "admin" || user?.role === "manager";

  // Debug: Check if user is logged in
  console.log("👤 Current user:", user);
  console.log(
    "🔑 Token in localStorage:",
    localStorage.getItem("fleetfox_token") ? "Exists" : "Missing"
  );

  const {
    vehicles,
    loading,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    clearError,
  } = useVehicles();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const openEditDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditDialog(true);
  };

  const openDeleteDialog = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowDeleteDialog(true);
  };

  const handleAddVehicle = async (vehicleData) => {
    try {
      await createVehicle(vehicleData);
      setShowAddDialog(false);
    } catch (error) {
      // Error is handled by the context
      console.error("Failed to add vehicle:", error);
    }
  };

  const handleEditVehicle = async (vehicleData) => {
    try {
      await updateVehicle(selectedVehicle.id, vehicleData);
      setShowEditDialog(false);
      setSelectedVehicle(null);
    } catch (error) {
      // Error is handled by the context
      console.error("Failed to edit vehicle:", error);
    }
  };

  const handleConfirmDelete = async () => {
    if (selectedVehicle) {
      try {
        await deleteVehicle(selectedVehicle.id);
        setShowDeleteDialog(false);
        setSelectedVehicle(null);
      } catch (error) {
        // Error is handled by the context
        console.error("Failed to delete vehicle:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="vehicles">
        <div className="page-header">
          <h1>Vehicles</h1>
        </div>
        <div className="loading">Loading vehicles...</div>
      </div>
    );
  }

  return (
    <div className="vehicles">
      <div className="page-header">
        <h1>Vehicles</h1>
        {canModify && (
          <button onClick={() => setShowAddDialog(true)}>Add Vehicle</button>
        )}
      </div>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={clearError}>×</button>
        </div>
      )}

      <VehicleList
        vehicles={vehicles}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
        canModify={canModify}
      />

      {canModify && showAddDialog && (
        <AddVehicleDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddVehicle={handleAddVehicle}
        />
      )}

      {canModify && selectedVehicle && (
        <EditVehicleDialog
          show={showEditDialog}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedVehicle(null);
          }}
          vehicle={selectedVehicle}
          onEditVehicle={handleEditVehicle}
        />
      )}

      {canModify && (
        <ConfirmationDialog
          show={showDeleteDialog}
          onClose={() => {
            setShowDeleteDialog(false);
            setSelectedVehicle(null);
          }}
          onConfirm={handleConfirmDelete}
          title="Confirm Deletion"
          message={`Are you sure you want to delete ${selectedVehicle?.make} ${selectedVehicle?.model}? This action cannot be undone.`}
        />
      )}
    </div>
  );
};

export default Vehicles;
