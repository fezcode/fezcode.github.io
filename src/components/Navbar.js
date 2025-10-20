import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fez from './Fez';
import { Sidebar, User, BookOpen } from '@phosphor-icons/react';

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
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
      className={`backdrop-blur-sm sticky top-0 z-30 transition-colors border-b ${isScrolled ? 'border-gray-700/50' : 'border-transparent'} relative`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute top-1/2 -translate-y-1/2 left-4 text-red-500 focus:outline-none hidden md:block"
      >
        <Sidebar size={24} />
      </button>
      <div className="container mx-auto flex justify-between items-center p-4 text-white">
        <div className="md:hidden flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className="text-white focus:outline-none"
          >
            <Sidebar size={24} />
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <Fez />
            <span className="text-2xl font-semibold tracking-tight">
              fez<span className="text-primary-400">codex</span>
            </span>
          </Link>
        </div>
        <div className="hidden md:flex items-center space-x-2 ml-16">
          {!isSidebarOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <Fez />
              <span className="text-2xl font-semibold tracking-tight">
                fez<span className="text-primary-400">codex</span>
              </span>
            </Link>
          )}
        </div>
        {isSidebarOpen && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <span
              className="text-lg font-normal tracking-tight"
              style={{ fontFamily: "'Arvo', 'Playfair Display', serif" }}
            >
              The Fez of <span className="text-primary-400">Code</span>
            </span>
          </div>
        )}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/about"
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors"
          >
            <User size={24} />
            <span>About</span>
          </Link>
          <Link
            to="/blog"
            className="flex items-center space-x-3 text-gray-300 hover:text-white hover:bg-gray-800 px-3 py-2 rounded-md transition-colors"
          >
            <BookOpen size={24} />
            <span>Blog</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
