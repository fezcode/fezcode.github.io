import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BugIcon,
  SparkleIcon,
  LayoutIcon,
  ArrowLeftIcon,
  LineSegmentsIcon,
  PaintBrushBroadIcon,
  ScrollIcon,
  TerminalWindowIcon,
  PlantIcon,
  MaskHappyIcon,
} from '@phosphor-icons/react';
import Seo from '../components/Seo';
import GenerativeArt from '../components/GenerativeArt';
import LuxeArt from '../components/LuxeArt';

const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const { setFezcodexTheme } = useVisualSettings();

  const activateTerracotta = () => {
    setFezcodexTheme('terracotta');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black flex flex-col">
      <Seo
        title="Design System | Fezcodex"
        description="Choose your design exploration: Brutalist Brufez or Refined Fezluxe."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex-1 flex flex-col">
        <header className="mb-24 pt-12 border-b border-black/10 pb-12 text-center md:text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors"
          >
            <ArrowLeftIcon /> Back to Root
          </Link>
          <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            Aesthetics
          </h1>
          <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
            Explore the visual foundations of Fezcodex. Choose between raw
            systemic brutalism or refined architectural elegance.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 flex-1">
          {/* BRUFEZ CARD */}
          <Link to="/design/brufez" className="group block relative">
            <motion.div
              whileHover={{ y: -10 }}
              className="h-full bg-[#050505] border border-white/5 p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                <GenerativeArt
                  seed="brufez"
                  className="w-full h-full grayscale"
                />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 text-[#10B981] rounded-sm group-hover:bg-[#10B981] group-hover:text-black transition-colors">
                  <BugIcon size={32} weight="fill" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    Brufez
                  </h2>
                  <p className="font-mono text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                    Systemic transparency. Celebrated structural logic, 1PX
                    borders, and high-frequency contrast.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 group-hover:text-white transition-colors">
                  Launch_Spec
                </span>
                <ArrowRightIcon
                  className="text-gray-600 group-hover:text-[#10B981] group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </div>
            </motion.div>
          </Link>

          {/* TERRACOTTA CARD */}
          <button
            type="button"
            onClick={activateTerracotta}
            className="group block relative text-left"
          >
            <motion.div
              whileHover={{ y: -10 }}
              className="h-full bg-[#F3ECE0] border border-[#1A161320] p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-[0_30px_60px_-30px_#1A161330] transition-all duration-500 relative"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(600px 400px at 80% -10%, #E8DECE 0%, transparent 55%), radial-gradient(500px 500px at 0% 110%, #EDE3D3 0%, transparent 50%)',
                }}
              />

              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-[#C96442]/10 text-[#9E4A2F] border border-[#C96442]/30 rounded-sm group-hover:bg-[#C96442] group-hover:text-[#F3ECE0] group-hover:border-[#C96442] transition-all duration-500">
                  <LineSegmentsIcon size={32} weight="light" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-playfairDisplay italic text-[#1A1613] leading-none tracking-tight">
                    Terracotta
                  </h2>
                  <p className="font-mono text-xs text-[#2E2620]/70 uppercase tracking-widest leading-relaxed">
                    Weighted editorial. Bone paper, hairline rules, serif wordmarks that hang true.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#1A161320] flex justify-between items-center relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2E2620]/50 group-hover:text-[#9E4A2F] transition-colors">
                  Hang_Plumb
                </span>
                <ArrowRightIcon
                  className="text-[#2E2620]/40 group-hover:text-[#C96442] group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </div>
            </motion.div>
          </button>

          {/* FEZLUXE CARD */}
          <Link to="/design/fezluxe" className="group block relative">
            <motion.div
              whileHover={{ y: -10 }}
              className="h-full bg-white border border-black/5 p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                <LuxeArt
                  seed="fezluxe"
                  className="w-full h-full mix-blend-multiply"
                />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-[#F5F5F0] text-[#8D4004] rounded-full shadow-sm group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-500">
                  <SparkleIcon size={32} weight="light" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-playfairDisplay italic text-[#1A1A1A] leading-none">
                    Fezluxe
                  </h2>
                  <p className="font-outfit text-sm text-black/40 italic leading-relaxed">
                    Architectural elegance. Generous white space, soft depth,
                    and sophisticated typographic hierarchy.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center relative z-10">
                <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30 group-hover:text-[#8D4004] transition-colors">
                  Explore Archive
                </span>
                <ArrowRightIcon
                  className="text-black/20 group-hover:text-[#8D4004] group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </div>
            </motion.div>
          </Link>
        </div>

        {/* ── INNER DESIGN LANGUAGES ───────────────────────────────── */}
        <div className="mt-32">
          <div className="flex items-end justify-between mb-12 pb-6 border-b border-black/10">
            <div>
              <div className="font-outfit text-[10px] uppercase tracking-[0.3em] text-[#1A1A1A]/40 mb-2">
                Part II
              </div>
              <h2 className="font-playfairDisplay text-4xl md:text-5xl text-[#1A1A1A] leading-none">
                Inner Design Languages
              </h2>
            </div>
            <p className="font-outfit text-xs text-[#1A1A1A]/50 max-w-sm leading-relaxed hidden md:block">
              Sub-systems used inside specific surfaces — apps, readers, and
              project catalogues — each with its own vocabulary.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">

            {/* ── ATELIER ── */}
            <Link to="/apps/github-thumbnail-generator" className="group block relative">
              <motion.div
                whileHover={{ y: -10 }}
                className="h-full p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 relative"
                style={{
                  background: '#F5EFEC',
                  borderRadius: 8,
                  boxShadow:
                    '0 0 0 1px #B89968 inset, 0 1px 0 rgba(255,255,255,0.5) inset, 0 30px 60px -30px rgba(45,31,46,0.25)',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-60"
                  style={{
                    background:
                      'radial-gradient(500px 300px at 85% -10%, #E4D9D6 0%, transparent 55%), radial-gradient(400px 400px at -10% 110%, #EDE4E1 0%, transparent 55%)',
                  }}
                />
                <div className="space-y-8 relative z-10">
                  <div
                    className="w-16 h-16 flex items-center justify-center transition-all duration-500"
                    style={{
                      background: '#3F7D6B14',
                      color: '#3F7D6B',
                      borderRadius: 8,
                      boxShadow: '0 0 0 1px #B89968 inset',
                    }}
                  >
                    <PaintBrushBroadIcon size={32} weight="regular" />
                  </div>
                  <div className="space-y-4">
                    <div
                      className="text-[10px] uppercase tracking-[0.28em]"
                      style={{ color: '#6B5A65' }}
                    >
                      App Chrome
                    </div>
                    <h3
                      className="text-5xl leading-none tracking-tight"
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        color: '#2D1F2E',
                      }}
                    >
                      Atelier
                      <span style={{ color: '#3F7D6B' }}>.</span>
                    </h3>
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        color: '#6B5A65',
                      }}
                    >
                      Gallery-studio contemporary. Dusty mauve walls, cream
                      matted cards, jade as the single jewel accent. Garamond
                      italic plates.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-12 pt-8 flex justify-between items-center relative z-10 border-t"
                  style={{ borderColor: '#C7B8B4' }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em] transition-colors"
                    style={{ color: '#6B5A65' }}
                  >
                    Enter_Studio
                  </span>
                  <ArrowRightIcon
                    className="group-hover:translate-x-2 transition-all"
                    size={24}
                    style={{ color: '#3F7D6B' }}
                  />
                </div>
              </motion.div>
            </Link>

            {/* ── GALLEY (terracotta inner reader) ── */}
            <Link to="/blog" className="group block relative">
              <motion.div
                whileHover={{ y: -10 }}
                className="h-full p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 relative"
                style={{
                  background: '#F3ECE0',
                  borderRadius: 4,
                  boxShadow:
                    '0 0 0 1px #1A161320 inset, 0 30px 60px -30px #1A161330',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'repeating-linear-gradient(0deg, #1A161308 0 1px, transparent 1px 4px)',
                    opacity: 0.4,
                  }}
                />
                <div className="space-y-8 relative z-10">
                  <div
                    className="w-16 h-16 flex items-center justify-center transition-all duration-500"
                    style={{
                      background: '#C9644215',
                      color: '#9E4A2F',
                      borderRadius: 2,
                      border: '1px solid #C9644240',
                    }}
                  >
                    <ScrollIcon size={32} weight="light" />
                  </div>
                  <div className="space-y-4">
                    <div
                      className="text-[10px] uppercase tracking-[0.28em]"
                      style={{
                        color: '#2E2620',
                        fontFamily: "'IBM Plex Mono', monospace",
                      }}
                    >
                      Terracotta · Reader
                    </div>
                    <h3
                      className="text-5xl italic leading-none tracking-tight"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        color: '#1A1613',
                      }}
                    >
                      Galley
                    </h3>
                    <p
                      className="text-xs uppercase tracking-widest leading-relaxed"
                      style={{
                        color: '#2E2620',
                        fontFamily: "'IBM Plex Mono', monospace",
                        opacity: 0.7,
                      }}
                    >
                      A letterpress galley-proof for long reading. Registration
                      marks, drop-caps, and 38em measure — enable from settings.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-12 pt-8 flex justify-between items-center relative z-10 border-t"
                  style={{ borderColor: '#1A161320' }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{
                      color: '#2E2620',
                      fontFamily: "'IBM Plex Mono', monospace",
                      opacity: 0.6,
                    }}
                  >
                    Open_Proof
                  </span>
                  <ArrowRightIcon
                    className="group-hover:translate-x-2 transition-all"
                    size={24}
                    style={{ color: '#C96442' }}
                  />
                </div>
              </motion.div>
            </Link>

            {/* ── ATLAS (terracotta inner catalog) ── */}
            <Link to="/projects/atlas-projects" className="group block relative">
              <motion.div
                whileHover={{ y: -10 }}
                className="h-full p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 relative"
                style={{
                  background: '#0A0906',
                  borderRadius: 4,
                  boxShadow:
                    'inset 0 0 0 1px #FFB00020, 0 30px 60px -30px rgba(0,0,0,0.5)',
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none opacity-30"
                  style={{
                    backgroundImage:
                      'linear-gradient(#FFB00012 1px, transparent 1px), linear-gradient(90deg, #FFB00012 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                <div className="space-y-8 relative z-10">
                  <div
                    className="w-16 h-16 flex items-center justify-center transition-all duration-500"
                    style={{
                      background: '#FFB00010',
                      color: '#FFB000',
                      borderRadius: 2,
                      border: '1px solid #FFB00040',
                    }}
                  >
                    <TerminalWindowIcon size={32} weight="regular" />
                  </div>
                  <div className="space-y-4">
                    <div
                      className="text-[10px] uppercase tracking-[0.28em]"
                      style={{
                        color: '#9AAF4F',
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      Terracotta · Catalog
                    </div>
                    <h3
                      className="text-5xl leading-none tracking-tight uppercase font-bold"
                      style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        color: '#FFB000',
                      }}
                    >
                      Atlas
                    </h3>
                    <p
                      className="text-xs uppercase tracking-widest leading-relaxed"
                      style={{
                        color: '#E8DBB7',
                        fontFamily: "'JetBrains Mono', monospace",
                        opacity: 0.8,
                      }}
                    >
                      Phosphor-amber CRT tool-catalog. 38 entries, 9 categories,
                      boot sequence, clipboard installers — pure terminal
                      instrument.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-12 pt-8 flex justify-between items-center relative z-10 border-t"
                  style={{ borderColor: '#FFB00020' }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{
                      color: '#9AAF4F',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    $ ./boot.sh
                  </span>
                  <ArrowRightIcon
                    className="group-hover:translate-x-2 transition-all"
                    size={24}
                    style={{ color: '#FFB000' }}
                  />
                </div>
              </motion.div>
            </Link>

            {/* ── HERBARIUM ── */}
            <Link to="/apps/fractal-flora" className="group block relative">
              <motion.div
                whileHover={{ y: -10 }}
                className="h-full p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 relative"
                style={{
                  background: '#F0E9D9',
                  borderRadius: 2,
                  boxShadow:
                    '0 0 0 1px rgba(30,58,43,0.2) inset, 0 30px 60px -30px rgba(30,58,43,0.3)',
                }}
              >
                {/* rust corner pins */}
                {['tl','tr','bl','br'].map((c) => {
                  const pos = {
                    tl: { top: 10, left: 10 },
                    tr: { top: 10, right: 10 },
                    bl: { bottom: 10, left: 10 },
                    br: { bottom: 10, right: 10 },
                  }[c];
                  return (
                    <span
                      key={c}
                      aria-hidden
                      className="absolute w-2.5 h-2.5 rounded-full z-20"
                      style={{
                        ...pos,
                        background:
                          'radial-gradient(circle at 35% 35%, #E38866 0%, #A65B3A 50%, #8B4A2D 100%)',
                        boxShadow:
                          '0 2px 3px rgba(30,58,43,0.3), inset 0 1px 1px rgba(255,255,255,0.3)',
                      }}
                    />
                  );
                })}
                {/* fern silhouette watermark */}
                <svg
                  viewBox="0 0 200 640"
                  className="absolute pointer-events-none"
                  style={{
                    top: 10,
                    right: -40,
                    width: 180,
                    color: '#2E5E3B',
                    opacity: 0.09,
                    zIndex: 0,
                  }}
                  aria-hidden
                >
                  <path
                    d="M100 10 Q 94 220, 98 580 Q 100 610, 96 628"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    fill="none"
                    strokeLinecap="round"
                  />
                  {Array.from({ length: 14 }).map((_, i) => {
                    const y = 36 + i * ((580 - 36) / 14);
                    const size = 68 - i * (58 / 14);
                    const droop = 8 + i * 0.4;
                    return (
                      <g key={i}>
                        <path
                          d={`M98 ${y} Q ${98 - size * 0.55} ${y + droop * 0.3}, ${98 - size} ${y + droop} Q ${98 - size * 0.7} ${y - droop * 0.6}, 98 ${y}`}
                          fill="currentColor"
                        />
                        <path
                          d={`M98 ${y} Q ${98 + size * 0.55} ${y + droop * 0.3}, ${98 + size} ${y + droop} Q ${98 + size * 0.7} ${y - droop * 0.6}, 98 ${y}`}
                          fill="currentColor"
                        />
                      </g>
                    );
                  })}
                </svg>

                <div className="space-y-8 relative z-10">
                  <div
                    className="w-16 h-16 flex items-center justify-center transition-all duration-500"
                    style={{
                      background: 'rgba(166,91,58,0.08)',
                      color: '#2E5E3B',
                      borderRadius: 2,
                      border: '1px solid rgba(30,58,43,0.2)',
                    }}
                  >
                    <PlantIcon size={32} weight="regular" />
                  </div>
                  <div className="space-y-4">
                    <div
                      className="inline-flex items-center gap-2 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] font-bold"
                      style={{
                        background: '#A65B3A',
                        color: '#F0E9D9',
                        fontFamily: "'Space Mono', monospace",
                      }}
                    >
                      Pressed · Mounted
                    </div>
                    <h3
                      className="text-5xl italic leading-none tracking-tight"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: '#1E3A2B',
                      }}
                    >
                      Herbarium
                    </h3>
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{
                        fontFamily: "'Playfair Display', 'EB Garamond', serif",
                        color: '#6B4423',
                      }}
                    >
                      A naturalist's pressed-specimen atlas. Ecru paper, rust
                      pins, twine-tied taxonomic labels, Latin binomials.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-12 pt-8 flex justify-between items-center relative z-10 border-t"
                  style={{ borderColor: 'rgba(30,58,43,0.2)' }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{
                      color: '#3E5A4A',
                      fontFamily: "'Space Mono', monospace",
                    }}
                  >
                    Hortus_Digitalis
                  </span>
                  <ArrowRightIcon
                    className="group-hover:translate-x-2 transition-all"
                    size={24}
                    style={{ color: '#A65B3A' }}
                  />
                </div>
              </motion.div>
            </Link>

            {/* ── LIBRETTO ── */}
            <Link to="/apps/quote-generator" className="group block relative">
              <motion.div
                whileHover={{ y: -10 }}
                className="h-full p-12 flex flex-col justify-between overflow-hidden transition-all duration-500 relative"
                style={{
                  background: '#2A0E14',
                  borderRadius: 2,
                  boxShadow:
                    '0 0 0 1px #C8A255 inset, 0 0 0 5px #2A0E14, 0 0 0 6px #C8A25566, 0 30px 60px -30px rgba(0,0,0,0.7)',
                }}
              >
                {/* subtle gilt damask dots */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundImage:
                      'radial-gradient(circle at 25% 25%, rgba(200,162,85,0.08) 1px, transparent 2px), radial-gradient(circle at 75% 75%, rgba(200,162,85,0.08) 1px, transparent 2px)',
                    backgroundSize: '36px 36px',
                    opacity: 0.8,
                  }}
                />
                {/* top stage curtain */}
                <svg
                  viewBox="0 0 600 60"
                  preserveAspectRatio="none"
                  className="absolute left-0 right-0 top-0 pointer-events-none"
                  style={{ height: 30 }}
                  aria-hidden
                >
                  <rect x="0" y="0" width="600" height="9" fill="#5A0F18" />
                  <rect x="0" y="8" width="600" height="1" fill="#C8A255" />
                  {Array.from({ length: 6 }).map((_, i) => {
                    const x = i * 100;
                    const drop = 30 + (i % 2) * 8;
                    return (
                      <g key={i}>
                        <path
                          d={`M${x} 9 Q${x + 50} ${drop}, ${x + 100} 9 L${x + 100} 0 L${x} 0 Z`}
                          fill="#7E1A24"
                        />
                        <circle cx={x + 50} cy={drop - 2} r="1.5" fill="#C8A255" />
                      </g>
                    );
                  })}
                </svg>

                <div className="space-y-8 relative z-10 mt-6">
                  <div
                    className="w-16 h-16 flex items-center justify-center transition-all duration-500"
                    style={{
                      background: 'rgba(200,162,85,0.1)',
                      color: '#C8A255',
                      borderRadius: 2,
                      border: '1px solid #C8A25566',
                    }}
                  >
                    <MaskHappyIcon size={32} weight="regular" />
                  </div>
                  <div className="space-y-4">
                    <div
                      className="text-[10px] uppercase tracking-[0.3em]"
                      style={{
                        color: '#C8A255',
                        fontFamily: "'Cinzel', serif",
                      }}
                    >
                      Grand Théâtre · MMXXVI
                    </div>
                    <h3
                      className="text-5xl italic leading-none tracking-tight"
                      style={{
                        fontFamily: "'Playfair Display', serif",
                        color: '#F0E4C8',
                        textShadow: '0 2px 0 #1A0609, 0 4px 16px rgba(200,162,85,0.3)',
                      }}
                    >
                      Libretto
                    </h3>
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{
                        fontFamily: "'Playfair Display', 'EB Garamond', serif",
                        color: 'rgba(240,228,200,0.75)',
                      }}
                    >
                      Opera program in velvet and gilt. Stage-curtain pelmet,
                      gold tassels, parchment acts, Playfair italic with
                      Cinzel capitals.
                    </p>
                  </div>
                </div>
                <div
                  className="mt-12 pt-8 flex justify-between items-center relative z-10 border-t"
                  style={{ borderColor: '#8A6B2F' }}
                >
                  <span
                    className="text-[10px] uppercase tracking-[0.3em]"
                    style={{
                      color: '#C8A255',
                      fontFamily: "'Cinzel', serif",
                    }}
                  >
                    Act I · Scena Prima
                  </span>
                  <ArrowRightIcon
                    className="group-hover:translate-x-2 transition-all"
                    size={24}
                    style={{ color: '#C8A255' }}
                  />
                </div>
              </motion.div>
            </Link>

          </div>
        </div>

        <footer className="mt-24 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-black/30 font-outfit text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <LayoutIcon size={14} />
            <span>Tri Theme Protocol Alpha</span>
          </div>
          <span>Fezcodex Studio — 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default DesignSelectionPage;
