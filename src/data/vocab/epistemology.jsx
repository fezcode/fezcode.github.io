import React from 'react';

export default function Epistemology() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Epistemology</strong> is the branch of
        philosophy concerned with the nature, origin, and limits of human
        knowledge. It asks the terrifying question:{' '}
        <em className="opacity-80">"How do you know that you know?"</em>
      </p>

      <div className="border-l-2 border-purple-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Justified True Belief (JTB) is the classic standard, though the Gettier
        problems famously poked holes in it."
      </div>

      <p>It distinguishes between:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Propositional Knowledge:</strong> Knowing <em>that</em>{' '}
          something is true (e.g., "I know that 2+2=4").
        </li>
        <li>
          <strong>Procedural Knowledge:</strong> Knowing <em>how</em> to do
          something (e.g., "I know how to ride a bike").
        </li>
        <li>
          <strong>Acquaintance Knowledge:</strong> Knowing a person or place
          directly.
        </li>
      </ul>
    </div>
  );
}
