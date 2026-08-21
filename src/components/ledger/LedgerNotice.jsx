import React from 'react';

/**
 * Loading / empty / error notice. Dashed for waiting states, solid accent
 * for errors — matching the archive's habit of stating facts, not moods.
 */
const LedgerNotice = ({ error = false, children, className = '' }) => (
  <p
    className={`ldg-notice ${error ? 'ldg-notice-error' : ''} ${className}`}
    role={error ? 'alert' : undefined}
  >
    {children}
  </p>
);

export default LedgerNotice;
