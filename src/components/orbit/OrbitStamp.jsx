import React from 'react';

const OrbitStamp = ({ children = 'Always in progress', className = '' }) => (
  <span className={`orb-stamp ${className}`}>{children}</span>
);

export default OrbitStamp;
