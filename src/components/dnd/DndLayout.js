import React, { useContext, useEffect, useState } from 'react';
import { DndContext } from '../../context/DndContext';
import DndNavbar from './DndNavbar';
import DndFooter from './DndFooter';
import dndWallpapers from '../../utils/dndWallpapers';
import { parseWallpaperName } from '../../utils/dndUtils';
import '../../styles/dnd-refactor.css';

const DndLayout = ({ children }) => {
  const { setBgImageName } = useContext(DndContext);
  const [bgImage, setBgImage] = useState('');

  useEffect(() => {
    const randomImage = dndWallpapers[Math.floor(Math.random() * dndWallpapers.length)];
    setBgImage(randomImage);
    setBgImageName(parseWallpaperName(randomImage.split('/').pop()));
  }, [setBgImageName]);

  return (
    <div className="dnd-theme-root min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000"
          style={{
            backgroundImage: bgImage ? `url(${process.env.PUBLIC_URL}${bgImage})` : 'none',
            filter: 'brightness(0.45) contrast(1.1)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 flex flex-col min-h-screen">
        <DndNavbar />
        <main className="flex-grow pt-24 pb-12">
          {children}
        </main>
        <DndFooter />
      </div>

      {/* Global Vignette */}
      <div className="fixed inset-0 pointer-events-none z-10 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]" />
    </div>
  );
};

export default DndLayout;