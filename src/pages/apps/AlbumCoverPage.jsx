import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ArrowsClockwiseIcon,
  TextTIcon,
  SelectionIcon,
  PushPinIcon,
  FloppyDiskBackIcon,
  PlusIcon,
  MusicNoteIcon,
  CameraIcon,
  IdentificationBadgeIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import CustomDropdown from '../../components/CustomDropdown';
import CustomSlider from '../../components/CustomSlider';
import BrutalistDialog from '../../components/BrutalistDialog';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const STYLES = [
  { value: 'brutalist', label: 'BRUTALIST_CHAOS' },
  { value: 'elite', label: 'ELITE_MINIMAL' },
  { value: 'glassy', label: 'GLASSY_FLUX' },
  { value: 'detective', label: 'CONSPIRACY_NOIR' },
];

const BG_MODES = [
  { value: 'color', label: 'SOLID_COLOR' },
  { value: 'generative', label: 'GENERATIVE_ART' },
  { value: 'waves', label: 'ABSTRACT_WAVES' },
  { value: 'topo', label: 'TOPOGRAPHIC_SCAN' },
  { value: 'glass', label: 'GLASSY_GRADIENT' },
];

const FONTS = [
  { value: 'JetBrains Mono', label: 'JETBRAINS_MONO' },
  { value: 'Space Mono', label: 'SPACE_MONO' },
  { value: 'Playfair Display', label: 'PLAYFAIR_DISPLAY' },
  { value: 'Arvo', label: 'ARVO_SERIF' },
  { value: 'Inter', label: 'INTER_SANS' },
];

const initialInputs = {
  albumTitle: {
    text: 'NEURAL_NETWORK_SYMPHONY',
    x: 50,
    y: 40,
    size: 60,
    font: 'JetBrains Mono',
    align: 'center',
  },
  artistName: {
    text: 'FEZCODE_EXTRACT',
    x: 50,
    y: 50,
    size: 24,
    font: 'JetBrains Mono',
    align: 'center',
  },
  labelName: {
    text: '© 2025 FEZCODEX RECORDS',
    x: 50,
    y: 92,
    size: 10,
    font: 'JetBrains Mono',
    align: 'center',
  },
  catalogNo: {
    text: 'FCX-049-LP',
    x: 92,
    y: 50,
    size: 10,
    font: 'JetBrains Mono',
    align: 'vertical',
  },
};

