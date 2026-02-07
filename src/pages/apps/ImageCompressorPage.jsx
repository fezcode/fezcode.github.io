import React, { useState, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ArrowsInLineHorizontalIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
  ImageIcon,
  GearIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const ImageCompressorPage = () => {
  const { addToast } = useToast();
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState(0.7);
  const canvasRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target.result);
      setCompressedImage(null);
      setCompressedSize(0);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = useCallback(() => {
    if (!originalImage) {
      addToast({ title: 'Info', message: 'Insert source first.' });
      return;
    }
    const img = new Image();
    img.src = originalImage;
    img.onload = () => {
      try {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        setCompressedImage(compressedDataUrl);
        const base64Length =
          compressedDataUrl.length - 'data:image/jpeg;base64,'.length;
        setCompressedSize(base64Length * 0.75);
        addToast({ title: 'Success', message: 'Array compressed.' });
      } catch (error) {
        addToast({
          title: 'Error',
          message: 'Compression failed.',
          type: 'error',
        });
      }
    };
  }, [originalImage, quality, addToast]);

  const handleDownload = () => {
    if (compressedImage) {
      const link = document.createElement('a');
      link.download = `fezcodex-compressed-${Date.now()}.jpg`;
      link.href = compressedImage;
      link.click();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 pb-32 relative font-sans">
      <Seo
        title="Image Compressor | Fezcodex"
        description="Compress images to reduce file size while maintaining quality."
        keywords={[
          'Fezcodex',
          'image compressor',
          'compress image',
          'optimize image',
        ]}
      />
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Hero Section */}
      <div className="relative h-[40vh] w-full overflow-hidden border-b border-white/10">
        <GenerativeArt
          seed="Compression Protocol"
          className="w-full h-full opacity-40 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent" />

        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-12">
          <div className="mb-6 flex items-center gap-4">
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-1.5 text-xs font-mono font-bold uppercase tracking-widest text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black"
            >
              <ArrowLeftIcon weight="bold" />
              <span>Back to Apps</span>
            </Link>
            <span className="font-mono text-[10px] text-emerald-500 uppercase tracking-widest border border-emerald-500/20 px-2 py-1.5 rounded-full bg-emerald-500/5 backdrop-blur-sm flex items-center gap-2">
              <ArrowsInLineHorizontalIcon size={14} /> BIT_DENSITY_PROTOCOL
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Image Compressor"
                slug="imc"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Bit density protocol. Optimize and compress digital media to
                minimize data footprint.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-12 lg:grid lg:grid-cols-12 lg:gap-24">
        {/* Controls Column */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-white/5 border border-white/10 p-8 rounded-sm">
            <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-8 flex items-center gap-2">
              <UploadSimpleIcon weight="fill" />
              Source_Input
            </h3>

            <label
              htmlFor="image-upload"
              className="group relative inline-flex items-center gap-3 w-full px-6 py-4 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-xs font-black rounded-sm cursor-pointer justify-center"
            >
              <ImageIcon weight="bold" size={18} />
              <span>Select_Source</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {originalImage && (
              <div className="mt-12 animate-in fade-in slide-in-from-top-4 duration-500">
                <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <GearIcon weight="fill" />
                  Parameters
                </h3>{' '}
                <div className="space-y-8">
                  <div>
                    <label className="flex justify-between font-mono text-[10px] uppercase tracking-widest text-gray-400 mb-4">
                      <span>Quality_Magnitude</span>
                      <span className="text-emerald-500 font-black">
                        {Math.round(quality * 100)}%
                      </span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={quality}
                      onChange={(e) => setQuality(parseFloat(e.target.value))}
                      className="w-full accent-emerald-500 h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={compressImage}
                    className="w-full py-4 border-2 border-emerald-500/50 text-emerald-400 font-black uppercase tracking-[0.3em] hover:bg-emerald-500 hover:text-black transition-all text-xs"
                  >
                    Execute_Optimization
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border border-white/5 bg-black/40 font-mono text-[10px] uppercase tracking-widest text-gray-500 leading-relaxed">
            <p className="text-emerald-500 font-bold mb-2">PRIVACY_NOTICE:</p>
            <p>
              All processing occurs within the local environment. No data
              transmissions detected.
            </p>
          </div>
        </div>

        {/* Output Column */}
        <div className="lg:col-span-8 space-y-12">
          <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group min-h-[400px] flex flex-col">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <GenerativeArt seed="Output Result" className="w-full h-full" />
            </div>
            <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

            {!originalImage ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center opacity-40">
                <ImageIcon size={64} weight="thin" className="mb-6" />
                <p className="font-mono text-xs uppercase tracking-[0.3em]">
                  Waiting_For_Source_Data
                </p>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col gap-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <span className="font-mono text-[9px] text-gray-600 uppercase tracking-widest">
                        Original_Array
                      </span>
                      <span className="font-mono text-xs text-white">
                        {formatBytes(originalSize)}
                      </span>
                    </div>
                    <div className="border border-white/5 bg-black p-2 rounded-sm">
                      <img
                        src={originalImage}
                        alt="Original"
                        className="w-full h-auto opacity-80"
                      />
                    </div>
                  </div>

                  {compressedImage && (
                    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-500">
                      <div className="flex justify-between items-baseline">
                        <span className="font-mono text-[9px] text-emerald-500 uppercase tracking-widest font-black">
                          Optimized_Array
                        </span>
                        <span className="font-mono text-xs text-emerald-400">
                          {formatBytes(compressedSize)}
                        </span>
                      </div>
                      <div className="border border-emerald-500/20 bg-black p-2 rounded-sm shadow-[0_0_40px_rgba(16,185,129,0.05)]">
                        <img
                          src={compressedImage}
                          alt="Compressed"
                          className="w-full h-auto"
                        />
                      </div>
                      <div className="pt-2 flex justify-between font-mono text-[10px] uppercase">
                        <span className="text-gray-600">Savings:</span>
                        <span className="text-emerald-500 font-black">
                          {Math.round(
                            (1 - compressedSize / originalSize) * 100,
                          )}
                          % Reduction
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {compressedImage && (
                  <div className="flex justify-end pt-8 border-t border-white/5">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.3em] hover:bg-emerald-400 transition-all text-xs"
                    >
                      <DownloadSimpleIcon weight="bold" size={18} />
                      <span>Commit_To_Storage</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden processing element */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ImageCompressorPage;
