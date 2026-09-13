import React from 'react';

const OrbitNotice = ({ error = false, children, className = '' }) => (
  <p
    className={`orb-notice ${error ? 'orb-notice-error' : ''} ${className}`}
    role={error ? 'alert' : undefined}
  >
    {children}
  </p>
);

export default OrbitNotice;
