import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ArrowsClockwiseIcon,
  PlantIcon,
  FlowerIcon,
  LeafIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';

// ─── HERBARIUM :: app-shell design language ─────────────────────────────
// A naturalist's pressed-specimen atlas. Ecru paper, cream mounted cards
// with rust pins at the corners, twine-tied taxonomic labels, ghosted fern
// watermarks. Playfair Display italic pairs with Space Mono. Latin section
// headers. Designed for the Fractal Flora specimen press.
const P = {
  paper: '#E8E0CE',
  paperDeep: '#DAD0B5',
  card: '#F0E9D9',
  cardAged: '#E8DFC5',
  ink: '#1E3A2B',
  inkSoft: '#3E5A4A',
  rust: '#A65B3A',
  rustDeep: '#8B4A2D',
  amber: '#B8863A',
  sepia: '#6B4423',
  forest: '#2E5E3B',
  rule: 'rgba(30,58,43,0.22)',
  shadow: 'rgba(30,58,43,0.15)',
};

const VOLUMES = [
  { value: 'spring', roman: 'I',   latin: 'Ver',       english: 'Spring', tint: '#C56B8A' },
  { value: 'summer', roman: 'II',  latin: 'Aestas',    english: 'Summer', tint: '#4C9A52' },
  { value: 'autumn', roman: 'III', latin: 'Autumnus',  english: 'Autumn', tint: '#A65B3A' },
  { value: 'winter', roman: 'IV',  latin: 'Hiems',     english: 'Winter', tint: '#6B7A85' },
  { value: 'neon',   roman: 'V',   latin: 'Spectrum',  english: 'Aurora', tint: '#7A3FB5' },
];

