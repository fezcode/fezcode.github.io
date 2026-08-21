import React from 'react';

/**
 * The registrar's ink stamp — a double-ruled, slightly canted mark.
 * Defaults to the house motto: entries in ink are never erased, only
 * superseded by later entries.
 */
const LedgerStamp = ({ children = 'NO ERASURES', className = '' }) => (
  <span className={`ldg-stamp ${className}`}>
    {children}
    <sup>TM</sup>
  </span>
);

export default LedgerStamp;
