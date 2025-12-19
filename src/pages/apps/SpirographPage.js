import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon, // Added ArrowLeftIcon
  DownloadSimple,
  Eraser,
  Play,
  Pause,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const SpirographPage = () => {
  useSeo({
    title: 'Spirograph Generator | Fezcodex',
    description: 'Create mesmerizing geometric patterns with math.',
    keywords: ['spirograph', 'geometry', 'art', 'generator', 'math art'],
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // Parameters
  const [outerRadius, setOuterRadius] = useState(150); // R
  const [innerRadius, setInnerRadius] = useState(52); // r
  const [penOffset, setPenOffset] = useState(50); // d
  const [resolution, setResolution] = useState(0.1); // t step
  const [speed, setSpeed] = useState(5);
  const [color, setColor] = useState('#ec4899'); // Default pink-ish
  const [isRainbow, setIsRainbow] = useState(false);

  // State
  const [isDrawing, setIsDrawing] = useState(false);
  const [angle, setAngle] = useState(0);

  // Refs for animation loop
  const requestRef = useRef();

  // Draw helper
  const draw = useCallback((ctx, currentAngle) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    const R = outerRadius;
    const r = innerRadius;
    const d = penOffset;

    // Current point
    const x =
      (R - r) * Math.cos(currentAngle) +
      d * Math.cos(((R - r) / r) * currentAngle);
    const y =
      (R - r) * Math.sin(currentAngle) -
      d * Math.sin(((R - r) / r) * currentAngle);

    // Previous point (to draw line)
    // We approximate prev point by subtracting resolution.
    // Ideally we store the last point, but for high res this is okayish,
    // or we can use moveTo/lineTo in a path.
    // Better approach for continuous drawing:

    ctx.beginPath();
    // Calculate a slightly previous point to connect to
    const prevAngle = currentAngle - resolution;
    const prevX =
      (R - r) * Math.cos(prevAngle) + d * Math.cos(((R - r) / r) * prevAngle);
    const prevY =
      (R - r) * Math.sin(prevAngle) - d * Math.sin(((R - r) / r) * prevAngle);

    ctx.moveTo(centerX + prevX, centerY + prevY);
    ctx.lineTo(centerX + x, centerY + y);

    ctx.strokeStyle = isRainbow
      ? `hsl(${(currentAngle * 10) % 360}, 70%, 50%)`
      : color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [outerRadius, innerRadius, penOffset, resolution, isRainbow, color]);

  const animate = useCallback(() => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Draw multiple steps per frame based on speed
    let currentAngle = angle;
    for (let i = 0; i < speed; i++) {
      currentAngle += resolution;
      draw(ctx, currentAngle);
    }

    setAngle(currentAngle);

    // Stop if we've done a lot of cycles?
    // For now, let it run infinitely or until user stops.
    // Real spirographs close loops, but with floats it might not perfectly align.
    // A huge number of rotations usually fills the circle.
    if (currentAngle > 600 * Math.PI) {
      setIsDrawing(false);
      addToast({
        title: 'Finished',
        message: 'Autostop after 300 cycles',
        duration: 2000,
      });
    } else {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [isDrawing, angle, speed, resolution, draw, addToast]);

  useEffect(() => {
    if (isDrawing) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      cancelAnimationFrame(requestRef.current);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [isDrawing, animate]);

  // Init canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 800;
      canvas.height = 800;
      // Optional: Clear on mount or keep? keep blank
    }
  }, []);

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setAngle(0);
    setIsDrawing(false);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'spirograph.png';
    link.href = canvas.toDataURL();
    link.click();
    addToast({
      title: 'Saved',
      message: 'Image downloaded successfully.',
      duration: 3000,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-6xl">
        {/* Header */}
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Spirograph Generator" slug="spiro" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          {/* Controls */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setIsDrawing(!isDrawing)}
                className={`flex-1 py-2 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
                  isDrawing
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {isDrawing ? (
                  <>
                    <Pause /> Pause
                  </>
                ) : (
                  <>
                    <Play /> Draw
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                title="Clear Canvas"
              >
                <Eraser size={24} />
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 flex items-center justify-center"
                title="Download Image"
              >
                <DownloadSimple size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Outer Radius (R): {outerRadius}
                </label>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={outerRadius}
                  onChange={(e) => {
                    setIsDrawing(false);
                    setOuterRadius(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inner Radius (r): {innerRadius}
                </label>
                <input
                  type="range"
                  min="2"
                  max="200"
                  value={innerRadius}
                  onChange={(e) => {
                    setIsDrawing(false);
                    setInnerRadius(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pen Offset (d): {penOffset}
                </label>
                <input
                  type="range"
                  min="2"
                  max="200"
                  value={penOffset}
                  onChange={(e) => {
                    setIsDrawing(false);
                    setPenOffset(Number(e.target.value));
                  }}
                  className="w-full"
                />
              </div>
              <div className="pt-4 border-t border-gray-100">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drawing Speed: {speed}
                </label>
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resolution (Quality): {resolution}
                </label>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={resolution}
                  onChange={(e) => setResolution(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Lower is smoother but slower.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Pen Color
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Rainbow</span>
                  <input
                    type="checkbox"
                    checked={isRainbow}
                    onChange={(e) => setIsRainbow(e.target.checked)}
                    className="rounded text-pink-500 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  '#ec4899',
                  '#8b5cf6',
                  '#3b82f6',
                  '#10b981',
                  '#f59e0b',
                  '#ef4444',
                  '#111827',
                ].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${color === c && !isRainbow ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-8 h-8 p-0 border-0 rounded-full overflow-hidden cursor-pointer"
                />
              </div>
            </div>

            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
              <strong>Tip:</strong> Change R, r, or d slightly while drawing to
              create evolving patterns!
            </div>
          </div>
          {/* Canvas Area */}
          <div className="lg:col-span-2 w-[820px] h-[820px] bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="bg-white" // Removed responsive sizing as parent is fixed
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpirographPage;
