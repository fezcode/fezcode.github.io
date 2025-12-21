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
    // Set document title
    if (title) {
      document.title = title;
    }

    // Set meta description
    if (description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]',
      );
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', 'description');
        newMeta.setAttribute('content', description);
        document.head.appendChild(newMeta);
      }
    }

    // Set meta keywords
    if (keywords) {
      const metaKeywords = document.querySelector('meta[name="keywords"]');
      if (metaKeywords) {
        metaKeywords.setAttribute('content', keywords);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', 'keywords');
        newMeta.setAttribute('content', keywords);
        document.head.appendChild(newMeta);
      }
    }

    // Determine default images for apps
    const isAppPath = location.pathname.startsWith('/apps');
    const defaultAppImage = '/images/asset/ogtitle-apps.png';
    const finalOgImage = ogImage || (isAppPath ? defaultAppImage : null);
    const finalTwitterImage =
      twitterImage || (isAppPath ? defaultAppImage : null);

    // Set Open Graph meta tags
    if (ogTitle) {
      const metaOgTitle = document.querySelector('meta[property="og:title"]');
      if (metaOgTitle) {
        metaOgTitle.setAttribute('content', ogTitle);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', 'og:title');
        newMeta.setAttribute('content', ogTitle);
        document.head.appendChild(newMeta);
      }
    }

    if (ogDescription) {
      const metaOgDescription = document.querySelector(
        'meta[property="og:description"]',
      );
      if (metaOgDescription) {
        metaOgDescription.setAttribute('content', ogDescription);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', 'og:description');
        newMeta.setAttribute('content', ogDescription);
        document.head.appendChild(newMeta);
      }
    }

    if (finalOgImage) {
      const metaOgImage = document.querySelector('meta[property="og:image"]');
      if (metaOgImage) {
        metaOgImage.setAttribute('content', finalOgImage);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('property', 'og:image');
        newMeta.setAttribute('content', finalOgImage);
        document.head.appendChild(newMeta);
      }
    }

    // Set Twitter card meta tags
    if (twitterCard) {
      const metaTwitterCard = document.querySelector(
        'meta[name="twitter:card"]',
      );
      if (metaTwitterCard) {
        metaTwitterCard.setAttribute('content', twitterCard);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', 'twitter:card');
        newMeta.setAttribute('content', twitterCard);
        document.head.appendChild(newMeta);
      }
    }

    if (twitterTitle) {
      const metaTwitterTitle = document.querySelector(
        'meta[name="twitter:title"]',
      );
      if (metaTwitterTitle) {
        metaTwitterTitle.setAttribute('content', twitterTitle);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', 'twitter:title');
        newMeta.setAttribute('content', twitterTitle);
        document.head.appendChild(newMeta);
      }
    }

    if (twitterDescription) {
      const metaTwitterDescription = document.querySelector(
        'meta[name="twitter:description"]',
      );
      if (metaTwitterDescription) {
        metaTwitterDescription.setAttribute('content', twitterDescription);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', 'twitter:description');
        newMeta.setAttribute('content', twitterDescription);
        document.head.appendChild(newMeta);
      }
    }

    if (finalTwitterImage) {
      const metaTwitterImage = document.querySelector(
        'meta[name="twitter:image"]',
      );
      if (metaTwitterImage) {
        metaTwitterImage.setAttribute('content', finalTwitterImage);
      } else {
        const newMeta = document.createElement('meta');
        newMeta.setAttribute('name', 'twitter:image');
        newMeta.setAttribute('content', finalTwitterImage);
        document.head.appendChild(newMeta);
      }
    }

    // Update URL meta tags (Canonical and OG URL)
    const currentUrl = window.location.origin + location.pathname;

    // OG URL
    const metaOgUrl = document.querySelector('meta[property="og:url"]');
    if (metaOgUrl) {
      metaOgUrl.setAttribute('content', currentUrl);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('property', 'og:url');
      newMeta.setAttribute('content', currentUrl);
      document.head.appendChild(newMeta);
    }

    // Twitter URL
    const metaTwitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (metaTwitterUrl) {
      metaTwitterUrl.setAttribute('content', currentUrl);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('name', 'twitter:url');
      newMeta.setAttribute('content', currentUrl);
      document.head.appendChild(newMeta);
    }

    // Canonical link
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', currentUrl);
    } else {
      canonicalLink = document.createElement('link');
            canonicalLink.setAttribute('rel', 'canonical');
            canonicalLink.setAttribute('href', currentUrl);
            document.head.appendChild(canonicalLink);
          }

          return () => {
            // Cleanup: Restore defaults from index.html on unmount
            const defaults = {
              title: 'fezcodex',
              description: 'codex by fezcode...',
              ogTitle: 'Fezcodex - Personal Blog and Projects',
              ogDescription:
                'Discover logs, posts, projects, and stories from Fezcode.',
              ogImage: '/images/asset/ogtitle.png',
              ogUrl: 'https://fezcode.com/',
              twitterCard: 'summary_large_image',
              twitterTitle: 'Fezcodex - Personal Blog and Projects',
              twitterDescription:
                'Discover logs, posts, projects, and stories from Fezcode.',
              twitterImage: '/images/asset/ogtitle.png',
              twitterUrl: 'https://fezcode.com/',
            };

            document.title = defaults.title;

            const metaDescription = document.querySelector(
              'meta[name="description"]',
            );
            if (metaDescription)
              metaDescription.setAttribute('content', defaults.description);

            const metaOgTitle = document.querySelector('meta[property="og:title"]');
            if (metaOgTitle) metaOgTitle.setAttribute('content', defaults.ogTitle);

            const metaOgDescription = document.querySelector(
              'meta[property="og:description"]',
            );
            if (metaOgDescription)
              metaOgDescription.setAttribute('content', defaults.ogDescription);

            const metaOgImage = document.querySelector('meta[property="og:image"]');
            if (metaOgImage) metaOgImage.setAttribute('content', defaults.ogImage);

            const metaOgUrl = document.querySelector('meta[property="og:url"]');
            if (metaOgUrl) metaOgUrl.setAttribute('content', defaults.ogUrl);

            const metaTwitterCard = document.querySelector(
              'meta[name="twitter:card"]',
            );
            if (metaTwitterCard)
              metaTwitterCard.setAttribute('content', defaults.twitterCard);

            const metaTwitterTitle = document.querySelector(
              'meta[name="twitter:title"]',
            );
            if (metaTwitterTitle)
              metaTwitterTitle.setAttribute('content', defaults.twitterTitle);

            const metaTwitterDescription = document.querySelector(
              'meta[name="twitter:description"]',
            );
            if (metaTwitterDescription)
              metaTwitterDescription.setAttribute('content', defaults.twitterDescription);

            const metaTwitterImage = document.querySelector(
              'meta[name="twitter:image"]',
            );
            if (metaTwitterImage)
              metaTwitterImage.setAttribute('content', defaults.twitterImage);

            const metaTwitterUrl = document.querySelector('meta[name="twitter:url"]');
            if (metaTwitterUrl)
              metaTwitterUrl.setAttribute('content', defaults.twitterUrl);

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
