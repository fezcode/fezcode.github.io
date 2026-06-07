import React, { useEffect, useRef, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowsClockwiseIcon,
  TrashIcon,
  DownloadSimpleIcon,
  FlaskIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
  CirclesThreeIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import { Culture, PRESETS, PALETTES } from './morphogenesis/reactionDiffusion';

// ─── MORPHOGENESIS :: design language ────────────────────────────────────
// A clinical microscopy bench. Bone-white lab card, lab-teal accents, a glass
// petri dish holding the living culture, technical mono read-outs. Distinct
// from Ebru's Ottoman ivory and Fractal Flora's herbarium.
const P = {
  bg: '#E7E4DC',
  panel: '#F3F1EA',
  card: '#FBFAF5',
  ink: '#23282E',
  inkSoft: '#5A6168',
  line: 'rgba(35,40,46,0.16)',
  accent: '#2E6E6A',
  accentDeep: '#22524F',
  glass: '#C9D2D0',
};

const GRID = 200; // square grid -> circular dish

function MorphogenesisLabPage() {
  const canvasRef = useRef(null);
  const offRef = useRef(null);
  const imgRef = useRef(null);
  const cultureRef = useRef(null);
  const rafRef = useRef(0);
  const runningRef = useRef(true);
  const speedRef = useRef(8);
  const brushRef = useRef(6);
  const paletteRef = useRef(PALETTES[0]);
  const paintingRef = useRef(false);
  const frameRef = useRef(0);
  const { addToast } = useToast();
  const [, force] = useReducer((x) => x + 1, 0);

  const [presetId, setPresetId] = useState(PRESETS[0].id);
  const [paletteId, setPaletteId] = useState(PALETTES[0].id);
  const [running, setRunning] = useState(true);
  const [speed, setSpeed] = useState(8);
  const [brush, setBrush] = useState(6);

  const renderFrame = () => {
    const culture = cultureRef.current;
    const off = offRef.current;
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (!culture || !off || !img || !canvas) return;
    culture.render(img.data, paletteRef.current.stops);
    off.getContext('2d').putImageData(img, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = GRID;
    canvas.height = GRID;
    const culture = new Culture({ width: GRID, height: GRID, preset: PRESETS[0] });
    culture.seedRandom(14, 5);
    cultureRef.current = culture;

    const off = document.createElement('canvas');
    off.width = GRID;
    off.height = GRID;
    offRef.current = off;
    imgRef.current = off.getContext('2d').createImageData(GRID, GRID);

    const loop = () => {
      const c = cultureRef.current;
      if (runningRef.current && c) c.step(speedRef.current);
      renderFrame();
      frameRef.current += 1;
      if (frameRef.current % 20 === 0) force(); // throttled UI read-out refresh
      rafRef.current = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toGrid = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * GRID,
      y: ((e.clientY - rect.top) / rect.height) * GRID,
    };
  };

  const paint = (e) => {
    const p = toGrid(e);
    cultureRef.current.seed(p.x, p.y, brushRef.current);
    if (!runningRef.current) renderFrame();
  };

  const handlePointerDown = (e) => {
    canvasRef.current.setPointerCapture?.(e.pointerId);
    paintingRef.current = true;
    paint(e);
    force(); // hide the inoculate hint as soon as life is added
  };
  const handlePointerMove = (e) => {
    if (paintingRef.current) paint(e);
  };
  const endPaint = () => {
    paintingRef.current = false;
  };

  const choosePreset = (preset) => {
    setPresetId(preset.id);
    cultureRef.current.setPreset(preset);
  };

  const choosePalette = (pal) => {
    setPaletteId(pal.id);
    paletteRef.current = pal;
    renderFrame();
  };

  const toggleRun = () => {
    const next = !running;
    setRunning(next);
    runningRef.current = next;
  };

  const handleReseed = () => {
    const c = cultureRef.current;
    c.reset();
    c.seedRandom(14, 5);
    renderFrame();
    force();
  };

  const handleClear = () => {
    cultureRef.current.reset();
    renderFrame();
    force();
  };

  const handleSave = () => {
    const culture = cultureRef.current;
    if (culture.isEmpty) {
      addToast({ title: 'Empty Dish', message: 'Inoculate the culture before capturing it.', duration: 2600 });
      return;
    }
    const scale = 4;
    const out = document.createElement('canvas');
    out.width = GRID * scale;
    out.height = GRID * scale;
    const octx = out.getContext('2d');
    octx.imageSmoothingEnabled = true;
    octx.drawImage(offRef.current, 0, 0, out.width, out.height);
    const link = document.createElement('a');
    link.download = `morphogenesis_${presetId}_${Date.now()}.png`;
    link.href = out.toDataURL('image/png');
    link.click();
    addToast({ title: 'Specimen Captured', message: `Culture ${presetId} · gen ${culture.generation}.`, duration: 3000 });
  };

  const culture = cultureRef.current;
  const generation = culture ? culture.generation : 0;
  const showHint = culture ? culture.isEmpty : true;
  const activePreset = PRESETS.find((p) => p.id === presetId) || PRESETS[0];

  return (
    <div className="morph-page min-h-screen relative" style={{ background: P.bg, color: P.ink }}>
      <style>{`
        .morph-page { font-family: 'Helvetica Neue', Inter, Arial, sans-serif; }
        .morph-mono { font-family: 'Space Mono', 'JetBrains Mono', monospace; }
        .morph-label { letter-spacing: 0.26em; text-transform: uppercase; }
        .morph-dish {
          border-radius: 50%;
          box-shadow:
            inset 0 2px 10px rgba(255,255,255,0.55),
            inset 0 -8px 26px rgba(35,40,46,0.35),
            0 0 0 6px ${P.card},
            0 0 0 8px ${P.glass},
            0 18px 46px rgba(35,40,46,0.28);
        }
        .morph-canvas { display: block; width: 100%; height: 100%; border-radius: 50%; touch-action: none; cursor: crosshair; }
        .morph-btn { transition: background .15s ease, color .15s ease, border-color .15s ease; }
        input[type=range].morph-range { accent-color: ${P.accent}; width: 100%; }
      `}</style>

      <Seo
        title="Morphogenesis — Reaction-Diffusion Culture | Fezcodex"
        description="Grow living Turing patterns — spots, coral, mazes, fingerprints — from a Gray-Scott reaction-diffusion model. Inoculate the dish and watch morphogenesis unfold."
        keywords={['reaction diffusion', 'gray-scott', 'turing patterns', 'morphogenesis', 'generative art', 'cellular', 'simulation']}
      />

      {/* TOP BAR */}
      <div className="sticky top-0 z-20 backdrop-blur-[2px]" style={{ background: `${P.bg}EE`, borderBottom: `1px solid ${P.line}` }}>
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-3 flex items-center justify-between gap-4">
          <Link to="/apps" className="flex items-center gap-2 transition-opacity hover:opacity-60" style={{ color: P.inkSoft }}>
            <ArrowLeftIcon size={14} />
            <span className="morph-mono morph-label text-[10px]">Return&nbsp;to&nbsp;Apps</span>
          </Link>
          <div className="hidden md:flex items-center gap-3" style={{ color: P.inkSoft }}>
            <FlaskIcon size={14} style={{ color: P.accent }} />
            <span className="morph-mono morph-label text-[10px]">Culture&nbsp;Lab</span>
            <span className="w-px h-3" style={{ background: P.line }} />
            <span className="morph-mono text-[12px]" style={{ color: P.accentDeep }}>
              gen&nbsp;{String(generation).padStart(6, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 md:px-10 py-6 md:py-10">
        {/* HEADER */}
        <header className="text-center mb-6 md:mb-8">
          <div className="morph-mono morph-label text-[10px] mb-2" style={{ color: P.accent }}>Reaction–Diffusion Culture</div>
          <h1 style={{ fontWeight: 700, letterSpacing: '-0.01em', fontSize: 'clamp(34px,6vw,60px)', lineHeight: 1 }}>
            Morphogenesis
          </h1>
          <div className="mx-auto mt-3" style={{ height: 2, width: 60, background: P.accent }} />
        </header>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-start">
          {/* LEFT RAIL */}
          <aside className="w-full lg:w-[300px] shrink-0 flex flex-col gap-6">
            <section>
              <div className="flex items-center gap-2 mb-3" style={{ color: P.accentDeep }}>
                <CirclesThreeIcon size={14} />
                <span className="morph-mono morph-label text-[10px]">Recipes · Feed / Kill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {PRESETS.map((preset) => {
                  const selected = presetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => choosePreset(preset)}
                      className="morph-btn px-3 py-2.5 rounded-[4px] text-left"
                      style={{
                        background: selected ? P.accent : P.card,
                        color: selected ? P.card : P.ink,
                        border: `1px solid ${selected ? P.accent : P.line}`,
                      }}
                    >
                      <span className="block text-[13px] font-semibold leading-tight">{preset.name}</span>
                      <span className="block morph-mono text-[9px]" style={{ opacity: 0.7 }}>
                        f {preset.f.toFixed(3)} · k {preset.k.toFixed(3)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-2 mb-3" style={{ color: P.accentDeep }}>
                <PaletteIcon size={14} />
                <span className="morph-mono morph-label text-[10px]">Stain</span>
              </div>
              <div className="flex gap-2.5">
                {PALETTES.map((pal) => {
                  const selected = paletteId === pal.id;
                  const grad = `linear-gradient(135deg, ${pal.stops
                    .map(([pos, c]) => `rgb(${c[0]},${c[1]},${c[2]}) ${Math.round(pos * 100)}%`)
                    .join(', ')})`;
                  return (
                    <button
                      key={pal.id}
                      type="button"
                      title={pal.name}
                      onClick={() => choosePalette(pal)}
                      className="morph-btn h-9 flex-1 rounded-[4px]"
                      style={{
                        background: grad,
                        boxShadow: selected ? `0 0 0 2px ${P.bg}, 0 0 0 4px ${P.accent}` : `0 0 0 1px ${P.line}`,
                      }}
                    />
                  );
                })}
              </div>
            </section>

            <section className="flex flex-col gap-4" style={{ color: P.inkSoft }}>
              <div className="flex items-center gap-2" style={{ color: P.accentDeep }}>
                <SlidersHorizontalIcon size={14} />
                <span className="morph-mono morph-label text-[10px]">Controls</span>
              </div>
              <label className="block">
                <div className="flex justify-between morph-mono text-[11px] mb-1">
                  <span>Growth Rate</span><span>{speed}×</span>
                </div>
                <input className="morph-range" type="range" min="1" max="16" value={speed}
                  onChange={(e) => { const v = Number(e.target.value); setSpeed(v); speedRef.current = v; }} />
              </label>
              <label className="block">
                <div className="flex justify-between morph-mono text-[11px] mb-1">
                  <span>Inoculation Brush</span><span>{brush}px</span>
                </div>
                <input className="morph-range" type="range" min="2" max="20" value={brush}
                  onChange={(e) => { const v = Number(e.target.value); setBrush(v); brushRef.current = v; }} />
              </label>
              <p className="text-[12px] leading-snug" style={{ color: P.inkSoft }}>
                Drag across the dish to inoculate the culture with living agent (B). Different recipes settle into
                spots, coral, mazes or fingerprints.
              </p>
            </section>
          </aside>

          {/* DISH */}
          <main className="flex-1 w-full min-w-0 flex flex-col items-center">
            <div className="morph-dish relative" style={{ width: 'min(72vw, 560px)', aspectRatio: '1 / 1', background: '#0c1416' }}>
              <canvas
                ref={canvasRef}
                className="morph-canvas"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endPaint}
                onPointerLeave={endPaint}
                onPointerCancel={endPaint}
              />
              {showHint && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none text-center"
                  style={{ padding: '0 14%' }}
                >
                  <span className="morph-mono morph-label" style={{ color: 'rgba(233,226,199,0.85)', fontSize: '12px', lineHeight: 1.7 }}>
                    Click or drag to
                    <br />
                    inoculate the culture
                  </span>
                </div>
              )}
            </div>
            <div className="morph-mono text-[10px] morph-label mt-4 text-center" style={{ color: P.inkSoft }}>
              Culture&nbsp;·&nbsp;{activePreset.name}&nbsp;·&nbsp;f&nbsp;{activePreset.f.toFixed(3)}&nbsp;·&nbsp;k&nbsp;{activePreset.k.toFixed(3)}&nbsp;·&nbsp;gen&nbsp;{generation}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-6 pt-5 w-full" style={{ borderTop: `1px solid ${P.line}` }}>
              <button type="button" onClick={toggleRun}
                className="morph-btn flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-[12px] morph-mono morph-label"
                style={{ background: P.accent, color: P.card }}>
                {running ? <PauseIcon size={15} weight="fill" /> : <PlayIcon size={15} weight="fill" />}
                {running ? 'Pause' : 'Grow'}
              </button>
              <button type="button" onClick={handleReseed}
                className="morph-btn flex items-center gap-2 px-3 py-2.5 rounded-[4px] text-[12px] morph-mono morph-label"
                style={{ border: `1px solid ${P.accent}`, color: P.accentDeep }}>
                <ArrowsClockwiseIcon size={15} /> Reseed
              </button>
              <button type="button" onClick={handleClear}
                className="morph-btn flex items-center gap-2 px-3 py-2.5 rounded-[4px] text-[12px] morph-mono morph-label"
                style={{ border: `1px solid ${P.line}`, color: P.inkSoft }}>
                <TrashIcon size={15} /> Clear
              </button>
              <button type="button" onClick={handleSave}
                className="morph-btn flex items-center gap-2 px-4 py-2.5 rounded-[4px] text-[12px] morph-mono morph-label"
                style={{ background: P.ink, color: P.card }}>
                <DownloadSimpleIcon size={15} /> Capture
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default MorphogenesisLabPage;
