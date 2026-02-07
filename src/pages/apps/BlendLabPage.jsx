import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeftIcon,
  PaletteIcon,
  PlusIcon,
  TrashIcon,
  ArrowsClockwiseIcon,
  TextAaIcon,
  SelectionIcon,
  InfoIcon,
  DownloadSimpleIcon,
  ArrowsOutCardinalIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';

const DEFAULT_COLORS = [
  '#ef4444',
  '#10b981',
  '#3b82f6',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
];

const BlendLabPage = () => {
  const appName = 'Blend Lab';

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  const [blobs, setBlobs] = useState([
    { id: 1, color: '#ef4444', x: 20, y: 20, size: 40 },
    { id: 2, color: '#10b981', x: 70, y: 30, size: 50 },
    { id: 3, color: '#3b82f6', x: 40, y: 70, size: 45 },
  ]);
  const [blurAmount, setBlurAmount] = useState(60);
  const [noiseOpacity, setNoiseOpacity] = useState(0.15);

  // Text Layer 1
  const [topText, setTopText] = useState('DESIGN');
  const [topFontSize, setTopFontSize] = useState(12);
  const [topFontColor, setTopFontColor] = useState('#FFFFFF');
  const [topFontWeight, setTopFontWeight] = useState(900);
  const [topX, setTopX] = useState(50);
  const [topY, setTopY] = useState(45);

  // Text Layer 2
  const [bottomText, setBottomText] = useState('STUDIO');
  const [bottomFontSize, setBottomFontSize] = useState(8);
  const [bottomFontColor, setBottomFontColor] = useState('#FFFFFF');
  const [bottomFontWeight, setBottomFontWeight] = useState(400);
  const [bottomX, setBottomX] = useState(50);
  const [bottomY, setBottomY] = useState(55);

  const drawComposition = useCallback(
    (ctx, width, height) => {
      const scale = width / 1000;

      // 1. Strict Black Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw Blobs
      ctx.save();
      ctx.filter = `blur(${blurAmount * scale}px)`;
      blobs.forEach((blob) => {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = blob.color;
        ctx.beginPath();
        const radius = (blob.size / 100) * width;
        ctx.arc(
          (blob.x / 100) * width,
          (blob.y / 100) * height,
          radius,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        ctx.restore();
      });
      ctx.restore();

      // 3. Tiled Noise Grain
      const noiseSize = 256;
      const noiseCanvas = document.createElement('canvas');
      noiseCanvas.width = noiseSize;
      noiseCanvas.height = noiseSize;
      const nCtx = noiseCanvas.getContext('2d');
      const nData = nCtx.createImageData(noiseSize, noiseSize);
      for (let i = 0; i < nData.data.length; i += 4) {
        const val = Math.random() * 255;
        nData.data[i] = nData.data[i + 1] = nData.data[i + 2] = val;
        nData.data[i + 3] = 255;
      }
      nCtx.putImageData(nData, 0, 0);

      ctx.save();
      ctx.globalAlpha = noiseOpacity;
      ctx.globalCompositeOperation = 'overlay';
      const pattern = ctx.createPattern(noiseCanvas, 'repeat');
      ctx.fillStyle = pattern;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();

      // 4. Typography
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Top Text
      ctx.save();
      ctx.fillStyle = topFontColor;
      const scaledTopSize = topFontSize * 16 * scale;
      ctx.font = `${topFontWeight} ${scaledTopSize}px "Playfair Display", serif`;
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 30 * scale;
      ctx.fillText(topText, (topX / 100) * width, (topY / 100) * height);
      ctx.restore();

      // Bottom Text
      if (bottomText) {
        ctx.save();
        ctx.fillStyle = bottomFontColor;
        const scaledBottomSize = bottomFontSize * 16 * scale;
        ctx.font = `${bottomFontWeight} ${scaledBottomSize}px "Playfair Display", serif`;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 30 * scale;
        ctx.fillText(
          bottomText,
          (bottomX / 100) * width,
          (bottomY / 100) * height,
        );
        ctx.restore();
      }
    },
    [
      blobs,
      blurAmount,
      noiseOpacity,
      topText,
      topFontSize,
      topFontColor,
      topFontWeight,
      topX,
      topY,
      bottomText,
      bottomFontSize,
      bottomFontColor,
      bottomFontWeight,
      bottomX,
      bottomY,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    document.fonts.ready.then(() => {
      drawComposition(ctx, rect.width, rect.height);
    });
  }, [drawComposition]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 3840;
    const H = 2160;
    canvas.width = W;
    canvas.height = H;

    drawComposition(ctx, W, H);

    const link = document.createElement('a');
    link.download = `fezcodex-master-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({
      title: 'Export Complete',
      message: '4K master sequence generated.',
    });
  };

  const addBlob = () => {
    if (blobs.length >= 12) {
      addToast({
        title: 'Limit Reached',
        message: 'Maximum color layers active.',
      });
      return;
    }
    const newBlob = {
      id: Date.now(),
      color: DEFAULT_COLORS[Math.floor(Math.random() * DEFAULT_COLORS.length)],
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 30 + 30,
    };
    setBlobs([...blobs, newBlob]);
  };

  const updateBlob = (id, field, value) => {
    setBlobs(blobs.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const removeBlob = (id) => {
    setBlobs(blobs.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Blend Lab | Fezcodex"
        description="Create high-impact color fields with noise, blur, and custom typography."
        keywords={[
          'Fezcodex',
          'gradient generator',
          'noise texture',
          'brutalist design',
          'typography',
        ]}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon
              weight="bold"
              className="transition-transform group-hover:-translate-x-1"
            />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Chromatic synthesis lab. Map entities across the coordinate
                matrix and apply diffusion filters to create high-impact
                compositions.
              </p>
            </div>

            <button
              onClick={handleDownload}
              className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
            >
              <DownloadSimpleIcon weight="bold" size={24} />
              <span>Export 4K Master</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Scene Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <div className="flex justify-between items-center border-b border-white/5 pb-6">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <PaletteIcon weight="fill" />
                  Color_Entities
                </h3>
                <button
                  onClick={addBlob}
                  className="p-2 bg-white text-black hover:bg-emerald-400 transition-colors rounded-sm"
                >
                  <PlusIcon weight="bold" size={16} />
                </button>
              </div>

              <div className="space-y-6 max-h-[400px] overflow-y-auto custom-scrollbar-terminal pr-2">
                <AnimatePresence initial={false}>
                  {blobs.map((blob) => (
                    <motion.div
                      key={blob.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="p-6 border border-white/5 bg-white/[0.01] rounded-sm space-y-6"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={blob.color}
                            onChange={(e) =>
                              updateBlob(blob.id, 'color', e.target.value)
                            }
                            className="w-6 h-6 rounded-full border-none cursor-pointer bg-transparent"
                          />
                          <span className="font-mono text-[10px] text-gray-500 uppercase">
                            {blob.color}
                          </span>
                        </div>
                        <button
                          onClick={() => removeBlob(blob.id)}
                          className="text-gray-600 hover:text-red-500"
                        >
                          <TrashIcon size={16} />
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                            <span>Magnitude</span>
                            <span>{blob.size}%</span>
                          </div>
                          <input
                            type="range"
                            min="5"
                            max="150"
                            value={blob.size}
                            onChange={(e) =>
                              updateBlob(
                                blob.id,
                                'size',
                                parseInt(e.target.value),
                              )
                            }
                            className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-gray-600 uppercase">
                              Pos_X
                            </label>
                            <input
                              type="range"
                              min="-20"
                              max="120"
                              value={blob.x}
                              onChange={(e) =>
                                updateBlob(
                                  blob.id,
                                  'x',
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-mono text-gray-600 uppercase">
                              Pos_Y
                            </label>
                            <input
                              type="range"
                              min="-20"
                              max="120"
                              value={blob.y}
                              onChange={(e) =>
                                updateBlob(
                                  blob.id,
                                  'y',
                                  parseInt(e.target.value),
                                )
                              }
                              className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-12">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <SelectionIcon weight="fill" />
                Lab_Matrix
              </h3>

              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[10px] uppercase text-gray-500">
                    <span>Blur_Diffusion</span>
                    <span className="text-white">{blurAmount}PX</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between font-mono text-[10px] uppercase text-gray-500">
                    <span>Noise_Grain</span>
                    <span className="text-white">
                      {Math.round(noiseOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.01"
                    value={noiseOpacity}
                    onChange={(e) =>
                      setNoiseOpacity(parseFloat(e.target.value))
                    }
                    className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview & Typography (Typography moved below) */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-[#050505] rounded-sm overflow-hidden aspect-square md:aspect-video flex items-center justify-center shadow-2xl group">
              <canvas
                ref={canvasRef}
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />

              <div className="absolute bottom-8 right-8 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <button
                  onClick={() => {
                    setBlobs([]);
                    setTopText('VOID');
                    setBottomText('');
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all"
                >
                  <ArrowsClockwiseIcon weight="bold" /> Flush Buffer
                </button>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
              <InfoIcon size={32} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500 max-w-4xl">
                Synthesis engine utilizes a unified Canvas rendering protocol to
                ensure perfect parity between live calibration and
                high-resolution export sequences.
              </p>
            </div>

            {/* Typography Section (Full Width below preview) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Text 1 Config */}
              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                  <TextAaIcon weight="fill" />
                  Text_Layer_01
                </h3>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="block font-mono text-[10px] uppercase text-gray-500">
                      Source_Message
                    </label>
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-4 font-black uppercase tracking-widest text-sm focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                        <span>Scale</span>
                        <span className="text-white">{topFontSize}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="0.5"
                        value={topFontSize}
                        onChange={(e) =>
                          setTopFontSize(parseFloat(e.target.value))
                        }
                        className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                        <span>Color</span>
                        <span className="text-white uppercase text-[8px]">
                          {topFontColor}
                        </span>
                      </div>
                      <input
                        type="color"
                        value={topFontColor}
                        onChange={(e) => setTopFontColor(e.target.value)}
                        className="w-full h-1 cursor-pointer bg-transparent border-none appearance-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                      <span>Weight</span>
                      <span className="text-white">{topFontWeight}</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="900"
                      step="100"
                      value={topFontWeight}
                      onChange={(e) =>
                        setTopFontWeight(parseInt(e.target.value))
                      }
                      className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-8 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase text-gray-600">
                      <ArrowsOutCardinalIcon size={12} />
                      <span>Position_Matrix</span>
                      <span className="ml-auto text-white">
                        {topX} : {topY}
                      </span>
                    </div>
                    <div className="space-y-8">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={topX}
                        onChange={(e) => setTopX(parseInt(e.target.value))}
                        className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={topY}
                        onChange={(e) => setTopY(parseInt(e.target.value))}
                        className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Text 2 Config */}
              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                  <TextAaIcon weight="fill" />
                  Text_Layer_02
                </h3>

                <div className="space-y-10">
                  <div className="space-y-4">
                    <label className="block font-mono text-[10px] uppercase text-gray-500">
                      Source_Message
                    </label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 p-4 font-black uppercase tracking-widest text-sm focus:border-emerald-500/50 outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                        <span>Scale</span>
                        <span className="text-white">{bottomFontSize}</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="25"
                        step="0.5"
                        value={bottomFontSize}
                        onChange={(e) =>
                          setBottomFontSize(parseFloat(e.target.value))
                        }
                        className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                        <span>Color</span>
                        <span className="text-white uppercase text-[8px]">
                          {bottomFontColor}
                        </span>
                      </div>
                      <input
                        type="color"
                        value={bottomFontColor}
                        onChange={(e) => setBottomFontColor(e.target.value)}
                        className="w-full h-1 cursor-pointer bg-transparent border-none appearance-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between font-mono text-[9px] uppercase text-gray-600">
                      <span>Weight</span>
                      <span className="text-white">{bottomFontWeight}</span>
                    </div>
                    <input
                      type="range"
                      min="400"
                      max="900"
                      step="100"
                      value={bottomFontWeight}
                      onChange={(e) =>
                        setBottomFontWeight(parseInt(e.target.value))
                      }
                      className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="space-y-8 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-2 font-mono text-[9px] uppercase text-gray-600">
                      <ArrowsOutCardinalIcon size={12} />
                      <span>Position_Matrix</span>
                      <span className="ml-auto text-white">
                        {bottomX} : {bottomY}
                      </span>
                    </div>
                    <div className="space-y-8">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bottomX}
                        onChange={(e) => setBottomX(parseInt(e.target.value))}
                        className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={bottomY}
                        onChange={(e) => setBottomY(parseInt(e.target.value))}
                        className="w-full accent-white h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Visual_Loom_v0.6.5</span>
          <span className="text-gray-800">FIELD_STATUS // TYPOGRAPHY_SYNC</span>
        </footer>
      </div>
    </div>
  );
};

export default BlendLabPage;
