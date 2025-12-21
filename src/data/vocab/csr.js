import React from 'react';

export default function CSR() {
  return (
    <div className="space-y-4">
      <p>
        <strong>Client-Side Rendering (CSR)</strong> is a web development technique where the browser downloads a minimal HTML file and a large JavaScript bundle. The JavaScript then executes and builds the entire user interface on the fly.
      </p>
      <div className="bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/20 font-mono text-xs">
        <div className="text-gray-500 font-bold">// CSR Initial HTML</div>
        <div className="text-white">{'<html>'}</div>
        <div className="text-white">{'  <body>'}</div>
        <div className="text-white">{'    <div id="root"></div>'}</div>
        <div className="text-white">{'    <script src="bundle.js"></script>'}</div>
        <div className="text-white">{'  </body>'}</div>
        <div className="text-white">{'</html>'}</div>
      </div>
      <p>
        Most standard React apps use CSR. While powerful for interactivity, it has a "blank white screen" problem during the initial load and is often invisible to search engine crawlers that don't execute JavaScript.
      </p>
      <p>
        <strong>Comparison:</strong> Unlike SSG, where the HTML is ready before it reaches the browser, CSR requires the user's device to do the heavy lifting of rendering.
      </p>
    </div>
  );
}
