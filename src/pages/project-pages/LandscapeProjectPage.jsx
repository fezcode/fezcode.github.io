import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import MarkdownContent from '../../components/MarkdownContent';
import * as Icons from '@phosphor-icons/react';
import {
  GlobeHemisphereWestIcon,
  BuildingsIcon,
} from '@phosphor-icons/react';

// Helper to render icon by name string
const DynamicIcon = ({ name, ...props }) => {
  if (!name) return null;
  // Phosphor icons in this project use 'Icon' suffix
  const IconComponent = Icons[`${name}Icon`];
  if (!IconComponent) return null;
  return <IconComponent {...props} />;
};

const LandscapeProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading: loadingProjects } = useProjects();
  const [sections, setSections] = useState([]);
  const [landingConfig, setLandingConfig] = useState(null);
  const [navbarConfig, setNavbarConfig] = useState({ logo: {}, links: [] });
  const [sectionContent, setSectionContent] = useState({});
  const [activeSection, setActiveSection] = useState(0);

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

          // Fetch content for sections after loading sections config
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

  // Handle scroll to track active section for the indicator
  const handleScroll = (e) => {
    const scrollPos = e.target.scrollTop;
    const windowHeight = window.innerHeight;
    if (windowHeight === 0) return;
    const index = Math.round(scrollPos / windowHeight);
    setActiveSection(index);
  };

  if (loadingProjects || !project || !landingConfig) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
        <span className="animate-pulse">Initializing System...</span>
      </div>
    );
  }

  const totalSections = sections.length + 1; // +1 for Hero

  return (
    <div className="bg-[#050505] text-white h-screen overflow-y-scroll snap-y snap-mandatory font-instr-sans selection:bg-rose-500/30 selection:text-rose-200" onScroll={handleScroll}>
      <Seo
        title={`${project.title} | Fezcodex`}
        description={project.shortDescription}
        image={project.image}
        keywords={project.tags}
      />

      {/* Dot Indicator */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        {Array.from({ length: totalSections }).map((_, i) => (
          <div
            key={i}
            className={`w-1 h-8 transition-colors duration-200 ${
              activeSection === i ? 'bg-rose-500' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      {/* Navigation Bar (Customizable) */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12 backdrop-blur-sm mix-blend-difference">
        <Link
          to="/projects"
          className="text-xl font-instr-serif font-bold tracking-tight flex items-center gap-2 group text-white no-underline"
        >
          {navbarConfig.logo?.icon && (
            <DynamicIcon
              name={navbarConfig.logo.icon}
              className="group-hover:rotate-12 transition-transform"
            />
          )}
          {navbarConfig.logo?.label || landingConfig.title}
        </Link>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80 font-instr-sans uppercase tracking-widest">
          {navbarConfig.links?.map((item, index) => (
             item.link.startsWith('/') ? (
               <Link key={index} to={item.link} className="hover:opacity-100 transition-opacity text-white no-underline">
                 {item.label}
               </Link>
             ) : (
               <a key={index} href={item.link} className="hover:opacity-100 transition-opacity text-white no-underline">
                 {item.label}
               </a>
             )
          ))}
        </div>
        {navbarConfig.cta && (
          <a
            href={navbarConfig.cta.link}
            target={navbarConfig.cta.link.startsWith('http') ? "_blank" : "_self"}
            rel={navbarConfig.cta.link.startsWith('http') ? "noopener noreferrer" : ""}
            className="hidden md:flex items-center gap-2 border border-white/30 px-6 py-2 rounded text-xs font-instr-sans uppercase tracking-widest hover:bg-white hover:text-black transition-colors no-underline text-white"
          >
            {navbarConfig.cta.icon && (
              <DynamicIcon name={navbarConfig.cta.icon} size={16} />
            )}
            {navbarConfig.cta.label}
          </a>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center overflow-hidden snap-start snap-always">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={`/projects/${slug}/maps/${landingConfig.backgroundImage || (sections.length > 0 ? sections[0].image : project.image)}`}
            alt="Hero Background"
            className="w-full h-full object-cover filter brightness-[0.6] saturate-[0.8]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 h-full items-center">
          <div className="pt-20">
            <h1 className="text-5xl md:text-7xl lg:text-9xl font-instr-serif font-medium tracking-tight leading-[0.9] mb-12">
              {landingConfig.title}: <br />
              <span className="text-rose-400">{landingConfig.subtitle}</span>
            </h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl p-10 md:p-12 border border-white/10 shadow-2xl relative"
            >
              {/* Industrial Accents */}
              <div className="absolute -top-px -left-px w-8 h-px bg-rose-500/50" />
              <div className="absolute -top-px -left-px w-px h-8 bg-rose-500/50" />
              <div className="absolute -bottom-px -right-px w-8 h-px bg-rose-500/50" />
              <div className="absolute -bottom-px -right-px w-px h-8 bg-rose-500/50" />

              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed font-garamond italic mb-10">
                {landingConfig.description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10 border-t border-white/5 pt-8">
                {landingConfig.credits &&
                  landingConfig.credits.map((credit, index) => (
                    <div key={index}>
                      <span className="text-[10px] font-instr-sans uppercase tracking-[0.3em] text-white/40 block mb-1">
                        {credit.role}
                      </span>
                      <span className="text-sm font-instr-serif italic text-white/80">
                        {credit.name}
                      </span>
                    </div>
                  ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-8 border-t border-white/5">
                {landingConfig.buttons &&
                  landingConfig.buttons.map((btn, index) => (
                    <a
                      key={index}
                      href={btn.link}
                      target={btn.link.startsWith('http') ? '_blank' : '_self'}
                      rel={btn.link.startsWith('http') ? 'noopener noreferrer' : ''}
                      className={`${
                        btn.type === 'primary'
                          ? 'bg-white text-black hover:bg-rose-400'
                          : 'border border-white/30 hover:bg-white/10 backdrop-blur-md text-white'
                      } px-8 py-4 rounded font-instr-sans font-bold text-xs uppercase tracking-[0.2em] transition-colors flex items-center gap-2 no-underline`}
                    >
                      {btn.label}
                    </a>
                  ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Stats / Logos */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-20 flex flex-col md:flex-row items-end justify-between gap-8 pointer-events-none">
          <div className="flex items-center gap-8 opacity-50 grayscale pointer-events-auto font-instr-sans uppercase tracking-widest text-[10px]">
            <span className="font-bold flex items-center gap-2">
              <GlobeHemisphereWestIcon size={18} /> Aether
            </span>
            <span className="font-bold flex items-center gap-2">
              <BuildingsIcon size={18} /> UrbanOS
            </span>
          </div>

          <div className="flex items-center gap-12 bg-black/20 backdrop-blur-md p-8 rounded-t-2xl border-t border-x border-white/10">
            {landingConfig.stats && landingConfig.stats.map((stat, index) => (
              <React.Fragment key={index}>
                <div>
                  <div className="text-4xl font-instr-serif font-bold">{stat.value}</div>
                  <div className="text-[10px] font-instr-sans text-gray-400 uppercase tracking-[0.2em] mt-2">
                    {stat.label}
                  </div>
                </div>
                {index < landingConfig.stats.length - 1 && <div className="w-px h-12 bg-white/10" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Decorative Grid Lines */}
        <div className="absolute top-0 left-12 bottom-0 w-px bg-white/10 hidden md:block" />
        <div className="absolute top-0 right-12 bottom-0 w-px bg-white/10 hidden md:block" />
        <div className="absolute top-24 left-0 right-0 h-px bg-white/10 hidden md:block" />
        <div className="absolute bottom-32 left-0 right-0 h-px bg-white/10 hidden md:block" />
      </section>

      {/* Scrollable Detail Sections */}
      {sections.map((section, index) => (
        <Section
          key={section.id}
          section={section}
          slug={slug}
          content={sectionContent[section.id]}
          index={index}
        />
      ))}
    </div>
  );
};

const Section = ({ section, slug, content, index }) => {
  const isEven = index % 2 === 0;

  return (
    <section className="relative h-screen w-full flex items-center overflow-hidden border-t border-white/5 snap-start snap-always">
      {/* Background Wallpaper - Clear and Full Screen */}
      <div className="absolute inset-0 z-0">
        <img
          src={`/projects/${slug}/maps/${section.image}`}
          alt={section.title}
          className="w-full h-full object-cover transition-transform duration-1000"
        />
        {/* Subtle gradient to ensure text readability without killing the wallpaper */}
        <div className={`absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60`} />
        <div className={`absolute inset-0 bg-black/20`} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div
          className={`flex w-full ${isEven ? 'justify-start' : 'justify-end'}`}
        >
          {/* Detail Box with Negative Background (Glassmorphism / Industrial) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-black/40 backdrop-blur-2xl p-10 md:p-16 border border-white/10 shadow-2xl relative group"
          >
            {/* Industrial Accents */}
            <div className="absolute -top-px -left-px w-8 h-px bg-rose-500/50" />
            <div className="absolute -top-px -left-px w-px h-8 bg-rose-500/50" />
            <div className="absolute -bottom-px -right-px w-8 h-px bg-rose-500/50" />
            <div className="absolute -bottom-px -right-px w-px h-8 bg-rose-500/50" />

            {/* Component Identifier */}
            <div className="mb-6 flex items-center gap-3">
              <span className="text-[10px] font-instr-sans font-bold uppercase tracking-[0.5em] text-rose-400">
                System Module / 0{index + 1}
              </span>
              <div className="h-px w-12 bg-rose-500/30" />
            </div>

            <h2 className="text-4xl md:text-6xl font-instr-serif font-medium tracking-tight text-white mb-8 leading-tight">
              {section.title}
            </h2>

            <div className="prose prose-invert prose-xl font-garamond
                prose-p:text-gray-200 prose-p:leading-relaxed prose-p:font-light
                prose-li:text-gray-300 prose-strong:text-rose-400 prose-strong:font-medium
                prose-h2:text-2xl prose-h2:font-instr-serif prose-h2:mb-4 prose-h2:mt-8
                prose-h3:text-xl prose-h3:font-instr-serif prose-h3:text-rose-500">
              <MarkdownContent content={content || ''} />
            </div>

            <div className="mt-12 pt-8 border-t border-white/5 flex items-center justify-between">
              <div className="text-[10px] font-mono text-white/20 uppercase tracking-widest">
                ID: ###-{section.id.toUpperCase()}-###
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Side Label */}
      <div className={`absolute top-1/2 -translate-y-1/2 hidden xl:block mix-blend-difference opacity-30 font-instr-sans text-[10px] uppercase tracking-[1em] [writing-mode:vertical-lr] ${isEven ? 'right-12 rotate-180' : 'left-12'}`}>
        Module Archive / 0{index + 1}
      </div>
    </section>
  );
};

export default LandscapeProjectPage;
