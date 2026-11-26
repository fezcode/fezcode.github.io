import React from 'react';

const StudioNotice = ({ error = false, children, className = '' }) => (
  <p
    className={`std-notice ${error ? 'std-notice-error' : ''} ${className}`}
    role={error ? 'alert' : undefined}
  >
    {children}
  </p>
);

export default StudioNotice;
