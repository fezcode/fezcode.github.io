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

// ─── WORKBENCH :: calm modern dev-tool aesthetic (light) ───────────────
// Warm cream ground, deep ink text, a single muted terracotta accent.
// Fraunces regular for display (no italic), Instrument Sans for body,
// JetBrains Mono for micro-labels. Inspired by Claude / Codex.
const W = {
  bg: '#FAF7F0',
  bgSoft: '#F4EFE4',
  surface: '#FFFFFF',
  surface2: '#F6F1E4',
  hair: 'rgba(25,23,22,0.08)',
  hairHi: 'rgba(25,23,22,0.16)',
  ink: '#1A1918',
  inkSoft: '#6B6A65',
  inkDim: '#A8A49B',
  accent: '#C4643A',
  accentSoft: 'rgba(196,100,58,0.10)',
  accentRing: 'rgba(196,100,58,0.22)',
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

        .workbench-page::before {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(circle at 30% 30%, rgba(25,23,22,0.025) 1px, transparent 1px);
          background-size: 3px 3px;
          opacity: 0.6;
        }
        .workbench-page::after {
          content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: radial-gradient(60% 30% at 50% 0%, rgba(196,100,58,0.06), transparent 70%);
        }

        .wb-kbd {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 2px 6px; border-radius: 5px;
          background: ${W.surface};
          border: 1px solid ${W.hair};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: ${W.inkSoft};
        }

        .wb-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 10px; border-radius: 999px;
          border: 1px solid ${W.hair};
          background: ${W.surface};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; letter-spacing: 0.12em;
          color: ${W.inkSoft};
        }

        @keyframes wb-reveal {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .wb-reveal { animation: wb-reveal .5s cubic-bezier(.2,.7,.2,1) both; }

        /* Only element tints remain here — widget styling now lives in
           ControlPanel via native Workbench components. */

        .wb-focus-ring *:focus-visible {
          outline: 2px solid ${W.accent};
          outline-offset: 2px;
          border-radius: 4px;
        }

        /* Workbench-themed widget tokens (read by ControlPanel widgets) */
        :root {
          --wb-bg: ${W.bg};
          --wb-surface: ${W.surface};
          --wb-surface-2: ${W.surface2};
          --wb-hair: ${W.hair};
          --wb-hair-hi: ${W.hairHi};
          --wb-ink: ${W.ink};
          --wb-ink-soft: ${W.inkSoft};
          --wb-ink-dim: ${W.inkDim};
          --wb-accent: ${W.accent};
          --wb-accent-soft: ${W.accentSoft};
          --wb-accent-ring: ${W.accentRing};
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
        className="wb-reveal relative z-10 mx-auto max-w-[1440px] px-6 md:px-10 pb-16 wb-focus-ring"
        style={{ animationDelay: '.08s' }}
      >
        <QuoteGeneratorApp />
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
