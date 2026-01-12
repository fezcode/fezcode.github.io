import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeftIcon, PlanetIcon, RocketIcon } from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import GenerativeArt from '../../components/GenerativeArt';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';

const orbitalPeriods = {
  Mercury: 0.2408467,
  Venus: 0.61519726,
  Mars: 1.8808158,
  Jupiter: 11.862615,
  Saturn: 29.447498,
  Uranus: 84.016846,
  Neptune: 164.79132,
  Pluto: 248.0,
  'LotR Elf': 100,
  Canine: 1 / 7,
};

const GalacticAgePage = () => {
  const appName = 'Galactic Age';

  const [earthAge, setEarthAge] = useState('');

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <Seo
        title="Galactic Age | Fezcodex"
        description="Protocol for orbital temporal mapping. Calculate your age relative to planetary cycles."
        keywords={['Fezcodex', 'galactic age', 'age converter', 'planets', 'space']}
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
              <BreadcrumbTitle title="Galactic Age" slug="space" variant="brutalist" />
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Planetary temporal mapping. Calculate your biological age
                relative to different orbital periods within the celestial
                matrix.
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Input Area */}
          <div className="lg:col-span-12">
            <div className="relative border border-white/10 bg-white/[0.02] p-12 md:p-24 rounded-sm overflow-hidden group flex flex-col items-center justify-center">
              {/* Generative Background */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none grayscale">
                <GenerativeArt
                  seed={appName + earthAge}
                  className="w-full h-full"
                />
              </div>

              <div className="relative z-10 w-full max-w-xl text-center space-y-8">
                <div className="space-y-4">
                  <label className="font-mono text-[10px] text-emerald-500 font-bold uppercase tracking-[0.5em]">
                    {'//'} EARTH_YEARS_BASELINE
                  </label>
                  <input
                    type="number"
                    value={earthAge}
                    onChange={(e) => setEarthAge(e.target.value)}
                    placeholder="Enter age..."
                    className="w-full bg-black/40 border-b-8 border-white text-6xl md:text-9xl font-black text-white text-center focus:border-emerald-500 focus:outline-none transition-colors py-8 font-mono tracking-tighter"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.entries(orbitalPeriods).map(([planet, period], index) => {
                const age = earthAge
                  ? (parseFloat(earthAge) / period).toFixed(2)
                  : '0.00';
                return (
                  <motion.div
                    key={planet}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border border-white/10 bg-white/[0.02] p-8 rounded-sm group hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                        {planet}
                      </span>
                      <span className="text-[10px] font-mono text-gray-700 uppercase">
                        Orbit: {period.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl md:text-5xl font-black text-white group-hover:text-emerald-500 transition-colors leading-none">
                        {age}
                      </span>
                      <span className="font-mono text-[10px] text-gray-600 uppercase tracking-widest">
                        Cycles
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Sidebar Metrics */}
          <div className="lg:col-span-4 space-y-8">
            <div className="border border-white/10 bg-white/[0.02] p-8 rounded-sm">
              <h3 className="font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-10 flex items-center gap-2">
                <PlanetIcon weight="fill" />
                Orbital_Parameters
              </h3>

              <div className="space-y-6 text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                <p>
                  Biological age is a relative metric defined by the frequency
                  of planetary rotation around the primary stellar mass.
                </p>
                <div className="pt-6 border-t border-white/5 flex justify-between items-center">
                  <span>Standard</span>
                  <span className="text-white font-black">Earth_Year_365D</span>
                </div>
              </div>
            </div>

            <div className="p-8 border border-white/10 bg-white/[0.01] rounded-sm flex items-start gap-4">
              <RocketIcon size={24} className="text-gray-700 shrink-0 mt-1" />
              <p className="text-[10px] font-mono uppercase tracking-[0.2em] leading-relaxed text-gray-500">
                Temporal mapping requires alignment with planetary orbital
                velocities. All calculations are performed relative to the Earth
                baseline sequence.
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex_Orbital_Module_v0.6.1</span>
          <span className="text-gray-800">TEMPORAL_STATUS // CALIBRATED</span>
        </footer>
      </div>
    </div>
  );
};

export default GalacticAgePage;
