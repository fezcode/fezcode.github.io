import React, { useState, useEffect } from 'react';
import piml from 'piml';
import { motion, AnimatePresence } from 'framer-motion';
import { InfoIcon, WarningIcon, WarningOctagonIcon, XIcon, ArrowRightIcon } from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

const DISMISSED_BANNERS_KEY = 'dismissed-banners';

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await fetch('/banner.piml');
        if (!response.ok) return;
        const text = await response.text();
        const parsed = piml.parse(text);

        let bannerList = [];
        if (parsed.banners) {
          if (Array.isArray(parsed.banners)) {
            bannerList = parsed.banners;
          } else if (parsed.banners.banner) {
            bannerList = Array.isArray(parsed.banners.banner)
              ? parsed.banners.banner
              : [parsed.banners.banner];
          } else {
            bannerList = [parsed.banners];
          }
        } else if (parsed.banner) {
          bannerList = Array.isArray(parsed.banner)
            ? parsed.banner
            : [parsed.banner];
        }

        const now = new Date();
        const dismissedBannersRaw = localStorage.getItem(DISMISSED_BANNERS_KEY);
        const dismissedBanners = dismissedBannersRaw
          ? JSON.parse(dismissedBannersRaw)
          : [];

        const activeBanner = bannerList.find((b) => {
          const isActive = String(b.isActive).toLowerCase() === 'true';
          if (!isActive) return false;

          const fromDate = b.from ? new Date(b.from) : null;
          const toDate = b.to ? new Date(b.to) : null;

          if (fromDate && now < fromDate) return false;
          if (toDate && now > toDate) return false;

          // Check dismissal from array
          return !dismissedBanners.includes(b.id);
        });

        if (activeBanner) {
          setBanner(activeBanner);
        }
      } catch (error) {
        console.error('Failed to fetch banner:', error);
      }
    };

    fetchBanner();
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    if (banner && banner.id) {
      const dismissedBannersRaw = localStorage.getItem(DISMISSED_BANNERS_KEY);
      const dismissedBanners = dismissedBannersRaw
        ? JSON.parse(dismissedBannersRaw)
        : [];

      if (!dismissedBanners.includes(banner.id)) {
        dismissedBanners.push(banner.id);
        localStorage.setItem(
          DISMISSED_BANNERS_KEY,
          JSON.stringify(dismissedBanners),
        );
      }
    }
  };

  if (!banner || !isVisible) return null;

  const getTypeStyles = () => {
    switch (banner.type) {
      case 'error':
        return {
          bg: 'bg-red-600',
          text: 'text-white',
          icon: <WarningOctagonIcon size={20} weight="bold" />,
          accent: 'border-red-400'
        };
      case 'warning':
        return {
          bg: 'bg-amber-500',
          text: 'text-black',
          icon: <WarningIcon size={20} weight="bold" />,
          accent: 'border-amber-300'
        };
      case 'info':
      default:
        return {
          bg: 'bg-emerald-600',
          text: 'text-white',
          icon: <InfoIcon size={20} weight="bold" />,
          accent: 'border-emerald-400'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`${styles.bg} ${styles.text} relative z-[100] border-b-2 border-black selection:bg-white selection:text-black`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="shrink-0">{styles.icon}</span>
              <p className="font-mono text-xs md:text-sm font-black uppercase tracking-widest leading-tight">
                {banner.text}
              </p>
              {banner.link && (
                <Link
                  to={banner.link}
                  className="shrink-0 inline-flex items-center gap-1 bg-black/20 hover:bg-black/40 px-3 py-1 rounded-sm border border-white/20 transition-all font-bold text-[10px] uppercase"
                >
                  {banner.linkText || 'VIEW_DETAILS'}
                  <ArrowRightIcon size={12} weight="bold" />
                </Link>
              )}
            </div>

            <button
              onClick={handleDismiss}
              className="p-1 hover:bg-black/20 rounded-sm transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <XIcon size={20} weight="bold" />
            </button>
          </div>

          {/* Brutalist glitch line at bottom */}
          <div className="h-0.5 w-full bg-black/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
