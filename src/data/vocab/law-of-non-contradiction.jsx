import React from 'react';

export default function LawOfNonContradiction() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        The <strong className="text-current">Law of Non-Contradiction</strong> is a foundational rule of logic stating that contradictory propositions cannot both be true in the same sense at the same time.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "A cannot be both B and non-B simultaneously."
      </div>

      <p>Why it matters:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>The Bedrock of Rationality:</strong> First formalized by Aristotle, it is the rule that makes meaningful communication possible. If a statement can be both true and false, truth loses all meaning.
        </li>
        <li>
          <strong>The Principle of Explosion:</strong> In classical logic, if you accept a contradiction, you can logically prove literally anything (ex falso quodlibet). The whole system collapses.
        </li>
      </ul>
    </div>
  );
}
