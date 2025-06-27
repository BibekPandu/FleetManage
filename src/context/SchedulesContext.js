import React, { createContext, useState, useContext } from 'react';

const SchedulesContext = createContext();

export const SchedulesProvider = ({ children }) => {
  const [schedules, setSchedules] = useState([
    { id: 1, date: '2023-11-01', vehicle: 'Ford Transit', driver: 'John Doe', task: 'Morning Route', status: 'Scheduled' },
    { id: 2, date: '2023-11-01', vehicle: 'Ram ProMaster', driver: 'Peter Jones', task: 'Afternoon Route', status: 'Completed' },
  ]);

  const addSchedule = (newSchedule) => {
    setSchedules([...schedules, { ...newSchedule, id: schedules.length + 1 }]);
  };

  const editSchedule = (updatedSchedule) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      )
    );
  };

  const deleteSchedule = (scheduleId) => {
    setSchedules(schedules.filter((schedule) => schedule.id !== scheduleId));
  };

  const value = { schedules, addSchedule, editSchedule, deleteSchedule };

  return (
    <SchedulesContext.Provider value={value}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);
