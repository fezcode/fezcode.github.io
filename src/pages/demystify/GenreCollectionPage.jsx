import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Seo from '../../components/Seo';
import usePersistentState from '../../hooks/usePersistentState';
import DemystifyShell from './DemystifyShell';
import EntryDetail from './EntryDetail';
import useAudioSample from './useAudioSample';
import useDemystifyResource from './useDemystifyResource';
import { loadEntries, loadEntry } from './demystifyData';

const COLLECTION_ID = 'genre';
const BASE_PATH = '/demystify/genre';
const ALL = 'ALL';

/** Turns `drumbass` into `DRUMBASS` for titles shown before data arrives. */
const slugToLabel = (slug) => (slug || '').replace(/[-_]+/g, ' ').toUpperCase();

/** Lowercased blob of everything a row should be findable by. */
const haystack = (entry) =>
  [
    entry.name,
    entry.family,
    entry.sub,
    entry.years,
    ...entry.tracks.flatMap((t) => [t.title, t.artist]),
  ]
    .join(' ')
    .toLowerCase();

/** Earliest and latest four-digit years mentioned across the collection. */
const yearSpan = (entries) => {
  const years = entries
    .flatMap((entry) => entry.years.match(/\d{4}/g) || [])
    .map(Number);
  if (!years.length) return '';
  const from = Math.min(...years);
  const to = Math.max(...years);
  return from === to ? `${from}` : `${from}–${to}`;
};

const GenreCollectionPage = () => {
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
  const [audioEnabled, setAudioEnabled] = usePersistentState(
    'demystify-audio',
    true,
  );
  const { play, playingId } = useAudioSample({ enabled: audioEnabled });

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

  const allTracks = useMemo(
    () =>
      entries
        .flatMap((e) => e.tracks.map((t) => ({ ...t, genre: e.name, id: e.id })))
        .sort((a, b) =>
          a.pos.localeCompare(b.pos, undefined, { numeric: true }),
        ),
    [entries],
  );

  const position = entries.findIndex((item) => item.id === entryId);
  const prev = position > 0 ? entries[position - 1] : null;
  const next =
    position >= 0 && position < entries.length - 1
      ? entries[position + 1]
      : null;

  const audioToggle = (
    <button
      type="button"
      className="dm-toggle"
      onClick={() => setAudioEnabled((on) => !on)}
      aria-pressed={audioEnabled}
    >
      AUDIO [{audioEnabled ? 'ON' : 'OFF'}]
    </button>
  );

  const heading = entryId
    ? entry?.name || slugToLabel(entryId)
    : 'DEMYSTIFY / GENRE';

  return (
    <DemystifyShell
      brand={entryId ? `GENRE / ${heading}` : 'DEMYSTIFY / GENRE'}
      tagline={entryId ? 'OFFICIAL CURATION' : 'GENRE ATLAS'}
      backTo={entryId ? BASE_PATH : '/demystify'}
      backLabel={entryId ? 'ALL GENRES' : 'ALL COLLECTIONS'}
      footerNote="GENRE ARCHIVE"
      toolbar={audioToggle}
    >
      <Seo
        title={
          entryId
            ? `${heading} — Demystify / Genre`
            : 'Demystify / Genre — The Genre Atlas'
        }
        description={
          entry?.sub ||
          entry?.what?.[0] ||
          'Every genre worth understanding, taken apart: the dates, the people who built each one, the gear that gave it its sound, and why it was produced that way.'
        }
        keywords={[
          'demystify genre',
          'genre atlas',
          'music genres explained',
          entry?.name || 'anadolu rock',
          entry?.family || 'electronic',
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
          <p>NO ENTRY FILED UNDER “{slugToLabel(entryId)}”</p>
          <Link className="dm-uplink" to={BASE_PATH}>
            [← BACK TO ALL GENRES]
          </Link>
        </div>
      )}

      {entryId && detail.status === 'ready' && entry && (
        <EntryDetail
          entry={entry}
          basePath={BASE_PATH}
          prev={prev}
          next={next}
          isPlaying={playingId === entry.id}
          audioEnabled={audioEnabled}
          onPlay={play}
        />
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Index view                                                        */}
      {/* ---------------------------------------------------------------- */}
      {!entryId && index.status === 'loading' && (
        <p className="dm-notice">LOADING GENRE INDEX…</p>
      )}

      {!entryId && index.status === 'error' && (
        <p className="dm-notice dm-notice-error">
          COULD NOT READ /demystify/genre/index.txt
        </p>
      )}

      {!entryId && index.status === 'ready' && (
        <>
          <p className="dm-intro">
            Every track sorted into the tradition it actually comes from — with
            the dates, the people who built each one, the gear that gave it its
            sound, and why it was produced the way it was.
          </p>

          <p className="dm-stats">
            <span>
              <strong>{entries.length}</strong> GENRES
            </span>
            <span>
              <strong>{allTracks.length}</strong> TRACKS
            </span>
            <span>
              <strong>{families.length}</strong> FAMILIES
            </span>
            {yearSpan(entries) && (
              <span>
                <strong>{yearSpan(entries)}</strong> SPAN
              </span>
            )}
          </p>

          <div className="dm-filters">
            <input
              type="search"
              className="dm-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by genre, artist or track…"
              aria-label="Filter genres"
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
                  {name}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="dm-notice">
              NOTHING MATCHES THAT FILTER — TRY AN ARTIST OR TRACK NAME
            </p>
          ) : (
            <>
              <p className="dm-resultcount">
                {visible.length === entries.length
                  ? `SHOWING ALL ${entries.length} GENRES`
                  : `SHOWING ${visible.length} OF ${entries.length} GENRES`}
              </p>

              <ul className="dm-list">
                {visible.map((item) => (
                  <li className="dm-row" key={item.id}>
                    <Link className="dm-row-link" to={`${BASE_PATH}/${item.id}`}>
                      <span className="dm-rank">{item.rank}</span>
                      <span className="dm-row-name">{item.name}</span>
                      <span className="dm-row-tag">{item.family}</span>
                      <span className="dm-row-years">{item.years}</span>
                      <span className="dm-row-count">
                        {item.tracks.length || '—'}
                      </span>
                      <span className="dm-row-open" aria-hidden="true">
                        →
                      </span>
                    </Link>
                    <button
                      type="button"
                      className="dm-audition"
                      onClick={() => play(item)}
                      disabled={!audioEnabled}
                      aria-label={`Play a sample of ${item.name}`}
                    >
                      {!audioEnabled
                        ? '[MUTED]'
                        : playingId === item.id
                          ? '[■]'
                          : '[►]'}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          {allTracks.length > 0 && (
            <section className="dm-trackindex">
              <h3 className="dm-section-title">FULL TRACK INDEX</h3>
              <p className="dm-resultcount">
                P1 = first screenshot, P2 = second. Every position accounted
                for.
              </p>
              <div className="dm-tablewrap">
                <table className="dm-table">
                  <thead>
                    <tr>
                      <th scope="col">POS</th>
                      <th scope="col">TRACK</th>
                      <th scope="col">ARTIST</th>
                      <th scope="col">GENRE</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allTracks.map((track) => (
                      <tr key={`${track.pos}-${track.title}`}>
                        <td className="dm-td-pos">{track.pos}</td>
                        <td>{track.title}</td>
                        <td className="dm-td-artist">{track.artist}</td>
                        <td className="dm-td-genre">
                          <Link to={`${BASE_PATH}/${track.id}`}>
                            {track.genre}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </>
      )}
    </DemystifyShell>
  );
};

export default GenreCollectionPage;
