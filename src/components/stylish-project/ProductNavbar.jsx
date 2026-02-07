import React from 'react';
import { Link } from 'react-router-dom';

const ProductNavbar = ({ productName = 'Claude Code', demoLink = '#' }) => {
  return (
    <nav className="sticky top-0 z-50 bg-product-bg/80 backdrop-blur-xl border-b border-white/5 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link
            to="/"
            className="text-xl font-instr-serif italic text-white hover:text-product-card-icon transition-colors"
          >
            fezcodex
          </Link>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <Link
            to="/projects"
            className="font-nunito text-product-body-text hover:text-white transition-colors hidden md:block"
          >
            Projects
          </Link>
          <div className="h-4 w-px bg-white/10 hidden md:block"></div>
          <span className="font-nunito text-product-card-text font-bold hidden md:block uppercase tracking-widest text-xs">
            {productName}
          </span>
        </div>

        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="#integrations"
              className="text-sm font-nunito text-product-body-text hover:text-white transition-colors"
            >
              Exploration
            </a>
            <a
              href="#features"
              className="text-sm font-nunito text-product-body-text hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#technical"
              className="text-sm font-nunito text-product-body-text hover:text-white transition-colors"
            >
              Stack
            </a>
            <a
              href="#details"
              className="text-sm font-nunito text-product-body-text hover:text-white transition-colors"
            >
              Philosophy
            </a>
          </div>
          <a
            href={demoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-product-card-icon hover:bg-product-card-icon/90 text-product-bg font-nunito font-black px-5 py-2 rounded-lg text-xs uppercase tracking-widest transition-all transform hover:scale-105 active:scale-95"
          >
            Visit Project
          </a>{' '}
        </div>
      </div>
    </nav>
  );
};

export default ProductNavbar;
