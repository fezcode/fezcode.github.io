import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';

const DndCard = ({
                   title,
                   description,
                   link,
                   icon,
                 }) => {
  return (
    <motion.div
      whileHover={{y: -10}}
      transition={{type: 'spring', stiffness: 300}}
    >
      <Link
        to={link}
        className="block group relative p-12 dnd-fantasy-card text-center h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-black/40 shadow-2xl overflow-hidden"
      >
        {/* Parchment Texture Overlay */}
        <div
          className="absolute inset-0 opacity-[0.05] group-hover:opacity-[0.08] transition-opacity pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/handmade-paper.png')]"/>

        {/* Inner Border Shadow - Darker */}
        <div className="absolute inset-4 border border-black/5 pointer-events-none" />
        <div className="absolute inset-6 border border-dnd-gold/10 pointer-events-none group-hover:border-dnd-gold/20 transition-colors" />

        {/* Ornate corners - larger and more detailed */}
        <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />
        <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2 border-dnd-gold opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500" />

        <div className="mb-10 text-dnd-crimson/60 group-hover:text-dnd-crimson group-hover:scale-125 transition-all duration-700 drop-shadow-[0_0_15px_rgba(74,4,4,0.2)]">
          {icon}
        </div>

        <h3 className="text-4xl md:text-5xl font-playfairDisplay italic font-black text-dnd-crimson uppercase tracking-tighter mb-6 transition-transform duration-500 group-hover:-translate-y-1">
          {title}
        </h3>

        <p className="text-lg font-arvo text-black/70 group-hover:text-black transition-all duration-500 leading-relaxed max-w-[280px]">
          {description}
        </p>

        {/* Interaction hint - refined and darker */}
        <div className="mt-10 pt-8 border-t border-black/10 w-full flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center gap-4">
             <div className="h-px w-8 bg-dnd-crimson/20" />
             <div className="w-1.5 h-1.5 bg-dnd-gold rounded-full animate-pulse shadow-[0_0_8px_var(--dnd-gold)]" />
             <div className="h-px w-8 bg-dnd-crimson/20" />
          </div>
          <span className="text-[9px] font-mono font-bold uppercase tracking-[0.5em] text-black/60">
            Open_Script
          </span>
        </div>
      </Link></motion.div>
  );
};

export default DndCard;
