import React from 'react';
import { motion } from 'framer-motion';
import { useSnfV3 } from '../../context/SnfV3Context';

const THEMES = [
  { value: 'day', swatch: '#f4ecd8', label: 'Day' },
  { value: 'sepia', swatch: '#e8d7b4', label: 'Sepia' },
  { value: 'night', swatch: '#16130e', label: 'Night' },
];

const Seg = ({ on, onClick, children }) => (
  <button type="button" className="snf3-seg" data-on={on ? '1' : '0'} onClick={onClick}>
    {children}
  </button>
);

/** Reading preferences sheet (theme · size · typeface). */
const SnfV3Prefs = ({ onClose }) => {
  const { settings, setPref, language } = useSnfV3();
  const tr = language === 'tr';
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden />
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="snf3-sheet absolute right-3 md:right-5 top-full mt-2 z-50 w-72 p-4"
        role="dialog"
        aria-label="Reading preferences"
      >
        <div
          className="text-[0.7rem] tracking-[0.18em] uppercase mb-3"
          style={{ color: 'var(--snf3-sheet-muted)' }}
        >
          {tr ? 'Görünüm' : 'Appearance'}
        </div>
        <div className="flex items-center justify-between gap-3 mb-4">
          {THEMES.map((th) => (
            <button
              key={th.value}
              type="button"
              className="snf3-swatch"
              data-on={settings.theme === th.value ? '1' : '0'}
              style={{ background: th.swatch }}
              onClick={() => setPref('theme', th.value)}
              aria-label={th.label}
              title={th.label}
            />
          ))}
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[0.72rem]" style={{ color: 'var(--snf3-sheet-muted)' }}>
            {tr ? 'Boyut' : 'Size'}
          </span>
          <div className="flex">
            {[['sm', 'A'], ['md', 'A'], ['lg', 'A']].map(([v, l], i) => (
              <Seg key={v} on={settings.size === v} onClick={() => setPref('size', v)}>
                <span style={{ fontSize: `${0.7 + i * 0.18}rem` }}>{l}</span>
              </Seg>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[0.72rem]" style={{ color: 'var(--snf3-sheet-muted)' }}>
            {tr ? 'Yazı tipi' : 'Typeface'}
          </span>
          <div className="flex">
            <Seg on={settings.typeface === 'serif'} onClick={() => setPref('typeface', 'serif')}>
              <span style={{ fontFamily: 'var(--snf3-serif)' }}>Serif</span>
            </Seg>
            <Seg on={settings.typeface === 'sans'} onClick={() => setPref('typeface', 'sans')}>
              <span style={{ fontFamily: 'var(--snf3-ui)' }}>Sans</span>
            </Seg>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default SnfV3Prefs;
