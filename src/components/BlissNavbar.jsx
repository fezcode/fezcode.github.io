import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  ListIcon,
  MagnifyingGlassIcon,
  CommandIcon,
} from '@phosphor-icons/react';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { BlissIcon } from './bliss';

/**
 * The Explorer toolbar: sidebar toggle, Back / Forward / Up, an address
 * field showing where you are, and search + command palette on the right.
 */
const BlissNavbar = ({ toggleSidebar, isSidebarOpen, isSearchVisible, toggleSearch }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setIsPaletteOpen } = useCommandPalette();
  const parts = location.pathname.split('/').filter(Boolean);
  const up = parts.length ? `/${parts.slice(0, -1).join('/')}` : null;
  const address = `fezcodex:\\${parts.join('\\')}`;
  return (
    <header className="bl-navbar bl-chrome">
      <div className="bl-navbar-row">
        <button
          type="button"
          className="bl-navbtn"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
          aria-expanded={isSidebarOpen}
        >
          <ListIcon size={20} weight="bold" />
        </button>
        <span className="w-px self-stretch bg-[#c3c0ae] mx-1" aria-hidden="true" />
        <button
          type="button"
          className="bl-navbtn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <span className="bl-navbtn-round inline-flex items-center justify-center">
            <ArrowLeftIcon size={16} weight="bold" />
          </span>
          <span className="bl-hide-sm">Back</span>
        </button>
        <button
          type="button"
          className="bl-navbtn bl-hide-sm"
          onClick={() => navigate(1)}
          aria-label="Forward"
        >
          <span className="bl-navbtn-round inline-flex items-center justify-center">
            <ArrowRightIcon size={16} weight="bold" />
          </span>
        </button>
        <button
          type="button"
          className="bl-navbtn"
          onClick={() => up !== null && navigate(up || '/')}
          disabled={up === null}
          aria-label="Up one level"
        >
          <ArrowUpIcon size={18} weight="bold" color="#2f7a12" />
        </button>
        <div className="bl-address">
          <span className="bl-label bl-hide-sm" aria-hidden="true">
            Address
          </span>
          <Link
            to="/"
            className="bl-address-field no-underline"
            aria-label={`Current page: ${location.pathname}. Go home`}
          >
            <BlissIcon icon="FolderOpenIcon" tone="yellow" size={16} />
            <span className="truncate">{address}</span>
          </Link>
        </div>
        <button
          type="button"
          className="bl-btn bl-btn-sm hidden sm:inline-flex"
          onClick={() => setIsPaletteOpen(true)}
          aria-label="Open command palette"
        >
          <CommandIcon size={15} />
          <span className="hidden lg:inline">Find something</span>
          <kbd className="bl-kbd hidden lg:inline-flex">Ctrl K</kbd>
        </button>
        <button
          type="button"
          className="bl-btn bl-btn-sm bl-btn-icon"
          aria-label="Toggle search"
          aria-expanded={isSearchVisible}
          onClick={toggleSearch}
        >
          <MagnifyingGlassIcon size={17} weight="bold" />
        </button>
      </div>
    </header>
  );
};

export default BlissNavbar;
