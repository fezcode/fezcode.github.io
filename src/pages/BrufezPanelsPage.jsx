import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {motion, AnimatePresence} from 'framer-motion';
import {
  ArrowLeftIcon,
  CaretRightIcon,
  CircleIcon,
  HexagonIcon,
  SquareIcon,
  TriangleIcon,
  FlaskIcon,
} from '@phosphor-icons/react';
import useSeo from '../hooks/useSeo';
import BreadcrumbTitle from '../components/BreadcrumbTitle';
import GenerativeArt from '../components/GenerativeArt';

const panelData = [
  {
    id: '01',
    title: 'STRUCTURAL_GRID',
    description: 'The primary organizational unit of Brufez. Hard boundaries, 1px lines, and absolute positioning protocols.',
    icon: SquareIcon,
    artSeed: 'grid_system',
  },
  {
    id: '02',
    title: 'NEURAL_ART',
    description: 'Generative mathematics acting as an organic counter-balance to the rigid structural grid.',
    icon: HexagonIcon,
    artSeed: 'math_art',
  },
  {
    id: '03',
    title: 'STATUS_SYNC',
    description: 'High-frequency telemetry and state communication via chromatic shifts and pulse animations.',
    icon: CircleIcon,
    artSeed: 'telemetry',
  },
  {
    id: '04',
    title: 'BINARY_INPUT',
    description: 'Raw terminal-inspired control interfaces. Dropdowns, sliders, and buttons with immediate systemic feedback.',
    icon: TriangleIcon,
    artSeed: 'control_io',
  },
];

const BrufezPanelsPage = () => {
  useSeo({
    title: 'Brufez | Two-Panel Layout',
    description: 'Demonstration of the Brufez dual-panel architecture for information-dense interfaces.',
    keywords: ['Brufez', 'design system', 'layout', 'two-panel', 'brutalist'],
  });

  const [activeItem, setActiveCommand] = useState(panelData[0]);

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-emerald-500/30">
      {/* LEFT PANEL: The Index */}
      <div className="w-full xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-20">
          <Link
            to="/brufez"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Back_to_Spec</span>
          </Link>
          <BreadcrumbTitle
            title="Layout_Panels"
            breadcrumbs={['fc', 'brufez', 'view']}
            variant="brutalist"
          />
          <p className="text-gray-400 font-mono text-[10px] uppercase tracking-[0.2em] mt-4">
            {'//'} DUAL_COLUMN_ARCHITECTURE_PROTOCOL
          </p>
        </header>

        <div className="flex flex-col pb-32 gap-4">
          <h2 className="font-mono text-[10px] text-emerald-500 uppercase tracking-[0.4em] mb-4 border-b border-white/10 pb-4">
            CORE_ARCHITECTURE_NODES
          </h2>
          {panelData.map((item) => (
            <button
              key={item.id}
              onMouseEnter={() => setActiveCommand(item)}
              onClick={() => setActiveCommand(item)}
              className="relative pl-8 py-6 group cursor-pointer text-left border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all"
            >
              {/* Active Indicator */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 ${
                  activeItem?.id === item.id
                    ? 'bg-emerald-500 h-full'
                    : 'bg-transparent h-0 group-hover:h-full group-hover:bg-white/20'
                }`}
              />

              <div className="flex items-center justify-between pr-8">
                <div className="flex items-center gap-6">
                  <span className={`font-mono text-xs transition-colors ${activeItem?.id === item.id ? 'text-emerald-500' : 'text-gray-700'}`}>
                    {item.id}
                  </span>
                  <h3
                    className={`text-2xl font-black tracking-tighter uppercase transition-all duration-300 ${
                      activeItem?.id === item.id
                        ? 'text-white translate-x-2'
                        : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  >
                    {item.title}
                  </h3>
                </div>

                <div className={`transition-all duration-300 ${activeItem?.id === item.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}>
                  <CaretRightIcon weight="bold" className="text-emerald-500" size={24} />
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-20 border-t border-white/10 text-gray-800 font-mono text-[9px] uppercase tracking-[0.5em]">
          VIEW_ID: Brufez_v1.0.4 // NODE_ALPHA
        </div>
      </div>

      {/* RIGHT PANEL: The Stage (Desktop Only) */}
      <div className="hidden xl:flex fixed right-0 top-0 h-screen w-1/2 bg-[#050505] overflow-hidden border-l border-white/10 z-20 flex-col">
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeItem && (
              <motion.div
                key={activeItem.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex flex-col justify-end p-20"
              >
                {/* Background Art */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <GenerativeArt
                    seed={activeItem.artSeed}
                    className="w-full h-full opacity-40 scale-150 filter grayscale"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40" />
                  {/* Subtle Noise */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
                </div>

                <div className="relative z-10 space-y-12">
                  <div className="flex items-center gap-4">
                    <div className="p-4 border border-emerald-500/20 bg-emerald-500/10">
                      <activeItem.icon size={48} weight="fill" className="text-emerald-500" />
                    </div>
                    <div className="h-px flex-grow bg-white/10" />
                  </div>

                  <div className="space-y-6">
                    <h2 className="text-7xl font-black text-white uppercase tracking-tighter leading-none m-0">
                      {activeItem.title}
                    </h2>
                    <p className="text-xl text-gray-400 font-light leading-relaxed max-w-xl">
                      {activeItem.description}
                    </p>
                  </div>

                  <div className="pt-8 border-t border-white/5 flex gap-12 font-mono">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest">Comp_Type</span>
                      <span className="text-xs font-bold text-white">LAYOUT_CORE</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] text-gray-600 uppercase tracking-widest">Art_Seed</span>
                      <span className="text-xs font-bold text-emerald-500 uppercase">{activeItem.artSeed}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Panel Footer */}
        <div className="p-12 border-t border-white/10 bg-black/50 backdrop-blur-md z-30 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <FlaskIcon size={24} weight="fill" className="text-emerald-500" />
            <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-gray-500">Brufez_Stage_Subroutine</span>
          </div>
          <div className="flex gap-4">
             <div className="w-2 h-2 bg-emerald-500 animate-pulse" />
             <div className="w-2 h-2 bg-white/10" />
             <div className="w-2 h-2 bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrufezPanelsPage;
