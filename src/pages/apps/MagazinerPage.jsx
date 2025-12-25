import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  TrashIcon,
  ArrowsClockwiseIcon,
  TextAaIcon,
  SelectionIcon,
  InfoIcon,
  DownloadSimpleIcon,
  PaintBrushIcon,
  ImageIcon,
  ArrowsOutIcon,
  PushPinIcon,
  FloppyDiskBackIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import CustomDropdown from '../../components/CustomDropdown';
import CustomSlider from '../../components/CustomSlider';
import BrutalistDialog from '../../components/BrutalistDialog';
import CustomColorPicker from '../../components/CustomColorPicker';

const STYLES = [
  { value: 'brutalist', label: 'BRUTALIST_CHAOS' },
  { value: 'posh', label: 'ELITE_AND_POSH' },
];

const FONTS = [
  { value: 'JetBrains Mono', label: 'JETBRAINS_MONO' },
  { value: 'Space Mono', label: 'SPACE_MONO' },
  { value: 'Playfair Display', label: 'PLAYFAIR_DISPLAY' },
  { value: 'Arvo', label: 'ARVO_SERIF' },
  { value: 'Inter', label: 'INTER_SANS' },
];

const PATTERNS = [
  { value: 'just_shapes', label: 'JUST_SHAPES' },
  { value: 'bauhaus', label: 'BAUHAUS_GRID' },
  { value: 'technical', label: 'TECH_SPEC' },
  { value: 'minimal', label: 'THE_VOID' },
  { value: 'column', label: 'THE_COLUMN' },
  { value: 'diagonal', label: 'DIAGONAL_SCAN' },
];

const COLORS = [
  { name: 'Pure Void', hex: '#050505', text: '#FFFFFF' },
  { name: 'Paper White', hex: '#F5F5F5', text: '#000000' },
  { name: 'Emerald Flux', hex: '#10b981', text: '#000000' },
  { name: 'Salmon Signal', hex: '#FA8072', text: '#000000' },
  { name: 'Cyber Cyan', hex: '#00FFFF', text: '#000000' },
  { name: 'Neon Violet', hex: '#a855f7', text: '#000000' },
  { name: 'Amber Warning', hex: '#f59e0b', text: '#000000' },
  { name: 'Royal Gold', hex: '#D4AF37', text: '#000000' },
];

const initialInputs = {
  issueNo: { text: 'ISSUE NO. 42', x: 5, y: 5, size: 14, font: 'JetBrains Mono' },
  title: { text: 'FEZCODEX', x: 50, y: 15, size: 80, font: 'JetBrains Mono' },
  subtitle: { text: 'THE FUTURE OF DIGITAL ARCHITECTURE', x: 50, y: 22, size: 18, font: 'JetBrains Mono' },
  mainStory: { text: 'CHAOS THEORY', x: 10, y: 45, size: 50, font: 'JetBrains Mono' },
  mainStorySub: { text: 'HOW BRUTALISM SAVED THE WEB', x: 10, y: 52, size: 16, font: 'JetBrains Mono' },
  secondStory: { text: 'THE POSH ERA', x: 90, y: 70, size: 30, font: 'JetBrains Mono' },
  secondStorySub: { text: 'MINIMALISM IS FOR THE ELITE', x: 90, y: 75, size: 14, font: 'JetBrains Mono' },
  bottomText: { text: 'WWW.FEZCODEX.COM // 2025', x: 50, y: 95, size: 12, font: 'JetBrains Mono' },
  rightEdgeText: { text: 'CLASSIFIED // NODE 049', x: 98, y: 50, size: 10, font: 'JetBrains Mono' },
};

