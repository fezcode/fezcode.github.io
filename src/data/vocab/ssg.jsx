import React from 'react';

export default function SSG() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        <strong className="text-white">Static Site Generation (SSG)</strong> is the process of building your website's HTML pages at build time, rather than on every request.
      </p>

      <div className="bg-black p-4 border border-white/10 font-mono text-xs my-6">
        <div className="text-emerald-500 font-bold mb-2"> {'//'} SSG Workflow</div>
        <div className="text-white">1. Developer runs 'npm run build'</div>
        <div className="text-gray-400">2. Build engine (react-snap) crawls routes</div>
        <div className="text-gray-400">3. Fully rendered HTML files are saved</div>
        <div className="text-emerald-400">4. CDN serves pre-built HTML instantly</div>
      </div>

      <p>
        In Fezcodex, we use <code className="text-white">react-snap</code> to crawl our React routes and save them as static folders. This ensures that search engines and social media crawlers see the full content of the page immediately, without needing to execute JavaScript.
      </p>

      <div className="border-l-2 border-emerald-500/50 pl-4 py-1">
        <strong className="text-emerald-400 uppercase tracking-widest text-xs block mb-2">Key Benefits</strong>
        <ul className="space-y-1 text-xs text-gray-400">
          <li>-- Extreme speed (TTFB is minimal)</li>
          <li>-- Perfect SEO and Social Thumbnails</li>
          <li>-- Enhanced security (no server-side code execution)</li>
        </ul>
      </div>
    </div>
  );
}
