import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  QuotesIcon,
  CircleIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import QuoteGeneratorApp from '../../app/QuoteGenerator/QuoteGeneratorApp';

// ─── WORKBENCH :: calm modern dev-tool aesthetic ───────────────────────
// Inspired by Claude Code and Codex — warm near-black, cream ink, a single
// muted terracotta accent. Fraunces regular for display (no italic), Instrument
// Sans for body, JetBrains Mono for micro-labels. Minimal motion, generous
// breathing room, compact chrome so the app gets the space.
const W = {
  bg: '#0F0F10',
  bgSoft: '#141415',
  surface: '#17171A',
  surface2: '#1E1E22',
  hair: 'rgba(239,236,228,0.08)',
  hairHi: 'rgba(239,236,228,0.14)',
  ink: '#EFECE4',
  inkSoft: '#A8A49B',
  inkDim: '#6E6B64',
  accent: '#C4643A',
  accentSoft: 'rgba(196,100,58,0.14)',
};

const QuoteGeneratorPage = () => {
  const [now, setNow] = useState('');

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setNow(
        d
          .toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
          .toLowerCase(),
      );
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="workbench-page min-h-screen relative"
      style={{ background: W.bg, color: W.ink }}
    >
      <style>{`
        .workbench-page { font-family: 'Instrument Sans', system-ui, sans-serif; }
        .wb-display { font-family: 'Fraunces', 'EB Garamond', serif; font-variation-settings: "opsz" 72, "SOFT" 0, "WONK" 0; }
        .wb-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }

        /* Subtle film grain — barely there */
        .workbench-page::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            radial-gradient(circle at 30% 30%, rgba(239,236,228,0.015) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.6;
        }

        /* Warm vignette glow anchored top */
        .workbench-page::after {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background:
            radial-gradient(60% 30% at 50% 0%, rgba(196,100,58,0.05), transparent 70%);
        }

        .wb-surface {
          background: ${W.surface};
          border: 1px solid ${W.hair};
          border-radius: 14px;
        }

        /* kbd chip */
        .wb-kbd {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 6px; border-radius: 5px;
          background: ${W.surface2};
          border: 1px solid ${W.hairHi};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: ${W.inkSoft};
        }

        /* Pill link */
        .wb-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid ${W.hair};
          background: ${W.surface};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
          color: ${W.inkSoft};
        }

        @keyframes wb-reveal {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wb-reveal { animation: wb-reveal .5s cubic-bezier(.2,.7,.2,1) both; }

        /* ─── ControlPanel overrides ─── */
        .wb-controls .bg-\\[\\#111\\] {
          background: ${W.surface} !important;
          border: 1px solid ${W.hair} !important;
          border-radius: 12px !important;
          box-shadow: none !important;
        }
        .wb-controls .border-white\\/5,
        .wb-controls .border-white\\/10 {
          border-color: ${W.hair} !important;
        }
        .wb-controls h3 {
          font-family: 'JetBrains Mono', monospace !important;
          color: ${W.inkSoft} !important;
          letter-spacing: 0.18em !important;
          font-size: 10px !important;
          text-transform: uppercase !important;
        }
        .wb-controls .text-gray-500,
        .wb-controls .text-gray-600 {
          color: ${W.inkSoft} !important;
          font-family: 'JetBrains Mono', monospace !important;
        }
        .wb-controls .text-gray-400,
        .wb-controls .text-gray-300,
        .wb-controls .text-white {
          color: ${W.ink} !important;
        }
        .wb-controls .bg-black {
          background: ${W.bg} !important;
          border-radius: 8px !important;
        }
        .wb-controls .bg-white\\/5,
        .wb-controls .bg-white\\/10 {
          background: ${W.surface2} !important;
          border: 1px solid ${W.hair} !important;
          border-radius: 8px !important;
          color: ${W.ink} !important;
          font-family: 'Instrument Sans', sans-serif !important;
          text-transform: none !important;
          letter-spacing: 0 !important;
        }
        .wb-controls .bg-white\\/5:hover,
        .wb-controls .bg-white\\/10:hover {
          background: ${W.accentSoft} !important;
          border-color: ${W.accent} !important;
          color: ${W.accent} !important;
        }
        .wb-controls textarea,
        .wb-controls input[type="text"],
        .wb-controls input[type="number"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 14px !important;
          color: ${W.ink} !important;
          border-radius: 8px !important;
        }
        .wb-controls textarea:focus,
        .wb-controls input[type="text"]:focus {
          border-color: ${W.accent} !important;
          box-shadow: 0 0 0 3px ${W.accentSoft} !important;
          outline: none !important;
        }

        .wb-downloads button {
          background: ${W.surface} !important;
          border: 1px solid ${W.hair} !important;
          color: ${W.ink} !important;
          font-family: 'JetBrains Mono', monospace !important;
          text-transform: lowercase !important;
          border-radius: 8px !important;
          letter-spacing: 0.04em !important;
          transition: all .15s ease !important;
        }
        .wb-downloads button:hover {
          background: ${W.accent} !important;
          color: ${W.bg} !important;
          border-color: ${W.accent} !important;
          transform: none !important;
        }

        /* Preview panel frame */
        .wb-controls > div {
          gap: 32px !important;
        }

        .wb-focus-ring *:focus-visible {
          outline: 2px solid ${W.accent};
          outline-offset: 2px;
        }
      `}</style>

      <Seo
        title="Quote — Fezcodex"
        description="A composer for quote images. Calm, modern, type-first."
        keywords={['quote', 'generator', 'image', 'maker', 'typography', 'fezcodex']}
      />

      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 relative"
        style={{
          background: `${W.bg}E8`,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${W.hair}`,
        }}
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link
              to="/apps"
              className="flex items-center gap-2 transition-opacity hover:opacity-70"
              style={{ color: W.inkSoft }}
            >
              <ArrowLeftIcon size={13} />
              <span className="wb-mono text-[11px] tracking-[0.08em]">apps</span>
            </Link>
            <span className="h-4 w-px" style={{ background: W.hairHi }} />
            <div className="flex items-center gap-2">
              <CircleIcon size={6} weight="fill" style={{ color: W.accent }} />
              <span className="wb-mono text-[11px]" style={{ color: W.ink }}>
                quote
              </span>
              <span className="wb-mono text-[11px]" style={{ color: W.inkDim }}>
                / composer
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <span className="wb-mono text-[10px]" style={{ color: W.inkDim }}>
              {now} · local
            </span>
            <span className="h-4 w-px" style={{ background: W.hairHi }} />
            <span className="wb-mono text-[10px]" style={{ color: W.inkDim }}>
              v2026.1
            </span>
          </div>
        </div>
      </div>

      {/* ─── Compact header ──────────────────────────────────────── */}
      <header className="wb-reveal relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pt-10 md:pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div
              className="wb-mono text-[11px] mb-3 flex items-center gap-2"
              style={{ color: W.inkSoft, letterSpacing: '0.08em' }}
            >
              <QuotesIcon size={12} style={{ color: W.accent }} />
              <span>composer · beta</span>
            </div>
            <h1
              className="wb-display leading-[1.05] tracking-[-0.01em]"
              style={{
                fontSize: 'clamp(40px, 5vw, 64px)',
                color: W.ink,
                fontWeight: 400,
              }}
            >
              Compose a quote.
            </h1>
            <p
              className="mt-3 text-[15px] md:text-[16px] max-w-xl leading-relaxed"
              style={{ color: W.inkSoft }}
            >
              Pick a surface, set the voice, export a piece — PNG, JPEG, or WebP
              at 1080². Twenty-five surfaces and eleven typefaces, built for
              writers who treat type like a medium.
            </p>
          </div>

          {/* quick stats / chips */}
          <div className="flex flex-wrap items-center gap-2 md:justify-end">
            <span className="wb-pill">
              <span style={{ color: W.ink }}>25</span> surfaces
            </span>
            <span className="wb-pill">
              <span style={{ color: W.ink }}>11</span> typefaces
            </span>
            <span className="wb-pill">
              <DownloadSimpleIcon size={11} />
              png · jpeg · webp
            </span>
          </div>
        </div>

        {/* hairline rule with a single accent notch */}
        <div className="mt-10 relative" style={{ height: 1 }}>
          <div className="absolute inset-0" style={{ background: W.hair }} />
          <div
            className="absolute left-0 top-0 bottom-0"
            style={{ width: 40, background: W.accent }}
          />
        </div>
      </header>

      {/* ─── Workspace ───────────────────────────────────────────── */}
      <main
        className="wb-reveal relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pb-16"
        style={{ animationDelay: '.08s' }}
      >
        <div className="wb-controls wb-downloads wb-focus-ring">
          <QuoteGeneratorApp />
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer
        className="relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${W.hair}` }}
      >
        <div className="flex items-center gap-2">
          <CircleIcon size={6} weight="fill" style={{ color: W.accent }} />
          <span
            className="wb-mono text-[10px]"
            style={{ color: W.inkDim, letterSpacing: '0.1em' }}
          >
            fezcodex / composer
          </span>
        </div>
        <span
          className="wb-display text-[14px]"
          style={{ color: W.inkSoft }}
        >
          type is a medium.
        </span>
        <span
          className="wb-mono text-[10px]"
          style={{ color: W.inkDim, letterSpacing: '0.1em' }}
        >
          ⌘ k to search
        </span>
      </footer>
    </div>
  );
};

export default QuoteGeneratorPage;
