import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
  FadersIcon,
  ImageIcon,
  ChartBarIcon,
  ArticleIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import CustomDropdown from '../../components/CustomDropdown';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const backgroundOptions = [
  {
    value: 'Techno 1',
    label: 'Cyberpunk (Pink/Blue)',
    colors: ['#ff00cc', '#333399'],
  },
  {
    value: 'Techno 2',
    label: 'Matrix (Green/Black)',
    colors: ['#00ff00', '#000000'],
  },
  {
    value: 'Techno 3',
    label: 'Synthwave (Purple/Orange)',
    colors: ['#833ab4', '#fd1d1d', '#fcb045'],
  },
  {
    value: 'Techno 4',
    label: 'Industrial (Grey/Cyan)',
    colors: ['#2c3e50', '#4ca1af'],
  },
  {
    value: 'Techno 5',
    label: 'Void (Dark Blue/Black)',
    colors: ['#000046', '#1cb5e0'],
  },
  {
    value: 'Techno 6',
    label: 'Neon Hazard (Green/Dark)',
    colors: ['#39ff14', '#222222'],
  },
  {
    value: 'Techno 7',
    label: 'Code Red (Red/Black)',
    colors: ['#8b0000', '#000000'],
  },
  {
    value: 'Techno 8',
    label: 'Electric Blue (Blue/Deep Blue)',
    colors: ['#0066ff', '#000033'],
  },
  {
    value: 'Techno 9',
    label: 'Digital Gold (Gold/Black)',
    colors: ['#ffd700', '#1a1a1a'],
  },
  {
    value: 'Techno 10',
    label: 'Dark Matter (Purple/Black)',
    colors: ['#240046', '#000000'],
  },
  {
    value: 'Techno 11',
    label: 'Lights (Light Blue/Lilac Ash)',
    colors: ['#96C3CE', '#A79AB2'],
  },
  {
    value: 'Techno 12',
    label: 'Holographic Rust (Oxidized Steel/Digital Amber)',
    colors: ['#2C3E50', '#F39C12'],
  },
  {
    value: 'Techno 13',
    label: 'Void Whisper (Abyssal Indigo/Ethereal Lavender)',
    colors: ['#0A031F', '#C6A5D6'],
  },
  {
    value: 'Techno 14',
    label: 'Bio-Hazard (Dark Green/Neon Green)',
    colors: ['#1a2a1a', '#39ff14'],
  },
  {
    value: 'Techno 15',
    label: 'Plasma (Dark Red/Orange/Yellow)',
    colors: ['#800000', '#ff4500', '#ffff00'],
  },
  {
    value: 'Techno 16',
    label: 'Frozen Mainframe (Dark Blue/Ice Blue)',
    colors: ['#0f2027', '#203a43', '#2c5364'],
  },
  {
    value: 'Techno 17',
    label: 'Retrowave Grid (Blue/Pink)',
    colors: ['#3f5efb', '#fc466b'],
  },
  {
    value: 'Techno 18',
    label: 'Obsidian Glass (Black/Grey)',
    colors: ['#000000', '#434343'],
  },
  { value: 'Techno 19', label: 'Black', colors: ['#000000', '#000000'] },
  {
    value: 'Techno 20',
    label: 'Cyber Spectrum (6-Color)',
    colors: ['#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff'],
  },
];

