import React, { useState } from 'react';
import '../common/Form.css';

const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const RegisterForm = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!name) newErrors.name = 'Full name is required.';
    else if (name.length < 3) newErrors.name = 'Name must be at least 3 characters.';
    if (!email) newErrors.email = 'Email is required.';
    else if (!validateEmail(email)) newErrors.email = 'Enter a valid email.';
    if (!password) newErrors.password = 'Password is required.';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    if (!role) newErrors.role = 'Role is required.';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      onRegister({ name, email, password, role });
    }
  };

  return (
    <div className="form-container">
      <div className="logo-title">FleetFox</div>
      <form onSubmit={handleSubmit} noValidate>
        <h2>Create Account</h2>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
          />
          {errors.name && <div className="form-error">{errors.name}</div>}
        </div>
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
            autoComplete="new-password"
          />
          {errors.password && <div className="form-error">{errors.password}</div>}
        </div>
        <div className="form-group">
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </select>
          {errors.role && <div className="form-error">{errors.role}</div>}
        </div>
        <button type="submit" className="form-button">Register</button>
      </form>
    </div>
  );
};

export default RegisterForm;
