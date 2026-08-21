import React from 'react';
import useLedgerPalette from './useLedgerPalette';

/**
 * The register cycler — the Ledger theme's flagship control. One press turns
 * the whole codex to the next register: PAPER → SLATE → CARBON → PHOSPHOR →
 * AMBER. Lives in the sidebar and the footer so a reader is never far from
 * changing the ink.
 */
const LedgerRegister = ({ className = '' }) => {
  const { registerLabel, cycleRegister } = useLedgerPalette();

  return (
    <button
      type="button"
      className={`ldg-btn ${className}`}
      onClick={cycleRegister}
      aria-label={`Change register, currently ${registerLabel}`}
    >
      REGISTER [{registerLabel}]
    </button>
  );
};

export default LedgerRegister;
