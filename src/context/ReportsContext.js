import React, { createContext, useState, useContext } from 'react';

const ReportsContext = createContext();

export const ReportsProvider = ({ children }) => {
  const [reports, setReports] = useState([]);
  const value = { reports, setReports };

  return (
    <ReportsContext.Provider value={value}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => useContext(ReportsContext);
