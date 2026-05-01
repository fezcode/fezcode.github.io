import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  MagnifyingGlassIcon,
  ShuffleIcon,
  CaretDownIcon,
} from '@phosphor-icons/react';
import Seo from '../../../components/Seo';
import { useToast } from '../../../hooks/useToast';
import { themeRenderers } from './themes';

// ─── ATELIER :: app-shell design language ───────────────────────────────
const PALETTE = {
  wall: '#E4D9D6',
  wallSoft: '#EDE4E1',
  card: '#F5EFEC',
  cardSoft: '#EEE7E2',
  rule: '#C7B8B4',
  ink: '#2D1F2E',
  inkSoft: '#6B5A65',
  jade: '#3F7D6B',
  jadeDeep: '#2E5E50',
  ochre: '#C68F3F',
  gilt: '#B89968',
};

const RADIUS = 8;

const THEME_OPTIONS = [
  { value: 'modern', label: 'Modern Stack' },
  { value: 'brutalist', label: 'Brutalist CLI' },
  { value: 'minimal', label: 'Minimal Glass' },
  { value: 'retro', label: 'Retro Terminal' },
  { value: 'blueprint', label: 'Blueprint CAD' },
  { value: 'neon', label: 'Neon Cyber' },
  { value: 'swiss', label: 'Swiss Grid' },
  { value: 'japanese', label: 'Japanese Pop' },
  { value: 'gameboy', label: 'Retro Handheld' },
  { value: 'vaporwave', label: 'Vaporwave Aesthetic' },
  { value: 'noir', label: 'Noir Cinema' },
  { value: 'clay', label: 'Playful Clay' },
  { value: 'prismatic', label: 'Prismatic Haze' },
  { value: 'cyberpunk', label: 'Cyberpunk 2077' },
  { value: 'sketch', label: 'Hand Drawn' },
  { value: 'bauhaus', label: 'Bauhaus Geo' },
  { value: 'popart', label: 'Pop Art Comic' },
  { value: 'cod', label: 'Tactical Ops' },
  { value: 'crtAmber', label: 'Retro Amber CRT' },
  { value: 'gta', label: 'Grand Theft Auto' },
  { value: 'rich', label: 'Luxury Gold' },
  { value: 'abstract', label: 'Abstract Shapes' },
  { value: 'nature', label: 'Nature Vibes' },
  { value: 'graphicNovel', label: 'Sin City Style' },
  { value: 'win95', label: 'Retro Windows 95' },
  { value: 'minimalDark', label: 'Minimal Dark' },
  { value: 'gradient', label: 'Gradient Mesh' },
  { value: 'comic', label: 'Comic Book' },
  { value: 'cybernetic', label: 'Cybernetic HUD' },
  { value: 'neoBrutalist', label: 'Neo Brutalist' },
  { value: 'quantumOverlay', label: 'Quantum Overlay' },
  { value: 'terminalPro', label: 'Terminal Pro CLI' },
  { value: 'neonVapor', label: 'Neon Vaporwave' },
  { value: 'cadTech', label: 'CAD Technical' },
  { value: 'retroDos', label: 'Retro DOS Shell' },
  { value: 'darkMedieval', label: 'Dark Medieval' },
  { value: 'tacticalMap', label: 'Tactical Map' },
  { value: 'modernEdge', label: 'Modern Edge' },
  { value: 'auroraWave', label: 'Aurora Wave' },
  { value: 'newspaper', label: 'Newsprint Herald' },
  { value: 'postModern', label: 'Post-Modern Artsy' },
  { value: 'topographic', label: 'Topographic Survey' },
  { value: 'starChart', label: 'Stellar Chart' },
  { value: 'sonarPing', label: 'Sonar Ping' },
  { value: 'macosGlass', label: 'macOS Glass' },
  { value: 'aeroGlass', label: 'Aero Glass 7' },
  { value: 'circlesBg', label: 'Circles Background' },
  { value: 'cassetteJCard', label: 'Cassette J-Card' },
  { value: 'modernNature', label: 'Modern Nature' },
  { value: 'splitFlap', label: 'Split-Flap Board' },
  { value: 'passportStamp', label: 'Passport Stamp' },
  { value: 'vinylRecord', label: 'Vinyl Record' },
  { value: 'hauteCouture', label: 'Haute Couture' },
  { value: 'missionControl', label: 'Mission Control' },
  { value: 'etherealGlow', label: 'Ethereal Glow' },
  { value: 'boldMinimal', label: 'Classified Document' },
  { value: 'luxe', label: 'Luxe Art' },
  { value: 'urbanRogue', label: 'Urban Rogue' },
  { value: 'newModernAbstract', label: 'New Modern Abstract' },
  { value: 'cubic', label: 'Cubic Blocks' },
  { value: 'darkDeco', label: 'Dark Art Deco' },
  { value: 'artNouveau', label: 'Art Nouveau' },
  { value: 'cyberGlitch', label: 'Cyber Glitch' },
  { value: 'stellarMap', label: 'Stellar Map' },
  { value: 'jungle', label: 'Jungle Vines' },
  { value: 'dithered', label: 'Retro Dithered' },
  { value: 'abstractNonsense', label: 'Abstract Nonsense' },
  { value: 'needForSpeed', label: 'Need For Speed' },
  { value: 'terracotta', label: 'Terracotta Plate' },
  { value: 'atelierGallery', label: 'Atelier Gallery' },
  { value: 'risoPrint', label: 'Riso Print' },
  { value: 'heraldic', label: 'Heraldic Crest' },
  { value: 'royalBanner', label: 'Royal Banner' },
  { value: 'stainedGlass', label: 'Stained Glass' },
  { value: 'constructivist', label: 'Constructivist' },
  { value: 'tarotCard', label: 'Tarot Card' },
  { value: 'illuminatedManuscript', label: 'Illuminated Manuscript' },
  { value: 'charon', label: 'Charon Editorial' },
  { value: 'macMiller', label: 'Mac Miller — Swimming in Circles' },
  { value: 'squarified', label: 'Squarified Treemap' },
];

