import React, { useState } from 'react';
import { appIcons } from '../../utils/appIcons';
import { ShapesIcon } from '@phosphor-icons/react';

const heights = [
  18, 23, 15, 30, 39, 28, 45, 50, 37, 29, 43, 53, 41, 26, 20, 33, 45, 32, 40,
  21, 26, 37, 18, 29, 39, 27, 16, 23,
];

const OrbitProjectCover = ({ item }) => {
  const [failedSource, setFailedSource] = useState(null);
  const hasImage = item.image && failedSource !== item.image;
  const monogram = (item.title || item.slug || 'Project')
    .split(/[\s.-]+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toLowerCase();
  return (
    <div
      className={`orb-cover orb-project-cover ${hasImage ? '' : 'orb-project-cover-fallback'}`}
      aria-hidden="true"
    >
      {hasImage ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailedSource(item.image)}
        />
      ) : (
        <span>{monogram}.</span>
      )}
    </div>
  );
};

const OrbitArt = ({ item, compact = false, project = false }) => {
  const slug = item.slug || '';
  const isAudio = /fezynth|timp|music|audio|bpm/.test(slug);
  const isPiml = /piml/.test(slug);
  const isMarble = /ebru|vitray/.test(slug);
  const isPattern = /morphogenesis|pattern|spirograph|chladni/.test(slug);
  const Icon =
    appIcons[item.icon] || appIcons[`${item.icon}Icon`] || ShapesIcon;
  if (project) return <OrbitProjectCover item={item} />;
  return (
    <div
      className={`orb-cover ${isPiml ? 'orb-cover-code' : isMarble ? 'orb-art-marble' : isPattern ? 'orb-art-pattern' : ''}`}
      aria-hidden="true"
    >
      {isPiml ? (
        compact ? (
          <span>(p)</span>
        ) : (
          <span>
            (codex)
            <br />
            &nbsp; (author) Samil
            <br />
            &nbsp; (status) curious
          </span>
        )
      ) : isAudio ? (
        <div className="orb-waveform">
          {heights.slice(0, compact ? 8 : heights.length).map((height, i) => (
            <span key={i} style={{ height: compact ? height / 2 : height }} />
          ))}
        </div>
      ) : isMarble || isPattern ? null : item.image ? (
        <img
          src={item.image}
          alt=""
          loading="lazy"
          onError={(event) => {
            event.currentTarget.style.display = 'none';
          }}
        />
      ) : (
        <Icon size={compact ? 23 : 44} weight="light" />
      )}
    </div>
  );
};

export default OrbitArt;
