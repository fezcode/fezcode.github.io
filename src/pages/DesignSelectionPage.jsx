import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon,
  BugIcon,
  SparkleIcon,
  LayoutIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react';
import Seo from '../components/Seo';
import GenerativeArt from '../components/GenerativeArt';
import LuxeArt from '../components/LuxeArt';

const DesignSelectionPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black flex flex-col">
      <Seo
        title="Design System | Fezcodex"
        description="Choose your design exploration: Brutalist Brufez or Refined Fezluxe."
      />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24 flex-1 flex flex-col">

        <header className="mb-24 pt-12 border-b border-black/10 pb-12 text-center md:text-left">
           <Link to="/" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-[#1A1A1A]/40 hover:text-[#8D4004] transition-colors">
               <ArrowLeftIcon /> Back to Root
           </Link>
           <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-6">
               Aesthetics
           </h1>
           <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed">
               Explore the visual foundations of Fezcodex. Choose between raw systemic brutalism or refined architectural elegance.
           </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 flex-1">

            {/* BRUFEZ CARD */}
            <Link to="/design/brufez" className="group block relative">
                <motion.div
                    whileHover={{ y: -10 }}
                    className="h-full bg-[#050505] border border-white/5 p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-2xl transition-all duration-500"
                >
                    <div className="absolute inset-0 opacity-[0.05] pointer-events-none group-hover:opacity-[0.1] transition-opacity">
                        <GenerativeArt seed="brufez" className="w-full h-full grayscale" />
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
                                Systemic transparency. Celebrated structural logic, 1PX borders, and high-frequency contrast.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-center relative z-10">
                        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-gray-600 group-hover:text-white transition-colors">
                            Launch_Spec
                        </span>
                        <ArrowRightIcon className="text-gray-600 group-hover:text-[#10B981] group-hover:translate-x-2 transition-all" size={24} />
                    </div>
                </motion.div>
            </Link>

            {/* FEZLUXE CARD */}
            <Link to="/design/fezluxe" className="group block relative">
                <motion.div
                    whileHover={{ y: -10 }}
                    className="h-full bg-white border border-black/5 p-12 flex flex-col justify-between rounded-sm overflow-hidden shadow-xl transition-all duration-500"
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none group-hover:opacity-[0.08] transition-opacity">
                        <LuxeArt seed="fezluxe" className="w-full h-full mix-blend-multiply" />
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
                                Architectural elegance. Generous white space, soft depth, and sophisticated typographic hierarchy.
                            </p>
                        </div>
                    </div>

                    <div className="mt-12 pt-8 border-t border-black/5 flex justify-between items-center relative z-10">
                        <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/30 group-hover:text-[#8D4004] transition-colors">
                            Explore Archive
                        </span>
                        <ArrowRightIcon className="text-black/20 group-hover:text-[#8D4004] group-hover:translate-x-2 transition-all" size={24} />
                    </div>
                </motion.div>
            </Link>

        </div>

        <footer className="mt-24 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6 text-black/30 font-outfit text-[10px] uppercase tracking-[0.3em]">
            <div className="flex items-center gap-2">
                <LayoutIcon size={14} />
                <span>Dual Theme Protocol Alpha</span>
            </div>
            <span>Fezcodex Studio — 2026</span>
        </footer>

      </div>
    </div>
  );
};

export default DesignSelectionPage;
