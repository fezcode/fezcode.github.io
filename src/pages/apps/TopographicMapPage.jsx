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

// --- Simple Noise Implementation ---
// Based on a standard permutation table approach for Perlin-like noise
const PERM = new Uint8Array(512);
const initNoise = () => {
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const r = Math.floor(Math.random() * (i + 1));
    [p[i], p[r]] = [p[r], p[i]];
  }
  for (let i = 0; i < 512; i++) PERM[i] = p[i & 255];
};
initNoise();

const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
const lerp = (t, a, b) => a + t * (b - a);
const grad = (hash, x, y, z) => {
  const h = hash & 15;
  const u = h < 8 ? x : y;
  const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
  return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
};

const noise = (x, y, z) => {
  const X = Math.floor(x) & 255;
  const Y = Math.floor(y) & 255;
  const Z = Math.floor(z) & 255;
  x -= Math.floor(x);
  y -= Math.floor(y);
  z -= Math.floor(z);
  const u = fade(x);
  const v = fade(y);
  const w = fade(z);
  const A = PERM[X] + Y,
    AA = PERM[A] + Z,
    AB = PERM[A + 1] + Z;
  const B = PERM[X + 1] + Y,
    BA = PERM[B] + Z,
    BB = PERM[B + 1] + Z;

  return lerp(
    w,
    lerp(
      v,
      lerp(u, grad(PERM[AA], x, y, z), grad(PERM[BA], x - 1, y, z)),
      lerp(u, grad(PERM[AB], x, y - 1, z), grad(PERM[BB], x - 1, y - 1, z)),
    ),
    lerp(
      v,
      lerp(
        u,
        grad(PERM[AA + 1], x, y, z - 1),
        grad(PERM[BA + 1], x - 1, y, z - 1),
      ),
      lerp(
        u,
        grad(PERM[AB + 1], x, y - 1, z - 1),
        grad(PERM[BB + 1], x - 1, y - 1, z - 1),
      ),
    ),
  );
};

const TopographicMapPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // --- Parameters ---
  const [scale, setScale] = useState(100);
  const [levels, setLevels] = useState(15);
  const [lineWidth, setLineWidth] = useState(1);
  const [seed, setSeed] = useState(Math.random() * 1000);
  const [showColors, setShowColors] = useState(false);
  const [smoothness, setSmoothness] = useState(0.5); // Octaves influence

  const drawMap = useCallback(
    (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);

      const imgData = ctx.createImageData(w, h);
      const data = imgData.data;

      const noiseScale = scale / 20000; // Adjusted for pixel coordinates

      for (let x = 0; x < w; x++) {
        for (let y = 0; y < h; y++) {
          let value = 0;
          let amplitude = 1;
          let frequency = 1;
          let maxValue = 0;

          // Octaves for detail
          for (let o = 0; o < 4; o++) {
            value +=
              noise(
                (x + seed) * noiseScale * frequency,
                (y + seed) * noiseScale * frequency,
                0,
              ) * amplitude;
            maxValue += amplitude;
            amplitude *= smoothness;
            frequency *= 2;
          }

          // Normalize to 0-1
          value = value / maxValue + 0.5;
          value = Math.max(0, Math.min(1, value));

          // Contour Logic
          const levelStep = 1 / levels;
          const levelIndex = Math.floor(value / levelStep);
          const levelValue = levelIndex * levelStep;
          const distToNext = Math.abs(value - (levelIndex + 1) * levelStep);
          const distToPrev = Math.abs(value - levelValue);
          const distToLine = Math.min(distToNext, distToPrev);

          // Anti-aliased Line Logic
          // Determine "line strength" based on distance and width
          // The distToLine is in "value space" (0-1), so we need to map line width to that space roughly
          // This is an approximation.
          const thicknessThreshold =
            (0.003 * lineWidth) / Math.max(0.2, smoothness); // Adjust thickness calc

          // Smoothstep-like fade
          // 1.0 = black (center of line), 0.0 = white (far from line)
          let lineAlpha = 0;
          if (distToLine < thicknessThreshold) {
            lineAlpha = 1.0 - distToLine / thicknessThreshold;
            // Sharpen the curve a bit
            lineAlpha = Math.pow(lineAlpha, 0.5);
          }

          const index = (x + y * w) * 4;

          if (showColors) {
            // Simple elevation coloring
            let r, g, b;
            if (value < 0.3) {
              // Water
              r = 60;
              g = 120;
              b = 200;
            } else if (value < 0.4) {
              // Sand
              r = 240;
              g = 230;
              b = 140;
            } else if (value < 0.7) {
              // Grass
              r = 60;
              g = 180;
              b = 60;
            } else {
              // Rock/Snow
              const val = Math.floor(value * 255);
              r = val;
              g = val;
              b = val;
            }

            // Blend line on top (black line)
            // color = color * (1 - alpha) + black * alpha
            // since black is 0,0,0, it becomes color * (1 - alpha)
            data[index] = r * (1 - lineAlpha * 0.6); // Not fully black lines on color
            data[index + 1] = g * (1 - lineAlpha * 0.6);
            data[index + 2] = b * (1 - lineAlpha * 0.6);
            data[index + 3] = 255;
          } else {
            // Black and white contours
            // White background (255), black line (0)
            // val = 255 * (1 - alpha)
            const val = 255 * (1 - lineAlpha);
            data[index] = val;
            data[index + 1] = val;
            data[index + 2] = val;
            data[index + 3] = 255;
          }
        }
      }
      ctx.putImageData(imgData, 0, 0);
    },
    [scale, levels, lineWidth, seed, showColors, smoothness],
  );

  // Effect to redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Use a short timeout to allow UI updates
    const timer = setTimeout(() => {
      drawMap(ctx, width, height);
    }, 10);

    return () => clearTimeout(timer);
  }, [drawMap]);

  // Init Canvas Size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Supersampling: 2x resolution for smoother lines
      canvas.width = 1600;
      canvas.height = 1200;
    }
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `topo_map_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    addToast({
      title: 'Saved',
      message: 'Map saved to device.',
      duration: 3000,
    });
  };

  const randomizeParams = () => {
    initNoise(); // Reshuffle perms
    setSeed(Math.random() * 10000);
    setScale(50 + Math.random() * 150);
    setLevels(5 + Math.floor(Math.random() * 20));
    setSmoothness(0.3 + Math.random() * 0.4);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Seo
        title="Topographic Map Generator | Fezcodex"
        description="Generate seamless topographic contour maps."
        keywords={[
          'topographic',
          'map',
          'contour',
          'height map',
          'generative art',
          'noise',
        ]}
      />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-6xl">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Topographic Maps" slug="topo" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
          {/* Controls */}
          <div className="space-y-6 bg-white p-6 rounded-xl shadow-md border border-gray-200 h-fit">
            <div className="flex gap-2 mb-4">
              <button
                onClick={randomizeParams}
                className="flex-1 py-2 px-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 flex items-center justify-center gap-2 transition-colors"
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

            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showColors}
                  onChange={(e) => setShowColors(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-medium text-gray-700">
                  Show Elevation Colors
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Zoom Scale</span>
                  <span className="text-gray-500">{Math.round(scale)}</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="300"
                  value={scale}
                  onChange={(e) => setScale(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Contour Levels</span>
                  <span className="text-gray-500">{levels}</span>
                </label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  value={levels}
                  onChange={(e) => setLevels(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Roughness</span>
                  <span className="text-gray-500">{smoothness.toFixed(2)}</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={smoothness}
                  onChange={(e) => setSmoothness(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
              <div>
                <label className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                  <span>Line Width</span>
                  <span className="text-gray-500">{lineWidth}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={lineWidth}
                  onChange={(e) => setLineWidth(Number(e.target.value))}
                  className="w-full accent-black"
                />
              </div>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg text-xs text-blue-800">
              <strong>Idea:</strong> Toggle "Elevation Colors" to see a classic
              physical map style, or keep it black and white for a sleek
              technical drawing look.
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

export default TopographicMapPage;
