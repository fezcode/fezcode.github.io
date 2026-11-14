import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import piml from 'piml';
import {
  CaretDownIcon,
  CaretUpIcon,
  XIcon,
  CommandIcon,
  GearIcon,
  ShuffleIcon,
  EnvelopeSimpleIcon,
  ArrowSquareOutIcon,
} from '@phosphor-icons/react';
import { useAchievements } from '../context/AchievementContext';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { version } from '../version';
import {
  buildSidebarNavigation,
  sidebarLinkIsActive,
} from '../utils/sidebarNavigation';
import { BlissIcon } from './bliss';
import '../styles/Bliss.css';

const NavigationLink = ({ item, onNavigate }) => {
  const content = (
    <>
      <BlissIcon icon={item.icon} seed={item.label} size={20} />
      <span className="flex-1 min-w-0">{item.label}</span>
      {item.external && (
        <ArrowSquareOutIcon size={13} aria-label="(opens in a new tab)" />
      )}
    </>
  );
  return item.external ? (
    <a
      href={item.to}
      className="bl-pane-link"
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
      className="bl-pane-link"
    >
      {content}
    </NavLink>
  );
};

/** The Explorer task pane: one collapsible pane per sidebar section. */
const BlissSidebar = ({ isOpen, toggleSidebar, toggleModal, setIsPaletteOpen }) => {
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

  const tasks = [
    {
      label: 'Command palette',
      icon: CommandIcon,
      tone: 'graphite',
      onClick: () => {
        setIsPaletteOpen(true);
        closeOnMobile();
      },
    },
    {
      label: 'Random discovery',
      icon: ShuffleIcon,
      tone: 'orange',
      to: '/random',
      onClick: () => {
        closeOnMobile();
        unlockAchievement('feeling_lucky');
      },
    },
    {
      label: 'Settings',
      icon: GearIcon,
      tone: 'blue',
      to: '/settings',
      onClick: closeOnMobile,
    },
    {
      label: 'Contact Samil',
      icon: EnvelopeSimpleIcon,
      tone: 'yellow',
      onClick: () => {
        toggleModal();
        closeOnMobile();
      },
    },
  ];

  return (
    <>
      {isOpen && (
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label="Close navigation"
          className="fixed inset-0 z-40 md:hidden bg-black/40"
        />
      )}
      <aside
        className={`bl-chrome bl-sidebar ${isOpen ? '' : 'bl-sidebar-closed'}`}
        aria-label="Site navigation"
        inert={!isOpen ? true : undefined}
      >
        <div className="flex items-center gap-3 px-1 pt-1 pb-1">
          <Link
            to="/"
            onClick={closeOnMobile}
            className="flex items-center gap-3 min-w-0 flex-1 no-underline text-white"
          >
            <BlissIcon icon="HouseIcon" tone="green" size={40} />
            <span className="flex flex-col min-w-0">
              <span
                className="bl-title-font font-bold text-[20px] leading-tight"
                style={{ textShadow: '1px 1px 0 #1b3a9c' }}
              >
                Fezcodex
              </span>
              <span className="text-xs" style={{ color: '#eef3ff' }}>
                Version {version}
              </span>
            </span>
          </Link>
          <button
            type="button"
            className="md:hidden bl-tbtn bl-tbtn-close"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <XIcon size={13} weight="bold" />
          </button>
        </div>

        {navLoading && (
          <p className="bl-notice" role="status">
            Loading navigation…
          </p>
        )}
        {navError && (
          <p className="bl-notice bl-notice-error" role="status">
            Navigation couldn’t load.{' '}
            <button
              type="button"
              className="bl-link"
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
            <section key={key} className="bl-pane">
              {section.collapsible ? (
                <button
                  type="button"
                  className="bl-pane-head"
                  aria-expanded={open}
                  onClick={() =>
                    setExpanded((value) => ({ ...value, [key]: !open }))
                  }
                >
                  <span>{section.label}</span>
                  <span className="bl-pane-chevron" aria-hidden="true">
                    {open ? (
                      <CaretUpIcon size={11} weight="bold" />
                    ) : (
                      <CaretDownIcon size={11} weight="bold" />
                    )}
                  </span>
                </button>
              ) : (
                <div className="bl-pane-head">
                  <span>{section.label}</span>
                </div>
              )}
              {open && (
                <nav className="bl-pane-body" aria-label={section.label}>
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

        <section className="bl-pane">
          <div className="bl-pane-head">
            <span>Other places</span>
          </div>
          <div className="bl-pane-body">
            {tasks.map((task) => {
              const inner = (
                <>
                  <BlissIcon icon={task.icon} tone={task.tone} size={20} />
                  <span>{task.label}</span>
                </>
              );
              return task.to ? (
                <Link
                  key={task.label}
                  to={task.to}
                  className="bl-pane-link"
                  onClick={task.onClick}
                >
                  {inner}
                </Link>
              ) : (
                <button
                  key={task.label}
                  type="button"
                  className="bl-pane-link"
                  onClick={task.onClick}
                >
                  {inner}
                </button>
              );
            })}
          </div>
        </section>

        <section className="bl-pane">
          <div className="bl-pane-head">
            <span>Details</span>
          </div>
          <div className="bl-pane-body px-3 py-2 text-[13px] gap-1">
            <strong>Fezcodex</strong>
            <span>The personal codex of Samil</span>
            <span>Theme: Bliss</span>
          </div>
        </section>
      </aside>
    </>
  );
};

export default BlissSidebar;
