import React, { useRef, useState, useEffect, useCallback } from 'react';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  GearSixIcon,
  ShuffleIcon,
  EnvelopeSimpleIcon,
} from '@phosphor-icons/react';

import { version } from '../version';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { appIcons as ICON_MAP } from '../utils/appIcons';
import piml from 'piml';

const TerracottaSidebar = ({ isOpen, toggleSidebar, toggleModal, setIsPaletteOpen }) => {
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

  const [sidebarState, setSidebarState] = usePersistentState(KEY_SIDEBAR_STATE, {
    isMainOpen: true,
    isContentOpen: true,
    isSoftwareOpen: true,
    isAppsOpen: true,
    isStatusOpen: false,
    isExtrasOpen: false,
  });

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
    setSidebarState((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getLinkClass = ({ isActive }) =>
    `group flex items-center justify-between px-6 py-3 transition-all duration-300 border-b border-[#1A161320] ${
      isActive
        ? 'bg-[#C96442]/10 text-[#1A1613]'
        : 'text-[#2E2620]/70 hover:text-[#1A1613] hover:bg-[#E8DECE]/50'
    }`;

  const SectionHeader = ({ id, label, isOpen, active }) => (
    <button
      onClick={() => toggleSection(id)}
      className={`flex items-center justify-between w-full px-6 py-4 border-b border-[#1A161320] transition-all duration-300 ${
        active
          ? 'bg-[#C96442]/5 text-[#9E4A2F] border-l-2 border-[#C96442]'
          : 'text-[#2E2620]/50 hover:text-[#2E2620] border-l-2 border-transparent'
      }`}
    >
      <span className="font-mono text-[11px] uppercase tracking-[0.2em]">
        {'//'} {label}
      </span>
      <span className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
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
        className={`fixed inset-0 bg-[#1A1613]/50 backdrop-blur-sm z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        className="fixed top-0 left-0 h-screen w-72 bg-[#F3ECE0] z-50 flex flex-col border-r border-[#1A161320] shadow-[0_40px_80px_-40px_#1A161330]"
      >
        <div className="p-8 border-b border-[#1A161320] flex flex-col gap-2 bg-[#E8DECE]/50 relative">
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-[#C96442]/70 via-[#B88532]/40 to-transparent" />
          <Link
            to="/"
            className="flex items-center gap-3 group"
            onClick={isOpen && window.innerWidth < 768 ? toggleSidebar : undefined}
          >
            <span className="text-2xl font-fraunces italic tracking-tight text-[#1A1613]">
              {config?.hero?.title?.toLowerCase().endsWith('codex') ? (
                <>
                  {config.hero.title.slice(0, -5)}
                  <span className="text-[#C96442]">codex</span>
                </>
              ) : (
                config?.hero?.title || 'Fezcodex'
              )}
            </span>
          </Link>
          <span className="font-mono text-[10px] text-[#2E2620]/50 uppercase tracking-widest">
            Archive Kernel {'//'} v{version} {'//'} {config?.kernel?.codename}
          </span>
        </div>

        <div className="relative flex-grow overflow-hidden">
          {showScrollGradient.top && (
            <div className="absolute top-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-b from-[#F3ECE0] to-transparent z-20 pointer-events-none">
              <CaretDoubleUpIcon size={16} className="text-[#C96442] mt-2" />
            </div>
          )}

          <div ref={scrollRef} className="h-full overflow-y-auto scrollbar-hide no-scrollbar">
            {Array.isArray(sidebarConfig) &&
              sidebarConfig.map((section, sectionIdx) => {
                const items = Array.isArray(section.content) ? section.content : [];
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
                          if (
                            item.external === 'true' ||
                            item.url ||
                            (item.to && item.to.startsWith('http'))
                          ) {
                            return (
                              <a
                                key={idx}
                                href={item.url || item.to}
                                className="group flex items-center justify-between px-6 py-3 transition-all duration-300 border-b border-[#1A161320] text-[#2E2620]/70 hover:text-[#1A1613] hover:bg-[#E8DECE]/50"
                              >
                                <div className="flex items-center gap-4">
                                  <Icon size={18} weight="bold" />
                                  <span className="font-mono text-sm uppercase tracking-widest">
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
            <div className="absolute bottom-0 left-0 right-0 h-12 flex items-center justify-center bg-gradient-to-t from-[#F3ECE0] to-transparent z-20 pointer-events-none">
              <CaretDoubleDownIcon size={16} className="text-[#C96442] mb-2" />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#1A161320] bg-[#E8DECE]/50">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <FooterButton
              onClick={() => setIsPaletteOpen(true)}
              icon={MagnifyingGlassIcon}
              title="COMMANDS"
            />
            <FooterButton
              onClick={() => navigate('/settings')}
              icon={GearSixIcon}
              title="SETTINGS"
            />
            <FooterButton
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
              icon={ShuffleIcon}
              title="RANDOM"
            />
            <FooterButton onClick={toggleModal} icon={EnvelopeSimpleIcon} title="CONTACT" />
          </div>
          <div className="text-center">
            <p className="font-mono text-[10px] text-[#2E2620]/40 uppercase tracking-widest">
              {`© ${new Date().getFullYear()} Fezcode // Theme: Terracotta`}
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
      <span className="font-mono text-sm uppercase tracking-widest">{label}</span>
    </div>
    <ArrowRightIcon
      size={14}
      className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all"
    />
  </NavLink>
);

const FooterButton = ({ onClick, icon: Icon, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="group flex flex-col items-center justify-center p-2 border border-[#1A161320] bg-[#F3ECE0] hover:bg-[#C96442] hover:border-[#C96442] transition-all aspect-square"
  >
    <div className="text-[#1A1613] group-hover:text-[#F3ECE0] transition-all">
      <Icon size={18} weight="bold" />
    </div>
  </button>
);

export default TerracottaSidebar;
