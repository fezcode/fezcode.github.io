import React from 'react';

export default function SideEffects() {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="flex items-center gap-2 text-sm font-bold text-purple-400 mb-2">
          <span className="text-lg">💊</span> Medicine
        </h4>
        <p className="text-gray-300 text-sm">
          An unintended secondary effect of a medication or treatment. While often negative (e.g., drowsiness, nausea), they can sometimes be beneficial or neutral. In the context of the show, this likely refers to the unexpected consequences of the "miracle cure."
        </p>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <h4 className="flex items-center gap-2 text-sm font-bold text-blue-400 mb-2">
          <span className="text-lg">💻</span> Computer Science
        </h4>
        <p className="text-gray-300 text-sm mb-2">
          A function or expression is said to have a <strong>side effect</strong> if it modifies some state outside its local environment or has an observable interaction with the outside world.
        </p>
        <div className="bg-black/50 p-3 rounded border border-gray-800 my-3 font-mono text-xs overflow-x-auto">
          <div className="text-gray-500">// Impure (Side Effect)</div>
          <span className="text-purple-300">let</span> <span className="text-blue-300">count</span> = <span className="text-orange-300">0</span>;
          <br />
          <span className="text-purple-300">function</span> <span className="text-yellow-300">increment</span>() {'{'}
          <br />
          &nbsp;&nbsp;<span className="text-blue-300">count</span>++; <span className="text-gray-500">// Modifies external state!</span>
          <br />
          {'}'}
        </div>
        <ul className="list-disc pl-5 space-y-1 text-gray-400 text-xs font-mono">
          <li>Modifying a global variable</li>
          <li>Writing to a file or database</li>
          <li><code>console.log()</code></li>
          <li>DOM manipulation</li>
        </ul>
        <p className="text-gray-500 text-xs mt-3 italic">
          In <strong>Functional Programming</strong>, side effects are avoided to ensure functions are "pure" (deterministic).
        </p>
      </div>
    </div>
  );
}