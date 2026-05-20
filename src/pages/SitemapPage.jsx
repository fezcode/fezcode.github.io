import React, { useEffect } from 'react';

const SitemapPage = () => {
  useEffect(() => {
    window.location.replace('/sitemap.xml');
  }, []);

  return (
    <div className="p-10 text-center text-white text-xl">
      <meta httpEquiv="refresh" content="0; url=/sitemap.xml" />
      <h1>
        Redirecting to <a href="/sitemap.xml" className="underline">sitemap.xml</a>...
      </h1>
    </div>
  );
};

export default SitemapPage;
