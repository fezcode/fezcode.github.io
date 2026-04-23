import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  CommandIcon,
  QuotesIcon,
  SparkleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import QuoteGeneratorApp from '../../app/QuoteGenerator/QuoteGeneratorApp';

// ─── PROSE :: modern 2026 writing-tool aesthetic ───────────────────────
// Off-black ground, drifting aurora gradient mesh, a single electric lime
// accent. Oversized Fraunces italic headline (with an accent period) paired
// with Instrument Sans body and JetBrains Mono micro-labels. Floating bento
// cards with gradient hairline borders, scroll progress bar, frosted sticky
// top bar. Think Linear + Arc Browser + iA Writer — type-first, confident,
// zero ornament.
const C = {
  bg: '#0A0A0B',
  bgSoft: '#101013',
  surface: '#131316',
  surface2: '#1A1A1E',
  hair: 'rgba(255,255,255,0.06)',
  hairHi: 'rgba(255,255,255,0.12)',
  ink: '#F5F5F4',
  inkSoft: '#A1A1AA',
  inkDim: '#52525B',
  accent: '#C5F24B',
  accentDim: '#9AC93A',
  accentGlow: 'rgba(197,242,75,0.35)',
};

// Rotating example quotes — displayed as live ticker
const MUSE_QUOTES = [
  '“Brevity is the soul of wit.” — Shakespeare',
  '“I have nothing to declare except my genius.” — Wilde',
  '“Stay hungry, stay foolish.” — Brand',
  '“The unexamined life is not worth living.” — Socrates',
  '“Less is more.” — Mies',
  '“Fail better.” — Beckett',
];

