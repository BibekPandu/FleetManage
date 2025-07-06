import React from 'react';
import '../common/Table.css';
import Badge from '../common/Badge';

const ScheduleList = ({ schedules, onEdit, onDelete, canModify }) => {
  const getStatusBadge = (status) => {
    const statusMap = {
      'scheduled': 'scheduled',
      'in_progress': 'in-progress',
      'completed': 'completed',
      'cancelled': 'cancelled'
    };
    return statusMap[status] || 'scheduled';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  if (schedules.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p>No schedules found. Add your first schedule to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Task</th>
            <th>Status</th>
            {canModify && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {schedules.map((schedule) => (
            <tr key={schedule.id}>
              <td>{schedule.id}</td>
              <td>{formatDate(schedule.date)}</td>
              <td>{schedule.vehicle}</td>
              <td>{schedule.driver}</td>
              <td>{schedule.task}</td>
              <td>
                <Badge type={getStatusBadge(schedule.status)}>
                  {schedule.status.replace('_', ' ')}
                </Badge>
              </td>
              {canModify && (
                <td>
                  <button className="btn-edit" onClick={() => onEdit(schedule)}>Edit</button>
                  <button className="btn-delete" onClick={() => onDelete(schedule)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
