import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useToast } from '../../hooks/useToast';
import useSeo from '../../hooks/useSeo';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

function ColorPaletteGeneratorPage() {
  useSeo({
    title: 'Color Palette Generator | Fezcodex',
    description: 'Generate random color palettes for your design projects.',
    keywords: ['Fezcodex', 'color palette', 'color generator', 'design tools'],
    ogTitle: 'Color Palette Generator | Fezcodex',
    ogDescription: 'Generate random color palettes for your design projects.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Color Palette Generator | Fezcodex',
    twitterDescription:
      'Generate random color palettes for your design projects.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const [palette, setPalette] = useState([]);
  const { addToast } = useToast();

  const generateRandomHexColor = () => {
    return (
      '#' +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, '0')
    );
  };

  const generatePalette = () => {
    const newPalette = Array.from({ length: 5 }, generateRandomHexColor);
    setPalette(newPalette);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        addToast({
          title: 'Success',
          message: `Copied ${text} to clipboard!`,
          duration: 2000,
        });
      })
      .catch(() => {
        addToast({
          title: 'Error',
          message: 'Failed to copy!',
          duration: 2000,
        });
      });
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link to="/apps" className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4" >
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
          <BreadcrumbTitle title="Color Palette Generator" slug="cpg" />
        <hr className="border-gray-700" />
        <div className="flex justify-center items-center mt-16">
          <div className="group border rounded-lg shadow-2xl p-6 flex flex-col justify-between relative transform transition-all duration-300 ease-in-out scale-105 overflow-hidden h-full w-full max-w-4xl bg-app-alpha-10 border-app-alpha-50 text-app hover:bg-app/15">
            <div
              className="absolute top-0 left-0 w-full h-full opacity-10"
              style={{
                backgroundImage:
                  'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '10px 10px',
              }}
            ></div>
            <h1 className="text-3xl font-arvo font-normal mb-4 text-app">
              {' '}
              Color Palette Generator{' '}
            </h1>
            <hr className="border-gray-700 mb-4" />
            <div className="relative z-10 p-1">
              <div className="flex justify-center gap-4 mb-4">
                <button
                  onClick={generatePalette}
                  className="px-6 py-2 rounded-md text-lg font-arvo font-normal transition-colors duration-300 ease-in-out bg-tb hover:bg-app/30 text-app border-app border"
                >
                  Generate New Palette
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
                {palette.map((color, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center p-4 rounded-md cursor-pointer transition-transform duration-200 hover:scale-105"
                    style={{ backgroundColor: color }}
                    onClick={() => copyToClipboard(color)}
                  >
                    <span
                      className="text-white font-semibold text-shadow-sm"
                      style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                    >
                      {color}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ColorPaletteGeneratorPage;
