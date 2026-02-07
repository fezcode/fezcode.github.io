import React from 'react';

export default function CSR() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-current">Client-Side Rendering (CSR)</strong> is
        a web development technique where the browser downloads a minimal HTML
        file and a large JavaScript bundle. The JavaScript then executes and
        builds the entire user interface on the fly.
      </p>

      <div className="bg-black p-4 border border-white/10 font-mono text-xs my-6">
        <div className="text-gray-500 font-bold mb-2">
          {' '}
          {'//'} CSR Initial HTML
        </div>
        <div className="text-blue-400">{'<html>'}</div>
        <div className="text-blue-400 pl-4">{'<body>'}</div>
        <div className="text-white pl-8">{'<div id="root"></div>'}</div>
        <div className="text-white pl-8">
          {'<script src="bundle.js"></script>'}
        </div>
        <div className="text-blue-400 pl-4">{'</body>'}</div>
        <div className="text-blue-400">{'</html>'}</div>
      </div>

      <p>
        Most standard React apps use CSR. While powerful for interactivity, it
        has a "blank white screen" problem during the initial load and is often
        invisible to search engine crawlers that don't execute JavaScript.
      </p>

      <div className="border-l-2 border-white/20 pl-4 py-1">
        <strong className="text-current uppercase tracking-wider text-xs block mb-1">
          Comparison
        </strong>
        <span className="text-gray-400 text-xs">
          Unlike SSG, where the HTML is ready before it reaches the browser, CSR
          requires the user's device to do the heavy lifting of rendering.
        </span>
      </div>
    </div>
  );
}
