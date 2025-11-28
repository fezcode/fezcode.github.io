import React from 'react';
import { Link } from 'react-router-dom';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../utils/projectParser';
import useSeo from '../hooks/useSeo';
import { ArrowLeftIcon } from '@phosphor-icons/react';

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
    ogImage: 'https://fezcode.github.io/logo512.png',
    twitterCard: 'summary_large_image',
    twitterTitle: 'Projects | Fezcodex',
    twitterDescription: 'A collection of my work and experiments.',
    twitterImage: 'https://fezcode.github.io/logo512.png',
  });
  const { projects, loading, error } = useProjects();

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
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <Link
            to="/"
            className="group text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
          >
            <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" />{' '}
            Back to Home
          </Link>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            My <span className="text-orange-300">Projects</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            A collection of my <span className="text-blue-400">work</span> and{' '}
            <span className="text-blue-400">experiments</span>.
          </p>
          <div className="mt-4 text-center">
            <span className="ml-2 px-3 py-1 text-base font-medium text-gray-200 bg-gray-800 rounded-full">
              Total: {projects.length}
            </span>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 grid-flow-row-dense">
          {projects.map((project) => (
            <ProjectCard
              key={project.slug}
              project={{ ...project, description: project.shortDescription }}
              size={project.size}
            />
          ))}{' '}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;
