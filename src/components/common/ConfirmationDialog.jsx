import React from 'react';
import './Dialog.css';
import './ConfirmationDialog.css';

const ConfirmationDialog = ({ show, onClose, onConfirm, title, message }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="dialog-overlay" onClick={onClose}>
      <div className="dialog-content confirmation-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="dialog-header">
          <h2>{title}</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        <div className="dialog-body">
          <p>{message}</p>
        </div>
        <div className="dialog-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-danger" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
