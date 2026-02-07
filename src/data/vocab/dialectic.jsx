import React from 'react';

export default function Dialectic() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        The <strong className="text-current">Hegelian Dialectic</strong> is a framework for understanding progress and history. It is often simplified as a three-step process:
      </p>

      <div className="border-l-2 border-purple-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "Conflict is the engine of progress."
      </div>

      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li><strong>Thesis:</strong> An initial idea or status quo.</li>
        <li><strong>Antithesis:</strong> The conflicting idea or reaction.</li>
        <li><strong>Synthesis:</strong> The resolution that merges the best of both, becoming the new thesis.</li>
      </ul>
    </div>
  );
}
