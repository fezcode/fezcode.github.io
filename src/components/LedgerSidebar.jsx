import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import piml from 'piml';

import { version } from '../version';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { useAchievements } from '../context/AchievementContext';
import { useSiteConfig } from '../context/SiteConfigContext';
import { LedgerRegister, LedgerRule } from './ledger';
import '../styles/Ledger.css';

/**
 * Sidebar for the Ledger theme — the book's index drawer. Wordmark and
 * kernel figures at the top, every section a ruled heading with numbered
 * entries joined to their arrows by dotted leaders, and the register cycler
 * filed at the bottom where a ledger signs its account. No icons, no motion
 * library: text glyphs and a CSS slide are the whole apparatus.
 */

/* Collapsible section head — ▸ rotates open, matching .ldg-summary. */
const SectionHeader = ({ index, label, isOpen, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-expanded={Boolean(isOpen)}
    className="w-full flex items-baseline justify-between gap-3 px-5 py-3 bg-transparent border-0 cursor-pointer text-left"
  >
    <span
      className="ldg-eyebrow flex items-baseline gap-2"
      style={{ color: active ? 'var(--ldg-accent)' : 'var(--ldg-muted)' }}
    >
      <span
        aria-hidden="true"
        className="inline-block transition-transform"
        style={{ transform: isOpen ? 'rotate(90deg)' : 'none' }}
      >
        ▸
      </span>
      <span>
        § {String(index + 1).padStart(2, '0')} {label}
      </span>
    </span>
  </button>
);

/* Internal entry — rank, name, leader, arrow; sunken when current. */
const LedgerNavRow = ({ to, label, rank, onNavigate }) => (
  <NavLink
    to={to}
    onClick={onNavigate}
    className="ldg-row-link"
    style={({ isActive }) =>
      isActive
        ? {
            background: 'var(--ldg-sunken)',
            color: 'var(--ldg-highlight)',
          }
        : undefined
    }
  >
    <span className="ldg-rank">{rank}</span>
    <span
      className="font-bold truncate"
      style={{ fontSize: '0.8rem', flexShrink: 1 }}
    >
      {label}
    </span>
    <span className="ldg-leader" aria-hidden="true" />
    <span className="ldg-accent" aria-hidden="true">
      →
    </span>
  </NavLink>
);

/* External entry — a native anchor so the browser leaves the book. */
const LedgerExternalRow = ({ item, rank }) => (
  <a
    href={item.url || item.to}
    target="_blank"
    rel="noopener noreferrer"
    className="ldg-row-link"
  >
    <span className="ldg-rank">{rank}</span>
    <span
      className="font-bold truncate"
      style={{ fontSize: '0.8rem', flexShrink: 1 }}
    >
      {item.label}
    </span>
    <span className="ldg-leader" aria-hidden="true" />
    <span className="ldg-accent" aria-hidden="true">
      ↗
    </span>
  </a>
);

const LedgerSidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
  const { config } = useSiteConfig();
  const [sidebarConfig, setSidebarConfig] = useState(null);
  const { unlockAchievement } = useAchievements();

  const [sidebarState, setSidebarState] = usePersistentState(
    KEY_SIDEBAR_STATE,
    {
      isMainOpen: true,
      isContentOpen: true,
      isSoftwareOpen: true,
      isAppsOpen: true,
      isStatusOpen: false,
      isExtrasOpen: false,
    },
  );

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
      } catch (error) {
        console.error('Failed to load sidebar config:', error);
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

  const closeOnMobile =
    isOpen && window.innerWidth < 768 ? toggleSidebar : undefined;

  const brandTitle = config?.hero?.title || 'Fezcodex';
  const kernelName = config?.kernel?.codename;

  return (
    <>
      {/* mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-opacity ${
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor:
            'color-mix(in srgb, var(--ldg-highlight) 45%, transparent)',
          backdropFilter: 'blur(2px)',
        }}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      <aside
        className={`ldg-chrome fixed top-0 left-0 h-screen w-72 z-50 flex flex-col overflow-hidden transition-transform duration-300 motion-reduce:transition-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ borderRight: '1px solid var(--ldg-rule)' }}
      >
        {/* ================= header: wordmark + kernel figures ============= */}
        <div className="px-5 pt-6 pb-4">
          <Link to="/" onClick={closeOnMobile} className="no-underline">
            <span
              className="font-bold uppercase block"
              style={{
                color: 'var(--ldg-highlight)',
                letterSpacing: '2px',
                fontSize: '1.1rem',
              }}
            >
              {brandTitle}
            </span>
            <span className="ldg-eyebrow block mt-1">/ LEDGER</span>
          </Link>
          <div className="mt-4 flex flex-col gap-1" style={{ fontSize: '0.72rem' }}>
            <div className="ldg-leader-row">
              <span className="ldg-label">KERNEL</span>
              <span className="ldg-leader" aria-hidden="true" />
              <span className="ldg-highlight">v{version}</span>
            </div>
            {kernelName && (
              <div className="ldg-leader-row">
                <span className="ldg-label">CODENAME</span>
                <span className="ldg-leader" aria-hidden="true" />
                <span className="ldg-highlight uppercase">{kernelName}</span>
              </div>
            )}
          </div>
          <LedgerRule className="mt-4" />
        </div>

        {/* ================= scrollable index ============================== */}
        <div className="relative flex-1 overflow-hidden">
          {gradient.top && (
            <div
              aria-hidden="true"
              className="absolute top-0 left-0 right-0 h-8 flex items-start justify-center z-20 pointer-events-none"
              style={{
                background:
                  'linear-gradient(180deg, var(--ldg-bg), transparent)',
              }}
            >
              <span className="ldg-accent" style={{ fontSize: '0.7rem' }}>
                ▲
              </span>
            </div>
          )}

          <div
            ref={scrollRef}
            className="h-full overflow-y-auto overflow-x-hidden scrollbar-hide no-scrollbar py-1"
          >
            {Array.isArray(sidebarConfig) &&
              sidebarConfig.map((section, sectionIdx) => {
                const items = Array.isArray(section.content)
                  ? section.content
                  : [];
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
                      <nav className="flex flex-col gap-px px-2 pb-2">
                        {items.map((item, idx) => {
                          const rank = String(idx + 1).padStart(2, '0');
                          const isExternal =
                            item.external === 'true' ||
                            item.url ||
                            (item.to && item.to.startsWith('http'));
                          if (isExternal) {
                            return (
                              <LedgerExternalRow
                                key={idx}
                                item={item}
                                rank={rank}
                              />
                            );
                          }
                          return (
                            <LedgerNavRow
                              key={idx}
                              to={item.to}
                              label={item.label}
                              rank={rank}
                              onNavigate={closeOnMobile}
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
              className="absolute bottom-0 left-0 right-0 h-8 flex items-end justify-center z-20 pointer-events-none"
              style={{
                background: 'linear-gradient(0deg, var(--ldg-bg), transparent)',
              }}
            >
              <span className="ldg-accent" style={{ fontSize: '0.7rem' }}>
                ▼
              </span>
            </div>
          )}
        </div>

        {/* ================= footer: tools + register ====================== */}
        <div className="px-4 pb-4">
          <LedgerRule className="mb-3" />
          <div className="grid grid-cols-4 gap-1.5 mb-3">
            <button
              type="button"
              title="Command palette"
              aria-label="Open command palette"
              className="ldg-btn"
              onClick={() => setIsPaletteOpen(true)}
            >
              CMD
            </button>
            <button
              type="button"
              title="Settings"
              aria-label="Open settings"
              className="ldg-btn"
              onClick={() => navigate('/settings')}
            >
              SET
            </button>
            <button
              type="button"
              title="Random page"
              aria-label="Go to a random page"
              className="ldg-btn"
              onClick={() => {
                navigate('/random');
                unlockAchievement('feeling_lucky');
              }}
            >
              RND
            </button>
            <button
              type="button"
              title="Contact"
              aria-label="Open contact form"
              className="ldg-btn"
              onClick={toggleModal}
            >
              MSG
            </button>
          </div>
          <LedgerRegister className="w-full mb-3" />
          <div className="flex items-baseline justify-between">
            <span className="ldg-label" style={{ fontSize: '0.62rem' }}>
              © {new Date().getFullYear()} FEZCODE
            </span>
            <span className="ldg-eyebrow" style={{ fontSize: '0.62rem' }}>
              LEDGER
            </span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default LedgerSidebar;
