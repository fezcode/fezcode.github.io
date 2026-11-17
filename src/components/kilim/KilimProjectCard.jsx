import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KilimCover } from './KilimPieces';

/**
 * A project as a woven panel over an indigo card: its image (or a seeded
 * göl panel that re-weaves on hover), the name, the blurb, up to three tags.
 */
const KilimProjectCard = ({ project }) => {
  const [replay, setReplay] = useState(0);
  return (
    <Link
      to={`/projects/${project.slug}`}
      className="klm-card"
      onMouseEnter={() => setReplay((n) => n + 1)}
    >
      <KilimCover item={project} replay={replay} />
      <div className="klm-card-body">
        <h3 className="klm-card-title">
          {project.title} <span aria-hidden="true">↗</span>
        </h3>
        {project.shortDescription && <p className="klm-card-text">{project.shortDescription}</p>}
        {(project.technologies || []).length > 0 && (
          <div className="klm-tags">
            {(project.technologies || []).slice(0, 3).map((tech) => (
              <span key={tech} className="klm-tag">
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
};

export default KilimProjectCard;
