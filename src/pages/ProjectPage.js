import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useProjects } from '../utils/projectParser';
import ProjectMetadata from '../components/ProjectMetadata';

import { ArrowLeftIcon } from '@phosphor-icons/react';

const ProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading, error } = useProjects();

  if (loading) {
    // Skeleton loading screen for ProjectPage
    return (
      <div className="bg-gray-900 py-16 sm:py-24 animate-pulse">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            <div className="lg:col-span-3">
              <div className="h-8 bg-gray-800 rounded w-1/4 mb-4"></div>
              <div className="h-12 bg-gray-800 rounded w-3/4 mb-8"></div>
              <div className="h-64 bg-gray-800 rounded w-full mb-8"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-800 rounded w-full"></div>
                <div className="h-6 bg-gray-800 rounded w-5/6"></div>
                <div className="h-6 bg-gray-800 rounded w-full"></div>
                <div className="h-6 bg-gray-800 rounded w-2/3"></div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-gray-800 rounded-lg shadow-lg p-6">
                <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-full"></div>
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="py-16 sm:py-24 text-center text-red-500">Error loading project: {error.message}</div>;
  }

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return <div className="py-16 sm:py-24 text-center text-white">Project not found</div>;
  }

  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <Link to="/" className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
              <ArrowLeftIcon size={24} /> Back to Home
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-markdown-hx-color sm:text-6xl">{project.title}</h1>
            {project.image && <img src={project.image} alt={project.title} className="mt-8 w-full rounded-lg text-gray-200" />}
            <div className="mt-6 text-lg leading-8 text-gray-300 prose prose-dark">
              <ReactMarkdown>{project.fullContent}</ReactMarkdown>
            </div>
          </div>
          <div className="hidden lg:block">
            <ProjectMetadata project={project} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;