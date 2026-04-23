import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ShuffleIcon,
  PaletteIcon,
  ArrowsClockwiseIcon,
  FrameCornersIcon,
  ImageSquareIcon,
  ShapesIcon,
  CircleIcon,
  CaretDownIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import CustomColorPicker from '../../components/CustomColorPicker';

// ─── WORKBENCH :: calm modern dev-tool aesthetic (dark) ────────────────
const W = {
  bg: '#0F0F10',
  bgSoft: '#141415',
  surface: '#17171A',
  surface2: '#1E1E22',
  hair: 'rgba(239,236,228,0.08)',
  hairHi: 'rgba(239,236,228,0.16)',
  ink: '#EFECE4',
  inkSoft: '#A8A49B',
  inkDim: '#6E6B64',
  accent: '#C4643A',
  accentSoft: 'rgba(196,100,58,0.14)',
  accentRing: 'rgba(196,100,58,0.28)',
};

const randomHex = () =>
  '#' +
  Math.floor(Math.random() * 0xFFFFFF)
    .toString(16)
    .padStart(6, '0');

// ─── Workbench widgets (local copies, drive off CSS vars) ───────────────
const WB_CSS = `
  .wb-label {
    font-family: 'JetBrains Mono', 'Space Mono', monospace;
    font-size: 10px; letter-spacing: 0.08em;
    color: var(--wb-ink-soft); text-transform: lowercase;
  }
  .wb-value {
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 13px; color: var(--wb-ink);
    font-variant-numeric: tabular-nums;
  }
  .wb-card {
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    border-radius: 14px;
    padding: 20px;
  }
  .wb-section-head {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase;
    color: var(--wb-ink-soft);
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid var(--wb-hair);
  }
  .wb-slider {
    -webkit-appearance: none; appearance: none;
    background: transparent; height: 20px; width: 100%;
    outline: none; cursor: pointer;
  }
  .wb-slider::-webkit-slider-runnable-track {
    height: 3px; border-radius: 2px;
    background: linear-gradient(to right,
      var(--wb-accent) var(--wb-pct, 0%),
      rgba(25,23,22,0.12) var(--wb-pct, 0%));
  }
  .wb-slider::-webkit-slider-thumb {
    -webkit-appearance: none; appearance: none;
    height: 14px; width: 14px; border-radius: 50%;
    background: var(--wb-bg);
    border: 2px solid var(--wb-accent);
    margin-top: -5.5px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
    transition: transform .12s ease;
  }
  .wb-slider::-webkit-slider-thumb:hover { transform: scale(1.18); }
  .wb-slider::-moz-range-track { height: 3px; background: rgba(25,23,22,0.12); border-radius: 2px; }
  .wb-slider::-moz-range-progress { height: 3px; background: var(--wb-accent); border-radius: 2px; }
  .wb-slider::-moz-range-thumb {
    height: 14px; width: 14px; border-radius: 50%;
    background: var(--wb-bg); border: 2px solid var(--wb-accent); cursor: pointer;
  }
  .wb-select {
    width: 100%; appearance: none; -webkit-appearance: none;
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    border-radius: 10px;
    padding: 10px 36px 10px 12px;
    font-family: 'Instrument Sans', system-ui, sans-serif;
    font-size: 14px; color: var(--wb-ink);
    outline: none; cursor: pointer;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wb-select:hover { border-color: var(--wb-hair-hi); }
  .wb-select:focus {
    border-color: var(--wb-accent);
    box-shadow: 0 0 0 3px var(--wb-accent-ring);
  }
  .wb-input {
    width: 100%;
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    border-radius: 10px;
    padding: 6px 10px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 13px; color: var(--wb-ink);
    outline: none;
    transition: border-color .15s ease, box-shadow .15s ease;
  }
  .wb-input:focus {
    border-color: var(--wb-accent);
    box-shadow: 0 0 0 3px var(--wb-accent-ring);
  }
  .wb-swatch {
    width: 40px; height: 40px; border-radius: 10px;
    box-shadow: inset 0 0 0 1px rgba(25,23,22,0.18), 0 1px 2px rgba(0,0,0,0.04);
    cursor: pointer; transition: transform .15s ease; flex-shrink: 0;
    overflow: hidden; position: relative;
  }
  .wb-swatch:hover { transform: scale(1.06); }
  .wb-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 12px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; letter-spacing: 0.08em;
    background: var(--wb-surface);
    color: var(--wb-ink);
    border: 1px solid var(--wb-hair);
    border-radius: 10px;
    cursor: pointer;
    transition: all .15s ease;
  }
  .wb-btn:hover {
    background: var(--wb-accent);
    color: var(--wb-bg);
    border-color: var(--wb-accent);
  }
  .wb-btn--primary {
    background: var(--wb-accent);
    color: var(--wb-bg);
    border-color: var(--wb-accent);
  }
  .wb-btn--primary:hover {
    background: #A85430;
    border-color: #A85430;
  }
  .wb-micro-btn {
    display: inline-flex; align-items: center; justify-content: center;
    width: 22px; height: 22px;
    border-radius: 6px;
    background: transparent;
    border: none;
    color: var(--wb-ink-soft);
    cursor: pointer;
    transition: background .15s ease, color .15s ease;
  }
  .wb-micro-btn:hover {
    background: var(--wb-accent-soft);
    color: var(--wb-accent);
  }
  .wb-kbd {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 2px 6px; border-radius: 5px;
    background: var(--wb-surface);
    border: 1px solid var(--wb-hair);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; color: var(--wb-ink-soft);
  }
  .wb-pill {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 4px 10px; border-radius: 999px;
    border: 1px solid var(--wb-hair);
    background: var(--wb-surface);
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; letter-spacing: 0.12em;
    color: var(--wb-ink-soft);
  }
  .wb-display {
    font-family: 'Fraunces', 'EB Garamond', serif;
    font-variation-settings: "opsz" 72, "SOFT" 0, "WONK" 0;
  }
  .wb-mono { font-family: 'JetBrains Mono', 'Space Mono', monospace; }
  @keyframes wb-reveal {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .wb-reveal { animation: wb-reveal .5s cubic-bezier(.2,.7,.2,1) both; }
  :root {
    --wb-bg: ${W.bg}; --wb-surface: ${W.surface}; --wb-surface-2: ${W.surface2};
    --wb-hair: ${W.hair}; --wb-hair-hi: ${W.hairHi};
    --wb-ink: ${W.ink}; --wb-ink-soft: ${W.inkSoft}; --wb-ink-dim: ${W.inkDim};
    --wb-accent: ${W.accent}; --wb-accent-soft: ${W.accentSoft}; --wb-accent-ring: ${W.accentRing};
  }
  .wb-page *:focus-visible {
    outline: 2px solid var(--wb-accent);
    outline-offset: 2px;
    border-radius: 4px;
  }
  .wb-page::before {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background-image: radial-gradient(circle at 30% 30%, rgba(25,23,22,0.025) 1px, transparent 1px);
    background-size: 3px 3px; opacity: 0.6;
  }
  .wb-page::after {
    content: ''; position: fixed; inset: 0; z-index: 0; pointer-events: none;
    background: radial-gradient(60% 30% at 50% 0%, rgba(196,100,58,0.06), transparent 70%);
  }
`;

