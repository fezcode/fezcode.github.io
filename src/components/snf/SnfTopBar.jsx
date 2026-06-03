import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HouseIcon,
  GearSixIcon,
  ListIcon,
  XIcon,
  CaretRightIcon,
} from '@phosphor-icons/react';
import { useSnf } from '../../context/SnfContext';
import { SnfSelect } from './SnfPrimitives';

const NAV = [
  { to: '/snf/archive', label: 'ARCHIVE', tr: 'ARŞİV' },
  { to: '/snf/personnel', label: 'PERSONNEL', tr: 'PERSONEL' },
  { to: '/snf/sites', label: 'SITES', tr: 'BÖLGELER' },
  { to: '/snf/evidence', label: 'EVIDENCE', tr: 'KANIT' },
  { to: '/snf/agents', label: 'OPERATORS', tr: 'AJANLAR' },
  { to: '/snf/board', label: 'BOARD', tr: 'PANO' },
];

const CRT_OPTIONS = [
  { value: 'amber', label: 'AMBER' },
  { value: 'green', label: 'GREEN' },
  { value: 'blue', label: 'BLUE' },
  { value: 'white', label: 'WHITE' },
];

const SnfTopBar = () => {
  const { settings, setSetting, language, setLanguage, breadcrumbs } = useSnf();
  const location = useLocation();
  const [drawer, setDrawer] = useState(false);

  const isActive = (to) => location.pathname.startsWith(to);
  const label = (item) => (language === 'tr' ? item.tr : item.label);

  return (
    <header className="snf-bar relative z-[80]">
      {/* Utility strip */}
      <div className="flex items-center justify-between px-3 md:px-5 py-1.5 border-b border-[var(--snf-line)]">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/"
            className="snf-dim hover:text-[var(--snf-phos)] transition-colors flex-none"
            title="Exit to fezcode.com"
          >
            <HouseIcon size={16} weight="fill" />
          </Link>
          <span className="snf-divider w-6 hidden sm:block" />
          <nav
            aria-label="breadcrumb"
            className="hidden sm:flex items-center gap-1.5 snf-mono text-[10px] uppercase tracking-[0.18em] min-w-0 overflow-hidden"
          >
            <Link to="/snf" className="snf-dim hover:text-[var(--snf-phos)]">
              ROOT
            </Link>
            {breadcrumbs?.map((c, i) => (
              <React.Fragment key={c.path || i}>
                <CaretRightIcon size={9} className="snf-dim flex-none" />
                {c.path ? (
                  <Link
                    to={c.path}
                    className="snf-dim hover:text-[var(--snf-phos)] truncate"
                  >
                    {c.label}
                  </Link>
                ) : (
                  <span className="snf-phos-text truncate">{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3 flex-none">
          <div className="hidden md:flex items-center gap-1.5">
            <span className="snf-mono text-[9px] tracking-[0.2em] snf-dim">
              MODE
            </span>
            <SnfSelect
              value={settings.crt}
              onChange={(v) => setSetting('crt', v)}
              options={CRT_OPTIONS}
              aria-label="CRT colour mode"
              className="!py-1 !px-2 !text-[10px]"
            />
          </div>
          <div className="flex items-center gap-1 snf-mono text-[10px] font-bold tracking-widest">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={
                language === 'en'
                  ? 'snf-phos-text'
                  : 'snf-dim hover:text-[var(--snf-phos)]'
              }
            >
              EN
            </button>
            <span className="snf-dim">/</span>
            <button
              type="button"
              onClick={() => setLanguage('tr')}
              className={
                language === 'tr'
                  ? 'snf-phos-text'
                  : 'snf-dim hover:text-[var(--snf-phos)]'
              }
            >
              TR
            </button>
          </div>
          <span className="snf-led snf-led-blink hidden sm:block" title="PWR" />
        </div>
      </div>

      {/* Brand + nav strip */}
      <div className="flex items-center justify-between px-3 md:px-5 py-2.5">
        <Link to="/snf" className="flex items-baseline gap-2.5 group min-w-0">
          <span className="snf-display snf-glow text-lg md:text-xl font-bold uppercase tracking-tight text-[var(--snf-phos)] group-hover:opacity-80 transition-opacity">
            S&amp;F
          </span>
          <span className="snf-vt snf-dim text-base hidden sm:inline truncate">
            {language === 'tr' ? 'ARŞİV TERMİNALİ' : 'ARCHIVE TERMINAL'}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`snf-mono text-[11px] uppercase tracking-[0.16em] px-3 py-1.5 border transition-all ${
                isActive(item.to)
                  ? 'border-[rgba(var(--snf-phos-rgb),0.6)] text-[var(--snf-phos)] bg-[rgba(var(--snf-phos-rgb),0.08)]'
                  : 'border-transparent snf-dim hover:text-[var(--snf-phos)] hover:border-[var(--snf-line)]'
              }`}
            >
              {label(item)}
            </Link>
          ))}
          <Link
            to="/snf/settings"
            className={`ml-1 p-1.5 border transition-all ${
              isActive('/snf/settings')
                ? 'border-[rgba(var(--snf-phos-rgb),0.6)] text-[var(--snf-phos)]'
                : 'border-transparent snf-dim hover:text-[var(--snf-phos)]'
            }`}
            title="System config"
            aria-label="System config"
          >
            <GearSixIcon size={16} weight="bold" />
          </Link>
        </nav>

        {/* Mobile trigger */}
        <button
          type="button"
          onClick={() => setDrawer(true)}
          className="md:hidden snf-btn !px-3 !py-1.5 flex items-center gap-2"
          aria-label="open menu"
        >
          <ListIcon size={16} weight="bold" />
          <span className="text-[10px]">MENU</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <div className="fixed inset-0 z-[200] md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setDrawer(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="absolute top-0 right-0 h-full w-[82%] max-w-xs snf-panel border-l-2 border-[rgba(var(--snf-phos-rgb),0.4)] flex flex-col"
            >
              <div className="snf-bar flex items-center justify-between px-4 py-3">
                <span className="snf-vt snf-phos-text text-lg">DIRECTORY</span>
                <button
                  type="button"
                  onClick={() => setDrawer(false)}
                  aria-label="close menu"
                  className="snf-dim hover:text-[var(--snf-phos)]"
                >
                  <XIcon size={22} weight="bold" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
                {NAV.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setDrawer(false)}
                    className={`snf-row flex items-center justify-between px-4 py-3 snf-mono text-xs uppercase tracking-[0.16em] ${
                      isActive(item.to) ? 'text-[var(--snf-phos)]' : 'text-[var(--snf-ink)]'
                    }`}
                  >
                    {label(item)}
                    <CaretRightIcon size={14} className="snf-row-arrow" />
                  </Link>
                ))}
                <Link
                  to="/snf/settings"
                  onClick={() => setDrawer(false)}
                  className="snf-row flex items-center justify-between px-4 py-3 snf-mono text-xs uppercase tracking-[0.16em]"
                >
                  <span className="flex items-center gap-2">
                    <GearSixIcon size={15} weight="bold" /> SYSTEM CONFIG
                  </span>
                  <CaretRightIcon size={14} className="snf-row-arrow" />
                </Link>
              </nav>
              <div className="p-4 border-t border-[var(--snf-line)] flex items-center justify-between">
                <span className="snf-mono text-[9px] tracking-[0.2em] snf-dim">
                  MODE
                </span>
                <SnfSelect
                  value={settings.crt}
                  onChange={(v) => setSetting('crt', v)}
                  options={CRT_OPTIONS}
                  aria-label="CRT colour mode"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default SnfTopBar;
