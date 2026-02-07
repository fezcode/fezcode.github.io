import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrashIcon,
  SelectionIcon,
  DownloadSimpleIcon,
  PaintBrushIcon,
  WindIcon,
  WavesIcon,
  CodeIcon,
  CircleDashedIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const PROTOCOLS = [
  { id: 'binary', label: 'BINARY_STREAM', symbols: ['0', '1'] },
  {
    id: 'geometric',
    label: 'GEOMETRIC_ENTITIES',
    symbols: ['+', '×', '□', '○', '△', '⬡'],
  },
  {
    id: 'alpha',
    label: 'ALPHA_CodeIcon',
    symbols: ['A', 'B', 'X', 'Y', 'Z', 'Σ', 'Φ', 'Ω'],
  },
  {
    id: 'brutalist',
    label: 'VOID_BLOCKS',
    symbols: ['█', '▓', '▒', '░', '▖', '▗', '▘', '▙'],
  },
];

const COLORS = [
  { name: 'Pure Void', hex: '#050505', text: '#FFFFFF' },
  { name: 'Emerald Flux', hex: '#10b981', text: '#000000' },
  { name: 'Salmon Signal', hex: '#FA8072', text: '#000000' },
  { name: 'Cyber Cyan', hex: '#00FFFF', text: '#000000' },
  { name: 'Amber Warning', hex: '#f59e0b', text: '#000000' },
];

const SymbolFlowPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const requestRef = useRef();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // State
  const [protocol, setProtocol] = useState(PROTOCOLS[0]);
  const [accentColor, setAccentColor] = useState(COLORS[1]);
  const [density, setDensity] = useState(50);
  const [chaos, setChaos] = useState(0.002);
  const [velocity, setVelocity] = useState(2);
  const [trail, setTrail] = useState(0.15);
  const [isPaused, setIsPaused] = useState(false);

  const particles = useRef([]);

  const initParticles = useCallback(
    (width, height) => {
      const baseCount = Math.floor((width * height) / 1500); // Increased density
      const count = Math.max(100, Math.floor(baseCount * (density / 50)));
      particles.current = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: 0,
        vy: 0,
        symbol:
          protocol.symbols[Math.floor(Math.random() * protocol.symbols.length)],
        size: Math.random() * 14 + 10, // Slightly larger
        life: Math.random() * 200 + 100, // Lifespan to prevent permanent clumping
        maxLife: 0, // Will be set in loop
      }));
      particles.current.forEach((p) => (p.maxLife = p.life));
    },
    [density, protocol],
  );

  const animate = useCallback(
    (time) => {
      if (isPaused) return;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;

      // Fade background for trails
      ctx.fillStyle = `rgba(5, 5, 5, ${trail})`;
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = accentColor.hex;

      particles.current.forEach((p) => {
        // 1. Life Cycle
        p.life -= 0.5;
        if (p.life <= 0) {
          p.x = Math.random() * width;
          p.y = Math.random() * height;
          p.life = Math.random() * 200 + 100;
          p.symbol =
            protocol.symbols[
              Math.floor(Math.random() * protocol.symbols.length)
            ];
        }

        // 2. Procedural Movement (Refined Flow Field)
        // Use multiple layers of sin/cos for more complexity
        const noise = p.x * chaos + p.y * chaos + time * 0.0005;
        const angle =
          Math.sin(noise * 10) * Math.PI + Math.cos(noise * 5) * Math.PI;

        // Target velocity based on field
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;

        // Smooth acceleration
        p.vx += (tx - p.vx) * 0.1;
        p.vy += (ty - p.vy) * 0.1;

        // 3. Mouse Interaction (Repel)
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          p.vx -= (dx / dist) * force * 15 * (velocity / 2);
          p.vy -= (dy / dist) * force * 15 * (velocity / 2);
        }

        // 4. Update Position
        p.x += p.vx;
        p.y += p.vy;

        // 5. Edge Wrap
        if (p.x < -20) p.x = width + 20;
        if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        if (p.y > height + 20) p.y = -20;

        // 6. Draw with Fade In/Out based on life
        const alpha = Math.min(1, p.life / 20, (p.maxLife - p.life) / 20);
        ctx.globalAlpha = alpha;
        ctx.font = `bold ${p.size}px "JetBrains Mono", monospace`;
        ctx.fillText(p.symbol, p.x, p.y);
        ctx.globalAlpha = 1.0;
      });

      requestRef.current = requestAnimationFrame(animate);
    },
    [accentColor, chaos, velocity, trail, isPaused, protocol],
  );

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return;
      const { width, height } = containerRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvasRef.current.width = width * dpr;
      canvasRef.current.height = height * dpr;

      const ctx = canvasRef.current.getContext('2d');
      ctx.scale(dpr, dpr);

      initParticles(width, height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
  }, [animate, initParticles]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `symbol-flow-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({
      title: 'FLOW_CAPTURED',
      message: 'Current stream state exported to local storage.',
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white SelectionIcon:bg-emerald-500/30 font-sans overflow-x-hidden">
      <Seo
        title="Symbol Flow | Fezcodex"
        description="Generative flow field visualizer using technical symbol protocols and procedural noise."
        keywords={[
          'Fezcodex',
          'generative art',
          'canvas animation',
          'flow field',
          'brutalist design',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Symbol Flow"
                slug="sf"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Generative stream protocol. Map technical symbol sets across
                procedural force fields to visualize digital kinetic energy.
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`group relative inline-flex items-center gap-4 px-10 py-6 border transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0 ${isPaused ? 'bg-white text-black border-white' : 'bg-transparent text-white border-white/20 hover:bg-white/5'}`}
              >
                <SelectionIcon weight="bold" size={24} />
                <span>{isPaused ? 'RESUME_STREAM' : 'HALT_TEMPORAL'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="group relative inline-flex items-center gap-4 px-10 py-6 bg-emerald-500 text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
              >
                <DownloadSimpleIcon weight="bold" size={24} />
                <span>Capture Frame</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Controls */}
          <div className="lg:col-span-4 space-y-8">
            {/* Protocols */}
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <CodeIcon weight="fill" />
                Symbol_Protocols
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {PROTOCOLS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProtocol(p)}
                    className={`py-4 px-6 text-left text-[9px] font-mono uppercase tracking-widest border transition-all flex justify-between items-center ${protocol.id === p.id ? 'bg-white text-black border-white font-black' : 'border-white/5 text-gray-600 hover:border-white/20'}`}
                  >
                    <span>{p.label}</span>
                    <span className="opacity-40">
                      {p.symbols.slice(0, 3).join('')}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Chromatic */}
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <PaintBrushIcon weight="fill" />
                Chromatic_Intensity
              </h3>

              <div className="flex flex-wrap gap-3">
                {COLORS.slice(1).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setAccentColor(c)}
                    className={`w-12 h-12 rounded-sm border-2 transition-all ${accentColor.hex === c.hex ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Field Controls */}
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <WindIcon weight="fill" />
                Field_Calibration
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                    <span>Stream_Density</span>
                    <span className="text-white">{density}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={density}
                    onChange={(e) => setDensity(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                    <span>Noise_Chaos</span>
                    <span className="text-white">
                      {Math.round(chaos * 10000)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.0001"
                    max="0.01"
                    step="0.0001"
                    value={chaos}
                    onChange={(e) => setChaos(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                    <span>Temporal_Velocity</span>
                    <span className="text-white">{velocity}X</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={velocity}
                    onChange={(e) => setVelocity(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                    <span>Ghosting_Trails</span>
                    <span className="text-white">
                      {Math.round((1 - trail) * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={trail}
                    onChange={(e) => setTrail(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Visualizer */}
          <div className="lg:col-span-8 space-y-12">
            <div
              ref={containerRef}
              className="relative border border-white/10 bg-[#050505] rounded-sm overflow-hidden aspect-video shadow-2xl group cursor-crosshair"
              onMouseMove={handleMouseMove}
              onMouseLeave={() => (mouseRef.current = { x: -1000, y: -1000 })}
            >
              <canvas ref={canvasRef} className="w-full h-full" />

              {/* Interaction Overlay */}
              <div className="absolute top-8 left-8 flex gap-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-sm">
                  <CircleDashedIcon
                    size={14}
                    className="text-emerald-500 animate-spin"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-widest">
                    Interactive_Field_Active
                  </span>
                </div>
              </div>

              <div className="absolute bottom-8 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button
                  onClick={() => {
                    setDensity(50);
                    setChaos(0.002);
                    setVelocity(2);
                    setTrail(0.15);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all"
                >
                  <TrashIcon weight="bold" /> Reset Field
                </button>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
              <WavesIcon size={32} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500 max-w-4xl">
                Dynamic flow state utilized localized Canvas animation loops.
                Each entity responds to a composite vector field calculated from
                procedural noise and real-time cursor coordinates. Optimal
                systemic performance verified.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>FezCodeIconx_Kinetic_Matrix_v0.6.1</span>
          <span className="text-gray-800">
            STREAM_STATE // {isPaused ? 'LOCKED' : 'FLOWING'}
          </span>
        </footer>
      </div>
    </div>
  );
};

export default SymbolFlowPage;
