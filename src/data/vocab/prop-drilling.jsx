import React from 'react';

export default function PropDrilling() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-white">Prop Drilling</strong> (also known as "threading") refers to the
        process of passing data from a parent component down to a deeply nested
        child component through intermediate components that do not need the
        data themselves.
      </p>

      <div className="border border-white/10 bg-black p-4 font-mono text-xs my-6">
        <div className="text-blue-400">{'<App data={data} />'}</div>
        <div className="pl-4 text-gray-600">{'↓'}</div>
        <div className="pl-4 text-purple-400">{'<Layout data={data} />'}</div>
        <div className="pl-8 text-gray-600">{'↓'}</div>
        <div className="pl-8 text-green-400">{'<Page data={data} />'}</div>
        <div className="pl-12 text-gray-600">{'↓'}</div>
        <div className="pl-12 text-red-400">
          {'<DeepComponent data={data} />'}
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-gray-400">
          While simple, it becomes problematic as the application grows, leading to:
        </p>
        <ul className="list-none space-y-1 text-xs text-gray-500 pl-4 border-l border-white/10">
          <li>-- Code verbosity</li>
          <li>-- Tight coupling between components</li>
          <li>-- Difficulty in refactoring</li>
          <li>-- Unnecessary re-renders</li>
        </ul>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <strong className="text-emerald-400 uppercase tracking-wider text-xs block mb-2">Solution</strong>
        <p>Use the <em className="text-white not-italic">Context API</em>, <em className="text-white not-italic">Redux</em>, or similar state management libraries to make data accessible to any component in the tree without manual passing.</p>
      </div>
    </div>
  );
}
