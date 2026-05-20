import React, { useEffect } from 'react';

const SitemapPage = () => {
  useEffect(() => {
    // Delay the navigation so Puppeteer's prerender snapshot completes first.
    // The cleanup cancels the timer when the page is closed (during prerender),
    // so the redirect only fires for real visitors.
    const t = setTimeout(() => {
      window.location.href = '/sitemap.xml';
    }, 1500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="p-10 text-center text-white text-xl">
      <h1>
        Redirecting to{' '}
        <a href="/sitemap.xml" className="underline">
          sitemap.xml
        </a>
        ...
      </h1>
    </div>
  );
};

export default SitemapPage;
