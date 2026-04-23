import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  QuotesIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import QuoteGeneratorApp from '../../app/QuoteGenerator/QuoteGeneratorApp';

// ─── LIBRETTO :: app-shell design language ─────────────────────────────
// An opera libretto / theater program aesthetic. Deep oxblood velvet with
// gilt ornaments, cream parchment program pages, Playfair Display italic
// wordmarks, Cinzel inscribed capitals, EB Garamond body copy. Stage
// curtain motifs, gold tassels, footlight warmth.
const L = {
  velvet: '#2A0E14',
  velvetDeep: '#1A0609',
  curtain: '#7E1A24',
  curtainDeep: '#5A0F18',
  gilt: '#C8A255',
  giltBright: '#E6C278',
  giltDeep: '#8A6B2F',
  parchment: '#F0E4C8',
  parchmentAged: '#E8D9B5',
  ink: '#1A0A0D',
  inkSoft: 'rgba(240,228,200,0.75)',
  rose: '#C85A6A',
  shadow: 'rgba(0,0,0,0.7)',
};

// Stage curtain SVG — swagged velvet with gilt trim
const StageCurtain = ({ className, style }) => (
  <svg
    viewBox="0 0 1200 120"
    preserveAspectRatio="none"
    className={className}
    style={style}
    aria-hidden
  >
    <defs>
      <linearGradient id="curtain-vel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={L.curtain} />
        <stop offset="1" stopColor={L.curtainDeep} />
      </linearGradient>
    </defs>
    <rect x="0" y="0" width="1200" height="18" fill={L.curtainDeep} />
    <rect x="0" y="16" width="1200" height="2" fill={L.gilt} />
    {Array.from({ length: 10 }).map((_, i) => {
      const x = i * 120;
      const drop = 60 + (i % 2) * 15;
      return (
        <g key={i}>
          <path
            d={`M${x} 18 Q${x + 60} ${drop}, ${x + 120} 18 L${x + 120} 0 L${x} 0 Z`}
            fill="url(#curtain-vel)"
          />
          <circle cx={x + 60} cy={drop - 2} r="3" fill={L.gilt} />
          <line
            x1={x + 60}
            y1={drop - 2}
            x2={x + 60}
            y2={drop + 10}
            stroke={L.gilt}
            strokeWidth="1.5"
          />
          <path
            d={`M${x + 57} ${drop + 10} L${x + 63} ${drop + 10} L${x + 65} ${drop + 22} L${x + 60} ${drop + 28} L${x + 55} ${drop + 22} Z`}
            fill={L.gilt}
          />
        </g>
      );
    })}
  </svg>
);

const FiligreeCorner = ({ corner = 'tl', size = 64 }) => {
  const transforms = {
    tl: '', tr: 'scale(-1, 1)', bl: 'scale(1, -1)', br: 'scale(-1, -1)',
  };
  const positions = {
    tl: { top: 8, left: 8 },
    tr: { top: 8, right: 8 },
    bl: { bottom: 8, left: 8 },
    br: { bottom: 8, right: 8 },
  };
  return (
    <svg
      viewBox="0 0 100 100"
      style={{
        position: 'absolute',
        width: size,
        height: size,
        ...positions[corner],
        pointerEvents: 'none',
        color: L.gilt,
        zIndex: 2,
      }}
      aria-hidden
    >
      <g transform={transforms[corner]} style={{ transformOrigin: 'center' }}>
        <path
          d="M10 10 L40 10 M10 10 L10 40 M10 10 Q 30 12, 32 30 Q 40 28, 44 42 Q 34 46, 30 58 Q 20 50, 12 40 Z"
          fill="currentColor"
          opacity="0.9"
        />
        <circle cx="14" cy="14" r="2.5" fill="currentColor" />
        <circle cx="38" cy="14" r="1.5" fill="currentColor" />
        <circle cx="14" cy="38" r="1.5" fill="currentColor" />
        <path
          d="M20 20 Q 30 22, 34 30 Q 26 28, 22 36"
          stroke="currentColor"
          strokeWidth="0.8"
          fill="none"
        />
      </g>
    </svg>
  );
};

