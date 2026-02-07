import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ShuffleIcon,
  PaletteIcon,
  ArrowsClockwiseIcon,
  FrameCornersIcon,
  ImageSquareIcon,
  ShapesIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import CustomSlider from '../../components/CustomSlider';
import CustomDropdown from '../../components/CustomDropdown';
import CustomColorPicker from '../../components/CustomColorPicker';

// Predefined palettes
const PREDEFINED_PALETTES = [
  ['#264653', '#2a9d8f', '#e9c46a', '#f4a261', '#e76f51'], // Terra
  ['#cdb4db', '#ffc8dd', '#ffafcc', '#bde0fe', '#a2d2ff'], // Pastel Dream
  ['#003049', '#d62828', '#f77f00', '#fcbf49', '#eae2b7'], // Fire & Ice
  ['#606c38', '#283618', '#fefae0', '#dda15e', '#bc6c25'], // Earth Tones
  ['#2b2d42', '#8d99ae', '#edf2f4', '#ef233c', '#d90429'], // Americana
  ['#000000', '#14213d', '#fca311', '#e5e5e5', '#ffffff'], // Industrial
  ['#5f0f40', '#9a031e', '#fb8b24', '#e36414', '#0f4c5c'], // Deep
];

const SHAPES = [
  'square',
  'circle',
  'triangle-tl',
  'triangle-tr',
  'triangle-bl',
  'triangle-br',
  'quarter-tl',
  'quarter-tr',
  'quarter-bl',
  'quarter-br',
  'half-t',
  'half-b',
  'half-l',
  'half-r',
];

const PATTERN_TYPES = [
  { value: 'bauhaus', label: 'Bauhaus Shapes' },
  { value: 'mosaic', label: 'Mosaic Triangles' },
  { value: 'rings', label: 'Concentric Rings' },
  { value: 'stripes', label: 'Directions' },
  { value: 'pyramids', label: 'Pyramids' },
  { value: 'cubist', label: 'Cubist Blocks' },
];

const RESOLUTIONS = {
  square: { w: 3840, h: 3840, label: 'Square (1:1)' },
  landscape: { w: 3840, h: 2160, label: 'Landscape (16:9)' },
  portrait: { w: 2160, h: 3840, label: 'Portrait (9:16)' },
};

const ASPECT_OPTIONS = [
  { value: 'square', label: 'Square (1:1)' },
  { value: 'landscape', label: 'Landscape (16:9)' },
  { value: 'portrait', label: 'Portrait (9:16)' },
];

