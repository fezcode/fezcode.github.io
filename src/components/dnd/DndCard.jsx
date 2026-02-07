import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const DndCard = ({ title, description, link, icon }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full"
    >
      <Link
        to={link}
        className="block group relative p-6 md:p-12 dnd-fantasy-card text-center h-full min-h-[300px] md:min-h-[450px] flex flex-col items-center justify-center border-2 border-black/20 shadow-2xl overflow-hidden"
      >
        {/* Silk Ribbon */}
        <div className="dnd-ribbon transition-transform duration-500 group-hover:translate-y-2 hidden md:block" />

        {/* Background Runes */}
        <div className="dnd-card-rune top-4 md:top-12 left-4 md:left-12 -rotate-12">
          ᚦ
        </div>
        <div className="dnd-card-rune bottom-4 md:bottom-12 right-4 md:right-12 rotate-12">
          ᛉ
        </div>

        {/* Ink Splatters */}
        <div className="dnd-ink-splatter w-8 h-8 top-1/4 right-8" />
        <div className="dnd-ink-splatter w-4 h-4 bottom-1/3 left-12" />

        {/* Parchment Texture Overlay */}
        <div className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]" />

        {/* Inner Border Shadow - Darker */}
        <div className="absolute inset-4 border border-black/5 pointer-events-none" />
        <div className="absolute inset-6 border border-dnd-gold/10 pointer-events-none group-hover:border-dnd-gold/20 transition-colors" />

        {/* Ornate corners - larger and more detailed */}
        <div className="absolute top-4 md:top-6 left-4 md:left-6 w-8 md:w-12 h-8 md:h-12 border-t-2 border-l-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute top-4 md:top-6 right-4 md:right-6 w-8 md:w-12 h-8 md:h-12 border-t-2 border-r-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 w-8 md:w-12 h-8 md:h-12 border-b-2 border-l-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute bottom-4 md:bottom-6 right-4 md:right-6 w-8 md:w-12 h-8 md:h-12 border-b-2 border-r-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />

        <div className="mb-6 md:mb-10 text-dnd-crimson/60 group-hover:text-dnd-crimson group-hover:scale-125 transition-all duration-700 drop-shadow-[0_0_15px_rgba(74,4,4,0.2)] relative z-10">
          {icon}
        </div>

        <h3 className="text-3xl md:text-5xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-4 md:mb-6 transition-transform duration-500 group-hover:-translate-y-1 relative z-10">
          {title}
        </h3>

        <p className="text-sm md:text-lg font-arvo text-black/70 group-hover:text-black transition-all duration-500 leading-relaxed max-w-[280px] relative z-10">
          {description}
        </p>

        {/* Mini Wax Seal at bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-4 group-hover:translate-y-0 pointer-events-none scale-50 hidden md:block">
          <div className="dnd-wax-seal">
            <span className="dnd-wax-seal-inner text-sm">SF</span>
          </div>
        </div>

        {/* Interaction hint - refined and darker */}
        <div className="mt-6 md:mt-10 pt-4 md:pt-8 border-t border-black/10 w-full flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-px w-8 bg-dnd-crimson/20" />
            <div className="w-1.5 h-1.5 bg-dnd-gold rounded-full animate-pulse shadow-[0_0_8px_var(--dnd-gold)]" />
            <div className="h-px w-8 bg-dnd-crimson/20" />
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-black/60">
            Open_Script
          </span>
        </div>
      </Link>
    </motion.div>
  );
};

export default DndCard;
