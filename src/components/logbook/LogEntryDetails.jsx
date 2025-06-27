import React from 'react';
import './LogEntryDetails.css';

const LogEntryDetails = ({ entry }) => {
  if (!entry) {
    return (
      <div className="log-entry-details">
        <h3>No Entry Selected</h3>
        <p>Please select a logbook entry to see the details.</p>
      </div>
    );
  }

  return (
    <div className="log-entry-details">
      <h3>Details for Entry #{entry.id}</h3>
      <p><strong>Date:</strong> {entry.date}</p>
      <p><strong>Vehicle:</strong> {entry.vehicle}</p>
      <p><strong>Driver:</strong> {entry.driver}</p>
      <p><strong>Description:</strong> {entry.description}</p>
    </div>
  );
};

export default LogEntryDetails;
