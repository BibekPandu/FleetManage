import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

const DEFAULT_ADMIN = {
  id: 0,
  name: 'Admin',
  email: 'admin@fleetfox.com',
  password: 'admin123',
  role: 'admin',
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // This simulates our user database.
  const [users, setUsers] = useState([]);
  const [shouldRedirectToLogin, setShouldRedirectToLogin] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('fleetfox_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const register = (userData) => {
    if (userData.role === 'admin') {
      throw new Error('Cannot register as admin.');
    }
    const userExists = users.find(u => u.email === userData.email);
    if (userExists) {
      throw new Error('A user with this email already exists.');
    }
    const newUser = { ...userData, id: users.length + 1 };
    setUsers([...users, newUser]);
    // Set flag to redirect to login instead of auto-login
    setShouldRedirectToLogin(true);
    return newUser;
  };

  const login = (credentials) => {
    // Check for default admin login
    if (
      credentials.email === DEFAULT_ADMIN.email &&
      credentials.password === DEFAULT_ADMIN.password &&
      credentials.role === DEFAULT_ADMIN.role
    ) {
      setUser(DEFAULT_ADMIN);
      localStorage.setItem('fleetfox_user', JSON.stringify(DEFAULT_ADMIN));
      setShouldRedirectToLogin(false);
      return DEFAULT_ADMIN;
    }
    const foundUser = users.find(u => u.email === credentials.email);

    if (!foundUser) {
      throw new Error('Login failed: No user found with this email.');
    }

    if (foundUser.password !== credentials.password) {
      throw new Error('Login failed: Incorrect password.');
    }
    
    if (foundUser.role !== credentials.role) {
      throw new Error(`Login failed: Credentials are valid, but not for the '${credentials.role}' role.`);
    }

    // If all checks pass, set the user and clear redirect flag
    setUser(foundUser);
    localStorage.setItem('fleetfox_user', JSON.stringify(foundUser));
    setShouldRedirectToLogin(false);
    return foundUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fleetfox_user');
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const clearRedirectFlag = () => {
    setShouldRedirectToLogin(false);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      users, 
      login, 
      logout, 
      register, 
      isAuthenticated,
      shouldRedirectToLogin,
      clearRedirectFlag
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
