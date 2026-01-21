import React from 'react';

export default function SPA() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-current">Single Page Application (SPA)</strong> is a web application that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of the default method of a browser loading entire new pages.
      </p>

      <div className="bg-black p-4 border border-white/10 font-mono text-xs my-6">
        <div className="text-gray-500 font-bold mb-2"> {'//'} SPA Navigation</div>
        <div className="text-current">User clicks "Blog"</div>
        <div className="text-gray-500 pl-4">{'->'} URL changes to /blog (via client router)</div>
        <div className="text-gray-500 pl-4">{'->'} Component updates without reload</div>
        <div className="text-emerald-500 pl-4">{'->'} Perceived speed: Instant</div>
      </div>

      <p>
        Fezcodex uses <code className="text-current">react-router-dom</code> to manage its SPA behavior. Originally using <code className="text-current">HashRouter</code>, we transitioned to <code className="text-current">BrowserRouter</code> to support cleaner URLs and better integration with SSG tools.
      </p>
    </div>
  );
}
