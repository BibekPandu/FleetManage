import React, { createContext, useState, useContext } from 'react';

const LogbookContext = createContext();

export const LogbookProvider = ({ children }) => {
  const [entries, setEntries] = useState([
    { id: 1, date: '2023-10-27', vehicle: 'Ford Transit', driver: 'John Doe', description: 'Delivery to downtown' },
    { id: 2, date: '2023-10-27', vehicle: 'Mercedes-Benz Sprinter', driver: 'Peter Jones', description: 'Service call' },
  ]);

  const addEntry = (newEntry) => {
    setEntries([...entries, { ...newEntry, id: entries.length + 1 }]);
  };

  const editEntry = (updatedEntry) => {
    setEntries(
      entries.map((entry) =>
        entry.id === updatedEntry.id ? updatedEntry : entry
      )
    );
  };

  const deleteEntry = (entryId) => {
    setEntries(entries.filter((entry) => entry.id !== entryId));
  };

  const value = { entries, addEntry, editEntry, deleteEntry };

  return (
    <LogbookContext.Provider value={value}>
      {children}
    </LogbookContext.Provider>
  );
};

export const useLogbook = () => useContext(LogbookContext);
