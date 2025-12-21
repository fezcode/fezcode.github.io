import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function useSeo({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  twitterCard,
  twitterTitle,
  twitterDescription,
  twitterImage,
}) {
  const location = useLocation();

  useEffect(() => {
    // Helper to ensure absolute URLs
    const toAbsoluteUrl = (path) => {
      if (!path) return path;
      if (path.startsWith('http')) return path;
      return window.location.origin + (path.startsWith('/') ? '' : '/') + path;
    };

    // Only update if we have a real title (prevents snapping loading state defaults too early)
    if (!title || title === 'Fezcodex' || title === 'fezcodex') return;

    // Set document title
    document.title = title;

    // Set meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }

    // Set meta keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', Array.isArray(keywords) ? keywords.join(', ') : keywords);
    }

    // Determine default images for apps
    const isAppPath = location.pathname.startsWith('/apps');
    const defaultAppImage = '/images/asset/ogtitle-apps.png';
    const ogImagePath = ogImage || (isAppPath ? defaultAppImage : null);
    const twitterImagePath = twitterImage || (isAppPath ? defaultAppImage : null);

    const finalOgImage = toAbsoluteUrl(ogImagePath);
    const finalTwitterImage = toAbsoluteUrl(twitterImagePath);

    // Set Open Graph meta tags
    const ogTags = {
      'og:title': ogTitle || title,
      'og:description': ogDescription || description,
      'og:image': finalOgImage,
      'og:url': window.location.origin + location.pathname,
      'og:type': location.pathname.startsWith('/blog') ? 'article' : 'website',
      'og:site_name': 'Fezcodex',
    };

    Object.entries(ogTags).forEach(([prop, content]) => {
      if (!content) return;
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    if (finalOgImage?.startsWith('https')) {
      let el = document.querySelector('meta[property="og:image:secure_url"]');
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', 'og:image:secure_url');
        document.head.appendChild(el);
      }
      el.setAttribute('content', finalOgImage);
    }

    // Set Twitter card meta tags
    const twitterTags = {
      'twitter:card': twitterCard || 'summary_large_image',
      'twitter:title': twitterTitle || ogTitle || title,
      'twitter:description': twitterDescription || ogDescription || description,
      'twitter:image': finalTwitterImage || finalOgImage,
      'twitter:url': window.location.origin + location.pathname,
    };

    Object.entries(twitterTags).forEach(([name, content]) => {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    });

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', window.location.origin + location.pathname);

    return () => {
      // Cleanup: Restore defaults from index.html on unmount
      const defaults = {
        title: 'fezcodex',
        description: 'codex by fezcode...',
        ogTitle: 'Fezcodex - Personal Blog and Projects',
        ogDescription: 'Discover logs, posts, projects, and stories from Fezcode.',
        ogImage: toAbsoluteUrl('/images/asset/ogtitle.png'),
        ogUrl: 'https://fezcode.com/',
        twitterCard: 'summary_large_image',
        twitterTitle: 'Fezcodex - Personal Blog and Projects',
        twitterDescription: 'Discover logs, posts, projects, and stories from Fezcode.',
        twitterImage: toAbsoluteUrl('/images/asset/ogtitle.png'),
        twitterUrl: 'https://fezcode.com/',
      };

      document.title = defaults.title;

      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute('content', defaults.description);

      const metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (metaOgTitle) metaOgTitle.setAttribute('content', defaults.ogTitle);

      const metaOgDescription = document.querySelector('meta[property="og:description"]');
      if (metaOgDescription) metaOgDescription.setAttribute('content', defaults.ogDescription);

      const metaOgImage = document.querySelector('meta[property="og:image"]');
      if (metaOgImage) metaOgImage.setAttribute('content', defaults.ogImage);

      const metaOgUrl = document.querySelector('meta[property="og:url"]');
      if (metaOgUrl) metaOgUrl.setAttribute('content', defaults.ogUrl);

      const metaTwitterCard = document.querySelector('meta[name="twitter:card"]');
      if (metaTwitterCard) metaTwitterCard.setAttribute('content', defaults.twitterCard);

      const metaTwitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (metaTwitterTitle) metaTwitterTitle.setAttribute('content', defaults.twitterTitle);

      const metaTwitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (metaTwitterDescription) metaTwitterDescription.setAttribute('content', defaults.twitterDescription);

      const metaTwitterImage = document.querySelector('meta[name="twitter:image"]');
      if (metaTwitterImage) metaTwitterImage.setAttribute('content', defaults.twitterImage);

      const metaTwitterUrl = document.querySelector('meta[name="twitter:url"]');
      if (metaTwitterUrl) metaTwitterUrl.setAttribute('content', defaults.twitterUrl);

      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) canonicalLink.setAttribute('href', defaults.ogUrl);
    };
  }, [
    location.pathname,
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    twitterCard,
    twitterTitle,
    twitterDescription,
    twitterImage,
  ]);
}

export default useSeo;