import React from 'react';

const OrbitLeader = ({ label, value, className = '' }) => (
  <div className={`orb-leader-row ${className}`}>
    <span className="orb-label">{label}</span>
    <span className="orb-leader" aria-hidden="true" />
    <span
      className="orb-highlight"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {value}
    </span>
  </div>
);

export default OrbitLeader;
