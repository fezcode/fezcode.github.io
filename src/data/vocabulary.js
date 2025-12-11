import React from 'react';

export const vocabulary = {
  'prop-drilling': {
    title: 'Prop Drilling',
    content: (
      <div className="space-y-4">
        <p>
          <strong>Prop Drilling</strong> (also known as "threading") refers to the process of passing data from a parent component down to a deeply nested child component through intermediate components that do not need the data themselves.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 font-mono text-xs">
          <div className="text-blue-400">{'<App data={data} />'}</div>
          <div className="pl-4 text-gray-500">{'↓'}</div>
          <div className="pl-4 text-purple-400">{'<Layout data={data} />'}</div>
          <div className="pl-8 text-gray-500">{'↓'}</div>
          <div className="pl-8 text-green-400">{'<Page data={data} />'}</div>
          <div className="pl-12 text-gray-500">{'↓'}</div>
          <div className="pl-12 text-red-400">{'<DeepComponent data={data} />'}</div>
        </div>
        <p>
          While simple, it becomes problematic as the application grows, leading to:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-gray-400">
          <li>Code verbosity</li>
          <li>Tight coupling between components</li>
          <li>Difficulty in refactoring</li>
          <li>Unnecessary re-renders</li>
        </ul>
        <p>
          <strong>Solution:</strong> Use the <em>Context API</em>, <em>Redux</em>, or similar state management libraries to make data accessible to any component in the tree without manual passing.
        </p>
      </div>
    ),
  },
  'context-api': {
    title: 'Context API',
    content: (
      <div className="space-y-4">
        <p>
          The <strong>Context API</strong> is a React feature that enables you to share values (like global settings, user auth, or themes) between components without having to explicitly pass a prop through every level of the tree.
        </p>
      </div>
    )
  },
  'anti-pattern': {
    title: 'Anti-Pattern',
    content: (
      <div className="space-y-4">
        <p>
          An <strong>Anti-Pattern</strong> is a common response to a recurring problem that is usually ineffective and risks being highly counterproductive.
        </p>
        <p>
          It's a solution that looks good on the surface but has bad consequences in the long run.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h4 className="text-sm font-bold text-red-400 mb-2">Common React Anti-Patterns:</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-400">
            <li>Prop Drilling (passing props down 5+ levels)</li>
            <li>Defining components inside other components</li>
            <li>Using indexes as keys in lists (when items can change order)</li>
            <li>Mutating state directly</li>
          </ul>
        </div>
      </div>
    ),
  },
  'pluribus': {
    title: 'Pluribus',
    content: (
      <div className="space-y-4">
        <p>
          <strong>Pluribus</strong> is Latin for "from many" or "more". It is most famously known as part of the United States motto <em>E pluribus unum</em> ("Out of many, one").
        </p>
        <p>
          Thematically, it represents the concept of <strong>unity from diversity</strong>.
        </p>
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
          <p>
            In the context of sci-fi or hive-mind narratives, "Pluribus" often ironically contrasts the loss of individual identity against the strength of the collective.
          </p>
        </div>
      </div>
    ),
  },
  'side-effects': {
    title: 'Side Effects',
    content: (
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
    ),
  },
};
