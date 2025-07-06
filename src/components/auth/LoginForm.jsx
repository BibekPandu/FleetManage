import React, { useState } from 'react';
import '../common/Form.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('driver');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required.';
    if (!password) newErrors.password = 'Password is required.';
    if (!role) newErrors.role = 'Role is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onLogin({ username, password, role });
    }
  };

  return (
    <div className="form-container">
      <div className="logo-title">FleetFox</div>
      <form onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Enter your username"
          />
          {errors.username && <div className="form-error">{errors.username}</div>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label>Role</label>
          <div className="role-radio-group">
            <label><input type="radio" name="role" value="driver" checked={role === 'driver'} onChange={() => setRole('driver')} /> Driver</label>
            <label><input type="radio" name="role" value="manager" checked={role === 'manager'} onChange={() => setRole('manager')} /> Manager</label>
            <label><input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} /> Admin</label>
          </div>
          {errors.role && <div className="form-error">{errors.role}</div>}
        </div>
        <button type="submit" className="form-button">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
