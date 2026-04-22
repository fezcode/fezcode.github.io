import React, { useState, useEffect } from 'react';
import piml from 'piml';
import { motion, AnimatePresence } from 'framer-motion';
import {
  InfoIcon,
  WarningIcon,
  WarningOctagonIcon,
  XIcon,
  ArrowRightIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';

const DISMISSED_BANNERS_KEY = 'dismissed-banners';

const Banner = () => {
  const [banner, setBanner] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const { fezcodexTheme } = useVisualSettings() || {};
  const isLuxe = fezcodexTheme === 'luxe';
  const isTerracotta = fezcodexTheme === 'terracotta';

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

  /* ------------------------------------------------------------------
   * per-theme style packs
   * ------------------------------------------------------------------ */
  const iconFor = (type, weight = 'bold', size = 20) => {
    switch (type) {
      case 'error':
        return <WarningOctagonIcon size={size} weight={weight} />;
      case 'warning':
        return <WarningIcon size={size} weight={weight} />;
      case 'info':
      default:
        return <InfoIcon size={size} weight={weight} />;
    }
  };

  const bannerType = banner.type || 'info';
  const isExternalLink = banner.link && banner.link.startsWith('http');

  const renderLink = (className) => {
    if (!banner.link) return null;
    const label = banner.linkText || 'VIEW_DETAILS';
    if (isExternalLink) {
      return (
        <a href={banner.link} className={className}>
          {label}
          <ArrowRightIcon size={12} weight="bold" />
        </a>
      );
    }
    return (
      <Link to={banner.link} className={className}>
        {label}
        <ArrowRightIcon size={12} weight="bold" />
      </Link>
    );
  };

  /* ============================================================
   * TERRACOTTA BANNER — editorial bone strip with terra dot
   * ============================================================ */
  if (isTerracotta) {
    const typePalette = (() => {
      switch (bannerType) {
        case 'error':
          return { dot: '#9E4A2F', accent: '#9E4A2F', kicker: 'Erratum' };
        case 'warning':
          return { dot: '#B88532', accent: '#B88532', kicker: 'Caveat' };
        case 'info':
        default:
          return { dot: '#C96442', accent: '#C96442', kicker: 'Colophon' };
      }
    })();

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-[100] bg-[#E8DECE] border-b border-[#1A161320]"
          >
            <div className="max-w-[1800px] mx-auto px-5 md:px-12 py-3 grid grid-cols-[auto_1fr_auto] items-center gap-5">
              <div className="flex items-center gap-3 min-w-0">
                <span
                  aria-hidden="true"
                  className="inline-block w-[7px] h-[7px] rounded-full"
                  style={{ backgroundColor: typePalette.dot }}
                />
                <span
                  className="font-ibm-plex-mono text-[9.5px] tracking-[0.3em] uppercase"
                  style={{ color: typePalette.accent }}
                >
                  {typePalette.kicker}
                </span>
              </div>

              <div className="flex items-center gap-4 min-w-0">
                <span aria-hidden="true" className="hidden md:inline text-[#2E2620]/50">
                  {iconFor(bannerType, 'duotone', 16)}
                </span>
                <p className="font-fraunces italic text-[14px] md:text-[15.5px] leading-snug text-[#1A1613] truncate">
                  {banner.text}
                </p>
                {renderLink(
                  'shrink-0 hidden md:inline-flex items-center gap-1 font-ibm-plex-mono text-[9.5px] tracking-[0.24em] uppercase text-[#1A1613] border border-[#1A161340] px-2.5 py-1 hover:bg-[#1A1613] hover:text-[#F3ECE0] transition-colors',
                )}
              </div>

              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 text-[#2E2620]/50 hover:text-[#9E4A2F] transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <XIcon size={16} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  /* ============================================================
   * LUXE BANNER — quiet cream strip with bronze rule
   * ============================================================ */
  if (isLuxe) {
    const typePalette = (() => {
      switch (bannerType) {
        case 'error':
          return { accent: '#7A2020', label: 'Alert' };
        case 'warning':
          return { accent: '#B88532', label: 'Caveat' };
        case 'info':
        default:
          return { accent: '#8D4004', label: 'Notice' };
      }
    })();

    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative z-[100] bg-[#FAFAF8] border-b border-[#1A1A1A]/10"
          >
            <span
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ backgroundColor: typePalette.accent, opacity: 0.5 }}
            />
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <span aria-hidden="true" style={{ color: typePalette.accent }}>
                  {iconFor(bannerType, 'duotone', 18)}
                </span>
                <span
                  className="font-outfit text-[10px] tracking-[0.24em] uppercase shrink-0 hidden md:inline"
                  style={{ color: typePalette.accent }}
                >
                  {typePalette.label}
                </span>
                <p className="font-playfairDisplay italic text-[15px] md:text-[17px] leading-snug text-[#1A1A1A] truncate">
                  {banner.text}
                </p>
                {renderLink(
                  'shrink-0 inline-flex items-center gap-1 font-outfit text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 border border-[#1A1A1A]/15 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-[#FAFAF8] transition-colors rounded-sm',
                )}
              </div>
              <button
                type="button"
                onClick={handleDismiss}
                className="p-1 text-[#1A1A1A]/40 hover:text-[#1A1A1A] transition-colors shrink-0"
                aria-label="Dismiss"
              >
                <XIcon size={18} weight="bold" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  /* ============================================================
   * BRUTALIST BANNER — legacy mono slab
   * ============================================================ */
  const brutalistPalette = (() => {
    switch (bannerType) {
      case 'error':
        return { bg: 'bg-red-600', text: 'text-white' };
      case 'warning':
        return { bg: 'bg-amber-500', text: 'text-black' };
      case 'info':
      default:
        return { bg: 'bg-emerald-600', text: 'text-white' };
    }
  })();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className={`${brutalistPalette.bg} ${brutalistPalette.text} relative z-[100] border-b-2 border-black selection:bg-white selection:text-black`}
        >
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <span className="shrink-0">{iconFor(bannerType)}</span>
              <p className="font-mono text-xs md:text-sm font-black uppercase tracking-widest leading-tight">
                {banner.text}
              </p>
              {renderLink(
                'shrink-0 inline-flex items-center gap-1 bg-black/20 hover:bg-black/40 px-3 py-1 rounded-sm border border-white/20 transition-all font-bold text-[10px] uppercase',
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
          <div className="h-0.5 w-full bg-black/10" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Banner;
