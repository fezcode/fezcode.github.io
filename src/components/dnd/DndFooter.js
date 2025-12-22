import React, { useContext } from 'react';
import { DndContext } from '../../context/DndContext';
import { Scroll } from '@phosphor-icons/react';

const DndFooter = () => {
  const { bgImageName } = useContext(DndContext);

  return (
    <footer className="relative mt-24 border-t-2 border-dnd-gold bg-dnd-crimson/95 py-16 px-6 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center text-center md:text-left">
        <div className="space-y-4">
          <div className="flex justify-center md:justify-start">
            <span className="text-4xl font-playfairDisplay font-black uppercase tracking-tighter dnd-gold-gradient-text">
              S & F
            </span>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/70">
            From Serfs and Frauds
          </p>
        </div>

        <div className="flex flex-col items-center gap-4 text-white">
          <Scroll size={32} weight="duotone" className="opacity-60" />
          <p className="font-arvo italic text-sm text-white max-w-xs text-center leading-relaxed">
            "Every chronicle is a living memory of those who braved the dark."
          </p>
        </div>

        <div className="space-y-4 md:text-right">
          <p className="font-mono text-[9px] uppercase tracking-widest text-white">
            Digital Archive Kernel // v0.8.7
          </p>
          <p className="font-mono text-[9px] uppercase tracking-widest text-white">
            Wallpaper Source // <span className="text-white font-bold">{bgImageName || 'Default_Vault'}</span>
          </p>
          <div className="h-px w-12 bg-dnd-gold ml-auto opacity-50" />
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-white">
            &copy; {new Date().getFullYear()} Archives of the Realm
          </p>
        </div>
      </div>
    </footer>
  );
};

export default DndFooter;