// A stylized fern silhouette used as watermark
const Fern = ({ className, style, flip = false, fronds = 14 }) => (
  <svg
    viewBox="0 0 200 640"
    className={className}
    style={style}
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden
  >
    <g transform={flip ? 'matrix(-1,0,0,1,200,0)' : undefined}>
      <path
        d="M100 10 Q 94 220, 98 580 Q 100 610, 96 628"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
      {Array.from({ length: fronds }).map((_, i) => {
        const y = 36 + i * ((580 - 36) / fronds);
        const size = 68 - i * (58 / fronds);
        const droop = 8 + i * 0.4;
        return (
          <g key={i} opacity={0.92 - i * 0.015}>
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
    </g>
  </svg>
);

// Rust corner pin
const Pin = ({ corner }) => {
  const pos = {
    tl: { top: -6, left: -6 },
    tr: { top: -6, right: -6 },
    bl: { bottom: -6, left: -6 },
    br: { bottom: -6, right: -6 },
  }[corner];
  return (
    <span
      aria-hidden
      className="absolute w-3 h-3 rounded-full"
      style={{
        ...pos,
        background: `radial-gradient(circle at 35% 35%, #E38866 0%, ${P.rust} 40%, ${P.rustDeep} 80%)`,
        boxShadow: `0 2px 3px ${P.shadow}, inset 0 1px 1px rgba(255,255,255,0.25)`,
        zIndex: 3,
      }}
    />
  );
};

// Paper card with torn-ish edge via clip-path + 4 rust pins
const SpecimenCard = ({ children, className = '', pins = true, style }) => (
  <div
    className={`relative ${className}`}
    style={{
      background: P.card,
      boxShadow:
        `inset 0 0 0 1px ${P.rule}, inset 0 1px 0 rgba(255,255,255,0.4), 0 18px 40px -18px ${P.shadow}, 0 6px 16px -10px ${P.shadow}`,
      ...style,
    }}
  >
    {pins && (
      <>
        <Pin corner="tl" />
        <Pin corner="tr" />
        <Pin corner="bl" />
        <Pin corner="br" />
      </>
    )}
    {children}
  </div>
);

// Small rust-stamped tag (like a pinned taxonomic label)
const TaxonTag = ({ children, className = '' }) => (
  <span
    className={`inline-flex items-center gap-2 px-3 py-1 uppercase tracking-[0.22em] text-[10px] font-bold ${className}`}
    style={{
      background: P.rust,
      color: P.card,
      fontFamily: '"Space Mono", monospace',
      boxShadow: `inset 0 0 0 1px ${P.rustDeep}, 0 2px 4px ${P.shadow}`,
    }}
  >
    {children}
  </span>
);

// Hand-drawn wavy sepia divider
const WavyRule = ({ className = '' }) => (
  <svg
    viewBox="0 0 400 6"
    preserveAspectRatio="none"
    className={`w-full h-[6px] ${className}`}
    aria-hidden
  >
    <path
      d="M0 3 Q 20 0, 40 3 T 80 3 T 120 3 T 160 3 T 200 3 T 240 3 T 280 3 T 320 3 T 360 3 T 400 3"
      stroke={P.sepia}
      strokeWidth="0.8"
      fill="none"
      opacity="0.55"
    />
  </svg>
);

// Styled slider row — a "field instrument"
const Instrument = ({ latin, english, unit, value, display, min, max, step = 1, onChange, tint = P.rust }) => (
  <div>
    <div className="flex items-baseline justify-between mb-1.5">
      <div className="flex items-baseline gap-3">
        <span
          className="uppercase tracking-[0.28em] text-[10px] font-bold"
          style={{ color: P.ink, fontFamily: '"Space Mono", monospace' }}
        >
          {english}
        </span>
        <span
          className="italic text-[13px]"
          style={{ color: P.sepia, fontFamily: '"Playfair Display", serif' }}
        >
          {latin}
        </span>
      </div>
      <span
        className="italic text-[14px] tabular-nums"
        style={{ color: P.ink, fontFamily: '"Playfair Display", serif' }}
      >
        {display} <span style={{ color: P.inkSoft }}>{unit}</span>
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="herb-slider w-full"
      style={{ '--slider-tint': tint }}
    />
  </div>
);

const FractalFloraPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  const [depth, setDepth] = useState(10);
  const [angle, setAngle] = useState(25);
  const [lengthBase, setLengthBase] = useState(120);
  const [lengthMultiplier, setLengthMultiplier] = useState(0.7);
  const [asymmetry, setAsymmetry] = useState(0);
  const [randomness, setRandomness] = useState(0.2);
  const [season, setSeason] = useState('summer');

  // Draw logic — preserved from the original, only the rendered tree
  const drawTree = useCallback(
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      const palettes = {
        summer: { trunk: '#5D4037', leaf: '#4CAF50', bg: '#F0E9D9' },
        autumn: { trunk: '#3E2723', leaf: '#FF5722', bg: '#F3E4D0' },
        winter: { trunk: '#212121', leaf: '#B0BEC5', bg: '#E8EDED' },
        spring: { trunk: '#795548', leaf: '#F48FB1', bg: '#F3E4E4' },
        neon:   { trunk: '#EA00FF', leaf: '#00E5FF', bg: '#120024' },
      };
      const theme = palettes[season];
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, w, h);

      const branch = (x, y, len, ang, d) => {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = d > 2 ? theme.trunk : theme.leaf;
        ctx.fillStyle = theme.leaf;
        ctx.lineWidth = d > 2 ? d : 1;
        ctx.lineCap = 'round';

        ctx.translate(x, y);
        ctx.rotate((ang * Math.PI) / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.stroke();

        if (d > 0) {
          if (d <= 2) {
            ctx.beginPath();
            ctx.arc(0, -len, 4 * (randomness + 0.5), 0, Math.PI * 2);
            ctx.fill();
          }
          const randLen = 1 + (Math.random() - 0.5) * randomness;
          const randAng = (Math.random() - 0.5) * randomness * 30;
          const nextLen = len * lengthMultiplier * randLen;

          branch(0, -len, nextLen, angle + asymmetry + randAng, d - 1);
          branch(0, -len, nextLen, -angle + asymmetry + randAng, d - 1);
          if (randomness > 0.6 && d > 4) {
            branch(0, -len, nextLen * 0.8, randAng, d - 2);
          }
        }
        ctx.restore();
      };
      branch(w / 2, h, lengthBase, 0, depth);
    },
    [depth, angle, lengthBase, lengthMultiplier, asymmetry, randomness, season],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rafId = requestAnimationFrame(() => drawTree(ctx, canvas.width, canvas.height));
    return () => cancelAnimationFrame(rafId);
  }, [drawTree]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 960;
      canvas.height = 640;
    }
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `fractal_flora_${season}_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    addToast({
      title: 'Specimen Pressed',
      message: `Volume ${VOLUMES.find(v => v.value === season)?.latin} · mounted.`,
      duration: 3000,
    });
  };

  const randomizeParams = () => {
    setAngle(15 + Math.random() * 40);
    setLengthMultiplier(0.6 + Math.random() * 0.2);
    setAsymmetry((Math.random() - 0.5) * 20);
    setRandomness(Math.random() * 0.8);
    setDepth(6 + Math.floor(Math.random() * 8));
    const seasons = VOLUMES.map(v => v.value);
    setSeason(seasons[Math.floor(Math.random() * seasons.length)]);
  };

  const activeVol = VOLUMES.find(v => v.value === season) || VOLUMES[1];

  // Specimen collection number — deterministic from params
  const specNum = Math.abs(
    Math.round(depth * 101 + angle * 37 + lengthBase * 11 + lengthMultiplier * 1000 + asymmetry * 23 + randomness * 997)
  ) % 999;

  return (
    <div
      className="herb-page min-h-screen relative overflow-hidden"
      style={{ background: P.paper, color: P.ink }}
    >
      <style>{`
        .herb-page { font-family: 'EB Garamond', 'Iowan Old Style', Georgia, serif; }
        .herb-display { font-family: 'Playfair Display', 'EB Garamond', serif; }
        .herb-mono { font-family: 'Space Mono', 'JetBrains Mono', monospace; }

        /* Paper grain */
        .herb-grain::before {
          content: ''; position: fixed; inset: 0; pointer-events: none; z-index: 1;
          background-image:
            radial-gradient(circle at 25% 30%, rgba(30,58,43,0.05) 1px, transparent 1px),
            radial-gradient(circle at 75% 70%, rgba(107,68,35,0.05) 1px, transparent 1px);
          background-size: 3px 3px, 5px 5px;
          opacity: 0.8;
          mix-blend-mode: multiply;
        }

        @keyframes herb-sway {
          0%, 100% { transform: rotate(-1.5deg); }
          50% { transform: rotate(1.5deg); }
        }
        @keyframes herb-drift {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-6px) rotate(0.8deg); }
        }
        .herb-fern {
          color: ${P.forest};
          opacity: 0.08;
          position: absolute;
          transform-origin: 50% 5%;
          pointer-events: none;
          z-index: 0;
        }
        .herb-fern--sway { animation: herb-sway 14s ease-in-out infinite; }
        .herb-fern--drift { animation: herb-drift 22s ease-in-out infinite; }

        /* Slider — rust track with amber thumb */
        .herb-slider {
          -webkit-appearance: none; appearance: none;
          background: transparent; outline: none; cursor: pointer;
          height: 24px;
        }
        .herb-slider::-webkit-slider-runnable-track {
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            var(--slider-tint, ${P.rust}) 0 2px,
            var(--slider-tint, ${P.rust}) 2px 3px,
            transparent 3px 10px
          );
        }
        .herb-slider::-moz-range-track {
          height: 2px;
          background: ${P.rust};
          opacity: 0.7;
        }
        .herb-slider::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 18px; width: 18px; border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #E8B96A 0%, ${P.amber} 45%, ${P.rustDeep} 100%);
          border: 1.5px solid ${P.rustDeep};
          margin-top: -8px;
          box-shadow: 0 2px 4px ${P.shadow}, inset 0 1px 1px rgba(255,255,255,0.25);
        }
        .herb-slider::-moz-range-thumb {
          height: 18px; width: 18px; border-radius: 50%;
          background: ${P.amber};
          border: 1.5px solid ${P.rustDeep};
        }

        @keyframes herb-fade-up {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .herb-reveal { animation: herb-fade-up .7s cubic-bezier(.2,.7,.2,1) both; }

        /* Volume tab active glow */
        .herb-vol-tab { transition: background .2s ease, color .2s ease, border-color .2s ease; }
      `}</style>

      <Seo
        title="Fractal Flora — Herbarium Specimen Press | Fezcodex"
        description="Grow and press recursive botanical specimens. Hortus Digitalis."
        keywords={['fractal', 'tree', 'recursive', 'generative art', 'herbarium', 'botanical']}
      />

      {/* Ghosted fern watermarks */}
      <Fern className="herb-fern herb-fern--sway" style={{ top: 40, left: -40, width: 220 }} />
      <Fern className="herb-fern herb-fern--drift" flip style={{ bottom: 20, right: -60, width: 260 }} />
      <Fern className="herb-fern" flip style={{ top: '40%', right: 8, width: 140, opacity: 0.05 }} />
      <div className="herb-grain" />

      {/* ─── TOP BAR ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-20 backdrop-blur-[2px]"
        style={{
          background: `${P.paper}EE`,
          borderBottom: `1px solid ${P.rule}`,
        }}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-12 py-3 flex items-center justify-between gap-4">
          <Link
            to="/apps"
            className="flex items-center gap-2 transition-opacity hover:opacity-60"
            style={{ color: P.inkSoft }}
          >
            <ArrowLeftIcon size={14} />
            <span className="herb-mono text-[10px] tracking-[0.3em] uppercase">
              Return&nbsp;to&nbsp;Apps
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-3">
            <LeafIcon size={14} style={{ color: P.forest }} />
            <span className="herb-mono text-[10px] tracking-[0.32em] uppercase" style={{ color: P.inkSoft }}>
              Hortus&nbsp;Fezcodex
            </span>
            <span className="w-px h-3" style={{ background: P.rule }} />
            <span
              className="herb-display italic text-[14px]"
              style={{ color: P.sepia }}
            >
              folio n° {String(specNum).padStart(3, '0')}
            </span>
          </div>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 uppercase tracking-[0.28em] text-[11px] font-bold transition-transform hover:-translate-y-[1px]"
            style={{
              background: P.ink,
              color: P.card,
              fontFamily: '"Space Mono", monospace',
              boxShadow: `0 2px 0 ${P.rustDeep}, 0 6px 10px -4px ${P.shadow}`,
            }}
          >
            <DownloadSimpleIcon weight="regular" size={14} />
            Press Specimen
          </button>
        </div>
      </div>

      {/* ─── HEADER ──────────────────────────────────────────────── */}
      <header className="mx-auto max-w-[1600px] px-6 md:px-12 pt-10 md:pt-16 pb-8 relative z-10 herb-reveal">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TaxonTag>fam. fractalaceae</TaxonTag>
              <span className="herb-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: P.inkSoft }}>
                · gen. recursivus · sp. arborum digitalis
              </span>
            </div>
            <h1
              className="herb-display italic text-[56px] md:text-[88px] leading-[0.9]"
              style={{ color: P.ink, letterSpacing: '-0.01em' }}
            >
              Fractal Flora
            </h1>
            <p
              className="herb-display italic text-[18px] md:text-[20px] mt-3 max-w-xl"
              style={{ color: P.sepia }}
            >
              A study in recursive growth — pressed, catalogued, and mounted for
              the Hortus Digitalis.
            </p>
          </div>
          <div className="hidden md:block text-right">
            <div
              className="herb-mono text-[10px] tracking-[0.32em] uppercase"
              style={{ color: P.inkSoft }}
            >
              Volume
            </div>
            <div
              className="herb-display italic text-[44px] leading-none"
              style={{ color: P.ink }}
            >
              № {activeVol.roman}
            </div>
            <div
              className="herb-display italic text-[18px] mt-1"
              style={{ color: activeVol.tint }}
            >
              {activeVol.latin}
            </div>
          </div>
        </div>
        <WavyRule className="mt-8" />
      </header>

      {/* ─── WORKBENCH ───────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1600px] px-6 md:px-12 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10">

          {/* ── LEFT: Field Instruments ── */}
          <div className="lg:col-span-4 herb-reveal" style={{ animationDelay: '.08s' }}>
            <SpecimenCard className="p-7 relative" style={{ marginTop: 10 }}>
              {/* pinned label */}
              <div className="absolute -top-3 left-6 z-[4] rotate-[-2deg]">
                <TaxonTag>Instrumenta · fieldwork</TaxonTag>
              </div>

              <div className="mt-4">
                <div className="flex items-baseline gap-3 mb-1">
                  <FlowerIcon size={18} style={{ color: P.rust }} />
                  <h2
                    className="herb-display italic text-[30px] leading-none"
                    style={{ color: P.ink }}
                  >
                    Field Instruments
                  </h2>
                </div>
                <p
                  className="herb-mono text-[10px] tracking-[0.28em] uppercase"
                  style={{ color: P.inkSoft }}
                >
                  calibrate · observe · record
                </p>
                <WavyRule className="mt-4 mb-6" />

                <div className="space-y-5">
                  <Instrument
                    english="Depth" latin="recursio" unit="gen."
                    value={depth} display={depth}
                    min={1} max={14}
                    onChange={(e)=>setDepth(Number(e.target.value))}
                    tint={P.forest}
                  />
                  <Instrument
                    english="Angle" latin="angulus" unit="°"
                    value={angle} display={Math.round(angle)}
                    min={0} max={120}
                    onChange={(e)=>setAngle(Number(e.target.value))}
                    tint={P.rust}
                  />
                  <Instrument
                    english="Length" latin="longitudo" unit="×"
                    value={lengthMultiplier} display={lengthMultiplier.toFixed(2)}
                    min={0.5} max={0.85} step={0.01}
                    onChange={(e)=>setLengthMultiplier(Number(e.target.value))}
                    tint={P.amber}
                  />
                  <Instrument
                    english="Trunk" latin="basis" unit="px"
                    value={lengthBase} display={lengthBase}
                    min={50} max={200}
                    onChange={(e)=>setLengthBase(Number(e.target.value))}
                    tint={P.sepia}
                  />
                  <Instrument
                    english="Wind" latin="ventus" unit="°"
                    value={asymmetry} display={Math.round(asymmetry)}
                    min={-20} max={20}
                    onChange={(e)=>setAsymmetry(Number(e.target.value))}
                    tint={P.forest}
                  />
                  <Instrument
                    english="Chaos" latin="stochasia" unit="%"
                    value={randomness} display={Math.round(randomness*100)}
                    min={0} max={1} step={0.01}
                    onChange={(e)=>setRandomness(Number(e.target.value))}
                    tint={P.rust}
                  />
                </div>

                <WavyRule className="mt-6 mb-5" />

                {/* Volume / Season tabs */}
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span
                      className="herb-mono uppercase tracking-[0.28em] text-[10px] font-bold"
                      style={{ color: P.ink }}
                    >
                      Volume
                    </span>
                    <span
                      className="herb-display italic text-[13px]"
                      style={{ color: P.sepia }}
                    >
                      seasonal plates
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5">
                    {VOLUMES.map((v) => {
                      const active = season === v.value;
                      return (
                        <button
                          key={v.value}
                          onClick={() => setSeason(v.value)}
                          className="herb-vol-tab relative py-2 flex flex-col items-center"
                          style={{
                            background: active ? P.ink : 'transparent',
                            color: active ? P.card : P.inkSoft,
                            border: `1px solid ${active ? P.ink : P.rule}`,
                          }}
                        >
                          <span className="herb-mono text-[9px] tracking-[0.2em] uppercase">
                            {v.roman}
                          </span>
                          <span className="herb-display italic text-[13px] leading-none mt-0.5">
                            {v.latin}
                          </span>
                          {active && (
                            <span
                              className="absolute -bottom-[3px] left-2 right-2 h-[2px]"
                              style={{ background: v.tint }}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-6 flex items-stretch gap-3">
                  <button
                    onClick={randomizeParams}
                    className="flex-1 flex items-center justify-center gap-2 py-3 uppercase tracking-[0.28em] text-[11px] font-bold transition-transform hover:-translate-y-[1px]"
                    style={{
                      background: 'transparent',
                      color: P.rust,
                      border: `1px solid ${P.rust}`,
                      fontFamily: '"Space Mono", monospace',
                    }}
                  >
                    <ArrowsClockwiseIcon size={14} />
                    Re-Seed
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex-1 flex items-center justify-center gap-2 py-3 uppercase tracking-[0.28em] text-[11px] font-bold transition-transform hover:-translate-y-[1px]"
                    style={{
                      background: P.rust,
                      color: P.card,
                      fontFamily: '"Space Mono", monospace',
                      boxShadow: `0 2px 0 ${P.rustDeep}`,
                    }}
                  >
                    <DownloadSimpleIcon size={14} />
                    Press
                  </button>
                </div>

                {/* naturalist's fun-fact aside */}
                <div
                  className="mt-6 p-4 relative"
                  style={{
                    background: P.cardAged,
                    border: `1px dashed ${P.rule}`,
                  }}
                >
                  <div
                    className="herb-mono uppercase tracking-[0.3em] text-[9px] mb-1.5"
                    style={{ color: P.rust }}
                  >
                    Marginalia
                  </div>
                  <p
                    className="herb-display italic text-[15px] leading-snug"
                    style={{ color: P.sepia }}
                  >
                    "Nature employs fractal branching to maximize surface for
                    sunlight above, nutrients below — an elegant, recursive
                    economy of growth."
                  </p>
                </div>
              </div>
            </SpecimenCard>
          </div>

          {/* ── RIGHT: Pressed Specimen ── */}
          <div className="lg:col-span-8 herb-reveal" style={{ animationDelay: '.16s' }}>
            <SpecimenCard className="p-7 relative" style={{ marginTop: 10 }}>
              <div className="absolute -top-3 right-6 z-[4] rotate-[2deg]">
                <TaxonTag>Specimen · mount</TaxonTag>
              </div>

              <div className="mt-2 flex items-baseline justify-between gap-4 mb-4">
                <div className="flex items-baseline gap-3">
                  <PlantIcon size={20} style={{ color: P.forest }} />
                  <h2
                    className="herb-display italic text-[30px] leading-none"
                    style={{ color: P.ink }}
                  >
                    Pressed Specimen
                  </h2>
                </div>
                <div
                  className="herb-mono text-[10px] tracking-[0.3em] uppercase"
                  style={{ color: P.inkSoft }}
                >
                  live plate · auto-regenerating
                </div>
              </div>

              {/* Canvas mount with cream mat and gilt hairline */}
              <div
                className="relative mx-auto"
                style={{
                  background: P.cardAged,
                  padding: 24,
                  boxShadow: `inset 0 0 0 1px ${P.rule}, 0 8px 20px -8px ${P.shadow}`,
                }}
              >
                <div
                  className="relative"
                  style={{
                    boxShadow: `0 0 0 1px ${P.amber}, 0 4px 10px ${P.shadow}`,
                    background: '#fff',
                  }}
                >
                  <canvas
                    ref={canvasRef}
                    className="block w-full h-auto"
                    style={{ display: 'block' }}
                  />
                  {/* Corner indicator */}
                  <div
                    className="absolute top-2 right-2 flex items-center gap-1.5 px-2 py-1"
                    style={{
                      background: `${P.ink}DD`,
                      color: P.card,
                      fontFamily: '"Space Mono", monospace',
                      fontSize: 9,
                      letterSpacing: '0.22em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span style={{ color: activeVol.tint }}>●</span>
                    {activeVol.english}
                  </div>
                </div>

                {/* Taxonomic label strip below canvas */}
                <div
                  className="mt-5 px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2"
                  style={{
                    background: P.card,
                    borderTop: `1px solid ${P.rule}`,
                    borderBottom: `1px solid ${P.rule}`,
                  }}
                >
                  <div>
                    <div
                      className="herb-display italic text-[22px]"
                      style={{ color: P.ink, lineHeight: 1 }}
                    >
                      Arborum digitalis{' '}
                      <span style={{ color: P.sepia }}>
                        var. {activeVol.latin.toLowerCase()}
                      </span>
                    </div>
                    <div
                      className="herb-mono text-[10px] tracking-[0.28em] uppercase mt-1"
                      style={{ color: P.inkSoft }}
                    >
                      Fam. Fractalaceae · Gen. Recursivus
                    </div>
                  </div>
                  <div className="flex items-baseline gap-4">
                    <div>
                      <div
                        className="herb-mono text-[9px] tracking-[0.3em] uppercase"
                        style={{ color: P.inkSoft }}
                      >
                        depth
                      </div>
                      <div
                        className="herb-display italic text-[20px] leading-none"
                        style={{ color: P.ink }}
                      >
                        {depth}
                      </div>
                    </div>
                    <div>
                      <div
                        className="herb-mono text-[9px] tracking-[0.3em] uppercase"
                        style={{ color: P.inkSoft }}
                      >
                        angle
                      </div>
                      <div
                        className="herb-display italic text-[20px] leading-none"
                        style={{ color: P.ink }}
                      >
                        {Math.round(angle)}°
                      </div>
                    </div>
                    <div>
                      <div
                        className="herb-mono text-[9px] tracking-[0.3em] uppercase"
                        style={{ color: P.inkSoft }}
                      >
                        folio
                      </div>
                      <div
                        className="herb-display italic text-[20px] leading-none"
                        style={{ color: P.rust }}
                      >
                        {String(specNum).padStart(3, '0')}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Handwritten annotation in sepia */}
                <div
                  className="herb-display italic text-[15px] mt-4 pl-4"
                  style={{
                    color: P.sepia,
                    borderLeft: `2px solid ${P.amber}`,
                  }}
                >
                  Collected from the digital grove on{' '}
                  {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  . Branching signature {angle > 40 ? 'expansive' : 'close-knit'},
                  stochasia held at {Math.round(randomness * 100)} percent.
                </div>
              </div>
            </SpecimenCard>

            {/* Footer colophon beneath specimen card */}
            <div
              className="mt-6 flex flex-wrap items-center justify-between gap-3 herb-mono text-[10px] tracking-[0.3em] uppercase"
              style={{ color: P.inkSoft }}
            >
              <span>Hortus Digitalis · est. MMXXVI</span>
              <span className="flex items-center gap-1.5">
                <LeafIcon size={10} style={{ color: P.forest }} />
                curated by Fezcodex
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractalFloraPage;
