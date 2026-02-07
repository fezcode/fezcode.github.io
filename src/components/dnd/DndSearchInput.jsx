import React from 'react';
import { MagnifyingGlassIcon } from '@phosphor-icons/react';

const DndSearchInput = ({ value, onChange, placeholder = "Search the archives..." }) => {
  return (
    <div className="relative max-w-md mx-auto mb-8 md:mb-16 group">
      <div className="absolute inset-0 bg-dnd-gold/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative flex items-center">
        <div className="absolute left-5 text-dnd-gold">
          <MagnifyingGlassIcon size={24} weight="duotone" />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-[#1a0f0a] border-2 border-dnd-gold/50 rounded-full py-4 pl-14 pr-6 text-[#fcfaf2] font-arvo placeholder-dnd-gold/40 focus:outline-none focus:border-dnd-gold focus:ring-2 focus:ring-dnd-gold/20 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
        />
        <div className="absolute right-4 w-2 h-2 rounded-full bg-dnd-gold/30 animate-pulse" />
      </div>

      {/* Decorative lines */}
      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-dnd-gold/20 to-transparent" />
    </div>
  );
};

export default DndSearchInput;
