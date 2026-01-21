import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ListIcon, MagnifyingGlassIcon } from '@phosphor-icons/react';

const LuxeNavbar = ({
  toggleSidebar,
  isSidebarOpen,
  isSearchVisible,
  toggleSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-[60] transition-all duration-500 bg-[#FDFCFB]/80 backdrop-blur-md border-b ${
        isScrolled
          ? 'py-4 border-[#1A1A1A]/5 shadow-sm'
          : 'py-6 border-transparent'
      }`}
    >
      {' '}
      <div className="mx-auto max-w-[1800px] px-6 md:px-12 flex justify-between items-center text-[#1A1A1A]">
        {/* Left: Sidebar Toggle & Brand */}
        <div className="flex items-center gap-6">
          <button
            onClick={toggleSidebar}
            className="text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors focus:outline-none"
            aria-label="Toggle Sidebar"
          >
            <ListIcon size={24} weight="light" />
          </button>

          <Link to="/" className="flex items-center gap-2 group">
            <span className="font-playfairDisplay text-xl font-normal tracking-tight text-[#1A1A1A]">
              Fezcodex
            </span>
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          <Link
            to="/about/luxe"
            className="hidden md:flex items-center gap-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
          >
            <span className="font-outfit text-xs font-medium uppercase tracking-widest">
              About
            </span>
          </Link>

          <button
            onClick={toggleSearch}
            className="flex items-center gap-2 text-[#1A1A1A]/60 hover:text-[#1A1A1A] transition-colors"
            aria-label="Toggle Search"
          >
            <MagnifyingGlassIcon size={20} weight="light" />
            <span className="hidden md:inline font-outfit text-xs font-medium uppercase tracking-widest">
              Search
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default LuxeNavbar;
