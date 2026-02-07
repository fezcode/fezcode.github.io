import React from 'react';

export default function TranscendentalIdealism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Transcendental Idealism</strong> is a doctrine founded by Immanuel Kant. It argues that the human mind shapes the reality we perceive.
      </p>

      <div className="border-l-2 border-cyan-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "We don't see things as they are; we see them as we are."
      </div>

      <p>
        Kant distinguished between:
      </p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li><strong>Phenomena:</strong> Things as they appear to us (filtered through space, time, and causality).</li>
        <li><strong>Noumena:</strong> Things-in-themselves (reality independent of our senses), which we can never truly know.</li>
      </ul>
    </div>
  );
}
