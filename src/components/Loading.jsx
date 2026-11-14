import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { TerracottaMark } from './terracotta';
import { MistOrb } from './mist';
import { KnitBand, KnitText, YARN } from './knit';
import { BlissWindow, BlissProgress } from './bliss';

/** Three dots that pulse in turn, coloured by the caller. */
const Dots = ({ color }) => (
  <span className="inline-flex gap-1.5 ml-2 align-middle" aria-hidden="true">
    {[0, 1, 2].map((i) => (
      <motion.span
        key={i}
        className="inline-block w-1.5 h-1.5 rounded-full"
        style={{ backgroundColor: color }}
        animate={{ opacity: [0.2, 1, 0.2] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
      />
    ))}
  </span>
);

/** A hairline with a soft highlight sliding across it. */
const Sweep = ({ color, track, width = 'w-48' }) => (
  <div
    className={`${width} h-px relative overflow-hidden`}
    style={{ backgroundColor: track }}
  >
    <motion.div
      initial={{ left: '-50%' }}
      animate={{ left: '100%' }}
      transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute top-0 bottom-0 w-1/2"
      style={{
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
      }}
    />
  </div>
);

const Frame = ({ className = '', style, children }) => (
  <div
    role="status"
    aria-live="polite"
    className={`relative flex flex-col items-center justify-center min-h-[70vh] w-full overflow-hidden ${className}`}
    style={style}
  >
    {children}
  </div>
);

const BrutalistLoading = () => (
  <Frame className="h-screen bg-[#050505] text-white font-mono">
    <div
      className="absolute inset-0 pointer-events-none z-10 opacity-[0.03]"
      style={{
        background:
          'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
        backgroundSize: '100% 4px, 3px 100%',
      }}
    />
    <motion.div
      initial={{ top: '-10%' }}
      animate={{ top: '110%' }}
      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      className="absolute left-0 right-0 h-1 z-20 bg-white/5 pointer-events-none"
    />
    <div className="relative z-30 flex flex-col items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-xs uppercase tracking-[0.3em] font-bold text-gray-400"
        >
          Initializing
        </motion.div>
        <div className="flex items-center gap-1">
          {['L', 'O', 'A', 'D', 'I', 'N', 'G'].map((char, i) => (
            <motion.span
              key={i}
              animate={{ opacity: [0.2, 1, 0.2] }}
              transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
              className="text-2xl font-black tracking-tighter"
            >
              {char}
            </motion.span>
          ))}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-2 h-6 bg-emerald-400 ml-1"
          />
        </div>
      </div>
      <div className="w-48 h-[2px] bg-gray-900 relative overflow-hidden">
        <motion.div
          initial={{ left: '-100%' }}
          animate={{ left: '100%' }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
        />
      </div>
    </div>
  </Frame>
);

const LuxeLoading = () => (
  <Frame className="bg-[#F5F5F0] text-[#1A1A1A]">
    <p className="font-outfit text-[10px] uppercase tracking-[0.4em] text-[#1A1A1A]/50 mb-5">
      Fezcodex
    </p>
    <motion.p
      className="font-playfairDisplay italic text-4xl md:text-5xl mb-8"
      animate={{ opacity: [0.45, 1, 0.45] }}
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      One moment
    </motion.p>
    <Sweep color="#8D4004" track="rgba(26,26,26,0.12)" width="w-40" />
  </Frame>
);

const TerracottaLoading = () => (
  <Frame className="bg-[#F3ECE0] text-[#1A1613]">
    <TerracottaMark size={56} color="#1A1613" sway className="mb-8" />
    <p className="font-fraunces text-3xl md:text-4xl italic mb-3">
      Setting the type
      <Dots color="#C96442" />
    </p>
    <p className="font-ibm-plex-mono text-[11px] uppercase tracking-[0.25em] text-[#1A1613]/55">
      Bone paper · terra ink
    </p>
  </Frame>
);

const MistLoading = () => (
  <Frame className="bg-[#EEF2F1] text-[#3C4845]">
    <MistOrb size={110} className="mb-8" />
    <p className="font-instr-serif italic text-4xl md:text-5xl mb-4">
      The fog is lifting
    </p>
    <Sweep color="#5F837B" track="rgba(60,72,69,0.12)" />
    <p className="font-ibm-plex-mono text-[10px] uppercase tracking-[0.3em] text-[#3C4845]/55 mt-4">
      Loading
    </p>
  </Frame>
);

const LedgerLoading = () => (
  <Frame className="ldg-root">
    <div className="w-full max-w-sm px-6">
      <p className="ldg-eyebrow mb-1">FOLIO IN TRANSIT</p>
      <p className="ldg-title">RETRIEVING ENTRY</p>
      <hr className="ldg-rule mt-3 mb-3" />
      <div className="flex items-center justify-between ldg-label">
        <span>FETCHING FROM THE ARCHIVE</span>
        <Dots color="var(--ldg-accent, #0037d0)" />
      </div>
      <div className="mt-4">
        <Sweep
          color="var(--ldg-accent, #0037d0)"
          track="var(--ldg-rule, rgba(33,34,42,0.25))"
          width="w-full"
        />
      </div>
    </div>
  </Frame>
);

const OrbitLoading = () => (
  <Frame className="orb-root">
    <div
      className="relative w-24 h-24 mb-8"
      aria-hidden="true"
      style={{ color: 'var(--orb-accent, #3157ce)' }}
    >
      <span
        className="absolute inset-0 rounded-full border"
        style={{ borderColor: 'var(--orb-rule, #dcded8)' }}
      />
      <span
        className="absolute left-1/2 top-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full"
        style={{ backgroundColor: 'var(--orb-fg, #222d35)' }}
      />
      <motion.span
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      >
        <span
          className="absolute left-1/2 -top-1 w-2 h-2 -ml-1 rounded-full"
          style={{ backgroundColor: 'currentColor' }}
        />
      </motion.span>
    </div>
    <p className="orb-eyebrow mb-2">FEZCODEX / ORBIT</p>
    <p className="orb-title !text-3xl">Acquiring signal</p>
  </Frame>
);

const KnitLoading = () => (
  <Frame>
    <div className="w-full max-w-2xl px-6 flex flex-col items-center gap-6">
      <KnitBand pattern="peerie" />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <KnitText text="CASTING ON" scale={1} fg={YARN.cream} />
      </motion.div>
      <p className="knt-patch text-center">Knitting the next row…</p>
      <KnitBand pattern="peerie" />
    </div>
  </Frame>
);

const BlissLoading = () => {
  const [value, setValue] = useState(10);
  useEffect(() => {
    const id = setInterval(
      () => setValue((v) => (v >= 100 ? 10 : v + 10)),
      300,
    );
    return () => clearInterval(id);
  }, []);
  return (
    <Frame className="px-4">
      <div className="w-full max-w-sm">
        <BlissWindow title="Please wait" headingLevel={null}>
          <p className="bl-meta mb-3">Opening Fezcodex…</p>
          <BlissProgress value={value} label="Loading" />
        </BlissWindow>
      </div>
    </Frame>
  );
};

const VIEWS = {
  luxe: LuxeLoading,
  terracotta: TerracottaLoading,
  mist: MistLoading,
  ledger: LedgerLoading,
  orbit: OrbitLoading,
  knit: KnitLoading,
  bliss: BlissLoading,
};

const Loading = () => {
  const { fezcodexTheme } = useVisualSettings() || {};
  const View = VIEWS[fezcodexTheme] || BrutalistLoading;
  return <View />;
};

export default Loading;
