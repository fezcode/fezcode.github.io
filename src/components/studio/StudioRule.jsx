import React from 'react';

const StudioRule = ({ label, dashed = false, className = '' }) => {
  if (label) {
    return (
      <div className={`std-rulehead ${className}`}>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <hr className={`${dashed ? 'std-rule-dashed' : 'std-rule'} ${className}`} />
  );
};

export default StudioRule;
