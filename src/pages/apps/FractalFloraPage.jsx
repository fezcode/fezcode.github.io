import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimple,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const FractalFloraPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // --- Parameters ---
  const [depth, setDepth] = useState(10);
  const [angle, setAngle] = useState(25);
  const [lengthBase, setLengthBase] = useState(120);
  const [lengthMultiplier, setLengthMultiplier] = useState(0.7);
  const [asymmetry, setAsymmetry] = useState(0); // -10 to 10 degrees bias
  const [randomness, setRandomness] = useState(0.2); // 0 to 1
  const [season, setSeason] = useState('summer'); // summer, autumn, winter, spring, neon

  // --- Animation State ---
  // progress value for animation (0 to 1) omitted if not used

  const drawTree = useCallback(
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      // Color Palettes
      const palettes = {
        summer: { trunk: '#5D4037', leaf: '#4CAF50', bg: '#E8F5E9' },
        autumn: { trunk: '#3E2723', leaf: '#FF5722', bg: '#FFF3E0' },
        winter: { trunk: '#212121', leaf: '#B0BEC5', bg: '#ECEFF1' },
        spring: { trunk: '#795548', leaf: '#F48FB1', bg: '#FCE4EC' },
        neon: { trunk: '#EA00FF', leaf: '#00E5FF', bg: '#120024' },
      };

      const theme = palettes[season];

      // Draw Background
      ctx.fillStyle = theme.bg;
      ctx.fillRect(0, 0, w, h);

      const maxDepth = depth;

      // Recursive Function
      const branch = (x, y, len, ang, d) => {
        ctx.beginPath();
        ctx.save();
        ctx.strokeStyle = d > 2 ? theme.trunk : theme.leaf;
        ctx.fillStyle = theme.leaf;
        ctx.lineWidth = d > 2 ? d : 1;
        ctx.lineCap = 'round';

        ctx.translate(x, y);
        ctx.rotate((ang * Math.PI) / 180);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -len);
        ctx.stroke();

        if (d > 0) {
          // Leaves at the end
          if (d <= 2) {
            ctx.beginPath();
            ctx.arc(0, -len, 4 * (randomness + 0.5), 0, Math.PI * 2);
            ctx.fill();
          }

          // Calculate next branch props
          // Add randomness to length and angle
          const randLen = 1 + (Math.random() - 0.5) * randomness;
          const randAng = (Math.random() - 0.5) * randomness * 30;

          const nextLen = len * lengthMultiplier * randLen;

          // Right branch
          branch(0, -len, nextLen, angle + asymmetry + randAng, d - 1);
          // Left branch
          branch(0, -len, nextLen, -angle + asymmetry + randAng, d - 1);

          // Optional middle branch for lushness if randomness is high
          if (randomness > 0.6 && d > 4) {
            branch(0, -len, nextLen * 0.8, randAng, d - 2);
          }
        }
        ctx.restore();
      };

      // Start the tree at bottom center
      branch(w / 2, h, lengthBase, 0, maxDepth);
    },
    [depth, angle, lengthBase, lengthMultiplier, asymmetry, randomness, season],
  );

  // Effect to redraw when params change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Use a timeout to debounce slightly or just draw immediately
    // RequestAnimationFrame ensures we don't block UI
    let rafId = requestAnimationFrame(() => drawTree(ctx, width, height));

    return () => cancelAnimationFrame(rafId);
  }, [drawTree]);

  // Init Canvas Size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // High res for sharpness
      canvas.width = 800;
      canvas.height = 600;
    }
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `fractal_flora_${season}.png`;
    link.href = canvas.toDataURL();
    link.click();
    addToast({
      title: 'Saved',
      message: 'Tree saved to device.',
      duration: 3000,
    });
  };

  const randomizeParams = () => {
    setAngle(15 + Math.random() * 40);
    setLengthMultiplier(0.6 + Math.random() * 0.2);
    setAsymmetry((Math.random() - 0.5) * 20);
    setRandomness(Math.random() * 0.8);
    const seasons = ['summer', 'autumn', 'winter', 'spring', 'neon'];
    setSeason(seasons[Math.floor(Math.random() * seasons.length)]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Seo
        title="Fractal Flora | Fezcodex"
        description="Grow digital trees using recursive mathematics."
        keywords={['fractal', 'tree', 'recursive', 'generative art', 'math']}
      />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-6xl">
        {/* Header */}
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Fractal Flora" slug="flora" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          {/* Controls */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
            <div className="flex gap-2 mb-4">
              <button
                onClick={randomizeParams}
                className="flex-1 py-2 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center justify-center gap-2 transition-colors"
              >
                <ArrowsClockwise size={20} /> Randomize
              </button>
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
                title="Download"
              >
                <DownloadSimple size={24} />
              </button>
            </div>

            {/* Season Selector */}
            <div className="flex gap-2 justify-between p-1 bg-gray-100 rounded-lg">
              {['spring', 'summer', 'autumn', 'winter', 'neon'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`flex-1 py-1 rounded-md text-xs font-bold uppercase transition-all ${season === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Recursion Depth</span>
                  <span className="text-gray-500">{depth}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="14"
                  value={depth}
                  onChange={(e) => setDepth(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Branch Angle</span>
                  <span className="text-gray-500">{Math.round(angle)}°</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Length Multiplier</span>
                  <span className="text-gray-500">
                    {lengthMultiplier.toFixed(2)}
                  </span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="0.85"
                  step="0.01"
                  value={lengthMultiplier}
                  onChange={(e) => setLengthMultiplier(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Trunk Base Size</span>
                  <span className="text-gray-500">{lengthBase}px</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={lengthBase}
                  onChange={(e) => setLengthBase(Number(e.target.value))}
                  className="w-full accent-green-600"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Wind / Asymmetry</span>
                  <span className="text-gray-500">
                    {Math.round(asymmetry)}°
                  </span>
                </label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  value={asymmetry}
                  onChange={(e) => setAsymmetry(Number(e.target.value))}
                  className="w-full accent-blue-500"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Organic Randomness</span>
                  <span className="text-gray-500">
                    {Math.round(randomness * 100)}%
                  </span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={randomness}
                  onChange={(e) => setRandomness(Number(e.target.value))}
                  className="w-full accent-orange-500"
                />
              </div>
            </div>

            <div className="bg-green-50 p-3 rounded-lg text-xs text-green-800">
              <strong>Fact:</strong> Nature uses fractals to maximize surface
              area for sunlight (leaves) and nutrients (roots) efficiently!
            </div>
          </div>

          {/* Canvas */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 flex items-center justify-center overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto rounded-lg shadow-inner border border-gray-100"
              style={{ maxHeight: '600px' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractalFloraPage;
