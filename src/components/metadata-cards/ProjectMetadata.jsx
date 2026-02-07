import React from 'react';
import Label from '../Label';
import { FaExternalLinkAlt } from 'react-icons/fa';

const ProjectMetadata = ({ project }) => {
  if (!project) {
    return null;
  }

  return (
    <aside>
      <div className="p-6 bg-gray-900/80 backdrop-blur-md rounded-xl border border-gray-800 shadow-lg relative overflow-hidden group">
        {/* Decor element */}
        <div className="absolute top-0 right-0 p-3 opacity-50">
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-cyan-500 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-600 rounded-full"></div>
          </div>
        </div>

        <h3 className="text-sm font-mono font-bold text-cyan-400 mb-6 border-b border-gray-800 pb-3 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-500 rounded-sm"></span>
          Project Data
        </h3>

        <div className="space-y-6">
          <div>
            <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
              Title
            </Label>
            <p className="text-gray-200 mt-1 font-medium">{project.title}</p>
          </div>

          {(project.demo_link || project.repo_link) && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                {project.demo_link ? 'Deployment' : 'Source'}
              </Label>
              <p className="text-gray-300 mt-1">
                <a
                  href={project.demo_link || project.repo_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 group-hover:translate-x-1 transition-transform duration-300"
                >
                  {project.demo_link ? 'View System' : 'View Code'}{' '}
                  <FaExternalLinkAlt size={12} />
                </a>
              </p>
            </div>
          )}

          {project.pinned && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Status
              </Label>
              <div className="mt-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <p className="text-green-400 font-mono text-sm">
                  PINNED / ACTIVE
                </p>
              </div>
            </div>
          )}

          {project.technologies && project.technologies.length > 0 && (
            <div>
              <Label className="text-gray-500 text-xs uppercase tracking-wider font-mono">
                Stack
              </Label>
              <div className="flex flex-wrap gap-2 mt-3">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="bg-gray-800 text-cyan-300 border border-cyan-900/50 text-xs font-mono px-2.5 py-1 rounded hover:bg-cyan-900/20 transition-colors cursor-default"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default ProjectMetadata;
