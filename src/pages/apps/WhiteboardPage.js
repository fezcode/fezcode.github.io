import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  PencilSimpleIcon,
  Eraser,
  Trash,
  DownloadSimple,
  Palette,
  Waves,
} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const WhiteboardPage = () => {
  useSeo({
    title: 'Whiteboard | Fezcodex',
    description: 'A simple digital whiteboard for sketching and doodling.',
    keywords: ['Fezcodex', 'whiteboard', 'drawing', 'sketch', 'canvas', 'draw'],
    ogTitle: 'Whiteboard | Fezcodex',
    ogDescription: 'A simple digital whiteboard for sketching and doodling.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Whiteboard | Fezcodex',
    twitterDescription:
      'A simple digital whiteboard for sketching and doodling.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 }); // Track last position for segment drawing
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

    // Handle High DPI screens
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = 600 * dpr; // Increased height
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = '600px'; // Increased height

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, rect.width, 600); // White background

    setContext(ctx);

    const handleResize = () => {
      // Resize logic could go here
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update Context Properties when state changes
  useEffect(() => {
    if (context) {
      context.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
      context.lineWidth = lineWidth;
    }
  }, [context, color, lineWidth, tool]);

  const getCoordinates = (event) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

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
    event.preventDefault(); // Prevent scrolling on touch
    const { x, y } = getCoordinates(event);
    lastPos.current = { x, y };
    setIsDrawing(true);

    // Draw a dot
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
      // Calculate a random control point for the curve
      const midX = (lastPos.current.x + x) / 2;
      const midY = (lastPos.current.y + y) / 2;
      const jitter = 15; // Adjust jitter intensity
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
    addToast({
      title: 'Canvas Cleared',
      message: 'Start fresh!',
      duration: 2000,
    });
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = image;
    link.download = 'whiteboard_doodle.png';
    link.click();
    addToast({
      title: 'Saved',
      message: 'Image downloaded successfully.',
      duration: 2000,
    });
  };

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const colorsList = [
    '#000000', // Black
    '#FF0000', // Red
    '#0000FF', // Blue
    '#008000', // Green
    '#FFA500', // Orange
    '#800080', // Purple
    '#A0522D', // Sienna
  ];

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Whiteboard" slug="draw" />
        <hr className="border-gray-700" />

        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative h-full w-full max-w-7xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10 rounded-lg overflow-hidden"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>

            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center justify-center gap-2">
                <PencilSimpleIcon size={32} /> Whiteboard
              </h1>

              {/* Toolbar */}
              <div className="flex flex-wrap justify-between items-center bg-gray-800 p-3 rounded-t-lg border-b border-gray-700 gap-4">
                {/* Tools */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setTool('pen')}
                    className={`p-2 rounded ${tool === 'pen' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    title="Pen"
                  >
                    <PencilSimpleIcon size={24} />
                  </button>
                  <button
                    onClick={() => setTool('eraser')}
                    className={`p-2 rounded ${tool === 'eraser' ? 'bg-blue-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    title="Eraser"
                  >
                    <Eraser size={24} />
                  </button>
                  <button
                    onClick={() => setIsSquiggly(!isSquiggly)}
                    className={`p-2 rounded ${isSquiggly ? 'bg-purple-600 text-white' : 'bg-gray-700 hover:bg-gray-600'}`}
                    title="Squiggly Mode"
                  >
                    <Waves size={24} />
                  </button>
                </div>

                {/* Colors */}
                <div className="flex gap-2 items-center">
                  <Palette size={24} className="text-gray-400 mr-1" />
                  {colorsList.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setColor(c);
                        setTool('pen');
                      }}
                      className={`w-6 h-6 rounded-full border-2 ${color === c && tool === 'pen' ? 'border-white scale-110' : 'border-transparent hover:scale-110'} transition-transform`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>

                {/* Size */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Size:</span>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={lineWidth}
                    onChange={(e) => setLineWidth(parseInt(e.target.value))}
                    className="w-24 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={clearCanvas}
                    className="p-2 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/50 transition-colors"
                    title="Clear Canvas"
                  >
                    <Trash size={20} />
                  </button>
                  <button
                    onClick={downloadCanvas}
                    className="p-2 rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/50 transition-colors"
                    title="Download"
                  >
                    <DownloadSimple size={20} />
                  </button>
                </div>
              </div>

              {/* Canvas Container */}
              <div
                ref={containerRef}
                className="w-full h-[600px] bg-white rounded-b-lg overflow-hidden cursor-crosshair touch-none shadow-inner"
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

              <p className="text-center mt-4 text-sm opacity-60">
                Draw something amazing! Or just a stick figure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhiteboardPage;
