import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useProjects } from '../utils/projectParser';
import { useProjectContent } from '../hooks/useProjectContent';
import useSeo from '../hooks/useSeo';
import GenerativeArt from '../components/GenerativeArt';
import {
  ArrowLeftIcon,
  ArrowUpRightIcon,
  GithubLogoIcon,
  CalendarBlankIcon,
  CpuIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@phosphor-icons/react';
import MarkdownContent from '../components/MarkdownContent';

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E")`;

const ProjectPage = () => {
  const { slug } = useParams();
  const { scrollY } = useScroll();

  // Parallax effect for hero
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0.5]);

  const {
    projects,
    loading: loadingProjects,
    error: errorProjects,
  } = useProjects();
  const {
    content,
    loading: loadingContent,
    error: errorContent,
  } = useProjectContent(slug);

  const project = projects.find((p) => p.slug === slug);
  const fullProject = project && content ? { ...project, ...content } : null;

  useSeo({
    title: fullProject ? `${fullProject.title} | Fezcodex` : null,
    description: fullProject?.shortDescription,
    image: fullProject?.image,
    keywords: fullProject?.tags,
  });

  if (loadingProjects || loadingContent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white font-mono uppercase tracking-widest text-xs">
        <span className="animate-pulse">Loading project data...</span>
      </div>
    );
  }

  if (errorProjects || errorContent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-red-500 font-mono uppercase">
        Error: {errorProjects?.message || errorContent?.message}
      </div>
    );
  }

  if (!fullProject) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-gray-500 font-mono uppercase">
        Project not found.
      </div>
    );
  }

  const year = new Date(fullProject.date).getFullYear();
  const isDefaultImage = fullProject.image?.includes('defaults/');

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
      <div
        className="pointer-events-none fixed inset-0 z-50 opacity-20 mix-blend-overlay"
        style={{ backgroundImage: NOISE_BG }}
      />

      {/* Hero Section */}
      <header className="relative h-[85vh] w-full overflow-hidden flex items-end">
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          {isDefaultImage ? (
             <GenerativeArt
             seed={fullProject.title}
             className="w-full h-full opacity-60 filter brightness-75"
           />
          ) : (
            <div className="w-full h-full relative">
               <img
                src={fullProject.image}
                alt={fullProject.title}
                className="w-full h-full object-cover filter brightness-[0.4]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/80 via-transparent to-transparent" />
            </div>
          )}
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 pb-20 md:px-12 md:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
             <Link
              to="/projects"
              className="inline-flex items-center gap-2 mb-8 text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              <ArrowLeftIcon weight="bold" />
              <span>Back to Projects</span>
            </Link>

            <div className="flex flex-wrap items-center gap-4 mb-6">
               <span className="font-mono text-[10px] text-white/60 uppercase tracking-widest border border-white/10 px-3 py-1 rounded-full bg-white/5 backdrop-blur-md">
                 {year}
               </span>
               <span className={`font-mono text-[10px] uppercase tracking-widest border px-3 py-1 rounded-full backdrop-blur-md flex items-center gap-2 ${fullProject.isActive ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-red-500/30 text-red-400 bg-red-500/10'}`}>
                  {fullProject.isActive ? <CheckCircleIcon /> : <XCircleIcon />}
                  {fullProject.isActive ? 'Active Development' : 'Archived'}
               </span>
            </div>

            <h1 className="text-5xl md:text-8xl lg:text-9xl font-light uppercase tracking-tighter text-white leading-[0.9] mb-8 max-w-5xl font-playfairDisplay">
              {fullProject.title}
            </h1>

            <div className="flex flex-wrap gap-2 max-w-2xl">
              {fullProject.technologies?.map((tech, index) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-xs font-mono text-gray-300 rounded hover:bg-white/10 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 md:px-12 lg:py-24">
        <div className="lg:grid lg:grid-cols-12 lg:gap-20">

          {/* Content Column */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-16 border-l-2 border-emerald-500 pl-8 py-2"
            >
              <p className="text-xl md:text-2xl lg:text-3xl text-gray-200 font-light leading-relaxed font-arvo">
                {fullProject.shortDescription}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="prose prose-invert prose-lg max-w-none font-arvo
                  prose-headings:font-playfairDisplay prose-headings:uppercase prose-headings:tracking-tight prose-headings:font-normal prose-headings:text-white
                  prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-4
                  prose-h3:text-xl prose-h3:mt-8 prose-h3:text-emerald-400
                  prose-p:text-gray-400 prose-p:leading-relaxed
                  prose-a:text-emerald-400 prose-a:no-underline prose-a:border-b prose-a:border-emerald-400/30 hover:prose-a:border-emerald-400 hover:prose-a:text-emerald-300 prose-a:transition-all
                  prose-code:text-emerald-200 prose-code:font-mono prose-code:bg-emerald-900/20 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:border prose-code:border-emerald-900/30
                  prose-pre:bg-[#0A0A0A] prose-pre:border prose-pre:border-white/10 prose-pre:shadow-2xl
                  prose-ul:marker:text-emerald-500
                  prose-blockquote:border-l-4 prose-blockquote:border-emerald-500 prose-blockquote:bg-white/5 prose-blockquote:px-6 prose-blockquote:py-4 prose-blockquote:italic prose-blockquote:rounded-r"
            >
              <MarkdownContent content={fullProject.fullContent} />
            </motion.div>
          </div>

          {/* Sidebar Column */}
          <aside className="lg:col-span-4 mt-16 lg:mt-0">
             <div className="sticky top-12 space-y-8">

               {/* Actions Card */}
               <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                 <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
                   <CpuIcon size={16} />
                   Project Actions
                 </h3>
                 <div className="space-y-3">
                    {fullProject.demo_link && (
                      <a
                        href={fullProject.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex w-full items-center justify-between bg-emerald-500 text-black px-6 py-4 rounded font-bold transition-all hover:bg-emerald-400 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <span className="font-mono text-sm uppercase tracking-widest">
                          Visit Project
                        </span>
                        <ArrowUpRightIcon weight="bold" size={20} className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                      </a>
                    )}

                    {fullProject.repo_link && (
                      <a
                        href={fullProject.repo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex w-full items-center justify-between border border-white/20 px-6 py-4 rounded text-white transition-all hover:bg-white/10 hover:border-white/40"
                      >
                        <span className="font-mono text-sm uppercase tracking-widest">
                          Source Code
                        </span>
                        <GithubLogoIcon weight="bold" size={20} />
                      </a>
                    )}
                 </div>
               </div>

               {/* Meta Info */}
               <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm space-y-6">
                  <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-2">
                      <CalendarBlankIcon />
                      Release Date
                    </h4>
                    <p className="font-mono text-sm text-white">{fullProject.date}</p>
                  </div>

                  <div className="w-full h-px bg-white/5" />

                  <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-2">
                      License
                    </h4>
                    <p className="font-mono text-sm text-white">MIT License</p>
                  </div>

                  <div className="w-full h-px bg-white/5" />

                   <div>
                    <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-gray-500 mb-3">
                      Tech Stack
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {fullProject.technologies?.map(tech => (
                        <span key={tech} className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded border border-white/5">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
               </div>

             </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default ProjectPage;