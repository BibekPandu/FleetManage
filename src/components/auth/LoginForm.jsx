import React, { useState } from 'react';
import '../common/Form.css';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const LoginForm = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required.';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!role) newErrors.role = 'Role is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onLogin({ email, password, role });
    }
  };

  return (
    <div className="form-container">
      <div className="logo-title">FleetFox</div>
      <form onSubmit={handleSubmit} noValidate>
        <h2>Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
          />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label>Role</label>
          <div className="role-radio-group">
            <label><input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} /> User</label>
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