const WbSlider = ({ label, value, min, max, step = 1, onChange, format }) => {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  const display =
    format ? format(value)
    : typeof value === 'number' && !Number.isInteger(value) ? value.toFixed(2)
    : value;
  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <span className="wb-label">{label}</span>
        <span className="wb-value">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="wb-slider"
        style={{ '--wb-pct': `${pct}%` }}
      />
    </div>
  );
};

const WbDropdown = ({ label, options, value, onChange, icon: Icon }) => (
  <div>
    {label && (
      <div className="wb-label mb-2 flex items-center gap-2">
        {Icon && <Icon size={12} />}
        <span>{label}</span>
      </div>
    )}
    <div className="relative">
      <select
        value={value} onChange={(e) => onChange(e.target.value)}
        className="wb-select"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <CaretDownIcon
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: W.inkSoft }}
      />
    </div>
  </div>
);

// ─── data ─────────────────────────────────────────────────────────────
const PREDEFINED_PALETTES = [
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'],
  ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'],
  ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'],
  ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'],
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'],
  ['#000000', '#14213d', '#fca311', '#e5e5e5', '#ffffff'],
  ['#5f0f40', '#9a031e', '#fb8b24', '#e36414', '#0f4c5c'],
];

const SHAPES = [
  'square','circle','triangle-tl','triangle-tr','triangle-bl','triangle-br',
  'quarter-tl','quarter-tr','quarter-bl','quarter-br','half-t','half-b','half-l','half-r',
];

