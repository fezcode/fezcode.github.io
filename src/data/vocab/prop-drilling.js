import React from 'react';

export default {
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
};