const QuoteGeneratorPage = () => {
  const [scroll, setScroll] = useState(0);
  const [museIdx, setMuseIdx] = useState(0);

  // scroll progress bar
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)) * 100;
      setScroll(pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // rotating muse
  useEffect(() => {
    const id = setInterval(() => setMuseIdx((i) => (i + 1) % MUSE_QUOTES.length), 4200);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className="prose-page min-h-screen relative"
      style={{ background: C.bg, color: C.ink }}
    >
      <style>{`
        .prose-page { font-family: 'Instrument Sans', system-ui, sans-serif; }
        .prose-display { font-family: 'Fraunces', 'EB Garamond', serif; font-variation-settings: "opsz" 144, "SOFT" 20, "WONK" 0; }
        .prose-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }

        /* Aurora — soft drifting gradient mesh behind all content */
        .prose-aurora {
          position: fixed; inset: -10%; z-index: 0; pointer-events: none;
          background:
            radial-gradient(40% 30% at 18% 22%, rgba(197,242,75,0.14), transparent 70%),
            radial-gradient(35% 30% at 82% 14%, rgba(56,189,248,0.10), transparent 70%),
            radial-gradient(45% 35% at 70% 85%, rgba(236,72,153,0.09), transparent 70%),
            radial-gradient(40% 30% at 15% 90%, rgba(168,85,247,0.08), transparent 70%);
          filter: blur(40px);
          animation: prose-drift 28s ease-in-out infinite alternate;
        }
        @keyframes prose-drift {
          0%   { transform: translate3d(0,0,0) rotate(0deg) scale(1); }
          50%  { transform: translate3d(2%, -2%, 0) rotate(4deg) scale(1.06); }
          100% { transform: translate3d(-1%, 2%, 0) rotate(-3deg) scale(1.02); }
        }

        /* Dotted grid overlay */
        .prose-dots {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 22px 22px;
          mask-image: radial-gradient(ellipse at center, black 40%, transparent 80%);
        }

        /* Scroll progress */
        .prose-progress {
          position: fixed; top: 0; left: 0; height: 2px; z-index: 100;
          background: linear-gradient(90deg, ${C.accent}, ${C.accentDim});
          box-shadow: 0 0 10px ${C.accentGlow};
          transition: width .1s ease-out;
        }

        /* Gradient hairline card — masked border trick */
        .prose-card {
          position: relative;
          background: ${C.surface};
          border-radius: 20px;
          overflow: hidden;
        }
        .prose-card::before {
          content: ''; position: absolute; inset: 0; padding: 1px;
          border-radius: 20px;
          background: linear-gradient(140deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04) 40%, rgba(197,242,75,0.2));
          -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
          -webkit-mask-composite: xor;
                  mask-composite: exclude;
          pointer-events: none;
        }

        /* Compact keyboard chip */
        .prose-kbd {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 7px; border-radius: 6px;
          background: ${C.surface2};
          border: 1px solid ${C.hairHi};
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px; color: ${C.inkSoft};
        }

        /* Accent underline */
        .prose-mark {
          position: relative; display: inline-block;
        }
        .prose-mark::after {
          content:''; position: absolute; left: 0; right: 0; bottom: -2px; height: 4px;
          background: ${C.accent}; border-radius: 2px;
          transform-origin: left; animation: prose-mark-in .8s cubic-bezier(.2,.7,.2,1) .4s both;
        }
        @keyframes prose-mark-in { from { transform: scaleX(0); } to { transform: scaleX(1); } }

        /* Ticker */
        .prose-ticker {
          position: relative; overflow: hidden; height: 22px;
        }
        .prose-ticker-line {
          position: absolute; inset: 0;
          animation: prose-ticker-fade .7s cubic-bezier(.2,.7,.2,1) both;
        }
        @keyframes prose-ticker-fade {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Fade-in reveal */
        @keyframes prose-reveal {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .prose-reveal { animation: prose-reveal .7s cubic-bezier(.2,.7,.2,1) both; }

        /* ── ControlPanel overrides — dark surface + accent focus ── */
        .prose-controls .bg-\\[\\#111\\] {
          background: ${C.surface} !important;
          border-color: ${C.hair} !important;
          border-radius: 16px !important;
        }
        .prose-controls .border-white\\/5,
        .prose-controls .border-white\\/10 {
          border-color: ${C.hair} !important;
        }
        .prose-controls h3 {
          font-family: 'JetBrains Mono', monospace !important;
          color: ${C.inkSoft} !important;
          letter-spacing: 0.22em !important;
          font-size: 10px !important;
        }
        .prose-controls .text-gray-500,
        .prose-controls .text-gray-600 {
          color: ${C.inkSoft} !important;
          font-family: 'JetBrains Mono', monospace !important;
        }
        .prose-controls .text-gray-400,
        .prose-controls .text-gray-300 {
          color: ${C.ink} !important;
          opacity: 0.85 !important;
        }
        .prose-controls .bg-black {
          background: ${C.surface2} !important;
          border-radius: 10px !important;
        }
        .prose-controls .bg-white\\/5,
        .prose-controls .bg-white\\/10 {
          background: ${C.surface2} !important;
          border-color: ${C.hair} !important;
          border-radius: 10px !important;
        }
        .prose-controls .bg-white\\/5:hover,
        .prose-controls .bg-white\\/10:hover {
          background: ${C.surface} !important;
          border-color: ${C.accent} !important;
          color: ${C.accent} !important;
        }
        .prose-controls textarea,
        .prose-controls input[type="text"],
        .prose-controls input[type="number"] {
          font-family: 'Instrument Sans', sans-serif !important;
          font-size: 15px !important;
          color: ${C.ink} !important;
        }
        .prose-controls textarea:focus,
        .prose-controls input[type="text"]:focus {
          border-color: ${C.accent} !important;
          box-shadow: 0 0 0 3px ${C.accentGlow} !important;
        }

        /* Download row — primary accent pill */
        .prose-downloads button {
          background: ${C.surface2} !important;
          border: 1px solid ${C.hair} !important;
          color: ${C.ink} !important;
          font-family: 'JetBrains Mono', monospace !important;
          border-radius: 10px !important;
          transition: all .2s ease !important;
        }
        .prose-downloads button:hover {
          background: ${C.accent} !important;
          color: ${C.bg} !important;
          border-color: ${C.accent} !important;
          box-shadow: 0 0 24px ${C.accentGlow} !important;
          transform: translateY(-1px) !important;
        }

        /* Focus rings */
        .prose-page *:focus-visible {
          outline: 2px solid ${C.accent};
          outline-offset: 3px;
          border-radius: 4px;
        }
      `}</style>

      <div className="prose-progress" style={{ width: `${scroll}%` }} />
      <div className="prose-aurora" />
      <div className="prose-dots" />

      <Seo
        title="Quote Generator | Fezcodex"
        description="Compose quote images with exceptional typography. A modern 2026 writing tool."
        keywords={['quote', 'generator', 'image', 'maker', 'typography', 'fezcodex']}
      />

      {/* ─── Top bar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30"
        style={{
          background: `${C.bg}CC`,
          backdropFilter: 'blur(16px) saturate(160%)',
          WebkitBackdropFilter: 'blur(16px) saturate(160%)',
          borderBottom: `1px solid ${C.hair}`,
        }}
      >
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-3 flex items-center justify-between gap-4">
          <Link
            to="/apps"
            className="flex items-center gap-2 group transition-opacity hover:opacity-80"
            style={{ color: C.inkSoft }}
          >
            <ArrowLeftIcon size={14} />
            <span className="prose-mono text-[11px] tracking-[0.2em] uppercase">apps</span>
          </Link>

          <div className="hidden md:flex items-center gap-3">
            <span
              className="h-2 w-2 rounded-full"
              style={{ background: C.accent, boxShadow: `0 0 10px ${C.accentGlow}` }}
            />
            <span className="prose-mono text-[11px] tracking-[0.18em] uppercase" style={{ color: C.inkSoft }}>
              quote
            </span>
            <span className="text-[13px]" style={{ color: C.ink }}>
              Composer
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="prose-mono text-[10px] tracking-[0.18em] uppercase hidden md:inline"
              style={{ color: C.inkDim }}
            >
              quick compose
            </span>
            <span className="prose-kbd">
              <CommandIcon size={10} /> K
            </span>
          </div>
        </div>
      </div>

      {/* ─── Hero ────────────────────────────────────────────────── */}
      <header className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-8 prose-reveal">
            <div
              className="prose-mono text-[11px] tracking-[0.28em] uppercase mb-6 flex items-center gap-3"
              style={{ color: C.inkSoft }}
            >
              <SparkleIcon size={14} style={{ color: C.accent }} />
              <span>— composer / v2026.1</span>
            </div>

            <h1
              className="prose-display italic leading-[0.92] tracking-[-0.02em]"
              style={{
                fontSize: 'clamp(72px, 12vw, 180px)',
                color: C.ink,
              }}
            >
              <span className="prose-mark">Quote</span>
              <span style={{ color: C.accent }}>.</span>
            </h1>

            <p
              className="mt-8 max-w-xl text-[18px] md:text-[20px] leading-relaxed"
              style={{ color: C.inkSoft }}
            >
              A composer for quote images. Pick a voice, place the words, set the
              frame — export a piece worth keeping. Built for writers who treat
              type like a medium.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#compose"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[13px] font-semibold tracking-wide transition-all"
                style={{
                  background: C.accent,
                  color: C.bg,
                  boxShadow: `0 0 0 1px ${C.accent}, 0 12px 30px -8px ${C.accentGlow}`,
                }}
              >
                Start composing <ArrowUpRightIcon size={14} weight="bold" />
              </a>
              <span className="prose-kbd">
                <CommandIcon size={10} /> Enter
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 prose-reveal" style={{ animationDelay: '.12s' }}>
            <div className="prose-card p-6">
              <div
                className="prose-mono text-[10px] tracking-[0.28em] uppercase mb-3 flex items-center justify-between"
                style={{ color: C.inkSoft }}
              >
                <span>muse · auto</span>
                <span style={{ color: C.accent }}>●</span>
              </div>
              <div className="prose-ticker">
                <div
                  key={museIdx}
                  className="prose-ticker-line text-[15px] leading-snug italic"
                  style={{ color: C.ink, fontFamily: "'Fraunces', serif" }}
                >
                  {MUSE_QUOTES[museIdx]}
                </div>
              </div>
              <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: `1px solid ${C.hair}` }}>
                <span className="prose-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: C.inkDim }}>
                  paste anything
                </span>
                <QuotesIcon size={14} style={{ color: C.inkDim }} />
              </div>
            </div>
          </div>
        </div>

        {/* meta strip */}
        <div
          className="mt-16 pt-6 flex flex-wrap items-center gap-x-10 gap-y-3 prose-mono text-[10px] tracking-[0.22em] uppercase"
          style={{ borderTop: `1px solid ${C.hair}`, color: C.inkSoft }}
        >
          <span style={{ color: C.ink }}>25 surfaces</span>
          <span>/ 11 typefaces</span>
          <span>/ png · jpeg · webp</span>
          <span>/ 1080²</span>
          <span className="ml-auto">modern · 2026</span>
        </div>
      </header>

      {/* ─── Compose frame ───────────────────────────────────────── */}
      <main
        id="compose"
        className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 pb-24 prose-reveal"
        style={{ animationDelay: '.2s' }}
      >
        <div className="prose-card p-6 md:p-8">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <div className="prose-mono text-[10px] tracking-[0.28em] uppercase mb-1" style={{ color: C.inkSoft }}>
                02 / compose
              </div>
              <h2 className="prose-display italic text-[32px] md:text-[44px] leading-none" style={{ color: C.ink }}>
                The frame.
              </h2>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <span className="prose-kbd">⇧ ⌘ E</span>
              <span className="prose-mono text-[10px] tracking-[0.22em] uppercase" style={{ color: C.inkDim }}>
                export
              </span>
            </div>
          </div>

          <div className="prose-controls prose-downloads">
            <QuoteGeneratorApp />
          </div>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer
        className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: `1px solid ${C.hair}` }}
      >
        <div className="flex items-center gap-3">
          <span
            className="h-2 w-2 rounded-full"
            style={{ background: C.accent, boxShadow: `0 0 10px ${C.accentGlow}` }}
          />
          <span
            className="prose-mono text-[10px] tracking-[0.28em] uppercase"
            style={{ color: C.inkSoft }}
          >
            Fezcodex / Composer / v2026.1
          </span>
        </div>
        <div
          className="prose-display italic text-[14px]"
          style={{ color: C.inkSoft }}
        >
          typography is a medium.
        </div>
      </footer>
    </div>
  );
};

export default QuoteGeneratorPage;
