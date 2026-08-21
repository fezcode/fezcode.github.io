import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSiteConfig } from '../context/SiteConfigContext';
import '../styles/Ledger.css';

/**
 * Masthead for the Ledger theme — a thin register strip pinned to the top of
 * the book. Wordmark on the left, the current route recorded as a folio in
 * the centre, search and the ⌘K chip on the right. One hairline below,
 * nothing else: the page is the object, the chrome is the ruling.
 */
const LedgerNavbar = ({
  toggleSidebar,
  isSidebarOpen,
  isSearchVisible,
  toggleSearch,
}) => {
  const { config } = useSiteConfig();
  const location = useLocation();

  const title = config?.hero?.title || 'Fezcodex';
  const folio =
    location.pathname === '/' ? '/INDEX' : location.pathname.toUpperCase();

  return (
    <header
      className="ldg-chrome sticky top-0 z-40"
      style={{
        backgroundColor: 'var(--ldg-veil)',
        backdropFilter: 'blur(6px)',
        borderBottom: '1px solid var(--ldg-rule)',
      }}
    >
      <div className="mx-auto max-w-[1800px] px-4 md:px-8">
        <div className="grid grid-cols-[auto_1fr_auto] items-baseline gap-4 md:gap-6 py-3">
          {/* left: toggle + wordmark */}
          <div className="flex items-baseline gap-3 md:gap-5 min-w-0">
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
              aria-expanded={Boolean(isSidebarOpen)}
              className="ldg-btn"
            >
              {isSidebarOpen ? '[×]' : '[≡]'}
            </button>

            <Link
              to="/"
              className="flex items-baseline gap-2 min-w-0 no-underline group"
              aria-label={title}
            >
              <span
                className="font-bold uppercase truncate"
                style={{
                  color: 'var(--ldg-highlight)',
                  letterSpacing: '2px',
                  fontSize: '0.95rem',
                }}
              >
                {title}
              </span>
              <span className="ldg-eyebrow hidden sm:inline">/ LEDGER</span>
            </Link>
          </div>

          {/* centre: the open folio, recorded like a page number */}
          <div
            className="ldg-label hidden lg:block text-center truncate"
            aria-hidden="true"
          >
            FOLIO {folio}
          </div>
          <span className="lg:hidden" aria-hidden="true" />

          {/* right: about + search + kbd chip */}
          <div className="flex items-baseline gap-3 md:gap-4 justify-end">
            <Link
              to="/about"
              className="ldg-label hidden md:inline no-underline hover:text-[var(--ldg-accent)]"
            >
              ABOUT
            </Link>
            <button
              type="button"
              onClick={toggleSearch}
              aria-label="Toggle search"
              aria-expanded={Boolean(isSearchVisible)}
              className="ldg-btn ldg-btn-accent"
            >
              SEARCH
            </button>
            <span
              aria-hidden="true"
              className="hidden md:inline-flex items-baseline gap-1"
            >
              <kbd className="ldg-kbd">⌘</kbd>
              <kbd className="ldg-kbd">K</kbd>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LedgerNavbar;
