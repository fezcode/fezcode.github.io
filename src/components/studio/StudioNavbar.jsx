import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';
import { useCommandPalette } from '../../context/CommandPaletteContext';

export default function StudioNavbar({
  toggleSidebar,
  isSidebarOpen,
  toggleSearch,
  isSearchVisible,
}) {
  const { setIsPaletteOpen } = useCommandPalette();
  return (
    <header className="std-navbar">
      <div className="std-nav-brand">
        <button
          className="std-chip std-icon-button"
          type="button"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
        >
          <ListIcon size={20} />
        </button>
        <Link to="/" className="std-logo">
          <span className="std-mark" aria-hidden="true" />
          fezcodex<span className="std-logo-theme">studio</span>
        </Link>
      </div>
      <nav aria-label="Main navigation" className="std-nav-links">
        <NavLink to="/projects" className="std-chip">
          Projects
        </NavLink>
        <NavLink to="/blog" className="std-chip">
          Writing
        </NavLink>
        <NavLink to="/apps" className="std-chip">
          Apps
        </NavLink>
      </nav>
      <div className="std-actions">
        <button
          type="button"
          className="std-chip std-find"
          onClick={() => setIsPaletteOpen(true)}
        >
          Find something
        </button>
        <button
          type="button"
          className="std-chip std-icon-button"
          onClick={toggleSearch}
          aria-label="Toggle search"
          aria-expanded={isSearchVisible}
        >
          <MagnifyingGlassIcon size={20} />
        </button>
      </div>
    </header>
  );
}
