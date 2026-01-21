import React from 'react';

export default function AntiPattern() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        An <strong className="text-current">Anti-Pattern</strong> is a common response to a recurring
        problem that is usually ineffective and risks being highly
        counterproductive.
      </p>
      <p>
        It's a solution that looks good on the surface but has bad consequences
        in the long run.
      </p>

      <div className="border-l-2 border-red-500/50 pl-4 py-2 my-6">
        <h4 className="text-xs font-bold text-red-400 uppercase tracking-widest mb-3">
          Common React Anti-Patterns
        </h4>
        <ul className="space-y-2 text-xs text-gray-400">
          <li>-- Prop Drilling (passing props down 5+ levels)</li>
          <li>-- Defining components inside other components</li>
          <li>-- Using indexes as keys in lists (when items can change order)</li>
          <li>-- Mutating state directly</li>
        </ul>
      </div>
    </div>
  );
}
