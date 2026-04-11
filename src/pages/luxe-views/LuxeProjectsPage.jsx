import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  motion,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from 'framer-motion';
import {
  ArrowUpRightIcon,
  StackIcon,
  GridFourIcon,
  ArrowLeftIcon,
  MouseIcon,
  MagnifyingGlassIcon,
} from '@phosphor-icons/react';

import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';

const StackedCard = ({ project, index, scrollProgress, total }) => {
  const step = 1 / total;

  // --- Enter keyframes ---
  const enterStart = Math.max(0, index * step - step * 0.5);
  const enterEnd = index * step;

  // --- Exit keyframes: card leaves after 2 newer cards stack on top ---
  const exitStart = (index + 2) * step;
  const exitEnd = (index + 2) * step + step * 0.5;
  const needsExit = exitStart < 1;

  let inputRange, yRange, opacityRange;

  if (index === 0) {
    if (needsExit) {
      inputRange = [0, exitStart, exitEnd];
      yRange = ['0vh', '0vh', '-20vh'];
      opacityRange = [1, 1, 0];
    } else {
      inputRange = [0, 1];
      yRange = ['0vh', '0vh'];
      opacityRange = [1, 1];
    }
  } else {
    if (needsExit) {
      inputRange = [enterStart, enterEnd, exitStart, exitEnd];
      yRange = ['100vh', '0vh', '0vh', '-20vh'];
      opacityRange = [0, 1, 1, 0];
    } else {
      inputRange = [enterStart, enterEnd];
      yRange = ['100vh', '0vh'];
      opacityRange = [0, 1];
    }
  }

  const y = useTransform(scrollProgress, inputRange, yRange);
  const opacity = useTransform(scrollProgress, inputRange, opacityRange);

  return (
    <motion.div
      style={{
        y,
        opacity,
        zIndex: index,
      }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12"
    >
      <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[16/10] w-full max-w-[1000px] bg-[#EBEBEB] rounded-2xl overflow-hidden border border-white/20 group shadow-2xl max-h-[60vh] shrink-0">
        {project.redirect_url ? (
          <a
            href={project.redirect_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full h-full relative"
          >
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
              <LuxeArt
                seed={project.title}
                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 p-8 md:p-16 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <span className="font-outfit text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                  Work {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                  <ArrowUpRightIcon size={28} />
                </div>
              </div>
              <div className="max-w-3xl">
                <h3 className="font-playfairDisplay italic text-4xl md:text-7xl lg:text-8xl mb-6 leading-none tracking-tighter">
                  {project.title}
                </h3>
                <p className="font-outfit text-white/80 leading-relaxed max-w-xl text-sm md:text-lg line-clamp-3 italic">
                  {project.shortDescription}
                </p>
              </div>
            </div>
          </a>
        ) : (
          <Link
            to={`/projects/${project.slug}`}
            className="block w-full h-full relative"
          >
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
              <LuxeArt
                seed={project.title}
                className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 p-8 md:p-16 flex flex-col justify-between text-white">
              <div className="flex justify-between items-start">
                <span className="font-outfit text-xs uppercase tracking-widest border border-white/20 px-4 py-2 rounded-full backdrop-blur-md">
                  Work {String(index + 1).padStart(2, '0')}
                </span>
                <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 shadow-xl">
                  <ArrowUpRightIcon size={28} />
                </div>
              </div>
              <div className="max-w-3xl">
                <h3 className="font-playfairDisplay italic text-4xl md:text-7xl lg:text-8xl mb-6 leading-none tracking-tighter">
                  {project.title}
                </h3>
                <p className="font-outfit text-white/80 leading-relaxed max-w-xl text-sm md:text-lg line-clamp-3 italic">
                  {project.shortDescription}
                </p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </motion.div>
  );
};

const GridCard = ({ project, index }) => {
  const content = (
    <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-full bg-[#EBEBEB] rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500">
      <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
        <LuxeArt
          seed={project.title}
          className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end text-white">
        <h3 className="font-playfairDisplay text-3xl italic mb-2">
          {project.title}
        </h3>
        <p className="font-outfit text-xs text-white/70 line-clamp-2">
          {project.shortDescription}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full group">
      {project.redirect_url ? (
        <a
          href={project.redirect_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {content}
        </a>
      ) : (
        <Link to={`/projects/${project.slug}`} className="block h-full">
          {content}
        </Link>
      )}
    </div>
  );
};

const LuxeProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const [layoutMode, setLayoutMode] = useState('stack');
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const currentIdxRef = useRef(0);

  // Manual scroll-driven MotionValue — works regardless of which element
  // is the scroll container (window, body, or html).
  const scrollProgress = useMotionValue(0);

  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrollRange = rect.height - windowHeight;
      if (scrollRange <= 0) return;
      const scrolled = -rect.top;
      const p = Math.max(0, Math.min(1, scrolled / scrollRange));
      scrollProgress.set(p);
    };

    // Listen on every possible scroll target so this works no matter
    // which element actually scrolls (window, body, html, or document).
    const targets = [window, document, document.body, document.documentElement];
    targets.forEach((t) =>
      t.addEventListener('scroll', update, { passive: true }),
    );
    // Also fire on resize in case viewport changes
    window.addEventListener('resize', update, { passive: true });
    update();
    return () => {
      targets.forEach((t) => t.removeEventListener('scroll', update));
      window.removeEventListener('resize', update);
    };
  }, [projects.length, scrollProgress]);

  useMotionValueEvent(scrollProgress, 'change', (latest) => {
    if (!projects.length) return;
    const idx = Math.min(
      projects.length - 1,
      Math.floor(latest * projects.length),
    );
    if (idx !== currentIdxRef.current) {
      currentIdxRef.current = idx;
      setCurrentIdx(idx);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-[#1A1A1A]/40 text-xs uppercase tracking-widest">
        Loading Archive...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center font-outfit text-red-500 text-xs uppercase tracking-widest">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black">
      <Seo
        title="Works | Fezcodex"
        description="A curated collection of digital experiments and architectural explorations."
        keywords={['Fezcodex', 'projects', 'portfolio', 'developer']}
      />

      {/* Persistent Header */}
      <div className="relative z-40 max-w-[1800px] mx-auto px-6 md:px-12 pt-24">
        <header className="mb-12 border-b border-[#1A1A1A]/10 pb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-black/40 hover:text-[#8D4004] transition-colors"
          >
            <ArrowLeftIcon /> Home
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-end gap-12">
            <div className="space-y-6 flex-1">
              <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-0 leading-none">
                Works
              </h1>
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed italic">
                  Explorations in code, design, and user interaction. A
                  catalogue of shipped products and experimental prototypes.
                </p>

                {layoutMode === 'grid' && (
                  <div className="relative group border-b border-[#1A1A1A]/20 focus-within:border-[#1A1A1A] transition-colors min-w-[300px]">
                    <input
                      type="text"
                      placeholder="Search Archive..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-transparent py-2 outline-none font-outfit text-sm placeholder-[#1A1A1A]/30"
                    />
                    <MagnifyingGlassIcon className="absolute right-0 top-1/2 -translate-y-1/2 text-[#1A1A1A]/40" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex bg-white rounded-full p-1 border border-black/5 shadow-sm">
                <button
                  onClick={() => setLayoutMode('grid')}
                  className={`p-2 rounded-full transition-all ${layoutMode === 'grid' ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-black/40 hover:text-black'}`}
                  title="Grid View"
                >
                  <GridFourIcon size={20} />
                </button>
                <button
                  onClick={() => setLayoutMode('stack')}
                  className={`p-2 rounded-full transition-all ${layoutMode === 'stack' ? 'bg-[#1A1A1A] text-white shadow-lg' : 'text-black/40 hover:text-black'}`}
                  title="Stack View"
                >
                  <StackIcon size={20} />
                </button>
              </div>
              <span className="font-outfit text-[10px] uppercase tracking-widest text-[#1A1A1A]/40 border border-[#1A1A1A]/10 px-4 py-2 rounded-full bg-white/50">
                Archive Size: {projects.length}
              </span>
            </div>
          </div>
        </header>
      </div>

      {/* Content Area */}

      {layoutMode === 'grid' ? (
        <div className="max-w-[1800px] mx-auto px-6 md:px-12 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects

            .filter(
              (p) =>
                p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.shortDescription
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            )

            .map((project, index) => (
              <GridCard key={project.slug} project={project} index={index} />
            ))}
        </div>
      ) : (
        <div
          ref={containerRef}
          className="relative"
          style={{ height: `${projects.length * 150}vh` }}
        >
          {/* Top Progress Bar */}

          <div className="fixed top-0 left-0 right-0 h-1 bg-[#1A1A1A]/5 z-[110]">
            <motion.div
              className="h-full bg-[#8D4004] origin-left"
              style={{ scaleX: scrollProgress }}
            />
          </div>

          {/* Right Side Scroll Prompt & Pagination */}
          <div className="fixed right-12 top-1/2 -translate-y-1/2 z-[110] hidden lg:flex flex-col gap-6 items-center">
            {/* Scroll Prompt */}
            <div className="flex flex-col items-center gap-2 pointer-events-none opacity-20 mb-4">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <MouseIcon size={32} weight="light" />
              </motion.div>
              <span className="font-outfit text-[9px] uppercase tracking-[0.4em] [writing-mode:vertical-lr]">
                Scroll
              </span>
            </div>

            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#1A1A1A]/10 to-transparent" />

            {projects.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${currentIdx === i ? 'bg-[#8D4004] scale-150' : 'bg-[#1A1A1A]/10'}`}
              />
            ))}

            <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#1A1A1A]/10 to-transparent" />
          </div>

          <div className="sticky top-0 h-screen w-full overflow-hidden">
            {projects.map((project, index) => {
              // Only render 3 behind + 1 ahead to cap stacked shadows
              if (index < currentIdx - 3 || index > currentIdx + 1) return null;

              return (
                <StackedCard
                  key={project.slug}
                  project={project}
                  index={index}
                  scrollProgress={scrollProgress}
                  total={projects.length}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LuxeProjectsPage;
