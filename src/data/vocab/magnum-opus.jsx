import React from 'react';

export default function MagnumOpus() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Magnum Opus</strong> (Latin for "great work") refers to the largest, and perhaps the best, greatest, most popular, or most renowned achievement of an artist, philosopher, or writer.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        "It is their defining masterpiece, the culmination of their career."
      </div>

      <p>Notable examples of a Magnum Opus:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Leonardo da Vinci:</strong> The <em>Mona Lisa</em>.
        </li>
        <li>
          <strong>Ludwig van Beethoven:</strong> <em>Symphony No. 9</em>.
        </li>
        <li>
          <strong>James Joyce:</strong> <em>Ulysses</em>.
        </li>
        <li>
          <strong>Albert Einstein:</strong> The <em>Theory of General Relativity</em>.
        </li>
      </ul>
    </div>
  );
}
