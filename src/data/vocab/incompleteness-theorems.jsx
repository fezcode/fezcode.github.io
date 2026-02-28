import React from 'react';

export default function IncompletenessTheorems() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        Gödel's <strong className="text-current">Incompleteness Theorems</strong> are two mathematical theorems proving inherent limitations in every formal axiomatic system capable of modeling basic arithmetic.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "This statement cannot be proven."
      </div>

      <p>The core implications:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>First Theorem:</strong> Any consistent formal system that is complex enough to do arithmetic will contain statements that are true, but cannot be proven within that system.
        </li>
        <li>
          <strong>Second Theorem:</strong> Such a system cannot demonstrate its own consistency. It cannot prove that it won't produce a contradiction.
        </li>
        <li>
          <strong>The End of the Dream:</strong> This destroyed the early 20th-century mathematical dream (championed by David Hilbert) of creating a single, complete, and perfectly consistent set of rules for all of mathematics.
        </li>
      </ul>
    </div>
  );
}
