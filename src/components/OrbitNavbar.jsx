import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SidebarSimpleIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { OrbitRegister } from './orbit';

const OrbitNavbar = ({
  toggleSidebar,
  isSidebarOpen,
  isSearchVisible,
  toggleSearch,
}) => {
  const location = useLocation();
  const { setIsPaletteOpen } = useCommandPalette();
  const section = location.pathname.split('/').filter(Boolean)[0];
  const label =
    {
      blog: 'Writing',
      apps: 'App collection',
      logs: 'Discovery logs',
      vocab: 'Vocabulary',
    }[section] ||
    (section ? section[0].toUpperCase() + section.slice(1) : 'Overview');
  return (
    <header className="orb-navbar orb-chrome">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          className="orb-btn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
        >
          <SidebarSimpleIcon size={19} />
        </button>
        <Link to="/" className="orb-muted hidden lg:inline text-sm">
          Fezcodex /
        </Link>
        <span className="text-sm truncate">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="orb-btn hidden sm:inline-flex"
          onClick={() => setIsPaletteOpen(true)}
          aria-label="Open command palette"
        >
          Find something <kbd className="orb-kbd">⌘ K</kbd>
        </button>
        <button
          type="button"
          className="orb-btn"
          aria-label="Toggle search"
          aria-expanded={isSearchVisible}
          onClick={toggleSearch}
        >
          <MagnifyingGlassIcon size={18} />
        </button>
        <span className="hidden sm:block">
          <OrbitRegister />
        </span>
      </div>
    </header>
  );
};

export default OrbitNavbar;
