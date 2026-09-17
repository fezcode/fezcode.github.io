import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import DemystifyShell from './DemystifyShell';
import EntryDetail from './EntryDetail';
import useDemystifyResource from './useDemystifyResource';
import { loadEntries, loadEntry } from './demystifyData';

const COLLECTION_ID = 'movie';
const BASE_PATH = '/demystify/movie';
const ALL = 'ALL';

/**
 * The fields are shared with the genre atlas but they carry different freight
 * here: `gear` is a camera rig rather than a synth rack, `sonic` is what the
 * technique does to a viewer, and `examples` are the films it can be seen in.
 */
const MOVIE_LABELS = {
  what: 'WHAT IT IS',
  artists: 'WHO REACHES FOR IT',
  trivia: 'TRIVIA',
  sonic: 'WHAT IT DOES TO YOU',
  gear: 'HOW IT IS DONE',
  prod: 'WHAT IT COSTS',
  examples: 'SEEN IN',
};

/** Turns `the-long-take` into `THE LONG TAKE` for titles shown before data arrives. */
const slugToLabel = (slug) => (slug || '').replace(/[-_]+/g, ' ').toUpperCase();

/** Lowercased blob of everything a row should be findable by. */
const haystack = (entry) =>
  [
    entry.name,
    entry.family,
    entry.sub,
    entry.years,
    ...entry.examples.flatMap((e) => [e.title, e.note]),
  ]
    .join(' ')
    .toLowerCase();

