import React, {useState, useRef, useEffect, useCallback} from 'react';
import {Link} from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ImageIcon,
  CopySimpleIcon,
  SelectionIcon,
  PaletteIcon,
  GearIcon,
} from '@phosphor-icons/react';
import {getPalette} from 'color-thief-react';
import {motion, AnimatePresence} from 'framer-motion';
import {canvasRGBA} from 'stackblur-canvas';
import {useToast} from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import GenerativeArt from '../../components/GenerativeArt';

function Palette({image}) {
  const [palette, setPalette] = useState(null);
  const [loading, setLoading] = useState(true);
  const {addToast} = useToast();

  useEffect(() => {
    if (!image) {
      setPalette(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getPalette(image, 5, 'hex', {quality: 10})
      .then((data) => {
        setPalette(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        addToast({title: 'Extraction Error', message: 'Failed to map color sequence.', type: 'error'});
      });
  }, [image, addToast]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({title: 'Copied', message: `${text} stored in clipboard.`, duration: 2000});
    });
  };

  if (loading) return (
    <div
      className="flex items-center gap-3 font-mono text-[10px] text-gray-600 uppercase tracking-widest animate-pulse">
      <span className="h-1 w-8 bg-gray-800"/> Mapping_Aesthetic_Matrix...
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {palette && palette.map((color, index) => (
        <motion.div
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{delay: index * 0.1}}
          key={index}
          className="group relative flex flex-col items-center justify-center h-24 rounded-sm cursor-pointer transition-all border border-white/5"
          style={{backgroundColor: color}}
          onClick={() => copyToClipboard(color)}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"/>
          <span
            className="relative z-10 font-mono text-xs font-black uppercase tracking-widest text-white mix-blend-difference opacity-0 group-hover:opacity-100 transition-opacity">
              {color}
            </span>
        </motion.div>
      ))}
    </div>
  );
}

