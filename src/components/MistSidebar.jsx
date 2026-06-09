import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  CaretDoubleDownIcon,
  CaretDoubleUpIcon,
  EnvelopeSimpleIcon,
  GearSixIcon,
  MagnifyingGlassIcon,
  ShuffleIcon,
} from '@phosphor-icons/react';
import piml from 'piml';

import { MistOrb, MistHorizon } from './mist';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { appIcons as ICON_MAP } from '../utils/appIcons';
import { version } from '../version';

/* ---------------------------------------------------------------
 * Lowercase roman numerals — mist never raises its voice.
 * ------------------------------------------------------------- */
const ROMAN = ['i', 'ii', 'iii', 'iv', 'v', 'vi', 'vii', 'viii', 'ix', 'x'];

/* ---------------------------------------------------------------
 * Nav link — Mist treatment: Instrument Serif label, dissolve to
 * eucalyptus on hover, italic + a fading drift bar when active.
 * ------------------------------------------------------------- */
const MistNavLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        'group relative grid grid-cols-[20px_1fr_14px] items-baseline gap-3 pl-6 pr-5 py-2.5 transition-colors duration-[250ms]',
        isActive
          ? 'text-[#5F837B]'
          : 'text-[#3C4845]/85 hover:text-[#5F837B]',
      ].join(' ')
    }
  >
    {({ isActive }) => (
      <>
        <span
          aria-hidden="true"
          className={`absolute left-0 top-1 bottom-1 w-[2px] rounded-full transition-opacity duration-[250ms] ${
            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-40'
          }`}
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(95,131,123,0.65), transparent)',
          }}
        />
        {Icon ? (
          <Icon
            size={14}
            weight="light"
            className={`transition-colors duration-[250ms] ${
              isActive ? 'text-[#5F837B]' : 'text-[#8A9894]'
            }`}
          />
        ) : (
          <span />
        )}
        <span className={`font-instr-serif text-[16px] ${isActive ? 'italic' : ''}`}>
          {label}
        </span>
        <ArrowRightIcon
          size={12}
          className={`justify-self-end transition-all duration-[250ms] ${
            isActive
              ? 'opacity-100 translate-x-0 text-[#5F837B]'
              : 'opacity-0 -translate-x-2 text-[#8A9894] group-hover:opacity-100 group-hover:translate-x-0'
          }`}
        />
      </>
    )}
  </NavLink>
);

/* ---------------------------------------------------------------
 * Section header — § i — label, all lowercase, collapsible.
 * ------------------------------------------------------------- */
