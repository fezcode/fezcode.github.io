import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowCounterClockwiseIcon,
  ColumnsIcon,
  DotsNineIcon,
  DownloadSimpleIcon,
  DropHalfIcon,
  GridFourIcon,
  ImageSquareIcon,
  ShuffleIcon,
  SlidersHorizontalIcon,
  SnowflakeIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import { GlassEngine, makeDemoImage } from './vitray/glassEngine';

// ─── VITRAY :: design language ───────────────────────────────────────────
// Liquid glassmorphism. A deep aurora field behind frosted panes — every
// panel is itself a sheet of glass: backdrop-blur, hairline white borders,
// a top-edge gloss. Unbounded display over Sora body. The UI is the demo.
const P = {
  bg: '#0A0E1E',
  ink: '#F2F5FF',
  inkSoft: 'rgba(228,234,255,0.62)',
  inkDim: 'rgba(228,234,255,0.38)',
  cyan: '#5EE6D8',
  violet: '#8B7CFF',
  magenta: '#E66BC9',
  amber: '#FFC46B',
  glass: 'rgba(255,255,255,0.07)',
  glassHi: 'rgba(255,255,255,0.13)',
  edge: 'rgba(255,255,255,0.16)',
  edgeHi: 'rgba(255,255,255,0.30)',
};

// Frosted prism chips under the title.
const PANES = [P.cyan, P.violet, P.magenta, P.amber, '#6BB7FF', '#9BE66B'];

const hexToRgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

