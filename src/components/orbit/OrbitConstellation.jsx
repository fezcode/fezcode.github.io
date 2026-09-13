import React from 'react';
import { Link } from 'react-router-dom';

const nodes = [
  { name: 'Projects', to: '/projects', style: { top: 30, left: '12%' } },
  { name: 'Instruments', to: '/apps', style: { top: 85, right: 0 } },
  { name: 'Discoveries', to: '/logs', style: { top: 210, right: '5%' } },
  { name: 'Vocabulary', to: '/vocab', style: { top: 238, left: '5%' } },
  { name: 'Writing', to: '/blog', style: { top: 139, left: 0 } },
];

const OrbitConstellation = () => (
  <nav className="orb-orbits" aria-label="Explore the connected codex">
    <svg viewBox="0 0 400 330" preserveAspectRatio="none" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1">
        <ellipse
          cx="200"
          cy="153"
          rx="173"
          ry="104"
          transform="rotate(-25 200 153)"
        />
        <ellipse
          cx="200"
          cy="153"
          rx="122"
          ry="138"
          transform="rotate(15 200 153)"
        />
        <ellipse
          cx="200"
          cy="153"
          rx="191"
          ry="62"
          transform="rotate(27 200 153)"
        />
        <path d="M200 153L100 45M200 153L347 100M200 153L326 225M200 153L90 253M200 153L39 154" />
      </g>
    </svg>
    <Link
      to="/graph"
      className="orb-orbit-core"
      aria-label="Open the knowledge graph"
    >
      f.
    </Link>
    {nodes.map((node) => (
      <Link key={node.to} to={node.to} className="orb-node" style={node.style}>
        {node.name}
      </Link>
    ))}
    <Link
      to="/graph"
      className="orb-orbits-caption orb-label orb-link"
      style={{ justifyContent: 'center' }}
    >
      Follow a thread of curiosity ↗
    </Link>
  </nav>
);

export default OrbitConstellation;
