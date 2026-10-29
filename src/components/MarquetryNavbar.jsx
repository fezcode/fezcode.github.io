import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { MarquetryIcon, WOOD } from './marquetry';

const SECTION_LABELS = {
  blog: 'Writing',
  apps: 'App collection',
  logs: 'Discovery logs',
  vocab: 'Vocabulary',
};

const MarquetryNavbar = ({
  toggleSidebar,
  isSidebarOpen,
  isSearchVisible,
  toggleSearch,
}) => {
  const location = useLocation();
  const { setIsPaletteOpen } = useCommandPalette();
  const section = location.pathname.split('/').filter(Boolean)[0];
  const label =
    SECTION_LABELS[section] ||
    (section ? section[0].toUpperCase() + section.slice(1) : 'Overview');
  return (
    <header className="mqt-navbar mqt-chrome">
      <div className="mqt-navbar-row">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            className="mqt-btn mqt-btn-icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <MarquetryIcon name="menu" fg={WOOD.cream} />
          </button>
          <nav className="mqt-breadcrumb" aria-label="Breadcrumb">
            <Link to="/" className="hidden lg:inline">
              The codex
            </Link>
            <span className="hidden lg:inline" aria-hidden="true">
              /
            </span>
            <span aria-current="page">{label}</span>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="mqt-btn mqt-navbar-search hidden sm:inline-flex"
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open command palette"
          >
            <MarquetryIcon name="search" fg={WOOD.cream} />
            <span>Search the codex</span>
            <kbd className="mqt-kbd">Ctrl K</kbd>
          </button>
          <button
            type="button"
            className="mqt-btn mqt-btn-icon"
            aria-label="Toggle search"
            aria-expanded={isSearchVisible}
            onClick={toggleSearch}
          >
            <MarquetryIcon name="search" fg={WOOD.cream} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MarquetryNavbar;
