import React, { useRef, useEffect, useState } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'; // Import useNavigate
import { motion } from 'framer-motion';

import {
  HouseIcon,
  UserIcon,
  BookOpenIcon,
  WrenchIcon,
  ArticleIcon,
  CaretDownIcon,
  GameControllerIcon,
  GithubLogoIcon,
  GlobeSimpleIcon,
  SwordIcon,
  AlienIcon,
  AnchorIcon,
  JoystickIcon,
  BooksIcon,
  AsteriskSimpleIcon,
  LinkIcon,
  ArrowSquareOutIcon,
  ShuffleIcon,
  EnvelopeSimpleIcon,
  RssIcon,
  SquaresFourIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  TimerIcon,
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  PushPin,
  Trophy,
  MusicNoteIcon,
  SkullIcon,
  BugBeetleIcon,
} from '@phosphor-icons/react';

import Fez from './Fez';
import { version } from '../version';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';

const Sidebar = ({ isOpen, toggleSidebar, toggleModal, setIsPaletteOpen }) => {
  const [sidebarState, setSidebarState] = usePersistentState(
    KEY_SIDEBAR_STATE,
    {
      isMainOpen: true,
      isContentOpen: true,
      isAppsOpen: true,
      isExtrasOpen: false,
      isGamesOpen: false,
      isExternalLinksOpen: false,
    },
  );

  const scrollRef = useRef(null);
  const [showScrollGradient, setShowScrollGradient] = useState({
    top: false,
    bottom: false,
  });

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = scrollTop + clientHeight >= scrollHeight;
      const atTop = scrollTop === 0;
      const isScrollable = scrollHeight > clientHeight;

      setShowScrollGradient({
        top: isScrollable && !atTop,
        bottom: isScrollable && !atBottom,
      });
    }
  };

  useEffect(() => {
    checkScroll(); // Initial check

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }

    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [isOpen, sidebarState]);

  const toggleSection = (section) => {
    setSidebarState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const navigate = useNavigate();
  const location = useLocation();
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const getLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-1 rounded-md transition-colors ${
      isActive
        ? 'text-sidebar-highlight bg-sidebar-highlight-alpha-10' // border-l-4 border-red-500
        : 'text-gray-100 hover:text-white hover:bg-gray-800'
    }`;

  const getGroupClass = (isActive) => {
    return `space-y-2 border-l-2 ml-3 pl-3 ${isActive ? 'border-sidebar-highlight-alpha-50' : 'border-gray-700'}`;
  };

  const isMainActive =
    location.pathname === '/' || location.pathname === '/about';
  const isContentActive =
    location.pathname.startsWith('/blog') ||
    location.pathname.startsWith('/projects') ||
    location.pathname.startsWith('/logs') ||
    location.pathname.startsWith('/news') ||
    location.pathname.startsWith('/timeline');
  const isAppsActive =
    location.pathname.startsWith('/apps') ||
    location.pathname.startsWith('/commands');

  const variants = {
    open: { x: 0 },
    closed: { x: '-100%' },
  };

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden ${isOpen ? 'block' : 'hidden'}`}
        onClick={toggleSidebar}
      ></div>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 left-0 h-screen bg-black/30 backdrop-blur-sm text-white w-64 z-40 flex flex-col border-r border-gray-700/50 font-arvo`}
      >
        {isOpen && (
          <div className="p-4 flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Fez />
              <span className="text-2xl font-normal tracking-tight">
                fez<span className="text-primary-400">codex</span>
              </span>
            </Link>
          </div>
        )}

        <div className="relative flex-grow min-h-0">
          {showScrollGradient.top && (
            <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center bg-gradient-to-b from-black/90 to-transparent z-10 pointer-events-none">
              <CaretDoubleUpIcon size={24} className="text-white" />
            </div>
          )}
          <div
            ref={scrollRef}
            className="p-4 overflow-y-auto scrollbar-hide h-full"
          >
            <div className="mt-2">
              <button
                onClick={() => toggleSection('isMainOpen')}
                className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isMainActive ? 'text-sidebar-highlight' : 'text-gray-100'}`}
              >
                <span
                  className={`flex items-center gap-2 font-sans ${isMainActive ? 'text-sidebar-highlight' : 'text-white'}`}
                >
                  <AsteriskSimpleIcon size={16} />
                  <span>Main</span>
                </span>
                <CaretDownIcon
                  size={20}
                  className={`transition-transform ${sidebarState.isMainOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {sidebarState.isMainOpen && (
                <nav className={getGroupClass(isMainActive)}>
                  <NavLink to="/" className={getLinkClass}>
                    <HouseIcon size={24} />
                    <span>Home</span>
                  </NavLink>
                  <NavLink to="/about" className={getLinkClass}>
                    <UserIcon size={24} />
                    <span>About</span>
                  </NavLink>
                  <NavLink to="/achievements" className={getLinkClass}>
                    <Trophy size={24} />
                    <span>Trophy Room</span>
                  </NavLink>
                </nav>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => toggleSection('isContentOpen')}
                className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isContentActive ? 'text-sidebar-highlight' : 'text-gray-100'}`}
              >
                <span
                  className={`flex items-center gap-2 font-sans ${isContentActive ? 'text-sidebar-highlight' : 'text-white'}`}
                >
                  <BooksIcon size={16} />
                  <span>Content</span>
                </span>
                <CaretDownIcon
                  size={20}
                  className={`transition-transform ${sidebarState.isContentOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {sidebarState.isContentOpen && (
                <nav className={getGroupClass(isContentActive)}>
                  <NavLink to="/blog" className={getLinkClass}>
                    <BookOpenIcon size={24} />
                    <span>Blog</span>
                  </NavLink>
                  <NavLink to="/projects" className={getLinkClass}>
                    <WrenchIcon size={24} />
                    <span>Projects</span>
                  </NavLink>
                  <NavLink to="/logs" className={getLinkClass}>
                    <ArticleIcon size={24} />
                    <span>Logs</span>
                  </NavLink>
                  <NavLink to="/news" className={getLinkClass}>
                    <GlobeSimpleIcon size={24} />
                    <span>News</span>
                  </NavLink>
                  <NavLink to="/timeline" className={getLinkClass}>
                    <TimerIcon size={24} />
                    <span>Timeline</span>
                  </NavLink>
                  <NavLink to="/roadmap" className={getLinkClass}>
                    <BugBeetleIcon size={24} />
                    <span>Fezzilla</span>
                  </NavLink>
                </nav>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => toggleSection('isAppsOpen')}
                className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isAppsActive ? 'text-sidebar-highlight' : 'text-gray-100'}`}
              >
                <span
                  className={`flex items-center gap-2 font-sans ${isAppsActive ? 'text-sidebar-highlight' : 'text-white'}`}
                >
                  <SquaresFourIcon size={16} />
                  <span>Apps</span>
                </span>
                <CaretDownIcon
                  size={20}
                  className={`transition-transform ${sidebarState.isAppsOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {sidebarState.isAppsOpen && (
                <nav className={getGroupClass(isAppsActive)}>
                  <NavLink to="/pinned-apps" className={getLinkClass}>
                    <PushPin size={24} />
                    <span>Pinned Apps</span>
                  </NavLink>
                  <NavLink to="/apps" className={getLinkClass}>
                  {/*<NavLink to="/apps" className={getLinkClass} end>*/}
                    <SquaresFourIcon size={24} />
                    <span>All Apps</span>
                  </NavLink>
                  <NavLink to="/commands" className={getLinkClass}>
                    <MagnifyingGlassIcon size={24} />
                    <span>All Commands</span>
                  </NavLink>
                </nav>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => toggleSection('isExtrasOpen')}
                className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${sidebarState.isExtrasOpen ? 'text-gray-100' : 'text-gray-100'}`}
              >
                <span className="flex items-center gap-2 font-sans text-white">
                  <AlienIcon size={16} />
                  <span>Extras</span>
                  <LinkIcon size={16} className="text-rose-400" />
                </span>
                <CaretDownIcon
                  size={20}
                  className={`transition-transform ${sidebarState.isExtrasOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {sidebarState.isExtrasOpen && (
                <nav className={getGroupClass(false)}>
                  <NavLink to="/stories" className={getLinkClass}>
                    <SwordIcon className="text-orange-500" size={24} />
                    <span>
                      {' '}
                      S <span className="text-orange-500"> &amp; </span>F&nbsp;
                      <sup className="text-xs text-orange-500">
                        {' '}
                        [alpha]{' '}
                      </sup>{' '}
                    </span>
                  </NavLink>
                  <a
                    href="/rss.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 px-3 py-1 rounded-md transition-colors text-gray-100 hover:text-white hover:bg-gray-800`}
                  >
                    <RssIcon size={24} />
                    <span>RSS Feed</span>
                  </a>
                </nav>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => toggleSection('isGamesOpen')}
                className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${sidebarState.isGamesOpen ? 'text-gray-100' : 'text-gray-100'}`}
              >
                <span className="flex items-center gap-2 font-sans text-white">
                  <JoystickIcon size={16} />
                  <span>Games</span>
                  <ArrowSquareOutIcon size={16} className="text-rose-400" />
                </span>
                <CaretDownIcon
                  size={20}
                  className={`transition-transform ${sidebarState.isGamesOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {sidebarState.isGamesOpen && (
                <nav className={getGroupClass(false)}>
                  <a
                    href="https://www.nytimes.com/games/wordle/index.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 px-3 py-1 rounded-md transition-colors text-gray-100 hover:text-white hover:bg-gray-800`}
                  >
                    <GameControllerIcon size={24} />
                    <span>Wordle</span>
                  </a>
                  <a
                    href="https://openfront.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 px-3 py-1 rounded-md transition-colors text-gray-100 hover:text-white hover:bg-gray-800`}
                  >
                    <GlobeSimpleIcon size={24} />
                    <span>Openfront.io</span>
                  </a>
                </nav>
              )}
            </div>

            <div className="mt-8">
              <button
                onClick={() => toggleSection('isExternalLinksOpen')}
                className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${sidebarState.isExternalLinksOpen ? 'text-gray-100' : 'text-gray-100'}`}
              >
                <span className="flex items-center gap-2 font-sans text-white">
                  <AnchorIcon size={16} />
                  <span>External Links</span>
                  <ArrowSquareOutIcon size={16} className="text-rose-400" />
                </span>
                <CaretDownIcon
                  size={20}
                  className={`transition-transform ${sidebarState.isExternalLinksOpen ? 'transform rotate-180' : ''}`}
                />
              </button>
              {sidebarState.isExternalLinksOpen && (
                <nav className={getGroupClass(false)}>
                  <a
                    href="https://github.com/fezcode"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center space-x-3 px-3 py-1 rounded-md transition-colors text-gray-100 hover:text-white hover:bg-gray-800`}
                  >
                    <GithubLogoIcon size={24} />
                    <span>GitHub</span>
                  </a>
                </nav>
              )}
            </div>
          </div>
          {showScrollGradient.bottom && (
            <div className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none">
              <CaretDoubleDownIcon size={24} className="text-white" />
            </div>
          )}
        </div>
        <div className="p-4 text-gray-300 text-left relative z-10">
          <div className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-700/50 bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors duration-200 flex items-center justify-center gap-2 w-full font-mono"
            >
              <MagnifyingGlassIcon size={16} />
              <span>Commands</span>
            </button>
            <button
              onClick={handleSettingsClick}
              className="px-3 py-2 text-sm rounded-lg border border-gray-700/50 bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors duration-200 flex items-center justify-center gap-2 w-full font-mono"
            >
              <GearSixIcon size={16} />
              <span>Settings</span>
            </button>
          </div>
          <hr className="border-gray-800 my-4" />
          <div className="flex flex-col gap-2 mb-4">
            <NavLink
              to="/random"
              className="px-3 py-2 text-sm rounded-lg border border-gray-700/50 bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors duration-200 flex items-center justify-center gap-2 w-full font-mono"
            >
              <ShuffleIcon size={16} />
              <span>Random</span>
            </NavLink>
            <button
              onClick={toggleModal}
              className="px-3 py-2 text-sm rounded-lg border border-gray-700/50 bg-gray-900/40 text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors duration-200 flex items-center justify-center gap-2 w-full font-mono"
            >
              <EnvelopeSimpleIcon size={16} />
              <span>Contact</span>
            </button>
          </div>
          <hr className="border-gray-800 my-4" />
          <div className="text-center text-xs text-gray-500 font-mono">
            <p>
              &copy; {new Date().getFullYear()} fezcode // v{version}
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
