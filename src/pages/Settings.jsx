import React from "react";
import SettingsForm from "../components/settings/SettingsForm";

const Settings = () => {
  return (
    <div className="settings-page">
      <h1>User Settings</h1>
      <div
        className="settings-container"
        style={{
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        <SettingsForm />
      </div>
    </div>
  );
};

export default Settings;
