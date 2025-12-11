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
};
