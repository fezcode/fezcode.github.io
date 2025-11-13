import React, { useState, useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, CheckCircle, XCircle } from '@phosphor-icons/react'; // Using Palette for now
import colors from '../../config/colors';
import { useToast } from '../../hooks/useToast';
import useSeo from "../../hooks/useSeo";

// Helper function to convert hex to RGB
const hexToRgb = (hex) => {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
};

// Helper function to calculate luminance
const getLuminance = (r, g, b) => {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
};

// Helper function to calculate contrast ratio
const getContrastRatio = (rgb1, rgb2) => {
  const lum1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
  const lum2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
};

const ColorContrastCheckerPage = () => {
  useSeo({
    title: 'Color Contrast Checker | Fezcodex',
    description: 'Check the contrast ratio of your colors to ensure accessibility and WCAG compliance.',
    keywords: ['Fezcodex', 'color contrast', 'accessibility', 'WCAG', 'color checker'],
    ogTitle: 'Color Contrast Checker | Fezcodex',
    ogDescription: 'Check the contrast ratio of your colors to ensure accessibility and WCAG compliance.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Color Contrast Checker | Fezcodex',
    twitterDescription: 'Check the contrast ratio of your colors to ensure accessibility and WCAG compliance.',
    twitterImage: 'https://fezcode.github.io/logo512.png'
  });
  const { addToast } = useToast();

  const [foregroundColor, setForegroundColor] = useState('#FFFFFF'); // Default white
  const [backgroundColor, setBackgroundColor] = useState('#000000'); // Default black
  const [contrastRatio, setContrastRatio] = useState(0);
  const [wcagStatus, setWcagStatus] = useState({ aa: false, aaa: false });

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  const inputStyle = `mt-1 block w-full p-2 border rounded-md bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 border-gray-600`;

  const calculateContrast = useCallback(() => {
    try {
      const fgRgb = hexToRgb(foregroundColor);
      const bgRgb = hexToRgb(backgroundColor);
      const ratio = getContrastRatio(fgRgb, bgRgb);
      setContrastRatio(ratio.toFixed(2));

      // WCAG 2.1 Guidelines
      // Normal Text: AA (4.5:1), AAA (7:1)
      // Large Text (18pt or 14pt bold): AA (3:1), AAA (4.5:1)
      // For simplicity, we'll check for normal text here.
      setWcagStatus({
        aa: ratio >= 4.5,
        aaa: ratio >= 7,
      });
    } catch (error) {
      setContrastRatio(0);
      setWcagStatus({ aa: false, aaa: false });
      addToast({ title: 'Error', message: 'Invalid hex color format.', duration: 3000, type: 'error' });
    }
  }, [foregroundColor, backgroundColor, addToast]);

  useEffect(() => {
    calculateContrast();
  }, [calculateContrast]);

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24} /> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">ccc</span>
        </h1>
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div
            className="group bg-transparent border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform overflow-hidden h-full w-full max-w-4xl"
            style={cardStyle}
          >
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <div className="relative z-10 p-1">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app"> Color Contrast Checker </h1>
              <hr className="border-gray-700 mb-4" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="foregroundColor" className="block text-sm font-medium text-gray-300 mb-2">
                    Foreground Color (Hex)
                  </label>
                  <input
                    type="color"
                    id="foregroundColorPicker"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value.toUpperCase())}
                    className="w-full h-10 mb-2 rounded-md cursor-pointer"
                    title="Pick Foreground Color"
                  />
                  <input
                    type="text"
                    id="foregroundColor"
                    value={foregroundColor}
                    onChange={(e) => setForegroundColor(e.target.value.toUpperCase())}
                    className={inputStyle}
                    placeholder="#FFFFFF"
                  />
                </div>
                <div>
                  <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-300 mb-2">
                    Background Color (Hex)
                  </label>
                  <input
                    type="color"
                    id="backgroundColorPicker"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
                    className="w-full h-10 mb-2 rounded-md cursor-pointer"
                    title="Pick Background Color"
                  />
                  <input
                    type="text"
                    id="backgroundColor"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value.toUpperCase())}
                    className={inputStyle}
                    placeholder="#000000"
                  />
                </div>
              </div>

              <div
                className="w-full h-32 rounded-md flex items-center justify-center text-2xl font-bold mb-6"
                style={{
                  backgroundColor: backgroundColor,
                  color: foregroundColor,
                  border: `1px solid ${colors['app-alpha-50']}`
                }}
              >
                Aa
              </div>

              <div className="mb-6">
                <p className="text-lg font-medium text-gray-300 mb-2">
                  Contrast Ratio: <span className="text-white">{contrastRatio}:1</span>
                </p>
                <div className="flex items-center gap-4">
                  <span className="text-base font-medium text-gray-300">
                    WCAG AA:
                  </span>
                  {wcagStatus.aa ? (
                    <CheckCircle size={24} className="text-green-500" />
                  ) : (
                    <XCircle size={24} className="text-red-500" />
                  )}
                  <span className="text-base font-medium text-gray-300 ml-4">
                    WCAG AAA:
                  </span>
                  {wcagStatus.aaa ? (
                    <CheckCircle size={24} className="text-green-500" />
                  ) : (
                    <XCircle size={24} className="text-red-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorContrastCheckerPage;
