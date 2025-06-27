import React, { useState, useEffect } from 'react';
import Dialog from '../common/Dialog';
import './EditScheduleDialog.css';

const EditScheduleDialog = ({ show, onClose, schedule, onEditSchedule }) => {
  const [date, setDate] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [driver, setDriver] = useState('');
  const [task, setTask] = useState('');
  const [status, setStatus] = useState('Scheduled');

  useEffect(() => {
    if (schedule) {
      setDate(schedule.date);
      setVehicle(schedule.vehicle);
      setDriver(schedule.driver);
      setTask(schedule.task);
      setStatus(schedule.status);
    }
  }, [schedule]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onEditSchedule({ ...schedule, date, vehicle, driver, task, status });
    onClose();
  };

  return (
    <Dialog show={show} onClose={onClose}>
      <h2>Edit Schedule</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Vehicle</label>
          <input type="text" value={vehicle} onChange={(e) => setVehicle(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Driver</label>
          <input type="text" value={driver} onChange={(e) => setDriver(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Task</label>
          <input type="text" value={task} onChange={(e) => setTask(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Scheduled">Scheduled</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </Dialog>
  );
};

export default EditScheduleDialog;
