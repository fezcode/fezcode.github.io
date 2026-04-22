import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { TerracottaMark } from './terracotta';
import { useSiteConfig } from '../context/SiteConfigContext';

/**
 * Editorial masthead for the Terracotta theme.
 * A slim bone band with a hairline bottom rule, a small plumb-bob glyph + serif
 * wordmark on the left, and mono-tracked search/toggle on the right.
 * Sticky but near-invisible until scrolled.
 */
const TerracottaNavbar = ({
  toggleSidebar,
  isSidebarOpen,
  toggleSearch,
}) => {
  const { config } = useSiteConfig();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const title = config?.hero?.title || 'Fezcodex';

  return (
    <header
      className={`sticky top-0 z-40 bg-[#F3ECE0]/95 backdrop-blur-md border-b transition-shadow duration-300 ${
        scrolled
          ? 'border-[#1A161320] shadow-[0_4px_14px_-10px_rgba(26,22,19,0.25)]'
          : 'border-[#1A161310] shadow-none'
      }`}
    >
      <div className="mx-auto max-w-[1800px] px-5 md:px-12">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-6 py-3.5">
          {/* left: toggle + wordmark */}
          <div className="flex items-center gap-4 md:gap-6 min-w-0">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              className="text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors"
            >
              <ListIcon size={20} weight="light" />
            </button>

            <Link
              to="/"
              className="flex items-baseline gap-2.5 group min-w-0"
              aria-label={title}
            >
              <TerracottaMark size={16} color="#C96442" />
              <span
                className="font-fraunces text-[20px] md:text-[22px] tracking-[-0.02em] text-[#1A1613] group-hover:text-[#9E4A2F] transition-colors truncate"
                style={{
                  fontVariationSettings:
                    '"opsz" 20, "SOFT" 30, "WONK" 1, "wght" 540',
                }}
              >
                {title}
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </span>
            </Link>
          </div>

          {/* center: folio slug — shown only when sidebar closed */}
          {!isSidebarOpen && (
            <div className="hidden lg:block text-center font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/60">
              folio 001 · {(config?.kernel?.codename || 'bonewright').toLowerCase()}
            </div>
          )}
          {isSidebarOpen && <span aria-hidden="true" />}

          {/* right: search + kbd chip */}
          <div className="flex items-center gap-3 md:gap-5 justify-end">
            <Link
              to="/about"
              className="hidden md:inline font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors"
            >
              About
            </Link>
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="Toggle search"
              className="flex items-center gap-2 text-[#2E2620]/70 hover:text-[#9E4A2F] transition-colors"
            >
              <MagnifyingGlassIcon size={18} weight="light" />
              <span className="hidden md:inline font-ibm-plex-mono text-[10.5px] tracking-[0.22em] uppercase">
                Search
              </span>
            </button>
            <span
              aria-hidden="true"
              className="hidden md:inline-flex items-center gap-1 font-ibm-plex-mono text-[10px] tracking-[0.14em] uppercase text-[#2E2620]/50"
            >
              <kbd className="px-1.5 py-0.5 border border-[#1A161320] rounded-[2px]">⌘</kbd>
              <kbd className="px-1.5 py-0.5 border border-[#1A161320] rounded-[2px]">K</kbd>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TerracottaNavbar;