const TcgCardGeneratorPage = () => {
  const { addToast } = useToast();

  // --- State ---
  const [cardName, setCardName] = useState('Cyber Dragon');
  const [hp, setHp] = useState('250');
  const [background, setBackground] = useState('Techno 1');
  const [image, setImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState(null); // Stores { width, height }
  const [loadedImgElement, setLoadedImgElement] = useState(null); // Stores the actual Image object

  const [generation, setGeneration] = useState('Gen 5 - Neo Tokyo');
  const [type, setType] = useState('Machine / Dragon');
  const [attack, setAttack] = useState('Photon Blast');
  const [defense, setDefense] = useState('Titanium Plating');
  const [cost, setCost] = useState('500 Credits');
  const [description, setDescription] = useState(
    'A mechanical dragon forged in the neon fires of the cybernetic underworld. It patrols the data streams, incinerating viruses with concentrated light.',
  );

  const [illustrator, setIllustrator] = useState('Fezcodex');

  // Derived state for card count/date (bottom right)
  const [cardNumber, setCardNumber] = useState('001');
  const [totalCards, setTotalCards] = useState('100');

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Preload image object when image string changes
  useEffect(() => {
    if (image) {
      const img = new Image();
      img.src = image;
      img.onload = () => setLoadedImgElement(img);
    } else {
      setLoadedImgElement(null);
    }
  }, [image]);

  // --- Canvas Drawing Helper Functions ---
  const drawRoundedRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let currentY = y;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, currentY);
        line = words[n] + ' ';
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  };

  // --- Main Draw Logic (Memoized) ---
  const drawCard = useCallback(
    (ctx, logicalWidth, logicalHeight) => {
      // --- Background ---
      const selectedBg =
        backgroundOptions.find((b) => b.value === background) ||
        backgroundOptions[0];

      // Create gradient
      const gradient = ctx.createLinearGradient(
        0,
        0,
        logicalWidth,
        logicalHeight,
      );
      selectedBg.colors.forEach((color, index) => {
        gradient.addColorStop(index / (selectedBg.colors.length - 1), color);
      });

      ctx.fillStyle = gradient;
      // Main Card Body
      drawRoundedRect(ctx, 0, 0, logicalWidth, logicalHeight, 15);
      ctx.fill();

      // Techno Grid Overlay (Optional effect)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < logicalWidth; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, logicalHeight);
        ctx.stroke();
      }
      for (let y = 0; y < logicalHeight; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(logicalWidth, y);
        ctx.stroke();
      }

      // Border Pattern (Techno)
      ctx.lineWidth = 8;
      ctx.strokeStyle = 'rgba(0,0,0,0.6)';
      drawRoundedRect(ctx, 4, 4, logicalWidth - 8, logicalHeight - 8, 12);
      ctx.stroke();

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      drawRoundedRect(ctx, 10, 10, logicalWidth - 20, logicalHeight - 20, 10);
      ctx.stroke();

      // --- Header Bar (Top) ---
      const headerHeight = 50;
      const headerY = 20;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      // Left side (Name)
      ctx.beginPath();
      ctx.moveTo(20, headerY);
      ctx.lineTo(logicalWidth - 140, headerY);
      ctx.lineTo(logicalWidth - 120, headerY + headerHeight);
      ctx.lineTo(20, headerY + headerHeight);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Right side (HP)
      ctx.beginPath();
      ctx.moveTo(logicalWidth - 110, headerY);
      ctx.lineTo(logicalWidth - 20, headerY);
      ctx.lineTo(logicalWidth - 20, headerY + headerHeight);
      ctx.lineTo(logicalWidth - 130, headerY + headerHeight);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ff0055';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text: Name
      ctx.fillStyle = '#00ffff';
      ctx.font = 'bold 22px "Arvo", serif';
      ctx.textAlign = 'left';
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 8;
      ctx.fillText(cardName.toUpperCase(), 35, headerY + 32);
      ctx.shadowBlur = 0;

      // Text: HP
      ctx.fillStyle = '#ff0055';
      ctx.font = 'bold 20px "Arvo", serif';
      ctx.textAlign = 'right';
      ctx.shadowColor = '#ff0055';
      ctx.shadowBlur = 8;
      ctx.fillText(`HP ${hp}`, logicalWidth - 35, headerY + 32);
      ctx.shadowBlur = 0;

      // --- Image Area ---
      const imgX = 25;
      const imgY = headerY + headerHeight + 15;
      const imgW = logicalWidth - 50;
      const imgH = 200;

      // Image Frame
      ctx.fillStyle = '#000';
      ctx.fillRect(imgX - 2, imgY - 2, imgW + 4, imgH + 4);

      // Draw Image
      if (loadedImgElement) {
        // Object-fit: cover logic
        const srcRatio = loadedImgElement.width / loadedImgElement.height;
        const destRatio = imgW / imgH;
        let sx, sy, sWidth, sHeight;

        if (srcRatio > destRatio) {
          sHeight = loadedImgElement.height;
          sWidth = loadedImgElement.height * destRatio;
          sx = (loadedImgElement.width - sWidth) / 2;
          sy = 0;
        } else {
          sWidth = loadedImgElement.width;
          sHeight = loadedImgElement.width / destRatio;
          sx = 0;
          sy = (loadedImgElement.height - sHeight) / 2;
        }
        ctx.drawImage(
          loadedImgElement,
          sx,
          sy,
          sWidth,
          sHeight,
          imgX,
          imgY,
          imgW,
          imgH,
        );
      } else {
        ctx.fillStyle = '#222';
        ctx.fillRect(imgX, imgY, imgW, imgH);
        ctx.fillStyle = '#555';
        ctx.font = '16px "Arvo", serif';
        ctx.textAlign = 'center';
        ctx.fillText('UPLOAD IMAGE', logicalWidth / 2, imgY + imgH / 2);
      }

      // Techno corners on image
      ctx.strokeStyle = '#00ffff';
      ctx.lineWidth = 2;
      const cornerSize = 15;
      // Top Left
      ctx.beginPath();
      ctx.moveTo(imgX, imgY + cornerSize);
      ctx.lineTo(imgX, imgY);
      ctx.lineTo(imgX + cornerSize, imgY);
      ctx.stroke();
      // Top Right
      ctx.beginPath();
      ctx.moveTo(imgX + imgW - cornerSize, imgY);
      ctx.lineTo(imgX + imgW, imgY);
      ctx.lineTo(imgX + imgW, imgY + cornerSize);
      ctx.stroke();
      // Bottom Left
      ctx.beginPath();
      ctx.moveTo(imgX, imgY + imgH - cornerSize);
      ctx.lineTo(imgX, imgY + imgH);
      ctx.lineTo(imgX + cornerSize, imgY + imgH);
      ctx.stroke();
      // Bottom Right
      ctx.beginPath();
      ctx.moveTo(imgX + imgW - cornerSize, imgY + imgH);
      ctx.lineTo(imgX + imgW, imgY + imgH);
      ctx.lineTo(imgX + imgW, imgY + imgH - cornerSize);
      ctx.stroke();

      // --- Content Fields ---
      let currentY = imgY + imgH + 20;
      const labelWidth = 100;
      // const valueX = 40 + labelWidth;

      const drawField = (label, value, color = '#fff') => {
        // Label Box
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(25, currentY, labelWidth, 25);
        ctx.strokeStyle = color;
        ctx.strokeRect(25, currentY, labelWidth, 25);

        ctx.fillStyle = color;
        ctx.font = 'bold 12px "Arvo", serif';
        ctx.textAlign = 'center';
        ctx.fillText(label, 25 + labelWidth / 2, currentY + 17);

        // Value Box
        ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        ctx.fillRect(
          25 + labelWidth + 5,
          currentY,
          logicalWidth - 55 - labelWidth,
          25,
        );

        ctx.font = 'bold 14px "Arvo", serif';
        ctx.textAlign = 'left';

        // Contour
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 3;
        ctx.strokeText(value, 25 + labelWidth + 15, currentY + 17);

        // Fill
        ctx.fillStyle = color;
        ctx.fillText(value, 25 + labelWidth + 15, currentY + 17);
        currentY += 35;
      };

      // Generation
      drawField('GENERATION', generation, '#00ff00');

      // Type
      drawField('TYPE', type, '#ffff00');

      // Attack
      drawField('ATTACK', attack, '#ff0055');

      // Defense
      drawField('DEFENSE', defense, '#00aaff');

      // Cost
      drawField('COST', cost, '#ff9900');

      // Description Field
      currentY += 5;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(25, currentY, logicalWidth - 50, 80);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(25, currentY, logicalWidth - 50, 80);

      ctx.fillStyle = '#ccc';
      ctx.font = '12px "Arvo", serif';
      ctx.textAlign = 'left';
      wrapText(ctx, description, 35, currentY + 20, logicalWidth - 70, 16);
      // --- Footer ---
      const footerY = logicalHeight - 20;

      // Illustrator (Bottom Left)
      ctx.fillStyle = '#fff';
      ctx.font = '10px "Arvo", serif';
      ctx.textAlign = 'left';
      ctx.fillText(`ILLUS: ${illustrator.toUpperCase()}`, 25, footerY);

      // Card Info (Bottom Right)
      const date = new Date().toLocaleDateString();
      ctx.textAlign = 'right';
      ctx.fillText(
        `${date} | FEZCODEX | ${cardNumber}/${totalCards}`,
        logicalWidth - 25,
        footerY,
      );
    },
    [
      cardName,
      hp,
      background,
      loadedImgElement,
      generation,
      type,
      attack,
      defense,
      cost,
      description,
      illustrator,
      cardNumber,
      totalCards,
    ],
  );

  // --- useEffect to update canvas ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const logicalWidth = 420;
    const logicalHeight = 750;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = `${logicalWidth}px`;
    canvas.style.height = `${logicalHeight}px`;

    ctx.save();
    ctx.scale(dpr, dpr);
    drawCard(ctx, logicalWidth, logicalHeight);
    ctx.restore();
  }, [drawCard]); // Depend only on drawCard which already depends on all state

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          setImageDimensions({ width: img.width, height: img.height });
          setImage(event.target.result);
        };
        img.src = event.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const downloadCard = () => {
    addToast({
      title: 'Downloading...',
      message: 'Generating high-resolution card.',
      duration: 3000,
    });
    // High Resolution Download
    const scaleFactor = 3; // 3x resolution (1260x1860)
    const width = 420;
    const height = 750;

    const canvas = document.createElement('canvas');
    canvas.width = width * scaleFactor;
    canvas.height = height * scaleFactor;
    const ctx = canvas.getContext('2d');

    ctx.scale(scaleFactor, scaleFactor);
    drawCard(ctx, width, height);

    const link = document.createElement('a');
    link.download = `${cardName.replace(/\s+/g, '_')}_card_HD.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  // Styles helper
  const inputBaseClass =
    'w-full p-2 bg-black/40 border border-white/5 font-mono text-sm text-gray-300 focus:border-emerald-500 focus:outline-none transition-all rounded-sm placeholder-gray-700';
  const labelClass =
    'block text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-1';

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans pb-32 relative z-10">
      <Seo
        title="TCG Card Generator | Fezcodex"
        description="Create your own custom Trading Card Game cards with this generator."
        keywords={['TCG', 'card generator', 'pokemon card', 'magic card', 'custom card', 'maker']}
      />
      <div className="mx-auto max-w-[1600px] px-6 py-24 md:px-12">
        {/* Header */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="flex-1">
              <BreadcrumbTitle
                title="TCG Maker"
                slug="tcg"
                variant="brutalist"
              />
              <p className="text-gray-400 font-mono text-sm max-w-md uppercase tracking-widest leading-relaxed mt-4">
                Fabricate futuristic trading cards. Customize attributes, imagery, and structural data.
              </p>
            </div>

            <button
                onClick={downloadCard}
                className="group flex items-center gap-3 px-6 py-3 bg-white text-black font-bold uppercase tracking-widest hover:bg-emerald-500 transition-colors"
              >
                <DownloadSimpleIcon size={20} weight="bold" />
                <span>Initialize Download</span>
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* --- Left Column: Editor --- */}
          <div className="xl:col-span-4 space-y-6">
            {/* Basic Info Section */}
            <Module title="Core_Data" icon={FadersIcon} seed="CORE_DATA">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Designation (Name)</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Integrity (HP)</label>
                  <input
                    type="text"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Visual_Matrix</label>
                  <CustomDropdown
                    options={backgroundOptions}
                    value={background}
                    onChange={setBackground}
                    label="Select Style"
                    className="w-full"
                    variant="brutalist"
                  />
                </div>
              </div>
            </Module>

            {/* Artwork Section */}
            <Module title="Visual_Asset" icon={ImageIcon} seed="VISUAL_ASSET">
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between border border-white/10 p-4 bg-black/40 rounded-sm">
                  <div className="flex-1">
                     <div className="text-[10px] font-mono uppercase tracking-widest text-gray-500 mb-1">Status</div>
                     <div className="text-xs font-mono text-emerald-500">
                        {image ? 'Asset_Loaded' : 'Awaiting_Upload'}
                     </div>
                      {imageDimensions && (
                    <div className="text-[10px] font-mono text-gray-600 mt-1">
                      {imageDimensions.width}x{imageDimensions.height}px
                    </div>
                  )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-emerald-500 hover:text-emerald-500 transition-colors text-[10px] font-bold uppercase tracking-widest"
                  >
                    <UploadSimpleIcon size={16} /> Upload
                  </button>
                </div>
                 <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    * Recommended: High-contrast cyberpunk imagery.
                  </p>
              </div>
            </Module>
          </div>

          {/* Middle Column: Stats & Details */}
          <div className="xl:col-span-4 space-y-6">
            {/* Stats Section */}
            <Module title="Performance_Metrics" icon={ChartBarIcon} seed="STATS">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Generation_Cycle</label>
                  <input
                    type="text"
                    value={generation}
                    onChange={(e) => setGeneration(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Classification</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Offense_Value</label>
                    <input
                      type="text"
                      value={attack}
                      onChange={(e) => setAttack(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Defense_Value</label>
                    <input
                      type="text"
                      value={defense}
                      onChange={(e) => setDefense(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Resource_Cost</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </Module>

            {/* Description Section */}
            <Module title="Metadata" icon={ArticleIcon} seed="METADATA">
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Narrative_Log</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputBaseClass} h-24 resize-none`}
                  ></textarea>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className={labelClass}>Index_ID</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>Total_Set</label>
                    <input
                      type="text"
                      value={totalCards}
                      onChange={(e) => setTotalCards(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>Architect</label>
                    <input
                      type="text"
                      value={illustrator}
                      onChange={(e) => setIllustrator(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                </div>
              </div>
            </Module>
          </div>

          {/* --- Right Column: Preview --- */}
          <div className="xl:col-span-4 flex flex-col items-center">
             <div className="sticky top-10 w-full flex flex-col items-center">
                <div className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-4 w-full text-center">Output_Preview</div>
                <div className="relative group p-1 border border-white/10 bg-black">
                  <div className="absolute -inset-2 bg-gradient-to-b from-emerald-500/20 to-transparent blur-xl opacity-20 group-hover:opacity-40 transition duration-500"></div>
                  <canvas
                    ref={canvasRef}
                    className="relative max-w-full h-auto bg-black border border-white/5"
                    style={{ width: '420px', height: '750px' }}
                  />
                </div>

                 <div className="mt-6 w-full max-w-[420px] text-center">
                    <p className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                        Resolution: 1260x2250 (HD)
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Module = ({ title, icon: Icon, children, seed }) => (
    <div className="relative border border-white/10 bg-white/[0.02] p-6 rounded-sm group overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <GenerativeArt seed={seed} className="w-full h-full" />
      </div>
      <div className="absolute top-0 left-0 w-1 h-0 group-hover:h-full bg-emerald-500 transition-all duration-500" />

      <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-6 flex items-center gap-2">
        <Icon weight="fill" className="text-emerald-500" />
        {title}
      </h3>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );

export default TcgCardGeneratorPage;
