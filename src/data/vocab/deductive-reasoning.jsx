import React from 'react';

export default function DeductiveReasoning() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Deductive Reasoning</strong> (or top-down logic) is the process of reasoning from one or more general statements (premises) to reach a logically certain conclusion.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        If A = B and B = C, then A = C.
      </div>

      <p>Key properties of deductive arguments:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Validity:</strong> An argument is valid if its conclusion logically follows from its premises, regardless of whether the premises are true.
        </li>
        <li>
          <strong>Soundness:</strong> An argument is sound if it is both valid AND its premises are actually true.
        </li>
        <li>
          <strong>Certainty:</strong> Unlike inductive reasoning, deductive reasoning guarantees a conclusion if the premises are correct.
        </li>
      </ul>
    </div>
  );
}
