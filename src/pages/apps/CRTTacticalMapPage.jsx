import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  TextTIcon,
  EraserIcon,
  TrashIcon,
  DownloadSimpleIcon,
  CrosshairIcon,
  MinusIcon,
  } from '@phosphor-icons/react';
  import Seo from '../../components/Seo';
  import { useToast } from '../../hooks/useToast';
  import BreadcrumbTitle from '../../components/BreadcrumbTitle';
  import BrutalistModal from '../../components/BrutalistModal';
  import CustomSlider from '../../components/CustomSlider';

  const CRTTacticalMapPage = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const { addToast } = useToast();

  const [tool, setTool] = useState('pen'); // 'pen', 'line', 'text', 'eraser'
  const [color, setColor] = useState('#00FF41'); // Phosphor Green
  const [lineWidth, setLineWidth] = useState(1.5);
  const [textSize, setTextSize] = useState(18);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]);
  const [texts, setTexts] = useState([]);
  const [currentPath, setCurrentPath] = useState(null);
  const [showGrid, setShowGrid] = useState(true);
  const [showScanlines, setShowScanlines] = useState(true);
  const [noise, setNoise] = useState(true);

  // Modal state for text input
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingTextPos, setPendingTextPos] = useState(null);
  const [inputText, setInputText] = useState('');

  // Modal state for wipe data
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);

  const colors = [
    { name: 'P-Green', hex: '#00FF41' },
    { name: 'Amber', hex: '#FFB000' },
    { name: 'Cyan', hex: '#00F3FF' },
    { name: 'Red-Alert', hex: '#FF0000' },
    { name: 'White', hex: '#FFFFFF' },
  ];

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#050a05';
    ctx.fillRect(0, 0, width, height);

    if (showGrid) {
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 50;

      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(0, 255, 65, 0.3)';
      ctx.font = '10px "JetBrains Mono", monospace';
      for (let x = 0; x <= width; x += gridSize * 2) {
        ctx.fillText(`${(x / 10).toFixed(0)}°E`, x + 5, 15);
      }
      for (let y = 0; y <= height; y += gridSize * 2) {
        ctx.fillText(`${(y / 10).toFixed(0)}°N`, 5, y + 15);
      }
    }

    const renderElements = (elements, type) => {
      elements.forEach((el) => {
        ctx.save();
        ctx.strokeStyle = el.color;
        ctx.fillStyle = el.color;

        if (type === 'path') {
          ctx.lineWidth = el.lineWidth || 1.5;

          // Helper for "Step" line drawing to avoid smoothness
          const drawSteppedPath = (pathPoints) => {
            ctx.beginPath();
            pathPoints.forEach((p, i) => {
              // 80s Hardware didn't do anti-aliased curves, usually stepped vectors
              const sx = Math.floor(p.x);
              const sy = Math.floor(p.y);
              if (i === 0) ctx.moveTo(sx, sy);
              else ctx.lineTo(sx, sy);
            });
            ctx.stroke();
          };

          // 1. Outer Glow
          ctx.shadowBlur = 12;
          ctx.shadowColor = el.color;
          ctx.globalAlpha = 0.4;
          drawSteppedPath(el.points);

          // 2. Inner Glow
          ctx.shadowBlur = 4;
          ctx.globalAlpha = 0.7;
          drawSteppedPath(el.points);

          // 3. Sharp Core
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
          drawSteppedPath(el.points);
        } else if (type === 'text') {
          // Linear Monospace Font
          ctx.font = `bold ${el.size || 18}px "JetBrains Mono", "Courier New", monospace`;
          ctx.textBaseline = 'top';

          // Glow
          ctx.shadowBlur = 8;
          ctx.shadowColor = el.color;
          ctx.fillText(el.text, el.x, el.y);
          ctx.shadowBlur = 0;
          ctx.fillText(el.text, el.x, el.y);

          // Store bounding box for eraser
          el.width = ctx.measureText(el.text).width;
          el.height = el.size || 18;
        }
        ctx.restore();
      });
    };

    renderElements(paths, 'path');
    renderElements(texts, 'text');
    if (currentPath) {
      renderElements([currentPath], 'path');
    }
  }, [paths, texts, currentPath, showGrid]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      drawScene();
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [drawScene]);

  const getCoordinates = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const getDistanceToSegment = (px, py, x1, y1, x2, y2) => {
    const l2 = (x2 - x1) ** 2 + (y2 - y1) ** 2;
    if (l2 === 0) return Math.hypot(px - x1, py - y1);
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(px - (x1 + t * (x2 - x1)), py - (y1 + t * (y2 - y1)));
  };

  const startInteraction = (e) => {
    const { x, y } = getCoordinates(e);

    if (tool === 'pen' || tool === 'line') {
      setIsDrawing(true);
      setCurrentPath({ points: [{ x, y }], color, lineWidth, tool });
    } else if (tool === 'text') {
      setPendingTextPos({ x, y });
      setIsModalOpen(true);
    } else if (tool === 'eraser') {
      // Improved erase: Check segments for paths and bounding box for texts
      setPaths((prev) => prev.filter((p) => {
        // For each path, check if the click is near any segment
        for (let i = 0; i < p.points.length - 1; i++) {
          const dist = getDistanceToSegment(
            x, y,
            p.points[i].x, p.points[i].y,
            p.points[i + 1].x, p.points[i + 1].y
          );
          if (dist < 10 + (p.lineWidth || 1.5)) return false;
        }
        return true;
      }));

      setTexts((prev) => prev.filter((t) => {
        const isHit = x >= t.x && x <= t.x + (t.width || 100) &&
                      y >= t.y && y <= t.y + (t.height || 20);
        return !isHit;
      }));
    }
  };

  const handleTextSubmit = () => {
    if (inputText && pendingTextPos) {
      setTexts((prev) => [...prev, {
        x: pendingTextPos.x,
        y: pendingTextPos.y,
        text: inputText.toUpperCase(),
        color,
        size: textSize
      }]);
      setInputText('');
      setPendingTextPos(null);
      setIsModalOpen(false);
    }
  };

  const moveInteraction = (e) => {
    if (!isDrawing) return;
    const { x, y } = getCoordinates(e);

    if (tool === 'pen') {
      // Only add point if distance is significant to maintain "rough/stepped" feel
      const lastPoint = currentPath.points[currentPath.points.length - 1];
      if (Math.hypot(x - lastPoint.x, y - lastPoint.y) > 4) {
        setCurrentPath((prev) => ({
          ...prev,
          points: [...prev.points, { x, y }],
        }));
      }
    } else if (tool === 'line') {
      // Replace the second point with the current mouse position
      setCurrentPath((prev) => ({
        ...prev,
        points: [prev.points[0], { x, y }],
      }));
    }
  };

  const stopInteraction = () => {
    if (isDrawing) {
      if (currentPath && currentPath.points.length > 1) {
        setPaths((prev) => [...prev, currentPath]);
      }
      setCurrentPath(null);
      setIsDrawing(false);
    }
  };

  const handleWipeData = () => {
    setPaths([]);
    setTexts([]);
    setIsWipeModalOpen(false);
    addToast({ title: 'DATA PURGED', message: 'Tactical map cleared.' });
  };

  const downloadMap = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `tactical_map_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    addToast({ title: 'INTEL SECURED', message: 'Map data exported to local drive.' });
  };

  return (
    <div className="min-h-screen bg-[#020502] text-[#00FF41] font-mono selection:bg-[#00FF41]/30 overflow-hidden flex flex-col">
      <Seo
        title="CRT Tactical Map | Fezcodex"
        description="Immersive 80s cinema style CRT tactical map with glowing vectors and telemetry."
        keywords={['80s', 'crt', 'tactical', 'map', 'cinema', 'glow', 'drawing']}
      />

      <header className="px-6 py-4 border-b border-[#00FF41]/20 flex justify-between items-center bg-[#050a05] z-20">
        <div className="flex items-center gap-6">
          <Link
            to="/apps"
            className="flex items-center gap-2 text-xs hover:bg-[#00FF41] hover:text-black px-2 py-1 transition-colors"
          >
            <ArrowLeftIcon weight="bold" />
            <span>EXIT_SYSTEM</span>
          </Link>
          <div className="h-4 w-px bg-[#00FF41]/20" />
          <BreadcrumbTitle title="TACTICAL_MAP" slug="v1.0.8" variant="brutalist" />
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] tracking-[0.2em]">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 bg-[#00FF41] animate-pulse rounded-full" />
            <span>SIGNAL_LOCKED</span>
          </div>
          <div className="text-[#00FF41]/60">
            TS: {new Date().toLocaleTimeString()}
          </div>
        </div>
      </header>

      <main className="flex-grow flex relative">
        <aside className="w-16 md:w-20 border-r border-[#00FF41]/20 flex flex-col items-center py-8 gap-6 bg-[#050a05] z-20">
          <button
            onClick={() => setTool('pen')}
            className={`p-3 border ${tool === 'pen' ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'border-[#00FF41]/20 text-[#00FF41] hover:border-[#00FF41]'}`}
            title="Vector Pen"
          >
            <PencilSimpleIcon size={24} weight="bold" />
          </button>
          <button
            onClick={() => setTool('line')}
            className={`p-3 border ${tool === 'line' ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'border-[#00FF41]/20 text-[#00FF41] hover:border-[#00FF41]'}`}
            title="Vector Line"
          >
            <MinusIcon size={24} weight="bold" />
          </button>
          <button
            onClick={() => setTool('text')}
            className={`p-3 border ${tool === 'text' ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'border-[#00FF41]/20 text-[#00FF41] hover:border-[#00FF41]'}`}
            title="Telemetry Text"
          >
            <TextTIcon size={24} weight="bold" />
          </button>
          <button
            onClick={() => setTool('eraser')}
            className={`p-3 border ${tool === 'eraser' ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'border-[#00FF41]/20 text-[#00FF41] hover:border-[#00FF41]'}`}
            title="Scrub Data"
          >
            <EraserIcon size={24} weight="bold" />
          </button>

          <div className="h-px w-8 bg-[#00FF41]/20 my-2" />

          <button
            onClick={() => setIsWipeModalOpen(true)}
            className="p-3 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-black transition-all"
            title="Purge System"
          >
            <TrashIcon size={24} weight="bold" />
          </button>
          <button
            onClick={downloadMap}
            className="p-3 border border-[#00FF41]/20 text-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-all"
            title="Export Intel"
          >
            <DownloadSimpleIcon size={24} weight="bold" />
          </button>
        </aside>

        <div className="flex-grow relative bg-black overflow-hidden flex items-center justify-center p-4 md:p-12">
          <div className="relative w-full h-full max-w-6xl aspect-[4/3] shadow-[0_0_100px_rgba(0,255,65,0.1)] rounded-[5%] overflow-hidden border-[20px] border-[#1a1a1a] ring-4 ring-[#333] z-10">
            <div
              ref={containerRef}
              className="relative w-full h-full bg-[#050a05] cursor-crosshair"
              style={{ transform: 'perspective(1000px) rotateX(0.5deg)' }}
            >
              <canvas
                ref={canvasRef}
                onMouseDown={startInteraction}
                onMouseMove={moveInteraction}
                onMouseUp={stopInteraction}
                onMouseLeave={stopInteraction}
                onTouchStart={startInteraction}
                onTouchMove={moveInteraction}
                onTouchEnd={stopInteraction}
                className="w-full h-full touch-none"
              />

              {showScanlines && (
                <div className="absolute inset-0 pointer-events-none z-30 opacity-20"
                  style={{
                    background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
                    backgroundSize: '100% 4px, 3px 100%'
                  }}
                />
              )}

              {noise && (
                <div className="absolute inset-0 pointer-events-none z-40 opacity-[0.03] animate-pulse"
                  style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }}
                />
              )}

              <div className="absolute inset-0 pointer-events-none z-50 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] rounded-[4%]" />
              <div className="absolute inset-0 pointer-events-none z-50 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_100%)] animate-[flicker_0.1s_infinite]" />
            </div>
          </div>
        </div>

        <aside className="hidden lg:flex w-64 border-l border-[#00FF41]/20 flex-col p-6 gap-8 bg-[#050a05] z-20">
          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] border-b border-[#00FF41]/20 pb-2 text-white">PHOSPHOR_CONTROL</h3>
            <div className="grid grid-cols-5 gap-2">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setColor(c.hex)}
                  className={`w-8 h-8 border-2 transition-all ${color === c.hex ? 'border-white scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] border-b border-[#00FF41]/20 pb-2 text-white">VECTOR_SETTINGS</h3>
            <CustomSlider
              label="LINE_WIDTH"
              value={lineWidth}
              min={1}
              max={10}
              step={0.5}
              onChange={(val) => setLineWidth(val)}
              variant="brutalist"
            />
            <CustomSlider
              label="TEXT_SIZE"
              value={textSize}
              min={10}
              max={48}
              step={2}
              onChange={(val) => setTextSize(val)}
              variant="brutalist"
            />
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] border-b border-[#00FF41]/20 pb-2 text-white">DISPLAY_MODS</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={showGrid} onChange={(e) => setShowGrid(e.target.checked)} className="hidden" />
              <div className={`w-4 h-4 border ${showGrid ? 'bg-[#00FF41]' : 'bg-transparent'} border-[#00FF41]`} />
              <span className="text-[10px] group-hover:underline">GRID_OVERLAY</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={showScanlines} onChange={(e) => setShowScanlines(e.target.checked)} className="hidden" />
              <div className={`w-4 h-4 border ${showScanlines ? 'bg-[#00FF41]' : 'bg-transparent'} border-[#00FF41]`} />
              <span className="text-[10px] group-hover:underline">SCANLINES</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" checked={noise} onChange={(e) => setNoise(e.target.checked)} className="hidden" />
              <div className={`w-4 h-4 border ${noise ? 'bg-[#00FF41]' : 'bg-transparent'} border-[#00FF41]`} />
              <span className="text-[10px] group-hover:underline">SIGNAL_NOISE</span>
            </label>
          </div>

          <div className="mt-auto space-y-4">
            <div className="p-3 border border-[#00FF41]/20 bg-black/40 text-[9px] leading-relaxed">
              <div className="text-[#00FF41] mb-1 font-bold">SYSTEM_LOG:</div>
              {paths.length > 0 && <div>- VECTORS: {paths.length}</div>}
              {texts.length > 0 && <div>- LABELS: {texts.length}</div>}
              <div className="animate-pulse text-white mt-2">- STANDBY...</div>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-[#00FF41]/40">
              <CrosshairIcon size={14} />
              <span>RADAR_SWEEP_ACTIVE</span>
            </div>
          </div>
        </aside>
      </main>

      {/* Brutalist Input Modal */}
      <BrutalistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="TELEMETRY_DATA_ENTRY"
        maxWidth="max-w-md"
      >
        <div className="space-y-6">
          <p className="text-xs text-white/60">ENTER SECTOR DESIGNATION OR DATA STRING:</p>
          <input
            type="text"
            autoFocus
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
            className="w-full bg-black border border-[#00FF41]/30 p-4 text-[#00FF41] font-mono outline-none focus:border-[#00FF41] uppercase"
            placeholder="TYPE_HERE..."
          />
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-2 text-xs border border-white/10 hover:bg-white/5"
            >
              CANCEL
            </button>
            <button
              onClick={handleTextSubmit}
              className="px-6 py-2 text-xs bg-[#00FF41] text-black font-bold hover:bg-[#00FF41]/80"
            >
              COMMIT_DATA
            </button>
          </div>
        </div>
      </BrutalistModal>

      {/* Wipe Confirmation Modal */}
      <BrutalistModal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        title="SYSTEM_PURGE_WARNING"
        maxWidth="max-w-sm"
      >
        <div className="space-y-6 text-center">
          <div className="text-red-500 font-bold animate-pulse uppercase tracking-widest text-lg">
            CRITICAL_WARNING
          </div>
          <p className="text-sm text-white/80">
            YOU ARE ABOUT TO PURGE ALL TACTICAL DATA FROM THE CURRENT SESSION. THIS ACTION CANNOT BE UNDONE.
          </p>
          <div className="flex flex-col gap-3">
            <button
              onClick={handleWipeData}
              className="w-full py-4 bg-red-600 text-white font-black hover:bg-red-700 transition-colors uppercase tracking-tighter"
            >
              PURGE_ALL_DATA
            </button>
            <button
              onClick={() => setIsWipeModalOpen(false)}
              className="w-full py-2 text-xs border border-white/10 hover:bg-white/5 uppercase"
            >
              ABORT_OPERATION
            </button>
          </div>
        </div>
      </BrutalistModal>

      <style>{`
        @keyframes flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        canvas {
          image-rendering: pixelated;
        }
      `}</style>
    </div>
  );
};

export default CRTTacticalMapPage;
