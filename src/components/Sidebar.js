import React, { useState, useEffect } from 'react';

import { NavLink, Link, useLocation } from 'react-router-dom';

import { motion } from 'framer-motion';

import {
  HouseIcon,
  UserIcon,
  BookOpenIcon,
  WrenchIcon,
  ArticleIcon,
  CaretDownIcon,
  GameControllerIcon,
  ListIcon,
  GithubLogoIcon,
  GlobeSimpleIcon,
  ArrowSquareOutIcon,
  SwordIcon,
} from '@phosphor-icons/react';

import Fez from './Fez';

import { version } from '../version';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isMainOpen, setIsMainOpen] = useState(true);
  const [isContentOpen, setIsContentOpen] = useState(true);
  const [isGamesOpen, setIsGamesOpen] = useState(false);
  const [isWorldBuildingOpen, setIsWorldBuildingOpen] = useState(false);
  const [isExternalLinksOpen, setIsExternalLinksOpen] = useState(false);
  const [allSectionsOpen, setAllSectionsOpen] = useState(true); // New state for collapse all

  const location = useLocation();

  // Effect to update allSectionsOpen when individual sections change
  useEffect(() => {
    setAllSectionsOpen(
      isMainOpen && isContentOpen && isGamesOpen && isWorldBuildingOpen && isExternalLinksOpen,
    );
  }, [isMainOpen, isContentOpen, isGamesOpen, isWorldBuildingOpen, isExternalLinksOpen]);

  const toggleAllSections = () => {
    const newState = !allSectionsOpen;
    setAllSectionsOpen(newState);
    setIsMainOpen(newState);
    setIsContentOpen(newState);
    setIsGamesOpen(newState);
    setIsWorldBuildingOpen(newState);
    setIsExternalLinksOpen(newState);
  };

  const getLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-3 py-1 rounded-md transition-colors ${
      isActive
        ? 'text-primary-400 bg-gray-800'
        : 'text-gray-100 hover:text-white hover:bg-gray-800'
    }`;

  const isMainActive =
    location.pathname === '/' || location.pathname === '/about';

  const isContentActive =
    location.pathname.startsWith('/blog') ||
    location.pathname.startsWith('/projects') ||
    location.pathname.startsWith('/logs');

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
                isMainActive ? 'text-red-400' : 'text-gray-100'
              }`}
            >
              <span className="font-sans text-white">Main</span>

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
                isContentActive ? 'text-red-400' : 'text-gray-100'
              }`}
            >
              <span className="font-sans text-white">Content</span>

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
              </nav>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsWorldBuildingOpen(!isWorldBuildingOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isWorldBuildingOpen ? 'text-gray-100' : 'text-gray-100'}`}
            >
              <span className="font-sans text-white">World Building</span>
              <CaretDownIcon
                size={20}
                className={`transition-transform ${isWorldBuildingOpen ? 'transform rotate-180' : ''}`}
              />
            </button>
            {isWorldBuildingOpen && (
              <nav className="space-y-2 border-l-2 border-gray-700 ml-3 pl-3">
                <NavLink to="/dnd" className={getLinkClass}>
                  <SwordIcon size={24} />
                  <span>From Serfs and Frauds</span>
                </NavLink>
              </nav>
            )}
          </div>

          <div className="mt-8">
            <button
              onClick={() => setIsGamesOpen(!isGamesOpen)}
              className={`flex items-center justify-between w-full text-sm font-normal uppercase tracking-wider mb-4 focus:outline-none ${isGamesOpen ? 'text-gray-100' : 'text-gray-100'}`}
            >
              <span className="flex items-center gap-2 font-sans text-white">
                <span>Games</span>
                <ArrowSquareOutIcon size={16} />
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
                <span>External Links</span>
                <ArrowSquareOutIcon size={16} />
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
          <button
            onClick={toggleAllSections}
            className="flex items-center justify-center w-full text-sm font-normal tracking-wider mb-4 focus:outline-none bg-gray-800 text-white hover:bg-gray-700 rounded-md p-2 font-sans"
          >
            <span>{allSectionsOpen ? 'Collapse All' : 'Expand All'}</span>
            <ListIcon
              size={20}
              className={`ml-3 transition-transform ${allSectionsOpen ? 'transform rotate-180' : ''}`}
            />
          </button>
          <hr className="border-gray-700 my-4" />

          <div className="flex space-x-2 font-sans">
            <button className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors w-full font-sans">
              Button 1
            </button>

            <button className="bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-md transition-colors w-full font-sans">
              Button 2
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