const MovieCollectionPage = () => {
  const { entryId } = useParams();

  const index = useDemystifyResource(COLLECTION_ID, () =>
    loadEntries(COLLECTION_ID),
  );
  const detail = useDemystifyResource(entryId, () =>
    loadEntry(COLLECTION_ID, entryId),
  );

  const entries = useMemo(() => index.data || [], [index.data]);
  const entry = detail.data;

  const [family, setFamily] = useState(ALL);
  const [query, setQuery] = useState('');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [entryId]);

  const families = useMemo(
    () => [...new Set(entries.map((e) => e.family).filter(Boolean))],
    [entries],
  );

  const searchable = useMemo(
    () => entries.map((e) => ({ entry: e, hay: haystack(e) })),
    [entries],
  );

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return searchable
      .filter(({ entry: e }) => family === ALL || e.family === family)
      .filter(({ hay }) => !needle || hay.includes(needle))
      .map(({ entry: e }) => e);
  }, [searchable, family, query]);

  const filmCount = useMemo(
    () => new Set(entries.flatMap((e) => e.examples.map((x) => x.title))).size,
    [entries],
  );

  // Every citation, alphabetical by film — the way in for someone who arrives
  // knowing a film rather than a technique.
  const allFilms = useMemo(
    () =>
      entries
        .flatMap((e) =>
          e.examples.map((x) => ({
            ...x,
            technique: e.name,
            id: e.id,
          })),
        )
        .sort((a, b) => a.title.localeCompare(b.title)),
    [entries],
  );

  const position = entries.findIndex((item) => item.id === entryId);
  const prev = position > 0 ? entries[position - 1] : null;
  const next =
    position >= 0 && position < entries.length - 1
      ? entries[position + 1]
      : null;

  const heading = entryId
    ? entry?.name || slugToLabel(entryId)
    : 'DEMYSTIFY / MOVIE';

  return (
    <DemystifyShell
      brand={entryId ? `MOVIE / ${heading}` : 'DEMYSTIFY / MOVIE'}
      tagline={entryId ? 'ONE TECHNIQUE' : 'THE GRAMMAR'}
      backTo={entryId ? BASE_PATH : '/demystify'}
      backLabel={entryId ? 'ALL TECHNIQUES' : 'ALL COLLECTIONS'}
      footerNote="MOVIE ARCHIVE"
    >
      <Seo
        title={
          entryId
            ? `${heading} — Demystify / Movie`
            : 'Demystify / Movie — The Grammar of Film'
        }
        description={
          entry?.sub ||
          entry?.what?.[0] ||
          'What the frame, the cut and the score are actually doing, and why it lands — one technique at a time, with the films that use it best.'
        }
        keywords={[
          'demystify movie',
          'film technique',
          'cinematography explained',
          'film editing',
          entry?.name || 'the long take',
          entry?.family || 'camera',
        ]}
      />

      {/* ---------------------------------------------------------------- */}
      {/* Detail view                                                       */}
      {/* ---------------------------------------------------------------- */}
      {entryId && detail.status === 'loading' && (
        <p className="dm-notice">LOADING {slugToLabel(entryId)}…</p>
      )}

      {entryId && detail.status === 'error' && (
        <div className="dm-notice dm-notice-error">
          <p>NO TECHNIQUE FILED UNDER “{slugToLabel(entryId)}”</p>
          <Link className="dm-uplink" to={BASE_PATH}>
            [← BACK TO ALL TECHNIQUES]
          </Link>
        </div>
      )}

      {entryId && detail.status === 'ready' && entry && (
        <EntryDetail
          entry={entry}
          basePath={BASE_PATH}
          prev={prev}
          next={next}
          labels={MOVIE_LABELS}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Index view                                                        */}
      {/* ---------------------------------------------------------------- */}
      {!entryId && index.status === 'loading' && (
        <p className="dm-notice">LOADING MOVIE INDEX…</p>
      )}

      {!entryId && index.status === 'error' && (
        <p className="dm-notice dm-notice-error">
          COULD NOT READ /demystify/movie/index.txt
        </p>
      )}

      {!entryId && index.status === 'ready' && (
        <>
          <p className="dm-intro">
            Not a list of good films — a list of the moves films make. Each
            entry is one technique taken apart: what it is, how it is pulled
            off, what it costs, and what it does to you while you are watching.
          </p>

          <p className="dm-stats">
            <span>
              <strong>{entries.length}</strong> TECHNIQUES
            </span>
            <span>
              <strong>{filmCount}</strong> FILMS CITED
            </span>
            <span>
              <strong>{families.length}</strong> DEPARTMENTS
            </span>
          </p>

          <div className="dm-filters">
            <input
              type="search"
              className="dm-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by technique, department or film…"
              aria-label="Filter techniques"
            />
            <div className="dm-chips">
              <button
                type="button"
                className="dm-chip"
                aria-pressed={family === ALL}
                onClick={() => setFamily(ALL)}
              >
                ALL
              </button>
              {families.map((name) => (
                <button
                  key={name}
                  type="button"
                  className="dm-chip"
                  aria-pressed={family === name}
                  onClick={() => setFamily(name)}
                >
                  {name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="dm-notice">
              NOTHING MATCHES THAT FILTER — TRY A DEPARTMENT OR FILM TITLE
            </p>
          ) : (
            <>
              <p className="dm-resultcount">
                {visible.length === entries.length
                  ? `SHOWING ALL ${entries.length} TECHNIQUES`
                  : `SHOWING ${visible.length} OF ${entries.length} TECHNIQUES`}
              </p>

              <ul className="dm-list">
                {visible.map((item) => (
                  <li className="dm-row" key={item.id}>
                    <Link
                      className="dm-row-link"
                      to={`${BASE_PATH}/${item.id}`}
                    >
                      <span className="dm-rank">{item.rank}</span>
                      <span className="dm-row-name">{item.name}</span>
                      <span className="dm-row-tag">{item.family}</span>
                      <span className="dm-row-years">{item.years}</span>
                      <span className="dm-row-count">
                        {item.examples.length || '—'}
                      </span>
                      <span className="dm-row-open" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}

          {allFilms.length > 0 && (
            <details className="dm-trackindex">
              <summary className="dm-summary">
                FULL FILM INDEX
                <span className="dm-summary-count">{filmCount} FILMS</span>
              </summary>
              <div className="dm-tablewrap">
                <table className="dm-table">
                  <thead>
                    <tr>
                      <th scope="col">FILM</th>
                      <th scope="col">THE MOMENT</th>
                      <th scope="col">TECHNIQUE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allFilms.map((film) => (
                      <tr key={`${film.id}-${film.title}`}>
                        <td>{film.title}</td>
                        <td className="dm-td-artist">{film.note}</td>
                        <td className="dm-td-genre">
                          <Link to={`${BASE_PATH}/${film.id}`}>
                            {film.technique}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </details>
          )}
        </>
      )}
    </DemystifyShell>
  );
};

export default MovieCollectionPage;
