import React, { createContext, useState, useContext } from 'react';

const StaffContext = createContext();

export const StaffProvider = ({ children }) => {
  const [staff, setStaff] = useState([
    { id: 1, name: 'John Doe', role: 'Driver', status: 'Active' },
    { id: 2, name: 'Peter Jones', role: 'Driver', status: 'Inactive' },
  ]);

  const addStaff = (newStaff) => {
    setStaff([...staff, { ...newStaff, id: staff.length + 1 }]);
  };

  const editStaff = (updatedStaff) => {
    setStaff(
      staff.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
    );
  };

  const deleteStaff = (staffId) => {
    setStaff(staff.filter((s) => s.id !== staffId));
  };

  const value = { staff, addStaff, editStaff, deleteStaff };

  return (
    <StaffContext.Provider value={value}>
      {children}
    </StaffContext.Provider>
  );
};

export const useStaff = () => useContext(StaffContext);
