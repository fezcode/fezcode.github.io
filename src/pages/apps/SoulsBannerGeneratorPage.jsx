import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ImageIcon,
  TextTIcon,
  PaletteIcon,
  SlidersHorizontalIcon,
} from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import CustomSlider from '../../components/CustomSlider';
import CustomToggle from '../../components/CustomToggle';
import CustomColorPicker from '../../components/CustomColorPicker';
import CustomDropdown from '../../components/CustomDropdown';

const PRESETS = {
  YOU_DIED: {
    text: 'YOU DIED',
    textColor: '#9d0a0a',
    glowColor: '#ff0000',
    fontSize: 120,
    fontFamily: 'Cinzel',
    fontWeight: 400,
    letterSpacing: 10,
    overlayOpacity: 0.5,
  },
  ENEMY_FELLED: {
    text: 'ENEMY FELLED',
    textColor: '#e8c227', // Gold-ish
    glowColor: '#ffea00',
    fontSize: 100,
    fontFamily: 'Cinzel',
    fontWeight: 700,
    letterSpacing: 5,
    overlayOpacity: 0.4,
  },
  BONFIRE_LIT: {
    text: 'BONFIRE LIT',
    textColor: '#ffb347',
    glowColor: '#ff8c00',
    fontSize: 100,
    fontFamily: 'Cinzel',
    fontWeight: 400,
    letterSpacing: 5,
    overlayOpacity: 0.4,
  },
  WASTED: {
    text: 'WASTED',
    textColor: '#9d0a0a', // GTA style red
    glowColor: '#000000',
    fontSize: 120,
    fontFamily: 'Pricedown', // Fallback to sans-serif if not available
    fontWeight: 900,
    letterSpacing: 2,
    overlayOpacity: 0.5,
  },
};

