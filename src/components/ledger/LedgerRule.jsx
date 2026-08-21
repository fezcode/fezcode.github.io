import React from 'react';

/**
 * A registrar's rule. Bare, it is a hairline; given a label it becomes a
 * section head — LABEL ────────── — with the line filling the remainder.
 */
const LedgerRule = ({ label, dashed = false, className = '' }) => {
  if (label) {
    return (
      <div className={`ldg-rulehead ${className}`}>
        <span>{label}</span>
      </div>
    );
  }
  return (
    <hr
      className={`${dashed ? 'ldg-rule-dashed' : 'ldg-rule'} ${className}`}
    />
  );
};

export default LedgerRule;
