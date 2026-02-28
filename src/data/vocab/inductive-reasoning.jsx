import React from 'react';

export default function InductiveReasoning() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Inductive Reasoning</strong> (or bottom-up logic) is a method of reasoning in which a body of observations is synthesized to come up with a general principle.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Every swan I've seen is white; therefore, all swans are white."
      </div>

      <p>Key characteristics:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Probability:</strong> Inductive conclusions are never 100% certain; they are only probable based on the evidence.
        </li>
        <li>
          <strong>Scientific Method:</strong> Inductive reasoning is the foundation of scientific inquiry, allowing us to form hypotheses and theories.
        </li>
        <li>
          <strong>Vulnerability:</strong> A single counter-example (like a black swan) can invalidate a strong inductive conclusion.
        </li>
      </ul>
    </div>
  );
}
