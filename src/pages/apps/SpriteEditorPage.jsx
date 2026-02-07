import React, { useState, useEffect, useCallback } from 'react';
import {
  PencilSimple,
  Eraser,
  PaintBucket,
  DownloadSimple,
  Trash,
  ArrowCounterClockwise,
  Palette,
  GridFour,
  Sun,
  Moon,
  ArrowLeft as ArrowLeftIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const SpriteEditorPage = () => {
  const [gridSize, setGridSize] = useState(16);
  const [pixels, setPixels] = useState(Array(16 * 16).fill(null));
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [tool, setTool] = useState('pencil'); // pencil, eraser, fill
  const [showGrid, setShowGrid] = useState(true);
  const [history, setHistory] = useState([]);
  const [isWhiteBackground, setIsWhiteBackground] = useState(false); // New state for theme toggle

  // Define theme classes
  const themeClasses = {
    dark: {
      pageBg: 'bg-[#2d2d2d]',
      pageText: 'text-[#e0e0e0]',
      panelBg: 'bg-[#1a1a1a]',
      panelBorder: 'border-[#4a4a4a]',
      panelShadow: 'shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]',
      panelTitle: 'text-[#888]',
      canvasBg: 'bg-[#111]',
      canvasBorder: 'border-[#4a4a4a]',
      canvasShadow: 'shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]',
      canvasGrid: 'rgba(0,0,0,0.1)',
      gridButtonBorder: 'border-[#4a4a4a]',
      gridButtonText: 'text-[#888]',
      paletteLabelBorder: 'border-[#4a4a4a]',
      toolButtonBg: 'bg-[#333]',
      toolButtonText: 'text-[#aaa]',
      toolButtonHoverBg: 'hover:bg-[#444]',
      toolButtonShadow: 'shadow-[0_4px_0_#222]',
    },
    light: {
      pageBg: 'bg-gray-100',
      pageText: 'text-gray-800',
      panelBg: 'bg-white',
      panelBorder: 'border-gray-300',
      panelShadow: 'shadow-lg',
      panelTitle: 'text-gray-500',
      canvasBg: 'bg-white',
      canvasBorder: 'border-gray-300',
      canvasShadow: 'shadow-inner',
      canvasGrid: 'rgba(0,0,0,0.1)', // Keep grid lines slightly visible
      gridButtonBorder: 'border-gray-300',
      gridButtonText: 'text-gray-600',
      paletteLabelBorder: 'border-gray-300',
      toolButtonBg: 'bg-gray-200',
      toolButtonText: 'text-gray-700',
      toolButtonHoverBg: 'hover:bg-gray-300',
      toolButtonShadow: 'shadow-md',
    },
  };

  const currentTheme = isWhiteBackground
    ? themeClasses.light
    : themeClasses.dark;

  const colors = [
    '#000000',
    '#1D2B53',
    '#7E2553',
    '#008751',
    '#AB5236',
    '#5F574F',
    '#C2C3C7',
    '#FFF1E8',
    '#FF004D',
    '#FFA300',
    '#FFEC27',
    '#00E436',
    '#29ADFF',
    '#83769C',
    '#FF77A8',
    '#FFCCAA',
  ];

  useEffect(() => {
    // Reset pixels when grid size changes
    setPixels(Array(gridSize * gridSize).fill(null));
    setHistory([]);
  }, [gridSize]);

  const saveToHistory = () => {
    if (history.length > 150) {
      setHistory([...history.slice(1), [...pixels]]);
    } else {
      setHistory([...history, [...pixels]]);
    }
  };

  const handlePixelClick = (index) => {
    saveToHistory();
    const newPixels = [...pixels];

    if (tool === 'pencil') {
      newPixels[index] = selectedColor;
    } else if (tool === 'eraser') {
      newPixels[index] = null;
    } else if (tool === 'fill') {
      const targetColor = newPixels[index];
      if (targetColor === selectedColor) return;
      floodFill(newPixels, index, targetColor, selectedColor);
    }
    setPixels(newPixels);
  };

  const floodFill = (pxls, startIndex, targetColor, replacementColor) => {
    const queue = [startIndex];
    const visited = new Set();
    const width = gridSize;

    while (queue.length > 0) {
      const idx = queue.shift();
      if (visited.has(idx)) continue;
      visited.add(idx);

      if (pxls[idx] === targetColor) {
        pxls[idx] = replacementColor;

        const x = idx % width;
        const y = Math.floor(idx / width);

        if (x > 0) queue.push(idx - 1);
        if (x < width - 1) queue.push(idx + 1);
        if (y > 0) queue.push(idx - width);
        if (y < width - 1) queue.push(idx + width);
      }
    }
  };

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const previousState = history[history.length - 1];
    setPixels(previousState);
    setHistory(history.slice(0, -1));
  }, [history]);

  const clearCanvas = () => {
    saveToHistory();
    setPixels(Array(gridSize * gridSize).fill(null));
  };

  const exportImage = (format, scale = 1) => {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize * scale;
    canvas.height = gridSize * scale;
    const ctx = canvas.getContext('2d');

    // Ensure sharp pixels when scaling
    ctx.imageSmoothingEnabled = false;

    pixels.forEach((color, i) => {
      if (color) {
        const x = (i % gridSize) * scale;
        const y = Math.floor(i / gridSize) * scale;
        ctx.fillStyle = color;
        ctx.fillRect(x, y, scale, scale);
      }
    });

    const link = document.createElement('a');
    link.download = `sprite_${scale}x.${format}`;
    link.href = canvas.toDataURL(`image/${format}`);
    link.click();
  };

  // CTRL + Z, undo event listener.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'z') {
        event.preventDefault();
        undo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo]);

  const exportSvg = () => {
    const svgString = `
      <svg width="${gridSize}" height="${gridSize}" viewBox="0 0 ${gridSize} ${gridSize}" xmlns="http://www.w3.org/2000/svg">
        ${pixels
          .map((color, i) => {
            if (color) {
              const x = i % gridSize;
              const y = Math.floor(i / gridSize);
              return `<rect x="${x}" y="${y}" width="1" height="1" fill="${color}" />`;
            }
            return '';
          })
          .join('')}
      </svg>
    `;

    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sprite.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.pageBg} ${currentTheme.pageText} font-mono selection:bg-[#ff004d] selection:text-white pb-12`}
    >
      <Seo
        title="Sprite Editor | Fezcodex"
        description="A simple, browser-based pixel art editor."
        keywords={[
          'pixel art',
          'sprite editor',
          'game art',
          'drawing',
          'canvas',
        ]}
      />
      <div className="max-w-6xl mx-auto pt-24 px-4">
        <Link
          to="/apps"
          className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
          Back to Apps
        </Link>
        <BreadcrumbTitle title="Sprite Editor" slug="se" />

        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr_200px] gap-8 mt-8">
          {/* Tools Panel */}
          <div
            className={`${currentTheme.panelBg} p-4 rounded-lg border-4 ${currentTheme.panelBorder} ${currentTheme.panelShadow} h-fit`}
          >
            <div className="grid grid-cols-2 gap-2">
              <ToolButton
                icon={PencilSimple}
                active={tool === 'pencil'}
                onClick={() => setTool('pencil')}
                label="Draw"
                currentTheme={currentTheme}
              />
              <ToolButton
                icon={Eraser}
                active={tool === 'eraser'}
                onClick={() => setTool('eraser')}
                label="Erase"
                currentTheme={currentTheme}
              />
              <ToolButton
                icon={PaintBucket}
                active={tool === 'fill'}
                onClick={() => setTool('fill')}
                label="Fill"
                currentTheme={currentTheme}
              />
              <ToolButton
                icon={GridFour}
                active={showGrid}
                onClick={() => setShowGrid(!showGrid)}
                label="Grid"
                currentTheme={currentTheme}
              />
              <ToolButton
                icon={isWhiteBackground ? Sun : Moon}
                active={isWhiteBackground}
                onClick={() => setIsWhiteBackground(!isWhiteBackground)}
                label={isWhiteBackground ? 'Light Mode' : 'Dark Mode'}
                currentTheme={currentTheme}
              />
            </div>

            <div className="mt-8">
              <h3
                className={`text-xs uppercase tracking-widest ${currentTheme.panelTitle} mb-4 text-center`}
              >
                Actions
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <ToolButton
                  icon={ArrowCounterClockwise}
                  onClick={undo}
                  disabled={history.length === 0}
                  label="Undo"
                  currentTheme={currentTheme}
                />
                <ToolButton
                  icon={Trash}
                  onClick={clearCanvas}
                  label="Clear"
                  currentTheme={currentTheme}
                />
              </div>
            </div>

            <div className="mt-8">
              <h3
                className={`text-xs uppercase tracking-widest ${currentTheme.panelTitle} mb-4 text-center`}
              >
                Grid Size
              </h3>
              <div className="flex flex-wrap justify-between gap-1">
                {[8, 16, 32, 64].map((size) => (
                  <button
                    key={size}
                    onClick={() => setGridSize(size)}
                    className={`px-2 py-1 text-xs border-2 flex-grow ${gridSize === size ? 'border-[#ff004d] text-[#ff004d]' : `${currentTheme.gridButtonBorder} ${currentTheme.gridButtonText} hover:border-white`}`}
                  >
                    {size}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div
            className={`flex flex-col items-center justify-center ${currentTheme.canvasBg} p-8 rounded-lg border-4 ${currentTheme.canvasBorder} ${currentTheme.canvasShadow} min-h-[400px]`}
          >
            <div
              className="relative"
              style={{
                width: 'min(100%, 800px)',
                aspectRatio: '1/1',
                display: 'grid',
                gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
                imageRendering: 'pixelated',
                border: '1px solid #444',
                boxShadow: '0 0 0 1px #000',
              }}
              onMouseLeave={() => {
                /* Stop drawing if dragging out */
              }}
              onDragStart={(e) => e.preventDefault()}
            >
              {pixels.map((color, i) => (
                <div
                  key={i}
                  onClick={() => handlePixelClick(i)}
                  onMouseEnter={(e) => {
                    if (e.buttons === 1) handlePixelClick(i);
                  }}
                  style={{
                    backgroundColor: color || 'transparent',
                    border: showGrid
                      ? `1px solid ${currentTheme.canvasGrid}`
                      : 'none',
                    cursor: 'crosshair',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Colors & Export */}
          <div
            className={`${currentTheme.panelBg} p-4 rounded-lg border-4 ${currentTheme.panelBorder} ${currentTheme.panelShadow} h-fit`}
          >
            <h3
              className={`text-xs uppercase tracking-widest ${currentTheme.panelTitle} mb-4 text-center`}
            >
              Palette
            </h3>
            <div className="grid grid-cols-4 gap-1 mb-4">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-sm border-2 ${selectedColor === color ? 'border-white scale-110 z-10' : 'border-transparent hover:scale-105'}`}
                  style={{ backgroundColor: color }}
                />
              ))}
              <label
                className={`w-8 h-8 rounded-sm border-2 ${currentTheme.paletteLabelBorder} flex items-center justify-center cursor-pointer hover:border-white relative overflow-hidden`}
              >
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <Palette size={16} />
              </label>
            </div>

            <div className="mt-8 border-t-2 border-[#333] pt-4">
              <h3
                className={`text-xs uppercase tracking-widest ${currentTheme.panelTitle} mb-4 text-center`}
              >
                Export
              </h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => exportImage('png', 1)}
                  className="flex items-center justify-center gap-2 bg-[#008751] text-white py-2 px-4 rounded text-xs font-bold uppercase hover:bg-[#00a060] transition-colors border-b-4 border-[#005f38] active:border-b-0 active:translate-y-1"
                >
                  <DownloadSimple weight="bold" /> PNG (1x)
                </button>
                <button
                  onClick={() => exportImage('png', 2)}
                  className="flex items-center justify-center gap-2 bg-[#008751] text-white py-2 px-4 rounded text-xs font-bold uppercase hover:bg-[#00a060] transition-colors border-b-4 border-[#005f38] active:border-b-0 active:translate-y-1"
                >
                  <DownloadSimple weight="bold" /> PNG (2x)
                </button>
                <button
                  onClick={exportSvg}
                  className="flex items-center justify-center gap-2 bg-[#008751] text-white py-2 px-4 rounded text-xs font-bold uppercase hover:bg-[#00a060] transition-colors border-b-4 border-[#005f38] active:border-b-0 active:translate-y-1"
                >
                  <DownloadSimple weight="bold" /> SVG
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({
  icon: Icon,
  active,
  onClick,
  disabled,
  label,
  currentTheme,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    className={`
      flex flex-col items-center justify-center p-2 rounded transition-all duration-100
      ${
        active
          ? 'bg-[#ff004d] text-white shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)]'
          : `${currentTheme.toolButtonBg} ${currentTheme.toolButtonText} ${currentTheme.toolButtonHoverBg} ${currentTheme.toolButtonShadow} active:translate-y-1 active:shadow-none`
      }
      ${disabled ? 'opacity-50 cursor-not-allowed shadow-none translate-y-1' : ''}
    `}
  >
    <Icon size={20} weight={active ? 'fill' : 'regular'} />
  </button>
);

export default SpriteEditorPage;
