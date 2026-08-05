import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Seo from '../../components/Seo';
import DemystifyShell from './DemystifyShell';
import useDemystifyResource from './useDemystifyResource';
import { isLive, loadCollections, loadEntries } from './demystifyData';

const CardBody = ({ collection, count }) => (
  <>
    <span className="dm-card-head">
      <span className="dm-rank">{collection.rank}</span>
      <span className="dm-card-name">{collection.name}</span>
      {count && <span className="dm-card-count">{count}</span>}
      <span className="dm-card-status">
        {isLive(collection) ? '→ OPEN' : collection.status}
      </span>
    </span>
    {collection.blurb && (
      <span className="dm-card-blurb">
        {collection.tag && <span className="dm-card-tag">{collection.tag}</span>}
        {collection.blurb}
      </span>
    )}
  </>
);

const DemystifyHubPage = () => {
  const { status, data } = useDemystifyResource('collections', loadCollections);
  const collections = useMemo(() => data || [], [data]);
  const [entryCounts, setEntryCounts] = useState({});

  // The declared `count:` in index.txt goes stale the moment an entry is added,
  // so live collections are counted from their own index instead.
  useEffect(() => {
    const live = collections.filter(isLive);
    if (!live.length) return undefined;

    let active = true;
    Promise.all(
      live.map((collection) =>
        loadEntries(collection.id)
          .then((entries) => [collection.id, entries.length])
          .catch(() => null),
      ),
    ).then((pairs) => {
      if (active) setEntryCounts(Object.fromEntries(pairs.filter(Boolean)));
    });

    return () => {
      active = false;
    };
  }, [collections]);

  const liveCount = collections.filter(isLive).length;

  const countLabel = (collection) => {
    const counted = entryCounts[collection.id];
    if (typeof counted === 'number') {
      return `${counted} ${counted === 1 ? 'ENTRY' : 'ENTRIES'}`;
    }
    return collection.count;
  };

  return (
    <DemystifyShell
      brand="DEMYSTIFY"
      tagline="THE ARCHIVE"
      backTo="/"
      backLabel="FEZCODE"
    >
      <Seo
        title="Demystify — The Archive"
        description="A minimalist archive that takes things apart: music genres, film and games, demystified one collection at a time."
        keywords={[
          'demystify',
          'minimalist archive',
          'music genres demystified',
          'film demystified',
          'games demystified',
        ]}
      />

      <p className="dm-intro">
        Things worth understanding, taken apart until they stop being magic.
        Each collection below is a <strong>curated index</strong> — ranked,
        annotated, and stripped down to what actually makes it work.
      </p>

      {status === 'ready' && collections.length > 0 && (
        <p className="dm-stats">
          <span>
            <strong>{String(collections.length).padStart(2, '0')}</strong>{' '}
            COLLECTIONS
          </span>
          <span>
            <strong>{String(liveCount).padStart(2, '0')}</strong> LIVE
          </span>
          <span>
            <strong>
              {String(collections.length - liveCount).padStart(2, '0')}
            </strong>{' '}
            PENDING
          </span>
        </p>
      )}

      {status === 'loading' && (
        <p className="dm-notice">LOADING COLLECTIONS…</p>
      )}

      {status === 'error' && (
        <p className="dm-notice dm-notice-error">
          COULD NOT READ /demystify/index.txt
        </p>
      )}

      {status === 'ready' && collections.length === 0 && (
        <p className="dm-notice">NO COLLECTIONS REGISTERED YET</p>
      )}

      {status === 'ready' && collections.length > 0 && (
        <ul className="dm-cards">
          {collections.map((collection) =>
            isLive(collection) ? (
              <li key={collection.id} className="dm-card">
                <Link className="dm-card-link" to={collection.route}>
                  <CardBody
                    collection={collection}
                    count={countLabel(collection)}
                  />
                </Link>
              </li>
            ) : (
              <li key={collection.id} className="dm-card is-pending">
                <div className="dm-card-link" aria-disabled="true">
                  <CardBody
                    collection={collection}
                    count={countLabel(collection)}
                  />
                </div>
              </li>
            ),
          )}
        </ul>
      )}
    </DemystifyShell>
  );
};

export default DemystifyHubPage;
