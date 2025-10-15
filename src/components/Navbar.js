import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Fez from './Fez';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`backdrop-blur-sm sticky top-0 z-40 transition-colors border-b ${isScrolled ? 'border-gray-700/50' : 'border-transparent'}`}>
      <div className="container mx-auto flex justify-between items-center p-4 text-white">
        <Link to="/" className="flex items-center space-x-2">
          <Fez />
          <span className="text-2xl font-semibold tracking-tight">fez<span className="text-primary-400">codex</span></span>
        </Link>
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-gray-300 transition-colors">Home</Link>
          <Link to="/about" className="text-sm font-medium hover:text-gray-300 transition-colors">About</Link>
          <Link to="/blog" className="text-sm font-medium hover:text-gray-300 transition-colors">Blog</Link>
          <Link to="/projects" className="text-sm font-medium hover:text-gray-300 transition-colors">Projects</Link>
          <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
            Play Wordle
          </a>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white focus:outline-none">
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900/90 backdrop-blur-sm">
          <div className="container mx-auto flex flex-col items-center space-y-4 p-4">
            <Link to="/" className="text-white text-sm font-medium hover:text-gray-300 transition-colors" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="text-white text-sm font-medium hover:text-gray-300 transition-colors" onClick={toggleMenu}>About</Link>
            <Link to="/blog" className="text-white text-sm font-medium hover:text-gray-300 transition-colors" onClick={toggleMenu}>Blog</Link>
            <Link to="/projects" className="text-white text-sm font-medium hover:text-gray-300 transition-colors" onClick={toggleMenu}>Projects</Link>
            <a href="https://www.nytimes.com/games/wordle/index.html" target="_blank" rel="noopener noreferrer" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-full transition-colors" onClick={toggleMenu}>
              Play Wordle
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
