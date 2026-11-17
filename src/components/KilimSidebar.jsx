import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import piml from 'piml';
import { useAchievements } from '../context/AchievementContext';
import usePersistentState from '../hooks/usePersistentState';
import { KEY_SIDEBAR_STATE } from '../utils/LocalStorageManager';
import { version } from '../version';
import {
  buildSidebarNavigation,
  sidebarLinkIsActive,
} from '../utils/sidebarNavigation';
import {
  KilimText,
  KilimIcon,
  KilimStripe,
  KilimSideBand,
  WOOL,
} from './kilim';
import '../styles/Kilim.css';
import '../styles/kilim-chrome.css';

const NavigationLink = ({ item, onNavigate, active }) => {
  const className = `klm-sidebar-link ${active ? 'is-active' : ''}`;
  const content = (
    <>
      <KilimIcon name={item.icon} fg={active ? WOOL.madder : WOOL.saffron} />
      <span className="klm-sidebar-link-label">
        {item.label}
        {item.external && <span aria-hidden="true"> ↗</span>}
      </span>
    </>
  );
  return item.external ? (
    <a
      href={item.to}
      className={className}
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
      className={className}
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
      className="klm-btn klm-btn-icon"
      aria-label={label}
      title={label}
      {...props}
    >
      <KilimIcon name={icon} fg={WOOL.walnut} />
    </Tag>
  );
};

const KilimSidebar = ({ isOpen, toggleSidebar, toggleModal, setIsPaletteOpen }) => {
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
          className="klm-sidebar-scrim"
        />
      )}
      <aside
        className={`klm-chrome klm-sidebar klm-wool-indigo ${isOpen ? '' : 'klm-sidebar-closed'}`}
        aria-label="Site navigation"
        inert={!isOpen ? true : undefined}
      >
        <KilimSideBand />
        <div className="klm-sidebar-inner">
          <div className="klm-sidebar-head">
            <Link
              to="/"
              onClick={closeOnMobile}
              className="klm-sidebar-logo"
              aria-label="Fezcodex home"
            >
              <KilimText text="FEZCODEX" scale={1} fg={WOOL.saffron} fit />
            </Link>
            <p className="klm-sidebar-version">v{version}</p>
            <button
              type="button"
              className="klm-btn klm-btn-icon klm-sidebar-close"
              onClick={toggleSidebar}
              aria-label="Close sidebar"
            >
              <KilimIcon name="close" fg={WOOL.walnut} />
            </button>
          </div>
          <KilimStripe />
          <div className="klm-sidebar-nav">
            {navLoading && (
              <p className="klm-sidebar-status" role="status">
                Warping the loom…
              </p>
            )}
            {navError && (
              <p className="klm-sidebar-status" role="status">
                Navigation couldn’t load.{' '}
                <button
                  type="button"
                  className="klm-sidebar-retry"
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
                  <span>{section.label}</span>
                  {section.collapsible && (
                    <KilimIcon
                      name={open ? 'caretDown' : 'caretRight'}
                      fg={WOOL.saffron}
                    />
                  )}
                </>
              );
              return (
                <section key={key} className="klm-sidebar-group">
                  {section.collapsible ? (
                    <button
                      type="button"
                      className="klm-sidebar-group-head"
                      aria-expanded={open}
                      aria-label={section.label}
                      onClick={() =>
                        setExpanded((value) => ({ ...value, [key]: !open }))
                      }
                    >
                      {head}
                    </button>
                  ) : (
                    <div className="klm-sidebar-group-head">{head}</div>
                  )}
                  {open && (
                    <nav aria-label={section.label} className="klm-sidebar-links">
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
          <KilimStripe a={WOOL.saffron} b={WOOL.madder} mid={WOOL.ivory} />
          <div className="klm-sidebar-footer">
            <div className="klm-sidebar-tools">
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
            <p className="klm-sidebar-colophon">Fezcodex · Kilim</p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default KilimSidebar;
