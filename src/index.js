import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { VehiclesProvider } from './context/VehiclesContext';
import { StaffProvider } from './context/StaffContext';
import { LogbookProvider } from './context/LogbookContext';
import { SchedulesProvider } from './context/SchedulesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <VehiclesProvider>
        <StaffProvider>
          <LogbookProvider>
            <SchedulesProvider>
              <ThemeProvider>
                <App />
              </ThemeProvider>
            </SchedulesProvider>
          </LogbookProvider>
        </StaffProvider>
      </VehiclesProvider>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
