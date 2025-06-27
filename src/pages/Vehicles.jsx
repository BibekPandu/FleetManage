import React, { useState } from 'react';
import './Vehicles.css';
import VehicleList from '../components/vehicles/VehicleList';
import AddVehicleDialog from '../components/vehicles/AddVehicleDialog';
import EditVehicleDialog from '../components/vehicles/EditVehicleDialog';
import ConfirmationDialog from '../components/common/ConfirmationDialog';
import useAuth from '../hooks/useAuth';
import { useVehicles } from '../context/VehiclesContext';

const Vehicles = () => {
  const { user } = useAuth();
  const canModify = user?.role === 'admin' || user?.role === 'manager';

  const { vehicles, addVehicle, editVehicle, deleteVehicle } = useVehicles();

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

  const handleConfirmDelete = () => {
    if (selectedVehicle) {
      deleteVehicle(selectedVehicle.id);
      setShowDeleteDialog(false);
      setSelectedVehicle(null);
    }
  };

  return (
    <div className="vehicles">
      <div className="page-header">
        <h1>Vehicles</h1>
        {canModify && <button onClick={() => setShowAddDialog(true)}>Add Vehicle</button>}
      </div>
      <VehicleList vehicles={vehicles} onEdit={openEditDialog} onDelete={openDeleteDialog} canModify={canModify} />
      {canModify && showAddDialog && (
        <AddVehicleDialog
          show={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onAddVehicle={addVehicle}
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
          onEditVehicle={editVehicle}
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
