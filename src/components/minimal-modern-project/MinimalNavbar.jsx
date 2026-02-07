import React from 'react';
import { Link } from 'react-router-dom';

const MinimalNavbar = ({ title, repoLink }) => {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 font-instr-sans">
      <div className="max-w-[1400px] mx-auto px-8 h-24 flex items-center justify-between">
        <Link to="/" className="group flex items-center gap-2">
          <span className="text-sm font-bold tracking-[0.3em] uppercase text-black">
            Fezcodex
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        </Link>

        <div className="flex items-center gap-10 text-[10px] font-bold uppercase tracking-[0.3em] text-black/40">
          <Link to="/projects" className="hover:text-black transition-colors">
            Projects
          </Link>
          <Link to="/about" className="hover:text-black transition-colors">
            About
          </Link>
          {repoLink && (
            <a
              href={repoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 bg-black text-white hover:bg-black/80 transition-colors"
            >
              Github
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};

export default MinimalNavbar;