const AlbumCoverPage = () => {
  const appName = 'Album Constructor';

  const { addToast } = useToast();
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // System State
  const [style, setStyle] = useState('brutalist');
  const [bgMode, setBgMode] = useState('generative');
  const [primaryColor, setPrimaryColor] = useState('#050505');
  const [accentColor, setAccentColor] = useState('#10b981');
  const [bgImage, setBgImage] = useState(null);
  const [seed, setSeed] = useState(Math.random());
  const [noiseOpacity] = useState(0.05);
  const [gridOpacity] = useState(0.1);
  const [inputs, setInputs] = useState(initialInputs);
  const [assets, setAssets] = useState([]);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false);
  const [stickyPreview, setStickyPreview] = useState(true);

  // Style Automation Protocol
  useEffect(() => {
    if (style === 'brutalist') {
      setBgMode('generative');
      setPrimaryColor('#050505');
      setAccentColor('#10b981');
      setInputs((prev) => ({
        ...prev,
        albumTitle: { ...prev.albumTitle, font: 'JetBrains Mono', size: 60 },
        artistName: { ...prev.artistName, font: 'JetBrains Mono', size: 24 },
      }));
    } else if (style === 'elite') {
      setBgMode('color');
      setPrimaryColor('#F5F5F5');
      setAccentColor('#050505');
      setInputs((prev) => ({
        ...prev,
        albumTitle: { ...prev.albumTitle, font: 'Playfair Display', size: 80 },
        artistName: { ...prev.artistName, font: 'Inter', size: 18 },
      }));
    } else if (style === 'glassy') {
      setBgMode('glass');
      setAccentColor('#FFFFFF');
      setInputs((prev) => ({
        ...prev,
        albumTitle: { ...prev.albumTitle, font: 'Playfair Display', size: 70 },
        artistName: { ...prev.artistName, font: 'Arvo', size: 22 },
      }));
    } else if (style === 'detective') {
      setBgMode('topo');
      setPrimaryColor('#2b1d12');
      setAccentColor('#d2a679');
      setInputs((prev) => ({
        ...prev,
        albumTitle: { ...prev.albumTitle, font: 'Arvo', size: 50 },
        artistName: { ...prev.artistName, font: 'Space Mono', size: 20 },
      }));
    }
  }, [style]);

  const handleInputChange = (key, field, value) => {
    setInputs((prev) => ({ ...prev, [key]: { ...prev[key], [field]: value } }));
  };

  const addAsset = (type) => {
    const newAsset = {
      id: Date.now(),
      type,
      x: 50,
      y: 50,
      width: 20,
      height: 20,
      rotation: 0,
      opacity: 1,
    };
    setAssets([...assets, newAsset]);
  };

  const drawAlbum = useCallback(
    (ctx, width, height) => {
      const scale = width / 1000;
      const rng = (s) => {
        let v = s * 12345.678;
        return () => {
          v = (v * 987.654) % 1;
          return v;
        };
      };
      const getRand = rng(seed);

      // 1. Background Logic
      ctx.fillStyle = primaryColor;
      ctx.fillRect(0, 0, width, height);

      if (bgMode === 'glass') {
        const bgGradient = ctx.createLinearGradient(0, 0, width, height);
        bgGradient.addColorStop(0, '#6366f1');
        bgGradient.addColorStop(0.5, '#a855f7');
        bgGradient.addColorStop(1, '#ec4899');
        ctx.fillStyle = bgGradient;
        ctx.fillRect(0, 0, width, height);
        const drawBlob = (x, y, r, color) => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fillStyle = color;
          ctx.filter = 'blur(80px)';
          ctx.globalAlpha = 0.4;
          ctx.fill();
          ctx.restore();
        };
        drawBlob(width * 0.2, height * 0.2, 300 * scale, '#c084fc');
        drawBlob(width * 0.8, height * 0.1, 250 * scale, '#facc15');
      } else if (bgMode === 'waves') {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.lineWidth = 1 * scale;
        for (let i = 0; i < 50; i++) {
          ctx.beginPath();
          ctx.moveTo(0, height * (i / 50));
          for (let x = 0; x < width; x += 10) {
            const y =
              height * (i / 50) + Math.sin(x * 0.01 + i + seed) * 50 * scale;
            ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      } else if (bgMode === 'topo') {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.3;
        for (let i = 0; i < 20; i++) {
          ctx.beginPath();
          ctx.arc(
            width / 2,
            height / 2,
            (i * 50 + seed * 100) * scale,
            0,
            Math.PI * 2,
          );
          ctx.stroke();
        }
        ctx.restore();
      } else if (bgMode === 'generative') {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = 0.2;
        for (let i = 0; i < 10; i++) {
          ctx.strokeRect(
            getRand() * width,
            getRand() * height,
            200 * scale,
            200 * scale,
          );
        }
        ctx.restore();
      }

      if (bgImage) {
        ctx.save();
        ctx.globalAlpha = style === 'detective' ? 0.8 : 1;
        if (style === 'detective')
          ctx.filter = 'grayscale(100%) sepia(50%) contrast(150%)';
        const imgRatio = bgImage.width / bgImage.height;
        const canvasRatio = width / height;
        let dw, dh, dx, dy;
        if (imgRatio > canvasRatio) {
          dh = height;
          dw = height * imgRatio;
          dx = (width - dw) / 2;
          dy = 0;
        } else {
          dw = width;
          dh = width / imgRatio;
          dx = 0;
          dy = (height - dh) / 2;
        }
        ctx.drawImage(bgImage, dx, dy, dw, dh);
        ctx.restore();
      }

      // 2. Grid Layer
      if (gridOpacity > 0) {
        ctx.save();
        ctx.strokeStyle = accentColor;
        ctx.globalAlpha = gridOpacity;
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

      // 3. Assets
      assets.forEach((asset) => {
        ctx.save();
        const ax = (asset.x / 100) * width;
        const ay = (asset.y / 100) * height;
        const aw = (asset.width / 100) * width;
        const ah = (asset.height / 100) * height;
        ctx.translate(ax, ay);
        ctx.rotate(asset.rotation * (Math.PI / 180));
        ctx.globalAlpha = asset.opacity;
        ctx.fillStyle = accentColor;
        ctx.strokeStyle = accentColor;

        if (asset.type === 'barcode') {
          // Realistic Barcode with variable line widths
          ctx.fillStyle = 'white';
          ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
          ctx.fillStyle = 'black';
          let bx = -aw / 2 + 5 * scale;
          while (bx < aw / 2 - 5 * scale) {
            const w = (1 + Math.floor(getRand() * 4)) * scale;
            if (getRand() > 0.3)
              ctx.fillRect(bx, -ah / 2 + 5 * scale, w, ah - 15 * scale);
            bx += w + (1 + getRand() * 2) * scale;
          }
          ctx.font = `${ah / 8}px "JetBrains Mono"`;
          ctx.textAlign = 'center';
          ctx.fillText(
            Math.floor(getRand() * 1000000000).toString(),
            0,
            ah / 2 - 2 * scale,
          );
        } else if (asset.type === 'polaroid') {
          // Sophisticated Polaroid with shadow and depth
          ctx.fillStyle = '#fefefe';
          ctx.shadowBlur = 20 * scale;
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.fillRect(-aw / 2, -ah / 2, aw, ah);
          ctx.shadowBlur = 0;

          ctx.fillStyle = '#111';
          const innerW = aw * 0.85;
          const innerH = ah * 0.75;
          ctx.fillRect(
            -innerW / 2,
            -ah / 2 + (aw - innerW) / 2,
            innerW,
            innerH,
          );

          // Add a "handwritten" look note area
          ctx.strokeStyle = '#eee';
          ctx.lineWidth = 1 * scale;
          ctx.beginPath();
          ctx.moveTo(-innerW / 2, ah / 2 - 15 * scale);
          ctx.lineTo(innerW / 2, ah / 2 - 15 * scale);
          ctx.stroke();
        } else if (asset.type === 'sticker') {
          // holographic/circle sticker
          const grad = ctx.createRadialGradient(0, 0, 0, 0, 0, aw / 2);
          grad.addColorStop(0, '#fff');
          grad.addColorStop(0.5, accentColor);
          grad.addColorStop(1, primaryColor);
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, aw / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = 'rgba(255,255,255,0.5)';
          ctx.lineWidth = 2 * scale;
          ctx.stroke();
        } else if (asset.type === 'frame') {
          // technical corner frame
          ctx.strokeStyle = accentColor;
          ctx.lineWidth = 2 * scale;
          const s = aw / 4;
          // Top Left
          ctx.beginPath();
          ctx.moveTo(-aw / 2, -ah / 2 + s);
          ctx.lineTo(-aw / 2, -ah / 2);
          ctx.lineTo(-aw / 2 + s, -ah / 2);
          ctx.stroke();
          // Top Right
          ctx.beginPath();
          ctx.moveTo(aw / 2 - s, -ah / 2);
          ctx.lineTo(aw / 2, -ah / 2);
          ctx.lineTo(aw / 2, -ah / 2 + s);
          ctx.stroke();
          // Bottom Left
          ctx.beginPath();
          ctx.moveTo(-aw / 2, ah / 2 - s);
          ctx.lineTo(-aw / 2, ah / 2);
          ctx.lineTo(-aw / 2 + s, ah / 2);
          ctx.stroke();
          // Bottom Right
          ctx.beginPath();
          ctx.moveTo(aw / 2 - s, ah / 2);
          ctx.lineTo(aw / 2, ah / 2);
          ctx.lineTo(aw / 2, ah / 2 - s);
          ctx.stroke();
        }
        ctx.restore();
      });

      // 4. Typography
      Object.entries(inputs).forEach(([key, config]) => {
        ctx.save();
        ctx.fillStyle = accentColor;
        if (style === 'glassy') ctx.fillStyle = 'white';
        ctx.font = `${style === 'brutalist' ? 'bold' : ''} ${config.size * scale}px "${config.font}"`;
        const x = (config.x / 100) * width;
        const y = (config.y / 100) * height;

        if (config.align === 'vertical') {
          ctx.translate(x, y);
          ctx.rotate(Math.PI / 2);
          ctx.textAlign = 'center';
          ctx.fillText(config.text.toUpperCase(), 0, 0);
        } else {
          ctx.textAlign = config.align;
          ctx.fillText(config.text.toUpperCase(), x, y);
        }
        ctx.restore();
      });

      // 5. Noise Layer
      if (noiseOpacity > 0) {
        const noiseSize = 256;
        const noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = noiseSize;
        noiseCanvas.height = noiseSize;
        const nCtx = noiseCanvas.getContext('2d');
        const nData = nCtx.createImageData(noiseSize, noiseSize);
        for (let i = 0; i < nData.data.length; i += 4) {
          const v = Math.random() * 255;
          nData.data[i] = nData.data[i + 1] = nData.data[i + 2] = v;
          nData.data[i + 3] = 255;
        }
        nCtx.putImageData(nData, 0, 0);
        ctx.save();
        ctx.globalAlpha = noiseOpacity;
        ctx.globalCompositeOperation = 'overlay';
        const p = ctx.createPattern(noiseCanvas, 'repeat');
        ctx.fillStyle = p;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }

      // 6. Global Style Overlays (Frames)
      ctx.save();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 10 * scale;
      const fPad = 40 * scale;
      const fw = width - fPad * 2;
      const fh = height - fPad * 2;

      if (style === 'glassy') {
        const r = 60 * scale;
        ctx.beginPath();
        ctx.moveTo(fPad + r, fPad);
        ctx.lineTo(fPad + fw - r, fPad);
        ctx.quadraticCurveTo(fPad + fw, fPad, fPad + fw, fPad + r);
        ctx.lineTo(fPad + fw, fPad + fh - r);
        ctx.quadraticCurveTo(fPad + fw, fPad + fh, fPad + fw - r, fPad + fh);
        ctx.lineTo(fPad + r, fPad + fh);
        ctx.quadraticCurveTo(fPad, fPad + fh, fPad, fPad + fh - r);
        ctx.lineTo(fPad, fPad + r);
        ctx.quadraticCurveTo(fPad, fPad, fPad + r, fPad);
        ctx.stroke();
      } else if (style === 'brutalist') {
        ctx.strokeRect(fPad, fPad, fw, fh);
        // Technical crosshairs
        ctx.lineWidth = 2 * scale;
        ctx.beginPath();
        ctx.moveTo(width / 2, 0);
        ctx.lineTo(width / 2, fPad);
        ctx.moveTo(width / 2, height);
        ctx.lineTo(width / 2, height - fPad);
        ctx.moveTo(0, height / 2);
        ctx.lineTo(fPad, height / 2);
        ctx.moveTo(width, height / 2);
        ctx.lineTo(width - fPad, height / 2);
        ctx.stroke();
      } else if (style === 'detective') {
        ctx.lineWidth = 4 * scale;
        ctx.setLineDash([20 * scale, 10 * scale]);
        ctx.strokeRect(fPad, fPad, fw, fh);
      }
      ctx.restore();
    },
    [
      style,
      bgMode,
      primaryColor,
      accentColor,
      bgImage,
      seed,
      noiseOpacity,
      gridOpacity,
      inputs,
      assets,
    ],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.width * dpr;
    ctx.scale(dpr, dpr);
    drawAlbum(ctx, rect.width, rect.width);
  }, [drawAlbum]);

  const handleDownload = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const S = 3000;
    canvas.width = S;
    canvas.height = S;
    drawAlbum(ctx, S, S);
    const link = document.createElement('a');
    link.download = `album-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({
      title: 'MASTER_EXPORT_SUCCESS',
      message: 'High-fidelity 3000x3000px asset generated.',
    });
  };

  const glassCard =
    'bg-white/10 backdrop-blur-xl border border-white/20 rounded-sm shadow-2xl';
  const glassInput =
    'bg-white/5 border border-white/10 p-3 font-mono text-xs text-white focus:border-emerald-500 outline-none w-full uppercase';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title={`${appName} | Fezcodex`}
        description="The ultimate high-fidelity album cover generation protocol."
        keywords={[
          'album cover',
          'generator',
          'design tool',
          'music art',
          'fezcodex',
        ]}
      />
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12 relative z-10">
        <header className="mb-24">
          <Link
            to="/apps"
            className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle
                title="Album Constructor"
                slug="album"
                variant="brutalist"
              />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Synthesis protocol. Merging aesthetics from across the Fezcodex
                ecosystem into a unified square-format master.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setIsLoadDialogOpen(true)}
                className="p-6 border border-white/10 text-emerald-500 hover:text-white hover:bg-white/5 transition-all rounded-sm"
              >
                <ArrowsClockwiseIcon weight="bold" size={24} />
              </button>
              <button
                onClick={() => setIsSaveDialogOpen(true)}
                className="p-6 border border-white/10 text-emerald-500 hover:text-white hover:bg-white/5 transition-all rounded-sm"
              >
                <FloppyDiskBackIcon weight="bold" size={24} />
              </button>
              <button
                onClick={handleDownload}
                className="group relative inline-flex items-center gap-4 px-10 py-6 bg-white text-black hover:bg-emerald-400 transition-all font-mono uppercase tracking-widest text-sm font-black rounded-sm shrink-0"
              >
                <DownloadSimpleIcon weight="bold" size={24} />{' '}
                <span>Export Master</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3 space-y-8">
            {/* Aesthetics */}
            <div className={glassCard + ' p-8 space-y-6'}>
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
                <SelectionIcon weight="fill" /> Aesthetic_Profile
              </h3>
              <CustomDropdown
                label="Global Style"
                options={STYLES}
                value={style}
                onChange={setStyle}
                variant="brutalist"
                fullWidth
              />
              <CustomDropdown
                label="Background Mode"
                options={BG_MODES}
                value={bgMode}
                onChange={setBgMode}
                variant="brutalist"
                fullWidth
              />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-gray-500">
                    Base_Color
                  </label>
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-full h-10 bg-transparent border border-white/10 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-mono text-gray-500">
                    Accent_Color
                  </label>
                  <input
                    type="color"
                    value={accentColor}
                    onChange={(e) => setAccentColor(e.target.value)}
                    className="w-full h-10 bg-transparent border border-white/10 cursor-pointer"
                  />
                </div>
              </div>
              <button
                onClick={() => fileInputRef.current.click()}
                className="w-full py-3 border border-dashed border-white/20 text-[9px] font-mono uppercase hover:border-white/40 transition-all flex items-center justify-center gap-2"
              >
                <CameraIcon weight="bold" />{' '}
                {bgImage ? 'Replace Media' : 'Upload Texture'}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const f = e.target.files[0];
                  if (f) {
                    const r = new FileReader();
                    r.onload = (ev) => {
                      const img = new Image();
                      img.onload = () => setBgImage(img);
                      img.src = ev.target.result;
                    };
                    r.readAsDataURL(f);
                  }
                }}
                className="hidden"
                accept="image/*"
              />
            </div>

            {/* Assets */}
            <div className={glassCard + ' p-8 space-y-6'}>
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
                <PlusIcon weight="fill" /> Asset_Injection
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => addAsset('barcode')}
                  className="py-2 border border-white/10 text-[8px] font-mono uppercase hover:bg-emerald-500 hover:text-black transition-all"
                >
                  Barcode
                </button>
                <button
                  onClick={() => addAsset('polaroid')}
                  className="py-2 border border-white/10 text-[8px] font-mono uppercase hover:bg-emerald-500 hover:text-black transition-all"
                >
                  Polaroid_Photo
                </button>
                <button
                  onClick={() => addAsset('sticker')}
                  className="py-2 border border-white/10 text-[8px] font-mono uppercase hover:bg-emerald-500 hover:text-black transition-all"
                >
                  Vinyl_Sticker
                </button>
                <button
                  onClick={() => addAsset('frame')}
                  className="py-2 border border-white/10 text-[8px] font-mono uppercase hover:bg-emerald-500 hover:text-black transition-all"
                >
                  Tech_Frame
                </button>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {assets.map((a) => (
                  <div
                    key={a.id}
                    className="p-4 border border-white/5 bg-black/20 space-y-4"
                  >
                    <div className="flex justify-between items-center text-[8px] font-mono text-gray-500 uppercase">
                      <span>
                        {a.type} {'//'} {a.id.toString().slice(-4)}
                      </span>
                      <button
                        onClick={() =>
                          setAssets(assets.filter((it) => it.id !== a.id))
                        }
                        className="text-red-500"
                      >
                        Purge
                      </button>
                    </div>
                    <CustomSlider
                      label="X"
                      min={0}
                      max={100}
                      value={a.x}
                      onChange={(v) =>
                        setAssets(
                          assets.map((it) =>
                            it.id === a.id ? { ...it, x: v } : it,
                          ),
                        )
                      }
                    />
                    <CustomSlider
                      label="Y"
                      min={0}
                      max={100}
                      value={a.y}
                      onChange={(v) =>
                        setAssets(
                          assets.map((it) =>
                            it.id === a.id ? { ...it, y: v } : it,
                          ),
                        )
                      }
                    />
                    <CustomSlider
                      label="Size"
                      min={1}
                      max={100}
                      value={a.width}
                      onChange={(v) =>
                        setAssets(
                          assets.map((it) =>
                            it.id === a.id
                              ? {
                                  ...it,
                                  width: v,
                                  height: a.type === 'barcode' ? v * 0.5 : v,
                                }
                              : it,
                          ),
                        )
                      }
                    />
                    <CustomSlider
                      label="Rotate"
                      min={0}
                      max={360}
                      value={a.rotation}
                      onChange={(v) =>
                        setAssets(
                          assets.map((it) =>
                            it.id === a.id ? { ...it, rotation: v } : it,
                          ),
                        )
                      }
                    />
                    <CustomSlider
                      label="Opacity"
                      min={0}
                      max={1}
                      step={0.01}
                      value={a.opacity}
                      onChange={(v) =>
                        setAssets(
                          assets.map((it) =>
                            it.id === a.id ? { ...it, opacity: v } : it,
                          ),
                        )
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            {Object.entries(inputs).map(([key, config]) => (
              <div key={key} className={glassCard + ' p-8 space-y-6'}>
                <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2 border-b border-white/5 pb-4">
                  <TextTIcon weight="fill" />{' '}
                  {key
                    .replace(/([A-Z])/g, ' $1')
                    .trim()
                    .toUpperCase()}
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    value={config.text}
                    onChange={(e) =>
                      handleInputChange(key, 'text', e.target.value)
                    }
                    className={glassInput}
                  />
                  <CustomSlider
                    label="Size"
                    min={5}
                    max={200}
                    value={config.size}
                    onChange={(v) => handleInputChange(key, 'size', v)}
                  />
                  <CustomDropdown
                    label="Font"
                    options={FONTS}
                    value={config.font}
                    onChange={(v) => handleInputChange(key, 'font', v)}
                    variant="brutalist"
                    fullWidth
                  />
                  <CustomSlider
                    label="X"
                    min={0}
                    max={100}
                    value={config.x}
                    onChange={(v) => handleInputChange(key, 'x', v)}
                  />
                  <CustomSlider
                    label="Y"
                    min={0}
                    max={100}
                    value={config.y}
                    onChange={(v) => handleInputChange(key, 'y', v)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-9">
            <div
              className={`${stickyPreview ? 'lg:sticky lg:top-24 h-fit' : ''} transition-all`}
            >
              <div className="relative group bg-[#0a0a0a] border border-white/10 rounded-sm overflow-hidden flex items-center justify-center shadow-2xl min-h-[800px]">
                <canvas
                  ref={canvasRef}
                  className="w-full max-w-[800px] aspect-square object-contain shadow-[0_0_100px_rgba(0,0,0,0.5)]"
                />
                <div className="absolute top-8 right-8 z-30 flex flex-col items-end gap-2">
                  <button
                    onClick={() => setStickyPreview(!stickyPreview)}
                    className={`px-4 py-2 border text-[10px] font-mono uppercase transition-all ${stickyPreview ? 'bg-red-500 border-red-500 text-black' : 'bg-black/60 border-white/10 text-red-400'}`}
                  >
                    <PushPinIcon weight={stickyPreview ? 'fill' : 'bold'} />{' '}
                    {stickyPreview ? 'Pinned' : 'Pin'}
                  </button>
                  <button
                    onClick={() => setSeed(Math.random())}
                    className="px-4 py-2 bg-black/60 border border-white/10 text-[10px] font-mono uppercase text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all"
                  >
                    <ArrowsClockwiseIcon weight="bold" /> Mutate
                  </button>
                </div>
              </div>
              <div className="mt-12 p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-6">
                <MusicNoteIcon size={32} className="text-gray-700 mt-1" />
                <div className="space-y-4">
                  <p className="text-sm font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                    ALBUM_CONSTRUCTOR: High-fidelity rasterization. 3000px
                    square output calibrated for all streaming platforms.
                  </p>
                  <div className="flex items-center gap-2 text-emerald-500 font-mono text-[10px] uppercase">
                    <IdentificationBadgeIcon weight="bold" /> All metadata is
                    injectable.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex justify-between text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Album_v1.0.0</span>
          <span>SYSTEM_STATUS // SYNTHESIZED</span>
        </footer>
      </div>

      <BrutalistDialog
        isOpen={isSaveDialogOpen}
        onClose={() => setIsSaveDialogOpen(false)}
        onConfirm={() => {
          localStorage.setItem(
            'album_preset',
            JSON.stringify({
              style,
              bgMode,
              primaryColor,
              accentColor,
              inputs,
              assets,
            }),
          );
          setIsSaveDialogOpen(false);
          addToast({ title: 'SAVED', message: 'Album preset committed.' });
        }}
        title="MEMORY_COMMIT"
        message="Overwrite stored album configuration?"
      />
      <BrutalistDialog
        isOpen={isLoadDialogOpen}
        onClose={() => setIsLoadDialogOpen(false)}
        onConfirm={() => {
          const s = localStorage.getItem('album_preset');
          if (s) {
            const p = JSON.parse(s);
            setStyle(p.style);
            setBgMode(p.bgMode);
            setPrimaryColor(p.primaryColor);
            setAccentColor(p.accentColor);
            setInputs(p.inputs);
            setAssets(p.assets);
          }
          setIsLoadDialogOpen(false);
          addToast({ title: 'LOADED', message: 'Album recovery successful.' });
        }}
        title="DATA_RECOVERY"
        message="Restore previously stored album entity?"
      />
    </div>
  );
};

export default AlbumCoverPage;
