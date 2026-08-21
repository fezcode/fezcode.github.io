import React from 'react';

/**
 * A dotted-leader row — label ·········· value — the ledger's signature
 * structural device, connecting a name to its figure the way a hand-ruled
 * account book does.
 */
const LedgerLeader = ({ label, value, className = '' }) => (
  <div className={`ldg-leader-row ${className}`}>
    <span className="ldg-label">{label}</span>
    <span className="ldg-leader" aria-hidden="true" />
    <span className="ldg-highlight" style={{ fontVariantNumeric: 'tabular-nums' }}>
      {value}
    </span>
  </div>
);

export default LedgerLeader;
