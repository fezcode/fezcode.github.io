import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  FeatherIcon,
  SparkleIcon,
  CompassIcon,
  TerminalIcon,
  CheckCircleIcon,
  WarningIcon,
  TrophyIcon,
  InfoIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import LuxeArt from '../../components/LuxeArt';
import LuxeModal from '../../components/LuxeModal';
import CustomDropdown from '../../components/CustomDropdown';
import { useSidePanel } from '../../context/SidePanelContext';

const FezluxeDesignPage = () => {
  const { addToast } = useToast();
  const { openSidePanel } = useSidePanel();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('option_01');

  const demoSidePanel = () => {
    openSidePanel(
      'LUXE_PROTOCOL_SIGMA',
      <div className="space-y-8">
        <div className="p-6 border-l-2 border-[#8D4004]/20 bg-[#8D4004]/5">
          <h4 className="font-playfairDisplay text-xl italic text-[#1A1A1A] m-0">Refined_Data_Stream</h4>
          <p className="font-outfit text-[10px] text-[#1A1A1A]/40 uppercase tracking-widest mt-2">Synchronized with secondary vault.</p>
        </div>
        <p className="font-outfit text-sm text-[#1A1A1A]/70 leading-relaxed italic">
          The SidePanel in Luxe configuration emphasizes white space and typographic hierarchy, providing a sophisticated layer for deep-dive information.
        </p>
        <div className="flex flex-col gap-2">
          <div className="h-px bg-black/5 w-full" />
          <div className="h-px bg-black/5 w-3/4" />
          <div className="h-px bg-[#8D4004]/20 w-1/2" />
        </div>
      </div>,
      600
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pt-24 pb-32 overflow-x-hidden">
      <Seo
        title="Fezluxe | Design Language Spec"
        description="System documentation for the Fezluxe design language. A study in digital sophistication and architectural elegance."
        keywords={['Fezluxe', 'design system', 'luxe', 'ui', 'fezcodex']}
      />

      <div className="fixed inset-0 opacity-[0.02] pointer-events-none z-0">
         <LuxeArt seed="Design System" className="w-full h-full mix-blend-multiply" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">

        {/* Header Section */}
        <header className="mb-32 pt-12 border-b border-black/10 pb-20 text-center">
           <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-3 px-4 py-2 border border-black/10 rounded-full bg-white/40 mb-8 cursor-pointer hover:bg-white transition-colors"
              onClick={() => navigate('/design')}
           >
               <ArrowLeftIcon size={16} className="text-[#8D4004]" />
               <span className="font-outfit text-[10px] uppercase tracking-[0.3em] text-black/60">Back to Selection</span>
           </motion.div>

           <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 1 }}
              className="font-playfairDisplay text-7xl md:text-9xl lg:text-[10rem] text-[#1A1A1A] leading-[0.8] mb-12 tracking-tighter"
           >
               FEZ<br/><span className="italic text-black/40">LUXE</span>
           </motion.h1>

           <div className="flex justify-center gap-12 text-[10px] font-outfit uppercase tracking-[0.4em] text-black/30">
               <span className="flex items-center gap-2"><FeatherIcon size={14} /> Sophistication</span>
               <span className="flex items-center gap-2"><SparkleIcon size={14} /> Precision</span>
               <span className="flex items-center gap-2"><CompassIcon size={14} /> Clarity</span>
           </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-32">

          {/* LEFT COLUMN: Philosophy */}
          <div className="lg:col-span-7 space-y-32">
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <span className="font-playfairDisplay text-6xl text-[#1A1A1A]/10 italic">01</span>
                    <h2 className="text-4xl font-playfairDisplay italic text-[#1A1A1A]">Core Philosophy</h2>
                    <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="prose prose-stone prose-lg max-w-none">
                    <p className="text-2xl text-[#1A1A1A]/80 font-light leading-relaxed italic">
                        Fezluxe is the evolution of the digital sanctuary. It transcends the "raw" to find the "refined"—where structure becomes architectural and feedback becomes intuitive.
                    </p>

                    <div className="mt-20 space-y-20">
                        <div className="space-y-6">
                            <h4 className="font-playfairDisplay text-3xl text-[#1A1A1A]">Refined Architecture</h4>
                            <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed">
                                Structure is defined by generous white space and soft depth. We avoid the rigid 1PX grid in favor of subtle borders (#1A1A1A/5) and sophisticated backdrops. Every element breathes, creating a sense of calm and intentionality.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-playfairDisplay text-3xl text-[#1A1A1A]">Chromatic Sophistication</h4>
                            <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed">
                                The palette centers on a soft Parchment (<span className="text-[#8D4004] font-mono">#F5F5F0</span>) and a deep Obsidian (<span className="text-[#8D4004] font-mono">#1A1A1A</span>). Our accent, Burnished Amber (<span className="text-[#8D4004] font-mono">#8D4004</span>), is used sparingly to draw focus without overwhelming the senses.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <h4 className="font-playfairDisplay text-3xl text-[#1A1A1A]">Implicit Intelligence</h4>
                            <p className="font-outfit text-sm text-[#1A1A1A]/60 leading-relaxed">
                                Fezluxe hides the "noise" but celebrates the "data". Version IDs and timestamps are transformed into elegant metadata tags. We use <span className="italic text-[#8D4004]">Sentence Case</span> and refined icons to treat information as a curated exhibit.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Components */}
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <span className="font-playfairDisplay text-6xl text-[#1A1A1A]/10 italic">02</span>
                    <h2 className="text-4xl font-playfairDisplay italic text-[#1A1A1A]">Interactive Triggers</h2>
                    <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="bg-white/40 backdrop-blur-md border border-black/5 p-12 rounded-sm space-y-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <button className="w-full py-4 bg-[#1A1A1A] text-white font-outfit text-xs uppercase tracking-[0.3em] hover:bg-[#8D4004] transition-all rounded-full shadow-lg">
                            Primary Action
                        </button>
                        <button className="w-full py-4 border border-black/10 text-black/60 hover:text-black hover:bg-white transition-all font-outfit text-xs uppercase tracking-widest rounded-full">
                            Secondary Node
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-4">
                            <label className="font-outfit text-[10px] uppercase tracking-widest text-black/30">Selection Interface</label>
                            <CustomDropdown
                                fullWidth
                                options={[
                                    {label: 'REFINED_OBSERVATION', value: 'option_01'},
                                    {label: 'SILK_PROTOCOL', value: 'option_02'},
                                    {label: 'AMBER_SYNTHESIS', value: 'option_03'},
                                ]}
                                value={dropdownVal}
                                onChange={setDropdownVal}
                                variant="paper"
                            />
                        </div>
                        <div className="flex flex-col justify-end gap-6 pb-2">
                            <div className="flex items-center gap-4">
                                <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                                <span className="font-outfit text-[10px] uppercase tracking-widest text-black/60">Active Status</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="w-3 h-3 rounded-full bg-black/5" />
                                <span className="font-outfit text-[10px] uppercase tracking-widest text-black/30">Standby Mode</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
          </div>

          {/* RIGHT COLUMN: Specifics */}
          <div className="lg:col-span-5 space-y-32">

            {/* Typography */}
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <span className="font-playfairDisplay text-6xl text-[#1A1A1A]/10 italic">03</span>
                    <h2 className="text-4xl font-playfairDisplay italic text-[#1A1A1A]">Typography</h2>
                    <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="bg-white p-12 space-y-12 shadow-sm border border-black/5">
                    <div className="space-y-2">
                        <span className="font-outfit text-[10px] text-[#8D4004] uppercase tracking-[0.3em]">Serif Display</span>
                        <h1 className="font-playfairDisplay text-6xl italic leading-none">Fezluxe Core</h1>
                    </div>

                    <div className="space-y-2">
                        <span className="font-outfit text-[10px] text-[#8D4004] uppercase tracking-[0.3em]">Serif Subhead</span>
                        <h2 className="font-playfairDisplay text-3xl italic leading-none">System Architecture</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-12 pt-8 border-t border-black/5">
                        <div className="space-y-4">
                            <span className="font-outfit text-[10px] text-black/30 uppercase tracking-[0.3em]">Body Text / Sans</span>
                            <p className="font-outfit text-sm text-black/70 leading-relaxed italic">
                                Used for prose and detailed descriptions. Chosen for its balance of readability and sophisticated character.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <span className="font-outfit text-[10px] text-black/30 uppercase tracking-[0.3em]">Interface / Mono</span>
                            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8D4004]">
                                Reserved for cryptographic IDs, system constants, and secondary metadata.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Colors */}
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <span className="font-playfairDisplay text-6xl text-[#1A1A1A]/10 italic">04</span>
                    <h2 className="text-4xl font-playfairDisplay italic text-[#1A1A1A]">Color Field</h2>
                    <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="space-y-px bg-black/5 border border-black/5 overflow-hidden">
                    {[
                        { name: 'LUXE_PARCHMENT', hex: '#F5F5F0', bg: 'bg-[#F5F5F0]', desc: 'Primary Foundation' },
                        { name: 'LUXE_OBSIDIAN', hex: '#1A1A1A', bg: 'bg-[#1A1A1A]', desc: 'Primary Text & Contrast' },
                        { name: 'BURNISHED_AMBER', hex: '#8D4004', bg: 'bg-[#8D4004]', desc: 'Architectural Accent' },
                        { name: 'SOFT_PAPER', hex: '#FDFCFB', bg: 'bg-[#FDFCFB]', desc: 'Surface Elevation' },
                        { name: 'LUXE_SILVER', hex: '#EBEBEB', bg: 'bg-[#EBEBEB]', desc: 'Secondary Metadata' },
                    ].map((color) => (
                        <div key={color.name} className="bg-white p-6 flex items-center justify-between group hover:bg-[#F5F5F0] transition-colors">
                            <div className="flex items-center gap-6">
                                <div className={`w-12 h-12 rounded-full border border-black/5 ${color.bg}`} />
                                <div className="space-y-1">
                                    <div className="text-xs font-bold font-outfit tracking-widest">{color.name}</div>
                                    <div className="text-[10px] font-outfit text-black/30 uppercase tracking-widest">{color.desc}</div>
                                </div>
                            </div>
                            <div className="font-mono text-[10px] text-black/20 uppercase tracking-widest group-hover:text-[#8D4004] transition-colors">{color.hex}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Status Feedback */}
            <section className="space-y-12">
                <div className="flex items-center gap-6">
                    <span className="font-playfairDisplay text-6xl text-[#1A1A1A]/10 italic">05</span>
                    <h2 className="text-4xl font-playfairDisplay italic text-[#1A1A1A]">Status Echo</h2>
                    <div className="flex-1 h-px bg-black/5" />
                </div>

                <div className="p-8 border border-black/5 bg-white/40 space-y-8">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => addToast({title: 'Integrity Sync', message: 'Synchronization sequence complete.', type: 'success'})}
                            className="p-4 bg-emerald-50 border border-emerald-100 text-emerald-700 font-outfit text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-emerald-100 transition-all rounded-sm"
                        >
                            <CheckCircleIcon size={18} weight="fill" /> Test_Success
                        </button>
                        <button
                            onClick={() => addToast({title: 'Milestone Discovered', message: 'Rare system metric established.', type: 'gold'})}
                            className="p-4 bg-amber-50 border border-amber-100 text-amber-700 font-outfit text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-amber-100 transition-all rounded-sm"
                        >
                            <TrophyIcon size={18} weight="fill" /> Test_Gold
                        </button>
                        <button
                            onClick={() => addToast({title: 'Sync Interrupted', message: 'Anomalous drift detected in node 04.', type: 'error'})}
                            className="p-4 bg-rose-50 border border-rose-100 text-rose-700 font-outfit text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-rose-100 transition-all rounded-sm"
                        >
                            <WarningIcon size={18} weight="fill" /> Test_Error
                        </button>
                        <button
                            onClick={() => addToast({title: 'Terminal Session', message: 'Initializing Luxe design protocols.', type: 'techno'})}
                            className="p-4 bg-cyan-50 border border-cyan-100 text-cyan-700 font-outfit text-[10px] uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-100 transition-all rounded-sm"
                        >
                            <TerminalIcon size={18} weight="fill" /> Test_Techno
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button onClick={() => setIsModalOpen(true)} className="py-4 bg-white border border-black/10 hover:border-[#8D4004] text-black/60 hover:text-[#8D4004] transition-all font-outfit text-[10px] uppercase tracking-widest rounded-sm">
                            Open Luxe Modal
                        </button>
                        <button onClick={demoSidePanel} className="py-4 bg-white border border-black/10 hover:border-[#8D4004] text-black/60 hover:text-[#8D4004] transition-all font-outfit text-[10px] uppercase tracking-widest rounded-sm">
                            Open Side Panel
                        </button>
                    </div>
                </div>
            </section>

          </div>
        </div>

        {/* Global Footer */}
        <footer className="mt-48 pt-12 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-8 font-outfit text-[10px] uppercase tracking-[0.4em] text-black/30">
            <div className="flex items-center gap-4">
                <CheckCircleIcon size={16} className="text-emerald-600" />
                <span>LUXE_SPEC_V2.1.0_SYNC</span>
            </div>
            <div className="text-right">
                <span>Synchronized with Mainframe: {new Date().toLocaleDateString()}</span>
            </div>
        </footer>
      </div>

      <LuxeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Architecture_Preview"
      >
        <div className="space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-2 border border-black/10 rounded-full bg-[#F5F5F0]">
                <InfoIcon size={16} className="text-[#8D4004]" />
                <span className="font-outfit text-[10px] uppercase tracking-widest text-black/60">Modal_Protocol_Verified</span>
            </div>
            <p className="font-outfit text-lg italic text-[#1A1A1A]/80 leading-relaxed">
                The LuxeModal component features a refined parchment background, elegant typography, and a balanced usage of soft shadows to create a sophisticated focal point for critical information.
            </p>
            <div className="h-48 w-full bg-[#FDFCFB] border border-black/5 flex items-center justify-center rounded-sm">
                <LuxeArt seed="Modal Content" className="w-full h-full opacity-40 mix-blend-multiply" />
            </div>
            <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-[#1A1A1A] text-white font-outfit text-xs uppercase tracking-[0.3em] rounded-full hover:bg-[#8D4004] transition-all"
            >
                Acknowledge Protocol
            </button>
        </div>
      </LuxeModal>
    </div>
  );
};

export default FezluxeDesignPage;