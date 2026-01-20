import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ToggleLeft, Clock, Stack, GridFour } from '@phosphor-icons/react';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import LuxeArt from '../../components/LuxeArt';

// --- Components ---

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="font-mono tabular-nums">{time.toLocaleTimeString('en-US', { hour12: false })}</span>;
};

const StatusItem = ({ label, value, icon: Icon, onClick, actionLabel }) => (
  <div className="flex items-center gap-4 p-4 border-r border-black/10 last:border-r-0 group hover:bg-white/40 transition-colors flex-1">
      <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center text-black/60 group-hover:bg-black group-hover:text-white transition-colors">
         {Icon && <Icon size={18} />}
      </div>
      <div className="flex flex-col">
         <span className="font-outfit text-[10px] uppercase tracking-widest text-black/40">{label}</span>
         {onClick ? (
             <button onClick={onClick} className="font-playfairDisplay italic text-xl text-black text-left hover:text-[#8D4004] transition-colors flex items-center gap-2">
                 {value} {actionLabel && <span className="not-italic text-[10px] font-sans border border-black/10 px-1 rounded hover:bg-black hover:text-white transition-colors">{actionLabel}</span>}
             </button>
         ) : (
             <span className="font-playfairDisplay italic text-xl text-black">{value}</span>
         )}
      </div>
  </div>
);

// --- Adaptive Card Components ---

