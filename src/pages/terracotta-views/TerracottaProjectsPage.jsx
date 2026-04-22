import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from '../../components/ProjectCard';
import GenerativeArt from '../../components/GenerativeArt';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import { CpuIcon, ArrowLeftIcon } from '@phosphor-icons/react';
import { useAchievements } from '../../context/AchievementContext';

const TerracottaProjectsPage = () => {
  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();
  const [activeProject, setActiveProject] = useState(null);

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
      <div className="flex h-screen items-center justify-center bg-[#F3ECE0] text-[#1A1613]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-px w-24 bg-[#1A161320] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#C96442] animate-progress origin-left"></div>
          </div>
          <span className="font-mono text-xs text-[#2E2620]/60 uppercase tracking-widest">
            Loading Archive
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F3ECE0] text-[#9E4A2F] font-mono">
        ERR: {error.message}
      </div>
    );
  }

  const isPlaceholder = (project) =>
    !project?.image || project.image.includes('placeholder');

  return (
    <div className="flex min-h-screen bg-[#F3ECE0] text-[#1A1613] overflow-hidden relative selection:bg-[#C96442]/25">
      <Seo
        title="Archive | Fezcodex"
        description="A curated collection of digital experiments and deployed systems."
      />

      <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
        {activeProject &&
          (isPlaceholder(activeProject) ? (
            <GenerativeArt seed={activeProject.title} className="w-full h-full filter blur-3xl" />
          ) : (
            <img src={activeProject.image} alt="bg" className="w-full h-full object-cover filter blur-3xl" />
          ))}
      </div>

      <div className="w-full 4xl:pr-[50vw] relative z-10 flex flex-col min-h-screen py-24 px-6 md:pl-20 overflow-y-auto overflow-x-hidden no-scrollbar transition-all duration-300">
        <header className="mb-20">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-mono text-[#2E2620]/60 hover:text-[#1A1613] transition-colors uppercase tracking-widest"
          >
            <ArrowLeftIcon weight="bold" />
            <span>Home</span>
          </Link>
          <h1 className="text-6xl md:text-8xl font-fraunces italic tracking-tight text-[#1A1613] mb-4 leading-none">
            Work
          </h1>
          <p className="text-[#2E2620]/70 font-mono text-sm max-w-sm uppercase tracking-widest">
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

        <div className="mt-auto pt-20 border-t border-[#1A161320] text-[#2E2620]/50 font-mono text-xs uppercase tracking-widest">
          Total Entries: {projects.length}
        </div>
      </div>

      <div className="hidden 4xl:block fixed right-0 top-0 h-screen w-1/2 bg-[#1A1613] overflow-hidden border-l border-[#1A161320] z-20">
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
              <div className="absolute inset-0 z-0">
                <GenerativeArt seed={activeProject.title} className="w-full h-full opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1613] via-transparent to-[#1A1613]/40" />
                <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
              </div>

              <div className="absolute bottom-0 left-0 w-full p-16 z-10 flex flex-col gap-6">
                <div className="flex items-center gap-4 text-[#C96442] font-mono text-sm tracking-widest uppercase">
                  <span>ID: {activeProject.slug.split('-')[0]}</span>
                  <span className="h-1 w-1 bg-current rounded-full" />
                  <span>{new Date(activeProject.date).getFullYear()}</span>
                </div>

                <p className="text-xl md:text-2xl text-[#F3ECE0] font-fraunces italic leading-relaxed max-w-2xl">
                  {activeProject.shortDescription}
                </p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {activeProject.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 bg-[#F3ECE0]/10 backdrop-blur-md border border-[#F3ECE0]/10 rounded-full text-xs font-mono text-[#F3ECE0] uppercase tracking-wider"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {(activeProject.redirect_url || activeProject.demo_link || activeProject.repo_link) && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mt-4"
                  >
                    <a
                      href={activeProject.redirect_url || activeProject.demo_link || activeProject.repo_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 text-[#F3ECE0] border-b border-[#F3ECE0] pb-1 hover:text-[#C96442] hover:border-[#C96442] transition-colors"
                    >
                      <span className="text-sm font-bold uppercase tracking-widest">
                        {activeProject.redirect_url || activeProject.demo_link ? 'Visit Live Site' : 'View Source'}
                      </span>
                      <ArrowLeftIcon className="rotate-135" weight="bold" />
                    </a>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!activeProject && (
          <div className="absolute inset-0 flex items-center justify-center text-[#2E2620]/40">
            <CpuIcon size={64} weight="thin" className="animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default TerracottaProjectsPage;
