import React from 'react';

export default function AdHoc() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        An <strong className="text-current">Ad Hoc</strong> (Latin for "to this") argument or rescue is an explanation entirely invented after the fact to save a flawed theory from being disproven.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1 italic opacity-70 text-xs">
        Changing the rules of the game just so you don't lose.
      </div>

      <p>Key characteristics:</p>
      <ul className="space-y-2 text-xs opacity-80 list-disc pl-4">
        <li>
          <strong>Post-Facto:</strong> It is not a prediction or a premise; it is an excuse created exactly at the moment it is needed.
        </li>
        <li>
          <strong>Untestable:</strong> Often, the ad hoc rescue introduces a new variable that cannot be independently tested or verified. E.g., "The psychic's powers didn't work because your negative energy interfered with them."
        </li>
        <li>
          <strong>Complexity:</strong> It violates Occam's Razor by constantly adding new, unnecessary complexities to a theory just to keep it alive.
        </li>
      </ul>
    </div>
  );
}
