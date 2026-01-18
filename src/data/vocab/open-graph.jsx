import React from 'react';

export default function OpenGraph() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        The <strong className="text-white">Open Graph (OG)</strong> protocol is a set of rules used to enable any web page to become a rich object in a social graph. It was originally created by Facebook.
      </p>

      <div className="bg-black p-4 border border-white/10 font-mono text-xs my-6">
        <div className="text-gray-500 font-bold mb-2"> {'//'} Example OG Tags</div>
        <div className="text-blue-400">{'<meta property="og:title" content="..." />'}</div>
        <div className="text-blue-400">{'<meta property="og:description" content="..." />'}</div>
        <div className="text-blue-400">{'<meta property="og:image" content="..." />'}</div>
        <div className="text-blue-400">{'<meta property="og:url" content="..." />'}</div>
      </div>

      <p>
        When you share a link on platforms like Discord, Twitter (X), or LinkedIn, their systems look for these specific meta tags to generate the title, description, and thumbnail image you see in the preview.
      </p>
      <p>
        By using <strong className="text-white">Static Site Generation (SSG)</strong>, Fezcodex ensures these tags are hard-coded into the HTML of every page, allowing social media bots to read them even if they don't support JavaScript.
      </p>
    </div>
  );
}