const SectionHeader = ({ index, label, isOpen, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-baseline justify-between gap-3 pl-6 pr-5 py-3 transition-colors duration-[250ms] ${
      active ? 'text-[#5F837B]' : 'text-[#5C6B67] hover:text-[#3C4845]'
    }`}
  >
    <span className="flex items-baseline gap-2.5 font-ibm-plex-mono text-[10px] tracking-[0.22em] lowercase">
      <span className="text-[#5F837B]">§ {ROMAN[index] || index + 1}</span>
      <span>{label}</span>
    </span>
    <span
      aria-hidden="true"
      className={`font-ibm-plex-mono text-[10px] text-[#8A9894] transition-transform ${
        isOpen ? 'rotate-0' : '-rotate-90'
      }`}
    >
      ↓
    </span>
  </button>
);

/* ---------------------------------------------------------------
 * External link row — superscript ↗ whispers that this leaves the fog.
 * ------------------------------------------------------------- */
const ExternalLink = ({ item, icon: Icon }) => (
  <a
    href={item.url || item.to}
    target="_blank"
    rel="noopener noreferrer"
    className="group grid grid-cols-[20px_1fr_14px] items-baseline gap-3 pl-6 pr-5 py-2.5 transition-colors duration-[250ms] text-[#3C4845]/85 hover:text-[#5F837B]"
  >
    {Icon ? (
      <Icon size={14} weight="light" className="text-[#8A9894]" />
    ) : (
      <span />
    )}
    <span className="font-instr-serif text-[16px]">
      {item.label}
      <sup className="ml-1 font-ibm-plex-mono text-[9px] tracking-[0.12em] text-[#8A9894]">
        ↗
      </sup>
    </span>
    <span />
  </a>
);

/* ---------------------------------------------------------------
 * Tool chip — a small veil surface; no hard borders, only haze.
 * ------------------------------------------------------------- */
const ToolChip = ({ label, icon: Icon, onClick, title }) => (
  <button
    type="button"
    title={title || label}
    onClick={onClick}
    className="group flex flex-col items-center gap-1.5 py-2 rounded-2xl bg-white/40 backdrop-blur-sm shadow-[0_18px_50px_rgba(60,72,69,0.10)] hover:bg-white/60 transition-colors duration-[250ms]"
  >
    <Icon
      size={16}
      weight="light"
      className="text-[#5C6B67] group-hover:text-[#5F837B] transition-colors duration-[250ms]"
    />
    <span className="font-ibm-plex-mono text-[8.5px] tracking-[0.22em] lowercase text-[#5C6B67] group-hover:text-[#5F837B] transition-colors duration-[250ms]">
      {label}
    </span>
  </button>
);

/* =========================================================================
 * Sidebar root — a fog panel hanging at the left edge of waking.
 * ========================================================================= */
const MistSidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
  const { config } = useSiteConfig();
  const [sidebarConfig, setSidebarConfig] = useState(null);
  const { unlockAchievement } = useAchievements();

  const [sidebarState, setSidebarState] = usePersistentState(KEY_SIDEBAR_STATE, {
    isMainOpen: true,
    isContentOpen: true,
    isSoftwareOpen: true,
    isAppsOpen: true,
    isStatusOpen: false,
    isExtrasOpen: false,
  });

  const scrollRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [gradient, setGradient] = useState({ top: false, bottom: false });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/sidebar.piml');
        if (!res.ok) return;
        const txt = await res.text();
        const parsed = piml.parse(txt);
        if (!cancelled) setSidebarConfig(parsed.sidebar);
      } catch (e) {
        // fail silent — the fog keeps the rest
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const atBottom = Math.ceil(scrollTop + clientHeight) >= scrollHeight;
    const atTop = scrollTop <= 0;
    const scrollable = scrollHeight > clientHeight;
    setGradient({
      top: scrollable && !atTop,
      bottom: scrollable && !atBottom,
    });
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return undefined;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [isOpen, sidebarState, sidebarConfig, checkScroll]);

  const toggleSection = (id) =>
    setSidebarState((prev) => ({ ...prev, [id]: !prev[id] }));

  const variants = {
    open: { x: 0, transition: { type: 'circOut', duration: 0.4 } },
    closed: { x: '-100%', transition: { type: 'circIn', duration: 0.3 } },
  };

  const brandTitle = config?.hero?.title || 'Fezcodex';
  const kernelName = config?.kernel?.codename;

  return (
    <>
      {/* mobile backdrop — a wall of fog, not a shadow */}
      <div
        className={`fixed inset-0 bg-[#DFE5E3]/60 backdrop-blur-sm z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        className="fixed top-0 left-0 h-screen w-72 z-50 flex flex-col overflow-hidden bg-[#EEF2F1] selection:bg-[#8FA8BC]/30"
        style={{
          backgroundImage:
            'radial-gradient(420px 320px at 50% -10%, #E5EBE9 0%, transparent 60%), radial-gradient(340px 420px at -20% 110%, #D2DBD8 0%, transparent 55%)',
        }}
      >
        {/* right edge — a fading horizon instead of a border */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-0 right-0 bottom-0 w-px"
          style={{
            background:
              'linear-gradient(180deg, transparent, rgba(60,72,69,0.14) 30%, rgba(60,72,69,0.14) 70%, transparent)',
          }}
        />

        {/* ================= header: orb + wordmark ================= */}
        <motion.div
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10 px-6 pt-7 pb-5"
        >
          <div className="flex items-center gap-3">
            <MistOrb size={26} />
            <Link
              to="/"
              onClick={isOpen && window.innerWidth < 768 ? toggleSidebar : undefined}
              className="group"
            >
              <span className="font-instr-serif text-[27px] text-[#3C4845] leading-none group-hover:text-[#5F837B] transition-colors duration-[250ms]">
                {brandTitle}
                <span aria-hidden="true" className="text-[#8FA8BC]">
                  .
                </span>
              </span>
            </Link>
          </div>
          <div className="mt-3 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5C6B67]">
            codex kernel · v{version}
          </div>
          <div className="mt-1 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] lowercase text-[#5F837B]">
            {kernelName}
          </div>
          <MistHorizon className="mt-5" />
        </motion.div>

        {/* ================= scrollable sections ================= */}
        <div className="relative z-10 flex-1 overflow-hidden">
          {gradient.top && (
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center bg-gradient-to-b from-[#EEF2F1] to-transparent z-20 pointer-events-none"
            >
              <CaretDoubleUpIcon size={14} className="text-[#5F837B] mt-1" />
            </div>
          )}

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide no-scrollbar py-2"
          >
            {Array.isArray(sidebarConfig) &&
              sidebarConfig.map((section, sectionIdx) => {
                const items = Array.isArray(section.content) ? section.content : [];
                const sectionId = section.id;
                const sectionOpen = sidebarState[sectionId];
                const sectionActive = items.some((item) =>
                  item.to === '/'
                    ? location.pathname === '/'
                    : item.to && location.pathname.startsWith(item.to),
                );

                return (
                  <React.Fragment key={sectionId || sectionIdx}>
                    <SectionHeader
                      index={sectionIdx}
                      label={section.label}
                      isOpen={sectionOpen}
                      active={sectionActive}
                      onClick={() => toggleSection(sectionId)}
                    />
                    {sectionOpen && (
                      <nav className="flex flex-col pb-2">
                        {items.map((item, idx) => {
                          const Icon = ICON_MAP[item.icon] || null;
                          const isExternal =
                            item.external === 'true' ||
                            item.url ||
                            (item.to && item.to.startsWith('http'));
                          if (isExternal) {
                            return (
                              <ExternalLink key={idx} item={item} icon={Icon} />
                            );
                          }
                          return (
                            <MistNavLink
                              key={idx}
                              to={item.to}
                              label={item.label}
                              icon={Icon}
                            />
                          );
                        })}
                        <MistHorizon className="mt-2" />
                      </nav>
                    )}
                  </React.Fragment>
                );
              })}
          </div>

          {gradient.bottom && (
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center bg-gradient-to-t from-[#EEF2F1] to-transparent z-20 pointer-events-none"
            >
              <CaretDoubleDownIcon size={14} className="text-[#5F837B] mb-1" />
            </div>
          )}
        </div>

        {/* ================= footer: tool chips + colophon ================= */}
        <div className="relative z-10 px-5 pb-4">
          <MistHorizon className="mb-4" />
          <div className="grid grid-cols-4 gap-2 mb-4">
            <ToolChip
              label="cmd"
              title="Command palette"
              icon={MagnifyingGlassIcon}
              onClick={() => setIsPaletteOpen(true)}
            />
            <ToolChip
              label="set"
              title="Settings"
              icon={GearSixIcon}
              onClick={() => navigate('/settings')}
            />
            <ToolChip
              label="rnd"
              title="Random"
              icon={ShuffleIcon}
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
            />
            <ToolChip
              label="msg"
              title="Contact"
              icon={EnvelopeSimpleIcon}
              onClick={toggleModal}
            />
          </div>

          <div className="flex items-center justify-between font-ibm-plex-mono text-[9px] tracking-[0.22em] lowercase text-[#8A9894]">
            <span>© {new Date().getFullYear()} · fezcode</span>
            <span className="text-[#5F837B]">mist</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default MistSidebar;
