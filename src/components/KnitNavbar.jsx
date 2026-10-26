import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { KnitText, KnitIcon, KnitBand, YARN } from './knit';

const SECTION_LABELS = {
  blog: 'Writing',
  apps: 'App collection',
  logs: 'Discovery logs',
  vocab: 'Vocabulary',
};

const KnitNavbar = ({ toggleSidebar, isSidebarOpen, isSearchVisible, toggleSearch }) => {
  const location = useLocation();
  const { setIsPaletteOpen } = useCommandPalette();
  const section = location.pathname.split('/').filter(Boolean)[0];
  const label =
    SECTION_LABELS[section] ||
    (section ? section[0].toUpperCase() + section.slice(1) : 'Overview');
  return (
    <header className="knt-navbar knt-chrome">
      <div className="knt-navbar-row">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="knt-btn knt-btn-icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <KnitIcon name="menu" fg={YARN.cream} />
          </button>
          <Link to="/" className="hidden lg:inline-flex" aria-label="Fezcodex home">
            <KnitText text="Fezcodex /" size="small" fg={YARN.oat} fit />
          </Link>
          <KnitText text={label} size="small" fg={YARN.gold} fit maxLines={1} />
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="knt-btn hidden sm:inline-flex"
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <KnitText text="Find something" size="small" fg={YARN.cream} fit />
            <kbd className="knt-kbd">⌘ K</kbd>
          </button>
          <button
            type="button"
            className="knt-btn knt-btn-icon"
            aria-label="Toggle search"
            aria-expanded={isSearchVisible}
            onClick={toggleSearch}
          >
            <KnitIcon name="search" fg={YARN.cream} />
          </button>
        </div>
      </div>
      <KnitBand pattern="peerie" />
    </header>
  );
};

export default KnitNavbar;
