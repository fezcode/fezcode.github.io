import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useSnf } from '../../context/SnfContext';

const LINES = [
  'BLACK_RAGNAROK // ARCHIVE TERMINAL v3.7',
  'AUTH CLEARANCE … LEVEL 20 GRANTED',
  'MOUNTING /snf … OK',
  'DECRYPTING INDEX … ████████ 100%',
  'WARNING: CONTENTS CLASSIFIED. TRUST NO SCRIBE.',
  'ACCESS GRANTED',
];

/**
 * One-shot boot/decrypt overlay shown on first entry to the terminal.
 * Skippable; honours reduced-motion by collapsing to an instant grant.
 */
const SnfBootSequence = ({ onComplete }) => {
  const { prefersReducedMotion, language } = useSnf();
  const [visible, setVisible] = useState(0);
  const doneRef = useRef(false);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete?.();
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      const t = setTimeout(finish, 350);
      return () => clearTimeout(t);
    }
    const timers = [];
    LINES.forEach((_, i) => {
      timers.push(setTimeout(() => setVisible(i + 1), 260 * (i + 1)));
    });
    timers.push(setTimeout(finish, 260 * LINES.length + 700));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  return (
    <motion.div
      className="snf-boot"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-full max-w-xl px-6">
        <div className="snf-vt snf-phos-text snf-glow text-2xl md:text-3xl mb-6 tracking-wide">
          {language === 'tr' ? 'SİSTEM BAŞLATILIYOR' : 'INITIALISING SYSTEM'}
        </div>
        <div className="space-y-1.5 mb-6 min-h-[180px]">
          {LINES.slice(0, prefersReducedMotion ? LINES.length : visible).map(
            (line, i) => (
              <div
                key={i}
                className={`snf-mono text-xs md:text-sm ${
                  line.startsWith('WARNING')
                    ? 'text-[var(--snf-alert)]'
                    : line === 'ACCESS GRANTED'
                      ? 'snf-phos-text snf-glow'
                      : 'snf-dim'
                }`}
              >
                <span className="snf-phos-text mr-2">›</span>
                {line}
              </div>
            ),
          )}
        </div>
        <div className="snf-boot-bar mb-5">
          <span />
        </div>
        <button
          type="button"
          onClick={finish}
          className="snf-mono text-[10px] uppercase tracking-[0.4em] snf-dim hover:text-[var(--snf-phos)] transition-colors"
        >
          [ skip&nbsp;▸ ]
        </button>
      </div>
    </motion.div>
  );
};

export default SnfBootSequence;
