import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import {
  PlayIcon,
  HeartIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '@phosphor-icons/react';

const NeonSlideshowProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading: loadingProjects } = useProjects();
  const [sections, setSections] = useState([]);
  const [landingConfig, setLandingConfig] = useState(null);
  const [navbarConfig, setNavbarConfig] = useState({ logo: {}, links: [] });
  const [sectionContent, setSectionContent] = useState({});
  const [activeSlide, setActiveSlide] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');

  const containerRef = useRef(null);

  useEffect(() => {
    const updateMouse = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMouse);
    return () => window.removeEventListener('mousemove', updateMouse);
  }, []);

  const project = projects.find((p) => p.slug === slug);

  // Fetch Configurations
  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        const [landingRes, navbarRes, sectionsRes] = await Promise.all([
          fetch(`/projects/${slug}/details/landing.txt`),
          fetch(`/projects/${slug}/details/navbar.txt`),
          fetch(`/projects/${slug}/details/sections.txt`),
        ]);

        if (landingRes.ok) {
          const lData = await landingRes.json();
          setLandingConfig(lData);
        }
        if (navbarRes.ok) {
          const nData = await navbarRes.json();
          setNavbarConfig(nData);
        }
        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json();
          setSections(sectionsData);

          const contentMap = {};
          await Promise.all(
            sectionsData.map(async (section) => {
              try {
                const response = await fetch(
                  `/projects/${slug}/details/${section.file}`,
                );
                if (response.ok) {
                  const text = await response.text();
                  contentMap[section.id] = text;
                }
              } catch (error) {
                console.error(`Failed to fetch content for ${section.id}`, error);
              }
            }),
          );
          setSectionContent(contentMap);
        }
      } catch (error) {
        console.error('Failed to load project configurations', error);
      }
    };

    if (slug) fetchConfigs();
  }, [slug]);

  const handleScroll = (e) => {
    const scrollPos = e.target.scrollLeft;
    const windowWidth = window.innerWidth;
    if (windowWidth === 0) return;
    const index = Math.round(scrollPos / windowWidth);
    setActiveSlide(index);
  };

  const goNext = () => {
    if (containerRef.current && activeSlide < allSlides.length - 1) {
      containerRef.current.scrollTo({ left: (activeSlide + 1) * window.innerWidth, behavior: 'smooth' });
    }
  };

  const goPrev = () => {
    if (containerRef.current && activeSlide > 0) {
      containerRef.current.scrollTo({ left: (activeSlide - 1) * window.innerWidth, behavior: 'smooth' });
    }
  };

  if (loadingProjects || !project || !landingConfig) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
        <span className="animate-pulse">Loading Simulation...</span>
      </div>
    );
  }

  const allSlides = [
    {
      id: 'hero',
      title: landingConfig.title,
      subtitle: landingConfig.subtitle,
      image: landingConfig.backgroundImage || project.image,
      content: landingConfig.description,
      accent: 'text-red-600',
      bgAccent: 'bg-red-600',
      outlineAccent: 'border-red-600'
    },
    ...sections.map((sec, i) => {
       return {
         id: sec.id,
         title: sec.title,
         image: sec.image,
         content: sectionContent[sec.id],
         accent: sec.accent || 'text-red-600',
         bgAccent: sec.bgAccent || 'bg-red-600',
         outlineAccent: sec.outlineAccent || 'border-red-600',
         subtitle: sec.subtitle || null
       }
    })
  ];

  const currentAccentBg = allSlides[activeSlide]?.bgAccent || 'bg-red-600';
  const currentAccentText = allSlides[activeSlide]?.accent || 'text-red-600';
  const currentAccentBorder = allSlides[activeSlide]?.outlineAccent || 'border-red-600';

  const playLink = landingConfig.playLink || "#";
  const repoLink = landingConfig.repoLink || "#";

  return (
    <div className="bg-[#050505] text-white h-screen w-screen overflow-hidden font-instr-sans relative selection:bg-white/30 selection:text-white">

      <Seo
        title={`${project.title} | Fezcodex`}
        description={project.shortDescription}
        image={project.image}
        keywords={project.tags}
      />
      <style>{`
        * { cursor: none !important; }
      `}</style>

      {/* Custom Cursor */}
      <div
        className="fixed top-0 left-0 pointer-events-none z-[9999] transition-colors duration-500"
        style={{
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        }}
      >
        <div className="relative -top-1/2 -left-1/2 flex items-center justify-center drop-shadow-2xl">
           {cursorType === 'left' && <ArrowLeftIcon size={80} weight="light" className={`${currentAccentText} drop-shadow-lg`} />}
           {cursorType === 'right' && <ArrowRightIcon size={80} weight="light" className={`${currentAccentText} drop-shadow-lg`} />}
           {cursorType === 'default' && <div className={`w-5 h-5 ${currentAccentBg} rounded-full border border-white/20`} />}
        </div>
      </div>

      {/* Navigation Click Areas */}
      <div
        className="absolute top-0 left-0 w-[15vw] h-full z-40"
        onClick={goPrev}
        onMouseEnter={() => setCursorType('left')}
        onMouseLeave={() => setCursorType('default')}
      >
      </div>
      <div
        className="absolute top-0 right-0 w-[15vw] h-full z-40"
        onClick={goNext}
        onMouseEnter={() => setCursorType('right')}
        onMouseLeave={() => setCursorType('default')}
      >
      </div>
      {/* FIXED UI LAYER */}

      {/* Top Center Nav Bar */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pt-8 pointer-events-none transition-all duration-500">
        <div className={`flex items-center justify-between w-[320px] md:w-[400px] ${currentAccentBg} text-black px-4 py-3 pointer-events-auto transition-colors duration-500`}>
          <Link to="/projects" className="flex gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-black no-underline">
             <ArrowLeftIcon size={20} weight="bold" />
          </Link>
          <span className="font-black tracking-tighter text-xl uppercase text-black">
             {navbarConfig.logo?.label || "ARCADE"}
          </span>
          <div className="flex gap-3 text-black opacity-80 w-5">
             {/* Spacer to keep title centered */}
          </div>
        </div>

        {navbarConfig.cta && (
          <a
            href={navbarConfig.cta.link}
            target={navbarConfig.cta.link.startsWith('http') ? "_blank" : "_self"}
            rel={navbarConfig.cta.link.startsWith('http') ? "noopener noreferrer" : ""}
            className="w-[320px] md:w-[400px] bg-black border border-white/10 flex items-center justify-between px-3 py-2 mt-1 pointer-events-auto cursor-pointer hover:bg-white/5 transition-colors no-underline group"
          >
             <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-white/10 overflow-hidden relative border border-white/5">
                   <img src={allSlides[0].image.startsWith('/') || allSlides[0].image.startsWith('http') ? allSlides[0].image : `/images/projects/${slug}/${allSlides[0].image}`} className="w-full h-full object-cover opacity-60" alt="thumb"/>
                </div>
                <span className={`${currentAccentText} font-bold text-[10px] tracking-[0.2em] uppercase transition-colors duration-500`}>
                  {navbarConfig.cta.label || "PLAY DEMO"}
                </span>
             </div>
             <ArrowRightIcon className={`${currentAccentText} transition-transform group-hover:translate-x-1 duration-300`} size={14} />
          </a>
        )}
      </div>

      {/* Bottom Pagination */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pointer-events-auto">
        {allSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              const el = containerRef.current;
              if (el) {
                el.scrollTo({ left: i * window.innerWidth, behavior: 'smooth' });
              }
            }}
            className={`transition-all duration-300 rounded-full border ${currentAccentBorder}
              ${activeSlide === i ? `w-6 h-1.5 ${currentAccentBg}` : 'w-1.5 h-1.5 bg-transparent'}
            `}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Bottom Left Play/Heart Icons & Year */}
      <div className="fixed bottom-8 left-8 z-50 flex flex-col items-start gap-4 pointer-events-auto hidden md:flex">
         <div className="flex items-center gap-6">
            {playLink.startsWith('http') ? (
              <a href={playLink} target="_blank" rel="noopener noreferrer" className={`p-4 ${currentAccentBg} rounded-sm hover:brightness-125 transition-all group shadow-lg`}>
                 <PlayIcon size={36} weight="fill" className="text-black group-hover:scale-110 transition-transform" />
              </a>
            ) : (
              <Link to={playLink} className={`p-4 ${currentAccentBg} rounded-sm hover:brightness-125 transition-all group shadow-lg`}>
                 <PlayIcon size={36} weight="fill" className="text-black group-hover:scale-110 transition-transform" />
              </Link>
            )}

            {repoLink.startsWith('http') ? (
              <a href={repoLink} target="_blank" rel="noopener noreferrer" className={`p-4 ${currentAccentBg} rounded-sm hover:brightness-125 transition-all group shadow-lg`}>
                 <HeartIcon size={36} weight="fill" className="text-black group-hover:scale-110 transition-transform" />
              </a>
            ) : (
              <Link to={repoLink} className={`p-4 ${currentAccentBg} rounded-sm hover:brightness-125 transition-all group shadow-lg`}>
                 <HeartIcon size={36} weight="fill" className="text-black group-hover:scale-110 transition-transform" />
              </Link>
            )}
         </div>
         <span className={`text-[10px] font-bold tracking-widest ${currentAccentText}`}>
            {project.year || new Date().getFullYear()}
         </span>
      </div>

      {/* HORIZONTAL SCROLL CONTAINER */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex h-full w-full overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {allSlides.map((slide, index) => (
          <Slide
            key={slide.id}
            slide={slide}
            isActive={activeSlide === index}
            slug={slug}
            landingConfig={landingConfig}
          />
        ))}
      </div>
    </div>
  );
};

