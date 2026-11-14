import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  HouseIcon,
  CubeIcon,
  ArticleIcon,
  BookmarkSimpleIcon,
  GearIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';
import { useCommandPalette } from '../context/CommandPaletteContext';
import { BlissIcon } from './bliss';

const SECTION_LABELS = {
  '': 'Home',
  blog: 'Writing',
  apps: 'App collection',
  logs: 'Discovery logs',
  vocab: 'Vocabulary',
  projects: 'Projects',
  settings: 'Settings',
  achievements: 'Achievements',
  commands: 'Commands',
  about: 'About',
};

const QUICK = [
  { to: '/', label: 'Home', icon: HouseIcon },
  { to: '/projects', label: 'Projects', icon: CubeIcon },
  { to: '/blog', label: 'Writing', icon: ArticleIcon },
  { to: '/logs', label: 'Discovery logs', icon: BookmarkSimpleIcon },
];

const useClock = () => {
  // Set after mount so the prerendered HTML and hydration agree.
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return now;
};

/**
 * Pinned to the bottom of the screen: the green launcher (opens the command
 * palette), quick-launch shortcuts, a button for the current page, and the
 * tray with search, settings and a clock.
 */
const BlissTaskbar = ({ toggleSearch }) => {
  const location = useLocation();
  const { setIsPaletteOpen } = useCommandPalette();
  const now = useClock();
  const section = location.pathname.split('/').filter(Boolean)[0] || '';
  const label =
    SECTION_LABELS[section] || section[0].toUpperCase() + section.slice(1);
  return (
    <nav className="bl-taskbar bl-chrome" aria-label="Taskbar">
      <button
        type="button"
        className="bl-launcher"
        onClick={() => setIsPaletteOpen(true)}
        aria-label="Open the command palette"
      >
        <BlissIcon icon="HouseIcon" tone="green" size={22} />
        fezcodex
      </button>
      <span className="flex items-center gap-1 pl-1 bl-hide-sm">
        {QUICK.map(({ to, label: name, icon: Icon }) => (
          <Link key={to} to={to} className="bl-quick" aria-label={name} title={name}>
            <Icon size={18} weight="fill" />
          </Link>
        ))}
      </span>
      <span
        className="w-px self-stretch my-2 bg-[#1641a6] bl-hide-sm"
        aria-hidden="true"
      />
      <span className="bl-task bl-task-active min-w-0" aria-current="page">
        <BlissIcon icon="AppWindowIcon" tone="blue" size={16} />
        <span className="truncate">{label}</span>
      </span>
      <div className="bl-tray">
        {toggleSearch && (
          <button
            type="button"
            className="bl-quick"
            onClick={toggleSearch}
            aria-label="Toggle search"
            title="Search"
          >
            <MagnifyingGlassIcon size={17} weight="bold" />
          </button>
        )}
        <Link to="/settings" className="bl-quick" aria-label="Settings" title="Settings">
          <GearIcon size={17} weight="fill" />
        </Link>
        {now && (
          <time className="bl-clock" dateTime={now.toISOString()}>
            {now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
          </time>
        )}
      </div>
    </nav>
  );
};

export default BlissTaskbar;
