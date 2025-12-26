import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HouseIcon,
  UserIcon,
  BookOpenIcon,
  WrenchIcon,
  ArticleIcon,
  SquaresFourIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  TimerIcon,
  PushPinIcon,
  TrophyIcon,
  ShuffleIcon,
  EnvelopeSimpleIcon,
  BugBeetleIcon,
  ArrowRightIcon,
  SwordIcon,
  RssIcon,
  GraphIcon,
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  FlaskIcon,
  BookBookmarkIcon,
  FilePdfIcon,
} from '@phosphor-icons/react';

import { version } from '../version';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import piml from 'piml';

const ICON_MAP = {
  HouseIcon,
  UserIcon,
  BookOpenIcon,
  WrenchIcon,
  ArticleIcon,
  SquaresFourIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  TimerIcon,
  PushPinIcon,
  TrophyIcon,
  ShuffleIcon,
  EnvelopeSimpleIcon,
  BugBeetleIcon,
  ArrowRightIcon,
  SwordIcon,
  RssIcon,
  GraphIcon,
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  FlaskIcon,
  BookBookmarkIcon,
  FilePdfIcon,
};

const BrutalistSidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
  const { config } = useSiteConfig();
  const [sidebarConfig, setSidebarConfig] = useState(null);

  useEffect(() => {
    const fetchSidebarConfig = async () => {
      try {
        const response = await fetch('/sidebar.piml');
        if (response.ok) {
          const text = await response.text();
          const parsed = piml.parse(text);
          setSidebarConfig(parsed.sidebar);
        }
      } catch (error) {
        console.error('Failed to load sidebar config:', error);
      }
    };
    fetchSidebarConfig();
  }, []);

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
              {config?.hero?.title?.toLowerCase().endsWith('codex') ? (
                <>
                  {config.hero.title.slice(0, -5)}
                  <span className="text-emerald-500">codex</span>
                </>
              ) : (
                config?.hero?.title || 'Fezcodex'
              )}
            </span>
          </Link>
          <span className="font-arvo text-[10px] text-gray-500 uppercase tracking-widest font-medium">
            Digital Archive Kernel {'//'} v{version} {'//'} {config?.kernel?.codename}
          </span>
        </div>

        {/* Scrollable Content */}
        <div className="relative flex-grow overflow-hidden">
          {showScrollGradient.top && (
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-b from-[#050505] to-transparent z-20 pointer-events-none">
              <CaretDoubleUpIcon size={16} className="text-emerald-500 mt-2" />
            </div>
          )}

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto scrollbar-hide no-scrollbar"
          >
            {Array.isArray(sidebarConfig) &&
              sidebarConfig.map((section, sectionIdx) => {
                const items = Array.isArray(section.content)
                  ? section.content
                  : [];
                const isActive = items.some((item) =>
                  item.to === '/'
                    ? location.pathname === '/'
                    : item.to && location.pathname.startsWith(item.to),
                );

                return (
                  <React.Fragment key={section.id || sectionIdx}>
                    <SectionHeader
                      id={section.id}
                      label={section.label}
                      isOpen={sidebarState[section.id]}
                      active={isActive}
                    />
                    {sidebarState[section.id] && (
                      <nav className="flex flex-col">
                        {items.map((item, idx) => {
                          const Icon = ICON_MAP[item.icon] || ArrowRightIcon;
                          if (item.external === 'true' || item.url) {
                            return (
                              <a
                                key={idx}
                                href={item.url || item.to}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-center justify-between px-6 py-3 transition-all duration-300 border-b border-white/5 text-gray-300 hover:text-white hover:bg-white/5"
                              >
                                <div className="flex items-center gap-4">
                                  <Icon size={18} weight="bold" />
                                  <span className="font-arvo text-sm font-medium uppercase tracking-widest">
                                    {item.label}
                                  </span>
                                </div>
                                <ArrowRightIcon
                                  size={14}
                                  className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
                                />
                              </a>
                            );
                          }
                          return (
                            <SidebarLink
                              key={idx}
                              to={item.to}
                              icon={Icon}
                              label={item.label}
                              getLinkClass={getLinkClass}
                            />
                          );
                        })}
                      </nav>
                    )}
                  </React.Fragment>
                );
              })}
          </div>

          {showScrollGradient.bottom && (
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-t from-[#050505] to-transparent z-20 pointer-events-none">
              <CaretDoubleDownIcon size={16} className="text-emerald-500 mb-2" />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-black/50">
          <div className="grid grid-cols-2 gap-2 mb-6">
            <FooterButton
              onClick={() => setIsPaletteOpen(true)}
              icon={MagnifyingGlassIcon}
              label="CMDS"
            />
            <FooterButton
              onClick={() => navigate('/settings')}
              icon={GearSixIcon}
              label="SETTINGS"
            />
            <FooterButton
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
              icon={ShuffleIcon}
              label="RANDOM"
            />
            <FooterButton
              onClick={toggleModal}
              icon={EnvelopeSimpleIcon}
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
    <ArrowRightIcon
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
