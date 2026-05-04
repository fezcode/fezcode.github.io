import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  FeatherIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import CustomToggle from '../../components/CustomToggle';

const PRESETS = {
  YOU_DIED: {
    text: 'YOU DIED',
    textColor: '#7a0000',
    glowColor: '#ff1a1a',
    fontSize: 140,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 14,
    overlayOpacity: 0.65,
    italic: true,
    streakIntensity: 0.55,
    glowIntensity: 0.45,
    vignette: 0.5,
  },
  VICTORY_ACHIEVED: {
    text: 'VICTORY ACHIEVED',
    textColor: '#e6c66b',
    glowColor: '#ffcb4a',
    fontSize: 100,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 8,
    overlayOpacity: 0.55,
    italic: true,
    streakIntensity: 0.7,
    glowIntensity: 0.5,
    vignette: 0.45,
  },
  ENEMY_FELLED: {
    text: 'ENEMY FELLED',
    textColor: '#e6c66b',
    glowColor: '#ffcb4a',
    fontSize: 110,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 6,
    overlayOpacity: 0.5,
    italic: true,
    streakIntensity: 0.65,
    glowIntensity: 0.45,
    vignette: 0.4,
  },
  GREAT_ENEMY_FELLED: {
    text: 'GREAT ENEMY FELLED',
    textColor: '#f0d68c',
    glowColor: '#ffd866',
    fontSize: 96,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 6,
    overlayOpacity: 0.6,
    italic: true,
    streakIntensity: 0.85,
    glowIntensity: 0.6,
    vignette: 0.5,
  },
  HEIR_OF_FIRE_DESTROYED: {
    text: 'HEIR OF FIRE DESTROYED',
    textColor: '#f3dc8f',
    glowColor: '#ffd866',
    fontSize: 84,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 6,
    overlayOpacity: 0.65,
    italic: true,
    streakIntensity: 0.95,
    glowIntensity: 0.65,
    vignette: 0.55,
  },
  GREAT_SOUL_EMBRACED: {
    text: 'GREAT SOUL EMBRACED',
    textColor: '#f3dc8f',
    glowColor: '#ffd866',
    fontSize: 86,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 6,
    overlayOpacity: 0.6,
    italic: true,
    streakIntensity: 0.9,
    glowIntensity: 0.6,
    vignette: 0.5,
  },
  HUMANITY_RESTORED: {
    text: 'HUMANITY RESTORED',
    textColor: '#f5f1e0',
    glowColor: '#fff5cc',
    fontSize: 96,
    fontFamily: 'Cinzel',
    fontWeight: 400,
    letterSpacing: 8,
    overlayOpacity: 0.55,
    italic: true,
    streakIntensity: 0.6,
    glowIntensity: 0.5,
    vignette: 0.4,
  },
  BONFIRE_LIT: {
    text: 'BONFIRE LIT',
    textColor: '#ffb347',
    glowColor: '#ff8c00',
    fontSize: 110,
    fontFamily: 'Cinzel',
    fontWeight: 400,
    letterSpacing: 6,
    overlayOpacity: 0.5,
    italic: true,
    streakIntensity: 0.55,
    glowIntensity: 0.5,
    vignette: 0.45,
  },
  AREA_NAME: {
    text: 'ANOR LONDO',
    textColor: '#f0e6c8',
    glowColor: '#fff2b8',
    fontSize: 72,
    fontFamily: 'Cinzel',
    fontWeight: 400,
    letterSpacing: 14,
    overlayOpacity: 0.35,
    italic: false,
    streakIntensity: 0.35,
    glowIntensity: 0.3,
    vignette: 0.35,
  },
};

