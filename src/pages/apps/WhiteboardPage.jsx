import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  EraserIcon,
  TrashIcon,
  DownloadSimpleIcon,
  PaletteIcon,
  WavesIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const WhiteboardPage = () => {
  const appName = 'Whiteboard';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'A simple digital whiteboard for sketching and doodling.',
    keywords: ['Fezcodex', 'whiteboard', 'drawing', 'sketch', 'canvas', 'draw'],
  });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const { addToast } = useToast();
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState('pen'); // 'pen' or 'eraser'
  const [isSquiggly, setIsSquiggly] = useState(false);

  // Initialize Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = 600 * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '600px';

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, 600);

    setContext(ctx);
  }, []);

  // Update Context Properties
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      context.lineWidth = lineWidth;
    }
  }, [context, color, lineWidth, tool]);

  const getCoordinates = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    let clientX, clientY;

    if (event.touches && event.touches.length > 0) {
      clientX = event.touches[0].clientX;
      clientY = event.touches[0].clientY;
    } else {
      clientX = event.clientX;
      clientY = event.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (event) => {
    event.preventDefault();
    const { x, y } = getCoordinates(event);
    lastPos.current = { x, y };
    setIsDrawing(true);

    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x, y);
    context.stroke();
  };

  const draw = (event) => {
    event.preventDefault();
    if (!isDrawing) return;
    const { x, y } = getCoordinates(event);

    context.beginPath();
    context.moveTo(lastPos.current.x, lastPos.current.y);

    if (isSquiggly && tool === 'pen') {
      const midX = (lastPos.current.x + x) / 2;
      const midY = (lastPos.current.y + y) / 2;
      const jitter = 15;
      const cx = midX + (Math.random() - 0.5) * jitter;
      const cy = midY + (Math.random() - 0.5) * jitter;
      context.quadraticCurveTo(cx, cy, x, y);
    } else {
      context.lineTo(x, y);
    }

    context.stroke();
    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    if (isDrawing) {
      context.closePath();
      setIsDrawing(false);
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, rect.width, rect.height);
    addToast({ title: 'Canvas Cleared', message: 'Start fresh!' });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'whiteboard_sketch.png';
    link.click();
    addToast({ title: 'Success', message: 'Sketch saved to device.' });
  };

  const colorsList = [
    '#000000', '#FF0000', '#0000FF', '#008000', '#FFA500', '#800080', '#A0522D',
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Whiteboard" slug="draw" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                A minimal digital space for sketching, brainstorming, and visualizing ideas.
              </p>
            </div>
          </div>
        </header>

        <div className="relative border border-white/10 bg-white/[0.02] p-4 md:p-8 rounded-sm overflow-hidden group">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
            <GenerativeArt seed={appName} className="w-full h-full" />
          </div>

          <div className="relative z-10 flex flex-col gap-8">
            {/* Toolbar */}
            <div className="flex flex-wrap justify-between items-center gap-6 p-6 border border-white/5 bg-black/40">
              <div className="flex items-center gap-4">
                <div className="flex bg-white/5 p-1 rounded-sm border border-white/10">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-3 transition-all ${tool === 'pen' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                    title="Pen"
                  >
                    <PencilSimpleIcon size={20} weight="bold" />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-3 transition-all ${tool === 'eraser' ? 'bg-white text-black' : 'text-gray-500 hover:text-white'}`}
                    title="Eraser"
                  >
                    <EraserIcon size={20} weight="bold" />
                  </button>
                  <button
                    onClick={() => setIsSquiggly(!isSquiggly)}
                    className={`p-3 transition-all ${isSquiggly ? 'bg-emerald-500 text-black' : 'text-gray-500 hover:text-white'}`}
                    title="Squiggly Mode"
                  >
                    <WavesIcon size={20} weight="bold" />
                  </button>
                </div>

                <div className="flex items-center gap-2 px-4 py-2 border border-white/10 bg-white/5">
                  <PaletteIcon size={16} className="text-gray-500" />
                  <div className="flex gap-2">
                    {colorsList.map((c) => (
                      <button
                        key={c}
                        onClick={() => { setColor(c); setTool('pen'); }}
                        className={`w-5 h-5 rounded-full border border-white/20 transition-transform ${color === c && tool === 'pen' ? 'scale-125 border-white' : 'hover:scale-110'}`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Size</span>
                  <input
                    type="range" min="1" max="20" value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-32 accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-white w-4">{lineWidth}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="p-3 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black transition-all"
                    title="Clear Canvas"
                  >
                    <TrashIcon size={20} weight="bold" />
                  </button>
                  <button
                    onClick={downloadCanvas}
                    className="p-3 bg-white text-black hover:bg-emerald-500 transition-all"
                    title="Download"
                  >
                    <DownloadSimpleIcon size={20} weight="bold" />
                  </button>
                </div>
              </div>
            </div>

            {/* Canvas Area */}
            <div
              ref={containerRef}
              className="w-full h-[600px] bg-white border border-white/10 cursor-crosshair touch-none shadow-2xl overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>

            <div className="flex justify-between items-center px-2">
              <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                All drawings are local and not saved to the server.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-500 uppercase tracking-widest">
                <span className="h-1 w-1 bg-current animate-pulse" />
                <span>Active Workspace</span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex Whiteboard Utility</span>
          <span className="text-gray-800">Status // Ready</span>
        </footer>
      </div>
    </div>
  );
};

export default WhiteboardPage;
