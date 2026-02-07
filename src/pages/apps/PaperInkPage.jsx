import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrashIcon,
  DownloadSimpleIcon,
  PaintBrushIcon,
  PaletteIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const PaperInkPage = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [brushColor, setBrushColor] = useState('#1a1a1a');

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size
    const resize = () => {
      const tempImage = ctx.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.putImageData(tempImage, 0, 0);
    };

    window.addEventListener('resize', resize);
    resize();

    return () => window.removeEventListener('resize', resize);
  }, []);

  const getDistance = (p1, p2) =>
    Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));

  const startDrawing = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const point = {
      x: (e.clientX || e.touches[0].clientX) - rect.left,
      y: (e.clientY || e.touches[0].clientY) - rect.top,
    };
    setIsDrawing(true);
    setLastPoint(point);
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left,
      y: (e.clientY || (e.touches && e.touches[0].clientY)) - rect.top,
    };

    if (lastPoint) {
      const dist = getDistance(lastPoint, currentPoint);
      const speed = Math.max(0.1, Math.min(dist / 10, 10));

      // Dynamic thickness based on speed (Inverted for ink look: faster = thinner)
      const thickness = Math.max(1, 15 - speed);

      ctx.beginPath();
      ctx.moveTo(lastPoint.x, lastPoint.y);
      ctx.lineTo(currentPoint.x, currentPoint.y);

      ctx.strokeStyle = brushColor;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Add subtle "ink" blur
      ctx.shadowBlur = thickness * 0.2;
      ctx.shadowColor = brushColor;

      ctx.stroke();

      // Bleed effect (random small dots when moving slow)
      if (speed < 2 && Math.random() > 0.8) {
        ctx.beginPath();
        ctx.arc(
          currentPoint.x + (Math.random() - 0.5) * 5,
          currentPoint.y + (Math.random() - 0.5) * 5,
          Math.random() * 2,
          0,
          Math.PI * 2,
        );
        ctx.fillStyle = brushColor;
        ctx.fill();
      }
    }

    setLastPoint(currentPoint);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setLastPoint(null);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'ink-sketch.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div className="h-screen w-screen bg-[#f4f1ea] relative overflow-hidden cursor-crosshair select-none">
      <Seo
        title="Paper & Ink | Fezcodex"
        description="A meditative ink drawing experience on digital rice paper."
        keywords={['drawing', 'ink', 'calligraphy', 'zen', 'art', 'canvas']}
      />
      {/* Rice Paper Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/rice-paper.png')`,
        }}
      />

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="block w-full h-full"
      />

      {/* UI Controls */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-4">
        <Link
          to="/apps"
          className="bg-white text-black px-6 py-3 font-mono border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
        >
          <ArrowLeftIcon weight="bold" />
          <span>EXIT</span>
        </Link>
        <div className="bg-black px-4 py-2 border-2 border-black shadow-[4px_4px_0px_rgba(0,0,0,1)]">
          <BreadcrumbTitle
            title="Paper & Ink"
            slug="pi"
            variant="brutalist"
            className="!text-black"
          />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-6 items-center bg-white/50 backdrop-blur-md p-4 rounded-full border border-black/5 shadow-2xl pointer-events-auto">
        <button
          onClick={clearCanvas}
          className="p-3 text-gray-800 hover:text-red-600 transition-colors"
          title="Clear Canvas"
        >
          <TrashIcon size={24} weight="bold" />
        </button>

        <div className="h-8 w-px bg-black/10 mx-2" />

        <div className="flex gap-3">
          {['#1a1a1a', '#2c3e50', '#c0392b', '#27ae60', '#2980b9'].map((c) => (
            <button
              key={c}
              onClick={() => setBrushColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform ${brushColor === c ? 'scale-125 border-black shadow-md' : 'border-transparent hover:scale-110'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>

        <div className="h-8 w-px bg-black/10 mx-2" />

        <button
          onClick={downloadImage}
          className="p-3 text-gray-800 hover:text-blue-600 transition-colors"
          title="Download"
        >
          <DownloadSimpleIcon size={24} weight="bold" />
        </button>
      </div>

      {/* Floating Instructions */}
      <div className="absolute top-6 right-6 text-right pointer-events-none">
        <h2 className="font-playfairDisplay text-3xl text-black/40 italic">
          Paper & Ink
        </h2>
        <p className="font-arvo text-sm text-black/30 mt-2">
          Swift strokes are narrow, slow ones are deep.
        </p>
      </div>

      {/* Visual Indicator of current brush */}
      <div className="absolute bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-2 text-black/20 font-mono text-[10px] uppercase tracking-[0.3em]">
        <PaintBrushIcon size={14} />
        <span>Flow State Active</span>
        <PaletteIcon size={14} />
      </div>
    </div>
  );
};

export default PaperInkPage;