const ProjectCard = ({ project, index, isStacked }) => {
  const topOffset = 120 + index * 40;

  const containerClass = isStacked
    ? "sticky top-0 h-[80vh] w-full mb-20 last:mb-0 pt-10"
    : "w-full mb-12 last:mb-0";

  const innerClass = isStacked
    ? "relative w-full h-full bg-[#EBEBEB] rounded-xl overflow-hidden shadow-2xl border border-white/20 group"
    : "relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-full bg-[#EBEBEB] rounded-xl overflow-hidden shadow-xl border border-white/20 group";

  const style = isStacked ? { top: topOffset, zIndex: index + 1 } : {};

  return (
    <div className={containerClass} style={style}>
      <div className={innerClass}>
         <Link to={`/projects/${project.slug}`} className="block w-full h-full relative">
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <LuxeArt seed={project.title} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                    <span className="font-outfit text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                        Work {index + 1}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <ArrowUpRight size={24} />
                    </div>
                </div>
                <div>
                    <h3 className={`font-playfairDisplay italic mb-4 ${isStacked ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                        {project.title}
                    </h3>
                    <p className={`font-outfit text-white/80 leading-relaxed max-w-md ${isStacked ? 'text-sm md:text-base line-clamp-4' : 'text-xs md:text-sm line-clamp-3'}`}>
                        {project.shortDescription}
                    </p>
                </div>
            </div>
         </Link>
      </div>
    </div>
  );
};

const JournalCard = ({ post, index, isStacked }) => {
  const topOffset = 120 + index * 40;

  const containerClass = isStacked
    ? "sticky top-0 h-[80vh] w-full mb-20 last:mb-0 pt-10"
    : "w-full mb-12 last:mb-0";

  const innerClass = isStacked
    ? "relative w-full h-full bg-white rounded-xl overflow-hidden shadow-2xl border border-black/5 flex flex-col group"
    : "relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-full bg-white rounded-xl overflow-hidden shadow-sm border border-black/5 hover:shadow-xl transition-all duration-500 flex flex-col group";

  const style = isStacked ? { top: topOffset, zIndex: index + 1 } : {};

  return (
    <div className={containerClass} style={style}>
       <Link to={`/blog/${post.slug}`} className="block h-full">
          <div className={innerClass}>
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-[#FAFAF8]">
                  <span className="font-outfit text-xs uppercase tracking-widest text-black/50">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </span>
                  <span className="font-outfit text-[10px] uppercase tracking-widest text-black/30 border border-black/10 px-2 py-1 rounded">
                      Entry {index + 1}
                  </span>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center items-center text-center bg-[#FDFCFB] group-hover:bg-[#FFF] transition-colors relative overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                   />
                   <h3 className={`font-playfairDisplay text-[#1A1A1A] leading-tight group-hover:scale-105 transition-transform duration-700 ease-out ${isStacked ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'}`}>
                       {post.title}
                   </h3>
              </div>
              <div className="p-6 border-t border-black/5 flex justify-between items-center bg-[#FAFAF8]">
                   <span className="font-outfit text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-[#8D4004] transition-colors">
                       Read Article
                   </span>
                   <ArrowRight size={20} className="text-black/30 group-hover:text-[#8D4004] group-hover:translate-x-2 transition-all" />
              </div>
          </div>
       </Link>
    </div>
  );
};

const HeroContent = ({ variant = 'light' }) => {
  const { config } = useSiteConfig();
  const isDark = variant === 'dark';

  return (
    <div className={`relative h-full flex flex-col justify-center px-6 md:px-12 pt-12 md:pt-20 ${isDark ? 'bg-[#050505] text-[#E0E0E0]' : 'text-[#1A1A1A]'}`}>
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0 opacity-[0.03]">
             <span className={`font-playfairDisplay font-black text-[20vw] whitespace-nowrap ${isDark ? 'text-emerald-500 opacity-10' : 'text-black'}`}>
                 {isDark ? 'SYSTEM::ROOT' : 'FEZCODEX'}
             </span>
        </div>
        <div className="relative z-10 max-w-6xl mt-20 md:mt-0">
             <motion.div
                 initial={isDark ? {} : { opacity: 0, x: -50 }}
                 animate={isDark ? {} : { opacity: 1, x: 0 }}
                 transition={{ duration: 1 }}
              >
                  <span className={`inline-block px-3 py-1 border rounded-full font-outfit text-[10px] uppercase tracking-widest mb-8 backdrop-blur-sm ${isDark ? 'border-white/20 text-emerald-400' : 'border-black/20 text-black/50'}`}>
                     {isDark ? 'SYSTEM::OVERRIDE' : 'Est. 2024'}
                  </span>
                  <h1 className="font-playfairDisplay text-6xl md:text-8xl lg:text-[10rem] leading-[0.8] mb-12 tracking-tight">
                      {isDark ? 'Hidden' : 'Digital'} <br/>
                      <span className={`italic font-light ml-4 md:ml-32 ${isDark ? 'text-emerald-500 font-mono not-italic' : 'text-black/70'}`}>
                         {isDark ? 'REALITY' : 'Alchemy.'}
                      </span>
                  </h1>
                  <div className="flex flex-col md:flex-row gap-12 items-start md:items-end max-w-2xl ml-2">
                      <p className={`font-outfit text-sm leading-relaxed max-w-md ${isDark ? 'text-white/60 font-mono' : 'text-black/60'}`}>
                          {isDark
                            ? ">> DECODING THE MATRIX. ACCESSING ROOT DIRECTORY."
                            : (config?.hero?.subtitle || "Weaving logic into aesthetics. A curated archive of generative systems.")}
                      </p>
                      <Link to="/projects" className={`shrink-0 flex items-center gap-3 font-outfit text-xs uppercase tracking-widest border-b pb-1 transition-colors ${isDark ? 'border-emerald-500 text-emerald-500' : 'border-black hover:text-black/60'}`}>
                          {isDark ? 'INITIATE PROTOCOL' : 'Explore Works'} <ArrowRight />
                      </Link>
                  </div>
              </motion.div>
        </div>
    </div>
  );
}

const LuxeHomePage = () => {
  const { projects, loading: loadingProjects } = useProjects(true);
  const { setFezcodexTheme } = useVisualSettings();
  const [posts, setPosts] = useState([]);
  const [layoutMode, setLayoutMode] = useState('stack');

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/posts/posts.json');
        if(res.ok) setPosts(await res.json());
      } catch(e) { console.error(e); }
    };
    fetchPosts();
  }, []);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
  };

  const HERO_IMAGE = '/images/bg/7.webp';

  return (
    <div className="min-h-full w-full bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pb-20">
      <Seo title="Fezcodex | Luxe" description="A digital sanctuary." />

      <section
        ref={containerRef}
        onMouseMove={handleMouseMove}
        className="relative min-h-[90vh] overflow-hidden"
      >
          <motion.div style={{ y: heroY }} className="absolute inset-0 z-10">
              <div className="absolute top-0 right-0 w-full md:w-2/3 h-full z-0 pointer-events-none">
                 <div className="w-full h-full relative">
                     <img
                        src={HERO_IMAGE}
                        alt="Hero Texture"
                        className="w-full h-full object-cover opacity-20 mix-blend-multiply grayscale contrast-125"
                     />
                     <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#F5F5F0]/50 to-[#F5F5F0]" />
                 </div>
              </div>
              <HeroContent variant="light" />
          </motion.div>
          <div
             className="absolute inset-0 z-20 pointer-events-none bg-[#0a0a0a]"
             style={{ clipPath: `circle(150px at ${mousePos.x}px ${mousePos.y}px)` }}
          >
              <HeroContent variant="dark" />
          </div>
      </section>

      <div className="border-y border-black/10 bg-white/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex divide-x divide-black/10 max-w-[1800px] mx-auto overflow-x-auto">
              <StatusItem
                label="View Mode"
                value={layoutMode === 'stack' ? 'Stacked' : 'Grid'}
                icon={layoutMode === 'stack' ? Stack : GridFour}
                onClick={() => setLayoutMode(prev => prev === 'stack' ? 'grid' : 'stack')}
                actionLabel="Toggle"
              />
              <StatusItem label="Local Time" value={<TimeDisplay />} icon={Clock} />
                            <StatusItem
                              label="Interface"
                              value="Luxe"
                              icon={ToggleLeft}
                              onClick={() => setFezcodexTheme('brutalist')}
                              actionLabel="Switch"
                            />          </div>
      </div>

      <section className="max-w-[1800px] mx-auto px-6 md:px-12 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              <div className="order-1 lg:order-1">
                  <div className="mb-16 border-b border-black/10 pb-6">
                      <h2 className="font-playfairDisplay text-4xl text-[#1A1A1A]">Latest <span className="italic text-black/50">Observations</span></h2>
                  </div>
                  {posts.slice(0, 5).map((post, i) => (
                      <JournalCard key={post.slug} post={post} index={i} isStacked={layoutMode === 'stack'} />
                  ))}
                  <div className="mt-12 text-center lg:text-left">
                       <Link to="/blog" className="font-outfit text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-black/60 transition-colors">
                           View Journal Archive
                       </Link>
                  </div>
              </div>
              <div className="order-2 lg:order-2">
                  <div className="mb-16 border-b border-black/10 pb-6 text-right">
                      <h2 className="font-playfairDisplay text-4xl text-[#1A1A1A]">Selected <span className="italic text-black/50">Works</span></h2>
                  </div>
                  {loadingProjects ? (
                      <div className="py-20 text-center font-outfit opacity-50">Loading Collections...</div>
                  ) : (
                      projects.slice(0, 5).map((p, i) => (
                          <ProjectCard key={p.slug} project={p} index={i} isStacked={layoutMode === 'stack'} />
                      ))
                  )}
                  <div className="mt-12 text-center lg:text-right">
                       <Link to="/projects" className="font-outfit text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-black/60 transition-colors">
                           View All Projects
                       </Link>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default LuxeHomePage;