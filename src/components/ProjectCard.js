import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, size = 1 }) => {
  const colSpanClass = size === 2 ? 'col-span-2' : 'col-span-1';

  return (
    <Link to={`/projects/${project.slug}`} className={`block bg-gray-800/50 p-6 rounded-lg shadow-lg hover:bg-gray-800/80 transition-colors border border-gray-700/50 cursor-pointer flex flex-col ${colSpanClass}`}>
      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-gray-400 flex-grow">{project.description}</p>
      <span className="mt-4 inline-block text-primary-400 hover:text-primary-500 transition-colors mt-auto">
        View Project &rarr;
      </span>
    </Link>
  );
};

export default ProjectCard;