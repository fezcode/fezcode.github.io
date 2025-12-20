import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Trash,
  ArrowsClockwise,
  TextAa,
  Selection,
  Info,
  DownloadSimple,
  PaintBrush,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';

const LAYOUTS = [
  { id: 'bauhaus', label: 'BAUHAUS_GRID' },
  { id: 'technical', label: 'TECH_SPEC' },
  { id: 'minimal', label: 'THE_VOID' },
  { id: 'column', label: 'THE_COLUMN' },
  { id: 'diagonal', label: 'DIAGONAL_SCAN' },
];

const COLORS = [
  { name: 'Pure Void', hex: '#050505', text: '#FFFFFF' },
  { name: 'Emerald Flux', hex: '#10b981', text: '#000000' },
  { name: 'Salmon Signal', hex: '#FA8072', text: '#000000' },
  { name: 'Cyber Cyan', hex: '#00FFFF', text: '#000000' },
  { name: 'Neon Violet', hex: '#a855f7', text: '#000000' },
  { name: 'Amber Warning', hex: '#f59e0b', text: '#000000' },
  { name: 'White Light', hex: '#FFFFFF', text: '#000000' },
];

const PosterLoomPage = () => {
  const appName = 'Poster Loom';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Construct high-impact brutalist posters with generative shapes and technical typography.',
    keywords: ['Fezcodex', 'poster generator', 'brutalist design', 'generative art', 'typography tool'],
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // Poster State
  const [layout, setLayout] = useState('bauhaus');
  const [primaryColor, setPrimaryColor] = useState(COLORS[0]);
  const [accentColor, setAccentColor] = useState(COLORS[1]);
  const [headerText, setHeaderText] = useState('FEZCODEX');
  const [subHeaderText, setSubHeaderText] = useState('ARCHITECTURAL_THOUGHTS');
  const [sidebarText, setSidebarText] = useState('DATA_NODE_049');
  const [footerText, setFooterText] = useState('SYSTEM_INTEGRITY_VERIFIED // BUILD_2025');
  const [headerSize, setHeaderSize] = useState(120);
  const [subHeaderSize, setSubHeaderSize] = useState(24);
  const [sidebarSize, setSidebarSize] = useState(18);
  const [footerSize, setFooterSize] = useState(14);
  const [noiseOpacity, setNoiseOpacity] = useState(0.1);
  const [gridOpacity, setGridOpacity] = useState(0.2);
  const [seed, setSeed] = useState(Math.random());

  const drawPoster = useCallback((ctx, width, height) => {
    const scale = width / 1000;
    const padding = 60 * scale;

    // 1. Background
    ctx.fillStyle = primaryColor.hex;
    ctx.fillRect(0, 0, width, height);

    // 2. Grid Layer
    if (gridOpacity > 0) {
      ctx.strokeStyle = accentColor.hex;
      ctx.globalAlpha = gridOpacity;
      ctx.lineWidth = 1 * scale;
      const gridSize = 50 * scale;

      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    }

    // 3. Generative Shapes (based on seed)
    const rng = (s) => {
      let v = s * 12345.678;
      return () => {
        v = (v * 987.654) % 1;
        return v;
      };
    };
    const getRand = rng(seed);

    ctx.save();
    ctx.strokeStyle = accentColor.hex;
    ctx.lineWidth = 2 * scale;

    // Draw layout-specific shapes
    if (layout === 'bauhaus') {
      for (let i = 0; i < 5; i++) {
        ctx.strokeRect(getRand() * width, getRand() * height, 200 * scale * getRand(), 200 * scale * getRand());
        ctx.beginPath();
        ctx.arc(getRand() * width, getRand() * height, 100 * scale * getRand(), 0, Math.PI * 2);
        ctx.stroke();
      }
    } else if (layout === 'technical') {
      ctx.beginPath();
      ctx.moveTo(width / 2, padding);
      ctx.lineTo(width / 2, height - padding);
      ctx.stroke();
      for (let i = 0; i < 10; i++) {
        const y = padding + getRand() * (height - padding * 2);
        ctx.strokeRect(width / 2 - 20 * scale, y, 40 * scale, 2 * scale);
      }
    } else if (layout === 'minimal') {
      // The Void: Central Crosshair
      const cx = width / 2;
      const cy = height / 2;
      const size = 100 * scale;
      ctx.beginPath();
      ctx.moveTo(cx - size, cy);
      ctx.lineTo(cx + size, cy);
      ctx.moveTo(cx, cy - size);
      ctx.lineTo(cx, cy + size);
      ctx.stroke();
      ctx.strokeRect(cx - size / 4, cy - size / 4, size / 2, size / 2);
    } else if (layout === 'column') {
      // The Column: Vertical Structural Element
      const colX = padding * 3;
      ctx.beginPath();
      ctx.moveTo(colX, padding);
      ctx.lineTo(colX, height - padding);
      ctx.stroke();

      for (let i = 0; i < 20; i++) {
        const y = padding + (i * (height - padding * 2) / 20);
        ctx.strokeRect(colX - 10 * scale, y, 20 * scale, 1 * scale);
      }
    } else if (layout === 'diagonal') {
      // Diagonal Scan: 45-degree rotated lines
      ctx.save();
      ctx.globalAlpha = gridOpacity;
      ctx.lineWidth = 2 * scale;
      const step = 40 * scale;
      for (let i = -height; i < width + height; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + height, height);
        ctx.stroke();
      }
      ctx.restore();
    }
    ctx.restore();

    // 4. Typography
    ctx.fillStyle = accentColor.hex;
    ctx.textBaseline = 'top';

    // Header
    ctx.font = `bold ${headerSize * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(headerText.toUpperCase(), padding, padding);

    // Subheader
    ctx.font = `bold ${subHeaderSize * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(subHeaderText.toUpperCase(), padding, padding + (headerSize + 20) * scale);

    // Sidebar (Vertical)
    ctx.save();
    ctx.translate(width - padding, height / 2);
    ctx.rotate(Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = `bold ${sidebarSize * scale}px "JetBrains Mono", monospace`;
    ctx.fillText(sidebarText.toUpperCase(), 0, 0);
    ctx.restore();

    // Footer
    ctx.font = `bold ${footerSize * scale}px "JetBrains Mono", monospace`;
    ctx.textAlign = 'left';
    ctx.fillText(footerText.toUpperCase(), padding, height - padding - footerSize * scale);

    // 5. Border
    ctx.strokeStyle = accentColor.hex;
    ctx.lineWidth = 10 * scale;
    ctx.strokeRect(padding / 2, padding / 2, width - padding, height - padding);

    // 6. Noise Layer
    if (noiseOpacity > 0) {
      const noiseSize = 256;
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = noiseSize;
      noiseCanvas.height = noiseSize;
      const nCtx = noiseCanvas.getContext('2d');
      const nData = nCtx.createImageData(noiseSize, noiseSize);
      for (let i = 0; i < nData.data.length; i += 4) {
        const val = Math.random() * 255;
        nData.data[i] = nData.data[i+1] = nData.data[i+2] = val;
        nData.data[i+3] = 255;
      }
      nCtx.putImageData(nData, 0, 0);

      ctx.save();
      ctx.globalAlpha = noiseOpacity;
      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }, [layout, primaryColor, accentColor, headerText, subHeaderText, sidebarText, footerText, headerSize, subHeaderSize, sidebarSize, footerSize, noiseOpacity, gridOpacity, seed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawPoster(ctx, rect.width, rect.height);
  }, [drawPoster]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 2160; // 4K vertical-ish scale
    const H = 3240;
    canvas.width = W;
    canvas.height = H;

    drawPoster(ctx, W, H);

    const link = document.createElement('a');
    link.download = `poster-loom-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({ title: 'EXPORT_SUCCESS', message: 'High-fidelity poster sequence generated.' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeft weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Poster construct protocol. Map character strings and geometric entities onto a structured grid to generate high-impact visual sequences.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
            >
              <DownloadSimple weight="bold" size={24} />
              <span>Generate Master</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* LEFT: Controls */}
          <div className="lg:col-span-4 space-y-8">
            {/* Layout & Colors */}
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <Selection weight="fill" />
                  Structure_Protocols
                </h3>
                <button
                  onClick={() => setSeed(Math.random())}
                  className="p-1.5 text-gray-500 hover:text-emerald-500 transition-colors"
                  title="Regenerate Layout Entities"
                >
                  <ArrowsClockwise weight="bold" size={14} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-2">
                  {LAYOUTS.map((l) => (
                    <button
                      key={l.id}
                      onClick={() => setLayout(l.id)}
                      className={`py-3 text-[9px] font-mono uppercase tracking-widest border transition-all ${layout === l.id ? 'bg-white text-black border-white' : 'border-white/5 text-gray-600 hover:border-white/20'}`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <label className="block font-mono text-[9px] uppercase text-gray-600">Base_Chromatic</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setPrimaryColor(c)}
                        className={`w-8 h-8 rounded-full border-2 ${primaryColor.hex === c.hex ? 'border-emerald-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block font-mono text-[9px] uppercase text-gray-600">Accent_Chromatic</label>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setAccentColor(c)}
                        className={`w-8 h-8 rounded-full border-2 ${accentColor.hex === c.hex ? 'border-emerald-500 scale-110' : 'border-transparent'}`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Inputs */}
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <TextAa weight="fill" />
                String_Mapping
              </h3>

              <div className="space-y-10">
                {/* Header Config */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-mono text-[9px] uppercase text-gray-600">Primary_Header</label>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-gray-700">{headerSize}PX</span>
                      <input type="range" min="20" max="250" value={headerSize} onChange={(e) => setHeaderSize(parseInt(e.target.value))} className="w-20 accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={headerText}
                    onChange={(e) => setHeaderText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* SubHeader Config */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-mono text-[9px] uppercase text-gray-600">Secondary_Header</label>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-gray-700">{subHeaderSize}PX</span>
                      <input type="range" min="8" max="80" value={subHeaderSize} onChange={(e) => setSubHeaderSize(parseInt(e.target.value))} className="w-20 accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={subHeaderText}
                    onChange={(e) => setSubHeaderText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* Sidebar Config */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-mono text-[9px] uppercase text-gray-600">Lateral_Registry</label>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-gray-700">{sidebarSize}PX</span>
                      <input type="range" min="8" max="60" value={sidebarSize} onChange={(e) => setSidebarSize(parseInt(e.target.value))} className="w-20 accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={sidebarText}
                    onChange={(e) => setSidebarText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                  />
                </div>

                {/* Footer Config */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="block font-mono text-[9px] uppercase text-gray-600">Bottom_Registry</label>
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-gray-700">{footerSize}PX</span>
                      <input type="range" min="8" max="60" value={footerSize} onChange={(e) => setFooterSize(parseInt(e.target.value))} className="w-20 accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                    </div>
                  </div>
                  <input
                    type="text"
                    value={footerText}
                    onChange={(e) => setFooterText(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 p-3 font-mono text-xs uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Visual Filters */}
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <PaintBrush weight="fill" />
                Diffusion_Filters
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                    <span>Noise_Entropy</span>
                    <span>{Math.round(noiseOpacity * 100)}%</span>
                  </div>
                  <input type="range" min="0" max="0.5" step="0.01" value={noiseOpacity} onChange={(e) => setNoiseOpacity(parseFloat(e.target.value))} className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                    <span>Grid_Structural</span>
                    <span>{Math.round(gridOpacity * 100)}%</span>
                  </div>
                  <input type="range" min="0" max="0.8" step="0.01" value={gridOpacity} onChange={(e) => setGridOpacity(parseFloat(e.target.value))} className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer" />
                </div>

                <button
                  onClick={() => setSeed(Math.random())}
                  className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ArrowsClockwise weight="bold" /> Mutate Entities
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-[#0a0a0a] rounded-sm overflow-hidden flex items-center justify-center shadow-2xl group min-h-[800px]">
              <canvas
                ref={canvasRef}
                className="w-full max-w-[500px] aspect-[2/3] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                style={{ imageRendering: 'pixelated' }}
              />

              <div className="absolute top-8 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button
                  onClick={() => { setHeaderText('FEZCODEX'); setSubHeaderText('NULL'); setSeed(Math.random()); }}
                  className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all"
                >
                  <Trash weight="bold" /> Reset Template
                </button>
              </div>
            </div>

            <div className="mt-12 p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
              <Info size={32} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500 max-w-4xl">
                Poster construct utilizes localized Canvas protocols. Final master generation executes at 2160x3240 resolution to ensure systemic clarity across all physical and digital displays.
              </p>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Graphic_Construct_v0.6.1</span>
          <span className="text-gray-800">CONSTRUCT_STATUS // OPTIMAL</span>
        </footer>
      </div>
    </div>
  );
};

export default PosterLoomPage;
