import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRightIcon, TerminalWindowIcon } from '@phosphor-icons/react';
import ArcaneSigil from './ArcaneSigil';
import { appIcons } from '../utils/appIcons';

const ArtifactCard = ({ app }) => {
  const AppIcon = appIcons[app.icon] || appIcons[`${app.icon}Icon`] || TerminalWindowIcon;

  return (
    <Link to={app.to} className="block w-full outline-none group h-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative flex flex-col h-full min-h-[340px] aspect-[2.5/3.5] bg-[#050508] p-1.5 rounded-md transition-all duration-700 shadow-2xl overflow-hidden isolate"
      >
        {/* Ornate Inner Frame */}
        <div className="absolute inset-2 border border-[#C5A059]/20 group-hover:border-[#C5A059]/60 transition-colors duration-700 pointer-events-none z-20 rounded-sm" />
        <div className="absolute inset-[10px] border border-white/5 group-hover:border-[#4A90E2]/30 transition-colors duration-700 pointer-events-none z-20" />

        {/* Corner Accents */}
        <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
        <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
        <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />
        <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#C5A059] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20" />

        {/* Sigil Background Container */}
        <div className="absolute inset-2 flex items-center justify-center overflow-hidden z-0">
          <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-[#030305] z-10" />
          <ArcaneSigil
            seed={app.title}
            color="#C5A059"
            className="w-[120%] h-[120%] opacity-10 group-hover:opacity-40 transition-all duration-[2s] transform group-hover:scale-110 ease-out"
          />
        </div>

        {/* Top Section - Icon & Meta */}
        <div className="relative flex justify-between items-center p-6 z-10">
          <div className="w-12 h-12 flex items-center justify-center text-[#C5A059]/50 group-hover:text-[#C5A059] group-hover:drop-shadow-[0_0_8px_rgba(197,160,89,0.8)] transition-all duration-700">
             <AppIcon size={32} weight="thin" />
          </div>
          <div className="w-8 h-8 flex items-center justify-center text-white/20 group-hover:text-[#4A90E2] transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-700">
             <ArrowUpRightIcon size={20} weight="thin" />
          </div>
        </div>

        {/* Content Section - Bottom Heavy */}
        <div className="relative flex-1 flex flex-col justify-end p-6 z-10">
          <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#C5A059]/20 to-transparent mb-4 group-hover:via-[#C5A059]/80 transition-colors duration-700" />

          <h3 className="text-3xl font-instr-serif italic text-gray-300 group-hover:text-white mb-2 transition-colors tracking-wide drop-shadow-md leading-tight text-center">
            {app.title}
          </h3>
          <p className="text-xs font-outfit text-gray-500 group-hover:text-gray-300 line-clamp-3 leading-relaxed transition-colors font-light text-center">
            {app.description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
};

export default ArtifactCard;
