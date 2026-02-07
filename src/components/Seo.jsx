import React from 'react';
import { useLocation } from 'react-router-dom';

const BASE_URL = 'https://fezcode.com';

/**
 * Seo Component - A React 19 compatible component for managing site metadata.
 * It renders meta tags directly in the component tree, which React 19 hoists to the <head>.
 * This ensures that static site generators like react-snap can capture the metadata
 * even before hydration, as long as the component is rendered.
 */
const Seo = ({
  title,
  description,
  image,
  keywords,
  ogImage,
  twitterImage,
  type,
}) => {
  const location = useLocation();

  if (!title || title === 'Fezcodex' || title === 'fezcodex') return null;

  const currentUrl = BASE_URL + location.pathname;
  const isAppPath = location.pathname.startsWith('/apps');
  const defaultImage = isAppPath
    ? '/images/asset/ogtitle-apps.png'
    : '/images/asset/ogtitle.png';
  const rawImage = image || ogImage || twitterImage || defaultImage;
  const finalImage = rawImage.startsWith('http')
    ? rawImage
    : BASE_URL + (rawImage.startsWith('/') ? '' : '/') + rawImage;

  const finalKeywords = Array.isArray(keywords)
    ? keywords.join(', ')
    : keywords;
  const finalType =
    type || (location.pathname.startsWith('/blog') ? 'article' : 'website');

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      {finalKeywords && <meta name="keywords" content={finalKeywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:type" content={finalType} />
      <meta property="og:site_name" content="Fezcodex" />
      {finalImage.startsWith('https') && (
        <meta property="og:image:secure_url" content={finalImage} />
      )}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:url" content={currentUrl} />

      {/* Canonical */}
      <link rel="canonical" href={currentUrl} />
    </>
  );
};

export default Seo;
