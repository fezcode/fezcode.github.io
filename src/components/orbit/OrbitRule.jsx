import React from 'react';

const OrbitRule = ({ label, dashed = false, className = '' }) => {
  if (label) {
    return (
      <div className={`orb-rulehead ${className}`}>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <hr className={`${dashed ? 'orb-rule-dashed' : 'orb-rule'} ${className}`} />
  );
};

export default OrbitRule;
