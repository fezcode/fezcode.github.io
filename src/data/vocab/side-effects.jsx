import React from 'react';

export default function SideEffects() {
  return (
    <div className="space-y-8 font-mono text-sm leading-relaxed">
      <div>
        <h4 className="text-xs font-bold text-purple-400 uppercase tracking-widest mb-2 border-b border-purple-500/20 pb-1 w-fit">
          Medicine
        </h4>
        <p className="text-gray-400 text-xs">
          An unintended secondary effect of a medication or treatment. While
          often negative (e.g., drowsiness, nausea), they can sometimes be
          beneficial or neutral. In the context of the show, this likely refers
          to the unexpected consequences of the "miracle cure."
        </p>
      </div>

      <div className="border-t border-white/10 pt-6">
        <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4 border-b border-blue-500/20 pb-1 w-fit">
          Computer Science
        </h4>
        <p className="text-gray-400 text-xs mb-4">
          A function or expression is said to have a{' '}
          <strong className="text-white">side effect</strong> if it modifies some state outside its
          local environment or has an observable interaction with the outside
          world.
        </p>

        <div className="bg-black p-4 border border-white/10 my-4 font-mono text-xs overflow-x-auto">
          <div className="text-gray-500 mb-2">{'//'} Impure (Side Effect)</div>
          <span className="text-purple-400">let</span>{' '}
          <span className="text-blue-400">count</span> ={' '}
          <span className="text-orange-400">0</span>;
          <br />
          <span className="text-purple-400">function</span>{' '}
          <span className="text-yellow-400">increment</span>() {'{'}
          <br />
          &nbsp;&nbsp;<span className="text-blue-400">count</span>++;{' '}
          <span className="text-gray-500">{'//'} Modifies external state!</span>
          <br />
          {'}'}
        </div>

        <ul className="space-y-1 text-gray-500 text-xs pl-4 border-l border-white/10">
          <li>-- Modifying a global variable</li>
          <li>-- Writing to a file or database</li>
          <li>-- <code>console.log()</code></li>
          <li>-- DOM manipulation</li>
        </ul>

        <p className="text-gray-500 text-xs mt-4 italic border-t border-white/5 pt-2">
          In <strong className="text-white not-italic">Functional Programming</strong>, side effects are avoided
          to ensure functions are "pure" (deterministic).
        </p>
      </div>
    </div>
  );
}
