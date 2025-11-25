import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowLeftIcon, PlanetIcon} from '@phosphor-icons/react';
import colors from '../../config/colors';
import useSeo from '../../hooks/useSeo';

const orbitalPeriods = {
  Mercury: 0.2408467,
  Venus: 0.61519726,
  Mars: 1.8808158,
  Jupiter: 11.862615,
  Saturn: 29.447498,
  Uranus: 84.016846,
  Neptune: 164.79132,
  Pluto: 248.00, // Dwarf planet, but let's include it
  "Elf (LotR)": 100, // Fictional: assume elves live super long, so 1 "elf year" is 100 earth years? Or maybe they just age slower. Let's say 1 elf year = 144 earth years (some lore suggests this).
  "Dog": 1 / 7, // "Dog years" usually means 1 earth year = 7 dog years, so 1 dog year = 1/7 earth years.
};

const GalacticAgePage = () => {
  useSeo({
    title: 'Galactic Age Converter | Fezcodex',
    description: 'Calculate your age on other planets in our solar system.',
    keywords: ['Fezcodex', 'galactic age', 'age converter', 'planets', 'space'],
    ogTitle: 'Galactic Age Converter | Fezcodex',
    ogDescription: 'Calculate your age on other planets in our solar system.',
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Galactic Age Converter | Fezcodex',
    twitterDescription: 'Calculate your age on other planets in our solar system.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });

  const [earthAge, setEarthAge] = useState('');

  const cardStyle = {
    backgroundColor: colors['app-alpha-10'],
    borderColor: colors['app-alpha-50'],
    color: colors.app,
  };

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 text-gray-300">
        <Link
          to="/apps"
          className="text-article hover:underline flex items-center justify-center gap-2 text-lg mb-4"
        >
          <ArrowLeftIcon size={24}/> Back to Apps
        </Link>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-4 flex items-center justify-center">
          <span className="codex-color">fc</span>
          <span className="separator-color">::</span>
          <span className="apps-color">apps</span>
          <span className="separator-color">::</span>
          <span className="single-app-color">space</span>
        </h1>
        <hr className="border-gray-700"/>
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
            <div className="relative z-10 p-1 text-center">
              <h1 className="text-3xl font-arvo font-normal mb-4 text-app flex items-center justify-center gap-2">
                <PlanetIcon size={32}/> Galactic Age Converter
              </h1>
              <hr className="border-gray-700 mb-6"/>

              <div className="mb-8 max-w-sm mx-auto">
                <label className="block text-sm font-medium mb-2 opacity-80">Your Earth Age (Years)</label>
                <input
                  type="number"
                  value={earthAge}
                  onChange={(e) => setEarthAge(e.target.value)}
                  placeholder="e.g., 30"
                  className="w-full bg-black/20 border border-gray-600 rounded px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors text-center text-2xl"
                />
              </div>

              {earthAge && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Object.entries(orbitalPeriods).map(([planet, period]) => {
                    const age = (parseFloat(earthAge) / period).toFixed(2);
                    return (
                      <div key={planet}
                           className="bg-black/20 p-4 rounded border border-gray-700 hover:border-purple-500 transition-colors">
                        <div className="text-sm opacity-70 mb-1">{planet}</div>
                        <div className="text-xl font-bold text-purple-300">{age}</div>
                        <div className="text-xs opacity-50">years</div>
                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalacticAgePage;
