import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { MarquetryCover } from './MarquetryPieces';

export default function MarquetryProjectCard({ project, decorative = false }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="mqt-card mqt-project-card"
    >
      <MarquetryCover item={project} decorative={decorative} />
      <div className="mqt-card-body">
        <div className="flex items-center justify-between gap-3">
          <h3>{project.title}</h3>
          <ArrowUpRightIcon size={20} aria-hidden="true" />
        </div>
        {project.shortDescription && <p>{project.shortDescription}</p>}
        {project.technologies?.length > 0 && (
          <span className="mqt-card-meta">
            {project.technologies.slice(0, 3).join(' · ')}
          </span>
        )}
      </div>
    </Link>
  );
}
