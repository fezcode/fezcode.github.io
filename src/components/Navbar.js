import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center p-4 text-white">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          My Awesome Blog
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-sm font-medium hover:text-gray-300 transition-colors">Home</Link>
          <Link to="/blog" className="text-sm font-medium hover:text-gray-300 transition-colors">Blog</Link>
          <Link to="/projects" className="text-sm font-medium hover:text-gray-300 transition-colors">Projects</Link>
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition-colors">
            Play Latest
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;