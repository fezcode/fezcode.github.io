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
import { KnitText, KnitIcon, KnitBand, YARN } from './knit';
import '../styles/Knit.css';

const NavigationLink = ({ item, onNavigate, active }) => {
  const ink = active ? YARN.peat : YARN.cream;
  const content = (
    <>
      <KnitIcon name={item.icon} fg={active ? YARN.rust : YARN.wheat} />
      <KnitText
        text={item.external ? `${item.label} ↗` : item.label}
        size="small"
        fg={ink}
        maxLines={2}
        className="flex-1"
      />
    </>
  );
  return item.external ? (
    <a
      href={item.to}
      className="knt-nav-link"
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
      className="knt-nav-link"
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
      className="knt-btn knt-btn-icon"
      aria-label={label}
      title={label}
      {...props}
    >
      <KnitIcon name={icon} fg={YARN.cream} />
    </Tag>
  );
};

const KnitSidebar = ({ isOpen, toggleSidebar, toggleModal, setIsPaletteOpen }) => {
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
        className={`knt-chrome knt-sidebar ${isOpen ? '' : 'knt-sidebar-closed'}`}
        aria-label="Site navigation"
        inert={!isOpen ? true : undefined}
      >
        <KnitBand pattern="peerie" />
        <div className="relative px-1 pt-4 pb-3">
          <Link to="/" onClick={closeOnMobile} className="block">
            <KnitText
              text="Fezcodex"
              align="center"
              fg={YARN.gold}
              as="span"
            />
          </Link>
          <KnitText
            text={`v${version}`}
            size="small"
            align="center"
            fg={YARN.oat}
            className="mt-3"
          />
          <button
            type="button"
            className="md:hidden knt-btn knt-btn-icon absolute right-2 top-2"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <XIcon size={18} />
          </button>
        </div>
        <KnitBand pattern="zigzag" colors={{ bg: YARN.peat, fg: YARN.rust }} />
        <div className="knt-sidebar-nav">
          {navLoading && (
            <p className="knt-label px-2 py-5" role="status">
              Casting on…
            </p>
          )}
          {navError && (
            <p className="knt-label px-2 py-5" role="status">
              Navigation couldn’t load.{' '}
              <button
                type="button"
                className="knt-link"
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
                <KnitText text={section.label} size="small" fg={YARN.gold} fit />
                {section.collapsible && (
                  <KnitIcon
                    name={open ? 'caretDown' : 'caretRight'}
                    fg={YARN.gold}
                  />
                )}
              </>
            );
            return (
              <section key={key}>
                {section.collapsible ? (
                  <button
                    type="button"
                    className="knt-nav-head"
                    aria-expanded={open}
                    aria-label={section.label}
                    onClick={() =>
                      setExpanded((value) => ({ ...value, [key]: !open }))
                    }
                  >
                    {head}
                  </button>
                ) : (
                  <div className="knt-nav-head">{head}</div>
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
        <KnitBand pattern="checks" colors={{ a: YARN.bark, b: YARN.gold }} />
        <div className="knt-sidebar-footer">
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
          <KnitText
            text="Fezcodex · Knit"
            size="small"
            fg={YARN.oat}
            align="center"
          />
        </div>
      </aside>
    </>
  );
};

export default KnitSidebar;
