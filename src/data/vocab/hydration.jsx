import React from 'react';

export default function Hydration() {
  return (
    <div className="space-y-4">
      <p>
        <strong>Hydration</strong> is the process of a client-side JavaScript library (like React) "attaching" itself to a static HTML page that was already rendered by the server or a build tool.
      </p>
      <div className="flex justify-center py-4">
        <div className="flex flex-col items-center gap-2 border border-dashed border-gray-700 p-4">
          <span className="text-gray-500 text-xs uppercase">Static HTML (Dry)</span>
          <span className="text-xl">↓</span>
          <span className="text-emerald-500 font-bold uppercase">React Event Listeners (Water)</span>
          <span className="text-xl">↓</span>
          <span className="text-blue-400 font-bold uppercase">Interactive App (Hydrated)</span>
        </div>
      </div>
      <p>
        In the Fezcodex architecture, we use <code>ReactDOM.hydrateRoot</code>. When the browser loads the pre-rendered HTML (from SSG), React checks the content and makes it interactive without throwing away the existing DOM nodes. This provides the fast visual load of a static site with the interactivity of a dynamic app.
      </p>
    </div>
  );
}
