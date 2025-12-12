import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaExternalLinkAlt, FaChevronRight } from 'react-icons/fa';
import Dot from './Dot';
import { useAnimation } from '../context/AnimationContext';

const ProjectCard = ({ project, size = 1 }) => {
  const colSpanClass =
    size === 2 ? 'md:col-span-2' : size === 3 ? 'md:col-span-3' : 'col-span-1';

  const [dots, setDots] = useState([]);
  const cardRef = useRef(null);
  const dotIdRef = useRef(0);
  const {
    isAnimationEnabled,
    showAnimationsHomepage,
    showAnimationsInnerPages,
  } = useAnimation();
  const location = useLocation();

  const handleAnimationEnd = useCallback((id) => {
    setDots((prevDots) => prevDots.filter((dot) => dot.id !== id));
  }, []);

  useEffect(() => {
    let interval;
    if (
      isAnimationEnabled &&
      ((location.pathname === '/' && showAnimationsHomepage) ||
        (location.pathname !== '/' && showAnimationsInnerPages))
    ) {
      const spawnDot = () => {
        if (cardRef.current && dots.length < 8) {
          const cardRect = cardRef.current.getBoundingClientRect();
          const newDot = {
            id: dotIdRef.current++,
            size: Math.floor(Math.random() * 3) + 2,
            // Cyan/Teal/Greenish Matrix tones
            color: `hsl(${Math.floor(Math.random() * 60) + 160}, ${Math.floor(Math.random() * 50) + 50}%, ${Math.floor(Math.random() * 30) + 60}%)`,
            initialX: Math.random() * cardRect.width,
            initialY: -10, // Start slightly off-screen top
            animationDuration: Math.random() * 4 + 3,
          };
          setDots((prevDots) => [...prevDots, newDot]);
        }
      };

      interval = setInterval(spawnDot, 600);
    }

    return () => clearInterval(interval);
  }, [
    dots.length,
    isAnimationEnabled,
    location.pathname,
    showAnimationsHomepage,
    showAnimationsInnerPages,
  ]);

  return (
    <div
      ref={cardRef}
      className={`group relative flex flex-col overflow-hidden rounded-xl bg-gray-900/90 border border-gray-800 hover:border-cyan-500/50 transition-all duration-500 ease-out hover:shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)] hover:-translate-y-1 ${colSpanClass} min-h-[300px]`}
    >
      {/* Background Grid Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Tech Accents - Top Right */}
      <div className="absolute top-0 right-0 p-2 z-20">
        <div className="flex gap-1">
          <div className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-cyan-500/50 transition-colors duration-300 delay-75"></div>
          <div className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-cyan-500/50 transition-colors duration-300 delay-100"></div>
          <div className="w-1 h-1 rounded-full bg-gray-700 group-hover:bg-cyan-500/50 transition-colors duration-300 delay-150"></div>
        </div>
      </div>

      {/* Dots Layer */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-xl">
        {dots.map((dot) => (
          <Dot
            key={dot.id}
            id={dot.id}
            size={dot.size}
            color={dot.color}
            initialX={dot.initialX}
            initialY={dot.initialY}
            animationDuration={dot.animationDuration}
            onAnimationEnd={handleAnimationEnd}
          />
        ))}
      </div>

      {/* Watermark */}
      <div className="absolute bottom-0 right-0 p-4 pointer-events-none z-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <span className="text-6xl font-black font-mono text-cyan-500 tracking-tighter select-none">
          FCX
        </span>
      </div>

      {/* Content */}
      <Link
        to={`/projects/${project.slug}`}
        className="flex flex-col flex-grow relative z-10 p-6"
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-mono text-xl font-bold text-gray-100 group-hover:text-cyan-400 transition-colors tracking-tight">
            {project.title}
          </h3>
        </div>

        <div className="h-px w-12 bg-gradient-to-r from-cyan-500 to-transparent mb-4 group-hover:w-full transition-all duration-500 ease-out" />

        <p className="text-gray-400 text-sm leading-relaxed flex-grow font-sans">
          {project.description}
        </p>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-cyan-500/70 border border-cyan-900/30 bg-cyan-950/30 px-2 py-1 rounded uppercase tracking-wider">
              ID: {project.slug.split('-')[0].toUpperCase()}
            </span>
          </div>
          <FaChevronRight
            className="text-gray-600 group-hover:text-cyan-400 transform group-hover:translate-x-1 transition-all duration-300"
            size={14}
          />
        </div>
      </Link>

      {/* External Link footer if exists */}
      {project.link && (
        <div className="relative z-10 px-6 pb-4">
          <a
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-gray-500 hover:text-cyan-400 uppercase tracking-widest transition-colors border-t border-gray-800 pt-3 w-full"
          >
            <span className="w-1.5 h-1.5 bg-current rounded-full animate-pulse" />
            Live System
            <FaExternalLinkAlt size={9} className="ml-auto" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
