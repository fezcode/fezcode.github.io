import React from 'react';
import { Link } from 'react-router-dom';

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
  isPlaying,
  audioEnabled,
  onPlay,
}) => (
  <article className="dm-entry">
    <header className="dm-entry-head">
      <h2 className="dm-entry-title">
        {entry.rank && <span className="dm-rank">{entry.rank}</span>}
        {entry.name}
      </h2>
      <p className="dm-entry-meta">
        {[entry.tag, entry.years, entry.origin].filter(Boolean).join('  //  ')}
      </p>
    </header>

    {entry.ascii && (
      <pre className="dm-ascii" aria-hidden="true">
        {entry.ascii}
      </pre>
    )}

    <dl className="dm-meta">
      <MetaRow label="SONIC SIGNATURE">
        {entry.signature && <q>{entry.signature}</q>}
      </MetaRow>
      <MetaRow label="KEY GEAR">{entry.keyGear}</MetaRow>
    </dl>

    <div className="dm-entry-actions">
      <button
        type="button"
        className="dm-audition is-wide"
        onClick={() => onPlay(entry)}
        disabled={!audioEnabled}
      >
        {!audioEnabled
          ? '[MUTED]'
          : isPlaying
            ? '[■ STOP SAMPLE]'
            : '[► PLAY SAMPLE]'}
      </button>
    </div>

    {entry.breakdown && (
      <section className="dm-breakdown">
        <h3 className="dm-section-title">RATIONALE & PRODUCTION</h3>
        <p>{entry.breakdown}</p>
      </section>
    )}

    {entry.examples.length > 0 && (
      <section className="dm-examples">
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

export default EntryDetail;