function ImageToolkitPage() {
  const appName = 'Image Toolkit';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Tools for image manipulation, color extraction, and creative filtering.',
    keywords: ['Fezcodex', 'image toolkit', 'image editor', 'color palette', 'monochrome'],
  });

  const {addToast} = useToast();
  const [image, setImage] = useState(null);
  const [activeEffect, setActiveEffect] = useState(null);
  const [blurAmount, setBlurAmount] = useState(0);
  const [asciiArtOutput, setAsciiArtOutput] = useState('');
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
      setActiveEffect(null);
    };
    if (file) reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `fezcodex-mod-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const toGrayscale = useCallback((imageData) => {
    const data = new Uint8ClampedArray(imageData.data);
    for (let i = 0; i < data.length; i += 4) {
      const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i] = data[i + 1] = data[i + 2] = avg;
    }
    return data;
  }, []);

  const sobel = useCallback((imageData) => {
    const width = imageData.width;
    const height = imageData.height;
    const grayscaleData = toGrayscale(imageData);
    const sobelData = new Uint8ClampedArray(grayscaleData.length);
    const sobelOperatorX = [[-1, 0, 1], [-2, 0, 2], [-1, 0, 1]];
    const sobelOperatorY = [[-1, -2, -1], [0, 0, 0], [1, 2, 1]];

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        let pixelX = 0, pixelY = 0;
        for (let j = -1; j <= 1; j++) {
          for (let i = -1; i <= 1; i++) {
            const pixel = grayscaleData[((y + j) * width + (x + i)) * 4];
            pixelX += pixel * sobelOperatorX[j + 1][i + 1];
            pixelY += pixel * sobelOperatorY[j + 1][i + 1];
          }
        }
        const magnitude = Math.sqrt(pixelX * pixelX + pixelY * pixelY);
        const index = (y * width + x) * 4;
        sobelData[index] = sobelData[index + 1] = sobelData[index + 2] = magnitude;
        sobelData[index + 3] = 255;
      }
    }
    return new ImageData(sobelData, width, height);
  }, [toGrayscale]);

  const combine = useCallback((quantized, edges) => {
    const qData = quantized.data;
    const eData = edges.data;
    const fData = new Uint8ClampedArray(qData.length);
    for (let i = 0; i < qData.length; i += 4) {
      if (eData[i] > 128) fData[i] = fData[i + 1] = fData[i + 2] = 0;
      else {
        fData[i] = qData[i];
        fData[i + 1] = qData[i + 1];
        fData[i + 2] = qData[i + 2];
      }
      fData[i + 3] = 255;
    }
    return new ImageData(fData, quantized.width, quantized.height);
  }, []);

  const bayerDither = useCallback((imageData) => {
    const pixels = new Uint8ClampedArray(imageData.data);
    const {width, height} = imageData;
    const bayerMatrix = [[1, 9, 3, 11], [13, 5, 15, 7], [4, 12, 2, 10], [16, 8, 14, 6]];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        const gray = pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
        const threshold = bayerMatrix[y % 4][x % 4] * 16;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray < threshold ? 0 : 255;
      }
    }
    return new ImageData(pixels, width, height);
  }, []);

  const quantizeColors = useCallback((imageData, levels) => {
    const data = new Uint8ClampedArray(imageData.data);
    const factor = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(Math.round(data[i] / factor) * factor);
      data[i + 1] = Math.round(Math.round(data[i + 1] / factor) * factor);
      data[i + 2] = Math.round(Math.round(data[i + 2] / factor) * factor);
    }
    return new ImageData(data, imageData.width, imageData.height);
  }, []);

  const halftone = useCallback((imageData, gridSize) => {
    const {width, height} = imageData;
    const grayscaleData = toGrayscale(imageData);
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = 'black';
    for (let y = 0; y < height; y += gridSize) {
      for (let x = 0; x < width; x += gridSize) {
        let total = 0, count = 0;
        for (let j = 0; j < gridSize; j++) {
          for (let i = 0; i < gridSize; i++) {
            if (x + i < width && y + j < height) {
              total += grayscaleData[((y + j) * width + (x + i)) * 4];
              count++;
            }
          }
        }
        const radius = (gridSize / 2) * (1 - (total / count) / 255);
        ctx.beginPath();
        ctx.arc(x + gridSize / 2, y + gridSize / 2, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    return ctx.getImageData(0, 0, width, height);
  }, [toGrayscale]);

  const posterize = useCallback((imageData, levels) => {
    const data = new Uint8ClampedArray(imageData.data);
    const step = 255 / (levels - 1);
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.round(Math.round(data[i] / step) * step);
      data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
      data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
    }
    return new ImageData(data, imageData.width, imageData.height);
  }, []);

  const asciiArt = useCallback((imageData, charRamp) => {
    const data = toGrayscale(imageData);
    const {width, height} = imageData;
    let ascii = '';
    for (let y = 0; y < height; y += 8) {
      for (let x = 0; x < width; x += 4) {
        ascii += charRamp[Math.floor((data[(y * width + x) * 4] / 255) * (charRamp.length - 1))];
      }
      ascii += '\n';
    }
    return ascii;
  }, [toGrayscale]);

  useEffect(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      // Always draw the original image first
      ctx.filter = 'none';
      ctx.drawImage(img, 0, 0);

      if (activeEffect === 'monochrome') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = avg; // red
          data[i + 1] = avg; // green
          data[i + 2] = avg; // blue
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'blur') {
        canvasRGBA(canvas, 0, 0, canvas.width, canvas.height, blurAmount);
      } else if (activeEffect === 'dithering') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const ditheredImageData = bayerDither(imageData);
        ctx.putImageData(ditheredImageData, 0, 0);
      } else if (activeEffect === 'celShading') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const quantizedData = quantizeColors(imageData, 4);
        const edges = sobel(imageData);
        const finalData = combine(quantizedData, edges);
        ctx.putImageData(finalData, 0, 0);
      } else if (activeEffect === 'halftone') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const halftoneData = halftone(imageData, 10);
        ctx.putImageData(halftoneData, 0, 0);
      } else if (activeEffect === 'solarization') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const threshold = 128;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (r < threshold) data[i] = 255 - r;
          if (g < threshold) data[i + 1] = 255 - g;
          if (b < threshold) data[i + 2] = 255 - b;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'posterization') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const posterizedData = posterize(imageData, 4); // 4 levels per channel
        ctx.putImageData(posterizedData, 0, 0);
      } else if (activeEffect === 'sepia') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
          data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
          data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'pixelization') {
        const pixelSize = 10;
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let y = 0; y < canvas.height; y += pixelSize) {
          for (let x = 0; x < canvas.width; x += pixelSize) {
            const i = (y * canvas.width + x) * 4;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            ctx.fillRect(x, y, pixelSize, pixelSize);
          }
        }
      } else if (activeEffect === 'duotone') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        const darkColor = {r: 0, g: 0, b: 100};
        const lightColor = {r: 255, g: 255, b: 155};
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          const t = avg / 255;
          data[i] = darkColor.r + (lightColor.r - darkColor.r) * t;
          data[i + 1] = darkColor.g + (lightColor.g - darkColor.g) * t;
          data[i + 2] = darkColor.b + (lightColor.b - darkColor.b) * t;
        }
        ctx.putImageData(imageData, 0, 0);
      } else if (activeEffect === 'asciiArt') {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const ascii = asciiArt(imageData, '@%#*+=-:. ');
        setAsciiArtOutput(ascii);
      }
    };
  }, [
    image,
    activeEffect,
    blurAmount,
    asciiArt,
    bayerDither,
    combine,
    halftone,
    posterize,
    quantizeColors,
    sobel,
    toGrayscale
  ]);

  const filterButtons = [
    {id: 'palette', label: 'Extract Palette', icon: PaletteIcon},
    {id: 'monochrome', label: 'Monochrome', icon: SelectionIcon},
    {id: 'blur', label: 'Temporal Blur', icon: GearIcon},
    {id: 'dithering', label: 'Bayer Dither', icon: GearIcon},
    {id: 'celShading', label: 'Cel Shading', icon: GearIcon},
    {id: 'halftone', label: 'Halftone', icon: GearIcon},
    {id: 'solarization', label: 'Solarize', icon: GearIcon},
    {id: 'posterization', label: 'Posterize', icon: GearIcon},
    {id: 'sepia', label: 'Vintage Sepia', icon: GearIcon},
    {id: 'pixelization', label: 'Pixelize', icon: GearIcon},
    {id: 'duotone', label: 'Duotone Map', icon: GearIcon},
    {id: 'asciiArt', label: 'ASCII Map', icon: GearIcon},
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-20">
          <Link to="/apps"
                className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
            <ArrowLeftIcon weight="bold"/>
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mt-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none uppercase">
                {appName}
              </h1>
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed">
                Tools for image manipulation, color extraction, and creative filtering.
              </p>
            </div>

            <div className="flex flex-col gap-4 items-end">
              <label htmlFor="image-upload"
                     className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm cursor-pointer">
                <ImageIcon weight="bold" size={20}/>
                <span>Select Source</span>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden"/>
              </label>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
              <h3
                className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
                <SelectionIcon weight="fill"/>
                Effects
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {filterButtons.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      if (!image) return addToast({title: 'Info', message: 'Select an image first.'});
                      setActiveEffect(f.id);
                      if (f.id === 'blur') setBlurAmount(10);
                    }}
                    className={`
                           flex items-center justify-between px-4 py-3 border transition-all duration-200 text-[10px] font-mono uppercase tracking-widest
                           ${activeEffect === f.id
                      ? 'bg-emerald-500 text-black border-emerald-400'
                      : 'bg-transparent border-white/5 text-gray-500 hover:border-emerald-500/50 hover:text-white'
                    }
                        `}
                  >
                    <div className="flex items-center gap-3">
                      <f.icon size={16} weight={activeEffect === f.id ? "fill" : "bold"} />
                      <span>{f.label}</span>
                    </div>
                    {activeEffect === f.id && <motion.span layoutId="active-tick">●</motion.span>}
                  </button>
                ))}
              </div>
            </div>

            {activeEffect === 'blur' && (
              <div
                className="bg-white/5 border border-white/10 p-8 rounded-sm animate-in fade-in slide-in-from-top-4 duration-500">
                <h3
                  className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6">Blur Strength</h3>
                <input
                  type="range" min="0" max="50" value={blurAmount}
                  onChange={(e) => setBlurAmount(e.target.value)}
                  className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                />
                <div className="mt-4 flex justify-between font-mono text-[9px] text-gray-600">
                  <span>MIN</span>
                  <span className="text-emerald-500 font-black">{blurAmount}PX</span>
                  <span>MAX</span>
                </div>
              </div>
            )}
          </div>

          {/* Preview Column */}
          <div className="lg:col-span-8 space-y-12">
            <div
              className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group">
              <div className="absolute inset-0 opacity-5 pointer-events-none">
                <GenerativeArt seed={appName + (activeEffect || '')} className="w-full h-full"/>
              </div>
              <div
                className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500"/>

              <div className="relative z-10 flex flex-col gap-12">
                {image ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                            <span
                              className="font-mono text-[9px] text-gray-600 uppercase tracking-widest flex items-center gap-2">
                               <span className="h-px w-4 bg-gray-800"/> Original Image
                            </span>
                      <div className="border border-white/5 rounded-sm overflow-hidden bg-black">
                        <img src={image} alt="Original" className="w-full h-auto opacity-80"/>
                      </div>
                    </div>
                    {activeEffect && activeEffect !== 'palette' && (
                      <div className="space-y-4">
                               <span
                                 className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest flex items-center gap-2 font-black">
                                  <span className="h-px w-4 bg-emerald-500/20"/> Modified Image :: {activeEffect}
                               </span>
                        <div
                          className="border border-emerald-500/20 rounded-sm overflow-hidden bg-black shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                          <canvas ref={canvasRef} className="w-full h-auto"/>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="h-96 border border-white/10 border-dashed rounded-sm flex items-center justify-center text-center">
                    <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-600">
                      Waiting for image...
                    </p>
                  </div>
                )}

                <AnimatePresence>
                  {activeEffect === 'palette' && image && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="pt-8 border-t border-white/10">
                      <h3
                        className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-8">Color Palette</h3>
                      <Palette image={image}/>
                    </motion.div>
                  )}

                  {activeEffect === 'asciiArt' && asciiArtOutput && (
                    <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="pt-8 border-t border-white/10">
                      <div className="flex justify-between items-center mb-6">
                        <h3
                          className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest">ASCII Art</h3>
                        <button onClick={() => {
                          if (asciiArtOutput) {
                            navigator.clipboard.writeText(asciiArtOutput).then(
                              () => addToast({title: 'Success', message: 'ASCII data copied!'}),
                              () => addToast({title: 'Error', message: 'Failed to copy ASCII data!', type: 'error'})
                            );
                          }
                        }} className="text-emerald-500 hover:text-white transition-colors">
                          <CopySimpleIcon size={20}/>
                        </button>
                      </div>
                      <pre
                        className="text-[8px] md:text-[10px] text-emerald-400 font-mono bg-black/60 p-8 rounded-sm overflow-x-auto whitespace-pre leading-[0.8]">
                              {asciiArtOutput}
                           </pre>
                    </motion.div>
                  )}
                </AnimatePresence>

                {activeEffect && activeEffect !== 'palette' && activeEffect !== 'asciiArt' && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                    >
                      <DownloadSimpleIcon weight="bold" size={18}/>
                      <span>Download Image</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ImageToolkitPage;