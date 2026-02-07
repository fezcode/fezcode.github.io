import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@phosphor-icons/react';

const MuseumNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-8 py-6 flex justify-between items-center transition-all duration-500 ${
        isScrolled
          ? 'bg-[#FDFAF5]/90 backdrop-blur-md border-b border-black/5 shadow-sm'
          : 'bg-[#FDFAF5] border-b border-transparent'
      }`}
    >
      <div className="flex-1">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-3 group text-[#1a1a1a]"
        >
          <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-500">
            <ArrowLeftIcon size={14} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] font-ibm-plex-mono">
            Collection
          </span>
        </button>
      </div>

      <div className="flex flex-col items-center flex-1">
        <span className="text-[11px] font-black uppercase tracking-[0.5em] text-black/20 mb-1 font-ibm-plex-mono">
          Fezcodex Archive
        </span>
      </div>

      <div className="flex-1 flex justify-end">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] font-ibm-plex-mono text-black/40">
          MUSEUM STYLE / 01
        </div>
      </div>
    </nav>
  );
};
export default MuseumNavbar;