const PatternGeneratorPage = () => {
  const { addToast } = useToast();
  const svgRef = useRef(null);

  // State
  const [palette, setPalette] = useState(PREDEFINED_PALETTES[0]);
  const [aspectRatio, setAspectRatio] = useState('square');
  const [patternType, setPatternType] = useState('bauhaus');
  const [density, setDensity] = useState(10);
  const [patternData, setPatternData] = useState([]);
  const [seed, setSeed] = useState(0);

  // Derived dimensions
  const targetRes = RESOLUTIONS[aspectRatio];
  const gridCols = density;
  const cellSize = targetRes.w / gridCols;
  const gridRows = Math.ceil(targetRes.h / cellSize);

  // Generate a random pattern grid based on type
  const generatePattern = useCallback(() => {
    const newPattern = [];

    // Helper to get random distinct indices
    const getIndices = (count = 2) => {
      const indices = [];
      while (indices.length < count) {
        const idx = Math.floor(Math.random() * 5);
        if (!indices.includes(idx)) indices.push(idx);
      }
      return indices;
    };

    for (let row = 0; row < gridRows; row++) {
      const rowData = [];
      for (let col = 0; col < gridCols; col++) {
        let cellData = {};

        if (patternType === 'bauhaus') {
          const [bgIndex, fgIndex] = getIndices(2);
          const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
          cellData = { bgIndex, fgIndex, shape };
        } else if (patternType === 'mosaic') {
          const [c1, c2] = getIndices(2);
          // 0: top-left to bottom-right split (\)
          // 1: bottom-left to top-right split (/)
          const type = Math.random() > 0.5 ? 'backslash' : 'slash';
          cellData = { c1, c2, type };
        } else if (patternType === 'rings') {
          const count = Math.floor(Math.random() * 3) + 2; // 2 to 4 rings
          const indices = getIndices(count);
          cellData = { indices };
        } else if (patternType === 'stripes') {
          const [c1, c2] = getIndices(2);
          const direction = Math.floor(Math.random() * 4); // 0: horz, 1: vert, 2: diag1, 3: diag2
          cellData = { c1, c2, direction };
        } else if (patternType === 'pyramids') {
          const indices = getIndices(4);
          cellData = { indices };
        } else if (patternType === 'cubist') {
          const indices = getIndices(4); // Back, Side1, Side2, Front
          const scale = 0.3 + Math.random() * 0.5; // 0.3 to 0.8
          // Random shift -0.5 to 0.5 relative to available space
          const shiftX = (Math.random() - 0.5) * 0.8;
          const shiftY = (Math.random() - 0.5) * 0.8;
          cellData = { indices, scale, shiftX, shiftY };
        }

        rowData.push(cellData);
      }
      newPattern.push(rowData);
    }
    setPatternData(newPattern);
  }, [gridCols, gridRows, patternType]);

  // Initial Generation
  useEffect(() => {
    generatePattern();
  }, [generatePattern, seed]);

  const randomizePalette = () => {
    const randomPalette =
      PREDEFINED_PALETTES[
        Math.floor(Math.random() * PREDEFINED_PALETTES.length)
      ];
    setPalette(randomPalette);
  };

  const updateColor = (index, newColor) => {
    const newPalette = [...palette];
    newPalette[index] = newColor;
    setPalette(newPalette);
  };

  const regenerate = () => {
    setSeed(Math.random());
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pattern-${patternType}-${aspectRatio}-${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast({
      title: 'Downloaded',
      message: 'High-res SVG saved to your device.',
      duration: 3000,
    });
  };

  const handleDownloadPng = (width, height, label = '4K') => {
    const svg = svgRef.current;
    if (!svg) return;

    // Default to targetRes if dimensions not provided
    const w = width || targetRes.w;
    const h = height || targetRes.h;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = w;
    canvas.height = h;

    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `pattern-${patternType}-${aspectRatio}-${label}-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);

      addToast({
        title: 'Downloaded',
        message: `${label} PNG saved to your device.`,
        duration: 3000,
      });
    };
    img.src = url;
  };

  const handleDownloadPng1080p = () => {
    // 1080p is half of 4K (3840x2160 -> 1920x1080)
    handleDownloadPng(targetRes.w / 2, targetRes.h / 2, '1080p');
  };

  // --- Renderers ---

  const renderBauhaus = (cell, x, y, size) => {
    const { bgIndex, fgIndex, shape } = cell;
    if (bgIndex === undefined || fgIndex === undefined || !shape) return null;
    const bg = palette[bgIndex] || '#000';
    const fg = palette[fgIndex] || '#fff';

    const bgRect = <rect x={x} y={y} width={size} height={size} fill={bg} />;

    let fgShape = null;
    const cx = x + size / 2;
    const cy = y + size / 2;
    const r = size / 2;

    switch (shape) {
      case 'square':
        fgShape = <rect x={x} y={y} width={size} height={size} fill={fg} />;
        break;
      case 'circle':
        fgShape = <circle cx={cx} cy={cy} r={r} fill={fg} />;
        break;
      case 'triangle-tl':
        fgShape = (
          <path
            d={`M${x},${y} L${x + size},${y} L${x},${y + size} Z`}
            fill={fg}
          />
        );
        break;
      case 'triangle-tr':
        fgShape = (
          <path
            d={`M${x},${y} L${x + size},${y} L${x + size},${y + size} Z`}
            fill={fg}
          />
        );
        break;
      case 'triangle-bl':
        fgShape = (
          <path
            d={`M${x},${y} L${x},${y + size} L${x + size},${y + size} Z`}
            fill={fg}
          />
        );
        break;
      case 'triangle-br':
        fgShape = (
          <path
            d={`M${x + size},${y} L${x + size},${y + size} L${x},${y + size} Z`}
            fill={fg}
          />
        );
        break;
      case 'quarter-tl':
        fgShape = (
          <path
            d={`M${x},${y} v${size} A${size},${size} 0 0,1 ${x + size},${y} Z`}
            fill={fg}
          />
        );
        break;
      case 'quarter-tr':
        fgShape = (
          <path
            d={`M${x + size},${y} v${size} A${size},${size} 0 0,0 ${x},${y} Z`}
            fill={fg}
          />
        );
        break;
      case 'quarter-bl':
        fgShape = (
          <path
            d={`M${x},${y + size} h${size} A${size},${size} 0 0,0 ${x},${y} Z`}
            fill={fg}
          />
        );
        break;
      case 'quarter-br':
        fgShape = (
          <path
            d={`M${x + size},${y + size} h-${size} A${size},${size} 0 0,1 ${x + size},${y} Z`}
            fill={fg}
          />
        );
        break;
      case 'half-t':
        fgShape = <rect x={x} y={y} width={size} height={size / 2} fill={fg} />;
        break;
      case 'half-b':
        fgShape = (
          <rect
            x={x}
            y={y + size / 2}
            width={size}
            height={size / 2}
            fill={fg}
          />
        );
        break;
      case 'half-l':
        fgShape = <rect x={x} y={y} width={size / 2} height={size} fill={fg} />;
        break;
      case 'half-r':
        fgShape = (
          <rect
            x={x + size / 2}
            y={y}
            width={size / 2}
            height={size}
            fill={fg}
          />
        );
        break;
      default:
        break;
    }

    return (
      <g key={`${x}-${y}`}>
        {bgRect}
        {fgShape}
      </g>
    );
  };

  const renderMosaic = (cell, x, y, size) => {
    const { c1, c2, type } = cell;
    if (c1 === undefined || c2 === undefined) return null;
    const color1 = palette[c1] || '#000';
    const color2 = palette[c2] || '#fff';

    // To avoid seams, we draw a full rect of C1, then a triangle of C2
    const bgRect = (
      <rect x={x} y={y} width={size} height={size} fill={color1} />
    );

    let tri = null;
    if (type === 'backslash') {
      // \ split. Top-Left is C1 (bg). Bottom-Right is C2.
      // Triangle vertices for Bottom-Right: (x, y+size), (x+size, y+size), (x+size, y)
      tri = (
        <path
          d={`M${x},${y + size} L${x + size},${y + size} L${x + size},${y} Z`}
          fill={color2}
        />
      );
    } else {
      // / split. Bottom-Left is C1 (bg). Top-Right is C2.
      // Triangle vertices for Top-Right: (x, y), (x+size, y), (x+size, y+size)
      tri = (
        <path
          d={`M${x},${y} L${x + size},${y} L${x + size},${y + size} Z`}
          fill={color2}
        />
      );
    }

    return (
      <g key={`${x}-${y}`}>
        {bgRect}
        {tri}
      </g>
    );
  };

  const renderRings = (cell, x, y, size) => {
    const { indices } = cell;
    if (!indices || !indices.length) return null;
    // Draw from largest to smallest
    const cx = x + size / 2;
    const cy = y + size / 2;

    // Base square
    const base = (
      <rect x={x} y={y} width={size} height={size} fill={palette[indices[0]]} />
    );

    // Rings
    const rings = indices.slice(1).map((idx, i) => {
      // total remaining = indices.length - 1
      // scale goes from 1.0 down to 0
      // If we have 3 colors: Base, Mid, Center.
      // Base is rect.
      // Mid is Circle R = size/2 * (2/3) ?
      // Center is Circle R = size/2 * (1/3) ?
      // Let's do simple proportional
      const fraction = (indices.length - 1 - i) / indices.length;
      const r = (size / 2) * fraction;
      return <circle key={i} cx={cx} cy={cy} r={r} fill={palette[idx]} />;
    });

    return (
      <g key={`${x}-${y}`}>
        {base}
        {rings}
      </g>
    );
  };

  const renderStripes = (cell, x, y, size) => {
    const { c1, c2, direction } = cell;
    if (c1 === undefined || c2 === undefined) return null;
    const color1 = palette[c1];
    const color2 = palette[c2];

    const bg = <rect x={x} y={y} width={size} height={size} fill={color1} />;

    let stripe = null;
    const half = size / 2;

    switch (direction) {
      case 0: // Horizontal
        stripe = (
          <rect
            x={x}
            y={y + size / 4}
            width={size}
            height={size / 2}
            fill={color2}
          />
        );
        break;
      case 1: // Vertical
        stripe = (
          <rect
            x={x + size / 4}
            y={y}
            width={size / 2}
            height={size}
            fill={color2}
          />
        );
        break;
      case 2: // Diag 1
        stripe = (
          <path
            d={`M${x},${y} L${x + half},${y} L${x + size},${y + half} L${x + size},${y + size} L${x + half},${y + size} L${x},${y + half} Z`}
            fill={color2}
          />
        );
        // Actually a centered stripe is complex polygon.
        // Simpler: Just half split?
        // Let's make it a thick line
        stripe = (
          <line
            x1={x}
            y1={y}
            x2={x + size}
            y2={y + size}
            stroke={color2}
            strokeWidth={size / 3}
            strokeLinecap="square"
          />
        );
        break;
      case 3: // Diag 2
        stripe = (
          <line
            x1={x + size}
            y1={y}
            x2={x}
            y2={y + size}
            stroke={color2}
            strokeWidth={size / 3}
            strokeLinecap="square"
          />
        );
        break;
      default:
        break;
    }

    return (
      <g key={`${x}-${y}`}>
        {bg}
        {stripe}
      </g>
    );
  };

  const renderPyramids = (cell, x, y, size) => {
    const { indices } = cell;
    if (!indices || indices.length < 4) return null;

    const cx = x + size / 2;
    const cy = y + size / 2;
    const c1 = palette[indices[0]];
    const c2 = palette[indices[1]];
    const c3 = palette[indices[2]];
    const c4 = palette[indices[3]];

    return (
      <g key={`${x}-${y}`}>
        <path d={`M${x},${y} L${x + size},${y} L${cx},${cy} Z`} fill={c1} />{' '}
        {/* Top */}
        <path
          d={`M${x + size},${y} L${x + size},${y + size} L${cx},${cy} Z`}
          fill={c2}
        />{' '}
        {/* Right */}
        <path
          d={`M${x + size},${y + size} L${x},${y + size} L${cx},${cy} Z`}
          fill={c3}
        />{' '}
        {/* Bottom */}
        <path
          d={`M${x},${y + size} L${x},${y} L${cx},${cy} Z`}
          fill={c4}
        />{' '}
        {/* Left */}
      </g>
    );
  };

  const renderCubist = (cell, x, y, size) => {
    const { indices, scale, shiftX, shiftY } = cell;
    if (!indices || indices.length < 4) return null;

    const cBack = palette[indices[0]];
    const cSide1 = palette[indices[1]]; // Top/Bottom
    const cSide2 = palette[indices[2]]; // Left/Right
    const cFront = palette[indices[3]];

    const innerSize = size * scale;
    const space = size - innerSize;
    // Calculate inner rect position
    const fx = x + space * (0.5 + shiftX / 2); // Shift logic adjusted to keep inside
    const fy = y + space * (0.5 + shiftY / 2);

    return (
      <g key={`${x}-${y}`}>
        {/* Back Face (covers whole cell) */}
        <rect x={x} y={y} width={size} height={size} fill={cBack} />

        {/* Connecting Sides */}
        {/* Top */}
        <path
          d={`M${x},${y} L${x + size},${y} L${fx + innerSize},${fy} L${fx},${fy} Z`}
          fill={cSide1}
        />
        {/* Bottom */}
        <path
          d={`M${x},${y + size} L${x + size},${y + size} L${fx + innerSize},${fy + innerSize} L${fx},${fy + innerSize} Z`}
          fill={cSide1}
        />
        {/* Left */}
        <path
          d={`M${x},${y} L${x},${y + size} L${fx},${fy + innerSize} L${fx},${fy} Z`}
          fill={cSide2}
        />
        {/* Right */}
        <path
          d={`M${x + size},${y} L${x + size},${y + size} L${fx + innerSize},${fy + innerSize} L${fx + innerSize},${fy} Z`}
          fill={cSide2}
        />

        {/* Front Face */}
        <rect
          x={fx}
          y={fy}
          width={innerSize}
          height={innerSize}
          fill={cFront}
        />
      </g>
    );
  };

  const renderCellDispatch = (cell, rIndex, cIndex) => {
    const x = cIndex * cellSize;
    const y = rIndex * cellSize;

    switch (patternType) {
      case 'bauhaus':
        return renderBauhaus(cell, x, y, cellSize);
      case 'mosaic':
        return renderMosaic(cell, x, y, cellSize);
      case 'rings':
        return renderRings(cell, x, y, cellSize);
      case 'stripes':
        return renderStripes(cell, x, y, cellSize);
      case 'pyramids':
        return renderPyramids(cell, x, y, cellSize);
      case 'cubist':
        return renderCubist(cell, x, y, cellSize);
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-gray-100 font-sans flex flex-col">
      <Seo
        title="Pattern Generator | Fezcodex"
        description="Generate seamless geometric vector patterns in 4K resolution."
        keywords={[
          'pattern',
          'generator',
          'svg',
          'geometric',
          'design',
          '4k',
          'wallpaper',
        ]}
      />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <Link
            to="/apps"
            className="group text-emerald-400 hover:text-emerald-300 flex items-center gap-2 text-sm font-mono uppercase tracking-widest mb-4 transition-colors"
          >
            <ArrowLeftIcon className="text-lg transition-transform group-hover:-translate-x-1" />
            <span>Apps directory</span>
          </Link>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <BreadcrumbTitle
              title="Pattern Generator"
              slug="pat"
              variant="brutalist"
            />
            <div className="flex gap-3">
              <button
                onClick={regenerate}
                className="px-4 py-3 bg-white text-black font-bold font-mono uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-colors flex items-center gap-2"
                title="Regenerate Pattern"
              >
                <ArrowsClockwiseIcon size={18} weight="bold" />
                <span className="hidden md:inline">Regen</span>
              </button>
              <button
                onClick={handleDownloadSvg}
                className="px-4 py-3 border border-white/20 text-white font-bold font-mono uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                title="Download SVG"
              >
                <DownloadSimpleIcon size={18} weight="bold" />
                <span className="hidden md:inline">SVG (4K)</span>
              </button>
              <button
                onClick={() => handleDownloadPng(null, null, '4K')}
                className="px-4 py-3 border border-white/20 text-white font-bold font-mono uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                title="Download PNG (4K)"
              >
                <ImageSquareIcon size={18} weight="bold" />
                <span className="hidden md:inline">PNG (4K)</span>
              </button>
              <button
                onClick={handleDownloadPng1080p}
                className="px-4 py-3 border border-white/20 text-white font-bold font-mono uppercase tracking-widest text-[10px] hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                title="Download PNG (1080p)"
              >
                <ImageSquareIcon size={18} weight="bold" />
                <span className="hidden md:inline">PNG (1080p)</span>
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-8">
            {/* Dimensions */}
            <div className="bg-[#1a1a1a] p-6 border border-white/5 space-y-6">
              <h3 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <FrameCornersIcon weight="fill" className="text-emerald-500" />
                Canvas Setup
              </h3>

              <CustomDropdown
                options={PATTERN_TYPES}
                value={patternType}
                onChange={setPatternType}
                label="Pattern Style"
                icon={ShapesIcon}
                variant="brutalist"
                fullWidth
              />

              <CustomDropdown
                options={ASPECT_OPTIONS}
                value={aspectRatio}
                onChange={setAspectRatio}
                label="Aspect Ratio"
                variant="brutalist"
                fullWidth
              />

              <div>
                <CustomSlider
                  label="Grid Density"
                  value={density}
                  min={4}
                  max={40}
                  step={2}
                  onChange={(val) => setDensity(val)}
                />
                <p className="text-[10px] text-gray-600 font-mono uppercase mt-2 text-right">
                  {gridCols} Cols x {gridRows} Rows
                </p>
              </div>
            </div>

            {/* Palette Control */}
            <div className="bg-[#1a1a1a] p-6 border border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <PaletteIcon weight="fill" className="text-emerald-500" />
                  Color Palette
                </h3>
                <button
                  onClick={randomizePalette}
                  className="p-2 hover:bg-white/5 rounded-full transition-colors text-emerald-400"
                  title="Random Palette"
                >
                  <ShuffleIcon size={16} weight="bold" />
                </button>
              </div>

              <div className="space-y-3">
                {palette.map((color, i) => (
                  <CustomColorPicker
                    key={i}
                    value={color}
                    onChange={(newColor) => updateColor(i, newColor)}
                    label={`Color ${i + 1}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-emerald-900/10 border border-emerald-500/20 p-4">
              <p className="text-[10px] text-emerald-500 font-mono leading-relaxed">
                NOTE: Output is rendered at {targetRes.w}x{targetRes.h}px (4K).
                Patterns are vector-based and infinitely scalable.
              </p>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-3 bg-[#0a0a0a] border border-white/10 flex items-center justify-center p-8 overflow-hidden min-h-[500px]">
            <div className="relative shadow-2xl shadow-black max-w-full max-h-[70vh] flex">
              <svg
                ref={svgRef}
                width={targetRes.w}
                height={targetRes.h}
                viewBox={`0 0 ${targetRes.w} ${targetRes.h}`}
                className="w-full h-full object-contain"
                style={{
                  maxHeight: '70vh',
                  maxWidth: '100%',
                  aspectRatio: `${targetRes.w}/${targetRes.h}`,
                }}
              >
                {patternData.map((row, rIndex) =>
                  row.map((cell, cIndex) =>
                    renderCellDispatch(cell, rIndex, cIndex),
                  ),
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatternGeneratorPage;
