import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useVisualSettings } from '../context/VisualSettingsContext';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BugIcon,
  SparkleIcon,
  LayoutIcon,
  ArrowLeftIcon,
  LineSegmentsIcon,
} from '@phosphor-icons/react';
import Seo from '../components/Seo';
import GenerativeArt from '../components/GenerativeArt';
import LuxeArt from '../components/LuxeArt';

const DesignSelectionPage = () => {
  const navigate = useNavigate();
  const { setFezcodexTheme } = useVisualSettings();

  const activateTerracotta = () => {
    setFezcodexTheme('terracotta');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black flex flex-col">
      <Seo
        title="Design System | Fezcodex"
        description="Choose your design exploration: Brutalist Brufez or Refined Fezluxe."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex-1 flex flex-col">
        <header className="mb-24 pt-12 border-b border-black/10 pb-12 text-center md:text-left">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors"
          >
            <ArrowLeftIcon /> Back to Root
          </Link>
          <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
            Aesthetics
          </h1>
          <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
            Explore the visual foundations of Fezcodex. Choose between raw
            systemic brutalism or refined architectural elegance.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-16 flex-1">
          {/* BRUFEZ CARD */}
          <Link to="/design/brufez" className="group block relative">
            <motion.div
              whileHover={{ y: -10 }}
              className="h-full bg-[#050505] border border-white/5 p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-2xl transition-all duration-500"
            >
              <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                <GenerativeArt
                  seed="brufez"
                  className="w-full h-full grayscale"
                />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-white/5 border border-white/10 text-[#10B981] rounded-sm group-hover:bg-[#10B981] group-hover:text-black transition-colors">
                  <BugIcon size={32} weight="fill" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-white uppercase tracking-tighter leading-none">
                    Brufez
                  </h2>
                  <p className="font-mono text-xs text-gray-500 uppercase tracking-widest leading-relaxed">
                    Systemic transparency. Celebrated structural logic, 1PX
                    borders, and high-frequency contrast.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 group-hover:text-white transition-colors">
                  Launch_Spec
                </span>
                <ArrowRightIcon
                  className="text-gray-600 group-hover:text-[#10B981] group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </div>
            </motion.div>
          </Link>

          {/* TERRACOTTA CARD */}
          <button
            type="button"
            onClick={activateTerracotta}
            className="group block relative text-left"
          >
            <motion.div
              whileHover={{ y: -10 }}
              className="h-full bg-[#F3ECE0] border border-[#1A161320] p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-[0_30px_60px_-30px_#1A161330] transition-all duration-500 relative"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(600px 400px at 80% -10%, #E8DECE 0%, transparent 55%), radial-gradient(500px 500px at 0% 110%, #EDE3D3 0%, transparent 50%)',
                }}
              />

              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-[#C96442]/10 text-[#9E4A2F] border border-[#C96442]/30 rounded-sm group-hover:bg-[#C96442] group-hover:text-[#F3ECE0] group-hover:border-[#C96442] transition-all duration-500">
                  <LineSegmentsIcon size={32} weight="light" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-playfairDisplay italic text-[#1A1613] leading-none tracking-tight">
                    Terracotta
                  </h2>
                  <p className="font-mono text-xs text-[#2E2620]/70 uppercase tracking-widest leading-relaxed">
                    Weighted editorial. Bone paper, hairline rules, serif wordmarks that hang true.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-[#1A161320] flex justify-between items-center relative z-10">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#2E2620]/50 group-hover:text-[#9E4A2F] transition-colors">
                  Hang_Plumb
                </span>
                <ArrowRightIcon
                  className="text-[#2E2620]/40 group-hover:text-[#C96442] group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </div>
            </motion.div>
          </button>

          {/* FEZLUXE CARD */}
          <Link to="/design/fezluxe" className="group block relative">
            <motion.div
              whileHover={{ y: -10 }}
              className="h-full bg-white border border-black/5 p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-xl transition-all duration-500"
            >
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                <LuxeArt
                  seed="fezluxe"
                  className="w-full h-full mix-blend-multiply"
                />
              </div>

              <div className="space-y-8 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-[#F5F5F0] text-[#8D4004] rounded-full shadow-sm group-hover:bg-[#1A1A1A] group-hover:text-white transition-all duration-500">
                  <SparkleIcon size={32} weight="light" />
                </div>
                <div className="space-y-4">
                  <h2 className="text-5xl font-playfairDisplay italic text-[#1A1A1A] leading-none">
                    Fezluxe
                  </h2>
                  <p className="font-outfit text-sm text-black/40 italic leading-relaxed">
                    Architectural elegance. Generous white space, soft depth,
                    and sophisticated typographic hierarchy.
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center relative z-10">
                <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30 group-hover:text-[#8D4004] transition-colors">
                  Explore Archive
                </span>
                <ArrowRightIcon
                  className="text-black/20 group-hover:text-[#8D4004] group-hover:translate-x-2 transition-all"
                  size={24}
                />
              </div>
            </motion.div>
          </Link>
        </div>

        <footer className="mt-24 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-black/30 font-outfit text-[10px] uppercase tracking-[0.3em]">
          <div className="flex items-center gap-2">
            <LayoutIcon size={14} />
            <span>Tri Theme Protocol Alpha</span>
          </div>
          <span>Fezcodex Studio — 2026</span>
        </footer>
      </div>
    </div>
  );
};

export default DesignSelectionPage;