const MagazinerPage = () => {
  const appName = 'Magaziner';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Generate high-end magazine covers with brutalist or posh aesthetics.',
    keywords: ['Fezcodex', 'magazine cover generator', 'brutalist design', 'posh design', 'typography tool'],
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const [style, setStyle] = useState('brutalist');
  const [pattern, setPattern] = useState('just_shapes');
  const [primaryColor, setPrimaryColor] = useState(COLORS[0]);
  const [accentColor, setAccentColor] = useState(COLORS[1]);
  const [bgImage, setBgImage] = useState(null);
  const [seed, setSeed] = useState(Math.random());
  const [noiseOpacity, setNoiseOpacity] = useState(0.05);
  const [gridOpacity, setGridOpacity] = useState(0.1);
  const [shapesOpacity, setShapesOpacity] = useState(0.3);
  const [shapesCount, setShapesCount] = useState(15);
  const [borderWidth, setBorderWidth] = useState(10);
  const [inputs, setInputs] = useState(initialInputs);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [stickyPreview, setStickyPreview] = useState(true);

  const handleSavePreset = () => {
    const preset = {
      style,
      pattern,
      primaryColor,
      accentColor,
      noiseOpacity,
      gridOpacity,
      shapesOpacity,
      shapesCount,
      borderWidth,
      inputs,
    };
    localStorage.setItem('magaziner_preset', JSON.stringify(preset));
    addToast({ title: 'PRESET_SAVED', message: 'Current configuration stored in local memory.' });
  };

  const handleLoadPreset = () => {
    const saved = localStorage.getItem('magaziner_preset');
    if (saved) {
      try {
        const preset = JSON.parse(saved);
        setStyle(preset.style);
        setPattern(preset.pattern);
        setPrimaryColor(preset.primaryColor);
        setAccentColor(preset.accentColor);
        setNoiseOpacity(preset.noiseOpacity);
        setGridOpacity(preset.gridOpacity);
        setShapesOpacity(preset.shapesOpacity);
        setShapesCount(preset.shapesCount);
        setBorderWidth(preset.borderWidth);
        setInputs(preset.inputs);
        addToast({ title: 'PRESET_LOADED', message: 'Configuration successfully restored.' });
      } catch (e) {
        addToast({ title: 'LOAD_ERROR', message: 'Stored preset is corrupted or incompatible.', type: 'error' });
      }
    } else {
      addToast({ title: 'NO_PRESET', message: 'No stored configuration found in local memory.', type: 'info' });
    }
  };

  useEffect(() => {
    if (style === 'posh') {
      setInputs(prev => ({
        ...prev,
        issueNo: { ...prev.issueNo, font: 'Playfair Display', size: 12 },
        title: { ...prev.title, font: 'Playfair Display', size: 100 },
        subtitle: { ...prev.subtitle, font: 'Inter', size: 14 },
        mainStory: { ...prev.mainStory, font: 'Playfair Display', size: 40 },
        mainStorySub: { ...prev.mainStorySub, font: 'Inter', size: 12 },
        secondStory: { ...prev.secondStory, font: 'Playfair Display', size: 24 },
        secondStorySub: { ...prev.secondStorySub, font: 'Inter', size: 10 },
        bottomText: { ...prev.bottomText, font: 'Inter', size: 10 },
        rightEdgeText: { ...prev.rightEdgeText, font: 'Inter', size: 8 },
      }));
      setPrimaryColor(COLORS[1]); // Paper White
      setAccentColor(COLORS[0]); // Pure Void
    } else {
      setInputs(initialInputs);
      setPrimaryColor(COLORS[0]);
      setAccentColor(COLORS[2]); // Emerald
    }
  }, [style]);

  const handleInputChange = (key, field, value) => {
    setInputs(prev => ({
      ...prev,
      [key]: { ...prev[key], [field]: value }
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => setBgImage(img);
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const drawMagazine = useCallback((ctx, width, height, options = { includeText: true, includeBgImage: true }) => {
    const scale = width / 1000;
    const rng = (s) => {
      let v = s * 12345.678;
      return () => {
        v = (v * 987.654) % 1;
        return v;
      };
    };
    const getRand = rng(seed);

    // 1. Background
    ctx.fillStyle = primaryColor.hex;
    ctx.fillRect(0, 0, width, height);

    if (bgImage && options.includeBgImage) {
      const imgRatio = bgImage.width / bgImage.height;
      const canvasRatio = width / height;
      let dWidth, dHeight, dx, dy;

      if (imgRatio > canvasRatio) {
        dHeight = height;
        dWidth = height * imgRatio;
        dx = (width - dWidth) / 2;
        dy = 0;
      } else {
        dWidth = width;
        dHeight = width / imgRatio;
        dx = 0;
        dy = (height - dHeight) / 2;
      }
      ctx.drawImage(bgImage, dx, dy, dWidth, dHeight);
    }

    // 2. Grid Layer (Structural Protocol)
    if (gridOpacity > 0) {
      ctx.save();
      ctx.strokeStyle = accentColor.hex;
      ctx.globalAlpha = gridOpacity;
      ctx.lineWidth = 1 * scale;
      const gridSize = 50 * scale;

      ctx.beginPath();
      for (let x = 0; x <= width; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    // 3. Shapes & Patterns
    ctx.save();
    ctx.strokeStyle = accentColor.hex;
    ctx.fillStyle = accentColor.hex;
    ctx.lineWidth = 1 * scale;

    if (pattern === 'just_shapes') {
      for (let i = 0; i < shapesCount; i++) {
        const shapeType = Math.floor(getRand() * 10);
        const x = getRand() * width;
        const y = getRand() * height;
        const size = (20 + getRand() * 100) * scale;
        ctx.globalAlpha = shapesOpacity;

        switch (shapeType) {
          case 0: // Rect
            ctx.strokeRect(x, y, size, size);
            break;
          case 1: // Circle
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.stroke();
            break;
          case 2: // Triangle
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y);
            ctx.lineTo(x + size / 2, y - size);
            ctx.closePath();
            ctx.stroke();
            break;
          case 3: // Cross
            ctx.beginPath();
            ctx.moveTo(x - size / 2, y); ctx.lineTo(x + size / 2, y);
            ctx.moveTo(x, y - size / 2); ctx.lineTo(x, y + size / 2);
            ctx.stroke();
            break;
          case 4: // Grid
            const gSize = size / 4;
            for (let gx = 0; gx < 4; gx++) {
              for (let gy = 0; gy < 4; gy++) {
                ctx.strokeRect(x + gx * gSize, y + gy * gSize, 2, 2);
              }
            }
            break;
          case 5: // Dots
            for (let j = 0; j < 5; j++) {
              ctx.beginPath();
              ctx.arc(x + getRand() * size, y + getRand() * size, 2 * scale, 0, Math.PI * 2);
              ctx.fill();
            }
            break;
          case 6: // Waves
            ctx.beginPath();
            ctx.moveTo(x, y);
            for (let j = 0; j < size; j += 5) {
              ctx.lineTo(x + j, y + Math.sin(j * 0.1) * 10 * scale);
            }
            ctx.stroke();
            break;
          case 7: // Diagonals
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + size, y + size);
            ctx.stroke();
            break;
          case 8: // Star
            ctx.beginPath();
            for (let j = 0; j < 5; j++) {
              ctx.lineTo(x + Math.cos(j * Math.PI * 2 / 5) * size, y + Math.sin(j * Math.PI * 2 / 5) * size);
            }
            ctx.closePath();
            ctx.stroke();
            break;
          case 9: // Concentric
            ctx.beginPath();
            ctx.arc(x, y, size / 2, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, size / 4, 0, Math.PI * 2);
            ctx.stroke();
            break;
          default: break;
        }
      }
    } else {
      const padding = 60 * scale;
      ctx.globalAlpha = shapesOpacity;
      ctx.lineWidth = 2 * scale;

      if (pattern === 'bauhaus') {
        for (let i = 0; i < 5; i++) {
          ctx.strokeRect(getRand() * width, getRand() * height, 200 * scale * getRand(), 200 * scale * getRand());
          ctx.beginPath();
          ctx.arc(getRand() * width, getRand() * height, 100 * scale * getRand(), 0, Math.PI * 2);
          ctx.stroke();
        }
      } else if (pattern === 'technical') {
        ctx.beginPath();
        ctx.moveTo(width / 2, padding);
        ctx.lineTo(width / 2, height - padding);
        ctx.stroke();
        for (let i = 0; i < 10; i++) {
          const y = padding + getRand() * (height - padding * 2);
          ctx.strokeRect(width / 2 - 20 * scale, y, 40 * scale, 2 * scale);
        }
      } else if (pattern === 'minimal') {
        const cx = width / 2;
        const cy = height / 2;
        const size = 100 * scale;
        ctx.beginPath();
        ctx.moveTo(cx - size, cy);
        ctx.lineTo(cx + size, cy);
        ctx.moveTo(cx, cy - size);
        ctx.lineTo(cx, cy + size);
        ctx.stroke();
        ctx.strokeRect(cx - size / 4, cy - size / 4, size / 2, size / 2);
      }
      else if (pattern === 'column') {
        const colX = padding * 3;
        ctx.beginPath();
        ctx.moveTo(colX, padding);
        ctx.lineTo(colX, height - padding);
        ctx.stroke();
        for (let i = 0; i < 20; i++) {
          const y = padding + (i * (height - padding * 2) / 20);
          ctx.strokeRect(colX - 10 * scale, y, 20 * scale, 1 * scale);
        }
      } else if (pattern === 'diagonal') {
        const step = 40 * scale;
        for (let i = -height; i < width + height; i += step) {
          ctx.beginPath();
          ctx.moveTo(i, 0);
          ctx.lineTo(i + height, height);
          ctx.stroke();
        }
      }
    }
    ctx.restore();

    // 4. Typography
    if (options.includeText) {
      ctx.fillStyle = accentColor.hex;
      ctx.textBaseline = 'middle';

      Object.entries(inputs).forEach(([key, config]) => {
        ctx.save();
        ctx.font = `${style === 'brutalist' ? 'bold' : ''} ${config.size * scale}px "${config.font}"`;

        const x = (config.x / 100) * width;
        const y = (config.y / 100) * height;

        if (key === 'rightEdgeText') {
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.fillText(config.text.toUpperCase(), 0, 0);
        } else if (key === 'title' || key === 'subtitle' || key === 'bottomText') {
          ctx.textAlign = 'center';
          ctx.fillText(config.text.toUpperCase(), x, y);
        } else if (key === 'secondStory' || key === 'secondStorySub') {
          ctx.textAlign = 'right';
          ctx.fillText(config.text.toUpperCase(), x, y);
        } else {
          ctx.textAlign = 'left';
          ctx.fillText(config.text.toUpperCase(), x, y);
        }
        ctx.restore();
      });
    }

    // 4. Border (Frame Protocol)
    if (borderWidth > 0) {
      ctx.strokeStyle = accentColor.hex;
      ctx.lineWidth = borderWidth * scale;
      const bPadding = 30 * scale;
      ctx.strokeRect(bPadding, bPadding, width - bPadding * 2, height - bPadding * 2);
    }

    // 5. Noise
    if (noiseOpacity > 0) {
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
    }
  }, [style, pattern, primaryColor, accentColor, bgImage, seed, shapesCount, shapesOpacity, noiseOpacity, gridOpacity, borderWidth, inputs]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    drawMagazine(ctx, rect.width, rect.height);
  }, [drawMagazine]);

  const handleDownload = (mode = 'full') => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const W = 2480; // A4 at 300DPI approx
    const H = 3508;
    canvas.width = W;
    canvas.height = H;

    const options = {
      includeText: mode === 'full',
      includeBgImage: mode === 'full',
    };

    drawMagazine(ctx, W, H, options);

    const link = document.createElement('a');
    link.download = `magaziner-${mode}-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({
      title: 'EXPORT_SUCCESS',
      message: mode === 'full' ? 'Magazine cover exported.' : 'Background template exported.'
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Premium cover construction interface. Toggle between raw brutalism and elite minimal aesthetics.
              </p>
            </div>

                                    <div className="flex gap-4">
                                      <button
                                        onClick={() => setIsLoadDialogOpen(true)}
                                        className="p-6 border border-white/10 text-emerald-500 hover:text-white hover:bg-white/5 transition-all rounded-sm"
                                        title="Load Stored Preset"
                                      >
                                        <ArrowsClockwiseIcon weight="bold" size={24} />
                                      </button>
                                      <button
                                        onClick={() => setIsSaveDialogOpen(true)}
                                        className="p-6 border border-white/10 text-emerald-500 hover:text-white hover:bg-white/5 transition-all rounded-sm"
                                        title="Save Current Preset"
                                      >
                                        <FloppyDiskBackIcon weight="bold" size={24} />
                                      </button>
                                                    <button
                                                      onClick={() => setIsExportDialogOpen(true)}
                                                      className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
                                                    >
                                                      <DownloadSimpleIcon weight="bold" size={24} />
                                                      <span>Export</span>
                                                    </button>
                                                  </div>
                                                </div>
                                              </header>

                                              {/* Export Manager Dialog */}
                                              <BrutalistDialog
                                                isOpen={isExportDialogOpen}
                                                onClose={() => setIsExportDialogOpen(false)}
                                                title="EXPORT_MANAGER_v1.0"
                                              >
                                                <div className="space-y-6 font-mono text-sm uppercase tracking-wider">
                                                  <p className="text-gray-500 text-xs leading-relaxed">
                                                    SELECT EXPORT MODE FOR CURRENT ARCHIVE ENTITY:
                                                  </p>

                                                  <div className="flex flex-col gap-4">
                                                    <button
                                                      onClick={() => { handleDownload('full'); setIsExportDialogOpen(false); }}
                                                      className="w-full py-6 bg-white text-black hover:bg-emerald-500 transition-all font-black text-xs flex flex-col items-center gap-1"
                                                    >
                                                      <span>EXPORT_COVER</span>
                                                      <span className="text-[9px] opacity-60">FULL COMPOSITION WITH TYPOGRAPHY & MEDIA</span>
                                                    </button>

                                                    <button
                                                      onClick={() => { handleDownload('page'); setIsExportDialogOpen(false); }}
                                                      className="w-full py-6 border border-white/10 text-white hover:bg-white/5 transition-all font-black text-xs flex flex-col items-center gap-1"
                                                    >
                                                      <span>EXPORT_PAGE</span>
                                                      <span className="text-[9px] text-gray-500">TEMPLATE ONLY // SHAPES + GRID + BORDER</span>
                                                    </button>

                                                    <button
                                                      onClick={() => setIsExportDialogOpen(false)}
                                                      className="w-full py-3 text-red-500 hover:text-white transition-all font-mono text-[10px] uppercase tracking-[0.3em]"
                                                    >
                                                      [ CLOSE_SESSION ]
                                                    </button>
                                                  </div>
                                                </div>
                                              </BrutalistDialog>

                                              {/* Save Confirmation Dialog */}                                <BrutalistDialog
                                  isOpen={isSaveDialogOpen}
                                  onClose={() => setIsSaveDialogOpen(false)}
                                  onConfirm={() => { handleSavePreset(); setIsSaveDialogOpen(false); }}
                                  title="MEMORY_COMMIT_PROTOCOL"
                                  message="THIS ACTION WILL OVERWRITE YOUR PREVIOUSLY STORED CONFIGURATION IN THE LOCAL BROWSER ARCHIVE. DO YOU WISH TO COMMIT THESE ENTITIES?"
                                  confirmText="COMMIT_TO_MEMORY"
                                  cancelText="ABORT_SEQUENCE"
                                />

                                {/* Load Confirmation Dialog */}
                                <BrutalistDialog
                                  isOpen={isLoadDialogOpen}
                                  onClose={() => setIsLoadDialogOpen(false)}
                                  onConfirm={() => { handleLoadPreset(); setIsLoadDialogOpen(false); }}
                                  title="DATA_RECOVERY_PROTOCOL"
                                  message="THIS ACTION WILL OVERRIDE ALL CURRENT UNSAVED CHANGES WITH THE DATA STORED IN YOUR LOCAL ARCHIVE. DO YOU WISH TO PROCEED WITH RECOVERY?"
                                  confirmText="EXECUTE_RECOVERY"
                                  cancelText="ABORT_SEQUENCE"
                                />        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* LEFT: Controls */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <SelectionIcon weight="fill" />
                Aesthetic_Profile
              </h3>

              <div className="space-y-6">
                <CustomDropdown
                  label="Style Protocol"
                  options={STYLES}
                  value={style}
                  onChange={setStyle}
                  variant="brutalist"
                  fullWidth
                />

                <div className="space-y-4">
                  <label className="block font-mono text-[9px] uppercase text-gray-600">Background Image</label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    className="hidden"
                    accept="image/*"
                  />
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="w-full py-3 border border-dashed border-white/20 text-gray-400 hover:text-white hover:border-white/40 transition-all font-mono text-[10px] uppercase flex items-center justify-center gap-2"
                  >
                    <ImageIcon weight="bold" /> {bgImage ? 'Replace Image' : 'Upload Backdrop'}
                  </button>
                  {bgImage && (
                    <button
                      onClick={() => setBgImage(null)}
                      className="w-full text-[9px] font-mono text-red-500 uppercase text-center"
                    >
                      Clear Image
                    </button>
                  )}
                </div>

                <div className="space-y-6">
                  <CustomColorPicker
                    label="Base Chromatic"
                    value={primaryColor.hex}
                    onChange={(hex) => setPrimaryColor({ name: 'Custom', hex })}
                  />

                  <CustomColorPicker
                    label="Accent Chromatic"
                    value={accentColor.hex}
                    onChange={(hex) => setAccentColor({ name: 'Custom', hex })}
                  />
                </div>
              </div>
            </div>

            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <TextAaIcon weight="fill" />
                Content_Matrix
              </h3>

                            <div className="space-y-8 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                              {Object.entries(inputs).map(([key, config]) => (
                                <div key={key} className="space-y-6 pb-6 border-b border-white/5">
                                  <div className="space-y-2">
                                    <label className="font-mono text-[9px] uppercase text-gray-500">{key.replace(/([A-Z])/g, '_$1')}</label>
                                    <input
                                      type="text"
                                      value={config.text}
                                      onChange={(e) => handleInputChange(key, 'text', e.target.value)}
                                      className="w-full bg-black/40 border border-white/10 p-2 font-mono text-[10px] uppercase tracking-widest focus:border-emerald-500 outline-none transition-all"
                                    />
                                  </div>

                                  <CustomSlider
                                    label="Typographical Size"
                                    min={5}
                                    max={200}
                                    value={config.size}
                                    onChange={(val) => handleInputChange(key, 'size', val)}
                                  />

                                  <CustomDropdown
                                    label="Font Family"
                                    options={FONTS}
                                    value={config.font}
                                    onChange={(val) => handleInputChange(key, 'font', val)}
                                    variant="brutalist"
                                    fullWidth
                                  />

                                  <CustomSlider
                                    label="X Axis Position"
                                    min={0}
                                    max={100}
                                    value={config.x}
                                    onChange={(val) => handleInputChange(key, 'x', val)}
                                  />

                                  <CustomSlider
                                    label="Y Axis Position"
                                    min={0}
                                    max={100}
                                    value={config.y}
                                    onChange={(val) => handleInputChange(key, 'y', val)}
                                  />
                                </div>
                              ))}
                            </div>            </div>

            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-6">
                <PaintBrushIcon weight="fill" />
                Structural_Noise
              </h3>

              <div className="space-y-8">
                <CustomDropdown
                  label="Background Pattern"
                  options={PATTERNS}
                  value={pattern}
                  onChange={setPattern}
                  variant="brutalist"
                  fullWidth
                />

                <CustomSlider
                  label="Shape Density"
                  min={0}
                  max={50}
                  value={shapesCount}
                  onChange={setShapesCount}
                />

                <CustomSlider
                  label="Frame Thickness"
                  min={0}
                  max={100}
                  value={borderWidth}
                  onChange={setBorderWidth}
                />

                <CustomSlider
                  label="Noise Entropy"
                  min={0}
                  max={0.5}
                  step={0.01}
                  value={noiseOpacity}
                  onChange={setNoiseOpacity}
                />

                <CustomSlider
                  label="Grid Structural"
                  min={0}
                  max={0.8}
                  step={0.01}
                  value={gridOpacity}
                  onChange={setGridOpacity}
                />

                <CustomSlider
                  label="Pattern Opacity"
                  min={0}
                  max={1}
                  step={0.01}
                  value={shapesOpacity}
                  onChange={setShapesOpacity}
                />
                <button
                  onClick={() => setSeed(Math.random())}
                  className="w-full py-4 border border-white/10 text-gray-500 hover:text-white hover:bg-white/5 transition-all font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <ArrowsClockwiseIcon weight="bold" /> Re-Seed Patterns
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT: Preview */}
          <div className="lg:col-span-8">
            <div className={`${stickyPreview ? 'lg:sticky lg:top-24' : ''} transition-all duration-300`}>
              <div className="relative border border-white/10 bg-[#0a0a0a] rounded-sm overflow-hidden flex items-center justify-center shadow-2xl group min-h-[800px]">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-[600px] aspect-[1/1.414] object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                  style={{ imageRendering: 'pixelated' }}
                />

                <div className="absolute top-8 right-8 z-30 flex flex-col items-end gap-2">
                  <button
                    onClick={() => setStickyPreview(!stickyPreview)}
                    className={`flex items-center gap-2 px-4 py-2 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest transition-all ${
                      stickyPreview
                        ? 'bg-red-500 text-black border-red-500 font-black'
                        : 'bg-black/60 text-red-400 hover:bg-red-500 hover:text-black'
                    }`}
                    title={stickyPreview ? 'Unstick Preview' : 'Stick Preview'}
                  >
                    <PushPinIcon weight={stickyPreview ? 'fill' : 'bold'} /> {stickyPreview ? 'Pinned' : 'Pin'}
                  </button>
                  <button
                    onClick={() => { setInputs(initialInputs); setSeed(Math.random()); setBgImage(null); }}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-2 px-4 py-2 bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-mono uppercase tracking-widest text-red-400 hover:bg-red-500 hover:text-black transition-all"
                  >
                    <TrashIcon weight="bold" /> Reset
                  </button>
                </div>
              </div>

              <div className="mt-12 p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
                <InfoIcon size={32} className="text-gray-700 shrink-0 mt-1" />
                <div className="space-y-4">
                  <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                    MAGAZINER_PROTOCOL: High-fidelity rasterization active. Final render calibrated for A4 output at 300 DPI.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] uppercase">
                    <ArrowsOutIcon weight="bold" /> All elements are fully mappable on the 100x100 grid.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Magaziner_v1.0.0</span>
          <span className="text-gray-800">DESIGN_STATUS // ELITE</span>
        </footer>
      </div>
    </div>
  );
};

export default MagazinerPage;