const Fleuron = ({ className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    <span className="flex-1 h-px" style={{ background: `linear-gradient(to right, transparent, ${L.gilt}, transparent)` }} />
    <svg width="40" height="20" viewBox="0 0 40 20" aria-hidden style={{ color: L.gilt }}>
      <path
        d="M20 4 Q 14 10, 8 10 Q 14 10, 20 16 Q 26 10, 32 10 Q 26 10, 20 4 Z"
        fill="currentColor"
      />
      <circle cx="20" cy="10" r="1.6" fill={L.velvet} />
    </svg>
    <span className="flex-1 h-px" style={{ background: `linear-gradient(to left, transparent, ${L.gilt}, transparent)` }} />
  </div>
);

const QuoteGeneratorPage = () => {
  return (
    <div
      className="libretto-page min-h-screen relative overflow-x-hidden"
      style={{ background: L.velvet, color: L.parchment }}
    >
      <style>{`
        .libretto-page { font-family: 'EB Garamond', Georgia, serif; }
        .libretto-display { font-family: 'Playfair Display', 'EB Garamond', serif; }
        .libretto-caps { font-family: 'Cinzel', 'Playfair Display', serif; letter-spacing: 0.14em; }
        .libretto-mono { font-family: 'Space Mono', 'JetBrains Mono', monospace; }

        .libretto-page::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            radial-gradient(circle at 25% 25%, rgba(200,162,85,0.04) 1px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(200,162,85,0.04) 1px, transparent 2px);
          background-size: 36px 36px, 36px 36px;
        }
        .libretto-page::after {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background:
            radial-gradient(ellipse at top, rgba(255,178,89,0.08), transparent 55%),
            radial-gradient(ellipse at bottom, rgba(0,0,0,0.5), transparent 65%);
        }

        .libretto-footlights {
          position: fixed; left: 0; right: 0; bottom: 0; height: 4px;
          background: linear-gradient(to right,
            ${L.giltDeep} 0%, ${L.giltBright} 50%, ${L.giltDeep} 100%);
          box-shadow: 0 0 40px rgba(230,194,120,0.35), 0 0 80px rgba(230,194,120,0.2);
          z-index: 50; pointer-events: none;
        }

        .libretto-program {
          position: relative;
          background:
            radial-gradient(ellipse at top, ${L.parchment} 0%, ${L.parchmentAged} 100%);
          color: ${L.ink};
          box-shadow:
            0 0 0 1px ${L.gilt},
            0 0 0 6px ${L.velvet},
            0 0 0 7px ${L.gilt},
            0 40px 90px -30px rgba(0,0,0,0.7),
            0 20px 40px -20px rgba(0,0,0,0.5);
        }

        /* Scoped overrides for the embedded ControlPanel's dark theme */
        .libretto-controls .bg-\\[\\#111\\] {
          background: ${L.velvet} !important;
          border-color: rgba(200,162,85,0.22) !important;
          box-shadow: inset 0 0 0 1px rgba(200,162,85,0.08), 0 8px 20px -8px rgba(0,0,0,0.5) !important;
        }
        .libretto-controls .border-white\\/5,
        .libretto-controls .border-white\\/10 {
          border-color: rgba(200,162,85,0.22) !important;
        }
        .libretto-controls .text-gray-500,
        .libretto-controls .text-gray-600 {
          color: ${L.gilt} !important;
          font-family: 'Cinzel', serif !important;
          letter-spacing: 0.18em !important;
        }
        .libretto-controls .text-gray-400,
        .libretto-controls .text-gray-300,
        .libretto-controls .text-white {
          color: ${L.parchment} !important;
        }
        .libretto-controls .bg-black {
          background: ${L.velvetDeep} !important;
        }
        .libretto-controls .bg-white\\/5,
        .libretto-controls .bg-white\\/10 {
          background: rgba(200,162,85,0.08) !important;
          border-color: rgba(200,162,85,0.28) !important;
        }
        .libretto-controls .bg-white\\/5:hover,
        .libretto-controls .bg-white\\/10:hover {
          background: rgba(200,162,85,0.16) !important;
          border-color: ${L.gilt} !important;
          color: ${L.parchment} !important;
        }
        .libretto-controls h3 {
          font-family: 'Cinzel', serif !important;
          color: ${L.gilt} !important;
          letter-spacing: 0.2em !important;
        }
        .libretto-controls textarea,
        .libretto-controls input[type="text"],
        .libretto-controls input[type="number"] {
          font-family: 'EB Garamond', serif !important;
          font-size: 16px !important;
          color: ${L.parchment} !important;
        }

        /* Download buttons styled as curtain tickets */
        .libretto-download-row button {
          background: transparent !important;
          border: 1px solid ${L.gilt} !important;
          color: ${L.gilt} !important;
          font-family: 'Cinzel', serif !important;
          letter-spacing: 0.24em !important;
          transition: background .2s ease, color .2s ease !important;
        }
        .libretto-download-row button:hover {
          background: ${L.gilt} !important;
          color: ${L.velvet} !important;
        }

        @keyframes libretto-reveal {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .libretto-reveal { animation: libretto-reveal .7s cubic-bezier(.2,.7,.2,1) both; }
      `}</style>

      <div className="libretto-footlights" />

      <Seo
        title="Quote Generator — La Voix Humaine | Fezcodex"
        description="A libretto of borrowed words. Compose quote images in parchment and gilt."
        keywords={['quote', 'generator', 'image', 'maker', 'typography', 'libretto', 'fezcodex']}
      />

      {/* ─── TOP BAR ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 relative"
        style={{
          background: `${L.velvetDeep}F0`,
          borderBottom: `1px solid ${L.giltDeep}`,
          backdropFilter: 'blur(4px)',
        }}
      >
        <StageCurtain
          className="absolute inset-x-0 top-0 w-full"
          style={{ height: 20, pointerEvents: 'none' }}
        />
        <div className="mx-auto max-w-7xl px-6 md:px-12 pt-8 pb-3 flex items-center justify-between gap-4 relative">
          <Link
            to="/apps"
            className="flex items-center gap-2 transition-opacity hover:opacity-70"
            style={{ color: L.gilt }}
          >
            <ArrowLeftIcon size={14} />
            <span className="libretto-caps text-[10px] uppercase">Lobby</span>
          </Link>
          <div className="hidden md:flex items-baseline gap-3">
            <span
              className="libretto-caps text-[10px] uppercase"
              style={{ color: L.inkSoft }}
            >
              Programme
            </span>
            <span
              className="libretto-display italic text-[18px]"
              style={{ color: L.parchment }}
            >
              La Voix Humaine
            </span>
          </div>
          <span
            className="libretto-caps text-[10px] uppercase hidden lg:inline"
            style={{ color: L.gilt }}
          >
            ACT I · Scena Prima
          </span>
        </div>
      </div>

      {/* ─── HEADER ─────────────────────────────────────────────── */}
      <header className="libretto-reveal relative z-10 mx-auto max-w-7xl px-6 md:px-12 pt-16 md:pt-20 pb-10 text-center">
        <div
          className="libretto-caps text-[11px] uppercase mb-4"
          style={{ color: L.gilt }}
        >
          FEZCODEX · Grand Théâtre · MMXXVI
        </div>

        <h1
          className="libretto-display italic leading-[0.95] mb-4"
          style={{
            fontSize: 'clamp(52px, 8vw, 108px)',
            color: L.parchment,
            textShadow: `0 2px 0 ${L.velvetDeep}, 0 4px 20px rgba(200,162,85,0.25)`,
          }}
        >
          Quote Generator
        </h1>

        <div
          className="libretto-display italic mt-2 mb-6"
          style={{
            fontSize: 'clamp(18px, 2vw, 22px)',
            color: L.gilt,
          }}
        >
          — a libretto of borrowed words —
        </div>

        <Fleuron />

        <p
          className="libretto-display italic max-w-2xl mx-auto mt-8"
          style={{
            fontSize: 'clamp(17px, 1.6vw, 20px)',
            color: L.parchment,
            opacity: 0.9,
            lineHeight: 1.55,
          }}
        >
          "Words are, in my not-so-humble opinion, our most inexhaustible source of magic." The curtain parts. The soloist steps forward.
        </p>

        <div
          className="libretto-caps text-[10px] uppercase mt-6"
          style={{ color: L.inkSoft }}
        >
          Now playing · Art · Music · Science · Rome · Drama · Comedy · Life · Birds · Kings · Queens · French Girls
        </div>
      </header>

      {/* ─── MAIN PROGRAM PAGE ───────────────────────────────────── */}
      <main className="libretto-reveal relative z-10 mx-auto max-w-7xl px-6 md:px-12 pb-16" style={{ animationDelay: '.12s' }}>
        <div className="libretto-program p-6 md:p-10">
          <FiligreeCorner corner="tl" />
          <FiligreeCorner corner="tr" />
          <FiligreeCorner corner="bl" />
          <FiligreeCorner corner="br" />

          <div className="text-center mb-8">
            <div
              className="libretto-caps text-[11px] uppercase"
              style={{ color: L.giltDeep }}
            >
              Act II
            </div>
            <div
              className="libretto-display italic text-[32px] md:text-[40px] leading-none mt-1"
              style={{ color: L.ink }}
            >
              The Composition
            </div>
            <div
              className="libretto-display italic text-[16px] mt-2"
              style={{ color: 'rgba(26,10,13,0.6)' }}
            >
              (con voce · in which the soloist sets the scene)
            </div>
            <Fleuron className="mt-6 opacity-80" />
          </div>

          <div className="libretto-controls libretto-download-row">
            <QuoteGeneratorApp />
          </div>
        </div>
      </main>

      {/* ─── COLOPHON ────────────────────────────────────────────── */}
      <footer
        className="relative z-10 mx-auto max-w-7xl px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: `1px solid ${L.giltDeep}` }}
      >
        <div className="flex items-center gap-3">
          <QuotesIcon size={16} style={{ color: L.gilt }} />
          <span
            className="libretto-caps text-[10px] uppercase"
            style={{ color: L.gilt }}
          >
            Libretto · Printed in Parchment & Gilt
          </span>
        </div>
        <div
          className="libretto-display italic text-[14px]"
          style={{ color: L.inkSoft }}
        >
          "Il calar della tela." — curtain falls.
        </div>
        <span
          className="libretto-caps text-[10px] uppercase"
          style={{ color: L.gilt }}
        >
          Fezcodex · MMXXVI
        </span>
      </footer>
    </div>
  );
};

export default QuoteGeneratorPage;
