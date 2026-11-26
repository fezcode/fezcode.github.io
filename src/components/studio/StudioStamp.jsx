import React from 'react';

const StudioStamp = ({ children = 'Always in progress', className = '' }) => (
  <span className={`std-stamp ${className}`}>{children}</span>
);

export default StudioStamp;
