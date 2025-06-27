import React from 'react';
import '../common/Table.css';

const LogbookList = ({ entries, onEdit, onDelete, canModify }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Description</th>
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.date}</td>
              <td>{entry.vehicle}</td>
              <td>{entry.driver}</td>
              <td>{entry.description}</td>
              {canModify && (
                <td>
                  <button className="btn-edit" onClick={() => onEdit(entry)}>Edit</button>
                  <button className="btn-delete" onClick={() => onDelete(entry)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogbookList;
