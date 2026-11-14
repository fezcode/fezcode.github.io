import React, { useEffect, useState } from 'react';
import './game-case-interior.css';

function PrintedArtwork({ entry, className }) {
  const primary = entry.cover || entry.fallbackCover || '';
  const [source, setSource] = useState(primary);

  useEffect(() => setSource(primary), [entry.id, primary]);

  if (!source) return null;
  return (
    <img
      className={className}
      src={source}
      alt=""
      aria-hidden="true"
      draggable="false"
      loading="eager"
      decoding="async"
      onError={() =>
        setSource((current) =>
          current !== entry.fallbackCover && entry.fallbackCover
            ? entry.fallbackCover
            : '',
        )
      }
    />
  );
}

const yearOf = (value) => String(value || '').match(/^\d{4}/)?.[0] || '';

export function GameTray({ entry }) {
  return (
    <div className="gc-tray" aria-hidden="true">
      <div className="gc-tray-print">
        <span>Game disc</span>
        <span>{entry.platform?.split(',')[0] || 'PC'}</span>
      </div>
      <span className="gc-tray-clip gc-tray-clip-top" />
      <div className="gc-disc-well">
        <div className="gc-disc">
          <PrintedArtwork entry={entry} className="gc-disc-art" />
          <div className="gc-disc-ink" />
          <strong className="gc-disc-title">{entry.title}</strong>
          <span className="gc-disc-hub" />
          <span className="gc-disc-imprint">Discovery edition</span>
        </div>
      </div>
      <span className="gc-tray-clip gc-tray-clip-bottom" />
      <div className="gc-tray-footer">
        <span>Fezcodex archive</span>
        <span>{yearOf(entry.date)}</span>
      </div>
    </div>
  );
}

export function GameLidInsert({ entry }) {
  return (
    <div className="gc-lid" aria-hidden="true">
      <PrintedArtwork entry={entry} className="gc-lid-art" />
      <div className="gc-lid-notes">
        <span className="gc-lid-caption">Field notes</span>
        <strong className="gc-lid-title">{entry.title}</strong>
        {entry.description && (
          <p className="gc-lid-description">{entry.description}</p>
        )}
        <div className="gc-lid-footer">
          <span>Fezcodex / Discovery</span>
          {entry.rating > 0 && <span>{entry.rating} / 5</span>}
        </div>
      </div>
    </div>
  );
}
