import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimple,
  ArrowsClockwise,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import CustomSlider from '../../components/CustomSlider';

const AbstractWavesPage = () => {
  useSeo({
    title: 'Abstract Waves | Fezcodex',
    description: 'Generate mesmerizing black and white abstract wave patterns.',
    keywords: [
      'waves',
      'generative art',
      'abstract',
      'black and white',
      'canvas',
    ],
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  // --- Parameters ---
  const [lineCount, setLineCount] = useState(50);
  const [amplitude, setAmplitude] = useState(50);
  const [frequency, setFrequency] = useState(0.02);
  const [perspective, setPerspective] = useState(10); // Spacing
  const [noise, setNoise] = useState(10); // Random offset
  const [phase, setPhase] = useState(0);
  const [lineWidth, setLineWidth] = useState(2);
  const [fill, setFill] = useState(true); // Fill below line to hide lines behind
  const [inverted, setInverted] = useState(false);

  const drawWaves = useCallback(
    (ctx, w, h) => {
      const bgColor = inverted ? '#000000' : '#ffffff';
      const lineColor = inverted ? '#ffffff' : '#000000';

      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, w, h);

      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = lineColor;
      ctx.fillStyle = bgColor; // For hiding lines behind

      // Center vertically roughly
      const totalHeight = lineCount * perspective;
      const startY = (h - totalHeight) / 2;

      for (let i = 0; i < lineCount; i++) {
        const yBase = startY + i * perspective;

        ctx.beginPath();
        for (let x = 0; x <= w; x += 5) {
          // Step size 5 for performance
          // Create a complex wave by combining sine waves and noise
          const distFromCenter = Math.abs(x - w / 2);
          const dampener = Math.max(0, 1 - distFromCenter / (w / 2)); // 1 at center, 0 at edges

          // Main wave
          let y =
            yBase +
            Math.sin(x * frequency + phase + i * 0.1) * amplitude * dampener;

          // Add some "noise" or irregularity
          y += Math.cos(x * frequency * 2.5 + i * 0.5) * (noise * dampener);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        if (fill) {
          // Close the path for filling to hide lines behind
          ctx.lineTo(w, w); // Down to bottom right (roughly) - actually just needs to be low enough
          ctx.lineTo(0, w); // Back to bottom left
          ctx.closePath();
          ctx.fill();

          // Re-stroke the top line
          ctx.stroke();
        } else {
          ctx.stroke();
        }
      }
    },
    [
      lineCount,
      amplitude,
      frequency,
      perspective,
      noise,
      phase,
      lineWidth,
      fill,
      inverted,
    ],
  );

  // Effect to redraw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let rafId = requestAnimationFrame(() => drawWaves(ctx, width, height));
    return () => cancelAnimationFrame(rafId);
  }, [drawWaves]);

  // Init Canvas Size
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = 1200;
      canvas.height = 800;
    }
  }, []);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = `abstract_waves_${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
    addToast({
      title: 'Saved',
      message: 'Wave pattern saved to device.',
      duration: 3000,
    });
  };

  const randomizeParams = () => {
    setLineCount(30 + Math.floor(Math.random() * 50));
    setAmplitude(20 + Math.random() * 80);
    setFrequency(0.005 + Math.random() * 0.04);
    setPerspective(5 + Math.random() * 20);
    setNoise(Math.random() * 40);
    setPhase(Math.random() * Math.PI * 2);
    setInverted(Math.random() > 0.5);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-6xl">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Abstract Waves" slug="aw" />

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

            {/* Toggles */}
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inverted}
                  onChange={(e) => setInverted(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-medium text-gray-700">
                  Invert Colors
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={fill}
                  onChange={(e) => setFill(e.target.checked)}
                  className="w-4 h-4 accent-black"
                />
                <span className="text-sm font-medium text-gray-700">
                  Opaque Lines
                </span>
              </label>
            </div>

            <div className="space-y-4">
              <CustomSlider
                label="Line Count"
                min={10}
                max={100}
                value={lineCount}
                onChange={setLineCount}
              />
              <CustomSlider
                label="Amplitude (Height)"
                min={0}
                max={150}
                value={Math.round(amplitude)}
                onChange={setAmplitude}
              />
              <CustomSlider
                label="Frequency (Width)"
                min={0.001}
                max={0.05}
                step={0.001}
                value={frequency}
                onChange={setFrequency}
              />
              <CustomSlider
                label="Spacing"
                min={2}
                max={40}
                value={perspective}
                onChange={setPerspective}
              />
              <CustomSlider
                label="Noise / Distortion"
                min={0}
                max={100}
                value={Math.round(noise)}
                onChange={setNoise}
              />
              <CustomSlider
                label="Phase Shift"
                min={0}
                max={10}
                step={0.1}
                value={phase}
                onChange={setPhase}
              />
              <CustomSlider
                label="Line Width"
                min={1}
                max={10}
                value={lineWidth}
                onChange={setLineWidth}
              />
            </div>
            <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600">
              <strong>Tip:</strong> "Opaque Lines" hides the waves behind the
              current one, creating a 3D landscape effect similar to the famous
              "Unknown Pleasures" album cover.
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

export default AbstractWavesPage;
