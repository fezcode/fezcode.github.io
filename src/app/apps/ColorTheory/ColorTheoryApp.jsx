import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  PaletteIcon,
  SwatchesIcon,
  EyeIcon,
  GameControllerIcon,
  ArrowLeftIcon,
  BookOpenIcon,
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';

import ColorWheel from './components/ColorWheel';
import HarmonyExplorer from './components/HarmonyExplorer';
import PerceptionPlayground from './components/PerceptionPlayground';
import ColorGames from './components/ColorGames';
import LearnSection from './components/LearnSection';

const sections = [
  {
    id: 'learn',
    label: 'Learn',
    icon: BookOpenIcon,
    component: LearnSection,
    color: '#FF5C5C',
  }, // Red
  {
    id: 'wheel',
    label: 'The Wheel',
    icon: PaletteIcon,
    component: ColorWheel,
    color: '#FFBD4A',
  }, // Yellow
  {
    id: 'harmony',
    label: 'Harmonies',
    icon: SwatchesIcon,
    component: HarmonyExplorer,
    color: '#5271FF',
  }, // Blue
  {
    id: 'perception',
    label: 'Perception',
    icon: EyeIcon,
    component: PerceptionPlayground,
    color: '#00C896',
  }, // Green
  {
    id: 'games',
    label: 'Games',
    icon: GameControllerIcon,
    component: ColorGames,
    color: '#9D4EDD',
  }, // Purple
];

const ColorTheoryApp = () => {
  const [activeSection, setActiveSection] = useState('learn');

  return (
    <div className="flex h-screen bg-[#f4f4f0] text-[#1a1a1a] font-nunito overflow-hidden selection:bg-[#1a1a1a] selection:text-[#f4f4f0]">
      {/* Sidebar - Swiss Style */}
      <aside className="w-20 lg:w-72 flex flex-col border-r-4 border-[#1a1a1a] bg-white shrink-0 z-20">
        {/* Brand Header */}
        <div className="p-6 border-b-4 border-[#1a1a1a] flex items-center justify-between bg-[#1a1a1a] text-[#f4f4f0]">
          <h1 className="hidden lg:block text-3xl font-normal uppercase tracking-tighter font-instr-serif">
            Chromatology
          </h1>
          <Link
            to="/apps"
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
            title="Exit"
          >
            <ArrowLeftIcon size={24} weight="bold" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 flex flex-col gap-2 px-3">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            const Icon = section.icon;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`
                            relative group flex items-center gap-4 p-4 rounded-xl transition-all duration-200 border-2
                            ${
                              isActive
                                ? 'bg-[#f4f4f0] border-[#1a1a1a] shadow-[4px_4px_0px_0px_#1a1a1a] translate-x-[-2px] translate-y-[-2px]'
                                : 'bg-transparent border-transparent hover:bg-black/5'
                            }
                        `}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center border-2 border-[#1a1a1a] shadow-sm transition-transform group-hover:scale-110"
                  style={{ backgroundColor: section.color }}
                >
                  <Icon
                    size={20}
                    weight="fill"
                    className="text-white mix-blend-multiply"
                  />
                </div>
                <span
                  className={`hidden lg:block font-bold text-lg tracking-tight ${isActive ? 'text-[#1a1a1a]' : 'text-[#666]'}`}
                >
                  {section.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-6 border-t-4 border-[#1a1a1a] hidden lg:block">
          <p className="text-xs font-mono text-gray-500">
            DESIGN: SWISS / BAUHAUS
            <br />
            VER: 2.0.0
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden bg-[#f4f4f0]">
        {/* Decorative Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        {/* Content Render */}
        <div className="h-full w-full relative z-10">
          {/* Note: Removed AnimatePresence for tab switching stability based on user feedback.
                 Instant switching is often preferred in tool-like apps.
             */}
          <div className="h-full w-full">
            {(() => {
              const Component = sections.find(
                (s) => s.id === activeSection,
              )?.component;
              if (!Component) return null;
              return (
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="h-full w-full"
                >
                  <Component />
                </motion.div>
              );
            })()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ColorTheoryApp;