// ─── Effect catalogue ────────────────────────────────────────────────────
// Every parameter is a uniform; `kind` decides the control widget.
const EFFECTS = [
  {
    id: 'fluted',
    tr: 'Oluklu',
    en: 'Fluted',
    Icon: ColumnsIcon,
    tone: '#5EE6D8',
    hint: 'Reeded architectural glass — parallel half-round ribs that smear the world sideways.',
    params: [
      { kind: 'range', key: 'uWidth', label: 'Flute Width', min: 6, max: 120, step: 1, def: 28, unit: 'px' },
      { kind: 'range', key: 'uRefract', label: 'Refraction', min: 0, max: 1, step: 0.01, def: 0.55 },
      { kind: 'range', key: 'uAngle', label: 'Angle', min: 0, max: 180, step: 1, def: 0, unit: '°' },
      { kind: 'range', key: 'uBlur', label: 'Rib Blur', min: 0, max: 1, step: 0.01, def: 0.15 },
      { kind: 'range', key: 'uHighlight', label: 'Highlight', min: 0, max: 1, step: 0.01, def: 0.35 },
      { kind: 'range', key: 'uSeam', label: 'Seam Shadow', min: 0, max: 1, step: 0.01, def: 0.4 },
      {
        kind: 'choice', key: 'uProfile', label: 'Profile', def: 0,
        options: [{ v: 0, label: 'Round' }, { v: 1, label: 'Prism' }],
      },
    ],
  },
  {
    id: 'mosaic',
    tr: 'Mozaik',
    en: 'Mosaic',
    Icon: GridFourIcon,
    tone: '#FFC46B',
    hint: 'Tesserae leaded into a panel — each tile takes one color of the image behind it.',
    params: [
      {
        kind: 'choice', key: 'uShape', label: 'Tessera', def: 2,
        options: [{ v: 0, label: 'Square' }, { v: 1, label: 'Hex' }, { v: 2, label: 'Voronoi' }],
      },
      { kind: 'range', key: 'uTile', label: 'Tile Size', min: 8, max: 160, step: 1, def: 42, unit: 'px' },
      { kind: 'range', key: 'uGrout', label: 'Came Width', min: 0, max: 12, step: 0.5, def: 2.5, unit: 'px' },
      { kind: 'color', key: 'uGroutCol', label: 'Came Color', def: '#16120D' },
      { kind: 'range', key: 'uFlatten', label: 'Color Flatten', min: 0, max: 1, step: 0.01, def: 0.85 },
      { kind: 'range', key: 'uVariance', label: 'Pane Variance', min: 0, max: 1, step: 0.01, def: 0.25 },
      { kind: 'range', key: 'uBevel', label: 'Bevel Light', min: 0, max: 1, step: 0.01, def: 0.45 },
    ],
  },
  {
    id: 'pixel',
    tr: 'Piksel',
    en: 'Privacy',
    Icon: DotsNineIcon,
    tone: '#E66BC9',
    hint: 'Censor-glass pixelation — chunky cells, optional palette quantizing and jitter.',
    params: [
      { kind: 'range', key: 'uCell', label: 'Cell Size', min: 4, max: 96, step: 1, def: 18, unit: 'px' },
      {
        kind: 'choice', key: 'uShapeP', label: 'Cell Shape', def: 0,
        options: [{ v: 0, label: 'Square' }, { v: 1, label: 'Dot' }, { v: 2, label: 'Diamond' }],
      },
      { kind: 'range', key: 'uGap', label: 'Gap', min: 0, max: 0.45, step: 0.01, def: 0.08 },
      {
        kind: 'range', key: 'uQuant', label: 'Palette Steps', min: 2, max: 33, step: 1, def: 33,
        fmt: (v) => (v > 32.5 ? '∞' : String(v)),
      },
      { kind: 'range', key: 'uJitter', label: 'Jitter', min: 0, max: 1, step: 0.01, def: 0 },
      { kind: 'range', key: 'uContrast', label: 'Contrast', min: 0.5, max: 2, step: 0.05, def: 1 },
    ],
  },
  {
    id: 'frosted',
    tr: 'Buzlu',
    en: 'Frosted',
    Icon: SnowflakeIcon,
    tone: '#6BB7FF',
    hint: 'Bathroom panes — shower noise, rain droplets, hammered dimples, cathedral ripple.',
    params: [
      {
        kind: 'choice', key: 'uType', label: 'Texture', def: 0,
        options: [
          { v: 0, label: 'Shower' }, { v: 1, label: 'Rain' },
          { v: 2, label: 'Hammered' }, { v: 3, label: 'Cathedral' },
        ],
      },
      { kind: 'range', key: 'uScale', label: 'Texture Scale', min: 8, max: 200, step: 1, def: 60, unit: 'px' },
      { kind: 'range', key: 'uRefract', label: 'Refraction', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'range', key: 'uBlur', label: 'Frost', min: 0, max: 1, step: 0.01, def: 0.35 },
      {
        kind: 'range', key: 'uDropSize', label: 'Drop Size', min: 24, max: 200, step: 1, def: 90, unit: 'px',
        showIf: (p) => p.uType === 1,
      },
      {
        kind: 'range', key: 'uDensity', label: 'Drop Density', min: 0, max: 1, step: 0.01, def: 0.5,
        showIf: (p) => p.uType === 1,
      },
      { kind: 'range', key: 'uTint', label: 'Tint', min: 0, max: 1, step: 0.01, def: 0.15 },
      { kind: 'color', key: 'uTintCol', label: 'Tint Color', def: '#BFD8DF' },
    ],
  },
  {
    id: 'liquid',
    tr: 'Akışkan',
    en: 'Liquid',
    Icon: DropHalfIcon,
    tone: '#8B7CFF',
    hint: 'A floating liquid-glass panel — drag it around the pane to reposition it.',
    params: [
      { kind: 'range', key: 'uSizeX', label: 'Panel Width', min: 0.1, max: 1, step: 0.01, def: 0.62 },
      { kind: 'range', key: 'uSizeY', label: 'Panel Height', min: 0.1, max: 1, step: 0.01, def: 0.42 },
      { kind: 'range', key: 'uCenterX', label: 'Center X', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'range', key: 'uCenterY', label: 'Center Y', min: 0, max: 1, step: 0.01, def: 0.5 },
      { kind: 'range', key: 'uRadius', label: 'Corner Radius', min: 0, max: 240, step: 1, def: 64, unit: 'px' },
      { kind: 'range', key: 'uEdge', label: 'Edge Band', min: 4, max: 140, step: 1, def: 46, unit: 'px' },
      { kind: 'range', key: 'uRefract', label: 'Refraction', min: 0, max: 1, step: 0.01, def: 0.6 },
      { kind: 'range', key: 'uDisperse', label: 'Dispersion', min: 0, max: 1, step: 0.01, def: 0.35 },
      { kind: 'range', key: 'uFrost', label: 'Frost', min: 0, max: 1, step: 0.01, def: 0.25 },
      { kind: 'range', key: 'uSpec', label: 'Specular', min: 0, max: 1, step: 0.01, def: 0.6 },
      { kind: 'range', key: 'uDim', label: 'Backdrop Dim', min: 0, max: 1, step: 0.01, def: 0.25 },
    ],
  },
];

