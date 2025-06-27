import React, { useState } from "react";
import "./SettingsForm.css";
import "../common/Form.css";
import useAuth from "../../hooks/useAuth";

const SettingsForm = () => {
  const { user } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    alert("Profile settings are saved automatically. Name update coming soon!");
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords don't match!");
      return;
    }
    alert("Password change functionality is not yet connected.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-form-container">
      {/* --- Profile Section --- */}
      <div className="settings-section">
        <h2>Profile</h2>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            name="email"
            value={user.email}
            readOnly
            disabled
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            name="name"
            value={user.name}
            readOnly
            disabled
          />
        </div>
      </div>

      {/* --- Change Password Section --- */}
      <form className="settings-section" onSubmit={handlePasswordChange}>
        <h2>Change Password</h2>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="form-button">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default SettingsForm;
