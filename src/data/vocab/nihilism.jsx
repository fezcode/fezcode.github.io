import React from 'react';

export default function Nihilism() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Nihilism</strong> is the philosophical rejection of general or fundamental aspects of human existence, most commonly the belief that life is meaningless.
      </p>

      <div className="border-l-2 border-gray-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "If God is dead, does anything matter?"
      </div>

      <p>
        While often associated with despair, Nietzsche argued it was a necessary transitional phase. He distinguished between:
      </p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li><strong>Passive Nihilism:</strong> Resignation, giving up ("Nothing matters, so why bother?").</li>
        <li><strong>Active Nihilism:</strong> Destruction of old values to create new ones ("Nothing matters, so I am free to create my own meaning").</li>
      </ul>
    </div>
  );
}
