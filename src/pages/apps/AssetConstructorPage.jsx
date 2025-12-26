import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  SelectionIcon,
  PaintBrushIcon,
  ArrowsOutIcon,
  TrashIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import CustomDropdown from '../../components/CustomDropdown';
import CustomSlider from '../../components/CustomSlider';
import CustomColorPicker from '../../components/CustomColorPicker';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const CONTAINER_STYLES = [
  { value: 'frosty', label: 'FROSTY_GLASS' },
  { value: 'neural', label: 'NEURAL_SHELL' },
  { value: 'cyber', label: 'CYBER_FRAME' },
  { value: 'void', label: 'VOID_CORE' },
  { value: 'blade', label: 'TERMINAL_BLADE' },
];

const BG_STYLES = [
  { value: 'transparent', label: 'TRANSPARENT' },
  { value: 'gradient', label: 'GLASSY_FLUX' },
  { value: 'solid', label: 'SOLID_VOID' },
];

const AssetConstructorPage = () => {
  const appName = 'Asset Constructor';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Construct high-fidelity digital assets, containers and UI components.',
    keywords: ['asset creator', 'ui design', 'glassmorphism', 'container generator', 'fezcodex'],
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // Asset State
  const [style, setStyle] = useState('frosty');
  const [bgStyle, setBgStyle] = useState('gradient');
  const [width, setWidth] = useState(600);
  const [height, setHeight] = useState(400);
  const [radius, setRadius] = useState(40);
  const [opacity, setOpacity] = useState(0.12);
  const [accentColor, setAccentColor] = useState('#ffffff');
  const [baseColor, setBaseColor] = useState('#6366f1');

  const drawAsset = useCallback((ctx, canvasW, canvasH, exportMode = false) => {
    const scale = canvasW / 1000;
    ctx.clearRect(0, 0, canvasW, canvasH);

    // 1. Scene Background (Only if not exporting transparent)
    if (!exportMode && bgStyle !== 'transparent') {
      ctx.save();
      if (bgStyle === 'solid') {
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, canvasW, canvasH);
      } else {
        const grad = ctx.createLinearGradient(0, 0, canvasW, canvasH);
        grad.addColorStop(0, baseColor);
        grad.addColorStop(1, '#ec4899');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvasW, canvasH);

        // Blobs for depth
        const drawBlob = (x, y, r, color) => {
          ctx.save();
          ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = color; ctx.filter = 'blur(80px)'; ctx.globalAlpha = 0.4;
          ctx.fill(); ctx.restore();
        };
        drawBlob(canvasW * 0.2, canvasH * 0.2, 300 * scale, '#c084fc');
        drawBlob(canvasW * 0.8, canvasH * 0.1, 250 * scale, '#facc15');
      }
      ctx.restore();
    }

    // 2. Container Positioning
    const cw = width * scale;
    const ch = height * scale;
    const cx = (canvasW - cw) / 2;
    const cy = (canvasH - ch) / 2;
    const cr = radius * scale;

    const definePath = (c) => {
      c.beginPath();
      c.moveTo(cx + cr, cy);
      c.lineTo(cx + cw - cr, cy);
      c.quadraticCurveTo(cx + cw, cy, cx + cw, cy + cr);
      c.lineTo(cx + cw, cy + ch - cr);
      c.quadraticCurveTo(cx + cw, cy + ch, cx + cw - cr, cy + ch);
      c.lineTo(cx + cr, cy + ch);
      c.quadraticCurveTo(cx, cy + ch, cx, cy + ch - cr);
      c.lineTo(cx, cy + cr);
      c.quadraticCurveTo(cx, cy, cx + cr, cy);
      c.closePath();
    };

    // 3. Render Style
    ctx.save();

    if (style === 'frosty') {
      // Blur Shadow (Simulation of glass depth)
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 40 * scale;
      ctx.shadowOffsetY = 20 * scale;

      definePath(ctx);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();

      // Border
      ctx.strokeStyle = `rgba(255, 255, 255, ${opacity * 2.5})`;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
    }
    else if (style === 'neural') {
      definePath(ctx);
      ctx.fillStyle = 'rgba(10, 10, 10, 0.8)';
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1 * scale;
      ctx.stroke();

      // Glowing Corners
      ctx.shadowBlur = 15 * scale;
      ctx.shadowColor = accentColor;
      const s = 30 * scale;
      ctx.beginPath();
      // TL
      ctx.moveTo(cx, cy + s); ctx.lineTo(cx, cy); ctx.lineTo(cx + s, cy);
      // TR
      ctx.moveTo(cx + cw - s, cy); ctx.lineTo(cx + cw, cy); ctx.lineTo(cx + cw, cy + s);
      // BL
      ctx.moveTo(cx, cy + ch - s); ctx.lineTo(cx, cy + ch); ctx.lineTo(cx + s, cy + ch);
      // BR
      ctx.moveTo(cx + cw - s, cy + ch); ctx.lineTo(cx + cw, cy + ch); ctx.lineTo(cx + cw, cy + ch - s);
      ctx.stroke();
    }
    else if (style === 'cyber') {
      ctx.fillStyle = 'rgba(0, 255, 255, 0.05)';
      definePath(ctx);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 4 * scale;
      ctx.setLineDash([40 * scale, 20 * scale]);
      ctx.stroke();

      ctx.lineWidth = 1 * scale;
      ctx.setLineDash([]);
      ctx.strokeRect(cx - 10*scale, cy - 10*scale, cw + 20*scale, ch + 20*scale);
    }
        else if (style === 'void') {
      ctx.fillStyle = '#000';
      definePath(ctx);
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1 * scale;
      ctx.globalAlpha = 0.3;
      for(let i=0; i<3; i++) {
        ctx.strokeRect(cx - (i*5)*scale, cy - (i*5)*scale, cw + (i*10)*scale, ch + (i*10)*scale);
      }
    }
    else if (style === 'blade') {
      // Angular Path
      const cut = radius * scale;
      ctx.beginPath();
      ctx.moveTo(cx + cut, cy);
      ctx.lineTo(cx + cw - cut, cy);
      ctx.lineTo(cx + cw, cy + cut);
      ctx.lineTo(cx + cw, cy + ch - cut);
      ctx.lineTo(cx + cw - cut, cy + ch);
      ctx.lineTo(cx + cut, cy + ch);
      ctx.lineTo(cx, cy + ch - cut);
      ctx.lineTo(cx, cy + cut);
      ctx.closePath();

      ctx.fillStyle = `rgba(0, 0, 0, ${opacity})`;
      ctx.fill();

      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2 * scale;
      ctx.stroke();

      // Slash Pattern ///////
      ctx.save();
      ctx.fillStyle = accentColor;
      ctx.font = `bold ${12 * scale}px "JetBrains Mono"`;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      const slashText = '////////////////////////////////////////////////////////////////////////////////////////////////////';

      // Draw slashes along top
      ctx.save();
      ctx.translate(cx + cut, cy + 2 * scale);
      ctx.globalAlpha = 0.5;
      ctx.fillText(slashText.slice(0, Math.floor(cw / (10 * scale))), 0, 0);
      ctx.restore();

      // Draw slashes along bottom
      ctx.save();
      ctx.translate(cx + cut, cy + ch - 14 * scale);
      ctx.globalAlpha = 0.5;
      ctx.fillText(slashText.slice(0, Math.floor(cw / (10 * scale))), 0, 0);
      ctx.restore();
      ctx.restore();
    }

    ctx.restore();      }, [style, bgStyle, width, height, radius, opacity, accentColor, baseColor]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawAsset(ctx, rect.width, rect.height);
  }, [drawAsset]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const S = 3000;
    canvas.width = S;
    canvas.height = S;

    // Export with transparent background
    drawAsset(ctx, S, S, true);

    const link = document.createElement('a');
    link.download = `asset-${style}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({ title: 'ASSET_RASTERIZED', message: 'High-fidelity component saved to storage.' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 relative z-10">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Asset Constructor" slug="asset-gen" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Component synthesis protocol. Construct high-fidelity UI containers with advanced glassmorphism and technical framing.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
            >
              <DownloadSimpleIcon weight="bold" size={24} />
              <span>Export Asset</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Controls Sidebar */}
          <div className="lg:col-span-3 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <SelectionIcon weight="fill" />
                Structural_Profile
              </h3>

              <div className="space-y-6">
                <CustomDropdown
                  label="Container Style"
                  options={CONTAINER_STYLES}
                  value={style}
                  onChange={setStyle}
                  variant="brutalist"
                  fullWidth
                />

                <CustomDropdown
                  label="Preview Environment"
                  options={BG_STYLES}
                  value={bgStyle}
                  onChange={setBgStyle}
                  variant="brutalist"
                  fullWidth
                />

                <CustomColorPicker
                  label="Accent Color"
                  value={accentColor}
                  onChange={setAccentColor}
                />

                {bgStyle === 'gradient' && (
                  <CustomColorPicker
                    label="Environment Base"
                    value={baseColor}
                    onChange={setBaseColor}
                  />
                )}
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <ArrowsOutIcon weight="fill" />
                Geometry_Matrix
              </h3>

              <div className="space-y-8">
                <CustomSlider label="Width" min={100} max={1000} value={width} onChange={setWidth} />
                <CustomSlider label="Height" min={100} max={1000} value={height} onChange={setHeight} />
                <CustomSlider label="Corner Radius" min={0} max={200} value={radius} onChange={setRadius} />
                <CustomSlider label="Surface Opacity" min={0} max={1} step={0.01} value={opacity} onChange={setOpacity} />
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-9">
            <div className="lg:sticky lg:top-24 h-fit transition-all">
              <div className="relative border border-white/10 bg-[#0a0a0a] rounded-sm overflow-hidden flex items-center justify-center shadow-2xl group min-h-[800px]">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-[900px] aspect-square object-contain"
                  style={{ imageRendering: 'pixelated' }}
                />

                <div className="absolute top-8 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setWidth(600); setHeight(400); setRadius(40); setOpacity(0.12); }}
                    className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all"
                  >
                    <TrashIcon weight="bold" /> Reset Geometry
                  </button>
                </div>
              </div>

              <div className="mt-12 p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
                <PaintBrushIcon size={32} className="text-gray-700 shrink-0 mt-1" />
                <div className="space-y-4">
                  <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                    ASSET_PROTOCOL: High-fidelity rasterization active. Export process generates a 3000x3000px transparent PNG entity.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex justify-between items-center text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Asset_Constructor_v1.0.0</span>
          <span className="text-gray-800">STATUS // READY</span>
        </footer>
      </div>
    </div>
  );
};

export default AssetConstructorPage;
