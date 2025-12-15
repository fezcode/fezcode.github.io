import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import useSeo from '../hooks/useSeo';
import { ArrowLeftIcon } from '@phosphor-icons/react';
import { useAchievements } from '../context/AchievementContext';

const ProjectsPage = () => {
  useSeo({
    title: 'Projects | Fezcodex',
    description: 'A collection of my work and experiments.',
    keywords: [
      'Fezcodex',
      'projects',
      'portfolio',
      'developer',
      'software engineer',
    ],
    ogTitle: 'Projects | Fezcodex',
    ogDescription: 'A collection of my work and experiments.',
    ogImage: '/images/ogtitle.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Projects | Fezcodex',
    twitterDescription: 'A collection of my work and experiments.',
    twitterImage: 'images/ogtitle.png',
  });
  const { projects, loading, error } = useProjects();
  const { unlockAchievement } = useAchievements();

  useEffect(() => {
    unlockAchievement('project_pioneer');
  }, [unlockAchievement]);

  if (loading) {
    // Skeleton loading screen for ProjectsPage
    return (
      <div className="py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="h-8 bg-gray-800 rounded w-1/4 mb-4 mx-auto"></div>
            <div className="h-12 bg-gray-800 rounded w-3/4 mb-4 mx-auto"></div>
            <div className="h-6 bg-gray-800 rounded w-1/2 mb-8 mx-auto"></div>
          </div>
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 sm:py-24 text-center text-red-500">
        Error loading projects: {error.message}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#020617] overflow-hidden">
      {/* Ambient Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-cyan-900/20 rounded-full blur-3xl -z-10 opacity-50" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-blue-900/10 rounded-full blur-3xl -z-10 opacity-30" />

      <div className="relative py-16 sm:py-24 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center mb-20">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-mono tracking-widest uppercase mb-8 border-b border-cyan-900/50 pb-1 hover:border-cyan-400"
          >
            <ArrowLeftIcon className="text-lg" />
            Return to Base
          </Link>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 font-mono">
            PROJECTS<span className="text-cyan-500">.LOG</span>
          </h1>

          <p className="mt-6 text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Initiating sequence... Loading{' '}
            <span className="text-cyan-400 font-mono">{projects.length}</span>{' '}
            distinct operational modules.
            <span className="block mt-2 text-gray-500 text-base">
              Explore the archives of experiments and deployed systems.
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 grid-flow-row-dense perspective-1000">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={{ ...project, description: project.shortDescription }}
              size={project.size}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
