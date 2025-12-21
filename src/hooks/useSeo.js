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
