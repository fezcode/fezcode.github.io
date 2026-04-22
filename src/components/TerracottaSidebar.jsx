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

import { TerracottaMark } from './terracotta';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { appIcons as ICON_MAP } from '../utils/appIcons';
import { version } from '../version';

/* ---------------------------------------------------------------
 * Roman numeral lookup — matches how the sidebar.piml is ordered.
 * ------------------------------------------------------------- */
const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/* ---------------------------------------------------------------
 * Nav link — Plumb treatment: Fraunces label, terra rule on hover,
 * italic + terra left bar when active.
 * ------------------------------------------------------------- */
const TerracottaNavLink = ({ to, label, icon: Icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      [
        'group relative grid grid-cols-[20px_1fr_14px] items-baseline gap-3 pl-6 pr-5 py-2.5 transition-colors border-l-2',
        isActive
          ? 'border-[#C96442] text-[#9E4A2F]'
          : 'border-transparent text-[#1A1613]/85 hover:text-[#1A1613] hover:border-[#1A1613]/30',
      ].join(' ')
    }
  >
    {({ isActive }) => (
      <>
        {Icon ? (
          <Icon
            size={14}
            weight="regular"
            className={isActive ? 'text-[#9E4A2F]' : 'text-[#2E2620]/60'}
          />
        ) : (
          <span />
        )}
        <span
          className={`font-fraunces text-[15px] tracking-[-0.01em] ${isActive ? 'italic' : ''}`}
          style={{
            fontVariationSettings: isActive
              ? '"opsz" 18, "SOFT" 80, "WONK" 1, "wght" 440'
              : '"opsz" 18, "SOFT" 30, "WONK" 0, "wght" 420',
          }}
        >
          {label}
        </span>
        <ArrowRightIcon
          size={12}
          className={`justify-self-end transition-all ${
            isActive
              ? 'opacity-100 translate-x-0 text-[#C96442]'
              : 'opacity-0 -translate-x-2 text-[#2E2620]/50 group-hover:opacity-100 group-hover:translate-x-0'
          }`}
        />
      </>
    )}
  </NavLink>
);

/* ---------------------------------------------------------------
 * Section header — the § I — LABEL primitive, collapsible.
 * ------------------------------------------------------------- */
