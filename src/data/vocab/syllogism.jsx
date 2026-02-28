import React from 'react';

export default function Syllogism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Syllogism</strong> is a kind of logical argument that applies deductive reasoning to arrive at a conclusion based on two propositions that are asserted or assumed to be true.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "All men are mortal. Socrates is a man. Therefore, Socrates is mortal."
      </div>

      <p>It consists of three parts:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Major Premise:</strong> A general statement.
        </li>
        <li>
          <strong>Minor Premise:</strong> A specific statement related to the major premise.
        </li>
        <li>
          <strong>Conclusion:</strong> The logical result drawn from the premises.
        </li>
      </ul>
      <p>
        Popularized by Aristotle, the syllogism is the absolute bedrock of classical deductive logic.
      </p>
    </div>
  );
}
