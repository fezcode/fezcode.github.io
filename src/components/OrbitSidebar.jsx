import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import piml from 'piml';
import {
  CircleIcon,
  GearIcon,
  ShuffleIcon,
  EnvelopeSimpleIcon,
  CommandIcon,
  XIcon,
  CaretDownIcon,
  ArrowUpRightIcon,
} from '@phosphor-icons/react';
import { useSiteConfig } from '../context/SiteConfigContext';
import { useAchievements } from '../context/AchievementContext';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { OrbitRegister } from './orbit';
import { version } from '../version';
import { appIcons } from '../utils/appIcons';
import {
  buildSidebarNavigation,
  sidebarLinkIsActive,
} from '../utils/sidebarNavigation';
import '../styles/Orbit.css';

const NavigationLink = ({ item, onNavigate }) => {
  const Icon = appIcons[item.icon] || CircleIcon;
  const content = (
    <>
      <Icon size={18} aria-hidden="true" />
      <span className="min-w-0 flex-1">{item.label}</span>
      {item.external && <ArrowUpRightIcon size={13} />}
    </>
  );
  return item.external ? (
    <a
      href={item.to}
      className="orb-nav-link"
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
      className="orb-nav-link"
    >
      {content}
    </NavLink>
  );
};

const OrbitSidebar = ({
  isOpen,
  toggleSidebar,
  toggleModal,
  setIsPaletteOpen,
}) => {
  const { config } = useSiteConfig();
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
          className="fixed inset-0 z-40 md:hidden bg-black/40 backdrop-blur-sm"
        />
      )}
      <aside
        className={`orb-chrome orb-sidebar ${isOpen ? '' : 'orb-sidebar-closed'}`}
        aria-label="Site navigation"
        inert={!isOpen ? true : undefined}
      >
        <div className="orb-sidebar-brand">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="orb-brand" onClick={closeOnMobile}>
              <span className="orb-brand-mark">f.</span>
              {(config?.hero?.title || 'Fezcodex').toLowerCase()}
            </Link>
            <button
              type="button"
              className="md:hidden orb-link"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <XIcon size={20} />
            </button>
          </div>
          <p className="orb-label mt-3">A personal observatory</p>
        </div>
        <div className="orb-sidebar-nav">
          {navLoading && (
            <p className="orb-label px-3 py-5" role="status">
              Opening navigation…
            </p>
          )}
          {navError && (
            <p className="orb-label px-3 py-5" role="status">
              Navigation couldn’t load.{' '}
              <button
                type="button"
                className="orb-link"
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
            return (
              <section key={key}>
                {section.collapsible ? (
                  <button
                    type="button"
                    className="orb-nav-head"
                    aria-expanded={open}
                    onClick={() =>
                      setExpanded((value) => ({ ...value, [key]: !open }))
                    }
                  >
                    {section.label}
                    <CaretDownIcon
                      size={13}
                      style={{ transform: open ? 'none' : 'rotate(-90deg)' }}
                    />
                  </button>
                ) : (
                  <p className="orb-nav-head">{section.label}</p>
                )}
                {open && (
                  <nav aria-label={section.label}>
                    {links.map((item) => (
                      <NavigationLink
                        key={item.to}
                        item={item}
                        onNavigate={closeOnMobile}
                      />
                    ))}
                  </nav>
                )}
              </section>
            );
          })}
        </div>
        <div className="orb-sidebar-footer">
          <div className="grid grid-cols-4 gap-2 mb-4">
            <button
              type="button"
              className="orb-btn"
              onClick={() => {
                setIsPaletteOpen(true);
                closeOnMobile();
              }}
              aria-label="Open command palette"
            >
              <CommandIcon size={17} />
            </button>
            <Link
              className="orb-btn"
              to="/settings"
              aria-label="Settings"
              onClick={closeOnMobile}
            >
              <GearIcon size={17} />
            </Link>
            <Link
              className="orb-btn"
              to="/random"
              aria-label="Random discovery"
              onClick={() => {
                closeOnMobile();
                unlockAchievement('feeling_lucky');
              }}
            >
              <ShuffleIcon size={17} />
            </Link>
            <button
              type="button"
              className="orb-btn"
              onClick={() => {
                toggleModal();
                closeOnMobile();
              }}
              aria-label="Contact Samil"
            >
              <EnvelopeSimpleIcon size={17} />
            </button>
          </div>
          <OrbitRegister className="w-full" />
          <p className="orb-label mt-4">Fezcodex · Orbit · v{version}</p>
        </div>
      </aside>
    </>
  );
};

export default OrbitSidebar;
