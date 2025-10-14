import React from 'react';
import Label from './Label';

const ProjectMetadata = ({ project }) => {
  if (!project) {
    return null;
  }

  return (
    <aside className="sticky top-24">
      <div className="p-6 bg-gray-800/50 rounded-lg border border-gray-700/50">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 border-b pb-2 border-gray-500">About Project</h3>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <p className="text-gray-300">{project.title}</p>
          </div>
          {project.link && (
            <div>
              <Label>Link</Label>
              <p className="text-gray-300"><a href={project.link} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">View Project</a></p>
            </div>
          )}
          {project.pinned && (
            <div>
              <Label>Status</Label>
              <p className="text-gray-300">Pinned</p>
            </div>
          )}
          {project.technologies && project.technologies.length > 0 && (
            <div>
              <Label>Technologies</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="bg-primary-400/10 text-primary-400 text-xs font-medium px-2.5 py-1 rounded-full">
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