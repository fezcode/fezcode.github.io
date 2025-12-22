import React from 'react';

export default function SPA() {
  return (
    <div className="space-y-4">
      <p>
        A <strong>Single Page Application (SPA)</strong> is a web application that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of the default method of a browser loading entire new pages.
      </p>
      <div className="bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/20 font-mono text-xs">
        <div className="text-gray-500 font-bold"> {'//'} SPA Navigation</div>
        <div className="text-white">User clicks "Blog"</div>
        <div className="text-white">{'->'} URL changes to /blog (via client router)</div>
        <div className="text-white">{'->'} Component updates without reload</div>
        <div className="text-white">{'->'} Perceived speed: Instant</div>
      </div>
      <p>
        Fezcodex uses <code>react-router-dom</code> to manage its SPA behavior. Originally using <code>HashRouter</code>, we transitioned to <code>BrowserRouter</code> to support cleaner URLs and better integration with SSG tools.
      </p>
    </div>
  );
}