const PALETTE_BANK = [
  ['#6366f1', '#ec4899', '#0f172a'],
  ['#3F7D6B', '#C68F3F', '#F5EFEC'],
  ['#FFB020', '#EF4444', '#1C1917'],
  ['#22D3EE', '#A78BFA', '#0B1020'],
  ['#34D399', '#FDE047', '#052E16'],
  ['#F97316', '#FACC15', '#27272A'],
  ['#E879F9', '#38BDF8', '#0F0B1E'],
  ['#F5F5F5', '#EF4444', '#0A0A0A'],
  ['#D4AF37', '#F59E0B', '#1A1310'],
  ['#FA8072', '#F5F5F5', '#1F2937'],
];

const ATELIER_SWATCHES = [
  '#2D1F2E', '#3F7D6B', '#C68F3F', '#8B3A2E',
  '#4A5D7E', '#1E3A2B', '#B8C4A0', '#E8DDD0',
  '#6B5A65', '#0F172A', '#C7B8B4', '#D17B5F',
];

const ROMAN = ['—', 'I', 'II', 'III', 'IV'];

// ─── color math ─────────────────────────────────────────────────────────
const hexToHsv = (hex) => {
  const clean = (hex || '').replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(clean)) return { h: 0, s: 0, v: 0 };
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = h * 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h, s, v: max };
};