const FONT_OPTIONS = [
  { value: 'Cinzel', label: 'Cinzel (Souls)' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond' },
  { value: 'IM Fell English SC', label: 'IM Fell (Archaic)' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Arvo', label: 'Arvo' },
  { value: 'Instrument Serif', label: 'Instrument Serif' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'VT323', label: 'VT323 (Retro)' },
];

const PRESET_LABELS = {
  YOU_DIED: 'You Died',
  VICTORY_ACHIEVED: 'Victory Achieved',
  ENEMY_FELLED: 'Enemy Felled',
  GREAT_ENEMY_FELLED: 'Great Enemy Felled',
  HEIR_OF_FIRE_DESTROYED: 'Heir of Fire',
  GREAT_SOUL_EMBRACED: 'Great Soul',
  HUMANITY_RESTORED: 'Humanity Restored',
  BONFIRE_LIT: 'Bonfire Lit',
  AREA_NAME: 'Area Name',
};

const PRESET_TONES = {
  YOU_DIED: 'crimson',
  VICTORY_ACHIEVED: 'gold',
  ENEMY_FELLED: 'gold',
  GREAT_ENEMY_FELLED: 'gold',
  HEIR_OF_FIRE_DESTROYED: 'gold',
  GREAT_SOUL_EMBRACED: 'gold',
  HUMANITY_RESTORED: 'pale',
  BONFIRE_LIT: 'ember',
  AREA_NAME: 'pale',
};

const TONE_STYLES = {
  crimson: {
    border: 'rgba(178, 34, 34, 0.35)',
    text: '#c44a4a',
    hoverBorder: 'rgba(220, 70, 70, 0.7)',
    hoverBg: 'rgba(110, 13, 18, 0.18)',
    hoverText: '#ff7a7a',
  },
  gold: {
    border: 'rgba(176, 140, 79, 0.35)',
    text: '#b08c4f',
    hoverBorder: 'rgba(212, 175, 55, 0.75)',
    hoverBg: 'rgba(176, 140, 79, 0.10)',
    hoverText: '#e6c66b',
  },
  ember: {
    border: 'rgba(200, 132, 30, 0.40)',
    text: '#c8841e',
    hoverBorder: 'rgba(255, 179, 71, 0.75)',
    hoverBg: 'rgba(200, 132, 30, 0.10)',
    hoverText: '#ffb347',
  },
  pale: {
    border: 'rgba(216, 200, 154, 0.30)',
    text: '#d8c89a',
    hoverBorder: 'rgba(232, 220, 196, 0.65)',
    hoverBg: 'rgba(216, 200, 154, 0.08)',
    hoverText: '#f0e6c8',
  },
};

const ROMAN = ['I', 'II', 'III'];

const hexToRgba = (hex, alpha) => {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  const r = parseInt(full.substring(0, 2), 16);
  const g = parseInt(full.substring(2, 4), 16);
  const b = parseInt(full.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const NOISE_DATA_URL =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 0.85 0 0 0 0 0.55 0 0 0 0.7 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

const Fleuron = ({ className = '' }) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2c0 4-2 6-4 6 2 0 4 2 4 6 0-4 2-6 4-6-2 0-4-2-4-6Z"
      fill="currentColor"
      opacity="0.85"
    />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
    <path
      d="M12 14c0 4-2 6-4 6 2 0 4 2 4 6 0-4 2-6 4-6-2 0-4-2-4-6Z"
      transform="translate(0 -2)"
      fill="currentColor"
      opacity="0.6"
    />
  </svg>
);

const OrnamentDivider = ({ tone = '#b08c4f' }) => (
  <div
    className="flex items-center gap-4 w-full"
    style={{ color: tone }}
    aria-hidden="true"
  >
    <span
      className="flex-1 h-px"
      style={{
        background: `linear-gradient(to right, transparent, ${hexToRgba(tone, 0.7)}, transparent)`,
      }}
    />
    <Fleuron className="w-4 h-4 shrink-0" />
    <span
      className="flex-1 h-px"
      style={{
        background: `linear-gradient(to right, transparent, ${hexToRgba(tone, 0.7)}, transparent)`,
      }}
    />
  </div>
);

const COLOR_PALETTE = [
  '#7a0000',
  '#9d0a0a',
  '#c44a4a',
  '#ff1a1a',
  '#c8841e',
  '#ff8c00',
  '#ffb347',
  '#ffcb4a',
  '#b08c4f',
  '#d4af37',
  '#e6c66b',
  '#f3dc8f',
  '#ffd866',
  '#fff5cc',
  '#d8c89a',
  '#f0e6c8',
  '#f5f1e0',
  '#3a2a1a',
];

function GrimoireColorPicker({ label, value, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between">
        <span className="label-font text-[9px] text-[#b08c4f]/70">{label}</span>
        <span className="font-mono text-[10px] text-[#b08c4f]/80 tracking-widest uppercase">
          {value}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <label className="relative shrink-0 cursor-pointer">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label={`${label} custom hue`}
          />
          <span
            className="block w-11 h-11 transition-shadow"
            style={{
              background: value,
              boxShadow:
                '0 0 0 1px rgba(176, 140, 79, 0.55), inset 0 0 0 2px rgba(0, 0, 0, 0.6), 0 0 12px rgba(0, 0, 0, 0.6)',
            }}
            aria-hidden="true"
          />
        </label>
        <div className="grid grid-cols-9 gap-1 flex-1">
          {COLOR_PALETTE.map((c) => {
            const active = c.toLowerCase() === value.toLowerCase();
            return (
              <button
                key={c}
                type="button"
                onClick={() => onChange(c)}
                className="h-5 w-full transition-all"
                style={{
                  background: c,
                  boxShadow: active
                    ? '0 0 0 1px #fff5cc, 0 0 0 2px rgba(212, 175, 55, 0.6)'
                    : '0 0 0 1px rgba(176, 140, 79, 0.25)',
                }}
                aria-label={`Choose ${c}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function GrimoireSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
}) {
  const pct = Math.max(
    0,
    Math.min(100, ((value - min) / (max - min)) * 100),
  );
  const display = step < 1 ? Number(value).toFixed(2) : Math.round(value);

  return (
    <div className="grimoire-slider space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="label-font text-[9px] text-[#b08c4f]/70">{label}</span>
        <span className="font-mono text-[10px] text-[#e6c66b] tracking-wider">
          {display}
        </span>
      </div>
      <div className="gs-track-area relative h-5 flex items-center">
        <span className="gs-track" />
        <span className="gs-fill" style={{ width: `${pct}%` }} />
        <span className="gs-tick" style={{ left: '25%' }} />
        <span className="gs-tick" style={{ left: '50%' }} />
        <span className="gs-tick" style={{ left: '75%' }} />
        <span className="gs-thumb" style={{ left: `${pct}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="gs-input"
          aria-label={label}
        />
      </div>
    </div>
  );
}

function GrimoireDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div className="relative" ref={ref}>
      <span className="label-font text-[9px] text-[#b08c4f]/70 block mb-2">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 border-b border-[#b08c4f]/40 hover:border-[#d4af37] focus:border-[#d4af37] outline-none transition-colors py-2 group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span
          className="display-font italic text-lg text-[#f0e6c8] group-hover:text-[#fff5cc] transition-colors"
          style={{ fontFamily: `"${value}", serif` }}
        >
          {current?.label}
        </span>
        <span
          className="text-[#b08c4f] transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 5 L7 9 L11 5"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>
      {open && (
        <div
          className="absolute z-30 left-0 right-0 mt-1 bg-[#0a0807] border border-[#b08c4f]/40 max-h-72 overflow-y-auto shadow-[0_18px_40px_-10px_rgba(0,0,0,0.8)] grimoire-menu"
          role="listbox"
        >
          {options.map((opt) => {
            const active = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-base transition-colors text-left border-b border-[#b08c4f]/10 last:border-0 ${
                  active
                    ? 'bg-[#b08c4f]/10 text-[#e6c66b]'
                    : 'text-[#d8c89a]/75 hover:bg-[#b08c4f]/8 hover:text-[#fff5cc]'
                }`}
              >
                <span
                  className="italic"
                  style={{ fontFamily: `"${opt.value}", serif` }}
                >
                  {opt.label}
                </span>
                {active && (
                  <span
                    className="text-[#d4af37] text-xs"
                    aria-hidden="true"
                  >
                    ✦
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const CandleEmpty = () => (
  <svg viewBox="0 0 100 180" className="w-24 h-44" aria-hidden="true">
    <defs>
      <radialGradient id="flame-grad" cx="50%" cy="65%" r="55%">
        <stop offset="0%" stopColor="#fff7d6" />
        <stop offset="35%" stopColor="#ffd866" />
        <stop offset="70%" stopColor="#ffb347" />
        <stop offset="100%" stopColor="rgba(200,132,30,0)" />
      </radialGradient>
      <radialGradient id="halo-grad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="rgba(255,179,71,0.45)" />
        <stop offset="100%" stopColor="rgba(255,179,71,0)" />
      </radialGradient>
    </defs>
    <circle cx="50" cy="55" r="48" fill="url(#halo-grad)" className="halo">
      <animate
        attributeName="r"
        values="44;52;44"
        dur="4s"
        repeatCount="indefinite"
      />
    </circle>
    <rect x="42" y="80" width="16" height="80" fill="#1a140e" />
    <rect x="42" y="80" width="16" height="3" fill="#3a2a1a" />
    <path
      d="M42 90 Q39 96 42 102"
      stroke="#3a2a1a"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M58 96 Q61 102 58 108"
      stroke="#3a2a1a"
      strokeWidth="2"
      fill="none"
    />
    <line x1="50" y1="78" x2="50" y2="72" stroke="#1a140e" strokeWidth="1.5" />
    <g className="flame-flicker">
      <path
        d="M50 75 Q43 60 47 45 Q49 35 50 22 Q51 35 53 45 Q57 60 50 75 Z"
        fill="url(#flame-grad)"
      />
      <ellipse cx="50" cy="58" rx="2.5" ry="6" fill="#fff7d6" opacity="0.9" />
    </g>
  </svg>
);

function SoulsBannerGeneratorPage() {
  const { addToast } = useToast();
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  const initial = PRESETS.ENEMY_FELLED;

  const [text, setText] = useState(initial.text);
  const [fontSize, setFontSize] = useState(initial.fontSize);
  const [textColor, setTextColor] = useState(initial.textColor);
  const [glowColor, setGlowColor] = useState(initial.glowColor);
  const [overlayOpacity, setOverlayOpacity] = useState(initial.overlayOpacity);
  const [letterSpacing, setLetterSpacing] = useState(initial.letterSpacing);
  const [yOffset, setYOffset] = useState(50);
  const [showOverlay, setShowOverlay] = useState(true);
  const [fontFamily, setFontFamily] = useState(initial.fontFamily);
  const [fontWeight, setFontWeight] = useState(initial.fontWeight);
  const [italic, setItalic] = useState(initial.italic);
  const [streakIntensity, setStreakIntensity] = useState(initial.streakIntensity);
  const [glowIntensity, setGlowIntensity] = useState(initial.glowIntensity);
  const [vignette, setVignette] = useState(initial.vignette);
  const [activePreset, setActivePreset] = useState('ENEMY_FELLED');

  useEffect(() => {
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cinzel:ital,wght@0,400;0,700;0,900;1,400;1,700;1,900&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=IM+Fell+English+SC&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Arvo:wght@400;700&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&family=JetBrains+Mono:wght@300;400;700&family=VT323&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const embers = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        left: `${(i * 13.7) % 100}%`,
        size: 1.5 + (i % 3) * 0.8,
        delay: -(i * 1.9) % 22,
        duration: 16 + (i % 5) * 3,
        drift: (i % 2 === 0 ? 1 : -1) * (10 + (i % 4) * 8),
        opacity: 0.4 + ((i * 17) % 5) * 0.1,
      })),
    [],
  );

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const textX = canvas.width / 2;
      const textY = (canvas.height * yOffset) / 100;

      if (vignette > 0) {
        const vignetteRadius = Math.max(canvas.width, canvas.height) * 0.75;
        const vGrad = ctx.createRadialGradient(
          textX,
          textY,
          vignetteRadius * 0.35,
          textX,
          textY,
          vignetteRadius,
        );
        vGrad.addColorStop(0, 'rgba(0,0,0,0)');
        vGrad.addColorStop(1, `rgba(0,0,0,${vignette})`);
        ctx.fillStyle = vGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      if (showOverlay) {
        const bandHeight = fontSize * 3;
        const top = textY - bandHeight / 2;
        const grad = ctx.createLinearGradient(0, top, 0, top + bandHeight);
        grad.addColorStop(0, 'rgba(0,0,0,0)');
        grad.addColorStop(0.18, `rgba(0,0,0,${overlayOpacity * 0.85})`);
        grad.addColorStop(0.5, `rgba(0,0,0,${overlayOpacity})`);
        grad.addColorStop(0.82, `rgba(0,0,0,${overlayOpacity * 0.85})`);
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, top, canvas.width, bandHeight);
      }

      if (glowIntensity > 0) {
        const haloRadius = fontSize * 6;
        const halo = ctx.createRadialGradient(
          textX,
          textY,
          0,
          textX,
          textY,
          haloRadius,
        );
        halo.addColorStop(0, hexToRgba(glowColor, glowIntensity * 0.85));
        halo.addColorStop(0.35, hexToRgba(glowColor, glowIntensity * 0.35));
        halo.addColorStop(1, hexToRgba(glowColor, 0));
        ctx.fillStyle = halo;
        ctx.fillRect(0, textY - haloRadius, canvas.width, haloRadius * 2);
      }

      if (streakIntensity > 0) {
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';

        const coreGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        coreGrad.addColorStop(0, 'rgba(0,0,0,0)');
        coreGrad.addColorStop(0.18, hexToRgba(glowColor, 0));
        coreGrad.addColorStop(0.42, hexToRgba(glowColor, streakIntensity * 0.6));
        coreGrad.addColorStop(0.5, hexToRgba(glowColor, streakIntensity));
        coreGrad.addColorStop(0.58, hexToRgba(glowColor, streakIntensity * 0.6));
        coreGrad.addColorStop(0.82, hexToRgba(glowColor, 0));
        coreGrad.addColorStop(1, 'rgba(0,0,0,0)');

        const coreH = Math.max(2, fontSize * 0.04);
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, textY - coreH / 2, canvas.width, coreH);

        const bloomGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        bloomGrad.addColorStop(0, 'rgba(0,0,0,0)');
        bloomGrad.addColorStop(
          0.5,
          hexToRgba(glowColor, streakIntensity * 0.35),
        );
        bloomGrad.addColorStop(1, 'rgba(0,0,0,0)');

        const bloomH = fontSize * 0.6;
        ctx.fillStyle = bloomGrad;
        ctx.fillRect(0, textY - bloomH / 2, canvas.width, bloomH);

        const sideOffset = fontSize * 0.45;
        const sideGrad = ctx.createLinearGradient(0, 0, canvas.width, 0);
        sideGrad.addColorStop(0, 'rgba(0,0,0,0)');
        sideGrad.addColorStop(
          0.5,
          hexToRgba(glowColor, streakIntensity * 0.25),
        );
        sideGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sideGrad;
        ctx.fillRect(0, textY - sideOffset, canvas.width, 1);
        ctx.fillRect(0, textY + sideOffset, canvas.width, 1);

        ctx.restore();
      }

      ctx.save();
      const fontStyle = italic ? 'italic' : 'normal';
      ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px "${fontFamily}", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const drawSpacedText = () => {
        if (letterSpacing > 0) {
          const totalWidth =
            ctx.measureText(text).width + (text.length - 1) * letterSpacing;
          let currentX = textX - totalWidth / 2;
          for (let i = 0; i < text.length; i++) {
            const ch = text[i];
            const w = ctx.measureText(ch).width;
            ctx.fillText(ch, currentX + w / 2, textY);
            currentX += w + letterSpacing;
          }
        } else {
          ctx.fillText(text, textX, textY);
        }
      };

      ctx.fillStyle = hexToRgba(glowColor, 0.9);
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = Math.max(30, fontSize * 0.6);
      drawSpacedText();

      ctx.shadowBlur = Math.max(14, fontSize * 0.25);
      drawSpacedText();

      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, fontSize * 0.012);
      ctx.strokeStyle = 'rgba(0,0,0,0.55)';
      if (letterSpacing > 0) {
        const totalWidth =
          ctx.measureText(text).width + (text.length - 1) * letterSpacing;
        let currentX = textX - totalWidth / 2;
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          const w = ctx.measureText(ch).width;
          ctx.strokeText(ch, currentX + w / 2, textY);
          currentX += w + letterSpacing;
        }
      } else {
        ctx.strokeText(text, textX, textY);
      }

      ctx.fillStyle = textColor;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = Math.max(6, fontSize * 0.1);
      drawSpacedText();

      ctx.restore();
    };
  }, [
    image,
    text,
    fontSize,
    textColor,
    glowColor,
    overlayOpacity,
    yOffset,
    showOverlay,
    letterSpacing,
    fontFamily,
    fontWeight,
    italic,
    streakIntensity,
    glowIntensity,
    vignette,
  ]);

  useEffect(() => {
    drawCanvas();
    document.fonts.ready.then(drawCanvas);
  }, [drawCanvas]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `dark-souls-banner-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      addToast({
        title: 'Sealed',
        message: 'Banner inscribed and preserved.',
        type: 'success',
      });
    }
  };

  const applyPreset = (key) => {
    const p = PRESETS[key];
    setText(p.text);
    setTextColor(p.textColor);
    setGlowColor(p.glowColor);
    setFontSize(p.fontSize);
    setFontFamily(p.fontFamily);
    setFontWeight(p.fontWeight);
    setLetterSpacing(p.letterSpacing);
    setOverlayOpacity(p.overlayOpacity);
    setItalic(p.italic);
    setStreakIntensity(p.streakIntensity);
    setGlowIntensity(p.glowIntensity);
    setVignette(p.vignette);
    setActivePreset(key);
  };

  return (
    <div className="souls-banner-root relative min-h-screen text-[#d8c89a] selection:bg-[#6e0d12] selection:text-[#f0e6c8] overflow-hidden">
      <Seo
        title="Dark Souls Banner Generator | Fezcodex"
        description="Inscribe Dark Souls style banners — YOU DIED, VICTORY ACHIEVED, BONFIRE LIT, HEIR OF FIRE DESTROYED — with the signature horizontal light streaks and ornate glow."
        keywords={[
          'dark souls',
          'you died',
          'victory achieved',
          'bonfire lit',
          'banner generator',
          'meme',
          'image editor',
        ]}
      />

      <style>{`
        .souls-banner-root {
          background:
            radial-gradient(ellipse at 12% 8%, rgba(200, 132, 30, 0.08), transparent 45%),
            radial-gradient(ellipse at 88% 92%, rgba(110, 13, 18, 0.10), transparent 50%),
            radial-gradient(ellipse at 50% 50%, #0d0a08 0%, #050403 100%);
          font-family: 'Cormorant Garamond', 'Cormorant', Georgia, serif;
        }
        .grain-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: ${NOISE_DATA_URL};
          background-size: 220px 220px;
          opacity: 0.06;
          mix-blend-mode: overlay;
        }
        .vignette-layer {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%);
        }
        .ember {
          position: absolute;
          bottom: -10px;
          width: 3px; height: 3px;
          border-radius: 50%;
          background: #ffb347;
          box-shadow: 0 0 6px rgba(255, 179, 71, 0.9), 0 0 14px rgba(255, 140, 0, 0.5);
          animation: ember-rise linear infinite;
          pointer-events: none;
        }
        @keyframes ember-rise {
          0% { transform: translate3d(0, 0, 0) scale(1); opacity: 0; }
          8% { opacity: 1; }
          90% { opacity: 0.9; }
          100% { transform: translate3d(var(--drift, 20px), -110vh, 0) scale(0.6); opacity: 0; }
        }
        @keyframes flame-flicker {
          0%, 100% { transform: scale(1, 1) translateY(0); opacity: 1; }
          25% { transform: scale(0.96, 1.06) translateY(-1px); opacity: 0.92; }
          50% { transform: scale(1.04, 0.95) translateY(1px); opacity: 1; }
          75% { transform: scale(0.98, 1.03) translateY(0); opacity: 0.95; }
        }
        .flame-flicker {
          transform-origin: 50px 75px;
          animation: flame-flicker 1.6s ease-in-out infinite;
          filter: drop-shadow(0 0 12px rgba(255, 179, 71, 0.55));
        }
        @keyframes reveal {
          from { opacity: 0; transform: translateY(14px); filter: blur(4px); }
          to { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .reveal {
          animation: reveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        @keyframes hairline-grow {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
        .hairline-grow {
          transform-origin: left;
          animation: hairline-grow 1.4s cubic-bezier(0.22, 1, 0.36, 1) backwards;
        }
        .display-font {
          font-family: 'IM Fell English SC', 'Cormorant Unicase', Georgia, serif;
          letter-spacing: 0.02em;
        }
        .body-font {
          font-family: 'Cormorant Garamond', Georgia, serif;
        }
        .label-font {
          font-family: 'JetBrains Mono', 'Space Mono', monospace;
          letter-spacing: 0.32em;
        }
        .gold-text {
          background: linear-gradient(180deg, #f3dc8f 0%, #b08c4f 55%, #6e4f1f 100%);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
        .gold-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(176, 140, 79, 0.55) 20%, rgba(212, 175, 55, 0.7) 50%, rgba(176, 140, 79, 0.55) 80%, transparent);
        }
        .corner-mark::before, .corner-mark::after {
          content: ''; position: absolute; width: 16px; height: 16px;
          border-color: rgba(176, 140, 79, 0.55);
          border-style: solid; border-width: 0;
        }
        .corner-mark.tl::before { top: -1px; left: -1px; border-top-width: 1px; border-left-width: 1px; }
        .corner-mark.tr::before { top: -1px; right: -1px; border-top-width: 1px; border-right-width: 1px; }
        .corner-mark.bl::after { bottom: -1px; left: -1px; border-bottom-width: 1px; border-left-width: 1px; }
        .corner-mark.br::after { bottom: -1px; right: -1px; border-bottom-width: 1px; border-right-width: 1px; }
        .corner-frame { position: relative; }
        .corner-frame::before, .corner-frame::after,
        .corner-frame > .cf-tr, .corner-frame > .cf-br {
          content: ''; position: absolute; width: 22px; height: 22px;
          border: 1px solid rgba(176, 140, 79, 0.55);
          pointer-events: none;
        }
        .corner-frame::before { top: -1px; left: -1px; border-right: 0; border-bottom: 0; }
        .corner-frame::after { bottom: -1px; left: -1px; border-right: 0; border-top: 0; }
        .corner-frame > .cf-tr { top: -1px; right: -1px; border-left: 0; border-bottom: 0; }
        .corner-frame > .cf-br { bottom: -1px; right: -1px; border-left: 0; border-top: 0; }

        .archaic-input {
          background: transparent;
          border: none;
          border-bottom: 1px solid rgba(176, 140, 79, 0.4);
          color: #f0e6c8;
          font-family: 'IM Fell English SC', 'Cormorant Garamond', serif;
          letter-spacing: 0.18em;
          font-size: 1.25rem;
          padding: 0.5rem 0;
          outline: none;
          width: 100%;
          transition: border-color 0.3s ease, color 0.3s ease;
        }
        .archaic-input:focus {
          border-bottom-color: rgba(212, 175, 55, 0.95);
          color: #fff5cc;
        }

        .upload-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 1rem;
          padding: 1rem 2rem 1rem 1.4rem;
          background: linear-gradient(180deg, rgba(20, 14, 9, 0.6), rgba(8, 6, 4, 0.6));
          border: 1px solid rgba(176, 140, 79, 0.55);
          color: #e6c66b;
          font-family: 'IM Fell English SC', serif;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-size: 0.78rem;
          cursor: pointer;
          overflow: hidden;
          transition: color 0.4s ease, border-color 0.4s ease, transform 0.3s ease;
        }
        .upload-cta::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at left, rgba(255, 179, 71, 0.18), transparent 65%);
          opacity: 0; transition: opacity 0.4s ease;
        }
        .upload-cta:hover {
          color: #fff5cc;
          border-color: rgba(212, 175, 55, 0.9);
          transform: translateY(-1px);
        }
        .upload-cta:hover::before { opacity: 1; }
        .upload-cta .cap {
          font-size: 1.6rem; line-height: 1;
          color: #d4af37;
          font-family: 'IM Fell English SC', serif;
          padding-right: 0.85rem;
          border-right: 1px solid rgba(176, 140, 79, 0.4);
        }

        .seal-cta {
          position: relative;
          display: inline-flex; align-items: center; gap: 0.85rem;
          padding: 1rem 2.2rem;
          background: linear-gradient(180deg, #2a1c0d, #150d05);
          border: 1px solid rgba(212, 175, 55, 0.7);
          color: #f3dc8f;
          font-family: 'IM Fell English SC', serif;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          font-size: 0.78rem;
          cursor: pointer;
          transition: all 0.4s ease;
        }
        .seal-cta:hover {
          background: linear-gradient(180deg, #3a2814, #1f1308);
          color: #fff5cc;
          box-shadow: 0 0 24px rgba(255, 179, 71, 0.25);
        }

        .preset-stamp {
          position: relative;
          padding: 0.85rem 0.6rem;
          border: 1px solid var(--stamp-border);
          color: var(--stamp-text);
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 0.92rem;
          letter-spacing: 0.05em;
          text-align: center;
          cursor: pointer;
          transition: all 0.35s ease;
          background: transparent;
        }
        .preset-stamp::after {
          content: '';
          position: absolute; left: 50%; bottom: 6px;
          transform: translateX(-50%);
          width: 24px; height: 1px;
          background: var(--stamp-text);
          opacity: 0;
          transition: opacity 0.35s ease, width 0.35s ease;
        }
        .preset-stamp:hover {
          border-color: var(--stamp-hover-border);
          background: var(--stamp-hover-bg);
          color: var(--stamp-hover-text);
        }
        .preset-stamp:hover::after { opacity: 0.7; width: 36px; }
        .preset-stamp.active {
          border-color: var(--stamp-hover-border);
          background: var(--stamp-hover-bg);
          color: var(--stamp-hover-text);
        }
        .preset-stamp.active::after { opacity: 1; width: 36px; }

        .running-header {
          position: fixed; top: 1.25rem; left: 50%; transform: translateX(-50%);
          z-index: 5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 0.42em;
          color: rgba(176, 140, 79, 0.55);
          text-transform: uppercase;
        }
        .folio-mark {
          position: fixed; top: 1.25rem; right: 1.5rem;
          z-index: 5;
          font-family: 'IM Fell English SC', serif;
          font-size: 0.85rem;
          color: rgba(176, 140, 79, 0.7);
          letter-spacing: 0.18em;
        }
        .folio-mark-l {
          position: fixed; top: 1.25rem; left: 1.5rem;
          z-index: 5;
          font-family: 'JetBrains Mono', monospace;
          font-size: 0.6rem;
          color: rgba(176, 140, 79, 0.5);
          letter-spacing: 0.3em;
        }
        .footer-mark {
          font-family: 'IM Fell English SC', serif;
          font-size: 0.75rem;
          letter-spacing: 0.32em;
          color: rgba(176, 140, 79, 0.5);
          text-transform: uppercase;
        }

        .roman {
          font-family: 'IM Fell English SC', serif;
          font-size: 2.6rem;
          line-height: 1;
          background: linear-gradient(180deg, #d4af37, #6e4f1f);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        @keyframes menu-enter {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .grimoire-menu {
          animation: menu-enter 0.22s cubic-bezier(0.22, 1, 0.36, 1) backwards;
          scrollbar-width: thin;
          scrollbar-color: rgba(176, 140, 79, 0.4) transparent;
        }
        .grimoire-menu::-webkit-scrollbar { width: 6px; }
        .grimoire-menu::-webkit-scrollbar-track { background: transparent; }
        .grimoire-menu::-webkit-scrollbar-thumb {
          background: rgba(176, 140, 79, 0.35);
        }
        .grimoire-menu::-webkit-scrollbar-thumb:hover {
          background: rgba(212, 175, 55, 0.6);
        }

        input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
        input[type="color"]::-webkit-color-swatch { border: none; }

        .grimoire-slider .gs-track {
          position: absolute; left: 0; right: 0; top: 50%;
          height: 1px;
          background: rgba(176, 140, 79, 0.22);
          transform: translateY(-50%);
          pointer-events: none;
        }
        .grimoire-slider .gs-fill {
          position: absolute; left: 0; top: 50%;
          height: 1px;
          background: linear-gradient(to right, rgba(176, 140, 79, 0.55), #d4af37);
          transform: translateY(-50%);
          pointer-events: none;
          transition: box-shadow 0.3s ease;
        }
        .grimoire-slider:hover .gs-fill,
        .grimoire-slider:focus-within .gs-fill {
          box-shadow: 0 0 8px rgba(255, 179, 71, 0.55);
        }
        .grimoire-slider .gs-tick {
          position: absolute; top: 50%;
          width: 1px; height: 6px;
          background: rgba(176, 140, 79, 0.28);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }
        .grimoire-slider .gs-thumb {
          position: absolute; top: 50%;
          width: 10px; height: 10px;
          background: #1a140e;
          border: 1px solid #d4af37;
          transform: translate(-50%, -50%) rotate(45deg);
          transition: box-shadow 0.3s ease, border-color 0.3s ease, background 0.3s ease, width 0.2s ease, height 0.2s ease;
          pointer-events: none;
          z-index: 2;
        }
        .grimoire-slider:hover .gs-thumb,
        .grimoire-slider:focus-within .gs-thumb {
          box-shadow: 0 0 14px rgba(255, 179, 71, 0.7), 0 0 2px rgba(255, 179, 71, 0.9);
          border-color: #ffd866;
          background: #2a1c0d;
        }
        .grimoire-slider:active .gs-thumb {
          width: 12px; height: 12px;
          background: #3a2814;
        }
        .grimoire-slider .gs-input {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          margin: 0;
          opacity: 0;
          cursor: pointer;
          z-index: 3;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }
        .grimoire-slider .gs-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px; height: 22px;
          background: transparent;
          cursor: pointer;
        }
        .grimoire-slider .gs-input::-moz-range-thumb {
          width: 22px; height: 22px;
          background: transparent;
          border: none;
          cursor: pointer;
        }
      `}</style>

      <div className="grain-layer" />
      <div className="vignette-layer" />

      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {embers.map((e, i) => (
          <span
            key={i}
            className="ember"
            style={{
              left: e.left,
              width: `${e.size}px`,
              height: `${e.size}px`,
              animationDelay: `${e.delay}s`,
              animationDuration: `${e.duration}s`,
              opacity: e.opacity,
              '--drift': `${e.drift}px`,
            }}
          />
        ))}
      </div>

      <div className="folio-mark-l">FOL. I — CODEX</div>
      <div className="running-header">⁘ Codex of Kindled Inscriptions ⁘</div>
      <div className="folio-mark">✦</div>

      <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-24 pb-16 md:px-12">
        <Link
          to="/apps"
          className="inline-flex items-center gap-2 mb-12 text-[10px] label-font text-[#b08c4f]/70 hover:text-[#e6c66b] transition-colors"
        >
          <ArrowLeftIcon weight="bold" size={11} />
          <span>Return to Apps</span>
        </Link>

        <header className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
            <div className="lg:col-span-8 space-y-7">
              <div
                className="reveal label-font text-[10px] text-[#b08c4f]/80"
                style={{ animationDelay: '0.05s' }}
              >
                Liber I · Tractatus de Vexillis
              </div>

              <h1
                className="display-font reveal leading-[0.95] tracking-tight"
                style={{ animationDelay: '0.15s' }}
              >
                <span className="block text-[clamp(3rem,8vw,7.5rem)] gold-text">
                  Banner of the
                </span>
                <span className="block text-[clamp(3rem,8vw,7.5rem)] italic body-font font-light text-[#f0e6c8] -mt-2">
                  Hollow
                </span>
              </h1>

              <div
                className="reveal flex items-center gap-4 max-w-md"
                style={{ animationDelay: '0.3s' }}
              >
                <span className="label-font text-[9px] text-[#b08c4f]/70 whitespace-nowrap">
                  Dark Souls Banner Generator
                </span>
                <span className="hairline-grow flex-1 h-px bg-[#b08c4f]/40" />
              </div>

              <p
                className="reveal body-font italic text-lg md:text-xl text-[#d8c89a]/75 max-w-xl leading-relaxed"
                style={{ animationDelay: '0.45s' }}
              >
                "The flow of time itself is convoluted; with heroes centuries
                old phasing in and out."
                <span className="block mt-2 not-italic text-xs label-font text-[#b08c4f]/60 tracking-[0.4em]">
                  — Hawkeye Gough
                </span>
              </p>
            </div>

            <div
              className="lg:col-span-4 reveal flex justify-start lg:justify-end"
              style={{ animationDelay: '0.6s' }}
            >
              <label htmlFor="image-upload" className="upload-cta">
                <span className="cap">℣</span>
                <span className="flex flex-col items-start gap-1">
                  <span>Inscribe Vellum</span>
                  <span className="text-[9px] tracking-[0.4em] text-[#b08c4f]/70 normal-case">
                    upload an effigy
                  </span>
                </span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div
            className="reveal mt-14"
            style={{ animationDelay: '0.75s' }}
          >
            <OrnamentDivider />
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-x-14 gap-y-16">
          <aside className="lg:col-span-5 space-y-16 h-fit lg:sticky lg:top-12">
            <section
              className="reveal space-y-6"
              style={{ animationDelay: '0.85s' }}
            >
              <div className="flex items-baseline gap-5">
                <span className="roman">{ROMAN[0]}</span>
                <div>
                  <h2 className="display-font text-2xl text-[#f0e6c8]">
                    Inscription
                  </h2>
                  <p className="label-font text-[9px] text-[#b08c4f]/70 mt-1">
                    Manus · Verbum · Forma
                  </p>
                </div>
              </div>
              <div className="gold-rule" />

              <div className="space-y-7 pl-2">
                <div className="space-y-2">
                  <label className="label-font text-[9px] text-[#b08c4f]/70 block">
                    Verbum
                  </label>
                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value.toUpperCase())}
                    className="archaic-input"
                  />
                </div>

                <GrimoireDropdown
                  label="Typeform"
                  options={FONT_OPTIONS}
                  value={fontFamily}
                  onChange={setFontFamily}
                />

                <GrimoireSlider
                  label="Weight"
                  min={100}
                  max={900}
                  step={100}
                  value={fontWeight}
                  onChange={(val) => setFontWeight(val)}
                />
                <GrimoireSlider
                  label="Stature"
                  min={20}
                  max={400}
                  value={fontSize}
                  onChange={(val) => setFontSize(val)}
                />
                <GrimoireSlider
                  label="Tracking"
                  min={0}
                  max={50}
                  value={letterSpacing}
                  onChange={(val) => setLetterSpacing(val)}
                />
                <GrimoireSlider
                  label="Elevation"
                  min={0}
                  max={100}
                  value={yOffset}
                  onChange={(val) => setYOffset(val)}
                />
                <div className="flex items-center justify-between pt-1">
                  <span className="label-font text-[9px] text-[#b08c4f]/70">
                    Slanted (italic)
                  </span>
                  <CustomToggle
                    variant="brutalist"
                    checked={italic}
                    onChange={() => setItalic(!italic)}
                  />
                </div>
              </div>
            </section>

            <section
              className="reveal space-y-6"
              style={{ animationDelay: '0.95s' }}
            >
              <div className="flex items-baseline gap-5">
                <span className="roman">{ROMAN[1]}</span>
                <div>
                  <h2 className="display-font text-2xl text-[#f0e6c8]">
                    Sigils
                  </h2>
                  <p className="label-font text-[9px] text-[#b08c4f]/70 mt-1">
                    Stamped & Calibrated
                  </p>
                </div>
              </div>
              <div className="gold-rule" />

              <div className="grid grid-cols-3 gap-2 pl-2">
                {Object.keys(PRESETS).map((key) => {
                  const tone = TONE_STYLES[PRESET_TONES[key]];
                  return (
                    <button
                      key={key}
                      onClick={() => applyPreset(key)}
                      className={`preset-stamp ${activePreset === key ? 'active' : ''}`}
                      style={{
                        '--stamp-border': tone.border,
                        '--stamp-text': tone.text,
                        '--stamp-hover-border': tone.hoverBorder,
                        '--stamp-hover-bg': tone.hoverBg,
                        '--stamp-hover-text': tone.hoverText,
                      }}
                    >
                      {PRESET_LABELS[key]}
                    </button>
                  );
                })}
              </div>
            </section>

            <section
              className="reveal space-y-6"
              style={{ animationDelay: '1.05s' }}
            >
              <div className="flex items-baseline gap-5">
                <span className="roman">{ROMAN[2]}</span>
                <div>
                  <h2 className="display-font text-2xl text-[#f0e6c8]">
                    Embers & Shadow
                  </h2>
                  <p className="label-font text-[9px] text-[#b08c4f]/70 mt-1">
                    Lumen · Halitus · Tenebrae
                  </p>
                </div>
              </div>
              <div className="gold-rule" />

              <div className="space-y-7 pl-2">
                <div className="grid grid-cols-1 gap-6">
                  <GrimoireColorPicker
                    label="Hue of Letters"
                    value={textColor}
                    onChange={setTextColor}
                  />
                  <GrimoireColorPicker
                    label="Hue of Glow"
                    value={glowColor}
                    onChange={setGlowColor}
                  />
                </div>

                <div className="pt-2 border-t border-[#b08c4f]/15 space-y-6">
                  <GrimoireSlider
                    label="Veil Opacity"
                    min={0}
                    max={1}
                    step={0.05}
                    value={overlayOpacity}
                    onChange={(val) => setOverlayOpacity(val)}
                  />
                  <GrimoireSlider
                    label="Light Streak"
                    min={0}
                    max={1}
                    step={0.05}
                    value={streakIntensity}
                    onChange={(val) => setStreakIntensity(val)}
                  />
                  <GrimoireSlider
                    label="Radial Halo"
                    min={0}
                    max={1}
                    step={0.05}
                    value={glowIntensity}
                    onChange={(val) => setGlowIntensity(val)}
                  />
                  <GrimoireSlider
                    label="Penumbra"
                    min={0}
                    max={1}
                    step={0.05}
                    value={vignette}
                    onChange={(val) => setVignette(val)}
                  />
                  <div className="flex items-center justify-between">
                    <span className="label-font text-[9px] text-[#b08c4f]/70">
                      Show veil band
                    </span>
                    <CustomToggle
                      variant="brutalist"
                      checked={showOverlay}
                      onChange={() => setShowOverlay(!showOverlay)}
                    />
                  </div>
                </div>
              </div>
            </section>
          </aside>

          <section
            className="lg:col-span-7 reveal"
            style={{ animationDelay: '1.15s' }}
          >
            <div className="flex items-baseline justify-between mb-5">
              <div className="label-font text-[9px] text-[#b08c4f]/70">
                Folio · Effigy
              </div>
              <div className="display-font text-[10px] text-[#b08c4f]/60 tracking-[0.4em]">
                {image ? 'KINDLED' : 'AWAITING EFFIGY'}
              </div>
            </div>

            <div className="corner-frame relative bg-black/55 p-5 backdrop-blur-[1px]">
              <span className="cf-tr" />
              <span className="cf-br" />

              {image ? (
                <div className="flex flex-col items-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto block"
                    style={{
                      boxShadow:
                        '0 0 0 1px rgba(176, 140, 79, 0.35), 0 30px 60px -20px rgba(0,0,0,0.9)',
                    }}
                  />
                </div>
              ) : (
                <div className="aspect-video w-full flex flex-col items-center justify-center text-center gap-6 bg-[#050403] border border-dashed border-[#b08c4f]/25 relative">
                  <div className="absolute inset-0 pointer-events-none opacity-30"
                    style={{
                      background:
                        'radial-gradient(ellipse at 50% 60%, rgba(255, 179, 71, 0.18), transparent 55%)',
                    }}
                  />
                  <CandleEmpty />
                  <div className="space-y-2 relative">
                    <div className="display-font text-2xl text-[#f0e6c8] tracking-wider">
                      Awaiting Effigy
                    </div>
                    <div className="body-font italic text-sm text-[#d8c89a]/60 max-w-sm">
                      Upload an image to kindle the bonfire and inscribe thy
                      banner.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {image && (
              <div className="mt-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="space-y-1">
                  <div className="label-font text-[9px] text-[#b08c4f]/70">
                    Inscription Preview
                  </div>
                  <div className="display-font italic text-xl text-[#f0e6c8]">
                    {text}
                  </div>
                </div>
                <button onClick={handleDownload} className="seal-cta">
                  <FeatherIcon weight="duotone" size={16} />
                  <span>Seal Banner</span>
                  <DownloadSimpleIcon weight="bold" size={14} />
                </button>
              </div>
            )}
          </section>
        </main>

        <footer className="mt-32 pt-10 border-t border-[#b08c4f]/15 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="footer-mark">⁘ Editio Prima · Anno MMXXVI ⁘</div>
          <div className="label-font text-[9px] text-[#b08c4f]/50">
            Mucked from the ashes of Lordran
          </div>
        </footer>
      </div>
    </div>
  );
}

export default SoulsBannerGeneratorPage;
