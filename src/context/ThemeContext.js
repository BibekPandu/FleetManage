import React, { createContext, useContext } from 'react';

const ThemeContext = createContext({ theme: 'light' });

export const ThemeProvider = ({ children }) => {
  return (
    <ThemeContext.Provider value={{ theme: 'light' }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
}; 