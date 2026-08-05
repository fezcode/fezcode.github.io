import React, { useEffect, useMemo } from 'react';
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

/** Turns `drumbass` into `DRUMBASS` for titles shown before data arrives. */
const slugToLabel = (slug) => (slug || '').replace(/[-_]+/g, ' ').toUpperCase();

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

  const [audioEnabled, setAudioEnabled] = usePersistentState(
    'demystify-audio',
    true,
  );
  const { play, playingId } = useAudioSample({ enabled: audioEnabled });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [entryId]);

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
      tagline="OFFICIAL CURATION"
      backTo={entryId ? BASE_PATH : '/demystify'}
      backLabel={entryId ? 'ALL GENRES' : 'ALL COLLECTIONS'}
      footerNote="GENRE ARCHIVE"
      toolbar={audioToggle}
    >
      <Seo
        title={
          entryId
            ? `${heading} — Demystify / Genre`
            : 'Demystify / Genre — The World’s Best Music Genres'
        }
        description={
          entry?.breakdown ||
          'A curated, minimal breakdown of the music genres worth understanding: sonic signatures, the gear behind them, and the tracks that define them.'
        }
        keywords={[
          'demystify genre',
          'music genres explained',
          entry?.name || 'grunge',
          'synthwave',
          'trip hop',
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
        <ul className="dm-list">
          {entries.map((item) => (
            <li className="dm-row" key={item.id}>
              <Link className="dm-row-link" to={`${BASE_PATH}/${item.id}`}>
                <span className="dm-rank">{item.rank}</span>
                <span className="dm-row-name">{item.name}</span>
                <span className="dm-row-years">{item.years}</span>
                <span className="dm-row-tag">{item.tag}</span>
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
      )}
    </DemystifyShell>
  );
};

export default GenreCollectionPage;
