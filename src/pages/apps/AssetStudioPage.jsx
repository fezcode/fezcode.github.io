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
  ArrowsOutIcon,
  MagnifyingGlassPlusIcon,
  StackIcon,
  TrashIcon,
  DownloadSimpleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import GenerativeArt from '../../components/GenerativeArt';
import CustomSlider from '../../components/CustomSlider';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const AssetStudioPage = () => {
  const appName = 'Asset Studio';

  const { addToast } = useToast();
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [targetFormat, setTargetFormat] = useState('webp');

  // Resize & Scale State
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [scale, setScale] = useState(1);

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImages((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substr(2, 9),
              src: event.target.result,
              name: file.name.split('.')[0],
              originalWidth: img.width,
              originalHeight: img.height,
            },
          ]);
          if (images.length === 0) {
            setCustomWidth(img.width);
            setCustomHeight(img.height);
          }
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    if (currentIndex >= images.length - 1 && currentIndex > 0) {
      setCurrentIndex(images.length - 2);
    }
  };

  const processImage = async (imgObj, type) => {
    const img = new Image();
    img.src = imgObj.src;
    await new Promise((resolve) => (img.onload = resolve));

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    let width,
      height,
      extension = targetFormat,
      quality = 0.9;

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
        break;
      case 'scale':
        width = Math.round(img.width * scale);
        height = Math.round(img.height * scale);
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
    link.download = `${imgObj.name}-${type}.${extension}`;
    link.href = dataUrl;
    link.click();
  };

  const handleProcess = async (type, bulk = false) => {
    if (images.length === 0) return;
    setIsProcessing(true);

    if (bulk) {
      for (const imgObj of images) {
        await processImage(imgObj, type);
        // Small delay to prevent browser issues with many downloads
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
      addToast({
        title: 'Bulk Processing Complete',
        message: `${images.length} assets generated successfully.`,
      });
    } else {
      await processImage(images[currentIndex], type);
      addToast({
        title: 'Synthesis Complete',
        message: `Target ${type} asset generated successfully.`,
      });
    }

    setIsProcessing(false);
  };

  const currentImage = images[currentIndex];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title={`${appName} | Fezcodex`}
        description="Convert images into optimized website assets with custom resizing and scaling options. Bulk processing supported."
        keywords={[
          'Fezcodex',
          'image converter',
          'webp',
          'favicon generator',
          'og image',
          'image resizer',
          'image scaler',
          'bulk image processing',
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
              <BreadcrumbTitle
                title="Asset Studio"
                slug="as"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Resize, crop, and convert your images for the web. Supports
                single and bulk processing for favicons, OG images, and more.
              </p>
            </div>

            <label className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm cursor-pointer shrink-0">
              <ImageIcon weight="bold" size={24} />
              <span>Select Images</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Stage */}
          <div className="lg:col-span-8 space-y-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-8 md:p-12 rounded-sm overflow-hidden group flex flex-col items-center justify-center min-h-[600px]">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + (images.length > 0 ? 'active' : 'idle')}
                  className="w-full h-full"
                />
              </div>

              {images.length > 0 ? (
                <div className="relative z-10 w-full flex flex-col items-center gap-8">
                  <span className="font-mono text-[10px] text-emerald-500 font-black uppercase tracking-[0.5em]">
                    {'//'}{' '}
                    {images.length > 1 ? 'COLLECTION_ACTIVE' : 'IMAGE_LOADED'}
                  </span>
                  <div className="max-w-full max-h-[600px] border border-white/10 p-2 bg-black/40 shadow-2xl overflow-hidden relative group/preview">
                    <img
                      src={currentImage.src}
                      alt="Source"
                      className="max-w-full max-h-[500px] object-contain opacity-80"
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                      <button
                        onClick={() => removeImage(currentImage.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 transition-all rounded-sm"
                      >
                        <TrashIcon weight="bold" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-2 font-mono text-[10px] text-gray-500 uppercase tracking-widest text-center">
                    <span className="text-white">{currentImage.name}</span>
                    <span>
                      {currentImage.originalWidth}x{currentImage.originalHeight}{' '}
                      PX
                    </span>
                  </div>

                  {images.length > 1 && (
                    <div className="flex flex-wrap justify-center gap-4 mt-8 max-w-xl">
                      {images.map((img, idx) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentIndex(idx)}
                          className={`w-12 h-12 border transition-all overflow-hidden p-0.5 ${
                            idx === currentIndex
                              ? 'border-emerald-500 scale-110'
                              : 'border-white/10 opacity-40 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={img.src}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative z-10 text-center space-y-6">
                  <ImageIcon
                    size={64}
                    weight="thin"
                    className="mx-auto text-gray-800"
                  />
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-gray-600">
                    Please select one or more images to start...
                  </p>
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
                    <label className="text-[9px] font-mono text-gray-600 uppercase">
                      Width (px)
                    </label>
                    <input
                      type="number"
                      value={customWidth}
                      onChange={(e) => setCustomWidth(parseInt(e.target.value))}
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono text-gray-600 uppercase">
                      Height (px)
                    </label>
                    <input
                      type="number"
                      value={customHeight}
                      onChange={(e) =>
                        setCustomHeight(parseInt(e.target.value))
                      }
                      className="w-full bg-black/40 border border-white/10 rounded-sm p-3 font-mono text-sm text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <AssetButton
                    label="Current"
                    onClick={() => handleProcess('custom', false)}
                    disabled={images.length === 0 || isProcessing}
                    icon={DownloadSimpleIcon}
                  />
                  <AssetButton
                    label="Bulk Resize"
                    onClick={() => handleProcess('custom', true)}
                    disabled={images.length < 2 || isProcessing}
                    icon={StackIcon}
                    variant="emerald"
                  />
                </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <AssetButton
                    label="Current"
                    onClick={() => handleProcess('scale', false)}
                    disabled={images.length === 0 || isProcessing}
                    icon={DownloadSimpleIcon}
                  />
                  <AssetButton
                    label="Bulk Scale"
                    onClick={() => handleProcess('scale', true)}
                    disabled={images.length < 2 || isProcessing}
                    icon={StackIcon}
                    variant="emerald"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Presets Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <div className="space-y-4">
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                  <SelectionIcon weight="fill" />
                  Target Format
                </h3>
                <div className="flex gap-2 p-1 bg-black/40 border border-white/10 rounded-sm">
                  {['webp', 'png'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setTargetFormat(f)}
                      className={`flex-1 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
                        targetFormat === f
                          ? 'bg-emerald-500 text-black font-black'
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <SelectionIcon weight="fill" />
                Quick Presets
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <BulkProcessControl
                  label="Original Size"
                  type="webp"
                  onProcess={handleProcess}
                  disabled={images.length === 0 || isProcessing}
                  showBulk={images.length > 1}
                  icon={ArrowsClockwiseIcon}
                />
                <BulkProcessControl
                  label="Favicon (32x32)"
                  type="favicon"
                  onProcess={handleProcess}
                  disabled={images.length === 0 || isProcessing}
                  showBulk={images.length > 1}
                  icon={GlobeIcon}
                />
                <BulkProcessControl
                  label="Social (1200x630)"
                  type="og"
                  onProcess={handleProcess}
                  disabled={images.length === 0 || isProcessing}
                  showBulk={images.length > 1}
                  icon={MonitorIcon}
                />
              </div>

              {isProcessing && (
                <div className="py-6 border border-emerald-500/20 bg-emerald-500/5 rounded-sm flex items-center justify-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                  <span className="font-mono text-[10px] text-emerald-500 font-black uppercase tracking-widest">
                    Processing Assets
                  </span>
                </div>
              )}
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <InfoIcon size={24} className="text-gray-700 shrink-0" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                You can upload multiple images. Select a transformation and use
                the "Bulk" option to process all images at once. All processing
                is local to your browser.
              </p>
            </div>

            {images.length > 0 && (
              <button
                onClick={() => {
                  setImages([]);
                  setCurrentIndex(0);
                }}
                className="w-full py-4 border border-white/10 text-gray-600 hover:text-white transition-all font-mono text-[10px] uppercase tracking-widest"
              >
                Clear Collection ({images.length})
              </button>
            )}
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Asset_Studio_v0.7.0</span>
          <span className="text-gray-800">
            ENGINE_STATUS // {images.length > 0 ? 'READY' : 'STANDBY'}
          </span>
        </footer>
      </div>
    </div>
  );
};

const BulkProcessControl = ({
  label,
  type,
  onProcess,
  disabled,
  showBulk,
  icon,
}) => (
  <div className="space-y-2">
    <div className="flex gap-2">
      <AssetButton
        label={label}
        onClick={() => onProcess(type, false)}
        disabled={disabled}
        icon={icon}
        className="flex-1"
      />
      {showBulk && (
        <button
          onClick={() => onProcess(type, true)}
          disabled={disabled}
          title={`Bulk Process ${label}`}
          className="px-4 border border-white/10 bg-white/[0.01] hover:border-emerald-500/50 hover:bg-emerald-500/[0.05] text-emerald-500 transition-all flex items-center justify-center"
        >
          <StackIcon size={20} weight="bold" />
        </button>
      )}
    </div>
  </div>
);

const AssetButton = ({
  label,
  description,
  onClick,
  disabled,
  icon: Icon,
  variant = 'default',
  className = '',
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex flex-col gap-1 p-6 border text-left transition-all group
      ${
        disabled
          ? 'border-white/5 opacity-20 cursor-not-allowed'
          : variant === 'emerald'
            ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500 hover:bg-emerald-500/10'
            : 'border-white/10 bg-white/[0.01] hover:border-emerald-500/50 hover:bg-emerald-500/[0.02]'
      }
      ${className}
    `}
  >
    <div className="flex justify-between items-center w-full gap-4">
      <span
        className={`text-[10px] uppercase tracking-widest font-black ${!disabled && (variant === 'emerald' ? 'text-emerald-500' : 'group-hover:text-emerald-500')}`}
      >
        {label}
      </span>
      {Icon && (
        <Icon
          size={16}
          weight={disabled ? 'regular' : 'bold'}
          className={
            !disabled
              ? variant === 'emerald'
                ? 'text-emerald-500'
                : 'group-hover:text-emerald-500'
              : ''
          }
        />
      )}
    </div>
    {description && (
      <span className="text-[9px] font-mono text-gray-600 uppercase tracking-widest">
        {description}
      </span>
    )}
  </button>
);

export default AssetStudioPage;
