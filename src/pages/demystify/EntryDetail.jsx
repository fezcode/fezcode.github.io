import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import AuditionButton from './AuditionButton';
import RichText from './RichText';
import { renderSpectrum } from './spectrum';

const MetaRow = ({ label, children }) =>
  children ? (
    <div className="dm-meta-row">
      <dt className="dm-meta-label">{label}</dt>
      <dd className="dm-meta-value">{children}</dd>
    </div>
  ) : null;

/**
 * The full page for a single collection entry. `prev` / `next` come from the
 * collection index so a reader can walk the ranking without going back up.
 */
const EntryDetail = ({
  entry,
  basePath,
  prev,
  next,
  activeId,
  audioStatus,
  audioEnabled,
  onPlay,
}) => {
  const spectrum = useMemo(() => renderSpectrum(entry.spec), [entry.spec]);

  return (
    <article className="dm-entry">
      <header className="dm-entry-head">
        <div className="dm-entry-tags">
          {entry.family && <span className="dm-badge">{entry.family}</span>}
          {entry.years && <span className="dm-entry-years">{entry.years}</span>}
        </div>
        <h2 className="dm-entry-title">
          {entry.rank && <span className="dm-rank">{entry.rank}</span>}
          {entry.name}
        </h2>
        {entry.sub && <p className="dm-entry-sub">{entry.sub}</p>}
      </header>

      {/* No newline between the tag and the expression: a leading line break
          inside <pre> is stripped by the HTML parser on first paint but kept by
          React after hydration, which shifts the art by one row. */}
      {entry.ascii && (
        <pre className="dm-ascii" aria-hidden="true">{entry.ascii}</pre>
      )}

      {spectrum && (
        <figure className="dm-figure">
          <pre className="dm-ascii is-spectrum" aria-hidden="true">{spectrum}</pre>
          <figcaption className="dm-figcaption">
            Characteristic frequency-energy profile
          </figcaption>
        </figure>
      )}

      {(entry.signature || entry.keyGear || entry.origin) && (
        <dl className="dm-meta">
          <MetaRow label="ORIGIN">{entry.origin}</MetaRow>
          <MetaRow label="SONIC SIGNATURE">
            {entry.signature && <q>{entry.signature}</q>}
          </MetaRow>
          <MetaRow label="KEY GEAR">{entry.keyGear}</MetaRow>
        </dl>
      )}

      <RichText label="WHAT IT IS / WHEN" paragraphs={entry.what} />
      <RichText label="SIGNIFICANT ARTISTS" paragraphs={entry.artists} />
      <RichText label="TRIVIA" paragraphs={entry.trivia} />
      <RichText label="SONIC SIGNATURE" paragraphs={entry.sonic} />
      <RichText label="KEY GEAR" paragraphs={entry.gear} />
      <RichText label="RATIONALE & PRODUCTION" paragraphs={entry.prod} />

      {entry.tracks.length > 0 && (
        <section className="dm-prose">
          <h3 className="dm-section-title">TRACKS IN THIS GENRE</h3>
          <p className="dm-hint">
            Each control plays a ten-second excerpt of the track, taken from its
            catalogue preview clip.
          </p>
          <ul className="dm-tracklist">
            {entry.tracks.map((track) => {
              const id = `${entry.id}:${track.title}`;
              return (
                <li className="dm-track" key={id}>
                  <span className="dm-track-text">
                    <span className="dm-track-title">{track.title}</span>
                    {track.artist && (
                      <span className="dm-track-artist">{track.artist}</span>
                    )}
                  </span>
                  <AuditionButton
                    id={id}
                    activeId={activeId}
                    status={audioStatus}
                    enabled={audioEnabled}
                    label={`${track.title} by ${track.artist}`}
                    onPlay={() => onPlay({ id, track, entry })}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {entry.examples.length > 0 && (
        <section className="dm-prose">
          <h3 className="dm-section-title">BENCHMARK TRACKS</h3>
          <ul className="dm-example-list">
            {entry.examples.map((example) => (
              <li className="dm-example" key={example.title}>
                <span className="dm-example-title">{example.title}</span>
                {example.note && (
                  <span className="dm-example-note">{example.note}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(prev || next) && (
        <nav className="dm-pager" aria-label="Adjacent entries">
          {prev ? (
            <Link className="dm-pager-link" to={`${basePath}/${prev.id}`}>
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link className="dm-pager-link is-next" to={`${basePath}/${next.id}`}>
              {next.name} →
            </Link>
          )}
        </nav>
      )}
    </article>
  );
};

export default EntryDetail;
