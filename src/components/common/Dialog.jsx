import React from 'react';
import './Dialog.css';

const Dialog = ({ show, onClose, children }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
