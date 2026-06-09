import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { MistOrb, MistHorizon } from './mist';
import { useSiteConfig } from '../context/SiteConfigContext';

/**
 * Masthead for the Mist theme — a pale band of fog that thickens
 * faintly when you scroll. The orb glyph + serif wordmark on the left,
 * lowercase mono whispers on the right. No hard rules anywhere; the
 * bottom edge is a horizon that dissolves at both ends.
 */
const MistNavbar = ({
  toggleSidebar,
  isSidebarOpen,
  isSearchVisible,
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
      className={`sticky top-0 z-40 bg-[#EEF2F1]/80 backdrop-blur-md selection:bg-[#8FA8BC]/30 transition-shadow duration-300 ${
        scrolled
          ? 'shadow-[0_18px_50px_rgba(60,72,69,0.10)]'
          : 'shadow-none'
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
              className="text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]"
            >
              <ListIcon size={20} weight="light" />
            </button>

            <Link
              to="/"
              className="flex items-center gap-2.5 group min-w-0"
              aria-label={title}
            >
              <MistOrb size={20} breathe={false} />
              <span className="font-instr-serif text-[21px] md:text-[23px] text-[#3C4845] group-hover:text-[#5F837B] transition-colors duration-[250ms] truncate">
                {title}
                <span aria-hidden="true" className="text-[#8FA8BC]">
                  .
                </span>
              </span>
            </Link>
          </div>

          {/* center: fog slug — shown only when sidebar closed */}
          {!isSidebarOpen && (
            <div className="hidden lg:block text-center font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#8A9894]">
              visibility: low ·{' '}
              {config?.kernel?.codename?.toLowerCase()}
            </div>
          )}
          {isSidebarOpen && <span aria-hidden="true" />}

          {/* right: about + search + kbd chip */}
          <div className="flex items-center gap-3 md:gap-5 justify-end">
            <Link
              to="/about"
              className="hidden md:inline font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]"
            >
              about
            </Link>
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="Toggle search"
              aria-expanded={Boolean(isSearchVisible)}
              className="flex items-center gap-2 text-[#5C6B67] hover:text-[#5F837B] transition-colors duration-[250ms]"
            >
              <MagnifyingGlassIcon size={18} weight="light" />
              <span className="hidden md:inline font-ibm-plex-mono text-[10.5px] tracking-[0.22em] lowercase">
                search
              </span>
            </button>
            <span
              aria-hidden="true"
              className="hidden md:inline-flex items-center gap-1 font-ibm-plex-mono text-[10px] tracking-[0.14em] lowercase text-[#8A9894]"
            >
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/40 backdrop-blur-sm shadow-[0_4px_14px_rgba(60,72,69,0.08)]">
                ⌘
              </kbd>
              <kbd className="px-1.5 py-0.5 rounded-md bg-white/40 backdrop-blur-sm shadow-[0_4px_14px_rgba(60,72,69,0.08)]">
                k
              </kbd>
            </span>
          </div>
        </div>
      </div>
      <MistHorizon tint={scrolled ? 'rgba(60,72,69,0.20)' : 'rgba(60,72,69,0.12)'} />
    </header>
  );
};

export default MistNavbar;
