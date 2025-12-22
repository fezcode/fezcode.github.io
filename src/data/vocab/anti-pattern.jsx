import React from 'react';

export default function AntiPattern() {
  return (
    <div className="space-y-4">
      <p>
        An <strong>Anti-Pattern</strong> is a common response to a recurring
        problem that is usually ineffective and risks being highly
        counterproductive.
      </p>
      <p>
        It's a solution that looks good on the surface but has bad consequences
        in the long run.
      </p>
      <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
        <h4 className="text-sm font-bold text-red-400 mb-2">
          Common React Anti-Patterns:
        </h4>
        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
          <li>Prop Drilling (passing props down 5+ levels)</li>
          <li>Defining components inside other components</li>
          <li>Using indexes as keys in lists (when items can change order)</li>
          <li>Mutating state directly</li>
        </ul>
      </div>
    </div>
  );
}