const EFFECT_MAP = Object.fromEntries(EFFECTS.map((e) => [e.id, e]));

const defaultParams = () =>
  Object.fromEntries(
    EFFECTS.map((e) => [e.id, Object.fromEntries(e.params.map((p) => [p.key, p.def]))]),
  );

const buildUniforms = (effectId, p, globals, seed) => {
  const out = { uSeed: seed, uVignette: globals.vignette, uGrain: globals.grain };
  for (const def of EFFECT_MAP[effectId].params) {
    out[def.key] = def.kind === 'color' ? hexToRgb(p[def.key]) : p[def.key];
  }
  if (effectId === 'liquid') {
    out.uSize = [p.uSizeX, p.uSizeY];
    out.uCenter = [p.uCenterX, p.uCenterY];
  }
  return out;
};

function VitrayPage() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);
  const fileRef = useRef(null);
  const frameRef = useRef(0);
  const dragRef = useRef(false);
  const { addToast } = useToast();

  const [effect, setEffect] = useState('fluted');
  const [params, setParams] = useState(defaultParams);
  const [globals, setGlobals] = useState({ vignette: 0, grain: 0.06 });
  const [seed, setSeed] = useState(7.31);
  const [img, setImg] = useState(null); // { name, w, h, version }
  const [noGL, setNoGL] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const active = EFFECT_MAP[effect];

  useEffect(() => {
    const engine = new GlassEngine(canvasRef.current);
    engineRef.current = engine;
    if (!engine.ok) {
      setNoGL(true);
      return () => engine.destroy();
    }
    const demo = makeDemoImage();
    engine.setImage(demo, demo.width, demo.height);
    engine.fitView();
    setImg({ name: 'numune — dusk specimen', w: demo.width, h: demo.height, version: 1 });
    return () => engine.destroy();
  }, []);

  useEffect(() => {
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(() => {
      const engine = engineRef.current;
      if (!engine?.ok || !engine.hasImage) return;
      try {
        engine.render(effect, buildUniforms(effect, params[effect], globals, seed));
      } catch (err) {
        console.error(err);
      }
    });
    return () => cancelAnimationFrame(frameRef.current);
  }, [effect, params, globals, seed, img]);

  const setParam = (key, value) =>
    setParams((prev) => ({ ...prev, [effect]: { ...prev[effect], [key]: value } }));

  const resetEffect = () =>
    setParams((prev) => ({
      ...prev,
      [effect]: Object.fromEntries(active.params.map((p) => [p.key, p.def])),
    }));

  const loadFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      addToast({ title: 'Kırık Cam · Not Glass', message: 'That file is not an image — the kiln only takes pictures.', duration: 2600 });
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const engine = engineRef.current;
      const res = engine.setImage(image, image.naturalWidth, image.naturalHeight);
      engine.fitView();
      URL.revokeObjectURL(url);
      setImg((prev) => ({ name: file.name, w: res.width, h: res.height, version: (prev?.version || 0) + 1 }));
      if (res.downscaled) {
        addToast({ title: 'Pane Trimmed', message: `Large sheet — scaled to ${res.width}×${res.height} to fit the kiln.`, duration: 3000 });
      }
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      addToast({ title: 'Kırık Cam · Broken Pane', message: 'Could not read that image file.', duration: 2600 });
    };
    image.src = url;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadFile(e.dataTransfer.files?.[0]);
  };

  const handleDownload = () => {
    const engine = engineRef.current;
    if (!engine?.ok || !engine.hasImage) return;
    const url = engine.exportPNG(effect, buildUniforms(effect, params[effect], globals, seed));
    const link = document.createElement('a');
    link.download = `vitray_${effect}_${Date.now()}.png`;
    link.href = url;
    link.click();
    addToast({ title: 'Cam Alındı · Pane Lifted', message: 'Your glass has been fired and saved at full resolution.', duration: 3000 });
  };

  // Dragging the liquid panel directly on the pane.
  const pointerToCenter = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const y = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));
    setParams((prev) => ({
      ...prev,
      liquid: { ...prev.liquid, uCenterX: Math.round(x * 100) / 100, uCenterY: Math.round(y * 100) / 100 },
    }));
  };
  const handlePointerDown = (e) => {
    if (effect !== 'liquid') return;
    dragRef.current = true;
    canvasRef.current.setPointerCapture?.(e.pointerId);
    pointerToCenter(e);
  };
  const handlePointerMove = (e) => {
    if (dragRef.current) pointerToCenter(e);
  };
  const handlePointerUp = () => {
    dragRef.current = false;
  };

  return (
    <div className="vitray-page min-h-screen relative" style={{ background: P.bg, color: P.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@300;500;700&family=Sora:wght@300;400;500;600&display=swap');
        .vitray-page { font-family: 'Sora', 'Segoe UI', sans-serif; font-size: 14px; overflow: hidden; }
        .vitray-display { font-family: 'Unbounded', sans-serif; }
        .vitray-label { letter-spacing: 0.22em; text-transform: uppercase; font-weight: 500; }

        /* aurora field */
        .vitray-aurora { position: fixed; inset: 0; pointer-events: none; }
        .vitray-aurora i {
          position: absolute; border-radius: 50%; filter: blur(90px); opacity: 0.5;
          animation: vitray-float 26s ease-in-out infinite alternate;
        }
        .vitray-aurora i:nth-child(1) { width: 620px; height: 620px; left: -12%; top: -18%; background: ${P.violet}; }
        .vitray-aurora i:nth-child(2) { width: 540px; height: 540px; right: -10%; top: 4%; background: ${P.cyan}; animation-delay: -7s; opacity: 0.32; }
        .vitray-aurora i:nth-child(3) { width: 560px; height: 560px; left: 26%; bottom: -28%; background: ${P.magenta}; animation-delay: -14s; opacity: 0.30; }
        .vitray-aurora i:nth-child(4) { width: 340px; height: 340px; right: 22%; bottom: -10%; background: ${P.amber}; animation-delay: -20s; opacity: 0.22; }
        @keyframes vitray-float {
          from { transform: translate3d(0, 0, 0) scale(1); }
          to { transform: translate3d(60px, 40px, 0) scale(1.12); }
        }

        /* glass sheets */
        .vitray-sheet {
          background: linear-gradient(150deg, ${P.glassHi}, ${P.glass} 55%);
          backdrop-filter: blur(18px) saturate(1.5);
          -webkit-backdrop-filter: blur(18px) saturate(1.5);
          border: 1px solid ${P.edge};
          border-radius: 20px;
          box-shadow: 0 18px 48px -22px rgba(0,0,0,0.7), inset 0 1px 0 ${P.edgeHi};
        }
        .vitray-pill {
          background: ${P.glass};
          border: 1px solid ${P.edge};
          border-radius: 999px;
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.18);
          transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .15s ease;
        }
        .vitray-pill:hover { background: ${P.glassHi}; border-color: ${P.edgeHi}; }
        .vitray-pill:active { transform: scale(0.97); }
        .vitray-effect { transition: background .18s ease, border-color .18s ease, box-shadow .18s ease, transform .15s ease; }
        .vitray-effect:hover { transform: translateX(3px); }

        .vitray-pane { display: block; width: 100%; height: auto; touch-action: none; border-radius: 12px; }
        .vitray-pane.liquid { cursor: grab; }
        .vitray-pane.liquid:active { cursor: grabbing; }

        input[type=range].vitray-range {
          -webkit-appearance: none; appearance: none; width: 100%; height: 22px; background: transparent; cursor: pointer;
        }
        input[type=range].vitray-range::-webkit-slider-runnable-track {
          height: 4px; border-radius: 999px;
          background: linear-gradient(90deg, ${P.cyan}, ${P.violet});
          box-shadow: inset 0 0 0 100px rgba(10,14,30,0.35);
        }
        input[type=range].vitray-range::-webkit-slider-thumb {
          -webkit-appearance: none; width: 16px; height: 16px; margin-top: -6px; border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.9);
          box-shadow: 0 2px 10px rgba(94,230,216,0.55), inset 0 -2px 4px rgba(120,140,255,0.45);
        }
        input[type=range].vitray-range::-moz-range-track {
          height: 4px; border-radius: 999px; background: linear-gradient(90deg, ${P.cyan}, ${P.violet});
        }
        input[type=range].vitray-range::-moz-range-thumb {
          width: 16px; height: 16px; border-radius: 50%; background: rgba(255,255,255,0.92);
          border: 1px solid rgba(255,255,255,0.9); box-shadow: 0 2px 10px rgba(94,230,216,0.55);
        }
        input[type=color].vitray-color {
          appearance: none; -webkit-appearance: none; border: 1px solid ${P.edgeHi};
          background: ${P.glass}; width: 38px; height: 24px; padding: 2px; cursor: pointer; border-radius: 999px;
        }
        input[type=color].vitray-color::-webkit-color-swatch-wrapper { padding: 0; }
        input[type=color].vitray-color::-webkit-color-swatch { border: none; border-radius: 999px; }

        .vitray-strip span {
          height: 8px; flex: 1; border-radius: 999px; opacity: 0.85;
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.5);
        }
        .vitray-drop { outline: 2px dashed ${P.cyan}; outline-offset: -12px; }
        .vitray-title {
          background: linear-gradient(100deg, #FFFFFF 10%, ${P.cyan} 38%, ${P.violet} 62%, ${P.magenta} 90%);
          -webkit-background-clip: text; background-clip: text; color: transparent;
        }
      `}</style>

      <Seo
        title="Vitray — The Glass Workshop | Fezcodex"
        description="A liquid-glass studio for your images. Refract any picture through fluted, mosaic, pixel, frosted or liquid glass — dozens of live parameters, full-resolution export."
        keywords={['vitray', 'glass effect', 'fluted glass', 'stained glass', 'frosted glass', 'liquid glass', 'glassmorphism', 'image filter', 'webgl']}
      />

      <div className="vitray-aurora" aria-hidden="true"><i /><i /><i /><i /></div>

      {/* ─── TOP BAR ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20" style={{ background: 'rgba(10,14,30,0.55)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', borderBottom: `1px solid ${P.edge}` }}>
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-3 flex items-center justify-between gap-4">
          <Link to="/apps" className="vitray-pill flex items-center gap-2 px-3.5 py-1.5 hover:opacity-90" style={{ color: P.inkSoft }}>
            <ArrowLeftIcon size={13} />
            <span className="vitray-label text-[10px]">Apps</span>
          </Link>
          <div className="hidden md:flex items-center gap-3" style={{ color: P.inkSoft }}>
            <span className="vitray-label text-[10px]">Cam&nbsp;Atölyesi</span>
            <span className="w-px h-3" style={{ background: P.edge }} />
            <span className="text-[12px]" style={{ color: P.cyan }}>
              {img ? `${img.w} × ${img.h}` : '— × —'}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1500px] px-4 md:px-10 py-6 md:py-10">
        {/* ─── HEADER ────────────────────────────────────────────── */}
        <header className="text-center mb-7 md:mb-9">
          <h1 className="vitray-display vitray-title font-bold" style={{ fontSize: 'clamp(34px,5.5vw,56px)', lineHeight: 1.1, letterSpacing: '0.04em' }}>
            VITRAY
          </h1>
          <div className="vitray-label text-[11px] mt-2.5" style={{ color: P.inkSoft }}>
            The&nbsp;Glass&nbsp;Workshop
          </div>
          <div className="vitray-strip mx-auto mt-4 flex gap-1.5" style={{ maxWidth: 300 }}>
            {PANES.map((c, i) => (
              <span key={i} style={{ background: c }} />
            ))}
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-5 lg:gap-6 items-start">
          {/* ─── LEFT RAIL: glass types ──────────────────────────── */}
          <aside className="w-full lg:w-[235px] shrink-0 flex flex-col gap-4">
            <section className="vitray-sheet p-4">
              <div className="flex items-center gap-2 mb-3" style={{ color: P.inkSoft }}>
                <ImageSquareIcon size={14} />
                <span className="vitray-label text-[10px]">Camlar · Glasses</span>
              </div>
              <div className="flex flex-col gap-2">
                {EFFECTS.map((e) => {
                  const selected = effect === e.id;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => setEffect(e.id)}
                      className="vitray-effect flex items-center gap-3 px-3 py-2.5 text-left"
                      style={{
                        background: selected
                          ? `linear-gradient(120deg, ${e.tone}33, rgba(255,255,255,0.06))`
                          : 'rgba(255,255,255,0.03)',
                        color: selected ? P.ink : P.inkSoft,
                        border: `1px solid ${selected ? `${e.tone}88` : P.edge}`,
                        borderRadius: 14,
                        boxShadow: selected
                          ? `0 0 22px -6px ${e.tone}66, inset 0 1px 0 ${P.edgeHi}`
                          : 'inset 0 1px 0 rgba(255,255,255,0.08)',
                      }}
                    >
                      <e.Icon size={18} weight={selected ? 'fill' : 'regular'} style={{ color: selected ? e.tone : P.inkSoft }} />
                      <span>
                        <span className="block text-[14px] leading-tight font-medium">{e.tr}</span>
                        <span className="vitray-label block text-[9px]" style={{ opacity: 0.65 }}>{e.en}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-[12px] leading-relaxed mt-3.5" style={{ color: P.inkDim }}>
                {active.hint}
              </p>
            </section>

            <section className="vitray-sheet p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2" style={{ color: P.inkSoft }}>
                <SlidersHorizontalIcon size={14} />
                <span className="vitray-label text-[10px]">Finishing</span>
              </div>
              <label className="block" style={{ color: P.inkSoft }}>
                <div className="flex justify-between text-[10px] vitray-label mb-0.5">
                  <span>Vignette</span><span style={{ color: P.ink }}>{globals.vignette.toFixed(2)}</span>
                </div>
                <input className="vitray-range" type="range" min="0" max="1" step="0.01" value={globals.vignette}
                  onChange={(e) => setGlobals((g) => ({ ...g, vignette: Number(e.target.value) }))} />
              </label>
              <label className="block" style={{ color: P.inkSoft }}>
                <div className="flex justify-between text-[10px] vitray-label mb-0.5">
                  <span>Grain</span><span style={{ color: P.ink }}>{globals.grain.toFixed(2)}</span>
                </div>
                <input className="vitray-range" type="range" min="0" max="1" step="0.01" value={globals.grain}
                  onChange={(e) => setGlobals((g) => ({ ...g, grain: Number(e.target.value) }))} />
              </label>
              <button type="button" onClick={() => setSeed(Math.random() * 100)}
                className="vitray-pill flex items-center justify-center gap-2 px-3 py-2 text-[10px] vitray-label"
                style={{ color: P.inkSoft }}>
                <ShuffleIcon size={14} /> Remix&nbsp;Texture
              </button>
            </section>
          </aside>

          {/* ─── THE PANE ────────────────────────────────────────── */}
          <main className="flex-1 w-full min-w-0">
            <div
              className={`vitray-sheet p-2.5 ${dragOver ? 'vitray-drop' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="relative" style={{ background: 'rgba(0,0,0,0.35)', borderRadius: 12 }}>
                {noGL ? (
                  <div className="flex items-center justify-center text-center px-8" style={{ aspectRatio: '3 / 2' }}>
                    <p className="text-[15px]" style={{ color: P.inkSoft }}>
                      The kiln is cold — WebGL is unavailable in this browser, and glass cannot be fired without it.
                    </p>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className={`vitray-pane ${effect === 'liquid' ? 'liquid' : ''}`}
                    style={img ? { aspectRatio: `${img.w} / ${img.h}` } : { aspectRatio: '3 / 2' }}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                  />
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 mt-3 px-1">
              <span className="vitray-label text-[9px]" style={{ color: P.inkDim }}>
                {img ? img.name : 'no pane loaded'} · Vitray · MMXXVI
              </span>
              {effect === 'liquid' && (
                <span className="text-[12px]" style={{ color: P.violet }}>drag the pane to move the panel</span>
              )}
            </div>

            {/* ─── ACTIONS ───────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
              <div className="flex items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => { loadFile(e.target.files?.[0]); e.target.value = ''; }}
                />
                <button type="button" onClick={() => fileRef.current?.click()} disabled={noGL}
                  className="vitray-pill flex items-center gap-2 px-4 py-2.5 text-[10px] vitray-label"
                  style={{ color: P.ink, opacity: noGL ? 0.35 : 1 }}>
                  <UploadSimpleIcon size={15} style={{ color: P.cyan }} /> Load&nbsp;Image
                </button>
                <button type="button" onClick={resetEffect}
                  className="vitray-pill flex items-center gap-2 px-4 py-2.5 text-[10px] vitray-label"
                  style={{ color: P.inkSoft }}>
                  <ArrowCounterClockwiseIcon size={15} /> Reset
                </button>
              </div>
              <button type="button" onClick={handleDownload} disabled={noGL}
                className="vitray-pill flex items-center gap-2 px-5 py-2.5 text-[10px] vitray-label"
                style={{
                  color: '#0A0E1E',
                  background: `linear-gradient(110deg, ${P.cyan}, ${P.violet})`,
                  border: '1px solid rgba(255,255,255,0.45)',
                  boxShadow: `0 6px 26px -8px ${P.cyan}AA, inset 0 1px 0 rgba(255,255,255,0.6)`,
                  fontWeight: 600,
                  opacity: noGL ? 0.35 : 1,
                }}>
                <DownloadSimpleIcon size={15} weight="bold" /> Lift&nbsp;Pane
              </button>
            </div>
          </main>

          {/* ─── RIGHT RAIL: parameters ──────────────────────────── */}
          <aside className="w-full lg:w-[270px] shrink-0">
            <div className="vitray-sheet p-4">
              <div className="flex items-center gap-2 mb-3.5" style={{ color: P.inkSoft }}>
                <SlidersHorizontalIcon size={14} style={{ color: active.tone }} />
                <span className="vitray-label text-[10px]">{active.tr} · Parameters</span>
              </div>
              <div className="flex flex-col gap-3">
                {active.params.map((def) => {
                  if (def.showIf && !def.showIf(params[effect])) return null;
                  const value = params[effect][def.key];
                  if (def.kind === 'choice') {
                    return (
                      <div key={def.key}>
                        <div className="text-[10px] vitray-label mb-1.5" style={{ color: P.inkSoft }}>{def.label}</div>
                        <div className="flex flex-wrap gap-1.5">
                          {def.options.map((opt) => {
                            const selected = value === opt.v;
                            return (
                              <button key={opt.v} type="button" onClick={() => setParam(def.key, opt.v)}
                                className="vitray-pill px-3 py-1 text-[11px]"
                                style={{
                                  background: selected ? `${active.tone}2E` : undefined,
                                  color: selected ? P.ink : P.inkSoft,
                                  borderColor: selected ? `${active.tone}99` : undefined,
                                  boxShadow: selected ? `0 0 14px -4px ${active.tone}77` : undefined,
                                }}>
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }
                  if (def.kind === 'color') {
                    return (
                      <div key={def.key} className="flex items-center justify-between">
                        <span className="text-[10px] vitray-label" style={{ color: P.inkSoft }}>{def.label}</span>
                        <input type="color" className="vitray-color" value={value}
                          onChange={(e) => setParam(def.key, e.target.value)} />
                      </div>
                    );
                  }
                  const shown = def.fmt
                    ? def.fmt(value)
                    : `${def.step < 1 ? value.toFixed(2) : value}${def.unit || ''}`;
                  return (
                    <label key={def.key} className="block" style={{ color: P.inkSoft }}>
                      <div className="flex justify-between text-[10px] vitray-label mb-0.5">
                        <span>{def.label}</span><span style={{ color: P.ink }}>{shown}</span>
                      </div>
                      <input className="vitray-range" type="range"
                        min={def.min} max={def.max} step={def.step} value={value}
                        onChange={(e) => setParam(def.key, Number(e.target.value))} />
                    </label>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default VitrayPage;
