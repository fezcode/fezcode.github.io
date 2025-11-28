import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  UploadSimpleIcon,
} from '@phosphor-icons/react';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';
import CustomDropdown from '../../components/CustomDropdown';
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
  useSeo({
    title: 'TCG Card Generator | Fezcodex',
    description:
      'Create your own custom Trading Card Game cards with this generator.',
    keywords: [
      'TCG',
      'card generator',
      'pokemon card',
      'magic card',
      'custom card',
      'maker',
    ],
  });

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
    const logicalHeight = 620;

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
    const height = 620;

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
    'w-full p-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all';
  const labelClass =
    'block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1';
  const sectionClass =
    'bg-gray-900/50 p-6 rounded-xl border border-gray-800 backdrop-blur-sm';

  return (
    <div className="py-12 sm:py-20 min-h-screen bg-gray-950 text-gray-200 font-sans">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link
            to="/apps"
            className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
          >
            <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
            Back to Apps
          </Link>
          <BreadcrumbTitle title="Techno TCG Maker" slug="tcg" />
          <p className="text-gray-500 max-w-xl mx-auto mb-4">
            Design your own futuristic trading cards.
          </p>
          <hr className="border-gray-700" />
        </div>
        <div className="flex flex-col xl:flex-row gap-10 items-start justify-center">
          {/* --- Left Column: Editor --- */}
          <div className="w-full xl:w-5/12 space-y-6">
            {/* Basic Info Section */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                Card Data
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className={labelClass}>Card Name</label>
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>HP</label>
                  <input
                    type="text"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Background Style</label>
                  <CustomDropdown
                    options={backgroundOptions}
                    value={background}
                    onChange={setBackground}
                    label="Select Style"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Artwork Section */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                Artwork
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm text-gray-400">
                    Upload a cyberpunk or futuristic image for best results.
                  </p>
                  {imageDimensions && (
                    <p className="text-xs text-gray-500 mt-1">
                      Dimensions: {imageDimensions.width} x{' '}
                      {imageDimensions.height} px
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={triggerFileInput}
                    className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors text-sm font-medium"
                  >
                    <UploadSimpleIcon size={20} /> Upload Art
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                Stats & Info
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Generation</label>
                  <input
                    type="text"
                    value={generation}
                    onChange={(e) => setGeneration(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Type</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Attack</label>
                    <input
                      type="text"
                      value={attack}
                      onChange={(e) => setAttack(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Defense</label>
                    <input
                      type="text"
                      value={defense}
                      onChange={(e) => setDefense(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Cost</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className={inputBaseClass}
                  />
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className={sectionClass}>
              <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-700 pb-2">
                Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`${inputBaseClass} h-24 resize-none`}
                  ></textarea>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-1">
                    <label className={labelClass}>Card #</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>Total</label>
                    <input
                      type="text"
                      value={totalCards}
                      onChange={(e) => setTotalCards(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={labelClass}>Illustrator</label>
                    <input
                      type="text"
                      value={illustrator}
                      onChange={(e) => setIllustrator(e.target.value)}
                      className={inputBaseClass}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- Right Column: Preview --- */}
          <div className="w-full xl:w-auto flex flex-col items-center sticky top-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-pink-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <canvas
                ref={canvasRef}
                className="relative rounded-xl shadow-2xl max-w-full h-auto bg-black"
                style={{ width: '420px', height: '620px' }}
              />
            </div>

            <div className="mt-8 flex gap-4 w-full max-w-[420px]">
              <button
                onClick={downloadCard}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-md text-lg font-arvo transition-colors border bg-app/15 text-app border-app-alpha-50 hover:bg-app/20 "
              >
                <DownloadSimpleIcon size={24} weight="bold" /> Download HD
              </button>
            </div>
            <p className="mt-4 text-xs text-gray-500">
              High-resolution (3x) PNG output.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TcgCardGeneratorPage;
