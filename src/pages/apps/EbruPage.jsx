import React, { useEffect, useRef, useReducer, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DropIcon,
  NeedleIcon,
  WavesIcon,
  ArrowArcLeftIcon,
  BroomIcon,
  DownloadSimpleIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import { MarblingTray } from './ebru/marblingEngine';

// ─── EBRU :: design language ─────────────────────────────────────────────
// An Ottoman illuminated-manuscript plate. Warm ivory leaf, gold double rules,
// lacivert (indigo) frames, letter-spaced small-caps Turkish/Latin labels.
// Distinct from Fractal Flora's pressed-fern herbarium.
const P = {
  paper: '#ECE3CD',
  paperDeep: '#E0D5B8',
  card: '#F2EAD6',
  gold: '#B08D3E',
  goldDeep: '#9A7A32',
  indigo: '#1C3A5E',
  ink: '#2B2417',
  inkSoft: '#5C5232',
  rule: 'rgba(176,141,62,0.45)',
};

const WATER = '#ECE3CD';
const LOGICAL_W = 900;
const LOGICAL_H = 600;

// Traditional ebru pigments (boyalar)
const PIGMENTS = [
  { tr: 'Lacivert', en: 'Indigo', hex: '#1F4E6B' },
  { tr: 'Gülkurusu', en: 'Madder', hex: '#B23A2A' },
  { tr: 'Sarı', en: 'Ochre', hex: '#D3A13A' },
  { tr: 'Yeşil', en: 'Sap Green', hex: '#3F7A4E' },
  { tr: 'Turkuaz', en: 'Turquoise', hex: '#1F8F9A' },
  { tr: 'Mor', en: 'Purple', hex: '#6B3F8F' },
  { tr: 'Siyah', en: 'Lamp Black', hex: '#14202A' },
  { tr: 'Beyaz', en: 'White', hex: '#EFE7D2' },
];

const TOOLS = [
  { id: 'dropper', tr: 'Damlalık', en: 'Dropper', Icon: DropIcon, hint: 'Tap the tray to float a drop of pigment.' },
  { id: 'needle', tr: 'Biz', en: 'Needle', Icon: NeedleIcon, hint: 'Drag to draw a single needle through the paint — swirls, tulips, hearts.' },
  { id: 'comb', tr: 'Tarak', en: 'Comb', Icon: WavesIcon, hint: 'Drag a row of tines across the surface to rake furrows.' },
];

const ROMAN = [
  ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400], ['C', 100], ['XC', 90],
  ['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1],
];
function toRoman(n) {
  if (n <= 0) return '—';
  let out = '';
  for (const [sym, val] of ROMAN) {
    while (n >= val) {
      out += sym;
      n -= val;
    }
  }
  return out;
}

function EbruPage() {
  const canvasRef = useRef(null);
  const trayRef = useRef(null);
  const strokeRef = useRef({ active: false, last: null });
  const inkRef = useRef(null); // offscreen canvas holding the raster buffer
  const imgRef = useRef(null); // reusable ImageData for blitting
  const { addToast } = useToast();
  const [, force] = useReducer((x) => x + 1, 0);

  const [tool, setTool] = useState('dropper');
  const [color, setColor] = useState(PIGMENTS[0].hex);
  const [dropSize, setDropSize] = useState(30);
  const [tines, setTines] = useState(14);
  const [spacing, setSpacing] = useState(26);
  const [laying, setLaying] = useState(false);

  const draw = () => {
    const canvas = canvasRef.current;
    const tray = trayRef.current;
    const ink = inkRef.current;
    const img = imgRef.current;
    if (!canvas || !tray || !ink || !img) return;
    img.data.set(tray.buf);
    ink.getContext('2d').putImageData(img, 0, 0);
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(ink, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = LOGICAL_W;
    canvas.height = LOGICAL_H;
    const tray = new MarblingTray({ width: LOGICAL_W, height: LOGICAL_H, water: WATER });
    trayRef.current = tray;
    const ink = document.createElement('canvas');
    ink.width = tray.BW;
    ink.height = tray.BH;
    inkRef.current = ink;
    imgRef.current = ink.getContext('2d').createImageData(tray.BW, tray.BH);
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toLogical = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * LOGICAL_W,
      y: ((e.clientY - rect.top) / rect.height) * LOGICAL_H,
    };
  };

  const handlePointerDown = (e) => {
    const tray = trayRef.current;
    const p = toLogical(e);
    if (tool === 'dropper') {
      tray.drop(p, dropSize, color);
      draw();
      force();
      return;
    }
    canvasRef.current.setPointerCapture?.(e.pointerId);
    tray.beginStroke();
    strokeRef.current = { active: true, last: p };
  };

  const handlePointerMove = (e) => {
    const stroke = strokeRef.current;
    if (!stroke.active) return;
    const tray = trayRef.current;
    const p = toLogical(e);
    const dxm = p.x - stroke.last.x;
    const dym = p.y - stroke.last.y;
    if (Math.abs(dxm) < 0.01 && Math.abs(dym) < 0.01) return;
    if (tool === 'comb') {
      tray.stroke(stroke.last, p, { kind: 'comb', tines, spacing });
    } else {
      tray.stroke(stroke.last, p, { kind: 'needle' });
    }
    stroke.last = p;
    draw();
  };

  const endStroke = () => {
    const stroke = strokeRef.current;
    if (!stroke.active) return;
    trayRef.current.endStroke();
    stroke.active = false;
    draw();
    force();
  };

  const handleUndo = () => {
    if (trayRef.current.undo()) {
      draw();
      force();
    }
  };

  const handleNewTray = () => {
    trayRef.current.clear();
    draw();
    force();
  };

  const handleLayPaper = () => {
    const tray = trayRef.current;
    if (tray.isEmpty) {
      addToast({ title: 'Boş Tekne · Empty Tray', message: 'Float some pigment before lifting the paper.', duration: 2600 });
      return;
    }
    setLaying(true);
    window.setTimeout(() => setLaying(false), 650);
    const scale = 2;
    const off = document.createElement('canvas');
    off.width = tray.BW * scale;
    off.height = tray.BH * scale;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = true;
    octx.drawImage(inkRef.current, 0, 0, off.width, off.height);
    const link = document.createElement('a');
    link.download = `ebru_${Date.now()}.png`;
    link.href = off.toDataURL('image/png');
    link.click();
    addToast({ title: 'Kâğıt Alındı · Paper Lifted', message: 'Your marbled sheet has been pressed and saved.', duration: 3000 });
  };

  const tray = trayRef.current;
  const ops = tray ? tray.opCount : 0;
  const canUndo = tray ? tray.history.length > 0 : false;
  const isEmpty = tray ? tray.isEmpty : true;
  const activeTool = TOOLS.find((t) => t.id === tool) || TOOLS[0];

  return (
    <div className="ebru-page min-h-screen relative" style={{ background: P.paper, color: P.ink }}>
      <style>{`
        .ebru-page { font-family: 'EB Garamond', 'Iowan Old Style', Georgia, serif; }
        .ebru-display { font-family: 'EB Garamond', Georgia, 'Times New Roman', serif; }
        .ebru-label { letter-spacing: 0.28em; text-transform: uppercase; }
        .ebru-frame {
          border: 2px solid ${P.gold};
          box-shadow: inset 0 0 0 2px ${P.paper}, inset 0 0 0 4px ${P.gold};
        }
        .ebru-swatch { transition: transform .12s ease, box-shadow .12s ease; }
        .ebru-swatch:hover { transform: translateY(-1px); }
        .ebru-tool { transition: background .15s ease, color .15s ease, border-color .15s ease; }
        .ebru-canvas { touch-action: none; cursor: crosshair; display: block; width: 100%; height: auto; }
        .ebru-lift {
          position: absolute; inset: 0; pointer-events: none; background: ${P.paper};
          opacity: 0; border-radius: 2px;
        }
        .ebru-lift.on { animation: ebru-lift-anim 0.65s ease; }
        @keyframes ebru-lift-anim {
          0% { opacity: 0; transform: translateY(0); }
          35% { opacity: 0.9; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-14px); }
        }
        input[type=range].ebru-range { accent-color: ${P.indigo}; width: 100%; }
      `}</style>

      <Seo
        title="Ebru — The Marbling Tray | Fezcodex"
        description="A hands-on Turkish paper-marbling (ebru) studio. Float pigments on water, comb them with the biz and tarak, and lift your marbled sheet. Su ebrusu."
        keywords={['ebru', 'marbling', 'su marbling', 'turkish art', 'generative art', 'paper marbling', 'suminagashi']}
      />

      {/* ─── TOP BAR ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 backdrop-blur-[2px]" style={{ background: `${P.paper}EE`, borderBottom: `1px solid ${P.rule}` }}>
        <div className="mx-auto max-w-[1500px] px-5 md:px-10 py-3 flex items-center justify-between gap-4">
          <Link to="/apps" className="flex items-center gap-2 transition-opacity hover:opacity-60" style={{ color: P.inkSoft }}>
            <ArrowLeftIcon size={14} />
            <span className="ebru-label text-[10px]">Return&nbsp;to&nbsp;Apps</span>
          </Link>
          <div className="hidden md:flex items-center gap-3" style={{ color: P.inkSoft }}>
            <DropIcon size={14} style={{ color: P.indigo }} />
            <span className="ebru-label text-[10px]">Su&nbsp;Ebrusu</span>
            <span className="w-px h-3" style={{ background: P.rule }} />
            <span className="ebru-display italic text-[14px]" style={{ color: P.goldDeep }}>
              levha n° {String(ops).padStart(3, '0')}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1500px] px-4 md:px-10 py-6 md:py-10">
        {/* ─── HEADER BAND ───────────────────────────────────────── */}
        <header className="text-center mb-6 md:mb-8">
          <div className="ebru-label text-[10px] mb-1" style={{ color: P.gold }}>۞&nbsp;&nbsp;۞&nbsp;&nbsp;۞</div>
          <h1 className="ebru-display italic" style={{ color: P.indigo, fontSize: 'clamp(40px,7vw,68px)', lineHeight: 1 }}>
            Ebru
          </h1>
          <div className="ebru-label text-[11px] mt-2" style={{ color: P.inkSoft }}>
            The&nbsp;Marbling&nbsp;Tray
          </div>
          <div className="mx-auto mt-3" style={{ height: 1, width: 220, background: P.gold }} />
        </header>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* ─── LEFT RAIL ───────────────────────────────────────── */}
          <aside className="w-full lg:w-[280px] shrink-0 flex flex-col gap-6">
            {/* Pigments */}
            <section>
              <div className="flex items-center gap-2 mb-3" style={{ color: P.goldDeep }}>
                <PaletteIcon size={14} />
                <span className="ebru-label text-[10px]">Boyalar · Pigments</span>
              </div>
              <div className="grid grid-cols-4 gap-2.5">
                {PIGMENTS.map((pig) => {
                  const selected = color === pig.hex;
                  return (
                    <button
                      key={pig.hex}
                      type="button"
                      title={`${pig.tr} · ${pig.en}`}
                      onClick={() => setColor(pig.hex)}
                      className="ebru-swatch aspect-square rounded-full"
                      style={{
                        background: pig.hex,
                        boxShadow: selected
                          ? `0 0 0 2px ${P.paper}, 0 0 0 4px ${P.indigo}`
                          : `0 0 0 1px ${P.rule}`,
                        border: pig.hex === '#EFE7D2' ? `1px solid ${P.rule}` : 'none',
                      }}
                    />
                  );
                })}
              </div>
            </section>

            {/* Tools */}
            <section>
              <div className="flex items-center gap-2 mb-3" style={{ color: P.goldDeep }}>
                <SlidersHorizontalIcon size={14} />
                <span className="ebru-label text-[10px]">Aletler · Tools</span>
              </div>
              <div className="flex flex-col gap-2">
                {TOOLS.map((t) => {
                  const selected = tool === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTool(t.id)}
                      className="ebru-tool flex items-center gap-3 px-3 py-2.5 rounded-[3px] text-left"
                      style={{
                        background: selected ? P.indigo : 'transparent',
                        color: selected ? P.card : P.ink,
                        border: `1px solid ${selected ? P.indigo : P.rule}`,
                      }}
                    >
                      <t.Icon size={18} weight={selected ? 'fill' : 'regular'} />
                      <span>
                        <span className="block text-[13px] leading-tight">{t.tr}</span>
                        <span className="block text-[10px] ebru-label" style={{ opacity: 0.7 }}>{t.en}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Contextual sliders */}
            <section className="flex flex-col gap-4" style={{ color: P.inkSoft }}>
              {tool === 'dropper' && (
                <label className="block">
                  <div className="flex justify-between text-[11px] ebru-label mb-1">
                    <span>Drop Size</span><span>{dropSize}</span>
                  </div>
                  <input className="ebru-range" type="range" min="8" max="80" value={dropSize}
                    onChange={(e) => setDropSize(Number(e.target.value))} />
                </label>
              )}
              {tool === 'comb' && (
                <>
                  <label className="block">
                    <div className="flex justify-between text-[11px] ebru-label mb-1">
                      <span>Tines</span><span>{tines}</span>
                    </div>
                    <input className="ebru-range" type="range" min="2" max="40" value={tines}
                      onChange={(e) => setTines(Number(e.target.value))} />
                  </label>
                  <label className="block">
                    <div className="flex justify-between text-[11px] ebru-label mb-1">
                      <span>Spacing</span><span>{spacing}</span>
                    </div>
                    <input className="ebru-range" type="range" min="10" max="70" value={spacing}
                      onChange={(e) => setSpacing(Number(e.target.value))} />
                  </label>
                </>
              )}
              <p className="text-[12px] italic leading-snug" style={{ color: P.inkSoft }}>
                {activeTool.hint}
              </p>
            </section>
          </aside>

          {/* ─── THE TRAY ────────────────────────────────────────── */}
          <main className="flex-1 w-full min-w-0">
            <div className="ebru-frame rounded-[2px] p-2" style={{ background: P.indigo }}>
              <div className="relative" style={{ background: WATER }}>
                <canvas
                  ref={canvasRef}
                  className="ebru-canvas"
                  style={{ aspectRatio: `${LOGICAL_W} / ${LOGICAL_H}` }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={endStroke}
                  onPointerLeave={endStroke}
                  onPointerCancel={endStroke}
                />
                <div className={`ebru-lift ${laying ? 'on' : ''}`} />
                {isEmpty && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none px-6 text-center">
                    <span className="ebru-display italic text-[15px] md:text-[18px]" style={{ color: P.inkSoft, opacity: 0.7 }}>
                      Tap the tray with the Damlalık to float your first pigment.
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-center mt-3 ebru-label text-[10px]" style={{ color: P.inkSoft }}>
              Levha&nbsp;{toRoman(Math.max(1, Math.ceil(ops / 8)))} · Su&nbsp;Ebrusu · MMXXVI
            </div>

            {/* ─── ACTIONS ───────────────────────────────────────── */}
            <div className="flex flex-wrap items-center justify-between gap-3 mt-5 pt-4" style={{ borderTop: `1px solid ${P.rule}` }}>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleUndo} disabled={!canUndo}
                  className="flex items-center gap-2 px-3 py-2 rounded-[3px] text-[12px] ebru-label transition-opacity"
                  style={{ border: `1px solid ${P.indigo}`, color: P.indigo, opacity: canUndo ? 1 : 0.35 }}>
                  <ArrowArcLeftIcon size={15} /> Geri · Undo
                </button>
                <button type="button" onClick={handleNewTray}
                  className="flex items-center gap-2 px-3 py-2 rounded-[3px] text-[12px] ebru-label"
                  style={{ border: `1px solid ${P.indigo}`, color: P.indigo }}>
                  <BroomIcon size={15} /> Yeni&nbsp;Tekne · New&nbsp;Tray
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleLayPaper}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-[3px] text-[12px] ebru-label"
                  style={{ background: P.indigo, color: P.card }}>
                  <DownloadSimpleIcon size={15} /> Kâğıdı&nbsp;Al · Lay&nbsp;Paper
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default EbruPage;
