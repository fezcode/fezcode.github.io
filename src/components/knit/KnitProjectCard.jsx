import React from 'react';
import { Link } from 'react-router-dom';
import KnitText from './KnitText';
import { KnitCover } from './KnitPieces';
import { COLOURWAYS, pickBySeed } from './patterns';
import { YARN } from './engine';

const SWATCHES = {
  [YARN.walnut]: 'walnut',
  [YARN.moss]: 'moss',
  [YARN.rust]: 'rust',
  [YARN.teal]: 'teal',
  [YARN.ink]: 'ink',
  [YARN.denim]: 'denim',
  [YARN.plum]: 'plum',
  [YARN.oat]: 'oat',
};

/** The knitted swatch class for a seed, matching its badge colourway. */
export const swatchFor = (seed) => {
  const way = pickBySeed(seed, COLOURWAYS);
  return { way, className: `knt-wool-${SWATCHES[way.bg] || 'walnut'}` };
};

const KnitProjectCard = ({ project }) => {
  const { way, className } = swatchFor(project.slug);
  return (
    <Link to={`/projects/${project.slug}`} className={`knt-card ${className}`}>
      <KnitCover item={project} />
      <KnitText as="h3" text={`${project.title} ↗`} fg={way.fg} maxLines={2} />
      {project.shortDescription && (
        <p className="knt-patch">{project.shortDescription}</p>
      )}
      {(project.technologies || []).length > 0 && (
        <KnitText
          text={(project.technologies || []).slice(0, 3).join(' · ')}
          size="small"
          fg={way.accent}
          maxLines={1}
        />
      )}
    </Link>
  );
};

export default KnitProjectCard;