const Slide = ({ slide, isActive, slug, landingConfig }) => {
  const overlayOpacity = landingConfig?.overlayOpacity ?? 0.3;

  return (
    <section className="relative w-full h-full flex-shrink-0 snap-center flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 bg-black">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: isActive ? 1 : 1.02, opacity: isActive ? 1 : 0.3 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          src={slide.image.startsWith('/') || slide.image.startsWith('http') ? slide.image : `/images/projects/${slug}/${slide.image}`}
          alt={slide.title}
          className="w-full h-full object-cover"
        />
        {/* Adjustable Black Overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundColor: `rgba(0,0,0,${overlayOpacity})` }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-[10px]">
        <div className="flex flex-col md:flex-row items-center justify-between w-full h-full">

          {/* Left Side: Sticked Title */}
          <div className="flex-1 flex flex-col justify-center pointer-events-none h-full pt-20 md:pt-32">
             {slide.subtitle && (
               <motion.div
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: isActive ? 1 : 0, y: isActive ? 0 : 20 }}
                 transition={{ duration: 0.6, delay: 0.2 }}
                 className="mb-6 inline-block ml-2"
               >
                  <span className={`border ${slide.outlineAccent} ${slide.accent} text-xs md:text-sm uppercase font-bold tracking-[0.2em] px-3 py-1 bg-black/50 backdrop-blur-sm pointer-events-auto`}>
                     {slide.subtitle}
                  </span>
               </motion.div>
             )}

             <motion.h1
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
               transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
               className={`text-6xl md:text-[7vw] lg:text-[8vw] leading-[0.8] uppercase tracking-normal font-instr-serif ${slide.accent} m-0 p-0 pointer-events-auto`}
               style={{
                 fontWeight: 900,
                 transformOrigin: 'left center',
               }}
             >
               {slide.title}
             </motion.h1>
          </div>

          {/* Right Side: Description */}
          <div className="flex-1 flex flex-col justify-center items-end mt-12 md:mt-0 pointer-events-none h-full">
             <motion.div
               initial={{ opacity: 0, x: 50 }}
               animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 50 }}
               transition={{ duration: 0.8, delay: 0.4 }}
               className={`max-w-md bg-black/60 backdrop-blur-md p-6 border-x-4 shadow-2xl pointer-events-auto ${slide.accent} ${slide.outlineAccent}`}
             >
                {typeof slide.content === 'string' && slide.content.includes('\n') ? (
                    <div className="prose prose-invert prose-sm md:prose-base font-outfit font-light text-justify
                        prose-p:text-current prose-p:leading-relaxed
                        prose-strong:text-current prose-strong:font-bold
                        prose-h2:text-lg md:prose-h2:text-xl prose-h2:font-bold prose-h2:uppercase prose-h2:tracking-tight prose-h2:mb-3 prose-h2:mt-1 prose-h2:text-current
                        prose-h3:text-base prose-h3:font-medium prose-h3:uppercase prose-h3:text-current">
                      <MarkdownContent content={slide.content} />
                    </div>
                ) : (
                  <p className="text-base md:text-lg font-outfit font-light leading-relaxed text-justify drop-shadow-md text-current">
                     {slide.content}
                  </p>
                )}
             </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default NeonSlideshowProjectPage;