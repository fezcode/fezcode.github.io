import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  TerminalWindowIcon
} from '@phosphor-icons/react';

import { version } from '../version';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';
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
  TerminalWindowIcon
};

const LuxeSidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
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
    `group flex items-center justify-between px-8 py-3 transition-all duration-500 border-l-2 ${
      isActive
        ? 'border-[#8D4004] bg-[#8D4004]/5 text-[#1A1A1A]'
        : 'border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5'
    }`;

  const SectionHeader = ({ id, label, isOpen, active }) => (
    <button
      onClick={() => toggleSection(id)}
      className={`flex items-center justify-between w-full px-8 py-5 transition-all duration-300 ${
        active
          ? 'text-[#8D4004]'
          : 'text-[#1A1A1A] hover:text-[#8D4004]'
      }`}
    >
      <span className="font-playfairDisplay text-sm italic font-medium">
        {label}
      </span>
      <span
        className={`transform transition-transform duration-300 text-[#1A1A1A]/40 text-xs ${isOpen ? 'rotate-180' : ''}`}
      >
        ▼
      </span>
    </button>
  );

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } },
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-[#F5F5F0]/80 backdrop-blur-sm z-40 md:hidden transition-opacity ${
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
        className="fixed top-0 left-0 h-screen w-72 bg-[#FDFCFB] z-50 flex flex-col border-r border-[#1A1A1A]/5 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
      >
        <div className="p-8 pb-4 flex flex-col gap-1">
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={
              isOpen && window.innerWidth < 768 ? toggleSidebar : undefined
            }
          >
            <span className="font-playfairDisplay text-2xl font-bold text-[#1A1A1A]">
              Fezcodex
            </span>
          </Link>
          <span className="font-outfit text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest pl-1">
            Fezcodex v{version}
          </span>
        </div>

        <div className="w-full h-px bg-[#1A1A1A]/5 mx-auto mb-4" />

        {/* Scrollable Content */}
        <div className="relative flex-grow overflow-hidden">
          {showScrollGradient.top && (
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-b from-[#FDFCFB] to-transparent z-20 pointer-events-none">
              <CaretDoubleUpIcon size={16} className="text-[#8D4004] mt-2" />
            </div>
          )}

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto scrollbar-hide no-scrollbar pb-8"
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
                    <AnimatePresence initial={false}>
                      {sidebarState[section.id] && (
                        <motion.nav
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 }
                          }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="flex flex-col overflow-hidden"
                        >
                          {items.map((item, idx) => {
                            const Icon = ICON_MAP[item.icon] || ArrowRightIcon;
                            if (item.external === 'true' || item.url) {
                              return (
                                <a
                                  key={idx}
                                  href={item.url || item.to}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="group flex items-center justify-between px-8 py-3 transition-all duration-300 border-l-2 border-transparent text-[#1A1A1A]/60 hover:text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
                                >
                                  <div className="flex items-center gap-4">
                                    <Icon size={16} />
                                    <span className="font-outfit text-xs font-medium uppercase tracking-widest">
                                      {item.label}
                                    </span>
                                  </div>
                                  <ArrowRightIcon
                                    size={12}
                                    className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#8D4004]"
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
                        </motion.nav>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                );
              })}
          </div>

          {showScrollGradient.bottom && (
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-t from-[#FDFCFB] to-transparent z-20 pointer-events-none">
              <CaretDoubleDownIcon size={16} className="text-[#8D4004] mb-2" />
            </div>
          )}
        </div>

        <div className="p-6 border-t border-[#1A1A1A]/5 bg-[#FAFAF8]">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <FooterButton
              onClick={() => setIsPaletteOpen(true)}
              icon={MagnifyingGlassIcon}
              title="Search"
            />
            <FooterButton
              onClick={() => navigate('/settings')}
              icon={GearSixIcon}
              title="Config"
            />
            <FooterButton
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
              icon={ShuffleIcon}
              title="Random"
            />
            <FooterButton
              onClick={toggleModal}
              icon={EnvelopeSimpleIcon}
              title="Contact"
            />
          </div>
        </div>
      </motion.aside>
    </>
  );
};

const SidebarLink = ({ to, icon: Icon, label, getLinkClass }) => (
  <NavLink to={to} className={getLinkClass}>
    <div className="flex items-center gap-4">
      {Icon && <Icon size={16} />}
      <span className="font-outfit text-xs font-medium uppercase tracking-widest">
        {label}
      </span>
    </div>
  </NavLink>
);

const FooterButton = ({ onClick, icon: Icon, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="group flex items-center justify-center p-3 rounded-full hover:bg-[#1A1A1A]/5 transition-colors text-[#1A1A1A]/60 hover:text-[#1A1A1A]"
  >
    <Icon size={18} />
  </button>
);

export default LuxeSidebar;
