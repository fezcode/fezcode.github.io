import React from 'react';

export default function SSG() {
  return (
    <div className="space-y-4">
      <p>
        <strong>Static Site Generation (SSG)</strong> is the process of building your website's HTML pages at build time, rather than on every request.
      </p>
      <div className="bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/20 font-mono text-xs">
        <div className="text-emerald-500 font-bold"> {'//'} SSG Workflow</div>
        <div className="text-white">1. Developer runs 'npm run build'</div>
        <div className="text-white">2. Build engine (react-snap) crawls routes</div>
        <div className="text-white">3. Fully rendered HTML files are saved</div>
        <div className="text-white">4. CDN serves pre-built HTML instantly</div>
      </div>
      <p>
        In Fezcodex, we use <code>react-snap</code> to crawl our React routes and save them as static folders. This ensures that search engines and social media crawlers see the full content of the page immediately, without needing to execute JavaScript.
      </p>
      <p>
        <strong>Key Benefits:</strong>
      </p>
      <ul className="list-disc pl-5 space-y-1 text-gray-400">
        <li>Extreme speed (TTFB is minimal)</li>
        <li>Perfect SEO and Social Thumbnails</li>
        <li>Enhanced security (no server-side code execution)</li>
      </ul>
    </div>
  );
}
