import React from 'react';

const StudioLeader = ({ label, value, className = '' }) => (
  <div className={`std-leader-row ${className}`}>
    <span className="std-label">{label}</span>
    <span className="std-leader" aria-hidden="true" />
    <span
      className="std-highlight"
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {value}
    </span>
  </div>
);

export default StudioLeader;
