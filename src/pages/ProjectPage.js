import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useProjects } from '../utils/projectParser';
import { useProjectContent } from '../hooks/useProjectContent'; // Import the new hook
import ProjectMetadata from '../components/metadata-cards/ProjectMetadata';
import Seo from '../components/Seo';

import { ArrowLeftIcon } from '@phosphor-icons/react';

const ProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading: loadingProjects, error: errorProjects } = useProjects();
  const { content, loading: loadingContent, error: errorContent } = useProjectContent(slug);

  if (loadingProjects || loadingContent) {
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

  if (errorProjects || errorContent) {
    return (
      <div className="py-16 sm:py-24 text-center text-red-500">
        Error loading project: {errorProjects?.message || errorContent?.message}
      </div>
    );
  }

  const project = projects.find((p) => p.slug === slug);

  if (!project || !content) {
    return (
      <div className="py-16 sm:py-24 text-center text-white">
        Project not found
      </div>
    );
  }

  // Combine project metadata with fetched content
  const fullProject = { ...project, ...content };

  return (
    <div className="bg-gray-900 py-16 sm:py-24">
      <Seo
        title={`${fullProject.title} | Fezcodex`}
        description={fullProject.shortDescription}
        keywords={fullProject.tags ? fullProject.tags.join(', ') : ''}
        ogTitle={`${fullProject.title} | Fezcodex`}
        ogDescription={fullProject.shortDescription}
        ogImage={fullProject.image || 'https://fezcode.github.io/logo512.png'}
        twitterCard="summary_large_image"
        twitterTitle={`${fullProject.title} | Fezcodex`}
        twitterDescription={fullProject.shortDescription}
        twitterImage={fullProject.image || 'https://fezcode.github.io/logo512.png'}
      />
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <div className="lg:col-span-3">
            <Link
              to="/projects"
              className="text-primary-400 hover:underline flex items-center justify-center gap-2 text-lg mb-4"
            >
              <ArrowLeftIcon size={24} /> Back to Projects
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-markdown-hx-color sm:text-6xl">
              {fullProject.title}
            </h1>
            {fullProject.image && (
              <img
                src={fullProject.image}
                alt={fullProject.title}
                className="mt-8 w-full rounded-lg text-gray-200"
              />
            )}
            <div className="mt-6 text-lg leading-8 text-gray-300 prose prose-dark">
              <ReactMarkdown>{fullProject.fullContent}</ReactMarkdown>
            </div>
          </div>
          <div className="hidden lg:block">
            <ProjectMetadata project={fullProject} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
