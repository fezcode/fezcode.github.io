import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import {
  ArrowUpRightIcon,
  StackIcon,
  GridFourIcon,
  ArrowLeftIcon,
  MouseIcon
} from '@phosphor-icons/react';

import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import LuxeArt from '../../components/LuxeArt';

const StackedCard = ({ project, index, scrollYProgress, total }) => {
  // Each card has a range in the 0-1 scroll progress
  const step = 1 / total;
  const start = index * step;

  // Transition logic:
  // We want the card to stay "solo" for a while.
  // So it slides in during the second half of the PREVIOUS card's segment.
  // And it finishes sliding in exactly when its own segment starts.
  const slideStart = Math.max(0, start - step * 0.6); // 60% of the previous segment is used for the slide-in
  const slideEnd = start;

  const y = useTransform(
    scrollYProgress,
    [slideStart, slideEnd],
    ['100vh', '0vh']
  );

  // The first card is always at 0
  const translateY = index === 0 ? 0 : y;
  return (
    <motion.div
      style={{
        y: translateY,
        zIndex: index,
      }}
      className="absolute inset-0 flex flex-col items-center justify-center px-6 md:px-12"
    >
       <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[16/10] w-full max-w-[1000px] bg-[#EBEBEB] rounded-2xl overflow-hidden border border-white/20 group shadow-2xl max-h-[60vh] shrink-0">

         <Link to={`/projects/${project.slug}`} className="block w-full h-full relative">
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <LuxeArt seed={project.title} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
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
      </div>
    </motion.div>
  );
};

const GridCard = ({ project, index }) => (
  <div className="w-full h-full group">
    <Link to={`/projects/${project.slug}`} className="block h-full">
        <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-full bg-[#EBEBEB] rounded-xl overflow-hidden border border-black/5 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <LuxeArt seed={project.title} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end text-white">
                <h3 className="font-playfairDisplay text-3xl italic mb-2">{project.title}</h3>
                <p className="font-outfit text-xs text-white/70 line-clamp-2">{project.shortDescription}</p>
            </div>
        </div>
    </Link>
  </div>
);

const LuxeProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const [layoutMode, setLayoutMode] = useState('stack');
  const containerRef = useRef(null);

  // Track active index for optimized rendering (only show current, prev, next)
  const [visibleIndices, setVisibleIndices] = useState([0, 1, 2]);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start start", "end end"]
    });

    const [currentIdx, setCurrentIdx] = useState(0);

    useMotionValueEvent(scrollYProgress, "change", (latest) => {
      if (!projects.length) return;
      const idx = Math.min(projects.length - 1, Math.floor(latest * projects.length));
      setCurrentIdx(idx);

      // Window of 3: prev, current, next
      const start = Math.max(0, idx - 1);
      const end = Math.min(projects.length - 1, idx + 1);

      // Only update if indices changed to avoid unnecessary re-renders
      if (visibleIndices[0] !== start || visibleIndices[visibleIndices.length - 1] !== end) {
          const newIndices = [];
          for (let i = start; i <= end; i++) newIndices.push(i);
          setVisibleIndices(newIndices);
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
      <div className="relative z-[100] max-w-[1800px] mx-auto px-6 md:px-12 pt-24">
        <header className="mb-12 border-b border-[#1A1A1A]/10 pb-12">
           <Link to="/" className="inline-flex items-center gap-2 mb-8 font-outfit text-xs uppercase tracking-widest text-black/40 hover:text-[#8D4004] transition-colors">
               <ArrowLeftIcon /> Home
           </Link>

           <div className="flex flex-col md:flex-row justify-between items-end gap-12">
               <div className="space-y-6">
                   <h1 className="font-playfairDisplay text-7xl md:text-9xl text-[#1A1A1A] mb-0 leading-none">
                       Works
                   </h1>
                   <p className="font-outfit text-sm text-[#1A1A1A]/60 max-w-lg leading-relaxed italic">
                       Explorations in code, design, and user interaction. A catalogue of shipped products and experimental prototypes.
                   </p>
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

                  {projects.map((project, index) => (

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

                                  style={{ scaleX: scrollYProgress }}

                              />

                          </div>

                          {/* Right Side Scroll Prompt & Pagination */}
                          <div className="fixed right-12 top-1/2 -translate-y-1/2 z-[110] hidden lg:flex flex-col gap-6 items-center">
                              {/* Scroll Prompt */}
                              <div className="flex flex-col items-center gap-2 pointer-events-none opacity-20 mb-4">
                                  <motion.div
                                      animate={{ y: [0, 8, 0] }}
                                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                  >
                                      <MouseIcon size={32} weight="light" />
                                  </motion.div>
                                  <span className="font-outfit text-[9px] uppercase tracking-[0.4em] [writing-mode:vertical-lr]">Scroll</span>
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
                    // Optimized Rendering: only render the 3 cards in the current window
                    if (!visibleIndices.includes(index)) return null;

                    return (
                        <StackedCard
                            key={project.slug}
                            project={project}
                            index={index}
                            scrollYProgress={scrollYProgress}
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
