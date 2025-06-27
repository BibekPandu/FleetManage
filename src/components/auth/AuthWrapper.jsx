import React from 'react';

const AuthWrapper = ({ children }) => {
  return (
    <div className="auth-wrapper">
      {children}
    </div>
  );
};

export default AuthWrapper;

/* No specific styles needed for this component as it is a wrapper, but leaving the file for future consistency. */
