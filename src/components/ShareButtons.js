import React from 'react';
import {
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  LinkSimple,
  WhatsappLogo,
  RedditLogo, // Added RedditLogo
} from '@phosphor-icons/react';
import { useToast } from '../hooks/useToast';

const ShareButtons = ({ title, url }) => {
  const { addToast } = useToast();

  const shareViaWebShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          url: url,
        });
        console.log('Shared successfully');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        addToast({
          title: 'Success',
          message: 'Link copied to clipboard!',
          duration: 3000,
        });
      },
      (err) => {
        addToast({
          title: 'Error',
          message: 'Failed to copy link!',
          duration: 3000,
        });
        console.error('Async: Could not copy text: ', err);
      },
    );
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        title,
      )}&url=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const shareOnFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      '_blank',
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url,
      )}&title=${encodeURIComponent(title)}`,
      '_blank',
    );
  };

  const shareOnWhatsApp = () => {
    window.open(
      `https://api.whatsapp.com/send?text=${encodeURIComponent(
        `${title} ${url}`,
      )}`,
      '_blank',
    );
  };

  const shareOnReddit = () => {
    window.open(
      `https://www.reddit.com/submit?url=${encodeURIComponent(
        url,
      )}&title=${encodeURIComponent(title)}`,
      '_blank',
    );
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-gray-400 text-sm">Share:</span>
      <button
        onClick={shareOnTwitter}
        className="text-gray-400 hover:text-blue-400 transition-colors"
        aria-label="Share on Twitter"
      >
        <TwitterLogo size={24} />
      </button>
      <button
        onClick={shareOnFacebook}
        className="text-gray-400 hover:text-blue-600 transition-colors"
        aria-label="Share on Facebook"
      >
        <FacebookLogo size={24} />
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="text-gray-400 hover:text-blue-700 transition-colors"
        aria-label="Share on LinkedIn"
      >
        <LinkedinLogo size={24} />
      </button>
      <button
        onClick={shareOnWhatsApp}
        className="text-gray-400 hover:text-green-500 transition-colors"
        aria-label="Share on WhatsApp"
      >
        <WhatsappLogo size={24} />
      </button>
      <button
        onClick={shareOnReddit}
        className="text-gray-400 hover:text-orange-500 transition-colors"
        aria-label="Share on Reddit"
      >
        <RedditLogo size={24} />
      </button>
      <button
        onClick={shareViaWebShare}
        className="text-gray-400 hover:text-primary-400 transition-colors"
        aria-label="Copy link"
      >
        <LinkSimple size={24} />
      </button>
    </div>
  );
};

export default ShareButtons;
