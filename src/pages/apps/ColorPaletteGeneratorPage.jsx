import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CopySimpleIcon,
  ArrowCounterClockwiseIcon,
  PaletteIcon,
  HashIcon,
} from '@phosphor-icons/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../hooks/useToast';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function ColorPaletteGeneratorPage() {
  const [palette, setPalette] = useState([]);
  const { addToast } = useToast();

  const hexToRgb = (hex) => {
    let r = 0,
      g = 0,
      b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    return [r, g, b];
  };

  const getContrastTextColor = (hexColor) => {
    const [r, g, b] = hexToRgb(hexColor);
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    return luminance > 128 ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.9)';
  };

  const generateRandomHexColor = () => {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  };

  const generatePalette = useCallback(() => {
    const newPalette = Array.from({ length: 5 }, generateRandomHexColor);
    setPalette(newPalette);
  }, []);

  useEffect(() => {
    generatePalette();
  }, [generatePalette]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      addToast({
        title: 'Copied',
        message: `${type || text} added to clipboard.`,
        duration: 2000,
      });
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Color Palette | Fezcodex"
        description="Generate harmonious color palettes for your design projects."
        keywords={['Fezcodex', 'color palette', 'color generator', 'design tools']}
      />
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        {/* Header Section */}
        <header className="mb-20">
          <Link
            to="/apps"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <BreadcrumbTitle title="Color Palette" slug="cpg" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Visual aesthetics generator. Create harmonious color sequences
                for digital environments.
              </p>
            </div>

            <div className="flex flex-col gap-4 items-end font-mono">
              <button
                onClick={generatePalette}
                className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black hover:bg-emerald-400 transition-all duration-300 font-mono uppercase tracking-widest text-sm font-black rounded-sm"
              >
                <ArrowCounterClockwiseIcon
                  weight="bold"
                  className="group-hover:rotate-180 transition-transform duration-500"
                />
                <span>Generate New</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="relative">
          {/* Decorative Background Art */}
          <div className="absolute -inset-4 opacity-5 pointer-events-none">
            <GenerativeArt seed={palette.join('')} className="w-full h-full" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row h-[60vh] border border-white/10 rounded-sm overflow-hidden bg-white/[0.02]">
            <AnimatePresence mode="popLayout">
              {palette.map((color, index) => {
                const textColor = getContrastTextColor(color);
                const rgb = hexToRgb(color);
                const rgbString = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;

                return (
                  <motion.div
                    key={color + index}
                    initial={{ opacity: 0, flexGrow: 0 }}
                    animate={{ opacity: 1, flexGrow: 1 }}
                    exit={{ opacity: 0, flexGrow: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4 }}
                    style={{ backgroundColor: color }}
                    className="group relative flex flex-col items-center justify-center p-8 transition-all duration-500 hover:flex-[2] cursor-pointer"
                    onClick={() => copyToClipboard(color, 'Hex code')}
                  >
                    {/* Interaction Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />

                    <div
                      className="relative z-10 flex flex-col items-center gap-2 text-center"
                      style={{ color: textColor }}
                    >
                      <span className="text-[10px] font-mono uppercase tracking-widest opacity-50 mb-2">
                        Color {index + 1}
                      </span>

                      <div className="flex flex-col gap-1">
                        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center justify-center gap-2">
                          {color}
                          <CopySimpleIcon
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            size={20}
                          />
                        </h2>
                        <p className="text-xs font-mono font-bold tracking-widest opacity-70 uppercase">
                          {rgbString}
                        </p>
                      </div>
                    </div>

                    {/* Floating Info (Desktop) */}
                    <div
                      className="absolute bottom-8 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ color: textColor }}
                    >
                      <span className="text-[9px] font-mono uppercase tracking-[0.3em] font-black">
                        Click to Copy
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

        {/* Footer Specifications */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-white/5 pt-12">
          <div>
            <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <PaletteIcon weight="fill" />
              Design_Protocol
            </h3>
            <p className="text-gray-500 text-xs font-mono leading-relaxed uppercase">
              Harmonious palettes are generated using a controlled pseudo-random
              seed. Use these sequences to maintain visual consistency across
              project modules.
            </p>
          </div>
          <div>
            <h3 className="font-mono text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <HashIcon weight="fill" />
              Format_Standards
            </h3>
            <p className="text-gray-500 text-xs font-mono leading-relaxed uppercase">
              The system provides hexadecimal and RGB output formats. Click any
              color strip to stage the data to your clipboard.
            </p>
          </div>
          <div className="flex flex-col justify-end items-end">
            <div className="flex items-center gap-2 text-gray-700 font-mono text-[10px] uppercase">
              <span className="h-1 w-8 bg-gray-800" />
              <span>Aesthetic_Core_Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPaletteGeneratorPage;
