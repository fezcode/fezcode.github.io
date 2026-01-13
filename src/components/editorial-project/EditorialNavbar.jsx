import React from 'react';
import { Link } from 'react-router-dom';

const EditorialNavbar = ({ title, repoLink }) => {
  return (
    <nav className="border-b border-white/10 relative z-20 bg-black/50 backdrop-blur-sm">
      <div className="max-w-[2400px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-instr-serif italic text-2xl text-white tracking-tighter">Fezcodex</span>
        </Link>

        <div className="flex items-center gap-6 text-sm font-medium text-white/70">
          <Link to="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link to="/about" className="hover:text-white transition-colors">About</Link>
          <a href={repoLink || "https://github.com/fezcode"} target="_blank" rel="noopener noreferrer" className="bg-white text-black px-3 py-1.5 rounded hover:bg-white/90 transition-colors">GitHub</a>
        </div>
      </div>
    </nav>
  );
};

export default EditorialNavbar;