const SectionHeader = ({ index, label, isOpen, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-baseline justify-between gap-3 pl-6 pr-5 py-3 transition-colors border-l-2 ${
      active
        ? 'border-[#C96442]/60 text-[#9E4A2F]'
        : 'border-transparent text-[#2E2620]/70 hover:text-[#1A1613]'
    }`}
  >
    <span className="flex items-baseline gap-2.5 font-ibm-plex-mono text-[10px] tracking-[0.22em] uppercase">
      <span className="text-[#9E4A2F]">§ {ROMAN[index] || index + 1}</span>
      <span>{label}</span>
    </span>
    <span
      aria-hidden="true"
      className={`font-ibm-plex-mono text-[10px] text-[#2E2620]/50 transition-transform ${
        isOpen ? 'rotate-0' : '-rotate-90'
      }`}
    >
      ↓
    </span>
  </button>
);

/* ---------------------------------------------------------------
 * External link row — small chevron + superscript ↗ to signal off-site.
 * ------------------------------------------------------------- */
const ExternalLink = ({ item, icon: Icon }) => (
  <a
    href={item.url || item.to}
    target="_blank"
    rel="noopener noreferrer"
    className="group grid grid-cols-[20px_1fr_14px] items-baseline gap-3 pl-6 pr-5 py-2.5 transition-colors border-l-2 border-transparent text-[#1A1613]/85 hover:text-[#1A1613] hover:border-[#1A1613]/30"
  >
    {Icon ? (
      <Icon size={14} className="text-[#2E2620]/60" />
    ) : (
      <span />
    )}
    <span
      className="font-fraunces text-[15px] tracking-[-0.01em]"
      style={{
        fontVariationSettings: '"opsz" 18, "SOFT" 30, "WONK" 0, "wght" 420',
      }}
    >
      {item.label}
      <sup className="ml-1 font-ibm-plex-mono text-[9px] tracking-[0.12em] text-[#2E2620]/50">
        ↗
      </sup>
    </span>
    <span />
  </a>
);

/* ---------------------------------------------------------------
 * Tool chip — small hairline button for the footer quick actions.
 * ------------------------------------------------------------- */
const ToolChip = ({ label, icon: Icon, onClick, title }) => (
  <button
    type="button"
    title={title || label}
    onClick={onClick}
    className="group flex flex-col items-center gap-1.5 py-2 border border-[#1A161320] hover:border-[#1A1613] hover:bg-[#E8DECE]/60 transition-colors"
  >
    <Icon
      size={16}
      weight="regular"
      className="text-[#2E2620]/80 group-hover:text-[#9E4A2F] transition-colors"
    />
    <span className="font-ibm-plex-mono text-[8.5px] tracking-[0.22em] uppercase text-[#2E2620]/70">
      {label}
    </span>
  </button>
);

/* =========================================================================
 * Sidebar root
 * ========================================================================= */
const TerracottaSidebar = ({
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
        // fail silent — sidebar still renders its chrome
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
  const kernelName = config?.kernel?.codename || 'bonewright';

  return (
    <>
      {/* mobile backdrop */}
      <div
        className={`fixed inset-0 bg-[#1A1613]/45 backdrop-blur-[2px] z-40 md:hidden transition-opacity ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <motion.aside
        initial={false}
        animate={isOpen ? 'open' : 'closed'}
        variants={variants}
        className="fixed top-0 left-0 h-screen w-72 z-50 flex flex-col overflow-hidden border-r border-[#1A161320] bg-[#F3ECE0]"
        style={{
          backgroundImage:
            'radial-gradient(400px 300px at 50% -10%, #EDE3D3 0%, transparent 60%)',
        }}
      >
        {/* subtle paper grain inside sidebar too */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.22] mix-blend-multiply"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.08 0 0 0 0 0.06 0 0 0 0.28 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
          }}
        />

        {/* ================= header: wordmark + codex line ================= */}
        <div className="relative z-10 px-6 pt-7 pb-5 border-b border-[#1A161320]">
          <div className="flex items-baseline gap-3">
            <TerracottaMark size={18} color="#C96442" />
            <Link
              to="/"
              onClick={isOpen && window.innerWidth < 768 ? toggleSidebar : undefined}
              className="group"
            >
              <span
                className="font-fraunces text-[26px] tracking-[-0.03em] text-[#1A1613] leading-none group-hover:text-[#9E4A2F] transition-colors"
                style={{
                  fontVariationSettings:
                    '"opsz" 36, "SOFT" 30, "WONK" 1, "wght" 500',
                }}
              >
                {brandTitle}
                <span
                  aria-hidden="true"
                  className="text-[#C96442]"
                  style={{ fontVariationSettings: '"wght" 800' }}
                >
                  .
                </span>
              </span>
            </Link>
          </div>
          <div className="mt-3 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#2E2620]/70">
            Codex kernel · v{version}
          </div>
          <div className="mt-1 font-ibm-plex-mono text-[9.5px] tracking-[0.22em] uppercase text-[#9E4A2F]/90">
            {kernelName}
          </div>
        </div>

        {/* ================= scrollable sections ================= */}
        <div className="relative z-10 flex-1 overflow-hidden">
          {gradient.top && (
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center bg-gradient-to-b from-[#F3ECE0] to-transparent z-20 pointer-events-none"
            >
              <CaretDoubleUpIcon size={14} className="text-[#C96442] mt-1" />
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
                      <nav className="flex flex-col pb-2 border-b border-dashed border-[#1A161320]">
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
                            <TerracottaNavLink
                              key={idx}
                              to={item.to}
                              label={item.label}
                              icon={Icon}
                            />
                          );
                        })}
                      </nav>
                    )}
                  </React.Fragment>
                );
              })}
          </div>

          {gradient.bottom && (
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-0 right-0 h-10 flex items-center justify-center bg-gradient-to-t from-[#F3ECE0] to-transparent z-20 pointer-events-none"
            >
              <CaretDoubleDownIcon size={14} className="text-[#C96442] mb-1" />
            </div>
          )}
        </div>

        {/* ================= footer: tool chips + colophon ================= */}
        <div className="relative z-10 px-5 py-4 border-t border-[#1A161320] bg-[#E8DECE]/50">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <ToolChip
              label="Cmd"
              title="Command palette"
              icon={MagnifyingGlassIcon}
              onClick={() => setIsPaletteOpen(true)}
            />
            <ToolChip
              label="Set"
              title="Settings"
              icon={GearSixIcon}
              onClick={() => navigate('/settings')}
            />
            <ToolChip
              label="Rnd"
              title="Random"
              icon={ShuffleIcon}
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
            />
            <ToolChip
              label="Msg"
              title="Contact"
              icon={EnvelopeSimpleIcon}
              onClick={toggleModal}
            />
          </div>

          <div className="flex items-center justify-between font-ibm-plex-mono text-[9px] tracking-[0.22em] uppercase text-[#2E2620]/60">
            <span>© {new Date().getFullYear()} · Fezcode</span>
            <span className="text-[#9E4A2F]/80">Terracotta</span>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default TerracottaSidebar;