const FONT_OPTIONS = [
  { value: 'Cinzel', label: 'Cinzel (Souls)' },
  { value: 'Space Mono', label: 'Space Mono' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Arvo', label: 'Arvo' },
  { value: 'Syne', label: 'Syne' },
  { value: 'Outfit', label: 'Outfit' },
  { value: 'IBM Plex Mono', label: 'IBM Plex Mono' },
  { value: 'Instrument Serif', label: 'Instrument Serif' },
  { value: 'Instrument Sans', label: 'Instrument Sans' },
  { value: 'Nunito', label: 'Nunito' },
  { value: 'VT323', label: 'VT323 (Retro)' },
  { value: 'Brush Script MT', label: 'Brush Script' },
  { value: 'Courier New', label: 'Courier New' },
];

function SoulsBannerGeneratorPage() {
  const { addToast } = useToast();
  const [image, setImage] = useState(null);
  const canvasRef = useRef(null);

  // Configuration State
  const [text, setText] = useState(PRESETS.ENEMY_FELLED.text);
  const [fontSize, setFontSize] = useState(PRESETS.ENEMY_FELLED.fontSize);
  const [textColor, setTextColor] = useState(PRESETS.ENEMY_FELLED.textColor);
  const [glowColor, setGlowColor] = useState(PRESETS.ENEMY_FELLED.glowColor);
  const [overlayOpacity, setOverlayOpacity] = useState(
    PRESETS.ENEMY_FELLED.overlayOpacity,
  );
  const [letterSpacing, setLetterSpacing] = useState(
    PRESETS.ENEMY_FELLED.letterSpacing,
  );
  const [yOffset, setYOffset] = useState(50); // Percentage from top
  const [showOverlay, setShowOverlay] = useState(true);
  const [fontFamily, setFontFamily] = useState('Cinzel');
  const [fontWeight, setFontWeight] = useState(PRESETS.ENEMY_FELLED.fontWeight);

  useEffect(() => {
    // Load Cinzel font
    const link = document.createElement('link');
    link.href =
      'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target.result);
    };
    if (file) reader.readAsDataURL(file);
  };

  const drawCanvas = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = image;

    img.onload = () => {
      // Set canvas to image dimensions
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw Overlay Band
      if (showOverlay) {
        const bandHeight = fontSize * 2.5;
        const yPos = (canvas.height * yOffset) / 100;

        // Gradient for the band
        const gradient = ctx.createLinearGradient(
          0,
          yPos - bandHeight / 2,
          0,
          yPos + bandHeight / 2,
        );
        gradient.addColorStop(0, 'rgba(0,0,0,0)');
        gradient.addColorStop(0.2, `rgba(0,0,0,${overlayOpacity})`);
        gradient.addColorStop(0.8, `rgba(0,0,0,${overlayOpacity})`);
        gradient.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, yPos - bandHeight / 2, canvas.width, bandHeight);
      }

      // Draw Text
      ctx.save();
      ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const textX = canvas.width / 2;
      const textY = (canvas.height * yOffset) / 100;

      // Glow/Shadow
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 20;
      ctx.fillStyle = textColor;

      // Text drawing with spacing manually
      if (letterSpacing > 0) {
        const totalWidth =
          ctx.measureText(text).width + (text.length - 1) * letterSpacing;
        let currentX = textX - totalWidth / 2;

        for (let i = 0; i < text.length; i++) {
          const char = text[i];
          ctx.fillText(char, currentX, textY);
          currentX += ctx.measureText(char).width + letterSpacing;
        }
      } else {
        ctx.fillText(text, textX, textY);
      }

      ctx.restore();
    };
  }, [
    image,
    text,
    fontSize,
    textColor,
    glowColor,
    overlayOpacity,
    yOffset,
    showOverlay,
    letterSpacing,
    fontFamily,
    fontWeight,
  ]);

  useEffect(() => {
    drawCanvas();
    // Re-draw when font loads (a bit hacky but works for now)
    document.fonts.ready.then(drawCanvas);
  }, [drawCanvas]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const link = document.createElement('a');
      link.download = `souls-banner-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      addToast({
        title: 'Success',
        message: 'Banner image generated and downloaded.',
        type: 'success',
      });
    }
  };

  const applyPreset = (key) => {
    const p = PRESETS[key];
    setText(p.text);
    setTextColor(p.textColor);
    setGlowColor(p.glowColor);
    setFontSize(p.fontSize);
    setFontFamily(p.fontFamily);
    setFontWeight(p.fontWeight);
    setLetterSpacing(p.letterSpacing);
    setOverlayOpacity(p.overlayOpacity);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans selection:bg-red-900/50 selection:text-white">
      <Seo
        title="Souls Banner Generator | Fezcodex"
        description="Generate Dark Souls style 'Enemy Felled' banners on your images."
        keywords={['dark souls', 'generator', 'meme', 'banner', 'image editor']}
      />

      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header */}
        <header className="mb-16">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Souls Banner"
                slug="souls-gen"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-serif italic">
                "The flow of time itself is convoluted; with heroes centuries
                old phasing in and out."
              </p>
            </div>

            <label
              htmlFor="image-upload"
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-red-600 hover:text-white transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm cursor-pointer shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:shadow-none translate-x-[-4px] translate-y-[-4px] hover:translate-x-0 hover:translate-y-0"
            >
              <ImageIcon weight="bold" size={20} />
              <span>Upload Image</span>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls */}
          <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-8">
            {/* Presets */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-sm space-y-4">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <SlidersHorizontalIcon weight="fill" />
                Presets
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(PRESETS).map((key) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key)}
                    className="px-4 py-2 border border-white/10 hover:border-red-500/50 hover:bg-red-900/10 text-xs font-mono text-gray-400 hover:text-red-400 transition-all uppercase"
                  >
                    {PRESETS[key].text}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Config */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-sm space-y-6">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <TextTIcon weight="fill" />
                Text Configuration
              </h3>

              <div className="space-y-2">
                <label className="text-xs font-mono text-gray-500 uppercase">
                  Message
                </label>
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value.toUpperCase())}
                  className="w-full bg-black border border-white/10 px-4 py-3 text-white font-serif tracking-widest focus:border-red-500 outline-none transition-colors"
                />
              </div>

              <div className="space-y-4">
                <CustomDropdown
                  label="Font Family"
                  options={FONT_OPTIONS}
                  value={fontFamily}
                  onChange={setFontFamily}
                  variant="brutalist"
                  icon={TextTIcon}
                />

                <CustomSlider
                  variant="brutalist"
                  label="Font Weight"
                  min={100}
                  max={900}
                  step={100}
                  value={fontWeight}
                  onChange={(val) => setFontWeight(val)}
                />
                <CustomSlider
                  variant="brutalist"
                  label="Font Size"
                  min={20}
                  max={400}
                  value={fontSize}
                  onChange={(val) => setFontSize(val)}
                />
                <CustomSlider
                  variant="brutalist"
                  label="Letter Spacing"
                  min={0}
                  max={50}
                  value={letterSpacing}
                  onChange={(val) => setLetterSpacing(val)}
                />
                <CustomSlider
                  variant="brutalist"
                  label="Vertical Position"
                  min={0}
                  max={100}
                  value={yOffset}
                  onChange={(val) => setYOffset(val)}
                />
              </div>
            </div>

            {/* Visuals */}
            <div className="bg-[#111] border border-white/5 p-6 rounded-sm space-y-6">
              <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <PaletteIcon weight="fill" />
                Visuals
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <CustomColorPicker
                  label="Text Color"
                  value={textColor}
                  onChange={setTextColor}
                  variant="brutalist"
                />
                <CustomColorPicker
                  label="Glow Color"
                  value={glowColor}
                  onChange={setGlowColor}
                  variant="brutalist"
                />
              </div>

              <div className="pt-4 border-t border-white/5 space-y-4">
                <CustomSlider
                  variant="brutalist"
                  label="Overlay Opacity"
                  min={0}
                  max={1}
                  step={0.1}
                  value={overlayOpacity}
                  onChange={(val) => setOverlayOpacity(val)}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-gray-500 uppercase">
                    Show Overlay Band
                  </span>
                  <CustomToggle
                    variant="brutalist"
                    checked={showOverlay}
                    onChange={() => setShowOverlay(!showOverlay)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="lg:col-span-8">
            <div className="relative border border-white/10 bg-[#000] p-4 rounded-sm">
              {image ? (
                <div className="relative w-full flex flex-col items-center">
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto shadow-2xl"
                  />

                  <div className="mt-6 w-full flex justify-end">
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-3 px-8 py-4 bg-white text-black font-black uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all text-xs"
                    >
                      <DownloadSimpleIcon weight="bold" size={18} />
                      <span>Save Image</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video w-full border border-white/10 border-dashed rounded-sm flex flex-col items-center justify-center text-center gap-4 bg-[#050505]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-gray-600">
                    <ImageIcon size={32} />
                  </div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-gray-500">
                    Upload an image to begin
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SoulsBannerGeneratorPage;
