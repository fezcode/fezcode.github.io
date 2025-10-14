import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useProjects } from '../utils/projectParser';

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
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">{project.title}</h1>
        {project.image && <img src={project.image} alt={project.title} className="mt-8 w-full rounded-lg" />}
        {project.link && <p className="mt-4 text-lg leading-8 text-gray-300"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">View Project</a></p>}
        <div className="mt-6 text-lg leading-8 text-gray-300 prose prose-invert">
          <ReactMarkdown>{project.description}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;