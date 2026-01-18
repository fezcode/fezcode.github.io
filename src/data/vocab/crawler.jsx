import React from 'react';

export default function Crawler() {
  return (
    <div className="space-y-6 font-mono text-sm leading-relaxed">
      <p>
        A <strong className="text-white">Crawler</strong> (or bot) is an automated program that visits websites to index content for search
        engines (like Google) or to generate link previews for social media (like Twitter and Discord).
      </p>

      <div className="pl-4 border-l-2 border-emerald-500 py-2 my-6 text-xs text-gray-400 italic">
        "I visit the URL, read the meta tags, and report back what I found."
      </div>

      <p>
        Most crawlers are simple: they fetch the <code className="text-emerald-400">index.html</code> and look at the source code. If your site
        relies entirely on JavaScript to render its content (CSR), the crawler sees a blank page.
      </p>
      <p>
        By using <strong className="text-white">Static Site Generation (SSG)</strong>, we ensure that every route on Fezcodex has a unique HTML
        file that any crawler can read, ensuring perfect SEO and rich social thumbnails.
      </p>
    </div>
  );
}
