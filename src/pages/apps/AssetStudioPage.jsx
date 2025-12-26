import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ImageIcon,
  ArrowsClockwiseIcon,
  MonitorIcon,
  GlobeIcon,
  SelectionIcon,
  InfoIcon,
  ArrowsOutIcon, MagnifyingGlassPlusIcon
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import CustomSlider from '../../components/CustomSlider';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const AssetStudioPage = () => {
  const appName = 'Asset Studio';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Convert images into optimized website assets with custom resizing and scaling options.',
    keywords: ['Fezcodex', 'image converter', 'webp', 'favicon generator', 'og image', 'image resizer', 'image scaler'],
  });

  const { addToast } = useToast();
  const [sourceImage, setSourceImage] = useState(null);
  const [fileName, setFileName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Resize & Scale State
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [scale, setScale] = useState(1);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name.split('.')[0]);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setCustomWidth(img.width);
        setCustomHeight(img.height);
        setSourceImage(event.target.result);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processAndDownload = async (type) => {
    if (!sourceImage) return;
    setIsProcessing(true);

    const img = new Image();
    img.src = sourceImage;
    await new Promise(resolve => img.onload = resolve);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width, height, extension, quality = 0.9;

    switch (type) {
      case 'webp':
        width = img.width;
        height = img.height;
        extension = 'webp';
        break;
      case 'favicon':
        width = 32;
        height = 32;
        extension = 'png';
        break;
      case 'og':
        width = 1200;
        height = 630;
        extension = 'png';
        break;
      case 'custom':
        width = customWidth;
        height = customHeight;
        extension = 'png';
        break;
      case 'scale':
        width = Math.round(img.width * scale);
        height = Math.round(img.height * scale);
        extension = 'png';
        break;
      default:
        return;
    }

    canvas.width = width;
    canvas.height = height;

    if (type === 'og') {
      const sourceAspect = img.width / img.height;
      const targetAspect = width / height;
      let sW, sH, sX, sY;
      if (sourceAspect > targetAspect) {
        sH = img.height;
        sW = img.height * targetAspect;
        sX = (img.width - sW) / 2;
        sY = 0;
      } else {
        sW = img.width;
        sH = img.width / targetAspect;
        sX = 0;
        sY = (img.height - sH) / 2;
      }
      ctx.drawImage(img, sX, sY, sW, sH, 0, 0, width, height);
    } else {
      ctx.drawImage(img, 0, 0, width, height);
    }

    const dataUrl = canvas.toDataURL(`image/${extension}`, quality);
    const link = document.createElement('a');
    link.download = `${fileName}-${type}.${extension}`;
    link.href = dataUrl;
    link.click();

    setTimeout(() => {
      setIsProcessing(false);
      addToast({ title: 'Synthesis Complete', message: `Target ${type} asset generated successfully.` });
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">

        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Asset Studio" slug="as" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Resize, crop, and convert your images for the web. Create favicons, social media previews, and optimized assets.
              </p>
            </div>

            <label className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm cursor-pointer shrink-0">
              <ImageIcon weight="bold" size={24} />
              <span>Select Image</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

          {/* Main Stage */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group flex items-center justify-center min-h-[600px]">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt seed={appName + (sourceImage ? 'active' : 'idle')} className="w-full h-full" />
              </div>

              {sourceImage ? (
                <div className="relative z-10 w-full flex flex-col items-center gap-8">
                  <span className="font-mono text-[10px] text-emerald-500 font-black uppercase tracking-[0.5em]">{'//'} IMAGE_LOADED</span>
                  <div className="max-w-full max-h-[600px] border border-white/10 p-2 bg-black/40 shadow-2xl overflow-hidden">
                    <img src={sourceImage} alt="Source" className="max-w-full max-h-[500px] object-contain opacity-80" />
                  </div>
                  <div className="flex gap-8 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    <span>{fileName}</span>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 text-center space-y-6">
                  <ImageIcon size={64} weight="thin" className="mx-auto text-gray-800" />
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-600">Please select an image to start...</p>
                </div>
              )}
            </div>

            {/* Custom Calibration Panel */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <ArrowsOutIcon weight="fill" />
                  Custom Resize
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Width (px)</label>
                    <input
                      type="number" value={customWidth} onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">Height (px)</label>
                    <input
                      type="number" value={customHeight} onChange={(e) => setCustomHeight(parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm text-white"
                    />
                  </div>
                </div>
                <AssetButton
                  label="Resize Image"
                  description="Download with custom dimensions"
                  onClick={() => processAndDownload('custom')}
                  disabled={!sourceImage || isProcessing}
                  icon={ArrowsClockwiseIcon}
                />
              </div>

              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-8">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <MagnifyingGlassPlusIcon weight="fill" />
                  Scale Percentage
                </h3>
                <div className="space-y-4">
                  <CustomSlider
                    label="Multiplier"
                    min={0.1}
                    max={4}
                    step={0.1}
                    value={scale}
                    onChange={setScale}
                  />
                </div>
                <AssetButton
                  label="Scale Image"
                  description="Scale up or down"
                  onClick={() => processAndDownload('scale')}
                  disabled={!sourceImage || isProcessing}
                  icon={ArrowsClockwiseIcon}
                />
              </div>
            </div>
          </div>

          {/* Presets Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <SelectionIcon weight="fill" />
                Quick Presets
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <AssetButton
                  label="WebP Format"
                  description="Optimized for web performance"
                  onClick={() => processAndDownload('webp')}
                  disabled={!sourceImage || isProcessing}
                  icon={ArrowsClockwiseIcon}
                />
                <AssetButton
                  label="Favicon"
                  description="Standard 32x32 icon"
                  onClick={() => processAndDownload('favicon')}
                  disabled={!sourceImage || isProcessing}
                  icon={GlobeIcon}
                />
                <AssetButton
                  label="Social Share Image"
                  description="1200x630 OG image"
                  onClick={() => processAndDownload('og')}
                  disabled={!sourceImage || isProcessing}
                  icon={MonitorIcon}
                />
              </div>

              {isProcessing && (
                <div className="py-6 border border-emerald-500/20 bg-emerald-500/5 rounded-sm flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="font-mono text-[10px] text-emerald-500 font-black uppercase tracking-widest">Processing Image</span>
                </div>
              )}
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <InfoIcon size={24} className="text-gray-700 shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Adjust the size or scale and select a preset to download your optimized image. All processing happens in your browser.
              </p>
            </div>

            {sourceImage && (
              <button
                onClick={() => { setSourceImage(null); setFileName(''); }}
                className="w-full py-4 border border-white/10 text-gray-600 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
              >
                Clear Image
              </button>
            )}
          </div>

        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Asset_Studio_v0.6.2</span>
          <span className="text-gray-800">ENGINE_STATUS // {sourceImage ? 'READY' : 'STANDBY'}</span>
        </footer>
      </div>
    </div>
  );
};

const AssetButton = ({ label, description, onClick, disabled, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      w-full flex flex-col gap-1 p-6 border text-left transition-all group
      ${disabled
        ? 'border-white/5 opacity-20 cursor-not-allowed'
        : 'border-white/10 bg-white/[0.01] hover:border-emerald-500/50 hover:bg-emerald-500/[0.02]'
      }
    `}
  >
    <div className="flex justify-between items-center">
      <span className={`text-xs uppercase tracking-widest font-black ${!disabled && 'group-hover:text-emerald-500'}`}>{label}</span>
      <Icon size={18} weight={disabled ? "regular" : "bold"} className={!disabled ? "group-hover:text-emerald-500" : ""} />
    </div>
    <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">{description}</span>
  </button>
);

export default AssetStudioPage;
