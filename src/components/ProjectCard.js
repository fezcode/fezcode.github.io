import React from 'react';
import { Link } from 'react-router-dom';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ProjectCard = ({ project, size = 1 }) => {
  const colSpanClass = size === 2 ? 'md:col-span-2' : size === 3 ? 'md:col-span-3' : 'col-span-1';

  return (
    <Link to={`/projects/${project.slug}`} className={`block bg-gray-800/10 p-6 rounded-lg shadow-lg hover:bg-gray-800/20 transition-colors border border-gray-700/50 cursor-pointer flex flex-col ${colSpanClass}`}>
      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
      <p className="mt-2 text-gray-400 flex-grow">{project.description}</p>
      <a href={project.link || `/projects/${project.slug}`} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-red-500 hover:text-red-300 transition-colors mt-auto flex items-center">
        View Project <FaExternalLinkAlt className="ml-1" size={12} />
      </a>
    </Link>
  );
};

export default ProjectCard;