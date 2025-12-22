import {useEffect} from 'react';
import {useLocation} from 'react-router-dom';

const BASE_URL = 'https://fezcode.com';

/**
 * useSeo - A simplified hook for managing site metadata.
 * Standardizes Title, Description, and Image across all platforms (OG, Twitter, etc.)
 */
function useSeo({title, description, image, keywords, ogImage, twitterImage}) {
  const location = useLocation();

  useEffect(() => {
    // 1. Only update if we have a valid title
    if (!title || title === 'Fezcodex' || title === 'fezcodex') return;

    // 2. Prepare standardized values
    const currentUrl = BASE_URL + location.pathname;
    // Determine default image based on path
    const isAppPath = location.pathname.startsWith('/apps');
    const defaultImage = isAppPath ? '/images/asset/ogtitle-apps.png' : '/images/asset/ogtitle.png';
    // Pick the first available image, fallback to default
    const rawImage = image || ogImage || twitterImage || defaultImage;
    const finalImage = rawImage.startsWith('http')
      ? rawImage
      : BASE_URL + (rawImage.startsWith('/') ? '' : '/') + rawImage;
    // 3. Helper to update/create meta tags
    const setMeta = (attrName, attrValue, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attrName}="${attrValue}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // 4. Update Document Title
    document.title = title;

    // 5. Update Standard Meta Tags
    setMeta('name', 'description', description);
    if (keywords) {
      setMeta('name', 'keywords', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }

    // 6. Update Open Graph Tags (Standardized)
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', finalImage);
    if (finalImage.toLowerCase().endsWith('.webp')) {
      setMeta('property', 'og:image:type', 'image/webp');
    } else if (finalImage.toLowerCase().endsWith('.png')) {
      setMeta('property', 'og:image:type', 'image/png');
    } else if (finalImage.toLowerCase().endsWith('.jpg') || finalImage.toLowerCase().endsWith('.jpeg')) {
      setMeta('property', 'og:image:type', 'image/jpeg');
    }

    setMeta('property', 'og:url', currentUrl);
    setMeta('property', 'og:type', location.pathname.startsWith('/blog') ? 'article' : 'website');
    setMeta('property', 'og:site_name', 'Fezcodex');
    if (finalImage.startsWith('https')) {
      setMeta('property', 'og:image:secure_url', finalImage);
    }

    // 7. Update Twitter Tags (Standardized)
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', finalImage);
    setMeta('name', 'twitter:url', currentUrl);

    // 8. Update Canonical Link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);
  }, [location.pathname, title, description, image, keywords, ogImage, twitterImage]);
}

export default useSeo;
