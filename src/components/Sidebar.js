import React, { useState, useEffect } from 'react';

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
} from '@phosphor-icons/react';

import Fez from './Fez';

import { version } from '../version';

import usePersistentState from '../hooks/usePersistentState';
import {
  KEY_SIDEBAR_IS_MAIN_OPEN,
  KEY_SIDEBAR_IS_CONTENT_OPEN,
  KEY_SIDEBAR_IS_APPS_OPEN,
  KEY_SIDEBAR_IS_EXTRAS_OPEN,
  KEY_SIDEBAR_IS_GAMES_OPEN,
  KEY_SIDEBAR_IS_EXTERNAL_LINKS_OPEN,
} from '../utils/LocalStorageManager';

const Sidebar = ({ isOpen, toggleSidebar, toggleModal, setIsPaletteOpen }) => {
  const [isMainOpen, setIsMainOpen] = usePersistentState(
    KEY_SIDEBAR_IS_MAIN_OPEN,
    true,
  );
  const [isContentOpen, setIsContentOpen] = usePersistentState(
    KEY_SIDEBAR_IS_CONTENT_OPEN,
    true,
  );
  const [isAppsOpen, setIsAppsOpen] = usePersistentState(
    KEY_SIDEBAR_IS_APPS_OPEN,
    true,
  );
  const [isExtrasOpen, setIsExtrasOpen] = usePersistentState(
    KEY_SIDEBAR_IS_EXTRAS_OPEN,
    false,
  );
  const [isGamesOpen, setIsGamesOpen] = usePersistentState(
    KEY_SIDEBAR_IS_GAMES_OPEN,
    false,
  );
  const [isExternalLinksOpen, setIsExternalLinksOpen] = usePersistentState(
    KEY_SIDEBAR_IS_EXTERNAL_LINKS_OPEN,
    false,
  );

  const navigate = useNavigate();
  const location = useLocation();
  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const getLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-1 rounded-md transition-colors ${
      isActive
        ? 'text-sidebar-highlight bg-sidebar-highlight-alpha-10'
        : 'text-gray-100 hover:text-white hover:bg-gray-800'
    }`;

  const isMainActive =
    location.pathname === '/' || location.pathname === '/about';

  const isContentActive =
    location.pathname.startsWith('/blog') ||
    location.pathname.startsWith('/projects') ||
    location.pathname.startsWith('/logs') ||
    location.pathname.startsWith('/stories');

  const isAppsActive = location.pathname.startsWith('/apps');

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
        className={`fixed top-0 left-0 h-screen bg-black/30 backdrop-blur-sm text-white w-64 z-50 flex flex-col border-r border-gray-700/50 font-arvo`}
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

        <div className="flex-grow p-4 overflow-y-auto">
          <div className="mt-8">
            <button
              onClick={() => setIsMainOpen(!isMainOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${
                isMainActive ? 'text-sidebar-highlight' : 'text-gray-100'
              }`}
            >
              <span
                className={`flex items-center gap-2 font-sans ${isMainActive ? 'text-sidebar-highlight' : 'text-white'}`}
              >
                <AsteriskSimpleIcon size={16} />
                <span>Main</span>
              </span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isMainOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isMainOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
                <NavLink to="/" className={getLinkClass}>
                  <HouseIcon size={24} />
                  <span>Home</span>
                </NavLink>
                <NavLink to="/about" className={getLinkClass}>
                  <UserIcon size={24} />
                  <span>About</span>
                </NavLink>
              </nav>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsContentOpen(!isContentOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${
                isContentActive ? 'text-sidebar-highlight' : 'text-gray-100'
              }`}
            >
              <span
                className={`flex items-center gap-2 font-sans ${isContentActive ? 'text-sidebar-highlight' : 'text-white'}`}
              >
                <BooksIcon size={16} />
                <span>Content</span>
              </span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isContentOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isContentOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
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
              </nav>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsAppsOpen(!isAppsOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${
                isAppsActive ? 'text-sidebar-highlight' : 'text-gray-100'
              }`}
            >
              <span
                className={`flex items-center gap-2 font-sans ${isAppsActive ? 'text-sidebar-highlight' : 'text-white'}`}
              >
                <SquaresFourIcon size={16} />
                <span>Apps</span>
              </span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isAppsOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isAppsOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
                <NavLink to="/apps" className={getLinkClass}>
                  <SquaresFourIcon size={24} />
                  <span>All Apps</span>
                </NavLink>
              </nav>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsExtrasOpen(!isExtrasOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isExtrasOpen ? 'text-gray-100' : 'text-gray-100'}`}
            >
              <span className="flex items-center gap-2 font-sans text-white">
                <AlienIcon size={16} />
                <span>Extras</span>
                <LinkIcon size={16} className="text-rose-400" />
              </span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isExtrasOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isExtrasOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
                <NavLink to="/stories" className={getLinkClass}>
                  <SwordIcon className="text-yellow-500" size={24} />
                  <span>
                    S<span className="text-yellow-500"> &amp; </span>F&nbsp;<sup className="text-blue-500"> (alpha) </sup>
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
              onClick={() => setIsGamesOpen(!isGamesOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isGamesOpen ? 'text-gray-100' : 'text-gray-100'}`}
            >
              <span className="flex items-center gap-2 font-sans text-white">
                <JoystickIcon size={16} />
                <span>Games</span>
                <ArrowSquareOutIcon size={16} className="text-rose-400" />
              </span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isGamesOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isGamesOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
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
              onClick={() => setIsExternalLinksOpen(!isExternalLinksOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isExternalLinksOpen ? 'text-gray-100' : 'text-gray-100'}`}
            >
              <span className="flex items-center gap-2 font-sans text-white">
                <AnchorIcon size={16} />
                <span>External Links</span>
                <ArrowSquareOutIcon size={16} className="text-rose-400" />
              </span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isExternalLinksOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isExternalLinksOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
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

        <div className="p-4 text-xs text-gray-300 text-left">
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setIsPaletteOpen(true)}
              className="flex items-center justify-center w-full text-sm font-normal tracking-wider focus:outline-none bg-gray-800 text-white hover:bg-gray-700 rounded-md p-2 font-sans"
            >
              <span>Commands</span>
              <MagnifyingGlassIcon size={20} className="ml-2" />
            </button>
          </div>
          <button
            onClick={handleSettingsClick}
            className="flex items-center justify-center w-full text-sm font-normal tracking-wider mb-4 focus:outline-none bg-gray-800 text-white hover:bg-gray-700 rounded-md p-2 font-sans"
          >
            <span>Settings</span>
            <GearSixIcon size={20} className="ml-3" />
          </button>
          <hr className="border-gray-700 my-4" />

          <div className="flex space-x-2 font-sans">
            <NavLink
              to="/random"
              className="flex items-center justify-center space-x-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 text-gray-300 py-1.5 px-3 rounded-md transition-colors w-full font-sans text-center"
            >
              <ShuffleIcon size={20} />
              <span>Random</span>
            </NavLink>
            <button
              onClick={toggleModal}
              className="flex items-center justify-center space-x-2 bg-gray-900 border border-gray-700 hover:bg-gray-800 hover:border-gray-600 text-gray-300 py-1.5 px-3 rounded-md transition-colors w-full font-sans"
            >
              <EnvelopeSimpleIcon size={20} />
              <span>Contact</span>
            </button>
          </div>

          <div className="flex justify-between items-center mt-4">
            <p>&copy; {new Date().getFullYear()} fezcode</p>
            <p>Version {version}</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
