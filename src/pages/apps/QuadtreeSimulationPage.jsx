import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  InfoIcon,
  ActivityIcon,
  CpuIcon,
  BoundingBoxIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import CustomSlider from '../../components/CustomSlider';
import CustomToggle from '../../components/CustomToggle';

// --- Quadtree Classes ---

class Point {
  constructor(x, y, data = null) {
    this.x = x;
    this.y = y;
    this.data = data;
  }
}

class Rectangle {
  constructor(x, y, w, h) {
    this.x = x; // center x
    this.y = y; // center y
    this.w = w; // half-width
    this.h = h; // half-height
  }

  contains(point) {
    return (
      point.x >= this.x - this.w &&
      point.x < this.x + this.w &&
      point.y >= this.y - this.h &&
      point.y < this.y + this.h
    );
  }

  intersects(range) {
    return !(
      range.x - range.w > this.x + this.w ||
      range.x + range.w < this.x - this.w ||
      range.y - range.h > this.y + this.h ||
      range.y + range.h < this.y - this.h
    );
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.rSquared = r * r;
  }

  contains(point) {
    let d = Math.pow(point.x - this.x, 2) + Math.pow(point.y - this.y, 2);
    return d <= this.rSquared;
  }

  intersects(range) {
    let xDist = Math.abs(range.x - this.x);
    let yDist = Math.abs(range.y - this.y);

    let r = this.r;
    let w = range.w;
    let h = range.h;

    let edges = Math.pow(Math.max(xDist - w, 0), 2) + Math.pow(Math.max(yDist - h, 0), 2);

    if (xDist > r + w || yDist > r + h) return false;
    if (xDist <= w || yDist <= h) return true;
    return edges <= this.rSquared;
  }
}

class QuadTree {
  constructor(boundary, capacity, color) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.color = color || '#00ff41';
  }

  subdivide() {
    let x = this.boundary.x;
    let y = this.boundary.y;
    let w = this.boundary.w / 2;
    let h = this.boundary.h / 2;

    this.northeast = new QuadTree(new Rectangle(x + w, y - h, w, h), this.capacity, this.color);
    this.northwest = new QuadTree(new Rectangle(x - w, y - h, w, h), this.capacity, this.color);
    this.southeast = new QuadTree(new Rectangle(x + w, y + h, w, h), this.capacity, this.color);
    this.southwest = new QuadTree(new Rectangle(x - w, y + h, w, h), this.capacity, this.color);

    this.divided = true;
  }

  insert(point) {
    if (!this.boundary.contains(point)) return false;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return true;
    }

    if (!this.divided) this.subdivide();

    return (
      this.northeast.insert(point) ||
      this.northwest.insert(point) ||
      this.southeast.insert(point) ||
      this.southwest.insert(point)
    );
  }

  query(range, found) {
    if (!found) found = [];
    if (!this.boundary.intersects(range)) return found;

    for (let p of this.points) {
      if (range.contains(p)) found.push(p);
    }

    if (this.divided) {
      this.northwest.query(range, found);
      this.northeast.query(range, found);
      this.southwest.query(range, found);
      this.southeast.query(range, found);
    }

    return found;
  }

  show(ctx) {
    ctx.strokeStyle = this.color;
    ctx.globalAlpha = 0.2;
    ctx.lineWidth = 1;
    ctx.strokeRect(
      this.boundary.x - this.boundary.w,
      this.boundary.y - this.boundary.h,
      this.boundary.w * 2,
      this.boundary.h * 2
    );
    ctx.globalAlpha = 1.0;

    if (this.divided) {
      this.northwest.show(ctx);
      this.northeast.show(ctx);
      this.southwest.show(ctx);
      this.southeast.show(ctx);
    }
  }
}

// --- Component ---

