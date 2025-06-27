import React from 'react';

const SettingsList = ({ settings }) => {
  return (
    <div className="settings-list">
      <h2>Current Settings</h2>
      <ul>
        {Object.entries(settings).map(([key, value]) => (
          <li key={key}>
            <strong>{key}:</strong> {String(value)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SettingsList;
