import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fez from './Fez';
import {
  ListIcon,
  UserIcon,
  MagnifyingGlassIcon
} from '@phosphor-icons/react';

const Navbar = ({
  toggleSidebar,
  isSidebarOpen,
  isSearchVisible,
  toggleSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`bg-[#050505]/80 backdrop-blur-md sticky top-0 z-[60] transition-all border-b ${
        isScrolled ? 'border-white/10 py-2' : 'border-transparent py-4'
      } relative`}
    >
      {/* Sidebar Toggle (Desktop) */}
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 left-6 text-gray-400 hover:text-emerald-500 transition-colors hidden md:block focus:outline-none"
        aria-label="Toggle Sidebar"
      >
        <ListIcon size={24} weight="bold" />
      </button>

      <div className="mx-auto max-w-7xl px-6 flex justify-between items-center text-white">
        {/* Mobile Left Section */}
        <div className="md:hidden flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white transition-colors focus:outline-none"
          >
            <ListIcon size={24} weight="bold" />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <Fez />
            <span className="text-xl font-black tracking-tighter uppercase font-mono">
              Fez<span className="text-emerald-500">codex</span>
            </span>
          </Link>
        </div>

        {/* Desktop Left Section (Logo) */}
        <div className="hidden md:flex items-center gap-2 ml-12">
          {!isSidebarOpen && (
            <Link to="/" className="flex items-center gap-2 group">
              <Fez />
              <span className="text-2xl font-black tracking-tighter uppercase font-mono transition-colors group-hover:text-emerald-500">
                Fez<span className="text-emerald-500 group-hover:text-white">codex</span>
              </span>
            </Link>
          )}
        </div>

        {/* Center Text (Optional / Conditional) */}
        {isSidebarOpen && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block">
            <span
              className="text-xs font-mono font-bold uppercase tracking-[0.3em] text-gray-500"
            >
              The Fez of <span className="text-emerald-500">Code</span>
            </span>
          </div>
        )}

        {/* Right Section (Actions) */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/about"
            className="group flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-sm transition-all"
          >
            <UserIcon size={20} weight="bold" />
            <span className="hidden md:inline text-[10px] font-mono font-bold uppercase tracking-widest">About</span>
          </Link>

          <button
            onClick={toggleSearch}
            className={`group flex items-center gap-2 px-3 py-2 rounded-sm transition-all ${
              isSearchVisible
                ? 'bg-emerald-500 text-black'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
            aria-label="Toggle Search"
          >
            <MagnifyingGlassIcon size={20} weight="bold" />
            <span className="hidden md:inline text-[10px] font-mono font-bold uppercase tracking-widest">Search</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
