import React from 'react';
import './Settings.css';
import SettingsForm from '../components/settings/SettingsForm';

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>User Settings</h1>
      <div className="settings-container">
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;
