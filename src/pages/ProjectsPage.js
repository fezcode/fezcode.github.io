import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../components/ProjectCard';
import GenerativeArt from '../components/GenerativeArt';
import { useProjects } from '../utils/projectParser';
import useSeo from '../hooks/useSeo';
import { ArrowLeft, Cpu } from '@phosphor-icons/react';
import { useAchievements } from '../context/AchievementContext';

const ProjectsPage = () => {
  useSeo({
    title: 'Archive | Fezcodex',
    description:
      'A curated collection of digital experiments and deployed systems.',
    keywords: ['Fezcodex', 'projects', 'portfolio', 'developer', 'editorial'],
  });

  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();
  const [activeProject, setActiveProject] = useState(null);

  // Set initial active project
  useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject]);

  useEffect(() => {
    unlockAchievement('project_pioneer');
  }, [unlockAchievement]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-gray-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-white animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">
            Loading Archive
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-red-500 font-mono">
        ERR: {error.message}
      </div>
    );
  }

  const isPlaceholder = (project) =>
    !project?.image || project.image.includes('placeholder');

  return (
    <div className="flex min-h-screen bg-[#050505] text-white overflow-hidden relative selection:bg-emerald-500/30">
      {/* Mobile Background (Static or Active Project Blur) */}
      <div className="absolute inset-0 4xl:hidden opacity-20 pointer-events-none z-0">
        {activeProject &&
          (isPlaceholder(activeProject) ? (
            <GenerativeArt
              seed={activeProject.title}
              className="w-full h-full filter blur-3xl"
            />
          ) : (
            <img
              src={activeProject.image}
              alt="bg"
              className="w-full h-full object-cover filter blur-3xl"
            />
          ))}
      </div>

      {/* LEFT PANEL: The Index */}
      <div className="w-full 4xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
          >
            <ArrowLeft weight="bold" />
            <span>Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-4 leading-none">
            WORK
          </h1>
          <p className="text-gray-400 font-mono text-sm max-w-sm">
            {'//'} SELECTED WORKS
          </p>
        </header>

        <div className="flex flex-col pb-32">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.slug}
              index={index}
              project={project}
              isActive={activeProject?.slug === project.slug}
              onHover={setActiveProject}
            />
          ))}
        </div>

        <div className="mt-auto pt-20 border-t border-white/10 text-gray-600 font-mono text-xs uppercase tracking-widest">
          Total Entries: {projects.length}
        </div>
      </div>

      {/* RIGHT PANEL: The Stage (Desktop Only) */}
      <div className="hidden 4xl:block fixed right-0 top-0 h-screen w-1/2 bg-neutral-900 overflow-hidden border-l border-white/10 z-20">
        <AnimatePresence mode="wait">
          {activeProject && (
            <motion.div
              key={activeProject.slug}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'circOut' }}
              className="absolute inset-0"
            >
              {/* Image */}
              <div className="absolute inset-0 z-0">
                <GenerativeArt
                  seed={activeProject.title}
                  className="w-full h-full opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
              </div>

              {/* Details Overlay */}
              <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex flex-col gap-6">
                {/* ID & Date */}
                <div className="flex items-center gap-4 text-emerald-400 font-mono text-sm tracking-widest uppercase">
                  <span>ID: {activeProject.slug.split('-')[0]}</span>
                  <span className="h-1 w-1 bg-current rounded-full" />
                  <span>{new Date(activeProject.date).getFullYear()}</span>
                </div>

                {/* Description */}
                <p className="text-xl md:text-2xl text-gray-200 font-light leading-relaxed max-w-2xl">
                  {activeProject.shortDescription}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {activeProject.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-xs font-mono text-white uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* External Link Button (Optional) */}
                {activeProject.link && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-white border-b border-white pb-1 hover:text-emerald-400 hover:border-emerald-400 transition-colors"
                    >
                      <span className="text-sm font-bold uppercase tracking-widest">
                        Visit Live Site
                      </span>
                      <ArrowLeft className="rotate-135" weight="bold" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Placeholder / Empty State */}
        {!activeProject && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-700">
            <Cpu size={64} weight="thin" className="animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
