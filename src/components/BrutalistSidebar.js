import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  House,
  User,
  BookOpen,
  Wrench,
  Article,
  SquaresFour,
  GearSix,
  MagnifyingGlass,
  Timer,
  PushPin,
  Trophy,
  Shuffle,
  EnvelopeSimple,
  BugBeetle,
  ArrowRight,
  Sword,
  Rss,
  CaretDoubleDown,
  CaretDoubleUp,
} from '@phosphor-icons/react';

import { version } from '../version';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';

const BrutalistSidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
  const [sidebarState, setSidebarState] = usePersistentState(
    KEY_SIDEBAR_STATE,
    {
      isMainOpen: true,
      isContentOpen: true,
      isAppsOpen: true,
      isStatusOpen: false,
      isExtrasOpen: false,
    },
  );

  const { unlockAchievement } = useAchievements();
  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [showScrollGradient, setShowScrollGradient] = useState({
    top: false,
    bottom: false,
  });

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
      const atTop = scrollTop <= 0;
      const isScrollable = scrollHeight > clientHeight;

      setShowScrollGradient({
        top: isScrollable && !atTop,
        bottom: isScrollable && !atBottom,
      });
    }
  }, []);

  useEffect(() => {
    checkScroll();
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
  }, [isOpen, sidebarState, checkScroll]);

  const toggleSection = (section) => {
    setSidebarState((prevState) => ({
      ...prevState,
      [section]: !prevState[section],
    }));
  };

  const getLinkClass = ({ isActive }) =>
    `group flex items-center justify-between px-6 py-3 transition-all duration-300 border-b border-white/5 ${
      isActive
        ? 'bg-emerald-500/10 text-white'
        : 'text-gray-300 hover:text-white hover:bg-white/5'
    }`;

  const SectionHeader = ({ id, label, isOpen, active }) => (
    <button
      onClick={() => toggleSection(id)}
      className={`flex items-center justify-between w-full px-6 py-4 border-b border-white/10 transition-all duration-300 ${
        active
          ? 'bg-emerald-500/5 text-emerald-400 border-l-2 border-emerald-500'
          : 'text-gray-600 hover:text-gray-400 border-l-2 border-transparent'
      }`}
    >
      <span className="font-arvo text-[11px] uppercase tracking-[0.2em]">
        {'//'} {label}
      </span>
      <span
        className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      >
        ↓
      </span>
    </button>
  );

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'circOut', duration: 0.4 } },
    closed: { x: '-100%', transition: { type: 'circIn', duration: 0.3 } },
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden transition-opacity ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-screen w-72 bg-[#050505] z-50 flex flex-col border-r border-white/10 shadow-2xl"
      >
        <div className="p-8 border-b border-white/10 flex flex-col gap-2 bg-black/50">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={
              isOpen && window.innerWidth < 768 ? toggleSidebar : undefined
            }
          >
            <span className="text-xl font-black uppercase tracking-tighter text-white">
              Fez<span className="text-emerald-500">codex</span>
            </span>
          </Link>
          <span className="font-arvo text-[10px] text-gray-500 uppercase tracking-widest font-medium">
            Digital Archive Kernel v{version}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-grow overflow-hidden">
          {showScrollGradient.top && (
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none">
              <CaretDoubleUp size={16} className="text-emerald-500 mt-2" />
            </div>
          )}

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto scrollbar-hide no-scrollbar"
          >
            {/* Section: Main */}
            <SectionHeader
              id="isMainOpen"
              label="Main"
              isOpen={sidebarState.isMainOpen}
              active={
                location.pathname === '/' ||
                location.pathname === '/about' ||
                location.pathname === '/achievements'
              }
            />
            {sidebarState.isMainOpen && (
              <nav className="flex flex-col">
                <SidebarLink
                  to="/"
                  icon={House}
                  label="Home"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/about"
                  icon={User}
                  label="About"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/achievements"
                  icon={Trophy}
                  label="Achievements"
                  getLinkClass={getLinkClass}
                />
              </nav>
            )}

            {/* Section: Content */}
            <SectionHeader
              id="isContentOpen"
              label="Feed"
              isOpen={sidebarState.isContentOpen}
              active={
                location.pathname.startsWith('/blog') ||
                location.pathname.startsWith('/projects') ||
                location.pathname.startsWith('/logs')
              }
            />
            {sidebarState.isContentOpen && (
              <nav className="flex flex-col">
                <SidebarLink
                  to="/blog"
                  icon={BookOpen}
                  label="Blogposts"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/projects"
                  icon={Wrench}
                  label="Projects"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/logs"
                  icon={Article}
                  label="Discovery Logs"
                  getLinkClass={getLinkClass}
                />
              </nav>
            )}

            {/* Section: Tools */}
            <SectionHeader
              id="isAppsOpen"
              label="Utilities"
              isOpen={sidebarState.isAppsOpen}
              active={
                location.pathname.startsWith('/apps') ||
                location.pathname.startsWith('/pinned-apps') ||
                location.pathname.startsWith('/commands')
              }
            />
            {sidebarState.isAppsOpen && (
              <nav className="flex flex-col">
                <SidebarLink
                  to="/pinned-apps"
                  icon={PushPin}
                  label="Favorites"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/apps"
                  icon={SquaresFour}
                  label="App Center"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/commands"
                  icon={MagnifyingGlass}
                  label="Manuals"
                  getLinkClass={getLinkClass}
                />
              </nav>
            )}

            {/* Section: Status */}
            <SectionHeader
              id="isStatusOpen"
              label="System Status"
              isOpen={sidebarState.isStatusOpen}
              active={
                location.pathname.startsWith('/roadmap') ||
                location.pathname.startsWith('/timeline')
              }
            />
            {sidebarState.isStatusOpen && (
              <nav className="flex flex-col">
                <SidebarLink
                  to="/timeline"
                  icon={Timer}
                  label="History"
                  getLinkClass={getLinkClass}
                />
                <SidebarLink
                  to="/roadmap"
                  icon={BugBeetle}
                  label="Fezzilla"
                  getLinkClass={getLinkClass}
                />
              </nav>
            )}

            {/* Section: Extras */}
            <SectionHeader
              id="isExtrasOpen"
              label="External Nodes"
              isOpen={sidebarState.isExtrasOpen}
              active={location.pathname.startsWith('/stories')}
            />
            {sidebarState.isExtrasOpen && (
              <nav className="flex flex-col">
                <SidebarLink
                  to="/stories"
                  icon={Sword}
                  label="Serfs & Frauds"
                  getLinkClass={getLinkClass}
                />
                <a
                  href="/rss.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between px-6 py-3 transition-all duration-300 border-b border-white/5 text-gray-300 hover:text-white hover:bg-white/5"
                >
                  <div className="flex items-center gap-4">
                    <Rss size={18} weight="bold" />
                    <span className="font-arvo text-sm font-medium uppercase tracking-widest">
                      RSS_Feed
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                  />
                </a>
              </nav>
            )}
          </div>

          {showScrollGradient.bottom && (
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none">
              <CaretDoubleDown size={16} className="text-emerald-500 mb-2" />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/50">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <FooterButton
              onClick={() => setIsPaletteOpen(true)}
              icon={MagnifyingGlass}
              label="CMDS"
            />
            <FooterButton
              onClick={() => navigate('/settings')}
              icon={GearSix}
              label="SETTINGS"
            />
            <FooterButton
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
              icon={Shuffle}
              label="RANDOM"
            />
            <FooterButton
              onClick={toggleModal}
              icon={EnvelopeSimple}
              label="CONTACT"
            />
          </div>
          <div className="text-center">
            <p className="font-arvo text-[10px] text-gray-600 uppercase tracking-widest font-medium">
              {`© ${new Date().getFullYear()} Fezcode // Theme: Brutalist`}
            </p>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const SidebarLink = ({ to, icon: Icon, label, getLinkClass }) => (
  <NavLink to={to} className={getLinkClass}>
    <div className="flex items-center gap-4">
      <Icon size={18} weight="bold" />
      <span className="font-arvo text-sm font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
    <ArrowRight
      size={14}
      className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
    />
  </NavLink>
);

const FooterButton = ({ onClick, icon: Icon, label }) => (
  <button
    onClick={onClick}
    className="group flex flex-col items-center gap-2 p-2 border border-white/5 bg-white/5 hover:bg-white hover:border-white transition-all rounded-sm"
  >
    <div className="p-2 text-white group-hover:text-black transition-all">
      <Icon size={18} weight="bold" />
    </div>
    <span className="font-arvo text-[10px] font-medium tracking-widest text-gray-500 group-hover:text-black transition-colors">
      {label}
    </span>
  </button>
);
export default BrutalistSidebar;
