import React from 'react';

export default function Absurdism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Absurdism</strong> defines the
        fundamental conflict between the human tendency to seek inherent value
        and meaning in life, and the "silent," purposeless universe that offers
        none.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "One must imagine Sisyphus happy."
      </div>

      <p>Albert Camus argued there are three solutions to the Absurd:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Suicide:</strong> (Rejected) Escaping existence.
        </li>
        <li>
          <strong>Philosophical Suicide:</strong> (Rejected) Leap of
          faith/religion to create fake meaning.
        </li>
        <li>
          <strong>Revolt:</strong> (Accepted) Accepting the Absurd and living
          anyway.
        </li>
      </ul>
    </div>
  );
}
