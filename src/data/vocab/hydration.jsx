import React from 'react';

export default function Hydration() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Hydration</strong> is the process of a client-side JavaScript library (like React) "attaching" itself to a static HTML page that was already rendered by the server or a build tool.
      </p>

      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center gap-4 border border-white/10 p-6 bg-white/[0.02]">
          <span className="text-gray-500 text-xs uppercase tracking-widest font-bold">Static HTML (Dry)</span>
          <span className="text-xl text-current">↓</span>
          <span className="text-emerald-500 font-bold uppercase tracking-widest text-xs">React Event Listeners</span>
          <span className="text-xl text-current">↓</span>
          <span className="text-blue-400 font-bold uppercase tracking-widest text-xs">Interactive App (Hydrated)</span>
        </div>
      </div>

      <p>
        In the Fezcodex architecture, we use <code className="text-current">ReactDOM.hydrateRoot</code>. When the browser loads the pre-rendered HTML (from SSG), React checks the content and makes it interactive without throwing away the existing DOM nodes. This provides the fast visual load of a static site with the interactivity of a dynamic app.
      </p>
    </div>
  );
}
