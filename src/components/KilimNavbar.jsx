import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { KilimIcon, KilimStripe, WOOL } from './kilim';
import '../styles/kilim-chrome.css';

const SECTION_LABELS = {
  blog: 'Writing',
  apps: 'App collection',
  logs: 'Discovery logs',
  vocab: 'Vocabulary',
};

const KilimNavbar = ({ toggleSidebar, isSidebarOpen, isSearchVisible, toggleSearch }) => {
  const location = useLocation();
  const { setIsPaletteOpen } = useCommandPalette();
  const section = location.pathname.split('/').filter(Boolean)[0];
  const label =
    SECTION_LABELS[section] ||
    (section ? section[0].toUpperCase() + section.slice(1) : 'Overview');
  return (
    <header className="klm-nav klm-chrome klm-wool-walnut">
      <div className="klm-nav-row">
        <div className="klm-nav-crumb">
          <button
            type="button"
            className="klm-btn klm-btn-icon"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            aria-expanded={isSidebarOpen}
          >
            <KilimIcon name="menu" fg={WOOL.walnut} />
          </button>
          <Link
            to="/"
            className="klm-nav-home hidden lg:inline"
            aria-label="Fezcodex home"
          >
            Fezcodex /
          </Link>
          <span className="klm-nav-section">{label}</span>
        </div>
        <div className="klm-nav-tools">
          <button
            type="button"
            className="klm-btn klm-btn-ivory klm-btn-small hidden sm:inline-flex"
            onClick={() => setIsPaletteOpen(true)}
            aria-label="Open command palette"
          >
            Find something
            <kbd className="klm-kbd">⌘ K</kbd>
          </button>
          <button
            type="button"
            className="klm-btn klm-btn-icon"
            aria-label="Toggle search"
            aria-expanded={isSearchVisible}
            onClick={toggleSearch}
          >
            <KilimIcon name="search" fg={WOOL.walnut} />
          </button>
        </div>
      </div>
      <KilimStripe />
    </header>
  );
};

export default KilimNavbar;