const PATTERN_TYPES = [
  { value: 'bauhaus', label: 'Bauhaus Shapes' },
  { value: 'mosaic',  label: 'Mosaic Triangles' },
  { value: 'rings',   label: 'Concentric Rings' },
  { value: 'stripes', label: 'Directions' },
  { value: 'pyramids',label: 'Pyramids' },
  { value: 'cubist',  label: 'Cubist Blocks' },
];

const RESOLUTIONS = {
  square:    { w: 3840, h: 3840 },
  landscape: { w: 3840, h: 2160 },
  portrait:  { w: 2160, h: 3840 },
};

const ASPECT_OPTIONS = [
  { value: 'square',    label: 'Square (1:1)' },
  { value: 'landscape', label: 'Landscape (16:9)' },
  { value: 'portrait',  label: 'Portrait (9:16)' },
];

const PatternGeneratorPage = () => {
  const { addToast } = useToast();
  const svgRef = useRef(null);

  const [palette, setPalette] = useState(PREDEFINED_PALETTES[0]);
  const [aspectRatio, setAspectRatio] = useState('square');
  const [patternType, setPatternType] = useState('bauhaus');
  const [density, setDensity] = useState(10);
  const [patternData, setPatternData] = useState([]);
  const [seed, setSeed] = useState(0);

  const targetRes = RESOLUTIONS[aspectRatio];
  const gridCols = density;
  const cellSize = targetRes.w / gridCols;
  const gridRows = Math.ceil(targetRes.h / cellSize);

  const generatePattern = useCallback(() => {
    const newPattern = [];
    const getIndices = (count = 2) => {
      const indices = [];
      while (indices.length < count) {
        const idx = Math.floor(Math.random() * 5);
        if (!indices.includes(idx)) indices.push(idx);
      }
      return indices;
    };

    for (let row = 0; row < gridRows; row++) {
      const rowData = [];
      for (let col = 0; col < gridCols; col++) {
        let cellData = {};
        if (patternType === 'bauhaus') {
          const [bgIndex, fgIndex] = getIndices(2);
          const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
          cellData = { bgIndex, fgIndex, shape };
        } else if (patternType === 'mosaic') {
          const [c1, c2] = getIndices(2);
          const type = Math.random() > 0.5 ? 'backslash' : 'slash';
          cellData = { c1, c2, type };
        } else if (patternType === 'rings') {
          const count = Math.floor(Math.random() * 3) + 2;
          const indices = getIndices(count);
          cellData = { indices };
        } else if (patternType === 'stripes') {
          const [c1, c2] = getIndices(2);
          const direction = Math.floor(Math.random() * 4);
          cellData = { c1, c2, direction };
        } else if (patternType === 'pyramids') {
          const indices = getIndices(4);
          cellData = { indices };
        } else if (patternType === 'cubist') {
          const indices = getIndices(4);
          const scale = 0.3 + Math.random() * 0.5;
          const shiftX = (Math.random() - 0.5) * 0.8;
          const shiftY = (Math.random() - 0.5) * 0.8;
          cellData = { indices, scale, shiftX, shiftY };
        }
        rowData.push(cellData);
      }
      newPattern.push(rowData);
    }
    setPatternData(newPattern);
  }, [gridCols, gridRows, patternType]);

  useEffect(() => { generatePattern(); }, [generatePattern, seed]);

  const randomizePalette = () => {
    const p = PREDEFINED_PALETTES[Math.floor(Math.random() * PREDEFINED_PALETTES.length)];
    setPalette(p);
  };
  const updateColor = (index, newColor) => {
    const p = [...palette]; p[index] = newColor; setPalette(p);
  };
  const regenerate = () => setSeed(Math.random());

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern-${patternType}-${aspectRatio}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: 'Downloaded', message: 'SVG saved.', duration: 3000 });
  };

  const handleDownloadPng = (width, height, label = '4K') => {
    const svg = svgRef.current;
    if (!svg) return;
    const w = width || targetRes.w;
    const h = height || targetRes.h;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    canvas.width = w; canvas.height = h;
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      const pngUrl = canvas.toDataURL('image/png');
      const dl = document.createElement('a');
      dl.href = pngUrl;
      dl.download = `pattern-${patternType}-${aspectRatio}-${label}-${Date.now()}.png`;
      document.body.appendChild(dl);
      dl.click();
      document.body.removeChild(dl);
      URL.revokeObjectURL(url);
      addToast({ title: 'Downloaded', message: `${label} PNG saved.`, duration: 3000 });
    };
    img.src = url;
  };
  const handleDownloadPng1080p = () => handleDownloadPng(targetRes.w / 2, targetRes.h / 2, '1080p');

  // ── Renderers (unchanged pattern logic) ──
  const renderBauhaus = (cell, x, y, size) => {
    const { bgIndex, fgIndex, shape } = cell;
    if (bgIndex === undefined || fgIndex === undefined || !shape) return null;
    const bg = palette[bgIndex] || '#000';
    const fg = palette[fgIndex] || '#fff';
    const bgRect = <rect x={x} y={y} width={size} height={size} fill={bg} />;
    let fgShape = null;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size / 2;
    switch (shape) {
      case 'square':      fgShape = <rect x={x} y={y} width={size} height={size} fill={fg} />; break;
      case 'circle':      fgShape = <circle cx={cx} cy={cy} r={r} fill={fg} />; break;
      case 'triangle-tl': fgShape = <path d={`M${x},${y} L${x+size},${y} L${x},${y+size} Z`} fill={fg} />; break;
      case 'triangle-tr': fgShape = <path d={`M${x},${y} L${x+size},${y} L${x+size},${y+size} Z`} fill={fg} />; break;
      case 'triangle-bl': fgShape = <path d={`M${x},${y} L${x},${y+size} L${x+size},${y+size} Z`} fill={fg} />; break;
      case 'triangle-br': fgShape = <path d={`M${x+size},${y} L${x+size},${y+size} L${x},${y+size} Z`} fill={fg} />; break;
      case 'quarter-tl':  fgShape = <path d={`M${x},${y} L${x+size},${y} A${size},${size} 0 0 1 ${x},${y+size} Z`} fill={fg} />; break;
      case 'quarter-tr':  fgShape = <path d={`M${x+size},${y} L${x+size},${y+size} A${size},${size} 0 0 1 ${x},${y} Z`} fill={fg} />; break;
      case 'quarter-bl':  fgShape = <path d={`M${x},${y+size} L${x},${y} A${size},${size} 0 0 1 ${x+size},${y+size} Z`} fill={fg} />; break;
      case 'quarter-br':  fgShape = <path d={`M${x+size},${y+size} L${x},${y+size} A${size},${size} 0 0 1 ${x+size},${y} Z`} fill={fg} />; break;
      case 'half-t':      fgShape = <rect x={x} y={y} width={size} height={size/2} fill={fg} />; break;
      case 'half-b':      fgShape = <rect x={x} y={y+size/2} width={size} height={size/2} fill={fg} />; break;
      case 'half-l':      fgShape = <rect x={x} y={y} width={size/2} height={size} fill={fg} />; break;
      case 'half-r':      fgShape = <rect x={x+size/2} y={y} width={size/2} height={size} fill={fg} />; break;
      default: break;
    }
    return <g key={`${x}-${y}`}>{bgRect}{fgShape}</g>;
  };

  const renderMosaic = (cell, x, y, size) => {
    const { c1, c2, type } = cell;
    if (c1 === undefined || c2 === undefined) return null;
    const col1 = palette[c1]; const col2 = palette[c2];
    if (type === 'backslash') {
      return (
        <g key={`${x}-${y}`}>
          <path d={`M${x},${y} L${x+size},${y} L${x+size},${y+size} Z`} fill={col1} />
          <path d={`M${x},${y} L${x+size},${y+size} L${x},${y+size} Z`} fill={col2} />
        </g>
      );
    }
    return (
      <g key={`${x}-${y}`}>
        <path d={`M${x+size},${y} L${x+size},${y+size} L${x},${y+size} Z`} fill={col1} />
        <path d={`M${x},${y} L${x+size},${y} L${x},${y+size} Z`} fill={col2} />
      </g>
    );
  };

  const renderRings = (cell, x, y, size) => {
    const { indices } = cell;
    if (!indices) return null;
    const cx = x + size / 2; const cy = y + size / 2;
    return (
      <g key={`${x}-${y}`}>
        {indices.map((i, k) => {
          const r = (size / 2) * (1 - k / indices.length);
          return <circle key={k} cx={cx} cy={cy} r={r} fill={palette[i]} />;
        })}
      </g>
    );
  };

  const renderStripes = (cell, x, y, size) => {
    const { c1, c2, direction } = cell;
    if (c1 === undefined || c2 === undefined) return null;
    const col1 = palette[c1]; const col2 = palette[c2];
    let d1, d2;
    if (direction === 0) {
      d1 = `M${x},${y} L${x+size},${y} L${x+size},${y+size/2} L${x},${y+size/2} Z`;
      d2 = `M${x},${y+size/2} L${x+size},${y+size/2} L${x+size},${y+size} L${x},${y+size} Z`;
    } else if (direction === 1) {
      d1 = `M${x},${y} L${x+size/2},${y} L${x+size/2},${y+size} L${x},${y+size} Z`;
      d2 = `M${x+size/2},${y} L${x+size},${y} L${x+size},${y+size} L${x+size/2},${y+size} Z`;
    } else if (direction === 2) {
      d1 = `M${x},${y} L${x+size},${y} L${x},${y+size} Z`;
      d2 = `M${x+size},${y} L${x+size},${y+size} L${x},${y+size} Z`;
    } else {
      d1 = `M${x},${y} L${x+size},${y} L${x+size},${y+size} Z`;
      d2 = `M${x},${y} L${x},${y+size} L${x+size},${y+size} Z`;
    }
    return (
      <g key={`${x}-${y}`}>
        <path d={d1} fill={col1} />
        <path d={d2} fill={col2} />
      </g>
    );
  };

  const renderPyramids = (cell, x, y, size) => {
    const { indices } = cell;
    if (!indices || indices.length < 4) return null;
    const cx = x + size / 2; const cy = y + size / 2;
    const [c1, c2, c3, c4] = indices.map((i) => palette[i]);
    return (
      <g key={`${x}-${y}`}>
        <path d={`M${x},${y} L${x+size},${y} L${cx},${cy} Z`} fill={c1} />
        <path d={`M${x+size},${y} L${x+size},${y+size} L${cx},${cy} Z`} fill={c2} />
        <path d={`M${x+size},${y+size} L${x},${y+size} L${cx},${cy} Z`} fill={c3} />
        <path d={`M${x},${y+size} L${x},${y} L${cx},${cy} Z`} fill={c4} />
      </g>
    );
  };

  const renderCubist = (cell, x, y, size) => {
    const { indices, scale, shiftX, shiftY } = cell;
    if (!indices || indices.length < 4) return null;
    const cBack = palette[indices[0]];
    const cSide1 = palette[indices[1]];
    const cSide2 = palette[indices[2]];
    const cFront = palette[indices[3]];
    const innerSize = size * scale;
    const space = size - innerSize;
    const fx = x + space * (0.5 + shiftX / 2);
    const fy = y + space * (0.5 + shiftY / 2);
    return (
      <g key={`${x}-${y}`}>
        <rect x={x} y={y} width={size} height={size} fill={cBack} />
        <path d={`M${x},${y} L${x+size},${y} L${fx+innerSize},${fy} L${fx},${fy} Z`} fill={cSide1} />
        <path d={`M${x},${y+size} L${x+size},${y+size} L${fx+innerSize},${fy+innerSize} L${fx},${fy+innerSize} Z`} fill={cSide1} />
        <path d={`M${x},${y} L${x},${y+size} L${fx},${fy+innerSize} L${fx},${fy} Z`} fill={cSide2} />
        <path d={`M${x+size},${y} L${x+size},${y+size} L${fx+innerSize},${fy+innerSize} L${fx+innerSize},${fy} Z`} fill={cSide2} />
        <rect x={fx} y={fy} width={innerSize} height={innerSize} fill={cFront} />
      </g>
    );
  };

  const renderCellDispatch = (cell, rIndex, cIndex) => {
    const x = cIndex * cellSize; const y = rIndex * cellSize;
    switch (patternType) {
      case 'bauhaus':  return renderBauhaus(cell, x, y, cellSize);
      case 'mosaic':   return renderMosaic(cell, x, y, cellSize);
      case 'rings':    return renderRings(cell, x, y, cellSize);
      case 'stripes':  return renderStripes(cell, x, y, cellSize);
      case 'pyramids': return renderPyramids(cell, x, y, cellSize);
      case 'cubist':   return renderCubist(cell, x, y, cellSize);
      default: return null;
    }
  };

  return (
    <div className="wb-page min-h-screen relative" style={{ background: W.bg, color: W.ink, fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
      <style>{WB_CSS}</style>

      <Seo
        title="Pattern Generator — Fezcodex"
        description="Generate seamless geometric vector patterns in 4K resolution."
        keywords={['pattern','generator','svg','geometric','design','4k','wallpaper']}
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
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <Link to="/apps" className="flex items-center gap-2 transition-opacity hover:opacity-70" style={{ color: W.inkSoft }}>
              <ArrowLeftIcon size={13} />
              <span className="wb-mono text-[11px] tracking-[0.08em]">apps</span>
            </Link>
            <span className="h-4 w-px" style={{ background: W.hairHi }} />
            <div className="flex items-center gap-2">
              <CircleIcon size={6} weight="fill" style={{ color: W.accent }} />
              <span className="wb-mono text-[11px]" style={{ color: W.ink }}>pattern</span>
              <span className="wb-mono text-[11px]" style={{ color: W.inkDim }}>/ generator</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-5">
            <span className="wb-mono text-[10px]" style={{ color: W.inkDim }}>{targetRes.w}×{targetRes.h}</span>
            <span className="h-4 w-px" style={{ background: W.hairHi }} />
            <span className="wb-mono text-[10px]" style={{ color: W.inkDim }}>v2026.1</span>
          </div>
        </div>
      </div>

      {/* ─── Header ─────────────────────────────────────────────── */}
      <header className="wb-reveal relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 pt-10 md:pt-14 pb-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl">
            <div className="wb-mono text-[11px] mb-3 flex items-center gap-2" style={{ color: W.inkSoft, letterSpacing: '0.08em' }}>
              <ShapesIcon size={12} style={{ color: W.accent }} />
              <span>pattern · generator</span>
            </div>
            <h1 className="wb-display leading-[1.05] tracking-[-0.01em]" style={{ fontSize: 'clamp(40px, 5vw, 64px)', color: W.ink, fontWeight: 400 }}>
              Compose a pattern.
            </h1>
            <p className="mt-3 text-[15px] md:text-[16px] max-w-xl leading-relaxed" style={{ color: W.inkSoft }}>
              Six generative styles, seven curated palettes, vector output at 4K.
              Re-seed and export as SVG for infinite scaling, or rasterize to PNG.
            </p>
          </div>

          {/* Action cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={regenerate} className="wb-btn wb-btn--primary">
              <ArrowsClockwiseIcon size={13} />
              <span>re-seed</span>
            </button>
            <button onClick={handleDownloadSvg} className="wb-btn">
              <DownloadSimpleIcon size={13} />
              <span>SVG · 4K</span>
            </button>
            <button onClick={() => handleDownloadPng(null, null, '4K')} className="wb-btn">
              <ImageSquareIcon size={13} />
              <span>PNG · 4K</span>
            </button>
            <button onClick={handleDownloadPng1080p} className="wb-btn">
              <ImageSquareIcon size={13} />
              <span>PNG · 1080p</span>
            </button>
          </div>
        </div>

        <div className="mt-10 relative" style={{ height: 1 }}>
          <div className="absolute inset-0" style={{ background: W.hair }} />
          <div className="absolute left-0 top-0 bottom-0" style={{ width: 40, background: W.accent }} />
        </div>
      </header>

      {/* ─── Workspace ───────────────────────────────────────────── */}
      <main className="wb-reveal relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 pb-16" style={{ animationDelay: '.08s' }}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* Preview left, larger, sticky */}
          <div className="lg:col-span-8 order-1">
            <div className="lg:sticky lg:top-20 space-y-4">
              {/* meta row */}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-4 wb-mono" style={{ letterSpacing: '0.08em' }}>
                  <span style={{ color: W.inkSoft }}>preview</span>
                  <span style={{ color: W.inkDim }}>·</span>
                  <span style={{ color: W.inkDim }}>{targetRes.w} × {targetRes.h}</span>
                </div>
                <div className="flex items-center gap-3 wb-mono" style={{ letterSpacing: '0.08em' }}>
                  <span style={{ color: W.inkDim }}>{gridCols} × {gridRows}</span>
                  <span style={{ color: W.inkDim }}>·</span>
                  <span style={{ color: W.inkDim }}>{patternType}</span>
                </div>
              </div>

              <div
                className="flex items-center justify-center p-4 md:p-6 overflow-hidden"
                style={{
                  background: W.surface,
                  border: `1px solid ${W.hair}`,
                  borderRadius: 14,
                  minHeight: 400,
                }}
              >
                <svg
                  ref={svgRef}
                  width={targetRes.w}
                  height={targetRes.h}
                  viewBox={`0 0 ${targetRes.w} ${targetRes.h}`}
                  style={{
                    maxHeight: '70vh',
                    maxWidth: '100%',
                    aspectRatio: `${targetRes.w}/${targetRes.h}`,
                    display: 'block',
                  }}
                >
                  {patternData.map((row, rIndex) =>
                    row.map((cell, cIndex) => renderCellDispatch(cell, rIndex, cIndex)),
                  )}
                </svg>
              </div>

              {/* note */}
              <div
                className="flex items-start gap-3 p-4"
                style={{
                  background: W.accentSoft,
                  border: `1px solid rgba(196,100,58,0.18)`,
                  borderRadius: 10,
                }}
              >
                <CircleIcon size={8} weight="fill" style={{ color: W.accent, marginTop: 4, flexShrink: 0 }} />
                <p className="wb-mono text-[11px]" style={{ color: W.ink, letterSpacing: '0.02em' }}>
                  Output renders at {targetRes.w}×{targetRes.h}. Vector patterns
                  scale infinitely — export to SVG for design work, PNG for
                  quick posts.
                </p>
              </div>
            </div>
          </div>

          {/* Controls right */}
          <div className="lg:col-span-4 order-2 space-y-4">

            <div className="wb-card space-y-4">
              <h3 className="wb-section-head">
                <FrameCornersIcon size={12} />
                Canvas Setup
              </h3>
              <WbDropdown
                label="Pattern style"
                options={PATTERN_TYPES}
                value={patternType}
                onChange={setPatternType}
                icon={ShapesIcon}
              />
              <WbDropdown
                label="Aspect ratio"
                options={ASPECT_OPTIONS}
                value={aspectRatio}
                onChange={setAspectRatio}
              />
              <WbSlider
                label="Grid density"
                value={density}
                min={4} max={40} step={2}
                onChange={setDensity}
                format={(v) => `${v} cols · ${Math.ceil(targetRes.h / (targetRes.w / v))} rows`}
              />
            </div>

            <div className="wb-card">
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: `1px solid ${W.hair}` }}>
                <h3 className="wb-mono text-[10px] uppercase" style={{ color: W.inkSoft, letterSpacing: '0.16em', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <PaletteIcon size={12} />
                  Color Palette
                </h3>
                <button
                  onClick={randomizePalette}
                  className="p-1.5 rounded-md transition-colors"
                  style={{ color: W.accent }}
                  title="Shuffle palette"
                  onMouseEnter={(e) => (e.currentTarget.style.background = W.accentSoft)}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <ShuffleIcon size={14} />
                </button>
              </div>

              <div className="space-y-4">
                {palette.map((color, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="wb-label">Color {i + 1}</span>
                      <button
                        onClick={() => updateColor(i, randomHex())}
                        className="wb-micro-btn"
                        title="Randomize this color"
                        aria-label="Randomize this color"
                      >
                        <ShuffleIcon size={11} />
                      </button>
                    </div>
                    <CustomColorPicker
                      value={color}
                      onChange={(newColor) => updateColor(i, newColor)}
                      variant="brutalist"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Footer ──────────────────────────────────────────────── */}
      <footer
        className="relative z-10 mx-auto max-w-[1600px] px-6 md:px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-3"
        style={{ borderTop: `1px solid ${W.hair}` }}
      >
        <div className="flex items-center gap-2">
          <CircleIcon size={6} weight="fill" style={{ color: W.accent }} />
          <span className="wb-mono text-[10px]" style={{ color: W.inkDim, letterSpacing: '0.1em' }}>
            fezcodex / pattern
          </span>
        </div>
        <span className="wb-display text-[14px]" style={{ color: W.inkSoft }}>
          shapes speak in sequence.
        </span>
        <span className="wb-mono text-[10px]" style={{ color: W.inkDim, letterSpacing: '0.1em' }}>
          vector · 4k · svg
        </span>
      </footer>
    </div>
  );
};

export default PatternGeneratorPage;
