import React from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useProjects } from '../utils/projectParser';
import ProjectMetadata from '../components/ProjectMetadata';

const ProjectPage = () => {
  const { slug } = useParams();
  const { projects, loading, error } = useProjects();

  if (loading) {
    return <div className="py-16 sm:py-24 text-center text-white">Loading project...</div>;
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
            <Link to="/projects" className="text-primary-400 hover:text-primary-500 transition-colors mb-8 block">
              &larr; Back to Projects
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{project.title}</h1>
            {project.image && <img src={project.image} alt={project.title} className="mt-8 w-full rounded-lg text-gray-200" />}
            <div className="mt-6 text-lg leading-8 text-gray-300 prose prose-invert">
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