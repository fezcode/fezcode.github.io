import React from 'react';

export default function OpenGraph() {
  return (
    <div className="space-y-4">
      <p>
        The <strong>Open Graph (OG)</strong> protocol is a set of rules used to enable any web page to become a rich object in a social graph. It was originally created by Facebook.
      </p>
      <div className="bg-emerald-500/5 p-4 rounded-sm border border-emerald-500/20 font-mono text-xs">
        <div className="text-gray-500 font-bold">// Example OG Tags</div>
        <div className="text-white">{'<meta property="og:title" content="..." />'}</div>
        <div className="text-white">{'<meta property="og:description" content="..." />'}</div>
        <div className="text-white">{'<meta property="og:image" content="..." />'}</div>
        <div className="text-white">{'<meta property="og:url" content="..." />'}</div>
      </div>
      <p>
        When you share a link on platforms like Discord, Twitter (X), or LinkedIn, their systems look for these specific meta tags to generate the title, description, and thumbnail image you see in the preview.
      </p>
      <p>
        By using <strong>Static Site Generation (SSG)</strong>, Fezcodex ensures these tags are hard-coded into the HTML of every page, allowing social media bots to read them even if they don't support JavaScript.
      </p>
    </div>
  );
}
