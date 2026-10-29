import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import piml from 'piml';
import { XIcon } from '@phosphor-icons/react';
import { useAchievements } from '../context/AchievementContext';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { version } from '../version';
import {
  buildSidebarNavigation,
  sidebarLinkIsActive,
} from '../utils/sidebarNavigation';
import {
  MarquetryText,
  MarquetryIcon,
  MarquetryBand,
  MarquetryInlay,
  WOOD,
} from './marquetry';
import '../styles/Marquetry.css';

const NavigationLink = ({ item, onNavigate, active }) => {
  const ink = active ? WOOD.peat : WOOD.cream;
  const content = (
    <>
      <MarquetryIcon name={item.icon} fg={active ? WOOD.rust : WOOD.wheat} />
      <span className="mqt-nav-label flex-1" style={{ color: ink }}>
        {item.label}
        {item.external ? ' ↗' : ''}
      </span>
    </>
  );
  return item.external ? (
    <a
      href={item.to}
      className="mqt-nav-link"
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
    >
      {content}
    </a>
  ) : (
    <NavLink
      to={item.to}
      end={item.to === '/'}
      onClick={onNavigate}
      className="mqt-nav-link"
    >
      {content}
    </NavLink>
  );
};

const FooterButton = ({ icon, label, ...props }) => {
  const Tag = props.to ? Link : 'button';
  return (
    <Tag
      type={props.to ? undefined : 'button'}
      className="mqt-btn mqt-btn-icon"
      aria-label={label}
      title={label}
      {...props}
    >
      <MarquetryIcon name={icon} fg={WOOD.cream} />
    </Tag>
  );
};

const MarquetrySidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
  const { unlockAchievement } = useAchievements();
  const location = useLocation();
  const [navigation, setNavigation] = useState([]);
  const [navError, setNavError] = useState(false);
  const [navLoading, setNavLoading] = useState(true);
  const [retry, setRetry] = useState(0);
  const [expanded, setExpanded] = usePersistentState(KEY_SIDEBAR_STATE, {});
  const closeOnMobile = () => {
    if (isOpen && window.innerWidth < 768) toggleSidebar();
  };
  useEffect(() => {
    const controller = new AbortController();
    setNavLoading(true);
    setNavError(false);
    fetch('/sidebar.piml', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Navigation unavailable');
        return response.text();
      })
      .then((text) => {
        const value = piml.parse(text).sidebar;
        if (!controller.signal.aborted)
          setNavigation(buildSidebarNavigation(value));
      })
      .catch(() => {
        if (!controller.signal.aborted) setNavError(true);
      })
      .finally(() => {
        if (!controller.signal.aborted) setNavLoading(false);
      });
    return () => controller.abort();
  }, [retry]);
  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape' && window.innerWidth < 768) toggleSidebar();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, toggleSidebar]);
  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 md:hidden bg-black/50"
        />
      )}
      <aside
        className={`mqt-chrome mqt-sidebar ${isOpen ? '' : 'mqt-sidebar-closed'}`}
        aria-label="Site navigation"
        inert={!isOpen ? true : undefined}
      >
        <div className="mqt-brand relative">
          <Link
            to="/"
            onClick={closeOnMobile}
            className="block"
            aria-label="Fezcodex home"
          >
            <MarquetryInlay
              seed="fezcodex"
              size={94}
              className="mqt-brand-mark"
            />
            <span className="mqt-wordmark">Fezcodex</span>
          </Link>
          <p className="mqt-brand-tagline">A personal codex</p>
          <span className="mqt-brand-version">v{version}</span>
          <button
            type="button"
            className="md:hidden mqt-btn mqt-btn-icon absolute right-2 top-2"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <XIcon size={18} />
          </button>
        </div>
        <MarquetryBand pattern="zigzag" />
        <div className="mqt-sidebar-nav">
          {navLoading && (
            <p className="mqt-label px-2 py-5" role="status">
              Opening the index…
            </p>
          )}
          {navError && (
            <p className="mqt-label px-2 py-5" role="status">
              Navigation couldn’t load.{' '}
              <button
                type="button"
                className="mqt-link"
                onClick={() => setRetry((value) => value + 1)}
              >
                Try again
              </button>
            </p>
          )}
          {navigation.map((section) => {
            const links = section.items;
            const key = section.id;
            const open =
              !section.collapsible ||
              (expanded[key] ??
                links.some(
                  (item) =>
                    !item.external &&
                    sidebarLinkIsActive(item.to, location.pathname),
                ));
            const head = (
              <>
                <MarquetryText
                  text={section.label}
                  size="small"
                  fg={WOOD.gold}
                  fit
                />
                {section.collapsible && (
                  <MarquetryIcon
                    name={open ? 'caretDown' : 'caretRight'}
                    fg={WOOD.gold}
                  />
                )}
              </>
            );
            return (
              <section key={key}>
                {section.collapsible ? (
                  <button
                    type="button"
                    className="mqt-nav-head"
                    aria-expanded={open}
                    aria-label={section.label}
                    onClick={() =>
                      setExpanded((value) => ({ ...value, [key]: !open }))
                    }
                  >
                    {head}
                  </button>
                ) : (
                  <div className="mqt-nav-head">{head}</div>
                )}
                {open && (
                  <nav aria-label={section.label}>
                    {links.map((item) => (
                      <NavigationLink
                        key={item.to}
                        item={item}
                        onNavigate={closeOnMobile}
                        active={
                          !item.external &&
                          sidebarLinkIsActive(item.to, location.pathname)
                        }
                      />
                    ))}
                  </nav>
                )}
              </section>
            );
          })}
        </div>
        <MarquetryBand
          pattern="checks"
          colors={{ a: WOOD.bark, b: WOOD.gold }}
        />
        <div className="mqt-sidebar-footer">
          <div className="grid grid-cols-4 gap-2 mb-3">
            <FooterButton
              icon="command"
              label="Open command palette"
              onClick={() => {
                setIsPaletteOpen(true);
                closeOnMobile();
              }}
            />
            <FooterButton
              icon="gear"
              label="Settings"
              to="/settings"
              onClick={closeOnMobile}
            />
            <FooterButton
              icon="shuffle"
              label="Random discovery"
              to="/random"
              onClick={() => {
                closeOnMobile();
                unlockAchievement('feeling_lucky');
              }}
            />
            <FooterButton
              icon="mail"
              label="Contact Samil"
              onClick={() => {
                toggleModal();
                closeOnMobile();
              }}
            />
          </div>
          <MarquetryText
            text="Fezcodex · Marquetry"
            size="small"
            fg={WOOD.oat}
            align="center"
          />
        </div>
      </aside>
    </>
  );
};

export default MarquetrySidebar;