const hsvToHex = (h, s, v) => {
  const c = v * s;
  const hh = (h / 60) % 6;
  const x = c * (1 - Math.abs((hh % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (hh < 1) [r, g, b] = [c, x, 0];
  else if (hh < 2) [r, g, b] = [x, c, 0];
  else if (hh < 3) [r, g, b] = [0, c, x];
  else if (hh < 4) [r, g, b] = [0, x, c];
  else if (hh < 5) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const toHex = (n) =>
    Math.max(0, Math.min(255, Math.round((n + m) * 255))).toString(16).padStart(2, '0');
  return '#' + toHex(r) + toHex(g) + toHex(b);
};

// ─── ATELIER :: custom color picker ─────────────────────────────────────
const AtelierColorPicker = ({ label, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(value);
  const rootRef = useRef(null);
  const svRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  useEffect(() => setHexDraft(value.toUpperCase()), [value]);

  const { h, s, v } = useMemo(() => hexToHsv(value), [value]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const updateSv = useCallback(
    (clientX, clientY) => {
      if (!svRef.current) return;
      const rect = svRef.current.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const ny = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      onChange(hsvToHex(h, nx, 1 - ny));
    },
    [h, onChange],
  );

  useEffect(() => {
    if (!dragging) return;
    const move = (e) => updateSv(e.clientX, e.clientY);
    const up = () => setDragging(false);
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
  }, [dragging, updateSv]);

  const onSvStart = (e) => {
    setDragging(true);
    updateSv(e.clientX, e.clientY);
  };

  const onHueChange = (e) => {
    const newH = Number(e.target.value);
    onChange(hsvToHex(newH, s || 1, v || 1));
  };

  const commitHex = () => {
    const clean = hexDraft.trim();
    if (/^#?[0-9a-fA-F]{6}$/.test(clean)) {
      onChange(clean.startsWith('#') ? clean : `#${clean}`);
    } else {
      setHexDraft(value.toUpperCase());
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="relative h-12 w-12 rounded-full shrink-0 transition-transform hover:scale-105 focus:outline-none"
          style={{
            background: value,
            boxShadow: `inset 0 0 0 1px ${PALETTE.rule}, 0 4px 10px rgba(45,31,46,0.08)`,
          }}
          aria-label={`Pick ${label} color`}
          aria-expanded={open}
        />
        <div className="flex-1">
          <div
            className="text-[11px] tracking-wide mb-0.5 flex items-center justify-between"
            style={{ color: PALETTE.inkSoft }}
          >
            <span>{label}</span>
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              className="atelier-display italic text-[13px] flex items-center gap-1 transition-colors"
              style={{ color: open ? PALETTE.jade : PALETTE.inkSoft }}
            >
              {open ? 'close' : 'adjust'}
              <CaretDownIcon
                size={12}
                style={{
                  transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform .2s ease',
                }}
              />
            </button>
          </div>
          <input
            value={hexDraft}
            onChange={(e) => setHexDraft(e.target.value)}
            onBlur={commitHex}
            onKeyDown={(e) => e.key === 'Enter' && commitHex()}
            className="w-full bg-transparent border-0 border-b atelier-display text-[18px] py-1 transition-colors focus:outline-none"
            style={{ color: PALETTE.ink, borderColor: PALETTE.rule }}
            onFocus={(e) => (e.target.style.borderColor = PALETTE.jade)}
          />
        </div>
      </div>

      {open && (
        <div
          className="mt-4 p-5 atelier-panel"
          style={{
            background: PALETTE.cardSoft,
            borderRadius: RADIUS,
            boxShadow: `0 0 0 1px ${PALETTE.gilt} inset, 0 1px 0 rgba(255,255,255,0.4) inset`,
          }}
        >
          {/* SV square */}
          <div
            ref={svRef}
            onMouseDown={onSvStart}
            className="relative w-full select-none cursor-crosshair"
            style={{
              height: 160,
              borderRadius: RADIUS,
              background: `
                linear-gradient(to top, #000, transparent),
                linear-gradient(to right, #fff, hsl(${h}, 100%, 50%))
              `,
              boxShadow: `inset 0 0 0 1px ${PALETTE.rule}`,
            }}
          >
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${s * 100}%`,
                top: `${(1 - v) * 100}%`,
                transform: 'translate(-50%, -50%)',
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: '2px solid #fff',
                boxShadow: '0 0 0 1px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)',
              }}
            />
          </div>

          {/* Hue slider */}
          <div className="mt-4">
            <div
              className="text-[10px] uppercase tracking-[0.22em] mb-1.5"
              style={{ color: PALETTE.inkSoft }}
            >
              hue
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={Math.round(h)}
              onChange={onHueChange}
              className="atelier-hue w-full"
            />
          </div>

          {/* Curated swatches */}
          <div className="mt-5">
            <div
              className="text-[10px] uppercase tracking-[0.22em] mb-2"
              style={{ color: PALETTE.inkSoft }}
            >
              the house palette
            </div>
            <div className="grid grid-cols-6 gap-2">
              {ATELIER_SWATCHES.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => onChange(c)}
                  className="aspect-square transition-transform hover:scale-110"
                  style={{
                    background: c,
                    borderRadius: RADIUS,
                    boxShadow:
                      value.toLowerCase() === c.toLowerCase()
                        ? `0 0 0 2px ${PALETTE.jade}, inset 0 0 0 1px ${PALETTE.rule}`
                        : `inset 0 0 0 1px ${PALETTE.rule}`,
                  }}
                  aria-label={c}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── pieces ─────────────────────────────────────────────────────────────
const SectionHead = ({ roman, eyebrow, title }) => (
  <div className="mb-6">
    <div className="flex items-baseline gap-4 mb-1">
      <span
        className="atelier-display italic text-[34px] leading-none"
        style={{ color: PALETTE.jade }}
      >
        {roman}.
      </span>
      <div className="flex flex-col">
        <span
          className="text-[10px] tracking-[0.22em] uppercase"
          style={{ color: PALETTE.inkSoft }}
        >
          {eyebrow}
        </span>
        <span
          className="atelier-display text-[22px] leading-tight"
          style={{ color: PALETTE.ink }}
        >
          {title}
        </span>
      </div>
    </div>
    <div className="h-px w-full" style={{ background: PALETTE.rule }} />
  </div>
);

const Field = ({ label, hint, children }) => (
  <label className="block">
    <span className="flex items-baseline justify-between mb-1.5">
      <span className="text-[11px] tracking-wide" style={{ color: PALETTE.inkSoft }}>
        {label}
      </span>
      {hint && (
        <span
          className="atelier-display italic text-[12px]"
          style={{ color: PALETTE.inkSoft }}
        >
          {hint}
        </span>
      )}
    </span>
    {children}
  </label>
);

// ─── MAIN PAGE ──────────────────────────────────────────────────────────
const GithubThumbnailGeneratorPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  const [repoOwner, setRepoOwner] = useState('fezcodex');
  const [repoName, setRepoName] = useState('project-genesis');
  const [description, setDescription] = useState(
    'A high-performance toolkit for procedural asset generation and digital synthesis.',
  );
  const [language, setLanguage] = useState('TypeScript');
  const [stars, setStars] = useState('1.2k');
  const [forks, setForks] = useState('342');
  const [supportUrl, setSupportUrl] = useState('github.com/fezcodex');

  const [theme, setTheme] = useState('modern');
  const [themeFilter, setThemeFilter] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#6366f1');
  const [secondaryColor, setSecondaryColor] = useState('#ec4899');
  const [bgColor, setBgColor] = useState('#0f172a');
  const [showPattern, setShowPattern] = useState(true);

  const [exportCount, setExportCount] = useState(0);

  const filteredThemes = useMemo(() => {
    const q = themeFilter.trim().toLowerCase();
    if (!q) return THEME_OPTIONS;
    return THEME_OPTIONS.filter(
      (t) =>
        t.value.toLowerCase().includes(q) || t.label.toLowerCase().includes(q),
    );
  }, [themeFilter]);

  const activeThemeLabel = useMemo(
    () => THEME_OPTIONS.find((t) => t.value === theme)?.label || theme,
    [theme],
  );
  const activeThemeIndex = useMemo(
    () => THEME_OPTIONS.findIndex((t) => t.value === theme) + 1,
    [theme],
  );

  const drawThumbnail = useCallback(
    (ctx, width, height) => {
      ctx.clearRect(0, 0, width, height);
      const scale = width / 1280;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, width, height);

      if (showPattern) {
        ctx.save();
        ctx.globalAlpha = 0.05;
        ctx.fillStyle = '#ffffff';
        if (
          ['brutalist', 'neoBrutalist', 'terminalPro', 'retroDos', 'cadTech', 'tacticalMap'].includes(theme)
        ) {
          const gridSize = 40 * scale;
          for (let x = 0; x < width; x += gridSize) ctx.fillRect(x, 0, 1, height);
          for (let y = 0; y < height; y += gridSize) ctx.fillRect(0, y, width, 1);
        } else {
          const dotSize = 2 * scale;
          const spacing = 30 * scale;
          for (let x = 0; x < width; x += spacing) {
            for (let y = 0; y < height; y += spacing) {
              ctx.beginPath();
              ctx.arc(x, y, dotSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
        ctx.restore();
      }

      const renderer = themeRenderers[theme];
      if (renderer) {
        renderer(ctx, width, height, scale, {
          repoOwner, repoName, description, language, stars, forks, supportUrl,
          primaryColor, secondaryColor, bgColor, showPattern,
        });
      }
    },
    [repoOwner, repoName, description, language, stars, forks, supportUrl,
     theme, primaryColor, secondaryColor, bgColor, showPattern],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const logicalWidth = 1280;
    const logicalHeight = 640;
    canvas.width = rect.width * dpr;
    canvas.height = rect.width * (logicalHeight / logicalWidth) * dpr;
    ctx.scale(dpr * (rect.width / logicalWidth), dpr * (rect.width / logicalWidth));
    drawThumbnail(ctx, logicalWidth, logicalHeight);
  }, [drawThumbnail]);

  const handleDownload = useCallback(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 1280 * 2;
    const H = 640 * 2;
    canvas.width = W;
    canvas.height = H;
    drawThumbnail(ctx, W, H);
    const link = document.createElement('a');
    link.download = `github-${repoName}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setExportCount((n) => n + 1);
    addToast({
      title: 'Piece Archived',
      message: `${activeThemeLabel} · 2560×1280 saved.`,
    });
  }, [drawThumbnail, repoName, activeThemeLabel, addToast]);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        handleDownload();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleDownload]);

  const shufflePalette = () => {
    const pick = PALETTE_BANK[Math.floor(Math.random() * PALETTE_BANK.length)];
    setPrimaryColor(pick[0]);
    setSecondaryColor(pick[1]);
    setBgColor(pick[2]);
  };

  const textInput =
    'w-full bg-transparent border-0 border-b py-2 atelier-display text-[18px] transition-colors focus:outline-none';

  const textInputStyle = {
    color: PALETTE.ink,
    borderColor: PALETTE.rule,
  };

  const focusStyle = (e, on) => {
    e.target.style.borderColor = on ? PALETTE.jade : PALETTE.rule;
  };

  return (
    <div
      className="atelier-page min-h-screen selection:bg-[#3F7D6B]/25"
      style={{ background: PALETTE.wall, color: PALETTE.ink }}
    >
      <style>{`
        .atelier-page { font-family: 'Nunito', system-ui, sans-serif; }
        .atelier-display { font-family: 'EB Garamond', 'Iowan Old Style', serif; }
        .atelier-card {
          background: ${PALETTE.card};
          border-radius: ${RADIUS}px;
          box-shadow:
            0 0 0 1px ${PALETTE.gilt} inset,
            0 1px 0 rgba(255,255,255,0.5) inset,
            0 1px 2px rgba(45,31,46,0.04),
            0 10px 30px -12px rgba(45,31,46,0.12);
        }
        .atelier-chip {
          background: transparent;
          border-radius: ${RADIUS}px;
          transition: background .18s ease, color .18s ease, border-color .18s ease;
        }
        .atelier-chip:hover { background: ${PALETTE.wallSoft}; }
        .atelier-chip[data-active="true"] {
          background: ${PALETTE.ink};
          color: ${PALETTE.card};
        }
        .atelier-export {
          background: ${PALETTE.ink};
          color: ${PALETTE.card};
          border-radius: ${RADIUS}px;
          transition: transform .2s ease, background .2s ease;
        }
        .atelier-export:hover { background: ${PALETTE.jadeDeep}; transform: translateY(-1px); }
        .atelier-mat {
          background: ${PALETTE.card};
          box-shadow:
            0 0 0 1px ${PALETTE.gilt} inset,
            0 2px 0 rgba(255,255,255,0.4) inset,
            0 40px 80px -30px rgba(45,31,46,0.35),
            0 20px 40px -20px rgba(45,31,46,0.2);
          border-radius: ${RADIUS}px;
        }
        .atelier-btn {
          border-radius: ${RADIUS}px;
          transition: border-color .18s ease, color .18s ease, background .18s ease;
        }
        .atelier-scroll { scrollbar-width: thin; scrollbar-color: ${PALETTE.rule} transparent; }
        .atelier-scroll::-webkit-scrollbar { width: 6px; }
        .atelier-scroll::-webkit-scrollbar-track { background: transparent; }
        .atelier-scroll::-webkit-scrollbar-thumb { background: ${PALETTE.rule}; border-radius: 3px; }

        .atelier-hue {
          -webkit-appearance: none; appearance: none;
          height: 14px; border-radius: ${RADIUS}px; outline: none;
          background: linear-gradient(to right,
            hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%),
            hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%));
          box-shadow: inset 0 0 0 1px ${PALETTE.rule};
        }
        .atelier-hue::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          height: 20px; width: 10px;
          background: ${PALETTE.card};
          border: 1px solid ${PALETTE.ink};
          border-radius: 3px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        .atelier-hue::-moz-range-thumb {
          height: 20px; width: 10px;
          background: ${PALETTE.card};
          border: 1px solid ${PALETTE.ink};
          border-radius: 3px;
          cursor: pointer;
        }
      `}</style>

      <Seo
        title="Github Thumbnail Generator | Fezcodex"
        description="Generate high-fidelity thumbnails and cover art for GitHub repositories."
        keywords={['github', 'thumbnail', 'generator', 'cover art', 'readme', 'social preview', 'fezcodex']}
      />

      {/* top bar */}
      <div
        className="sticky top-0 z-30 backdrop-blur-md"
        style={{
          background: `${PALETTE.wall}E6`,
          borderBottom: `1px solid ${PALETTE.rule}`,
        }}
      >
        <div className="mx-auto max-w-[1800px] px-6 md:px-12 py-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link
              to="/apps"
              className="flex items-center gap-2 transition-opacity hover:opacity-60"
              style={{ color: PALETTE.inkSoft }}
            >
              <ArrowLeftIcon size={16} />
              <span className="atelier-display italic text-[17px]">return to apps</span>
            </Link>
            <span className="h-6 w-px" style={{ background: PALETTE.rule }} />
            <div className="flex items-baseline gap-2">
              <span
                className="atelier-display italic text-[17px]"
                style={{ color: PALETTE.inkSoft }}
              >
                the
              </span>
              <span
                className="atelier-display text-[19px] tracking-tight"
                style={{ color: PALETTE.ink }}
              >
                Thumbnail Atelier
              </span>
            </div>
          </div>

          <div
            className="hidden lg:flex items-center gap-5 text-[12px]"
            style={{ color: PALETTE.inkSoft }}
          >
            <span className="atelier-display italic">
              № {String(activeThemeIndex).padStart(2, '0')} of {THEME_OPTIONS.length}
            </span>
            <span className="h-3 w-px" style={{ background: PALETTE.rule }} />
            <span className="atelier-display italic">{exportCount} archived</span>
          </div>

          <button
            onClick={handleDownload}
            className="atelier-export flex items-center gap-3 px-6 py-3 text-[13px] font-semibold tracking-wide"
          >
            <DownloadSimpleIcon weight="regular" size={16} />
            <span>Save piece</span>
            <span
              className="hidden md:flex items-center gap-1 text-[11px] atelier-display italic opacity-70 pl-3 border-l"
              style={{ borderColor: `${PALETTE.card}30` }}
            >
              ⌘E
            </span>
          </button>
        </div>
      </div>

      {/* workbench */}
      <div className="mx-auto max-w-[1800px] px-6 md:px-12 py-8 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* ── top-left: PREVIEW (sticky within this grid only) ── */}
          <div className="lg:col-span-7 lg:sticky lg:top-[84px] self-start">
            <div className="flex items-end justify-between mb-6 gap-6">
              <div>
                <div
                  className="text-[10px] uppercase tracking-[0.28em] mb-1"
                  style={{ color: PALETTE.inkSoft }}
                >
                  presently on view
                </div>
                <h1
                  className="atelier-display text-[42px] md:text-[56px] leading-[0.95]"
                  style={{ color: PALETTE.ink }}
                >
                  <span>{repoName}</span>
                  <span className="atelier-display italic" style={{ color: PALETTE.jade }}>.</span>
                </h1>
                <div
                  className="atelier-display italic text-[18px] mt-1"
                  style={{ color: PALETTE.inkSoft }}
                >
                  by {repoOwner}
                </div>
              </div>
              <div className="text-right shrink-0 hidden sm:block">
                <div
                  className="text-[10px] uppercase tracking-[0.28em] mb-1"
                  style={{ color: PALETTE.inkSoft }}
                >
                  plate
                </div>
                <div
                  className="atelier-display text-[32px] leading-none"
                  style={{ color: PALETTE.ink }}
                >
                  № {String(activeThemeIndex).padStart(2, '0')}
                </div>
                <div
                  className="atelier-display italic text-[14px] mt-1"
                  style={{ color: PALETTE.jade }}
                >
                  {activeThemeLabel}
                </div>
              </div>
            </div>

            <div className="atelier-mat p-6 md:p-10">
              <div
                className="relative"
                style={{
                  boxShadow: `0 0 0 1px ${PALETTE.gilt}, 0 6px 14px -4px rgba(45,31,46,0.3)`,
                  borderRadius: 2,
                }}
              >
                <canvas ref={canvasRef} className="block w-full h-auto bg-[#050508]" style={{ borderRadius: 2 }} />
              </div>

              <div className="mt-6 flex items-end justify-between gap-4">
                <div
                  className="atelier-display italic text-[15px] leading-snug max-w-md"
                  style={{ color: PALETTE.inkSoft }}
                >
                  {description}
                </div>
                <div
                  className="text-right text-[11px] tracking-wide shrink-0"
                  style={{ color: PALETTE.inkSoft }}
                >
                  <div>1280 × 640 · 2× export</div>
                  <div className="atelier-display italic">edition of one</div>
                </div>
              </div>
            </div>

            <div
              className="mt-5 flex items-center justify-between text-[12px]"
              style={{ color: PALETTE.inkSoft }}
            >
              <span className="atelier-display italic">canvas, pigment, pixel.</span>
              <span className="flex items-center gap-2 atelier-display italic">
                ⌘E to save this piece
              </span>
            </div>
          </div>

          {/* ── right column: all controls ── */}
          <div className="lg:col-span-5 space-y-5">
            <div className="atelier-card p-7">
              <SectionHead roman={ROMAN[1]} eyebrow="Subject" title="The repository" />
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Creator">
                    <input
                      className={textInput}
                      style={textInputStyle}
                      value={repoOwner}
                      onChange={(e) => setRepoOwner(e.target.value)}
                      onFocus={(e) => focusStyle(e, true)}
                      onBlur={(e) => focusStyle(e, false)}
                    />
                  </Field>
                  <Field label="Title">
                    <input
                      className={textInput}
                      style={textInputStyle}
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      onFocus={(e) => focusStyle(e, true)}
                      onBlur={(e) => focusStyle(e, false)}
                    />
                  </Field>
                </div>
                <Field label="Caption" hint={`${description.length} characters`}>
                  <textarea
                    rows={3}
                    className={`${textInput} resize-none leading-relaxed text-[16px]`}
                    style={textInputStyle}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onFocus={(e) => focusStyle(e, true)}
                    onBlur={(e) => focusStyle(e, false)}
                  />
                </Field>
                <Field label="Medium">
                  <input
                    className={textInput}
                    style={textInputStyle}
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    onFocus={(e) => focusStyle(e, true)}
                    onBlur={(e) => focusStyle(e, false)}
                  />
                </Field>
              </div>
            </div>

            <div className="atelier-card p-7">
              <SectionHead roman={ROMAN[2]} eyebrow="Provenance" title="Stars & history" />
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-5">
                  <Field label="Stars">
                    <input
                      className={textInput}
                      style={textInputStyle}
                      value={stars}
                      onChange={(e) => setStars(e.target.value)}
                      onFocus={(e) => focusStyle(e, true)}
                      onBlur={(e) => focusStyle(e, false)}
                    />
                  </Field>
                  <Field label="Forks">
                    <input
                      className={textInput}
                      style={textInputStyle}
                      value={forks}
                      onChange={(e) => setForks(e.target.value)}
                      onFocus={(e) => focusStyle(e, true)}
                      onBlur={(e) => focusStyle(e, false)}
                    />
                  </Field>
                </div>
                <Field label="Attribution link">
                  <input
                    className={textInput}
                    style={textInputStyle}
                    value={supportUrl}
                    onChange={(e) => setSupportUrl(e.target.value)}
                    onFocus={(e) => focusStyle(e, true)}
                    onBlur={(e) => focusStyle(e, false)}
                  />
                </Field>
              </div>
            </div>

            <div className="atelier-card p-7">
              <SectionHead roman={ROMAN[3]} eyebrow="Palette" title="Colour & material" />

                <div className="flex items-center gap-2 mb-6">
                  <div
                    className="flex-1 h-14"
                    style={{
                      background: primaryColor,
                      borderRadius: RADIUS,
                      boxShadow: `inset 0 0 0 1px ${PALETTE.rule}`,
                    }}
                  />
                  <div
                    className="flex-1 h-14"
                    style={{
                      background: secondaryColor,
                      borderRadius: RADIUS,
                      boxShadow: `inset 0 0 0 1px ${PALETTE.rule}`,
                    }}
                  />
                  <div
                    className="flex-1 h-14"
                    style={{
                      background: bgColor,
                      borderRadius: RADIUS,
                      boxShadow: `inset 0 0 0 1px ${PALETTE.rule}`,
                    }}
                  />
                </div>

                <div className="space-y-5">
                  <AtelierColorPicker label="Primary" value={primaryColor} onChange={setPrimaryColor} />
                  <AtelierColorPicker label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
                  <AtelierColorPicker label="Ground" value={bgColor} onChange={setBgColor} />

                  <div className="flex items-stretch gap-3 pt-2">
                    <button
                      onClick={shufflePalette}
                      className="atelier-btn flex-1 flex items-center justify-center gap-2 py-3 border text-[13px]"
                      style={{ borderColor: PALETTE.rule, color: PALETTE.ink }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = PALETTE.jade;
                        e.currentTarget.style.color = PALETTE.jade;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = PALETTE.rule;
                        e.currentTarget.style.color = PALETTE.ink;
                      }}
                    >
                      <ShuffleIcon size={14} />
                      <span>Shuffle palette</span>
                    </button>
                    <button
                      onClick={() => setShowPattern(!showPattern)}
                      className="atelier-btn flex-1 flex items-center justify-between px-5 py-3 border text-[13px]"
                      style={{
                        borderColor: showPattern ? PALETTE.jade : PALETTE.rule,
                        color: showPattern ? PALETTE.jade : PALETTE.inkSoft,
                        background: showPattern ? `${PALETTE.jade}10` : 'transparent',
                      }}
                    >
                      <span>Texture</span>
                      <span className="atelier-display italic">
                        {showPattern ? 'applied' : 'bare'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="atelier-card p-7">
                <SectionHead roman={ROMAN[4]} eyebrow="Surface" title="The plate" />

                <div className="relative mb-5">
                  <MagnifyingGlassIcon
                    size={15}
                    className="absolute left-0 top-1/2 -translate-y-1/2"
                    style={{ color: PALETTE.jade }}
                  />
                  <input
                    value={themeFilter}
                    onChange={(e) => setThemeFilter(e.target.value)}
                    placeholder="search the catalogue…"
                    className={`${textInput} pl-7`}
                    style={textInputStyle}
                    onFocus={(e) => focusStyle(e, true)}
                    onBlur={(e) => focusStyle(e, false)}
                  />
                  <span
                    className="absolute right-0 top-1/2 -translate-y-1/2 atelier-display italic text-[14px]"
                    style={{ color: PALETTE.inkSoft }}
                  >
                    {filteredThemes.length} of {THEME_OPTIONS.length}
                  </span>
                </div>

                <div className="atelier-scroll max-h-[420px] overflow-y-auto pr-1 -mr-1 space-y-1">
                  {filteredThemes.map((opt) => {
                    const active = opt.value === theme;
                    const origIdx = THEME_OPTIONS.findIndex((t) => t.value === opt.value) + 1;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setTheme(opt.value)}
                        data-active={active}
                        className="atelier-chip w-full text-left flex items-baseline gap-4 px-5 py-3"
                        style={{ color: active ? PALETTE.card : PALETTE.ink }}
                      >
                        <span
                          className="atelier-display italic text-[14px] w-8 tabular-nums shrink-0"
                          style={{ color: active ? PALETTE.card : PALETTE.inkSoft }}
                        >
                          № {String(origIdx).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-[15px] truncate">{opt.label}</span>
                        {active && (
                          <span
                            className="atelier-display italic text-[13px] shrink-0"
                            style={{ color: PALETTE.card }}
                          >
                            on view
                          </span>
                        )}
                      </button>
                    );
                  })}
                  {filteredThemes.length === 0 && (
                    <div
                      className="py-10 text-center atelier-display italic text-[15px]"
                      style={{ color: PALETTE.inkSoft }}
                    >
                      nothing in the catalogue matches.
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
      </div>
    </div>
  );
};

export default GithubThumbnailGeneratorPage;
