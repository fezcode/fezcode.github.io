import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  PaletteIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const hexToRgb = (hex) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
};

const getLuminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

const getContrastRatio = (rgb1, rgb2) => {
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

const ColorContrastCheckerPage = () => {
  const [foregroundColor, setForegroundColor] = useState('#FFFFFF');
  const [backgroundColor, setBackgroundColor] = useState('#050505');
  const [contrastRatio, setContrastRatio] = useState(0);
  const [wcagStatus, setWcagStatus] = useState({ aa: false, aaa: false });

  const calculateContrast = useCallback(() => {
    try {
      const fgRgb = hexToRgb(foregroundColor);
      const bgRgb = hexToRgb(backgroundColor);
      const ratio = getContrastRatio(fgRgb, bgRgb);
      setContrastRatio(ratio.toFixed(2));
      setWcagStatus({
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
      });
    } catch (error) {
      setContrastRatio(0);
      setWcagStatus({ aa: false, aaa: false });
    }
  }, [foregroundColor, backgroundColor]);

  useEffect(() => {
    calculateContrast();
  }, [calculateContrast]);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Contrast Checker | Fezcodex"
        description="Verify color accessibility and WCAG compliance for digital interfaces."
        keywords={[
          'Fezcodex',
          'color contrast',
          'accessibility',
          'WCAG',
          'color checker',
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
              <BreadcrumbTitle title="Contrast Checker" slug="ccc" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Accessibility verification protocol. Map chromatic ratios to
                ensure visual clarity and adherence to universal standards.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm space-y-10">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <PaletteIcon weight="fill" />
                Aesthetic_Input
              </h3>

              <div className="space-y-8">
                <div className="space-y-4">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Foreground_Hex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={foregroundColor}
                      onChange={(e) =>
                        setForegroundColor(e.target.value.toUpperCase())
                      }
                      className="w-12 h-12 rounded-sm cursor-pointer bg-transparent border border-white/10 p-1"
                    />
                    <input
                      type="text"
                      value={foregroundColor}
                      onChange={(e) =>
                        setForegroundColor(e.target.value.toUpperCase())
                      }
                      className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 font-mono text-sm uppercase focus:border-emerald-500/50 focus:ring-0 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                    Background_Hex
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) =>
                        setBackgroundColor(e.target.value.toUpperCase())
                      }
                      className="w-12 h-12 rounded-sm cursor-pointer bg-transparent border border-white/10 p-1"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) =>
                        setBackgroundColor(e.target.value.toUpperCase())
                      }
                      className="flex-1 bg-white/5 border border-white/10 rounded-sm px-4 font-mono text-sm uppercase focus:border-emerald-500/50 focus:ring-0 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm">
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Contrast ratios define the readability of digital assets. Higher
                ratios improve processing efficiency for human operators.
              </p>
            </div>
          </div>

          {/* Preview & Results Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Immersive Preview */}
            <div
              className="relative aspect-video rounded-sm overflow-hidden flex flex-col items-center justify-center p-12 transition-colors duration-500 border border-white/10"
              style={{ backgroundColor }}
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay">
                <GenerativeArt
                  seed={foregroundColor + backgroundColor}
                  className="w-full h-full"
                />
              </div>

              <div
                className="relative z-10 text-center space-y-6"
                style={{ color: foregroundColor }}
              >
                <div className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none">
                  Sample Text
                </div>
                <p className="text-xl md:text-2xl font-light max-w-md mx-auto leading-relaxed">
                  The quick brown fox jumps over the lazy dog.
                </p>
              </div>
            </div>

            {/* Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm flex flex-col items-center justify-center gap-2">
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  Ratio
                </span>
                <div className="text-4xl font-black text-emerald-500">
                  {contrastRatio}:1
                </div>
              </div>

              <div
                className={`border border-white/10 p-8 rounded-sm flex flex-col items-center justify-center gap-4 transition-all ${wcagStatus.aa ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}
              >
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  WCAG_AA
                </span>
                {wcagStatus.aa ? (
                  <CheckCircleIcon
                    size={32}
                    weight="fill"
                    className="text-emerald-500"
                  />
                ) : (
                  <XCircleIcon
                    size={32}
                    weight="fill"
                    className="text-red-500"
                  />
                )}
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${wcagStatus.aa ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {wcagStatus.aa ? 'PASS' : 'FAIL'}
                </span>
              </div>

              <div
                className={`border border-white/10 p-8 rounded-sm flex flex-col items-center justify-center gap-4 transition-all ${wcagStatus.aaa ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}
              >
                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  WCAG_AAA
                </span>
                {wcagStatus.aaa ? (
                  <CheckCircleIcon
                    size={32}
                    weight="fill"
                    className="text-emerald-500"
                  />
                ) : (
                  <XCircleIcon
                    size={32}
                    weight="fill"
                    className="text-red-500"
                  />
                )}
                <span
                  className={`text-[10px] font-black uppercase tracking-widest ${wcagStatus.aaa ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {wcagStatus.aaa ? 'PASS' : 'FAIL'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Chromatic_Analyzer_v0.6.1</span>
          <span className="text-gray-800">ACCESSIBILITY_MODE // VERIFIED</span>
        </footer>
      </div>
    </div>
  );
};

export default ColorContrastCheckerPage;
