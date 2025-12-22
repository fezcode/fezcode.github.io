import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import PickerWheel from '../../components/PickerWheel';
import useSeo from '../../hooks/useSeo';

function PickerWheelPage() {
  const appName = 'Picker Wheel';

  useSeo({
    title: `${appName} | Fezcodex`,
    description: 'Make decisions or select random items from a list with a custom spinning wheel.',
    keywords: [
      'Fezcodex',
      'picker wheel',
      'decision maker',
      'random selector',
      'wheel spinner',
    ],
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 font-sans">
      <div className="mx-auto max-w-7xl px-6 py-24 md:px-12">
        <header className="mb-24">
          <Link to="/apps" className="group mb-12 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-[0.3em]">
            <ArrowLeftIcon weight="bold" className="transition-transform group-hover:-translate-x-1" />
            <span>Applications</span>
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none uppercase">
                {appName}
              </h1>
              <p className="text-xl text-gray-400 max-w-2xl font-light leading-relaxed">
                Add your options and spin the wheel to make a random selection. Perfect for choosing where to eat, who goes first, or making quick decisions.
              </p>
            </div>
          </div>
        </header>

        <div className="flex justify-center">
          <PickerWheel />
        </div>

        <footer className="mt-32 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-gray-600 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span>Fezcodex Selection Tool</span>
          <span className="text-gray-800">Status // Ready</span>
        </footer>
      </div>
    </div>
  );
}

export default PickerWheelPage;