const QuadtreeSimulationPage = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Simulation State
  const [particles, setParticles] = useState([]);
  const [count, setCount] = useState(1);
  const [capacity, setCapacity] = useState(4);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [showPoints, setShowPoints] = useState(true);
  const [queryRange, setQueryRange] = useState(80);
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [themeColor, setThemeColor] = useState('#00ff41'); // Matrix Green

  const requestRef = useRef();
  const quadtreeRef = useRef(null);

  // Initialize Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const newParticles = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        highlighted: false
      });
    }
    setParticles(newParticles);
  }, [count]);

  const update = useCallback(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    setParticles(prev => {
      const updated = prev.map(p => {
        let nx = p.x + p.vx;
        let ny = p.y + p.vy;

        let nvx = p.vx;
        let nvy = p.vy;

        if (nx < 0 || nx > canvas.width) nvx *= -1;
        if (ny < 0 || ny > canvas.height) nvy *= -1;

        return {
          ...p,
          x: nx < 0 ? 0 : nx > canvas.width ? canvas.width : nx,
          y: ny < 0 ? 0 : ny > canvas.height ? canvas.height : ny,
          vx: nvx,
          vy: nvy,
          highlighted: false
        };
      });

      // Build Quadtree
      const boundary = new Rectangle(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2);
      const qt = new QuadTree(boundary, capacity, themeColor);

      for (let p of updated) {
        qt.insert(new Point(p.x, p.y, p));
      }
      quadtreeRef.current = qt;

      // Query around mouse
      if (mousePos.x >= 0) {
        const range = new Circle(mousePos.x, mousePos.y, queryRange);
        const found = qt.query(range);
        for (let f of found) {
          f.data.highlighted = true;
        }
      }

      return updated;
    });

    requestRef.current = requestAnimationFrame(update);
  }, [isPlaying, capacity, mousePos, queryRange, themeColor]);

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, [update]);

  // Render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      // Background with slight trail effect
      ctx.fillStyle = 'rgba(5, 10, 5, 0.4)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // CRT Scanlines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.height; i += 4) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      if (showGrid && quadtreeRef.current) {
        quadtreeRef.current.show(ctx);
      }

      if (showPoints) {
        for (let p of particles) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.highlighted ? 3 : 1.5, 0, Math.PI * 2);

          if (p.highlighted) {
            ctx.fillStyle = '#fff';
            ctx.shadowBlur = 10;
            ctx.shadowColor = themeColor;
          } else {
            ctx.fillStyle = themeColor;
            ctx.globalAlpha = 0.5;
            ctx.shadowBlur = 0;
          }

          ctx.fill();
          ctx.globalAlpha = 1.0;
        }
      }

      // Draw mouse range
      if (mousePos.x >= 0) {
        ctx.beginPath();
        ctx.arc(mousePos.x, mousePos.y, queryRange, 0, Math.PI * 2);
        ctx.strokeStyle = themeColor;
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Crosshair
        ctx.beginPath();
        ctx.moveTo(mousePos.x - 10, mousePos.y);
        ctx.lineTo(mousePos.x + 10, mousePos.y);
        ctx.moveTo(mousePos.x, mousePos.y - 10);
        ctx.lineTo(mousePos.x, mousePos.y + 10);
        ctx.stroke();
      }
    };

    draw();
  }, [particles, showGrid, showPoints, mousePos, queryRange, themeColor]);

  // Handle Resize
  useEffect(() => {
    const updateSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (canvas && container) {
        canvas.width = container.offsetWidth;
        canvas.height = 600;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -200, y: -200 });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#00ff41] font-mono flex flex-col selection:bg-[#00ff41] selection:text-black">
      <Seo
        title="Quadtree Intercept | Fezcodex"
        description="Visualize spatial partitioning protocols with a high-fidelity retro-futuristic terminal."
        keywords={['quadtree', 'algorithms', 'spatial indexing', 'terminal', 'canvas', 'retro-future']}
      />

      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none opacity-20 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00ff4122_0%,_transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
      </div>

      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-7xl relative">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 border-b border-[#00ff4133] pb-6">
          <div className="flex items-center gap-6">
            <Link
              to="/apps"
              className="p-3 border border-[#00ff4144] rounded-lg hover:bg-[#00ff4111] transition-all group"
            >
              <ArrowLeftIcon className="text-xl group-hover:-translate-x-1 transition-transform" />
            </Link>
            <div>
              <BreadcrumbTitle title="Quadtree Simulation" />
              <div className="flex items-center gap-2 text-[10px] opacity-50 tracking-[0.3em] uppercase">
                <ActivityIcon size={12} className="animate-pulse" />
                <span>Objective: Recursive Partitioning</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <div className="text-[10px] opacity-40 uppercase">System Time</div>
                <div className="text-xs font-bold">{new Date().toLocaleTimeString()}</div>
             </div>
             <div className="w-px h-8 bg-[#00ff4133]" />
             <div className="flex gap-2">
                {['#00ff41', '#00e5ff', '#ffdf00', '#ff4500'].map(c => (
                  <button
                    key={c}
                    onClick={() => setThemeColor(c)}
                    className={`w-4 h-4 rounded-full border border-white/20 transition-transform hover:scale-125 ${themeColor === c ? 'ring-2 ring-white scale-110' : ''}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Controls Console */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#111] border-2 border-[#00ff4133] p-6 rounded-sm shadow-[0_0_30px_rgba(0,255,65,0.05)] space-y-8 relative overflow-hidden">
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#00ff41]" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#00ff41]" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#00ff41]" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#00ff41]" />

              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className={`flex-1 py-4 px-4 border-2 font-black tracking-widest transition-all active:translate-y-1 ${
                    isPlaying
                      ? 'border-amber-500 text-amber-500 bg-amber-500/10 hover:bg-amber-500/20'
                      : 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/10 hover:bg-[#00ff41]/20 shadow-[0_0_20px_rgba(0,255,65,0.2)]'
                  }`}
                >
                  {isPlaying ? 'Pause' : 'Continue'}
                </button>
              </div>

              <div className="space-y-6">
                <CustomSlider
                  variant="cyberpunk"
                  label="Node Capacity"
                  min={1}
                  max={20}
                  value={capacity}
                  onChange={setCapacity}
                />

                <CustomSlider
                  variant="cyberpunk"
                  label="Query Range"
                  min={10}
                  max={300}
                  value={queryRange}
                  onChange={setQueryRange}
                />

                <CustomSlider
                  variant="cyberpunk"
                  label="Entity Population"
                  min={0}
                  max={5000}
                  value={count}
                  onChange={setCount}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-[#00ff4122]">
                <CustomToggle
                  label="Grid Visualization"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  colorTheme="cyan"
                  labelColorClass="text-[#00ff4188]"
                />
                <CustomToggle
                  label="Entity Visibility"
                  checked={showPoints}
                  onChange={(e) => setShowPoints(e.target.checked)}
                  colorTheme="green"
                  labelColorClass="text-[#00ff4188]"
                />
              </div>

              <button
                  onClick={() => {
                    setParticles([]);
                    setCount(0);
                  }}
                  className="w-full py-2 text-[10px] text-rose-500 border border-rose-500/30 hover:bg-rose-500/10 transition-colors uppercase tracking-[0.4em] font-bold"
                >
                  Purge Nodes
              </button>
            </div>

            <div className="bg-[#0a0a0a] border border-[#00ff4122] p-6 text-[11px] leading-relaxed relative group">
                <div className="absolute -top-3 left-4 bg-[#050505] px-2 text-[10px] text-[#00ff41aa] font-bold uppercase tracking-widest">Technical Brief</div>
                <p className="opacity-60 group-hover:opacity-100 transition-opacity">
                  Quadtree protocols optimize spatial search from <span className="text-[#00ff41]">O(N²)</span> to <span className="text-[#00ff41]">O(N log N)</span>.
                  By recursively subdividing the coordinate space into quadrants, we prune non-relevant search volumes during query execution.
                </p>
                <div className="mt-4 pt-4 border-t border-[#00ff4111]">
                  <Link to="/blog/quadtree-algorithm-spatial-indexing" className="flex items-center gap-2 hover:text-white transition-colors uppercase tracking-widest font-bold">
                    <InfoIcon size={14} />
                    <span>Open Documentation</span>
                  </Link>
                </div>
            </div>
          </div>

          {/* Terminal Console */}
          <div className="lg:col-span-3 space-y-4">
            <div
              ref={containerRef}
              className="relative bg-black border-2 border-[#00ff4166] shadow-[0_0_50px_rgba(0,255,65,0.1)] overflow-hidden cursor-crosshair group"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <canvas
                ref={canvasRef}
                className="w-full h-[600px]"
              />

              {/* Scanline Overlay */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

              {/* Vignette */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,1)]" />

              {/* HUD Elements */}
              <div className="absolute top-6 left-6 pointer-events-none flex flex-col gap-1">
                 <div className="flex items-center gap-2 text-[10px] bg-black/80 px-2 py-1 border border-[#00ff4133]">
                    <div className="w-2 h-2 rounded-full bg-[#00ff41] animate-ping" />
                    <span>LOCKED_ON_COORD: {mousePos.x.toFixed(0)}, {mousePos.y.toFixed(0)}</span>
                 </div>
                 <div className="text-[9px] opacity-40 uppercase tracking-widest pl-2">Tracking Mouse Intercept</div>
              </div>

              <div className="absolute bottom-6 left-6 pointer-events-none flex items-end gap-4 opacity-30">
                 <BoundingBoxIcon size={48} weight="thin" />
                 <div className="flex flex-col">
                    <span className="text-xl font-black italic tracking-tighter uppercase leading-none">Spatial_Node</span>
                    <span className="text-[8px] tracking-[0.5em] font-bold">Subdivision_Engine</span>
                 </div>
              </div>

              {/* Top Right Stats */}
              <div className="absolute top-6 right-6 pointer-events-none text-right font-mono text-[10px] space-y-1">
                 <div className="bg-black/80 border border-[#00ff4133] p-2">
                    <div className="flex justify-between gap-4">
                       <span className="opacity-50 uppercase">Efficiency:</span>
                       <span className="font-bold">~{Math.round((1 - (capacity / (count || 1))) * 100)}%</span>
                    </div>
                    <div className="flex justify-between gap-4">
                       <span className="opacity-50 uppercase">Active_Entities:</span>
                       <span className="font-bold">{count}</span>
                    </div>
                 </div>
              </div>
            </div>

            {/* Bottom Telemetry Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-[#111] border border-[#00ff4122] p-4 flex flex-col gap-1">
                  <span className="text-[9px] opacity-40 uppercase">Processor Load</span>
                  <div className="flex items-center gap-2">
                     <CpuIcon size={16} />
                     <span className="font-bold text-xs">STABLE</span>
                  </div>
               </div>
               <div className="bg-[#111] border border-[#00ff4122] p-4 flex flex-col gap-1">
                  <span className="text-[9px] opacity-40 uppercase">Author Offset</span>
                  <span className="font-bold text-xs">0xFE2C0DE</span>
               </div>
               <div className="bg-[#111] border border-[#00ff4122] p-4 flex flex-col gap-1">
                  <span className="text-[9px] opacity-40 uppercase">Protocol Mode</span>
                  <span className="font-bold text-xs uppercase tracking-widest">{isPlaying ? 'Running' : 'Suspended'}</span>
               </div>
               <div className="bg-[#111] border border-[#00ff4122] p-4 flex flex-col gap-1">
                  <span className="text-[9px] opacity-40 uppercase">Query State</span>
                  <span className="font-bold text-xs uppercase tracking-widest">{mousePos.x >= 0 ? 'Active_Intercept' : 'Idle'}</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes crt-flicker {
          0% { opacity: 0.05; }
          5% { opacity: 0.02; }
          10% { opacity: 0.08; }
          100% { opacity: 0.05; }
        }
        .animate-crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
      `}</style>
    </div>
  );
};

export default QuadtreeSimulationPage;
