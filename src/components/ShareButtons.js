import React, { useState, useEffect } from 'react';
import {
  FacebookLogo,
  TwitterLogo,
  LinkedinLogo,
  LinkSimple,
  WhatsappLogo,
  RedditLogo,
} from '@phosphor-icons/react';
import { useToast } from '../hooks/useToast';

const ShareButtons = ({ title, url }) => {
  const { addToast } = useToast();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent;
    const mobile = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i,
      ),
    );
    setIsMobile(mobile);
  }, []);

  // Fallback for copying text to clipboard when navigator.clipboard is not available
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed'; // Make it invisible
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      addToast({
        title: 'Success',
        message: 'Link copied to clipboard!',
        duration: 3000,
      });
    } catch (err) {
      addToast({
        title: 'Error',
        message: 'Failed to copy link!',
        duration: 3000,
      });
      console.error('Fallback: Could not copy text: ', err);
    }
    document.body.removeChild(textArea);
  };

  const handleShare = (platformUrl, platformName) => {
    console.log(`Attempting to share on ${platformName}:`, {
      title,
      url,
      platformUrl,
    });

    if (navigator.share && isMobile) {
      // Only use Web Share API on mobile
      console.log(`Web Share API available for ${platformName} on mobile.`);
      navigator
        .share({
          title: title,
          text: title,
          url: url,
        })
        .then(() => {
          console.log(
            `Shared successfully via Web Share API on ${platformName}`,
          );
        })
        .catch((error) => {
          console.error(
            `Error sharing via Web Share API on ${platformName}:`,
            error,
          );
          // Fallback to platform-specific sharing if Web Share API fails or is cancelled
          console.log(
            `Web Share API failed or cancelled, falling back for ${platformName}`,
          );
          if (platformName === 'Copy Link') {
            if (navigator.clipboard && navigator.clipboard.writeText) {
              navigator.clipboard.writeText(url).then(
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
            } else {
              fallbackCopyTextToClipboard(url);
            }
          } else {
            window.open(platformUrl, '_blank');
          }
        });
    } else {
      // Fallback for browsers that do not support Web Share API or on desktop
      console.log(
        `Web Share API not supported or on desktop, falling back for ${platformName}`,
      );
      if (platformName === 'Copy Link') {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(url).then(
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
        } else {
          fallbackCopyTextToClipboard(url);
        }
      } else {
        window.open(platformUrl, '_blank');
      }
    }
  };

  return (
    <div className="flex items-center gap-2 mt-4">
      <span className="text-gray-400 text-sm">Share:</span>
      {isMobile ? (
        <button
          onClick={() => handleShare(null, 'Copy Link')} // On mobile, only show Copy Link
          className="text-gray-400 hover:text-primary-400 transition-colors"
          aria-label="Copy link"
        >
          <LinkSimple size={24} />
        </button>
      ) : (
        <>
          <button
            onClick={() =>
              handleShare(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                  title,
                )}&url=${encodeURIComponent(url)}`,
                'Twitter',
              )
            }
            className="text-gray-400 hover:text-blue-400 transition-colors"
            aria-label="Share on Twitter"
          >
            <TwitterLogo size={24} />
          </button>
          <button
            onClick={() =>
              handleShare(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  url,
                )}`,
                'Facebook',
              )
            }
            className="text-gray-400 hover:text-blue-600 transition-colors"
            aria-label="Share on Facebook"
          >
            <FacebookLogo size={24} />
          </button>
          <button
            onClick={() =>
              handleShare(
                `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
                  url,
                )}&title=${encodeURIComponent(title)}`,
                'LinkedIn',
              )
            }
            className="text-gray-400 hover:text-blue-700 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <LinkedinLogo size={24} />
          </button>
          <button
            onClick={() =>
              handleShare(
                `https://api.whatsapp.com/send?text=${encodeURIComponent(
                  `${title} ${url}`,
                )}`,
                'WhatsApp',
              )
            }
            className="text-gray-400 hover:text-green-500 transition-colors"
            aria-label="Share on WhatsApp"
          >
            <WhatsappLogo size={24} />
          </button>
          <button
            onClick={() =>
              handleShare(
                `https://www.reddit.com/submit?url=${encodeURIComponent(
                  url,
                )}&title=${encodeURIComponent(title)}`,
                'Reddit',
              )
            }
            className="text-gray-400 hover:text-orange-500 transition-colors"
            aria-label="Share on Reddit"
          >
            <RedditLogo size={24} />
          </button>
          <button
            onClick={() => handleShare(null, 'Copy Link')} // Pass null for platformUrl for Copy Link
            className="text-gray-400 hover:text-primary-400 transition-colors"
            aria-label="Copy link"
          >
            <LinkSimple size={24} />
          </button>
        </>
      )}
    </div>
  );
};

export default ShareButtons;
